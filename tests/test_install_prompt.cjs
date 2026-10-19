'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const i18n = fs.readFileSync(path.join(__dirname, '../docs/assets/i18n.js'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, '../docs/assets/app.js'), 'utf8');

function simulate(language, restored = 'other', deferredCopy = false) {
  const file = language === 'en' ? '../docs/index.html' : `../docs/${language}/index.html`;
  const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const generic = html.match(/<p[^>]*id="install-prompt"[^>]*>([^<]+)<\/p>/)[1];
  const elements = new Map();
  for (const id of ['mode-rtl', 'mode-align', 'demo-text', 'demo-note', 'demo-code', 'copy-prompt', 'copy-status', 'install-prompt', 'agent-select']) {
    elements.set('#' + id, {textContent:'', value:'', handlers:{}, classList:{toggle() {}}, setAttribute() {}, addEventListener(event, handler) { this.handlers[event] = handler; }});
  }
  elements.get('#install-prompt').textContent = generic;
  elements.get('#agent-select').value = restored;
  let copied = null;
  let finishCopy;
  vm.runInNewContext(i18n + '\n' + script, {
    document:{documentElement:{lang:language}, querySelector(selector) { return elements.get(selector); }},
    navigator:{clipboard:{async writeText(text) {
      copied = text;
      if (deferredCopy) await new Promise(resolve => { finishCopy = resolve; });
    }}}
  });
  return {
    generic,
    prompt:() => elements.get('#install-prompt').textContent,
    status:() => elements.get('#copy-status').textContent,
    copied:() => copied,
    finishCopy:() => finishCopy(),
    mode(rtl) {
      elements.get(rtl ? '#mode-rtl' : '#mode-align').handlers.click();
      return {direction:elements.get('#demo-text').dir, note:elements.get('#demo-note').textContent, code:elements.get('#demo-code').textContent};
    },
    select(value) {
      elements.get('#agent-select').value = value;
      elements.get('#agent-select').handlers.change();
    },
    copy:() => elements.get('#copy-prompt').handlers.click()
  };
}

(async () => {
  for (const language of ['en', 'he', 'ar']) {
    const page = simulate(language);
    if (language === 'en') {
      for (const rtl of [false, true]) {
        const mode = page.mode(rtl);
        assert.equal(mode.direction, rtl ? 'rtl' : 'ltr');
        assert.ok(mode.code.includes('lang="ar"'));
        assert.doesNotMatch(mode.code + mode.note, /[\u0590-\u05ff]/);
      }
    }
    if (language === 'ar') {
      const aligned = page.mode(false);
      assert.equal(aligned.direction, 'ltr');
      assert.match(aligned.note, /[\u0600-\u06ff]/);
      const directed = page.mode(true);
      assert.equal(directed.direction, 'rtl');
      assert.match(directed.note, /[\u0600-\u06ff]/);
      assert.ok(directed.code.includes('lang="ar"'), 'Arabic UI uses an Arabic demonstration');
      assert.ok(directed.code.includes('<bdi dir="ltr">-12.50 mm</bdi>'));
    }
    assert.equal(page.prompt(), page.generic, 'generic prompt works without a host-specific invocation');
    assert.doesNotMatch(page.prompt(), /\$skill-installer|\$rtrtl|\.claude\/skills/);
    for (const [choice, required] of [
      ['codex', ['Codex', 'skill-installer', '$rtrtl']],
      ['claude', ['Claude Code', '~/.claude/skills/rtrtl', '/rtrtl']],
      ['antigravity', ['Antigravity', '.agents/skills/rtrtl']],
      ['other', ['skills directory supported by this coding agent']]
    ]) {
      page.select(choice);
      assert.equal(page.status(), '', 'changing agent clears stale copy confirmation');
      for (const text of required) assert.ok(page.prompt().includes(text), `${language}/${choice}: ${text}`);
      assert.ok(page.prompt().includes('Do not overwrite an existing installation or local edits.'));
      assert.ok(page.prompt().includes('all supporting files'));
      if (language === 'ar') assert.ok(page.prompt().includes('Arabic/English compatibility check'), 'Arabic prompts request a compatibility check');
      await page.copy();
      assert.equal(page.copied(), page.prompt(), 'copy follows the selected agent');
      assert.ok(page.status().length > 0);
    }
    page.select('toString');
    assert.equal(page.prompt(), page.generic, 'unknown option falls back safely');
    assert.ok(simulate(language, 'claude').prompt().includes('~/.claude/skills/rtrtl'), 'restored selections update on startup');
    const delayed = simulate(language, 'claude', true);
    const copying = delayed.copy();
    delayed.select('antigravity');
    delayed.finishCopy();
    await copying;
    assert.equal(delayed.status(), '', 'late clipboard completion must not confirm a different agent prompt');
  }
  console.log('Installation prompt: all four agents, copy, status reset and restored values passed in all three languages');
})().catch(error => { console.error(error); process.exitCode = 1; });

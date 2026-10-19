'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.join(__dirname, '../docs/assets/app.js'), 'utf8');

function simulate(language, restored = 'other') {
  const file = language === 'he' ? '../docs/he/index.html' : '../docs/index.html';
  const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const generic = html.match(/<p[^>]*id="install-prompt"[^>]*>([^<]+)<\/p>/)[1];
  const elements = new Map();
  for (const id of ['mode-rtl', 'mode-align', 'demo-text', 'demo-note', 'demo-code', 'copy-prompt', 'copy-status', 'install-prompt', 'agent-select']) {
    elements.set('#' + id, {textContent:'', value:'', handlers:{}, addEventListener(event, handler) { this.handlers[event] = handler; }});
  }
  elements.get('#install-prompt').textContent = generic;
  elements.get('#agent-select').value = restored;
  let copied = null;
  vm.runInNewContext(script, {
    document:{documentElement:{lang:language}, querySelector(selector) { return elements.get(selector); }},
    navigator:{clipboard:{async writeText(text) { copied = text; }}}
  });
  return {
    generic,
    prompt:() => elements.get('#install-prompt').textContent,
    status:() => elements.get('#copy-status').textContent,
    copied:() => copied,
    select(value) {
      elements.get('#agent-select').value = value;
      elements.get('#agent-select').handlers.change();
    },
    copy:() => elements.get('#copy-prompt').handlers.click()
  };
}

(async () => {
  for (const language of ['en', 'he']) {
    const page = simulate(language);
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
      await page.copy();
      assert.equal(page.copied(), page.prompt(), 'copy follows the selected agent');
      assert.ok(page.status().length > 0);
    }
    page.select('toString');
    assert.equal(page.prompt(), page.generic, 'unknown option falls back safely');
    assert.ok(simulate(language, 'claude').prompt().includes('~/.claude/skills/rtrtl'), 'restored selections update on startup');
  }
  console.log('Installation prompt: all four agents, copy, status reset and restored values passed in both languages');
})().catch(error => { console.error(error); process.exitCode = 1; });

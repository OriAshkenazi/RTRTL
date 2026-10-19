'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../docs/assets/language-picker.js'), 'utf8');
function simulate(blocked = false) {
  const doc = {handlers:{}, addEventListener(type, fn) { this.handlers[type] = fn; }};
  const element = () => ({handlers:{}, focus() { doc.activeElement = this; }, addEventListener(type, fn) { this.handlers[type] = fn; }});
  const trigger = element();
  const links = ['en', 'he', 'ar'].map(language => Object.assign(element(), {dataset:{language}}));
  const picker = Object.assign(element(), {open:false, querySelector:() => trigger, querySelectorAll:() => links, contains:el => [picker, trigger, ...links].includes(el)});
  doc.querySelector = () => picker;
  const saved = {};
  vm.runInNewContext(source, {document:doc, window:{localStorage:{setItem(key, value) { if (blocked) throw Error('blocked'); saved[key] = value; }}}});
  return {doc, trigger, links, picker, saved, key(key) { let prevented = false; picker.handlers.keydown({key, preventDefault() { prevented = true; }}); return prevented; }};
}
const page = simulate();
page.trigger.focus();
assert.ok(page.key('ArrowDown'));
assert.equal(page.picker.open, true);
assert.equal(page.doc.activeElement, page.links[0]);
page.key('End');
assert.equal(page.doc.activeElement, page.links[2]);
page.key('ArrowDown');
assert.equal(page.doc.activeElement, page.links[0]);
page.key('Escape');
assert.equal(page.picker.open, false);
assert.equal(page.doc.activeElement, page.trigger);
page.key('ArrowUp');
assert.equal(page.doc.activeElement, page.links[2]);
page.key('Escape');
page.key('ArrowDown');
page.doc.handlers.click({target:page.links[1]});
assert.equal(page.picker.open, true, 'clicking a language does not dismiss before navigation');
page.links[2].handlers.click();
assert.equal(page.saved['rtrtl-language'], 'ar');
page.doc.handlers.click({target:{}});
assert.equal(page.picker.open, false, 'outside click dismisses');
page.key('ArrowDown');
page.picker.handlers.focusout({relatedTarget:{}});
assert.equal(page.picker.open, false, 'tabbing outside dismisses');
assert.doesNotThrow(() => simulate(true).links[1].handlers.click());
const docs = path.join(__dirname, '../docs');
const htmlByLanguage = {
  en: fs.readFileSync(path.join(docs, 'index.html'), 'utf8'),
  he: fs.readFileSync(path.join(docs, 'he/index.html'), 'utf8'),
  ar: fs.readFileSync(path.join(docs, 'ar/index.html'), 'utf8')
};
const canonical = {en:'https://rtrtl.org/', he:'https://rtrtl.org/he/', ar:'https://rtrtl.org/ar/'};
const pickerHrefs = {
  en:{en:'./index.html?lang=en', he:'he/index.html?lang=he', ar:'ar/index.html?lang=ar'},
  he:{en:'../index.html?lang=en', he:'./index.html?lang=he', ar:'../ar/index.html?lang=ar'},
  ar:{en:'../index.html?lang=en', he:'../he/index.html?lang=he', ar:'./index.html?lang=ar'}
};
const pagePath = {en:'index.html', he:'he/index.html', ar:'ar/index.html'};
const pickerLabels = {en:'English', he:'עברית', ar:'العربية'};
for (const language of ['en', 'he', 'ar']) {
  const html = htmlByLanguage[language];
  assert.match(html, new RegExp(`<html lang="${language}" dir="${language === 'en' ? 'ltr' : 'rtl'}">`));
  const summary = html.match(/<summary>([\s\S]*?)<\/summary>/);
  assert.ok(summary, `${language}: picker summary exists`);
  assert.doesNotMatch(summary[1], /\baria-label\s*=/i, `${language}: visible picker label names the summary`);
  assert.match(summary[1], new RegExp(`<span lang="${language}" dir="${language === 'en' ? 'ltr' : 'rtl'}">${pickerLabels[language]}</span>`), `${language}: picker label matches page language`);
  assert.match(summary[1], /<svg\b[^>]*aria-hidden="true"/, `${language}: picker chevron stays hidden from assistive technology`);
  assert.ok(html.includes(`<meta property="og:url" content="${canonical[language]}">`), `${language}: canonical URL`);
  for (const target of ['en', 'he', 'ar']) {
    assert.ok(html.includes(`<link rel="alternate" hreflang="${target}" href="${canonical[target]}">`), `${language}: hreflang ${target}`);
    assert.ok(html.includes(`href="${pickerHrefs[language][target]}" data-language="${target}"`), `${language}: picker link to ${target}`);
    const anchor = html.match(new RegExp(`<a\\b(?=[^>]*\\bdata-language="${target}")[^>]*>`));
    assert.ok(anchor, `${language}: picker anchor exists for ${target}`);
    assert.equal(anchor[0].includes('aria-current="page"'), target === language, `${language}: current picker item`);
  }
  assert.match(html, /<option value="claude" selected>Claude Code<\/option>/, `${language}: Claude is the initial agent`);
  assert.match(html, /id="agent-name"[^>]*>Claude Code<\/span>/, `${language}: initial agent label`);
  const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)].map(match => match[1]);
  const assetPrefix = language === 'en' ? 'assets/' : '../assets/';
  const i18nIndex = scripts.findIndex(src => src.startsWith(assetPrefix + 'i18n.js'));
  const appIndex = scripts.findIndex(src => src.startsWith(assetPrefix + 'app.js'));
  assert.ok(i18nIndex >= 0 && appIndex > i18nIndex, `${language}: shared i18n.js loads before app.js`);
  assert.ok(!scripts.some(src => /app-ar\.js/.test(src)), `${language}: no legacy Arabic-only app script`);
  assert.ok(fs.existsSync(path.join(docs, pagePath[language])), `${language}: page target exists`);
}

const arabic = htmlByLanguage.ar;
assert.match(arabic, /class="arabic demo-text" lang="ar" dir="rtl"/);
assert.match(arabic, /خطة عمل باللغة العربية/);
assert.doesNotMatch(arabic, /תוכנית|הפרש|הבדיקה/);

const i18nSource = fs.readFileSync(path.join(docs, 'assets/i18n.js'), 'utf8');
const i18nContext = {};
vm.runInNewContext(`${i18nSource}\nthis.i18n = RTRTL_I18N;`, i18nContext);
const i18n = i18nContext.i18n;
assert.deepEqual(Object.keys(i18n.en).sort(), Object.keys(i18n.he).sort(), 'English/Hebrew i18n keys match');
assert.deepEqual(Object.keys(i18n.en).sort(), Object.keys(i18n.ar).sort(), 'English/Arabic i18n keys match');
function visibleText(html, id) {
  const match = html.match(new RegExp(`<p\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/p>`));
  assert.ok(match, `missing #${id}`);
  return match[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}
for (const language of ['en', 'he', 'ar']) {
  assert.equal(visibleText(htmlByLanguage[language], 'demo-note'), i18n[language].rtlNote, `${language}: initial demo note matches shared translation`);
}
console.log('Language picker and shared localization: all three editions, canonical links, Claude default, i18n parity, demo notes, keyboard and storage checks passed');

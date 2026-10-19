'use strict';
const rtlButton = document.querySelector('#mode-rtl');
const alignButton = document.querySelector('#mode-align');
const demo = document.querySelector('#demo-text');
const note = document.querySelector('#demo-note');
const code = document.querySelector('#demo-code');
const messages = RTRTL_I18N[document.documentElement.lang] || RTRTL_I18N.en;
function setMode(rtl) {
  demo.dir = rtl ? 'rtl' : 'ltr';
  demo.classList.toggle('alignment-only', !rtl);
  rtlButton.setAttribute('aria-pressed', String(rtl));
  alignButton.setAttribute('aria-pressed', String(!rtl));
  note.textContent = rtl ? messages.rtlNote : messages.alignmentNote;
  code.textContent = rtl
    ? `<p lang="${messages.demoLanguage}" dir="rtl">\n  ${messages.measurementLabel}<bdi dir="ltr">-12.50 mm</bdi>.\n</p>`
    : `<p lang="${messages.demoLanguage}" dir="ltr" style="text-align:right">\n  ${messages.measurementLabel}-12.50 mm.\n</p>`;
}
rtlButton.addEventListener('click', () => setMode(true));
alignButton.addEventListener('click', () => setMode(false));
const agentSelect = document.querySelector('#agent-select');
const installPrompt = document.querySelector('#install-prompt');
const genericInstallPrompt = installPrompt.textContent.trim();
const source = 'https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl';
const installChecks = 'Copy the complete rtrtl folder with all supporting files. Do not overwrite an existing installation or local edits. Verify that the skill is discoverable and tell me how to invoke it.';
const usage = skill => messages.usage.replace('{skill}', skill);
const installPrompts = {
  codex: `Install RTRTL from ${source} for Codex. Use skill-installer if available; otherwise use the configured Codex skills directory. ${installChecks} ${usage('$rtrtl')}`,
  claude: `Install RTRTL from ${source} for Claude Code in ~/.claude/skills/rtrtl for personal use. ${installChecks} ${usage('/rtrtl')}`,
  antigravity: `Install RTRTL from ${source} for Antigravity in this workspace's .agents/skills/rtrtl directory. ${installChecks} ${usage('RTRTL')}`,
  other: genericInstallPrompt
};
function updateInstallPrompt() {
  installPrompt.textContent = Object.hasOwn(installPrompts, agentSelect.value)
    ? installPrompts[agentSelect.value] : genericInstallPrompt;
  document.querySelector('#copy-status').textContent = '';
}
agentSelect.addEventListener('change', updateInstallPrompt);
// Account for browser-restored select values after a reload.
updateInstallPrompt();
// Keep the native value as the prompt state; expose a compact, keyboard-operable listbox.
const agentPicker = document.querySelector('#agent-picker');
if (agentPicker) {
  const trigger = document.querySelector('#agent-trigger');
  const menu = document.querySelector('#agent-options');
  const name = document.querySelector('#agent-name');
  const options = [...menu.querySelectorAll('[role="option"]')];
  function syncPicker() {
    const selected = options.find(option => option.dataset.agent === agentSelect.value) || options[0];
    name.textContent = selected.dataset.agent === 'other'
      ? messages.otherAgent : selected.querySelector('span').textContent;
    for (const option of options) option.setAttribute('aria-selected', String(option === selected));
  }
  function closePicker(returnFocus = false) {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }
  function openPicker() {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    (options.find(option => option.dataset.agent === agentSelect.value) || options[0]).focus();
  }
  trigger.addEventListener('click', () => menu.hidden ? openPicker() : closePicker());
  for (const option of options) option.addEventListener('click', () => {
    agentSelect.value = option.dataset.agent;
    updateInstallPrompt();
    syncPicker();
    closePicker(true);
  });
  agentSelect.addEventListener('change', syncPicker);
  agentPicker.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closePicker(true); return; }
    if (event.key === 'Tab') { closePicker(); return; }
    if (event.target === trigger && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); openPicker(); return;
    }
    if (menu.hidden) return;
    const index = options.indexOf(document.activeElement);
    let target = null;
    if (event.key === 'ArrowDown') target = (index + 1) % options.length;
    if (event.key === 'ArrowUp') target = (index - 1 + options.length) % options.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = options.length - 1;
    if (target !== null) { event.preventDefault(); options[target].focus(); }
    else if (event.key.length === 1 && /\S/.test(event.key)) {
      const ordered = [...options.slice(index + 1), ...options.slice(0, index + 1)];
      const match = ordered.find(option => option.textContent.trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
      if (match) { event.preventDefault(); match.focus(); }
    }
  });
  agentPicker.addEventListener('focusout', event => {
    if (!agentPicker.contains(event.relatedTarget)) closePicker();
  });
  document.addEventListener('click', event => {
    if (!agentPicker.contains(event.target)) closePicker();
  });
  syncPicker();
}
document.querySelector('#copy-prompt').addEventListener('click', async () => {
  const prompt = document.querySelector('#install-prompt');
  const status = document.querySelector('#copy-status');
  const promptAtClick = prompt.textContent.trim();
  try {
    await navigator.clipboard.writeText(promptAtClick);
    if (prompt.textContent.trim() !== promptAtClick) return;
    status.textContent = messages.copySuccess;
  } catch {
    if (prompt.textContent.trim() !== promptAtClick) return;
    // Keep the prompt available when browser clipboard permission is unavailable.
    const range = document.createRange();
    range.selectNodeContents(prompt);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = messages.copyFallback;
  }
});

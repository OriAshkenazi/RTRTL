'use strict';
const rtlButton = document.querySelector('#mode-rtl');
const alignButton = document.querySelector('#mode-align');
const demo = document.querySelector('#demo-text');
const note = document.querySelector('#demo-note');
const code = document.querySelector('#demo-code');
const hebrew = document.documentElement.lang === 'he';
function setMode(rtl) {
  demo.dir = rtl ? 'rtl' : 'ltr';
  demo.classList.toggle('alignment-only', !rtl);
  rtlButton.setAttribute('aria-pressed', String(rtl));
  alignButton.setAttribute('aria-pressed', String(!rtl));
  note.textContent = hebrew
    ? (rtl
      ? 'כיוון הבסיס מוגדר מימין לשמאל. ערכים באנגלית מבודדים בשלמותם. טקסט המקור נשמר בסדר לוגי.'
      : 'אותו טקסט לוגי, מיושר לימין אך עם כיוון בסיס משמאל לימין וללא בידוד. שימו לב לכותרת ולפיסוק.')
    : (rtl
      ? 'Explicit RTL base. Complete LTR values isolated. Source text stays in logical order.'
      : 'Same logical text, right-aligned with an LTR base and no isolation. Notice the heading and punctuation.');
  code.textContent = rtl
    ? '<p lang="he" dir="rtl">\n  הפרש המדידה: <bdi dir="ltr">-12.50 mm</bdi>.\n</p>'
    : '<p lang="he" dir="ltr" style="text-align:right">\n  הפרש המדידה: -12.50 mm.\n</p>';
}
rtlButton.addEventListener('click', () => setMode(true));
alignButton.addEventListener('click', () => setMode(false));
document.querySelector('#copy-prompt').addEventListener('click', async () => {
  const prompt = document.querySelector('#install-prompt');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(prompt.textContent.trim());
    status.textContent = hebrew ? 'הועתק. הדביקו בשיחה עם סוכן ה־AI שלכם.' : 'Copied. Paste into your AI agent’s chat.';
  } catch {
    // Keep the prompt available when browser clipboard permission is unavailable.
    const range = document.createRange();
    range.selectNodeContents(prompt);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = hebrew ? 'סמנו והעתיקו את ההנחיה המודגשת.' : 'Select and copy the highlighted prompt.';
  }
});

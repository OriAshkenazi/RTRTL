/* Local-only language default. No geolocation, network request or IP lookup. */
(() => {
  'use strict';
  const current = new URL(window.location.href);
  const explicit = current.searchParams.get('lang');
  const languages = ['en', 'he', 'ar'];
  const choice = languages.includes(explicit) ? explicit : null;
  function cleanAddress() {
    if (!['http:', 'https:'].includes(current.protocol)) return;
    const clean = new URL(current.href);
    clean.pathname = clean.pathname.replace(/\/index\.html$/, '/');
    clean.searchParams.delete('lang');
    if (clean.href !== current.href) window.history.replaceState(window.history.state, '', clean.href);
  }
  const key = 'rtrtl-language';
  let saved = null;
  try {
    if (choice) window.localStorage.setItem(key, choice);
    saved = window.localStorage.getItem(key);
  } catch { /* Explicit URL choices work even when storage is blocked. */ }

  // A direct link to a language edition stays usable regardless of the default.
  const pageLanguage = document.documentElement.lang;
  let preferred = choice;
  if (!preferred && (pageLanguage === 'he' || pageLanguage === 'ar')) { cleanAddress(); return; }
  if (!preferred && languages.includes(saved)) preferred = saved;
  if (!preferred) {
    let zone = '';
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* Hebrew fallback. */ }
    preferred = !zone || ['Asia/Jerusalem', 'Asia/Tel_Aviv', 'Israel'].includes(zone) ? 'he' : 'en';
  }
  if (preferred === pageLanguage) { cleanAddress(); return; }
  const base = new URL('../', document.currentScript.src);
  const target = new URL(preferred === 'en' ? './' : `${preferred}/`, base);
  if (target.protocol === 'file:') target.pathname += 'index.html';
  target.search = current.search;
  target.hash = current.hash;
  window.location.replace(target.href);
})();

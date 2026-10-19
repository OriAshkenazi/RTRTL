/* Local-only language default. No geolocation, network request or IP lookup. */
(() => {
  'use strict';
  const current = new URL(window.location.href);
  const explicit = current.searchParams.get('lang');
  const choice = explicit === 'he' || explicit === 'en' ? explicit : null;
  const key = 'rtrtl-language';
  let saved = null;
  try {
    if (choice) window.localStorage.setItem(key, choice);
    saved = window.localStorage.getItem(key);
  } catch { /* Explicit URL choices work even when storage is blocked. */ }

  // A direct link to a language edition stays usable regardless of the default.
  const pageLanguage = document.documentElement.lang;
  let preferred = choice;
  if (!preferred && pageLanguage === 'he') return;
  if (!preferred && (saved === 'he' || saved === 'en')) preferred = saved;
  if (!preferred) {
    let zone = '';
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* Hebrew fallback. */ }
    preferred = !zone || ['Asia/Jerusalem', 'Asia/Tel_Aviv', 'Israel'].includes(zone) ? 'he' : 'en';
  }
  if (preferred === pageLanguage) return;
  const base = new URL('../', document.currentScript.src);
  const target = new URL(preferred === 'he' ? 'he/' : './', base);
  target.search = current.search;
  target.hash = current.hash;
  window.location.replace(target.href);
})();

'use strict';
(() => {
  const picker = document.querySelector('#language-picker');
  if (!picker) return;
  const trigger = picker.querySelector('summary');
  const links = [...picker.querySelectorAll('a[data-language]')];
  function close(returnFocus = false) {
    picker.open = false;
    if (returnFocus) trigger.focus();
  }
  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
    const index = links.indexOf(document.activeElement);
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % links.length;
    if (event.key === 'ArrowUp') next = index < 0 ? links.length - 1 : (index - 1 + links.length) % links.length;
    if (event.key === 'Home' && index >= 0) next = 0;
    if (event.key === 'End' && index >= 0) next = links.length - 1;
    if (next !== undefined) { event.preventDefault(); picker.open = true; links[next].focus(); }
  });
  picker.addEventListener('focusout', event => {
    if (!picker.contains(event.relatedTarget)) close();
  });
  document.addEventListener('click', event => {
    if (!picker.contains(event.target)) close();
  });
  for (const link of links) {
    // Keep downloaded editions navigable without a web server.
    if (window.location.protocol === 'file:') link.href = new URL('index.html', link.href).href;
    link.addEventListener('click', () => {
      try { window.localStorage.setItem('rtrtl-language', link.dataset.language); }
      catch {
        // Carry the choice through navigation when storage is unavailable.
        // locale.js removes this fallback parameter once the edition loads.
        const target = new URL(link.href);
        target.searchParams.set('lang', link.dataset.language);
        link.href = target.href;
      }
    });
  }
})();

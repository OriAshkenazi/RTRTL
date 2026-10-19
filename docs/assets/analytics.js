/* Cookie-free Cloudflare Web Analytics, limited to the production hostname. */
(() => {
  'use strict';
  if (window.location.hostname !== 'rtrtl.org') return;
  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.dataset.cfBeacon = JSON.stringify({ token: '819f05713ba24af2814754bf09909ea9' });
  document.head.appendChild(beacon);
})();

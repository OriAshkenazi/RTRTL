'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// Stand-in for the static-assets binding: echoes the asset path it was asked for.
const ASSETS = {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    const type = pathname.endsWith('.md') ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8';
    return new Response(pathname, { status: pathname.includes('missing') ? 404 : 200, headers: { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' } });
  },
};

(async () => {
  const worker = await import(pathToFileURL(path.join(__dirname, '../src/worker.mjs')).href);
  const { prefersMarkdown } = worker;
  const get = (url, accept) => worker.default.fetch(new Request(url, { headers: accept ? { Accept: accept } : {} }), { ASSETS });

  assert.equal(prefersMarkdown('text/markdown'), true);
  assert.equal(prefersMarkdown('text/markdown, text/html;q=0.9'), true);
  assert.equal(prefersMarkdown('text/*'), true);
  assert.equal(prefersMarkdown('*/*'), false);
  assert.equal(prefersMarkdown(''), false);
  assert.equal(prefersMarkdown(null), false);
  assert.equal(prefersMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'), false);
  assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false);
  assert.equal(prefersMarkdown('text/markdown;q=0'), false);

  for (const [url, asset] of [['https://rtrtl.org/', '/index.md'], ['https://rtrtl.org/he', '/he/index.md'], ['https://rtrtl.org/ar/index.html', '/ar/index.md']]) {
    const response = await get(url, 'text/markdown');
    assert.equal(await response.text(), asset);
    assert.equal(response.headers.get('Content-Type'), 'text/markdown; charset=utf-8');
    assert.equal(response.headers.get('Content-Location'), asset);
    assert.equal(response.headers.get('Vary'), 'Accept');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  }

  const browser = await get('https://rtrtl.org/he/', 'text/html,*/*;q=0.8');
  assert.equal(await browser.text(), '/he/');
  assert.equal(browser.headers.get('Content-Type'), 'text/html; charset=utf-8');
  assert.equal(browser.headers.get('Vary'), 'Accept');

  // Paths outside the homepages pass through untouched, even when Markdown is requested.
  const other = await get('https://rtrtl.org/credits.html', 'text/markdown');
  assert.equal(await other.text(), '/credits.html');
  assert.equal(other.headers.get('Vary'), null);

  console.log('Worker negotiation tests: OK');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

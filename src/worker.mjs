// Serves the Markdown edition of a homepage when the client asks for text/markdown.
// wrangler.jsonc runs this Worker only for the homepage paths; every other request is a static asset.
const MARKDOWN = new Map([
  ['/', '/index.md'],
  ['/index.html', '/index.md'],
  ['/he', '/he/index.md'],
  ['/he/', '/he/index.md'],
  ['/he/index.html', '/he/index.md'],
  ['/ar', '/ar/index.md'],
  ['/ar/', '/ar/index.md'],
  ['/ar/index.html', '/ar/index.md'],
]);

// Markdown wins only when the client names it (or text/*) at least as strongly as HTML.
// Browsers send */* and text/html, so they keep getting HTML.
export function prefersMarkdown(accept) {
  let markdown = 0;
  let html = 0;
  for (const part of (accept || '').split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const quality = q ? Number(q.slice(2)) || 0 : 1;
    if (type === 'text/markdown' || type === 'text/*') markdown = Math.max(markdown, quality);
    if (type === 'text/html' || type === 'text/*' || type === '*/*') html = Math.max(html, quality);
  }
  return markdown > 0 && markdown >= html;
}

function withVary(response) {
  const headers = new Headers(response.headers);
  const vary = headers.get('Vary');
  if (!vary || !/(^|,)\s*accept\s*(,|$)/i.test(vary)) headers.set('Vary', vary ? `${vary}, Accept` : 'Accept');
  return { headers, status: response.status, statusText: response.statusText };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const markdown = MARKDOWN.get(url.pathname);
    if (!markdown || !prefersMarkdown(request.headers.get('Accept'))) {
      const response = await env.ASSETS.fetch(request);
      if (!markdown) return response;
      const init = withVary(response);
      return new Response(response.body, init);
    }
    const response = await env.ASSETS.fetch(new Request(new URL(markdown, url), request));
    const init = withVary(response);
    if (response.ok) {
      init.headers.set('Content-Type', 'text/markdown; charset=utf-8');
      init.headers.set('Content-Location', markdown);
    }
    return new Response(response.body, init);
  },
};

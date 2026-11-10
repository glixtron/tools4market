// Tools4Market — Worker routing assertions (no network, no deploy).
//
//   node tests/worker-routing.mjs
//
// `tests/live-verify.mjs` proves the deployed edge does the right thing; this
// file proves the logic in `worker.js` does, so a regression is caught before a
// deploy instead of after one. Host headers are set explicitly because Node's
// `Request` does not synthesise them from the URL the way the Workers runtime
// does.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import worker from '../worker.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CANON = 'https://tools4market.online';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  cond ? pass++ : fail++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  | ' + detail : ''}`);
};

const env = {
  ASSETS: { fetch: async () => new Response('<html>ok</html>', { headers: { 'content-type': 'text/html' } }) },
};
const ctx = {};

/** Fetch the Worker as if the request arrived with this scheme + host. */
async function route(rawUrl, { host, headers = {}, method = 'GET' } = {}) {
  const req = new Request(rawUrl, { method, headers: { host: host || new URL(rawUrl).host, ...headers } });
  const res = await worker.fetch(req, env, ctx);
  return { status: res.status, location: res.headers.get('location'), headers: res.headers };
}

console.log('=== http → https ===');
{
  const r = await route('http://tools4market.online/');
  ok('apex over http redirects 301', r.status === 301, 'status ' + r.status);
  ok('apex over http targets the https canonical', r.location === CANON + '/', r.location || '');
  ok('redirect is not cacheable', (r.headers.get('cache-control') || '').includes('no-store'));

  const deep = await route('http://tools4market.online/tools/robots-txt-generator/?utm_source=x');
  ok('path + query preserved', deep.location === CANON + '/tools/robots-txt-generator/?utm_source=x', deep.location || '');

  const www = await route('http://www.tools4market.online/blog/');
  ok('http://www → https://apex in one hop (no chain)', www.status === 301 && www.location === CANON + '/blog/', 'status ' + www.status + ' ' + (www.location || ''));

  const spoof = await route('http://tools4market.online/', { headers: { 'x-forwarded-proto': 'https' } });
  ok('spoofed X-Forwarded-Proto cannot skip the redirect', spoof.status === 301, 'status ' + spoof.status);
}

console.log('\n=== https: no redirect loops ===');
{
  const apex = await route('https://tools4market.online/');
  ok('https apex serves content', apex.status === 200 && !apex.location, 'status ' + apex.status);

  const www = await route('https://www.tools4market.online/tools/');
  ok('https www → apex 301', www.status === 301 && www.location === CANON + '/tools/', 'status ' + www.status + ' ' + (www.location || ''));

  const trailing = await route('https://tools4market.online/sitemap.xml');
  ok('https non-root path is untouched', trailing.status === 200 && !trailing.location, 'status ' + trailing.status);
}

console.log('\n=== trailing slashes are permanent ===');
{
  // Was a 307: Cloudflare's asset layer answers that way for a no-slash
  // directory URL, and nothing checked the status code. 307 reads as temporary,
  // so Google kept the no-slash URL canonical. These assert the Worker's answer,
  // before it is ever handed to a deploy.
  const page = await route('https://tools4market.online/tools/robots-txt-generator');
  ok('no-slash page → 301', page.status === 301, 'status ' + page.status);
  ok('…to the slashed path', page.location === '/tools/robots-txt-generator/', page.location || '');

  const q = await route('https://tools4market.online/blog/xml-sitemap-best-practices?utm_source=x');
  ok('query string survives the redirect', q.location === '/blog/xml-sitemap-best-practices/?utm_source=x', q.location || '');

  const file = await route('https://tools4market.online/assets/style.css');
  ok('file URLs are never slash-normalised', file.status === 200, 'status ' + file.status);

  // The extension cap was 8, so `.webmanifest` (11) read as a page path and the
  // manifest 301'd to /manifest.webmanifest/ — a 404 at a URL every browser
  // asks for.
  const manifest = await route('https://tools4market.online/manifest.webmanifest');
  ok('the 11-character .webmanifest is a file, not a page', manifest.status === 200, 'status ' + manifest.status);

  const slash = await route('https://tools4market.online/tools/robots-txt-generator/');
  ok('slashed URL is served, not redirected', slash.status === 200, 'status ' + slash.status);

  const api = await route('https://tools4market.online/api/fetch?url=x');
  ok('the API is not slash-normalised', api.status !== 301, 'status ' + api.status);

  const post = await route('https://tools4market.online/tools/x', { method: 'POST' });
  ok('a non-GET keeps its method (308, not 301)', post.status === 308, 'status ' + post.status);
}

console.log('\n=== local preview stays usable ===');
{
  for (const host of ['localhost:8787', '127.0.0.1:8787']) {
    const r = await route('http://' + host + '/');
    ok(`${host} over http is not forced to production`, r.status === 200 && !r.location, 'status ' + r.status + ' ' + (r.location || ''));
  }
}

console.log('\n=== HSTS on the static asset layer ===');
{
  const headers = readFileSync(ROOT + 'dist/_headers', 'utf8');
  const block = headers.split(/\n(?=\/)/).find((b) => b.startsWith('/*\n'));
  ok('dist/_headers: /* block carries HSTS', /Strict-Transport-Security:\s*max-age=\d{7,}/.test(headers));
  ok('dist/_headers: no includeSubDomains before subdomains are known', !/includeSubDomains/i.test(headers));
  ok('dist/_headers: security headers still on /*', block && /X-Content-Type-Options/.test(block) && /X-Frame-Options/.test(block));
}

console.log(`\nWORKER ROUTING: ${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);

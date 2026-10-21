// Tools4Market — live public-site verification (what Googlebot actually sees).
//
//   node tests/live-verify.mjs            → checks https://tools4market.online
//   node tests/live-verify.mjs --url https://example.com
//
// DNS is read from the authoritative nameservers (no resolver cache), pages are
// fetched over TLS through Cloudflare's edge, and every sitemap URL is fetched
// to confirm 200 + self-referencing canonical + indexable.
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const ORIGIN = (args[0] === '--url' ? args[1] : 'https://tools4market.online').replace(/\/+$/, '');
const HOST = ORIGIN.replace(/^https?:\/\//, '');
const NS = 'curt.ns.cloudflare.com';
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
let pass = 0, fail = 0;
const out = [];
const ok = (name, cond, detail = '') => {
  (cond ? pass++ : fail++);
  out.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  | ' + String(detail).slice(0, 160) : ''}`);
  return cond;
};
const dig = (name, type) => {
  try {
    return execFileSync('dig', ['+short', '@' + NS, name, type], { encoding: 'utf8', timeout: 8000 })
      .split('\n').map((s) => s.trim()).filter(Boolean);
  } catch { return []; }
};
async function grab(url, opts = {}) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, ...opts });
    return { status: r.status, headers: r.headers, url: r.url, body: await r.text() };
  } catch (e) { return { status: 0, headers: new Headers(), url, body: '', error: (e.cause && e.cause.code) || e.message }; }
}
const ct = (r) => (r.headers.get('content-type') || '').split(';')[0];

// ---- DNS
out.push('=== DNS (authoritative) ===');
ok('apex NS delegated to Cloudflare', dig(HOST, 'NS').some((n) => n.includes('ns.cloudflare.com')), dig(HOST, 'NS').join(' '));
ok('apex A records published', dig(HOST, 'A').length > 0, dig(HOST, 'A').join(' '));
ok('GSC verification TXT published', dig(HOST, 'TXT').some((t) => t.includes('google-site-verification')));
ok('MX records published (email)', dig(HOST, 'MX').length > 0, dig(HOST, 'MX').join(' '));
out.push('');

// ---- redirects
out.push('=== Redirects ===');
const www = await grab('https://www.' + HOST + '/');
ok('www redirects to the canonical host', www.status === 301 || www.status === 308, 'status ' + www.status + ' location ' + (www.headers.get('location') || www.error || ''));
const apex = await grab(ORIGIN + '/', { redirect: 'manual' });
ok('apex serves 200 without redirect', apex.status === 200, 'status ' + apex.status + ' ' + (apex.error || ''));
out.push('');

// ---- core files
out.push('=== Core files ===');
for (const [p, want, label] of [
  ['/robots.txt', 'text/plain', 'robots.txt'],
  ['/sitemap.xml', 'application/xml', 'sitemap index'],
  ['/manifest.webmanifest', 'application/manifest+json', 'manifest'],
  ['/BingSiteAuth.xml', 'application/xml', 'Bing verification file'],
  ['/404.html', 'text/html', '404 page'],
]) {
  const r = await grab(ORIGIN + p, { redirect: 'manual' });
  ok(`${label}: 200 + ${want}`, r.status === 200 && ct(r) === want, 'status ' + r.status + ' ct ' + ct(r) + ' ' + (r.error || ''));
}
const robots = (await grab(ORIGIN + '/robots.txt')).body;
ok('robots.txt allows crawling', /User-agent:\s*\*/.test(robots) && /Allow:\s*\/\s*$/m.test(robots));
ok('robots.txt points at our sitemap', robots.includes('Sitemap: ' + ORIGIN + '/sitemap.xml'));
out.push('');

// ---- sitemap integrity
out.push('=== Sitemap ===');
const idx = (await grab(ORIGIN + '/sitemap.xml')).body;
ok('sitemap.xml is a sitemapindex', idx.includes('<sitemapindex'));
const children = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok('index lists children', children.length > 0, children.join(' '));
let all = [];
for (const c of children) {
  const x = (await grab(c)).body;
  const locs = [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(`${c.split('/').pop()}: valid urlset (${locs.length} urls)`, x.includes('<urlset') && locs.length > 0);
  all = all.concat(locs);
}
ok('all URLs unique and on the canonical host', all.length > 0 && new Set(all).size === all.length && all.every((u) => u.startsWith(ORIGIN + '/')), all.length + ' urls');
out.push('');

// ---- every page
out.push('=== Every sitemap URL ===');
const bad = [];
for (const u of all) {
  const r = await grab(u, { redirect: 'manual' });
  const canon = (r.body.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const title = (r.body.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  const robots = (r.body.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || '';
  if (!(r.status === 200 && canon === u && title.length > 10 && !/noindex/i.test(robots))) {
    bad.push(u.replace(ORIGIN, '') + ' [status ' + r.status + ', canonical ' + canon + ']');
  }
}
ok(`all ${all.length} URLs: 200 + self-referencing canonical + indexable`, bad.length === 0, bad.length ? bad.slice(0, 4).join(' ;; ') : all.length + '/' + all.length);
out.push('');

// ---- backend
out.push('=== Backend /api/fetch ===');
const api = await grab(ORIGIN + '/api/fetch?url=' + encodeURIComponent('https://example.com'));
let aj = {}; try { aj = JSON.parse(api.body); } catch {}
ok('proxy returns ok + real HTML', api.status === 200 && aj.ok === true, 'status ' + api.status + ' bytes ' + (aj.bytes || 0));
const bad2 = await grab(ORIGIN + '/api/fetch?url=' + encodeURIComponent('http://127.0.0.1:8090'));
let bj = {}; try { bj = JSON.parse(bad2.body); } catch {}
ok('proxy blocks SSRF to loopback', bj.ok === false, (bad2.body || '').slice(0, 80));
out.push('');

// ---- site metadata
out.push('=== Metadata & assets ===');
const home = (await grab(ORIGIN + '/')).body;
ok('homepage og:image on the canonical host', home.includes('og:image" content="' + ORIGIN + '/assets/og-image.png'));
ok('homepage WebSite + Organization JSON-LD', home.includes('"@type":"WebSite"') && home.includes('"@type":"Organization"'));
ok('homepage Bing msvalidate meta', /name="msvalidate\.01"/.test(home));
ok('homepage has no noindex', !/content="noindex"/i.test(home));
for (const a of ['/assets/style.css', '/assets/og-image.png', '/assets/icon-192.png', '/assets/site.js', '/assets/runtime/inspect.js', '/assets/runtime/audit.js', '/assets/inspect-strings.js']) {
  const r = await grab(ORIGIN + a, { redirect: 'manual' });
  ok('asset ' + a, r.status === 200, 'status ' + r.status);
}

console.log(out.join('\n'));
console.log(`\nTOTAL: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

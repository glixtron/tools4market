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
const www = await grab('https://www.' + HOST + '/', { redirect: 'manual' });
ok('www redirects to the canonical host', www.status === 301 || www.status === 308, 'status ' + www.status + ' location ' + (www.headers.get('location') || www.error || ''));
const apex = await grab(ORIGIN + '/', { redirect: 'manual' });
ok('apex serves 200 without redirect', apex.status === 200, 'status ' + apex.status + ' ' + (apex.error || ''));
out.push('');

// ---- HTTPS enforcement (owner request, 25 Oct 2026)
// The apex used to answer 200 over plain http as well as https, so the site had
// two live origins for every page. These four checks are the regression guard.
out.push('=== HTTPS ===');
{
  const httpApex = await grab('http://' + HOST + '/', { redirect: 'manual' });
  const loc = httpApex.headers.get('location') || '';
  ok('plain http on the apex redirects', httpApex.status === 301 || httpApex.status === 308, 'status ' + httpApex.status + ' ' + (httpApex.error || ''));
  ok('http→https lands on the https canonical origin', loc === ORIGIN + '/', 'location ' + (loc || httpApex.error || ''));

  // Cloudflare's "Always Use HTTPS" normalises the scheme before the Worker runs,
  // so http://www costs two hops: http→https on www (edge), then www→apex
  // (Worker). The Worker still resolves www→apex in one hop when it sees the
  // request first (covered by tests/worker-routing.mjs); here the contract is
  // that the chain terminates on the https apex without a loop.
  const httpWww = await grab('http://www.' + HOST + '/', { redirect: 'manual' });
  const hop1 = httpWww.headers.get('location') || '';
  const finalWww = await grab('http://www.' + HOST + '/');
  ok('http://www upgrades and canonicalises without a loop', hop1.startsWith('https://') && finalWww.url === ORIGIN + '/', 'hop1 ' + (hop1 || httpWww.error || '') + ' final ' + finalWww.url);

  const httpDeep = await grab('http://' + HOST + '/tools/robots-txt-generator/?utm_source=test', { redirect: 'manual' });
  ok('http→https preserves path and query', httpDeep.headers.get('location') === ORIGIN + '/tools/robots-txt-generator/?utm_source=test', 'location ' + (httpDeep.headers.get('location') || httpDeep.error || ''));

  const hsts = apex.headers.get('strict-transport-security') || '';
  ok('HSTS advertised on https responses', /max-age=\d{7,}/.test(hsts), 'hsts ' + (hsts || '(none)'));
}
out.push('');

// ---- core files
out.push('=== Core files ===');
for (const [p, want, label] of [
  ['/robots.txt', 'text/plain', 'robots.txt'],
  ['/sitemap.xml', 'application/xml', 'sitemap index'],
  ['/manifest.webmanifest', 'application/manifest+json', 'manifest'],
  ['/BingSiteAuth.xml', 'application/xml', 'Bing verification file'],
]) {
  const r = await grab(ORIGIN + p, { redirect: 'manual' });
  ok(`${label}: 200 + ${want}`, r.status === 200 && ct(r) === want, 'status ' + r.status + ' ct ' + ct(r) + ' ' + (r.error || ''));
}
const robots = (await grab(ORIGIN + '/robots.txt')).body;
ok('robots.txt allows crawling', /User-agent:\s*\*/.test(robots) && /Allow:\s*\/\s*$/m.test(robots));
ok('robots.txt points at our sitemap', robots.includes('Sitemap: ' + ORIGIN + '/sitemap.xml'));
const missing = await grab(ORIGIN + '/seo-audit-missing-page-check/');
ok('unknown URL returns branded, noindex 404', missing.status === 404 && missing.body.includes('Page not found') && /<meta name="robots" content="noindex"/.test(missing.body), 'status ' + missing.status);
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
const badCrumbs = [];
for (const u of all) {
  const r = await grab(u, { redirect: 'manual' });
  const canon = (r.body.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const title = ((r.body.match(/<title>([^<]+)<\/title>/) || [])[1] || '').replace(/&amp;/g, '&');
  const desc = ((r.body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '').replace(/&amp;/g, '&');
  const robots = (r.body.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || '';
  const isHome = new URL(u).pathname === '/';
  if (!isHome && (!r.body.includes('class="breadcrumb"') || !r.body.includes('"@type":"BreadcrumbList"'))) badCrumbs.push(u.replace(ORIGIN, ''));
  if (!(r.status === 200 && canon === u && title.length > 10 && title.length <= 60 && desc.length > 0 && desc.length <= 158 && !/noindex/i.test(robots))) {
    bad.push(u.replace(ORIGIN, '') + ' [status ' + r.status + ', canonical ' + canon + ']');
  }
}
ok(`all ${all.length} URLs: 200 + self-referencing canonical + indexable`, bad.length === 0, bad.length ? bad.slice(0, 4).join(' ;; ') : all.length + '/' + all.length);
ok('all non-home sitemap pages have visible + JSON-LD breadcrumbs', badCrumbs.length === 0, badCrumbs.length ? badCrumbs.join(', ') : 'all breadcrumb trails present');
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

// ---- backend /api/suggest (AI fix suggestions; the client only calls it
// ---- after analytics consent — see consent-mode checks above)
out.push('=== Backend /api/suggest ===');
{
  const sg = await fetch(ORIGIN + '/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: 'meta-description-checker',
      kind: 'description',
      issue: 'No meta description on this page.',
      page: { url: 'https://example.com/', title: 'Example Domain', h1: 'Example Domain', description: '', text: 'Example gives small teams one place to plan projects and ship on time.' },
    }),
  });
  let sj = {}; try { sj = await sg.json(); } catch {}
  ok('suggest: real Workers AI draft returns (binding live)', sg.status === 200 && sj.ok === true && typeof sj.suggestion === 'string' && sj.suggestion.length > 40, String(sj.suggestion || sj.reason || 'status ' + sg.status).slice(0, 90));
  const gn = await fetch(ORIGIN + '/api/suggest');
  ok('suggest: GET rejected (405)', gn.status === 405, 'status ' + gn.status);
  const xo = await fetch(ORIGIN + '/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://evil.test' },
    body: '{}',
  });
  ok('suggest: cross-origin POST rejected (403)', xo.status === 403, 'status ' + xo.status);
}
out.push('');

// ---- AI-search surfaces (llms.txt / llms-full.txt / RSS feed)
{
  const llms = (await grab(ORIGIN + '/llms.txt')).body;
  ok('llms.txt served at the domain root', llms.startsWith('# '), llms.slice(0, 40));
  const toolsXml = (await grab(ORIGIN + '/sitemap-tools.xml')).body;
  const toolSlugs = [...toolsXml.matchAll(/<loc>[^<]*\/tools\/([a-z0-9-]+)\/<\/loc>/g)].map((m) => m[1]);
  ok('llms.txt lists every tool', toolSlugs.length > 0 && toolSlugs.every((t) => llms.includes('/tools/' + t + '/')), toolSlugs.filter((t) => !llms.includes('/tools/' + t + '/')).join(','));
  const guidesXml = (await grab(ORIGIN + '/sitemap-blog.xml')).body;
  const guideSlugs = [...guidesXml.matchAll(/<loc>[^<]*\/blog\/([a-z0-9-]+)\/<\/loc>/g)].map((m) => m[1]);
  ok('llms.txt lists every guide', guideSlugs.length > 0 && guideSlugs.every((g) => llms.includes('/blog/' + g + '/')), guideSlugs.filter((g) => !llms.includes('/blog/' + g + '/')).join(','));
  const llmsFull = (await grab(ORIGIN + '/llms-full.txt')).body;
  ok('llms-full.txt served with the full text', llmsFull.length > 20000, Math.round(llmsFull.length / 1024) + ' KB');
  const feed = (await grab(ORIGIN + '/feed.xml')).body;
  ok('RSS feed served with an item per guide', (feed.match(/<item>/g) || []).length >= guideSlugs.length, (feed.match(/<item>/g) || []).length + ' items');
}

// ---- site metadata
out.push('=== Metadata & assets ===');
const home = (await grab(ORIGIN + '/')).body;
ok('homepage og:image on the canonical host', home.includes('og:image" content="' + ORIGIN + '/assets/og-image.png'));
ok('homepage WebSite + Organization JSON-LD', home.includes('"@type":"WebSite"') && home.includes('"@type":"Organization"'));
ok('homepage has a visible FAQ section + FAQPage schema', /Frequently asked questions/.test(home) && /"@type":"FAQPage"/.test(home));
ok('homepage Bing msvalidate meta', /name="msvalidate\.01"/.test(home));
ok('homepage has no noindex', !/content="noindex"/i.test(home));
// GTM ships only when GTM_ID is set at build time; default builds carry no
// gtm.js (container held no GA4 measurement id — the direct Google tag is
// the single analytics tag). Re-enable by setting GTM_ID in .env.
ok('no GTM loader in head (off by default)', !/gtm\.js\?id=GTM-/.test(home));
ok('no GTM noscript iframe in body', !/ns\.html\?id=GTM-/.test(home));
ok('exactly one Google tag (gtag.js) on the page', (home.match(/gtag\/js\?id=G-6B4GGFC96K/g) || []).length === 1, String((home.match(/gtag\/js\?id=G-6B4GGFC96K/g) || []).length));
ok('gtag consent default is denied', /gtag\('consent',\s*'default'/.test(home) && /analytics_storage:\s*'denied'/.test(home));
ok('consent region scoping (EEA/UK/CH)', /var REGION = \[/.test(home) && /"GB"/.test(home) && /"DE"/.test(home) && /region = REGION/.test(home));
ok('consent wait_for_update + url_passthrough + ads_data_redaction', /wait_for_update/.test(home) && /url_passthrough/.test(home) && /ads_data_redaction/.test(home));
ok('consent defaults deny analytics/ads', /default_consent/.test(home) && /analytics_storage:\s*'denied'/.test(home) && /ad_storage:\s*'denied'/.test(home));
ok('cookie consent banner + preferences present', /id="ck-banner"/.test(home) && /id="ck-panel"/.test(home) && /id="ck-accept"/.test(home) && /id="ck-reject"/.test(home));
const toolPage = (await grab(ORIGIN + '/tools/case-converter/')).body;
ok('tool pages carry the consent UI', /id="ck-banner"/.test(toolPage) && !/gtm\.js\?id=GTM-/.test(toolPage));
const privacy = (await grab(ORIGIN + '/privacy-policy/')).body;
ok('privacy policy documents cookies/consent', /Cookie settings/.test(privacy) && /Consent Mode/i.test(privacy));
// AdSense policy (owner unblocked it 24 Oct 2026): the loader ships on every
// page — once, with the configured publisher id — and `data-ad-slot` is either
// absent (reserved space while the units don't exist yet) or a NUMERIC unit id.
// A value like "ca-pub-…:0/0" is not a slot id and would produce a malformed
// request, so it is explicitly rejected here.
{
  const loaders = (home.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=/g) || []).length;
  ok('AdSense loader present exactly once in <head>', loaders === 1);
  ok('AdSense loader carries the publisher id', home.includes('adsbygoogle.js?client=ca-pub-1509697031230558'));
  ok('AdSense loader is consent-aware (ads_data_redaction)', /ads_data_redaction/.test(home));
}
ok('ads.txt served with the publisher id', (await grab(ORIGIN + '/ads.txt')).body.includes('pub-1509697031230558'));
const toolHtml = (await grab(ORIGIN + '/tools/meta-tag-generator/')).body;
{
  const slots = [...toolHtml.matchAll(/data-ad-slot="([^"]*)"/g)].map((m) => m[1]);
  ok('ad slots reserve space (no CLS)', /class="ad-slot"/.test(toolHtml));
  ok('ad units use numeric slot ids only', slots.every((v) => /^\d{6,}$/.test(v)));
  ok('no empty data-ad-slot attributes', !/data-ad-slot=""/.test(toolHtml));
}
// ---- Google tag on EVERY live page (not a sample)
{
  const urls = new Set(all);
  const sitemapIndex = (await grab(ORIGIN + '/sitemap.xml')).body;
  for (const child of [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
    const x = (await grab(child)).body;
    for (const u of [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) urls.add(u);
  }
  const missing = [], doubled = [], wrongId = [], misordered = [];
  let checked = 0;
  for (const u of urls) {
    const r = await grab(u, { redirect: 'manual' });
    if (r.status !== 200) { missing.push(u.replace(ORIGIN, '') + ' [HTTP ' + r.status + ']'); continue; }
    checked++;
    const count = (r.body.match(/googletagmanager\.com\/gtag\/js\?id=/g) || []).length;
    if (count === 0) missing.push(u.replace(ORIGIN, ''));
    else if (count > 1) doubled.push(u.replace(ORIGIN, ''));
    else if (!/googletagmanager\.com\/gtag\/js\?id=G-6B4GGFC96K/.test(r.body)) wrongId.push(u.replace(ORIGIN, ''));
    else {
      const c = r.body.indexOf("gtag('consent', 'default'");
      const t = r.body.indexOf('googletagmanager.com/gtag/js');
      if (c === -1 || c > t) misordered.push(u.replace(ORIGIN, ''));
    }
  }
  ok(`every live page (${checked}) carries exactly one Google tag (G-6B4GGFC96K), consent first`,
    missing.length === 0 && doubled.length === 0 && wrongId.length === 0 && misordered.length === 0,
    [missing.length && 'missing: ' + missing.slice(0, 3).join(','), doubled.length && 'dup: ' + doubled.slice(0, 3).join(','), wrongId.length && 'wrongid: ' + wrongId.slice(0, 3).join(','), misordered.length && 'order: ' + misordered.slice(0, 3).join(',')].filter(Boolean).join(' | '));
}


// blog / guides
const blogIndex = (await grab(ORIGIN + '/blog/')).body;
const blogLinks = new Set([...blogIndex.matchAll(/href="([^"]+)"/g)].map((m) => { try { return new URL(m[1], ORIGIN + '/blog/').pathname; } catch (e) { return ''; } }));
ok('blog index reachable with article links', blogIndex.length > 0 && [...blogLinks].some((u) => /^\/blog\/[a-z0-9-]+\/$/.test(u)), [...blogLinks].join(' ').slice(0, 80));
const article = (await grab(ORIGIN + '/blog/robots-txt-for-search-and-ai-crawlers/')).body;
ok('article page has BlogPosting + FAQPage + Breadcrumb schema', /"@type":"BlogPosting"/.test(article) && /"@type":"FAQPage"/.test(article) && /"@type":"BreadcrumbList"/.test(article));
ok('article links into its matching tools', /\/tools\/robots-txt-generator\//.test(article) && /\/tools\/ai-crawler-blocker\//.test(article));
ok('sitemap index includes the blog child', (await grab(ORIGIN + '/sitemap.xml')).body.includes('sitemap-blog.xml'));
for (const a of ['/assets/style.css', '/assets/og-image.png', '/assets/icon-192.png', '/assets/site.js', '/assets/runtime/inspect.js', '/assets/runtime/audit.js', '/assets/inspect-strings.js']) {
  const r = await grab(ORIGIN + a, { redirect: 'manual' });
  ok('asset ' + a, r.status === 200, 'status ' + r.status);
}

console.log(out.join('\n'));
console.log(`\nTOTAL: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

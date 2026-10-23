// Regression coverage for personalized SEO and utility tools.
// Runs the built pages with deterministic page/robots/sitemap response fixtures.
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const PAGE_URL = 'https://example.test/seo-guide/';
const INDEXED_URL = 'https://indexed.test/seo-guide/';
const QUERY = 'technical SEO audit';
const PAGE_HTML = `<!doctype html><html lang="en"><head>
<title>Technical SEO Audit for SaaS Teams</title>
<meta name="description" content="Technical SEO audit guidance for SaaS teams, based on the page’s actual crawl and content signals.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${PAGE_URL}">
<link rel="alternate" hreflang="en" href="${PAGE_URL}">
<link rel="alternate" hreflang="fr-FR" href="https://example.test/fr/seo-guide/">
<link rel="alternate" hreflang="x-default" href="https://example.test/seo-guide/">
<meta property="og:title" content="Technical SEO Audit for SaaS Teams">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Technical SEO Audit for SaaS Teams","author":{"@type":"Person","name":"A. Writer"},"datePublished":"2026-10-01","publisher":{"@type":"Organization","name":"Example Test"}}</script>
</head><body>
<nav>technical SEO audit navigation probe</nav>
<main><article><h1>Technical SEO Audit for SaaS Teams</h1>
<p>A technical SEO audit checks crawl access, page metadata and internal discovery. This technical SEO audit guide explains which evidence to review before prioritizing fixes for a SaaS page.</p>
<a href="/seo-guide/related">Related audit guide</a><a href="https://user:pass@example.test/private">Credentialed page URL</a><img alt="Crawl report example"><img></article></main>
<footer>technical SEO audit footer probe</footer></body></html>`;
const ROBOTS = `User-agent: *\nDisallow: /private\nAllow: /private/public\nSitemap: https://example.test/sitemap.xml\n`;
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${PAGE_URL}</loc></url></urlset>`;
const INDEXED_ROBOTS = `User-agent: *\nSitemap: https://indexed.test/sitemap.xml\n`;
const INDEXED_MAP = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://indexed.test/sitemap-pages.xml</loc></sitemap><sitemap><loc>https://indexed.test/sitemap-tools.xml</loc></sitemap><sitemap><loc>https://indexed.test/sitemap-blog.xml</loc></sitemap></sitemapindex>`;
// A deliberately bare page: no title, no description, no viewport, no lang —
// used to exercise the gap analysis ("what to add") and the AI fix path.
const THIN_HTML = `<!doctype html><html><head></head><body><h1>Thin page heading</h1><p>Short copy for the page.</p></body></html>`;

class LocalLoader extends ResourceLoader {
  fetch(url) {
    const u = new URL(url);
    if (u.hostname !== 'localhost') return null;
    const rel = decodeURIComponent(u.pathname);
    const file = path.join(DIST, rel.endsWith('/') ? rel + 'index.html' : rel);
    try { return Promise.resolve(readFileSync(file)); } catch { return Promise.reject(new Error('404 ' + rel)); }
  }
}

let checks = 0;
function check(name, condition) {
  checks++;
  if (!condition) throw new Error('FAIL: ' + name);
  console.log('✓', name);
}
function setValue(win, id, value) {
  const input = win.document.getElementById(id);
  if (!input) throw new Error('Missing #' + id);
  input.value = value;
  input.dispatchEvent(new win.Event('input', { bubbles: true }));
  return input;
}
async function until(fn, label) {
  const start = Date.now();
  while (Date.now() - start < 4000) {
    if (fn()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error('Timed out waiting for ' + label);
}
function response(url) {
  const target = new URL(url);
  let body = PAGE_HTML;
  let contentType = 'text/html; charset=utf-8';
  let xRobotsTag = '';
  let status = 200;
  if (target.pathname === '/robots.txt') {
    body = target.hostname === 'common.test' ? 'User-agent: *\n' : target.hostname === 'indexed.test' ? INDEXED_ROBOTS : ROBOTS;
    contentType = 'text/plain; charset=utf-8';
  }
  else if (target.pathname === '/sitemap.xml') {
    body = target.hostname === 'common.test' ? SITEMAP.replace(PAGE_URL, 'https://common.test/page/') : target.hostname === 'indexed.test' ? INDEXED_MAP : SITEMAP;
    contentType = 'application/xml; charset=utf-8';
  }
  else if (target.hostname === 'indexed.test' && target.pathname === '/sitemap-pages.xml') body = SITEMAP.replace(PAGE_URL, INDEXED_URL);
  else if (target.hostname === 'indexed.test' && target.pathname === '/sitemap-tools.xml') body = SITEMAP.replace(PAGE_URL, 'https://indexed.test/tools/meta-tag-generator/');
  else if (target.hostname === 'indexed.test' && target.pathname === '/sitemap-blog.xml') body = SITEMAP.replace(PAGE_URL, 'https://indexed.test/blog/launch-guide/');
  else if (target.hostname === 'thin.test') body = THIN_HTML;
  else if (target.pathname === '/blocked/') xRobotsTag = 'noindex';
  return { ok: true, status, finalUrl: target.href, contentType, xRobotsTag, bytes: Buffer.byteLength(body), ms: 17, truncated: false, body };
}
async function boot(slug, opts = {}) {
  const rel = '/tools/' + slug + '/';
  const html = readFileSync(path.join(DIST, rel, 'index.html'), 'utf8');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(String((e && e.message) || e)));
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', resources: new LocalLoader(), url: 'http://localhost:8090' + rel,
    virtualConsole: vc, pretendToBeVisual: true,
    beforeParse(win) {
      win.HTMLCanvasElement.prototype.getContext = () => ({ font: '', measureText: (text) => ({ width: String(text).length * 8 }) });
      // Optional pre-granted analytics consent (drives the AI fix controls).
      if (opts.consent) win.localStorage.setItem('t4m_consent', JSON.stringify({ analytics: true, ads: false }));
      // Every /api/fetch target is logged so tests can count round trips;
      // /api/suggest answers with the scripted suggestion payload.
      win.__fetchLog = [];
      win.__lastSuggestBody = null;
      win.fetch = (input, init) => {
        const request = new URL(typeof input === 'string' ? input : input.url, win.location.href);
        if (request.pathname === '/api/suggest') {
          win.__lastSuggestBody = init && init.body ? JSON.parse(init.body) : null;
          const payload = typeof opts.suggest === 'function' ? opts.suggest(win.__lastSuggestBody) : (opts.suggest || { ok: false });
          return Promise.resolve({ json: () => Promise.resolve(payload) });
        }
        const target = request.searchParams.get('url');
        if (request.pathname !== '/api/fetch' || !target) return Promise.reject(new TypeError('Unexpected test fetch'));
        win.__fetchLog.push(target);
        return Promise.resolve({ json: () => Promise.resolve(response(target)) });
      };
    },
  });
  await new Promise((resolve) => { dom.window.addEventListener('load', resolve); setTimeout(resolve, 1500); });
  await new Promise((resolve) => setTimeout(resolve, 30));
  return { dom, win: dom.window, doc: dom.window.document, errors };
}

// The adjacent meta tag generator uses an honest user-input preview and avoids fixed Google limits.
{
  const { dom, win, doc, errors } = await boot('meta-tag-generator');
  const pageCopy = doc.querySelector('.tool-content').textContent;
  check('meta generator labels its preview as an estimate, not a Google result', pageCopy.includes('not a live Google result') && !pageCopy.includes('mimics a Google desktop search snippet'));
  check('meta generator avoids fixed snippet length targets', !pageCopy.includes('120–158 characters') && pageCopy.includes('There is no fixed title or description length'));
  setValue(win, 'mt-title', 'A page-specific title');
  check('meta generator preview reflects the entered title', doc.getElementById('mt-prev-title').textContent === 'A page-specific title');
  check('meta generator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Shared extractor and crawler-rule semantics.
{
  const { dom, win, errors } = await boot('web-crawler-audit');
  const parsed = win.T4M_INSPECT.parse(PAGE_HTML, PAGE_URL);
  check('main text excludes navigation/footer probes', !parsed.mainText.includes('navigation probe') && !parsed.mainText.includes('footer probe'));
  check('extractor counts the missing alt attribute but accepts a present alt', parsed.images.total === 2 && parsed.images.missingAlt === 1);
  check('target phrase counter counts contiguous exact wording', win.T4M_INSPECT.phraseCount(parsed.mainText, QUERY) === 3);
  check('page snapshot extracts same-origin content links for sitemap curation', parsed.mainLinks.length === 1 && parsed.mainLinks[0].url === 'https://example.test/seo-guide/related');
  check('page snapshot excludes credentialed URLs from personalized suggestions', parsed.mainLinks.every((link) => !link.url.includes('@')));
  check('page snapshot retains supported schema data for safe prefill', parsed.schemaNodes.some((node) => node['@type'] === 'Article' && node.headline === 'Technical SEO Audit for SaaS Teams'));
  check('robots parser applies the longest matching allow rule', win.T4M_INSPECT.parseRobotsTxt(ROBOTS, 'https://example.test/private/public/page', 'googlebot').allowed);
  check('robots parser reports a disallowed path', !win.T4M_INSPECT.parseRobotsTxt(ROBOTS, 'https://example.test/private/page', 'googlebot').allowed);
  check('shared extractor has no browser errors', errors.length === 0);
  dom.window.close();
}

// Page-specific generators start with real source values instead of fictional example output.
{
  const { dom, win, doc, errors } = await boot('hreflang-tag-generator');
  check('hreflang generator starts without example URLs', !doc.getElementById('hf-out').textContent.includes('example.com'));
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'hreflang page snapshot');
  check('hreflang rows import actual language URLs and x-default', doc.getElementById('hf-out').textContent.includes('hreflang="fr-fr"') && doc.getElementById('hf-out').textContent.includes('hreflang="x-default"'));
  check('hreflang output reflects fetched URLs instead of samples', doc.getElementById('hf-out').textContent.includes('https://example.test/fr/seo-guide/'));
  check('hreflang prefill has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Existing supported JSON-LD can be inspected and edited without inventing fields.
{
  const { dom, doc, errors } = await boot('schema-markup-generator');
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'schema page snapshot');
  check('schema generator selects the existing page type', doc.getElementById('sc-type').value === 'article');
  check('schema generator prefills source headline and author', doc.getElementById('sa-headline').value === 'Technical SEO Audit for SaaS Teams' && doc.getElementById('sa-author').value === 'A. Writer');
  check('schema output is grounded in the fetched JSON-LD', doc.getElementById('sc-out').textContent.includes('"datePublished": "2026-10-01"'));
  check('schema prefill has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Snippet preview gets page-specific source values and phrase placement.
{
  const { dom, win, doc, errors } = await boot('serp-preview-tool');
  setValue(win, 'sp-query', QUERY);
  setValue(win, 'sp-url', PAGE_URL);
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'SERP page snapshot');
  check('SERP title is prefilled from fetched page', doc.getElementById('sp-title').value === 'Technical SEO Audit for SaaS Teams');
  check('SERP description is prefilled from fetched page', doc.getElementById('sp-desc').value.startsWith('Technical SEO audit guidance'));
  check('SERP reports exact phrase placement in fetched areas', doc.getElementById('sp-fit').textContent.includes('4 of 4'));
  check('SERP has real URL and response context', doc.querySelector('.inspect-status').textContent.includes(PAGE_URL) && doc.querySelector('.inspect-status').textContent.includes('HTTP 200'));
  check('SERP has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Meta description checker uses the fetched page and gives a source-based draft.
{
  const { dom, win, doc, errors } = await boot('meta-description-checker');
  setValue(win, 'md-query', QUERY);
  setValue(win, 'md-text', '');
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'description page snapshot');
  check('meta description loads the fetched description', doc.getElementById('md-text').value.startsWith('Technical SEO audit guidance'));
  check('meta description compares the target against the page', doc.getElementById('md-fit').textContent.includes('4 of 4'));
  const draftButton = doc.querySelector('.inspect-personalized button');
  check('source-based description draft is available', !!draftButton);
  draftButton.click();
  check('draft contains this page heading and page copy', doc.getElementById('md-text').value.startsWith('Technical SEO Audit for SaaS Teams.') && doc.getElementById('md-text').value.includes('checks crawl access'));
  check('description checker has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Keyword tool fetches main text, excludes page chrome, and counts exact phrase occurrences.
{
  const { dom, win, doc, errors } = await boot('keyword-density-checker');
  setValue(win, 'kd-query', QUERY);
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'keyword page snapshot');
  const text = doc.getElementById('kd-text').value;
  check('keyword tool prefills extracted main copy', text.includes('crawl access') && !text.includes('navigation probe') && !text.includes('footer probe'));
  check('keyword report counts exact phrase occurrences', doc.getElementById('kd-target-report').textContent.includes('Exact phrase occurs 3 times'));
  check('keyword report gives page-area placement', doc.getElementById('kd-target-report').textContent.includes('title found; H1 found; description found; main text found'));
  check('keyword tool has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Crawler audit fetches the page, robots.txt and declared sitemap.
{
  const { dom, win, doc, errors } = await boot('web-crawler-audit');
  setValue(win, 'ca-url', PAGE_URL);
  doc.getElementById('ca-run').click();
  await until(() => doc.getElementById('ca-out').textContent.includes('Sitemap discovery'), 'crawler report');
  const report = doc.getElementById('ca-out').textContent;
  check('crawler report confirms the matching Googlebot rule', report.includes('Googlebot robots.txt rule') && report.includes('No matching Disallow rule'));
  check('crawler report confirms sitemap membership', report.includes('found in a fetched sitemap via robots.txt declaration'));
  check('crawler report shows fetched HTTP evidence and content type', doc.getElementById('ca-status').textContent.includes('HTTP 200') && doc.getElementById('ca-status').textContent.includes('text/html'));
  setValue(win, 'ca-url', 'https://example.test/blocked/');
  doc.getElementById('ca-run').click();
  await until(() => doc.getElementById('ca-out').textContent.includes('noindex directive'), 'noindex diagnosis');
  check('crawler identifies a response X-Robots-Tag noindex', doc.getElementById('ca-out').textContent.includes('noindex'));
  check('crawler tool has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// When robots.txt has no Sitemap line, the audit probes the common path and labels it as a fallback.
{
  const { dom, win, doc, errors } = await boot('web-crawler-audit');
  setValue(win, 'ca-url', 'https://common.test/page/');
  doc.getElementById('ca-run').click();
  await until(() => doc.getElementById('ca-out').textContent.includes('Sitemap discovery'), 'common sitemap fallback');
  check('crawler identifies sitemap found through common path fallback', doc.getElementById('ca-out').textContent.includes('found in a fetched sitemap via common /sitemap.xml path'));
  check('common sitemap fallback has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// SEO score is page-specific; the literal phrase placement remains context, not score weight.
{
  const { dom, win, doc, errors } = await boot('seo-score-checker');
  setValue(win, 'sc2-url', PAGE_URL);
  setValue(win, 'sc2-query', '');
  doc.getElementById('sc2-run').click();
  await until(() => !doc.getElementById('sc2-score').hidden, 'SEO score without phrase');
  const scoreWithoutQuery = doc.getElementById('sc2-ring-num').textContent;
  setValue(win, 'sc2-query', QUERY);
  doc.getElementById('sc2-run').click();
  await until(() => doc.getElementById('sc2-out').textContent.includes('Exact wording appears'), 'SEO phrase context');
  check('SEO score displays fetched title and H1 evidence', doc.getElementById('sc2-out').textContent.includes('Technical SEO Audit for SaaS Teams'));
  check('phrase placement is informational and excluded from score', doc.getElementById('sc2-ring-num').textContent === scoreWithoutQuery);
  check('SEO score explains its measured main-text length', doc.getElementById('sc2-out').textContent.includes('text-extraction check'));
  check('SEO score tool has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Sitemap, robots and llms tools use reachable site data and label its limits.
{
  const { dom, doc, errors } = await boot('robots-txt-generator');
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'robots page snapshot');
  check('robots generator uses the sitemap declared by the fetched robots.txt', doc.getElementById('rb-sitemap').value === 'https://example.test/sitemap.xml');
  check('robots generator warns that its output does not merge existing rules', doc.querySelector('.inspect-tip').textContent.includes('not a merge'));
  check('robots source fetch has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, doc, errors } = await boot('ai-crawler-blocker');
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'AI crawler page snapshot');
  check('AI crawler blocker pre-fills only the verified sitemap URL', doc.getElementById('ab-sitemap').value === 'https://example.test/sitemap.xml');
  check('AI crawler output includes the verified sitemap declaration', doc.getElementById('ab-out').textContent.includes('Sitemap: https://example.test/sitemap.xml'));
  check('AI crawler tool has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, doc, errors } = await boot('sitemap-generator');
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'sitemap page snapshot');
  check('sitemap generator imports URLs from the fetched sitemap', doc.getElementById('sm-urls').value === PAGE_URL);
  check('sitemap generator labels imported entries for human review', doc.querySelector('.inspect-tip').textContent.includes('Remove redirected, noindex, duplicate or error URLs'));
  check('sitemap generator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, doc, errors } = await boot('sitemap-generator');
  doc.querySelector('.inspect-url').value = INDEXED_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'sitemap index page snapshot');
  const urls = doc.getElementById('sm-urls').value.split('\n');
  check('sitemap generator follows the index plus all three child sitemaps', urls.length === 3 && urls.includes(INDEXED_URL) && urls.includes('https://indexed.test/tools/meta-tag-generator/') && urls.includes('https://indexed.test/blog/launch-guide/'));
  check('sitemap inventory reports every fetched sitemap file', doc.querySelector('.inspect-result').textContent.includes('3 URLs from a readable sitemap across 4 fetched file(s)'));
  check('sitemap index traversal stays free of JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, doc, errors } = await boot('llms-txt-generator');
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'llms page snapshot');
  check('llms.txt suggestions use actual link URLs and anchor text', doc.getElementById('ll-pages').value === 'https://example.test/seo-guide/related | Related audit guide');
  check('llms.txt explains that candidates require curation', doc.querySelector('.inspect-tip').textContent.includes('Curate the list'));
  check('llms.txt prefill has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Other page-aware tools prefill the data that makes their normal output useful.
for (const [slug, selector, expected] of [
  ['case-converter', '#cc-text', 'Technical SEO Audit for SaaS Teams'],
  ['duplicate-line-remover', '#dl-lines', 'Technical SEO Audit for SaaS Teams'],
  ['reading-time-calculator', '#rt-text', 'A technical SEO audit checks crawl access'],
  ['url-encoder-decoder', '#ue-text', PAGE_URL],
]) {
  const { dom, doc, errors } = await boot(slug);
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, slug + ' page snapshot');
  check(slug + ' pre-fills from fetched page data', doc.querySelector(selector).value.includes(expected));
  check(slug + ' prefill has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Standalone tools are strengthened without asking for an unrelated page URL.
{
  const { dom, doc, errors } = await boot('password-generator');
  const password = doc.getElementById('pw-out').value;
  check('password generator uses secure randomness and fills every selected set', password.length === 16 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()\-_=+\[\]{};:,.<>?/~]/.test(password));
  check('password entropy explains the configured string space', doc.getElementById('pw-strength').textContent.includes('uniformly sampled string containing every selected character set'));
  check('standalone password utility has no unrelated page-analysis panel', !doc.querySelector('.inspect'));
  check('password generator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, win, doc, errors } = await boot('jwt-decoder');
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const token = [encode({ alg: 'none', typ: 'JWT' }), encode({ iss: 'https://issuer.example', sub: 'user-7', aud: ['api', 'web'], iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600, nbf: Math.floor(Date.now() / 1000) + 3600 }), 'signature'].join('.');
  setValue(win, 'jwt-in', token);
  check('JWT decoder diagnoses issuer, subject and audiences', doc.getElementById('jwt-meta').textContent.includes('iss: https://issuer.example') && doc.getElementById('jwt-meta').textContent.includes('sub: user-7') && doc.getElementById('jwt-meta').textContent.includes('aud: api, web'));
  check('JWT decoder reports expiry and not-before against the device clock', doc.getElementById('jwt-meta').textContent.includes('exp is in the future') && doc.getElementById('jwt-meta').textContent.includes('nbf is in the future'));
  check('JWT decoder calls out alg=none and unverified signature', doc.getElementById('jwt-meta').textContent.includes('alg=none') && doc.getElementById('jwt-meta').textContent.includes('signature not verified'));
  check('JWT decoder has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, win, doc, errors } = await boot('user-agent-parser');
  check('user-agent parser immediately reads this browser', doc.getElementById('ua-text').value === win.navigator.userAgent && doc.getElementById('ua-out').textContent.includes('Browser:'));
  check('user-agent parser avoids the irrelevant page-analysis panel', !doc.querySelector('.inspect'));
  check('user-agent parser has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  // Image compressor is local-only (files never leave the browser) — its page
  // must not mount the URL-analysis panel (regression: it was missing from
  // SKIP_PANEL while its card said "Runs in your browser").
  const { dom, doc, errors } = await boot('image-compressor');
  check('image compressor avoids the page-analysis panel', !doc.querySelector('.inspect'));
  check('image compressor keeps its local file picker', !!doc.getElementById('ic-files'));
  check('image compressor has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, win, doc, errors } = await boot('ics-calendar-generator');
  setValue(win, 'ics-title', 'Overnight deploy');
  setValue(win, 'ics-sdate', '2026-10-22');
  setValue(win, 'ics-edate', '2026-10-23');
  setValue(win, 'ics-stime', '23:00');
  setValue(win, 'ics-etime', '01:00');
  setValue(win, 'ics-tz', 'utc');
  check('ICS generator emits RFC 5545 version 2.0 and UTC time values', doc.getElementById('ics-out').textContent.includes('VERSION:2.0') && doc.getElementById('ics-out').textContent.includes('DTSTART:20261022T230000Z') && doc.getElementById('ics-out').textContent.includes('DTEND:20261023T010000Z'));
  check('ICS generator identifies UTC interpretation in its result', doc.getElementById('ics-note').textContent.includes('Entered times are marked as UTC'));
  setValue(win, 'ics-edate', '2026-10-22');
  setValue(win, 'ics-etime', '22:00');
  check('ICS generator rejects a same-day event that ends before it starts', doc.getElementById('ics-out').textContent === '' && doc.getElementById('ics-note').textContent.includes('end time must be after'));
  check('ICS generator handles event fields without JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Two-mode input: analyze (fetch + auto-fill, default) vs enter manually —
// present on every fetch-capable tool, one click apart, nothing removed.
{
  const { dom, doc, errors } = await boot('meta-tag-generator');
  const modes = doc.querySelector('.inspect-modes');
  check('mode toggle offers analyze + manual entry', !!modes && modes.textContent.includes('Analyze my page') && modes.textContent.includes('Enter manually'));
  check('analyze mode is the default (panel body visible)', !doc.querySelector('.inspect-body').hidden && doc.querySelector('.mode-btn.is-on').textContent === 'Analyze my page');
  const manualBtn = [...doc.querySelectorAll('.mode-btn')].find((b) => b.textContent === 'Enter manually');
  manualBtn.click();
  check('manual mode hides the analysis body and marks the control', doc.querySelector('.inspect-body').hidden === true && manualBtn.getAttribute('aria-pressed') === 'true');
  doc.querySelectorAll('.mode-btn')[0].click();
  check('switching back re-shows the analysis panel', doc.querySelector('.inspect-body').hidden === false);
  check('mode toggle has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Deterministic gap analysis — "What to add to this page".
{
  const { dom, doc, errors } = await boot('meta-description-checker');
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'meta gaps (complete page)');
  const gaps = doc.querySelector('.gap-block');
  check('complete page shows the gap section with an all-clear', !!gaps && gaps.textContent.includes('What to add to this page') && gaps.textContent.includes('No missing elements found'));
  check('complete page yields no AI button (nothing fixable)', !doc.querySelector('.gap-ai'));
  check('gap section sits inside the analysis panel', !!doc.querySelector('.inspect-result .gap-block'));
  dom.window.close();
}
{
  const { dom, win, doc, errors } = await boot('meta-description-checker');
  doc.querySelector('.inspect-url').value = 'https://thin.test/page/';
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'meta gaps (thin page)');
  const items = [...doc.querySelectorAll('.gap-item')];
  check('missing description is flagged as the top gap', items.length > 0 && items[0].classList.contains('sig-fail') && items[0].textContent.includes('No meta description'));
  const gapText = doc.querySelector('.gap-block').textContent;
  check('page-level gaps (viewport, lang) are listed too', gapText.includes('viewport') && gapText.includes('lang attribute'));
  check('consent not given → AI fix is locked with a settings path', !doc.querySelector('.gap-ai') && !!doc.querySelector('.gap-ai-manage') && doc.querySelector('.gap-ai-note').textContent.includes('until you allow analytics processing'));
  // Granting consent re-renders the analysis in place — no refetch needed.
  win.T4M_CONSENT.update(true, false);
  check('granting consent re-renders the AI control without a refetch', !!doc.querySelector('.gap-ai') && doc.querySelector('.gap-ai').textContent.includes('Suggest a fix with AI'));
  check('thin page gap analysis has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// AI fix suggestion: consented visitor gets a draft that lands in the tool
// field, labelled for review, sent as a compact snapshot (never the full page).
{
  const { dom, win, doc, errors } = await boot('meta-description-checker', {
    consent: true,
    suggest: { ok: true, suggestion: 'A grounded replacement description for the thin page.' },
  });
  doc.querySelector('.inspect-url').value = 'https://thin.test/page/';
  doc.querySelector('.inspect-run').click();
  await until(() => !!doc.querySelector('#tool-root').__t4mPageMeta, 'AI suggestion page snapshot');
  const aiBtn = doc.querySelector('.gap-ai');
  check('consented visitors get the AI fix button directly', !!aiBtn && aiBtn.textContent.includes('Suggest a fix with AI'));
  aiBtn.click();
  await until(() => doc.getElementById('md-text').value.startsWith('A grounded replacement'), 'AI suggestion inserted');
  check('AI result is labelled a draft to review', doc.querySelector('.gap-ai-result').textContent.includes('review it before using') && doc.querySelector('.gap-ai-result').textContent.includes('not a ranking prediction'));
  const sent = win.__lastSuggestBody;
  check('request carries only the compact snapshot (no full page html)', !!sent && sent.tool === 'meta-description-checker' && sent.kind === 'description' && !!sent.page && !('html' in sent.page) && sent.page.text.length <= 700 && sent.issue.includes('No meta description'));
  check('AI suggestion flow has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// The crawler audit now shares the analyze panel: one fetch feeds both the
// signal readout and the full report; manual mode restores its native row.
{
  const { dom, win, doc, errors } = await boot('web-crawler-audit');
  check('crawler audit mounts the shared analyze panel', !!doc.querySelector('.inspect .inspect-url') && !!doc.querySelector('.inspect-modes'));
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => doc.getElementById('ca-out').textContent.includes('Sitemap discovery'), 'shared-panel crawler report');
  const pageFetches = win.__fetchLog.filter((u) => u === PAGE_URL).length;
  check('analysis fetches the page exactly once (report reuses the snapshot)', pageFetches === 1, pageFetches + ' fetches');
  check('shared-panel analysis prefills the native URL field', doc.getElementById('ca-url').value === PAGE_URL);
  check('native URL row is hidden while analyzing', doc.getElementById('ca-url').closest('.field').hidden === true);
  const manualBtn = [...doc.querySelectorAll('.mode-btn')].find((b) => b.textContent === 'Enter manually');
  manualBtn.click();
  check('manual mode exposes the native URL row again', doc.getElementById('ca-url').closest('.field').hidden === false && doc.querySelector('.inspect-body').hidden === true);
  check('shared-panel crawler flow has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// Growth-plan additions: JSON validator (local) and the dual-mode sitemap/robots checkers.
{
  const { dom, win, doc, errors } = await boot('json-validator');
  check('json validator skips the page-analysis panel (local-only tool)', !doc.querySelector('.inspect'));
  setValue(win, 'jv-in', '{"name":"t4m","list":[1,2],"ok":true,"none":null}');
  check('json validator accepts valid JSON and reports structure', doc.getElementById('jv-stats').textContent.includes('Valid JSON') && doc.getElementById('jv-out').textContent.includes('"name": "t4m"'));
  doc.querySelector('[data-jv="minify"]').click();
  check('json validator minifies without changing data', doc.getElementById('jv-out').textContent === '{"name":"t4m","list":[1,2],"ok":true,"none":null}');
  setValue(win, 'jv-in', '{"a": 1,}');
  check('json validator reports invalid JSON with a position', doc.getElementById('jv-stats').textContent.includes('Invalid JSON') && doc.getElementById('jv-out').textContent === '');
  check('json validator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, win, doc, errors } = await boot('sitemap-validator');
  check('sitemap validator mounts the analyze panel', !!doc.querySelector('.inspect .inspect-url'));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/a</loc><lastmod>2026-10-23</lastmod></url><url><loc>https://example.test/a</loc></url></urlset>';
  setValue(win, 'sv-xml', xml);
  check('sitemap validator counts entries and flags duplicates', doc.getElementById('sv-stats').textContent.includes('Valid urlset — 2 URL entries') && doc.getElementById('sv-out').textContent.includes('2 times'));
  setValue(win, 'sv-xml', 'not xml at all');
  check('sitemap validator reports malformed XML clearly', doc.getElementById('sv-stats').textContent.includes('Not well-formed XML'));
  setValue(win, 'sv-xml', '');
  doc.querySelector('.inspect-url').value = 'https://example.test/sitemap.xml';
  doc.querySelector('.inspect-run').click();
  await until(() => doc.getElementById('sv-stats').textContent.includes('Valid urlset'), 'sitemap prefill from analyze');
  check('analyze mode prefills the validator from the fetched sitemap', doc.getElementById('sv-xml').value.includes('<urlset') && win.__fetchLog.filter((u) => u === 'https://example.test/sitemap.xml').length === 1);
  check('sitemap validator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, win, doc, errors } = await boot('robots-txt-tester');
  setValue(win, 'rt-robots', ROBOTS);
  setValue(win, 'rt-path', '/private/page');
  check('robots tester blocks a disallowed path with the matched rule', doc.getElementById('rt-verdict').textContent.includes('BLOCKED for googlebot') && doc.getElementById('rt-verdict').textContent.includes('Disallow: /private'));
  setValue(win, 'rt-path', '/private/public/page');
  check('robots tester applies the longest matching allow rule', doc.getElementById('rt-verdict').textContent.includes('ALLOWED for googlebot'));
  check('robots tester reports declared sitemaps and AI crawler coverage', doc.getElementById('rt-details').textContent.includes('Sitemap declarations (1)') && doc.getElementById('rt-details').textContent.includes('GPTBot'));
  doc.querySelector('.inspect-url').value = 'https://example.test/robots.txt';
  doc.querySelector('.inspect-run').click();
  await until(() => doc.getElementById('rt-robots').value.includes('User-agent: *'), 'robots prefill from analyze');
  setValue(win, 'rt-path', '/private/page');
  check('analyze mode prefills the tester from the fetched robots.txt (single fetch)', doc.getElementById('rt-verdict').textContent.includes('BLOCKED') && win.__fetchLog.filter((u) => u === 'https://example.test/robots.txt').length === 1);
  check('robots tester has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// v2.5 additions: OG image tester and hreflang checker.
{
  const { dom, win, doc, errors } = await boot('og-image-tester');
  check('og image tester mounts the analyze panel', !!doc.querySelector('.inspect .inspect-url'));
  check('og image tester starts with an instruction', doc.getElementById('ogit-stats').textContent.includes('Enter an image URL'));
  setValue(win, 'ogit-url', 'https://example.test/card.png');
  check('og image tester begins loading the image URL', doc.getElementById('ogit-stats').textContent.includes('Loading the image from https://example.test/card.png'));
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => !doc.querySelector('.inspect-result').hidden, 'og analysis done');
  check('og analysis without an og:image leaves the manual URL intact', doc.getElementById('ogit-url').value === 'https://example.test/card.png');
  check('og image tester has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, win, doc, errors } = await boot('hreflang-checker');
  setValue(win, 'hlc-src', '<link rel="alternate" hreflang="EN-us" href="https://example.test/a">\n<link rel="alternate" hreflang="fr-FR" href="https://example.test/fr/a/">\n<link rel="alternate" hreflang="fr-FR" href="https://example.test/fr/a2/">');
  check('hreflang checker counts annotations and reports code + duplicate issues', doc.getElementById('hlc-stats').textContent.includes('3 hreflang annotation(s) found') && doc.getElementById('hlc-list').textContent.includes('not a valid hreflang code') && doc.getElementById('hlc-list').textContent.includes('declared 2 times'));
  setValue(win, 'hlc-self', 'https://example.test/missing');
  check('hreflang checker flags a missing self-reference', doc.getElementById('hlc-stats').textContent.includes('No self-reference'));
  setValue(win, 'hlc-self', 'https://example.test/fr/a/');
  check('hreflang checker confirms a present self-reference (trailing slash tolerated)', doc.getElementById('hlc-stats').textContent.includes('Self-reference present'));
  doc.querySelector('.inspect-url').value = PAGE_URL;
  doc.querySelector('.inspect-run').click();
  await until(() => doc.getElementById('hlc-src').value.includes('hreflang'), 'hreflang prefill from analyze');
  check('analyze mode prefills the checker from the page source with self-reference', doc.getElementById('hlc-src').value.includes('<link rel="alternate"') && doc.getElementById('hlc-stats').textContent.includes('3 hreflang annotation(s) found') && doc.getElementById('hlc-stats').textContent.includes('Self-reference present'));
  check('hreflang checker has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

// v2.6 additions: marketing calculators (ROI, ROAS, CAC, ad metrics).
{
  const { dom, doc, errors } = await boot('roi-calculator');
  check('roi calculator skips the analyze panel (local-only)', !doc.querySelector('.inspect'));
  check('roi calculator starts with an instruction', doc.getElementById('roic-verdict').textContent.includes('Enter the revenue'));
  setValue(dom.window, 'roic-rev', '1000');
  setValue(dom.window, 'roic-inv', '400');
  check('roi calculator computes profit, ROI % and multiple', doc.getElementById('roic-out').textContent.includes('Net profit: $600') && doc.getElementById('roic-out').textContent.includes('ROI: 150% (2.5×') && doc.getElementById('roic-verdict').textContent.includes('exceptional'));
  setValue(dom.window, 'roic-rev', '200');
  check('roi calculator reports losses honestly', doc.getElementById('roic-out').textContent.includes('(a loss)') && doc.getElementById('roic-verdict').textContent.includes('negative ROI'));
  check('roi calculator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, doc, errors } = await boot('roas-calculator');
  setValue(dom.window, 'roasc-spend', '500');
  setValue(dom.window, 'roasc-rev', '2000');
  check('roas calculator reports the ratio and revenue per unit', doc.getElementById('roasc-out').textContent.includes('ROAS: 4×') && doc.getElementById('roasc-out').textContent.includes('$1 spent returned $4 in revenue'));
  setValue(dom.window, 'roasc-margin', '40');
  check('roas calculator derives break-even from margin', doc.getElementById('roasc-out').textContent.includes('Break-even ROAS: 2.5× at a 40% gross margin') && doc.getElementById('roasc-verdict').textContent.includes('Above break-even'));
  setValue(dom.window, 'roasc-spend', '0');
  check('roas calculator guards zero spend', doc.getElementById('roasc-verdict').textContent.includes('greater than zero'));
  check('roas calculator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, doc, errors } = await boot('cac-calculator');
  setValue(dom.window, 'cacc-spend', '8000');
  setValue(dom.window, 'cacc-cust', '100');
  check('cac calculator computes cost per customer', doc.getElementById('cacc-out').textContent.includes('CAC: $80 per new customer') && doc.getElementById('cacc-verdict').textContent.includes('lifetime value'));
  setValue(dom.window, 'cacc-ltv', '300');
  check('cac calculator derives the LTV:CAC ratio with a verdict', doc.getElementById('cacc-out').textContent.includes('LTV:CAC ratio: 3.75×') && doc.getElementById('cacc-verdict').textContent.includes('healthy range'));
  setValue(dom.window, 'cacc-cust', '0');
  check('cac calculator guards zero customers', doc.getElementById('cacc-verdict').textContent.includes('greater than zero'));
  check('cac calculator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}
{
  const { dom, doc, errors } = await boot('ad-metrics-calculator');
  setValue(dom.window, 'amc-spend', '300');
  setValue(dom.window, 'amc-imp', '100000');
  setValue(dom.window, 'amc-clicks', '150');
  setValue(dom.window, 'amc-conv', '20');
  const out = doc.getElementById('amc-out').textContent;
  check('ad metrics calculator reads all four rates', out.includes('CPC: $2 per click') && out.includes('CPM: $3 per 1,000 impressions') && out.includes('CTR: 0.15%') && out.includes('CPA: $15 per conversion'));
  setValue(dom.window, 'amc-conv', '');
  check('ad metrics calculator flags missing conversions for CPA', doc.getElementById('amc-verdict').textContent.includes('No conversions recorded'));
  setValue(dom.window, 'amc-clicks', '');
  setValue(dom.window, 'amc-imp', '');
  check('ad metrics calculator refuses spend-only results', doc.getElementById('amc-verdict').textContent.includes('spend alone gives no rate'));
  check('ad metrics calculator has no JavaScript errors', errors.length === 0);
  dom.window.close();
}

console.log(`\nPERSONALIZED TOOLS: ${checks} checks passed.`);

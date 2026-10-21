// Page-specific regression coverage for the five upgraded SEO tools.
// Runs the built pages with a deterministic page/robots/sitemap response fixture.
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const PAGE_URL = 'https://example.test/seo-guide/';
const QUERY = 'technical SEO audit';
const PAGE_HTML = `<!doctype html><html lang="en"><head>
<title>Technical SEO Audit for SaaS Teams</title>
<meta name="description" content="Technical SEO audit guidance for SaaS teams, based on the page’s actual crawl and content signals.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${PAGE_URL}">
<meta property="og:title" content="Technical SEO Audit for SaaS Teams">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script>
</head><body>
<nav>technical SEO audit navigation probe</nav>
<main><article><h1>Technical SEO Audit for SaaS Teams</h1>
<p>A technical SEO audit checks crawl access, page metadata and internal discovery. This technical SEO audit guide explains which evidence to review before prioritizing fixes for a SaaS page.</p>
<a href="/seo-guide/related">Related audit guide</a><img alt="Crawl report example"><img></article></main>
<footer>technical SEO audit footer probe</footer></body></html>`;
const ROBOTS = `User-agent: *\nDisallow: /private\nAllow: /private/public\nSitemap: https://example.test/sitemap.xml\n`;
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${PAGE_URL}</loc></url></urlset>`;

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
    body = target.hostname === 'common.test' ? 'User-agent: *\n' : ROBOTS;
    contentType = 'text/plain; charset=utf-8';
  }
  else if (target.pathname === '/sitemap.xml') {
    body = target.hostname === 'common.test' ? SITEMAP.replace(PAGE_URL, 'https://common.test/page/') : SITEMAP;
    contentType = 'application/xml; charset=utf-8';
  }
  else if (target.pathname === '/blocked/') xRobotsTag = 'noindex';
  return { ok: true, status, finalUrl: target.href, contentType, xRobotsTag, bytes: Buffer.byteLength(body), ms: 17, truncated: false, body };
}
async function boot(slug) {
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
      win.fetch = (input) => {
        const request = new URL(typeof input === 'string' ? input : input.url, win.location.href);
        const target = request.searchParams.get('url');
        if (request.pathname !== '/api/fetch' || !target) return Promise.reject(new TypeError('Unexpected test fetch'));
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
  check('robots parser applies the longest matching allow rule', win.T4M_INSPECT.parseRobotsTxt(ROBOTS, 'https://example.test/private/public/page', 'googlebot').allowed);
  check('robots parser reports a disallowed path', !win.T4M_INSPECT.parseRobotsTxt(ROBOTS, 'https://example.test/private/page', 'googlebot').allowed);
  check('shared extractor has no browser errors', errors.length === 0);
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

console.log(`\nPERSONALIZED TOOLS: ${checks} checks passed.`);

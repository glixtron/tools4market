// audit/tests/rules.test.mjs — every rule must fire on a broken page and stay
// quiet on a good one.
//
// This is the same lesson as the ad-vanish incident, applied to the audit
// itself: a checker that passes while the thing it checks is broken is worse
// than no checker, because it silences the alarm. Each rule gets a page built to
// fail it, and the assertion is that the specific rule id appears.

import assert from 'node:assert/strict';
import { rules } from '../rules/index.mjs';
import { parsePage } from '../parse.mjs';

const catalog = JSON.parse(await import('node:fs/promises').then((fs) => fs.readFile(new URL('../rules/catalog.json', import.meta.url), 'utf8')));

const byId = new Map(rules.map((r) => [r.id, r]));

const ctx = {
  catalog,
  env: { enabled: true, configured: true, client: 'ca-pub-1509697031230558', slots: { top: '2947820780', content: '9083278862', sidebar: '3751273162' } },
  groupOf: (p) => (p === '/' ? 'home' : p.startsWith('/tools/') ? 'tools' : p.startsWith('/blog/') && p !== '/blog/' ? 'blog' : 'pages'),
  toolOf: (p) => (/^\/tools\/[a-z0-9-]+\/$/.test(p) ? { slug: 'x', name: 'X', focus: 'meta tag generator' } : null),
  articleOf: (p) => (/^\/blog\/[a-z0-9-]+\/$/.test(p) ? { slug: 'g', focus: 'xml sitemap', relatedTools: ['a', 'b', 'c'], links: [] } : null),
  entryFor(p) { return this.toolOf(p) || this.articleOf(p); },
  expectedUnits: (p) => (p.startsWith('/tools/') ? 3 : p.startsWith('/blog/') && p !== '/blog/' ? 1 : 0),
  noindexAllowed: new Set(),
};

/** A page that passes every rule. Tests then break one thing at a time. */
function goodPage(over = {}) {
  const base = {
    url: 'https://tools4market.online/tools/meta-tag-generator/',
    finalUrl: 'https://tools4market.online/tools/meta-tag-generator/',
    path: '/tools/meta-tag-generator/',
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    chain: [],
    bytes: 20000,
    contentType: 'text/html; charset=utf-8',
    title: 'Meta Tag Generator — Free, No Signup, Instant',
    description: 'Write meta tags for any page with a free generator: title, description, canonical, Open Graph and Twitter cards, checked as you type.',
    canonical: 'https://tools4market.online/tools/meta-tag-generator/',
    robotsMeta: null,
    lang: 'en',
    viewport: 'width=device-width, initial-scale=1',
    og: { title: 't', description: 'd', type: 'website', url: 'u', image: 'i', imageWidth: '1200', imageHeight: '630', imageAlt: 'a', siteName: 's' },
    twitter: { card: 'summary_large_image', title: 't', description: 'd', image: 'i' },
    jsonld: [
      { ok: true, data: { '@type': 'WebApplication', offers: { price: '0' } } },
      { ok: true, data: { '@type': 'FAQPage', mainEntity: [{ name: 'Q1' }, { name: 'Q2' }, { name: 'Q3' }, { name: 'Q4' }] } },
      { ok: true, data: { '@type': 'BreadcrumbList', itemListElement: [{ position: 1 }, { position: 2 }] } },
    ],
    headings: [
      { level: 1, text: 'Meta Tag Generator', offset: 0 },
      { level: 2, text: 'How the meta tag generator works', offset: 10 },
      { level: 3, text: 'Details', offset: 20 },
    ],
    h1: [{ level: 1, text: 'Meta Tag Generator', offset: 0 }],
    links: [
      { href: '/tools/robots-txt-generator/', absolute: 'https://tools4market.online/tools/robots-txt-generator/', internal: true, text: 'robots.txt generator', rel: '', nofollow: false, offset: 1 },
      { href: '/tools/sitemap-generator/', absolute: 'https://tools4market.online/tools/sitemap-generator/', internal: true, text: 'sitemap generator', rel: '', nofollow: false, offset: 2 },
      { href: '/blog/xml-sitemap-best-practices/', absolute: 'https://tools4market.online/blog/xml-sitemap-best-practices/', internal: true, text: 'sitemap guide', rel: '', nofollow: false, offset: 3 },
      { href: '/tools/canonical-tag-generator/', absolute: 'https://tools4market.online/tools/canonical-tag-generator/', internal: true, text: 'canonical generator', rel: '', nofollow: false, offset: 4 },
      { href: '/tools/hreflang-generator/', absolute: 'https://tools4market.online/tools/hreflang-generator/', internal: true, text: 'hreflang', rel: '', nofollow: false, offset: 5 },
      { href: 'https://example.com/', absolute: 'https://example.com/', internal: false, text: 'source', rel: '', nofollow: false, offset: 6 },
      { href: 'https://example.org/', absolute: 'https://example.org/', internal: false, text: 'source 2', rel: '', nofollow: false, offset: 7 },
    ],
    images: [{ src: '/a.png', absolute: 'https://tools4market.online/a.png', alt: 'a', width: '10', height: '10', loading: 'lazy' }],
    scripts: [],
    styles: ['/assets/style.css'],
    preconnect: [],
    renderBlocking: [],
    ads: { units: [{ slot: '2947820780', client: 'ca-pub-1509697031230558', offset: 500 }, { slot: '9083278862', client: 'ca-pub-1509697031230558', offset: 9000 }, { slot: '3751273162', client: 'ca-pub-1509697031230558', offset: 9500 }], divs: [{ classes: 'ad-slot', empty: false, ariaHidden: null, offset: 500 }], loaderCount: 1 },
    regions: { article: { start: 400, end: 10000 }, toolShell: { start: 1000, end: 2000 }, toolMain: { start: 400, end: 10000 }, toolSide: { start: 9200, end: 9800 }, toolContent: { start: 2400, end: 9000 } },
    faq: [{ q: 'Q1', a: 'A' }, { q: 'Q2', a: 'A' }, { q: 'Q3', a: 'A' }, { q: 'Q4', a: 'A' }],
    text: { body: 'meta tag generator body', article: 'a', prose: 'p' },
    words: { body: 900, article: 800, prose: 700 },
    flags: { consentBanner: true, skipLink: true, details: 4 },
  };
  return { ...base, ...over };
}

const failures = [];
let passed = 0;

function fires(ruleId, page, ctxOverride = ctx) {
  const rule = byId.get(ruleId);
  assert.ok(rule, `unknown rule ${ruleId}`);
  const res = rule.test(page, ctxOverride);
  assert.ok(res, `expected ${ruleId} to fire`);
  passed++;
}

function quiet(ruleId, page, ctxOverride = ctx) {
  const rule = byId.get(ruleId);
  assert.ok(rule, `unknown rule ${ruleId}`);
  const res = rule.test(page, ctxOverride);
  assert.equal(res, null, `expected ${ruleId} to stay quiet, got: ${res && res.message}`);
  passed++;
}

// ---- the good page passes everything that applies -----------------------
for (const rule of rules) {
  if (rule.scope === 'cross') continue;
  const res = rule.test(goodPage(), ctx);
  if (res) failures.push(`good page triggered ${rule.id}: ${res.message}`);
}

// ---- each rule fires on its own breakage -------------------------------
fires('http-status', goodPage({ status: 404 }));
fires('url-resolves-to-itself', goodPage({ finalUrl: 'https://tools4market.online/tools/meta-tag-generator' }));
fires('redirect-permanent', goodPage({ chain: [{ status: 302 }, { status: 200 }] }));
fires('canonical-present', goodPage({ canonical: null }));
fires('canonical-matches-sitemap-url', goodPage({ canonical: 'https://tools4market.online/tools/other/' }));
fires('noindex-in-sitemap', goodPage({ robotsMeta: 'noindex' }));
fires('html-lang', goodPage({ lang: null }));
fires('viewport', goodPage({ viewport: null }));
fires('title-present', goodPage({ title: '' }));
fires('html-content-type', goodPage({ contentType: 'text/plain' }));

fires('title-length', goodPage({ title: 'Too short' }));
fires('desc-length', goodPage({ description: 'short' }));
fires('h1-count', goodPage({ h1: [] }));
fires('heading-order', goodPage({ headings: [{ level: 1, text: 'A' }, { level: 3, text: 'B' }] }));
fires('og-complete', goodPage({ og: { ...goodPage().og, image: null } }));
fires('twitter-complete', goodPage({ twitter: { card: null, title: 't', description: 'd', image: 'i' } }));
fires('og-image-dimensions', goodPage({ og: { ...goodPage().og, imageWidth: '800' } }));

fires('jsonld-valid', goodPage({ jsonld: [{ ok: false, error: 'Unexpected token' }] }));
fires('jsonld-present', goodPage({ jsonld: [] }));
fires('jsonld-expected-types', goodPage({ jsonld: [{ ok: true, data: { '@type': 'WebApplication' } }] }));
fires('faq-schema-matches-visible', goodPage({ jsonld: [{ ok: true, data: { '@type': 'FAQPage', mainEntity: [{ name: 'Not on page' }] } }] }));
fires('no-searchaction', goodPage({ jsonld: [{ ok: true, data: { '@type': 'WebSite', potentialAction: { '@type': 'SearchAction' } } }] }));
fires('breadcrumb-positions', goodPage({ jsonld: [{ ok: true, data: { '@type': 'BreadcrumbList', itemListElement: [{ position: 2 }, { position: 2 }] } }] }));
fires('webapplication-offer', goodPage({ jsonld: [{ ok: true, data: { '@type': 'WebApplication', offers: { price: '9' } } }] }));

fires('prose-min', goodPage({ words: { body: 100, article: 100, prose: 100 } }));
fires('faq-count', goodPage({ faq: [{ q: 'Q1', a: 'A' }] }));
fires('focus-in-title', goodPage({ title: 'Something else entirely, unrelated words' }));
fires('focus-in-description', goodPage({ description: 'A description that avoids the target phrase on purpose and runs to length so only the phrase check fails here.' }));
fires('focus-in-heading', goodPage({ headings: [{ level: 1, text: 'X' }, { level: 2, text: 'Unrelated' }] }));
fires('related-tools-rendered', goodPage({ path: '/blog/g/', url: 'https://tools4market.online/blog/g/', finalUrl: 'https://tools4market.online/blog/g/', ads: { units: [{ slot: '9083278862', client: 'ca-pub-1509697031230558', offset: 500 }], divs: [], loaderCount: 1 }, links: [] }));
fires('outbound-links', goodPage({ path: '/blog/g/', url: 'https://tools4market.online/blog/g/', finalUrl: 'https://tools4market.online/blog/g/', links: [] }));

fires('img-alt', goodPage({ images: [{ src: '/a.png', alt: null, width: '1', height: '1' }] }));
fires('img-dimensions', goodPage({ images: [{ src: '/a.png', alt: 'a', width: null, height: null }] }));
fires('html-weight', goodPage({ bytes: 900000 }));
fires('render-blocking-script', goodPage({ renderBlocking: ['/x.js'] }));
fires('h1-missing', goodPage({ h1: [] }));
fires('skip-link', goodPage({ flags: { ...goodPage().flags, skipLink: false } }));

fires('vague-anchor', goodPage({ links: [{ href: '/x/', absolute: 'https://tools4market.online/x/', internal: true, text: 'click here', rel: '', nofollow: false, offset: 1 }] }));
fires('empty-href', goodPage({ links: [{ href: '', absolute: null, internal: false, text: 'x', rel: '', nofollow: false, offset: 1 }] }));
fires('javascript-href', goodPage({ links: [{ href: 'javascript:void(0)', absolute: null, internal: false, text: 'x', rel: '', nofollow: false, offset: 1 }] }));
fires('internal-link-density', goodPage({ links: [] }));

fires('ad-inside-tool', goodPage({ ads: { units: [{ slot: '2947820780', client: 'ca-pub-1509697031230558', offset: 1500 }], divs: [], loaderCount: 1 } }));
fires('ad-placeholder-chrome', goodPage({ text: { body: 'Ad space · below content' } }));
fires('ad-slot-empty-with-unit', goodPage({ ads: { units: [{ slot: '2947820780', client: 'ca-pub-1509697031230558', offset: 500 }], divs: [{ classes: 'ad-slot ad-slot--empty', empty: true, offset: 500 }], loaderCount: 1 } }));
fires('adsense-loader-once', goodPage({ ads: { units: [], divs: [], loaderCount: 0 } }));
fires('ad-unit-count', goodPage({ ads: { units: [], divs: [], loaderCount: 1 } }));
fires('ad-client-matches', goodPage({ ads: { units: [{ slot: '2947820780', client: 'ca-pub-0000000000000000', offset: 500 }], divs: [], loaderCount: 1 } }));

// ---- quiet on the good page, for the rules most likely to over-fire -----
quiet('ad-inside-tool', goodPage());
quiet('ad-unit-count', goodPage());
quiet('focus-in-title', goodPage());
quiet('faq-schema-matches-visible', goodPage());
quiet('skip-link', goodPage());

// ---- a deliberately ad-free build is not a broken build ----------------
// `ALLOW_ADS_OFF=1` is a documented way to build without ads. The three rules
// that compare the page with `.env` must stay silent when the run says the ads
// are off on purpose, or the flag produces 148 blockers on a correct build.
{
  const adsOff = { ...ctx, env: { ...ctx.env, enabled: false } };
  const bare = goodPage({ ads: { units: [], divs: [], loaderCount: 0 } });
  quiet('adsense-loader-once', bare, adsOff);
  quiet('ad-unit-count', bare, adsOff);
  quiet('ad-client-matches', bare, adsOff);
  // ...but the same page is a blocker when the ads were expected.
  fires('adsense-loader-once', bare, ctx);
  fires('ad-unit-count', bare, ctx);
}

// ---- the parser agrees with the rules about a real document ------------
{
  const html = `<!doctype html><html lang="en"><head>
    <title>Test Page Title For The Parser</title>
    <meta name="description" content="A description long enough to be plausible.">
    <meta name="viewport" content="width=device-width">
    <link rel="canonical" href="https://example.com/tools/x/">
    <meta property="og:title" content="OG">
  </head><body>
    <div class="tool-shell"><input></div>
    <div class="ad-slot ad-slot--empty" aria-hidden="true"></div>
    <ins class="adsbygoogle" data-ad-client="ca-pub-1" data-ad-slot="1234567890"></ins>
    <h1>One</h1><h2>Two</h2>
    <details><summary>Q?</summary><p>A.</p></details>
    <script type="application/ld+json">{"@type":"FAQPage"}</script>
  </body></html>`;
  const p = parsePage({ url: 'https://example.com/tools/x/', finalUrl: 'https://example.com/tools/x/', status: 200, headers: {}, body: html });
  assert.equal(p.title, 'Test Page Title For The Parser', 'title');
  assert.equal(p.canonical, 'https://example.com/tools/x/', 'canonical');
  assert.equal(p.h1.length, 1, 'h1 count');
  assert.equal(p.headings.length, 2, 'heading count');
  assert.equal(p.faq.length, 1, 'faq count');
  assert.equal(p.faq[0].q, 'Q?', 'faq question');
  assert.equal(p.jsonld.length, 1, 'jsonld count');
  assert.equal(p.jsonld[0].data['@type'], 'FAQPage', 'jsonld type');
  assert.equal(p.ads.units.length, 1, 'ad unit');
  assert.equal(p.ads.divs.length, 1, 'ad div');
  assert.equal(p.ads.divs[0].empty, true, 'empty chome flag');
  assert.equal(p.ads.loaderCount, 0, 'loader count');
  assert.ok(p.regions.toolShell && p.regions.toolShell.start > 0, 'tool shell region');
  assert.ok(p.regions.toolShell.end > p.regions.toolShell.start, 'tool shell has an end');
  passed += 13;
}

if (failures.length) {
  console.error('\nFAILURES');
  failures.forEach((f) => console.error(' ✗ ' + f));
  process.exit(1);
}

console.log(`AUDIT RULES: ${passed} assertions passed (${rules.length} rules)`);

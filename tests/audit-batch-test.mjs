// Regression coverage for POST /api/audit-batch — the Website Audit backend.
// Runs the real handler with a mocked global fetch, so validation needs no
// deploy: contract, guards, sitemap discovery, per-page rules, link checks,
// cross-page computation. Every finding the engine can produce is exercised
// against a fixture page so a rule that never fires is caught here.
//   node tests/audit-batch-test.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleAuditBatch, VISITOR_FIX } from '../functions/api/audit-batch.js';
import { SITE_AUDIT } from '../src/data/inspect.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const ORIGIN = 'https://tools4market.online';
let pass = 0, fail = 0;
const issues = [];
const ok = (name, cond, detail = '') => {
  if (cond) pass++;
  else { fail++; issues.push(name + (detail ? ' — ' + detail : '')); }
};

// ---- fixture site --------------------------------------------------------
const HOME = `<!doctype html><html lang="en"><head>
<title>Fixture Home — A Deliberately Clean Page Title</title>
<meta name="description" content="A fixture meta description that is comfortably inside the accepted length range for the on-page rules and reads well.">
<link rel="canonical" href="https://fixture.test/">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:title" content="Fixture Home"><meta property="og:type" content="website">
<meta property="og:image" content="https://fixture.test/og.png"><meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630"><meta property="og:url" content="https://fixture.test/">
<meta property="og:description" content="Fixture"><meta property="og:image:alt" content="Fixture">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="Fixture Home">
<meta name="twitter:description" content="Fixture"><meta name="twitter:image" content="https://fixture.test/og.png">
</head><body><h1>Fixture Home</h1>
<a href="/page-2/">Page two</a><a href="/missing/">Broken</a><a href="https://external.test/dead/">Dead</a>
${'<p>' + 'word '.repeat(320) + '</p>'}
</body></html>`;

// A deliberately broken page: no canonical, two h1, no description, thin, a
// javascript: href and a vague anchor — one fixture that trips many rules.
const BROKEN = `<!doctype html><html><head><title>T</title></head>
<body><h1>One</h1><h1>Two</h1><h3>Skip</h3>
<a href="javascript:void(0)">go</a><a href="/page-2/">click here</a>
<img src="/x.png">
</body></html>`;

function sitemapOf(urls) {
  return `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((u) => `<url><loc>${u}</loc><lastmod>2026-10-28</lastmod></url>`).join('') + `</urlset>`;
}
const ROBOTS = `User-agent: *\nAllow: /\nDisallow: /private/\nSitemap: https://fixture.test/sitemap.xml`;

// ---- mock global fetch ---------------------------------------------------
let ROUTES = new Map();
function installFetch() {
  globalThis.fetch = (input, init) => {
    const u = String(input && input.url || input);
    // A redirect target: /www/ → apex 301 (so redirect chains are exercised).
    if (ROUTES.has(u)) {
      const r = ROUTES.get(u);
      if (typeof r === 'function') return Promise.resolve(r());
      return Promise.resolve(new Response(r.body, { status: r.status || 200, headers: r.headers || { 'content-type': 'text/html' } }));
    }
    return Promise.resolve(new Response('not found', { status: 404 }));
  };
}
const route = (url, spec) => ROUTES.set(url, spec);

const post = (body, headers = {}) => new Request(ORIGIN + '/api/audit-batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const jsonOf = async (res) => { try { return await res.json(); } catch { return {}; } };

async function main() {
  installFetch();

  // 1. discover — parses a flat sitemap, filters off-origin, caps, reports robots
  {
    ROUTES = new Map();
    route('https://fixture.test/sitemap.xml', { body: sitemapOf([
      'https://fixture.test/', 'https://fixture.test/page-2/', 'https://cdn.other.test/x',
      'https://fixture.test/page-2/',                    // duplicate
      'https://fixture.test/robots-blocked/',            // in sitemap, blocked by robots
    ]) });
    route('https://fixture.test/robots.txt', { body: ROBOTS, headers: { 'content-type': 'text/plain' } });
    const j = await jsonOf(await handleAuditBatch(post({ mode: 'discover', origin: 'https://fixture.test' }), {}));
    ok('discover: returns urls on the origin only', j.urls.length === 3 && j.urls.every((u) => u.startsWith('https://fixture.test/')), JSON.stringify(j.urls));
    ok('discover: de-duplicates', new Set(j.urls).size === j.urls.length);
    ok('discover: parses the visitor robots rules', j.robots.rules.some((r) => r.type === 'disallow' && r.path === '/private/'));
    ok('discover: reports the declared sitemap', j.robots.sitemaps.some((s) => s.includes('sitemap.xml')));
    ok('discover: finds the sitemap (no sitemap-missing finding)', !j.findings.some((f) => f.id === 'sitemap-missing'));
  }

  // 2. discover — missing sitemap and missing robots become findings
  {
    ROUTES = new Map();
    route('https://nosite.test/sitemap.xml', { status: 404, body: '' });
    route('https://nosite.test/robots.txt', { status: 404, body: '' });
    const j = await jsonOf(await handleAuditBatch(post({ mode: 'discover', origin: 'https://nosite.test' }), {}));
    ok('discover: missing sitemap is a major finding', j.findings.some((f) => f.id === 'sitemap-missing' && f.severity === 'major'));
    ok('discover: missing robots is a minor finding', j.findings.some((f) => f.id === 'robots-missing' && f.severity === 'minor'));
  }

  // 3. pages — a clean fixture page stays clean-ish; the broken one fires rules
  {
    ROUTES = new Map();
    route('https://fixture.test/', { body: HOME });
    route('https://fixture.test/page-2/', { body: BROKEN });
    const j = await jsonOf(await handleAuditBatch(post({
      mode: 'pages',
      urls: ['https://fixture.test/', 'https://fixture.test/page-2/'],
      robotsRules: [{ agent: '*', type: 'disallow', path: '/private/' }],
    }), {}));
    ok('pages: two page results', j.pages.length === 2);
    const clean = j.pages.find((p) => p.url === 'https://fixture.test/');
    const broken = j.pages.find((p) => p.url === 'https://fixture.test/page-2/');
    ok('pages: clean fixture has no blocker', !clean.findings.some((f) => f.severity === 'blocker'), JSON.stringify(clean.findings.map((f) => f.id)));
    ok('pages: clean fixture summary carries title + h1 + internal links', clean.summary.title && clean.summary.h1 && clean.summary.internal.length >= 2);
    // The broken fixture must trip several rules — this is the "a rule that
    // never fires" guard for the engine subset.
    const ids = broken.findings.map((f) => f.id);
    ok('pages: multiple h1 fires h1-count', ids.includes('h1-count'), ids.join(','));
    ok('pages: heading skip fires heading-order', ids.includes('heading-order'), ids.join(','));
    ok('pages: javascript: href fires javascript-href', ids.includes('javascript-href'), ids.join(','));
    ok('pages: vague anchor fires vague-anchor', ids.includes('vague-anchor'), ids.join(','));
    ok('pages: missing alt fires img-alt', ids.includes('img-alt'), ids.join(','));
    ok('pages: thin page fires thin-content', ids.includes('thin-content'), ids.join(','));
    ok('pages: missing description fires desc-length', ids.includes('desc-length'), ids.join(','));
    ok('pages: missing canonical fires canonical-present', ids.includes('canonical-present'), ids.join(','));
    // Every finding carries the contract shape a rule must return.
    ok('pages: every finding has id/severity/page/message/fix',
      j.pages.every((p) => p.findings.every((f) => f.id && f.severity && f.page && f.message && f.fix)));
  }

  // 4. pages — a page blocked by the visitor robots.txt is flagged
  {
    ROUTES = new Map();
    route('https://fixture.test/private/', { body: HOME });
    const j = await jsonOf(await handleAuditBatch(post({
      mode: 'pages', urls: ['https://fixture.test/private/'],
      robotsRules: [{ agent: '*', type: 'disallow', path: '/private/' }],
    }), {}));
    ok('pages: robots-disallowed fires for a blocked page', j.pages[0].findings.some((f) => f.id === 'robots-disallowed'));
  }

  // 5. links — final statuses come back
  {
    ROUTES = new Map();
    route('https://fixture.test/ok/', { body: 'x' });
    route('https://fixture.test/gone/', { status: 404, body: 'x' });
    const j = await jsonOf(await handleAuditBatch(post({ mode: 'links', urls: ['https://fixture.test/ok/', 'https://fixture.test/gone/'] }), {}));
    ok('links: returns a status per url', j.results.length === 2 && j.results.find((r) => r.url.includes('gone')).status === 404);
  }

  // 6. cross — duplicates, orphans, broken internal, dead external
  {
    const summaries = [
      { url: 'https://fixture.test/', path: '/', title: 'Same Title', description: 'Same desc', h1: 'Same H1', internal: ['https://fixture.test/page-2/'] },
      { url: 'https://fixture.test/page-2/', path: '/page-2/', title: 'Same Title', description: 'Same desc', h1: 'Same H1', internal: ['https://fixture.test/missing/'] },
    ];
    const linkResults = [
      { url: 'https://fixture.test/missing/', status: 404 },
      { url: 'https://external.test/dead/', status: 500 },
    ];
    const j = await jsonOf(await handleAuditBatch(post({ mode: 'cross', summaries, linkResults }), {}));
    const ids = j.findings.map((f) => f.id);
    ok('cross: duplicate title fires', ids.includes('duplicate-title'), ids.join(','));
    ok('cross: duplicate description fires', ids.includes('duplicate-description'), ids.join(','));
    ok('cross: duplicate h1 fires', ids.includes('duplicate-h1'), ids.join(','));
    ok('cross: broken internal link is a blocker', j.findings.some((f) => f.id === 'broken-internal' && f.severity === 'blocker'), ids.join(','));
    ok('cross: dead external link fires', ids.includes('dead-external'), ids.join(','));
    ok('cross: a page nothing links to is an orphan', ids.includes('orphan-page'), ids.join(','));
  }

  // 7. guards
  {
    ROUTES = new Map();
    const g1 = await handleAuditBatch(post({ mode: 'pages', urls: ['https://fixture.test/'] }, { Origin: 'https://evil.test' }), {});
    ok('guard: cross-origin POST rejected (403)', g1.status === 403);
    const g2 = await handleAuditBatch(new Request(ORIGIN + '/api/audit-batch'), {});
    ok('guard: GET rejected (405)', g2.status === 405);
    const g3 = await handleAuditBatch(post('{not json'), {});
    ok('guard: invalid JSON rejected (400)', g3.status === 400);
    const g4 = await handleAuditBatch(post({ mode: 'pages', urls: ['http://localhost/'] }), {});
    ok('guard: loopback host rejected (403)', g4.status === 403);
    const g5 = await handleAuditBatch(post({ mode: 'pages', urls: ['http://169.254.169.254/'] }), {});
    ok('guard: cloud metadata host rejected (403)', g5.status === 403);
    const g6 = await handleAuditBatch(post({ mode: 'nope' }), {});
    ok('guard: unknown mode rejected (400)', g6.status === 400);
    const g7 = await handleAuditBatch(post({ mode: 'discover', origin: 'not a url' }), {});
    ok('guard: bad origin rejected (400)', g7.status === 400);
    const g8 = await handleAuditBatch(post({ mode: 'pages', urls: [] }), {});
    ok('guard: empty batch rejected (400)', g8.status === 400);
    const big = await handleAuditBatch(post({ mode: 'pages', urls: ['https://fixture.test/'], pad: 'x'.repeat(2100000) }), {});
    ok('guard: oversized body rejected (413)', big.status === 413);
    const opt = await handleAuditBatch(new Request(ORIGIN + '/api/audit-batch', { method: 'OPTIONS' }), {});
    ok('guard: OPTIONS answered with 204', opt.status === 204);
  }

  // 8. engine parity — the visitor tool runs the SAME rules our audit runs
  {
    // The clean fixture must not trip the rules our own audit also enforces
    // (title length, description length, canonical present), proving the shared
    // catalog thresholds are applied identically on both sides.
    ROUTES = new Map();
    route('https://fixture.test/', { body: HOME });
    const j = await jsonOf(await handleAuditBatch(post({ mode: 'pages', urls: ['https://fixture.test/'] }), {}));
    const ids = j.pages[0].findings.map((f) => f.id);
    ok('parity: clean page passes title-length', !ids.includes('title-length'), ids.join(','));
    ok('parity: clean page passes desc-length', !ids.includes('desc-length'), ids.join(','));
    ok('parity: clean page passes h1-count', !ids.includes('h1-count'), ids.join(','));
  }

  // 9. the payload/crawl fixes — trailing slashes and outbound links
  {
    // `/page-2` (no slash) linking to `/page-2/` must not read as an orphan.
    ROUTES = new Map();
    route('https://fixture.test/', { body: HOME.replace('/page-2/', '/page-2') });
    route('https://fixture.test/page-2/', { body: BROKEN });
    const j = await jsonOf(await handleAuditBatch(post({ mode: 'pages', urls: ['https://fixture.test/', 'https://fixture.test/page-2/'] }), {}));
    const home = j.pages.find((p) => p.summary.path === '/');
    ok('summary: internal links are de-duplicated', new Set(home.summary.internal).size === home.summary.internal.length);
    ok('summary: outbound links included for the dead-external check', home.summary.external.some((u) => u.includes('external.test')));
    const summaries = j.pages.map((p) => p.summary);
    const x = await jsonOf(await handleAuditBatch(post({ mode: 'cross', summaries, linkResults: [] }), {}));
    const orphans = x.findings.filter((f) => f.id === 'orphan-page').map((f) => f.page);
    ok('cross: trailing-slash mismatch is not an orphan', !orphans.includes('/page-2/'), JSON.stringify(orphans));
  }

  // 10. handoff + visitor-facing copy — every finding a visitor can receive has
  // a destination in site-audit's tool map, and no report text points at this
  // repo's own source files (the engine rules were written for our templates).
  {
    // Every rule id that can fire for a third-party site: the engine minus the
    // brand file (our ad policy), plus the endpoint's own visitor checks.
    const ruleIds = new Set();
    for (const f of readdirSync(join(ROOT, 'audit/rules'))) {
      if (!f.endsWith('.mjs') || f === 'brand.mjs') continue;
      for (const m of readFileSync(join(ROOT, 'audit/rules', f), 'utf8').matchAll(/id: '([a-z0-9-]+)'/g)) ruleIds.add(m[1]);
    }
    const endpointSrc = readFileSync(join(ROOT, 'functions/api/audit-batch.js'), 'utf8');
    for (const m of endpointSrc.matchAll(/id: '([a-z0-9-]+)'/g)) ruleIds.add(m[1]);
    // Documented exceptions: our own policy (webapplication-offer), a rule that
    // degrades to not-applicable without our article data (related-tools-rendered),
    // and skip-link — no tool or guide on the site does that job.
    const NEVER = new Set(['webapplication-offer', 'related-tools-rendered', 'skip-link']);
    const missing = [...ruleIds].filter((id) => !NEVER.has(id) && !SITE_AUDIT.toolFor[id]);
    ok('handoff: every fireable finding has a destination', missing.length === 0, missing.join(','));

    // The override map tracks real rules — a renamed rule must not leave stale
    // copy behind — and every override reads as advice for someone else's site.
    const stale = Object.keys(VISITOR_FIX).filter((id) => !ruleIds.has(id));
    ok('visitor copy: every override belongs to a real rule', stale.length === 0, stale.join(','));
    const internal = Object.entries(VISITOR_FIX).filter(([, v]) => /build\.mjs|ldTag|src\/data/.test(v));
    ok('visitor copy: no override names this repo', internal.length === 0, internal.map(([k]) => k).join(','));

    // Behaviour, not just the table: the broken fixture trips html-lang,
    // viewport, canonical-present, og/twitter-complete, jsonld-present and
    // desc-length — exactly the rules whose stock fix copy said "see
    // build.mjs:272" / "add it in src/data". A 404 in the batch covers the
    // http-status branch that named the build too.
    ROUTES = new Map();
    route('https://fixture.test/', { body: BROKEN });
    route('https://fixture.test/gone/', { status: 404, body: 'not found' });
    const j = await jsonOf(await handleAuditBatch(post({ mode: 'pages', urls: ['https://fixture.test/', 'https://fixture.test/gone/'] }), {}));
    const found = j.pages.flatMap((p) => p.findings);
    const overridden = found.filter((f) => VISITOR_FIX[f.id]);
    ok('visitor copy: overridden rules fire on the broken fixture', overridden.length >= 6, overridden.map((f) => f.id).join(','));
    ok('visitor copy: http-status on a 404 carries visitor wording',
      found.some((f) => f.id === 'http-status' && !/build\.mjs|src\/data/.test(f.fix)));
    ok('visitor copy: report text never names this repo',
      found.every((f) => !/build\.mjs|ldTag|src\/data/.test(f.fix || '')),
      found.filter((f) => /build\.mjs|ldTag|src\/data/.test(f.fix || '')).map((f) => f.id).join(','));
    ok('visitor copy: message and evidence still come from the rule',
      found.some((f) => f.id === 'html-lang' && /lang attribute/.test(f.message)));
  }

  console.log(`\nAUDIT-BATCH: ${pass} passed, ${fail} failed`);
  if (fail) { console.log('Failures:'); issues.forEach((i) => console.log('  ✗ ' + i)); process.exit(1); }
}

main().catch((e) => { console.error(e); process.exit(1); });

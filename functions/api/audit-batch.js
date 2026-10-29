// Tools4Market — POST /api/audit-batch: the backend for the Website Audit tool.
//
// A visitor enters their website; the browser drives the crawl, but every HTTP
// fetch, parse and rule run happens HERE, server-side, in the same Worker as
// /api/fetch and /api/suggest. The browser never opens a raw socket to the
// visitor's host (CORS would block it anyway) — it asks this endpoint, which
// fetches like a plain client.
//
// Four modes, one endpoint, each a separate request so a single invocation never
// approaches the Cloudflare Free limits (50 subrequests, 10 ms CPU):
//
//   discover  origin → robots.txt + sitemap.xml → up to 100 page URLs
//   pages     ≤4 URLs → fetch + parse + per-page rules → findings + summaries
//   links     ≤10 URLs → final status of each (for broken/dead link checks)
//   cross     compact summaries + link results → duplicates, orphans, broken
//             internal, dead external — pure computation, no fetches
//
// The 47-rule engine in audit/rules/ is imported UNCHANGED and is shared with our
// internal `npm run audit`, so this tool's thresholds can never drift from our
// own audits. Rules that encode OUR template policy (expected schema types, the
// ad layout, WebApplication-must-be-free) are stood down for a third-party site:
// they would fire on almost every foreign page and drown the real findings.
//
// The client sends only what each mode needs; the same-origin check means a
// third party cannot post their visitors' URLs through us to relay-fetch.

import { parsePage } from '../../audit/parse.mjs';
import { rules as ENGINE_RULES } from '../../audit/rules/index.mjs';
import { normalise } from '../../audit/cross.mjs';
import CATALOG from '../../audit/rules/catalog.json' assert { type: 'json' };

// 2 MB — mode=cross posts the page summaries BACK to the server, so on a
// 100-page crawl with link lists this is a few hundred KB. Cloudflare's own
// body limit is far higher; this only rejects absurd payloads.
const MAX_BODY = 2000000;
const FETCH_TIMEOUT = 12000;         // per-URL fetch cap
const MAX_BYTES = 1500000;           // 1.5 MB body cap — same as /api/fetch
const MAX_HOPS = 6;                  // redirect chain cap
const UA = 'Mozilla/5.0 (compatible; Tools4Market-SiteAudit/1.0; +https://tools4market.online)';

// SSRF guard — identical to /api/fetch. Never reach loopback / private / metadata.
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]', 'metadata.google.internal', '169.254.169.254'];
function isPrivateIPv4(host) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const a = Number(m[1]), b = Number(m[2]);
  return a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a === 0;
}
function hostAllowed(u) {
  const h = u.hostname.toLowerCase();
  return !BLOCKED_HOSTS.includes(h) && !isPrivateIPv4(h);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function str(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }

// ---------------------------------------------------------------------------
// Fetching. Mode=pages follows redirects BY HAND so `redirect-permanent` can see
// a 302 where a 301 belongs (redirect:'follow' erases that). Modes discover and
// links only need a final status, so they follow redirects in one hop.
// ---------------------------------------------------------------------------
async function fetchPage(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    let res;
    try {
      res = await fetch(current, {
        redirect: 'manual',
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
        headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'accept-language': 'en' },
      });
    } catch (e) {
      return { url, finalUrl: current, status: 0, headers: {}, body: '', bytes: 0, chain, error: String((e && e.message) || e) };
    }
    const headers = {};
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    chain.push({ url: current, status: res.status, location: headers.location || null });
    if (res.status >= 300 && res.status < 400 && headers.location) {
      current = new URL(headers.location, current).toString();
      try { await res.arrayBuffer(); } catch {}
      continue;
    }
    const buf = await res.arrayBuffer();
    const truncated = buf.byteLength > MAX_BYTES;
    const body = new TextDecoder('utf-8').decode(truncated ? buf.slice(0, MAX_BYTES) : buf);
    return { url, finalUrl: current, status: res.status, headers, body, bytes: buf.byteLength, truncated, chain };
  }
  return { url, finalUrl: current, status: 0, headers: {}, body: '', bytes: 0, chain, error: 'redirect loop' };
}

async function fetchStatus(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(FETCH_TIMEOUT), headers: { 'user-agent': UA, accept: '*/*' } });
    try { await res.arrayBuffer(); } catch {}
    return { url, status: res.status };
  } catch (e) {
    return { url, status: 0, error: String((e && e.message) || e) };
  }
}

// ---------------------------------------------------------------------------
// The visitor context. The engine's rules read a "context" (catalogue, per-path
// expectations). For a third-party site we keep the numeric thresholds (title
// length, description length, HTML weight…) but neutralise everything that
// encodes OUR templates: expected schema types become empty, and the catalogue
// lookups (toolOf/articleOf/entryFor) return null so any focus-phrase or
// related-tool rule degrades to "not applicable" instead of firing falsely.
// ---------------------------------------------------------------------------
function visitorCatalog() {
  // One shallow clone; the imported CATALOG object itself is never mutated, so
  // our internal `npm run audit` still sees the pristine thresholds.
  const cat = JSON.parse(JSON.stringify(CATALOG));
  for (const g of Object.keys(cat.structure)) {
    if (g.startsWith('//') || typeof cat.structure[g] !== 'object') continue;  // skip "//" comment keys
    cat.structure[g].jsonld = [];          // no expected schema types for foreign pages
    cat.structure[g].adUnits = 0;          // ad layout is our policy, not a rule here
    cat.structure[g].faqVisible = false;
  }
  return cat;
}

// Rules stood down for a third-party site, with the reason each would misfire.
const ENGINE_SKIP = {
  'webapplication-offer': 'Our policy that a WebApplication must declare a free Offer — not a defect on a foreign site.',
};

// A few portable rules carry fix copy written against our own templates
// ("Set lang on the <html> tag in build.mjs:272"). The check is the same on
// any site; only the wording is ours — so a visitor's report gets the
// visitor-facing version. Message and evidence always come from the rule.
// (Exported so tests/audit-batch-test.mjs can check it against the rule ids.)
export const VISITOR_FIX = {
  'desc-length': 'Write it to 120–155 characters: that fits a desktop result in full and most mobile snippets. Below ~70 characters Google usually takes its own sentence from the page instead. One description per page, in the head or your CMS’s page settings.',
  'http-status': 'The URL does not serve a page. If it is gone, remove it from the sitemap and from the links pointing at it; if it is a server error, it is blocking visitors and crawlers until it is fixed. Check the URL in a browser first.',
  'title-present': 'Every page needs a title tag: it is what the tab and the search result show. Add one in your template or CMS page settings, 25–60 characters, unique per page.',
  'html-lang': 'Add a lang attribute to the <html> tag — lang="en", or whatever your content language is. Screen readers pronounce the page with it and search engines use it to classify it.',
  'viewport': 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the head. Without it the page renders at desktop width on a phone and search engines treat it as not mobile-friendly.',
  'canonical-present': 'Add <link rel="canonical" href="…"> to the head, pointing at this page’s preferred URL. It tells search engines which version of a duplicated URL to index.',
  'og-complete': 'Add the missing Open Graph tags to the head (or your CMS’s social-share fields). They are what Facebook, LinkedIn and Slack read when the page is shared.',
  'twitter-complete': 'Add the missing twitter:card tags to the head (or your CMS’s social-share fields). X reads them when the page is shared and falls back to a plain link without them.',
  'jsonld-present': 'Add a JSON-LD block in the head describing the page — Organization, WebSite, Article, Product or FAQPage. It is the cheapest structured-data win on the page.',
  'jsonld-valid': 'The JSON-LD is malformed, so every consumer ignores it silently. A stray comma or an unescaped quote in the object is the usual cause — validate it and paste the corrected block back.',
  'jsonld-expected-types': 'Set the missing @type in the JSON-LD. Without it search engines cannot tell what the entity is, and they skip the whole block.',
  'breadcrumb-positions': 'BreadcrumbList positions must count 1, 2, 3… in order of depth. Fix each item’s position to match its level, or drop the block — a broken breadcrumb renders as nothing.',
  'html-weight': 'The HTML document itself is over the size budget. Strip inlined data, duplicated blocks and dead JSON: the document is on the critical path for every render.',
};

function makeCtx() {
  const cat = visitorCatalog();
  return {
    catalog: cat,
    env: { enabled: false, configured: false },
    tools: [], articles: [],
    groupOf: (p) => (p === '/' ? 'home' : p.startsWith('/tools/') ? 'tools' : p.startsWith('/blog/') && p !== '/blog/' ? 'blog' : 'pages'),
    toolOf: () => null,
    articleOf: () => null,
    entryFor: () => null,
    noindexAllowed: new Set(),
  };
}

// ---------------------------------------------------------------------------
// robots.txt: parse the visitor's own rules so we can tell them when a page they
// listed is blocked for crawlers. A compact RFC-9309 group parser — the same
// shape tests/live-verify.mjs uses, trimmed to what this check needs.
// ---------------------------------------------------------------------------
function parseRobots(text) {
  const rules = [];
  let agents = [];
  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === 'user-agent') agents.push(value.toLowerCase());
    else if (field === 'disallow' || field === 'allow') {
      for (const a of agents) rules.push({ agent: a, type: field, path: value });
    } else agents = [];
  }
  return rules;
}
// Longest matching rule wins; a rule that does not match the path is skipped.
function robotsBlocked(rules, path) {
  let best = null;
  for (const r of rules) {
    if (r.agent !== '*' && r.agent !== 'tools4market-siteaudit') continue;
    if (!r.path) continue;                                  // empty Disallow = allow all
    if (!path.startsWith(r.path)) continue;
    if (!best || r.path.length > best.path.length) best = r;
  }
  return best && best.type === 'disallow' ? best : null;
}

// ---------------------------------------------------------------------------
// Per-page rules: the portable engine subset + the visitor-only checks.
// ---------------------------------------------------------------------------
const visitorRules = [
  {
    id: 'thin-content',
    group: 'content',
    severity: 'major',
    test(p) {
      const words = p.words.body;
      if (words >= 300) return null;
      return {
        message: `${words} words of visible text (want ≥300)`,
        fix: 'Thin pages rarely rank and rarely convert. Add a section that answers a question the current copy skips — do not pad with repetition.',
        evidence: { words },
      };
    },
  },
];

function runRulesForPage(p, ctx, robotsRules, statusOnly = false) {
  const findings = [];
  for (const rule of ENGINE_RULES) {
    if (statusOnly && rule.id !== 'http-status') continue;   // error page: the status is the finding
    if (rule.group === 'brand') continue;                 // ad-intent is our own policy
    if (ENGINE_SKIP[rule.id]) continue;
    let res = null;
    try { res = rule.test(p, ctx); } catch (err) { continue; }  // a rule must never throw; never block the visitor
    if (res) {
      const f = { id: rule.id, severity: rule.severity, group: rule.group, page: p.path, ...res };
      if (VISITOR_FIX[f.id]) f.fix = VISITOR_FIX[f.id];
      findings.push(f);
    }
  }
  if (statusOnly) return findings;
  for (const rule of visitorRules) {
    let res = null;
    try { res = rule.test(p); } catch { continue; }
    if (res) findings.push({ id: rule.id, severity: rule.severity, group: rule.group, page: p.path, ...res });
  }
  // The visitor's own robots.txt blocks a page they asked us to audit — a real,
  // expensive defect (the page is listed but crawlers cannot reach it).
  if (robotsRules) {
    const hit = robotsBlocked(robotsRules, p.path);
    if (hit) {
      findings.push({
        id: 'robots-disallowed', severity: 'major', group: 'technical', page: p.path,
        message: `Blocked by your robots.txt: ${hit.type} ${hit.path}`,
        fix: 'A page in your sitemap that robots.txt blocks cannot be indexed. Either remove the Disallow or drop the URL from the sitemap — the two must agree.',
        evidence: { rule: `${hit.type}: ${hit.path}` },
      });
    }
  }
  return findings;
}

// A compact summary of one page — everything the cross phase needs, and nothing
// heavier. Sent back to the browser and posted forward to mode=cross.
function summarise(p) {
  return {
    url: p.url,
    path: p.path,
    title: p.title,
    description: p.description,
    h1: p.h1.map((h) => h.text).join(' | '),
    words: p.words.body,
    internal: [...new Set(p.links.filter((l) => l.internal && l.absolute).map((l) => l.absolute))],
    // Outbound links are capped per page: the dead-external check only needs a
    // sample, and this field is posted BACK to mode=cross (payload budget).
    external: [...new Set(p.links.filter((l) => !l.internal && l.absolute).map((l) => l.absolute))].slice(0, 10),
  };
}

// ---------------------------------------------------------------------------
// Handlers per mode.
// ---------------------------------------------------------------------------
async function modeDiscover(origin) {
  const robotsUrl = origin + '/robots.txt';
  const sitemapUrl = origin + '/sitemap.xml';
  const [robotsRes, sitemapRes] = await Promise.all([fetchStatus(robotsUrl), fetchStatus(sitemapUrl)]);
  let robotsText = '';
  if (robotsRes.status === 200) {
    const r = await fetch(robotsUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT), headers: { 'user-agent': UA } }).catch(() => null);
    if (r) robotsText = await r.text().catch(() => '');
  }
  let sitemapText = '';
  if (sitemapRes.status === 200) {
    const s = await fetch(sitemapUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT), headers: { 'user-agent': UA } }).catch(() => null);
    if (s) sitemapText = (await s.text().catch(() => '')).slice(0, 200000);
  }

  const locs = [...sitemapText.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  const isIndex = /<sitemapindex[\s>]/.test(sitemapText);

  // A sitemap index names child sitemaps; fetch up to 3 and merge their locs.
  let urls = [];
  let childCount = 0;
  if (isIndex) {
    const children = locs.slice(0, 3);
    childCount = children.length;
    for (const c of children) {
      const u = new URL(c, origin);
      if (!hostAllowed(u)) continue;
      const res = await fetch(c, { signal: AbortSignal.timeout(FETCH_TIMEOUT), headers: { 'user-agent': UA } }).catch(() => null);
      if (!res || !res.ok) continue;
      const text = (await res.text().catch(() => '')).slice(0, 200000);
      urls.push(...[...text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]));
    }
  } else {
    urls = locs;
  }

  // Keep only same-origin URLs, de-dupe, cap at 100.
  const originHost = new URL(origin).hostname;
  const seen = new Set();
  const pageUrls = [];
  for (const u of urls) {
    let abs;
    try { abs = new URL(u, origin); } catch { continue; }
    if (!hostAllowed(abs)) continue;
    if (abs.hostname !== originHost) continue;
    const key = abs.origin + abs.pathname;
    if (seen.has(key)) continue;
    seen.add(key);
    pageUrls.push(abs.toString());
    if (pageUrls.length >= 100) break;
  }

  const findings = [];
  if (sitemapRes.status === 404) {
    findings.push({ id: 'sitemap-missing', severity: 'major', group: 'technical', page: '(site)',
      message: 'No sitemap.xml at the default location',
      fix: 'Publish a sitemap and list it in robots.txt. Without it, crawlers discover pages only by following links — the slowest path to full coverage.' });
  } else if (sitemapRes.status !== 200) {
    findings.push({ id: 'sitemap-unreachable', severity: 'major', group: 'technical', page: '(site)',
      message: `sitemap.xml returned HTTP ${sitemapRes.status}`,
      fix: 'The sitemap must resolve. A 5xx here means the generator or the host is failing on that path.' });
  } else if (!pageUrls.length) {
    findings.push({ id: 'sitemap-empty', severity: 'major', group: 'technical', page: '(site)',
      message: 'Sitemap parsed but listed no same-origin page URLs',
      fix: 'Check the sitemap emits absolute <loc> URLs on your own origin. A CDN or www/apex mismatch makes every entry off-origin.' });
  }
  if (robotsRes.status === 404) {
    findings.push({ id: 'robots-missing', severity: 'minor', group: 'technical', page: '/robots.txt',
      message: 'No robots.txt',
      fix: 'robots.txt is optional, but its absence means default allow-all plus no sitemap declaration. Publish one that points at your sitemap.' });
  }

  const robotsRules = parseRobots(robotsText);
  const sitemapDeclared = [...robotsText.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);

  return {
    ok: true, origin, urls: pageUrls, totalFound: urls.length, truncated: urls.length > pageUrls.length,
    sitemap: { status: sitemapRes.status, isIndex, childCount, declared: sitemapDeclared },
    robots: { status: robotsRes.status, rules: robotsRules, sitemaps: sitemapDeclared },
    findings,
  };
}

async function modePages(urls, robotsRules) {
  const ctx = makeCtx();
  const pages = [];
  const results = await Promise.all(urls.map(fetchPage));
  for (const fetched of results) {
    let target;
    try { target = new URL(fetched.url); } catch { continue; }
    if (!hostAllowed(target)) continue;
    const p = parsePage(fetched);
    const findings = runRulesForPage(p, ctx, robotsRules);
    pages.push({ url: p.url, status: p.status, finalUrl: p.finalUrl, findings, summary: summarise(p) });
  }
  return { ok: true, pages };
}

async function modeLinks(urls) {
  const results = await Promise.all(urls.map(fetchStatus));
  return { ok: true, results };
}

function modeCross(summaries, linkResults) {
  const findings = [];
  const siteOrigin = summaries.length ? new URL(summaries[0].url).origin : null;
  // Every URL key goes through audit/cross.mjs normalise() — the SAME function
  // our internal audit uses — so `/page` and `/page/` are one target, never a
  // false orphan or a split link count.
  const key = (u) => normalise(u);
  const linkStatus = new Map((linkResults || []).map((r) => [key(r.url), r.status]));

  // Duplicate title / description / H1 across the crawled pages.
  const dupes = (keyFn, id, label) => {
    const map = new Map();
    for (const s of summaries) {
      const v = keyFn(s);
      if (!v) continue;
      if (!map.has(v)) map.set(v, []);
      map.get(v).push(s.path);
    }
    for (const [v, list] of map) {
      if (list.length < 2) continue;
      findings.push({ id, severity: 'major', group: 'cross', page: list[0],
        message: `${label} shared by ${list.length} pages: ${list.slice(0, 6).join(', ')}`,
        fix: 'Two pages competing for one query split the signal and search engines pick the wrong one. Rewrite one for a distinct job.',
        evidence: { value: str(v, 120) } });
    }
  };
  dupes((s) => s.title, 'duplicate-title', 'Title');
  dupes((s) => s.description, 'duplicate-description', 'Meta description');
  dupes((s) => s.h1, 'duplicate-h1', 'H1');

  // Orphan pages within the crawl: no other crawled page links here.
  const inbound = new Set();
  for (const s of summaries) {
    for (const t of s.internal || []) {
      const k = key(t);
      if (k) inbound.add(k);
    }
  }
  for (const s of summaries) {
    const k = key(s.url);
    if (!inbound.has(k)) {
      findings.push({ id: 'orphan-page', severity: 'major', group: 'cross', page: s.path,
        message: 'No inbound links from any other crawled page',
        fix: 'An orphan is discoverable only through the sitemap — weaker than a real link. Link it from its section or a related article.' });
    }
  }

  // Broken internal: a same-origin link target whose checked status is 4xx/5xx.
  const counted = new Map();
  for (const s of summaries) {
    for (const t of s.internal || []) {
      let origin = null, k = null;
      try { origin = new URL(t).origin; } catch { continue; }
      k = key(t);
      if (!k) continue;
      if (!counted.has(k)) counted.set(k, { sources: [], origin });
      if (counted.get(k).sources.length < 5) counted.get(k).sources.push(s.path);
    }
  }
  for (const [target, info] of counted) {
    if (info.origin !== siteOrigin) continue;           // only same-site links are checked here
    const status = linkStatus.get(target);
    if (status === undefined || status === 0) continue; // not checked, or network error — never a false finding
    if (status < 400) continue;
    findings.push({ id: 'broken-internal', severity: 'blocker', group: 'cross', page: info.sources[0],
      message: `Internal link to ${target} returns HTTP ${status} (${info.sources.length} page(s) link it)`,
      fix: 'A 404 inside your own site is the most expensive kind of error: real visitors hit it and crawlers waste crawl budget. Fix the link or restore the page.',
      evidence: { target, status, linkedFrom: info.sources } });
  }

  // Dead external: outbound link targets the client checked that came back 4xx/5xx.
  for (const r of linkResults || []) {
    let u; try { u = new URL(r.url); } catch { continue; }
    if (u.origin === siteOrigin) continue;              // internal handled above
    if (r.status === 0 || r.status < 400) continue;
    findings.push({ id: 'dead-external', severity: 'major', group: 'cross', page: '(site)',
      message: `Outbound link to ${r.url} returns HTTP ${r.status}`,
      fix: 'A dead outbound link reads as neglect and wastes a citation. Point it at the live source or remove it.',
      evidence: { target: r.url, status: r.status } });
  }

  return { ok: true, findings };
}

// ---------------------------------------------------------------------------
// Entry point.
// ---------------------------------------------------------------------------
export async function handleAuditBatch(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405);

  // Same-origin only — this endpoint fetches on the caller's behalf, so another
  // site must not be able to relay-fetch through us.
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return json({ ok: false, error: 'Cross-origin requests are not allowed.' }, 403);

  let raw;
  try { raw = await request.text(); } catch { raw = ''; }
  if (raw.length > MAX_BODY) return json({ ok: false, error: 'Request too large.' }, 413);

  let body;
  try { body = JSON.parse(raw || '{}'); } catch { return json({ ok: false, error: 'Invalid JSON body.' }, 400); }

  const mode = String(body.mode || '');
  const started = Date.now();

  try {
    if (mode === 'discover') {
      let originUrl;
      try { originUrl = new URL(String(body.origin || '')); } catch { return json({ ok: false, error: 'Invalid origin URL.' }, 400); }
      if (originUrl.protocol !== 'http:' && originUrl.protocol !== 'https:') return json({ ok: false, error: 'Only http/https origins.' }, 400);
      if (!hostAllowed(originUrl)) return json({ ok: false, error: 'That host is not allowed.' }, 403);
      const base = originUrl.origin;
      const res = await modeDiscover(base);
      return json({ ...res, ms: Date.now() - started });
    }

    if (mode === 'pages') {
      const urls = Array.isArray(body.urls) ? body.urls.slice(0, 4) : [];
      if (!urls.length) return json({ ok: false, error: 'No URLs supplied.' }, 400);
      for (const u of urls) {
        let parsed; try { parsed = new URL(u); } catch { return json({ ok: false, error: 'Invalid URL in batch.' }, 400); }
        if (!hostAllowed(parsed)) return json({ ok: false, error: 'That host is not allowed.' }, 403);
      }
      const robotsRules = Array.isArray(body.robotsRules) ? body.robotsRules : null;
      const res = await modePages(urls, robotsRules);
      return json({ ...res, ms: Date.now() - started });
    }

    if (mode === 'links') {
      const urls = Array.isArray(body.urls) ? body.urls.slice(0, 10) : [];
      if (!urls.length) return json({ ok: false, error: 'No URLs supplied.' }, 400);
      for (const u of urls) {
        let parsed; try { parsed = new URL(u); } catch { return json({ ok: false, error: 'Invalid URL in batch.' }, 400); }
        if (!hostAllowed(parsed)) return json({ ok: false, error: 'That host is not allowed.' }, 403);
      }
      const res = await modeLinks(urls);
      return json({ ...res, ms: Date.now() - started });
    }

    if (mode === 'cross') {
      const summaries = Array.isArray(body.summaries) ? body.summaries.slice(0, 120) : [];
      if (!summaries.length) return json({ ok: false, error: 'No page summaries supplied.' }, 400);
      const res = modeCross(summaries, Array.isArray(body.linkResults) ? body.linkResults : []);
      return json({ ...res, ms: Date.now() - started });
    }

    return json({ ok: false, error: 'Unknown mode. Use discover, pages, links or cross.' }, 400);
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e), ms: Date.now() - started }, 502);
  }
}

// Cloudflare Pages Function export (this file also deploys as /api/audit-batch
// when the project runs on Pages instead of the Worker).
export async function onRequestPost(context) { return handleAuditBatch(context.request, context.env); }
export async function onRequestOptions() { return new Response(null, { status: 204 }); }

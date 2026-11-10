#!/usr/bin/env node
// Tools4Market — static site generator. Run: node build.mjs
import { rm, mkdir, writeFile, copyFile, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { TOOLS, CATEGORIES, POLICY, HOME_FAQS, JOBS, EDITOR_PICKS, SEARCH_EXAMPLES, weekIndex } from './src/data/index.js';
import { INSPECT_TEXT, AUDIT, SCORE, SITE_AUDIT } from './src/data/inspect.js';
import { ARTICLES } from './src/data/blog.js';
import { AUTHORS } from './src/data/authors.js';
import { toolIcon, catIcon } from './src/icons.mjs';
import { catalogChart, processingChart, guideFigure, guideThumb, toolPreview, GUIDE_FIGURE_SLUGS, PREVIEW_SLUGS } from './src/visuals.mjs';

const R = fileURLToPath(new URL('.', import.meta.url));
const YEAR = new Date().getFullYear();

// ---- Asset cache-busting -------------------------------------------------
// `/assets/*` and `/fonts/*` are served `max-age=31536000, immutable`, but the
// filenames are stable, so an in-place edit (style.css, a runtime file, an icon)
// would never reach a returning visitor. Append `?v=<hash>` to every HTML asset
// reference: the bytes change → the URL changes → the cache is bypassed, while
// the bare path still resolves for crawlers that drop the query string.
// (Suggestion logged 23 Oct in suggest.md; implemented here for the v2.11 mark.)
const ASSET_V = await (async () => {
  const h = createHash('sha256');
  const dirs = ['src/assets', 'src/runtime', 'src/data', 'src/fonts', 'src/vendor'];
  const files = ['src/style.css', 'src/site.js'];
  for (const d of dirs) {
    try {
      for (const f of (await readdir(R + d)).sort()) {
        if (/\.(js|css|png|svg|woff2)$/.test(f)) files.push(d + '/' + f);
      }
    } catch { /* directory not present */ }
  }
  for (const f of files) h.update(await readFile(R + f));
  return h.digest('hex').slice(0, 8);
})();
const av = (path, p) => rel(path, p) + '?v=' + ASSET_V;

// "22 October 2026" for the visible Last-updated labels (ISO date → long form)
const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

const SITE = {
  name: 'Tools4Market',
  url: (process.env.SITE_URL || 'https://tools4market.online').replace(/\/+$/, ''), // canonical host — www redirects here at the zone level
  email: process.env.SITE_EMAIL || 'support@tools4market.online',
  tagline: 'Free Marketing, SEO & AI-Search Tools',
};

// ---- Integration switches (set as build env vars; unset = feature stays off)
// GA4 measurement id, e.g. G-ABC123XYZ
const GA_ID = (process.env.GA_ID || 'G-6B4GGFC96K').trim();
// AdSense publisher id, e.g. ca-pub-0000000000000000
const ADSENSE_CLIENT = (process.env.ADSENSE_CLIENT || 'ca-pub-1509697031230558').trim();
// Bing Webmaster Tools site-verification id (also shipped as /BingSiteAuth.xml)
const BING_VERIFY = (process.env.BING_VERIFY || '77EFF8B735065A945570BBFD566B0530').trim();
// Google Tag Manager container id. OFF by default ("unset = feature stays off"):
// the container was audited (2026-10) and holds no GA4 measurement id — GA4 runs
// through the direct Google tag above — so gtm.js (~560 KB parsed on every page)
// bought nothing while costing main-thread time. Set GTM_ID in .env to re-enable
// once the container has real tags.
const GTM_ID = (process.env.GTM_ID || '').trim();
// Consent mode scope: 'basic' = denied in EEA/UK/CH, granted elsewhere (Google's
// recommended "basic" mode). 'advanced' = denied for every visitor, everywhere.
const CONSENT_MODE = (process.env.CONSENT_MODE || 'basic').trim().toLowerCase();
// Consent types (v2) + the region that requires a banner before anything is stored.
const CONSENT_TYPES = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];
const CONSENT_REGION = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK', 'GB', 'CH'];
// Google Search Console site-verification token (HTML-method verification).
// The domain property is already verified via a DNS TXT record, so this stays
// empty by default; set it when a second property needs the meta tag.
const GOOGLE_VERIFY = (process.env.GOOGLE_SITE_VERIFY || '').trim();
// IndexNow key (a stable 32-char hex string you generate once). When set, the
// build publishes /{key}.txt so participating engines can verify the host, and
// `npm run indexnow` can submit changed URLs.
const INDEXNOW_KEY = (process.env.INDEXNOW_KEY || '').trim();
if (INDEXNOW_KEY && !/^[a-zA-Z0-9-]{8,128}$/.test(INDEXNOW_KEY)) {
  throw new Error('INDEXNOW_KEY must be 8–128 letters/digits/dashes (got: ' + INDEXNOW_KEY + ')');
}
// ---- AdSense ------------------------------------------------------------
// `data-ad-slot` must be the NUMERIC unit id from AdSense → Ads → By ad unit.
// A value like `ca-pub-123:0/0` is not a slot id: the tag renders, the request
// is malformed and nothing fills. Accept both shapes defensively and keep only
// the numeric tail, so a pasted `ca-pub-…:1234567890` still works and a bad
// value degrades to reserved space instead of a broken unit.
const slotId = (raw) => {
  const v = String(raw || '').trim();
  const m = /^ca-pub-\d+:(\d+)$/.exec(v);
  if (m) return m[1];
  return /^\d{6,}$/.test(v) ? v : '';
};

// Per-position AdSense ad unit ids
const AD_SLOTS = {
  'top banner': slotId(process.env.AD_SLOT_TOP),
  'below content': slotId(process.env.AD_SLOT_CONTENT),
  sidebar: slotId(process.env.AD_SLOT_SIDEBAR),
};

// Loader policy (owner unblocked AdSense 24 Oct 2026):
//   ADSENSE_ENABLED=1            → ship adsbygoogle.js (site verification + policy review)
//   any numeric AD_SLOT_* set    → ship it too, and render real <ins> units
// No numeric slot yet → reserved-space placeholders only, no broken units.
const ADSENSE_ENABLED = /^(1|true|yes|on)$/i.test((process.env.ADSENSE_ENABLED || '').trim());
const AD_SLOTS_ON = ADSENSE_ENABLED || Object.values(AD_SLOTS).some(Boolean);

// Build guard (27–28 Oct 2026). Ads disappeared from the live site three times in
// one day: twice from a shell where `.env` was not sourced, and once from a
// checkout that had no `.env` at all. Every build was green, because the absence
// of an environment variable cannot be told apart from a decision to run without
// ads. `.env` records intent locally but is gitignored, so intent has to live in
// the repo: ads.config.json says what this site is, `.env` says how to reach it.
// ALLOW_ADS_OFF=1 is the explicit override for a deliberately ad-free build.
const ADS_INTENT = await readFile(R + 'ads.config.json', 'utf8').then(JSON.parse).catch(() => ({}));
if (ADS_INTENT.adsEnabled && !ADSENSE_ENABLED && !process.env.ALLOW_ADS_OFF) {
  console.error(
    '\n!! ads.config.json says this site runs ads, but this build has no AdSense environment.\n' +
    '!! Shipping it would publish 80 pages with no loader and no ad units.\n\n' +
    '   Fix:  set -a && source .env && set +a && npm run deploy\n' +
    '   If this checkout has no .env, copy one from the machine that has it.\n' +
    '   Or, for a deliberately ad-free build:  ALLOW_ADS_OFF=1 npm run build\n'
  );
  process.exit(1);
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// relative link between two root-relative paths ('/x/y/' style)
function rel(from, to) {
  const f = from.split('/').filter(Boolean);
  const t = to.split('/').filter(Boolean);
  let i = 0;
  while (i < f.length && i < t.length && f[i] === t[i]) i++;
  const tail = t.slice(i).join('/');
  // Same path: `tail` is empty and the concatenation collapsed to "", which
  // produced `href=""` on the homepage logo (found by the 27 Oct sitemap audit).
  // "./" is the correct relative self-reference.
  if (!tail) return f.length - i === 0 ? './' : '../'.repeat(f.length - i);
  return '../'.repeat(f.length - i) + tail + (to.endsWith('/') ? '/' : '');
}

// escape, then re-allow **bold** and `code` markers for our own content
const rich = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

const ldTag = (obj) => '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>';

const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem', position: index + 1, name: item.name,
    ...(index < items.length - 1 ? { item: SITE.url + item.path } : {}),
  })),
});

// Cookie consent UI — rendered on every page. Hidden until the visitor chooses
// (site.js reveals it), so no analytics storage is written before consent.
function consentBanner(path) {
  return `<div class="ck-banner" id="ck-banner" hidden role="region" aria-label="Cookie consent">
  <div class="ck-inner container">
    <p class="ck-text">We use cookies to measure how the tools are used (Google Tag Manager) and, once ads are enabled, to show relevant ads. Nothing is stored on your device until you choose. <a href="${rel(path, '/privacy-policy/')}">Privacy policy</a></p>
    <div class="ck-actions">
      <button type="button" class="btn btn-ghost" id="ck-manage">Manage preferences</button>
      <button type="button" class="btn btn-ghost" id="ck-reject">Reject non-essential</button>
      <button type="button" class="btn" id="ck-accept">Accept all</button>
    </div>
  </div>
</div>
<div class="ck-modal" id="ck-panel" hidden role="dialog" aria-modal="true" aria-labelledby="ck-panel-title">
  <div class="ck-box">
    <h2 id="ck-panel-title">Cookie preferences</h2>
    <p class="ck-note">Choose what we may store on your device. Essential cookies keep the site working and are always on.</p>
    <label class="ck-row">
      <input type="checkbox" id="ck-analytics" checked>
      <span><strong>Analytics</strong><span class="ck-desc">Google Tag Manager measures site use. Pasted text and image files stay in your browser; page checks send the URL you ask us to inspect.</span></span>
    </label>
    <label class="ck-row">
      <input type="checkbox" id="ck-ads">
      <span><strong>Ads</strong><span class="ck-desc">Personalised advertising (Google AdSense) — used only if you accept.</span></span>
    </label>
    <div class="ck-actions">
      <button type="button" class="btn btn-ghost" id="ck-close">Close</button>
      <button type="button" class="btn" id="ck-save">Save choices</button>
    </div>
  </div>
</div>`;
}

// ---- Per-page script loading -------------------------------------------
// Every page used to ship site.js + all seven runtime files (~210 KB JS) even
// though a page needs only its own tool's runtime. PageSpeed flagged ~550 KB
// of unused JavaScript per visit. Now: static pages load site.js only; a tool
// page loads its category runtime, the inspect engine only when the tool has a
// results panel (local tools skip it), and audit.js only for the two audit tools.
const RUNTIME_FILE = { seo: 'seo.js', ai: 'ai-search.js', content: 'content.js', web: 'web.js', marketing: 'marketing.js' };
const AUDIT_SLUGS = new Set(['seo-score-checker', 'web-crawler-audit']);
// Slug-level override: tools whose orchestration doesn't fit their category
// runtime get their own file (website-audit drives a multi-batch crawl).
const SLUG_RUNTIME = { 'website-audit': 'site-audit.js' };
// Tools that never mount the "Analyze your own page" panel skip the inspect
// engine entirely — website-audit owns its URL field and crawls server-side,
// so the panel would be dead weight on the page.
const NO_PANEL = new Set(['website-audit']);
// A tool that needs a self-contained third-party library ships it as one extra
// classic script, loaded before the category runtime that calls it. Currently
// one: the QR encoder (MIT, Kazuhiko Arase), vendored in src/vendor/ rather
// than installed — the build still has no npm dependencies.
const VENDOR_SCRIPTS = { 'qr-code-generator': ['vendor/qrcode.js'] };
function pageScripts(path, tool) {
  const files = ['site.js'];
  if (tool) {
    files.push('inspect-strings.js', ...(VENDOR_SCRIPTS[tool.slug] || []));
    files.push('runtime/' + (SLUG_RUNTIME[tool.slug] || RUNTIME_FILE[tool.cat]));
    if (!LOCAL_TOOLS.has(tool.slug) && !NO_PANEL.has(tool.slug)) files.push('runtime/inspect.js');
    if (AUDIT_SLUGS.has(tool.slug)) files.push('runtime/audit.js');
  }
  return files.map((f) => `<script defer src="${av(path, '/assets/' + f)}"></script>`).join('\n');
}

function layout({ path, title, desc, body, ld = [], noindex = false, tool = null }) {
  const url = SITE.url + path;
  // ---- consent defaults (Consent Mode v2) — pushed BEFORE GTM loads, so no
  // analytics/ad storage is written until the visitor accepts.
  // ---- Consent Mode v2 (Google's documented order matters) ---------------
  // 1. define dataLayer + gtag   2. set the default consent state
  // 3. load the tags             4. update the state on user interaction (site.js)
  const consentDefaults = `<script>
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;

  var TYPES = ${JSON.stringify(CONSENT_TYPES)};
  var REGION = ${JSON.stringify(CONSENT_REGION)};
  var MODE = '${esc(CONSENT_MODE)}';

  // A returning visitor's stored choice is restored BEFORE any tag loads, so the
  // correct state is set on subsequent page loads (Google: "Persistence").
  var stored = null;
  try { stored = JSON.parse(window.localStorage.getItem('t4m_consent') || 'null'); } catch (e) {}

  function state(analytics, ads) {
    var o = {};
    TYPES.forEach(function (t) {
      o[t] = (t === 'analytics_storage') ? (analytics ? 'granted' : 'denied') : (ads ? 'granted' : 'denied');
    });
    return o;
  }

  if (stored) {
    gtag('consent', 'default', state(!!stored.analytics, !!stored.ads));
    window.dataLayer.push({ event: 'default_consent', scope: 'stored', ad_storage: stored.ads ? 'granted' : 'denied',
      ad_user_data: stored.ads ? 'granted' : 'denied', ad_personalization: stored.ads ? 'granted' : 'denied',
      analytics_storage: stored.analytics ? 'granted' : 'denied' });
  } else if (MODE === 'advanced') {
    // Advanced consent mode: nothing is sent anywhere until the visitor agrees.
    gtag('consent', 'default', state(false, false));
    window.dataLayer.push({ event: 'default_consent', scope: 'advanced', ad_storage: 'denied', ad_user_data: 'denied',
      ad_personalization: 'denied', analytics_storage: 'denied' });
  } else {
    // Basic consent mode: denied in the EEA/UK/CH, granted elsewhere.
    // wait_for_update gives our banner 500 ms to answer before tags fire.
    var denied = state(false, false);
    denied.wait_for_update = 500;
    denied.region = REGION;
    gtag('consent', 'default', denied);
    gtag('consent', 'default', state(true, true));
    window.dataLayer.push({ event: 'default_consent', scope: 'basic', region: REGION, ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  }

  // Pass ad-click/click-id info through URLs without cookies (consent denied
  // regions) and redact ad identifiers when ad_storage is denied.
  gtag('set', 'url_passthrough', true);
  gtag('set', 'ads_data_redaction', true);
})();
</script>`;
  // Google's Google tag (gtag.js) — exactly the snippet from the GA4 property,
  // placed immediately after the consent defaults (Consent Mode v2 requires the
  // default state to run before any tag that can send a measurement event).
  const gaTag = GA_ID ? `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(GA_ID)}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${esc(GA_ID)}');
</script>` : '';
  const adsenseLoader = ADSENSE_CLIENT && AD_SLOTS_ON ? `<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(ADSENSE_CLIENT)}"
     crossorigin="anonymous"></script>` : '';
  const gtmHead = GTM_ID ? `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${esc(GTM_ID)}');</script>
<!-- End Google Tag Manager -->` : '';
  const gtmBody = GTM_ID ? `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(GTM_ID)}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${consentDefaults}${gaTag}${gtmHead}${adsenseLoader}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${url}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.url}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${SITE.name} — free browser-based marketing, SEO and AI-search tools">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE.url}/assets/og-image.png">
${BING_VERIFY ? `<meta name="msvalidate.01" content="${esc(BING_VERIFY)}">` : ''}
${GOOGLE_VERIFY ? `<meta name="google-site-verification" content="${esc(GOOGLE_VERIFY)}">` : ''}
<link rel="preload" as="font" type="font/woff2" crossorigin href="${rel(path, '/fonts/fraunces-latin.woff2')}">
<link rel="preload" as="font" type="font/woff2" crossorigin href="${rel(path, '/fonts/inter-latin.woff2')}">
${AD_SLOTS_ON ? '<link rel="preconnect" href="https://pagead2.googlesyndication.com">' : ''}
<link rel="icon" type="image/svg+xml" href="${av(path, '/assets/favicon.svg')}">
<link rel="icon" type="image/x-icon" href="${rel(path, '/favicon.ico')}">
<link rel="apple-touch-icon" sizes="180x180" href="${av(path, '/assets/apple-touch-icon.png')}">
<link rel="manifest" href="${rel(path, '/manifest.webmanifest')}">
<link rel="sitemap" type="application/xml" href="${rel(path, '/sitemap.xml')}">
<link rel="alternate" type="text/plain" href="${rel(path, '/llms.txt')}">
<link rel="alternate" type="application/rss+xml" title="${SITE.name} — Guides" href="/feed.xml">
<meta name="theme-color" content="#0b172f">
<link rel="stylesheet" href="${av(path, '/assets/style.css')}">
${ld.map(ldTag).join('\n')}
</head>
<body>
${gtmBody}
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="${rel(path, '/')}"><img class="logo-mark" src="${av(path, '/assets/logo-mark.png')}" alt="" width="34" height="34" decoding="async"><span>Tools4Market</span></a>
    <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">
      <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      <span class="nav-toggle-label">Menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      ${Object.values(CATEGORIES).map((c) => `<a href="${rel(path, '/' + c.slug + '/')}\"${path.startsWith('/' + c.slug + '/') ? ' aria-current="page"' : ''}>${c.nav}</a>`).join('')}
      <a href="${rel(path, '/blog/')}\"${path.startsWith('/blog/') ? ' aria-current="page"' : ''}>Guides</a>
      <a href="${rel(path, '/about/')}\"${path.startsWith('/about/') ? ' aria-current="page"' : ''}>About</a>
      <a href="${rel(path, '/contact/')}\"${path.startsWith('/contact/') ? ' aria-current="page"' : ''}>Contact</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="footer-brand-bar"></div>
  <div class="container footer-grid">
    <div>
      <a class="logo" href="${rel(path, '/')}"><img class="logo-mark" src="${av(path, '/assets/logo-mark.png')}" alt="" width="34" height="34" decoding="async"><span>Tools4Market</span></a>
      <p>Free browser-based tools for marketers, bloggers and webmakers. Most tools process input in your browser; page checks fetch the public URL through our first-party proxy. No signup, no limits.</p>
    </div>
    <div>
      <h2 class="footer-head">Categories</h2>
      ${Object.values(CATEGORIES).map((c) => `<a href="${rel(path, '/' + c.slug + '/')}">${c.name}</a>`).join('')}
    </div>
    <div>
      <h2 class="footer-head">Company</h2>
      <a href="${rel(path, '/blog/')}">Guides</a>
      ${POLICY.map((p) => `<a href="${rel(path, '/' + p.slug + '/')}">${p.title}</a>`).join('')}
    </div>
    <div>
      <h2 class="footer-head">Popular tools</h2>
      ${['robots-txt-generator', 'meta-tag-generator', 'open-graph-generator', 'keyword-density-checker', 'llms-txt-generator', 'utm-link-builder'].map((s) => {
        const t = TOOLS.find((x) => x.slug === s);
        return t ? `<a href="${rel(path, '/tools/' + s + '/')}">${t.name}</a>` : '';
      }).join('')}
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; ${YEAR} ${SITE.name} &middot; ${SITE.tagline} &middot; <a href="${rel(path, '/privacy-policy/')}">Privacy</a> &middot; <a href="${rel(path, '/terms/')}">Terms</a> &middot; <a href="${rel(path, '/disclaimer/')}">Disclaimer</a> &middot; <button type="button" class="footer-ck" data-ck-settings>Cookie settings</button></p>
    <a class="launchstag-badge" href="https://launchstag.com" target="_blank" rel="noopener"><img src="https://launchstag.com/badge-dark.svg" alt="Featured on Launchstag" width="198" height="62" decoding="async" fetchpriority="low"></a>
  </div>
</footer>
${consentBanner(path)}
${pageScripts(path, tool)}
</body>
</html>`;
}

const toolCard = (t, path, showProc = true) => `<a class="tool-card" href="${rel(path, '/tools/' + t.slug + '/')}" data-slug="${esc(t.slug)}" data-search="${esc((t.name + ' ' + t.card + ' ' + t.keywords + ' ' + (t.usedFor || '')).toLowerCase())}">
  <span class="tool-icon" aria-hidden="true">${toolIcon(t.slug)}</span>
  <span class="tool-card-body"><strong>${t.name}</strong><span>${t.card}</span>${t.usedFor ? `<span class="tool-used">${esc(t.usedFor)}</span>` : ''}${showProc ? `<span class="tool-proc">${procNote(t)}</span>` : ''}</span>
</a>`;
// A processing label earns its place only on the cards that differ from the
// rest of the grid; repeating the same line on every card says nothing.
const majorityProc = (list) => {
  const count = new Map();
  for (const t of list) count.set(procNote(t), (count.get(procNote(t)) || 0) + 1);
  let top = null, n = 0;
  for (const [k, v] of count) if (v > n) { top = k; n = v; }
  return n > 1 ? top : null;
};

// Ad slot. Renders a real AdSense unit only when an ad-unit id is configured
// (AD_SLOT_TOP / AD_SLOT_CONTENT / AD_SLOT_SIDEBAR); until then the slot keeps
// its reserved height so enabling ads never shifts the layout (no CLS).
const adSlot = (label) => {
  const slot = AD_SLOTS[label] || '';
  if (!ADSENSE_CLIENT || !slot) {
    // No unit configured: emit an inert node, not placeholder chrome. It
    // collapses to zero height (see .ad-slot--empty), so the page reads as a
    // finished page rather than a dashed "ad goes here" box.
    return `<div class="ad-slot ad-slot--empty" aria-hidden="true"></div>`;
  }
  return `<div class="ad-slot" role="complementary" aria-label="Advertisement">
  <ins class="adsbygoogle" style="display:block" data-ad-client="${esc(ADSENSE_CLIENT)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`;
};

function homeLd() {
  return [
    {
      '@context': 'https://schema.org', '@type': 'WebSite',
      name: SITE.name, url: SITE.url + '/',
      description: `${TOOLS.length}+ free browser-based marketing, SEO, AI-search and web tools. Public-page checks fetch the entered URL through our first-party proxy. No signup, no limits.`,
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: SITE.name, url: SITE.url + '/',
      logo: { '@type': 'ImageObject', url: SITE.url + '/assets/icon-512.png', width: 512, height: 512 },
      email: SITE.email,
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: HOME_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
}

// Editor's pick of the week — rotates through EDITOR_PICKS (src/data/index.js)
// every Monday, so the hero card never goes stale without a redeploy.
const PICK_ENTRY = EDITOR_PICKS[weekIndex() % EDITOR_PICKS.length];
const PICK = TOOLS.find((t) => t.slug === PICK_ENTRY.slug) || TOOLS[0];

// Processing note per tool — an honest, varied label that tells the visitor
// what actually happens to their input. "Local" tools never leave the browser;
// the rest can also fetch a public page through our proxy. Shown on tool cards
// so cards don't all repeat the same sentence pattern.
const LOCAL_TOOLS = new Set([
  'password-generator', 'base64-encoder-decoder', 'uuid-generator', 'jwt-decoder',
  'ics-calendar-generator', 'lorem-ipsum-generator', 'user-agent-parser', 'image-compressor',
  'json-validator', 'roi-calculator', 'roas-calculator', 'cac-calculator', 'ad-metrics-calculator',
  'timestamp-converter', 'ip-converter', 'email-roi-calculator', 'marketing-budget-calculator',
  'regex-tester', 'qr-code-generator', 'word-counter', 'character-counter',
  'color-picker', 'css-minifier',
]);
// Honest card copy where the two stock notes don't fit: website-audit has no
// single-page panel (it crawls), and local tools have no server round-trip.
const PROC_NOTES = { 'website-audit': 'Full-site crawl, checked on our server' };
const procNote = (t) => PROC_NOTES[t.slug] || (LOCAL_TOOLS.has(t.slug) ? 'Runs in your browser' : 'Live page check available');

// Small line icons for the homepage job cards — one consistent 1.5px family,
// rounded caps, no emoji (emoji stay on tool cards as a friendly secondary
// label per the design system).
const JOB_ICONS = {
  'page-search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M14 3l5 5v2"/><circle cx="16.5" cy="16.5" r="3.5"/><path d="M19 19l2.5 2.5"/></svg>',
  antenna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8"/><path d="M18.4 5.6a9 9 0 0 1 0 12.8"/></svg>',
  'link-tag': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a4 4 0 0 0 5.7.4l3-3a4 4 0 0 0-5.7-5.7L11.2 6"/><path d="M14 11a4 4 0 0 0-5.7-.4l-3 3a4 4 0 0 0 5.7 5.7L12.8 18"/></svg>',
  'browser-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M6.5 6.5h.01"/><path d="M9 6.5h.01"/><path d="M8.5 14l2.5 2.5 4.5-5"/></svg>',
  'chart-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/><path d="M15.5 6H19v3.5"/></svg>',
  'page-scan': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5"/><path d="M14 3l5 5v4"/><path d="M8.5 12h4M8.5 15.5h3"/><path d="M17.5 14.5v5M15 17h5"/></svg>',
};

// Phone-sized versions of the two homepage charts. The SVG labels are part of
// the data, so shrinking them to 340px would make them 6px tall; at that width
// the same numbers are laid out as HTML instead.
const catBars = (cats, counts) => {
  const max = Math.max(...cats.map((c) => counts[c.id]));
  const tint = ['#243b63', '#0f766e', '#96682c', '#96682c', '#96682c'];
  const op = [0.92, 0.86, 0.8, 0.74, 0.68];
  return `<ul class="nb-bars">${cats.map((c, i) => `<li>
    <span class="nb-bar-label">${esc(c.nav)}</span>
    <span class="nb-bar-track"><i style="width:${Math.round((counts[c.id] / max) * 100)}%;background:${tint[i]};opacity:${op[i]}"></i></span>
    <b>${counts[c.id]}</b>
  </li>`).join('')}</ul>`;
};
const processingSplit = (local, live, audit, total) => `<div class="nb-split-wrap">
    <div class="nb-split" role="img" aria-label="${local} of ${total} tools run in the browser, ${live} read a URL, ${audit} crawls a site">
      <span class="nb-seg nb-seg--local" style="flex:${local}">${local}</span>
      <span class="nb-seg nb-seg--url" style="flex:${live}">${live}</span>
      <span class="nb-seg nb-seg--crawl" style="flex:${audit}"></span>
    </div>
    <ul class="nb-split-legend">
      <li><i class="nb-dot nb-dot--local"></i>Run in your browser. Nothing is uploaded.</li>
      <li><i class="nb-dot nb-dot--url"></i>Read a URL you paste; our proxy fetches it, then analysis runs locally.</li>
      <li><i class="nb-dot nb-dot--crawl"></i>The full-site audit crawls on our server.</li>
    </ul>
  </div>`;

function homeBody() {
  const path = '/';
  const cats = Object.values(CATEGORIES);
  const pickCat = CATEGORIES[PICK.cat];
  const latest = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);

  // Homepage proof strip — trust signals the visitor sees before scrolling.
  // Keep this list honest and current; each chip names a real property.
  const PROOF = [
    { label: 'No signup', sub: 'no account' },
    { label: '51 tools', sub: 'one directory' },
    { label: 'In-browser', sub: 'files stay local' },
    { label: 'AI crawler presets', sub: '18 bots' },
    { label: 'Live page checks', sub: 'any public URL' },
  ];
  const catCounts = Object.fromEntries(cats.map((c) => [c.id, TOOLS.filter((t) => t.cat === c.id).length]));
  const localCount = TOOLS.filter((t) => LOCAL_TOOLS.has(t.slug)).length;
  const auditCount = TOOLS.filter((t) => t.slug === 'website-audit').length;
  const liveCount = TOOLS.length - localCount - auditCount;
  // `isArticle` is decided by which list the entry came from. It used to be
  // `!!x.sections`, on the assumption that only guides have sections — but tool
  // pages do too, so the Website Audit tool was published on the homepage as
  // /blog/website-audit/, a 404, whenever its `updated` date was inside 45 days.
  const updatedThisMonth = [
    ...TOOLS.map((x) => ({ x, isArticle: false })),
    ...ARTICLES.map((x) => ({ x, isArticle: true })),
  ]
    .filter(({ x }) => x.updated && (Date.now() - new Date(x.updated + 'T00:00:00Z').getTime()) < 45 * 864e5)
    .sort((a, b) => (a.x.updated < b.x.updated ? 1 : -1))
    .slice(0, 3)
    .map(({ x, isArticle }) => ({ slug: x.slug, isArticle, label: (x.name || x.title).split(/[:—]/)[0].trim() }));

  return `
<!-- ============ HERO — copy + task search on the left, editor's pick + proof on the right ============ -->
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="hero-eyebrow">Free SEO and AI-search tools</p>
      <h1>Find the right tool. Finish the job.</h1>
      <p class="hero-sub">${TOOLS.length} browser-based utilities for SEO, AI-search visibility, content operations and everyday web work. Most tools run in your browser with no signup. Page checks query any public URL you give us.</p>
      <div class="hero-search">
        <input type="search" id="tool-search" placeholder="Search ${TOOLS.length} tools by task" aria-label="Search tools by task" aria-describedby="hero-hint">
      </div>
      <div class="search-examples" role="group" aria-label="Example searches">
        <span class="sx-label">Try:</span>
        ${SEARCH_EXAMPLES.map((q) => `<button type="button" class="sx-chip" data-q="${esc(q)}">${esc(q)}</button>`).join('')}
      </div>
      <p class="hero-hint" id="hero-hint">${TOOLS.length} tools &middot; 5 categories &middot; free forever</p>
    </div>
    <figure class="hero-shot">
      <div class="shot-bar" aria-hidden="true">
        <span class="shot-dots"><i></i><i></i><i></i></span>
        <code>tools4market.online/tools/website-audit/</code>
      </div>
      <img src="${av(path, '/assets/hero-audit.png')}" alt="A Tools4Market audit of example.com: the scan ledger, a 54/100 score, and the first blocker finding with its fix button" width="1000" height="1330" decoding="async" fetchpriority="high">
      <figcaption>A real run on example.com, which has no sitemap. Fifteen findings, each with a fix; the score is this checklist's weighting, not a Google ranking.</figcaption>
    </figure>
  </div>
</section>

<!-- ============ PROOF STRIP — trust signals ============ -->
<div class="proof-strip">
  <div class="container">
    <p class="proof-strip-label">Why marketers keep this open</p>
    ${PROOF.map((p) => `<span class="proof-chip"><span class="proof-dot" aria-hidden="true"></span>${esc(p.label)}<span class="proof-sub"> ${esc(p.sub)}</span></span>`).join('')}
  </div>
</div>

<!-- ============ START HERE — the flagship tool, then two short paths ============ -->
<section class="start-band" id="start">
  <div class="container start-grid">
    <div class="start-lead">
      <p class="kicker">Start here</p>
      <h2>Audit the site. Fix what it finds.</h2>
      <p class="start-sub">The website audit crawls up to 100 pages and checks each one against 40+ rules that apply to any site: titles, descriptions, canonicals, schema, links, images and status codes. Every failure opens the tool that fixes it, with your page already filled in.</p>
      <ul class="start-list">
        <li><strong>40+ checks</strong> that work on a site you do not control.</li>
        <li><strong>A live scan ledger</strong> so you can see which page is being read.</li>
        <li><strong>No account</strong> and no report stored after the run.</li>
      </ul>
      <div class="start-actions">
        <a class="btn" href="${rel(path, '/tools/website-audit/')}" data-cta="audit">Run a free site audit <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
        <a class="btn-text" href="${rel(path, '/blog/website-launch-seo-checklist/')}">Or read the launch checklist</a>
      </div>
      ${updatedThisMonth.length ? `<p class="start-updated">Recently changed: ${updatedThisMonth.map((x) => `<a href="${rel(path, (x.isArticle ? '/blog/' : '/tools/') + x.slug + '/')}">${esc(x.label)}</a>`).join(', ')}.</p>` : ''}
    </div>
    <div class="start-cards">
      <aside class="pick-card" aria-label="Editor&#39;s pick of the week">
        <span class="sc-top"><span class="sc-label">Editor&rsquo;s pick &middot; this week</span><span class="sc-icon" aria-hidden="true">${toolIcon(PICK.slug)}</span></span>
        <strong><a href="${rel(path, '/tools/' + PICK.slug + '/')}">${esc(PICK.name)}</a></strong>
        <span class="sc-desc">${esc(PICK.pickWhy || PICK.card)}</span>
        ${PICK.pickSample ? `<pre class="pick-sample">${esc(PICK.pickSample)}</pre>` : ''}
        ${PICK_ENTRY.note ? `<p class="pick-week"><span class="pick-week-label">Why this week</span> ${esc(PICK_ENTRY.note)}</p>` : ''}
        ${PICK.usedFor ? `<span class="sc-meta">${esc(PICK.usedFor.replace(/^for /, ''))}</span>` : ''}
        ${PICK.updated ? `<span class="pick-updated">Updated <time datetime="${esc(PICK.updated)}">${fmtDate(PICK.updated)}</time></span>` : ''}
        <a class="sc-go" href="${rel(path, '/tools/' + PICK.slug + '/')}">Open the tool <span aria-hidden="true">&rarr;</span></a>
      </aside>
      <a class="start-card" href="${rel(path, '/tools/serp-preview-tool/')}">
        <span class="sc-top"><span class="sc-label">Before you rewrite a title</span><span class="sc-icon" aria-hidden="true">${toolIcon('serp-preview-tool')}</span></span>
        <strong>See the snippet Google will cut</strong>
        <span class="sc-desc">Pixel-width truncation, the date Google may insert, and the description line that survives.</span>
        <span class="sc-go">Preview a snippet <span aria-hidden="true">&rarr;</span></span>
      </a>
    </div>
  </div>
</section>

<!-- ============ THE CATALOG, COUNTED — real numbers, real split ============ -->
<section class="numbers-band">
  <div class="container">
    <div class="nb-head">
      <h2>The catalog, counted</h2>
      <p>No growth chart and no invented benchmark. These are the counts the build itself produces.</p>
    </div>
    <div class="nb-grid">
      <figure class="chart-figure">${catalogChart(cats, catCounts, TOOLS.length)}<div class="nb-mobile">${catBars(cats, catCounts)}</div><figcaption>Tools by category. Web and SEO carry the most because those jobs break most often.</figcaption></figure>
      <figure class="chart-figure">${processingChart(localCount, liveCount, auditCount, TOOLS.length)}<div class="nb-mobile">${processingSplit(localCount, liveCount, auditCount, TOOLS.length)}</div><figcaption>${localCount} tools do all their work in the browser. ${liveCount} read a URL you paste, which our proxy fetches; the audit is the one tool that crawls a whole site on our server.</figcaption></figure>
    </div>
    <dl class="nb-stats">
      <div><dt>${TOOLS.length}</dt><dd>tools, each one job</dd></div>
      <div><dt>${ARTICLES.length}</dt><dd>guides with sources</dd></div>
      <div><dt>${localCount}</dt><dd>run fully offline</dd></div>
      <div><dt>0</dt><dd>accounts required</dd></div>
    </dl>
  </div>
</section>

<div class="container">
  <p id="search-empty" class="search-empty" role="status" style="display:none">Nothing matches that search yet &mdash; try &ldquo;meta&rdquo;, &ldquo;robots&rdquo;, &ldquo;UTM&rdquo;, &ldquo;schema&rdquo; or &ldquo;audit&rdquo;, or browse all ${TOOLS.length} tools below.</p>

  <!-- ============ START WITH YOUR JOB ============ -->
  <section class="cat-section jobs" id="start-with-your-job">
    <h2 class="section-title">What are you trying to finish?</h2>
    <div class="job-grid">
      ${JOBS.map((j) => `<a class="job-card" href="${rel(path, j.path)}">
        <span class="job-icon" aria-hidden="true">${JOB_ICONS[j.icon] || ''}</span>
        <strong>${esc(j.title)}</strong>
        <span class="job-blurb">${esc(j.blurb)}</span>
        <span class="job-cta">${esc(j.cta)} &rarr;</span>
      </a>`).join('')}
    </div>
  </section>

  <!-- ============ FIVE OUTCOME CATEGORIES — visual cards ============ -->
  <section class="cat-section cat-outcomes" id="categories">
    <h2 class="section-title">Everything grouped by the job it does</h2>
    <div class="outcome-grid">
      ${cats.map((c) => {
        const list = TOOLS.filter((t) => t.cat === c.id);
        return `<div class="outcome-card">
          <p class="outcome-ic" aria-hidden="true">${catIcon(c.id)}</p>
          <h3><a href="${rel(path, '/' + c.slug + '/')}">${esc(c.name)}</a></h3>
          <p class="outcome-desc">${esc(c.homeDesc)}</p>
          <p class="outcome-links">${list.slice(0, 3).map((t) => `<a href="${rel(path, '/tools/' + t.slug + '/')}">${esc(t.name)}</a>`).join('<span aria-hidden="true"> &middot; </span>')}</p>
          <span class="outcome-count">${list.length} tools</span>
          <a class="outcome-all" href="${rel(path, '/' + c.slug + '/')}">All ${list.length} tools &rarr;</a>
        </div>`;
      }).join('')}
    </div>
  </section>

  <!-- ============ GUIDES ============ -->
  <section class="cat-section" id="guides">
    <div class="cat-header">
      <h2><a href="${rel(path, '/blog/')}">Guides that show the work</a></h2>
      <span class="cat-count">${ARTICLES.length} guides</span>
      <a class="cat-view-all" href="${rel(path, '/blog/')}">View all &rarr;</a>
    </div>
    <p class="cat-desc">Each guide answers one question, walks through the procedure, then hands you the tool that does it.</p>
    <div class="blog-list">
      ${latest.map((a) => {
        const primary = (a.relatedTools || [])[0];
        const pt = primary && TOOLS.find((t) => t.slug === primary);
        return `<div class="blog-card">
        ${guideThumb(a.slug, primary)}
        <span class="blog-meta"><time datetime="${esc(a.date)}">${fmtDate(a.date)}</time>${a.focus ? `<span class="blog-topic">${esc(a.focus)}</span>` : ''}</span>
        <strong><a href="${rel(path, '/blog/' + a.slug + '/')}">${esc(a.title)}</a></strong>
        <span class="blog-dek">${esc(a.intro.slice(0, 150))}&hellip;</span>
        ${pt ? `<span class="blog-tool">Use the <a href="${rel(path, '/tools/' + pt.slug + '/')}">${esc(pt.name)}</a> &rarr;</span>` : ''}
      </div>`;
      }).join('\n      ')}
    </div>
  </section>

  <!-- ============ FULL TOOL DIRECTORY ============ -->
  <section class="home-section" id="tools">
    <h2 class="section-title">All ${TOOLS.length} tools</h2>
    <p class="section-sub">Filter with the search box at the top, or browse every category below.</p>
  </section>
  ${cats.map((c) => {
    const list = TOOLS.filter((t) => t.cat === c.id);
    return `<section class="cat-section" id="${c.slug}">
      <div class="cat-header">
        <span class="cat-ic" aria-hidden="true">${catIcon(c.id)}</span>
        <h2><a href="${rel(path, '/' + c.slug + '/')}">${esc(c.name)}</a></h2>
        <span class="cat-count">${list.length} tools</span>
        <a class="cat-view-all" href="${rel(path, '/' + c.slug + '/')}">View all &rarr;</a>
      </div>
      <p class="cat-desc">${esc(c.homeDesc)}</p>
      <div class="tool-grid">${list.map((t) => toolCard(t, path, procNote(t) !== majorityProc(list))).join('')}</div>
    </section>`;
  }).join('')}

  <!-- ============ CTA BAND ============ -->
  <section class="home-cta">
    <div class="cta-copy">
      <h2>Missing a tool? Found a bug?</h2>
      <p>Tell us what you were trying to finish. Tool suggestions shape the roadmap; bug reports get fixed first.</p>
    </div>
    <div class="cta-actions">
      <a class="btn" href="${rel(path, '/contact/')}" data-cta="contact">Suggest a tool</a>
      <a class="btn btn-secondary" href="${rel(path, '/contact/')}" data-cta="contact">Report a bug</a>
    </div>
  </section>

  <!-- ============ FAQ + RECOGNITION ============ -->
  <section class="tool-content home-content">
    <h2>Free browser-based tools for marketing, SEO and AI search</h2>
    <p>Tools4Market brings ${TOOLS.length} focused utilities into one place: generate meta tags and Open Graph cards, preview your Google snippet, ship a <a href="${rel(path, '/tools/robots-txt-generator/')}">robots.txt</a> that covers every AI crawler, build UTM-tagged campaign links, analyse keyword density, create XML sitemaps, and run a full on-page audit of any URL. Each tool does one job properly — with presets, validation and copy-ready output — instead of burying it under ten ads and a signup wall.</p>
    <p>Browse by category: ${cats.map((c) => `<a href="${rel(path, '/' + c.slug + '/')}">${c.nav}</a>`).join(', ')}.</p>
    <h2>Why run your tools in the browser?</h2>
    <p>Most tools process pasted text and generated output in your browser. If you choose page analysis, the entered public URL is sent to our first-party fetch service, which retrieves the page and returns its response for local analysis. The app does not save a report. This keeps everyday text tools fast while making URL-based checks useful against a real page. See the <a href="${rel(path, '/privacy-policy/')}">privacy policy</a> for details.</p>
    <h2>How it works</h2>
    <p>Start from a job above, search by task, or pick a tool from the grids. Fill in the fields — or paste your own page URL where the tool offers a live check — then copy or download the result. Output is validated as you go, so the first result is usually the final one. Every tool page also carries a short how-to, honest FAQs and links to related tools, so you can go deeper without another round of search results.</p>
    <h2>Frequently asked questions</h2>
    ${HOME_FAQS.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n    ')}
  </section>
</div>`;
}

const catStats = (list) => {
  const local = list.filter((t) => LOCAL_TOOLS.has(t.slug)).length;
  if (!local || local === list.length) return '';
  return `<dl class="cat-stats"><div><dt>${list.length}</dt><dd>${list.length === 1 ? 'tool' : 'tools'}</dd></div><div><dt>${local}</dt><dd>${local === 1 ? 'runs' : 'run'} in your browser</dd></div></dl>`;
};
function categoryBody(cat, list) {
  const path = '/' + cat.slug + '/';
  const others = Object.values(CATEGORIES).filter((c) => c.id !== cat.id);
  const maj = majorityProc(list);
  return `<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <span>${cat.name}</span></nav>
  <p class="cat-mark" aria-hidden="true">${catIcon(cat.id)}</p>
  <div class="cat-scene-wrap">
    <h1>${cat.name}</h1>
    <p class="lead">${cat.pageDesc}</p>
    ${catStats(list)}
  </div>
  <div class="tool-grid">${list.map((t) => toolCard(t, path, procNote(t) !== maj)).join('')}</div>
  <section class="cat-more">
    <h2>Explore other categories</h2>
    <div class="tool-grid">${others.map((c) => `<a class="tool-card" href="${rel(path, '/' + c.slug + '/')}"><span class="tool-icon" aria-hidden="true">${catIcon(c.id)}</span><span class="tool-card-body"><strong>${c.name}</strong><span>${c.homeDesc}</span></span></a>`).join('')}</div>
  </section>
  ${cat.pageExtra ? `<section class="tool-content cat-about"><h2>More about ${esc(cat.name)}</h2>\n${cat.pageExtra.map((p) => `<p>${esc(p)}</p>`).join('\n')}</section>` : ''}
</div>`;
}

function toolPage(t) {
  const path = '/tools/' + t.slug + '/';
  const cat = CATEGORIES[t.cat];
  const RELATED = {
    'meta-tag-generator': ['serp-preview-tool', 'meta-description-checker', 'open-graph-generator'],
    'open-graph-generator': ['twitter-card-generator', 'meta-tag-generator', 'serp-preview-tool'],
    'twitter-card-generator': ['open-graph-generator', 'meta-tag-generator'],
    'canonical-tag-generator': ['hreflang-tag-generator', 'web-crawler-audit', 'sitemap-generator'],
    'hreflang-tag-generator': ['canonical-tag-generator', 'schema-markup-generator'],
    'schema-markup-generator': ['web-crawler-audit', 'seo-score-checker', 'meta-tag-generator'],
    'serp-preview-tool': ['meta-description-checker', 'meta-tag-generator', 'seo-score-checker'],
    'meta-description-checker': ['serp-preview-tool', 'meta-tag-generator'],
    'web-crawler-audit': ['seo-score-checker', 'sitemap-generator', 'robots-txt-generator'],
    'website-audit': ['web-crawler-audit', 'seo-score-checker', 'sitemap-generator'],
    'seo-score-checker': ['web-crawler-audit', 'meta-description-checker', 'keyword-density-checker'],
    'robots-txt-generator': ['ai-crawler-blocker', 'llms-txt-generator', 'sitemap-generator'],
    'ai-crawler-blocker': ['robots-txt-generator', 'llms-txt-generator'],
    'llms-txt-generator': ['robots-txt-generator', 'ai-crawler-blocker', 'sitemap-generator'],
    'url-slug-generator': ['keyword-density-checker', 'case-converter'],
    'utm-link-builder': ['hashtag-generator', 'url-encoder-decoder'],
    'keyword-density-checker': ['reading-time-calculator', 'seo-score-checker', 'url-slug-generator'],
    'hashtag-generator': ['utm-link-builder', 'case-converter'],
    'htaccess-redirect-generator': ['canonical-tag-generator', 'sitemap-generator', 'web-crawler-audit'],
    'sitemap-generator': ['web-crawler-audit', 'robots-txt-generator', 'htaccess-redirect-generator'],
    'password-generator': ['uuid-generator', 'base64-encoder-decoder'],
    'base64-encoder-decoder': ['url-encoder-decoder', 'jwt-decoder'],
    'url-encoder-decoder': ['base64-encoder-decoder', 'utm-link-builder'],
    'uuid-generator': ['password-generator', 'ics-calendar-generator'],
    'jwt-decoder': ['base64-encoder-decoder', 'user-agent-parser'],
    'user-agent-parser': ['web-crawler-audit', 'jwt-decoder'],
    'ics-calendar-generator': ['uuid-generator', 'url-encoder-decoder'],
    'image-compressor': ['web-crawler-audit', 'seo-score-checker', 'open-graph-generator'],
    'case-converter': ['duplicate-line-remover', 'lorem-ipsum-generator'],
    'duplicate-line-remover': ['case-converter', 'url-encoder-decoder'],
    'lorem-ipsum-generator': ['reading-time-calculator', 'case-converter'],
    'reading-time-calculator': ['keyword-density-checker', 'lorem-ipsum-generator'],
    'og-image-tester': ['open-graph-generator', 'twitter-card-generator', 'image-compressor'],
    'hreflang-checker': ['hreflang-tag-generator', 'canonical-tag-generator', 'web-crawler-audit'],
    'robots-txt-tester': ['robots-txt-generator', 'ai-crawler-blocker', 'web-crawler-audit'],
    'sitemap-validator': ['sitemap-generator', 'web-crawler-audit', 'robots-txt-generator'],
    'json-validator': ['regex-tester', 'base64-encoder-decoder', 'url-encoder-decoder'],
    'timestamp-converter': ['ics-calendar-generator', 'uuid-generator', 'user-agent-parser'],
    'ip-converter': ['user-agent-parser', 'timestamp-converter', 'regex-tester'],
    'regex-tester': ['json-validator', 'duplicate-line-remover', 'url-encoder-decoder'],
    'qr-code-generator': ['utm-link-builder', 'url-slug-generator', 'image-compressor'],
    'roi-calculator': ['roas-calculator', 'cac-calculator', 'email-roi-calculator'],
    'roas-calculator': ['roi-calculator', 'ad-metrics-calculator', 'marketing-budget-calculator'],
    'cac-calculator': ['roas-calculator', 'email-roi-calculator', 'marketing-budget-calculator'],
    'ad-metrics-calculator': ['roas-calculator', 'cac-calculator', 'email-roi-calculator'],
    'email-roi-calculator': ['roi-calculator', 'cac-calculator', 'ad-metrics-calculator'],
    'marketing-budget-calculator': ['roas-calculator', 'roi-calculator', 'cac-calculator'],
    'word-counter': ['character-counter', 'reading-time-calculator', 'case-converter', 'duplicate-line-remover', 'keyword-density-checker'],
    'character-counter': ['word-counter', 'reading-time-calculator', 'meta-description-checker', 'meta-tag-generator', 'serp-preview-tool'],
    'color-picker': ['open-graph-generator', 'twitter-card-generator', 'css-minifier', 'image-compressor', 'schema-markup-generator'],
    'css-minifier': ['json-validator', 'color-picker', 'base64-encoder-decoder', 'url-encoder-decoder', 'regex-tester'],
  };
  const selected = (RELATED[t.slug] || []).map((slug) => TOOLS.find((x) => x.slug === slug)).filter(Boolean);
  const related = selected.length ? selected : [
    ...TOOLS.filter((x) => x.cat === t.cat && x.slug !== t.slug).slice(0, 4),
    ...TOOLS.filter((x) => x.cat !== t.cat).slice(0, 5),
  ].slice(0, 5);
  // guides that reference this tool — the blog↔tool link is two-way
  let guides = ARTICLES.filter((a) => (a.relatedTools || []).includes(t.slug)).slice(0, 3);
  // Fallback internal link: when no guide names this tool directly, borrow the
  // guides that cover its related tools (same task cluster) so no tool page is
  // a dead end in the guide graph.
  if (!guides.length) {
    const cluster = new Set(selected.map((x) => x.slug));
    guides = ARTICLES.filter((a) => (a.relatedTools || []).some((s) => cluster.has(s))).slice(0, 2);
  }
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      name: t.name, url: SITE.url + path,
      description: t.metaDesc, applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: t.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
        { '@type': 'ListItem', position: 2, name: cat.name, item: SITE.url + '/' + cat.slug + '/' },
        { '@type': 'ListItem', position: 3, name: t.name },
      ],
    },
  ];
  return `<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <a href="${rel(path, '/' + cat.slug + '/')}">${cat.name}</a> <span class="breadcrumb-sep">/</span> <span>${t.name}</span></nav>
</div>
${adSlot('top banner')}
<div class="container tool-layout">
  <article class="tool-main">
    <h1>${esc(t.h1)}</h1>
    <p class="lead">${esc(t.intro)}</p>
    <p class="tool-meta">${procNote(t)}${(t.usedFor || t.updated) ? `<span class="tm-sep" aria-hidden="true">&middot;</span>` : ''}${t.usedFor ? `<span class="tm-item"><span class="tm-label">Used for</span> ${esc(t.usedFor.replace(/^for /, ''))}</span>` : ''}${t.usedFor && t.updated ? '<span class="tm-sep" aria-hidden="true">&middot;</span>' : ''}${t.updated ? `<span class="tm-item"><span class="tm-label">Last updated</span> <time datetime="${esc(t.updated)}">${fmtDate(t.updated)}</time></span>` : ''}</p>
    ${toolPreview(t.slug)}
    <div id="tool-root" data-tool="${t.slug}" class="tool-shell">${t.html}
    </div>
    <section class="tool-content">
      ${t.sections.map((s) => `<h2>${esc(s.h)}</h2>\n${s.p.map((p) => `<p>${esc(p)}</p>`).join('\n')}`).join('\n')}
    </section>
    <section class="tool-faq">
      <h2>Frequently asked questions</h2>
      ${t.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}
    </section>
    ${adSlot('below content')}
  </article>
  <aside class="tool-side">
    <div class="side-box">
      <h3>Related tools</h3>
      ${related.map((x) => `<a href="${rel(path, '/tools/' + x.slug + '/')}"><span class="side-ic" aria-hidden="true">${toolIcon(x.slug)}</span> ${x.name}</a>`).join('')}
    </div>
    ${guides.length ? `<div class="side-box">
      <h3>From the guides</h3>
      ${guides.map((a) => `<a href="${rel(path, '/blog/' + a.slug + '/')}">${esc(a.title)}</a>`).join('')}
    </div>` : ''}
    ${adSlot('sidebar')}
  </aside>
</div>`;
}

function policyPage(p) {
  const path = '/' + p.slug + '/';
  return `<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <span>${p.title}</span></nav>
  <article class="policy">${p.html}</article>
</div>`;
}

const authorOf = (a) => {
  const by = AUTHORS.find((x) => x.name === a.author);
  if (!by) throw new Error(`Unknown guide author "${a.author}" (${a.slug}); add them to src/data/authors.js`);
  return by;
};

function authorPage(by) {
  const path = '/authors/' + by.slug + '/';
  const guides = ARTICLES.filter((a) => a.author === by.name).sort((a, b) => (a.date < b.date ? 1 : -1));
  const links = by.links.map((l) => `<li><a href="${esc(l.url)}"${l.url.startsWith('http') ? ' rel="me noopener" target="_blank"' : ''}>${esc(l.label)}</a></li>`).join('\n');
  return `<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <a href="${rel(path, '/blog/')}">Guides</a> <span class="breadcrumb-sep">/</span> <span>${esc(by.name)}</span></nav>
  <div class="article-layout article-layout--solo">
  <article class="policy article author-page">
    <h1>${esc(by.name)}</h1>
    <p class="lead">${rich(by.intro)}</p>
    ${by.bio.map((p) => `<p>${rich(p)}</p>`).join('\n')}
    <h2>Where to find me</h2>
    <ul class="article-tools">${links}</ul>
    <h2>Guides I wrote</h2>
    <ul class="article-tools">${guides.map((a) => `<li><a href="${rel(path, '/blog/' + a.slug + '/')}">${esc(a.title)}</a> &middot; <time datetime="${esc(a.date)}">${fmtDate(a.date)}</time></li>`).join('\n')}</ul>
  </article>
  </div>
</div>`;
}

function authorLd(by) {
  const path = '/authors/' + by.slug + '/';
  return [
    {
      '@context': 'https://schema.org', '@type': 'ProfilePage',
      url: SITE.url + path,
      mainEntity: {
        '@type': 'Person', name: by.name, url: SITE.url + path,
        description: by.intro,
        sameAs: by.links.filter((l) => l.url.startsWith('http')).map((l) => l.url),
      },
    },
    breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/blog/' }, { name: by.name, path }]),
  ];
}

function articlePage(a) {
  const path = '/blog/' + a.slug + '/';
  const by = authorOf(a);
  const related = (a.relatedTools || []).map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean);
  // Guide → guide links. `relatedTools` is tool-slugs-only by design, and inline
  // prose is escaped, so without this a guide has no way to point at another
  // guide. Optional field; unknown slugs would disappear silently, so the SEO
  // audit asserts that every slug resolves.
  const next = (a.relatedGuides || []).map((s) => ARTICLES.find((x) => x.slug === s)).filter(Boolean);
  const paras = (list) => list.map((p) => `<p>${rich(p)}</p>`).join('\n');
  const hid = (i) => 's' + i;
  const hasToc = a.sections.length >= 4;
  const toc = hasToc ? `
  <aside class="toc" aria-label="Sections in this guide">
    <p class="toc-title">In this guide</p>
    <ol>${a.sections.map((s, i) => `<li><a href="#${hid(i)}">${esc(s.h)}</a></li>`).join('')}</ol>
  </aside>` : '';
  // Guides carry a content unit after the second section, not a placeholder.
  // Tool pages can afford a permanent dashed box because the slot sits outside
  // the interaction area; mid-article an empty box competes with the prose for
  // nothing, so this only renders once AD_SLOT_CONTENT holds a real id. The
  // slot keeps its reserved height in CSS, so enabling it does not shift text.
  const midAd = AD_SLOTS['below content'] ? '\n' + adSlot('below content') : '';
  return `<div class="reading-progress" aria-hidden="true"><i></i></div>
<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <a href="${rel(path, '/blog/')}">Guides</a> <span class="breadcrumb-sep">/</span> <span>${esc(a.title)}</span></nav>
  <div class="article-layout${hasToc ? '' : ' article-layout--solo'}">
  <article class="policy article">
    <h1>${esc(a.title)}</h1>
    <p class="article-meta">Published <time datetime="${esc(a.date)}">${fmtDate(a.date)}</time>${a.updated && a.updated !== a.date ? ` &middot; Updated <time datetime="${esc(a.updated)}">${fmtDate(a.updated)}</time>` : ''} &middot; By <a href="${rel(path, '/authors/' + by.slug + '/')}" rel="author">${esc(a.author)}</a></p>
    <p class="lead">${rich(a.intro)}</p>
    ${guideFigure(a.slug)}
    ${a.sections.map((s, i) => `<h2 id="${hid(i)}">${rich(s.h)}</h2>\n${paras(s.p || [])}${s.pre ? `<pre class="article-code">${esc(s.pre)}</pre>` : ''}${paras(s.p2 || [])}${i === 1 ? midAd : ''}`).join('\n')}
    ${a.links && a.links.length ? `<h2>Sources and further reading</h2>\n<ul>${a.links.map((l) => `<li><a href="${esc(l.url)}" rel="noopener nofollow" target="_blank">${esc(l.label)}</a></li>`).join('\n')}</ul>` : ''}
    <h2>Frequently asked questions</h2>
    ${a.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${rich(f.a)}</p></details>`).join('\n')}
    ${related.length ? `<h2>Tools for this guide</h2>\n<ul class="article-tools">${related.map((t) => `<li><a href="${rel(path, '/tools/' + t.slug + '/')}">${esc(t.name)}</a> — ${esc(t.card)}</li>`).join('\n')}</ul>` : ''}
    ${next.length ? `<h2>Read next</h2>\n<ul class="article-tools">${next.map((x) => `<li><a href="${rel(path, '/blog/' + x.slug + '/')}">${esc(x.title)}</a></li>`).join('\n')}</ul>` : ''}
  </article>
  ${toc}
  </div>
</div>`;
}

function blogIndexBody() {
  const path = '/blog/';
  const list = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
  return `<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <span>Guides</span></nav>
  <h1>Guides and how-to articles</h1>
  <p class="lead">Practical, tested walkthroughs for the jobs these tools do: crawler rules, launch checklists, structured data, campaigns and the technical side of keeping a site healthy in front of search engines and AI assistants.</p>
  <div class="blog-list">
    ${list.map((a) => `<a class="blog-card" href="${rel(path, '/blog/' + a.slug + '/')}">
      ${guideThumb(a.slug, (a.relatedTools || [])[0])}
      <span class="blog-date"><time datetime="${esc(a.date)}">${fmtDate(a.date)}</time></span>
      <strong>${esc(a.title)}</strong>
      <span>${esc(a.intro.slice(0, 180))}…</span>
    </a>`).join('\n    ')}
  </div>
</div>`;
}

function articleLd(a) {
  const path = '/blog/' + a.slug + '/';
  const by = authorOf(a);
  return [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: a.title, description: a.metaDesc, url: SITE.url + path,
      datePublished: a.date, dateModified: a.updated || a.date,
      author: {
        '@type': 'Person', name: by.name,
        url: SITE.url + '/authors/' + by.slug + '/',
        sameAs: by.links.filter((l) => l.url.startsWith('http')).map((l) => l.url),
      },
      publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.url + '/assets/icon-512.png', width: 512, height: 512 } },
      image: SITE.url + '/assets/og-image.png',
      inLanguage: 'en', mainEntityOfPage: { '@type': 'WebPage', '@id': SITE.url + path },
      keywords: a.focus,
    },
    breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/blog/' }, { name: a.title, path }]),
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: a.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
}

function notFoundBody() {
  return `<div class="container nf">
  <p class="nf-code">404</p>
  <h1>Page not found</h1>
  <p class="lead">The page you are looking for does not exist (yet).</p>
  <p><a class="btn" href="/">Browse all free tools</a></p>
</div>`;
}

const toolLd = (t) => {
  const cat = CATEGORIES[t.cat];
  const path = '/tools/' + t.slug + '/';
  return [
    {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      name: t.name, url: SITE.url + path,
      description: t.metaDesc, applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: t.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
        { '@type': 'ListItem', position: 2, name: cat.name, item: SITE.url + '/' + cat.slug + '/' },
        { '@type': 'ListItem', position: 3, name: t.name },
      ],
    },
  ];
};

// ---- build helpers ------------------------------------------------------
// Quote-aware CSS minifier: strips comments + collapses whitespace so the
// shipped stylesheet is smaller while src/style.css stays human-readable.
// (Deliberately conservative: no token surgery beyond whitespace/comments.)
function minifyCss(src) {
  let out = '', i = 0, q = null;
  while (i < src.length) {
    const c = src[i];
    if (q) { out += c; if (c === '\\' && i + 1 < src.length) { out += src[i + 1]; i++; } else if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; out += c; i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2); i = i === -1 ? src.length : i + 2; continue; }
    if (/\s/.test(c)) {
      while (i < src.length && /\s/.test(src[i])) i++;
      const prev = out[out.length - 1], next = src[i];
      if (prev && next && !/[{};:,>+~()]/.test(prev) && !/[{};:,>+~()]/.test(next)) out += ' ';
      continue;
    }
    out += c; i++;
  }
  return out.replace(/;}/g, '}').trim() + '\n';
}
// Copies a JS file and appends a trivially-correct identity source map
// (generated === original, so each line maps to itself). Keeps unminified,
// debuggable JS on the wire while satisfying the "missing source maps" audit.
async function copyJsWithMap(src, dest) {
  const code = await readFile(src, 'utf8');
  const name = dest.slice(dest.lastIndexOf('/') + 1);
  const mappings = 'AAAA' + ';AACA'.repeat(code.split('\n').length - 1);
  const map = { version: 3, sources: [name], names: [], mappings };
  await writeFile(dest + '.map', JSON.stringify(map));
  await writeFile(dest, code + '\n//# sourceMappingURL=' + name + '.map\n');
}

const run = async () => {
  const warnings = [];
  await rm(R + 'dist', { recursive: true, force: true });
  await mkdir(R + 'dist', { recursive: true });
  await mkdir(R + 'dist/assets/runtime', { recursive: true });

  const pages = [
    { path: '/', title: `${SITE.name} — Free Marketing and SEO Tools`, desc: `${TOOLS.length} browser-based marketing, SEO, AI-search and web tools. Public-page checks fetch the entered URL through our proxy. No signup, no limits.`, body: homeBody(), ld: homeLd() },
    ...Object.values(CATEGORIES).map((c) => {
      const list = TOOLS.filter((t) => t.cat === c.id);
      const path = '/' + c.slug + '/';
      return {
        path, title: c.metaTitle, desc: c.metaDesc, body: categoryBody(c, list),
        ld: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: c.name, path }])],
      };
    }),
    ...TOOLS.map((t) => ({ path: '/tools/' + t.slug + '/', title: t.metaTitle, desc: t.metaDesc, body: toolPage(t), ld: toolLd(t), tool: t })),
    { path: '/blog/', title: 'Guides — Free SEO and Marketing How-Tos | ' + SITE.name, desc: 'Practical guides for the jobs these tools do: crawler rules, launch checklists, structured data, campaigns and technical SEO — tested, plain and free.', body: blogIndexBody(), ld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Guides', url: SITE.url + '/blog/', description: 'How-to guides for marketers, bloggers and webmasters.' }, breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/blog/' }])] },
    ...ARTICLES.map((a) => ({ path: '/blog/' + a.slug + '/', title: a.metaTitle, desc: a.metaDesc, body: articlePage(a), ld: articleLd(a) })),
    ...AUTHORS.map((by) => ({ path: '/authors/' + by.slug + '/', title: by.metaTitle, desc: by.metaDesc, body: authorPage(by), ld: authorLd(by) })),
    ...POLICY.map((p) => {
      const path = '/' + p.slug + '/';
      return {
        path, title: p.metaTitle, desc: p.metaDesc, body: policyPage(p),
        ld: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: p.title, path }])],
      };
    }),
    { path: '/404.html', title: '404 — Page not found', desc: 'Page not found.', body: notFoundBody(), noindex: true },
  ];

  for (const p of pages) {
    const html = layout({ path: p.path, title: p.title, desc: p.desc, body: p.body, ld: p.ld || [], noindex: p.noindex, tool: p.tool || null });
    // Check lengths (warn only)
    if (p.title.length > 60) warnings.push(`TITLE >${60} (${p.title.length}): ${p.path}`);
    if (p.desc.length > 158) warnings.push(`DESC >${158} (${p.desc.length}): ${p.path}`);
    if (p.path === '/404.html') await writeFile(R + 'dist/404.html', html);
    else {
      const dir = R + 'dist' + p.path;
      await mkdir(dir, { recursive: true });
      await writeFile(dir + 'index.html', html);
    }
  }

  // ---- sitemaps: a sitemap INDEX + two children (pages, tools) ---------
  // An index keeps room to grow (a blog/content sitemap later) and lets crawlers
  // fetch only the slice they need.
  const pagePaths = ['/', '/blog/', ...Object.values(CATEGORIES).map((c) => '/' + c.slug + '/'), ...AUTHORS.map((by) => '/authors/' + by.slug + '/'), ...POLICY.map((p) => '/' + p.slug + '/')];
  const toolPaths = TOOLS.map((t) => '/tools/' + t.slug + '/');
  // Do not emit synthetic lastmod values: a build date is not the page's
  // significant content-modification date. Guides carry a real one (their
  // publish/update date from src/data/blog.js); tool and page URLs have no
  // tracked modification date, so they ship without <lastmod>. Google ignores
  // priority/changefreq and advises that lastmod be accurate and verifiable.
  const entry = ([p, lastmod]) => `  <url><loc>${SITE.url}${p}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
  const urlset = (entries) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(entry).join('\n')}\n</urlset>\n`;
  await writeFile(R + 'dist/sitemap-pages.xml', urlset(pagePaths.map((p) => [p])));
  await writeFile(R + 'dist/sitemap-tools.xml', urlset(toolPaths.map((p) => [p])));
  await writeFile(R + 'dist/sitemap-blog.xml', urlset(ARTICLES.map((a) => ['/blog/' + a.slug + '/', a.updated || a.date])));
  const sitemapChildren = ['/sitemap-pages.xml', '/sitemap-tools.xml', '/sitemap-blog.xml'];
  await writeFile(R + 'dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapChildren.map((s) => `  <sitemap><loc>${SITE.url}${s}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`);

  // robots.txt is policy, not boilerplate. Search engines and AI answer engines
  // may crawl; AI training crawlers may not. Keep it here — version-controlled
  // and asserted by the audit — rather than in a CDN dashboard toggle, because
  // the two drifting apart is how the live site spent a week contradicting its
  // own AI-crawler guides.
  const TRAINING_BOTS = [
    'GPTBot', 'ClaudeBot', 'anthropic-ai', 'CCBot', 'Bytespider', 'Amazonbot',
    'Applebot-Extended', 'meta-externalagent', 'cohere-ai', 'MistralAI-Training',
    'Diffbot', 'omgili',
  ];
  // Indexers and user-triggered fetchers: these are the AI-search traffic.
  const ANSWER_BOTS = [
    'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User',
    'Claude-SearchBot', 'Claude-User',
  ];
  const robots = [
    '# Tools4Market robots.txt',
    '# Policy: search engines and AI answer engines may crawl; AI training crawlers may not.',
    '# Rationale, including the Google-Extended trade: /blog/robots-txt-for-search-and-ai-crawlers/',
    '',
    'User-agent: *',
    'Content-Signal: search=yes,ai-train=no,use=reference',
    'Allow: /',
    '',
    '# AI training crawlers',
    ...TRAINING_BOTS.map((b) => `User-agent: ${b}`),
    'Disallow: /',
    '',
    '# AI search indexers and user-triggered fetchers',
    ...ANSWER_BOTS.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    '# Google-Extended is a control token, not a crawler: it governs whether Google may',
    '# use the site for Gemini training AND for Gemini grounding, and those cannot be',
    '# separated. Allowed deliberately — grounding is how Gemini cites a page.',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n');
  await writeFile(R + 'dist/robots.txt', robots);

  // ---- llms.txt: curated markdown map of the site for AI tools that read it.
  // Honest by design: it is a navigation aid, not a ranking mechanism (Google
  // does not use llms.txt) — see the llms.txt guide we publish.
  const llmsLines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}. ${TOOLS.length}+ free browser-based tools for marketers, bloggers and webmasters — no signup, no limits. Most tools process input locally in the browser; public-page checks fetch the entered URL through our first-party proxy.`,
    '',
    '## Tools',
    ...Object.values(CATEGORIES).flatMap((c) => [
      `### ${c.name}`,
      ...TOOLS.filter((t) => t.cat === c.id).map((t) => `- [${t.name}](${SITE.url}/tools/${t.slug}/): ${t.card}`),
    ]),
    '',
    '## Guides',
    ...ARTICLES.map((a) => `- [${a.title}](${SITE.url}/blog/${a.slug}/): ${a.intro.split('.')[0]}.`),
    '',
    '## Policies',
    ...POLICY.map((p) => `- [${p.title}](${SITE.url}/${p.slug}/)`),
    '',
  ];
  await writeFile(R + 'dist/llms.txt', llmsLines.join('\n'));

  // ---- llms-full.txt: the same map with the guides' full text and each tool's
  // intro + FAQ answers, so answer engines can quote us instead of guessing.
  const llmsFull = [
    ...llmsLines,
    '',
    '---',
    '',
    '# Full text',
    '',
    ...ARTICLES.flatMap((a) => [
      '## ' + a.title,
      '',
      a.intro,
      '',
      ...a.sections.flatMap((s2) => ['### ' + s2.h, '', ...(s2.p || []).map((x) => x.replace(/\*\*/g, '') + '\n'), ...(s2.pre ? ['```', s2.pre, '```', ''] : []), ...(s2.p2 || []).map((x) => x.replace(/\*\*/g, '') + '\n')]),
      '### FAQ',
      '',
      ...a.faqs.flatMap((f) => ['**' + f.q + '**', '', f.a.replace(/\*\*/g, ''), '']),
      '',
    ]),
    ...TOOLS.flatMap((t) => [
      '## ' + t.name,
      '',
      t.intro,
      '',
      ...t.faqs.flatMap((f) => ['**' + f.q + '**', '', f.a.replace(/\*\*/g, ''), '']),
      '',
    ]),
  ];
  await writeFile(R + 'dist/llms-full.txt', llmsFull.join('\n'));

  // ---- RSS 2.0 feed for the guides (discovery + freshness signal)
  const rfc822 = (d) => new Date(d + 'T00:00:00Z').toUTCString();
  const feedItems = ARTICLES.map((a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE.url}/blog/${a.slug}/</link>
      <guid isPermaLink="true">${SITE.url}/blog/${a.slug}/</guid>
      <pubDate>${rfc822(a.date)}</pubDate>
      <description>${esc(a.metaDesc)}</description>
    </item>`).join('\n');
  await writeFile(R + 'dist/feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — Guides</title>
    <link>${SITE.url}/blog/</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Practical guides for marketers, bloggers and webmasters: AI crawlers, robots.txt, indexing, schema and campaign tagging.</description>
    <language>en</language>
${feedItems}
  </channel>
</rss>
`);

  // ---- assets: minified CSS (source stays readable in src/), JS + identity
  // source maps (Lighthouse flags large first-party JS without maps), fonts.
  await writeFile(R + 'dist/assets/style.css', minifyCss(await readFile(R + 'src/style.css', 'utf8')));
  await copyJsWithMap(R + 'src/site.js', R + 'dist/assets/site.js');
  for (const f of ['seo.js', 'ai-search.js', 'content.js', 'web.js', 'marketing.js', 'inspect.js', 'audit.js', 'site-audit.js']) {
    await copyJsWithMap(R + 'src/runtime/' + f, R + 'dist/assets/runtime/' + f);
  }
  // Vendored third-party libraries: copied verbatim (their own licence headers
  // stay intact) and only onto the tool pages that reference them.
  await mkdir(R + 'dist/assets/vendor', { recursive: true });
  for (const f of await readdir(R + 'src/vendor')) {
    await copyFile(R + 'src/vendor/' + f, R + 'dist/assets/vendor/' + f);
  }
  await mkdir(R + 'dist/fonts', { recursive: true });
  for (const f of await readdir(R + 'src/fonts')) {
    await copyFile(R + 'src/fonts/' + f, R + 'dist/fonts/' + f);
  }

  // inject user-facing strings for the inspect/audit/score engine as a global
  // (classic runtime can't import; JSON.stringify keeps it XSS-safe in a script tag)
  const stringsJs = 'window.T4M_ISTR=' + JSON.stringify(INSPECT_TEXT) +
    ';window.T4M_AUDIT=' + JSON.stringify(AUDIT) +
    ';window.T4M_SCORE=' + JSON.stringify(SCORE) +
    ';window.T4M_WA=' + JSON.stringify(SITE_AUDIT) + ';\n';
  await writeFile(R + 'dist/assets/inspect-strings.js', stringsJs);

  // favicon.svg + the app-icon set are generated by scripts/make-brand-assets.mjs
  // from src/assets/logo.png — see that script for the crop/scale pipeline.
  await copyFile(R + 'src/assets/favicon.svg', R + 'dist/assets/favicon.svg');
  // /favicon.ico — legacy browsers and several crawlers request it from the
  // domain root by default (it used to answer 404). An ICO is just a small
  // container around a PNG, so wrap the 192px brand icon instead of checking a
  // binary blob into the repo.
  {
    const png = await readFile(R + 'src/assets/icon-192.png');
    const icoHeader = Buffer.alloc(6);
    icoHeader.writeUInt16LE(0, 0);   // reserved
    icoHeader.writeUInt16LE(1, 2);   // type: icon
    icoHeader.writeUInt16LE(1, 4);   // one image
    const icoEntry = Buffer.alloc(16);
    icoEntry.writeUInt8(192, 0);     // width (values >256 are stored as 0)
    icoEntry.writeUInt8(192, 1);     // height
    icoEntry.writeUInt8(0, 2);       // palette colour count
    icoEntry.writeUInt8(0, 3);       // reserved
    icoEntry.writeUInt16LE(1, 4);    // colour planes
    icoEntry.writeUInt16LE(32, 6);   // bits per pixel
    icoEntry.writeUInt32LE(png.length, 8);  // image data size
    icoEntry.writeUInt32LE(22, 12);  // image data offset (6 + 16)
    await writeFile(R + 'dist/favicon.ico', Buffer.concat([icoHeader, icoEntry, png]));
  }
  // social share image (og:image / twitter:image) — pre-rendered, brand palette
  await copyFile(R + 'src/assets/og-image.png', R + 'dist/assets/og-image.png');
  for (const ic of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'logo-mark.png', 'hero_scene.jpg', 'hero-audit.png']) {
    const src = R + 'src/assets/' + ic;
    try { await copyFile(src, R + 'dist/assets/' + ic); }
    catch { /* missing source asset — keep build working */ }
  }
  // PWA manifest (installability + mobile polish)
  await writeFile(R + 'dist/manifest.webmanifest', JSON.stringify({
    name: SITE.name + ' — ' + SITE.tagline,
    short_name: 'Tools4Market',
    description: `${TOOLS.length}+ free browser-based marketing, SEO, AI-search and web tools. Public-page checks fetch the entered URL through our first-party proxy. No signup, no limits.`,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8f5ee',
    theme_color: '#0b172f',
    icons: [
      { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }, null, 2) + '\n');
  // static root files (site-verification files, ads.txt overrides, …) → served from the domain root
  try {
    const staticFiles = await readdir(R + 'src/static');
    for (const f of staticFiles) {
      await copyFile(R + 'src/static/' + f, R + 'dist/' + f);
    }
  } catch (e) { /* no src/static directory — nothing to copy */ }

  // Cloudflare Pages: cache + security headers, and apex → www canonical redirect
  await writeFile(R + 'dist/_headers', `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=300, must-revalidate

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000
`);
  // Cloudflare Pages supports host-level redirects in _redirects, but Workers Static
  // Assets rejects them ("Only relative URLs are allowed", error 100324). So the
  // www -> apex 301 is opt-in via SITE_REDIRECTS_PAGES=1; on Workers it belongs to a
  // zone-level Cloudflare Redirect Rule instead.
  await writeFile(R + 'dist/_redirects', process.env.SITE_REDIRECTS_PAGES === '1'
    ? 'https://www.tools4market.online/* https://tools4market.online/:splat 301\n'
    : '# Host-level redirects are not allowed in Workers Static Assets (error 100324).\n' +
      '# The www -> apex 301 is set as a Cloudflare Redirect Rule on the zone.\n');
  // AdSense ads.txt (only meaningful once a publisher id exists)
  if (ADSENSE_CLIENT) {
    const pub = ADSENSE_CLIENT.replace(/^ca-/, '');
    await writeFile(R + 'dist/ads.txt', `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
  }
  // IndexNow key file — lets Bing, Yandex, Seznam et al. verify the host before
  // `npm run indexnow` submits changed URLs. No key → no file (unchanged site).
  if (INDEXNOW_KEY) await writeFile(R + 'dist/' + INDEXNOW_KEY + '.txt', INDEXNOW_KEY + '\n');

  const pageCount = pages.length;
  console.log(`\u2714 Built ${pageCount} HTML pages (${TOOLS.length} tools, ${Object.keys(CATEGORIES).length} categories, ${POLICY.length} policy pages) + sitemap.xml, robots.txt, 404.html, assets.`);
  if (warnings.length) console.log('\u26a0 SEO length warnings (60/158 limits):\n  ' + warnings.join('\n  '));

  // AdSense is the one setting where a wrong value fails silently: slotId() turns
  // anything it does not recognise into a placeholder, so a malformed id ships a
  // page that looks finished and earns nothing. Say so at build time instead.
  const badSlots = Object.entries({
    AD_SLOT_TOP: process.env.AD_SLOT_TOP,
    AD_SLOT_CONTENT: process.env.AD_SLOT_CONTENT,
    AD_SLOT_SIDEBAR: process.env.AD_SLOT_SIDEBAR,
  }).filter(([, raw]) => String(raw || '').trim() && !slotId(raw)).map(([k, raw]) => `${k}="${raw}"`);
  if (badSlots.length) {
    console.log(`\u26a0 AdSense: ${badSlots.length} slot id(s) not numeric and ignored — reserved placeholder rendered instead:\n  ${badSlots.join('\n  ')}\n  Expected a numeric data-ad-slot (6+ digits), or ca-pub-<digits>:<digits>.`);
  }
  const liveSlots = Object.values(AD_SLOTS).filter(Boolean).length;
  if (ADSENSE_ENABLED && !liveSlots) {
    console.log('\u2139 AdSense loader on, 0 ad units — every slot is a reserved placeholder. Revenue stays zero until AD_SLOT_TOP / AD_SLOT_CONTENT / AD_SLOT_SIDEBAR hold real numeric ids.');
  }
};

run().catch((e) => { console.error(e); process.exit(1); });

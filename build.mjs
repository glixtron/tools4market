#!/usr/bin/env node
// Tools4Market — static site generator. Run: node build.mjs
import { rm, mkdir, writeFile, copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { TOOLS, CATEGORIES, POLICY, HOME_FAQS } from './src/data/index.js';
import { INSPECT_TEXT, AUDIT, SCORE } from './src/data/inspect.js';
import { ARTICLES } from './src/data/blog.js';

const R = fileURLToPath(new URL('.', import.meta.url));
const YEAR = new Date().getFullYear();

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
// Google Tag Manager container id (analytics). Consent-gated: nothing is stored
// until the visitor accepts (Consent Mode v2 defaults are denied).
const GTM_ID = (process.env.GTM_ID || 'GTM-P6P4FLGB').trim();
// Consent mode scope: 'basic' = denied in EEA/UK/CH, granted elsewhere (Google's
// recommended "basic" mode). 'advanced' = denied for every visitor, everywhere.
const CONSENT_MODE = (process.env.CONSENT_MODE || 'basic').trim().toLowerCase();
// Consent types (v2) + the region that requires a banner before anything is stored.
const CONSENT_TYPES = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];
const CONSENT_REGION = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK', 'GB', 'CH'];
// Per-position AdSense ad unit ids (falls back to a single shared slot)
const AD_SLOTS = {
  'top banner': (process.env.AD_SLOT_TOP || '').trim(),
  'below content': (process.env.AD_SLOT_CONTENT || '').trim(),
  sidebar: (process.env.AD_SLOT_SIDEBAR || '').trim(),
};

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
  return '../'.repeat(f.length - i) + tail + (tail && to.endsWith('/') ? '/' : '');
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
      <span><strong>Analytics</strong><span class="ck-desc">Google Tag Manager — anonymous measurement of how the tools are used. Our tools never upload your input.</span></span>
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

function layout({ path, title, desc, body, ld = [], noindex = false }) {
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
  const adsenseLoader = ADSENSE_CLIENT ? `<!-- Google AdSense -->
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${ADSENSE_CLIENT ? '<link rel="preconnect" href="https://pagead2.googlesyndication.com">' : ''}
<link rel="icon" type="image/svg+xml" href="${rel(path, '/assets/favicon.svg')}">
<link rel="apple-touch-icon" href="${rel(path, '/assets/icon-192.png')}">
<link rel="manifest" href="${rel(path, '/manifest.webmanifest')}">
<link rel="sitemap" type="application/xml" href="${rel(path, '/sitemap.xml')}">
<link rel="alternate" type="application/rss+xml" title="${SITE.name} — Guides" href="/feed.xml">
<meta name="theme-color" content="#5b4fff">
<link rel="stylesheet" href="${rel(path, '/assets/style.css')}">
${ld.map(ldTag).join('\n')}
</head>
<body>
${gtmBody}
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="${rel(path, '/')}"><span class="logo-mark">T4</span><span>Tools4Market</span></a>
    <nav class="site-nav" aria-label="Main">
      ${Object.values(CATEGORIES).map((c) => `<a href="${rel(path, '/' + c.slug + '/')}">${c.nav}</a>`).join('')}
      <a href="${rel(path, '/blog/')}">Guides</a>
      <a href="${rel(path, '/about/')}">About</a>
      <a href="${rel(path, '/contact/')}">Contact</a>
    </nav>
  </div>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <div class="footer-brand-bar"></div>
  <div class="container footer-grid">
    <div>
      <a class="logo" href="${rel(path, '/')}"><span class="logo-mark">T4</span><span>Tools4Market</span></a>
      <p>Free browser-based tools for marketers, bloggers and webmakers. Most tools process input in your browser; page checks fetch the public URL through our first-party proxy. No signup, no limits.</p>
    </div>
    <div>
      <h4>Categories</h4>
      ${Object.values(CATEGORIES).map((c) => `<a href="${rel(path, '/' + c.slug + '/')}">${c.name}</a>`).join('')}
    </div>
    <div>
      <h4>Company</h4>
      ${POLICY.map((p) => `<a href="${rel(path, '/' + p.slug + '/')}">${p.title}</a>`).join('')}
    </div>
    <div>
      <h4>Popular tools</h4>
      ${['robots-txt-generator', 'meta-tag-generator', 'open-graph-generator', 'keyword-density-checker', 'llms-txt-generator', 'utm-link-builder'].map((s) => {
        const t = TOOLS.find((x) => x.slug === s);
        return t ? `<a href="${rel(path, '/tools/' + s + '/')}">${t.name}</a>` : '';
      }).join('')}
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; ${YEAR} ${SITE.name} &middot; ${SITE.tagline} &middot; <a href="${rel(path, '/privacy-policy/')}">Privacy</a> &middot; <a href="${rel(path, '/terms/')}">Terms</a> &middot; <a href="${rel(path, '/disclaimer/')}">Disclaimer</a> &middot; <a href="#" data-ck-settings>Cookie settings</a></p>
  </div>
</footer>
${consentBanner(path)}
<script defer src="${rel(path, '/assets/site.js')}"></script>
<script defer src="${rel(path, '/assets/inspect-strings.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/inspect.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/seo.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/ai-search.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/content.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/web.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/audit.js')}"></script>
</body>
</html>`;
}

const toolCard = (t, path) => `<a class="tool-card" href="${rel(path, '/tools/' + t.slug + '/')}" data-search="${esc((t.name + ' ' + t.card + ' ' + t.keywords).toLowerCase())}">
  <span class="tool-icon" aria-hidden="true">${t.icon}</span>
  <span class="tool-card-body"><strong>${t.name}</strong><span>${t.card}</span></span>
</a>`;

// Ad slot. Renders a real AdSense unit only when an ad-unit id is configured
// (AD_SLOT_TOP / AD_SLOT_CONTENT / AD_SLOT_SIDEBAR); until then the slot keeps
// its reserved height so enabling ads never shifts the layout (no CLS).
const adSlot = (label) => {
  const slot = AD_SLOTS[label] || '';
  if (!ADSENSE_CLIENT || !slot) {
    return `<div class="ad-slot" role="complementary" aria-label="Advertisement space">Ad space${label ? ' &middot; ' + label : ''}</div>`;
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
      name: SITE.name, url: SITE.url + '/', logo: SITE.url + '/assets/og-image.png',
      email: SITE.email,
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: HOME_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
}

function homeBody() {
  const path = '/';
  const cats = Object.values(CATEGORIES);
  return `<section class="hero">
  <div class="container">
    <div class="hero-eyebrow">&#10022; Browser-based tools &mdash; public-page checks included</div>
    <h1>Free Marketing, SEO &amp; AI-Search Tools</h1>
    <p class="hero-sub">${TOOLS.length}+ tools, most of which process input in your browser. Optional page analysis fetches a public URL through our first-party proxy. No signup, no limits.</p>
    <div class="hero-search">
      <input type="search" id="tool-search" placeholder="Search ${TOOLS.length} tools&hellip; try &ldquo;meta&rdquo;, &ldquo;robots&rdquo;, &ldquo;password&rdquo;" aria-label="Search tools">
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><span class="hero-stat-num">${TOOLS.length}+</span><span class="hero-stat-label">Free Tools</span></div>
      <div class="hero-stat"><span class="hero-stat-num">${Object.keys(CATEGORIES).length}</span><span class="hero-stat-label">Categories</span></div>
      <div class="hero-stat"><span class="hero-stat-num">0</span><span class="hero-stat-label">Signups needed</span></div>
      <div class="hero-stat"><span class="hero-stat-num">Most</span><span class="hero-stat-label">processing stays local</span></div>
    </div>
  </div>
</section>
<div class="container">
  <p id="search-empty" class="search-empty" style="display:none">No tool matches that search &mdash; try a different keyword.</p>
  ${cats.map((c) => {
    const list = TOOLS.filter((t) => t.cat === c.id);
    return `<section class="cat-section" id="${c.slug}">
      <div class="cat-header">
        <h2><a href="${rel(path, '/' + c.slug + '/')}">${c.icon} ${c.name}</a></h2>
        <span class="cat-count">${list.length} tools</span>
        <a class="cat-view-all" href="${rel(path, '/' + c.slug + '/')}">View all &rarr;</a>
      </div>
      <p class="cat-desc">${c.homeDesc}</p>
      <div class="tool-grid">${list.map((t) => toolCard(t, path)).join('')}</div>
    </section>`;
  }).join('')}
  <section class="cat-section" id="guides">
    <div class="cat-header">
      <h2><a href="${rel(path, '/blog/')}">Guides and how-tos</a></h2>
      <span class="cat-count">${ARTICLES.length} guides</span>
      <a class="cat-view-all" href="${rel(path, '/blog/')}">View all &rarr;</a>
    </div>
    <div class="blog-list">
      ${[...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3).map((a) => `<a class="blog-card" href="${rel(path, '/blog/' + a.slug + '/')}">
        <span class="blog-date">${esc(a.date)}</span>
        <strong>${esc(a.title)}</strong>
        <span>${esc(a.intro.slice(0, 160))}…</span>
      </a>`).join('\n      ')}
    </div>
  </section>
  <section class="tool-content home-content">
    <h2>Free browser-based tools for marketing, SEO and AI search</h2>
    <p>Tools4Market brings ${TOOLS.length} focused utilities into one place: generate meta tags and Open Graph cards, preview your Google snippet, ship a <a href="${rel(path, '/tools/robots-txt-generator/')}">robots.txt</a> that covers every AI crawler, build UTM-tagged campaign links, analyse keyword density, create XML sitemaps, and run a full on-page audit of any URL. Each tool does one job properly — with presets, validation and copy-ready output — instead of burying it under ten ads and a signup wall.</p>
    <p>Browse by category: ${cats.map((c) => `<a href="${rel(path, '/' + c.slug + '/')}">${c.nav}</a>`).join(', ')}.</p>
    <h2>Why run your tools in the browser?</h2>
    <p>Most tools process pasted text and generated output in your browser. If you choose page analysis, the entered public URL is sent to our first-party fetch service, which retrieves the page and returns its response for local analysis. The app does not save a report. This keeps everyday text tools fast while making URL-based checks useful against a real page. See the <a href="${rel(path, '/privacy-policy/')}">privacy policy</a> for details.</p>
    <h2>How it works</h2>
    <p>Pick a tool from the grids above or search from the box at the top. Fill in the fields — or paste your own page URL where the tool offers a live check — then copy or download the result. Output is validated as you go, so the first result is usually the final one. Every tool page also carries a short how-to, honest FAQs and links to related tools, so you can go deeper without another round of search results.</p>
    <h2>Frequently asked questions</h2>
    ${HOME_FAQS.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n    ')}
  </section>
</div>`;
}

function categoryBody(cat, list) {
  const path = '/' + cat.slug + '/';
  const others = Object.values(CATEGORIES).filter((c) => c.id !== cat.id);
  return `<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <span>${cat.name}</span></nav>
  <h1>${cat.icon} ${cat.name}</h1>
  <p class="lead">${cat.pageDesc}</p>
  <div class="tool-grid">${list.map((t) => toolCard(t, path)).join('')}</div>
  <section class="cat-more">
    <h2>Explore other categories</h2>
    <div class="tool-grid">${others.map((c) => `<a class="tool-card" href="${rel(path, '/' + c.slug + '/')}"><span class="tool-icon" aria-hidden="true">${c.icon}</span><span class="tool-card-body"><strong>${c.name}</strong><span>${c.homeDesc}</span></span></a>`).join('')}</div>
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
    'case-converter': ['duplicate-line-remover', 'lorem-ipsum-generator'],
    'duplicate-line-remover': ['case-converter', 'url-encoder-decoder'],
    'lorem-ipsum-generator': ['reading-time-calculator', 'case-converter'],
    'reading-time-calculator': ['keyword-density-checker', 'lorem-ipsum-generator'],
  };
  const selected = (RELATED[t.slug] || []).map((slug) => TOOLS.find((x) => x.slug === slug)).filter(Boolean);
  const related = selected.length ? selected : [
    ...TOOLS.filter((x) => x.cat === t.cat && x.slug !== t.slug).slice(0, 4),
    ...TOOLS.filter((x) => x.cat !== t.cat).slice(0, 5),
  ].slice(0, 5);
  // guides that reference this tool — the blog↔tool link is two-way
  const guides = ARTICLES.filter((a) => (a.relatedTools || []).includes(t.slug)).slice(0, 3);
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
    <div id="tool-root" data-tool="${t.slug}" class="tool-shell">
${t.html}
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
      ${related.map((x) => `<a href="${rel(path, '/tools/' + x.slug + '/')}"><span aria-hidden="true">${x.icon}</span> ${x.name}</a>`).join('')}
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

function articlePage(a) {
  const path = '/blog/' + a.slug + '/';
  const related = (a.relatedTools || []).map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean);
  const words = a.sections.reduce((n, s) => n + [...(s.p || []), ...(s.p2 || [])].join(' ').split(/\s+/).filter(Boolean).length, 0);
  const paras = (list) => list.map((p) => `<p>${rich(p)}</p>`).join('\n');
  return `<div class="container">
  <nav class="breadcrumb"><a href="${rel(path, '/')}">Home</a> <span class="breadcrumb-sep">/</span> <a href="${rel(path, '/blog/')}">Guides</a> <span class="breadcrumb-sep">/</span> <span>${esc(a.title)}</span></nav>
  <article class="policy article">
    <h1>${esc(a.title)}</h1>
    <p class="article-meta">Published ${esc(a.date)} · By ${esc(a.author)}${a.reviewer ? ' · Reviewed by ' + esc(a.reviewer) : ''} · ${words} words</p>
    <p class="lead">${rich(a.intro)}</p>
    ${a.sections.map((s) => `<h2>${rich(s.h)}</h2>\n${paras(s.p || [])}${s.pre ? `<pre class="article-code">${esc(s.pre)}</pre>` : ''}${paras(s.p2 || [])}`).join('\n')}
    ${a.links && a.links.length ? `<h2>Sources and further reading</h2>\n<ul>${a.links.map((l) => `<li><a href="${esc(l.url)}" rel="noopener nofollow" target="_blank">${esc(l.label)}</a></li>`).join('\n')}</ul>` : ''}
    <h2>Frequently asked questions</h2>
    ${a.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${rich(f.a)}</p></details>`).join('\n')}
    ${related.length ? `<h2>Tools for this guide</h2>\n<ul class="article-tools">${related.map((t) => `<li><a href="${rel(path, '/tools/' + t.slug + '/')}">${esc(t.name)}</a> — ${esc(t.card)}</li>`).join('\n')}</ul>` : ''}
  </article>
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
      <span class="blog-date">${esc(a.date)}</span>
      <strong>${esc(a.title)}</strong>
      <span>${esc(a.intro.slice(0, 180))}…</span>
    </a>`).join('\n    ')}
  </div>
</div>`;
}

function articleLd(a) {
  const path = '/blog/' + a.slug + '/';
  return [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: a.title, description: a.metaDesc, url: SITE.url + path,
      datePublished: a.date, dateModified: a.date,
      author: { '@type': 'Organization', name: a.author },
      publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.url + '/assets/og-image.png' } },
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
  return `<div class="container" style="text-align:center;padding:80px 0">
  <div style="font-size:4rem;margin-bottom:16px">404</div>
  <h1>Page not found</h1>
  <p class="lead" style="margin:0 auto 28px">The page you are looking for does not exist (yet).</p>
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

const run = async () => {
  const warnings = [];
  await rm(R + 'dist', { recursive: true, force: true });
  await mkdir(R + 'dist', { recursive: true });
  await mkdir(R + 'dist/assets/runtime', { recursive: true });

  const pages = [
    { path: '/', title: `${SITE.name} — Free Marketing & SEO Tools, No Signup`, desc: `${TOOLS.length}+ browser-based marketing, SEO, AI-search and web tools. Public-page checks fetch the entered URL through our proxy. No signup, no limits.`, body: homeBody(), ld: homeLd() },
    ...Object.values(CATEGORIES).map((c) => {
      const list = TOOLS.filter((t) => t.cat === c.id);
      const path = '/' + c.slug + '/';
      return {
        path, title: `Free ${c.name} — No Signup, No Limits`, desc: c.metaDesc, body: categoryBody(c, list),
        ld: [breadcrumbLd([{ name: 'Home', path: '/' }, { name: c.name, path }])],
      };
    }),
    ...TOOLS.map((t) => ({ path: '/tools/' + t.slug + '/', title: t.metaTitle, desc: t.metaDesc, body: toolPage(t), ld: toolLd(t) })),
    { path: '/blog/', title: 'Guides — Free SEO and Marketing How-Tos | ' + SITE.name, desc: 'Practical guides for the jobs these tools do: crawler rules, launch checklists, structured data, campaigns and technical SEO — tested, plain and free.', body: blogIndexBody(), ld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Guides', url: SITE.url + '/blog/', description: 'How-to guides for marketers, bloggers and webmasters.' }, breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/blog/' }])] },
    ...ARTICLES.map((a) => ({ path: '/blog/' + a.slug + '/', title: a.metaTitle, desc: a.metaDesc, body: articlePage(a), ld: articleLd(a) })),
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
    const html = layout({ path: p.path, title: p.title, desc: p.desc, body: p.body, ld: p.ld || [], noindex: p.noindex });
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
  const pagePaths = ['/', '/blog/', ...Object.values(CATEGORIES).map((c) => '/' + c.slug + '/'), ...POLICY.map((p) => '/' + p.slug + '/')];
  const toolPaths = TOOLS.map((t) => '/tools/' + t.slug + '/');
  // Do not emit synthetic lastmod values: a build date is not the page's
  // significant content-modification date. Google ignores priority/changefreq.
  const entry = (p) => `  <url><loc>${SITE.url}${p}</loc></url>`;
  const urlset = (paths) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(entry).join('\n')}\n</urlset>\n`;
  await writeFile(R + 'dist/sitemap-pages.xml', urlset(pagePaths));
  await writeFile(R + 'dist/sitemap-tools.xml', urlset(toolPaths));
  await writeFile(R + 'dist/sitemap-blog.xml', urlset(ARTICLES.map((a) => '/blog/' + a.slug + '/')));
  const sitemapChildren = ['/sitemap-pages.xml', '/sitemap-tools.xml', '/sitemap-blog.xml'];
  await writeFile(R + 'dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapChildren.map((s) => `  <sitemap><loc>${SITE.url}${s}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`);

  const robots = `# Tools4Market robots.txt\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
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

  await copyFile(R + 'src/style.css', R + 'dist/assets/style.css');
  await copyFile(R + 'src/site.js', R + 'dist/assets/site.js');
  for (const f of ['seo.js', 'ai-search.js', 'content.js', 'web.js', 'inspect.js', 'audit.js']) {
    await copyFile(R + 'src/runtime/' + f, R + 'dist/assets/runtime/' + f);
  }

  // inject user-facing strings for the inspect/audit/score engine as a global
  // (classic runtime can't import; JSON.stringify keeps it XSS-safe in a script tag)
  const stringsJs = 'window.T4M_ISTR=' + JSON.stringify(INSPECT_TEXT) +
    ';window.T4M_AUDIT=' + JSON.stringify(AUDIT) +
    ';window.T4M_SCORE=' + JSON.stringify(SCORE) + ';\n';
  await writeFile(R + 'dist/assets/inspect-strings.js', stringsJs);

  await writeFile(R + 'dist/assets/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b4fff"/><stop offset="1" stop-color="#0ea47a"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="42" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">T4</text></svg>\n`);
  // social share image (og:image / twitter:image) — pre-rendered, brand palette
  await copyFile(R + 'src/assets/og-image.png', R + 'dist/assets/og-image.png');
  for (const ic of ['icon-192.png', 'icon-512.png']) {
    await copyFile(R + 'src/assets/' + ic, R + 'dist/assets/' + ic);
  }
  // PWA manifest (installability + mobile polish)
  await writeFile(R + 'dist/manifest.webmanifest', JSON.stringify({
    name: SITE.name + ' — ' + SITE.tagline,
    short_name: 'Tools4Market',
    description: `${TOOLS.length}+ free browser-based marketing, SEO, AI-search and web tools. Public-page checks fetch the entered URL through our first-party proxy. No signup, no limits.`,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f5f4f0',
    theme_color: '#5b4fff',
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

/*.html
  Cache-Control: public, max-age=300, must-revalidate

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=(), microphone=(), camera=()
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

  const pageCount = pages.length;
  console.log(`\u2714 Built ${pageCount} HTML pages (${TOOLS.length} tools, ${Object.keys(CATEGORIES).length} categories, ${POLICY.length} policy pages) + sitemap.xml, robots.txt, 404.html, assets.`);
  if (warnings.length) console.log('\u26a0 SEO length warnings (60/158 limits):\n  ' + warnings.join('\n  '));
};

run().catch((e) => { console.error(e); process.exit(1); });

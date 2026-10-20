#!/usr/bin/env node
// Tools4Market — static site generator. Run: node build.mjs
import { rm, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { TOOLS, CATEGORIES, POLICY } from './src/data/index.js';
import { INSPECT_TEXT, AUDIT, SCORE } from './src/data/inspect.js';

const R = fileURLToPath(new URL('.', import.meta.url));
const YEAR = new Date().getFullYear();
const TODAY = new Date().toISOString().slice(0, 10);

const SITE = {
  name: 'Tools4Market',
  url: 'https://www.tools4market.online', // canonical host — apex (tools4market.online) should 301 → www at the host (Cloudflare Page Rule)
  email: 'support@tools4market.online',
  tagline: 'Free Marketing, SEO & AI-Search Tools',
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

const ldTag = (obj) => '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>';

function layout({ path, title, desc, body, ld = [], noindex = false }) {
  const url = SITE.url + path;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="icon" type="image/svg+xml" href="${rel(path, '/assets/favicon.svg')}">
<link rel="stylesheet" href="${rel(path, '/assets/style.css')}">
${ld.map(ldTag).join('\n')}
</head>
<body>
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="${rel(path, '/')}"><span class="logo-mark">T4</span><span>Tools4Market</span></a>
    <nav class="site-nav" aria-label="Main">
      ${Object.values(CATEGORIES).map((c) => `<a href="${rel(path, '/' + c.slug + '/')}">${c.nav}</a>`).join('')}
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
      <p>Free browser-based tools for marketers, bloggers and webmakers. Everything runs 100% in your browser — no signup, no limits, nothing uploaded.</p>
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
    <p>&copy; ${YEAR} ${SITE.name} &middot; ${SITE.tagline} &middot; <a href="${rel(path, '/privacy-policy/')}">Privacy</a> &middot; <a href="${rel(path, '/terms/')}">Terms</a> &middot; <a href="${rel(path, '/disclaimer/')}">Disclaimer</a></p>
  </div>
</footer>
<script defer src="${rel(path, '/assets/site.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/seo.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/ai-search.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/content.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/web.js')}"></script>
<script defer src="${rel(path, '/assets/inspect-strings.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/inspect.js')}"></script>
<script defer src="${rel(path, '/assets/runtime/audit.js')}"></script>
</body>
</html>`;
}

const toolCard = (t, path) => `<a class="tool-card" href="${rel(path, '/tools/' + t.slug + '/')}" data-search="${esc((t.name + ' ' + t.card + ' ' + t.keywords).toLowerCase())}">
  <span class="tool-icon" aria-hidden="true">${t.icon}</span>
  <span class="tool-card-body"><strong>${t.name}</strong><span>${t.card}</span></span>
</a>`;

const adSlot = (label) => `<div class="ad-slot" role="complementary" aria-label="Advertisement space">Ad space &mdash; live after AdSense approval${label ? ' &middot; ' + label : ''}</div>`;

function homeLd() {
  return [
    {
      '@context': 'https://schema.org', '@type': 'WebSite',
      name: SITE.name, url: SITE.url + '/',
      description: `${TOOLS.length}+ free browser-based marketing, SEO, AI-search and web tools. Nothing uploaded, no signup, no limits.`,
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: SITE.name, url: SITE.url + '/', logo: SITE.url + '/assets/og-image.png',
      email: SITE.email,
    },
  ];
}

function homeBody() {
  const path = '/';
  const cats = Object.values(CATEGORIES);
  return `<section class="hero">
  <div class="container">
    <div class="hero-eyebrow">&#10022; 100% browser-based &mdash; nothing uploaded</div>
    <h1>Free Marketing, SEO &amp; AI-Search Tools</h1>
    <p class="hero-sub">${TOOLS.length}+ tools that run entirely on your device &mdash; no signup, no limits. Built for marketers, bloggers and webmakers who value their time.</p>
    <div class="hero-search">
      <input type="search" id="tool-search" placeholder="Search ${TOOLS.length} tools&hellip; try &ldquo;meta&rdquo;, &ldquo;robots&rdquo;, &ldquo;password&rdquo;" aria-label="Search tools">
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><span class="hero-stat-num">${TOOLS.length}+</span><span class="hero-stat-label">Free Tools</span></div>
      <div class="hero-stat"><span class="hero-stat-num">${Object.keys(CATEGORIES).length}</span><span class="hero-stat-label">Categories</span></div>
      <div class="hero-stat"><span class="hero-stat-num">0</span><span class="hero-stat-label">Signups needed</span></div>
      <div class="hero-stat"><span class="hero-stat-num">100%</span><span class="hero-stat-label">In-browser</span></div>
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
  <section class="tool-content home-content">
    <h2>Free browser-based tools for marketing, SEO and AI search</h2>
    <p>Tools4Market brings ${TOOLS.length} focused utilities into one place: generate meta tags and Open Graph cards, preview your Google snippet, ship a <a href="${rel(path, '/tools/robots-txt-generator/')}">robots.txt</a> that covers every AI crawler, build UTM-tagged campaign links, analyse keyword density, create XML sitemaps, and run a full on-page audit of any URL. Each tool does one job properly — with presets, validation and copy-ready output — instead of burying it under ten ads and a signup wall.</p>
    <p>Browse by category: ${cats.map((c) => `<a href="${rel(path, '/' + c.slug + '/')}">${c.nav}</a>`).join(', ')}.</p>
    <h2>Why run your tools in the browser?</h2>
    <p>Because your inputs never leave your device. Pasting draft copy, campaign URLs or client data into a server-side tool means handing it to a stranger; here, the work happens in your tab. Results appear as you type, everything works offline once the page has loaded, and there are no usage queues, hidden limits or upgrade prompts. The <a href="${rel(path, '/privacy-policy/')}">privacy policy</a> says the same thing in legal language: we cannot see your inputs, because they are never sent to us.</p>
    <h2>How it works</h2>
    <p>Pick a tool from the grids above or search from the box at the top. Fill in the fields — or paste your own page URL where the tool offers a live check — then copy or download the result. Output is validated as you go, so the first result is usually the final one. Every tool page also carries a short how-to, honest FAQs and links to related tools, so you can go deeper without another round of search results.</p>
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
  const related = [
    ...TOOLS.filter((x) => x.cat === t.cat && x.slug !== t.slug).slice(0, 4),
    ...TOOLS.filter((x) => x.cat !== t.cat).slice(0, 5),
  ].slice(0, 5);
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
    { path: '/', title: `${SITE.name} — Free Marketing & SEO Tools, No Signup`, desc: `${TOOLS.length}+ free browser-based marketing, SEO, AI-search and web tools. Nothing uploaded, no signup, no limits. Run them right in your browser.`, body: homeBody(), ld: homeLd() },
    ...Object.values(CATEGORIES).map((c) => {
      const list = TOOLS.filter((t) => t.cat === c.id);
      return { path: '/' + c.slug + '/', title: `Free ${c.name} — No Signup, No Limits`, desc: c.metaDesc, body: categoryBody(c, list) };
    }),
    ...TOOLS.map((t) => ({ path: '/tools/' + t.slug + '/', title: t.metaTitle, desc: t.metaDesc, body: toolPage(t), ld: toolLd(t) })),
    ...POLICY.map((p) => ({ path: '/' + p.slug + '/', title: p.metaTitle, desc: p.metaDesc, body: policyPage(p) })),
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

  const sitemapPaths = ['/', ...Object.values(CATEGORIES).map((c) => '/' + c.slug + '/'), ...TOOLS.map((t) => '/tools/' + t.slug + '/'), ...POLICY.map((p) => '/' + p.slug + '/')];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((p) => `  <url><loc>${SITE.url}${p === '/' ? '/' : p}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>${p === '/' ? '1.0' : p.includes('/tools/') ? '0.8' : '0.7'}</priority></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(R + 'dist/sitemap.xml', sitemap);

  const robots = `# Tools4Market robots.txt\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
  await writeFile(R + 'dist/robots.txt', robots);

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

  const pageCount = pages.length;
  console.log(`\u2714 Built ${pageCount} HTML pages (${TOOLS.length} tools, ${Object.keys(CATEGORIES).length} categories, ${POLICY.length} policy pages) + sitemap.xml, robots.txt, 404.html, assets.`);
  if (warnings.length) console.log('\u26a0 SEO length warnings (60/158 limits):\n  ' + warnings.join('\n  '));
};

run().catch((e) => { console.error(e); process.exit(1); });

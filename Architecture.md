# Tools4Market — System Architecture

*Version: 2.1 · 21 Oct 2026 · 30 tools, 44 generated HTML pages*

---

## 1. Architectural approach

**Static frontend with one bounded serverless fetch route.** A Node.js build script (`build.mjs`) compiles tool definitions into flat HTML pages. Most tool work executes in the browser. URL-based page diagnostics use the first-party `/api/fetch` route to retrieve a public page, `robots.txt` and selected sitemap files. The app does not save analysis reports or maintain a database.

This gives:
- **₹0 hosting** (Cloudflare Pages free tier, global CDN)
- **Sub-100ms TTFB** → strongest Core Web Vitals → ranking advantage
- **Small server surface** (no PHP, plugins or database; `/api/fetch` has URL guards, a response cap and timeout)
- **Low-friction tools** (pasted text is analyzed in-browser; URL mode sends the requested public URL to the fetch route)
- **AI-Overview resistant** — tools give immediate value that AI summaries cannot replicate

---

## 2. Frontend / Backend separation

This project has **no backend** in the traditional sense. The distinction is:

### "Build-time backend" (runs on developer's machine / CI)

```
src/
├── data/               ← BUILD-TIME ONLY — never shipped to browser
│   ├── index.js        ← Central export: TOOLS, CATEGORIES, POLICY
│   ├── helpers.js      ← HTML form-field builder functions (build-time)
│   ├── seo.js          ← 8 SEO tool definitions (content + markup templates)
│   ├── ai-search.js    ← 3 AI Search tool definitions
│   ├── content.js      ← 4 Content & Social tool definitions
│   ├── web.js          ← 3 Web & Utility tool definitions
│   └── policy.js       ← 5 policy page HTML (About, Contact, Privacy, Terms, Disclaimer)
│
build.mjs               ← Static site generator (Node 18+, zero npm deps)
```

**Role:** Reads all data files → generates `dist/**/*.html` + `sitemap.xml` + `robots.txt`  
**Runs:** `node build.mjs` (local) or the `build` npm script (CI/Cloudflare)  
**Output:** `dist/` directory (every file is plain static HTML/CSS/JS)

### Frontend (shipped to browser)

```
src/
├── style.css           ← Design system (Outfit + Inter fonts, CSS tokens)
├── site.js             ← Shell runtime: copy buttons, live search, tool init dispatcher
└── runtime/            ← Per-category tool logic (classic IIFE scripts, no bundler)
    ├── seo.js          ← Logic for 8 SEO & Meta tools
    ├── ai-search.js    ← Logic for robots.txt, AI blocker, llms.txt tools
    ├── content.js      ← Logic for slug, UTM, keyword density, hashtag tools
    ├── web.js          ← Logic for .htaccess, sitemap, password tools
    ├── inspect.js      ← Page fetch, HTML extraction, phrase comparison, shared inspector panel
    └── audit.js        ← Web Crawler Audit and SEO Score Checker
```

**Role:** Runs in the visitor's browser after page load. URL mode calls `/api/fetch`; pasted text and markup checks stay in the browser.
**Shipped as:** Static files copied verbatim to `dist/assets/`  
**Size:** ~60KB total unminified (no framework, no bundler overhead)

---

## 3. Directory structure (full)

```
Tools4market/
│
├── build.mjs                    ← Site generator (run: node build.mjs)
├── serve-dev.mjs                ← Local preview server: static + /api/fetch proxy (port 8090)
├── package.json                 ← npm scripts: build, serve
│
├── src/                         ← SOURCE (never deploy this folder directly)
│   ├── style.css                ← Single CSS file (design system + all components)
│   ├── site.js                  ← Shared client JS (copy, search, tool bootstrap)
│   │
│   ├── data/                    ← BUILD-TIME DATA (ES modules, not shipped)
│   │   ├── index.js             ← Exports TOOLS[], CATEGORIES{}, POLICY[]
│   │   ├── helpers.js           ← HTML builder: f.text(), f.select(), outputBlock(), …
│   │   ├── seo.js               ← SEO tool definitions
│   │   ├── ai-search.js         ← 3 AI Search tool definitions
│   │   ├── content.js           ← 4 Content tool definitions
│   │   ├── web.js               ← 3 Web tool definitions
│   │   └── policy.js            ← About, Contact, Privacy, Terms, Disclaimer HTML
│   │
│   └── runtime/                 ← CLIENT-SIDE TOOL LOGIC (IIFE, ES5 compatible)
│       ├── seo.js               ← meta-tag-generator, og, twitter, canonical, hreflang,
│       │                           schema, serp-preview, meta-description-checker
│       ├── ai-search.js         ← robots-txt-generator, ai-crawler-blocker, llms-txt-generator
│       ├── content.js           ← url-slug-generator, utm-link-builder,
│       │                           keyword-density-checker, hashtag-generator
│       ├── web.js               ← htaccess-redirect-generator, sitemap-generator,
│       │                           password-generator
│       ├── inspect.js            ← shared HTML fetch/parse and personalized output
│       └── audit.js              ← web-crawler-audit and seo-score-checker
│
├── dist/                        ← GENERATED OUTPUT (deploy this folder)
│   ├── index.html               ← Homepage: hero + search + all 30 tool cards
│   ├── seo-tools/index.html     ← Category hub pages (4 total)
│   ├── ai-search-tools/
│   ├── content-social-tools/
│   ├── web-utility-tools/
│   ├── tools/                   ← Tool pages (30 total)
│   │   ├── meta-tag-generator/index.html
│   │   ├── open-graph-generator/index.html
│   │   └── … (16 more)
│   ├── about/  contact/  privacy-policy/  terms/  disclaimer/
│   ├── assets/
│   │   ├── style.css            ← Copied from src/style.css
│   │   ├── site.js              ← Copied from src/site.js
│   │   ├── favicon.svg          ← Generated inline SVG
│   │   └── runtime/             ← Copied from src/runtime/
│   │       ├── seo.js
│   │       ├── ai-search.js
│   │       ├── content.js
│   │       ├── web.js
│   │       ├── inspect.js
│   │       └── audit.js
│   │   ├── inspect-strings.js   ← Build-time findings and labels for inspection runtimes
│   ├── sitemap.xml              ← Auto-generated (all pages)
│   ├── robots.txt               ← Allow-all + sitemap reference
│   └── 404.html                 ← Custom 404 page
│
├── Architecture.md              ← This file
├── design.md                    ← Design system reference (v2)
├── README.md                    ← Build, deploy, how-to-add-tool guide
├── rules.md                     ← Non-negotiable quality rules
├── RESEARCH-AND-PLAN.md         ← Market research & revenue strategy
├── progress.md                  ← Append-only build log
├── pending-work.md              ← Remaining work tracker by phase
└── projectreport.md             ← Stakeholder status report
```

---

## 4. Data flow

```
┌─────────────────────────────────────────────────┐
│  BUILD TIME (Node.js / developer machine / CI)  │
│                                                  │
│  src/data/*.js ──(import)──▶ build.mjs          │
│       │                          │               │
│       │  tool HTML templates     │               │
│       │  SEO copy                ▼               │
│       │  structured data    dist/**/*.html       │
│       │                          +               │
│  src/style.css ─────(copy)──▶ dist/assets/      │
│  src/site.js ───────(copy)──▶ dist/assets/      │
│  src/runtime/*.js ──(copy)──▶ dist/assets/      │
└─────────────────────────────────────────────────┘
                    │
                    │  static files served
                    ▼
┌─────────────────────────────────────────────────┐
│  RUNTIME (visitor's browser)                    │
│                                                  │
│  HTML loads scripts in dependency order:         │
│  site.js → inspect strings → inspect.js →       │
│  tool runtimes → audit.js → site.js boots →      │
│  reads #tool-root[data-tool="slug"] →            │
│  calls window.T4M_TOOLS["slug"](root) →          │
│  tool initialises, listens for input events →    │
│  live output updates on every keystroke          │
└─────────────────────────────────────────────────┘
                    │
                    │ URL analysis only
                    ▼
┌─────────────────────────────────────────────────┐
│  CLOUDFLARE /api/fetch                          │
│  Retrieves entered public URLs and returns      │
│  response HTML and metadata to the browser.     │
│  No report database or saved analysis.          │
└─────────────────────────────────────────────────┘
```

---

## 5. Tool registration pattern

Each runtime file registers tools on the global `window.T4M_TOOLS` object:

```js
// src/runtime/seo.js (pattern)
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};

  T['meta-tag-generator'] = function (root) {
    // root = the #tool-root element
    var out = root.querySelector('#mt-out');
    function update() { /* generate HTML, write to out.textContent */ }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update(); // initial render
  };
})();
```

`site.js` dispatches on `DOMContentLoaded`:
```js
var fn = window.T4M_TOOLS[root.getAttribute('data-tool')];
if (typeof fn === 'function') fn(root);
```

**Why IIFE + ES5?** So runtime files work when opened directly from disk (`file://`) without a web server — no modules, no bundler, no CORS errors.

---

## 6. URL model

| Page type | Path | Example |
|---|---|---|
| Homepage | `/` | `tools4market.online/` |
| Category hub | `/{cat-slug}/` | `tools4market.online/seo-tools/` |
| Tool page | `/tools/{slug}/` | `tools4market.online/tools/meta-tag-generator/` |
| Policy page | `/{slug}/` | `tools4market.online/privacy-policy/` |
| 404 | `/404.html` | (Cloudflare custom 404) |

**All internal links are relative** (computed by `rel(from, to)` in `build.mjs`) → works on `file://`, localhost and production without changes.

**Absolute URLs** (canonical, OG, sitemap) driven by `SITE.url` in `build.mjs` — update via `TODO-DOMAIN` marker after domain purchase.

---

## 7. SEO scaffolding (built into every page)

- Unique `<title>` ≤60 chars + `<meta name="description">` ≤158 chars
- `<link rel="canonical">` + Open Graph + Twitter Card tags
- **Tool pages:** JSON-LD for `WebApplication` + `FAQPage` + `BreadcrumbList`; category and policy pages also carry `BreadcrumbList`
- Auto-generated sitemap index and child sitemaps; omit `lastmod` unless reliable per-page modification dates are available (Google ignores `priority`/`changefreq`)
- `robots.txt` (allow-all + sitemap reference)
- One `<h1>` per page, semantic `<h2>/<h3>`, breadcrumb trail, 3–5 related tool links
- Build-time SEO length warnings (title >60 or desc >158 logged to console)

---

## 8. Monetization scaffolding

`.ad-slot` divs are pre-positioned on every tool page:
- **Position 1:** Top banner (above `<div class="container tool-layout">`)
- **Position 2:** Sidebar (inside `<aside class="tool-side">`)
- **Position 3:** Below FAQ (before `</article>`)

After AdSense approval: replace `adSlot()` in `build.mjs` with real `<ins class="adsbygoogle">` unit. Layout already reserves minimum-height space → no Cumulative Layout Shift.

---

## 9. Phase 2 & 3 extension points

### Built — the `/api/fetch` proxy (20 Oct 2026)

`functions/api/fetch.js` is a **Cloudflare Pages Function** that ships with the static site (no extra infra). It is the one server-side surface, and it exists because a browser cannot reliably read an arbitrary customer URL (CORS + flaky public gateways).

```
Route: GET /api/fetch?url=<encoded>
  → fetches the target server-side, returns { ok, status, finalUrl, contentType, xRobotsTag, bytes, ms, body }
  → SSRF-guarded (blocks loopback / private / cloud-metadata hosts)
  → 1.5 MB response cap, 12 s timeout, http/https only
```

It powers the shared page inspector on applicable tools, plus the **Web Crawler Audit** and **SEO Score Checker**. Client-side graceful degradation keeps pasted-HTML analysis available if remote fetch is unavailable:

1. `/api/fetch` proxy → 2. direct browser fetch (CORS-open origins) → 3. **paste-HTML** (fully in-browser).

The five upgraded SEO tools share the same parsed page snapshot: the crawler audit checks the fetched response, Googlebot robots.txt rule, and declared/common sitemap paths; the score checker shows weighted on-page evidence while target phrase placement stays contextual; SERP and description tools prefill from fetched metadata and compare an optional phrase; the keyword checker counts exact phrase occurrences in extracted main text. These public-fetch findings do not expose Google’s index or Search Console data. The generated pages load `inspect-strings.js` and `inspect.js` before runtimes that depend on them.

When deployed on Cloudflare Pages the proxy is live automatically. On a plain static host or `file://` preview, layer 3 keeps every feature functional.

**Local parity:** `serve-dev.mjs` (`npm run serve`, port 8090) is a zero-dependency Node server that serves `dist/` **and implements the same `/api/fetch` route with the same guardrails**, so URL mode is fully testable locally before deploy. Test harnesses and docs assume port 8090.

### Phase 2 (weeks 4–8) — pure static

- Add 20+ tools to existing `src/data/` and `src/runtime/` files, rebuild
- Blog: add `src/data/blog.js` → `build.mjs` generates `/blog/{slug}/` pages
- Minification: add `esbuild` or `csso` as dev dependency, run in `build.mjs`
- `_headers` file in `dist/` for Cloudflare cache-control headers

### Phase 3 (months 3–4) — more serverless checks

More tools can reuse the same `/api/fetch` route (or sibling routes) for real HTTP checks:

```
Route: /api/check-index?url=…   → proxies Google Search Operators result
Route: /api/og-check?url=…      → fetches OG tags from target URL server-side
Route: /api/ssl-check?host=…    → TLS certificate inspection
```

This remains the only backend surface. Tool generation and pasted-text analysis stay client-side; URL inspection uses this bounded fetch route.

---

## 10. Deployment

| Platform | Config |
|---|---|
| **Cloudflare Pages** (recommended) | Framework: None · Build cmd: `node build.mjs` · Output: `dist` |
| Vercel | Framework: Other · Build cmd: `node build.mjs` · Output: `dist` |
| Netlify | Build cmd: `node build.mjs` · Publish dir: `dist` |
| GitHub Pages | Run build in Actions, push `dist/` to `gh-pages` branch |

**Node version required:** 18+ (uses `node:fs/promises` and ES modules with `import`)

## 11. Page-aware prefill and higher-confidence utility output (21 Oct 2026)

The shared inspector in `src/runtime/inspect.js` keeps a single fetched HTML snapshot and adds evidence only where a tool can use it. It extracts existing JSON-LD objects and up to 250 distinct, same-origin links from the strongest page-content container. When the visitor analyzes a page for the Robots.txt Generator, AI Crawler Blocker or XML Sitemap Generator, it also requests that host's public `robots.txt`; the sitemap generator follows at most four same-origin sitemap files (an index plus three child maps) and imports up to 250 unique URLs. It reads at most two sitemap declarations from robots.txt, considers up to three child maps, and falls back to `/sitemap.xml` when no declaration exists. Sitemap URLs and page links are candidates; the tool does not validate page status, canonical, noindex or index inclusion for every candidate.

The page-prefill map now also uses observed values for existing hreflang and supported JSON-LD fields, robots sitemap declarations, sitemap lists, llms.txt link suggestions, headings and extracted main text. It does not invent missing locale/schema facts. Page-independent tools (for example password, Base64, UUID, JWT and lorem ipsum) skip the unrelated page-analysis panel. The homepage FAQ and privacy policy explain that sitemap/crawler checks may fetch `robots.txt` and sitemap files on the same public host.

Standalone utility changes remain browser-side: password strings use unbiased rejection sampling conditioned on selected character sets, and the strength estimate accounts for that constraint; JWT output summarizes registered time and identity claims while explicitly remaining decode-only; the user-agent parser starts with the current browser string; and calendar output uses RFC 5545 VERSION:2.0 with explicit floating-local or UTC interpretation. These tools do not send pasted values to the page-analysis fetch service.

---

## 12. Audit-driven restructure: identity, homepage IA and distribution hooks (22 Oct 2026)

Implements the actionable code items from the 22 Oct 2026 full-site audit (visual
identity, task-focused homepage, internal linking, favicon, structured landing
pages, measurement hooks). Production was **not** touched by that audit — this
section describes what the repo now builds; deploying it is a separate step.

### Homepage information architecture (`homeBody()` in `build.mjs`)

Order is now job-first instead of inventory-first:

1. **Hero** — outcome-led H1 ("Find the right tool. Finish the job."), task-language
   search placeholder, and the **editor's pick** card in the right column.
2. **Start with your job** — four high-intent paths (`JOBS` in `src/data/index.js`),
   one per category, each landing on a priority tool.
3. **Four outcome categories** — numbered `01`–`04`, each with its top three tools.
4. **Guides that show the work** — three newest guides, framed as tool-adjacent.
5. **Full tool directory** — all tools, numbered category sections, still the
   search filter's domain (`.tool-card` + `.cat-section` behaviour unchanged).
6. **Contact / feedback band** — "Suggest a tool" / "Report a bug" → `/contact/`.
7. Existing SEO prose block + homepage FAQs (FAQPage schema).

The editor's pick rotates weekly: `EDITOR_PICKS` × `weekIndex()` picks the entry,
so the card changes on its own every Monday. Each pick tool carries `pickWhy`
(the use case) and `pickSample` (a real output preview) in its data file.

### Tool landing pages

- Every tool defines `usedFor` (rendered on its card as a brass "for …" line and
  in the tool-page meta strip). The ten priority tools also carry a real
  `updated` date, rendered as a visible `Last updated` label and used as
  `dateModified`/`lastmod` where applicable.
- The guide sidebar falls back to same-task-cluster guides when no guide names the
  tool directly, so no priority tool is a dead end in the guide graph.

### Identity & assets

- Design system **v2.1 "Classic Editorial Utility"** (see `design.md`): ink navy
  on warm paper, Fraunces display serif, brass accents, numbered sections.
- `/favicon.ico` is generated at build time (the 192px PNG icon wrapped in an ICO
  container) and linked after the SVG favicon — the root request used to 404.

### Measurement & distribution hooks

- **GA4 events** (consent-gated through the existing Consent Mode v2 flow, via a
  single `track()` helper in `src/site.js`): `tool_open`, `tool_run` (first
  interaction inside the tool shell), `copy_output`, `download_output`,
  `blog_cta_click` (guide → tool), `contact_click`.
- **Sitemap `<lastmod>`** is emitted only where a real date exists: guide entries
  carry their publish/update date from `src/data/blog.js`; tool and page entries
  stay without `lastmod` (a build date is not a modification date).
- **IndexNow** — set `INDEXNOW_KEY` and the build publishes `/{key}.txt`;
  `npm run indexnow` submits new/updated URLs to the participating engines
  (Bing et al.). Google is not an IndexNow participant — Search Console +
  sitemap submission remains the Google path.
- **Google site verification** — `GOOGLE_SITE_VERIFY` emits the
  `google-site-verification` meta tag when a property needs the HTML method (the
  domain property is already verified via DNS TXT, so it defaults to empty).

### Crawler policy (deliberate, per the audit's open question)

The site's own `robots.txt` allows every crawler, including AI crawlers. This is
the product position: Tools4Market *sells* crawler-policy decisions (the Robots.txt
Generator / AI Crawler Blocker make them per site), so the host itself stays fully
open. Blocking AI bots is a per-customer choice, not this site's default. If that
decision ever changes, change `robots.txt` in `build.mjs` and the copy in the
homepage FAQ together.

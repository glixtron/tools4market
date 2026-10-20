# Tools4Market — System Architecture

*Version: 2.0 · 20 Oct 2026 · Phase 1 complete (18 tools, 29 pages)*

---

## 1. Architectural approach

**100% static site.** A Node.js build script (`build.mjs`) compiles tool definitions into flat HTML pages. All 18 Phase-1 tools execute entirely in **client-side JavaScript** — no backend, no database, no user data collected or stored anywhere.

This gives:
- **₹0 hosting** (Cloudflare Pages free tier, global CDN)
- **Sub-100ms TTFB** → strongest Core Web Vitals → ranking advantage
- **Zero attack surface** (no PHP, no plugins, no database)
- **AdSense-safe** (no data collection, complete policy pages)
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

### "Frontend" (shipped to browser — runs 100% client-side)

```
src/
├── style.css           ← Design system (Outfit + Inter fonts, CSS tokens)
├── site.js             ← Shell runtime: copy buttons, live search, tool init dispatcher
└── runtime/            ← Per-category tool logic (classic IIFE scripts, no bundler)
    ├── seo.js          ← Logic for 8 SEO & Meta tools
    ├── ai-search.js    ← Logic for robots.txt, AI blocker, llms.txt tools
    ├── content.js      ← Logic for slug, UTM, keyword density, hashtag tools
    └── web.js          ← Logic for .htaccess, sitemap, password tools
```

**Role:** Runs in the visitor's browser after page load  
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
│   │   ├── seo.js               ← 8 SEO tool definitions
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
│       └── web.js               ← htaccess-redirect-generator, sitemap-generator,
│                                   password-generator
│
├── dist/                        ← GENERATED OUTPUT (deploy this folder)
│   ├── index.html               ← Homepage: hero + search + all 18 tool cards
│   ├── seo-tools/index.html     ← Category hub pages (4 total)
│   ├── ai-search-tools/
│   ├── content-social-tools/
│   ├── web-utility-tools/
│   ├── tools/                   ← Tool money pages (18 total)
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
│   │       └── web.js
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
│  HTML page loads → site.js boots →              │
│  reads #tool-root[data-tool="slug"] →            │
│  calls window.T4M_TOOLS["slug"](root) →          │
│  tool initialises, listens for input events →    │
│  live output updates on every keystroke          │
│                                                  │
│  No API calls. No server. No login. Zero data.  │
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
- **Tool pages only:** JSON-LD for `WebApplication` + `FAQPage` + `BreadcrumbList`
- Auto-generated `sitemap.xml` (priority: `/` = 1.0, tool pages = 0.8, others = 0.7)
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
  → fetches the target server-side, returns { ok, status, finalUrl, bytes, ms, body }
  → SSRF-guarded (blocks loopback / private / cloud-metadata hosts)
  → 1.5 MB response cap, 12 s timeout, http/https only
```

It powers the **"analyze your own page first"** panel on every tool, plus the **Web Crawler Audit** and **SEO Ranking Score** tools. Client-side graceful degradation (so tools never hard-depend on it):

1. `/api/fetch` proxy → 2. direct browser fetch (CORS-open origins) → 3. **paste-HTML** (fully in-browser, nothing uploaded).

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

This remains the only backend surface. All other tools stay 100% client-side forever.

---

## 10. Deployment

| Platform | Config |
|---|---|
| **Cloudflare Pages** (recommended) | Framework: None · Build cmd: `node build.mjs` · Output: `dist` |
| Vercel | Framework: Other · Build cmd: `node build.mjs` · Output: `dist` |
| Netlify | Build cmd: `node build.mjs` · Publish dir: `dist` |
| GitHub Pages | Run build in Actions, push `dist/` to `gh-pages` branch |

**Node version required:** 18+ (uses `node:fs/promises` and ES modules with `import`)

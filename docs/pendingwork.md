# Pending Work

## Status

Site-side code is current; the remaining work is a content roadmap (below) plus founder-side actions.

- **60 tools / 104 pages / 27 guides** — `regex-tester` and `qr-code-generator` added 31 Oct; `word-counter`, `character-counter`, `color-picker`, `css-minifier` added 10 Nov; `cron-expression-generator`, `json-to-csv`, `text-diff`, `hash-generator` added 11 Nov; `favicon-generator`, `svg-optimizer`, `markdown-to-html`, `email-validator` added 11 Nov; `rich-results-tester` added 14 Nov; the research release added `/research/`, `/research/ai-crawlers-2026/`, `/ai-crawlers/` and three seasonal guides on 14 Nov.
- All 60 tool pages smoke-tested (`npm test` → 60/60)
- Behaviour suite **139 assertions** (`npm run test:tools`) — ZIP CRCs, ICO bytes, SVG rules, exact Markdown strings, email rule codes, rich-results property rules, not just rendering
- SEO audit **3291/0**
- Internal links **6,013 / 104 pages**, now including fragments (`/blog/slug/#anchor` must match an `id`)
- Consent 30/30 · worker-routing 28/28 · audit-batch 50 · suggest 24 · personalized 181 · visual 7/7 · audit rules 73 · live 82/82
- Sitemap index lists **99 URLs** (12 pages + 60 tools + 27 guides); the four legal/contact pages are noindex and out of the sitemap
- Audit **0 blockers / 3 minors / 98 per 100**

### GSC recovery batch (14 Nov 2026)

Diagnosis and plan: [`docs/seo/gsc-diagnosis-2026-11-14.md`](seo/gsc-diagnosis-2026-11-14.md).
Indexed URLs fell 84 → 27 on 7 Nov and impressions fell 160 → 34 → 1/day on 8–11 Nov. No technical block:
all sitemap URLs 200, canonicals self-referencing, 91% of Googlebot fetches 200, crawl 78–257 ms. The
not-indexed table moved 4 → 66 "Crawled – currently not indexed" between the 10 and 14 Nov exports, while
redirects drained 38 → 33 after the 10 Nov 301 fix.

- **`/tools/rich-results-tester/`** — new local JSON-LD checker. Article, FAQPage, BreadcrumbList, Product,
  Offer, Recipe, Organization, WebSite, Event, VideoObject, HowTo and LocalBusiness, with required vs
  recommended properties and ISO/absolute-URL value checks. Targets ~100 existing impressions for "rich
  snippet testing tool", "rich snippet checker", "google schema checker" at positions 76–89.
- **Core Web Vitals guide** — threshold table for LCP/CLS/INP; the page holds position 16.9 for
  "what is cls in core web vitals", the closest query on the site to page 1.
- **Synonyms** — keyword density ↔ word density / "kw density checker" (25 impressions @ 76.8),
  QR code ↔ "barcode" (30 impressions @ 58.9–92).
- **Fixed** — `marketing-budget-calculator` threw `ReferenceError: g is not defined` on every update, so
  its KPI tiles and bar chart never rendered. Helper now takes its arguments; chart verified in Chrome.
- **`scripts/keyword-research.mjs`** + `docs/seo/keyword-map-2026-11-14.csv` — 1,152 phrases, 846 covered,
  306 gaps, 103 with impressions. Re-run with `--queries <GSC Queries export>` after each export.
- **`tests/visual-verify.mjs`** — repaired for the current jsdom API (it could not boot a page at all).
- **Not caused by ads**: AdSense slots are unfilled and consent-gated; the drop predates any ad serving.

#### Coverage drilldowns (14 Nov) — every listed URL disposed

Full table in the diagnosis, §7. 33 redirects + 25 canonical duplicates need no code: the 301s and
canonicals are live and Google drains them as it recrawls. `?ref=` URLs are deliberately **not** disallowed,
because a blocked URL cannot be crawled and therefore cannot relay its canonical.

**Deployed 14 Nov** (commit `9de1574`, Worker `3a37790a`). Verified on production: the 301, the four
noindex pages, the `/feed.xml` header, the `/tow0/` disallow, and 82/82 live assertions.
Sitemap index: <https://tools4market.online/sitemap.xml> — 99 URLs (12 pages + 60 tools + 27 guides).

- **1 real 404 fixed** — `/blog/website-audit/` → `/tools/website-audit/`, a 301 map in `worker.js`
  (before trailing-slash normalisation, query preserved, one hop without the slash). Four routing assertions.
- **4 legal pages noindexed** — `/privacy-policy/`, `/terms/`, `/disclaimer/`, `/contact/` were four of the
  66 "crawled – not indexed" URLs. `noindex: true` in `policy.js`; removed from `sitemap-pages.xml`; footer
  links kept. SEO audit now asserts noindex pages are never in a sitemap.
- **`/feed.xml`** — `X-Robots-Tag: noindex` in `dist/_headers`. It was crawled as a page and can never rank.
- **`/tow0/`** — a 593 KB Google Tag Manager proxy served by Cloudflare, not in this repo. `Disallow: /tow0/`.
  Owner to confirm it is the Tag Gateway.
- **53 URLs remain declined** (41 tools, 9 guides, 3 category hubs) — 887–1,684 words, sitemapped, 3+ inbound
  links, unique titles/descriptions/H1s. No page-level defect; the fix is the §6 plan, not more markup.

Owner actions (Search Console, in the plan §6): confirm Manual actions and Security issues are clean;
resubmit `sitemap.xml` after deploy (expect 99 URLs); request indexing for the ten highest-value URLs in
plan §7 step 3 — not the `http://` or `?ref=` forms; confirm `/tow0/` in the Cloudflare dashboard; hold off
further site-wide template changes while the index recovers.

### Research release (14 Nov 2026)

- **Dataset:** 1,000 qualifying domains from the Tranco top-1m list, one `GET /robots.txt` each, 18 AI crawler tokens resolved per file. 895 readable, 45 no file, 60 unreadable; parser in `src/data/robots-parse.js` (12 unit tests), collector in `scripts/ai-crawler-study.mjs` (re-runnable), snapshot in `src/data/ai-crawler-study.json` / `.csv`.
- **Pages:** `/research/` (index), `/research/ai-crawlers-2026/` (study, method, limits, FAQ, Dataset schema, `dataset.csv` beside it), `/ai-crawlers/` (18-token reference + three robots.txt templates).
- **Guides:** `/blog/seo-checklist-2027/`, `/blog/year-end-website-audit/`, `/blog/content-pruning-before-january/` — published 14 Nov so they are crawled before December demand.
- **Home + footer:** research band above the CTA band, "Research" and "AI crawlers" footer links, `llms.txt` "Research" section, sitemap pages entries.
- **Hero:** AVIF (41.6 KB) and WebP (57 KB) derivatives of the 300 KB PNG, served through `<picture>` with the PNG as fallback.
- **Email capture:** renders only when `BUTTONDOWN_USERNAME` is set; it is **not set**, so nothing ships yet. `BUTTONDOWN_USERNAME=<name>` in `.env` turns the form on at home and `/blog/`.
- **Deliberately not done:** `<lastmod>` on the pages sitemap. The audit asserts no synthetic lastmod on page URLs, and a build date is not a modification date.



- **Next pair:** HTML minifier + HTML → Markdown around **one shared HTML tokenizer**, so `<pre>`, `<textarea>`, `<script>`, `<style>`, conditional comments and inline SVG survive. Still pending: **QR scanner**, and the individually-deferred **JS minifier**. URL shortener was dropped from the roadmap on 11 Nov (`docs/url-shortener-design.md` explains why).
- **12 guides** gap-checked against the 24 that exist.
- **Bot decision table** — done 11 Nov, as a section inside `/blog/robots-txt-for-search-and-ai-crawlers/`, not a new page. Rendered from `src/data/bots.js`, the same array the robots.txt generator uses.
- VISITOR_FIX map added with 11 rule entries
- Handoff map with 11 tool destinations configured
- SITE_AUDIT toolFor mapping updated

### Decisions waiting on the owner

- [ ] **Ratify or reject the vendored QR encoder** (`src/vendor/qrcode.js`, MIT). The build still has zero npm dependencies, but rules.md §3 says "no npm dependencies" — the cleanest wording is "no npm *build* dependencies; third-party browser code must be vendored, licensed and loaded only on the page that needs it."
- [ ] **Eyebrow mandate** — `design.md` §9 requires an eyebrow plus rule on every homepage section, which the same doc flags as an AI tell. Proposal: keep it on one section, remove the numeric counters. Shipped state: the hero keeps its eyebrow, no other section has one.
- [ ] **Ratify the H1 wording rule** (`rules.md` §2) — the 47 H1s no longer share a suffix; each one now names what that tool does. Confirm the new wording before it is treated as fixed.

### Human-generated pass (shipped 7 Nov 2026)

Ranked in `docs/human-generated-human-readable.md` §7; rulebook in `docs/ai-generated-tells.md`.

- Named author system: `src/data/authors.js` drives the byline, `/authors/glixtron/` profile page, Person schema with `sameAs`, and the `author` on every guide — in place of "Tools4Market Editorial" and Organization markup.
- 47 H1s rewritten: the shared `— No Signup, No Limits` tail is gone, and each title describes its own tool.
- Volume theatre removed: word-count/min-read note in the TOC, fake reviewer field, decorative eyebrows on every non-hero section.
- Structural fixes: skip link on every page, one `<main>`, footer headings are real `h2`, cookie settings is a `button`, no h1→h3 jump on `/blog/`, 46 dead CSS classes deleted, inline styles replaced with classes.
- Copy: repeated formulaic openers ("the first mistake is…", "updates as you type") rewritten; clichéd guide titles and the GPTBot FAQ answer rewritten.
- Cards and category pages stop repeating themselves: a processing label appears only on cards that differ from the rest of the grid, and the category stat strip only renders when the numbers differ.
- The hero screenshot is now a real audit run (example.com, 54/100, 15 findings) and the score logic deducts site-level findings, so the number is consistent with the findings beneath it.

### Remaining (founder-side, not code)

See [`docs/founder-actions.md`](founder-actions.md): AdSense review re-check 4 Nov, tools.cafe + SaaSHub submissions, X/Reddit warm-up, Indie Hackers post rewrite, Product Hunt launch.

## Completed Tasks

1. Implemented 47 audit rules with shared rule engine subset (41 apply to third-party sites; the 6 `brand`-group rules are our own ad-layout policy)
2. Added personalized fixes with handoff links for each rule
3. Created 11 rule-specific visitor fixes (title-present, desc-length, http-status, etc.)
4. Configured 11 site-specific tool destinations (meta-tag-generator, meta-description-checker, etc.)
5. Updated SITE_AUDIT toolFor mapping
6. Verified all tests pass (audit-batch, seo-audit, rules, routing, consent, suggest)
7. Website Audit visual pass (5 Nov): iframe parsing + `iframe-undimensioned` rule, broken/oversized image and `og:image` checks, live scan ledger, crawler filmstrip, findings query filter, supporting styles; audit-batch suite grew 43 → 50
8. CTR metadata rewrite (5 Nov): 15 GSC zero-click pages rewritten to match query phrasing, all within the 60/158 limits; see `docs/progress.md` for the table
9. Human-generated pass (7 Nov): rulebook bound into `rules.md`, author page and Person schema, 47 H1s rewritten, repeated copy and markup tells removed, hero screenshot replaced with a real audit run — `docs/progress.md` has the details

## Next Steps

- ~~End-to-end browser verification on a real website~~ — the audit tool's four modes are covered by `tests/audit-batch-test.mjs` (43 checks) and its report rendering by `npm test`; a manual crawl in a real browser session is still worth doing once, not blocking
- ~~Deploy the audit tool to production~~ — live since 30 Oct 2026 (`/tools/website-audit/`)
- Monitor and maintain the audit pipeline

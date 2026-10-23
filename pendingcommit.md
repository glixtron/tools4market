# Pending Commit

**Prepared:** 23 October 2026
**Status:** ✅ Six entries, all committed and pushed. (1) Image-optimizer commit `5837fb7` on `origin/main`. (2) v2.2 Human-First design refinement on `audit-growth-plan-v2.1`. (3) v2.3 analyze-anywhere + AI fix suggestions on `audit-growth-plan-v2.1` — committed + pushed same day, `main` fast-forwarded. (4) v2.4 growth-plan review + three new tools (below). (5) v2.5 social + hreflang checkers (below). (6) v2.6 marketing calculators + fifth category (below).

## Entry 6 — v2.6 marketing calculators + fifth category

**Branch:** `audit-growth-plan-v2.1` · **Date:** 23 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day (see progress.md v2.6). Cross-verified before commit: build **63 pages / 40 tools / 5 categories**, smoke **40/40**, SEO audit **1981/1981**, consent **30/30**, personalized **152/152** (17 new checks), suggest-api **24/24**.

**Subject:** `feat: marketing calculators (v2.6) — ROI, ROAS, CAC, CPC/CPM/CPA + marketing category`

**Summary (v2.6):**
- New **`marketing` category** (site's namesake) — CATEGORIES-driven: nav, footer, outcome grid (5 cards), category hub, related-tools, pages sitemap all automatic. Fifth job card + `chart-up` icon on the homepage.
- **ROI Calculator**: profit, ROI %, spend multiple, honest verdict tiers. **ROAS Calculator**: ratio + revenue-per-unit + margin-derived break-even line. **CAC Calculator**: cost per customer + optional LTV:CAC ratio with standard bands. **CPC, CPM & CPA Calculator**: computes CPC/CPM/CTR/CPA from whatever inputs exist, flags missing ones.
- All four pure-local (`LOCAL_TOOLS` + `SKIP_PANEL` — 13 local / 27 live-check), currency selector with symbol values, all strings in `INSPECT_TEXT.tools.*`.

**Files in this commit:** `src/data/marketing.js`, `src/runtime/marketing.js`, `src/data/index.js`, `src/data/inspect.js`, `build.mjs`, `src/runtime/inspect.js`, `tests/seo-audit.mjs`, `tests/personalized-tools-test.mjs`, `README.md`, `Architecture.md`, `progress.md`, `pendingcommit.md`, `pending-work.md`.

## Entry 5 — v2.5 social + hreflang checkers

**Branch:** `audit-growth-plan-v2.1` · **Date:** 23 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day (see progress.md v2.5 / deploy record). Cross-verified before commit: build **58 pages / 36 tools**, smoke **36/36**, SEO audit **1815/1815**, consent **30/30**, personalized **135/135** (10 new checks), suggest-api **24/24**.

**Subject:** `feat: social + hreflang checkers (v2.5) — OG image tester, hreflang checker`

**Summary (v2.5):**
- **OG Image Tester** (dual-mode): any `og:image` URL previewed at true size and measured client-side — real pixel dimensions, aspect ratio vs the 1.91:1 / 1:1 card crops, size-tier guidance. Analyze mode loads the page's Open Graph image (Twitter fallback) from the snapshot; no extra fetches.
- **Hreflang Checker** (dual-mode): any page HTML parsed via `DOMParser` — annotation list, ISO 639/3166 code-format validation, duplicate flags, required self-reference check against the canonical (slash/query tolerant). Analyze mode renders `snap.hreflangs` back into `<link>` markup in the textarea so both paths share one parser. Reciprocity honestly out of scope per-page.
- Architecture: both follow the audit-tool render-from-snapshot pattern (Architecture.md §14); preview `<img>` dimension reads need no CORS.

**Files in this commit:** `src/data/seo.js`, `src/data/inspect.js`, `src/data/index.js`, `src/runtime/seo.js`, `src/runtime/inspect.js`, `src/style.css`, `tests/personalized-tools-test.mjs`, `README.md`, `Architecture.md`, `progress.md`, `pendingcommit.md`.

## Entry 4 — v2.4 growth-plan review + three new tools

**Branch:** `audit-growth-plan-v2.1` · **Date:** 23 Oct 2026
**Status:** ✅ Committed, pushed and deployed same day (see progress.md v2.4 for the deploy record). Cross-verified before commit: build **56 pages / 34 tools**, smoke **34/34**, SEO audit **1733/1733**, consent **30/30**, personalized **125/125** (15 new checks), suggest-api **24/24**.

**Subject:** `feat: growth-plan tools (v2.4) — JSON validator, sitemap validator, robots.txt tester`

**Summary (v2.4):**
- Analysed the externally written `3-MONTH-STRATEGIC-PLAN.md` / `SUGGESTIONS.md` against live state — much of its "quick wins" list was already shipped; built the three genuinely missing high-volume items from its tool matrix; rejected its programmatic doorway-variant pages as scaled-thin-content risk on a new domain.
- **JSON Validator & Formatter** (local): live parse with line/column errors, structure counts + depth, Format/Minify, copy output. Local classification (`LOCAL_TOOLS` + `SKIP_PANEL`; 9 local / 25 live-check now).
- **Sitemap Validator** (dual-mode): urlset/sitemapindex structure checks — well-formedness, root, namespace, absolute locs, duplicates, ISO-8601 lastmod, changefreq enum, priority range, unknown elements, 50k/50MB limits — all client-side.
- **Robots.txt Tester** (dual-mode): path × user-agent rule matching via the shared `parseRobotsTxt` longest-match engine; ALLOWED/BLOCKED verdict with the matched rule, declared sitemaps, AI-crawler group coverage, syntax notes.
- Engine: analyze fetch accepts `.xml`/`.txt` (`allowText`) and the snapshot keeps a capped `raw` for such responses — both checkers prefill from the same single fetch; `raw` is never sent anywhere (suggest payload stays an explicit allow-list).

**Files in this commit:** `src/data/web.js`, `src/data/ai-search.js`, `src/data/inspect.js`, `src/data/index.js`, `src/runtime/web.js`, `src/runtime/ai-search.js`, `src/runtime/inspect.js`, `build.mjs`, `tests/personalized-tools-test.mjs`, `README.md`, `Architecture.md`, `progress.md`, `pendingcommit.md`, `pending-work.md`.

## Entry 3 — v2.3 analyze-anywhere + AI fix suggestions

**Branch:** `audit-growth-plan-v2.1` · **Date:** 23 Oct 2026
**Status:** ✅ Committed, pushed and **deployed to production** (Worker `8e3f3be7`, `env.AI` bound; IndexNow 52 URLs; live-verify 61/61 incl. a real production `/api/suggest` draft). Cross-verified before commit: build 53 pages / 31 tools, smoke **31/31**, SEO audit **1610/1610** (18 new assertions), consent **30/30**, personalized **107/107** (23 new checks), new suggest-api suite **24/24**. Real Workers AI call validated end-to-end in `wrangler dev` (description + title drafts returned; 403 cross-origin / 405 GET guards verified). One live issue found and fixed during validation: the planned default model `@cf/meta/llama-3.1-8b-instruct` was deprecated (May 2026) — default switched to the current `@cf/meta/llama-3.1-8b-instruct-fp8`.
**Follow-up commit (same day):** post-deploy 8-vs-23 processing-note review found `image-compressor` missing from `SKIP_PANEL` (local-only tool was mounting the analyze panel). Fixed + regression check (personalized now 110/110), redeployed.

**Subject:** `feat: analyze-anywhere + AI fix suggestions (v2.3) — two-mode input, gap list, consent-gated /api/suggest`

**Summary (v2.3):**
- Two-mode input on all 24 fetch-capable tools: segmented toggle (Analyze my page default | Enter manually), manual form always one click away; 7 pure-local tools keep their "Runs in your browser" label.
- Deterministic "What to add to this page" gap list per tool after any analysis — prioritized fail → warn → info, capped at 6, exposed as `T4M_INSPECT.recommend`; no network/AI needed.
- Consent-gated AI fix suggestions on 5 copy tools: fixable gap items carry "Suggest a fix with AI" → `POST /api/suggest` (new `functions/api/suggest.js` + `worker.js` route + `AI` binding in `wrangler.jsonc` — Cloudflare Workers AI, keyless). Compact snapshot only (URL/title/H1/description/≤700 chars text, never the raw page); draft lands in the tool field labelled review-only; pre-consent the control is a lock note + settings path, and `t4m:consent` re-renders controls in place.
- Web Crawler Audit + SEO Score Checker moved onto the shared panel; their report renders from the same snapshot (verified one page fetch per analysis), native URL row/paste reappear in manual mode.
- Privacy policy §1 documents `/api/suggest` (what is sent, processor, nothing stored, consent requirement, no ranking promise); `ai_suggest` GA4 event via the consent-gated helper; live-verify extended with a real-model POST check.

**Files in this commit:** `functions/api/suggest.js`, `worker.js`, `wrangler.jsonc`, `src/data/inspect.js`, `src/data/policy.js`, `src/runtime/inspect.js`, `src/runtime/audit.js`, `src/site.js`, `src/style.css`, `tests/suggest-api-test.mjs`, `tests/personalized-tools-test.mjs`, `tests/seo-audit.mjs`, `tests/live-verify.mjs`, `README.md`, `design.md`, `progress.md`.

**Not deployed:** (historical note — since shipped: v2.2 + image-compressor + v2.3 went live the same day, Worker `8e3f3be7`, live-verify 61/61, then the image-compressor SKIP_PANEL fix in `f7874228`.)

## Entry 2 — v2.2 Human-First design refinement

**Branch:** `audit-growth-plan-v2.1` · **Date:** 22 Oct 2026
**Status:** ✅ Committed and pushed. Cross-verified before commit: build 53 pages / 31 tools, SEO audit **1592/1592** (22 new assertions added), smoke 31/31, consent 30/30, personalized 84/84. One defect found and fixed during the work: the footer Company column duplicated About/Contact (POLICY already lists them).

**Subject:** `feat: human-first design refinement (v2.2) — task-led search, job icons, guide→tool links`

**Summary (v2.2):**
- Task-led search: five example chips (meta/robots/UTM/schema/audit) that run the filter on click, plus a concrete empty-state suggestion.
- Job cards carry a 1.5px line-icon family (no emoji in primary UI); editor's pick gained a "Why this week" note + `Last updated` label.
- Guide cards bridge to their primary tool ("Use this tool →") with editorial date + topic label.
- Honest per-tool processing notes on cards ("Runs in your browser" ×8 / "Live page check available" ×23) and a `localStorage` recently-used marker.
- SERP-safe category H1s (emoji moved to a decorative `.cat-mark`); outcome categories restyled as a two-column editorial index (not a third card grid).
- Header `aria-current` active state; footer exposes Guides; motion tokens + once-per-session hero entrance; global `prefers-reduced-motion`; slimmed cookie banner.

**Files in this commit:** `build.mjs`, `src/data/index.js`, `src/site.js`, `src/style.css`, `tests/seo-audit.mjs`, `design.md`, `progress.md`.

**Not deployed:** production still serves v2.1 + the pending image-optimizer commit. Next `npm run deploy` (source `INDEXNOW_KEY` from `.env`, Node 24 via nvm) publishes v2.2 + image-compressor together, then `npm run indexnow`.

## Entry 1 — image optimizer

**Subject:** `feat: add browser-local image optimizer and refresh SEO growth plan`

**Summary:**

- Add an in-browser image compressor with resize and format controls, batch processing, per-file size/dimension comparisons and downloads.
- Improve page-specific product copy and related-tool navigation, with build and smoke-test coverage for the new tool.
- Refresh the keyword strategy with a current competitor scan, post-launch intent priorities, defensible product positioning, and a 30/60/90-day growth plan.
- Align the pending-work tracker with the latest live verification, Search Console/Bing status and current content cadence.

## Files in the pending commit

- `Architecture.md`
- `README.md`
- `build.mjs`
- `pendingcommit.md`
- `pending-work.md`
- `progress.md`
- `KEYWORD-RESEARCH-AND-SEO-PLAN.md`
- `src/data/index.js`
- `src/data/policy.js`
- `src/data/web.js`
- `src/runtime/web.js`
- `src/style.css`
- `tests/smoke.mjs`

The image optimizer was committed on 22 Oct but had not been deployed at commit time; production verification at commit time still reported the previous 51 sitemap URLs / 30 tools. Today's research did not include a connected Search Console/Bing query export or measured keyword-volume data, so the new target clusters are marked as hypotheses until first-party performance data is available.

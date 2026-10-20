# Progress Log

*Append-only. Newest entries at top.*

## 2026-10-21 — DNS cutover completed; live launch verification 35/38

**The DNS problem, end to end.** The domain was silently split-brained: the registrar's nameservers (`dns1/dns2.registrar-servers.com`) were still authoritative at the `.online` registry, and *that* zone had no A/CNAME record for the site — so Googlebot and every visitor got `ENOTFOUND` ("Sitemap could not be read" in GSC), while the owner's browser kept working off a cached Cloudflare IP. Cloudflare's 11 correct records (Worker routes, GSC verification TXT, privateemail MX/SPF/DMARC) were sitting unused.

**Two distinct root causes, both now closed:**
1. **Nameserver delegation** — fixed at the registrar: `curt.ns.cloudflare.com` + `rose.ns.cloudflare.com`. Registry flipped at 21:22:03Z; authoritative records confirmed (apex + www → Cloudflare anycast, GSC TXT published, MX → `mx1/mx2.privateemail.com`).
2. **`ERR_TOO_MANY_REDIRECTS` was never DNS** — a **Cloudflare Access (Zero Trust) application** was guarding `www.tools4market.online` and 302-ing visitors to `hemant-vigyanllm.cloudflareaccess.com/cdn-cgi/access/login/...`, which bounced back to the app URL → infinite loop. The Worker now issues a single-hop `www → apex` 301 itself (`assets.run_worker_first: true` so the Worker actually runs for asset paths), so no zone rule is needed. **The Access app still needs deleting in the dashboard** — the only user action left.

**Live verification (public site, Googlebot UA, authoritative DNS + real TLS through Cloudflare's edge): 35/38 PASS** → `launch-verification.md` in the repo root. All 40 pages return 200 with a self-referencing canonical on the apex host and are indexable; the sitemap index + both children are valid; `robots.txt` allows crawling and points at the canonical sitemap; `/api/fetch` returns real HTML in production and refuses loopback/metadata hosts; all assets and JSON-LD (WebSite, Organization, FAQPage) serve correctly. The 3 failures = 2× the Access app on `www` + 1 cosmetic `/404.html → 307` (Workers' `auto-trailing-slash` strips `.html`; real 404s still render the branded page).

**Local suites at this build:** audit 236/236 · edge 236/236 · smoke 30/30 · URL E2E 11/11 · Phase-2 129/129 · engine 123/123 · QC 30/30.

## 2026-10-21 — Canonical host switched to the apex `tools4market.online`

**User decision:** the main site URL is `tools4market.online` (not `www.`), and the live redirect loop on the apex was resolved by serving the site on the apex host.

**Change:** `SITE.url` default is now `https://tools4market.online`. Everything derived from it followed automatically — per-page canonicals, `og:url`/`og:image`, `twitter:*`, the `WebSite`/`Organization`/`WebApplication`/`FAQPage`/`BreadcrumbList` JSON-LD `url` fields, `robots.txt`'s `Sitemap:` line, and all three sitemap files. The llms.txt homepage placeholder was corrected too. Verified: **0 references to `www.tools4market.online` remain in `dist/`** (the only remaining occurrence in the repo is the intentional, opt-in Pages redirect rule).

**Host model now:** apex serves the site and is the canonical host; `www` must 301 → apex as a **zone-level Cloudflare Redirect Rule** (Workers Static Assets reject host-level rules in `_redirects` — error `100324`), attaching only the apex to the Worker so nothing can loop.

**Sitemap for GSC:** `https://tools4market.online/sitemap.xml` (index → `sitemap-pages.xml` with home + 4 category hubs + 5 policy pages, `sitemap-tools.xml` with all 30 tool pages).

## 2026-10-21 — Sitemap rebuilt as a proper index (pages + tools)

**Why:** for GSC submission the sitemap is the single most important file on the site, so it was rebuilt from one flat `urlset` into a **sitemap index** with two children — `sitemap-pages.xml` (home + 4 category hubs + 5 policy pages) and `sitemap-tools.xml` (all 30 tool pages). An index is the format that scales (a blog/content sitemap can be added later without touching the index), lets crawlers fetch only the slice they need, and keeps `lastmod` accurate per section.

**Also:** per-URL priority/changefreq are now meaningful (home 1.0 daily · categories 0.7 weekly · tools 0.8 weekly · policy 0.4 yearly) instead of one flat value; every URL carries `lastmod`; `<link rel="sitemap">` added to every page head for crawler discovery; `robots.txt` points at the index.

**Verification:** XML parsed and validated (well-formed, 10 + 30 URLs, all on the canonical `www` host, zero duplicates, zero missing `lastmod`); test harnesses updated to read the tools child and re-run — audit 236/236 · edge 236/236 · smoke 30/30 · E2E 11/11 · Phase-2 129/129 · engine 123/123 · QC 30/30 PASS.

**GSC submission link:** `https://www.tools4market.online/sitemap.xml`

## 2026-10-21 — Deploy failure RCA + fix: Worker entrypoint, Workers-safe `_redirects`

**Symptom (user's Cloudflare build log):** build succeeded (41 pages), assets uploaded (57 files), then the deploy step failed: `Invalid _redirects configuration: Line 1: Only relative URLs are allowed. [code: 100324]`.

**RCA — two problems, the second one silent and worse than the reported error:**
1. **The reported error:** `dist/_redirects` contained a *host-level* rule (`https://tools4market.online/* → https://www.tools4market.online/:splat 301`). Cloudflare **Pages** supports host-level redirects, but **Workers Static Assets** only allow relative URLs → the API rejected the whole deployment. Fix: `_redirects` is now comment-only by default (the apex→www 301 moved to a zone-level Cloudflare Redirect Rule); the host rule is opt-in via `SITE_REDIRECTS_PAGES=1` for Pages deploys.
2. **The silent one:** the deploy pipeline is `npx wrangler deploy` → a **Worker**, but the backend existed only as `functions/api/fetch.js` (a **Pages Function** convention). Even with the `_redirects` error fixed, the site would have deployed with **no `/api/fetch` route** — the URL-analysis features would have silently fallen back to paste-HTML in production. Fix: new `worker.js` entrypoint — one Worker serves the frontend through the `ASSETS` binding and routes `/api/fetch` to the *same* shared handler in `functions/api/fetch.js` (one codebase, deploys correctly on both Pages and Workers). `wrangler.jsonc` committed (`name`, `main: worker.js`, `assets.directory: dist`, `binding: ASSETS`, `html_handling: auto-trailing-slash`, `not_found_handling: 404-page`) so wrangler skips its interactive setup wizard on the build server (it was rewriting package.json/.gitignore and creating a config in the sandbox on every build).

**Verification with the exact build toolchain (wrangler 4.151.3 + Node 24.13.0, same majors as the Cloudflare env):**
- `wrangler deploy --dry-run` → assets read (101 files), `env.ASSETS` bound, 3 header rules parsed, **0 redirect rules**, no wizard prompts, no `_redirects` error.
- `wrangler dev` (local workerd) → live requests: `/` 200 · `/tools/meta-tag-generator/` 200 · `/assets/style.css` 200 · **`/api/fetch?url=https://example.com` 200 with real fetched HTML** · unknown path → 404 with the branded page.
- Site unchanged otherwise: build 41 pages / 0 warnings; full battery green (audit 236/236 · edge 236/236 · smoke 30/30 · URL E2E 11/11 · Phase-2 129/129 · engine 123/123).

**Deploy now:** push done → Cloudflare redeploys automatically (build `node build.mjs`, deploy `npx wrangler deploy`).

## 2026-10-21 — Private GitHub repo, MIT licence, and the Cloudflare frontend+backend integration layer

**User brief:** make the repository private with an MIT licence, and treat "deploy frontend and backend both on Cloudflare" as a first-class requirement.

**GitHub:** `glixtron/tools4market` created (switched the `gh` session to the `glixtron` account) → **visibility PRIVATE**, **MIT licence** added (`LICENSE`), `main` pushed, `origin` tracking set. `dist/` gitignored — Cloudflare builds it from source.

**Cloudflare architecture (frontend + backend, one project):** the static `dist/` is the frontend and `functions/api/fetch.js` is the backend, both served from the same Pages project, so the client calls `/api/fetch` same-origin (no CORS, no keys, one SSL cert, one cache policy). Documented in README ("Cloudflare Pages: frontend and backend in one project") including the **private-repo caveat** — the Cloudflare Pages GitHub App must be granted access to `tools4market` or the repo won't appear in the picker — and the optional future split to a standalone Worker on `api.tools4market.online`.

**Integration layer added to the build (all env-var driven, nothing hardcoded):**
- `SITE_URL` / `SITE_EMAIL` overrides · `GA_ID` → GA4 `gtag` snippet (IP anonymised) · `ADSENSE_CLIENT` + `AD_SLOT_TOP/CONTENT/SIDEBAR` → real `<ins class="adsbygoogle">` units in the pre-reserved slots.
- `dist/ads.txt` written automatically when a publisher id is present (verified with a test id).
- `dist/_headers` — 1-year immutable assets, 5-minute HTML revalidation, `nosniff` / referrer-policy / frame-options / permissions-policy.
- `dist/_redirects` — host-level 301 `tools4market.online/*` → `https://www.tools4market.online/:splat` (one canonical host).
- `dist/manifest.webmanifest` + `icon-192.png` / `icon-512.png` (PWA installability, mobile theme colour).

**Verification after the changes:** build 41 pages / 0 warnings; integration build with test env vars confirmed gtag + ad units + `ads.txt`, clean build confirms they're absent by default; full battery green — audit 236/236 · edge-suite 236/236 · smoke 30/30 · URL E2E 11/11 · Phase-2 suite 129/129 · engine suite 123/123; dev server 200 with manifest + icons served.

## 2026-10-20 (night, 3rd pass) — Domain wired: `www.tools4market.online`

**User provided the purchased domain:** `www.tools4market.online`.

**What changed:**
- `build.mjs` — `SITE.url` = `https://www.tools4market.online` (canonical host), `SITE.email` = `hello@tools4market.online` (`TODO-DOMAIN` marker removed). **www is the canonical host** — apex `tools4market.online` should 301 → www via a Cloudflare Page Rule.
- Updated every stale first-party reference: contact/disclaimer/privacy `hello@…` addresses (`src/data/policy.js`), llms.txt placeholder URL (`src/data/ai-search.js`), and the `Tools4MarketBot` user-agent string in both `serve-dev.mjs` and `functions/api/fetch.js`.
- Test harnesses made domain-agnostic (sitemap path extraction via regex instead of a hardcoded host).
- Docs synced: README (config example + pre-launch checklist), rules.md §3 note, pending-work.md (domain item DONE), Architecture.md URL examples.

**Verification (post-rebuild, real domain):** canonical / og:url / og:image / JSON-LD / robots.txt / sitemap all emit `www.tools4market.online`; **0 files in `dist/` contain the old domain**; full battery re-run — audit 236/236 · edge-suite 236/236 · smoke 30/30 · URL E2E 11/11 · Phase-2 suite 129/129 · engine suite 123/123 · crawl 53/53 (0 broken) · **QC report 30/30 PASS**.

**Next launch steps (user):** point DNS to Cloudflare → deploy repo to Pages (build `node build.mjs`, output `dist`) → add a Cloudflare Page Rule `tools4market.online/*` → `https://www.tools4market.online/$1` (301) → verify the public `/api/fetch` proxy responds → Search Console + sitemap submission.

**GitHub + Cloudflare flow (21 Oct 2026):** local git repo created (`main`, 31 files, `dist/` ignored, identity glixtron <support@tools4market.online>), remote `origin` → `https://github.com/glixtron/tools4market.git`. Remote creation pending user (authed `gh` account here is different): create empty repo at github.com/new (name `tools4market`, Public, no init files) → `git push -u origin main` → Cloudflare Pages → Connect to Git → that repo, build `node build.mjs`, output `dist`.

## 2026-10-20 (late night) — Phase 2: 10 new tools (content + web suites)

**Scope:** add 10 tools — 4 content (`case-converter`, `duplicate-line-remover`, `lorem-ipsum-generator`, `reading-time-calculator`) and 6 web (`base64-encoder-decoder`, `url-encoder-decoder`, `uuid-generator`, `jwt-decoder`, `user-agent-parser`, `ics-calendar-generator`).

**Shipped:** definitions in `src/data/content.js` + `src/data/web.js`, IIFE runtimes in `src/runtime/content.js` + `src/runtime/web.js`, and one added paragraph each to the `content`/`web` category `pageExtra` in `src/data/index.js`. Per-tool: unique ID prefixes, H1 in the `Free X — No Signup, No Limits` pattern, metaTitle ≤60, metaDesc 110–158, 3 expert sections (430–560 words total), exactly 4 FAQs, output via `outputBlock`/`note`, no new CSS, `textContent`/DOM APIs only. No build.mjs change needed.

**Verification (jsdom against real dist HTML + dist runtime):**
- New **`ph2-test.mjs`** — **129/129** checks: every tool page loads clean, registered, correct output on curated inputs (case modes, dedupe stats, lorem counts + clamp, 400-word ≈2 min read, Base64/URL-encode round-trips + UTF-8, UUID v4 pattern + count clamp, a constructed JWT's decoded payload + iat/exp dates, UA browser/engine/OS/device + bot, ICS structure + CRLF + escaping + all-day exclusive end + validation), friendly non-blank empty states, zero console errors, no duplicate IDs.
- Regression: **`audit.mjs` 236/236**, **`rca-smoke.mjs` 30/30** clean, **build 41 HTML pages / 0 warnings**, 30 tools in sitemap.

## 2026-10-20 (night, 2nd pass) — Site-wide QA/RCA, launch-grade fixes, SEO content, QC report

**User brief:** all tools must work properly with correct results — do a root-cause analysis and audit, fix everything, produce a timestamped `qcreport.md` (query → response per tool, pass/fail), and complete the remaining SEO work for launch.

**RCA (why tools "didn't work" on the user's machine):**
1. **Local server had no `/api/fetch`** — the URL-analysis panel on `localhost:8090` 404'd the proxy → CORS fallback failed → panel showed the paste-HTML error, looking like broken tools. **Fix:** `serve-dev.mjs` — zero-dependency Node preview server mirroring production (static + `/api/fetch` proxy with the same SSRF guard/size/time caps as the Cloudflare Function). `npm run serve` now runs it on :8090; URL mode works locally exactly like post-deploy.
2. **Literal `{n}` rendered in the panel status line** ("Read {n} on-page signals…") — template never substituted. Fixed in `src/runtime/inspect.js`.
3. **jsdom-environment artifacts masked real state** (canvas/fetch missing in jsdom) — harness now stubs both so only genuine defects surface; with stubs, all 20 tool pages drive clean.

**Industry-grade hardening (runtime QA agent + follow-ups):**
- **Generated tags weren't HTML-escaped** — `She said "hi" & <bye>` produced malformed copy-paste HTML in meta/OG/Twitter/canonical/hreflang output. `esc()` now applied to every interpolated value.
- Fixed: negative price accepted in schema Product · BreadcrumbList positions skipping numbers · llms.txt emitting malformed URLs · negative max-length mangling slugs · `javascript:` URLs accepted by UTM tool · stop-words-only text → blank output · NaN password length on cleared slider.
- 6× `insertAdjacentHTML` (rules §3 violation) → DOMParser-based `appendHtml` helper; canvas text-measurement + `fetch` hardened with fallbacks; project-wide sweep confirms zero innerHTML-family APIs remain.

**SEO content pass (all 20 tools):** every tool page body expanded from ~140–195 words to **431–483 words** across 3–4 sections (how-to written from each tool's real controls + an expert angle), category pages gained unique "More about…" blocks, homepage gained a 3-section keyword-rich body with contextual internal links + `WebSite`/`Organization` JSON-LD, and every page got a branded **`og:image` (1200×630 PNG)** with `twitter:card=summary_large_image`. Prose fields are now escaped at render time in `build.mjs` (8 `<head>`/`</head>` references previously vanished in the browser because raw strings were injected as HTML).

**QC + evidence:** new jsdom QC harness drives every tool with a curated query, captures the actual response, asserts tool-specific correctness, and writes a timestamped **`qcreport.md`** to the repo root — **20/20 PASS** (6 initial failures were all harness-expectation bugs, not tool bugs — e.g. the password output was correct; the assertion regex omitted symbol chars). Suite totals: audit 236/236 · QA edge-suite 236/236 · smoke 20/20 clean · URL-mode E2E 11/11 (live fetch of real pages pre-filling tools and scoring correctly).

## 2026-10-20 (late night) — Personalization engine + Web Crawler Audit + SEO Ranking Score

**User brief:** add a web-crawler tool (what pages a crawler can reach + what issues it shows), add a "check the website first, then give a personalized answer" input across all tools, add an SEO ranking tool, and make the suite genuinely useful / distinct from what AI already does.

**Key architectural decision (grounded in a live probe, not a guess):** a browser *cannot* reliably fetch an arbitrary customer URL — CORS blocks it, and public CORS gateways are flaky (allorigins returned 522 during testing) and a privacy liability (routed customer URLs through third parties). So "check the website first" needs one small first-party server-side proxy. `Architecture.md` §9 already earmarked a Cloudflare Pages Function for this.

**What shipped:**
1. **`/api/fetch` Cloudflare Pages Function** (`functions/api/fetch.js`) — CORS-free live-URL proxy. Free tier (100k req/day), no keys to the browser, auto-deploys with the static site. **SSRF-guarded** (blocks loopback/private/metadata hosts), 1.5 MB size cap, 12 s timeout.
2. **Graceful degradation** so tools never break: proxy → direct browser fetch (CORS-open sites) → **paste-HTML fallback** (always works, fully in-browser, nothing uploaded).
3. **Shared "analyze your own page" engine** (`src/runtime/inspect.js`): `fetchPage`, DOMParser-based `parse` (title/desc/canonical/H1-H3/images+alt/links/schema/hreflang/lang/viewport/word-count), a `summarize` readout, and the injectable panel UI. Panel mounts on the **18 original tools**, pre-fills each tool's fields from the live page and fires an `input` event so the tool recomputes output for that user's page, plus a per-tool personalized tip.
4. **2 new tools:** **Web Crawler Audit** (`web-crawler-audit`) — 12 weighted crawlability/indexability checks (HTTPS, noindex, canonical, title, desc, H1, sitemap-in-robots.txt, hreflang, schema, OG, alt) → per-check PASS/WARN/ISSUE list, a **crawl-health score ring**, and a prioritized fix list; it also fetches `/robots.txt` for the sitemap line. **SEO Ranking Score** (`seo-score-checker`) — 11 weighted factors → 0–100 score + **letter grade A–F**, factor breakdown, biggest-improvements-first list. Both have their own URL box **and** a paste-HTML path.
5. All new user-facing copy lives in `src/data/inspect.js`, injected as `window.T4M_ISTR/AUDIT/SCORE` by the build (classic runtime can't import; `JSON.stringify` keeps the script tag XSS-safe).

**Verification:**
- New engine + tools: **103/103 checks** — parse engine on good/bad/hostile pages, panel mount + pre-fill + tool recompute, both new tools via URL and paste paths, XSS-inertness proof (hostile `<title>` stays inert text; `textContent` sink creates zero elements).
- Full regression: **236/236** audit checks + **43/43** URL crawl clean after the changes.
- XSS note: `parse()` reads `textContent` (never `innerHTML`); every tool assigns via `.value`/`textContent`, so hostile input stays inert.

**Differentiation from AI (the user's core question):** AI gives generic prose and can't reliably read your live page. These tools deterministically read *your actual page*, measure it precisely against Google's real thresholds, and hand back correct copy-paste output — instantly, privately, no account, no chat.

**Still open:** visual browser pass (blocked on desktop-browser connection); `/api/fetch` activates on Cloudflare Pages deploy (paste-HTML mode works now).

## 2026-10-20 (night) — Full 18-tool audit: 229→236 checks, 2 bugs found+fixed

**Scope:** audit *all 18 tools* for correctness, not just the 2 from the evening pass.

**Method:** jsdom (real DOM engine) loading the actual `dist/` HTML with the real production scripts (`site.js` + all four `runtime/*.js`) executed against it. Each tool driven with realistic inputs, then edge cases (empty, weird chars, unicode, injection attempts). **236/236 checks passed.**

**Coverage per tool (highlights):**
- Meta Tag: charset/viewport/title/desc/robots/author/canonical/OG block, robots switch, OG toggle, Google preview updates.
- Open Graph: all 7 `og:` props, type switch, preview image bg + domain.
- Twitter Card: 6 tags, card-type switch, preview.
- Canonical: empty-state, exact tag, trim.
- Hreflang: 3 default rows → 3 tags, x-default, add/remove rows, region normalised lowercase (`de-DE` input → `de-de`).
- Schema: FAQ/Article/Product/Breadcrumb JSON-LD all parse as valid JSON; add/delete rows; last row protected (cleared, never removed).
- SERP Preview: fit chips, px metrics, overlong title → "WILL TRUNCATE", short desc → "SHORT".
- Meta Desc Checker: empty/GOOD/TOO SHORT/TOO LONG verdicts at 120–158 char band.
- Robots.txt: allow-all default, per-bot block/unblock, sitemap append.
- AI Crawler Blocker: presets (all 18 / training-only 10 / clear), count line, **label↔checkbox wiring**.
- llms.txt: H1/blockquote/## Pages, `URL | Title | Note` parsing, non-URL lines skipped, title auto-derivation.
- URL Slug: stopwords, punctuation/apostrophes, bulk mode, separator, word-boundary truncation.
- UTM: missing-param warning, GA4 lowercase enforcement, invalid-URL message, medium-hint fallback.
- Keyword Density: 1/2/3-gram tables, density %, stopword toggle, empty state.
- Hashtag: CamelCase + joined + plural (single-word), platform sets, count line.
- .htaccess: all 4 modes (redirects/HTTPS/www/non-www), add/delete rows, 301 vs 302, last-row protection.
- Sitemap: dedupe, protocol validation, XML escaping (`&amp;`), lastmod/changefreq/priority, download wiring.
- Password: length/charset/ambiguous-exclusion, entropy bits, regen, no-set guidance.

**Site-wide checks:** no duplicate element IDs on any of the 28 pages · every `var(--x)` resolves to a defined token · all 18 slugs registered in runtime · 18 tool pages in sitemap · zero JS errors on load and after interaction · no DOM injection from hostile input (`<script>`/`<img onerror>` stays inert text).

**Bugs found & fixed this session (2):**
1. **Duplicate element ID** — `AI_GROUPS()` in `src/data/ai-search.js` used `id="${prefix}-applebot"` for *both* Applebot-Extended (training) and Applebot (search). Consequence: clicking the "Applebot" label toggled the **wrong checkbox** (Applebot-Extended) on both `/tools/robots-txt-generator/` and `/tools/ai-crawler-blocker/` — a user-facing bug where the Siri/Spotlight bot could not be ticked via its label. Fixed: search-group checkbox now `id="${prefix}-applebot-search"`.
2. **Undefined CSS token** — the Password Generator output used `var(--mono)`; the real token is `--font-mono`, so the password rendered in the body font instead of monospace. Fixed in `src/data/web.js`.

**Initial audit noise:** 14 of the first run's 16 failures were errors in my own test harness (crude canvas metrics, wrong event type, wrong expected strings), not site bugs — corrected in the harness and confirmed green.

**Total bugs found+fixed across my verification passes: 3** — the 2 above plus `.faq-row` mobile CSS (evening pass). *(The plan's referenced "4 bugs from the build session" still aren't in any repo doc — those need to come from that session's summary.)*

## 2026-10-20 (evening) — Phase 1 verification & docs pass

**Scope:** verification, documentation and fixes only — no new features (per plan).

**Functional verification (Node harness running the real `src/runtime` + `src/site.js` code against a DOM stub): 37/37 checks passed.**
- Twitter Card Generator (16): initial `twitter:card` line renders; all 6 tags generate (card, site, creator, title, description, image); card-type switch (`summary_large_image` → `summary`) updates output; optional handles omitted when blank; live preview title/description update; image background set with quotes escaped (`%22`); cleared image restores placeholder.
- Canonical Tag Generator (4): empty-state message; exact `<link rel="canonical" href="…">` output; whitespace trimmed.
- Homepage search filter (17): "meta" shows 2 cards / hides others; "robots" swaps visible section; non-matching category section collapses; no-match query shows `#search-empty`; clearing restores all cards and sections.

**Crawl verification against the built `dist/` (served on :8090): 38 URLs crawled, 0 broken.**
- 28 HTML pages + 10 assets all return 200; every internal link and asset resolves.
- Every tool page has `#tool-root[data-tool]`, exactly one `h1` and a canonical link.
- `sitemap.xml` = 28 unique entries (1 home + 4 categories + 18 tools + 5 policy), no duplicates; `robots.txt` references it correctly.
- Build is clean: no title (>60) or description (>158) length warnings.

**Fix applied this session (1):**
1. `src/style.css` — schema tool's FAQ rows (`.faq-row`) had no ≤720px override, leaving two cramped side-by-side inputs at 390px (breadcrumb rows already had one). Added `.dyn-row.faq-row` to the existing mobile single-column rule. Rebuilt; verified in `dist/`.

**Note — concurrent edit detected:** `build.mjs` was rewritten at 19:48 mid-session (hero eyebrow + stats strip, category header row with count pill and "View all", breadcrumb separators, font preconnect, cleaner 404). Re-verified the post-change build: crawl still 38/38 clean, sitemap intact. All checks above run against this version.

**Documentation:** `README.md` written — build/preview commands, Cloudflare Pages deploy (build `node build.mjs`, output `dist`), add-a-tool guide (data definition + `T[slug]` runtime entry + rebuild), AdSense insertion points (`.ad-slot` → real `<ins>` unit via the single `adSlot()` function in `build.mjs`), and the ordered pre-launch checklist (domain → `SITE.url`/`SITE.email` via `TODO-DOMAIN` → rebuild → deploy → custom domain → Search Console + sitemap → GA4 → content → AdSense).

**Still open:** visual browser verification — loading both tool pages, typing real inputs, confirming previews on screen, and the 390×844 mobile screenshot pass. Blocked this session: the browser harness reports no desktop browser connected (needs this session open in the OpenCode desktop app with the experimental browser setting enabled). Functional behaviour is verified; only the visual/eyeball pass and screenshots remain.

**Open question:** the plan referenced "the 4 bugs found+fixed" from the build session — that list was never logged here and is not in any repo doc. Only the bug found in *this* session is logged above. Evidence of earlier fixes exists in code (e.g. `site.js` deferred-script boot-race guard; CSS quote-escaping for preview image URLs) but the authoritative 4-bug list needs to come from the build session's summary.

## 2026-10-20

**Research completed.** Independent research (web sources, Oct 2026) established:
- SEO/marketing tool sites: highest ad CPM of any tool category ($15–40) — 3–8× PDF/image tool sites.
- US/UK traffic worth 3–10× Indian traffic → global-first keyword strategy required.
- Long-tail marketing-tool SERPs (robots.txt generator, OG generator, index checker) currently held by small new sites — winnable. Category leader SmallSEOTools declining (Similarweb rank ~22.9K→24.9K in 3 months).
- New low-competition cluster identified: AI-crawler management tools (GPTBot blocking, llms.txt) — 14.3% of top-10K sites now block GPTBot, tool SERPs nearly empty.
- Honest revenue model: ₹5L/mo realistic at month 9–14, not month 6; month-6 target ₹80K–2L.

**Plan approved by user** (4 decisions):
1. Niche: Hybrid — marketing/SEO core launch + calculators in months 3–4
2. Stack: custom static site (no WordPress)
3. Brand: **Tools4Market**
4. Phase 1 execution approved

**Project docs created:** RESEARCH-AND-PLAN.md, Architecture.md, design.md, rules.md, pending-work.md, progress.md, projectreport.md.

**Phase 1 build started:** Node v18.20.8 available. Scaffold + build system + 18 tools + policy pages → `dist/`, then browser verification.

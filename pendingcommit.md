# Pending Commit

**Prepared:** 23 October 2026
**Status:** ✅ Twenty entries, all committed and pushed. (1) Image-optimizer commit `5837fb7` on `origin/main`. (2) v2.2 Human-First design refinement on `audit-growth-plan-v2.1`. (3) v2.3 analyze-anywhere + AI fix suggestions on `audit-growth-plan-v2.1` — committed + pushed same day, `main` fast-forwarded. (4) v2.4 growth-plan review + three new tools (below). (5) v2.5 social + hreflang checkers (below). (6) v2.6 marketing calculators + fifth category (below). (7) v2.7 PageSpeed deep fix (below). (8) v2.8 timestamp + IP converters (below). (9) v2.9 calculator batch 2 (below). (10) v2.10 Day-2 content pack integration (below). (11) HTTPS enforcement — plain http → https + HSTS (below). (12) Day-8 gap-list guides — internal linking, image SEO, Core Web Vitals (below). (13) live-verify hop assertion fix (below). (14) Day-9 guides — Open Graph image size, .htaccess redirects, title tag length (below). (15) Launchstag listing badge (below). (16) robots.txt policy — training blocked, answer engines allowed (below). (17) Day-10 guides — URL slugs, canonical, hreflang (below). (18) Day-11 guides — XML sitemaps, structured-data validation, HTTP status codes (below). (19) Source-link hygiene + `check:sources` (below). (20) Day-12 founder-side writing + `check:social` (below).

## Entry 20 — Day-12 founder-side writing, and a verification pass that contradicted the brief four times

**Branch:** `audit-growth-plan-v2.1` · **Date:** 26 Oct 2026
**Status:** ✅ Committed and pushed. Cross-verified: build **81 pages / 44 tools / 24 guides**, SEO audit **2547/2547**, smoke **44/44**, social **18/18 within limit**. No runtime files changed, so no deploy and no IndexNow.

**Subject:** `docs: Day-12 founder-side deliverables (PH, directories, outreach, social)`

**Summary:**
- **`docs/day12/Day12_ProductHunt_Package.md`** — name, tagline (47 chars), short and long descriptions, five gallery concepts at 1270×760, maker's first comment, pre-launch email, launch-day timeline, and a “what not to say” list.
- **`docs/day12/Day12_Directory_Descriptions.md`** — 60 / 160 / 305-word variants (measured: 60, 160 words / 994 chars, 305), verb-first feature bullets for tools.cafe's “≥3, start with a verb” rule, per-directory field map with the limits each live form actually enforces, the AlternativeTo “alternative to” mapping, and the badge decision.
- **`docs/day12/Day12_Outreach_Pitches.md`** — five channels ranked by expected value; SEJ's contributor terms quoted verbatim (exclusive, 100% original, regular slot, disclosure, no promotional links or CTAs, no wholly AI-generated articles) and the honest consequence that it is a column, not a backlink; SEOFOMO sponsorship enquiry; HN Show HN notes rather than a script, because HN's guidelines forbid generated text; Indie Hackers outline; Search Engine Roundtable held back with a reason; blocked-targets table.
- **`docs/day12/Day12_Social_Posts.md`** — 3 X threads (18 tweets), 3 Reddit posts (r/SideProject, r/SEO, r/webdev), 5 comment templates, corrected posting calendar.
- **`docs/day12/Day12_IndieHackers_Post.md`** — the directory research as a full 707-word post, three title options, posting mechanics, four drafted replies, what not to do. The highest-return item in the folder.
- **Two badge emails** drafted into `Day12_Directory_Descriptions.md` §6, against published support addresses, with the sequencing gate that tools.cafe's FAQ reveals: the badge snippet only exists after go-live, and placement is a required condition — so the question must be answered before submitting.
- **`docs/day12/README.md`** — index plus a 35-entry verification table recording how each source was checked and what it returned.
- **`scripts/check-social.mjs`** + `npm run check:social` — parses the tweet blocks, measures raw and X-weighted length (links = 23 chars, bare domains included), fails over 280.

**Corrections the verification forced:**
1. **“Sunday Oct 26”** — 26 Oct 2026 is a **Monday**; launch calendar rebuilt and the Tuesday–Thursday recommendation applied.
2. **AlternativeTo `/add-app/`** — the brief said “403 to curl, works in a browser”. It is a **404 in a real browser**, as are `/manage/add-app/`, `/submit/`, `/apps/new/`, `/new-app/`. No logged-out add control exists; the 403 was Cloudflare hiding a dead URL.
3. **LaunchBuff** — “permanent dofollow listings” is wrong. Free = **nofollow**, badge required, free entry **paused with a ~1-year queue**; dofollow starts at **$19**. Recommendation changed to skip it, and the paid alternative is named as a paid link rather than a directory.
4. **“Alternative to QRCodeGenerator”** — **no QR tool exists** among the 44. Mapping dropped.
5. **Search Engine Land “invite-only”** — site fails a Cloudflare challenge in a real browser too, so the earlier quote is recorded as **unverified**, not repeated.
6. **SaaSCity + tools.cafe** — both free tiers require **their badge on the site**, a visible change across 81 pages; escalated as a decision rather than an assumed freebie.

**`docs/founder-actions.md`** §4 updated with a “what the free tier actually gives” column and the measured facts; its deliverables section now points at `docs/day12/` instead of promising four documents.

**A seventh correction, this time to the CEO's corrections file.** Its step 4 verifies the dofollow attribute with `curl -sI` on the listing URL. Headers carry no HTML; `rel` is on the `<a>` in the body. Measured on our own footer: zero `rel=` matches from `-I`, the anchor from `-s`. §4 now holds the working check and the three outcomes, and its example was corrected after testing: tools.cafe's index and category pages carry no outbound product anchors, but the `/p/<slug>` detail page is server-rendered and its Visit button is a plain dofollow anchor (`rel="noopener noreferrer"`, with a `?ref=tools.cafe` parameter). An empty result means the wrong page was fetched, not that the page is client-rendered.

**Files:** `docs/day12/` (5 new), `scripts/check-social.mjs` (new), `package.json` (`check:social`), `docs/founder-actions.md`, `worklog.md`, `progress.md`, `pendingcommit.md`, `suggest.md`.

## Entry 19 — Source-link hygiene, a citation checker, and founder-ops prep

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25–26 Oct 2026
**Status:** ✅ Three commits, all pushed and deployed. Cross-verified: build **81 pages / 44 tools / 24 guides**, SEO audit **2547/2547**, smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **73/73**, sources **43/43 reachable**.

**Subjects:**
1. `fix: repair five dead guide citations and add a source-link checker` (`2983706`, deployed `60455cbb`)
2. `build: warn when AdSense slot ids are malformed or no ad units are live` (`52f144f`)
3. `docs: founder-actions runbook for the four console-side blockers`

**Summary:**
- **Four rotted citations found by applying the new gate retroactively:** the robots meta-tag reference (404, cited by two guides) → `robots-meta-tag`; the GA4 URL-builder article (404) → `answer/10917952`; the meta-tags page (404) → `special-tags`; X’s cards markup reference removed from `open-graph-image-size-2026` rather than replaced, because nothing live says the same thing.
- **Five genuine moves re-pointed:** Google’s HTTP-status document to `/crawling/docs/troubleshooting/http-status-codes`, Facebook’s sharing guide to `/documentation/sharing/webmasters`, and three RFC citations to their canonical `/rfc/rfcNNNN.html` text instead of the `/info/` landing pages.
- **New `scripts/check-sources.mjs`** (`npm run check:sources`): walks all 43 unique `links[]` URLs, fails on 4xx/5xx, classifies redirects as moved / locale (`?hl=`) / slash, and supports `--strict`. It sends `Accept-Language: en`, without which every Google docs URL localised and turned into a false positive.
- **Doc drift fixed:** README still said “Eighteen how-to guides” (stale since Day 8); ARCHITECTURE still described the pre-v2.15 “allows every crawler” robots policy.
- **IndexNow submitted 8 changed URLs**, not all 80 — the protocol asks for new or materially changed URLs.
- **AdSense build warning:** a malformed `AD_SLOT_*` used to fall back to a placeholder silently; the build now prints the offending variable, plus an “0 ad units” notice while the slots are empty.
- **`docs/founder-actions.md` (new):** the owner-side console work in one place — AdSense (pre-approval vs approved, reading a slot id, verifying), the Cloudflare robots trade with the measured file, Launchstag claim-and-badge, and seven directories filtered for fit.
- **Two documentation bugs fixed:** README told the owner to set `AD_SLOT_*` as Cloudflare Worker variables, but they are build-time values that `worker.js` never reads — so the step changed nothing and errored nowhere. And the earlier Cloudflare advice omitted that the same toggle also disables edge blocking for training crawlers.
- **`pending-work.md` corrected:** it described production as v2.5 `0e496a9d`, AdSense as on hold, and the loader as not shipping.

**Files across these commits:** `src/data/blog.js` (citation repairs), `scripts/check-sources.mjs` (new), `package.json` (`check:sources`), `build.mjs` (AdSense warnings), `docs/founder-actions.md` (new), `README.md`, `ARCHITECTURE.md`, `pending-work.md`, `pendingcommit.md`, `progress.md`, `worklog.md`, `suggest.md`.

## Entry 18 — v2.17 Day-11 guides

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day. Cross-verified: build **81 pages / 44 tools / 24 guides** (80 sitemap URLs), SEO audit **2547/2547**, smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **73/73**, IndexNow **80 URLs**.

**Subject:** `feat: Day-11 guides — XML sitemaps, structured-data validation, HTTP status codes (v2.17)`

**Summary:**
- **One proposed topic was replaced after source verification:** X’s card documentation now redirects to `docs.x.com/overview` and the new card path 404s, so the primary reference is not live; the Card Validator’s preview was removed in 2022 rather than the tool disappearing. HTTP status codes took the slot, sourced from RFC 9110 and Google’s crawling docs.
- **Three posts:** `xml-sitemap-best-practices` (622 words), `test-structured-data` (632) and `http-status-codes-seo` (633) — six prose sections and six FAQs each, tool names only, no tables or lists.
- **Facts that contradict folklore:** sitemaps are a discovery hint, Google ignores changefreq/priority, the ping endpoint died at the end of 2023; Google treats 301/308 and 302/307 alike; all 4xx except 429 are handled the same, so 410 is not faster than 404; Rich Results Test and Schema Markup Validator test different things.
- **Pre-publish fixes:** validation guide raised from 578 to 632 words and its metaDesc cut from 161 to 157; one status-code FAQ reworded to carry the focus phrase.
- **Cross-links:** why-is-my-site-not-indexed → sitemap + status codes; website-launch-seo-checklist → sitemap + validation; internal-linking → sitemap; schema-markup-for-ai-search and screaming-frog-alternative → validation; htaccess-301-redirect, noindex-vs-robots-txt and rel-canonical-tag → status codes. The schema guide had no `relatedGuides` field before this pass.

**Files in this commit:** `src/data/blog.js` (3 guides + cross-links), `README.md`, `ARCHITECTURE.md`, `suggest.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 17 — v2.16 Day-10 guides

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day. Cross-verified: build **78 pages / 44 tools / 21 guides** (77 sitemap URLs), SEO audit **2468/2468**, smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **73/73**, IndexNow **77 URLs**.

**Subject:** `feat: Day-10 guides — URL slugs, rel=canonical in practice, hreflang basics (v2.16)`

**Summary:**
- **Topics chosen by gap, not by volume:** slug had zero mentions and canonical had no guide; hreflang had one aside. Pagination was dropped — `rel=next`/`prev` is no longer used by Google and there is no pagination tool to link a post to.
- **Three posts, one shape:** `url-slug-best-practices` (844 words), `rel-canonical-tag` (775) and `hreflang-basics` (753) — six prose sections, six FAQs each, tool names only, code blocks via `sections[].pre`.
- **Primary sources:** Google's URL structure, canonicalisation and localised-versions documentation, RFC 3986 and RFC 6596. No tables or lists because the renderer has neither; no character-count truncation claims.
- **Stale advice excluded:** no keywords-in-slug ranking claim, no "canonical is a directive", no hreflang language detection or ranking boost, no International Targeting report (retired 2022).
- **Cross-links:** `htaccess-301-redirect` → slug + canonical; `internal-linking` → slug; `why-is-my-site-not-indexed` → canonical; `screaming-frog-alternative` and `website-launch-seo-checklist` → hreflang.
- **Two over-length metaDescs** (162 and 159) rewritten to 157 and 151; no test changes were needed — the existing blog rules caught them.

**Files in this commit:** `src/data/blog.js` (3 guides + cross-links), `README.md`, `ARCHITECTURE.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 16 — v2.15 robots.txt policy

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day. Cross-verified: build **75 pages / 44 tools / 18 guides**, SEO audit **2390/2390**, smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **73/73**.

**Subject:** `feat: state the crawler policy in the repo, and assert what the edge actually serves (v2.15)`

**Summary:**
- **The edge was the policy, and it contradicted the repo.** `build.mjs` emitted `User-agent: * / Allow: /`; Cloudflare prepended 47 named `Disallow: /` groups above it. No test compared the two, so the live site blocked the answer-engine fetchers (`ChatGPT-User`, `Perplexity-User`, `Claude-User`) while three published guides told readers to allow them.
- **Policy now generated from the repo:** training crawlers blocked, six AI search/answer agents explicitly allowed, Content-Signal retained, Google-Extended explained and explicitly allowed.
- **Google-Extended correction:** it is a control token, not a crawler, and it turns Gemini training and Gemini grounding off together — so blocking it also gives up Gemini citations. The guide had it in both the training and answer-engine lists; that is fixed.
- **Guards:** `seo-audit` asserted "allows every crawler" (would have blocked the fix) and `live-verify` only grepped for two strings (why 47 blocks passed). Both now parse robots.txt into groups and resolve the effective rule per bot per RFC 9309, and the live check runs against the served file.

**Files in this commit:** `build.mjs` (robots emitter), `tests/seo-audit.mjs` (+3 net rules, group parser), `tests/live-verify.mjs` (served-file policy checks, +3), `src/data/blog.js` (Google-Extended correction in the robots guide), `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 15 — Launchstag listing badge

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day. Cross-verified: build **75 pages**, SEO audit **2387/2387**, smoke **44/44**, consent **30/30**, worker-routing **14/14**, live-verify **70/70**, badge present on the live homepage and a live tool page.

**Subject:** `feat: Launchstag listing badge in the footer + privacy disclosure`

**Summary:**
- **Badge site-wide in the footer bottom bar**, not homepage-only: `badge-dark.svg`, `target="_blank"`, `rel="noopener"`, `alt="Featured on Launchstag"`, explicit 198x62 with `decoding="async"` and `fetchpriority="low"` so it cannot shift the footer or compete with content.
- **Layout:** `.footer-bottom` is a wrapping flex row — copyright left, badge right, stacked when narrow. Checked in the browser: image loads (396x124 source), no horizontal overflow.
- **Privacy:** the hotlinked badge sends IP and user-agent to launchstag.com outside the consent banner; the privacy policy now says so, notes it sets no cookie, and that blocking third-party images disables it safely.
- **Guard:** homepage audit asserts the badge exists, so a footer refactor cannot silently drop the backlink.

**Files in this commit:** `build.mjs` (footer), `src/style.css` (footer-bottom flex + badge), `src/data/policy.js` (disclosure), `tests/seo-audit.mjs` (+1 badge rule), `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 14 — v2.14 Day-9 guides

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day. Cross-verified before commit: build **75 pages / 44 tools / 18 guides**, smoke **44/44**, SEO audit **2386/2386**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **70/70**.

**Subject:** `feat: Day-9 guides — Open Graph image size, .htaccess 301 redirects, title tag length (v2.14)`

**Summary:**
- **Three guides, all verified missing first** (guides 15 → 18): `open-graph-image-size-2026`, `htaccess-301-redirect`, `title-tag-length-2026`. `.htaccess` had zero mentions; the other two existed only as one step in the launch checklist.
- **Corrections applied to the pack:** 301/302 reframed as canonicalisation rather than "passes PageRank"; the unpublishable 5-hop limit dropped; "Coverage" → "Page indexing" and redirect entries are informational; the title rewrite rate, CTR lift and CTR-ranking claim removed; the OG click multiplier, 600×315 minimum and per-platform caps removed — the guide now says the OGP spec defines no dimensions; X's retired card validator replaced.
- **Format:** spec tables and bullet lists converted to prose (the renderer supports neither); redirect patterns use the existing `sections[].pre` code block; the duplicate "FAQ array" blocks dropped.
- **Cross-links:** launch checklist → all three; meta description guide → both spec sheets; noindex + not-indexed → the redirect guide.
- **New audit guard:** every `relatedTools` slug must resolve, and the failure names the slug. Unknown slugs were dropped silently — the reason `image-optimizer` (Day 8) and `xml-sitemap-generator` (Day 9) both reached review instead of failing the build.
- **Docs:** `docs/day9/` (3 pack files + `INTEGRATION-NOTES.md`), README/Architecture → 75 pages, 18 guides, v2.14.

**Files in this commit:** `src/data/blog.js` (3 guides + 4 cross-link updates), `tests/seo-audit.mjs` (relatedTools resolution guard), `docs/day9/*`, `README.md`, `Architecture.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 13 — live-verify accepts the edge scheme hop

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed to both branches, `main` fast-forwarded, Desktop checkout synced. No rebuild or redeploy — test and docs only.

**Subject:** `fix: live-verify accepts the edge scheme hop for http://www`

**Summary:**
- **What failed:** the post-deploy live run returned 69/70. `http://www` now sends `301 → https://www.tools4market.online/`, because the zone's *Always Use HTTPS* upgrades the scheme before the Worker's host rule runs. The site was correct; the assertion was describing the pre-setting ordering.
- **New contract:** hop 1 must start `https://`, and the fully followed request must land on `https://tools4market.online/` — no loop, canonical destination, without pinning a hop count the edge controls.
- **Worker behaviour unchanged:** `tests/worker-routing.mjs` still asserts the one-hop `http://www → https apex` case, because it calls `worker.js` directly with no zone setting in front.
- **Docs:** the "one hop" claim in the v2.13 worklog, `progress.md` and `pendingcommit.md` is now qualified with the two-hop edge behaviour.

**Files in this commit:** `tests/live-verify.mjs`, `worklog.md`, `progress.md`, `pendingcommit.md`.

## Entry 12 — v2.13 Day-8 gap-list guides

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day. Cross-verified before commit: build **72 pages / 44 tools / 15 guides**, smoke **44/44**, SEO audit **2291/2291**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **70/70**.

**Subject:** `feat: Day-8 gap-list guides — internal linking, image SEO, Core Web Vitals (v2.13)`

**Summary:**
- **Three guides, all genuinely new** (guides 12 → 15): `internal-linking`, `image-seo`, `core-web-vitals`. Verified against the library before writing, not after.
- **Corrections applied to the pack:** no "ranking penalty" claim (page experience is a tiebreaker); `rel=next/prev` advice inverted (Google dropped those hints in 2019); 100-links and AVIF-support myths removed; `image-optimizer` replaced with the single existing `image-compressor`; third-party volume figures kept out of the site.
- **New `article.relatedGuides[]`** → build-time **Read next** block; audit asserts every slug resolves and the links render. Three existing guides mapped into the cluster so the new pages have inbound links.
- **Docs:** `docs/day8/` (3 pack files + `INTEGRATION-NOTES.md`), README/Architecture → 72 pages, 15 guides, v2.13.

**Files in this commit:** `src/data/blog.js` (3 guides + 3 cross-links), `build.mjs` (`relatedGuides`), `tests/seo-audit.mjs` (+6 rules), `docs/day8/*`, `README.md`, `Architecture.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 11 — HTTPS enforcement (plain http → https)

**Branch:** `audit-growth-plan-v2.1` · **Date:** 25 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day. Cross-verified before commit: build **69 pages / 44 tools / 12 guides**, smoke **44/44**, SEO audit **2189/2189**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **70/70**.

**Subject:** `fix: force https — 301 plain http to the canonical origin, add HSTS`

**Summary:**
- **Symptom:** `http://tools4market.online/` returned 200. Both schemes served the site, so every page had two live origins; only `www` redirected.
- **`worker.js`:** `http:` → `301 https://tools4market.online` + path + query, `Cache-Control: no-store`, placed **before** the `www → apex` rule so `http://www` resolves in one hop at the Worker level (the zone's *Always Use HTTPS* now upgrades the scheme first, so live `http://www` is two hops, no loop). Uses `url.protocol` only (a client-supplied `X-Forwarded-Proto` must not skip it) and exempts localhost for `npm run preview`.
- **`build.mjs`:** `Strict-Transport-Security: max-age=31536000` in the `/*` block of `dist/_headers`. No `includeSubDomains`, no `preload` — both are one-way doors and no subdomain inventory exists.
- **Tests:** new `tests/worker-routing.mjs` (14 checks, no network — redirect matrix + HSTS/headers shape) wired as `npm run test:worker`; `tests/live-verify.mjs` +5 assertions (65 → 70) for the deployed edge, using `redirect: 'manual'`.
- **Owner-side:** enable Cloudflare *Always Use HTTPS* as belt-and-braces.

**Files in this commit:** `worker.js`, `build.mjs`, `tests/worker-routing.mjs`, `tests/live-verify.mjs`, `package.json`, `README.md`, `Architecture.md`, `suggest.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 10 — v2.10 Day-2 content pack integration

**Branch:** `audit-growth-plan-v2.1` · **Date:** 24 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day (see progress.md v2.10 + worklog.md). Cross-verified before commit: build **68 pages / 44 tools / 11 guides**, smoke **44/44**, SEO audit **2167/2167**, consent **30/30**, personalized **181/181**, suggest-api **24/24**.

**Subject:** `feat: Day-2 content pack integration (v2.10) — Screaming Frog guide, llms.txt upgrade, FAQ + GA4 events`

**Summary (v2.10):**
- **Origin:** the owner's parallel "Day 2" agent session emitted a 9-file pack (two blog posts, AEO FAQ set, analytics setup guide, PH + social assets, 50-keyword research, master compilation, and an OpenCode prompt with 7 "machine tasks"). All 9 files archived verbatim in `docs/day2/`; cross-check matrix in `docs/day2/INTEGRATION-NOTES.md`.
- **Cross-check outcome:** prompt tasks 1–4 were already shipped (root robots/llms.txt, Organization+WebSite, BreadcrumbList+FAQPage everywhere). The pack assumed a CMS, wrong URLs (`/ai-search/…` etc.), stale 31-tool counts and GTM (rejected — v2.7 turned it off).
- **Shipped:** new guide `screaming-frog-alternative` (adapted, honest limits kept); `llms-txt-guide` upgraded in place instead of duplicated (decision flow, file skeleton, common mistakes, +FAQ, `updated` field); 5 AEO FAQ additions merged into the top-5 tools (300-char rule applied); GA4 `search` + `external_link_click` events added to `site.js` (the pack's tool_used/tool_copied already existed as tool_run/copy_output).
- **Owner-side leftovers** (KPI sheet, GA4↔GSC link, social/PH/directory actions) tracked in a new `pending-work.md` section pointing at the archived files.

**Files in this commit:** `src/data/blog.js` (new guide + upgrade), `src/data/ai-search.js`, `src/data/seo.js`, `src/data/content.js` (FAQ merges), `src/site.js` (GA4 events), `docs/day2/*` (10 files), `README.md`, `Architecture.md`, `pending-work.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 9 — v2.9 calculator batch 2 (email ROI + marketing budget)

**Branch:** `audit-growth-plan-v2.1` · **Date:** 24 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day (see progress.md v2.9 + worklog.md). Cross-verified before commit: build **67 pages / 44 tools / 5 categories**, smoke **44/44**, SEO audit **2145/2145**, consent **30/30**, personalized **181/181** (14 new checks), suggest-api **24/24**.

**Subject:** `feat: calculator batch 2 (v2.9) — email ROI + marketing budget/growth`

**Summary (v2.9):**
- **Email ROI Calculator** — sends/opens/clicks/conversions/revenue/cost in → open, click, click-to-open and conversion rates + revenue per email + net profit + ROI % + spend multiple, with verdict tiers and honesty guards (opens > sends, clicks > sends, conversions > clicks, zero cost → ROI undefined).
- **Marketing Budget Calculator** — base/growth rate/target/CAC (+ optional ARPU) → net new customers needed, months to target on **compounding** growth (stated plainly, with the saturation caveat in the copy), acquisition budget (gap × CAC), added monthly revenue at target and CAC payback; guards for zero base, zero growth, already-reached targets, zero CAC.
- Both pure-local ("Runs in your browser"), all copy in `src/data/inspect.js` (`tools.emailRoi`, `tools.budgetCalc`), registered in `LOCAL_TOOLS` + `SKIP_PANEL` → 17 local / 27 fetch.
- Smoke caught one real defect mid-build: the budget tool's "already reached" guard left the output block empty — output now carries the zero-gap line while the verdict explains.

**Files in this commit:** `src/data/marketing.js`, `src/runtime/marketing.js`, `src/data/inspect.js`, `build.mjs`, `src/runtime/inspect.js`, `tests/personalized-tools-test.mjs`, `README.md`, `Architecture.md`, `pending-work.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 8 — v2.8 timestamp + IP converters (cross-session integration)

**Branch:** `audit-growth-plan-v2.1` · **Date:** 23 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day (see progress.md v2.8 + worklog.md). Cross-verified before commit: build **65 pages / 42 tools / 5 categories**, smoke **42/42**, SEO audit **2063/2063**, consent **30/30**, personalized **167/167** (15 new checks), suggest-api **24/24**.

**Subject:** `feat: timestamp + IP converters (v2.8) — integrated from the second session's work`

**Summary (v2.8):**
- **Origin:** a second OpenCode session working on the Desktop checkout (stale `main` at `8f0cb1b`/v2.4, uncommitted) had created five tools. Two were genuinely new — **timestamp-converter** and **ip-converter** — and were integrated here. The other three were parallel re-implementations of tools already shipped in v2.5 (`og-image-tester`, `hreflang-checker`) or of an existing tool (`url-encoder-decoder` duplicate), and were discarded to avoid slug conflicts and doorway-style duplication.
- **Rules §3 compliance:** the imported runtime code carried hardcoded user-facing strings — all copy moved to `src/data/inspect.js` (`tools.tsConv`, `tools.ipConv`); runtimes now read `COPY`.
- **Honesty fixes over the imported version:** removed a batch-conversion claim the code never implemented; negative (pre-1970) timestamps now actually convert (FAQ promised them, code rejected them); the `datetime-local` date input is parsed as the visitor's local time (was force-shifted with a `Z`); added the Local + Relative output lines the copy promised; IP input tolerates spaced paste (copy promised it).
- **Registration:** both tools added to `LOCAL_TOOLS` (`build.mjs`, "Runs in your browser" label + script slicing) and `SKIP_PANEL` (`runtime/inspect.js`) → 15 local / 27 fetch-capable.
- **Repo docs:** `3-MONTH-STRATEGIC-PLAN.md` and `SUGGESTIONS.md` (previously untracked on Desktop, referenced in Entry 4) now tracked; README/Architecture counts updated to 42 tools / 65 pages.

**Files in this commit:** `src/data/web.js`, `src/runtime/web.js`, `src/data/inspect.js`, `build.mjs`, `src/runtime/inspect.js`, `tests/personalized-tools-test.mjs`, `3-MONTH-STRATEGIC-PLAN.md` (new), `SUGGESTIONS.md` (new), `README.md`, `Architecture.md`, `pendingcommit.md`, `progress.md`, `worklog.md`.

## Entry 7 — v2.7 PageSpeed deep fix (performance, fonts, a11y)

**Branch:** `audit-growth-plan-v2.1` · **Date:** 23 Oct 2026
**Status:** ✅ Committed, pushed, deployed same day (see progress.md v2.7 + worklog.md). Cross-verified before commit: build **63 pages / 40 tools / 5 categories**, smoke **40/40**, SEO audit **1981/1981**, consent **30/30**, personalized **152/152**, suggest-api **24/24**; local Lighthouse mobile: TBT 4,070→590 ms, unused JS 557→71 KiB, a11y 90→**100**, best practices 77→**100**.

**Subject:** `perf: per-page scripts, self-hosted fonts, GTM/AdSense gating, a11y contrast (v2.7)`

**Summary (v2.7):**
- **Per-page script slicing** — static pages load `site.js` only (homepage 9→1 script requests); tool pages load their category runtime + strings + inspect engine (panel tools only) + `audit.js` (audit tools only). Was: all 7 runtimes + strings + inspect on every page (~210 KB unused per page).
- **Self-hosted fonts** — 12 woff2 subsets vendored to `src/fonts/` → `/fonts/*` (immutable), CSS `@import` + preconnects removed, headline + body faces preloaded. Kills the render-blocking Google Fonts chain and the 30-min font cache flagged by PageSpeed.
- **GTM off by default** — container audited as GA4-less; direct gtag + Consent Mode unchanged. `GTM_ID` in `.env` re-enables.
- **AdSense loader gated on `AD_SLOT_*`** — no units configured → no loader (150–250 KB/page saved); ads.txt stays; loader auto-returns when slots are set.
- **Build-time CSS minification** (quote-aware, source readable) + **identity source maps** for all first-party JS.
- **A11y → 100**: contrast-corrected eyebrow/cat-num/sec-num/outcome-num/tool-proc, footer `h4`→`h3`, in-prose links underlined.
- Tests updated where assertions were stale against the intentional changes (footer h3, minified-CSS regexes, GTM-off and AdSense-off live assertions).

**Files in this commit:** `build.mjs`, `src/style.css`, `src/fonts/*` (12 files), `tests/seo-audit.mjs`, `tests/consent-test.mjs`, `tests/live-verify.mjs`, `worklog.md` (new), `pending-work.md`, `pendingcommit.md`, `progress.md`.

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

**Not deployed:** *(historical — since shipped: v2.2 + image-compressor went live 22 Oct; production currently serves v2.7.)* Production still served v2.1 + the pending image-optimizer commit at commit time.

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

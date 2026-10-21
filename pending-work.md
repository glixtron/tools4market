# Pending Work

*Living tracker — update after every session. Last updated: 21 Oct 2026 (personalized SEO tool upgrade).*

## 👤 User actions required — **these block launch**

- [x] ~~**Buy domain**~~ — DONE: **`tools4market.online`** (canonical host = apex) · `SITE.url` = `https://tools4market.online`, `SITE.email` = `support@tools4market.online`, all dist URLs verified (0 old-host references) · `www` must 301 → apex via a zone-level Cloudflare Redirect Rule (not `_redirects` — Workers reject host rules)
- [x] ~~Verify Google Search Console property~~ — DONE per user; sitemap submitted/monitoring started
- [x] ~~Start Bing Webmaster Tools~~ — DONE per user; Bing crawling/index monitoring started
- [ ] GA4 property (optional; set `GA_ID` after confirming the property)
- [ ] Apply for AdSense (NOT before: 20–30 articles + some traffic — see monetization milestones)
- [ ] **Enable the OpenCode desktop browser** (experimental browser setting) so the visual/mobile verification pass can run — functional behaviour is already verified, only the screenshot/eyeball pass is waiting
- [x] ~~**Create the GitHub repo + push**~~ — DONE: **https://github.com/glixtron/tools4market** (now **PRIVATE**, MIT licence), branch `main`, 2+ commits, remote `origin` configured
- [x] ~~Deploy baseline to Cloudflare~~ — DONE; current production site is live. **Pending:** deploy the local SEO diagnostics and copy improvements from 21 Oct.
- [x] ~~Attach canonical apex domain~~ — DONE: `https://tools4market.online` serves the site and is used in canonicals/sitemaps.
- [ ] **Fix `www` canonical redirect** — live fetch currently gets HTTP 403 on `https://www.tools4market.online/`, instead of the required one-hop 301 to apex. The Worker already implements the redirect and a `www` route is now declared in `wrangler.jsonc`; deploy it and check Cloudflare Zero Trust/Access or zone redirect settings if 403 remains. Historical `launch-verification.md` recorded an Access policy on `www`.
- [ ] **Set integration env vars in Cloudflare Pages** (Settings → Environment variables → Production): `GA_ID` (GA4), `ADSENSE_CLIENT` + `AD_SLOT_TOP` / `AD_SLOT_CONTENT` / `AD_SLOT_SIDEBAR` (AdSense; also writes `ads.txt`). `SITE_URL` / `SITE_EMAIL` are optional overrides — the defaults already point at the live domain.
- [ ] **Point DNS to Cloudflare** (nameservers at the registrar) → add `www.tools4market.online` as a custom domain → verify `https://www.tools4market.online/api/fetch?url=https://example.com` returns `{"ok":true,…}`

## ✅ Phase 1 — complete (20 Oct 2026)

- [x] build.mjs static site generator — clean build, no SEO length warnings
- [x] style.css design system + site.js shell
- [x] Tool definitions with copy + runtime implementations (now 30 tools — see below)
- [x] Policy pages (About, Contact, Privacy, Terms, Disclaimer)
- [x] sitemap.xml + robots.txt + 404
- [x] **Full tool functional audit — 236/236 checks passed** (real DOM via jsdom driving actual `dist/` HTML + production scripts; realistic inputs, edge cases, injection attempts, zero JS errors)
- [x] README with deploy instructions
- [x] **3 bugs found + fixed:** `.faq-row` mobile layout · duplicate `applebot` element ID (label toggled wrong checkbox on 2 tools) · `var(--mono)` → `var(--font-mono)` on password output

### ✅ Personalization engine + 2 new tools (20 Oct 2026)

- [x] **"Analyze your own page first" panel on all 18 original tools** — paste a URL, the tool reads the live page and pre-fills its fields + shows a personalized fix list (not generic advice)
- [x] **`/api/fetch` Cloudflare Pages Function** — first-party, CORS-free live-URL proxy (SSRF-guarded, size/time capped). Graceful degradation: proxy → direct fetch → paste-HTML, so tools never break
- [x] **Web Crawler Audit** tool (new) — crawlability & indexability report (HTTPS, noindex, canonical, sitemap, schema…) + prioritized fixes + crawl-health score
- [x] **SEO Score Checker** tool (new) — weighted on-page checklist with letter grade and factor evidence; phrase placement is informational only
- [x] New engine verified — **103/103 checks** (parse engine, panel mount, pre-fill, both new tools via URL + paste paths, XSS-inertness proof, all 20 tools boot clean)
- [x] Full regression re-run — **236/236** audit + **43/43** URL crawl clean after the changes

### ⏳ One item still open from Phase 1
- [ ] **Visual browser verification** — load tool pages, type real inputs, confirm previews render; 390×844 mobile screenshots. *Functional logic already verified in Node; only the visual pass + screenshots remain, blocked on the desktop browser connection.*

### ✅ Launch-grade QA + SEO content (20 Oct 2026, night 2nd pass)

- [x] **RCA of "tools not working"** — root cause: local preview server lacked `/api/fetch`, so URL mode failed on localhost. Fixed with `serve-dev.mjs` (zero-dep Node server, production-parity proxy + SSRF guard, port 8090)
- [x] **Runtime hardening** — 8 real defects fixed (unescaped HTML in generated tags, negative schema price, skipped breadcrumb positions, malformed llms.txt URLs, negative slug length, `javascript:` UTM URLs, stop-words-only blank output, NaN password length) + `{n}` template bug in the panel status + rules §3 sweep (0 innerHTML-family APIs left)
- [x] **SEO content: all 20 tool pages** — body expanded to 431–483 words each (3–4 sections), category pages + homepage content blocks, `WebSite`+`Organization` JSON-LD, prose escaped at render
- [x] **og:image** (1200×630 branded PNG) + `twitter:card=summary_large_image`
- [x] **QC harness + `qcreport.md`** — timestamped query→response report per tool, **20/20 PASS**; suites: audit 236/236, edge-suite 236/236, smoke 20/20, URL E2E 11/11

## 📅 Phase 2 — in progress (started 20 Oct 2026, user go-ahead given)
- [ ] **Site-wide SEO definition pass (IN PROGRESS)** — every tool page + the homepage audited against a full checklist (unique/optimised title, meta description, H1, intro, keyword placement, section depth, FAQ quality, structured data, internal linking, HTML hygiene, site-wide duplicate detection). Harness: `tests/seo-audit.mjs`. **Audit built and run — defects found and being fixed:** duplicate FAQ question across two tools, duplicate terms in 3 `keywords` lists, `jwt-decoder` meta description missing its primary keyword, `url-encoder-decoder` heading/description keyword gaps, `ics-calendar-generator` FAQs under-targeted, and a missing **homepage FAQ section + FAQPage schema**. Remaining: apply fixes → re-run to 100% → push.
- [x] **Google AdSense connected (21 Oct 2026)** — publisher `ca-pub-1509697031230558`: loader in every `<head>` (site-ownership verification), `ads.txt` generated at the domain root, preconnect for the ad server, ad slots keep their reserved height (no CLS) and switch to real `<ins>` units as soon as `AD_SLOT_TOP` / `AD_SLOT_CONTENT` / `AD_SLOT_SIDEBAR` ad-unit ids are set. Consent-aware: EEA/UK/CH get limited non-personalised ads until the visitor accepts. **Next:** create the three ad units in the AdSense console → set the env vars → tick "I've placed the code" in the AdSense console → request review.
- [x] **10 new tools shipped:** case converter · duplicate-line remover · lorem ipsum · reading time (text suite) + Base64 · URL encode · UUID · JWT decoder · user-agent parser · .ics calendar generator (dev suite). Word/char counter, text diff, JSON formatter, regex tester, QR and colour tools already exist in Phase 1 — not duplicated. **Verified: build 41 pages / 0 warnings, audit 236/236, smoke 30/30, ph2-test 129/129.**
- [ ] Content engine: 3–5 blog posts/week (first 30 posts targeting long-tail: "how to block GPTBot", "llms.txt vs robots.txt", "meta tags checklist 2026", "UTM naming conventions")
- [x] ~~OG image (1200×630 PNG) for social sharing~~ — done (branded PNG + twitter:card=summary_large_image)
- [x] ~~Minify assets at build (CSS/JS), add cache headers via `_headers` file~~ — `_headers` DONE (1-year immutable assets + 5-min HTML revalidate + security headers); minification still open (optional — keep readable source for the Cloudflare build)
- [x] ~~Extend URL diagnostics with robots.txt and sitemap evidence~~ — Web Crawler Audit checks the matching Googlebot rule, up to three declared sitemap files (plus up to three nested child maps), and falls back to `/sitemap.xml` when no sitemap is declared. Findings identify unverified data and do not claim Google index status.

## 📅 Phase 3 — months 3–4
- [ ] 12 marketing calculators (ROI, ROAS, CAC, CPC/CPM/CPA, email ROI, growth)
- [ ] More serverless tools via the now-live `/api/fetch` proxy: OG checker, SSL/redirect checker, broken-link checker
- [ ] Affiliate integration: Mangools, Semrush, hosting (with disclosures)
- [ ] Distribution: tool directories, Quora/Reddit cadence, Pinterest, 1 YouTube Short/week

## 📅 Monetization milestones
- [ ] Month 2 end: AdSense application
- [ ] Month 3–4: affiliate links live
- [ ] 50K sessions/mo: apply Mediavine/Raptive

## 🚀 Launch sequence (order matters — see README pre-launch checklist)
1. ~~Domain~~ ✔ → 2. ~~`SITE.url` wired~~ ✔ → 3. ~~GitHub repo (private, MIT) + push~~ ✔ → 4. deploy to Cloudflare Pages (frontend + `/api/fetch` backend) → 5. custom domain + apex 301 → 6. set `GA_ID` / AdSense env vars → 7. Search Console + sitemap → 8. content engine → 9. AdSense application

## 🧹 Debt / nice-to-have
- [x] ~~Expand every tool page body copy to 400+ words~~ — DONE for all 30 tools (431–542 words each)
- [ ] CSV export for keyword density tool
- [ ] Dark mode (low priority)
- [ ] Internal search page (client filter currently home/category only)
- [ ] Homepage search is substring-match — multi-word queries only match in written order ("meta tag" works, "tag meta" doesn't); tokenised matching would be more forgiving

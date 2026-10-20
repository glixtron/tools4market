# Pending Work

*Living tracker — update after every session. Last updated: 21 Oct 2026 (private repo + MIT licence + Cloudflare frontend/backend integration layer).*

## 👤 User actions required — **these block launch**

- [x] ~~**Buy domain**~~ — DONE: **`www.tools4market.online`** · `SITE.url` = `https://www.tools4market.online`, `SITE.email` = `support@tools4market.online`, all dist URLs verified (0 old-domain references) · canonical = **www** (apex 301 → www via `dist/_redirects` + optional Cloudflare Page Rule)
- [ ] Create Google account assets: Search Console property, GA4 property (after deploy)
- [ ] Apply for AdSense (NOT before: 20–30 articles + some traffic — see monetization milestones)
- [ ] **Enable the OpenCode desktop browser** (experimental browser setting) so the visual/mobile verification pass can run — functional behaviour is already verified, only the screenshot/eyeball pass is waiting
- [x] ~~**Create the GitHub repo + push**~~ — DONE: **https://github.com/glixtron/tools4market** (now **PRIVATE**, MIT licence), branch `main`, 2+ commits, remote `origin` configured
- [ ] **Deploy to Cloudflare** — build `node build.mjs` → deploy `npx wrangler deploy` (config committed in `wrangler.jsonc`, entrypoint `worker.js` = frontend assets + `/api/fetch` backend). *First deploy failed with `Invalid _redirects configuration: Only relative URLs are allowed (100324)` — fixed: `dist/_redirects` is now Workers-safe and the apex→www 301 moved to a zone-level Cloudflare Redirect Rule; `worker.js` added so the backend deploys with the frontend. **The fix is pushed — redeploy to verify.***
- [ ] **Attach the custom domain** — Worker → Settings → Domains & Routes → Add Custom Domain → `www.tools4market.online`; then zone-level Redirect Rule: hostname `tools4market.online` → dynamic 301 to `concat("https://www.tools4market.online", http.request.uri.path)`; point the domain's nameservers at Cloudflare; verify `https://www.tools4market.online/api/fetch?url=https://example.com` returns `{"ok":true,…}`
- [ ] **Set integration env vars in Cloudflare Pages** (Settings → Environment variables → Production): `GA_ID` (GA4), `ADSENSE_CLIENT` + `AD_SLOT_TOP` / `AD_SLOT_CONTENT` / `AD_SLOT_SIDEBAR` (AdSense; also writes `ads.txt`). `SITE_URL` / `SITE_EMAIL` are optional overrides — the defaults already point at the live domain.
- [ ] **Point DNS to Cloudflare** (nameservers at the registrar) → add `www.tools4market.online` as a custom domain → verify `https://www.tools4market.online/api/fetch?url=https://example.com` returns `{"ok":true,…}`

## ✅ Phase 1 — complete (20 Oct 2026)

- [x] build.mjs static site generator — clean build, no SEO length warnings
- [x] style.css design system + site.js shell
- [x] Tool definitions with copy + runtime implementations (now 20 tools — see below)
- [x] Policy pages (About, Contact, Privacy, Terms, Disclaimer)
- [x] sitemap.xml + robots.txt + 404
- [x] **Full tool functional audit — 236/236 checks passed** (real DOM via jsdom driving actual `dist/` HTML + production scripts; realistic inputs, edge cases, injection attempts, zero JS errors)
- [x] README with deploy instructions
- [x] **3 bugs found + fixed:** `.faq-row` mobile layout · duplicate `applebot` element ID (label toggled wrong checkbox on 2 tools) · `var(--mono)` → `var(--font-mono)` on password output

### ✅ Personalization engine + 2 new tools (20 Oct 2026)

- [x] **"Analyze your own page first" panel on all 18 original tools** — paste a URL, the tool reads the live page and pre-fills its fields + shows a personalized fix list (not generic advice)
- [x] **`/api/fetch` Cloudflare Pages Function** — first-party, CORS-free live-URL proxy (SSRF-guarded, size/time capped). Graceful degradation: proxy → direct fetch → paste-HTML, so tools never break
- [x] **Web Crawler Audit** tool (new) — crawlability & indexability report (HTTPS, noindex, canonical, sitemap, schema…) + prioritized fixes + crawl-health score
- [x] **SEO Ranking Score** tool (new) — 0–100 on-page score with letter grade, weighted factor breakdown, biggest-improvements list
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
- [x] **10 new tools shipped:** case converter · duplicate-line remover · lorem ipsum · reading time (text suite) + Base64 · URL encode · UUID · JWT decoder · user-agent parser · .ics calendar generator (dev suite). Word/char counter, text diff, JSON formatter, regex tester, QR and colour tools already exist in Phase 1 — not duplicated. **Verified: build 41 pages / 0 warnings, audit 236/236, smoke 30/30, ph2-test 129/129.**
- [ ] Content engine: 3–5 blog posts/week (first 30 posts targeting long-tail: "how to block GPTBot", "llms.txt vs robots.txt", "meta tags checklist 2026", "UTM naming conventions")
- [x] ~~OG image (1200×630 PNG) for social sharing~~ — done (branded PNG + twitter:card=summary_large_image)
- [x] ~~Minify assets at build (CSS/JS), add cache headers via `_headers` file~~ — `_headers` DONE (1-year immutable assets + 5-min HTML revalidate + security headers); minification still open (optional — keep readable source for the Cloudflare build)
- [ ] Extend the URL-check panel to fetch `/robots.txt` + `/sitemap.xml` for site-level context (currently page-level)

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

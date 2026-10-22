# Pending Work

*Living tracker — update after every session. Last updated: 22 Oct 2026 — audit/growth-plan release **deployed to production** (Worker `9d8d8e00`, live-verify 58/58); image optimizer + keyword review committed to `main` (not yet deployed).*

## 👤 Owner follow-ups — launch and growth

- [x] ~~**Buy domain**~~ — DONE: **`tools4market.online`** (canonical host = apex) · `SITE.url` = `https://tools4market.online`, `SITE.email` = `support@tools4market.online`, all dist URLs verified (0 old-host references) · `www` must 301 → apex via a zone-level Cloudflare Redirect Rule (not `_redirects` — Workers reject host rules)
- [x] ~~Verify Google Search Console property~~ — DONE per user; sitemap submitted/monitoring started
- [x] ~~Start Bing Webmaster Tools~~ — DONE per user; Bing crawling/index monitoring started
- [x] **Google tag / GA4 tag present** — latest live verification found exactly one `G-6B4GGFC96K` tag on every published page, after Consent Mode defaults. Check collected traffic in GA4 separately; tag presence alone does not prove reporting attribution is configured correctly.
- [x] ~~**Set `INDEXNOW_KEY`**~~ — DONE 22 Oct: key `48794bab…701d` generated, stored in local `.env` (gitignored; build reads it), `/{key}.txt` published and verified live (200), **51 URLs submitted to IndexNow (HTTP 202)**. Re-run `npm run indexnow` after each deploy.
- [ ] **After the next deploy:** resubmit the sitemap in Search Console (blog now carries real `lastmod`; tool/pages deliberately have none) and check Coverage for new-indexed pages
- [ ] **Check AdSense site/review status** — Google's readiness guidance focuses on unique, relevant content, clear navigation and user experience; it does not publish a fixed article-count threshold. Resolve any specific status/rejection findings before applying or reapplying.
- [ ] **Enable the OpenCode desktop browser** (experimental browser setting) so the visual/mobile verification pass can run — functional behaviour is already verified, only the screenshot/eyeball pass is waiting
- [x] ~~**Create the GitHub repo + push**~~ — DONE: **https://github.com/glixtron/tools4market** (now **PRIVATE**, MIT licence), branch `main`, 2+ commits, remote `origin` configured
- [x] ~~Deploy baseline to Cloudflare~~ — DONE; production live. **Deployed 22 Oct:** audit/growth-plan release (design v2.1, homepage IA, favicon.ico, GA4 events, IndexNow hooks) live as Worker version `9d8d8e00-d9a7-4b60-a238-af5d3dffb96e` via `npm run deploy` from this machine (wrangler OAuth now authenticated locally). **Pending:** publish the image optimizer (committed to `main`, not yet deployed).
- [x] ~~Attach canonical apex domain~~ — DONE: `https://tools4market.online` serves the site and is used in canonicals/sitemaps.
- [x] ~~**Fix `www` canonical redirect**~~ — FIXED and verified live 22 Oct: `https://www.tools4market.online/` → 301 → `https://tools4market.online/` (one hop, via the Worker route `www.tools4market.online/*` now deployed in `wrangler.jsonc`).
- [ ] **Finish AdSense ad-unit setup** — publisher loader and `ads.txt` are live. Create ad units and set `AD_SLOT_TOP` / `AD_SLOT_CONTENT` / `AD_SLOT_SIDEBAR`, then finish the AdSense review flow. `SITE_URL` / `SITE_EMAIL` are optional overrides; defaults already point at the live domain.
- [x] ~~**Point DNS / verify `/api/fetch`**~~ — latest live verification records Cloudflare DNS, apex + www canonical routing, live sitemap and a working public-page fetch proxy with the loopback SSRF probe blocked.

## ✅ Phase 1 — complete (20 Oct 2026)

- [x] build.mjs static site generator — clean build, no SEO length warnings
- [x] style.css design system + site.js shell
- [x] Tool definitions with copy + runtime implementations (now 31 tools — see below)
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
- [ ] **Remaining visual QA** — local browser interaction has verified the sitemap tool against the live public site; still capture a 390×844 mobile pass across representative tools.

### ✅ Launch-grade QA + SEO content (20 Oct 2026, night 2nd pass)

- [x] **RCA of "tools not working"** — root cause: local preview server lacked `/api/fetch`, so URL mode failed on localhost. Fixed with `serve-dev.mjs` (zero-dep Node server, production-parity proxy + SSRF guard, port 8090)
- [x] **Runtime hardening** — 8 real defects fixed (unescaped HTML in generated tags, negative schema price, skipped breadcrumb positions, malformed llms.txt URLs, negative slug length, `javascript:` UTM URLs, stop-words-only blank output, NaN password length) + `{n}` template bug in the panel status + rules §3 sweep (0 innerHTML-family APIs left)
- [x] **SEO content: all 20 tool pages** — body expanded to 431–483 words each (3–4 sections), category pages + homepage content blocks, `WebSite`+`Organization` JSON-LD, prose escaped at render
- [x] **og:image** (1200×630 branded PNG) + `twitter:card=summary_large_image`
- [x] **QC harness + `qcreport.md`** — timestamped query→response report per tool, **20/20 PASS**; suites: audit 236/236, edge-suite 236/236, smoke 20/20, URL E2E 11/11

## 📅 Phase 2 — in progress (started 20 Oct 2026, user go-ahead given)
- [x] **Site-wide SEO definition pass (21 Oct)** — all 30 tools and homepage checked for metadata, headings, keyword placement, content depth, FAQs, schema, internal links, HTML hygiene and duplicates. `tests/seo-audit.mjs`: **1,254 passed, 0 failed**. Utility-page focus terms and repeated FAQ wording corrected locally; deploy remains a separate step.
- [x] **30-day audit & growth plan implemented (22 Oct)** — design system v2.1 "Classic Editorial Utility", job-focused homepage with weekly Editor's pick, `usedFor`/`updated` metadata on tools, favicon.ico, honest sitemap `lastmod` (blog only), GA4 growth events, `INDEXNOW_KEY` + `GOOGLE_SITE_VERIFY` hooks, `npm run indexnow`. `tests/seo-audit.mjs`: **1,529 passed, 0 failed**; full suite green (smoke 30/30, consent 30/30, personalized 84/84). **Deployed 22 Oct;** Search Console re-submission still due.
- [x] **Google AdSense connected (21 Oct 2026)** — publisher `ca-pub-1509697031230558`: loader in every `<head>` (site-ownership verification), `ads.txt` generated at the domain root, preconnect for the ad server, ad slots keep their reserved height (no CLS) and switch to real `<ins>` units once `AD_SLOT_TOP` / `AD_SLOT_CONTENT` / `AD_SLOT_SIDEBAR` ids are configured. Consent-aware: EEA/UK/CH get limited non-personalised ads until the visitor accepts. **Next:** confirm review status, create/verify ad units and set the slot ids as needed.

### ✅ Guides section + Google tag verification (21–22 Oct 2026)

- [x] **Ten full guides published** at `/blog/` — each with `BlogPosting` + `FAQPage` + `BreadcrumbList` schema, author/reviewer/date, cited sources, and links into the tools it discusses: robots.txt for search engines and AI crawlers · the website launch SEO checklist · how to block GPTBot · llms.txt guide · how to appear in ChatGPT search results · check whether AI crawlers can access your site · noindex vs robots.txt · why is my site not indexed · UTM naming conventions · schema markup for AI search
- [x] **Google tag (GA4 `G-6B4GGFC96K`) verified on every published page** — byte-identical to Google's snippet, exactly one per page, always after the Consent Mode v2 defaults. Proved locally across every built page and live across every URL in all three sitemaps
- [x] **GTM container `GTM-P6P4FLGB` audited** — it contains no GA4 measurement id, so there is no double counting with the direct Google tag
- [ ] **AdSense verdict** — confirm the current status in the console. If declined, fix the specific findings and strengthen original utility, guidance and navigation; do not add articles to meet an invented count.
- [x] **Deploy the 22 Oct audit work** (design v2.1, homepage IA, favicon.ico, GA4 events, IndexNow hook) — DEPLOYED 22 Oct via `npm run deploy`; live-verify suite **58/58** against production
- [ ] **Deploy the image optimizer** — committed to `main` (`5837fb7`) with cross-verified tests; run `npm run deploy` + `npm run indexnow` to publish `/tools/image-compressor/`
- [ ] **Distribution plan** — tool directories, Quora/Reddit cadence, Pinterest, 1 YouTube Short/week (was listed under Phase 3; start now per the audit plan)
- [x] **10 new tools shipped:** case converter · duplicate-line remover · lorem ipsum · reading time (text suite) + Base64 · URL encode · UUID · JWT decoder · user-agent parser · .ics calendar generator (dev suite). Word/char counter, text diff, JSON formatter, regex tester, QR and colour tools already exist in Phase 1 — not duplicated. **Verified: build 41 pages / 0 warnings, audit 236/236, smoke 30/30, ph2-test 129/129.**
- [x] **Image Compressor & Optimizer pilot (22 Oct)** — added locally at `/tools/image-compressor/`: browser-local JPEG/PNG/WebP/AVIF input, WebP/JPEG/PNG export, resize and quality controls, per-file size/dimension comparison, and separate downloads. Limits batches to 10 files/50 MB total and each image to 20 MB/50 MP. Image bytes are not uploaded; EXIF/metadata caveats are disclosed. **Not deployed yet.**
- [x] **Post-launch keyword and CBO review (22 Oct)** — refreshed [KEYWORD-RESEARCH-AND-SEO-PLAN.md](KEYWORD-RESEARCH-AND-SEO-PLAN.md) with a competitor/product scan, intent-led priorities, verified positioning, current Google/Bing research workflow and a 30/60/90-day plan. The 1,040 phrases remain hypotheses; no connected GSC/Bing export or keyword-volume data was available in this workspace.
- [ ] **Collect the first GSC and Bing query exports** after enough data accrues; compare queries and landing pages by impressions, clicks, CTR, position, country and device before expanding the keyword/page inventory.
- [x] **Content cadence reset (22 Oct)** — 10 guides are already published. Pause the 3–5-posts/week target; update or add a guide only when GSC/Bing queries or user questions reveal a useful gap.
- [x] ~~OG image (1200×630 PNG) for social sharing~~ — done (branded PNG + twitter:card=summary_large_image)
- [x] ~~Minify assets at build (CSS/JS), add cache headers via `_headers` file~~ — `_headers` DONE (1-year immutable assets + 5-min HTML revalidate + security headers); minification still open (optional — keep readable source for the Cloudflare build)
- [x] ~~Extend URL diagnostics with robots.txt and sitemap evidence~~ — Web Crawler Audit checks the matching Googlebot rule, up to three declared sitemap files (plus up to three nested child maps), and falls back to `/sitemap.xml` when no sitemap is declared. Findings identify unverified data and do not claim Google index status.

## 📅 Phase 3 — months 3–4
- [ ] 12 marketing calculators (ROI, ROAS, CAC, CPC/CPM/CPA, email ROI, growth)
- [ ] More serverless tools via the now-live `/api/fetch` proxy: OG checker, SSL/redirect checker, broken-link checker
- [ ] Affiliate integration: Mangools, Semrush, hosting (with disclosures)
- [ ] Distribution: tool directories, Quora/Reddit cadence, Pinterest, 1 YouTube Short/week

## 📅 Monetization milestones
- [ ] AdSense: finish or re-submit review when the site's unique content, navigation, policy pages and ad implementation are ready; there is no fixed article-count target in Google's published readiness guidance.
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

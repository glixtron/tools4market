# Work Log

Running log of agent sessions: who did what, what was broken, how it was fixed, and when it completed. Newest entries first.

---

## 2026-10-23 (late session) — PageSpeed deep fix: performance, CLS, accessibility

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner shared PageSpeed Insights data — mobile Performance **36** (FCP 6.4 s, LCP 9.1 s, CLS 0.693), desktop 88, "unused JavaScript 445 KiB", "render-blocking requests", Accessibility 90. Asked to make loading/indexing smooth and to start this work log.

**Diagnosis (local Lighthouse run, mobile, before changes):**
- Performance 62 on a clean run, **TBT 4,070 ms**, main-thread 8.0 s, unused JS **557 KiB**.
- Root causes found:
  1. **Every page loaded all 7 runtime scripts + strings + inspect engine (~210 KB JS)** regardless of the page's tool — homepage loaded tool runtimes it can never run.
  2. **Google Fonts via CSS `@import`** — serial render-blocking chain: HTML → style.css → fonts.googleapis.com → fonts.gstatic.com woff2 (also flagged for 30-min cache lifetimes).
  3. **Google Tag Manager loaded gtm.js (~560 KB) on every page** although the container was audited earlier and holds **no GA4 measurement id** (GA4 runs via the direct Google tag) — pure main-thread cost.
  4. **AdSense loader (`adsbygoogle.js` + `show_ads_impl` ~150–250 KB)** fetched on every page while the account is on hold with **no ad unit ids configured** — it cannot render anything; also caused the best-practices "third-party cookies" failure.
  5. Mystery first-party requests `/tow0/…` (131 KiB) and a Cloudflare beacon — **not in our repo or HTML**; identified as Cloudflare-dashboard-level injections (see pending-work.md for the owner action).
  6. Accessibility 90: eyebrow text 4.47:1 (needs 4.5), decorative counters 1.71:1, footer `h4` heading skip, prose links relying on color alone (1.05:1 vs body text).

**Fixes shipped:**
- **Per-page script slicing** (`build.mjs`): static pages load `site.js` only; tool pages load their category runtime + `inspect-strings.js` + inspect engine (only when the tool has a results panel) + `audit.js` (only the two audit tools). 13 local tools no longer ship the inspect engine.
- **Self-hosted fonts**: vendored all 12 woff2 files (35 `@font-face` blocks, subset-ruled) into `src/fonts/` → `/fonts/*` with 1-year immutable headers; removed the Google Fonts `@import` + preconnects; added `<link rel=preload>` for the two above-the-fold faces. Kills the render-blocking chain and the short third-party font cache.
- **GTM off by default** (`GTM_ID` now unset = off, matching the section's documented behavior). Direct GA4 gtag + Consent Mode unchanged. Re-enable = set `GTM_ID` in `.env`.
- **AdSense loader gated on `AD_SLOT_*`**: no ad unit ids configured → no loader ships (ads.txt stays published). Re-enable = set any `AD_SLOT_*` var; loader returns on next build.
- **CSS minified at build** (quote-aware comment/whitespace stripper; `src/style.css` stays readable) — 64.9 KB → 47.8 KB.
- **Identity source maps** generated for all first-party JS (devtools-only `.map` files) — fixes Lighthouse "missing source maps" without minifying JS.
- **Accessibility**: contrast-corrected `#8c6025` eyebrow/cat-num (5.06:1), `#766e5c` sec-num (4.64:1), `#8b8271` outcome-num (3.49:1 @24px), `#66707c` tool-proc (5.03:1); footer headings `h4`→`h3`; in-prose links underlined.
- Tests updated where assertions were stale against intentional changes (footer `h3`, minified-CSS regexes, GTM-off assertions in consent + live-verify).

**Result (local Lighthouse, mobile):** Performance 62→**81** (varies 69–81 with third-party fetch timing), **TBT 4,070→590 ms**, unused JS **557→71 KiB** (the 71 KiB is Google's own gtag.js), CLS 0, **Accessibility 90→100, Best Practices 77→100, SEO 100**. All suites green: build 63 pages, smoke 40/40, SEO audit 1981/1981, consent 30/30, personalized 152/152, suggest-api 24/24.

**Indexing health check:** robots.txt Allow:/ + sitemap index (3 child maps, 63 URLs), canonicals on every page, no noindex on public pages, IndexNow pipeline in place — crawl side unchanged and healthy; the speed fixes also remove the heaviest crawl-time main-thread work for Googlebot.

**Deployed:** ✅ commit `b53d0e8` pushed to `audit-growth-plan-v2.1` + `main`; production redeployed via `npm run deploy` (92 assets uploaded — fonts, source maps, minified CSS, all 63 pages); **IndexNow: 62 URLs submitted (HTTP 200)**; live verification **61/61 passed** (includes the new GTM-off, AdSense-off-while-slots-unset and ads.txt checks against production).

**Live PageSpeed after deploy:**
- **Desktop: Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100** (FCP 0.6 s, LCP 0.6 s, CLS 0, TBT 50 ms) — was 88/90/100/100.
- **Mobile: Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0** — was 90/77/100 with CLS up to 0.693. Performance score varies per run (57–81 observed) because the remaining cost is third-party and outside the repo: Google's own `gtag.js` (73 KiB) and the two Cloudflare-dashboard injections (`/tow0/…` 97 KiB + Web Analytics beacon). Owner action for the dashboard items is in pending-work.md — removing the `/tow0/` proxy (it may double-count GA4) is the single biggest remaining mobile lever.

**Notes for next sessions:**
- Any new tool page must be listed in the data files only — script loading is derived automatically (`RUNTIME_FILE` by category, `LOCAL_TOOLS` skip the inspect engine, `AUDIT_SLUGS` get `audit.js`).
- If fonts are ever changed: drop new woff2 subsets in `src/fonts/`, replace the `@font-face` block at the top of `src/style.css` (keep `font-display: swap`), update the two `<link rel=preload>` entries in `build.mjs`.
- To re-enable GTM: set `GTM_ID` in `.env`. To re-enable AdSense: set any `AD_SLOT_*` in `.env`. Both ship on the next build with no code change.

**Completed:** 2026-10-23 23:01 IST

---

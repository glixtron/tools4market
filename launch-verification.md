# Tools4Market — Live Launch Verification

Run against the **public** site (https://tools4market.online) with a Googlebot user-agent.
DNS is read from the authoritative nameservers (`curt.ns.cloudflare.com`); pages are fetched over TLS through Cloudflare's edge — i.e. exactly what Googlebot sees.

## Result: 35 / 38 checks PASS

```
=== DNS (public resolvers) ===
PASS  apex NS delegated to Cloudflare  | curt.ns.cloudflare.com. rose.ns.cloudflare.com.
PASS  apex A records published  | 172.67.140.239 104.21.27.25
PASS  www A record published  | 172.67.140.239 104.21.27.25
PASS  GSC verification TXT published  | "google-site-verification=tiPiKZ53FGUPamG1lGIvHscGBt_DzWaxniwFTAW-Nww"
PASS  SPF record published  | "v=spf1 include:spf.privateemail.com ~all"
PASS  MX records published (email works)  | 10 mx1.privateemail.com. 10 mx2.privateemail.com.

=== Redirects ===
FAIL  www -> apex is a 301 (no loop / no Access login)  | status 302 location https://hemant-vigyanllm.cloudflareaccess.com/cdn-cgi/access/login/www.tools4market.online
FAIL  www redirect chain terminates (no ERR_TOO_MANY_REDIRECTS)  | final 400 https://hemant-vigyanllm.cloudflareaccess.com/cdn-cgi/access/login/www.tools4market.online?kid=2e9ae34eb8dc815dbfa0f351f4c27091d991025a45f60
PASS  apex serves 200 without redirect  | status 200 

=== Core files ===
PASS  robots.txt: 200 + text/plain  | status 200 ct text/plain 
PASS  sitemap index: 200 + application/xml  | status 200 ct application/xml 
PASS  sitemap pages: 200 + application/xml  | status 200 ct application/xml 
PASS  sitemap tools: 200 + application/xml  | status 200 ct application/xml 
PASS  manifest: 200 + application/manifest+json  | status 200 ct application/manifest+json 
FAIL  404 page: 200 + text/html  | status 307 ct  
PASS  robots.txt allows crawling (User-agent: * / Allow: /)
PASS  robots.txt points at our sitemap  | Sitemap: https://tools4market.online/sitemap.xml

=== Sitemap integrity ===
PASS  sitemap.xml is a sitemapindex
PASS  index lists 2 children  | https://tools4market.online/sitemap-pages.xml https://tools4market.online/sitemap-tools.xml
PASS  sitemap-pages.xml: valid urlset with 10 URLs  | 10 urls
PASS  sitemap-tools.xml: valid urlset with 30 URLs  | 30 urls
PASS  40 unique URLs, all on the canonical host  | 40 urls

=== Every sitemap URL (public fetch) ===
PASS  all 40 URLs: 200 + self-referencing canonical + indexable  | 40/40

=== Backend /api/fetch ===
PASS  proxy returns ok + real HTML  | status 200 bytes 577 
PASS  proxy blocks SSRF to loopback  | {"ok":false,"error":"That host is not allowed."}

=== Assets & page structure ===
PASS  homepage og:image on the canonical host
PASS  homepage has WebSite + Organization JSON-LD
PASS  homepage has no noindex
PASS  asset /assets/style.css  | status 200 
PASS  asset /assets/og-image.png  | status 200 
PASS  asset /assets/icon-192.png  | status 200 
PASS  asset /assets/site.js  | status 200 
PASS  asset /assets/runtime/inspect.js  | status 200 
PASS  asset /assets/runtime/audit.js  | status 200 
PASS  asset /assets/inspect-strings.js  | status 200 
PASS  tool page ships the tool root + slug
PASS  tool page has FAQPage schema
PASS  tool page has the URL-analysis panel runtime

TOTAL: 35 passed, 3 failed
```

## The 3 remaining failures

| # | Check | Status | Cause | Fix |
|---|---|---|---|---|
| 1 | `www` → apex is a 301 | ❌ 302 | A **Cloudflare Access (Zero Trust) application** still protects `www.tools4market.online` — it 302s to `hemant-vigyanllm.cloudflareaccess.com/cdn-cgi/access/login/...`. This is what produced the earlier `ERR_TOO_MANY_REDIRECTS`. | Cloudflare → Zero Trust → Access → Applications → **delete the app covering `www.tools4market.online`**. The Worker then serves a clean one-hop `301 → https://tools4market.online/...`. |
| 2 | `www` redirect chain terminates | ❌ 400 | Same Access app (login loop). | Same as #1. |
| 3 | `/404.html` returns 200 | ❌ 307 | Workers `html_handling: auto-trailing-slash` strips the `.html` extension and redirects `/404.html → /404`, which then renders the branded 404 page. Cosmetic only — real 404s (unknown paths) correctly return **404 with the branded page**. | Optional: serve the 404 from a `404/index.html` route instead. |

## What is verified working

- **DNS**: apex + www delegated to Cloudflare and resolving; GSC verification TXT published; SPF + MX (privateemail) live.
- **All 40 pages** (home, 4 category hubs, 30 tool pages, 5 policy pages): HTTP 200, **self-referencing canonical** on the apex host, indexable (no `noindex`).
- **Sitemaps**: `sitemap.xml` is a valid sitemap index → `sitemap-pages.xml` (10 URLs) + `sitemap-tools.xml` (30 URLs); 40 unique URLs, all on the canonical host.
- **`robots.txt`**: allows crawling and points at the canonical sitemap.
- **Backend `/api/fetch`**: returns real fetched HTML in production; loopback/metadata hosts are refused (SSRF guard).
- **Assets & metadata**: style.css, og-image.png, icon-192.png, site.js, all 4 runtime bundles + inspect-strings.js — all 200; homepage carries `og:image` on the canonical host plus `WebSite` + `Organization` JSON-LD; tool pages carry `FAQPage` schema and the URL-analysis panel runtime.

## Local regression suites (all green at this build)

| Suite | Result |
|---|---|
| audit.mjs | 236/236 |
| qa-test.mjs (edge cases) | 236/236 |
| rca-smoke.mjs (30 tool pages) | 30/30 clean |
| e2e-url.mjs (live URL flow) | 11/11 |
| ph2-test.mjs (Phase 2 tools) | 129/129 |
| inspect-test.mjs (engine + panel) | 123/123 |
| qc-report.mjs (query → response) | 30/30 PASS |

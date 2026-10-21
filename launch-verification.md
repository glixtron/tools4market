# Tools4Market — Live Launch Verification

**Run against the public site (https://tools4market.online) with a Googlebot user-agent.**
DNS is read from the authoritative nameservers (`curt.ns.cloudflare.com`); pages are fetched over TLS through Cloudflare's edge — i.e. exactly what Googlebot sees.

## Result: 53 / 53 checks PASS — 0 failures

```
=== DNS (authoritative) ===
PASS  apex NS delegated to Cloudflare  | curt.ns.cloudflare.com. rose.ns.cloudflare.com.
PASS  apex A records published  | 104.21.27.25 172.67.140.239
PASS  GSC verification TXT published
PASS  MX records published (email)  | 10 mx1.privateemail.com. 10 mx2.privateemail.com.

=== Redirects ===
PASS  www redirects to the canonical host  | status 301 location https://tools4market.online/
PASS  apex serves 200 without redirect  | status 200 

=== Core files ===
PASS  robots.txt: 200 + text/plain  | status 200 ct text/plain 
PASS  sitemap index: 200 + application/xml  | status 200 ct application/xml 
PASS  manifest: 200 + application/manifest+json  | status 200 ct application/manifest+json 
PASS  Bing verification file: 200 + application/xml  | status 200 ct application/xml 
PASS  robots.txt allows crawling
PASS  robots.txt points at our sitemap
PASS  unknown URL returns branded, noindex 404  | status 404

=== Sitemap ===
PASS  sitemap.xml is a sitemapindex
PASS  index lists children  | https://tools4market.online/sitemap-pages.xml https://tools4market.online/sitemap-tools.xml https://tools4market.online/sitemap-blog.xml
PASS  sitemap-pages.xml: valid urlset (11 urls)
PASS  sitemap-tools.xml: valid urlset (30 urls)
PASS  sitemap-blog.xml: valid urlset (10 urls)
PASS  all URLs unique and on the canonical host  | 51 urls

=== Every sitemap URL ===
PASS  all 51 URLs: 200 + self-referencing canonical + indexable  | 51/51
PASS  all non-home sitemap pages have visible + JSON-LD breadcrumbs  | all breadcrumb trails present

=== Backend /api/fetch ===
PASS  proxy returns ok + real HTML  | status 200 bytes 577
PASS  proxy blocks SSRF to loopback  | {"ok":false,"error":"That host is not allowed."}

=== Metadata & assets ===
PASS  homepage og:image on the canonical host
PASS  homepage WebSite + Organization JSON-LD
PASS  homepage has a visible FAQ section + FAQPage schema
PASS  homepage Bing msvalidate meta
PASS  homepage has no noindex
PASS  GTM container script in head
PASS  GTM noscript iframe in body
PASS  exactly one Google tag (gtag.js) on the page  | 1
PASS  gtag consent default is denied
PASS  consent region scoping (EEA/UK/CH)
PASS  consent wait_for_update + url_passthrough + ads_data_redaction
PASS  consent defaults deny analytics/ads
PASS  cookie consent banner + preferences present
PASS  tool pages also carry GTM + consent UI
PASS  privacy policy documents cookies/consent
PASS  AdSense loader present with the publisher id
PASS  ads.txt served with the publisher id
PASS  ad slots reserve space without broken ad units
PASS  every live page (51) carries exactly one Google tag (G-6B4GGFC96K), consent first
PASS  blog index reachable with article links  | /blog/ / /assets/favicon.svg /assets/icon-192.png /manifest.webmanifest /sitemap
PASS  article page has BlogPosting + FAQPage + Breadcrumb schema
PASS  article links into its matching tools
PASS  sitemap index includes the blog child
PASS  asset /assets/style.css  | status 200
PASS  asset /assets/og-image.png  | status 200
PASS  asset /assets/icon-192.png  | status 200
PASS  asset /assets/site.js  | status 200
PASS  asset /assets/runtime/inspect.js  | status 200
PASS  asset /assets/runtime/audit.js  | status 200
PASS  asset /assets/inspect-strings.js  | status 200

TOTAL: 53 passed, 0 failed
```

## Coverage

- **DNS** — apex + www delegated to Cloudflare and resolving; GSC verification TXT published; MX/SPF (privateemail) live.
- **Redirects** — `www` → 301 → `https://tools4market.online/`; apex serves 200 with no redirect.
- **Sitemaps** — `sitemap.xml` is a valid index → pages + tools + blog children; every URL on the canonical host, no synthetic `lastmod`.
- **Every page** — all URLs: HTTP 200, self-referencing canonical, indexable, visible + JSON-LD breadcrumbs on non-home pages.
- **Google tag** — exactly one `G-6B4GGFC96K` gtag.js tag on **every** published page, always after the Consent Mode v2 defaults.
- **Consent Mode v2** — region-scoped defaults (EEA/UK/CH denied), `wait_for_update`, `url_passthrough`, `ads_data_redaction`; banner + preferences on every page; privacy policy documents it.
- **AdSense** — loader with the publisher id on every page, `ads.txt` at the root, ad slots reserved with no broken units.
- **Guides** — `/blog/` hub + 10 articles, each with `BlogPosting` + `FAQPage` + `BreadcrumbList` schema, author/reviewer/date, cited sources and links into its tools; RSS feed; `/llms.txt` + `/llms-full.txt` for AI crawlers.
- **Backend `/api/fetch`** — returns real fetched HTML in production; loopback/metadata hosts refused (SSRF guard).

## Local regression suites (same build)

| Suite | Result |
|---|---|
| `npm test` — tests/smoke.mjs (all 30 tool pages) | 30/30 clean |
| `npm run test:seo` — tests/seo-audit.mjs (site-wide SEO definition) | 1487/1487 |
| `npm run test:consent` — tests/consent-test.mjs | 30/30 |
| tests/personalized-tools-test.mjs | 84/84 |
| build (`node build.mjs`) | 52 pages, **0 SEO warnings** |
| `wrangler deploy --dry-run` (node 24 = CF runtime) | clean, 104 assets, `env.ASSETS` bound |


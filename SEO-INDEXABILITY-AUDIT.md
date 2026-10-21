# Tools4Market Indexability & Technical SEO Audit

**Audit date:** 21 October 2026  
**Canonical host:** `https://tools4market.online`  
**Coverage:** public sitemap, production fetches, source templates, generated pages and all 30 tool smoke checks.

## Executive summary

The live baseline is broadly crawlable: all **40 URLs currently listed in the sitemap returned HTTP 200, self-referencing canonicals, and no `noindex` directive**. `robots.txt` allows crawling and points to the sitemap index. The sitemap index correctly leads to 10 general pages and 30 tool pages. The branded error response for a genuinely unknown URL is HTTP 404 and `noindex`, and it is excluded from the sitemap.

Two production improvements remain before calling the canonical setup complete:

1. `https://www.tools4market.online/` returned HTTP **403** during the live check instead of the intended one-hop 301 to the apex. The Worker already contains a www-to-apex redirect; a `www` route is now declared in `wrangler.jsonc`. Deploy this change and review Cloudflare Access/Zero Trust or redirect settings if the 403 continues. A prior verification log also recorded an Access application on the www host.
2. The live site has not yet received the source changes from this audit. Category and policy pages had visible breadcrumbs but no `BreadcrumbList` structured data. The source now adds it to those pages, and the sitemap no longer advertises each build date as the page's last significant modification.

**Indexability is eligibility, not a guarantee of indexing or ranking.** Google decides whether to crawl and include URLs. Submitting a sitemap or requesting a recrawl does not guarantee either outcome.

## Production baseline observed

| Check | Result | Detail |
|---|---|---|
| Apex site | PASS | `https://tools4market.online/` returned 200. |
| Sitemap index | PASS | `sitemap.xml` returned XML and listed `sitemap-pages.xml` and `sitemap-tools.xml`. |
| Sitemap membership | PASS | 40 unique URLs: home, 4 category pages, 5 policy pages, 30 tool pages. |
| Sitemap page responses | PASS | All 40 sitemap URLs returned 200, matched their canonical URL, and had no `noindex`. |
| `robots.txt` | PASS | `User-agent: *`, `Allow: /`, and canonical sitemap URL are present. |
| Unknown URL | PASS | A nonexistent path returned a branded 404 response with `noindex`. |
| www host | ACTION REQUIRED | Live fetch returned 403, not a canonical redirect. |
| Bing verification | PASS | `BingSiteAuth.xml` returned 200; user reports Bing Webmaster Tools is active. |
| Google verification | PASS | GSC verification TXT was present; user reports Search Console is active. |
| HTML and assets | PASS | Homepage, stylesheet, image, icons, shell and audit runtimes returned 200. |
| Proxy | PASS | Live URL fetch worked; loopback SSRF probe was refused. |

The `/404.html` file itself redirects to `/404` under Cloudflare's `auto-trailing-slash` behavior. That is not a sitemap issue: a real missing URL correctly returns the branded HTTP 404 response and should remain out of the sitemap.

## Source changes made

- Added JSON-LD `BreadcrumbList` to all 4 category pages and 5 policy pages. Tool pages already had visual and structured breadcrumbs. The homepage appropriately has no breadcrumb trail.
- Kept breadcrumb schema aligned with the visible path. The final crumb omits `item`, which Google permits because it can use the containing page URL.
- Removed synthetic `lastmod` values derived from build date, plus unused `priority` and `changefreq` fields. Add `lastmod` only when the generator can report a verifiable significant content update for the relevant page.
- Declared the `www.tools4market.online/*` Worker route so the existing Worker redirect can run for www requests after deployment.
- Updated the live verification script to check actual unknown-URL 404 behavior, title/description limits, and visual plus JSON-LD breadcrumbs for non-home sitemap pages.
- Updated the project tracker to reflect the user's GSC and Bing setup.

## Local verification of the audit build

- `npm run build`: passed, **41 HTML files** generated (40 intended indexable pages + branded 404), with no SEO title/description warnings.
- `npm test`: **30/30 tool pages** passed the existing runtime smoke suite.
- Local sitemap structure audit: **40/40 URLs** had existing output files, one H1, a canonical matching the sitemap URL, valid title/description lengths, and visible plus valid JSON-LD breadcrumbs (except homepage, where breadcrumbs are not expected).

These checks verify the source build. The public site still needs a deploy before the new category/policy breadcrumbs, cleaner sitemap, metadata title refinements, curated tool links, and www route can be verified on production.

## Breadcrumb and page structure

- Homepage: one primary H1; top-level landing page, no breadcrumb.
- Category hubs: visual `Home → Category` breadcrumb and now `BreadcrumbList` JSON-LD.
- Tool pages: visual `Home → Category → Tool` breadcrumb; `WebApplication`, FAQ and breadcrumb JSON-LD.
- Policy pages: visual `Home → Policy` breadcrumb and now `BreadcrumbList` JSON-LD.
- Branded 404: excluded from sitemap and marked `noindex`.

Google requires at least two ordered `ListItem` entries for Breadcrumb rich-result eligibility and does not require an `item` URL on the last item. Breadcrumb markup must represent a visible, meaningful navigation path. [Google Breadcrumb structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

## Sitemap and indexing guidance

The sitemap is a discovery hint. Keep only canonical, indexable, successful page URLs in it; the current 40-page inclusion is appropriate. Do not repeatedly resubmit an unchanged sitemap. Google recommends `lastmod` only when it is consistently accurate and verifiable, and ignores `priority` and `changefreq`. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [Google crawling troubleshooting](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)

Use Search Console's Page indexing and URL Inspection reports to follow the 40 intended pages after deployment. If a page is discovered or crawled but not indexed, inspect whether it has distinct value, a correct canonical, crawlable internal links, and complete content. A page can be technically eligible and still not be selected for Google's index.

## Required next steps

1. Deploy the prepared source update.
2. Re-run `npm run test:live`. Confirm all sitemap pages still pass and the www host returns a single 301 to apex.
3. If www remains 403, remove or adjust the Cloudflare Access/Zero Trust policy or Redirect Rule that intercepts the host; confirm DNS is proxied and the Worker route is active.
4. In Search Console, inspect a category URL and policy URL to confirm Google sees the Breadcrumb structured data; inspect one representative tool URL for its existing breadcrumb, FAQ and WebApplication data.
5. Recheck sitemap processing and Page indexing after Google recrawls. Fix reported page issues instead of repeatedly requesting indexing.


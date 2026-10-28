# Sitemap audit — 2026-10-28

**Target:** dist  ·  **URLs:** 80  ·  **Crawl:** 320 ms  ·  **Rules:** 47  ·  **Score:** 99.9/100

| Severity | Count |
|---|---|
| Blockers | 0 |
| Major | 0 |
| Minor | 4 |
| Info | 80 |

| Section | Pages | Score | Blockers | Major | Minor |
|---|---|---|---|---|---|
| home | 1 | 100 | 0 | 0 | 0 |
| pages | 11 | 100 | 0 | 0 | 1 |
| tools | 44 | 100 | 0 | 0 | 1 |
| blog | 24 | 100 | 0 | 0 | 0 |

## Minor (4)

### `heading-order` — /blog/

**Finding:** Heading jumps h1 → h3 at "Categories"

**Fix:** Do not skip a level. An h3 directly under an h2 is fine; an h3 directly under an h1, or h4 under an h2, breaks outline parsing for screen readers and for passage extraction.

### `img-dimensions` — /tools/og-image-tester/

**Finding:** 1 image(s) without width/height

**Fix:** Declare intrinsic dimensions. Without them the browser reflows when the image loads, which is the layout shift CLS measures.

<details><summary>Evidence</summary>

```json
{"sources":[null]}
```

</details>

### `sitemap-lastmod-missing` — https://tools4market.online/sitemap-pages.xml

**Finding:** https://tools4market.online/sitemap-pages.xml has no <lastmod>

**Fix:** lastmod is the one sitemap hint Google says it uses. Emit the content date, not the build date, or omit it everywhere — a build-date lastmod trains Google to ignore the field.

### `sitemap-lastmod-missing` — https://tools4market.online/sitemap-tools.xml

**Finding:** https://tools4market.online/sitemap-tools.xml has no <lastmod>

**Fix:** lastmod is the one sitemap hint Google says it uses. Emit the content date, not the build date, or omit it everywhere — a build-date lastmod trains Google to ignore the field.

## Info (80)

### `skip-link` — /

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /seo-tools/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /ai-search-tools/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /content-social-tools/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /web-utility-tools/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /marketing-tools/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /about/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /contact/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /privacy-policy/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /terms/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /disclaimer/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/meta-tag-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/open-graph-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/twitter-card-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/canonical-tag-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/hreflang-tag-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/schema-markup-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/serp-preview-tool/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/meta-description-checker/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/web-crawler-audit/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/seo-score-checker/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/og-image-tester/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/hreflang-checker/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/robots-txt-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/robots-txt-tester/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/ai-crawler-blocker/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/llms-txt-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/url-slug-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/utm-link-builder/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/keyword-density-checker/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/hashtag-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/case-converter/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/duplicate-line-remover/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/lorem-ipsum-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/reading-time-calculator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/htaccess-redirect-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/sitemap-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/sitemap-validator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/password-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/base64-encoder-decoder/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/url-encoder-decoder/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/uuid-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/jwt-decoder/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/user-agent-parser/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/ics-calendar-generator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/image-compressor/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/json-validator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/timestamp-converter/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/ip-converter/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/roi-calculator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/roas-calculator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/cac-calculator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/ad-metrics-calculator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/email-roi-calculator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /tools/marketing-budget-calculator/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/robots-txt-for-search-and-ai-crawlers/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/website-launch-seo-checklist/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/how-to-block-gptbot/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/llms-txt-guide/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/appear-in-chatgpt-search/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/check-ai-crawler-access/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/noindex-vs-robots-txt/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/why-is-my-site-not-indexed/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/utm-naming-conventions/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/schema-markup-for-ai-search/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/screaming-frog-alternative/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/meta-description-length-2026/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/internal-linking/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/image-seo/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/core-web-vitals/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/open-graph-image-size-2026/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/htaccess-301-redirect/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/title-tag-length-2026/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/url-slug-best-practices/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/rel-canonical-tag/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/hreflang-basics/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/xml-sitemap-best-practices/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/test-structured-data/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

### `skip-link` — /blog/http-status-codes-seo/

**Finding:** No skip link

**Fix:** A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.

## Pages with findings (80 of 80)

| Page | Score | Blk | Maj | Min | Rules |
|---|---|---|---|---|---|
| /blog/ | 99 | 0 | 0 | 1 | heading-order, skip-link |
| /tools/og-image-tester/ | 99 | 0 | 0 | 1 | img-dimensions, skip-link |
| / | 100 | 0 | 0 | 0 | skip-link |
| /seo-tools/ | 100 | 0 | 0 | 0 | skip-link |
| /ai-search-tools/ | 100 | 0 | 0 | 0 | skip-link |
| /content-social-tools/ | 100 | 0 | 0 | 0 | skip-link |
| /web-utility-tools/ | 100 | 0 | 0 | 0 | skip-link |
| /marketing-tools/ | 100 | 0 | 0 | 0 | skip-link |
| /about/ | 100 | 0 | 0 | 0 | skip-link |
| /contact/ | 100 | 0 | 0 | 0 | skip-link |
| /privacy-policy/ | 100 | 0 | 0 | 0 | skip-link |
| /terms/ | 100 | 0 | 0 | 0 | skip-link |
| /disclaimer/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/meta-tag-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/open-graph-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/twitter-card-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/canonical-tag-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/hreflang-tag-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/schema-markup-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/serp-preview-tool/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/meta-description-checker/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/web-crawler-audit/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/seo-score-checker/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/hreflang-checker/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/robots-txt-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/robots-txt-tester/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/ai-crawler-blocker/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/llms-txt-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/url-slug-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/utm-link-builder/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/keyword-density-checker/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/hashtag-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/case-converter/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/duplicate-line-remover/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/lorem-ipsum-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/reading-time-calculator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/htaccess-redirect-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/sitemap-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/sitemap-validator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/password-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/base64-encoder-decoder/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/url-encoder-decoder/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/uuid-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/jwt-decoder/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/user-agent-parser/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/ics-calendar-generator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/image-compressor/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/json-validator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/timestamp-converter/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/ip-converter/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/roi-calculator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/roas-calculator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/cac-calculator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/ad-metrics-calculator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/email-roi-calculator/ | 100 | 0 | 0 | 0 | skip-link |
| /tools/marketing-budget-calculator/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/robots-txt-for-search-and-ai-crawlers/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/website-launch-seo-checklist/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/how-to-block-gptbot/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/llms-txt-guide/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/appear-in-chatgpt-search/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/check-ai-crawler-access/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/noindex-vs-robots-txt/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/why-is-my-site-not-indexed/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/utm-naming-conventions/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/schema-markup-for-ai-search/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/screaming-frog-alternative/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/meta-description-length-2026/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/internal-linking/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/image-seo/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/core-web-vitals/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/open-graph-image-size-2026/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/htaccess-301-redirect/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/title-tag-length-2026/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/url-slug-best-practices/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/rel-canonical-tag/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/hreflang-basics/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/xml-sitemap-best-practices/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/test-structured-data/ | 100 | 0 | 0 | 0 | skip-link |
| /blog/http-status-codes-seo/ | 100 | 0 | 0 | 0 | skip-link |

---

Generated by `npm run audit`. Thresholds live in `audit/rules/catalog.json`;
the rule set and its fixes are in `audit/rules/`.

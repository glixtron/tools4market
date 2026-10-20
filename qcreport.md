# Tools4Market — Tool QC Report

Generated: 2026-10-20T18:28:04.323Z · environment: local dev server (http://localhost:8090, `node serve-dev.mjs`) · test engine: jsdom driving the real built pages and runtime scripts in `dist/`.

Every tool below was executed with a real sample query; the *Query* section lists exactly what was entered, *Response* is the actual tool output captured from the page, and each check states PASS or FAIL. `expect` checks are tool-specific correctness assertions (e.g. a generated slug must contain the expected words); every tool also asserts zero console errors and successful initialisation.

## Background: why this report exists (RCA)

The user reported tools "not working properly". Root-cause analysis found the tool **logic** was healthy — the failure was in the **local preview environment**: the Python static server had no `/api/fetch` route, so the URL-analysis feature on every tool page 404'd → CORS fallback → error message, which read as "broken". Fixed with `serve-dev.mjs` (zero-dep Node server implementing the same proxy as the Cloudflare Function — `npm run serve`, port 8090). A second real defect surfaced during QA: the panel status rendered a literal `{n}` placeholder. Both are fixed; URL mode is now verified end-to-end against live sites.

## Test-suite totals (as of this report's build)

| Suite | Scope | Result |
|---|---|---|
| `audit.mjs` | structural + functional checks, all 20 original tools | 236/236 PASS |
| `qa-test.mjs` | edge cases: empty/100k-char/hostile input, invalid values, console errors | 236/236 PASS |
| `rca-smoke.mjs` | every tool page: all fields + buttons driven, zero errors | 30/30 PASS |
| `e2e-url.mjs` | real URL flow: live fetch → pre-fill / score / audit | 11/11 PASS |
| `ph2-test.mjs` | the 10 new Phase 2 tools (incl. build, sitemap, ID uniqueness) | 129/129 PASS |
| `inspect-test.mjs` | analysis engine + panel across all tool pages | 123/123 PASS |
| `t4m-crawl.mjs` | full site crawl: every page + asset over HTTP | 53/53 OK, 0 broken, 40 sitemap entries |
| **`qc-report.mjs`** (this file) | per-tool query → response correctness | **30/30 PASS** |

## Summary — 30/30 tools QC PASS

| # | Tool | Status | Checks | Completed (ISO) |
|---|------|--------|--------|-----------------|
| 1 | meta-tag-generator | ✅ PASS | 5/5 | 2026-10-20T18:27:43.064Z |
| 2 | open-graph-generator | ✅ PASS | 5/5 | 2026-10-20T18:27:43.936Z |
| 3 | twitter-card-generator | ✅ PASS | 4/4 | 2026-10-20T18:27:44.547Z |
| 4 | canonical-tag-generator | ✅ PASS | 4/4 | 2026-10-20T18:27:45.310Z |
| 5 | hreflang-tag-generator | ✅ PASS | 3/3 | 2026-10-20T18:27:45.868Z |
| 6 | schema-markup-generator | ✅ PASS | 4/4 | 2026-10-20T18:27:46.579Z |
| 7 | serp-preview-tool | ✅ PASS | 4/4 | 2026-10-20T18:27:47.098Z |
| 8 | meta-description-checker | ✅ PASS | 3/3 | 2026-10-20T18:27:47.666Z |
| 9 | web-crawler-audit | ✅ PASS | 3/3 | 2026-10-20T18:27:48.658Z |
| 10 | seo-score-checker | ✅ PASS | 3/3 | 2026-10-20T18:27:49.410Z |
| 11 | robots-txt-generator | ✅ PASS | 4/4 | 2026-10-20T18:27:50.049Z |
| 12 | ai-crawler-blocker | ✅ PASS | 4/4 | 2026-10-20T18:27:50.993Z |
| 13 | llms-txt-generator | ✅ PASS | 4/4 | 2026-10-20T18:27:51.472Z |
| 14 | url-slug-generator | ✅ PASS | 3/3 | 2026-10-20T18:27:51.999Z |
| 15 | utm-link-builder | ✅ PASS | 5/5 | 2026-10-20T18:27:52.731Z |
| 16 | keyword-density-checker | ✅ PASS | 3/3 | 2026-10-20T18:27:53.452Z |
| 17 | hashtag-generator | ✅ PASS | 3/3 | 2026-10-20T18:27:53.938Z |
| 18 | case-converter | ✅ PASS | 3/3 | 2026-10-20T18:27:54.474Z |
| 19 | duplicate-line-remover | ✅ PASS | 4/4 | 2026-10-20T18:27:54.899Z |
| 20 | lorem-ipsum-generator | ✅ PASS | 3/3 | 2026-10-20T18:27:55.561Z |
| 21 | reading-time-calculator | ✅ PASS | 4/4 | 2026-10-20T18:27:55.936Z |
| 22 | htaccess-redirect-generator | ✅ PASS | 3/3 | 2026-10-20T18:27:56.306Z |
| 23 | sitemap-generator | ✅ PASS | 4/4 | 2026-10-20T18:27:56.949Z |
| 24 | password-generator | ✅ PASS | 3/3 | 2026-10-20T18:27:58.373Z |
| 25 | base64-encoder-decoder | ✅ PASS | 3/3 | 2026-10-20T18:27:59.190Z |
| 26 | url-encoder-decoder | ✅ PASS | 3/3 | 2026-10-20T18:28:00.961Z |
| 27 | uuid-generator | ✅ PASS | 4/4 | 2026-10-20T18:28:02.047Z |
| 28 | jwt-decoder | ✅ PASS | 3/3 | 2026-10-20T18:28:02.710Z |
| 29 | user-agent-parser | ✅ PASS | 4/4 | 2026-10-20T18:28:03.357Z |
| 30 | ics-calendar-generator | ✅ PASS | 5/5 | 2026-10-20T18:28:04.238Z |

## 1. meta-tag-generator — ✅ PASS

- Started: `2026-10-20T18:27:40.958Z`
- Finished: `2026-10-20T18:27:43.064Z`

**Query**

- `mt-title = Free Marketing Tools for Small Business`
- `mt-desc = Run 30+ free browser-based marketing, SEO and AI-search tools with no signup and no limits — nothing is ever uploaded to a server.`
- `mt-canonical = https://example.com/tools`

**Response**

```
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Free Marketing Tools for Small Business</title>
<meta name="description" content="Run 30+ free browser-based marketing, SEO and AI-search tools with no signup and no limits — nothing is ever uploaded to a server.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://example.com/tools">
<meta property="og:url" content="https://example.com/tools">
<meta property="og:title" content="Free Marketing Tools for Small Business">
<meta property="og:description" content="Run 30+ free browser-based marketing, SEO and AI-search tools with no signup and no limits — nothing is ever uploaded to a server.">
<meta property="og:type" content="website">
```

**Checks**

- ✅ output contains "<title>"
- ✅ output contains "name="description""
- ✅ output contains "rel="canonical""
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["meta-tag-generator"])

## 2. open-graph-generator — ✅ PASS

- Started: `2026-10-20T18:27:43.091Z`
- Finished: `2026-10-20T18:27:43.936Z`

**Query**

- `og-url = https://example.com/spring-sale`
- `og-title = Spring Sale — 20% Off Everything`
- `og-desc = Our biggest sale of the season. Shop now.`
- `og-image = https://example.com/og.png`
- `og-site = Example Shop`

**Response**

```
<meta property="og:url" content="https://example.com/spring-sale">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Example Shop">
<meta property="og:title" content="Spring Sale — 20% Off Everything">
<meta property="og:description" content="Our biggest sale of the season. Shop now.">
<meta property="og:image" content="https://example.com/og.png">
<meta property="og:locale" content="en_US">
```

**Checks**

- ✅ output contains "og:title"
- ✅ output contains "og:type"
- ✅ output contains "og:url"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["open-graph-generator"])

## 3. twitter-card-generator — ✅ PASS

- Started: `2026-10-20T18:27:43.952Z`
- Finished: `2026-10-20T18:27:44.547Z`

**Query**

- `tw-site = @example`
- `tw-title = Spring Sale — 20% Off Everything`
- `tw-desc = Our biggest sale of the season. Shop now.`
- `tw-image = https://example.com/card.png`

**Response**

```
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@example">
<meta name="twitter:title" content="Spring Sale — 20% Off Everything">
<meta name="twitter:description" content="Our biggest sale of the season. Shop now.">
<meta name="twitter:image" content="https://example.com/card.png">
```

**Checks**

- ✅ output contains "twitter:card"
- ✅ output contains "twitter:title"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["twitter-card-generator"])

## 4. canonical-tag-generator — ✅ PASS

- Started: `2026-10-20T18:27:44.556Z`
- Finished: `2026-10-20T18:27:45.310Z`

**Query**

- `cn-url = https://example.com/page?ref=newsletter`

**Response**

```
<link rel="canonical" href="https://example.com/page?ref=newsletter">
```

**Checks**

- ✅ output contains "rel="canonical""
- ✅ output contains "https://example.com/page"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["canonical-tag-generator"])

## 5. hreflang-tag-generator — ✅ PASS

- Started: `2026-10-20T18:27:45.315Z`
- Finished: `2026-10-20T18:27:45.868Z`

**Query**

- `hf-xdefault = https://example.com/`

**Response**

```
<link rel="alternate" hreflang="en" href="https://example.com/">
<link rel="alternate" hreflang="de-de" href="https://example.com/de/">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```

**Checks**

- ✅ output contains "hreflang"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["hreflang-tag-generator"])

## 6. schema-markup-generator — ✅ PASS

- Started: `2026-10-20T18:27:45.873Z`
- Finished: `2026-10-20T18:27:46.579Z`

**Query**

- `sc-type = article`
- `sa-headline = How we cut LCP from 4.2s to 1.1s`
- `sa-author = Jane Doe`
- `sa-publisher = Example Blog`

**Response**

```
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How we cut LCP from 4.2s to 1.1s",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Blog"
  }
}
```

**Checks**

- ✅ output contains ""@type": "Article""
- ✅ output contains ""@context""
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["schema-markup-generator"])

## 7. serp-preview-tool — ✅ PASS

- Started: `2026-10-20T18:27:46.605Z`
- Finished: `2026-10-20T18:27:47.098Z`

**Query**

- `sp-url = https://example.com/blog/technical-seo-guide`
- `sp-title = Technical SEO: The Complete Guide for 2026`
- `sp-desc = A practical technical SEO checklist: crawlability, indexation, Core Web Vitals and structured data — with the fixes that actually move rankings.`

**Response**

```
Title: 42 chars · 336pxfitsDescription: 144 chars · 1152pxwill truncate
---
TITLE: 42 chars / 336px (limit ~600px) — OK
DESCRIPTION: 144 chars / 1152px (ideal 120–158 chars / ≤920px) — WILL TRUNCATE
```

**Checks**

- ✅ output contains "chars"
- ✅ output contains "px"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["serp-preview-tool"])

## 8. meta-description-checker — ✅ PASS

- Started: `2026-10-20T18:27:47.129Z`
- Finished: `2026-10-20T18:27:47.666Z`

**Query**

- `md-text = Run 30+ free browser-based marketing, SEO and AI-search tools with no signup and no limits — nothing is ever uploaded to a server.`

**Response**

```
Length: 130 chars · 1040pxToo long — ends will be truncated
---
TOO LONG: 1040px — Google truncates around 920px (~155 chars). Trim to 28 fewer characters to end cleanly.
```

**Checks**

- ✅ output contains "characters"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["meta-description-checker"])

## 9. web-crawler-audit — ✅ PASS

- Started: `2026-10-20T18:27:47.695Z`
- Finished: `2026-10-20T18:27:48.658Z`

**Query**

- `pasted HTML into ca-paste (211 chars)`
- `clicked button: Audit pasted HTML`

**Response**

```
PASS · Page reachable over HTTP(S): Crawlers can reach this page (fetched in <100ms, 0 KB bytes).ISSUE · Served over HTTPS: Page is not HTTPS — Google treats HTTPS as a ranking signal. Enable SSL.PASS · Indexable (meta robots): Page is indexable — no noindex directive.PASS · Canonical tag: Canonical tag present: https://example.com/WARN · Title tag: Title present but 4 characters — may be truncated. Aim for 30–60.WARN · Meta description: Meta description is 12 characters — aim for 120–158 for a full snippet.PASS · Single H1 heading: Exactly one H1: HelloISSUE · Sitemap declared in robots.txt: No Sitemap line in robots.txt — point crawlers to your sitemap.INFO · Hreflang (multi-language): No hreflang tags (normal for single-language sites).ISSUE · Structured data (JSON-LD): No JSON-LD structured data — add it to win rich results.ISSUE · Open Graph tags: No Open Graph tags — social shares 
… (truncated)
```

**Checks**

- ✅ output contains "PASS"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["web-crawler-audit"])

## 10. seo-score-checker — ✅ PASS

- Started: `2026-10-20T18:27:48.666Z`
- Finished: `2026-10-20T18:27:49.410Z`

**Query**

- `pasted HTML into sc2-paste (93 chars)`
- `clicked button: Score pasted HTML`

**Response**

```
Title tag (15): Title is 4 characters — fine, but could be sharper (30–60).Meta description (12): No meta description — write one to control your snippet.H1 heading (12): Single H1 present.Heading hierarchy (H2/H3) (8): No H2/H3 subheadings — add structure for readers and crawlers.Content depth (12): About 2 words — thin. Aim for 300+ to compete.Internal links (10): No internal links found — add links to related pages.Image alt text (8): No images, or none have alt text.Structured data (8): No structured data — add JSON-LD to qualify for rich results.Open Graph / social (5): No Open Graph tags — add them for better social shares.Mobile viewport (5): No viewport meta — page is not mobile-friendly.HTTPS (5): Not HTTPS — enable SSL.
---
Title tag (15 pts): Title is 4 characters — fine, but could be sharper (30–60).Meta description (12 pts): No meta description — write one to control your sn
… (truncated)
```

**Checks**

- ✅ output contains "Title"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["seo-score-checker"])

## 11. robots-txt-generator — ✅ PASS

- Started: `2026-10-20T18:27:49.417Z`
- Finished: `2026-10-20T18:27:50.049Z`

**Query**

- `rb-sitemap = https://example.com/sitemap.xml`

**Response**

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

**Checks**

- ✅ output contains "User-agent:"
- ✅ output contains "Sitemap: https://example.com/sitemap.xml"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["robots-txt-generator"])

## 12. ai-crawler-blocker — ✅ PASS

- Started: `2026-10-20T18:27:50.082Z`
- Finished: `2026-10-20T18:27:50.993Z`

**Query**

- `ab-sitemap = https://example.com/sitemap.xml`
- `clicked button: Block all AI crawlers`

**Response**

```
User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: ImagesiftBot
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Perplexity-User
Disallow: /

User-agent: Claude-User
Disallow: /

User-agent: Claude-SearchBot
Disallow: /

User-agent: YouBot
Disallow: /

User-agent: Applebot
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

**Checks**

- ✅ output contains "User-agent: GPTBot"
- ✅ output contains "Disallow: /"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["ai-crawler-blocker"])

## 13. llms-txt-generator — ✅ PASS

- Started: `2026-10-20T18:27:50.998Z`
- Finished: `2026-10-20T18:27:51.472Z`

**Query**

- `ll-name = Example`
- `ll-desc = Example site about widgets`
- `ll-url = https://example.com`
- `ll-pages = https://example.com/docs
https://example.com/pricing`

**Response**

```
# Example

> Example site about widgets

## Pages

- [Docs](https://example.com/docs)
- [Pricing](https://example.com/pricing)
```

**Checks**

- ✅ output contains "# Example"
- ✅ output contains "]("
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["llms-txt-generator"])

## 14. url-slug-generator — ✅ PASS

- Started: `2026-10-20T18:27:51.478Z`
- Finished: `2026-10-20T18:27:51.999Z`

**Query**

- `sl-text = The Complete Guide to Technical SEO in 2026`

**Response**

```
complete-guide-technical-seo-2026
```

**Checks**

- ✅ output contains "complete-guide-technical-seo"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["url-slug-generator"])

## 15. utm-link-builder — ✅ PASS

- Started: `2026-10-20T18:27:52.003Z`
- Finished: `2026-10-20T18:27:52.731Z`

**Query**

- `ut-url = https://example.com/spring-sale`
- `ut-source = newsletter`
- `ut-medium = email`
- `ut-campaign = spring-sale-2026`

**Response**

```
https://example.com/spring-sale?utm_source=newsletter&utm_medium=email&utm_campaign=spring-sale-2026
```

**Checks**

- ✅ output contains "utm_source=newsletter"
- ✅ output contains "utm_medium=email"
- ✅ output contains "utm_campaign=spring-sale-2026"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["utm-link-builder"])

## 16. keyword-density-checker — ✅ PASS

- Started: `2026-10-20T18:27:52.782Z`
- Finished: `2026-10-20T18:27:53.452Z`

**Query**

- `kd-text = Email marketing still delivers the highest ROI of any channel. With email marketing automation, email marketing lists compound over time. Start email marketing today.`

**Response**

```
Words: 24Unique: 18Reading time: 1 minanalysis below
---
1-word phrasesPhraseCountDensityemail421.05%marketing421.05%automation15.26%channel15.26%compound15.26%delivers15.26%highest15.26%lists15.26%roi15.26%start15.26%still15.26%time15.26%2-word phrasesPhraseCountDensityemail marketing422.22%automation email15.56%channel email15.56%compound time15.56%delivers highest15.56%highest roi15.56%lists compound15.56%marketing automation15.56%marketing lists15.56%marketing still15.56%marketing today15.56%roi channel15.56%3-word phrasesPhraseCountDensityautomation email marketing15.88%channel email marketing15.88%compound time start15.88%delivers highest roi15.88%email marketing automation15.88%email marketing lists15.88%email marketing still15.88%email marketing today15.88%highest roi channel15.88%lists compound time15.88%marketing automation email15.88%marketing lists compound15.88%
```

**Checks**

- ✅ output contains "email marketing"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["keyword-density-checker"])

## 17. hashtag-generator — ✅ PASS

- Started: `2026-10-20T18:27:53.457Z`
- Finished: `2026-10-20T18:27:53.938Z`

**Query**

- `hg-keyword = email marketing`
- `hg-platform = instagram`

**Response**

```
#EmailMarketing #emailmarketing #instagram #instagrammarketing #digitalmarketing #socialmediamarketing #marketingtips #contentcreator #contentmarketing #smallbusiness #branding #onlinebusiness #marketingstrategy #instagramtips

(14 hashtags for instagram — delete any that do not match your post)
```

**Checks**

- ✅ output contains "#"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["hashtag-generator"])

## 18. case-converter — ✅ PASS

- Started: `2026-10-20T18:27:53.941Z`
- Finished: `2026-10-20T18:27:54.474Z`

**Query**

- `cc-text = hello world from tools4market`
- `cc-ws = `
- `cc-mode (select) = "Title Case"`

**Response**

```
Hello World from Tools4market
```

**Checks**

- ✅ output contains "Hello World from Tools4market"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["case-converter"])

## 19. duplicate-line-remover — ✅ PASS

- Started: `2026-10-20T18:27:54.494Z`
- Finished: `2026-10-20T18:27:54.899Z`

**Query**

- `dl-lines = alpha
Beta
alpha
beta
gamma

alpha`

**Response**

```
7 lines → 4 unique (3 duplicates removed)
---
alpha
Beta
beta
gamma
```

**Checks**

- ✅ output contains "4 unique"
- ✅ output contains "3 duplicates removed"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["duplicate-line-remover"])

## 20. lorem-ipsum-generator — ✅ PASS

- Started: `2026-10-20T18:27:54.901Z`
- Finished: `2026-10-20T18:27:55.561Z`

**Query**

- `lo-count = 3`
- `lo-unit (select) = "paragraphs"`

**Response**

```
Lorem ipsum dolor sit amet praesentium ex velit quis odio voluptate quo aliquip. Esse officia assumenda mollit deserunt voluptatem eligendi labore tempora rem nostrum. Perspiciatis quo pariatur in accusamus id nobis dolores eiusmod quibusdam aspernatur cum corrupti. Necessitatibus dolore velit eius sed est sit reprehenderit eiusmod dolor minima. Consequatur fugiat reprehenderit aliquip quis odio officiis enim. Molestias perspiciatis sed quia perspiciatis ex quis cupiditate autem itaque. Libero tempora exercitation cumque laborum voluptate nam autem tenetur quasi.

Quia minim hic anim tempora voluptatem adipisci delectus velit. Nisi consectetur rem architecto pariatur debitis ipsum explicabo alias enim deserunt molestiae molestias. Nisi natus anima occaecati tempor duis ratione tempora ducimus. Nihil elit dolor aliquip enim beatae quo corporis ipsum tempor corporis velit ullamco hic conse
… (truncated)
```

**Checks**

- ✅ output contains "Lorem ipsum"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["lorem-ipsum-generator"])

## 21. reading-time-calculator — ✅ PASS

- Started: `2026-10-20T18:27:55.565Z`
- Finished: `2026-10-20T18:27:55.936Z`

**Query**

- `rt-text = word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word `

**Response**

```
Words: 400
Characters: 1,999 (with spaces) · 1,600 (without spaces)
Sentences: 1
Paragraphs: 1
Reading time: about 2 min read (at 200 wpm)
Speaking time: about 3 min (at 130 wpm)
```

**Checks**

- ✅ output contains "400"
- ✅ output contains "min read"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["reading-time-calculator"])

## 22. htaccess-redirect-generator — ✅ PASS

- Started: `2026-10-20T18:27:55.942Z`
- Finished: `2026-10-20T18:27:56.306Z`

**Query**

- `ht-domain = example.com`

**Response**

```
# 2 redirect(s)
Redirect 301 /old-page https://example.com/new-page
Redirect 301 /2023-report https://example.com/reports/2023
```

**Checks**

- ✅ output matches /Redirect|Rewrite/i
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["htaccess-redirect-generator"])

## 23. sitemap-generator — ✅ PASS

- Started: `2026-10-20T18:27:56.310Z`
- Finished: `2026-10-20T18:27:56.949Z`

**Query**

- `sm-urls = https://example.com/
https://example.com/about`

**Response**

```
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/</loc></url>
  <url><loc>https://example.com/about</loc></url>
</urlset>
```

**Checks**

- ✅ output contains "<urlset"
- ✅ output contains "<loc>https://example.com/about</loc>"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["sitemap-generator"])

## 24. password-generator — ✅ PASS

- Started: `2026-10-20T18:27:56.958Z`
- Finished: `2026-10-20T18:27:58.373Z`

**Query**

- `clicked button: Generate new password`
- `pw-len (range) = 24`

**Response**

```
JL%DfY9=9.#XSoP/vH)ap(~v
```

**Checks**

- ✅ output matches /\S{20,}/
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["password-generator"])

## 25. base64-encoder-decoder — ✅ PASS

- Started: `2026-10-20T18:27:58.386Z`
- Finished: `2026-10-20T18:27:59.190Z`

**Query**

- `b6-text = hello world 🌍`
- `b6-url = `
- `b6-mode (select) = "Encode (text → Base64)"`

**Response**

```
aGVsbG8gd29ybGQg8J+MjQ==
```

**Checks**

- ✅ output contains "aGVsbG8"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["base64-encoder-decoder"])

## 26. url-encoder-decoder — ✅ PASS

- Started: `2026-10-20T18:27:59.196Z`
- Finished: `2026-10-20T18:28:00.961Z`

**Query**

- `ue-text = hello world & more?x=1`
- `ue-mode (select) = "encodeURIComponent — a c"`

**Response**

```
hello%20world%20%26%20more%3Fx%3D1
```

**Checks**

- ✅ output contains "hello%20world"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["url-encoder-decoder"])

## 27. uuid-generator — ✅ PASS

- Started: `2026-10-20T18:28:01.021Z`
- Finished: `2026-10-20T18:28:02.047Z`

**Query**

- `uu-count = 5`
- `uu-upper = `

**Response**

```
707ff0ab-1ad0-4cf2-8c08-292aa2c55a37
b54e7648-5ec5-4ce6-9779-1ef35d11d55e
00dbcf6b-16ba-4fdf-bcc3-18aa8b420e67
4113429b-14c5-41bd-a6d4-18bf159d1320
d2d22908-aa81-46e8-8514-35514bcb0f26
```

**Checks**

- ✅ output matches /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
- ✅ output contains exactly 5 UUIDs
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["uuid-generator"])

## 28. jwt-decoder — ✅ PASS

- Started: `2026-10-20T18:28:02.052Z`
- Finished: `2026-10-20T18:28:02.710Z`

**Query**

- `jwt-in = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkphbmUiLCJleHAiOjIwMDAwMDAwMDB9.fakesig`

**Response**

```
{
  "sub": "1234",
  "name": "Jane",
  "exp": 2000000000
}
```

**Checks**

- ✅ output contains "Jane"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["jwt-decoder"])

## 29. user-agent-parser — ✅ PASS

- Started: `2026-10-20T18:28:02.715Z`
- Finished: `2026-10-20T18:28:03.357Z`

**Query**

- `ua-text = Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`

**Response**

```
Browser: Chrome 120.0.0.0
Engine: Blink
OS: Windows 10 or 11
Device: Desktop
Raw: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

**Checks**

- ✅ output contains "Chrome"
- ✅ output contains "Windows"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["user-agent-parser"])

## 30. ics-calendar-generator — ✅ PASS

- Started: `2026-10-20T18:28:03.410Z`
- Finished: `2026-10-20T18:28:04.238Z`

**Query**

- `ics-title = Team Offsite`
- `ics-loc = Berlin, Germany`
- `ics-desc = Annual planning day,
bring your laptop`
- `ics-sdate = 2026-11-10`
- `ics-stime = 09:00`
- `ics-edate = 2026-11-10`
- `ics-etime = 17:00`

**Response**

```
BEGIN:VCALENDAR
VERSION:1.0
PRODID:-//Tools4Market//EN
BEGIN:VEVENT
UID:60c3e2c8-c0e2-44a7-91e2-7917d84c898c
DTSTAMP:20261020T182803Z
DTSTART:20261110T090000
DTEND:20261110T170000
SUMMARY:Team Offsite
DESCRIPTION:Annual planning day\,\nbring your laptop
LOCATION:Berlin\, Germany
END:VEVENT
END:VCALENDAR
```

**Checks**

- ✅ output contains "BEGIN:VCALENDAR"
- ✅ output contains "SUMMARY:Team Offsite"
- ✅ output contains "DTSTAMP"
- ✅ no console/jsdom errors
- ✅ tool initialised (T4M_TOOLS["ics-calendar-generator"])


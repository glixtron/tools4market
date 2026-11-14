# GSC diagnosis and 30-day recovery plan — 14 Nov 2026

Sources: `tools4market.online-Coverage-2026-11-14.xlsx`, `...-Performance-on-Search-2026-11-14.xlsx`,
`...-Crawl-stats-2026-11-14.xlsx`, compared against the 30 Oct and 10 Nov exports of the same three reports.

## 1. What the exports show

### Indexing collapsed on 7 November

| Date | Indexed | Not indexed |
| --- | --- | --- |
| 24 Oct – 6 Nov | 84 | 68 |
| **7 Nov** | **27** | **125** |
| Last charted day (9 Nov) | 27 | 125 |

Fifty-seven URLs left the index in a single day. Nothing in the account, the HTML or the server changed
in a way that *blocks* Google — see §2.

### Impressions stopped at the same moment

| Day | Impressions | Avg position |
| --- | --- | --- |
| 4 Nov | 154 | 71.3 |
| 5 Nov | 144 | 69.9 |
| 6 Nov | 153 | 72.6 |
| 7 Nov | 160 | 78.9 |
| **8 Nov** | **34** | 72.6 |
| 9–11 Nov | **1 / 1 / 1** | 94, then 1.0 |

The 1-impression days at position 1.0 are a single branded query. Everything else stopped being served.

### The 125 not-indexed URLs, and how they moved

| Reason | 10 Nov export | 14 Nov export |
| --- | --- | --- |
| Page with redirect | 38 | 33 |
| Alternative page with proper canonical tag | 25 | 25 |
| Not found (404) | 1 | 1 |
| **Crawled – currently not indexed** | **4** | **66** |

Between the two exports Google recrawled roughly 62 URLs and declined to index them. That is a
*quality and crawl-budget* verdict on the content, not a fetch failure: a blocked or broken page lands
in "Blocked" or "404", not here.

The redirect and alternative-canonical families are the http / www / trailing-slash duplicates. They
were fixed on 10 Nov (`da6426a`, permanent 301s in the worker) and the redirect count is already
draining 38 → 33. The 25 alternative-canonical URLs were discovered before that fix and should follow.

### Crawling is healthy

- 1,594 requests over the exported window, 91.1% HTTP 200, 7.3% 301, 0.38% 404.
- Response time 78–257 ms. 89.6% of requests are "Refresh", 10.4% "Discovery".
- Hosts table: `tools4market.online` *No problems*; `www` only 4 requests (redirects).
- HTML 47.9% / JS 22.8% of fetches — the runtime bundles are heavy relative to the HTML, worth watching
  but not the cause of a 57-URL drop.

### The search demand was already real, just shallow

Since the property's first data (19 Oct): 28 clicks, 2,703 impressions, average position ~60–79.

- Homepage: 18 clicks from 47 impressions at position 2.1 — brand and navigational demand.
- United States: 1,521 impressions, **0 clicks**, average position 62.9.
- India: 28 clicks from 135 impressions — nearly all of the click total.

Top pages by impressions (position):

| Page | Impressions | Position |
| --- | --- | --- |
| `/blog/core-web-vitals/` | 223 | 24.4 |
| `/blog/test-structured-data/` | 205 | 83.0 |
| `/tools/serp-preview-tool/` | 186 | 63.0 |
| `/blog/rel-canonical-tag/` | 175 | 74.5 |
| `/blog/title-tag-length-2026/` | 166 | 71.6 |
| `/tools/canonical-tag-generator/` | 134 | 36.5 |
| `/tools/marketing-budget-calculator/` | 132 | 83.7 |
| `/tools/keyword-density-checker/` | 213 | 76.9 |

Query positions across 436 queries: 4 in the top 3, 14 at 4–10, 26 at 11–20, 33 at 21–30, 42 at 31–50,
317 at 51+.

The seven queries already inside striking distance (11–30, ten or more impressions):

| Query | Impressions | Position |
| --- | --- | --- |
| what is cls in core web vitals | 59 | 16.9 |
| hreflang generator | 45 | 23.2 |
| core web vitals types | 42 | 18.2 |
| 301 redirect htaccess | 24 | 18.6 |
| htaccess 301 redirect | 19 | 18.3 |
| image tag seo | 13 | 26.1 |
| .htaccess 301 redirect | 10 | 17.2 |

## 2. What it is not

Checked against the live site on 13–14 Nov:

- http → https and www → apex both answer 301; canonical tags are self-referencing and absolute.
- Every URL in the three live sitemaps (59 tools, 13 pages, 24 blog) returned 200 to a Googlebot user agent.
- No `noindex`, no `X-Robots-Tag`, no robots.txt block for Googlebot or the asset paths it needs.
- robots.txt is served, sitemaps parse, `llms.txt` and the feed are intact.
- Tool pages are not near-duplicates of each other (Jaccard similarity ≈ 0.05) and run 918–987 words.

So: no technical block, no fetch errors, no redirect chain. The only negative signals are the volume of
pages Google has crawled and declined, and the fact that a domain registered this year has little
external authority behind it.

## 3. Most likely cause

The drop lands on the day after the 6 Nov site-wide redesign (T+1 is the normal lag for a recrawl pass).
That deploy changed the template, CSS, markup and hero on all ~100 URLs at once. For a young domain with
modest authority, a site-wide change is a quality re-evaluation trigger: Google recrawls, re-scores and,
where pages do not clear the bar, moves them to *Crawled – currently not indexed* rather than deleting them.
That is exactly the pattern in the table above — 62 pages recrawled, 66 declined, none blocked.

This is a hypothesis consistent with the data, not a Google-confirmed cause. Google does not publish
per-site quality thresholds, and the Page indexing report deliberately groups outcomes without a reason
per URL.

What follows from it is the same either way: fewer, stronger pages; clean duplicate signals; visible
internal linking from pages that still rank; and time.

## 4. What changed in the code today

Each of these targets something the exports specifically show.

1. **`/tools/rich-results-tester/`** — new tool. The site already receives ~100 impressions for
   "rich snippet testing tool", "rich snippets testing tool", "rich snippet checker", "check rich snippets",
   "google schema checker" and "google schema test" at positions 76–89, with no page aimed at them.
   It validates pasted JSON-LD against Google's required and recommended properties per schema type,
   runs locally, and is linked from the schema generator, the SEO category and the structured-data guide.
2. **Core Web Vitals guide** (`/blog/core-web-vitals/`) — the closest query to page 1 on the whole site
   (position 16.9). Added a threshold table (LCP / CLS / INP: good, needs work, poor) so the page answers
   "what is CLS in core web vitals" and "core web vitals types" in the first screen, not the fourth.
3. **Keyword density checker** — added the "word density checker" and "kw density" phrasing to the copy
   and keywords, plus a FAQ on the synonym. 25 impressions at position 76.8 with nothing on-page saying it.
4. **QR code generator** — "barcode" phrasing and an honest FAQ about 2D vs 1D codes. ~30 impressions
   for "qr barcode generator" and "qr tag generator" at positions 59–92.
5. **Marketing budget calculator bug** — the KPI strip called a helper that read variables from the wrong
   scope, so every update threw a `ReferenceError` after the text result. The chart never rendered for
   anyone. Fixed; the tiles and bar chart now appear (verified in a real browser).
6. **`scripts/keyword-research.mjs`** — repeatable keyword workflow. Seeds from the tool and guide focuses,
   expands through Google's public suggest endpoint, then matches every phrase against the site and joins
   it with a GSC Queries export. Output: `docs/seo/keyword-map-<date>.csv`.

## 5. Keyword expansion: what the map says

`docs/seo/keyword-map-2026-11-14.csv` — 1,152 phrases, 846 covered, **306 gaps**, 103 of them with
observed impressions.

How to re-run after each GSC export:

```
node scripts/keyword-research.mjs --queries tools4market.online-Queries.csv
```

Largest uncovered demand (impressions, position):

| Phrase | Impressions | Position | Covered by |
| --- | --- | --- | --- |
| rich snippet testing tool | 54 | 83.6 | new tester (built today) |
| rich snippets testing tool | 17 | 85.2 | new tester |
| check rich snippets | 14 | 89.4 | new tester |
| how to get found on chatgpt | 11 | 88.6 | no page — candidate guide |
| google schema checker | 10 | 75.9 | new tester |
| qr barcode generator | 10 | 58.9 | QR generator (synonym added) |
| technical checklist for publish-ready seo html | 10 | 45.5 | launch checklist guide — tighten |
| kw density checker | 9 | 83.4 | density checker (synonym added) |
| google search central url structure hyphens underscores | 8 | 49.5 | no page — candidate guide |
| meta desc checker | 7 | 70.4 | meta description checker (alias worth adding) |

Rules the map encodes: a gap with impressions beats a gap without; a phrase already at position 11–30
beats one at 80; a phrase that names a tool we already have beats a new page.

## 6. Thirty-day recovery plan

### Owner actions in Search Console (only you can do these)

1. **Manual actions** and **Security issues** tabs — confirm both are clean. If either shows anything,
   send me a screenshot before touching code.
2. **Page indexing → Crawled – currently not indexed → Export** — send the 66-URL CSV. Whether each URL
   should be merged, deepened or removed is a decision that needs the list, and it is the single most
   useful input for the next content pass.
3. **URL Inspection → Request indexing** for the ten pages with the most impressions:
   `/blog/core-web-vitals/`, `/tools/canonical-tag-generator/`, `/tools/keyword-density-checker/`,
   `/blog/test-structured-data/`, `/tools/serp-preview-tool/`, `/blog/title-tag-length-2026/`,
   `/blog/rel-canonical-tag/`, `/tools/marketing-budget-calculator/`, `/tools/hreflang-checker/`,
   `/tools/rich-results-tester/` (after deploy). Google limits manual requests per day; one batch now and
   one after the deploy is enough.
4. **Sitemaps → resubmit `sitemap.xml`** after the deploy, and confirm it reports 103 discovered URLs.
5. **Do not ship another site-wide template change while the index recovers.** Content additions are fine;
   another all-pages rewrite resets the clock.
6. Keep the external work going (tools.cafe, SaaSHub, X/Reddit warm-up, Indie Hackers, Product Hunt —
   see `docs/founder-actions.md`). Links and brand searches are the levers that move a young domain out of
   the crawled-not-indexed bucket; on-page work alone cannot.

### Code, this week (one deploy)

7. ~~Deploy the pending batch~~ — **done 14 Nov** (commit `9de1574`, Worker version
   `3a37790a`). Live now matches the build: 60 tools, 27 guides, and a 99-URL sitemap index.
   The research release (`/research/`, `/research/ai-crawlers-2026/`, `/ai-crawlers/`, three seasonal
   guides) and this batch (rich results tester, CWV table, synonyms, budget chart fix, drilldown fixes)
   shipped together.
8. ~~After deploy, verify the seven new URLs~~ — **done**: all seven return 200, the 301 from
   `/blog/website-audit/` is live, `/terms/` carries `noindex`, `/feed.xml` carries
   `X-Robots-Tag: noindex`, and `tests/live-verify.mjs` passes 82/82 against production.

### Code, days 7–14

9. **`/blog/test-structured-data/` (205 impressions, position 83)** and **`/blog/rel-canonical-tag/`
   (175 @ 74.5)** are the two worst position-per-impression pages. Both are answer pages competing with
   specialist blogs. Either add a genuinely different section (a decision table, a worked example from a
   real crawl) or fold them into the tool pages they support.
10. **Internal links from indexed hubs.** Every striking-distance page should be linked from a page Google
    still serves, with the target query as the anchor text. The CWV guide, canonical generator and density
    checker are the three most-linked-to candidates.
11. **Alias pass on the cheap gaps**: "meta desc checker", "serp checker", "schema tester" — one sentence
    and one FAQ each, not new pages.

### Measurement, days 15–30

12. Re-export the three reports on **28 Nov** and **12 Dec**. Track: indexed count (target back above 60),
    impressions per day (target back above 100), and average position for the seven striking-distance
    queries. Index recovery after a duplicate fix plus recrawl typically takes two to four weeks; it is
    not instantaneous and it is not linear.
13. If impressions are still ≈1/day after 21 days *and* steps 1–5 all came back clean, the next lever is
    pruning: cut the weakest 20–30 overlapping pages so crawl and authority concentrate. Do not do that
    before the 28 Nov export — the list should be data-driven, not guessed.

## 7. Coverage drilldowns, 14 Nov: every listed URL and its disposition

Four exports were pulled for the four Coverage buckets. The last dated row in every export is 9 Nov, so the
counts line up with the "125 not indexed" figure above.

| Bucket | Rows | What they actually are | Disposition |
| --- | --- | --- | --- |
| Page with redirect | 33 | Every row is the `http://` form of a canonical `https://` URL | Nothing to fix. The 301 is live and asserted (`tests/worker-routing.mjs`); Google repoints them as it recrawls. |
| Alternative page with proper canonical tag | 25 | 4 homepage `?ref=` variants (launchstag, phindex.si, producthunt, saasearch.io) + 21 `http://` forms | Nothing to fix. The canonical tag is doing exactly its job. **Do not** disallow `?ref=` — a blocked URL cannot be crawled, so Google would never read the canonical and the bucket would become "indexed though blocked by robots.txt". |
| Not found (404) | 1 | `/blog/website-audit/` — the old guide URL; the guide was folded into the tool page | **Fixed**: 301 → `/tools/website-audit/` in `worker.js`, one hop with or without the slash, query preserved. |
| Crawled — currently not indexed | 66 rows / 59 unique URLs | 41 tool pages, 9 guides, 3 category hubs, 4 legal pages, 2 infrastructure URLs (7 rows were `http://` duplicates) | Split below. |

### The 66 "crawled — not indexed" rows, split by what the URL is

**6 URLs leave the set because they were never meant to rank:**

- `/privacy-policy/`, `/terms/`, `/disclaimer/`, `/contact/` — AdSense-required furniture, linked from
  every footer. Now `noindex` and removed from `sitemap-pages.xml` (103 → 99 URLs). They will move to
  "Excluded by noindex tag", which is the correct bucket for them.
- `/feed.xml` — an RSS document. Now served with `X-Robots-Tag: noindex` via `dist/_headers`.
- `/tow0/` (and `/tow0/gtm.js`) — a 593 KB first-party Google Tag Manager proxy with `application/javascript`
  and no canonical. It does not exist anywhere in this repo; it is Cloudflare-side (Google Tag Gateway).
  Now `Disallow: /tow0/` in robots.txt. **Owner action:** confirm in the Cloudflare dashboard that this path
  is the Tag Gateway, not something added by hand.

**53 URLs remain that Google saw and declined:** 41 tool pages, 9 guides, 3 category hubs
(`/seo-tools/`, `/ai-search-tools/`, `/web-utility-tools/`). They are 887–1,684 words, in the sitemap,
linked from at least three pages, with unique titles, descriptions and H1s. The selection is not
"thin pages" — it includes the ten priority tools. That makes it a site-level quality/authority verdict,
and the answer is the 30-day plan in §6, not more per-page markup. No further per-URL fixes are honest here:
there is no defect on those 53 pages to fix.

### Recrawl and reindex order (after deploy)

1. **Deploy** — the legal-page noindex, the new robots.txt, `_headers`, the Worker redirect and the
   research release all ship together. Nothing below is visible until this happens.
2. **Sitemaps** in Search Console → re-submit `sitemap.xml`. The index re-reads its three children;
   the count should read 99. Resubmitting the children individually is not needed.
3. **URL Inspection → Request indexing**, in this order, at most ~10 a day:
   `/` · `/blog/` · `/seo-tools/` · `/ai-search-tools/` · `/web-utility-tools/` ·
   `/tools/website-audit/` · `/tools/meta-tag-generator/` · `/tools/robots-txt-generator/` ·
   `/tools/llms-txt-generator/` · `/tools/rich-results-tester/` · `/research/ai-crawlers-2026/`.
   Do not request the `http://` or `?ref=` forms — they are the redirect/canonical buckets and asking
   Google to crawl them spends quota proving what is already proven.
4. **Confirm the 404 fix** the same day: `/blog/website-audit/` must answer 301, not 404. It should move to
   "Page with redirect" within two weeks.
5. **Expect three bucket moves and treat none as an error:** legal pages → noindex; `/feed.xml` → excluded
   by header; `/tow0/` → blocked by robots.txt. The "not indexed" total should fall by roughly 6 without
   a single page being "fixed" for quality.
6. **Measure on 28 Nov and 12 Dec**: indexed count (target above 60), impressions per day (target above 100),
   clicks, and position for the seven striking-distance queries in §1. Index recovery after a canonical/redirect
   batch plus recrawl typically takes two to four weeks and is not linear.

## 8. Sources

- Google, Page indexing report — <https://support.google.com/webmasters/answer/7440203>
- Google, Ask Google to recrawl your URLs — <https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl>
- Google, Consolidate duplicate URLs — <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- Google, Creating helpful, reliable, people-first content — <https://developers.google.com/search/docs/fundamentals/creating-helpful-content>
- Google, Build and submit a sitemap — <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- web.dev, Core Web Vitals — <https://web.dev/articles/vitals>

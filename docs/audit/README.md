# Sitemap audit

A crawl-level audit of every URL in the sitemap: what the **served page** actually contains, with a fix attached to every finding.

## Why it exists

The repo already had three checkers, and none of them could answer "is the live site correct right now":

| Tool | Layer | Proves |
|---|---|---|
| `tests/seo-audit.mjs` | source + `dist/` | the generated data is internally correct (2547 assertions) |
| `tests/live-verify.mjs` | live, ~10 URLs | the deploy is healthy (78 assertions) |
| `scripts/check-sources.mjs` | external links in guides | citations still resolve |
| **`npm run audit`** | **live or dist, all 80 URLs** | **what each page serves, and what to change** |

The gap was not academic. On 26 Oct the apex served the pre-ad build for ~30 minutes and `test:live` passed 73/73 through it. On 27 Oct a deploy ran without `.env` sourced and the site served **no AdSense loader and no units at all** — a green deploy log and a silently broken revenue path. This audit found that on its first full run, because `ad-unit-count` compares the served page with the `.env` that built it.

## Commands

```bash
npm run audit           # crawl the live site
npm run audit:dist      # crawl the local build, offline
npm run audit:strict    # exit non-zero if any blocker is found
npm run test:audit      # fixture tests: every rule must fire on broken input
```

Useful flags:

```bash
node audit/pipeline.mjs --diff            # live vs dist, finding by finding
node audit/pipeline.mjs --only=tools      # one section (skips site-wide checks)
node audit/pipeline.mjs --cache           # reuse responses for an hour
node audit/pipeline.mjs --no-ads          # audit a deliberately ad-free build
node audit/pipeline.mjs --no-write        # console only
node audit/pipeline.mjs --dump            # print parsed Page objects, run no rules
node audit/pipeline.mjs --concurrency=3   # be gentler on the origin
```

## Stages

1. **Discover** — `/sitemap.xml` → child sitemaps → every `<loc>`, plus `robots.txt`, `llms.txt` and the RSS feed.
2. **Fetch** — 6 concurrent requests, 15 s timeout, one retry, redirects followed **manually** so the chain is visible (a 302 where a 301 belongs is a finding).
3. **Parse** — HTML → a `Page` object: head, JSON-LD, headings, links, images, ads, prose, FAQ, and the character offsets of the tool regions.
4. **Rules** — 47 pure functions, one claim each.
5. **Cross** — link graph, orphans, catalogue ↔ sitemap diff, duplicate titles, sitemap hygiene.
6. **Report** — markdown for humans, JSON for diffs.

## Output

- `docs/audit/report-<date>.md` — live run, grouped by severity, each finding with a fix
- `docs/audit/latest.json` — machine-readable, committed so two runs can be diffed
- `docs/audit/report-<date>-dist.md`, `latest-dist.json` — offline runs, kept separate so they never overwrite the live record

**The diff is the point.** Run it before and after a deploy: `latest.json` answers "did this ship correctly" instead of waiting for someone to notice.

## Rules

Thresholds live in `audit/rules/catalog.json` — no rule hardcodes a number.

| Module | Rules |
|---|---|
| `technical` | http-status, url-resolves-to-itself, redirect-permanent, canonical-present, canonical-matches-sitemap-url, noindex-in-sitemap, html-lang, viewport, title-present, html-content-type |
| `onpage` | title-length, desc-length, h1-count, heading-order, og-complete, twitter-complete, og-image-dimensions |
| `schema` | jsonld-valid, jsonld-present, jsonld-expected-types, faq-schema-matches-visible, no-searchaction, breadcrumb-positions, webapplication-offer |
| `content` | prose-min, faq-count, focus-in-title, focus-in-description, focus-in-heading, related-tools-rendered, outbound-links |
| `assets` | img-alt, img-dimensions, html-weight, render-blocking-script, h1-missing, skip-link |
| `links` | vague-anchor, empty-href, internal-link-density, javascript-href |
| `brand` | ad-inside-tool, ad-placeholder-chrome, ad-slot-empty-with-unit, adsense-loader-once, ad-unit-count, ad-client-matches |
| `cross` | dist-stale, broken-internal, orphan-page, tool/guide-missing-from-sitemap, sitemap-lists-unknown-*, related-slug-unresolved, duplicate-title/description/h1, sitemap-empty, sitemap-lastmod-missing, sitemap-index-incomplete |

Severities: **blocker** (10), **major** (4), **minor** (1), **info** (0). A site score of 100 is reserved for a run with no findings at all.

### Adding a rule

1. Add it to the module it belongs to, as a pure function of `(page, ctx)`.
2. Add the threshold to `catalog.json`, not to the rule.
3. **Add a case to `audit/tests/rules.test.mjs`** — one page built to trigger it, and the good page must stay quiet.

Step 3 is the point of the whole system. A rule that never fires is indistinguishable from a page that never breaks, and this repo has already paid for that lesson once.

## The brand rule

`ad-inside-tool` is not generic SEO. The homepage FAQ publishes this claim:

> Ads are placed in reserved spaces around the tools and never inside the tool itself.

The rule tests it structurally: it compares each ad's character offset against the `tool-shell` region in the served document. A claim in marketing copy becomes a build invariant.

The ad rules compare the served page with the `.env` that built it, so an ad-free build fails them — correctly, because `.env` says ads are on. When the build was ad-free **on purpose** (`ALLOW_ADS_OFF=1`), pass `--no-ads`: the three config-coupled rules (loader, unit count, client) stand down and the layout rules stay active. A run that cannot tell intent from accident would teach people to ignore it.

## A dist audit trusts its input, so it checks the input

`npm run audit:dist` describes `dist/`, and `dist/` is gitignored: a second checkout that has not rebuilt since a pull holds an old build. The audit compares the newest source mtime (all of `src/` plus `build.mjs`) with `dist/index.html` and reports `dist-stale` as a **blocker** when the source is newer by more than a minute. A stale build is not a site defect, but a report about one is worse than no report.

## Known limits, stated rather than discovered later

- **No JavaScript.** The audit sees the HTML the server sends. Tools that render client-side, and ads that fill after an auction, are invisible here. Ad *fill* must be judged in the AdSense console.
- **Regex parser.** Defensible because every page is machine-generated by `build.mjs`, so the shape is known. It would not survive a hand-authored CMS.
- **External links are counted, not fetched.** Liveness of citations is `npm run check:sources`'s job; duplicating it here would double the crawl time for the same answer.
- **No Lighthouse metrics.** LCP/CLS need a real browser. `assets` rules catch the causes (missing dimensions, render-blocking scripts, heavy HTML), not the effect.
- **Concurrency 6 by default.** Cloudflare tolerates it; a smaller origin may not.

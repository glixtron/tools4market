# Day 7 pack — integration notes

**Source:** `docs/day7/` (3 files, ~13,000 words, delivered 25 Oct 2026).
**Shipped:** 25 Oct 2026, v2.12 (guide 11 → 12, pages 68 → 69, SEO audit 2167 → 2189).

Read this before reusing any Day 7 file. The pack was written against a generic
CMS/URL model, not this codebase; some of it duplicates work that already exists
here, and one whole post duplicates a guide that has been live since 21 Oct.

---

## 1. FAQ Part 4 (tools 16–20) — merged, 5 of 15 items rejected

The pack ships FAQ **HTML + hand-written JSON-LD** for five tools. This site does
not accept either: FAQ copy lives in `src/data/*.js` as `tools.<slug>.faqs[]`, and
the `FAQPage` JSON-LD is generated from that array at build time (one source of
truth, asserted by `tests/seo-audit.mjs`). Pasting the pack's markup would have
created a second, drift-prone copy of the schema on the same page.

URLs in the pack are also wrong again — `/content/hashtag-generator`,
`/web-tools/xml-sitemap-generator`, etc. Real paths are `/tools/<slug>/`. The
"XML Sitemap Generator" is `sitemap-generator` here; there is no
`xml-sitemap-generator` slug.

| Pack question | Outcome | Why |
|---|---|---|
| Hashtag: what is a hashtag generator | **skipped** | page already explains it in the intro/first section |
| Hashtag: how many per platform | **skipped** | existing FAQ #1 covers Instagram/X/LinkedIn/TikTok/YouTube counts |
| Hashtag: same set every post | **shipped** | distinct (rotation / spam signal) |
| Hashtag: how to find trending | **skipped after review** | folded into the FAQ cap — generic, low intent |
| Sitemap: what is an XML sitemap | **skipped** | page intro + section 1 define it |
| Sitemap: do I need one | **skipped after review** | overlapped "Does a sitemap improve rankings?" |
| Sitemap: sitemap.xml vs sitemap-news.xml | **shipped** | genuinely new |
| Sitemap: how often to update | **shipped** | distinct from the changefreq/priority FAQ |
| Password: what makes a strong password | **skipped** | overlaps "How long should my password be?" |
| Password: is this generator safe | **skipped** | duplicates "Is your password sent anywhere?" |
| Password: password manager instead | **shipped** | distinct |
| Base64: what is Base64 encoding | **skipped** | page intro covers it |
| Base64: is it encryption | **skipped** | existing FAQ #1 |
| Base64: what is it used for | **shipped** | distinct |
| Base64: does it compress | **skipped** | existing FAQ #2 ("a third longer") |
| URL: what is URL encoding | **shipped** | distinct |
| URL: why do I need to encode | **skipped after review** | folded into the character-set FAQ |
| URL: encodeURI vs encodeURIComponent | **skipped** | existing FAQ #1 |

Net: **13 new Q&As** across the five tools, each trimmed to the site's ~300-character
answer rule, plus two knowledge gaps the pack did not raise (banned/quarantined
hashtags, Base64 padding).

## 2. Blog batch 3 — 1 of 3 posts published

| Pack post | Outcome |
|---|---|
| 6. "How to opt out of AI training (but stay visible)" | **not published** |
| 7. "Meta description length 2026" | **published** as `meta-description-length-2026` |
| 8. "Why is my site not indexed? Diagnostic flowchart" | **not published** — merged instead |

**Post 8 duplicates a live guide.** `why-is-my-site-not-indexed` has been live
since 21 Oct with the same focus phrase and a fuller structure (crawl-blocking
causes, post-crawl causes, fixes in impact order, when not being indexed is
correct, plus a dedicated "Crawled — currently not indexed" FAQ). Publishing the
pack's version would have created two guides competing for one query. Only the
genuine delta was merged: two FAQs — what "Discovered — currently not indexed"
means, and where Search Console reports the exclusion reason — and the
"5+ years of forum questions, 35% of cases" frequency table was **discarded**
as unsourced.

**Post 6 was not published for the same reason, one step earlier.** The site
already carries three AI-crawler guides (`robots-txt-for-search-and-ai-crawlers`,
`how-to-block-gptbot`, `check-ai-crawler-access`), and `how-to-block-gptbot`
already answers "can I block training but still appear in AI answers?". A fourth
post on the same cluster would split authority rather than add it. The pack's
distinctive asset — a single two-column allow/block table covering training
crawlers vs retrieval crawlers — is worth adding to the existing robots.txt guide
if the owner wants it; it does not justify a new URL.

**Post 7 was adapted, not pasted.** Changes made before publishing:

- Removed the unsourced CTR and "Google uses your description 60–70% of the time"
  figures; replaced with a hedged statement that rewrites are common and usually
  query-matched.
- Removed the fabricated per-platform spec table (Google desktop 155–160 / mobile
  120 / Bing 165 / DuckDuckGo 165). Google does not publish a character limit and
  truncates on rendered width — the article now says that, then gives a ladder as
  a rule of thumb.
- Dropped the seven-section structure to six (the audit enforces 3–6) by folding
  the "how to check" section into "writing one that survives".
- Rewrote to house voice: no "TL;DR" block, no emoji, no "comprehensive guide"
  register, honest about what cannot be controlled.
- Fixed every internal link: `/seo-tools/meta-description-checker` →
  `meta-description-checker` tool slug in `relatedTools`; the blog-to-blog link to
  the launch checklist is prose, not a `relatedTools` entry (that array is
  tool-only and silently drops unknown slugs at build time — a broken link that
  fails quietly).

## 3. Internal-linking widget — not built

`Day7_Internal_Linking_Widget_Template.md` is a real, complete design (JSON config
of ~30 tool→tool pairs, vanilla JS with `sessionStorage` caching, GA4 events, CSS
with dark mode and reduced motion, plus a Node batch-insert script). It is also
the highest-risk item in the pack and was not shipped in this pass:

- The batch-insert script rewrites built HTML, but every page here is regenerated
  by `build.mjs` — the insert would vanish on the next build. It has to be a build
  step, reading a config file, not a post-build mutation.
- Its `sessionStorage` cache would double-count or miss impressions depending on
  where it runs relative to the existing consent gate in `site.js`; impressions
  must go through the same `track()` helper or they bypass Consent Mode.
- The projected "2.67x ad impressions per session" is an assumption, not a
  measurement, and there is no evidence yet that current sessions are short of
  impressions.

Recommendation: implement it as a build-time section (like `relatedTools` already
is), fold the clicks into the existing `internal_link_click`-style event, and
measure before quoting a multiplier.

## 4. What the pack got right

- FAQ coverage order (tools in popularity order) matches the site's own list.
- The advise-not-schema framing of the FAQ HTML is correct in spirit; only the
  delivery mechanism (hand-written JSON-LD) was wrong for this codebase.
- The meta-description angle — "the 160 limit is desktop-only advice" — is a
  genuinely useful, honestly arguable position and is now a guide.

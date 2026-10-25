# Day 9 pack — integration notes

**Source:** `docs/day9/` (3 posts, ~4,300 words of source, delivered 25 Oct 2026).
**Shipped:** 25 Oct 2026, v2.14 — **3 of 3 published** (guides 15 → 18, pages 72 → 75,
SEO audit 2291 → 2368).

The pack's own claim — "all three tool slugs verified to exist" — was true for two of
three. Topic selection was correct for all three, and the fact-checking gates it
committed to caught the easy things (no `rel=next`, no 100-link myth) while missing
the load-bearing ones (what Google actually does with a 302).

---

## Gap check (before writing)

| Topic | Mentions in the 15-guide library | Verdict |
|---|---|---|
| `.htaccess` 301 redirect | **0** | new |
| title tag length | 2 — one step in `website-launch-seo-checklist`, one mention in `screaming-frog-alternative` | new as a page; the checklist had a sentence, not a section |
| Open Graph image size | 2 — same two places | new as a page |

None of the three replaced a section. Each replaced a sentence, and the launch
checklist now links to all three through `relatedGuides[]` instead of gesturing at
them.

## What changed vs the pack

| Pack | Site | Why |
|---|---|---|
| `/seo-tools/…`, `/web-tools/…`, no trailing slash | `/tools/<slug>/`, `/blog/<slug>/` | Fourth pack in a row with the wrong URL scheme. |
| `/web-tools/xml-sitemap-generator` | `sitemap-generator` | The slug does not exist. `relatedTools` would have dropped it silently, exactly like Day 8's `image-optimizer`. |
| Markdown tables | prose | `rich()` supports **bold** and `code`, and `paras()` wraps each string in `<p>`; a pipe table would have shipped as pipe characters. |
| Bullet lists (`- item`, `1. item`) | prose paragraphs | Same renderer limitation. |
| Redirect code fences | `sections[].pre` | The build already renders `<pre class="article-code">`; the four patterns are a real code block. |
| Per-post "FAQ array" blocks | omitted | The article's `faqs[]` array already generates `FAQPage`, so the second copy was a drift source with no upside. |
| TL;DR blocks | removed | House voice; the lead paragraph does that job. |

## Factual corrections

1. **"301 passes PageRank; 302 does not."** Google's current page describes the
   difference as *canonicalisation*, not equity: both are followed, a permanent
   redirect (301/308) makes the target canonical and shows it in results, a temporary
   one (302/303/307) keeps the source canonical and it keeps appearing. Rewritten that
   way. The pack's "Google confirmed in 2016 that 301s pass PageRank equivalently to
   direct links" is stronger than anything currently documented, so the FAQ now says
   signals consolidate over time rather than promising a 1:1 transfer.
2. **"Google follows up to about 5 hops."** Not published anywhere. Removed; the guide
   says chains cost a request and a failure point, and that there is no documented
   limit to design against.
3. **Search Console "Coverage".** Renamed **Page indexing** years ago. Also, "Page with
   redirect" is informational — the pack called redirect entries errors, which would
   have sent readers chasing a healthy state.
4. **"Facebook refreshes the cache instantly."** Corrected: re-scraping changes what new
   shares see; previews already cached in feeds do not change retroactively.
5. **`cards-dev.twitter.com/validator`.** That standalone validator is gone. The guide
   points at the composer preview and at each platform's own documentation instead of
   listing a dead URL.
6. **"Unique OG images earn 2–3× more clicks."** Unsourced multiplier, removed. The
   argument kept is the one that needs no data: a page-specific card says which page
   you are opening, a logo repeats what the domain line already says.
7. **"Facebook minimum 600×315" and per-platform 8 MB caps.** Platform documentation
   does not publish all of those numbers, and the ones that circulate are tested, not
   documented. Replaced with a 1200×630 design target plus a ~500 KB budget.
8. **"Google rewrites titles in 30–60% of cases."** No rate is published, and the
   third-party studies that quote one sample different query sets. Removed; the guide
   lists the documented rewrite triggers instead and suggests checking your own titles
   in Search Console.
9. **"A good title boosts CTR 5–30%, and CTR indirectly affects rankings."** CTR is not
   a documented ranking input and Google's published ranking systems do not include
   click data. The ranking implication is gone; the guide keeps the honest version —
   better titles earn clicks, and clicks are the point.
10. **"Keyword in the first 30 characters because Google weights the start."** Not
    documented. Replaced with a mechanism that is: the title link is truncated to fit
    the device, so front-loading controls what survives the cut.
11. **The 600 px / 520 px / 580 px pixel widths.** Google publishes no width; those are
    measurements. The guide says so explicitly and treats them as proxies, with the
    SERP preview as the actual check.

## What the pack got right

- The gap list, for the third pack running. No existing guide covered any of the three
  topics in depth.
- **The title post's core insight** — Google truncates by rendered width, not character
  count, and there is no official limit — is correct, is in Google's own documentation,
  and is the part most guides get wrong. It survived as the spine of that article.
- Splitting "spec sheet" (OG, title) from "tactical guide" (redirects) is the right
  editorial shape; it is why the three pages do not read as one long post cut into
  thirds.
- The redirect post's insistence that `Redirect` ≠ `RewriteRule` and that order matters
  is correct and is preserved.

## No new build capability was needed

`sections[].pre` already existed (added for the Screaming Frog comparison), so the
redirect patterns ship as a styled code block. The only change to `src/data/blog.js`
beyond the three articles is cross-linking: `website-launch-seo-checklist` now points
at all three, `meta-description-length-2026` at the two spec sheets, and
`noindex-vs-robots-txt` / `why-is-my-site-not-indexed` at the redirect guide.

That keeps the cluster reachable in both directions — the new pages are linked from
older guides, not only from each other.

## The slug failure mode is now an audit failure

Twice in two packs an unknown `relatedTools` slug has survived review: `image-optimizer`
(Day 8) and `xml-sitemap-generator` (Day 9). Both times the renderer dropped it silently,
so the page still had three linked tools and nothing looked wrong.

`tests/seo-audit.mjs` now asserts that every slug in `relatedTools` resolves to a real
tool, and the failure message names the slug. Checked by injecting `image-optimizer` into
a guide that does not use it: **2385 passed, 1 failed — `blog/internal-linking: every
relatedTool slug resolves — image-optimizer`**. The pack's "all slugs verified" line is
now a claim the build can confirm or refuse, rather than a claim to trust.


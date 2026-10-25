# Day 8 pack — integration notes

**Source:** `docs/day8/` (3 posts, ~7,500 words, delivered 25 Oct 2026).
**Shipped:** 25 Oct 2026, v2.13 — **3 of 3 published** (guides 12 → 15, pages 69 → 72,
SEO audit 2189 → 2291).

This is the first pack that was **gap-list based** and it shows: every topic was
genuinely missing from the library, and the executive summary's claims about the
build system were mostly accurate. What still needed correcting was factual, not
structural.

---

## What changed vs the pack

| Pack | Site | Why |
|---|---|---|
| `src/data/blog-faqs.js` | `src/data/blog.js` → `article.faqs[]` | There is no separate FAQ file. Each article carries its own `faqs` array and the build generates the `FAQPage` schema from it, so a second file would be a second source of truth. |
| `/web-tools/image-optimizer` | `image-compressor` | There is **one** image tool, "Image Compressor & Optimizer". No separate optimizer slug exists, and `relatedTools` drops unknown slugs silently — the pack's link lists would have produced dead entries with no error. |
| `/seo-tools/…`, `/web-tools/…`, `/content/…` | `/tools/<slug>/` | Same wrong URL scheme as Days 2 and 7. |
| `/blog/<slug>` (no trailing slash) | `/blog/<slug>/` | Trailing slash is the canonical form; the build emits directory-style URLs. |
| TL;DR blocks | removed | House voice; the lead paragraph does that job. |
| Hand-written FAQ JSON-LD | generated | As above. |

## Factual corrections (the part that mattered)

1. **"Failing all three is a confirmed ranking penalty."** Not true and internally
   contradictory — the pack's own FAQ calls Core Web Vitals a tiebreaker. Rewritten
   throughout: page experience has been a ranking *input* since 2021, and it
   separates pages whose content is otherwise comparable. No penalty claim survives.
2. **`rel="next"` / `rel="prev"` needed for pagination.** Google stopped using those
   hints in 2019. Keeping the advice would have sent readers to add tags that do
   nothing while leaving pages two-onwards unlinked. The guide now says the opposite,
   and explains what paginated archives actually need.
3. **"Roughly 100 internal links per page" as a natural limit.** That figure came from
   a 2008-era guideline and is not current guidance. Replaced with dilution and
   context as the real constraints.
4. **"AVIF not supported in older Edge."** Current Edge supports AVIF; saying otherwise
   would have pushed readers to a worse format. The guide now says current versions of
   every major browser support it, with JPEG as the fallback.
5. **"Sitemap-only pages are treated as lower priority."** Unverifiable. Replaced with
   what is observable: no inbound links means no importance signal and a longer wait.
6. **Search-volume figures** (17.6K / 21.5K / 56K "addressable") are third-party
   estimates. They were used to prioritise the work and are not published anywhere on
   the site.
7. **"Increasing ad impressions per user"** was framed as a reason to do internal
   linking. Kept as a consequence, demoted from a headline benefit — the SEO case does
   not need it.

## What the pack got right

- The gap list itself was correct: no guide covered internal linking, image SEO or Core
  Web Vitals, and all three are supported by tools that already exist.
- The FAQ-as-array instruction was the right call; it just named the wrong file.
- The "measure, don't assume" framing on Core Web Vitals (lab vs field, 28-day lag) is
  the honest version and is now the section that carries that guide.

## New build capability this pack required

The pack asked each guide to cross-link 2–3 guides. That was impossible before: prose
is escaped, and `relatedTools` is tool-slugs-only. So `article.relatedGuides[]` now
renders a **Read next** block, and `tests/seo-audit.mjs` asserts every slug resolves
and that the links appear in the built page — the exact failure mode that made
`relatedTools` dangerous. Three existing guides (`website-launch-seo-checklist`,
`why-is-my-site-not-indexed`, `screaming-frog-alternative`) now point into the new
cluster, so the new pages are not orphans.

This is also the honest implementation of the internal-linking guide's own advice:
related blocks that are mapped deliberately, and build-time rather than post-build.

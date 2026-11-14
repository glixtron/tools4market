# Page production plan — your content in, built HTML out

Status: plan, 14 Nov 2026. Nothing here is built yet. Batch 0 (one page) proves the
pipeline before any volume.

## 1. What this is, and what it is not

You send content. I turn it into a page on tools4market.online: a data entry in
`src/data/blog.js`, a photo committed under `src/assets/guides/`, and one
`node build.mjs` run that emits the HTML. The HTML is generated, never hand-edited —
that is how each page gets its canonical, JSON-LD, sitemap entry, feed entry,
`llms.txt` line, breadcrumb, author box, related tools and related guides without
anyone remembering to add them.

"Photo embedded" means the photo is served from our own origin as part of the page:
`<figure>` with `<figcaption>`, fixed `width`/`height` so nothing shifts, and the
same file as the page's social card. No hotlinks to your drive, no base64 blobs.

## 2. What you send — one block per page

Paste this, filled in, one block per page. Attach the photo to the same message and
name it `<slug>.jpg` (or `.png`).

```
SLUG:            figma-vs-canva
TYPE:            comparison            (guide | comparison | alternative | roundup)
TITLE:           Figma vs Canva: which one should a small team pay for?
META TITLE:      Figma vs Canva 2027: the honest comparison   (25–60 chars)
META DESC:       Figma vs Canva: Figma wins on components and handoff, Canva on
                 speed and price. Compare both on four tests and pick the one your
                 team will actually use.   (110–158, must contain the focus phrase)
FOCUS KEYWORD:   figma vs canva
ALSO TARGET:     canva vs figma price, figma vs canva for teams
AUTHOR:          Glixtron
DATE:            2026-11-18
PHOTO ALT:       A designer's screen with Figma components open beside a Canva
                 template picker                         (≤125 chars, describes the scene)
PHOTO CAPTION:   One file in each tool, side by side.   (optional, one line)
INTRO:           2–3 sentences. The verdict goes in the first one.

## Section heading (h2, plain text, no markdown)
Paragraph. **Bold** works for a phrase, `code` for a literal. 2–4 short paragraphs.
Links: [anchor text](/tools/meta-tag-generator/) — internal only, I resolve them.

## Next heading
...

[TABLE] Comparison table (optional, comparison pages should have one)
head: Option | Price | Best for | Verdict
row:  Figma | $16/editor/mo | Teams with a design system | Pick this if…
row:  Canva | $15/mo | One-off social assets | Pick this if…

FAQS:            4–6 pairs, question then answer. No Q already answered elsewhere on the site.
Q: Is Figma free for one person?
A: Yes — the free tier allows unlimited personal files, three collaborative files…
Q: …

RELATED TOOLS:   image-compressor, og-image-tester, meta-tag-generator   (3+, must exist)
RELATED GUIDES:  image-seo, website-launch-seo-checklist                    (must exist)
SOURCES:         Canva pricing — https://www.canva.com/pricing/             (2+)
                 Figma pricing — https://www.figma.com/pricing/
```

### Hard limits, checked by `tests/seo-audit.mjs` before anything ships

| Field | Rule | Assertion |
|---|---|---|
| Title | unique across the site | intake check, §6 |
| Meta title | 25–60 chars **and** contains the focus keyword | seo-audit:178–179 |
| Meta desc | 110–158 chars **and** contains the focus keyword | seo-audit:180–181 |
| Intro | 90–300 chars **and** contains the focus keyword | seo-audit:182–183 |
| Body | 3–6 sections, 600+ words (target 700–900 for new pages) | seo-audit:184–185 |
| Headings | at least one h2 carries the focus keyword | seo-audit:186 |
| FAQs | 4–6; each ends in `?`; ≥2 mention the focus keyword | seo-audit:187–189 |
| RELATED TOOLS | ≥3, every slug must resolve | seo-audit:191/197 |
| RELATED GUIDES | every slug must resolve, never self | seo-audit:194/198 |
| SOURCES | ≥2 authoritative links | seo-audit:199 |
| Paragraphs | no paragraph repeated verbatim anywhere on the site | seo-audit:200–202 |
| Focus keyword | must not already be another page's focus | cannibalisation gate, §6 |

Sections at 4+ also earn the sticky table of contents; 3 is allowed but reads thin.
If a block comes in under these, it comes back to you with the specific gaps listed.
I do not pad it, and I do not invent a section to reach 600 words — padding is what
the "crawled, currently not indexed" bucket is made of.

## 3. The photo

- Any size from 1200 px wide up; JPEG or PNG. Landscape 16:9 preferred.
- You must own it or have a licence. Say which, in one word, in the message.
- I normalise to **1200×675 JPEG, quality ~72, target ≤180 KB** with `sips`
  (already on this machine): scale so the short side is ≥675 px, then centre-crop to
  exactly 1200×675 so every figure on the site is one shape. One photo, one page —
  reused stock art is the fastest way to look templated.
- No AVIF/WebP derivatives for now: this macOS cannot encode either (`sips` refuses
  webp and avif, and `cwebp`/`avifenc` are not installed). The markup stays
  `<picture>`-ready, so derivatives can be added later without touching the pages —
  `scripts/add-guide-photo.mjs` will emit them the day an encoder exists.
- The photo is the page's `og:image` and `twitter:image` too, at absolute URL. A page
  that shares a generic brand card is a page whose shares look like every other page.

## 4. Code work this needs (once, before batch 1)

1. `photoFigure(image)` in `build.mjs` — `<figure class="guide-figure">` with
   `<img src width height alt decoding loading>` + `<figcaption>`. Rendered at
   `build.mjs:1033` when the article has an `image`, else the existing SVG
   `guideFigure` stays. First figure loads `eager` + `fetchpriority="high"`;
   additional in-body photos load lazy.
2. `layout({ image })` — `build.mjs:338–345` uses the page image for
   `og:image` / `twitter:image` / `og:image:alt` when present.
3. `articleLd` — `build.mjs:1079` `image:` becomes the page image (absolute), with
   width and height, instead of the brand card.
4. Blog index card — `build.mjs:1055` uses the photo thumbnail when one exists
   (CSS: `aspect-ratio: 16/10; object-fit: cover`).
5. Asset copy — `build.mjs:1685` currently copies a hardcoded list; add a walk of
   `src/assets/guides/` so a new photo needs no build edit.
6. `scripts/add-guide-photo.mjs <file> --slug <slug>` — resize, re-encode, write to
   `src/assets/guides/<slug>.jpg`, print the dimensions to paste into the data file,
   fail if the result is over 200 KB or under 1200 px wide.
7. `scripts/check-duplicate-content.mjs` — 6-word shingle overlap between every pair
   of guides; fails above 35%. This is the guard against ten pages a day turning into
   ten versions of one page.
8. New seo-audit assertions: image file exists in `dist/`, `alt` non-empty and unique,
   `width`/`height` present, `og:image` is absolute and present on disk, file ≤200 KB.

## 5. Gate before any commit

Automated, in this order — all must be green:

```
node build.mjs
node tests/seo-audit.mjs          # ~3,300 assertions, all pages
node tests/local-links.mjs        # no broken asset or internal link
npm run audit:dist                # 0 blockers; image weight + dimensions checked
node scripts/check-duplicate-content.mjs
```

Manual, and it blocks the commit:

- Screenshots at **1440, 768 and 390** for the batch — first viewport at all three,
  full page at 1440 — for your read. Nothing is committed until you have looked.
- One falsifiable claim per page: a number, a price or a threshold that you can point
  at. "It depends" pages do not rank and do not convert.

## 6. Ship loop, per batch of 10

1. **Intake.** Your 10 blocks. I return a list of gaps the same day; you fix or drop.
2. **Cannibalisation check.** Focus keyword and meta title against all 27 existing
   guides, the 60 tools and `docs/seo/keyword-map-2026-11-14.csv`. Two pages on one
   phrase means neither ranks — the weaker one is retargeted or dropped.
3. **Build + gates** (§5).
4. **Commit** as one batch commit (data + photos + script output).
5. **Deploy on your explicit "deploy now".** `npm run deploy` = build → preflight →
   wrangler. Never deployed as part of the commit.
6. **Sitemap.** `sitemap-blog.xml` picks the pages up automatically with their real
   dates; index is 99 URLs today and grows by the batch size. Nothing to hand-edit.
7. **Push.** `npm run indexnow` for Bing/Yandex; GSC → URL Inspection → Request
   indexing for the 10 URLs (owner action, ~10–12/day cap, which is why 10/batch).
8. **21-day check.** Per batch: how many of the 10 are indexed, how many have
   impressions. Written into `docs/pendingwork.md`.

### Kill rule

If fewer than 4 of the first 10 are indexed after 21 days, volume stops and the next
week goes into quality and links instead. Adding pages to a site Google is already
declining to index makes the site-level verdict worse, not better. This rule is the
difference between a content programme and a spam programme.

## 7. What this is expected to produce

10 pages/day, 5 days/week, is ~50/week and ~550 by the end of January. That is a real
programme, and it is also the volume at which Google starts asking whether the pages
are distinct. Hence §4.7 and the kill rule.

Realistic curve, assuming the pages are genuinely differentiated and indexation holds.
Revenue is pageviews × ₹0.25–0.50 (a ₹250–500 RPM, the range this site's tool and
"How to" keywords support):

| Month | Indexed new pages | Impressions/day | Clicks/day | Ads, ₹/month |
|---|---|---|---|---|
| Dec 2026 | 60–100 | 150–400 | 5–12 | 40–220 |
| Feb 2027 | 250–350 | 800–2,000 | 24–60 | 220–1,100 |
| Jul 2027 | 550–700 | 3,000–8,000 | 90–240 | 850–4,500 |

That is the honest shape: indexed long-tail pages earn single-digit impressions per
day each for months. The ₹80k–1L/month target needs roughly **200,000 pageviews a
month** at a ₹400 RPM — 6,700 pageviews/day, which at a 3% CTR is 220,000
impressions/day. That is 25–70× the July row. Content cadence alone cannot get there;
it is the floor, not the ceiling.

Where the rest comes from, in order of leverage:

1. **Links.** If the average page rises from 10 to 30–50 impressions/day — which is
   what links do — the July row multiplies by 3–6 and ads land at ₹4k–25k/month.
2. **RPM.** Display ads on free-tool keywords are the worst-paying inventory. One
   affiliate placement on each comparison page, or a ₹4,999 audit product, changes
   revenue per visit by 5–20× with the same traffic.
3. **Volume with quality.** 550 pages is not 550 shots on goal; it is 550 pages that
   each need a distinct angle. The duplicate-content gate and the kill rule are what
   stop this from becoming a liability.

## 8. Batch 0 — the proof

Before any volume: one real page, one real photo, end to end, with the template
changes in §4 and a screenshot at all three widths. If the template and the photo
pipeline are right, batches 1–10 are data entry. If they are not, we find out on page
one instead of page one hundred.

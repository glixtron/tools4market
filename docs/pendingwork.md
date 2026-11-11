# Pending Work

## Status

Site-side code is current; the remaining work is a content roadmap (below) plus founder-side actions.

- **55 tools / 93 pages / 24 guides** — `regex-tester` and `qr-code-generator` added 31 Oct; `word-counter`, `character-counter`, `color-picker`, `css-minifier` added 10 Nov; `cron-expression-generator`, `json-to-csv`, `text-diff`, `hash-generator` added 11 Nov
- All 55 tool pages smoke-tested (`npm test` → 55/55)
- Behaviour suite **67 assertions** (`npm run test:tools`) — arithmetic, conversions, diff scripts and hash vectors, not just rendering
- SEO audit **3001/0**
- Internal links **5,164 / 93 pages**, now including fragments (`/blog/slug/#anchor` must match an `id`)
- Consent 30/30 · worker-routing 22/22 · audit rules 73 · audit-batch 50 · live 82/82
- Audit **0 blockers / 3 minors / 98 per 100**

### Content roadmap (owner-approved)

- **12 tools left** from the 13-tool list, after this batch: HTML minifier, markdown → HTML, HTML → markdown, favicon generator, email validator, SVG optimizer, QR scanner, plus the individually-deferred JS minifier and others noted in `progress.md`. URL shortener was dropped from the roadmap on 11 Nov (`docs/url-shortener-design.md` explains why).
- **12 guides** gap-checked against the 24 that exist.
- **Bot decision table** — done 11 Nov, as a section inside `/blog/robots-txt-for-search-and-ai-crawlers/`, not a new page. Rendered from `src/data/bots.js`, the same array the robots.txt generator uses.
- VISITOR_FIX map added with 11 rule entries
- Handoff map with 11 tool destinations configured
- SITE_AUDIT toolFor mapping updated

### Decisions waiting on the owner

- [ ] **Ratify or reject the vendored QR encoder** (`src/vendor/qrcode.js`, MIT). The build still has zero npm dependencies, but rules.md §3 says "no npm dependencies" — the cleanest wording is "no npm *build* dependencies; third-party browser code must be vendored, licensed and loaded only on the page that needs it."
- [ ] **Eyebrow mandate** — `design.md` §9 requires an eyebrow plus rule on every homepage section, which the same doc flags as an AI tell. Proposal: keep it on one section, remove the numeric counters. Shipped state: the hero keeps its eyebrow, no other section has one.
- [ ] **Ratify the H1 wording rule** (`rules.md` §2) — the 47 H1s no longer share a suffix; each one now names what that tool does. Confirm the new wording before it is treated as fixed.

### Human-generated pass (shipped 7 Nov 2026)

Ranked in `docs/human-generated-human-readable.md` §7; rulebook in `docs/ai-generated-tells.md`.

- Named author system: `src/data/authors.js` drives the byline, `/authors/glixtron/` profile page, Person schema with `sameAs`, and the `author` on every guide — in place of "Tools4Market Editorial" and Organization markup.
- 47 H1s rewritten: the shared `— No Signup, No Limits` tail is gone, and each title describes its own tool.
- Volume theatre removed: word-count/min-read note in the TOC, fake reviewer field, decorative eyebrows on every non-hero section.
- Structural fixes: skip link on every page, one `<main>`, footer headings are real `h2`, cookie settings is a `button`, no h1→h3 jump on `/blog/`, 46 dead CSS classes deleted, inline styles replaced with classes.
- Copy: repeated formulaic openers ("the first mistake is…", "updates as you type") rewritten; clichéd guide titles and the GPTBot FAQ answer rewritten.
- Cards and category pages stop repeating themselves: a processing label appears only on cards that differ from the rest of the grid, and the category stat strip only renders when the numbers differ.
- The hero screenshot is now a real audit run (example.com, 54/100, 15 findings) and the score logic deducts site-level findings, so the number is consistent with the findings beneath it.

### Remaining (founder-side, not code)

See [`docs/founder-actions.md`](founder-actions.md): AdSense review re-check 4 Nov, tools.cafe + SaaSHub submissions, X/Reddit warm-up, Indie Hackers post rewrite, Product Hunt launch.

## Completed Tasks

1. Implemented 47 audit rules with shared rule engine subset (41 apply to third-party sites; the 6 `brand`-group rules are our own ad-layout policy)
2. Added personalized fixes with handoff links for each rule
3. Created 11 rule-specific visitor fixes (title-present, desc-length, http-status, etc.)
4. Configured 11 site-specific tool destinations (meta-tag-generator, meta-description-checker, etc.)
5. Updated SITE_AUDIT toolFor mapping
6. Verified all tests pass (audit-batch, seo-audit, rules, routing, consent, suggest)
7. Website Audit visual pass (5 Nov): iframe parsing + `iframe-undimensioned` rule, broken/oversized image and `og:image` checks, live scan ledger, crawler filmstrip, findings query filter, supporting styles; audit-batch suite grew 43 → 50
8. CTR metadata rewrite (5 Nov): 15 GSC zero-click pages rewritten to match query phrasing, all within the 60/158 limits; see `docs/progress.md` for the table
9. Human-generated pass (7 Nov): rulebook bound into `rules.md`, author page and Person schema, 47 H1s rewritten, repeated copy and markup tells removed, hero screenshot replaced with a real audit run — `docs/progress.md` has the details

## Next Steps

- ~~End-to-end browser verification on a real website~~ — the audit tool's four modes are covered by `tests/audit-batch-test.mjs` (43 checks) and its report rendering by `npm test`; a manual crawl in a real browser session is still worth doing once, not blocking
- ~~Deploy the audit tool to production~~ — live since 30 Oct 2026 (`/tools/website-audit/`)
- Monitor and maintain the audit pipeline

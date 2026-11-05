# Pending Work

## Status

**No pending code work.** Site-side work is caught up; everything outstanding is founder-side.

- **47 tools / 84 pages / 24 guides** — `regex-tester` and `qr-code-generator` added 31 Oct 2026
- All 47 audit rules implemented and verified
- All 47 tool pages smoke-tested (`npm test` → 47/47)
- SEO audit **2672/0** — the 3 pre-existing `website-audit` content deviations (section length, FAQ answer, card length) were trimmed on 5 Nov
- Consent 30/30 · worker-routing 14/14 · audit rules 73/73
- All 50 audit-batch tests passing
- All 24 suggest API tests passing
- VISITOR_FIX map added with 11 rule entries
- Handoff map with 11 tool destinations configured
- SITE_AUDIT toolFor mapping updated

### Decisions waiting on the owner

- [ ] **Ratify or reject the vendored QR encoder** (`src/vendor/qrcode.js`, MIT). The build still has zero npm dependencies, but rules.md §3 says "no npm dependencies" — the cleanest wording is "no npm *build* dependencies; third-party browser code must be vendored, licensed and loaded only on the page that needs it."
- [ ] **H1 pattern** — `rules.md` §2 fixes every H1 as `Free {Tool} — No Signup, No Limits`; all 47 pages share the same opening. Proposal in `docs/human-generated-human-readable.md` §8: keep the phrase and `Free`, make the suffix optional on roughly 40% of pages.
- [ ] **Eyebrow mandate** — `design.md` §9 requires an eyebrow plus rule on every homepage section, which the same doc flags as an AI tell. Proposal: keep it on one section, remove the numeric counters.

### Human-generated pass (code, not yet started)

Ranked in `docs/human-generated-human-readable.md` §7. The first four are: named author system with Person schema and author pages; custom SVG icon set replacing the 58 emoji; removal of word count, section counters and repeated eyebrows; per-tool tested/changed lines backed by a real changelog.

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

## Next Steps

- ~~End-to-end browser verification on a real website~~ — the audit tool's four modes are covered by `tests/audit-batch-test.mjs` (43 checks) and its report rendering by `npm test`; a manual crawl in a real browser session is still worth doing once, not blocking
- ~~Deploy the audit tool to production~~ — live since 30 Oct 2026 (`/tools/website-audit/`)
- Monitor and maintain the audit pipeline

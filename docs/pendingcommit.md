# Pending Commits

## Status

**No pending commits.** All work has been completed, committed and pushed.

## Recent Changes

- **10 Nov: four browser-local tools** (`6313143`). `word-counter`, `character-counter`, `color-picker`, `css-minifier` — 51 tools / 89 pages, all in `LOCAL_TOOLS`. New `tests/tools-behaviour.mjs` (30 assertions) checks the arithmetic, not the rendering; it caught swapped contrast tiles on the colour picker. `test:tools` added to package scripts. Deployed `bafeafcd`; live 82/82, audit 0 blockers.
- **10 Nov: 307 → 301 trailing slashes + offline link guard** (`da6426a`). Worker answers before the asset layer: GET/HEAD 301, other methods 308, files and `/api/*` excluded. Also fixed two `test:live` measurement bugs (`.webmanifest` extension cap, HTML entities counted as characters) and a real homepage 404 — `/blog/website-audit/` was the Website Audit tool misclassified as an article by `!!x.sections`. New `tests/local-links.mjs` (4,706 links / 85 pages) runs inside `check-deploy.mjs`, so a link to an unbuilt page fails before upload. `test:live` 82/82; audit 0 blockers, 3 minors, 98/100.
- 7 Nov: human-generated pass — author page and `Person` schema, all 47 H1s rewritten, repeated copy and markup tells removed, hero screenshot replaced with a real audit run (see `docs/progress.md`). Committed; not yet deployed.
- Added `VISITOR_FIX` object with visitor-friendly fixes for each rule
- Added `handoff` map for site-specific tool destinations
- Updated `SITE_AUDIT` toolFor mapping to include all 11 rule IDs
- All documentation files updated to reflect completed work

## Ready for Deployment

All core functionality is complete and passing tests. The website audit tool is ready for deployment.

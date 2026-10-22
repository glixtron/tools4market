# Pending Commit

**Prepared:** 22 October 2026
**Status:** ✅ Two entries. (1) The image-optimizer commit `5837fb7` is committed and pushed to `origin/main`. (2) The v2.2 Human-First design refinement is committed on `audit-growth-plan-v2.1` (see below) — committed + pushed same day.

## Entry 2 — v2.2 Human-First design refinement

**Branch:** `audit-growth-plan-v2.1` · **Date:** 22 Oct 2026
**Status:** ✅ Committed and pushed. Cross-verified before commit: build 53 pages / 31 tools, SEO audit **1592/1592** (22 new assertions added), smoke 31/31, consent 30/30, personalized 84/84. One defect found and fixed during the work: the footer Company column duplicated About/Contact (POLICY already lists them).

**Subject:** `feat: human-first design refinement (v2.2) — task-led search, job icons, guide→tool links`

**Summary (v2.2):**
- Task-led search: five example chips (meta/robots/UTM/schema/audit) that run the filter on click, plus a concrete empty-state suggestion.
- Job cards carry a 1.5px line-icon family (no emoji in primary UI); editor's pick gained a "Why this week" note + `Last updated` label.
- Guide cards bridge to their primary tool ("Use this tool →") with editorial date + topic label.
- Honest per-tool processing notes on cards ("Runs in your browser" ×8 / "Live page check available" ×23) and a `localStorage` recently-used marker.
- SERP-safe category H1s (emoji moved to a decorative `.cat-mark`); outcome categories restyled as a two-column editorial index (not a third card grid).
- Header `aria-current` active state; footer exposes Guides; motion tokens + once-per-session hero entrance; global `prefers-reduced-motion`; slimmed cookie banner.

**Files in this commit:** `build.mjs`, `src/data/index.js`, `src/site.js`, `src/style.css`, `tests/seo-audit.mjs`, `design.md`, `progress.md`.

**Not deployed:** production still serves v2.1 + the pending image-optimizer commit. Next `npm run deploy` (source `INDEXNOW_KEY` from `.env`, Node 24 via nvm) publishes v2.2 + image-compressor together, then `npm run indexnow`.

## Entry 1 — image optimizer

**Subject:** `feat: add browser-local image optimizer and refresh SEO growth plan`

**Summary:**

- Add an in-browser image compressor with resize and format controls, batch processing, per-file size/dimension comparisons and downloads.
- Improve page-specific product copy and related-tool navigation, with build and smoke-test coverage for the new tool.
- Refresh the keyword strategy with a current competitor scan, post-launch intent priorities, defensible product positioning, and a 30/60/90-day growth plan.
- Align the pending-work tracker with the latest live verification, Search Console/Bing status and current content cadence.

## Files in the pending commit

- `Architecture.md`
- `README.md`
- `build.mjs`
- `pendingcommit.md`
- `pending-work.md`
- `progress.md`
- `KEYWORD-RESEARCH-AND-SEO-PLAN.md`
- `src/data/index.js`
- `src/data/policy.js`
- `src/data/web.js`
- `src/runtime/web.js`
- `src/style.css`
- `tests/smoke.mjs`

The image optimizer was committed on 22 Oct but had not been deployed at commit time; production verification at commit time still reported the previous 51 sitemap URLs / 30 tools. Today's research did not include a connected Search Console/Bing query export or measured keyword-volume data, so the new target clusters are marked as hypotheses until first-party performance data is available.

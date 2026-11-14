# Daily operations

One scheduled run per day at **09:00 IST** (Qoder Desktop automation, `local`, cwd = this repo). It measures the site, fixes at most three small things, commits locally, and writes one dated report here. It never pushes and never deploys.

## Run it by hand

```bash
npm run daily            # ~30s: build + smoke + tools + seo + links + audit + live
npm run daily -- --no-live
```

Output: a pass/fail table on stdout and `artifacts/daily/YYYY-MM-DD.json` (gitignored). The JSON is the evidence file for the report — numbers in the report must come from it, a live fetch, or a command in the day's transcript.

Two gate quirks worth knowing:

- `build.mjs` refuses to build without the AdSense environment, so the collector passes `--env-file=.env`. `npm run build` on its own is expected to stop with the "no AdSense environment" message — that is the guard working, not a failure.
- `test:live` flips depending on whether `.env` is loaded (`AD_SLOT_CONTENT` decides which assertion branch runs). `npm run test:live` and the collector both load it now; the collector retries once, because the only failures seen so far were single edge hiccups.

## Report template

`docs/daily/YYYY-MM-DD.md`, in this order:

```markdown
# <Weekday> <DD> <Month> <YYYY> — daily ops

**Run:** HH:MM IST · **HEAD:** `<sha>` (<subject>) · **Verdict:** green | red
**Evidence:** `artifacts/daily/<date>.json`

## Measured

| Gate | Result | Previous run |
|---|---|---|
| build | 97 pages | 97 |
| ... | ... | ... |

## Findings

### <finding> — <blocker | major | minor | info>
- **Evidence:** the command output or URL that proves it
- **Cause:** what is actually wrong, in a file and a line if possible
- **Action:** what was done, or what the owner needs to decide

## Changed

| File | Change | Verified by |
|---|---|---|

*No changes* is a valid outcome — say why.

## Owner decisions

1. **<decision>** — exact action, and what it unblocks.

## Next run

1. ...

## Not measured

Traffic, rankings, impressions and AdSense account state: no API access from this machine.
```

## Rules the run follows

- Never `wrangler deploy`, never `git push`. The owner deploys manually.
- Never touch `.env`, `ads.config.json`, or lockfiles. Never print a secret.
- Stage exact paths only — this checkout carries ~157 untracked paths, many of them cloud-sync duplicates (`name (1).ext`).
- No new npm dependencies.
- No invented metrics. If something cannot be measured from here, the report says so.
- Revert its own work if a gate regresses; a clean "attempted, reverted" beats a broken build.

## Known backlog the reports will keep resurfacing

- **46 duplicate files in `src/` (14 copied into `dist/`)**, named `name (1).ext` by cloud sync. They are not reachable in production (`/404%20(1).html` → 404), but they inflate file counts and were the cause of the SEO gate failing on a stale `dist/`. Owner decision: delete them.
- Audit holds at **98/100 with 3 minors**; the minors are listed in `docs/audit/latest-dist.json`.

# Suggestions

*Living file — suggestions for improvements, found during development or review, that are not yet planned work. At the end of every task the agent reads this file together with `pendingcommit.md`: understand each suggestion, cross-verify any related uncommitted development, then commit and push everything. Move accepted items into `pending-work.md` when they become scheduled work; strike or remove items that were implemented or rejected (note why).*

## How to use

- **Found a rough edge while working?** Add it here with enough context that a future session can act on it without rereading this conversation.
- **Before coding a suggestion:** check `pending-work.md` first — it may already be scheduled there.
- **Format:** one bullet per suggestion, prefixed with the date found and the area (tool, build, design, SEO, ops).

## Open suggestions

- [ ] **(23 Oct, ops) Bump asset filenames when bytes change under immutable caches.** `/fonts/*` and `/assets/*` are served `max-age=31536000, immutable` at **stable filenames** (e.g. `inter-latin.woff2`, `style.css`). Returning visitors with the old cached bytes will never refetch — so ever updating a font file (or any non-hashed asset) **in place will not reach them**. When replacing font bytes or any stable-named asset, version the filename (`inter-latin-v2.woff2` + update the `@font-face`/preload refs; CSS/JS get a `-v2` suffix too) or introduce content-hashed names for those paths. Not urgent — no asset has been replaced yet.

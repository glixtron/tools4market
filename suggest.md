# Suggestions

*Living file — suggestions for improvements, found during development or review, that are not yet planned work. At the end of every task the agent reads this file together with `pendingcommit.md`: understand each suggestion, cross-verify any related uncommitted development, then commit and push everything. Move accepted items into `pending-work.md` when they become scheduled work; strike or remove items that were implemented or rejected (note why).*

## How to use

- **Found a rough edge while working?** Add it here with enough context that a future session can act on it without rereading this conversation.
- **Before coding a suggestion:** check `pending-work.md` first — it may already be scheduled there.
- **Format:** one bullet per suggestion, prefixed with the date found and the area (tool, build, design, SEO, ops).

## Open suggestions

- [ ] **(25 Oct, ops) HSTS: `includeSubDomains` and/or preload are the only remaining steps.** It is already live at `Strict-Transport-Security: max-age=31536000` on every https response (apex, pages, assets). Verified subdomain inventory as of 25 Oct: `www` (301 → apex) and `mail` (Namecheap Private Email → https → `privateemail.com`); both are HTTPS-capable and mail routing is MX-only, so `includeSubDomains` is low-risk whenever the owner wants it. **Preload** additionally requires `includeSubDomains` + `preload` + `max-age ≥ 31536000`, must be submitted at hstspreload.org, and is baked into browsers — do not submit until every future subdomain is guaranteed HTTPS-only. Neither step affects SEO or AdSense.
- [x] ~~**(23 Oct, ops) Bump asset filenames when bytes change under immutable caches.**~~ **DONE 25 Oct (v2.11)** — instead of renaming files (which would break every bare-path reference and the live-verify asset list), the build now appends `?v=<hash>` to every HTML asset reference (`style.css`, `site.js`, runtime files, `inspect-strings.js`, the icon set, `logo-mark.png`). The hash covers `src/assets`, `src/runtime`, `src/data`, `src/fonts`, `src/style.css`, `src/site.js`; the bare path still resolves for crawlers that strip the query. `_headers` matches on path only, so `/assets/*` stays immutable — a changed byte simply produces a new URL. Fonts were already covered by the same mechanism at the HTML level, so in-place font swaps are now safe too.

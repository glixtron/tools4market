# Tools4Market — Project Rules

*Binding for all future work on this codebase.*

## 1. What we build / never build

**Build:** free, instantly-useful, client-side tools for marketers, bloggers, developers, and webmasters. Global (English/US-first) audience.

**Never build (AdSense-policy & reputation risk):**
- Email extractors, scrapers, or any tool harvesting personal data
- Fake "hackers", account crackers, or privacy-violating utilities
- Tools requiring paid APIs we don't control (breaks = dead pages)
- Duplicate/synonym-spammed tool variants (one tool per job, or programmatic with genuinely unique value)

## 2. Definition of Done — every tool page must have

- [ ] Working tool logic, tested in browser (correct output + edge cases: empty input, weird chars)
- [ ] Unique H1 in pattern: `Free {Tool} — No Signup, No Limits`
- [ ] Meta title ≤60 chars, meta description ≤158 chars (checked by build)
- [ ] ≥2 unique content sections (what it does / how to use / use cases)
- [ ] 3–5 FAQs with FAQPage schema
- [ ] Copy button on every output; output escapes properly (textContent, never innerHTML)
- [ ] Works on mobile; keyboard-operable
- [ ] Listed on homepage + its category page + related-tools sidebar
- [ ] In sitemap.xml (automatic via build)

## 3. Code rules

- **No frameworks, no npm dependencies.** Vanilla JS + one CSS file. Build = plain Node (`node build.mjs`).
- Runtime JS: classic scripts, no modules (must work on `file://`). Shared registry: `window.T4M_TOOLS[slug] = (root) => {}`; lookup by `#tool-root[data-tool]`.
- All dynamic DOM output via `textContent` / `createElement` — `innerHTML` only for build-time strings from our own data files.
- Element IDs prefixed per tool (`mt-`, `og-`, `pw-`…) — pages are standalone but avoid collisions.
- Every user-facing string in `src/data/*` — no hardcoded copy inside runtime files.
- CSS: use design tokens from design.md; no inline styles except trivial layout tweaks in generated markup.

## 4. SEO & content rules

- One page = one search intent. No cannibalisation: before adding a tool, check it doesn't duplicate an existing page's target keyword.
- Long-tail blog posts always link to their tool; tools link back to 2–3 posts (once blog exists).
- No thin content: if a page can't justify 250+ unique words, it doesn't ship (expand later per `docs/pendingwork.md`).
- Titles/descriptions written for US search intent; avoid India-only phrasing.
- Schema honesty: only mark up what's genuinely on the page.

## 5. Monetization rules

- Ads only in `.ad-slot` positions; never inside the tool interaction flow.
- Apply for AdSense only after: 18 tools + policy pages + 20–30 original articles + 50–100 daily visitors.
- Affiliate disclosures added to any page carrying affiliate links (FTC + AdSense policy).
- Privacy Policy must disclose: cookies, Google AdSense/third-party vendors, Analytics — already drafted in policy.js; update with real ad-account IDs after approval.

## 6. Process rules

- **End-of-task ritual (mandatory):** before finishing any task, open `suggest.md` and `docs/pendingcommit.md`, understand any pending development recorded there, cross-verify it (build + tests), then commit and push it along with your own work. If either file is missing, create/initialize it rather than skipping the step.
- Every structural decision lands in Architecture.md; every feature change updates `docs/pendingwork.md` + `docs/progress.md`. (The trackers moved from the repo root into `docs/` on 30 Oct 2026: `docs/pendingwork.md` supersedes root `pending-work.md`, and `docs/pendingcommit.md` supersedes root `pendingcommit.md`. Root `progress.md` and `worklog.md` remain the historical build logs through 28 Oct and are still read for context.)
- After any change to `src/`, run `node build.mjs` — `dist/` is never hand-edited.
- Test in browser before declaring a tool done (browser-use skill).
- `SITE.url` in build.mjs is now **`https://tools4market.online`** (domain purchased 20 Oct 2026) — the apex is the canonical host; `www` must 301 → apex (zone-level Cloudflare Redirect Rule). Override with the `SITE_URL` build env var if the host ever changes.

## 7. Human-generated standard

Binding for all copy, design and UI work: [`docs/human-generated-human-readable.md`](docs/human-generated-human-readable.md).

That file lists the AI tells we never ship (gradient text, violet gradients, glassmorphism, emoji product icons, decorative numbering, eyebrow-plus-rule on every section, fake proof, anonymous bylines, banned vocabulary), the writing rules, the current site audit with file-level evidence, and the ranked fixes. Read it before writing or restyling any page. Rule IDs from it are valid review comments.

Two of its proposals conflict with existing rules and need an owner decision before we apply them: the fixed H1 pattern in §2 of this file, and the mandatory eyebrow in `design.md` §9. Until that decision is recorded, the existing rules win.

## 8. Metrics we optimise (in priority order)

1. Core Web Vitals (LCP < 1.5s, CLS < 0.05, INP < 200ms)
2. Search impressions growth (GSC, reviewed weekly)
3. Tool completion rate (used → copied output)
4. RPM once ads are live

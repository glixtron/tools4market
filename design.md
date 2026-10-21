# Tools4Market — Design System

*Version: 2.1 "Classic Editorial Utility" · 22 Oct 2026 · Implemented in `src/style.css`*

---

## 1. Design philosophy — a classic, ownable utility brand

The 22 Oct 2026 audit found the site "clean and usable, but closer to a well-made
tool directory than a classic, ownable brand". v2.1 keeps everything that worked
(warm neutrals, real depth, micro-personality, generous spacing) and gives it an
identity you could pick out of a screenshot:

1. **Ink navy on warm paper** — text `#182338` on `#f8f5ee`. Print-like, calm,
   and it makes the brass accent read as deliberate rather than decorative.
2. **Serif display + restrained sans UI** — Fraunces (with its optical size
   axis) for `h1`/`h2`, the wordmark and the editorial numerals; Outfit stays for
   UI sub-heads, labels and card titles; Inter for body. Headlines get a point of
   view; controls stay neutral.
3. **Brass, used sparingly** — eyebrow rules, "used for" lines, the editor's-pick
   clip, numbered markers. Never large fills, never body text.
4. **Thin warm rules instead of shadows everywhere** — `#d8d1c4` hairlines,
   a `3px double` rule under the hero masthead, one `4px` brass edge on the
   feedback band. Depth (`--shadow-*`) is reserved for things that genuinely lift.
5. **Editorial hierarchy** — every homepage section starts with a mono eyebrow +
   rule, then a serif title. Numbers (`01`–`04`) order the categories and jobs.
6. **Proof beside the promise** — the hero's right column is the editor's pick:
   the tool, why it matters this week, and a real output preview. No empty
   atmospheric space.

---

## 2. Color tokens

All defined as CSS custom properties in `:root` of `src/style.css`.

### Backgrounds & surfaces

| Token | Value | Use |
|---|---|---|
| `--c-bg` | `#f8f5ee` | Page background (warm paper) |
| `--c-surface` | `#ffffff` | Cards, inputs, header |
| `--c-surface-2` | `#f3efe6` | Output heads, tinted panels |

### Text

| Token | Value | Use |
|---|---|---|
| `--c-text` | `#182338` | Headings, primary body (ink navy) |
| `--c-text-2` | `#2b3854` | Body paragraphs, secondary content |
| `--c-muted` | `#65707c` | Captions, labels, descriptions |

### Brand

| Token | Value | Use |
|---|---|---|
| `--c-primary` | `#243b63` | Links, buttons, focus rings (deep blue) |
| `--c-primary-2` | `#1a2c4c` | Hover |
| `--c-primary-3` | `#132139` | Active/pressed |
| `--c-primary-soft` | `#e2e7ef` | Soft blue backgrounds |
| `--c-primary-xsoft` | `#eef1f6` | Nav hover, tool-note background |

### Accent (brass)

| Token | Value | Use |
|---|---|---|
| `--c-accent` | `#96682c` | Brass for text/icon accents (4.87:1 on white) |
| `--c-accent-light` | `#e7b45e` | Decorative brass (the pick-card clip) |
| `--c-accent-soft` | `#f4e9d5` | Brass tint backgrounds |

### Borders

| Token | Value | Use |
|---|---|---|
| `--c-border` | `#d8d1c4` | Default hairlines (warm rule) |
| `--c-border-2` | `#c5bda9` | Inputs, stronger separators |

### Semantic & code

| Token | Value |
|---|---|
| `--c-success / --c-success-soft` | `#166534 / #dcfce7` |
| `--c-warn / --c-warn-soft` | `#92400e / #fef3c7` |
| `--c-danger / --c-danger-soft` | `#991b1b / #fee2e2` |
| `--c-code-bg / --c-code-text` | `#182338 / #e9edf5` (navy code blocks) |

**Measured contrast (all ≥ 4.5:1):** text/paper 14.43 · muted/paper 4.63 ·
accent/white 4.87 · primary/white 11.17 · footer link/navy 6.31.

---

## 3. Typography

### Fonts

```css
--font-display: 'Fraunces', Georgia, 'Times New Roman', serif;   /* h1, h2, logo, numerals */
--font-head:    'Outfit', -apple-system, 'Segoe UI', Arial, sans-serif;  /* UI sub-heads, labels */
--font-body:    'Inter', -apple-system, 'Segoe UI', Arial, sans-serif;   /* body */
--font-mono:    ui-monospace, 'SF Mono', Menlo, Consolas, monospace;     /* eyebrows, code */
```

Loaded via one Google Fonts `@import` (Fraunces 600/700 with the `opsz` axis,
Outfit 400–700, Inter 400–600).

### Type scale

| Element | Size | Weight | Font | Note |
|---|---|---|---|---|
| Hero h1 | `clamp(2.1rem, 4.6vw, 3.1rem)` | 700 | Fraunces | Outcome-led, `line-height: 1.08` |
| h1 (tool pages) | `clamp(1.8rem, 3.6vw, 2.5rem)` | 700 | Fraunces | |
| h2 / section title | `1.45rem` / `1.7rem` | 600 | Fraunces | `margin-top: 1.8em` in prose |
| h3 | `1.1rem` | 600 | Outfit | |
| Body | `1rem / 1.65` | 400 | Inter | |
| Eyebrows (mono) | `.72–.74rem` | 400 | Mono | UPPERCASE, `.14em` tracking, brass |
| Labels / chips | `.75–.85rem` | 600–700 | Inter | |
| Code / samples | `.73–.87rem / 1.55–1.65` | 400 | Mono | |

---

## 4. Border radius & shadows

Radius: `--radius: 14px` (cards, shells) · `--radius-sm: 9px` (inputs, buttons) ·
`--radius-xs: 6px` (copy button, code chips).

Shadows (rgba now keyed to ink navy):

```css
--shadow-xs:    0 1px 2px rgba(24,35,56,.05)
--shadow-sm:    0 1px 3px rgba(24,35,56,.07), 0 1px 6px rgba(24,35,56,.05)
--shadow:       0 2px 6px rgba(24,35,56,.08), 0 4px 16px rgba(24,35,56,.06)
--shadow-md:    0 4px 12px rgba(24,35,56,.10), 0 8px 28px rgba(24,35,56,.08)
--shadow-hover: 0 6px 20px rgba(36,59,99,.16), 0 2px 6px rgba(24,35,56,.08)
```

---

## 5. Component inventory

### Header
Sticky, `backdrop-filter: blur(12px)` on white 92%. Wordmark in Fraunces; the
`logo-mark` is a 34px navy→brass gradient tile. Nav hover = soft blue pill.

### Hero (homepage only) — `.hero-grid`
Two columns (`1.15fr / .85fr`, single column ≤1024px): copy + task search left,
`.pick-card` right. Paper background, one hand-placed brass glow, `3px double`
rule at the bottom (the print masthead detail). No stats strip — the hint line
(`30 tools · 4 categories · free forever`) carries the numbers quietly.

### Editor's pick card (`.pick-card`)
White card, brass `::before` clip at the top-left, mono "Editor's pick" label,
serif tool name, one-sentence use case (`.pick-why`), a real output preview in a
navy `.pick-sample` block, category + "used for" meta, and a CTA. The tool
rotates weekly from `EDITOR_PICKS` in `src/data/index.js` (week number picks the
entry, so it changes without a redeploy).

### Job cards (`.job-card`) and outcome cards (`.outcome-card`)
Homepage "start with your job" paths (with brass `01`–`04` numerals) and the four
outcome categories (larger outlined numerals). Both lift on hover like tool cards.

### Tool card (`.tool-card`)
Unchanged geometry, new third line: `.tool-used` — a brass italic "for …" line
describing the job the tool does (data field `usedFor`).

### Tool meta strip (`.tool-meta`)
Under the H1 on every tool page: `USED FOR … · LAST UPDATED 22 October 2026`
(mono brass labels). `updated` is only rendered for pages with a real content
update recorded in their data file.

### Numbered category headers (`.cat-num`)
Directory sections carry a brass serif `01`–`04` before the category name.

### Feedback band (`.home-cta`)
White band with a `4px` brass left edge: "Missing a tool? Found a bug?" and two
CTAs into `/contact/`.

### Cookie banner — deliberately quiet
Slimmer bar (11px padding, `.84rem` text, softer shadow) and `body.ck-open`
reserves bottom padding (118px desktop / 240px mobile) so it never covers the
next section. Removed the moment a choice is stored.

### Footer
Ink navy (`--c-text`) instead of near-black, warm-paper headings, muted blue-gray
links, navy→brass `footer-brand-bar`.

---

## 6. Layout & breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 1024px` | Tool page: 2-col `1fr 300px`; hero: copy + pick side by side |
| `≤ 1024px` | Hero stacks (copy first); tool sidebar full-width below main; footer 2-col |
| `≤ 720px` | Hero type shrinks, pick card padding tightens, cookie banner stacks |
| `≤ 480px` | Nav tightens, footer 1-col, tool shell padding reduces |

Max content width `1180px`; card grids `repeat(auto-fill, minmax(255px, 1fr))`;
easing `--ease: cubic-bezier(.22, 1, .36, 1)`.

---

## 7. Accessibility rules

- Every input has a bound `<label>`; buttons use real `<button>` semantics.
- Focus-visible ring: `2px solid var(--c-primary)`, `outline-offset: 3px`.
- Contrast ≥ 4.5:1 for all text (measured in §2), including brass-on-white.
- Status colours always paired with a text label.
- `aria-live="polite"` on output regions; `aria-hidden="true"` on decorative
  numerals and emoji; the pick card is an `<aside>` with an accessible name.

---

## 8. AdSense / UX guardrails

Unchanged from v2.0: `.ad-slot` placeholders reserve layout space (no CLS), ads
never sit inside the tool interaction area, no fake download buttons, no dark
patterns. Three positions only: top banner, sidebar, below FAQ.

---

## 9. Anti-template checklist

Verify before shipping any design change:

- [ ] Background is warm paper (`#f8f5ee`), not cold gray (`#f9fafb` / `#f3f4f6`)
- [ ] Primary is deep blue `#243b63`, not Tailwind indigo `#4f46e5`
- [ ] Headlines are Fraunces; UI labels are Outfit/Inter — no third sans
- [ ] Brass appears only as accents (eyebrows, numerals, rules, one band edge)
- [ ] Every homepage section opens with a mono eyebrow + rule
- [ ] The hero's right column carries proof (editor's pick + output), not decoration
- [ ] Tool cards keep the `::before` hover accent bar and their "used for" line
- [ ] The cookie banner is slim and reserves page space while visible
- [ ] Footer is ink navy with the navy→brass brand bar

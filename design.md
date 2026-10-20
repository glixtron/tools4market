# Tools4Market — Design System

*Version: 2.0 · 20 Oct 2026 · Implemented in `src/style.css`*

---

## 1. Design philosophy — "Human Tool Aesthetic"

This site must **not** look AI-generated or like a bootstrap template. Every decision is deliberate:

1. **Outfit + Inter** — editorial combination: Outfit (Google Fonts, geometric weight for headings) pairs with Inter (neutral, readable for body). Never system fonts alone.
2. **Warm neutrals, not cold grays** — background `#f5f4f0` (cream-tinted), text `#1a1917` (near-black with warmth). Cold `#f9fafb` grays read as "template."
3. **Organic gradients** — hero uses diagonal blobs placed by eye (12% left, 88% right), not symmetric center-burst gradients.
4. **Gradient text headline** — the H1 on hero uses `-webkit-background-clip: text` for a warm-to-violet sweep. One deliberate statement; not used elsewhere.
5. **Micro-personality** — tool cards have a 3px left accent bar that appears on hover. The footer has a 3px brand gradient bar at the top. These details are invisible at a glance but register subconsciously.
6. **Real depth** — four shadow levels (`--shadow-xs` through `--shadow-hover`) used contextually, not one universal shadow copied everywhere.
7. **Glassmorphism header** — `backdrop-filter: blur(12px)` on sticky header reads as modern/premium, not generic.

---

## 2. Color tokens

All defined as CSS custom properties in `:root` of `src/style.css`.

### Backgrounds & surfaces

| Token | Value | Use |
|---|---|---|
| `--c-bg` | `#f5f4f0` | Page background (warm cream, not cold gray) |
| `--c-surface` | `#ffffff` | Cards, inputs, header |
| `--c-surface-2` | `#faf9f7` | Output head, section backgrounds |

### Text

| Token | Value | Use |
|---|---|---|
| `--c-text` | `#1a1917` | Headings, primary body |
| `--c-text-2` | `#3d3b38` | Body paragraphs, secondary content |
| `--c-muted` | `#6b6760` | Captions, labels, descriptions |

### Brand

| Token | Value | Use |
|---|---|---|
| `--c-primary` | `#5b4fff` | Buttons, links, active states (warmer violet, not indigo) |
| `--c-primary-2` | `#4a3fe6` | Hover state |
| `--c-primary-3` | `#3730d4` | Active/pressed |
| `--c-primary-soft` | `#edeaff` | Pill eyebrow, focus rings |
| `--c-primary-xsoft` | `#f5f3ff` | Nav hover, tool-note background |

### Accent

| Token | Value | Use |
|---|---|---|
| `--c-accent` | `#0ea47a` | Paired with primary in gradients (logo, footer bar) |
| `--c-accent-soft` | `#e6f7f2` | Accent backgrounds |

### Borders

| Token | Value | Use |
|---|---|---|
| `--c-border` | `#e2e0db` | Default borders (warm tint) |
| `--c-border-2` | `#d0cdc7` | Inputs, stronger separators |

### Semantic

| Token | Value | Use |
|---|---|---|
| `--c-success / --c-success-soft` | `#166534 / #dcfce7` | Chip: good |
| `--c-warn / --c-warn-soft` | `#92400e / #fef3c7` | Chip: warn |
| `--c-danger / --c-danger-soft` | `#991b1b / #fee2e2` | Chip: bad |
| `--c-code-bg / --c-code-text` | `#16141f / #e8e3f8` | Code output blocks |

---

## 3. Typography

### Fonts

```css
--font-head: 'Outfit', -apple-system, 'Segoe UI', Arial, sans-serif;
--font-body: 'Inter', -apple-system, 'Segoe UI', Arial, sans-serif;
--font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
```

**Loaded via Google Fonts** (`@import` at top of style.css):
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
```

### Type scale

| Element | Size | Weight | Font | Note |
|---|---|---|---|---|
| Hero h1 | `clamp(2rem, 4.5vw, 3rem)` | 800 | Outfit | Gradient text |
| h1 (tool pages) | `clamp(1.75rem, 3.5vw, 2.4rem)` | 800 | Outfit | |
| h2 | `1.4rem` | 700 | Outfit | `margin-top: 1.8em` |
| h3 | `1.1rem` | 600 | Outfit | |
| Body | `1rem / 1.65` | 400 | Inter | |
| Labels | `.85rem` | 600 | Inter | `letter-spacing: .005em` |
| Captions / chips | `.75–.82rem` | 600–700 | Inter | |
| Code | `.84–.87rem / 1.6` | 400 | Mono | |

---

## 4. Border radius & shadows

### Radius

| Token | Value | Use |
|---|---|---|
| `--radius` | `14px` | Cards, tool shell, policy box |
| `--radius-sm` | `9px` | Inputs, output blocks, buttons |
| `--radius-xs` | `6px` | Copy button, btn-icon |

### Shadows (four levels)

```css
--shadow-xs:    0 1px 2px rgba(26,25,23,.05)
--shadow-sm:    0 1px 3px rgba(26,25,23,.07), 0 1px 6px rgba(26,25,23,.05)
--shadow:       0 2px 6px rgba(26,25,23,.08), 0 4px 16px rgba(26,25,23,.06)
--shadow-md:    0 4px 12px rgba(26,25,23,.10), 0 8px 28px rgba(26,25,23,.08)
--shadow-hover: 0 6px 20px rgba(91,79,255,.14), 0 2px 6px rgba(26,25,23,.08)
```

**Usage map:**
- `--shadow-xs` → tool cards (resting), side-box, output
- `--shadow-sm` → tool shell, hero search input, policy box
- `--shadow-hover` → tool card on hover (coloured glow)

---

## 5. Component inventory

### Header
- Sticky, `backdrop-filter: blur(12px)` on white 92% opacity background
- Logo: `logo-mark` = 34×34px rounded square with diagonal violet-to-green gradient + shadow
- Nav: muted links, hover = `--c-primary-xsoft` bg pill

### Hero (homepage only)
- Layered gradient background: cream→light violet→mint (diagonal, 160deg)
- Three `radial-gradient` blobs via `::before` pseudo-element (hand-placed offsets)
- Eyebrow pill: `hero-eyebrow` — primary color, soft background, border
- H1: gradient text (violet-to-green sweep via `-webkit-background-clip`)
- Stats strip: `hero-stats` → 4 `hero-stat` items with large number + uppercase label

### Tool card (`.tool-card`)
- Resting: white surface, `--c-border` border, `--shadow-xs`
- Hover: lift 3px, `--shadow-hover`, slightly violet border
- `::before` pseudo: 3px left accent bar (violet→green gradient) fades in on hover
- Transition: `cubic-bezier(.22, 1, .36, 1)` — slightly springy

### Category section header (`.cat-header`)
- Flex row: h2 + count pill (`.cat-count`) + right-aligned "View all →" (`.cat-view-all`)

### Tool shell (`.tool-shell`)
- White surface, `--c-border`, `--radius`, `--shadow-sm`
- Inputs: `1.5px` border in `--c-border-2`, focus ring = `3.5px rgba(91,79,255,.12)`
- Select: custom chevron SVG via `background-image`

### Output block
- Header bar: `--c-surface-2` background, `--font-head` uppercase label
- Body: `--c-code-bg` dark background, `--c-code-text` light text
- Copy button: primary → accent on copied state

### FAQ (`.tool-faq details`)
- Native `<details>` / `<summary>` — zero JS
- Custom `+` / `−` indicator via `::after`, no default marker
- Open state: box-shadow appears

### Footer (`.site-footer`)
- Background: `#100f0e` (warmer than pure `#000`)
- Top accent bar: `footer-brand-bar` — 3px linear-gradient(90deg, #5b4fff, #0ea47a)
- Link color: `#8a8480`, hover: `#f0ece4`

---

## 6. Layout & breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 1024px` | Tool page: 2-col grid `1fr 300px` (main + sticky sidebar) |
| `≤ 1024px` | Tool sidebar collapses to full-width below main; footer 2-col |
| `≤ 720px` | Hero shrinks, field-row stacks to 1 col, dynamic rows simplify |
| `≤ 480px` | Nav spacing tightens, footer 1-col, tool shell padding reduces |

- Max content width: `1180px`, centered
- Card grid: `repeat(auto-fill, minmax(255px, 1fr))`
- Transition easing: `--ease: cubic-bezier(.22, 1, .36, 1)`

---

## 7. Accessibility rules

- Every input has a bound `<label>` with matching `for`/`id`
- Buttons use real `<button>` semantics
- Focus-visible ring: `2px solid var(--c-primary)`, `outline-offset: 3px`
- Colour contrast ≥ 4.5:1 for all text on backgrounds
- Status colours always paired with text label (never colour alone)
- `aria-live="polite"` on all `<pre>` and `.output-area` output regions
- `aria-hidden="true"` on all decorative emoji spans

---

## 8. AdSense / UX guardrails

- `.ad-slot` placeholders reserve layout space (no CLS on activation)
- Never inside the interactive tool area
- No fake download buttons, no auto-refresh, no dark patterns
- Ads at three positions only: top banner (above tool), sidebar, below FAQ

---

## 9. Anti-AI-template checklist

Before shipping any design change, verify:

- [ ] Background is warm (`#f5f4f0`), not cold (`#f9fafb` / `#f3f4f6`)
- [ ] Primary is `#5b4fff` (warmer violet), not `#4f46e5` (Tailwind indigo)
- [ ] Hero gradient is diagonal with asymmetric blobs, not centered radial
- [ ] At least one personality detail is present (accent bar, gradient text, brand bar)
- [ ] Tool cards have the `::before` hover accent, not just border-color change
- [ ] Footer is dark with warm near-black (`#100f0e`), not blue-gray (`#1e293b`)
- [ ] Typography uses Outfit for headings, not system font or Roboto

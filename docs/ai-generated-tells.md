# What Makes a Website Look AI-Generated

**Compiled:** 7 November 2026 · **Method:** web research across design studios, practitioners and code-quality studies (sources at the end) · **Scope:** tells in code, design, visuals, styles, UI, typography, layout, margins, spacing and cards, plus what a human-generated alternative looks like in practice.

This is the evidence file behind [`human-generated-human-readable.md`](human-generated-human-readable.md), which remains the binding rulebook. That document says *what we forbid*; this one records *why the tells exist, what they look like at the implementation level, and how to detect them*.

---

## 1. The root cause: averages, not mistakes

Every source converges on the same explanation. A model predicts the most likely next token, and the most likely design is the statistical average of everything published. Shuffle.dev and InterfaceKit both frame the result the same way: **missing product decisions get replaced by familiar defaults** — default layout, default styling, default content. Paralect calls the output "plain but plausible": nothing is broken, nothing is chosen.

This matters for detection. An AI-looking site usually has no bug you can point at. It has:

- no decision that could have gone the other way,
- no constraint that forced an exception,
- no place where the content pushed back on the design.

The industry conversations about Tailwind and shadcn push the same point from the other direction: libraries are not the problem, but when a design system's defaults are never overridden, every product built on it inherits the same silhouette.

**Convergence values.** Across the style guides reviewed, the defaults repeat with startling consistency:

| Decision | The default AI reaches for | Seen in |
|---|---|---|
| Body font | Inter, or Space Grotesk / Geist | Developers Digest, 925 Studios |
| Radius | `16px` on everything, often `rounded-2xl` | 925 Studios, Scanaislop |
| Card padding | `24px`, uniform across card types | 925 Studios |
| Card treatment | border + shadow + radius together, identical on every card | Paralect, Scanaislop |
| Colour | lavender/violet gradient, or purple-to-blue | Paralect, Developers Digest, 925 Studios, GDG/dev.to |
| Hero | centred, with a small badge or pill above the H1 | Developers Digest, Scanaislop |
| Layout | three equal columns, repeated | Paralect, Scanaislop |
| Section wrapper | every block boxed in a rounded card | GDG/dev.to |
| Section label | all-caps eyebrow with letter-spacing | Paralect, TeneX, Developers Digest |
| Icons | emoji, or line icons in identical rounded tiles | Paralect, Scanaislop, Developers Digest |
| Steps | `01 / 02 / 03` decorators with no ordering reason | Developers Digest, Paralect |
| Body copy | 65–75 characters is correct; AI ships wider or narrower | Parix |

---

## 2. Typography and fonts

**Tells**

- **One neutral sans for everything.** Inter has become the "sans-serif" of the generated web. It is not a bad typeface; using it unmodified, for headings and body, with default weights, is the tell. Space Grotesk and Geist signal the same vibe-coded stack.
- **Serif italic accent words** inside sans headlines, used to add "editorial" flavour without an editorial structure.
- **Flat hierarchy**: headings at 1.5× body, subheads at 1.1×, so the page reads as one texture. AI rarely commits to a 2.5–3× jump between H1 and body.
- **No type scale.** Sizes are chosen per component (17px here, 19px there, 1.05rem elsewhere) instead of derived from one ratio. Count the distinct font sizes in a stylesheet; human systems land around 6–8, generated ones drift to 15+.
- **Title Case Headlines** on every heading, or sentence case everywhere, applied mechanically.
- **Low-contrast grey body text** on white (often #6b7280 at 14px), a pattern Developers Digest lists alongside gradients as a default.
- **Letter-spacing applied uniformly**, including on lowercase, which makes eyebrows and headings look manufactured.
- **Fallback failure**: the design only works in the loaded webfont; the system fallback produces different line breaks and a broken hero on slow connections.

**Human alternative**

- One type scale, one ratio (1.2 minor third is common, 1.25 major third is bolder), with documented sizes.
- A deliberate pairing with a reason: a display face for headlines and one workhorse for text, or a single family used at genuinely different optical sizes.
- Headline size that is a decision (e.g. `clamp(2rem, 4vw, 3.25rem)`) rather than a default, and a body size that respects reading distance.
- Contrast at 4.5:1 minimum for body; Parix recommends exactly that as one of its eight decisions.
- Line length controlled with `max-width: 65–75ch` on prose, wider only for tables and data.
- A fallback stack tested with the webfont blocked.

---

## 3. Spacing, margins, gaps and vertical rhythm

This is where generated pages are most detectable in code, and where visitors feel it without naming it.

**Tells**

- **Hard-coded margins instead of tokens.** Emergent's own documentation calls this "spacing drift": one component uses 16px padding, the next 18px, the next 22px, because each was written in isolation. A design system exists in the CSS variables and is ignored in the components. OverlayQA documented the same failure in an AI builder: it generated a design system, then produced a dashboard with the wrong tokens, system fonts and invented colours.
- **Everything on a 24px rhythm.** AI often picks `24px` for padding, gap and margin simultaneously, producing cards that feel inflated and unrelated elements that sit the same distance apart as closely related ones.
- **Uniform gaps everywhere** means hierarchy is carried only by size. Humans vary the gap: 8px inside a label group, 16px between fields, 32px between groups, 96–128px between sections (the spacing scale Parix specifies).
- **Section padding chosen per section** rather than from one vertical rhythm, so the page loses its beat.
- **Uneven optical margins**: icons and text vertically misaligned by 1–3px, cards whose content is centred in one place and top-aligned in another, headings that ignore the container's left edge.
- **No spacing system in the CSS at all** — raw pixel values scattered through rules, no `--space-*` variables, no consistent scale. This is the single easiest tell to detect mechanically (see §13).

**Human alternative**

- A 4px or 8px base scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`, exposed as tokens.
- Section rhythm at 96–128px on desktop, roughly 48–64px on mobile, applied consistently.
- Gap size expressing relationship: tight inside a unit, loose between units, generous between sections.
- One container width for prose, a wider one for data, and no third "just in case" width.
- Optical adjustments kept, not averaged away (icon nudges, hanging punctuation, baseline alignment).

---

## 4. Layout and grid

**Tells**

- **Centred hero → three feature cards → logo strip → testimonial → CTA.** The page order is the template. Visitors have seen it before they read it.
- **Symmetry with no hierarchy**: three equal cards, six equal icons, four equal stats. Equal weight implies equal importance, which is almost never true.
- **Every section is a box.** Content placed inside rounded containers with borders, so the page is a stack of cards rather than a document with structure (GDG/dev.to makes this the central critique).
- **No break in the grid.** Nothing spans two columns, overlaps, hangs into the margin, or is deliberately off-centre. 2026 trend reporting from Envato and Behance describes the human counter-move as asymmetry, broken grids, overlapping elements and "unusual spacing" that reads as authored.
- **Full-bleed images used as decoration**, placed to fill a band rather than to show the product.
- **Hero as a statement of category**, not a statement of the specific job. GDG/dev.to notes that AI sites share hero-section layouts and corporate blue; the fix is to design around the actual content.

**Human alternative**

- Start from the content's shape: one page, one job (Parix's first decision), then let the number of sections follow from the material.
- A layout primitive that is *yours*: a persistent sidebar rule, an asymmetric two-thirds/one-third, a numbered index, an editorial column with a margin note. Developers Digest's fix list names exactly this — pick a unique palette, a unique typeface, and a unique layout primitive.
- Weight where importance is: a wide primary block, a narrow secondary one, a full-bleed moment used once.
- Break the grid once, on purpose, where the argument needs emphasis. Not everywhere.

---

## 5. Cards and components

**Tells**

- **Identical card anatomy**: white surface, 1px border, 16px radius, soft shadow, 24px padding, icon top-left, title, two lines of body. Repeated for features, tools, pricing, testimonials and blog posts, sometimes within the same page.
- **Coloured left stripe** on cards, borrowed from alert styling and applied decoratively (Paralect's first pattern).
- **Border + shadow + radius simultaneously.** Each is a valid signal; all three at once is the "default card" look Scanaislop names with `rounded-2xl shadow-xl`.
- **Nested cards**: a card inside a card inside a section that is also a card (the "cards within cards" pattern noted in practitioner write-ups).
- **Badges and dots with no meaning**: a coloured dot next to "New", an outlined pill above every section, a status chip that conveys nothing.
- **Uniform radius everywhere** — buttons, inputs, cards, modals all 16px — instead of a radius scale where smaller elements get smaller radii.
- **Icon tiles**: every card gets a 40–48px rounded square with a line icon, identical stroke weight, identical placement.
- **Hover-only states**, with no focus, active, disabled or empty states.

**Human alternative**

- Two or three surface treatments with distinct jobs (e.g. a plain block, a ruled list row, one emphasis panel) rather than one card style for everything.
- Radius tied to size: 4–6px controls, 8–10px panels, pills only for tags.
- Either a border or a shadow, chosen for the job. Shadows only where elevation means something (menus, modals).
- Real state design: default, hover, focus-visible, active, disabled, loading, empty, error.
- Components sized by content: a two-line card and a five-line card should not be forced to the same height unless the grid genuinely needs it.

---

## 6. Colour, surfaces and shadows

**Tells**

- Violet-to-blue gradients, especially on the hero background, buttons and gradient text.
- Glassmorphism: translucent white panels, `backdrop-filter: blur()`, on every surface. This exact pattern caused the editor's-pick card on tools4market to render as dark text under a dark overlay in November 2026.
- Glow and neon effects: box-shadows in accent colours, blurred radial blobs behind headings.
- Low-contrast secondary text, and dark mode enabled by default with no light-mode tuning.
- More than one accent colour competing, with no system for when each applies.
- Pure black on pure white, or near-black on near-white with no tonal steps, which flattens depth.

**Human alternative**

- One accent, used sparingly for action and emphasis; Parix lists "one accent colour" among its eight decisions.
- A palette derived from the subject, not from a trend: paper, ink, one signal colour.
- Contrast checked, not eyeballed: 4.5:1 body, 3:1 large text and UI boundaries.
- Shadows reserved for real elevation, with one or two levels.
- Surfaces with tonal steps (paper, raised paper, recessed) instead of transparency effects.

---

## 7. Imagery and icons

**Tells**

- **Emoji as product icons** in navigation and feature cards (Paralect, Scanaislop, Developers Digest all list it).
- **Identical line-icon tiles** generated from one library, at one weight, on every card.
- **Warped AI imagery**: six-fingered hands, melted text, impossible geometry, uncanny skin. Scanaislop calls the generated-image artefacts one of the twelve strongest tells.
- **Placeholder and stock photography** that says nothing about the product: laptops on desks, handshakes, generic cityscapes.
- **Fake screenshots**: dashboards that do not exist, charts with invented numbers, testimonials from "Sarah J." with stock headshots.
- **Text demos instead of the product** (Paralect): a paragraph describing what the UI would show, in place of the UI.
- **Decorative abstractions**: blobs, floating 3D shapes, gradient meshes, used to fill space.
- **No alt text**, or alt text that repeats the filename (Scanaislop lists div soup and missing alt together as code tells).

**Human alternative**

- Real screenshots of the real interface, including the unglamorous parts (empty states, validation errors).
- Photography that shows the work: a desk actually in use, a document actually annotated.
- One authored icon set at one weight, or no icons where text would be clearer.
- Images with purpose and dimensions set, alt text that describes the content rather than the file.
- Evidence that can be checked: dates, version numbers, URLs, numbers with sources.

---

## 8. Motion

**Tells**

- Every section fades and rises on scroll, in sequence, regardless of content.
- Animated counters that count up to statistics nobody sourced.
- Parallax on decorative layers, marquees of company logos, hover wobble on every card.
- Motion on elements that are already visible, so the page performs work the visitor did not ask for.
- No `prefers-reduced-motion` handling.

**Human alternative**

- Motion tied to a change of state: a menu opening, a panel expanding, a result arriving, a table sorting.
- Entrance animation only for content that appears after an interaction.
- One easing curve and two or three durations, used consistently.
- Reduced-motion respected as a first-class path, not an afterthought.

---

## 9. UI behaviour and accessibility

Search and practitioner sources (Sinton, Master.dev, AudioEye) treat accessibility as a structural tell rather than a compliance issue: AI-generated interfaces look finished and fail at the edges.

**Tells**

- Visible only in the happy path: no focus-visible styles, no keyboard order, no skip link, no disabled or error states.
- Buttons that are `div`s with click handlers; links that are `href="#"`; forms that do not submit (Scanaislop's "dead # links" and "pretend forms").
- Modals without focus trapping or escape handling; hamburger menus with no `aria-expanded`.
- Mobile layouts that break between breakpoints rather than at them.
- Slow pages: oversized images, unused dependencies, client-side rendering of static content (Sinton lists loading as a tell).
- Missing SEO fundamentals: no canonical, no descriptions, no structured data, no sitemap (Sinton).

AudioEye reports that five AI tools asked to build 15 accessible sites failed WCAG Level A on every site (the page returned 429 when re-read; treat the figure as reported rather than independently verified here). Master.dev's position is blunter: AI-generated UI is inaccessible by default.

**Human alternative**

- Every interactive element reachable and operable by keyboard, with a visible focus ring that is designed, not defaulted.
- Real form states: validation, success, failure, loading.
- Mobile checked at actual widths, including the awkward ones (360, 390, 540, 768, 1024, 1080, 1280).
- Static content shipped as HTML; JavaScript for behaviour only.
- The boring pages written too: 404, privacy, terms, contact, about.

---

## 10. Copy and structure

**Tells**

- Eyebrow labels above every heading, naming the section that the heading already names.
- Numbered decorations (`01 — Start with your job`) where order carries no meaning.
- Tricolons, hedge stacking, "not only X but Y", "in today's fast-paced landscape".
- Unsourced statistics, invented benchmarks, testimonials with first name and initial.
- FAQ answers that restate the question.
- Metadata written as a formula across every page ("Free X Tool — No Signup, No Limits").
- Placeholder text that survived to production (Scanaislop's strongest tell: `[Your Compelling Headline Here]` proves nobody read the page before launch).
- Pages that exist to rank rather than to answer: thin, near-duplicate, all "updated today".

**Human alternative**

- Specific facts with sources and dates.
- One named author, with a real bio and a reason to trust them.
- Limitations stated plainly; error messages that explain what happened.
- Headings that make claims, not categories.
- Content that could not be swapped onto a competitor's site without becoming false.

---

## 11. Code-level tells

These are the mechanical fingerprints. They are not proof on their own, but they are cheap to measure.

| Tell | What it looks like | Why it happens |
|---|---|---|
| Div soup | `<div>` for headings, navigation, buttons, lists | Training data favours generic wrappers; semantics cost tokens |
| Hard-coded design values | `margin: 18px`, `padding: 22px`, `border-radius: 13px` | Each component generated in isolation, tokens ignored |
| Arbitrary utility values | `mt-[37px]`, `text-[#6b7280]` | Local fix for a spacing system that was never established |
| Inline styles | `style="color:#7c3aed;font-size:19px"` | Fastest path to a visual result |
| Magic numbers | `z-index: 9999`, `width: 1234px` | No layout model |
| Duplicated components | Six near-identical card blocks with copy-pasted classes | Generation per section instead of per component |
| Dead links | `href="#"`, `onclick="return false"` | Placeholder never replaced |
| Missing alt / labels | `<img src="...">`, icon buttons with no accessible name | Visual-only reasoning |
| No focus styles | No `:focus-visible` rule anywhere | Happy-path only |
| Unused dependencies | Large libraries imported for one helper | Default stack carried over |
| No tests | Zero test files, no build checks | Nothing verifies behaviour |
| Placeholder comments | `// TODO: implement`, `<!-- add content -->` | Incomplete generation shipped |
| Layout by fixed pixels | Breakpoints that only work at the design's width | No fluid reasoning |
| System font fallbacks exposed | Missing webfonts render a different design | No fallback decision |

Research on generated code quality points the same direction. CodeRabbit found **1.7× more issues** in AI-generated code than human code; Borusyak et al. reported roughly **30% static-analysis warnings and 41% higher complexity**; Cortex measured a **30% change-failure rate** (figures as summarised by Agile Pain Relief). An ACM study on code smells likewise frames AI code as inheriting problematic patterns from its training corpus rather than inventing them.

**Human alternative**

- Semantic HTML: `header`, `nav`, `main`, `section` with headings, `figure`, `dl`, `button`.
- Every visual value from a token or a scale step.
- Components extracted once and reused; no copy-pasted variants.
- Real states implemented, not described.
- Tests that exercise behaviour, not just rendering.
- No TODO, placeholder, or `#` link in anything that ships.

---

## 12. What "human-generated" actually means

Not "messy", and not "anti-design". The 2026 trend reports describe the human counter-move as **authored asymmetry**: overlapping elements, broken grids, irregular shapes and unusual spacing, all of which only read as intentional when there is a system underneath (Envato, Behance). Anti-design without a system is just a different template.

The reproducible definition, drawn from the sources:

1. **Decisions exist.** A page has one job (Parix), a palette with one accent, a type scale with one ratio, a spacing scale with one base.
2. **Content comes before layout.** The number of sections, the width of a column and the size of a heading follow from the material.
3. **There is a seam.** A named author, a changelog, a limitation, a dated update, an error message written by someone who hit the error.
4. **Evidence is checkable.** Screenshots of the real product, numbers with sources, testimonials that can be verified.
5. **The edges are designed.** Empty, loading, error, disabled, 404, offline, keyboard, reduced motion.
6. **The grid is broken on purpose, once.** Weight is unequal because importance is unequal.
7. **The defaults are overridden.** If the stack ships Inter, 16px radius and `rounded-2xl shadow-xl`, none of those survive unexamined.

The practical test: **delete the page. If nothing of value is lost — no fact, no number, no opinion, no admission — it was generated.** A human page carries constraints it had to work around; a generated page has none because it was never built to do anything.

---

## 13. Detection: commands and thresholds

Run these against the source, not the rendered page, so the answers are stable. Quote globs: zsh expands `*.html` before grep sees it.

```bash
# Font sizes that bypass the token scale (the real metric, not raw count)
grep -rhoE 'font-size:[^;}]+' src/style.css | sed 's/font-size: *//' | sort | uniq -c | sort -rn | head -20

# Radius values that are not tokens, pills or circles
grep -rhoE 'border-radius:[^;}]+' src/style.css | sed 's/border-radius: *//' \
  | grep -vE 'var\(|999px|50%|0' | sort | uniq -c | sort -rn

# Spacing values that are not multiples of 4px, most frequent first
grep -rhoE '(margin|padding|gap)(-[a-z]+)?:[^;}]+' src/style.css \
  | grep -oE '[0-9]+px' | sort | uniq -c | sort -rn \
  | awk '{ v=$2; sub("px","",v); if (v % 4 != 0) print }' | head -15

# Design tokens that actually exist
grep -oE '^\s*--[a-z0-9-]+:' src/style.css | sort -u | wc -l

# Dead links and placeholder text
grep -rn 'href="#"\|TODO\|Lorem ipsum\|\[Your ' dist --include='*.html' | head

# Images without alt
grep -rhoE '<img[^>]*>' dist --include='*.html' | grep -vc 'alt='

# Focus states exist?
grep -c 'focus-visible' src/style.css

# Semantic tags vs divs on one page
grep -rhoE '<(div|section|article|nav|header|footer|main|aside|figure)[ >]' dist/index.html \
  | sort | uniq -c | sort -rn
```

**What the numbers mean.** Raw declaration counts are not a verdict: this site's stylesheet declares 54 distinct font sizes and 23 radii, which sounds alarming until you look at where they come from. Twenty are token references (`var(--radius-sm)` etc.), 26 are pills and circles, and the remaining tail is small optical adjustments. The useful question is **what share of values come from the scale**, not how many values exist.

Alarms worth investigating:

- font sizes in a single component family that do not map to the type scale,
- radius values outside the token set, the pill (`999px`) and circles (`50%`),
- a long tail of spacing values like 13, 18, 22, 26, 30px (drift), as opposed to a few deliberate 2px optical nudges,
- fewer than ~10 design tokens in a stylesheet of this size,
- zero `:focus-visible` rules,
- any `href="#"` in shipped HTML,
- any missing `alt` attribute.

Run the last two before every deploy; they are pass/fail, unlike the rest.

**Two known exceptions on this site.** The only `href="#"` in the build is the footer's cookie-settings trigger, which carries `data-ck-settings` and is intercepted by script. It is still the wrong element: a control that opens a dialog should be `<button type="button">`, so the command above can exclude it with `| grep -v data-ck-settings` until it is changed. Anchor links such as `#s2` in article tables of contents are not dead links and should not be counted.

---

## 14. Pre-ship checklist

- [ ] One type scale, one ratio, documented; every size in a component family maps to it.
- [ ] Spacing from tokens on a 4/8px base; no off-scale margins.
- [ ] Section rhythm consistent (96–128px desktop, 48–64px mobile).
- [ ] Prose measure 65–75 characters; data tables allowed to exceed.
- [ ] One accent colour; contrast ≥ 4.5:1 body, ≥ 3:1 large text and UI edges.
- [ ] Two or three surface treatments, not one card for everything.
- [ ] Radii from a scale; borders or shadows, not both by default.
- [ ] Every interactive element has hover, focus-visible, active, disabled.
- [ ] Real screenshots and real numbers, or no numbers at all.
- [ ] One named author with a bio; dates on every article.
- [ ] 404, privacy, terms, contact and about pages written, not generated as stubs.
- [ ] No emoji product icons, no `01 / 02 / 03` without ordering meaning.
- [ ] Motion tied to state; `prefers-reduced-motion` path exists.
- [ ] Mobile checked at 360, 390, 540, 768, 1024, 1080, 1280.
- [ ] Semantic HTML, alt text, labels, keyboard order, skip link.
- [ ] No dead links, placeholders, TODOs or `href="#"` in `dist`.

---

## 15. What is not evidence

Being precise about this matters, because over-diagnosis is its own kind of slop.

- **Inter alone.** A common typeface is not an AI tell; unexamined use of it is.
- **Minimalism, dark mode, em dashes, gradients, animations, card layouts** individually. Each is a legitimate choice. The tells are in the *cluster* and in the absence of reasons.
- **A clean Lighthouse score.** Performance and accessibility scores measure the parts that are easy to measure; they do not detect a page that says nothing.
- **"Looks modern."** Modern is not a design decision. Averageness is.
- **One tell on its own.** Scanaislop puts it best: one proves little, several together usually mean nobody edited the page.

---

## 16. Sources

Read in full unless marked *(snippet only)*.

- **Paralect — "Signs of AI slop in design: 21 patterns"** — eyebrow labels, coloured card stripes, borders everywhere, monospace inputs, emoji icons, glass cards, uniform radius/shadow, low-contrast grey, decorative motion, fake proof. <https://www.paralect.com/blog/signs-of-ai-slop-in-design>
- **Developers Digest — "AI Design Slop: 16 Patterns"** — Inter, Space Grotesk/Geist, serif italics, lavender-purple, dark mode default, low contrast, gradients, glows, centred hero, badge above H1, coloured card borders, identical icon cards, numbered steps, stat banners, emoji nav, all-caps labels; fix by choosing a unique palette, typeface and layout primitive. <https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it>
- **Scanaislop — "AI Slop Website Examples: 12 Tells"** — placeholder text as the strongest tell, purple-blue gradients, three emoji cards, identical `rounded-2xl shadow-xl` cards, fake testimonials, unsourced stats, dead `#` links, pretend forms, div soup, missing alt text. <https://scanaislop.com/blog/ai-slop-website-examples/>
- **925 Studios — "AI Slop Web Design"** — the concrete defaults: Inter, purple-blue gradients, 16px radius, 24px padding; fix with distinctive type, real photos, semantic colour and purposeful motion. <https://www.925studios.co/blog/ai-slop-web-design-guide>
- **Parix — "Why AI-Generated Pages Look the Same"** — eight decisions: one job per page, content before layout, 8px spacing scale with 96–128px section gaps, obvious type hierarchy, one accent colour, 65–75 character lines, 4.5:1 contrast, delete a third of the content. <https://parix.ai/blog/ai-website-design-decisions/>
- **Sinton — "How to Spot a Vibe Coded Website"** — technical tells: slow loading, shaky mobile layouts, accessibility gaps, missing SEO/AEO basics, weak typography, inconsistent spacing. <https://www.sinton.agency/blog/how-to-spot-a-vibe-coded-website>
- **Emergent — "Design inconsistencies"** — spacing drift from hard-coded margins instead of tokens. <https://help.emergent.sh/design-inconsistencies>
- **OverlayQA — "AI Ignored the Design System It Just Built"** — tokens ignored, system fonts, invented colours *(snippet only)*. <https://overlayqa.com/blog/ai-design-system-drift/>
- **Managed Code / InterfaceKit / Shuffle.dev / Reptile Haus** — the cause: prediction of the most likely design, and missing product decisions replaced by defaults. <https://managed-code.com/blog-post/why-ai-websites-look-the-same> · <https://blog.interfacekit.io/why-ai-generated-websites-all-look-the-same> · <https://shuffle.dev/blog/2026/01/why-do-most-ai-generated-websites-look-the-same/> · <https://reptile.haus/journal/ai-sameness-problem-websites-look-identical-2026/>
- **GDG / dev.to — "Why AI Websites All Look the Same"** — shared purple gradients, rounded cards, sans-serif fonts, hero-section layouts; fix with explicit constraints such as editorial typography and breaking repeated card stacks. <https://dev.to/gdg/why-ai-websites-all-look-the-same-and-how-to-build-something-different-1gan>
- **Agile Pain Relief — "AI-Generated Code Quality"** — CodeRabbit 1.7× more issues; Borusyak et al. ~30% static warnings and 41% higher complexity; Cortex 30% change-failure rate. <https://agilepainrelief.com/blog/ai-generated-code-quality-problems/>
- **ACM — "Evaluating Human- and AI-Generated Code Quality Based on Code Smell"** — AI code inherits problematic patterns from training data *(abstract)*. <https://dl.acm.org/doi/10.1145/3811874.3812123>
- **AudioEye — "AI Coding Tools Fail Basic Accessibility Tests"** — five tools, 15 sites, all failed WCAG Level A *(snippet only; page returned 429 on re-read)*. <https://www.audioeye.com/ai-coding-tools-do-not-write-accessible-code/>
- **Master.dev — "AI-Generated UI Is Inaccessible by Default"** — accessibility failure as a structural property of generated UI. <https://blog.master.dev/ai-generated-ui-is-inaccessible-by-default/>
- **Envato — "Web design trends for 2026"** — asymmetry, broken grids, overlapping elements and unusual spacing as the authored counter-trend. <https://elements.envato.com/learn/web-design-trends>
- **Behance — "Design Trends 2026"** — "visual honesty": rough textures, asymmetry, visible grids. <https://www.behance.net/gallery/239027109/Design-Trends-2026>
- **Le Artist — "Web design trends 2026"** — editorial approach: typography that leads into reading. <https://www.le-artist.cz/en/blog/trendy-webdesignu-2026>
- **Typescale / Brainy — modular type scale references** — one ratio applied to one base size generates every size. <https://typescale.com/> · <https://brainy.ink/paper/modular-type-scale-guide>

# Human-Generated Website Rules

**Status:** binding. Owner decisions on the §8 conflicts recorded 7 Nov 2026: the H1 suffix is now optional (rules.md §2 amended), the per-section eyebrow mandate is withdrawn in favour of L3, and the vendored QR encoder is committed source rather than a dependency.
**Companion:** [`ai-generated-tells.md`](ai-generated-tells.md) records the researched evidence and the mechanical detection rules for every tell in §2.
**Scope:** every page we ship: tool pages, guides, category pages, policy pages, emails.
**Relationship to other docs:** `rules.md` governs what we build and how it is tested. `design.md` governs tokens and layout primitives. This file governs *how the result reads and feels*. Where the three disagree, `rules.md` wins until the conflict in §8 is resolved.

---

## 1. What "looks AI-generated" actually means

The tell is rarely one thing. It is the absence of decisions. A page reads as machine-made when every choice resolves to a default from the same toolchain, and when the copy has no evidence that anyone touched the subject.

Across the sources in §11, the same failure modes recur:

1. **Default stack.** Inter for everything. Purple-to-indigo gradient. Three cards in a row. A generous hero with a subhead and two buttons. These are the statistical mode of generated sites, so they read as absent authorship.
2. **Symmetry without reason.** Every section the same width, same padding, same three-column grid, same eyebrow, same icon row. Real sites are lumpy because real content is lumpy.
3. **No lived specificity.** Claims with no number, no date, no named source, no first-hand observation. "Powerful", "seamless", "built for modern teams".
4. **Uniform rhythm.** Every sentence 15 to 22 words. Every paragraph three sentences. Every list item the same length. Human writing is uneven.
5. **Borrowed trust.** Fake logos, invented testimonials, round-number statistics, an author called "Editorial Team", reviews with no reviewer.
6. **Decoration standing in for design.** Gradient orbs, glass panels, cursor glow, sparkle icons, scroll fade-ins. Motion that announces itself instead of explaining anything.

Our job is not to be deliberately ugly or artificially rough. It is to make choices that a person would make and a generator would not bother to make, and to leave visible evidence of work.

---

## 2. Hard rules: never ship

Each rule has an ID. Cite the ID in review comments.

### Typography (T)

- **T1 — No gradient text.** Not on headings, not on the logo, not on a single word. Gradient text is the single most recognised generated-design marker.
- **T2 — No default-AI families as the whole identity.** A stack of Inter only, or Fraunces/Playfair plus Inter, is the standard generated pairing. We may use a familiar face for body text, but at least one choice per page must be identifiably ours (our display face, our scale, our rules).
- **T3 — Maximum two families plus one mono.** Display plus body. A third family needs a written reason.
- **T4 — Body measure 60 to 78 characters.** Line height 1.5 to 1.7 for body. No full-width paragraphs on desktop over 900px.
- **T5 — No all-caps with wide tracking as a section device.** If it appears, it is a label, not a heading, and not on every section.
- **T6 — No 700 weight everywhere.** Hierarchy comes from size and space first, weight second.
- **T7 — Headings must not be sentence fragments stacked as parallel triads.** "Fast. Private. Free." as three separate H2s is a generated rhythm.

### Colour and surface (C)

- **C1 — No violet, indigo, or blue-purple gradients.** Navy and slate are not violet; check the hex.
- **C2 — No glassmorphism.** Blurred translucent panels over gradients or photos.
- **C3 — No glow, neon, or coloured drop shadows** around buttons, cards, or text.
- **C4 — No mesh gradients, gradient blobs, or floating orbs** as background decoration.
- **C5 — No grain or noise overlay** used to disguise a flat generated layout. Texture must come from real imagery or paper stock, not an SVG filter.
- **C6 — At most one gradient surface per viewport,** and only where it carries meaning (for example a data panel). Not on every card.

### Layout and components (L)

- **L1 — No row of exactly three icon cards** as the primary feature explanation. If a page needs three points, vary the presentation: one long paragraph with a strong lead, a definition list, a two-column comparison.
- **L2 — No decorative numbering** (`01`, `02`, `03`) on sections or categories unless the sequence carries information (steps in a process, ranks in a result).
- **L3 — No eyebrow label plus rule above every section.** One eyebrow on a page is a device; six is a template.
- **L4 — No identical card heights used to hide uneven content.** If a card's content is shorter, let it be shorter or write more.
- **L5 — No bento grid** as the default feature layout.
- **L6 — No hero that is only headline, subhead, two buttons, and a screenshot.** The first screen must contain something only we could show: a real number, a real screenshot with a caption, a limitation.
- **L7 — No centred body text** longer than two lines. Centre headlines, never paragraphs.
- **L8 — At least one asymmetric element per page** at desktop widths: an image that breaks the grid, a table that is wider than the text column, a pull quote offset to one side. Symmetry everywhere is a generated signature.
- **L9 — No cookie-cutter section spacing.** Sections separated by content and rules, not by the same 96px padding six times.

### Iconography and imagery (I)

- **I1 — No emoji as product iconography.** A rocket for launch, a robot for AI, a pen for writing. Emoji render differently per OS, carry no craft signal, and are the most common shortcut in generated pages.
- **I2 — One icon system.** Single stroke weight, single corner radius, single grid. Never mix emoji, filled icons, outline icons, and unicode glyphs on one page.
- **I3 — No sparkle or "AI" iconography** anywhere in the interface.
- **I4 — No AI-generated stock photography** of people at laptops, handshakes, glowing brains, or abstract data streams.
- **I5 — No fake product UI.** No invented dashboard screenshots, no mock charts presented as real data.
- **I6 — No invented avatars.** Initials in coloured circles standing in for people who do not exist.
- **I7 — Every image needs a reason and a caption** where it carries information. Decorative images should be genuinely decorative and marked as such.

### Motion (M)

- **M1 — No scroll-triggered fade-in or slide-up on content.** Content is visible when it loads.
- **M2 — No parallax, cursor followers, or hover tilt.**
- **M3 — No animated counters.** A number that counts up is decoration; print the number.
- **M4 — No looping background video or animated gradient.**
- **M5 — Motion budget:** page transitions and hovers only, under 200ms, and honour `prefers-reduced-motion`. Our current baseline of two keyframes and 27 transitions is the ceiling, not the target.

### Trust and content structure (S)

- **S1 — No invented social proof.** No "trusted by", no logo walls, no review counts, no user totals we cannot evidence.
- **S2 — No fake statistics.** "87% of marketers say" without a source is a fabrication.
- **S3 — No unnamed author.** "Editorial Team" is not an author. See §5.
- **S4 — No auto-bumped dates.** A "last updated" stamp must correspond to a substantive edit, recorded in a changelog.
- **S5 — No keyword-stuffed FAQ.** An FAQ entry that restates the question and answers "yes, it depends" is filler; it damages the page more than an absent FAQ.
- **S6 — No testimonial we did not collect,** and no paraphrase of one.

---

## 3. Writing rules (W)

These apply to every string in `src/data/*.js`. They are the rules most likely to be violated by a well-meaning generated draft.

### W1 — Banned vocabulary

Do not use these in our voice. Some are legitimate in a quotation or a source title; none belong in our own sentences.

| Banned | Why it reads generated | Use instead |
|---|---|---|
| delve, dive into | classic model filler verb | look at, read, work through |
| seamless, seamlessly | claims integration without saying what integrates | name the two things that connect |
| robust | says nothing about failure modes | say what it survives, or cut |
| leverage (verb) | corporate filler | use |
| elevate, empower, unlock | marketing abstraction | say the concrete outcome |
| comprehensive, complete guide | self-praise, usually untrue | say what is covered and what is not |
| cutting-edge, state-of-the-art | undated claim | name the version or date |
| game-changer, revolutionary | unearned superlative | describe the change |
| landscape, realm, space (figurative) | vague container noun | name the actual field |
| navigate the complexities | stock phrase | name the specific problem |
| in today's fast-paced world | pure filler | delete the sentence |
| it's not just X, it's Y | the most recognisable generated cadence | state Y, then state why |
| whether you're a X or a Y | formulaic audience flattery | address one reader |
| harness, foster, facilitate | hollow verbs | use, help, run |
| myriad, plethora | quantity without number | give the number |
| pivotal, crucial | importance asserted, not shown | show the consequence |

Current counts in `src/data/` are clean on the worst offenders (delve 0, seamless 0, robust 0, elevate 0, empower 0, leverage 0, cutting-edge 0). Residual: `unlock` 3, `not just` 5, `comprehensive` 1. Clean these during normal edits; do not mass-rewrite.

### W2 — Em dash budget

Maximum one em dash per 150 words of body copy, and never two in one paragraph. Use a comma, colon, semicolon, or full stop. Parentheses are allowed. This is a rhythm rule, not a punctuation taboo: the problem is the uniform clause-plus-em-dash-plus-restatement construction that models produce.

`src/data/` currently holds 969 em dashes. That is a symptom, not a crime, but pages being edited for other reasons should have their dash count halved, starting with the highest-impression pages.

### W3 — Rhythm

- Vary sentence length. In every three paragraphs, at least one sentence must be under eight words.
- Do not make every paragraph three sentences. Use one-sentence paragraphs for emphasis where it is earned.
- Do not open three consecutive paragraphs with the same part of speech ("This tool…", "This tool…", "This tool…").
- Read the page aloud. If it sounds like a product brochure, rewrite the first sentence of each section.

### W4 — Specificity

Every factual claim needs one of: a number, a date, a named source, or a first-hand observation. "Fast" is not a claim. "Parses a 4 MB file in about 120 ms on a 2021 MacBook Air" is. If we have not measured it, we do not say it.

Corollary: no precision we did not measure. Do not write "87%" because it sounds researched.

### W5 — No tricolon padding

"Fast, free, and private" is acceptable once per page if all three are true and load-bearing. A second triad on the same page is filler.

### W6 — No hedge stacking

"may potentially help to improve" is one hedge too many. Pick one: may, can, or will, and only if it is true.

### W7 — First person requires a person

Do not write "we" unless the page names who "we" is and that person can be reached. See §5. Anonymous first-person plural is a generated-site habit.

### W8 — Titles and headings

- No "Ultimate Guide", "Everything You Need to Know", "The Complete Guide to".
- No year appended without a reason (a genuine annual update is a reason; `(2026)` on a page unchanged since 2024 is not).
- Headings should be answerable questions or specific nouns, not slogans.
- Do not repeat the focus phrase in three consecutive headings.

### W9 — Show the seams

Every substantial page should contain at least one of:
- a limitation ("this cannot see pages blocked by robots.txt");
- a disagreement with common advice, with the reason;
- a note about what changed and when;
- a cost or trade-off ("this adds about 12 KB to the page").

Honesty is the hardest thing to fake at scale and the strongest human signal we have.

### W10 — FAQ answers must answer

First sentence answers the question. Then the caveat, then the source. Never open with "Great question" or restate the question as a statement. If the honest answer is "it depends", the next clause must say on what.

---

## 4. Design rules beyond the hard bans

These are the positive obligations that replace what §2 forbids.

1. **One committed identity per page.** A page should be recognisable with the logo covered. For us that means warm paper, navy ink, brass rules, the Fraunces display face, and visible measurement. Keep them consistent.
2. **Let content set the width.** A table of redirect codes may run wide. A 300-word explanation should not. A definition list should be narrower than a prose block.
3. **Use rules and whitespace for grouping, not boxes.** Fewer containers, more alignment. A hairline rule at the section head does more than a card with a shadow.
4. **Every number must be real and visible.** Where we have measured something, show it in the interface, with the date and method. This is the opposite of an animated counter.
5. **Photography over illustration.** One real photograph outperforms ten vector blob scenes. Our hero uses a real photo (`src/assets/hero_scene.jpg`); keep extending in that direction.
6. **Density is allowed.** Generated pages are uniformly airy because the model has no idea what matters. A dense comparison table that helps is more human than three airy cards that do not.
7. **Idiosyncrasy in small doses.** A house rule about how we write dates, a consistent aside style, a recurring note format. Small consistent oddities read as authorship.

---

## 5. The author problem (highest-leverage fix)

All 24 guides currently carry `author: 'Tools4Market Editorial'` and `reviewer: 'Tools4Market'` (`src/data/blog.js`), and the article schema emits `author: { '@type': 'Organization', name: a.author }` (`build.mjs:911`). That is the exact pattern §2 S3 bans, and it removes the strongest available signal of human work.

Required changes, in order:

1. **Name a real person** as author on every guide. Use a real human who did the work. If the only person is the founder, the byline says the founder's name.
2. **Author page** at `/authors/<slug>/` with: name, photograph, one paragraph on what they actually do, links they control (GitHub, LinkedIn, personal site), and a list of their guides and tools.
3. **Person schema** in the article JSON-LD, with `sameAs` links, and `reviewedBy` where a second person reviewed it.
4. **Byline shows the human**, with a link to the author page. Keep "Reviewed by" only when a second person actually reviewed the page.
5. **Do not invent credentials.** If the author is not a "certified SEO consultant", the bio does not say so. State what they built and tested.

This is also the cheapest E-E-A-T improvement available to the site, and it applies to every guide at once.

---

## 6. Current site audit, 5 November 2026

Evidence was read from the working tree, not from reports.

| # | Item | Evidence | Verdict | Action |
|---|---|---|---|---|
| 1 | 58 emoji icons as product/category marks | `icon:` fields in `src/data/*.js`, rendered at `build.mjs:397`, `build.mjs:726` | **Fail** (I1) | Replace product icons with one custom SVG set, highest-traffic tools first |
| 2 | 24/24 guides by "Tools4Market Editorial", Organization schema | `src/data/blog.js:11`, `build.mjs:875`, `build.mjs:911` | **Fail** (S3) | Named author, author page, Person schema (§5) |
| 3 | Word count printed in article meta | `build.mjs:875` | Risk | Remove; it signals volume over substance |
| 4 | Decorative `01`/`02`/`03` section numbers and category numbers | `build.mjs:588`, `build.mjs:603`, `build.mjs:644`, `build.mjs:652` | **Fail** (L2) | Drop the counters; keep the section titles |
| 5 | Eyebrow plus rule on every homepage section | `src/style.css:833`, `build.mjs:588` and following | Risk (L3) | Keep one, vary the rest |
| 6 | 47/47 H1s begin `Free ` | `src/data/*.js`, mandated by `rules.md:18` | Risk (T7, §8) | Owner decision on varying the pattern |
| 7 | Body text is Inter throughout | `src/style.css:73` onward | Risk (T2) | Evaluate one humanist text face for body only, measured against LCP |
| 8 | Fraunces plus Outfit plus Inter | `src/style.css:7` | Risk (T2) | Keep Fraunces as the identity; do not add a fourth family |
| 9 | Navy hero gradient, warm card gradients | `src/style.css:426` to `428` | Pass (C1) | None; it is not violet and stays subtle |
| 10 | Header and footer use `backdrop-filter: blur()` | `src/style.css:518`, `2395` | Minor tell (C2) | Reduce blur or switch to solid on scroll |
| 11 | 969 em dashes in data copy | `src/data/*.js` | Risk (W2) | Halve dash count on pages edited for other reasons, highest impressions first |
| 12 | AI vocabulary | `delve` 0, `seamless` 0, `robust` 0, `elevate` 0, `empower` 0, `leverage` 0; `unlock` 3, `not just` 5, `comprehensive` 1 | Pass, minor residue (W1) | Fix in passing |
| 13 | Real hero photograph | `src/assets/hero_scene.jpg`, `build.mjs:492` | Pass (I4) | Add more real photography |
| 14 | Stated limitations and primary-source links | Website audit and guide sections | Pass (W9) | Keep; make it a rule for new pages |
| 15 | RSS feed, real inbox, custom 404, testing standards | `build.mjs:340`, `1156`; `src/data/policy.js:35` | Pass | Keep visible in the footer |
| 16 | No fake testimonials, logos, or statistics | Full-tree check | Pass (S1, S2) | Do not add any without evidence |
| 17 | Restrained motion, two keyframes, no scroll effects | `src/style.css` | Pass (M) | Hold the ceiling |
| 18 | Nested anchor tag on the contact page | `src/data/policy.js:35` | Bug | Fixed in this change |

Summary: the underlying identity is more human than the average generated site. The failures are concentrated in the template layer: emoji icons, anonymous editorial byline, uniform eyebrows, and decorative numbering. Fixing items 1, 2, 4, and 3 removes most of the machine signature without touching the palette or the tool experience.

---

## 7. Human signals to add

Ranked by signal strength per hour of work.

**P1 — Named authorship.** Author page, Person schema, real bios, visible bylines (§5).

**P1 — Custom icon set.** One 24px grid, 1.5px stroke, drawn for our 47 tools. Start with the twelve tools that receive the most impressions. Emoji disappear from product surfaces. Category marks can become typographic instead of pictorial.

**P2 — Test and review stamps with substance.** A line under each tool: "Tested in Chrome 141 and Safari 26 on 3 Nov 2026. Last change: added CSV export." Driven by a real per-tool changelog, not a date field that updates itself.

**P2 — Remove volume theatre.** No word count in the byline, no section counters, fewer repeated eyebrows.

**P2 — A public changelog.** `/changelog/`, newest first, one line per shipped change. It is cheap, it is dated, and it cannot be faked by a template.

**P3 — One first-party experiment per guide cluster.** For example: change CLS on a test page, measure before and after with our own audit, publish the numbers and the screenshots. Even a small original result outranks a summary of Google's documentation.

**P3 — Colophon.** `/colophon/` listing the typefaces and why, the stack (vanilla JS, no framework, no build dependencies), who runs the site, and how corrections are handled. This is a classic human artefact and costs one page.

**P3 — Corrections policy.** A visible errata note on guides that have been corrected, and a line in the footer: "Found an error? Email support@… and we will fix it and note the change."

**P3 — Body typeface evaluation.** Test one humanist serif or sans for body text at the same size and measure LCP and reading comfort before deciding. Do not change fonts on a hunch.

---

## 8. Conflicts resolved (7 November 2026)

1. **`rules.md` §2 H1 pattern — resolved.** The H1 must contain the exact search phrase and `Free` where true, and must say what the tool does in its own words. The shared `No Signup, No Limits` suffix is gone from all 47 pages (7 Nov 2026); no page's target phrase changed.
2. **`design.md` §9 eyebrow mandate — resolved.** The mandatory eyebrow plus rule on every homepage section is withdrawn. L3 applies: at most one eyebrow per page.
3. **`rules.md` §3 "no npm dependencies" — resolved.** No installed packages and no framework. A licensed, vendored browser library loaded only on the page that needs it is permitted; `src/vendor/qrcode.js` stays.

---

## 9. Enforcement

### Pre-ship checklist (every page)

- [ ] No gradient text, no violet gradient, no glassmorphism, no glow, no blobs
- [ ] No emoji in product iconography; one icon system only
- [ ] No decorative numbering; no eyebrow on more than one section
- [ ] No three-icon-card row as the main explanation
- [ ] No scroll animation, parallax, cursor effect, or animated counter
- [ ] No banned vocabulary from W1
- [ ] Em dash count under the W2 budget
- [ ] At least one specific number, date, source, or first-hand note (W4)
- [ ] At least one stated limitation or trade-off (W9)
- [ ] Byline names a real person, with a working author page (§5)
- [ ] Dates reflect real edits, not an auto-bump
- [ ] FAQ answers answer in the first sentence (W10)

### Automated checks (proposed)

Add `scripts/check-human.mjs`, wired as `npm run check:human`. It should report, not block, until the baseline is clean:

1. Banned-phrase scan across `src/data/*.js`, with a counted list.
2. Em dash density per page, flagged above one per 150 words.
3. Any `icon:` value that is an emoji code point.
4. Any `author` value matching `/editorial|team|staff/i`.
5. Duplicate H1 openings across more than 40% of pages.
6. CSS scan for `background-clip: text`, `backdrop-filter`, `@keyframes` count, `filter: blur` on decorative elements.
7. Presence of `words ` in the article meta output.
8. Presence of `01`-style `<span class="sec-num">` or `cat-num`.

Promote a check to blocking only after the site has been clean for two consecutive releases.

### Review cadence

- Per release: run the checklist on every page touched.
- Monthly: read three random pages aloud, one tool, one guide, one policy page. Reading aloud catches rhythm that reading silently does not.
- Quarterly: re-run this audit and update §6 with new evidence.

---

## 10. What we deliberately do not do

- We do not add artificial imperfection (fake handwriting, fake stains, deliberately misaligned elements). Manufactured roughness is its own template.
- We do not claim human authorship we cannot evidence.
- We do not chase every trend in the sources below. The point is to remove defaults, not to adopt a new uniform.
- We do not rewrite 1,000 strings in one pass. Changes follow traffic and touch, so the site stays stable and each change can be checked.

---

## 11. Sources

Research read for this document, November 2026. Claims about AI tells are attributed to these; the site-specific audit is our own.

- SCALR, "20 Signs a Website Was Made by AI": https://scalr.sg/blog/20-signs-a-website-was-made-by-ai/
- 925 Studios, "AI Slop Web Design": https://www.925studios.co/blog/ai-slop-web-design-guide
- TeneX Studio, "AI slop: 8 signs": https://tenex.studio/en/blog/ai-slop-8-signs/
- Brad Hussey, "How to make an AI-built website not look AI generated": https://bradhussey.ca/web-design/make-ai-built-website-not-look-ai-generated/
- The Conversation, "Too many em dashes? Weird words like 'delves'?": https://theconversation.com/too-many-em-dashes-weird-words-like-delves-spotting-text-written-by-chatgpt-is-still-more-art-than-science-259629
- Showit, "How to Make Your Website Feel Human": https://showit.com/business-growth/what-makes-a-website-feel-human-and-why-ai-cant-fake-it/
- Managed Code, "Why AI-generated websites all look the same": https://managed-code.com/blog-post/why-ai-websites-look-the-same
- Unpromptable, "5 AI Website Design Tips": https://unpromptable.substack.com/p/5-ai-website-design-tips-for-websites

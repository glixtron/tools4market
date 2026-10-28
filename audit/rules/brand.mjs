// audit/rules/brand.mjs — the advertising promise, checked structurally.
//
// The homepage FAQ makes a public claim: "Ads are placed in reserved spaces
// around the tools and never inside the tool itself, so the layout never shifts
// and the interaction area stays clean." That is three testable statements, and
// this module tests all three against character offsets in the served document.
//
// Written after 27 Oct 2026, when a deploy shipped a build with no loader and no
// units at all: every page looked clean, and the revenue simply stopped. Nothing
// in the pipeline noticed, because no check compared the page to the config.

export const rules = [
  {
    id: 'ad-inside-tool',
    group: 'brand',
    severity: 'blocker',
    test(p) {
      const shell = p.regions.toolShell;
      if (!shell) return null;
      const inside = [
        ...p.ads.units.map((u) => ({ kind: 'unit', at: u.offset })),
        ...p.ads.divs.map((d) => ({ kind: 'slot', at: d.offset })),
      ].filter((a) => a.at > shell.start && a.at < shell.end);
      if (!inside.length) return null;
      return {
        message: `${inside.length} ad element(s) inside the tool shell`,
        fix: 'The homepage FAQ promises ads never sit inside the tool. Move the slot above the shell or below it in build.mjs — this is a published claim, not an internal preference.',
        evidence: { shell, inside },
      };
    },
  },
  {
    id: 'ad-placeholder-chrome',
    group: 'brand',
    severity: 'minor',
    test(p) {
      if (!/Ad space/i.test(p.text.body)) return null;
      return {
        message: 'Placeholder chrome ("Ad space…") is rendered',
        fix: 'An unset slot should reserve height and show nothing. Dashed boxes read as an unfinished site — see build.mjs `adSlot()` and `.ad-slot--empty` in src/style.css.',
      };
    },
  },
  {
    id: 'ad-slot-empty-with-unit',
    group: 'brand',
    severity: 'major',
    test(p) {
      const emptyDivs = p.ads.divs.filter((d) => d.empty);
      if (!emptyDivs.length || !p.ads.units.length) return null;
      return {
        message: `${emptyDivs.length} slot(s) marked empty while ${p.ads.units.length} unit(s) render`,
        fix: 'The empty marker is decided at build time from the slot id. If a unit renders in a slot flagged empty, the two branches in `adSlot()` disagree.',
      };
    },
  },
  {
    id: 'adsense-loader-once',
    group: 'brand',
    severity: 'blocker',
    test(p) {
      if (p.ads.loaderCount === 1) return null;
      return {
        message: p.ads.loaderCount === 0 ? 'AdSense loader missing' : `AdSense loader appears ${p.ads.loaderCount} times`,
        fix: 'Exactly one loader per page, in <head>. Zero means the build ran without the AdSense environment (see the guard in build.mjs); more than one means it is being emitted per template as well as in the shared head.',
      };
    },
  },
  {
    id: 'ad-unit-count',
    group: 'brand',
    severity: 'blocker',
    test(p, ctx) {
      const expected = ctx.expectedUnits(p.path);
      if (expected === null) return null; // config unknown, nothing to compare
      if (p.ads.units.length === expected) return null;
      return {
        message: `${p.ads.units.length} ad unit(s) served, ${expected} configured`,
        fix: 'The served page must match the environment that built it. A shortfall means a deploy from a shell without .env sourced, or a template branch that skipped the slot. Compare `.env` with `npx wrangler deployments status`.',
        evidence: { slots: p.ads.units.map((u) => u.slot), expected },
      };
    },
  },
  {
    id: 'ad-client-matches',
    group: 'brand',
    severity: 'major',
    test(p, ctx) {
      if (!ctx.env.client) return null;
      for (const u of p.ads.units) {
        if (u.client && u.client !== ctx.env.client) {
          return {
            message: `Unit uses client ${u.client}, expected ${ctx.env.client}`,
            fix: 'Wrong publisher id serves nothing and can trip policy review. Emit it from the same constant as the loader.',
          };
        }
      }
      return null;
    },
  },
];

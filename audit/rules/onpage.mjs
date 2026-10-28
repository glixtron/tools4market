// audit/rules/onpage.mjs — title, description, headings, social cards.
//
// Lengths come from catalog.json, which mirrors tests/seo-audit.mjs. Where those
// two disagree, the source-data audit wins and this file is the one to change.

export const rules = [
  {
    id: 'title-length',
    group: 'onpage',
    severity: 'major',
    test(p, ctx) {
      const { titleMin, titleMax } = ctx.catalog.onpage;
      const n = (p.title || '').length;
      if (n >= titleMin && n <= titleMax) return null;
      return {
        message: `Title is ${n} chars (want ${titleMin}–${titleMax})`,
        fix: n < titleMin
          ? 'Too short wastes the strongest ranking surface. Add the specific job and a qualifier, not adjectives.'
          : 'Too long is truncated in results, usually mid-phrase. Cut the least informative clause; keep the focus phrase early.',
        evidence: { title: p.title },
      };
    },
  },
  {
    id: 'desc-length',
    group: 'onpage',
    severity: 'major',
    test(p, ctx) {
      const { descMin, descMax } = ctx.catalog.onpage;
      const n = (p.description || '').length;
      if (!p.description) return { message: 'No meta description', fix: 'Add metaDesc to this entry in src/data.' };
      if (n >= descMin && n <= descMax) return null;
      return {
        message: `Description is ${n} chars (want ${descMin}–${descMax})`,
        fix: 'Write to 120–155 characters: fits desktop in full and most mobile snippets. Below ~70 Google usually pulls a sentence from the page instead.',
        evidence: { description: p.description },
      };
    },
  },
  {
    id: 'h1-count',
    group: 'onpage',
    severity: 'major',
    test(p, ctx) {
      const { h1Min, h1Max } = ctx.catalog.onpage;
      if (p.h1.length >= h1Min && p.h1.length <= h1Max) return null;
      return {
        message: `${p.h1.length} h1 element(s)`,
        fix: 'Exactly one h1 per page. A second h1 usually means a section heading was written as h1 in the template.',
        evidence: { h1: p.h1.map((h) => h.text) },
      };
    },
  },
  {
    id: 'heading-order',
    group: 'onpage',
    severity: 'minor',
    test(p) {
      const hs = p.headings.filter((h) => h.level <= 3);
      for (let i = 1; i < hs.length; i++) {
        if (hs[i].level > hs[i - 1].level + 1) {
          return {
            message: `Heading jumps h${hs[i - 1].level} → h${hs[i].level} at "${hs[i].text.slice(0, 40)}"`,
            fix: 'Do not skip a level. An h3 directly under an h2 is fine; an h3 directly under an h1, or h4 under an h2, breaks outline parsing for screen readers and for passage extraction.',
          };
        }
      }
      return null;
    },
  },
  {
    id: 'og-complete',
    group: 'onpage',
    severity: 'minor',
    test(p) {
      const missing = ['title', 'description', 'type', 'url', 'image', 'imageAlt'].filter((k) => !p.og[k]);
      if (!missing.length) return null;
      return {
        message: `Open Graph missing: ${missing.join(', ')}`,
        fix: 'All six are emitted in the shared head in build.mjs. A gap means this template bypasses it.',
      };
    },
  },
  {
    id: 'twitter-complete',
    group: 'onpage',
    severity: 'minor',
    test(p) {
      const missing = ['card', 'title', 'description', 'image'].filter((k) => !p.twitter[k]);
      if (!missing.length) return null;
      return { message: `Twitter card missing: ${missing.join(', ')}`, fix: 'Same shared head in build.mjs — add the missing tag there, not per page.' };
    },
  },
  {
    id: 'og-image-dimensions',
    group: 'onpage',
    severity: 'info',
    test(p) {
      if (!p.og.image) return null;
      if (p.og.imageWidth === '1200' && p.og.imageHeight === '630') return null;
      return {
        message: `og:image declared as ${p.og.imageWidth || '?'}×${p.og.imageHeight || '?'}`,
        fix: 'Declare 1200×630. Declared dimensions decide the card layout before the image loads; a wrong pair can crop the title.',
      };
    },
  },
];

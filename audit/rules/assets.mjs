// audit/rules/assets.mjs — weight, images and anything that blocks the first paint.

export const rules = [
  {
    id: 'img-alt',
    group: 'assets',
    severity: 'major',
    test(p, ctx) {
      if (!ctx.catalog.assets.imgAltRequired) return null;
      const missing = p.images.filter((i) => i.alt === null);
      if (!missing.length) return null;
      return {
        message: `${missing.length} image(s) without alt`,
        fix: 'Decorative images take alt="" (explicitly empty) so a screen reader skips them; meaningful ones describe the thing, not the file.',
        evidence: { sources: missing.slice(0, 3).map((i) => i.src) },
      };
    },
  },
  {
    id: 'img-dimensions',
    group: 'assets',
    severity: 'minor',
    test(p) {
      const missing = p.images.filter((i) => i.width === null || i.height === null);
      if (!missing.length) return null;
      return {
        message: `${missing.length} image(s) without width/height`,
        fix: 'Declare intrinsic dimensions. Without them the browser reflows when the image loads, which is the layout shift CLS measures.',
        evidence: { sources: missing.slice(0, 3).map((i) => i.src) },
      };
    },
  },
  {
    id: 'html-weight',
    group: 'assets',
    severity: 'minor',
    test(p, ctx) {
      const max = ctx.catalog.assets.htmlMaxBytes;
      if (p.bytes <= max) return null;
      return {
        message: `HTML is ${(p.bytes / 1024).toFixed(0)} KB (want ≤${(max / 1024).toFixed(0)} KB)`,
        fix: 'The document is the one asset that cannot be cached away. Most of this is inline JSON or a duplicated block — check what build.mjs renders twice before compressing anything.',
      };
    },
  },
  {
    id: 'render-blocking-script',
    group: 'assets',
    severity: 'minor',
    test(p) {
      if (!p.renderBlocking.length) return null;
      return {
        message: `${p.renderBlocking.length} render-blocking script(s)`,
        fix: 'Add defer or async, or inline the few lines that must run before paint. Third-party beacons must never be synchronous.',
        evidence: { scripts: p.renderBlocking.slice(0, 3) },
      };
    },
  },
  {
    id: 'h1-missing',
    group: 'assets',
    severity: 'major',
    test(p) {
      if (p.h1.length) return null;
      return { message: 'No h1 on the page', fix: 'Every page needs one visible h1 that matches its purpose. Hero text set in a div is invisible to outline parsing.' };
    },
  },
  {
    id: 'skip-link',
    group: 'assets',
    severity: 'info',
    test(p) {
      if (p.flags.skipLink) return null;
      return { message: 'No skip link', fix: 'A "skip to content" link as the first focusable element is the cheapest accessibility win on a page with a long nav.' };
    },
  },
];

// audit/rules/technical.mjs — can this page be crawled, indexed and understood?
//
// Every rule here is a claim about the served document, not about the source.
// That is the whole point: tests/seo-audit.mjs already proves the source data is
// right, and it still passed while the site served a build with no ads.

export const rules = [
  {
    id: 'http-status',
    group: 'technical',
    severity: 'blocker',
    test(p) {
      if (p.status === 200) return null;
      return {
        message: `Returns HTTP ${p.status || 'no response'}${p.chain && p.chain.length ? ` after ${p.chain.length} hop(s)` : ''}`,
        fix: p.status === 404
          ? 'A URL listed in the sitemap must resolve. Either the page is missing from the build (check build.mjs emitted it) or the sitemap lists a slug that no longer exists in src/data.'
          : 'The page is unreachable from this network. Re-check from a second location before changing anything — a CDN 5xx is not a content defect.',
      };
    },
  },
  {
    id: 'url-resolves-to-itself',
    group: 'technical',
    severity: 'major',
    test(p) {
      if (!p.finalUrl || p.finalUrl === p.url) return null;
      return {
        message: `Sitemap URL redirects to ${p.finalUrl}`,
        fix: 'Sitemaps must list the final URL. Change the sitemap generation to emit the destination, or stop the redirect.',
      };
    },
  },
  {
    id: 'redirect-permanent',
    group: 'technical',
    severity: 'minor',
    test(p) {
      if (!p.chain || p.chain.length < 2) return null;
      const first = p.chain[0];
      if (first.status === 301 || first.status === 308) return null;
      return {
        message: `First redirect is ${first.status}, not a permanent 301/308`,
        fix: 'A temporary redirect passes no durable signal. Use 301 for www→apex and for the trailing-slash form; keep 302 only for a deliberate temporary move.',
      };
    },
  },
  {
    id: 'canonical-present',
    group: 'technical',
    severity: 'blocker',
    test(p) {
      if (p.canonical) return null;
      return {
        message: 'No rel=canonical',
        fix: 'build.mjs emits the canonical in the page head. A missing one means the template branch for this page type skipped it — check the `noindex`/canonical block around build.mjs:279.',
      };
    },
  },
  {
    id: 'canonical-matches-sitemap-url',
    group: 'technical',
    severity: 'blocker',
    test(p) {
      if (!p.canonical) return null;
      if (p.canonical === p.url) return null;
      return {
        message: `Canonical points at ${p.canonical}, sitemap lists ${p.url}`,
        fix: 'Two signals disagree about the preferred URL. Make the canonical the slashed, apex form that the sitemap and every internal link already use.',
        evidence: { canonical: p.canonical, sitemap: p.url },
      };
    },
  },
  {
    id: 'noindex-in-sitemap',
    group: 'technical',
    severity: 'blocker',
    test(p, ctx) {
      if (!p.robotsMeta || !/noindex/i.test(p.robotsMeta)) return null;
      if (ctx.noindexAllowed && ctx.noindexAllowed.has(p.path)) return null;
      return {
        message: `noindex on a URL listed in the sitemap (robots: ${p.robotsMeta})`,
        fix: 'Contradiction: the sitemap asks for the page to be indexed and the page refuses. Remove the URL from the sitemap or remove the noindex.',
      };
    },
  },
  {
    id: 'html-lang',
    group: 'technical',
    severity: 'major',
    test(p) {
      if (p.lang) return null;
      return { message: '<html> has no lang attribute', fix: 'Set lang="en" on the <html> tag in build.mjs:272.' };
    },
  },
  {
    id: 'viewport',
    group: 'technical',
    severity: 'major',
    test(p) {
      if (p.viewport) return null;
      return { message: 'No viewport meta', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the shared head in build.mjs.' };
    },
  },
  {
    id: 'title-present',
    group: 'technical',
    severity: 'blocker',
    test(p) {
      if (p.title && p.title.trim()) return null;
      return { message: 'No <title>', fix: 'Every page needs a title. Check the data entry for this slug and that build.mjs passes it through.' };
    },
  },
  {
    id: 'html-content-type',
    group: 'technical',
    severity: 'major',
    test(p) {
      const ct = (p.contentType || '').toLowerCase();
      if (!ct || ct.includes('text/html')) return null;
      return { message: `Served as ${ct}`, fix: 'HTML pages must be text/html, or the browser renders them as plain text and the page is invisible to users.' };
    },
  },
];

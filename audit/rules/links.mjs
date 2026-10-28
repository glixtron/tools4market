// audit/rules/links.mjs — per-page link hygiene. Site-wide resolution lives in
// cross.mjs, because a broken link is a property of the target, not the source.

const VAGUE = new Set(['click here', 'here', 'read more', 'more', 'this', 'link', 'this link', 'learn more', 'see more']);

export const rules = [
  {
    id: 'vague-anchor',
    group: 'links',
    severity: 'minor',
    test(p) {
      const vague = p.links.filter((l) => l.href && VAGUE.has((l.text || '').toLowerCase().trim()));
      if (!vague.length) return null;
      return {
        message: `${vague.length} link(s) with vague anchor text`,
        fix: 'Anchor text is the only description a crawler gets. "Read more" describes nothing; name the destination. Also the main accessibility failure for screen-reader link lists.',
        evidence: { samples: vague.slice(0, 3).map((l) => ({ text: l.text, href: l.href })) },
      };
    },
  },
  {
    id: 'empty-href',
    group: 'links',
    severity: 'major',
    test(p) {
      // '#' is accepted: the cookie-settings control is an anchor with a JS
      // handler, which is a legitimate pattern. An empty or missing href is not:
      // it is not focusable, not crawlable, and announces as a link that does
      // nothing.
      const bad = p.links.filter((l) => !l.href || l.href.trim() === '');
      if (!bad.length) return null;
      return {
        message: `${bad.length} anchor(s) with no href`,
        fix: 'A dead anchor is a broken promise. If it is a button, it should be a <button>; if it navigates, it needs a real URL.',
        evidence: { samples: bad.slice(0, 3).map((l) => l.text) },
      };
    },
  },
  {
    id: 'internal-link-density',
    group: 'links',
    severity: 'info',
    test(p) {
      const internal = p.links.filter((l) => l.internal).length;
      if (internal >= 5) return null;
      return {
        message: `Only ${internal} internal link(s)`,
        fix: 'A page with few internal links is a dead end: it passes no authority and gives the crawler nowhere to go. Link the two or three tools that continue the job.',
      };
    },
  },
  {
    id: 'javascript-href',
    group: 'links',
    severity: 'major',
    test(p) {
      const bad = p.links.filter((l) => (l.href || '').toLowerCase().startsWith('javascript:'));
      if (!bad.length) return null;
      return {
        message: `${bad.length} javascript: href(s)`,
        fix: 'Not crawlable and blocked by most CSPs. Use a real href and intercept the click, or a <button> for in-page actions.',
      };
    },
  },
];

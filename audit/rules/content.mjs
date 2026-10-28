// audit/rules/content.mjs — does the page say enough, about the right thing?
//
// Focus phrases and related slugs come from src/data via ctx.catalog, so this
// rule set checks *rendering*, not intent: the data may say "related to these
// four tools" while the page shows two, and only the live page can prove that.

// Mirrors tests/seo-audit.mjs exactly. Two normalisers would drift, and a focus
// phrase that passes the source audit and fails the live audit is a false
// positive that costs trust in the whole report. Punctuation is stripped so
// "robots.txt tester" matches the phrase "robots txt tester".
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'your', 'our', 'how', 'to', 'of', 'in', 'on', 'a', 'an', 'is', 'are', 'if', 'can', 'my', 'me', 'not', 'or', 'that', 'this', 'it', 'you', 'we', 'at', 'be', 'by', 'from', 'as', 'so', 'do', 'does', 'did', 'was', 'were', 'will', 'would', 'should', 'could', 'when', 'what', 'why', 'where', 'which', 'who']);

/** A page targets its focus phrase when the phrase appears, or when the
 *  significant words of it do. Short phrases must match completely. */
function hasFocus(hay, focus) {
  const h = norm(hay);
  const t = norm(focus);
  if (!t) return true;
  if (h.includes(t)) return true;
  const words = t.split(' ').filter((w) => w.length > 3 && !STOPWORDS.has(w));
  if (!words.length) return true;
  if (words.length <= 2) return words.every((w) => h.includes(w));
  const hits = words.filter((w) => h.includes(w)).length;
  return hits >= Math.ceil(words.length * 0.6);
}

export const rules = [
  {
    id: 'prose-min',
    group: 'content',
    severity: 'major',
    test(p, ctx) {
      const group = ctx.groupOf(p.path);
      const entry = group === 'tools' ? ctx.toolOf(p.path) : group === 'blog' ? ctx.articleOf(p.path) : null;
      if (!entry) return null;
      const min = group === 'blog' ? ctx.catalog.content.guideProseMin : ctx.catalog.content.toolProseMin;
      const words = p.words.prose;
      if (words >= min) return null;
      return {
        message: `${words} prose words (want ≥${min})`,
        fix: group === 'blog'
          ? 'A guide under 600 prose words rarely justifies a ranking. Add a section that answers a question the existing sections skip — not padding.'
          : 'Tool pages need enough prose to explain the job and the failure modes. Add a section on when the tool gives the wrong answer.',
        evidence: { prose: words, faq: p.faq.length },
      };
    },
  },
  {
    id: 'faq-count',
    group: 'content',
    severity: 'minor',
    test(p, ctx) {
      if (!p.faq.length) return null; // page types without a FAQ are fine
      const { faqMin, faqMax } = ctx.catalog.content;
      if (p.faq.length >= faqMin && p.faq.length <= faqMax) return null;
      return {
        message: `${p.faq.length} visible FAQ(s) (want ${faqMin}–${faqMax})`,
        fix: 'Four to six: fewer leaves long-tail questions unanswered, more turns the page into a list of questions instead of an answer.',
      };
    },
  },
  {
    id: 'focus-in-title',
    group: 'content',
    severity: 'major',
    test(p, ctx) {
      const entry = ctx.entryFor(p.path);
      if (!entry || !entry.focus) return null;
      if (hasFocus(p.title, entry.focus)) return null;
      return {
        message: `Focus phrase "${entry.focus}" is not in the title`,
        fix: `Set metaTitle in src/data so it contains "${entry.focus}" verbatim. Paraphrase reads better but splits the signal.`,
        evidence: { title: p.title },
      };
    },
  },
  {
    id: 'focus-in-description',
    group: 'content',
    severity: 'major',
    test(p, ctx) {
      const entry = ctx.entryFor(p.path);
      if (!entry || !entry.focus) return null;
      if (hasFocus(p.description, entry.focus)) return null;
      return {
        message: `Focus phrase "${entry.focus}" is not in the meta description`,
        fix: 'Put it in the first half of the description, where it survives truncation.',
      };
    },
  },
  {
    id: 'focus-in-heading',
    group: 'content',
    severity: 'minor',
    test(p, ctx) {
      const entry = ctx.entryFor(p.path);
      if (!entry || !entry.focus) return null;
      const hit = p.headings.some((h) => h.level >= 2 && hasFocus(h.text, entry.focus));
      if (hit) return null;
      return {
        message: `Focus phrase "${entry.focus}" appears in no h2/h3`,
        fix: 'One subheading should name the thing the page is about. It helps passage extraction and gives the reader a landmark.',
      };
    },
  },
  {
    id: 'related-tools-rendered',
    group: 'content',
    severity: 'major',
    test(p, ctx) {
      const group = ctx.groupOf(p.path);
      if (group !== 'blog') return null;
      const entry = ctx.articleOf(p.path);
      if (!entry) return null;
      const want = entry.relatedTools || [];
      const links = p.links.map((l) => l.absolute || '');
      const missing = want.filter((slug) => !links.some((u) => u.includes(`/tools/${slug}/`)));
      if (!missing.length) return null;
      return {
        message: `${missing.length} relatedTool(s) not linked on the page: ${missing.join(', ')}`,
        fix: 'The data lists them, the template did not render them. Check the relatedTools loop in build.mjs — a slug that no longer exists in TOOLS is dropped silently.',
      };
    },
  },
  {
    id: 'outbound-links',
    group: 'content',
    severity: 'minor',
    test(p, ctx) {
      if (ctx.groupOf(p.path) !== 'blog') return null;
      const external = p.links.filter((l) => !l.internal && l.absolute);
      if (external.length >= ctx.catalog.content.outboundLinksMin) return null;
      return {
        message: `${external.length} outbound link(s) (want ≥${ctx.catalog.content.outboundLinksMin})`,
        fix: 'A sourced guide links its claims. If the sources are in the data but not on the page, the links list is being filtered at render.',
        evidence: { externalUrls: external.slice(0, 4).map((l) => l.absolute) },
      };
    },
  },
];

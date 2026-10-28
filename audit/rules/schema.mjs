// audit/rules/schema.mjs — structured data, checked against what the page shows.
//
// The interesting failure is not "is there JSON-LD" but "does the JSON-LD say
// the same thing as the visible page". Reviewers check the second one, and a
// mismatch is a policy risk rather than a nicety.

function typesOf(page) {
  const out = [];
  for (const block of page.jsonld) {
    if (!block.ok) continue;
    const data = block.data;
    const list = Array.isArray(data) ? data : [data];
    for (const item of list) {
      if (item && item['@type']) out.push(String(item['@type']));
    }
  }
  return out;
}

function findBlock(page, type) {
  for (const block of page.jsonld) {
    if (!block.ok) continue;
    const list = Array.isArray(block.data) ? block.data : [block.data];
    for (const item of list) if (item && item['@type'] === type) return item;
  }
  return null;
}

export const rules = [
  {
    id: 'jsonld-valid',
    group: 'schema',
    severity: 'major',
    test(p) {
      const bad = p.jsonld.filter((b) => !b.ok);
      if (!bad.length) return null;
      return {
        message: `${bad.length} JSON-LD block(s) fail to parse: ${bad[0].error}`,
        fix: 'Malformed JSON-LD is ignored silently by every consumer. The block comes from build.mjs `ldTag()`; a stray comma or unescaped quote in the object literal is the usual cause.',
        evidence: { sample: String(bad[0].raw || '').slice(0, 160) },
      };
    },
  },
  {
    id: 'jsonld-present',
    group: 'schema',
    severity: 'major',
    test(p) {
      if (p.jsonld.length) return null;
      return { message: 'No JSON-LD at all', fix: 'This template should emit structured data. Check the ld+json branch in build.mjs for this page type.' };
    },
  },
  {
    id: 'jsonld-expected-types',
    group: 'schema',
    severity: 'major',
    test(p, ctx) {
      const want = (ctx.catalog.structure[ctx.groupOf(p.path)] || {}).jsonld || [];
      if (!want.length) return null;
      const have = typesOf(p);
      const missing = want.filter((t) => !have.includes(t));
      if (!missing.length) return null;
      return {
        message: `Missing schema type(s): ${missing.join(', ')} (has: ${have.join(', ') || 'none'})`,
        fix: 'The template determines the schema. Add the missing @type to the ld+json block in build.mjs for this page type — do not hand-write per page.',
      };
    },
  },
  {
    id: 'faq-schema-matches-visible',
    group: 'schema',
    severity: 'major',
    test(p) {
      const faq = findBlock(p, 'FAQPage');
      if (!faq) return null;
      const schemaQs = (faq.mainEntity || []).map((q) => (q.name || '').trim());
      const visibleQs = p.faq.map((f) => f.q.trim());
      if (!visibleQs.length) {
        return {
          message: 'FAQPage schema on a page with no visible FAQ',
          fix: 'Structured data must describe content the user can see. Either render the FAQ or remove the FAQPage block.',
        };
      }
      const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ?]/g, '').trim();
      const missing = schemaQs.filter((q) => !visibleQs.map(norm).includes(norm(q)));
      if (!missing.length) return null;
      return {
        message: `${missing.length} FAQ question(s) in schema but not visible: "${missing[0].slice(0, 60)}"`,
        fix: 'Schema and page have drifted. Both are generated from the same `faqs` array, so the mismatch means the FAQ section is filtered on render while the schema is not.',
        evidence: { schema: schemaQs.length, visible: visibleQs.length },
      };
    },
  },
  {
    id: 'no-searchaction',
    group: 'schema',
    severity: 'info',
    test(p) {
      if (!p.jsonld.some((b) => b.ok && JSON.stringify(b.data).includes('SearchAction'))) return null;
      return {
        message: 'SearchAction present in schema',
        fix: 'Google removed the sitelinks search box in Nov 2024 and ignores this markup. Harmless but pointless; remove it so the schema does not claim a feature that no longer exists.',
      };
    },
  },
  {
    id: 'breadcrumb-positions',
    group: 'schema',
    severity: 'minor',
    test(p) {
      const bc = findBlock(p, 'BreadcrumbList');
      if (!bc) return null;
      const items = bc.itemListElement || [];
      const bad = items.filter((it, i) => Number(it.position) !== i + 1);
      if (!bad.length) return null;
      return {
        message: `BreadcrumbList positions are not 1..n (${items.map((i) => i.position).join(',')})`,
        fix: 'Positions must be sequential from 1. build.mjs maps them by index; a filtered list breaks the sequence.',
      };
    },
  },
  {
    id: 'webapplication-offer',
    group: 'schema',
    severity: 'minor',
    test(p) {
      const app = findBlock(p, 'WebApplication');
      if (!app) return null;
      if (app.offers && app.offers.price === '0') return null;
      return {
        message: 'WebApplication has no free Offer',
        fix: 'The site is free; the schema should say so. build.mjs emits offers.price "0" — a missing offer means the block was edited.',
      };
    },
  },
];

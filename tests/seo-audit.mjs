// Tools4Market — site-wide SEO definition audit.
//   node tests/seo-audit.mjs
//
// Checks every tool page + the homepage for: unique/optimised title, meta
// description, H1, intro, keyword placement, section depth, FAQ quality,
// structured data completeness, internal linking, and HTML hygiene.
// Prints a per-defect report; exits non-zero if anything fails.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { TOOLS, CATEGORIES } from '../src/data/index.js';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
let pass = 0, fail = 0;
const issues = [];
const ok = (name, cond, detail = '') => {
  if (cond) pass++;
  else { fail++; issues.push(`${name}${detail ? ' — ' + detail : ''}`); }
};
const wc = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const esc = (s) => String(s || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const slugOf = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const read = (p) => readFileSync(path.join(DIST, p), 'utf8');

// ---------- site-wide duplicate detection
const titles = new Map(), descs = new Map(), h1s = new Map();
const paragraphs = new Map(), faqQs = new Map(), faqAs = new Map(), headings = new Map();
const add = (map, k, v) => { if (!map.has(k)) map.set(k, []); map.get(k).push(v); };
for (const t of TOOLS) {
  add(titles, t.metaTitle, t.slug);
  add(descs, t.metaDesc, t.slug);
  add(h1s, t.h1, t.slug);
  for (const s of t.sections || []) {
    const key = slugOf(s.h);
    add(headings, key, t.slug + ':' + s.h);
    for (const p of s.p || []) {
      const k = norm(p).slice(0, 120);
      if (k.length > 60) add(paragraphs, k, t.slug);
    }
  }
  for (const f of t.faqs || []) {
    add(faqQs, slugOf(f.q), t.slug);
    const a = norm(f.a).slice(0, 120);
    if (a.length > 60) add(faqAs, a, t.slug);
  }
}
const dupes = (map) => [...map.entries()].filter(([, v]) => v.length > 1);

// ---------- per-tool checks
for (const t of TOOLS) {
  const p = t.slug;
  const kw = String(t.keywords || '').split(/\s+/).filter(Boolean);
  const primary = kw[0] || t.name.toLowerCase();
  const primaryWords = primary.split(' ').filter((w) => w.length > 2);
  const inText = (hay, needle) => {
    const h = norm(hay);
    return primaryWords.every((w) => h.includes(w)) || h.includes(norm(primary));
  };

  // title
  ok(`${p}: metaTitle length 25-60`, t.metaTitle.length >= 25 && t.metaTitle.length <= 60, t.metaTitle.length + ' chars');
  ok(`${p}: metaTitle contains primary keyword`, inText(t.metaTitle, primary), `"${t.metaTitle}" vs "${primary}"`);
  ok(`${p}: metaTitle unique`, (titles.get(t.metaTitle) || []).length === 1);
  // h1
  ok(`${p}: h1 length 20-75`, t.h1.length >= 20 && t.h1.length <= 75, t.h1.length + ' chars');
  ok(`${p}: h1 contains primary keyword`, inText(t.h1, primary), `"${t.h1}"`);
  ok(`${p}: h1 unique`, (h1s.get(t.h1) || []).length === 1);
  // meta description
  ok(`${p}: metaDesc length 110-158`, t.metaDesc.length >= 110 && t.metaDesc.length <= 158, t.metaDesc.length + ' chars');
  ok(`${p}: metaDesc contains primary keyword`, inText(t.metaDesc, primary));
  ok(`${p}: metaDesc unique`, (descs.get(t.metaDesc) || []).length === 1);
  ok(`${p}: metaDesc has a benefit/CTA`, /(free|without|no |instant|online|fast|check|generate|build|convert|count|compare|analyz)/i.test(t.metaDesc));
  // intro
  ok(`${p}: intro 90-260 chars`, t.intro.length >= 90 && t.intro.length <= 260, t.intro.length + ' chars');
  ok(`${p}: intro contains primary keyword`, inText(t.intro, primary));
  // keywords
  ok(`${p}: keywords >= 4 terms`, kw.length >= 4, kw.length + ' terms');
  ok(`${p}: keywords unique`, new Set(kw).size === kw.length);
  // sections
  const words = (t.sections || []).reduce((n, s) => n + wc(s.p.join(' ')), 0);
  ok(`${p}: 3-4 sections`, (t.sections || []).length >= 3 && (t.sections || []).length <= 4, (t.sections || []).length + ' sections');
  ok(`${p}: section words 430-600`, words >= 430 && words <= 600, words + ' words');
  const kwHeadings = (t.sections || []).filter((s) => inText(s.h, primary)).length;
  ok(`${p}: >=1 section heading carries the primary keyword`, kwHeadings >= 1, kwHeadings + ' of ' + (t.sections || []).length);
  // faqs
  ok(`${p}: exactly 4 FAQs`, (t.faqs || []).length === 4, (t.faqs || []).length + '');
  ok(`${p}: FAQ questions are questions`, (t.faqs || []).every((f) => /\?$/.test(f.q.trim())));
  ok(`${p}: FAQ answers 30-300 chars`, (t.faqs || []).every((f) => f.a.length >= 30 && f.a.length <= 300));
  const faqKw = (t.faqs || []).filter((f) => inText(f.q + ' ' + f.a, primary)).length;
  ok(`${p}: >=2 FAQs relate to the primary keyword`, faqKw >= 2, faqKw + ' of 4');
  // card
  ok(`${p}: card is 40-110 chars`, t.card.length >= 40 && t.card.length <= 110, t.card.length + '');
  // built page
  const html = read(t.slug === 'x' ? '' : 'tools/' + t.slug + '/index.html');
  ok(`${p}: canonical self-referencing`, html.includes(`<link rel="canonical" href="https://tools4market.online/tools/${t.slug}/">`));
  ok(`${p}: no noindex`, !/content="noindex"/i.test(html));
  ok(`${p}: lang="en"`, html.includes('<html lang="en">'));
  ok(`${p}: og:title present`, /property="og:title" content="[^"]+"/.test(html));
  ok(`${p}: og:description present`, /property="og:description" content="[^"]+"/.test(html));
  ok(`${p}: og:image present`, /property="og:image" content="https:\/\/tools4market\.online\/assets\/og-image\.png"/.test(html));
  ok(`${p}: twitter:card large image`, /name="twitter:card" content="summary_large_image"/.test(html));
  // JSON-LD
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1].replace(/\\u003c/g, '<')); } catch (e) { return null; }
  });
  ok(`${p}: all JSON-LD blocks parse`, ld.length >= 3 && ld.every(Boolean), ld.length + ' blocks');
  const faqLd = ld.find((x) => x && x['@type'] === 'FAQPage');
  ok(`${p}: FAQPage schema with 4 questions`, !!faqLd && faqLd.mainEntity.length === 4);
  const bcLd = ld.find((x) => x && x['@type'] === 'BreadcrumbList');
  ok(`${p}: BreadcrumbList with 3 positions`, !!bcLd && bcLd.itemListElement.length === 3 && bcLd.itemListElement[2].position === 3);
  const appLd = ld.find((x) => x && x['@type'] === 'WebApplication');
  ok(`${p}: WebApplication schema complete`, !!appLd && !!appLd.name && !!appLd.description && !!appLd.url);
  // hygiene
  ok(`${p}: no TODO/placeholder text`, !/TODO|FIXME|XXX|lorem ipsum of tool/i.test(html));
  ok(`${p}: no unresolved template braces`, !/\{\{|\}\}/.test(html));
  ok(`${p}: no NaN/undefined in output`, !/>NaN<|>undefined</.test(html));
  ok(`${p}: no double-escaped entities`, !/&amp;(amp|lt|gt|quot);/.test(html));
  // internal links
  const toolLinks = [...html.matchAll(/href="[^"]*\/tools\/([a-z0-9-]+)\/"/g)].map((m) => m[1]);
  ok(`${p}: links to >=4 tool pages`, new Set(toolLinks).size >= 4, new Set(toolLinks).size + ' unique');
  ok(`${p}: links to its category hub`, html.includes(`/${CATEGORIES[t.cat].slug}/`));
  ok(`${p}: links to the privacy policy`, html.includes('/privacy-policy/'));
}

// ---------- homepage
{
  const html = read('index.html');
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const h1 = (html.match(/<h1>([^<]+)<\/h1>/) || [])[1] || '';
  ok('home: title 25-60', title.length >= 25 && title.length <= 60, title.length + ' chars');
  ok('home: title has primary keyword', /free|seo|marketing|tool/i.test(title), title);
  ok('home: meta description 110-158', desc.length >= 110 && desc.length <= 158, desc.length + ' chars');
  ok('home: h1 present', h1.length > 10, h1);
  ok('home: links to all 30 tools', new Set([...html.matchAll(/href="\/tools\/([a-z0-9-]+)\/"/g)].map((m) => m[1])).size === TOOLS.length);
  ok('home: WebSite + Organization schema', /"@type":"WebSite"/.test(html) && /"@type":"Organization"/.test(html));
  ok('home: FAQPage schema', /"@type":"FAQPage"/.test(html), 'no homepage FAQPage — add a short homepage FAQ section');
  ok('home: breadcrumb not required on home', true);
  ok('home: canonical self-referencing', html.includes('<link rel="canonical" href="https://tools4market.online/">'));
  ok('home: no noindex', !/content="noindex"/i.test(html));
}

// ---------- site-wide duplicates
for (const [k, v] of dupes(titles)) ok('site: unique meta titles', false, v.join(' , '));
for (const [k, v] of dupes(descs)) ok('site: unique meta descriptions', false, v.join(' , '));
for (const [k, v] of dupes(h1s)) ok('site: unique h1s', false, v.join(' , '));
for (const [k, v] of dupes(paragraphs)) ok('site: no duplicate paragraphs', false, v.join(' , '));
for (const [k, v] of dupes(faqQs)) ok('site: unique FAQ questions', false, v.join(' , '));
for (const [k, v] of dupes(faqAs)) ok('site: unique FAQ answers', false, v.join(' , '));
for (const [k, v] of dupes(headings)) ok('site: unique section headings', false, v.join(' , '));

console.log(`\nSEO AUDIT: ${pass} passed, ${fail} failed`);
if (issues.length) {
  console.log('\n--- defects ---');
  issues.forEach((i) => console.log(' ✗ ' + i));
}
process.exit(fail ? 1 : 0);

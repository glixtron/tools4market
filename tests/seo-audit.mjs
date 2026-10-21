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
import { ARTICLES } from '../src/data/blog.js';

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
// A page targets its focus phrase when the phrase appears, or when the
// significant words of it do (long-tail phrases contain words like "your" that
// should not have to appear verbatim). Short phrases must match completely.
const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'your', 'our', 'how', 'to', 'of', 'in', 'on', 'a', 'an', 'is', 'are', 'if', 'can', 'my', 'me', 'not', 'or', 'that', 'this', 'it', 'you', 'we', 'at', 'be', 'by', 'from', 'as', 'so', 'do', 'does', 'did', 'was', 'were', 'will', 'would', 'should', 'could', 'when', 'what', 'why', 'where', 'which', 'who']);
const hasFocus = (hay, focus) => {
  const h = norm(hay);
  const t = norm(focus);
  if (h.includes(t)) return true;
  const words = t.split(' ').filter((w) => w.length > 3 && !STOPWORDS.has(w));
  if (!words.length) return true;
  if (words.length <= 2) return words.every((w) => h.includes(w));
  const hits = words.filter((w) => h.includes(w)).length;
  return hits >= Math.ceil(words.length * 0.6);
};

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
  // the page's explicit target search phrase (t.focus) — every SEO surface
  // (title, h1, description, intro, a heading, the FAQs) must carry it
  const primary = String(t.focus || t.name).toLowerCase();
  const inText = (hay) => {
    const h = norm(hay);
    const target = norm(primary);
    return h.includes(target) || target.split(' ').filter((w) => w.length > 3).every((w) => h.includes(w));
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
  // sections
  const words = (t.sections || []).reduce((n, s) => n + wc(s.p.join(' ')), 0);
  ok(`${p}: 3-4 sections`, (t.sections || []).length >= 3 && (t.sections || []).length <= 4, (t.sections || []).length + ' sections');
  ok(`${p}: section words 430-600`, words >= 430 && words <= 600, words + ' words');
  const kwHeadings = (t.sections || []).filter((s) => inText(s.h, primary)).length;
  ok(`${p}: >=1 section heading carries the primary keyword`, kwHeadings >= 1, kwHeadings + ' of ' + (t.sections || []).length);
  // faqs
  ok(`${p}: 3-6 FAQs`, (t.faqs || []).length >= 3 && (t.faqs || []).length <= 6, (t.faqs || []).length + '');
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
  ok(`${p}: FAQPage schema matches the page FAQs`, !!faqLd && faqLd.mainEntity.length === (t.faqs || []).length, (faqLd ? faqLd.mainEntity.length : 0) + ' vs ' + (t.faqs || []).length);
  const bcLd = ld.find((x) => x && x['@type'] === 'BreadcrumbList');
  ok(`${p}: BreadcrumbList with 3 positions`, !!bcLd && bcLd.itemListElement.length === 3 && bcLd.itemListElement[2].position === 3);
  const appLd = ld.find((x) => x && x['@type'] === 'WebApplication');
  ok(`${p}: WebApplication schema complete`, !!appLd && !!appLd.name && !!appLd.description && !!appLd.url);
  // hygiene
  ok(`${p}: no TODO/placeholder text`, !/TODO|FIXME|XXX|lorem ipsum of tool/i.test(html));
  ok(`${p}: no unresolved template braces`, !/\{\{|\$\{/.test(html));
  ok(`${p}: no NaN/undefined in output`, !/>NaN<|>undefined</.test(html));
  ok(`${p}: no double-escaped entities`, !/&amp;(amp|lt|gt|quot);/.test(html));
  // internal links
  const base = 'https://tools4market.online/tools/' + t.slug + '/';
  const resolved = [...html.matchAll(/href="([^"]+)"/g)].map((m) => { try { return new URL(m[1], base).pathname; } catch (e) { return ''; } });
  const toolLinks = new Set(resolved.filter((u) => /^\/tools\/[a-z0-9-]+\/$/.test(u)).map((u) => u.split('/')[2]));
  ok(`${p}: links to >=4 tool pages`, toolLinks.size >= 4, toolLinks.size + ' unique');
  ok(`${p}: links to its category hub`, resolved.some((u) => u === '/' + CATEGORIES[t.cat].slug + '/'));
  ok(`${p}: links to the privacy policy`, resolved.some((u) => u === '/privacy-policy/'));
}


// ---------- blog articles
{
  const seenParas = new Map();
  for (const a of ARTICLES) {
    const p = 'blog/' + a.slug;
    const words = a.sections.reduce((n, s2) => n + [...(s2.p || []), ...(s2.p2 || [])].join(' ').split(/\s+/).filter(Boolean).length, 0);
    ok(`${p}: metaTitle 25-60`, a.metaTitle.length >= 25 && a.metaTitle.length <= 60, a.metaTitle.length + '');
    ok(`${p}: metaTitle carries the target phrase`, hasFocus(a.metaTitle, a.focus), `"${a.metaTitle}" vs "${a.focus}"`);
    ok(`${p}: metaDesc 110-158`, a.metaDesc.length >= 110 && a.metaDesc.length <= 158, a.metaDesc.length + '');
    ok(`${p}: metaDesc carries the target phrase`, hasFocus(a.metaDesc, a.focus));
    ok(`${p}: intro 90-300 chars`, a.intro.length >= 90 && a.intro.length <= 300, a.intro.length + '');
    ok(`${p}: intro carries the target phrase`, hasFocus(a.intro, a.focus));
    ok(`${p}: 3-6 sections`, a.sections.length >= 3 && a.sections.length <= 6, a.sections.length + '');
    ok(`${p}: 600+ words`, words >= 600, words + ' words');
    ok(`${p}: a heading carries the target phrase`, a.sections.some((s2) => hasFocus(s2.h, a.focus)));
    ok(`${p}: 4-6 FAQs`, a.faqs.length >= 4 && a.faqs.length <= 6, a.faqs.length + '');
    ok(`${p}: FAQ questions are questions`, a.faqs.every((f) => /\?$/.test(f.q.trim())));
    ok(`${p}: >=2 FAQs relate to the target phrase`, a.faqs.filter((f) => hasFocus(f.q + ' ' + f.a, a.focus)).length >= 2);
    ok(`${p}: has a date + author`, !!a.date && !!a.author);
    ok(`${p}: links to >=3 tools`, (a.relatedTools || []).length >= 3, (a.relatedTools || []).length + '');
    ok(`${p}: cites authoritative sources`, (a.links || []).length >= 2);
    for (const s2 of a.sections) for (const pr of [...(s2.p || []), ...(s2.p2 || [])]) { const k = norm(pr).slice(0, 120); if (k.length > 60) add(seenParas, k, p); }
  }
  for (const [k, v] of [...seenParas.entries()].filter(([, v]) => v.length > 1)) ok('blog: no duplicate paragraphs', false, v.join(' , '));
  // built pages
  for (const a of ARTICLES) {
    const html = read('blog/' + a.slug + '/index.html');
    ok(`blog/${a.slug}: canonical self-referencing`, html.includes(`<link rel="canonical" href="https://tools4market.online/blog/${a.slug}/">`));
    ok(`blog/${a.slug}: BlogPosting schema`, /"@type":"BlogPosting"/.test(html));
    ok(`blog/${a.slug}: FAQPage schema`, /"@type":"FAQPage"/.test(html));
    ok(`blog/${a.slug}: BreadcrumbList schema`, /"@type":"BreadcrumbList"/.test(html));
    ok(`blog/${a.slug}: no noindex`, !/content="noindex"/i.test(html));
    const toolLinks = new Set([...html.matchAll(/href="([^"]+)"/g)].map((m) => { try { return new URL(m[1], 'https://tools4market.online/blog/' + a.slug + '/').pathname; } catch (e) { return ''; } }).filter((u) => /^\/tools\/[a-z0-9-]+\/$/.test(u)));
    ok(`blog/${a.slug}: links to >=3 tool pages`, toolLinks.size >= 3, toolLinks.size + '');
  }
  const idxHtml = read('blog/index.html');
  const idxResolved = new Set([...idxHtml.matchAll(/href="([^"]+)"/g)].map((m) => { try { return new URL(m[1], 'https://tools4market.online/blog/').pathname; } catch (e) { return ''; } }));
  ok('blog index: links to every article', ARTICLES.every((a) => idxResolved.has('/blog/' + a.slug + '/')), ARTICLES.filter((a) => !idxResolved.has('/blog/' + a.slug + '/')).map((a) => a.slug).join(','));
  ok('blog index: CollectionPage schema', /"@type":"CollectionPage"/.test(idxHtml));
}

// ---------- AI-search surfaces (llms.txt / RSS feed / blog sitemap)
{
  let llms = '';
  try { llms = read('llms.txt'); } catch (e) {}
  ok('llms.txt: exists at the domain root', llms.length > 0);
  ok('llms.txt: starts with an H1', llms.startsWith('# '));
  ok('llms.txt: has a blockquote summary', llms.includes('\n> '));
  ok('llms.txt: lists every tool', TOOLS.every((t) => llms.includes(`/tools/${t.slug}/`)), TOOLS.filter((t) => !llms.includes(`/tools/${t.slug}/`)).map((t) => t.slug).join(','));
  ok('llms.txt: lists every guide', ARTICLES.every((a) => llms.includes(`/blog/${a.slug}/`)), ARTICLES.filter((a) => !llms.includes(`/blog/${a.slug}/`)).map((a) => a.slug).join(','));
  ok('llms.txt: every listed URL is on the canonical host', !llms.includes('www.tools4market.online') && !llms.includes('http://'));

  let feed = '';
  try { feed = read('feed.xml'); } catch (e) {}
  ok('feed.xml: exists and is RSS 2.0', feed.startsWith('<?xml') && feed.includes('<rss version="2.0"'));
  ok('feed.xml: carries every guide', ARTICLES.every((a) => feed.includes(`<link>${'https://tools4market.online'}/blog/${a.slug}/</link>`)));
  ok('feed.xml: self-referencing atom:link', feed.includes('rel="self"'));

  let blogMap = '';
  try { blogMap = read('sitemap-blog.xml'); } catch (e) {}
  ok('sitemap-blog.xml: lists every guide', ARTICLES.every((a) => blogMap.includes(`/blog/${a.slug}/`)), ARTICLES.filter((a) => !blogMap.includes(`/blog/${a.slug}/`)).map((a) => a.slug).join(','));
  const sitemapIdx = read('sitemap.xml');
  ok('sitemap.xml: index includes the blog child', sitemapIdx.includes('sitemap-blog.xml'));
  ok('robots.txt: points at the sitemap index', read('robots.txt').includes('Sitemap: https://tools4market.online/sitemap.xml'));
}

// ---------- every page carries exactly one Google tag (and consent comes first)
{
  const { readdirSync, statSync } = await import('node:fs');
  const walk = (dir) => {
    const out = [];
    for (const e of readdirSync(dir)) {
      const full = path.join(dir, e);
      if (statSync(full).isDirectory()) out.push(...walk(full));
      else if (full.endsWith('.html')) out.push(full);
    }
    return out;
  };
  const files = walk(DIST);
  let missing = 0, doubled = 0, misordered = 0, wrongId = 0;
  for (const f of files) {
    const html = readFileSync(f, 'utf8');
    const rel = f.slice(DIST.length);
    const tagCount = (html.match(/googletagmanager\.com\/gtag\/js\?id=/g) || []).length;
    if (tagCount === 0) { missing++; ok(rel + ': Google tag present', false, 'no gtag.js tag'); continue; }
    if (tagCount > 1) { doubled++; ok(rel + ': exactly one Google tag', false, tagCount + ' tags'); continue; }
    if (!/googletagmanager\.com\/gtag\/js\?id=G-6B4GGFC96K/.test(html)) { wrongId++; ok(rel + ': Google tag uses the right id', false, 'wrong id'); continue; }
    const consentAt = html.indexOf("gtag('consent', 'default'");
    const tagAt = html.indexOf('googletagmanager.com/gtag/js');
    if (consentAt === -1 || (tagAt !== -1 && consentAt > tagAt)) { misordered++; ok(rel + ': consent default precedes the Google tag', false, 'consent@' + consentAt + ' tag@' + tagAt); continue; }
    pass++;
  }
  ok(`all ${files.length} built pages carry exactly one Google tag (G-6B4GGFC96K) with consent first`, missing === 0 && doubled === 0 && wrongId === 0 && misordered === 0, `${files.length} pages checked`);
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
  const homeTools = new Set([...html.matchAll(/href="([^"]+)"/g)].map((m) => { try { return new URL(m[1], 'https://tools4market.online/').pathname; } catch (e) { return ''; } }).filter((u) => /^\/tools\/[a-z0-9-]+\/$/.test(u)).map((u) => u.split('/')[2]));
  ok('home: links to all 30 tools', homeTools.size === TOOLS.length, homeTools.size + '/' + TOOLS.length);
  ok('home: WebSite + Organization schema', /"@type":"WebSite"/.test(html) && /"@type":"Organization"/.test(html));
  ok('home: FAQPage schema', /"@type":"FAQPage"/.test(html), 'no homepage FAQPage — add a short homepage FAQ section');
  ok('home: breadcrumb not required on home', true);
  ok('home: canonical self-referencing', html.includes('<link rel="canonical" href="https://tools4market.online/">'));
  ok('home: no noindex', !/content="noindex"/i.test(html));
}

// ---------- 22 Oct 2026 audit actions: identity, favicon, homepage IA,
// ---------- internal-link graph, sitemap honesty, crawler policy
{
  // --- favicon + app icons (/favicon.ico used to answer 404)
  const ico = readFileSync(path.join(DIST, 'favicon.ico'));
  ok('favicon.ico: exists at the domain root', ico.length > 0);
  ok('favicon.ico: valid ICO header (icon type, one image)', ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) === 1);
  ok('favicon.ico: wraps a PNG payload', ico.slice(22, 26).toString('hex') === '89504e47');
  for (const page of ['index.html', 'tools/meta-tag-generator/index.html', 'blog/index.html', '404.html']) {
    const html = read(page);
    ok(`${page}: links the SVG favicon`, html.includes('rel="icon" type="image/svg+xml"'));
    ok(`${page}: links the ICO fallback`, html.includes('rel="icon" type="image/x-icon"'));
    ok(`${page}: apple-touch-icon + manifest + theme-color`, html.includes('rel="apple-touch-icon"') && html.includes('rel="manifest"') && /name="theme-color"/.test(html));
  }
  ok('manifest.webmanifest: exists at the root', read('manifest.webmanifest').includes('Tools4Market'));

  // --- homepage: task-led messaging + editorial hierarchy
  const home = read('index.html');
  ok('home: outcome-led H1', home.includes('<h1>Find the right tool. Finish the job.</h1>'));
  ok('home: task-language search placeholder', home.includes('Search tools by task'));
  ok('home: editor pick card links a live tool', /<aside class="pick-card"[\s\S]{0,600}?<a href="tools\/[a-z0-9-]+\/">/.test(home));
  ok('home: pick card shows a real output preview', home.includes('class="pick-sample"'));
  ok('home: four "start with your job" paths', home.includes('id="start-with-your-job"') && (home.match(/class="job-card"/g) || []).length === 4);
  ok('home: four numbered outcome categories', (home.match(/class="outcome-card"/g) || []).length === 4);
  ok('home: guides framed as "show the work"', home.includes('Guides that show the work'));
  ok('home: contact / feedback CTA', home.includes('Suggest a tool') && home.includes('Report a bug') && /href="contact\/"/.test(home));
  ok('home: cookie banner reserves page space (body.ck-open)', read('assets/style.css').includes('body.ck-open'));

  // --- used-for line + last-updated labels
  const noUsedFor = TOOLS.filter((t) => !t.usedFor || !/^for /.test(t.usedFor));
  ok('tools: every tool defines a "used for" line', noUsedFor.length === 0, noUsedFor.map((t) => t.slug).join(','));
  const noStrip = TOOLS.filter((t) => !read('tools/' + t.slug + '/index.html').includes('class="tool-meta"'));
  ok('tools: every tool page renders the meta strip', noStrip.length === 0, noStrip.map((t) => t.slug).join(','));
  const priority = ['meta-tag-generator', 'open-graph-generator', 'schema-markup-generator', 'robots-txt-generator', 'llms-txt-generator', 'web-crawler-audit', 'seo-score-checker', 'utm-link-builder', 'sitemap-generator', 'keyword-density-checker'];
  const noUpd = priority.filter((s) => !read('tools/' + s + '/index.html').includes('Last updated'));
  ok('priority tools: visible "Last updated" label', noUpd.length === 0, noUpd.join(','));
  ok('guides: published date rendered as a <time> element', ARTICLES.every((a) => read('blog/' + a.slug + '/index.html').includes('Published <time')));

  // --- internal-link graph: every priority tool reaches a guide
  const noGuide = priority.filter((s) => !read('tools/' + s + '/index.html').includes('From the guides'));
  ok('priority tools: each links to a guide', noGuide.length === 0, noGuide.join(','));
  // (category-hub linking is already asserted per tool above via resolved paths)

  // --- homepage links the ten priority tools directly
  const homeHrefs = new Set([...home.matchAll(/href="([^"]+)"/g)].map((m) => { try { return new URL(m[1], 'https://tools4market.online/').pathname; } catch (e) { return ''; } }));
  ok('home: links all ten priority tools', priority.every((s) => homeHrefs.has('/tools/' + s + '/')), priority.filter((s) => !homeHrefs.has('/tools/' + s + '/')).join(','));

  // --- sitemap lastmod: real dates only (guides carry them, tools do not)
  const blogMap2 = read('sitemap-blog.xml');
  ok('sitemap-blog.xml: every guide entry carries its real date', ARTICLES.every((a) => blogMap2.includes(`<loc>https://tools4market.online/blog/${a.slug}/</loc><lastmod>${a.updated || a.date}</lastmod>`)));
  ok('sitemap-tools.xml: no synthetic lastmod on tool URLs', !read('sitemap-tools.xml').includes('<lastmod>'));
  ok('sitemap-pages.xml: no synthetic lastmod on page URLs', !read('sitemap-pages.xml').includes('<lastmod>'));

  // --- crawler policy: search + AI crawlers allowed by default (deliberate,
  //     documented choice — the robots.txt generator is where blocking happens)
  const robots = read('robots.txt');
  ok('robots.txt: default policy allows every crawler', robots.includes('User-agent: *') && robots.includes('Allow: /') && !/User-agent:\s+(GPTBot|ClaudeBot|PerplexityBot|Google-Extended)/.test(robots));

  // --- measurement hooks for the 30-day plan (GA4 events + verification hooks)
  const siteJs = read('assets/site.js');
  for (const ev of ['tool_open', 'tool_run', 'copy_output', 'download_output', 'blog_cta_click', 'contact_click']) {
    ok(`site.js: GA4 event "${ev}" wired`, siteJs.includes(`'${ev}'`));
  }
  ok('site.js: every event goes through the consent-gated gtag helper', !/dataLayer\.push\(\{?\s*event:\s*'(tool_|copy_|download_|blog_|contact_)/.test(siteJs));
}


// ---------- site-wide duplicates
const kwStrings = new Map();
for (const t of TOOLS) add(kwStrings, t.keywords, t.slug);
for (const [k, v] of dupes(kwStrings)) ok('site: unique keyword strings', false, v.join(' , '));
for (const [k, v] of dupes(titles)) ok('site: unique meta titles', false, v.join(' , '));
for (const [k, v] of dupes(descs)) ok('site: unique meta descriptions', false, v.join(' , '));
for (const [k, v] of dupes(h1s)) ok('site: unique h1s', false, v.join(' , '));
for (const [k, v] of dupes(paragraphs)) ok('site: no duplicate paragraphs', false, v.join(' , '));
for (const [k, v] of dupes(faqQs)) ok('site: unique FAQ questions', false, v.join(' , '));
for (const [k, v] of dupes(faqAs)) ok('site: unique FAQ answers', false, v.join(' , '));
for (const t of TOOLS) { const hs = (t.sections || []).map((s) => slugOf(s.h)); ok(`${t.slug}: no repeated section heading on the page`, new Set(hs).size === hs.length, hs.join(' | ')); }

console.log(`\nSEO AUDIT: ${pass} passed, ${fail} failed`);
if (issues.length) {
  console.log('\n--- defects ---');
  issues.forEach((i) => console.log(' ✗ ' + i));
}
process.exit(fail ? 1 : 0);

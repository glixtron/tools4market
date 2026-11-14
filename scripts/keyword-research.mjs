// Keyword research: Google autocomplete -> coverage map against the site catalog.
//
//   node scripts/keyword-research.mjs
//   node scripts/keyword-research.mjs --queries /path/to/Queries.csv --limit 40
//
// Autocomplete is the cheap, live signal for what people actually type around a
// seed. The script asks for the seed plus a few high-yield prefixes, dedupes,
// then labels each phrase as covered (a tool or guide already targets it) or a
// gap. Pass a Google Search Console queries CSV (the "Queries" sheet exported as
// CSV) to merge observed impressions and positions into the same file.
//
// Output: docs/seo/keyword-map-<date>.csv (plus a console summary).

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOLS_SEO } from '../src/data/seo.js';
import { TOOLS_AI } from '../src/data/ai-search.js';
import { TOOLS_CONTENT } from '../src/data/content.js';
import { TOOLS_WEB } from '../src/data/web.js';
import { TOOLS_MARKETING } from '../src/data/marketing.js';
import { ARTICLES } from '../src/data/blog.js';

const R = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TOOLS = [...TOOLS_SEO, ...TOOLS_AI, ...TOOLS_CONTENT, ...TOOLS_WEB, ...TOOLS_MARKETING];

const args = process.argv.slice(2);
const argOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : '';
};
const QUERIES_CSV = argOf('--queries');
const LIMIT = parseInt(argOf('--limit') || '25', 10);
const NO_NETWORK = args.includes('--no-network');

// Seeds are the site's own bets: the phrases each tool and guide claims. The
// strongest few are expanded first, so a short run still samples real demand.
const SEED_OVERRIDES = [
  'core web vitals', 'cls', 'lcp', 'title tag length', 'canonical tag',
  'hreflang', 'rich results', 'structured data', 'robots.txt', 'serp preview',
  'keyword density', '301 redirect htaccess', 'ai search optimization',
  'schema markup', 'marketing budget calculator', 'roas calculator',
];
const seeds = [...new Set([
  ...SEED_OVERRIDES,
  ...TOOLS.map((t) => t.focus).filter(Boolean),
  ...ARTICLES.map((a) => a.focus).filter(Boolean),
])].slice(0, Math.max(LIMIT, SEED_OVERRIDES.length));

// Prefixes that surface different intents: definition, how-to, free, tool,
// and buyer-ish "for" phrases. Six requests per seed keeps the total polite.
const PREFIXES = ['', ' what is', ' how to', ' free', ' tool', ' for'];

const suggest = async (q) => {
  const url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Tools4MarketKeywordMap/1.0)' } });
  if (!res.ok) throw new Error('suggest HTTP ' + res.status);
  const body = await res.json();
  return Array.isArray(body) && Array.isArray(body[1]) ? body[1] : [];
};

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

// Coverage is a word-overlap score, not an exact string match: "ip converter"
// and "cls web vitals" are served by pages whose focus names include extra
// words. Generic tool words ("free", "tool", "checker") carry no topic, so the
// score is computed on the phrase's remaining words.
const STOP = new Set(('a an and are best can do does for free from how i in is it my of on online or the to tool tools testing test checker generator what when where which who why with you your').split(' '));
// Crude plural folding: "keywords density" and "keyword density" are the same
// intent, and so are "tester" / "test" after the stop list drops the latter.
const stem = (w) => (w.length > 4 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);
const wordsOf = (s) => norm(s).split(' ').filter((w) => w && !STOP.has(w)).map(stem);

const PAGE_INDEX = [
  ...TOOLS.map((t) => ({ kind: 'tool', slug: t.slug, focus: t.focus || t.name, name: t.name, keywords: t.keywords || '' })),
  ...ARTICLES.map((a) => ({ kind: 'guide', slug: a.slug, focus: a.focus, name: a.title, keywords: (a.relatedTools || []).map((s) => s.replace(/-/g, ' ')).join(' ') })),
].map((p) => {
  const focus = norm(p.focus);
  return { ...p, focus, words: new Set(wordsOf([p.focus, p.name, p.slug.replace(/-/g, ' '), p.keywords].join(' '))) };
});

const matchPage = (phrase) => {
  const p = norm(phrase);
  const pw = wordsOf(phrase);
  if (!pw.length) return null;
  let best = null;
  let bestScore = 0;
  for (const page of PAGE_INDEX) {
    if (p.includes(page.focus) || page.focus.startsWith(p + ' ')) return page;
    const hit = pw.filter((w) => page.words.has(w)).length / pw.length;
    if (hit > bestScore) { bestScore = hit; best = page; }
  }
  return bestScore >= 0.66 ? best : null;
};

const readQueries = async (file) => {
  if (!file) return new Map();
  const raw = await readFile(file, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const head = lines[0].toLowerCase();
  if (!head.includes('top queries')) {
    throw new Error('--queries expects the GSC "Queries" sheet as CSV with a "Top queries" column');
  }
  const map = new Map();
  for (const line of lines.slice(1)) {
    const cols = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
    if (!cols[0]) continue;
    map.set(norm(cols[0]), { query: cols[0], clicks: Number(cols[1]) || 0, impressions: Number(cols[2]) || 0, position: Number(cols[4]) || 0 });
  }
  return map;
};

const main = async () => {
  const observed = await readQueries(QUERIES_CSV);
  const phrases = new Map(); // normalised -> { phrase, seeds:Set }
  let requests = 0;

  if (!NO_NETWORK) {
    for (const seed of seeds) {
      for (const prefix of PREFIXES) {
        const q = (seed + prefix).trim();
        try {
          const list = await suggest(q);
          requests++;
          for (const phrase of list) {
            const k = norm(phrase);
            if (!k) continue;
            if (!phrases.has(k)) phrases.set(k, { phrase, seeds: new Set() });
            phrases.get(k).seeds.add(seed);
          }
          await new Promise((r) => setTimeout(r, 120));
        } catch (e) {
          console.warn('suggest failed for "' + q + '": ' + e.message);
        }
      }
      console.log('  seeded:', seed, '(' + phrases.size + ' phrases so far)');
    }
  }

  // Observed queries always belong in the map, even if autocomplete missed them.
  for (const [k, v] of observed) {
    if (!phrases.has(k)) phrases.set(k, { phrase: v.query, seeds: new Set() });
  }

  const rows = [];
  for (const [k, v] of phrases) {
    const page = matchPage(v.phrase);
    const seen = observed.get(k);
    rows.push({
      phrase: v.phrase,
      status: page ? 'covered' : 'gap',
      page_kind: page ? page.kind : '',
      page_slug: page ? page.slug : '',
      matched_focus: page ? page.focus : '',
      gsc_impressions: seen ? seen.impressions : '',
      gsc_clicks: seen ? seen.clicks : '',
      gsc_position: seen ? seen.position : '',
      seeds: [...v.seeds].slice(0, 3).join('; '),
    });
  }

  // Demand first: observed impressions, then gap phrases, then covered.
  rows.sort((a, b) => (b.gsc_impressions - a.gsc_impressions) || (a.status === b.status ? a.phrase.localeCompare(b.phrase) : a.status === 'gap' ? -1 : 1));

  const esc = (x) => {
    const s = String(x);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const HEAD = ['phrase', 'status', 'page_kind', 'page_slug', 'matched_focus', 'gsc_impressions', 'gsc_clicks', 'gsc_position', 'seeds'];
  const csv = [HEAD.join(',')].concat(rows.map((r) => HEAD.map((h) => esc(r[h])).join(','))).join('\n') + '\n';

  const outDir = path.join(R, 'docs', 'seo');
  await mkdir(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const out = path.join(outDir, 'keyword-map-' + stamp + '.csv');
  await writeFile(out, csv);

  const gaps = rows.filter((r) => r.status === 'gap');
  const demandGaps = gaps.filter((r) => r.gsc_impressions);
  console.log('\n' + rows.length + ' phrases · ' + (rows.length - gaps.length) + ' covered · ' + gaps.length + ' gaps (' + demandGaps.length + ' with observed impressions)');
  if (demandGaps.length) {
    console.log('\nGaps Google already showed us:');
    demandGaps.sort((a, b) => b.gsc_impressions - a.gsc_impressions).slice(0, 15)
      .forEach((r) => console.log('  ' + r.gsc_impressions + ' imp, pos ' + r.gsc_position.toFixed(1) + '  ' + r.phrase));
  }
  console.log('\nwrote ' + path.relative(R, out) + ' (' + requests + ' autocomplete requests)');
};

main().catch((e) => { console.error(e); process.exit(1); });

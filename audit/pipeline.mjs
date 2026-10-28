// audit/pipeline.mjs — orchestrator for the sitemap audit.
//
//   1 discover  sitemap index → every URL (+ robots, llms, rss)
//   2 fetch     concurrent GETs with retry and an optional disk cache
//   3 parse     HTML → Page object
//   4 rules     per-page findings
//   5 cross     site-wide findings (link graph, catalogue diff, duplicates)
//   6 report    markdown + JSON + console
//
// Usage:
//   npm run audit                       audit the live site
//   npm run audit:dist                  audit the local build
//   npm run audit:strict                exit non-zero on blockers
//   node audit/pipeline.mjs --diff      compare live against dist, finding by finding
//   node audit/pipeline.mjs --no-ads    audit a deliberately ad-free build (ALLOW_ADS_OFF=1)
//   node audit/pipeline.mjs --no-write  console only, write nothing
//   node audit/pipeline.mjs --only=tools
//   node audit/pipeline.mjs --dump      print parsed Page objects, run no rules

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { discover, mapLimit, ORIGIN } from './fetch.mjs';
import { parsePage } from './parse.mjs';
import { rules, groupOfPath } from './rules/index.mjs';
import { runCross } from './cross.mjs';
import { score } from './score.mjs';
import { buildJson, buildMarkdown, consoleSummary, writeReports } from './report.mjs';
import { TOOLS } from '../src/data/index.js';
import { ARTICLES } from '../src/data/blog.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_DIR = path.join(ROOT, 'docs', 'audit');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback = null) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const CONCURRENCY = Number(opt('concurrency', 6));

async function loadConfig() {
  return JSON.parse(await readFile(path.join(ROOT, 'audit', 'rules', 'catalog.json'), 'utf8'));
}

/** Read the ad configuration the site was built with. */
async function loadEnv() {
  const raw = await readFile(path.join(ROOT, '.env'), 'utf8').catch(() => null);
  if (!raw) return { enabled: true, configured: false, client: null, slots: {} };
  const get = (k) => (new RegExp(`^${k}\\s*=\\s*(.*)$`, 'm').exec(raw) || [, ''])[1].trim();
  const slots = {
    top: /^\d{6,}$/.test(get('AD_SLOT_TOP')) ? get('AD_SLOT_TOP') : null,
    content: /^\d{6,}$/.test(get('AD_SLOT_CONTENT')) ? get('AD_SLOT_CONTENT') : null,
    sidebar: /^\d{6,}$/.test(get('AD_SLOT_SIDEBAR')) ? get('AD_SLOT_SIDEBAR') : null,
  };
  const clientMatch = /ca-pub-\d+/.exec(get('ADSENSE_CLIENT')) || /ca-pub-\d+/.exec(raw);
  return { enabled: true, configured: Object.values(slots).some(Boolean), client: clientMatch ? clientMatch[0] : null, slots };
}

/** The context a rule sees. Built once, shared by every page. */
function makeContext({ config, env }) {
  const tools = TOOLS.map((t) => ({ slug: t.slug, name: t.name, focus: t.focus, cat: t.cat }));
  const articles = ARTICLES.map((a) => ({
    slug: a.slug,
    title: a.metaTitle || a.title,
    focus: a.focus,
    relatedTools: a.relatedTools || [],
    links: a.links || [],
  }));

  const toolOf = (pathname) => {
    const m = /^\/tools\/([a-z0-9-]+)\/$/.exec(pathname);
    return m ? tools.find((t) => t.slug === m[1]) || null : null;
  };
  const articleOf = (pathname) => {
    const m = /^\/blog\/([a-z0-9-]+)\/$/.exec(pathname);
    return m ? articles.find((a) => a.slug === m[1]) || null : null;
  };

  const expectedUnits = (pathname) => {
    if (!env.configured) return null;
    const group = groupOfPath(pathname);
    const n = (x) => (x ? 1 : 0);
    if (group === 'tools') return n(env.slots.top) + n(env.slots.content) + n(env.slots.sidebar);
    if (group === 'blog') return n(env.slots.content);
    return 0;
  };

  return {
    catalog: config,
    env,
    tools,
    articles,
    groupOf: groupOfPath,
    toolOf,
    articleOf,
    entryFor: (pathname) => toolOf(pathname) || articleOf(pathname),
    expectedUnits,
    noindexAllowed: new Set(),
  };
}

/** Stages 1–3. */
export async function collect({ target = 'live', cache = false, only = null } = {}) {
  const started = Date.now();
  const site = await discover({ target, cache });
  const wanted = only ? site.urls.filter((u) => groupOfPath(new URL(u).pathname) === only) : site.urls;
  const pages = await mapLimit(wanted, CONCURRENCY, async (url) => parsePage(await site.read(url)));
  return { site, pages, elapsedMs: Date.now() - started };
}

/** Stage 4 — per-page rules. */
export function runRules({ pages, ctx }) {
  const findings = [];
  for (const p of pages) {
    for (const rule of rules) {
      if (rule.scope === 'cross') continue;
      let res = null;
      try {
        res = rule.test(p, ctx);
      } catch (err) {
        findings.push({
          id: rule.id,
          severity: 'info',
          group: rule.group,
          page: p.path,
          message: `Rule threw: ${err.message}`,
          fix: 'A rule must never throw. This is a bug in audit/rules — fix it there; the page is not implicated.',
        });
        continue;
      }
      if (!res) continue;
      findings.push({ id: rule.id, severity: rule.severity, group: rule.group, page: p.path, ...res });
    }
  }
  return findings;
}

export function audit({ site, pages, elapsedMs, ctx, target, cross = true }) {
  const pageFindings = runRules({ pages, ctx });
  // A filtered run cannot answer site-wide questions: every page looks orphaned
  // and every catalogue entry looks missing when the rest were not fetched.
  const crossFindings = cross ? runCross({ pages, site, catalog: { tools: ctx.tools, articles: ctx.articles } }) : [];
  const findings = [...pageFindings, ...crossFindings];
  const scoring = score({ pages, findings, catalog: ctx.catalog });
  return { findings, scoring, meta: { target, pageCount: pages.length, elapsedMs, origin: ORIGIN } };
}

function ms(n) {
  return n < 1000 ? `${n}ms` : `${(n / 1000).toFixed(1)}s`;
}

async function main() {
  const wantsDiff = flag('diff');
  const target = flag('dist') ? 'dist' : 'live';
  const only = opt('only');
  const config = await loadConfig();
  const env = await loadEnv();
  // `ALLOW_ADS_OFF=1 npm run build` is a documented, legitimate way to produce an
  // ad-free build (guard in build.mjs). Comparing that build against `.env` would
  // report 148 blockers on a site that is doing exactly what it was told, which is
  // the fastest way to teach someone to ignore the report. The flag states the
  // intent the build could not record.
  if (flag('no-ads')) env.enabled = false;
  const ctx = makeContext({ config, env });

  if (flag('dump')) {
    const { pages, elapsedMs } = await collect({ target, cache: flag('cache'), only });
    for (const p of pages) {
      console.log(JSON.stringify({
        path: p.path, status: p.status, bytes: p.bytes, title: p.title,
        h1: p.h1.map((h) => h.text), jsonld: p.jsonld.map((j) => (j.ok ? j.data['@type'] : 'INVALID')),
        ads: { units: p.ads.units.length, divs: p.ads.divs.length, loader: p.ads.loaderCount },
        words: p.words, faq: p.faq.length,
      }));
    }
    console.log(`\ndump: ${pages.length} pages, ${ms(elapsedMs)}`);
    return;
  }

  const primary = await collect({ target, cache: flag('cache'), only });
  const result = audit({ ...primary, ctx, target, cross: !only });

  if (wantsDiff) {
    const other = await collect({ target: target === 'live' ? 'dist' : 'live', only });
    const otherResult = audit({ ...other, ctx, target: target === 'live' ? 'dist' : 'live' });
    const key = (f) => `${f.id}|${f.page}|${f.message}`;
    const a = new Set(result.findings.map(key));
    const b = new Set(otherResult.findings.map(key));
    const onlyHere = [...a].filter((k) => !b.has(k));
    const onlyThere = [...b].filter((k) => !a.has(k));
    console.log(`\ndiff: ${target} vs ${otherResult.meta.target}`);
    console.log(`  findings only in ${target}: ${onlyHere.length}`);
    onlyHere.slice(0, 20).forEach((k) => console.log('   + ' + k));
    console.log(`  findings only in ${otherResult.meta.target}: ${onlyThere.length}`);
    onlyThere.slice(0, 20).forEach((k) => console.log('   - ' + k));
  }

  console.log(`\ntarget ${result.meta.target} · ${primary.pages.length} urls · ${ms(primary.elapsedMs)} · ${rules.length} rules`);
  console.log(consoleSummary(result));

  if (!flag('no-write')) {
    const { reportPath, latestPath } = await writeReports({
      dir: REPORT_DIR,
      target: result.meta.target,
      markdown: buildMarkdown({ meta: result.meta, scoring: result.scoring, findings: result.findings, ruleCount: rules.length }),
      json: buildJson({ meta: result.meta, scoring: result.scoring, findings: result.findings }),
    });
    console.log(`\nreport ${path.relative(ROOT, reportPath)}`);
    console.log(`json   ${path.relative(ROOT, latestPath)}`);
  }

  const blockers = result.scoring.site.totals.blocker || 0;
  if (flag('strict') && blockers > 0) process.exit(1);
}

const isMain = process.argv[1] && new URL(import.meta.url).pathname === process.argv[1];
if (isMain) main().catch((err) => { console.error(err); process.exit(1); });

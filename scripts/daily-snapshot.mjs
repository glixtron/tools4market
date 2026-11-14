// Tools4Market — daily snapshot.
//
//   node scripts/daily-snapshot.mjs             all gates, writes artifacts/daily/YYYY-MM-DD.json
//   node scripts/daily-snapshot.mjs --no-live   skip the network suite
//
// Every gate below is a script that already exists in this repo. This file only
// runs them in a fixed order, loads .env the way build.mjs expects, and reduces
// the output to numbers a report can quote. It never edits source files.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SKIP_LIVE = process.argv.includes('--no-live');
const TZ = 'Asia/Kolkata';
const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });

const run = (args, timeout = 600000) => {
  const started = Date.now();
  try {
    const out = execFileSync(process.execPath, args, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out, ms: Date.now() - started };
  } catch (e) {
    return {
      code: typeof e.status === 'number' ? e.status : 1,
      out: `${e.stdout || ''}${e.stderr || ''}`,
      ms: Date.now() - started,
      error: e.signal || e.code,
    };
  }
};

// Each extractor returns { ok, summary, metrics }. `ok` is derived from the
// suite's own numbers, not from the exit code alone: a suite that reports
// failures and exits 0 is still a failure for the day's ledger.
const GATES = [
  { key: 'build', args: ['--env-file=.env', 'build.mjs'], extract: (out) => {
    const m = out.match(/Built (\d+) HTML pages/);
    return m
      ? { ok: true, summary: `${m[1]} HTML pages`, metrics: { pages: Number(m[1]) } }
      : { ok: false, summary: 'no build summary — check env', metrics: {} };
  } },
  { key: 'smoke', args: ['tests/smoke.mjs'], extract: (out) => {
    const m = out.match(/SMOKE: (\d+)\/(\d+) tool pages clean/);
    return m
      ? { ok: m[1] === m[2], summary: `${m[1]}/${m[2]} tool pages`, metrics: { pass: Number(m[1]), total: Number(m[2]) } }
      : { ok: false, summary: 'no smoke summary', metrics: {} };
  } },
  { key: 'tools', args: ['tests/tools-behaviour.mjs'], extract: (out) => {
    const m = out.match(/TOOL BEHAVIOUR: (\d+) passed, (\d+) failed/);
    return m
      ? { ok: m[2] === '0', summary: `${m[1]} passed, ${m[2]} failed`, metrics: { pass: Number(m[1]), fail: Number(m[2]) } }
      : { ok: false, summary: 'no behaviour summary', metrics: {} };
  } },
  { key: 'seo', args: ['tests/seo-audit.mjs'], extract: (out) => {
    const m = out.match(/SEO AUDIT: (\d+) passed, (\d+) failed/);
    return m
      ? { ok: m[2] === '0', summary: `${m[1]} passed, ${m[2]} failed`, metrics: { pass: Number(m[1]), fail: Number(m[2]) } }
      : { ok: false, summary: 'no SEO summary', metrics: {} };
  } },
  { key: 'links', args: ['tests/local-links.mjs'], extract: (out) => {
    const m = out.match(/LOCAL LINKS: (\d+) internal links resolve across (\d+) pages/);
    return m
      ? { ok: true, summary: `${m[1]} links / ${m[2]} pages`, metrics: { links: Number(m[1]), pages: Number(m[2]) } }
      : { ok: false, summary: 'no link summary', metrics: {} };
  } },
  { key: 'audit', args: ['audit/pipeline.mjs', '--dist'], extract: (out) => {
    const score = out.match(/score (\d+)\/100 over (\d+) pages/);
    const counts = out.match(/blockers (\d+)\s+major (\d+)\s+minor (\d+)\s+info (\d+)/);
    if (!score || !counts) return { ok: false, summary: 'no audit summary', metrics: {} };
    return {
      ok: counts[1] === '0',
      summary: `${score[1]}/100, ${counts[1]} blockers / ${counts[2]} major / ${counts[3]} minor`,
      metrics: {
        score: Number(score[1]),
        pages: Number(score[2]),
        blockers: Number(counts[1]),
        major: Number(counts[2]),
        minor: Number(counts[3]),
      },
    };
  } },
];

if (!SKIP_LIVE) {
  // The only gate that crosses the network. One retry: a single edge hiccup
  // should not turn the day red and send the next run chasing a non-issue.
  GATES.push({ key: 'live', retries: 1, args: ['--env-file-if-exists=.env', 'tests/live-verify.mjs'], extract: (out) => {
    const m = out.match(/TOTAL: (\d+) passed, (\d+) failed/);
    return m
      ? { ok: m[2] === '0', summary: `${m[1]} passed, ${m[2]} failed`, metrics: { pass: Number(m[1]), fail: Number(m[2]) } }
      : { ok: false, summary: 'no live summary', metrics: {} };
  } });
}

// Duplicate artifacts from cloud-sync (`name (1).ext`). They are copied into
// dist and inflate page counts, so the report needs the number rather than a
// surprise failure inside another suite.
const dupes = (dir) => {
  const hits = [];
  const walk = (d, depth) => {
    if (depth > 6) return;
    let entries = [];
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if (/ \(\d+\)(\.[^./]+)?$/.test(e.name)) hits.push(relative(ROOT, p));
    }
  };
  walk(join(ROOT, dir), 0);
  return hits;
};

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

const results = [];
for (const g of GATES) {
  let r;
  let parsed;
  const attempts = [];
  for (let i = 0; i <= (g.retries || 0); i++) {
    r = run(g.args);
    parsed = g.extract(r.out);
    const ok = parsed.ok && r.code === 0;
    attempts.push({ ok, summary: parsed.summary, seconds: Math.round(r.ms / 100) / 10 });
    if (ok) break;
  }
  results.push({
    key: g.key,
    ok: attempts.at(-1).ok,
    exit: r.code,
    attempts: attempts.length,
    seconds: attempts.at(-1).seconds,
    summary: parsed.summary,
    metrics: parsed.metrics,
    error: r.error || null,
    failures: r.out.split('\n').filter((l) => /^(FAIL|✗)/.test(l)).slice(0, 10),
    tail: r.out.trim().split('\n').slice(-12).join('\n'),
  });
}

const srcDupes = dupes('src');
const distDupes = dupes('dist');
const dirty = git(['status', '--porcelain']).split('\n').filter(Boolean);
const commits24h = git(['log', '--since=24.hours', '--pretty=%h %s']).split('\n').filter(Boolean);

const snapshot = {
  date: today,
  generatedAt: new Date().toISOString(),
  timezone: TZ,
  git: {
    branch: git(['rev-parse', '--abbrev-ref', 'HEAD']),
    head: git(['rev-parse', '--short', 'HEAD']),
    subject: git(['log', '-1', '--pretty=%s']),
    dirtyCount: dirty.length,
    commits24h,
  },
  duplicates: {
    srcCount: srcDupes.length,
    distCount: distDupes.length,
    sample: [...srcDupes, ...distDupes].slice(0, 8),
  },
  gates: results,
  verdict: results.every((r) => r.ok) ? 'green' : 'red',
};

const outDir = join(ROOT, 'artifacts', 'daily');
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `${today}.json`);
writeFileSync(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);

const pad = (s, n) => String(s).padEnd(n);
console.log(`Daily snapshot — ${today} (${TZ}) · verdict ${snapshot.verdict.toUpperCase()}`);
console.log(`HEAD ${snapshot.git.head} on ${snapshot.git.branch} · ${snapshot.git.dirtyCount} dirty paths · ${commits24h.length} commits in 24h`);
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${pad(r.key, 7)} ${pad(`${r.seconds}s`, 6)} ${r.summary}`);
}
console.log(`duplicates: ${srcDupes.length} in src/ · ${distDupes.length} in dist/`);
console.log(`json: ${relative(ROOT, outFile)}`);
if (!results.every((r) => r.ok)) {
  console.log('\nFailing gates:');
  for (const r of results.filter((x) => !x.ok)) {
    console.log(`\n--- ${r.key} (${r.attempts} attempt${r.attempts > 1 ? 's' : ''}) ---`);
    console.log(r.failures.length ? r.failures.join('\n') : r.tail);
  }
  process.exitCode = 1;
}

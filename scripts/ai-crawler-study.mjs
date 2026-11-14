#!/usr/bin/env node
// Tools4Market — AI crawler robots.txt study.
//
// Fetches /robots.txt for a ranked domain list (Tranco by default) and records
// whether each crawler in src/data/bots.js may fetch the site root. The output
// is committed as a dated snapshot: a study that silently changed its own
// numbers on every build would be worse than no study.
//
// Usage:
//   node scripts/ai-crawler-study.mjs --input /tmp/top-1m.csv --limit 1000 \
//     --out src/data/ai-crawler-study.json --csv src/data/ai-crawler-study.csv
//
// The result is descriptive: it records the state of the file on the day it was
// fetched. It is not a claim about what any crawler actually did.

import { readFile, writeFile } from 'node:fs/promises';
import { AI_BOTS } from '../src/data/bots.js';
import { parseRobots, verdictFor } from '../src/data/robots-parse.js';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i === -1 ? fallback : args[i + 1];
};

const INPUT = arg('input', '/tmp/top-1m.csv');
const LIMIT = Number(arg('limit', 1000));
const OUT = arg('out', 'src/data/ai-crawler-study.json');
const CSV = arg('csv', 'src/data/ai-crawler-study.csv');
const CONCURRENCY = Number(arg('concurrency', 10));
const TIMEOUT_MS = Number(arg('timeout', 9000));
const UA = 'Tools4MarketBot/1.0 (+https://tools4market.online/about/)';
// The homepage check only decides whether a domain is a website at all. A lot of
// publishers answer 403 to an unknown bot and are still ordinary sites, so this
// probe uses a browser identity; the robots.txt fetch below keeps ours.
const PROBE_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

// ---- robots.txt parser: see src/data/robots-parse.js ----------------------

// ---- fetch ---------------------------------------------------------------

async function fetchRobots(domain) {
  const attempt = async (scheme) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(scheme + '://' + domain + '/robots.txt', {
        redirect: 'follow',
        signal: ctrl.signal,
        headers: { 'user-agent': UA, accept: 'text/plain,*/*;q=0.5' },
      });
      const body = res.status >= 200 && res.status < 300 ? await res.text() : '';
      return { status: res.status, body, scheme };
    } catch (e) {
      return { status: 0, body: '', error: e.name === 'AbortError' ? 'timeout' : String(e.message || e), scheme };
    } finally {
      clearTimeout(timer);
    }
  };
  const https = await attempt('https');
  // A TLS or DNS failure is common for legacy hosts; one plain-HTTP retry keeps
  // them in the sample instead of counting them as "unknown".
  if (https.status === 0) return attempt('http');
  return https;
}

async function pool(items, worker, size) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

// A ranked list is not a list of websites: CDN endpoints, DNS hosts and API
// origins rank high but serve no page. Keep only domains that answer with HTML,
// so "the top N sites" means sites.
async function servesWebsite(domain) {
  const attempt = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch('https://' + domain + '/', {
        method,
        redirect: 'follow',
        signal: ctrl.signal,
        headers: method === 'HEAD'
          ? { 'user-agent': PROBE_UA, accept: 'text/html,*/*;q=0.5' }
          : { 'user-agent': PROBE_UA, accept: 'text/html,*/*;q=0.5', range: 'bytes=0-2048' },
      });
      const type = (res.headers.get('content-type') || '').toLowerCase();
      if (method === 'GET') { try { await res.body?.cancel(); } catch {} }
      return { networkError: false, ok: res.status >= 200 && res.status < 300 && type.includes('text/html'), status: res.status };
    } catch {
      return { networkError: true, ok: false, status: 0 };
    } finally {
      clearTimeout(timer);
    }
  };
  const head = await attempt('HEAD');
  if (head.ok) return true;
  // A network failure will fail again; only retry when the server answered.
  if (head.networkError) return false;
  return (await attempt('GET')).ok;
}

// ---- main ----------------------------------------------------------------

const csvText = await readFile(INPUT, 'utf8');
const candidates = csvText
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean)
  .map((line, i) => {
    const parts = line.split(',');
    return { rank: Number(parts[0]) || i + 1, domain: (parts[1] || parts[0]).trim() };
  })
  .slice(0, Number(arg('scan', LIMIT * 3)));

// Inclusion rule: a candidate is a website when either its homepage answers
// with HTML or its robots.txt is readable. The robots half matters: large
// publishers answer 403 to an unknown client on the homepage while still
// publishing a robots.txt, and dropping them would bias the sample toward
// sites that are friendly to bots.
console.error(`Checking ${candidates.length} candidates…`);
const started = Date.now();
let done = 0;

const probed = await pool(candidates, async (d) => {
  const r = await fetchRobots(d.domain);
  done++;
  if (done % 200 === 0) console.error(`  probed ${done}`);
  const readable = r.status >= 200 && r.status < 300 && r.body.length > 0;
  const isWebsite = readable || (await servesWebsite(d.domain));
  if (!isWebsite) return null;
  const groups = readable ? parseRobots(r.body) : new Map();
  const verdicts = {};
  for (const bot of AI_BOTS) {
    verdicts[bot.id] = readable ? verdictFor(groups, bot.ua) : (r.status === 404 || r.status === 410 ? 'nofile' : 'unknown');
  }
  return {
    rank: d.rank,
    domain: d.domain,
    status: r.status,
    note: r.error || '',
    bytes: r.body.length,
    verdicts,
  };
}, CONCURRENCY);

const rows = probed.filter(Boolean).slice(0, LIMIT);
const domains = rows.map((r) => ({ rank: r.rank, domain: r.domain }));
if (!rows.length) {
  console.error('No candidate resolved to a website; check network access.');
  process.exit(1);
}

const elapsed = ((Date.now() - started) / 1000).toFixed(0);
console.error(`Probed in ${elapsed}s`);

// ---- aggregate -----------------------------------------------------------

const readable = rows.filter((r) => r.status >= 200 && r.status < 300 && r.bytes > 0);
const nofile = rows.filter((r) => r.status === 404 || r.status === 410 || (r.status >= 200 && r.status < 300 && r.bytes === 0));
const errors = rows.filter((r) => !readable.includes(r) && !nofile.includes(r));

const perBot = AI_BOTS.map((b) => {
  const blocked = readable.filter((r) => r.verdicts[b.id] === 'blocked');
  return {
    id: b.id,
    ua: b.ua,
    owner: b.owner,
    purpose: b.purpose,
    group: b.group,
    blocked: blocked.length,
    pct: readable.length ? Math.round((blocked.length / readable.length) * 1000) / 10 : 0,
  };
});

const anyTraining = readable.filter((r) => AI_BOTS.some((b) => b.group === 'training' && r.verdicts[b.id] === 'blocked'));
const allTraining = readable.filter((r) => AI_BOTS.filter((b) => b.group === 'training').every((b) => r.verdicts[b.id] === 'blocked'));
const blockTrainAllowSearch = readable.filter((r) => {
  const blocksTrain = AI_BOTS.some((b) => b.group === 'training' && r.verdicts[b.id] === 'blocked');
  const allowsSearch = AI_BOTS.filter((b) => b.group === 'assistant').every((b) => r.verdicts[b.id] === 'allowed');
  return blocksTrain && allowsSearch;
});

const study = {
  generatedAt: new Date().toISOString(),
  source: 'Tranco top-1m list (the list snapshot fetched on the run date)',
  sourceUrl: 'https://tranco-list.eu/',
  sampleRequested: domains.length,
  sampleReadable: readable.length,
  sampleNoFile: nofile.length,
  sampleError: errors.length,
  perBot: perBot.sort((a, b) => b.blocked - a.blocked),
  summary: {
    anyTrainingBlocked: anyTraining.length,
    anyTrainingBlockedPct: pct(anyTraining.length, readable.length),
    allTrainingBlocked: allTraining.length,
    allTrainingBlockedPct: pct(allTraining.length, readable.length),
    blockTrainingAllowSearch: blockTrainAllowSearch.length,
    blockTrainingAllowSearchPct: pct(blockTrainAllowSearch.length, readable.length),
    openToAll: readable.length - anyTraining.length,
    openToAllPct: pct(readable.length - anyTraining.length, readable.length),
  },
  examples: perBot
    .filter((b) => b.blocked > 0)
    .slice(0, 6)
    .map((b) => ({
      ua: b.ua,
      domains: readable.filter((r) => r.verdicts[b.id] === 'blocked').slice(0, 5).map((r) => r.domain),
    })),
};

function pct(n, d) {
  return d ? Math.round((n / d) * 1000) / 10 : 0;
}

// A short, fixed list so the study page can show well-known sites without
// shipping every domain's verdict in the JSON payload.
const NOTABLE = ['google.com', 'wikipedia.org', 'nytimes.com', 'bbc.com', 'amazon.com', 'reddit.com', 'medium.com', 'github.com'];
study.notable = NOTABLE.map((d) => {
  const r = rows.find((x) => x.domain === d);
  return r ? { domain: d, status: r.status, gptbot: r.verdicts.gptbot, claudebot: r.verdicts.claudebot, perplexity: r.verdicts.perplexity } : { domain: d };
});

await writeFile(OUT, JSON.stringify(study, null, 2) + '\n');

// ---- csv -----------------------------------------------------------------
const header = ['rank', 'domain', 'robots_status', ...AI_BOTS.map((b) => b.id)];
const csvRows = rows.map((r) => [r.rank, r.domain, r.status === 0 ? 'unreachable' : r.status, ...AI_BOTS.map((b) => r.verdicts[b.id])]);
const csv = [header, ...csvRows].map((r) => r.join(',')).join('\n') + '\n';
await writeFile(CSV, csv);

console.log(`wrote ${OUT} and ${CSV}`);
console.log(`readable ${readable.length}, no file ${nofile.length}, errors ${errors.length}`);
for (const b of study.perBot.slice(0, 8)) console.log(`  ${b.ua.padEnd(22)} ${String(b.blocked).padStart(4)}  ${b.pct}%`);
console.log('summary', study.summary);

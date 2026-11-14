// audit/fetch.mjs — discovery and fetching for the sitemap audit.
//
// Two targets, one interface:
//   live  GET the real URL, following redirects manually so the chain is visible.
//         Manual redirects matter: a 302 where a 301 belongs is a finding, and
//         fetch() with redirect:'follow' erases that distinction.
//   dist  read the built file from dist/. Fast, offline, and useful for a diff:
//         the served page and the built page are not always the same document.
//
// Zero dependencies, like the rest of the repo.

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(ROOT, '.cache', 'audit');

export const ORIGIN = (process.env.AUDIT_ORIGIN || 'https://tools4market.online').replace(/\/$/, '');

const TIMEOUT_MS = 15000;
const MAX_HOPS = 6;
const CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * Run async work over a list with a fixed concurrency ceiling.
 * Preserves input order in the output.
 */
export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

/** Extract <loc> values from a sitemap, whether it is an index or a urlset. */
export function locs(xml) {
  return [...String(xml || '').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

/** True when the document is a sitemap index rather than a urlset. */
export function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/.test(String(xml || ''));
}

const cacheKey = (url, target) => createHash('sha1').update(target + ' ' + url).digest('hex');

async function readCache(key) {
  const file = path.join(CACHE, key + '.json');
  if (!existsSync(file)) return null;
  try {
    const rec = JSON.parse(await readFile(file, 'utf8'));
    if (Date.now() - (rec.at || 0) > CACHE_TTL_MS) return null;
    return rec;
  } catch {
    return null;
  }
}

async function writeCache(key, rec) {
  await mkdir(CACHE, { recursive: true });
  await writeFile(path.join(CACHE, key + '.json'), JSON.stringify(rec));
}

function headersToObject(h) {
  const out = {};
  for (const [k, v] of h.entries()) out[k.toLowerCase()] = v;
  return out;
}

/** Map a URL path to the file the build would have written for it. */
function distFile(url) {
  const { pathname } = new URL(url);
  const clean = decodeURIComponent(pathname);
  if (clean.endsWith('/')) return path.join(DIST, clean, 'index.html');
  const ext = path.extname(clean);
  if (ext) return path.join(DIST, clean);
  return path.join(DIST, clean, 'index.html');
}

async function fetchOnce(url, timeout = TIMEOUT_MS) {
  return fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(timeout),
    headers: {
      // A plain client UA. Googlebot would get different markup on some sites;
      // this audit is about what an ordinary visitor and a crawler both see.
      'user-agent': 'Mozilla/5.0 (compatible; T4M-Audit/1.0; +https://tools4market.online)',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'en',
    },
  });
}

/**
 * Fetch a URL on the live site, following redirects by hand so the chain can be
 * inspected. Retries once on a network error or a 5xx.
 */
async function fetchLive(url, { timeout = TIMEOUT_MS, retries = 1 } = {}) {
  const chain = [];
  let current = url;

  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    let res;
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        res = await fetchOnce(current, timeout);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        if (attempt === retries) break;
      }
    }
    if (!res) {
      return { url, finalUrl: current, status: 0, headers: {}, body: '', bytes: 0, chain, error: String(lastErr && lastErr.message || lastErr) };
    }

    const headers = headersToObject(res.headers);
    chain.push({ url: current, status: res.status, location: headers.location || null });

    if (res.status >= 300 && res.status < 400 && headers.location) {
      current = new URL(headers.location, current).toString();
      // Drain the redirect body so the socket is released.
      try { await res.arrayBuffer(); } catch {}
      continue;
    }

    const body = await res.text();
    return { url, finalUrl: current, status: res.status, headers, body, bytes: Buffer.byteLength(body), chain };
  }

  return { url, finalUrl: current, status: 0, headers: {}, body: '', bytes: 0, chain, error: 'redirect loop' };
}

/**
 * Build a reader for one target. The rest of the audit never touches the network
 * or the filesystem directly; it asks the reader for a URL.
 */
export function createReader({ target = 'live', cache = false } = {}) {
  return async function read(url) {
    if (target === 'dist') {
      const file = distFile(url);
      if (!existsSync(file)) {
        return { url, finalUrl: url, status: 404, headers: {}, body: '', bytes: 0, chain: [] };
      }
      const body = await readFile(file, 'utf8');
      return { url, finalUrl: url, status: 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body, bytes: Buffer.byteLength(body), chain: [], file };
    }

    const key = cacheKey(url, target);
    if (cache) {
      const hit = await readCache(key);
      if (hit) return { ...hit, fromCache: true };
    }

    const res = await fetchLive(url);
    if (cache && res.status >= 200 && res.status < 300) {
      await writeCache(key, { ...res, at: Date.now() });
    }
    return res;
  };
}

/**
 * How old is `dist/` relative to the source that should have produced it?
 *
 * A dist audit is only meaningful if dist was built from the current tree. On a
 * second checkout that has not rebuilt since a pull, `npm run audit:dist` happily
 * audits a week-old build and reports its findings as if they were the site's —
 * the exact confusion this tool exists to prevent, one level up. Compare the
 * newest source mtime with dist/index.html rather than trusting either alone.
 */
/**
 * Every path `dist/` can answer, as URL paths, for the link resolver.
 *
 * A dist audit used to treat "not in the sitemap and not crawled" as broken.
 * That is right for a page the build forgot, and wrong for two deliberate cases:
 * noindexed legal pages (out of the sitemap on purpose, still linked from every
 * footer) and static files the build copies in (the research `dataset.csv`).
 * On disk is the only honest definition of "resolves" for a local build.
 */
async function distPaths() {
  const out = new Set();
  const walk = async (dir) => {
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else {
        const rel = '/' + path.relative(DIST, p).split(path.sep).join('/');
        out.add(rel.replace(/\/index\.html$/, '/'));
      }
    }
  };
  await walk(DIST);
  return out;
}

async function distFreshness() {
  const newestUnder = async (dir) => {
    let newest = 0;
    const walk = async (d) => {
      let entries;
      try { entries = await readdir(d, { withFileTypes: true }); } catch { return; }
      for (const e of entries) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) await walk(p);
        else {
          const st = await stat(p).catch(() => null);
          if (st && st.mtimeMs > newest) newest = st.mtimeMs;
        }
      }
    };
    await walk(dir);
    return newest;
  };

  const builtPath = path.join(DIST, 'index.html');
  const builtStat = await stat(builtPath).catch(() => null);
  if (!builtStat) return { exists: false, builtAt: null, newestSource: null, stale: true, pages: 0 };

  const [src, build] = await Promise.all([newestUnder(path.join(ROOT, 'src')), stat(path.join(ROOT, 'build.mjs')).catch(() => null)]);
  const newestSource = Math.max(src, build ? build.mtimeMs : 0);
  const pages = await readdir(DIST, { withFileTypes: true })
    .then((es) => es.filter((e) => e.isDirectory()).length)
    .catch(() => 0);

  return {
    exists: true,
    builtAt: builtStat.mtimeMs,
    newestSource,
    // A minute of slack: build.mjs writes index.html before it copies the last
    // asset, so a build started seconds after an edit can otherwise look stale.
    stale: newestSource > builtStat.mtimeMs + 60_000,
    pages,
  };
}

/**
 * Stage 1 — discover every URL the audit must cover.
 *
 * The sitemap index is the source of truth, so an orphan page is detected by
 * what the sitemap lists versus what the site links to. robots.txt, llms.txt and
 * the RSS feed are read here because several rules need them and they are cheap.
 */
export async function discover({ target = 'live', origin = ORIGIN, cache = false } = {}) {
  const read = createReader({ target, cache });
  const base = origin;

  const indexRes = await read(base + '/sitemap.xml');
  const indexLocs = locs(indexRes.body);
  const sitemaps = [];

  if (isSitemapIndex(indexRes.body)) {
    for (const loc of indexLocs) {
      const res = await read(loc);
      sitemaps.push({ url: loc, status: res.status, body: res.body, locs: locs(res.body) });
    }
  } else if (indexLocs.length) {
    // A flat sitemap. Treated as one child so downstream code is uniform.
    sitemaps.push({ url: base + '/sitemap.xml', status: indexRes.status, body: indexRes.body, locs: indexLocs });
  }

  const urls = [...new Set(sitemaps.flatMap((s) => s.locs))];
  const [robotsRes, llmsRes, rssRes] = await Promise.all([
    read(base + '/robots.txt'),
    read(base + '/llms.txt'),
    read(base + '/feed.xml'),
  ]);

  return {
    target,
    origin: base,
    read,
    dist: target === 'dist' ? await distFreshness() : null,
    distPaths: target === 'dist' ? await distPaths() : null,
    index: { url: base + '/sitemap.xml', status: indexRes.status, body: indexRes.body, locs: indexLocs },
    sitemaps,
    urls,
    robots: { url: base + '/robots.txt', status: robotsRes.status, body: robotsRes.body, bytes: robotsRes.bytes },
    llms: { url: base + '/llms.txt', status: llmsRes.status, body: llmsRes.body, bytes: llmsRes.bytes },
    rss: { url: base + '/feed.xml', status: rssRes.status, body: rssRes.body, bytes: rssRes.bytes },
  };
}

#!/usr/bin/env node
// Tools4Market — source-link checker.
//
// Every guide's `links[]` is a citation, and a citation that 404s is worse than
// no citation. This script checks that each external source URL still returns a
// 2xx, and separates three kinds of redirect so a real move is visible:
//
//   moved   the document now lives at a different path — re-point the citation
//   locale  Google appended ?hl=<lang>; the path is the same document (noise)
//   slash   only a trailing slash changed (noise)
//
//   npm run check:sources            # network check, fails on 4xx/5xx
//   npm run check:sources -- --strict # also fails on moved citations
//
// It is a network check, so it is not part of the offline suites. Run it before
// publishing a content pack, and after a docs migration at a source we cite.
import { ARTICLES } from '../src/data/blog.js';

const STRICT = process.argv.includes('--strict');
const UA = 'Mozilla/5.0 (compatible; Tools4Market-source-check; +https://tools4market.online/)';
const TIMEOUT_MS = 20000;

const seen = new Map();
for (const article of ARTICLES) {
  for (const link of article.links || []) {
    if (!link?.url) continue;
    if (!seen.has(link.url)) seen.set(link.url, []);
    seen.get(link.url).push(article.slug);
  }
}

// A redirect that keeps the path but changes a locale query parameter is Google
// negotiating a language, not moving the document.
function classify(original, final) {
  if (original === final) return 'ok';
  let a, b;
  try {
    a = new URL(original);
    b = new URL(final);
  } catch {
    return 'moved';
  }
  const strip = (u) => {
    const copy = new URL(u.href);
    for (const key of ['hl', 'locale', 'lang']) copy.searchParams.delete(key);
    return copy;
  };
  const sa = strip(a);
  const sb = strip(b);
  if (sa.href === sb.href) return 'locale';
  const bare = (u) => u.origin + u.pathname.replace(/\/+$/, '');
  if (bare(sa) === bare(sb) && sa.search === sb.search) return 'slash';
  return 'moved';
}

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      // Google localises docs by Accept-Language, which produces ?hl=xx redirects
      // that say nothing about whether the document still exists.
      headers: { 'user-agent': UA, accept: 'text/html,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' },
    });
    const body = await res.text();
    return { url, ok: res.ok, status: res.status, final: res.url, bytes: body.length, kind: classify(url, res.url) };
  } catch (err) {
    return { url, ok: false, status: 0, final: url, error: err.name === 'AbortError' ? 'timeout' : err.message, kind: 'fail' };
  } finally {
    clearTimeout(timer);
  }
}

console.log(`Checking ${seen.size} unique source links across ${ARTICLES.length} guides…\n`);

const results = [];
for (const url of seen.keys()) {
  const result = await check(url);
  results.push(result);
  const users = seen.get(url).join(', ');
  if (!result.ok) {
    console.log(`FAIL  ${result.status || result.error}  ${url}\n      used by: ${users}`);
  } else if (result.kind === 'moved') {
    console.log(`MOVED → ${result.final}\n      ${url}\n      used by: ${users}`);
  } else if (result.bytes < 200) {
    console.log(`THIN  ${result.bytes} bytes  ${url}\n      used by: ${users}`);
  } else if (result.kind === 'locale' || result.kind === 'slash') {
    console.log(`OK    ${url}  (${result.kind} redirect ignored)`);
  } else {
    console.log(`OK    ${url}`);
  }
}

const failed = results.filter((r) => !r.ok);
const moved = results.filter((r) => r.ok && r.kind === 'moved');
const thin = results.filter((r) => r.ok && r.kind !== 'moved' && r.bytes < 200);
const quiet = results.filter((r) => r.ok && (r.kind === 'locale' || r.kind === 'slash'));
console.log(
  `\nSOURCES: ${results.length - failed.length}/${results.length} reachable, ${failed.length} failed, ` +
    `${moved.length} moved, ${quiet.length} locale/slash redirects ignored, ${thin.length} thin.`,
);

const broken = failed.length || thin.length || (STRICT && moved.length);
if (broken) {
  console.log('Fix or remove the failed citations before publishing. A moved URL means the document was relocated — re-point the citation at the new path, or drop the claim if the new page no longer supports it.');
  process.exit(1);
}
if (moved.length) console.log('Moved citations are warnings: re-point them, then re-run. Use --strict to turn them into failures.');

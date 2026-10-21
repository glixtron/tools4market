#!/usr/bin/env node
// Tools4Market — IndexNow submitter (audit action: "Add Bing Webmaster Tools
// and IndexNow"). IndexNow notifies participating search engines (Bing, Yandex,
// Seznam, Naver…) when URLs are added, updated or deleted. It does NOT
// guarantee indexing, and Google does not participate — Search Console +
// sitemap submission remains the Google path.
//
//   INDEXNOW_KEY=<your-key> node build.mjs        # publishes /<key>.txt
//   npm run indexnow                              # submit every sitemap URL
//   npm run indexnow -- /blog/new-guide/ /tools/meta-tag-generator/
//
// Rules of use (https://www.indexnow.org):
//   - The key must be hosted at <site>/<key>.txt (the build does that).
//   - Submit only URLs that are genuinely new or materially changed.
//   - Max 10,000 URLs per request; batch beyond that.
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const R = fileURLToPath(new URL('..', import.meta.url));
const HOST = (process.env.SITE_URL || 'https://tools4market.online').replace(/^https?:\/\//, '').replace(/\/+$/, '');
const KEY = (process.env.INDEXNOW_KEY || '').trim();
const ENDPOINT = 'https://api.indexnow.org/indexnow';

if (!KEY) {
  console.error('✗ INDEXNOW_KEY is not set. Generate a 32-char hex key once, then set it as a build env var so the build can publish /{key}.txt.');
  process.exit(1);
}

const asUrl = (p) => (p.startsWith('http') ? p.replace(/^https?:\/\/[^/]+/, 'https://' + HOST) : 'https://' + HOST + (p.startsWith('/') ? p : '/' + p));

// no CLI args → read every URL out of the built sitemap children
let urls = process.argv.slice(2).filter(Boolean).map(asUrl);
if (!urls.length) {
  const files = (await readdir(R + 'dist')).filter((f) => /^sitemap-[a-z]+\.xml$/.test(f));
  for (const f of files) {
    const xml = await readFile(R + 'dist/' + f, 'utf8');
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
  }
}
urls = [...new Set(urls)];

if (!urls.length) {
  console.error('✗ No URLs to submit (built sitemaps empty and no arguments given).');
  process.exit(1);
}
if (urls.length > 10000) {
  console.error('✗ IndexNow accepts at most 10,000 URLs per request — got ' + urls.length + '. Batch them.');
  process.exit(1);
}

const body = { host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: urls };
const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

// 200/202 = accepted for processing; 400/403/422 = our payload/key is wrong
if (res.status === 200 || res.status === 202) {
  console.log(`✔ IndexNow: ${urls.length} URL(s) submitted for ${HOST} (HTTP ${res.status}).`);
  console.log('  Verify in Bing Webmaster Tools → IndexNow. No guarantee of crawling or indexing.');
} else {
  const text = (await res.text()).slice(0, 400);
  console.error(`✗ IndexNow rejected the submission (HTTP ${res.status}).`);
  console.error('  Common causes: the key file is not reachable at ' + body.keyLocation + ', or the key does not match.');
  if (text) console.error('  Response: ' + text);
  process.exit(1);
}

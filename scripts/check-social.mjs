#!/usr/bin/env node
/**
 * Verifies the X threads in docs/day12/Day12_Social_Posts.md.
 *
 * X counts every URL as 23 characters (t.co wrapping), not the length of the
 * URL, so a tweet can be under 280 raw and over 280 weighted or vice versa.
 * Both numbers are reported and both must be <= 280.
 *
 * Usage: node scripts/check-social.mjs [--verbose]
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const FILE = path.join(process.cwd(), 'docs', 'day12', 'Day12_Social_Posts.md');
const LIMIT = 280;
const URL_WEIGHT = 23;

const verbose = process.argv.includes('--verbose');

/** X's weighted length: each link becomes 23 chars, bare domains included. */
const LINK_RE = /https?:\/\/[^\s]+|\b(?:[a-z0-9-]+\.)+(?:online|com|net|org|io|dev|co|app|ai)\b/gi;

function weightedLength(text) {
  let weight = 0;
  let last = 0;
  let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    weight += text.slice(last, m.index).length + URL_WEIGHT;
    last = m.index + m[0].length;
  }
  return weight + text.slice(last).length;
}

const md = await readFile(FILE, 'utf8');
const lines = md.split('\n');

/** Collect `**Tweet n/m**` followed by a fenced block. */
const tweets = [];
for (let i = 0; i < lines.length; i += 1) {
  const label = lines[i].match(/^\*\*Tweet (\d+)\/(\d+)\*\*$/);
  if (!label) continue;
  let j = i + 1;
  while (j < lines.length && lines[j].trim() !== '```') j += 1;
  if (j >= lines.length) continue;
  const body = [];
  j += 1;
  while (j < lines.length && lines[j].trim() !== '```') {
    body.push(lines[j]);
    j += 1;
  }
  tweets.push({
    index: Number(label[1]),
    total: Number(label[2]),
    line: i + 1,
    text: body.join('\n'),
  });
}

if (tweets.length === 0) {
  console.error('✖ No tweets found. Expected blocks labelled **Tweet n/m** followed by ``` fences.');
  process.exit(1);
}

let failures = 0;
let currentThread = 0;
let warnedTotal = false;

for (const t of tweets) {
  if (t.index === 1) {
    currentThread += 1;
    if (!warnedTotal && t.total !== 6) warnedTotal = true;
  }
  const raw = t.text.length;
  const weighted = weightedLength(t.text);
  const over = Math.max(0, raw - LIMIT, weighted - LIMIT);
  const ok = over === 0;
  if (!ok) failures += 1;
  const flag = ok ? '✓' : '✖';
  if (verbose || !ok) {
    console.log(
      `${flag} thread ${currentThread} tweet ${t.index}/${t.total} ` +
        `(line ${t.line}) raw=${raw} weighted=${weighted}` +
        (ok ? '' : ` — OVER by ${over}`)
    );
  }
}

const threadCount = tweets.filter((t) => t.index === 1).length;

console.log(
  `\n${failures === 0 ? '✓' : '✖'} ${tweets.length} tweets across ${threadCount} threads · ` +
    `limit ${LIMIT} chars · ${failures === 0 ? 'all within limit' : `${failures} over limit`}`
);

if (failures > 0) process.exit(1);

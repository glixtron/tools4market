#!/usr/bin/env node
// scripts/check-deploy.mjs — refuse to publish an ad-free build by accident.
//
// The build guard in build.mjs compares `.env` with the environment, which only
// works when `.env` is there to compare against. It cannot help a checkout that
// has never had one: no file, no intent, no complaint — and `npm run deploy`
// publishes a site with no loader and no units, exactly as it did twice on
// 28 Oct 2026 at 15:08 and 15:09 UTC, from a checkout with no `.env`.
//
// So check the artefact instead of the intention. If the thing about to be
// uploaded has no AdSense loader, that is a decision, and a decision needs the
// flag. Exit non-zero and say what to do.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = path.join(ROOT, 'dist', 'index.html');

if (/^(1|true|yes|on)$/i.test((process.env.ALLOW_ADS_OFF || '').trim())) {
  console.log('check-deploy: ALLOW_ADS_OFF=1 — publishing without ads on purpose.');
  process.exit(0);
}

const html = await readFile(INDEX, 'utf8').catch(() => null);
if (html === null) {
  console.error('\n!! dist/index.html is missing. Nothing to deploy.\n   Run: npm run build\n');
  process.exit(1);
}

const loader = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/.test(html);
if (loader) process.exit(0);

console.error(`
!! This build has no AdSense loader, and ALLOW_ADS_OFF is not set.

   Publishing it would take every ad slot off the site — 156 placements on 68
   pages — while every page still returns 200 and every content check passes.
   That has now happened twice, and both times the deploy log was green.

   The usual cause is deploying from a checkout where .env was never sourced,
   or from one that has no .env at all (a fresh clone, or another machine):

     set -a && source .env && set +a && npm run deploy

   If the build really is meant to ship without ads:

     ALLOW_ADS_OFF=1 npm run deploy
`);
process.exit(1);

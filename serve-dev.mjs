#!/usr/bin/env node
// Tools4Market — local dev/preview server.  node serve-dev.mjs  (port 8090)
// Serves ./dist statically AND implements GET /api/fetch?url=<encoded> with the
// same contract + SSRF guard as functions/api/fetch.js (the Cloudflare Pages
// Function used in production), so the "analyze your own page" URL mode works
// on localhost exactly like it will after deploy. Zero dependencies.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname, normalize } from 'node:path';

const R = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(R, 'dist');
const PORT = process.env.PORT ? Number(process.env.PORT) : 8090;
const MAX_BYTES = 1500000;
const TIMEOUT_MS = 12000;
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]', 'metadata.google.internal', '169.254.169.254'];

function isPrivateIPv4(host) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const a = Number(m[1]), b = Number(m[2]);
  return a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a === 0;
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

function json(res, status, obj, extraHeaders) {
  res.writeHead(status, Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, extraHeaders || {}));
  res.end(JSON.stringify(obj));
}

async function apiFetch(res, reqUrl) {
  const raw = reqUrl.searchParams.get('url');
  if (!raw) return json(res, 400, { ok: false, error: 'Missing ?url= parameter.' });
  let target;
  try { target = new URL(raw); } catch { return json(res, 400, { ok: false, error: 'Invalid URL.' }); }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return json(res, 400, { ok: false, error: 'Only http:// and https:// URLs are supported.' });
  }
  const host = target.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(host) || isPrivateIPv4(host)) {
    return json(res, 403, { ok: false, error: 'That host is not allowed.' });
  }
  const started = Date.now();
  try {
    const upstream = await fetch(target.toString(), {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Tools4MarketBot/1.0; +https://tools4market.online)',
        'Accept': 'text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const contentType = upstream.headers.get('content-type') || '';
    const buf = await upstream.arrayBuffer();
    const truncated = buf.byteLength > MAX_BYTES;
    const body = new TextDecoder('utf-8').decode(truncated ? buf.slice(0, MAX_BYTES) : buf);
    json(res, 200, {
      ok: true, status: upstream.status, finalUrl: upstream.url, contentType,
      bytes: buf.byteLength, truncated, ms: Date.now() - started, body,
    });
  } catch (e) {
    json(res, 502, { ok: false, error: String((e && e.message) || e), ms: Date.now() - started });
  }
}

async function serveStatic(res, pathname) {
  let rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  if (rel.endsWith('/')) rel += 'index.html';
  let file = join(DIST, rel);
  try {
    let data;
    try { data = await readFile(file); }
    catch { file = join(rel, 'index.html'); data = await readFile(join(DIST, rel, 'index.html')); }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    try {
      const nf = await readFile(join(DIST, '404.html'));
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      res.end(nf);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404');
    }
  }
}

createServer(async (req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost:' + PORT);
  if (reqUrl.pathname === '/api/fetch') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Method not allowed.' });
    return apiFetch(res, reqUrl);
  }
  return serveStatic(res, reqUrl.pathname);
}).listen(PORT, () => console.log('Tools4Market dev server → http://localhost:' + PORT + '/  (static + /api/fetch proxy)'));

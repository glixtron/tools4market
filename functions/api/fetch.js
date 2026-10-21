// Tools4Market — Cloudflare Pages Function: GET /api/fetch?url=<encoded>
// Server-side fetch proxy so our client-side tools can READ a page (CORS-free).
// Cloudflare Pages deploys everything in /functions automatically — no extra config,
// free tier = 100k req/day, no API keys shipped to the browser.
//
// Layer 1 of the graceful-degradation chain: if this endpoint isn't deployed
// (e.g. local `python3 -m http.server` preview), the client falls back to a direct
// browser fetch, then to the paste-HTML path. Tools never hard-depend on this.

const MAX_BYTES = 1500000;   // 1.5 MB cap — enough for analysis, cheap on bandwidth
const TIMEOUT_MS = 12000;
// SSRF guard: never let the public proxy reach loopback / private / metadata hosts.
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]', 'metadata.google.internal', '169.254.169.254'];

function isPrivateIPv4(host) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false; // not an IPv4 literal (hostname handled by BLOCKED_HOSTS + DNS)
  const a = Number(m[1]), b = Number(m[2]);
  if (a === 10) return true;                       // 10.0.0.0/8
  if (a === 127) return true;                      // loopback
  if (a === 169 && b === 254) return true;         // link-local / cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;// 172.16.0.0/12
  if (a === 192 && b === 168) return true;         // 192.168.0.0/16
  if (a === 0) return true;                        // 0.0.0.0/8
  return false;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',              // our own static site(s)
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, CORS),
  });
}

export async function onRequestGet(context) {
  const { request } = context;
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const raw = new URL(request.url).searchParams.get('url');
  if (!raw) return json({ ok: false, error: 'Missing ?url= parameter.' }, 400);

  let target;
  try { target = new URL(raw); } catch (e) { return json({ ok: false, error: 'Invalid URL.' }, 400); }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return json({ ok: false, error: 'Only http:// and https:// URLs are supported.' }, 400);
  }
  const host = target.hostname.toLowerCase();
  if (BLOCKED_HOSTS.indexOf(host) !== -1 || isPrivateIPv4(host)) {
    return json({ ok: false, error: 'That host is not allowed.' }, 403);
  }

  const started = Date.now();
  try {
    const res = await fetch(target.toString(), {
      redirect: 'follow',
      signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Tools4MarketBot/1.0; +https://tools4market.online)',
        'Accept': 'text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const contentType = res.headers.get('content-type') || '';
    const buf = await res.arrayBuffer();
    const truncated = buf.byteLength > MAX_BYTES;
    const slice = truncated ? buf.slice(0, MAX_BYTES) : buf;
    const body = new TextDecoder('utf-8').decode(slice);
    return json({
      ok: true,
      status: res.status,
      finalUrl: res.url,
      contentType,
      xRobotsTag: res.headers.get('x-robots-tag') || '',
      bytes: buf.byteLength,
      truncated,
      ms: Date.now() - started,
      body,
    }, 200);
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e), ms: Date.now() - started }, 502);
  }
}

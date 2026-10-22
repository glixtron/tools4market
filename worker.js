// Tools4Market — Cloudflare Worker entrypoint.
//
// One Worker serves BOTH layers:
//   • frontend  → the static site in dist/ (served through the ASSETS binding)
//   • backend   → GET /api/fetch?url=<encoded> (the same live-URL proxy that runs
//                 as a Pages Function on Cloudflare Pages)
//
// The proxy logic lives in functions/api/fetch.js and is shared by both deploy
// targets — the Pages Function calls it directly, this Worker adapts it to the
// Workers `fetch(request, env, ctx)` signature. One codebase, two hosts.

import { onRequestGet } from './functions/api/fetch.js';
import { handleSuggest } from './functions/api/suggest.js';

// Canonical host. The apex serves the site; www is redirected here in one hop
// (path + query preserved) so there is never a redirect chain or a loop, and
// so both hosts can be attached to this Worker safely.
const CANONICAL_HOST = 'tools4market.online';
const CANONICAL_ORIGIN = 'https://' + CANONICAL_HOST;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = (request.headers.get('host') || '').toLowerCase().split(':')[0];

    // ---- one-hop canonical redirect: www -> apex -------------------------
    if (host === 'www.' + CANONICAL_HOST) {
      return new Response(null, {
        status: 301,
        headers: {
          'Location': CANONICAL_ORIGIN + url.pathname + url.search,
          'Cache-Control': 'no-store',
        },
      });
    }

    // ---- backend: the live-URL proxy ------------------------------------
    if (url.pathname === '/api/fetch' || url.pathname === '/api/fetch/') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      }
      try {
        return await onRequestGet({ request });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String((e && e.message) || e) }), {
          status: 502,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    // ---- backend: AI fix suggestions (Workers AI, consent-gated client) ---
    if (url.pathname === '/api/suggest' || url.pathname === '/api/suggest/') {
      try {
        return await handleSuggest(request, env);
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String((e && e.message) || e) }), {
          status: 502,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
    }

    // ---- frontend: static assets ---------------------------------------
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      // serve the branded 404 page (dist/404.html) instead of a bare 404
      try {
        const nf = await env.ASSETS.fetch(new Request(new URL('/404.html', url).toString(), request));
        if (nf && nf.status === 200) {
          return new Response(nf.body, { status: 404, headers: nf.headers });
        }
      } catch (e) { /* fall through to the original 404 */ }
    }
    return res;
  },
};

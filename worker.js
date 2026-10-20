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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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

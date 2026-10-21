// Tools4Market — local smoke test: every tool page must boot, respond and stay error-free.
//
//   npm i --no-save jsdom      (test-only dependency; the site itself has none)
//   node build.mjs
//   node tests/smoke.mjs
//
// Loads the real dist/ HTML with the real runtime scripts in jsdom, drives every
// input/select/checkbox and every non-copy button, and fails on any console error,
// uncaught exception, missing tool registration or missing output.
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');

class LocalLoader extends ResourceLoader {
  fetch(url) {
    const u = new URL(url);
    if (u.hostname !== 'localhost') return null; // block external assets
    const p = decodeURIComponent(u.pathname);
    const file = path.join(DIST, p.endsWith('/') ? p + 'index.html' : p);
    try { return Promise.resolve(readFileSync(file)); } catch { return Promise.reject(new Error('404 ' + p)); }
  }
}

const slugs = readFileSync(path.join(DIST, 'sitemap-tools.xml'), 'utf8')
  .split('<loc>').slice(1).map((s) => s.split('</loc>')[0].replace(/^https?:\/\/[^/]+/, '').replace('/tools/', '').replace(/\/$/, ''));

let pass = 0, fail = 0;
for (const slug of slugs) {
  const rel = '/tools/' + slug + '/';
  const html = readFileSync(path.join(DIST, rel, 'index.html'), 'utf8');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(String((e && e.message) || e)));
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', resources: new LocalLoader(), url: 'http://localhost:8090' + rel, virtualConsole: vc, pretendToBeVisual: true,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => ({ font: '', measureText: (t) => ({ width: String(t).length * 8 }), fillRect() {}, fillText() {}, clearRect() {}, drawImage() {} });
      w.fetch = () => Promise.reject(new TypeError('offline'));
      w.HTMLElement.prototype.scrollIntoView = function () {};
    },
  });
  await new Promise((r) => { dom.window.addEventListener('load', r); setTimeout(r, 1200); });
  await new Promise((r) => setTimeout(r, 60));
  const doc = dom.window.document;
  const registered = !!dom.window.T4M_TOOLS && typeof dom.window.T4M_TOOLS[slug] === 'function';
  for (const el of doc.querySelectorAll('#tool-root input, #tool-root textarea, #tool-root select')) {
    try {
      if (el.type === 'checkbox') el.checked = !el.checked;
      else if (el.tagName === 'SELECT') { if (el.options.length > 1) el.selectedIndex = 1; }
      else if (el.type === 'number' || el.type === 'range') el.value = '25';
      else if (el.type === 'date') el.value = '2026-01-15';
      else if (el.type === 'email') el.value = 'test@example.com';
      else if (el.type === 'url') el.value = 'https://example.com/page';
      else if (el.tagName === 'TEXTAREA') el.value = 'https://example.com/page\nhttps://example.com/about';
      else el.value = 'test value';
      el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
      el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    } catch (e) { errors.push('field ' + el.id + ': ' + e.message); }
  }
  for (const b of doc.querySelectorAll('#tool-root button:not([data-copy]):not([data-download])')) {
    try { b.click(); } catch (e) { errors.push('button: ' + e.message); }
  }
  await new Promise((r) => setTimeout(r, 80));
  // give slow tools a moment to produce output (avoid flaky failures under load)
  let out = '';
  for (let i = 0; i < 20; i++) {
    out = [...doc.querySelectorAll('#tool-root pre.code, #tool-root .output-area, #tool-root input[id$="-out"], #tool-root [id$="-stats"], #tool-root [id$="-note"]')]
      .map((o) => (o.value || o.textContent || '').trim()).filter(Boolean).join(' ');
    if (out.length) break;
    await new Promise((r) => setTimeout(r, 75));
  }
  const checks = [
    ['tool registered', registered],
    ['no console/jsdom errors', errors.length === 0],
    ['produced output', out.length > 0],
  ];
  const bad = checks.filter((c) => !c[1]);
  if (bad.length) {
    fail++;
    console.log('✗', slug.padEnd(30), bad.map((b) => b[0]).join(', '), errors.slice(0, 2).join(' | '));
  } else { pass++; console.log('✓', slug.padEnd(30), 'ok'); }
  dom.window.close();
}
console.log(`\nSMOKE: ${pass}/${slugs.length} tool pages clean (${fail} failing)`);
process.exit(fail ? 1 : 0);

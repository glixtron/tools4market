// Tools4Market — cookie consent behaviour test (analytics must not fire before consent).
//
//   node tests/consent-test.mjs
//
// Verifies: default-consent is denied, the banner shows until a choice is made,
// Accept / Reject / Manage persist the choice, and the consent state is pushed
// to dataLayer so the GTM container can act on it.
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  (cond ? pass++ : fail++);
  console.log((cond ? 'PASS' : 'FAIL') + '  ' + name + (detail ? '  | ' + String(detail).slice(0, 120) : ''));
};

class LocalLoader extends ResourceLoader {
  fetch(url) {
    const u = new URL(url);
    if (u.hostname !== 'localhost') return null;
    const p = decodeURIComponent(u.pathname);
    try { return Promise.resolve(readFileSync(path.join(DIST, p.endsWith('/') ? p + 'index.html' : p))); }
    catch { return Promise.reject(new Error('404 ' + p)); }
  }
}

async function load(url, stored) {
  const html = readFileSync(path.join(DIST, url, 'index.html'), 'utf8');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(String((e && e.message) || e)));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', resources: new LocalLoader(), url: 'http://localhost:8090' + url,
    virtualConsole: vc, pretendToBeVisual: true,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => ({ font: '', measureText: (t) => ({ width: String(t).length * 8 }), fillRect() {}, fillText() {}, clearRect() {}, drawImage() {} });
      w.fetch = () => Promise.reject(new TypeError('offline'));
      if (stored) w.localStorage.setItem('t4m_consent', stored);
    },
  });
  await new Promise((r) => { dom.window.addEventListener('load', r); setTimeout(r, 900); });
  await new Promise((r) => setTimeout(r, 60));
  return { dom, errors, doc: dom.window.document, win: dom.window };
}
const lastConsent = (win) => {
  const dl = win.dataLayer || [];
  for (let i = dl.length - 1; i >= 0; i--) if (dl[i] && dl[i].event === 'consent_update') return dl[i];
  return null;
};
const defaultConsent = (win) => {
  const dl = win.dataLayer || [];
  for (let i = 0; i < dl.length; i++) if (dl[i] && dl[i].event === 'default_consent') return dl[i];
  return null;
};

// 1. first visit: nothing stored → banner shown, defaults denied
{
  const { dom, doc, win, errors } = await load('/');
  const d = defaultConsent(win);
  ok('GTM container id present in page', doc.documentElement.innerHTML.includes('GTM-P6P4FLGB'));
  ok('noscript iframe present', doc.documentElement.innerHTML.includes('ns.html?id=GTM-P6P4FLGB'));
  ok('default consent = denied before any choice', !!d && d.analytics_storage === 'denied' && d.ad_storage === 'denied', JSON.stringify(d));
  ok('banner shown when no choice stored', doc.getElementById('ck-banner').hidden === false);
  ok('preferences panel starts hidden', doc.getElementById('ck-panel').hidden === true);
  ok('no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));

  // 2. reject
  doc.getElementById('ck-reject').click();
  const afterReject = lastConsent(win);
  ok('reject → banner hidden', doc.getElementById('ck-banner').hidden === true);
  ok('reject → consent denied pushed', !!afterReject && afterReject.analytics_storage === 'denied' && afterReject.ad_storage === 'denied', JSON.stringify(afterReject));
  ok('reject → choice persisted', win.localStorage.getItem('t4m_consent') === '{"analytics":false,"ads":false}', win.localStorage.getItem('t4m_consent'));
  dom.window.close();
}

// 3. return visit with a stored choice → banner stays hidden, state re-pushed
{
  const { dom, doc, win } = await load('/', '{"analytics":true,"ads":false}');
  ok('returning visitor: banner stays hidden', doc.getElementById('ck-banner').hidden === true);
  const c = lastConsent(win);
  ok('returning visitor: stored consent re-pushed', !!c && c.analytics_storage === 'granted' && c.ad_storage === 'denied', JSON.stringify(c));
  // footer "Cookie settings" reopens the panel
  doc.querySelector('[data-ck-settings]').click();
  ok('footer link reopens preferences', doc.getElementById('ck-panel').hidden === false);
  ok('preferences reflect the stored choice', doc.getElementById('ck-analytics').checked === true && doc.getElementById('ck-ads').checked === false);
  // 4. save with analytics only
  doc.getElementById('ck-analytics').checked = true;
  doc.getElementById('ck-ads').checked = false;
  doc.getElementById('ck-save').click();
  const saved = lastConsent(win);
  ok('save → panel closes', doc.getElementById('ck-panel').hidden === true);
  ok('save → granular consent pushed', !!saved && saved.analytics_storage === 'granted' && saved.ad_storage === 'denied', JSON.stringify(saved));
  dom.window.close();
}

// 5. accept all
{
  const { dom, doc, win } = await load('/');
  doc.getElementById('ck-accept').click();
  const c = lastConsent(win);
  ok('accept all → consent granted', !!c && c.analytics_storage === 'granted' && c.ad_storage === 'granted', JSON.stringify(c));
  ok('accept all → banner hidden', doc.getElementById('ck-banner').hidden === true);
  dom.window.close();
}

console.log(`\nCONSENT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

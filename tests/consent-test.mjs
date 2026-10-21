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
const gtagCalls = (win, cmd) => (win.dataLayer || []).filter((e) => e && e[0] === 'consent' && e[1] === cmd);
const defaultConsent = (win) => {
  const dl = win.dataLayer || [];
  for (let i = 0; i < dl.length; i++) if (dl[i] && dl[i].event === 'default_consent') return dl[i];
  return null;
};
const setCalls = (win, name) => (win.dataLayer || []).filter((e) => e && e[0] === 'set' && e[1] === name);

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

  // Google: "the order of the code here is vital" — the consent default must be
  // executed before any tag fires. DOM position is not the signal (GTM's loader
  // re-inserts itself as the first script in <head>); execution order is.
  const dl = win.dataLayer || [];
  const iConsentCall = dl.findIndex((e) => e && e[0] === 'consent' && e[1] === 'default');
  const iGtmStart = dl.findIndex((e) => e && e.event === 'gtm.js');
  const iConfig = dl.findIndex((e) => e && e[0] === 'config');
  ok('consent default executes BEFORE the GTM loader', iConsentCall > -1 && (iGtmStart === -1 || iConsentCall < iGtmStart), 'consent@' + iConsentCall + ' gtm.start@' + iGtmStart);
  ok('consent default executes BEFORE the GA4 config', iConsentCall > -1 && (iConfig === -1 || iConsentCall < iConfig), 'consent@' + iConsentCall + ' config@' + iConfig);
  const html = doc.documentElement.innerHTML;
  ok('exactly one Google tag on the page', (html.match(/gtag\/js\?id=G-6B4GGFC96K/g) || []).length === 1);

  // v2 consent types present in the default state
  const def = gtagCalls(win, 'default');
  const types = def.length ? Object.keys(def[0][2] || {}) : [];
  ok('default consent declares all 4 v2 types', ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'].every((t) => types.includes(t)), types.join(','));
  ok('basic mode: EEA/UK region scoping present', def.some((c) => c[2] && Array.isArray(c[2].region) && c[2].region.includes('GB') && c[2].region.includes('DE')), JSON.stringify(def.map((c) => c[2] && c[2].region)));
  ok('basic mode: wait_for_update lets the banner answer', def.some((c) => c[2] && c[2].wait_for_update === 500));
  ok('url_passthrough enabled', setCalls(win, 'url_passthrough').length === 1);
  ok('ads_data_redaction enabled', setCalls(win, 'ads_data_redaction').length === 1);

  // 2. reject
  doc.getElementById('ck-reject').click();
  const afterReject = lastConsent(win);
  ok('reject → banner hidden', doc.getElementById('ck-banner').hidden === true);
  ok('reject → consent denied pushed', !!afterReject && afterReject.analytics_storage === 'denied' && afterReject.ad_storage === 'denied', JSON.stringify(afterReject));
  ok('reject → choice persisted', win.localStorage.getItem('t4m_consent') === '{"analytics":false,"ads":false}', win.localStorage.getItem('t4m_consent'));
  dom.window.close();
}

// 3. return visit with a stored choice → banner stays hidden, state restored BEFORE the tags
{
  const { dom, doc, win } = await load('/', '{"analytics":true,"ads":false}');
  ok('returning visitor: banner stays hidden', doc.getElementById('ck-banner').hidden === true);
  const c = lastConsent(win);
  ok('returning visitor: stored consent re-pushed', !!c && c.analytics_storage === 'granted' && c.ad_storage === 'denied', JSON.stringify(c));
  // the stored choice must be restored in the head, before the tags fire
  const def = gtagCalls(win, 'default');
  ok('returning visitor: stored choice restored as the default (before tags)', def.length >= 1 && def[0][2] && def[0][2].analytics_storage === 'granted' && def[0][2].ad_storage === 'denied', JSON.stringify(def[0] && def[0][2]));
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
  // public API
  ok('window.T4M_CONSENT API exposed', !!(win.T4M_CONSENT && typeof win.T4M_CONSENT.get === 'function' && typeof win.T4M_CONSENT.update === 'function' && typeof win.T4M_CONSENT.granted === 'function'));
  dom.window.close();
}

// 5. accept all
{
  const { dom, doc, win } = await load('/');
  const gtagCalls = () => (win.dataLayer || []).filter((e) => e && e[0] === 'consent' && e[1] === 'update');
  ok('GA4 tag loaded once with the right id', (doc.documentElement.innerHTML.match(/gtag\/js\?id=G-6B4GGFC96K/g) || []).length === 1);
  doc.getElementById('ck-accept').click();
  const c = lastConsent(win);
  ok('accept all → consent granted', !!c && c.analytics_storage === 'granted' && c.ad_storage === 'granted', JSON.stringify(c));
  ok('accept all → banner hidden', doc.getElementById('ck-banner').hidden === true);
  const calls = gtagCalls();
  ok('GA4 consent updated on accept', calls.length === 1 && calls[0][2] && calls[0][2].analytics_storage === 'granted', JSON.stringify(calls[0] && calls[0][2]));
  dom.window.close();
}

// 6. reject → GA4 consent must be updated to denied as well
{
  const { dom, doc, win } = await load('/');
  doc.getElementById('ck-reject').click();
  const calls = (win.dataLayer || []).filter((e) => e && e[0] === 'consent' && e[1] === 'update');
  ok('GA4 consent updated on reject', calls.length === 1 && calls[0][2] && calls[0][2].analytics_storage === 'denied', JSON.stringify(calls[0] && calls[0][2]));
  dom.window.close();
}

console.log(`\nCONSENT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

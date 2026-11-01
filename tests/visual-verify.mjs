// Quick verification: boot the marketing and keyword tools in jsdom and confirm
// the chart containers render and output is produced, with no console errors.
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

function assetReq(url) {
  const file = path.join(DIST, decodeURIComponent(new URL(url).pathname));
  try { return readFileSync(file); } catch { return null; }
}

const slugs = ['roi-calculator','roas-calculator','cac-calculator','ad-metrics-calculator','email-roi-calculator','marketing-budget-calculator','keyword-density-checker'];
let pass = 0, fail = 0;
for (const slug of slugs) {
  const html = readFileSync(path.join(DIST, 'tools', slug, 'index.html'), 'utf8');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String((e && e.message) || e)));
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: { fetch: assetReq },
    virtualConsole: vc,
    pretendToBeVisual: true,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => ({
        font: '', measureText: (t) => ({ width: String(t).length * 8 }),
        fillRect() {}, fillText() {}, clearRect() {}, drawImage() {},
      });
      w.fetch = () => Promise.reject(new TypeError('offline'));
      w.HTMLElement.prototype.scrollIntoView = function () {};
    },
  });
  await new Promise(r => { dom.window.addEventListener('load', r); setTimeout(r, 1200); });
  await new Promise(r => setTimeout(r, 120));
  const doc = dom.window.document;
  const outEl = doc.querySelector('[id$="-out"], #roic-out, #roasc-out, #cacc-out, #amc-out, #erc-out, #mbc-out, #kd-out') || doc.querySelector('.output-area, pre.code');
  const visEl = doc.querySelector('.kpi-strip, #kd-vis, #roic-vis, #roasc-vis, #cacc-vis, #amc-vis, #erc-vis, #mbc-vis');
  const chartCards = doc.querySelectorAll('.chart-card');
  const statTiles = doc.querySelectorAll('.stat-tile');
  const barRows = doc.querySelectorAll('.bar-row');
  const outputText = outEl ? (outEl.textContent || '').trim() : '';
  const visRendered = visEl && (visEl.children.length > 0);
  const chartRendered = chartCards.length > 0;
  const tileRendered = statTiles.length > 0;
  const hasOutput = outputText.length > 0;
  const good = hasOutput && (visRendered || chartRendered || tileRendered || barRows.length > 0) && errors.length === 0;
  if (good) { pass++; console.log('✓', slug.padEnd(30), `${chartCards.length} charts · ${statTiles.length} tiles · ${barRows.length} bars`); }
  else { fail++; console.log('✗', slug.padEnd(30), { output: hasOutput, vis: visRendered, charts: chartRendered, tiles: tileRendered, bars: barRows.length, errors: errors.slice(0,2).join(' | ') }); }
  dom.window.close();
}
console.log(`\nVISUAL: ${pass}/${slugs.length} tools render charts/tiles (${fail} failing)`);
process.exit(fail ? 1 : 0);

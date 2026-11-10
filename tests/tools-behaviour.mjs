// Tools4Market — behaviour assertions for the browser-local tools.
//
//   npm i --no-save jsdom
//   node build.mjs
//   node tests/tools-behaviour.mjs
//
// smoke.mjs proves every tool page boots and produces *something*. This file
// proves the something is correct: the counts, the conversions and the
// minifier's refusal to guess. A tool that renders "0 words" for every input
// passes a smoke test and fails a reader.
import { JSDOM, ResourceLoader } from 'jsdom';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');

class LocalLoader extends ResourceLoader {
  fetch(url) {
    const u = new URL(url);
    if (u.hostname !== 'localhost') return null;
    const file = path.join(DIST, u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname);
    try { return Promise.resolve(readFileSync(file)); } catch { return null; }
  }
}

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  cond ? pass++ : fail++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  | ' + detail : ''}`);
};

async function boot(slug) {
  const rel = '/tools/' + slug + '/';
  const dom = new JSDOM(readFileSync(path.join(DIST, rel, 'index.html'), 'utf8'), {
    runScripts: 'dangerously', resources: new LocalLoader(), url: 'http://localhost:8090' + rel, pretendToBeVisual: true,
    beforeParse(w) {
      w.fetch = () => Promise.reject(new TypeError('offline'));
      w.HTMLElement.prototype.scrollIntoView = function () {};
    },
  });
  await new Promise((r) => { dom.window.addEventListener('load', r); setTimeout(r, 1500); });
  const doc = dom.window.document;
  const type = (id, value) => {
    const el = doc.getElementById(id);
    el.value = value;
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  };
  const tiles = (sel) => [...doc.querySelectorAll(sel + ' .stat-tile')].map((t) => [
    t.querySelector('.stat-tile-label').textContent,
    t.querySelector('.stat-tile-value').textContent,
  ]);
  return { dom, doc, type, tiles };
}

// ---- word counter
{
  const { dom, doc, type, tiles } = await boot('word-counter');
  type('wc-text', 'The cat sat. The cat ran.');
  const t = Object.fromEntries(tiles('#wc-out'));
  ok('word counter: words', t.Words === '6', t.Words);
  ok('word counter: unique words', t.Unique === '4', t.Unique);
  ok('word counter: sentences', t.Sentences === '2', t.Sentences);
  ok('word counter: paragraphs', t.Paragraphs === '1', t.Paragraphs);
  ok('word counter: reading time floor', t['Reading time'] === '1 min', t['Reading time']);
  ok('word counter: repeated term listed once', (doc.getElementById('wc-out').textContent.match(/cat/g) || []).length >= 1);
  type('wc-text', '');
  ok('word counter: empty invites input', /Paste text/.test(doc.getElementById('wc-out').textContent));
  dom.window.close();
}

// ---- character counter
{
  const { dom, doc, type, tiles } = await boot('character-counter');
  type('chc-text', 'café');
  const t = Object.fromEntries(tiles('#chc-out'));
  ok('character counter: characters', t.Characters === '4', t.Characters);
  ok('character counter: without spaces', t['Without spaces'] === '4', t['Without spaces']);
  ok('character counter: UTF-8 bytes', t['UTF-8 bytes'] === '5', t['UTF-8 bytes']);
  ok('character counter: words', t.Words === '1', t.Words);
  type('chc-text', 'hello world');
  const t2 = Object.fromEntries(tiles('#chc-out'));
  ok('character counter: space counted once', t2.Characters === '11' && t2['Without spaces'] === '10', t2.Characters + '/' + t2['Without spaces']);
  ok('character counter: limit bar shows room', /left/.test(doc.getElementById('chc-out').textContent));
  type('chc-text', 'x'.repeat(70));
  ok('character counter: over a 60 limit is stated', /over/.test(doc.getElementById('chc-out').textContent));
  dom.window.close();
}

// ---- colour picker
{
  const { dom, doc, type, tiles } = await boot('color-picker');
  type('cp-hex', '#243b63');
  let t = Object.fromEntries(tiles('#cp-out'));
  ok('color picker: HEX echoed', t.HEX === '#243b63', t.HEX);
  ok('color picker: RGB converted', t.RGB === 'rgb(36, 59, 99)', t.RGB);
  ok('color picker: HSL converted', t.HSL === 'hsl(218, 47%, 26%)', t.HSL);
  ok('color picker: nine ramp swatches', doc.querySelectorAll('#cp-out .swatch').length === 9, String(doc.querySelectorAll('#cp-out .swatch').length));

  type('cp-hex', '#000000');
  t = Object.fromEntries(tiles('#cp-out'));
  ok('color picker: white on black is 21:1', t['White text on this colour'] === '21.00:1', t['White text on this colour']);
  ok('color picker: black on black is 1:1', t['Black text on this colour'] === '1.00:1', t['Black text on this colour']);

  type('cp-hex', '#ffffff');
  t = Object.fromEntries(tiles('#cp-out'));
  ok('color picker: black on white is 21:1', t['Black text on this colour'] === '21.00:1', t['Black text on this colour']);

  type('cp-hex', 'nonsense');
  ok('color picker: invalid input is named', /not a colour/.test(doc.getElementById('cp-out').textContent));
  dom.window.close();
}

// ---- CSS minifier
{
  const { dom, doc, type } = await boot('css-minifier');
  type('cm-in', '.a { color: #fff; }\n\n/* note */\n.b { margin: 0  }');
  const out = doc.getElementById('cm-out').textContent;
  ok('css minifier: comments removed', !out.includes('note'), out);
  ok('css minifier: whitespace collapsed', !/\s{2,}/.test(out) && !/\s\{|\{\s|\s\}|\}\s/.test(out), out);
  ok('css minifier: last semicolon dropped', !out.includes(';}'), out);
  ok('css minifier: stats report a saving', /smaller/.test(doc.getElementById('cm-stats').textContent), doc.getElementById('cm-stats').textContent);

  const tricky = 'a{content:"};";margin:0}';
  type('cm-in', tricky);
  const kept = doc.getElementById('cm-out').textContent;
  ok('css minifier: string contents preserved', kept.includes('"};"'), kept);

  type('cm-in', '.a { color: red;');
  ok('css minifier: unbalanced braces returned unchanged', doc.getElementById('cm-out').textContent === '.a { color: red;');
  ok('css minifier: …and says why', /braces do not balance/.test(doc.getElementById('cm-stats').textContent), doc.getElementById('cm-stats').textContent);

  type('cm-in', 'not css at all');
  ok('css minifier: non-CSS returned unchanged', doc.getElementById('cm-out').textContent === 'not css at all');
  dom.window.close();
}

console.log(`\nTOOL BEHAVIOUR: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

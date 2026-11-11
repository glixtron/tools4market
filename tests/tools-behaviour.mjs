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
import { createHash, webcrypto } from 'node:crypto';
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

async function boot(slug, setup) {
  const rel = '/tools/' + slug + '/';
  const dom = new JSDOM(readFileSync(path.join(DIST, rel, 'index.html'), 'utf8'), {
    runScripts: 'dangerously', resources: new LocalLoader(), url: 'http://localhost:8090' + rel, pretendToBeVisual: true,
    beforeParse(w) {
      w.fetch = () => Promise.reject(new TypeError('offline'));
      w.HTMLElement.prototype.scrollIntoView = function () {};
      if (setup) setup(w);
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
  const set = (id, value) => {
    const el = doc.getElementById(id);
    el.value = value;
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  };
  return { dom, doc, type, set, tiles };
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

// ---- cron expression generator
{
  const { dom, doc, type, set } = await boot('cron-expression-generator');
  const C = dom.window.T4M_CRON;
  const at = (y, m, d, hh, mm) => new Date(y, m - 1, d, hh, mm);
  const t = (d) => `${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;

  let runs = C.nextRuns('*/15 * * * *', at(2026, 1, 5, 10, 7), 4).runs;
  ok('cron: step minutes land on the quarter hours',
    runs.map((d) => d.getMinutes()).join(',') === '15,30,45,0', runs.map(t).join(' | '));

  runs = C.nextRuns('0 9 * * 1-5', at(2026, 1, 9, 18, 0), 1).runs;
  ok('cron: weekdays skip the weekend', runs.length === 1 && runs[0].getDate() === 12 && runs[0].getDay() === 1, runs.map(t).join(''));

  const never = C.nextRuns('0 0 31 2 *', at(2026, 1, 5, 0, 0), 3);
  ok('cron: 31 February is reported as never', never.exhausted === true && never.runs.length === 0);

  runs = C.nextRuns('0 9 1 * 1', at(2026, 1, 5, 10, 0), 1).runs;
  ok('cron: day-of-month and day-of-week are OR-ed',
    runs.length === 1 && runs[0].getDate() === 12, runs.map(t).join(''));

  runs = C.nextRuns('0 0 * * 7', at(2026, 1, 5, 0, 0), 1).runs;
  ok('cron: 7 means Sunday', runs.length === 1 && runs[0].getDay() === 0, runs.map(t).join(''));

  ok('cron: out-of-range minute is an error', C.nextRuns('61 * * * *', at(2026, 1, 5, 0, 0), 1).error.field === 'minute');
  ok('cron: four fields is an error', C.nextRuns('0 9 * *', at(2026, 1, 5, 0, 0), 1).error.n === 4);

  type('cr-expr', '0 9 * * *');
  ok('cron: description reads as English', /Every day at 09:00/.test(doc.getElementById('cr-report').textContent), doc.getElementById('cr-report').textContent.slice(0, 60));
  ok('cron: expression echoed for copying', doc.getElementById('cr-out').textContent === '0 9 * * *');
  type('cr-expr', '61 * * * *');
  ok('cron: invalid expression is named', /does not parse/.test(doc.getElementById('cr-report').textContent));

  set('cr-min', '30');
  ok('cron: editing a field rewrites the expression', doc.getElementById('cr-out').textContent === '30 9 * * *', doc.getElementById('cr-out').textContent);
  dom.window.close();
}

// ---- JSON to CSV
{
  const { dom, doc, type, set } = await boot('json-to-csv');
  type('jc-in', '[{"a":1,"b":"x,y"}]');
  ok('json-to-csv: header and quoted comma', doc.getElementById('jc-out').textContent === 'a,b\n1,"x,y"', JSON.stringify(doc.getElementById('jc-out').textContent));

  type('jc-in', '[{"user":{"name":"Ada","city":"London"}}]');
  ok('json-to-csv: nested keys flatten to dot notation', doc.getElementById('jc-out').textContent === 'user.name,user.city\nAda,London', JSON.stringify(doc.getElementById('jc-out').textContent));

  type('jc-in', '[{"name":"Ada"},{"name":"Grace","role":"Admiral"}]');
  ok('json-to-csv: columns are the union of keys, missing cells empty',
    doc.getElementById('jc-out').textContent === 'name,role\nAda,\nGrace,Admiral', JSON.stringify(doc.getElementById('jc-out').textContent));

  type('jc-in', '[{"v":"=1+1"},{"v":-5},{"v":"hi"}]');
  const guarded = doc.getElementById('jc-out').textContent;
  ok('json-to-csv: formula cells are guarded', guarded.includes("'=1+1"), guarded);
  ok('json-to-csv: negative numbers are not guarded', guarded.includes('\n-5'), guarded);

  type('jc-in', '[{"v":"say \\"hi\\""}]');
  ok('json-to-csv: quotes are doubled', doc.getElementById('jc-out').textContent === 'v\n"say ""hi"""', JSON.stringify(doc.getElementById('jc-out').textContent));

  type('jc-in', '[{"a":1,"b":2}]');
  set('jc-delim', 'semicolon');
  ok('json-to-csv: delimiter switch is honoured', doc.getElementById('jc-out').textContent === 'a;b\n1;2', JSON.stringify(doc.getElementById('jc-out').textContent));
  set('jc-delim', 'comma');

  type('jc-in', 'not json');
  ok('json-to-csv: bad JSON is named, not guessed at', /not valid JSON/.test(doc.getElementById('jc-stats').textContent), doc.getElementById('jc-stats').textContent);

  type('jc-in', '"a string"');
  ok('json-to-csv: a scalar top level is refused', /array/.test(doc.getElementById('jc-stats').textContent), doc.getElementById('jc-stats').textContent);

  type('jc-in', '[{"a":1}]');
  ok('json-to-csv: stats report the shape', /1 rows × 1 columns/.test(doc.getElementById('jc-stats').textContent), doc.getElementById('jc-stats').textContent);
  dom.window.close();
}

// ---- text diff
{
  const { dom, doc, type } = await boot('text-diff');
  const D = dom.window.T4M_DIFF;

  let script = D.diff('a\nb\nc', 'a\nx\nc').lines;
  ok('text diff: marks removed and added lines',
    script.map((l) => l.t).join(',') === 'same,del,add,same', script.map((l) => l.t).join(','));
  ok('text diff: unchanged lines keep their text', script[0].s === 'a' && script[3].s === 'c');

  ok('text diff: identical texts produce no edits', D.diff('a\nb', 'a\nb').lines.every((l) => l.t === 'same'));
  ok('text diff: ignoreCase folds case', D.diff('Hello', 'hello', { ignoreCase: true }).lines.every((l) => l.t === 'same'));
  ok('text diff: ignoring whitespace collapses runs', D.diff('a  b', 'a b', { ignoreSpace: true }).lines.every((l) => l.t === 'same'));
  ok('text diff: cap is reported rather than frozen',
    D.diff(Array.from({ length: 1300 }, (_, i) => 'x' + i).join('\n'), 'y').tooBig === true);

  type('df-a', 'one\ntwo\nthree');
  type('df-b', 'one\nTWO\nthree');
  ok('text diff: UI renders one removal and one addition',
    doc.querySelectorAll('#df-out .diff-row.del').length === 1 &&
    doc.querySelectorAll('#df-out .diff-row.add').length === 1,
    doc.querySelectorAll('#df-out .diff-row.del').length + '/' + doc.querySelectorAll('#df-out .diff-row.add').length);
  ok('text diff: unified diff is copyable', /^--- original\n\+\+\+ changed\n@@/.test(doc.getElementById('df-unified').textContent), doc.getElementById('df-unified').textContent.slice(0, 40));

  type('df-b', 'one\ntwo\nthree');
  ok('text diff: equal texts say so', /No differences/.test(doc.getElementById('df-out').textContent));
  dom.window.close();
}

// ---- hash generator
{
  const { dom, doc, type } = await boot('hash-generator', (w) => {
    Object.defineProperty(w, 'crypto', { value: webcrypto, configurable: true });
  });
  const H = dom.window.T4M_HASH;
  const hexOf = (fn, s) => fn(createHash(fn === 'md5' ? 'md5' : fn).update(Buffer.from(s, 'utf8')).digest('hex'));

  ok('hash: MD5 of empty string is the RFC value', H.hex(H.md5(H.utf8(''))) === 'd41d8cd98f00b204e9800998ecf8427e');
  ok('hash: MD5 of abc is the RFC value', H.hex(H.md5(H.utf8('abc'))) === '900150983cd24fb0d6963f7d28e17f72');
  const long = 'a'.repeat(1000) + 'é🙂';
  ok('hash: MD5 matches node for a long UTF-8 string',
    H.hex(H.md5(H.utf8(long))) === createHash('md5').update(Buffer.from(long, 'utf8')).digest('hex'));
  ok('hash: fallback UTF-8 encoder matches Buffer',
    H.hex(H.utf8('café🙂')) === Buffer.from('café🙂', 'utf8').toString('hex'),
    H.hex(H.utf8('café🙂')));

  type('hg-in', 'abc');
  await new Promise((r) => setTimeout(r, 40));
  const text = doc.getElementById('hg-out').textContent;
  ok('hash: SHA-1(SHA-256/SHA-512) of abc are the published values',
    text.includes('a9993e364706816aba3e25717850c26c9cd0d89d') &&
    text.includes('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad') &&
    text.includes('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'));
  ok('hash: four digests are shown', doc.querySelectorAll('#hg-out .hash-row').length === 4);
  type('hg-in', '');
  ok('hash: empty input invites text', /paste text/i.test(doc.getElementById('hg-out').textContent));
  dom.window.close();
}

console.log(`\nTOOL BEHAVIOUR: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

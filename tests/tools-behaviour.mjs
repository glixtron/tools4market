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
import { crc32 as zlibCrc32 } from 'node:zlib';
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

// ---- favicon generator (encoders only — rendering needs a real canvas)
{
  const { dom, doc, type } = await boot('favicon-generator');
  const F = dom.window.T4M_FAVICON;

  ok('favicon: CRC32 matches the published check value', F.crc32(F.utf8('123456789')) === 0xcbf43926,
    F.crc32(F.utf8('123456789')).toString(16));

  const zip = F.buildZip([
    { name: 'a.txt', data: 'hello' },
    { name: 'b.bin', data: new Uint8Array([0, 1, 255]) },
  ]);
  const dv = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const eocd = zip.length - 22;
  ok('favicon: ZIP end record is a PKZIP end record', dv.getUint32(eocd, true) === 0x06054b50);
  ok('favicon: ZIP reports two entries', dv.getUint16(eocd + 10, true) === 2);
  let at = dv.getUint32(eocd + 16, true);
  const entries = [];
  for (let i = 0; i < 2; i++) {
    const nameLen = dv.getUint16(at + 28, true);
    const extra = dv.getUint16(at + 30, true);
    const localOff = dv.getUint32(at + 42, true);
    const crc = dv.getUint32(at + 16, true);
    const size = dv.getUint32(at + 20, true);
    const name = Buffer.from(zip.slice(at + 46, at + 46 + nameLen)).toString('utf8');
    const lname = dv.getUint16(localOff + 26, true);
    const lextra = dv.getUint16(localOff + 28, true);
    const start = localOff + 30 + lname + lextra;
    entries.push({ name, crc, size, data: zip.slice(start, start + size) });
    at += 46 + nameLen + extra + dv.getUint16(at + 32, true);
  }
  ok('favicon: ZIP entry names survive the round trip',
    entries.map((e) => e.name).join(',') === 'a.txt,b.bin', entries.map((e) => e.name).join(','));
  ok('favicon: stored bytes come back unchanged',
    Buffer.from(entries[0].data).toString('utf8') === 'hello' && entries[1].data[2] === 255);
  ok('favicon: each entry CRC matches node:zlib',
    entries.every((e) => e.crc === zlibCrc32(Buffer.from(e.data))));

  const ico = F.buildIco([16, 32, 48].map((size) => ({ size, data: new Uint8Array([size]) })));
  const iv = new DataView(ico.buffer, ico.byteOffset, ico.byteLength);
  ok('favicon: ICO header says three images', iv.getUint16(2, true) === 1 && iv.getUint16(4, true) === 3);
  ok('favicon: ICO entries carry the sizes and 32bpp',
    ico[6] === 16 && ico[22] === 32 && ico[38] === 48 && iv.getUint16(6 + 6, true) === 32);
  ok('favicon: ICO offsets point at the payloads',
    ico[iv.getUint32(6 + 12, true)] === 16 && ico[iv.getUint32(22 + 12, true)] === 32);
  const big = F.buildIco([{ size: 256, data: new Uint8Array([7]) }]);
  ok('favicon: 256 is encoded as 0 in an ICO entry', big[6] === 0 && big[7] === 0);

  const man = JSON.parse(F.manifest('Example', '#ff0000'));
  ok('favicon: manifest is valid JSON with two icons',
    man.icons.length === 2 && man.theme_color === '#ff0000' && man.name === 'Example');

  ok('favicon: snippet omits the SVG link when there is no SVG',
    !F.headSnippet(false).includes('favicon.svg') && F.headSnippet(true).includes('favicon.svg'));
  ok('favicon: monogram clamps to two code points',
    F.clampText('ABC') === 'AB' && F.clampText('🙂x') === '🙂x',
    F.clampText('ABC') + '/' + F.clampText('🙂x'));
  ok('favicon: UTF-8 byte length counts é as two', F.byteLength('é') === 2);

  // In jsdom there is no drawing surface; the page must say so rather than throw.
  type('fv-text', 'AB');
  ok('favicon: without a canvas the page explains the limit', /drawing surface|cannot render/i.test(doc.getElementById('fv-stats').textContent),
    doc.getElementById('fv-stats').textContent.slice(0, 60));
  dom.window.close();
}

// ---- SVG optimizer
{
  const { dom, doc, type } = await boot('svg-optimizer');
  const S = dom.window.T4M_SVG;
  const base = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">';
  const all = { comments: true, meta: true, ids: true, space: true, hex: true, defaults: true, rgb: false, title: false };

  let r = S.optimize(base + '<!-- note --><path d="M0 0h10v10z"/></svg>', all);
  ok('svg: comments are removed when the option is on', r.svg && !r.svg.includes('<!--'), r.svg);
  r = S.optimize(base + '<!-- note --><path d="M0 0h10v10z"/></svg>', Object.assign({}, all, { comments: false }));
  ok('svg: unticking comments keeps them', r.svg.includes('<!-- note -->'), r.svg);

  r = S.optimize('<svg xmlns="http://www.w3.org/2000/svg"><?xml-stylesheet href="a.css"?><path d="M0 0"/></svg>', all);
  ok('svg: a processing instruction is preserved', r.svg.includes('<?xml-stylesheet'), r.svg);

  r = S.optimize('<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"><sodipodi:namedview xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.0.dtd" pagecolor="red"/><g inkscape:label="Layer"><path d="M0 0"/></g></svg>', all);
  ok('svg: editor elements and namespaces are removed',
    !/namedview|inkscape|sodipodi|pagecolor/.test(r.svg), r.svg);

  r = S.optimize(base + '<title>Logo</title><path d="M0 0"/></svg>', all);
  ok('svg: title survives by default', r.svg.includes('<title>Logo</title>'));
  r = S.optimize(base + '<title>Logo</title><path d="M0 0"/></svg>', Object.assign({}, all, { title: true }));
  ok('svg: title is removed only when asked', !r.svg.includes('<title>'));

  r = S.optimize(base + '<defs><path id="used" d="M0 0"/><path id="unused" d="M1 1"/></defs><use href="#used"/></svg>', all);
  ok('svg: referenced IDs are kept and unused ones dropped',
    r.svg.includes('id="used"') && !r.svg.includes('id="unused"'), r.svg);

  r = S.optimize(base + '<style>path#styled{fill:red}</style><path id="styled" d="M0 0"/></svg>', all);
  ok('svg: an ID named only inside a style block is kept', r.svg.includes('id="styled"'), r.svg);

  r = S.optimize(base + '<rect id="box" width="4" height="4"/><animate begin="box.click" attributeName="opacity" dur="1s"/></svg>', all);
  ok('svg: an ID used by a SMIL animation is kept', r.svg.includes('id="box"'));

  r = S.optimize(base + '<path fill="#ffffff" stroke="#123456" d="M0 0"/></svg>', all);
  ok('svg: six-digit hex colours are shortened', r.svg.includes('#fff') && r.svg.includes('#123456'), r.svg);

  r = S.optimize(base + '<path fill="black" stroke-width="1" stroke="none" d="M0 0"/></svg>', all);
  ok('svg: redundant default attributes are removed',
    !r.svg.includes('stroke="none"') && !r.svg.includes('fill="black"'), r.svg);

  r = S.optimize(base + '<g fill="red"><path fill="black" d="M0 0"/></g></svg>', all);
  ok('svg: a default value that overrides an ancestor is kept', r.svg.includes('fill="black"'), r.svg);

  r = S.optimize('<svg xmlns="http://www.w3.org/2000/svg">\n  <g>\n    <text> </text>\n  </g>\n</svg>', all);
  ok('svg: whitespace between elements goes, text content stays',
    !r.svg.includes('>\n') && r.svg.includes('<text> </text>'), JSON.stringify(r.svg));

  r = S.optimize(base + '<path d="M10.5 20.25 L1 2 Z"/></svg>', all);
  ok('svg: path data is never rewritten', r.svg.includes('d="M10.5 20.25 L1 2 Z"'));

  r = S.optimize(base + '<script>alert(1)</script></svg>', all);
  ok('svg: a script is preserved and flagged', r.svg.includes('<script>') && r.warnings.indexOf('script') !== -1);

  ok('svg: malformed XML reports the parser error', S.optimize('<svg><g></svg>', all).error === 'parse');
  ok('svg: a non-SVG root is refused', S.optimize('<html xmlns="http://www.w3.org/1999/xhtml"><body/></html>', all).error === 'not-svg');

  const padded = '<svg xmlns="http://www.w3.org/2000/svg">\n\n  <!-- a -->\n  <path d="M0 0" fill="#ffffff"/>\n</svg>\n';
  r = S.optimize(padded, all);
  ok('svg: byte counts reflect the real output', r.after === S.byteLength(r.svg) && r.after < r.before,
    r.before + ' -> ' + r.after);

  ok('svg: the page no longer offers a control the engine ignores', doc.getElementById('sv-xml') === null);
  type('sv-in', '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');
  ok('svg: the page renders the optimised markup', doc.getElementById('sv-out').textContent.includes('<svg'));
  type('sv-in', '<svg><g></svg>');
  ok('svg: the page names the parse failure', /Malformed SVG/.test(doc.getElementById('sv-stats').textContent));
  dom.window.close();
}

// ---- markdown to HTML
{
  const { dom, doc, type } = await boot('markdown-to-html');
  const M = dom.window.T4M_MD;
  const out = (src, copy) => M.render(src, copy || {}).html;

  ok('md: heading', out('# Hello') === '<h1>Hello</h1>', out('# Hello'));
  ok('md: paragraph with bold and italic', out('**bold** and *italic*') === '<p><strong>bold</strong> and <em>italic</em></p>', out('**bold** and *italic*'));
  ok('md: inline code', out('`code`') === '<p><code>code</code></p>');
  ok('md: raw HTML is escaped, not rendered',
    out('<script>alert(1)</script>') === '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>', out('<script>alert(1)</script>'));
  ok('md: a javascript URL is blocked visibly',
    out('[click](javascript:alert(1))', { blocked: '[link blocked: {proto} URL]' }).includes('[link blocked: javascript URL]'),
    out('[click](javascript:alert(1))', { blocked: '[link blocked: {proto} URL]' }));
  ok('md: an https link is emitted',
    out('[click](https://example.com)') === '<p><a href="https://example.com">click</a></p>', out('[click](https://example.com)'));
  ok('md: a destination with balanced parentheses keeps the whole URL',
    out('[x](https://en.wikipedia.org/wiki/Foo_(bar))') ===
      '<p><a href="https://en.wikipedia.org/wiki/Foo_(bar)">x</a></p>',
    out('[x](https://en.wikipedia.org/wiki/Foo_(bar))'));
  ok('md: an image is emitted',
    out('![alt](https://example.com/x.png)') === '<p><img src="https://example.com/x.png" alt="alt"></p>', out('![alt](https://example.com/x.png)'));
  ok('md: fenced code is escaped inside a labelled block',
    out('```js\nconst x = 1 < 2;\n```') === '<pre><code class="language-js">const x = 1 &lt; 2;</code></pre>', out('```js\nconst x = 1 < 2;\n```'));
  ok('md: unordered list', out('- one\n- two\n- three') === '<ul><li>one</li><li>two</li><li>three</li></ul>', out('- one\n- two\n- three'));
  ok('md: two-level nesting',
    out('- outer\n  - inner') === '<ul><li>outer<ul><li>inner</li></ul></li></ul>', out('- outer\n  - inner'));
  const deep = M.render('- a\n    - b\n        - c\n');
  ok('md: deeper nesting is flattened and counted', deep.deep >= 1, 'deep=' + deep.deep);
  ok('md: an unclosed fence is reported and swallowed as code',
    M.render('```\nx\n').warnings.indexOf('unclosed') !== -1 && M.render('```\nx\n').html.includes('<pre><code>x</code></pre>'));
  ok('md: empty input produces empty output', out('') === '');
  ok('md: snake_case is not italics', !out('snake_case_name').includes('<em>'), out('snake_case_name'));
  ok('md: strong inside emphasis',
    out('*a **b** c*') === '<p><em>a <strong>b</strong> c</em></p>', out('*a **b** c*'));
  ok('md: blockquote block', out('> hi') === '<blockquote>\n<p>hi</p>\n</blockquote>', out('> hi'));
  ok('md: horizontal rule', out('---') === '<hr>');
  ok('md: a hard break from two spaces', out('a  \nb').includes('<br>'));

  const cap = M.render('a'.repeat(60000));
  ok('md: input is capped at 50,000 characters', cap.truncated === true && cap.stats.chars === 50000, cap.stats.chars + '');

  type('md-in', '# Title');
  ok('md: the page wraps output in article by default',
    /^<article>\n<h1>Title<\/h1>\n<\/article>/.test(doc.getElementById('md-out').textContent),
    doc.getElementById('md-out').textContent.slice(0, 40));
  ok('md: the preview frame gets the rendered HTML',
    /<h1>Title<\/h1>/.test(doc.getElementById('md-preview').getAttribute('srcdoc') || ''));
  dom.window.close();
}

// ---- email validator
{
  const { dom, doc, type } = await boot('email-validator');
  const E = dom.window.T4M_EMAIL;
  const cases = [
    ['user@example.com', true, ''],
    ['user@sub.example.com', true, ''],
    ['user.name@example.com', true, ''],
    ['user+tag@example.com', true, ''],
    ['user@example', false, 'noDot'],
    ['user.@example.com', false, 'localDot'],
    ['.user@example.com', false, 'localDot'],
    ['user..name@example.com', false, 'localDots'],
    ['user@.com', false, 'domainDot'],
    ['user@example..com', false, 'domainDots'],
    ['user@example.com.', false, 'domainDot'],
    ['user@-example.com', false, 'labelHyphen'],
    ['user@example.c', false, 'tldShort'],
    ['user@example.123', false, 'tldChars'],
    ['"user"@example.com', false, 'quoted'],
    ['javascript:alert(1)@example.com', false, 'localChars'],
    ['user@example.com ', true, ''],
    ['user@@example.com', false, 'multiAt'],
    ['userexample.com', false, 'noAt'],
    ['user@', false, 'noDomain'],
  ];
  let wrong = [];
  cases.forEach(([addr, valid, code]) => {
    const r = E.check(addr);
    if (r.valid !== valid) wrong.push(addr + ' expected ' + (valid ? 'valid' : code) + ' got ' + (r.valid ? 'valid' : r.code));
    else if (!valid && code && r.code !== code) wrong.push(addr + ' expected ' + code + ' got ' + r.code);
  });
  ok('email: all 20 format cases land on the right rule', wrong.length === 0, wrong.join(' | '));

  const idn = E.check('user@münchen.de');
  ok('email: an internationalized domain is converted, not rejected',
    idn.valid && idn.domain === 'xn--mnchen-3ya.de' && idn.punycode === 'xn--mnchen-3ya.de', JSON.stringify(idn));

  const long = E.check('a'.repeat(65) + '@example.com');
  ok('email: a local part over 64 characters fails', long.code === 'localLong');

  const batch = E.parseBatch('a@b.com\n\nc@d.com');
  ok('email: batch parsing drops blank pieces', batch.entries.length === 2 && batch.entries[1] === 'c@d.com');
  const big = E.parseBatch(Array.from({ length: 1002 }, (_, i) => 'u' + i + '@example.com').join('\n'));
  ok('email: batch is capped at 1,000 with the overflow reported', big.entries.length === 1000 && big.over === 2);

  ok('email: the MX action is a button, not a checkbox that does nothing',
    doc.getElementById('em-mx') === null && doc.getElementById('em-mx-go') !== null);
  type('em-in', 'ada@example.com');
  ok('email: single mode shows a valid verdict', /Valid format/.test(doc.getElementById('em-out').textContent));
  ok('email: single mode breaks out the parts', /example/.test(doc.getElementById('em-out').textContent) && /com/.test(doc.getElementById('em-out').textContent));
  type('em-in', 'user..name@example.com');
  ok('email: the failure reason is named on the page',
    /two dots in a row/.test(doc.getElementById('em-out').textContent), doc.getElementById('em-out').textContent);
  dom.window.close();
}

// ---------- rich results tester
async function testRichResults() {
  const { dom, doc, type } = await boot('rich-results-tester');
  const out = () => doc.getElementById('rr-out').textContent;
  const run = () => doc.getElementById('rr-run').click();
  ok('rich results: sample Article passes required props with one recommendation',
    /Article/.test(out()) && /Recommended property "dateModified"/.test(out()), out().slice(0, 120));
  type('rr-in', '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Q"}]}</script>');
  run();
  ok('rich results: an FAQ question without an answer is an error', /acceptedAnswer/.test(out()));
  type('rr-in', '{"@context":"https://schema.org","@type":"Product","name":"Kettle"}');
  run();
  ok('rich results: Product without offers, review or rating is an error', /needs at least one of/.test(out()));
  type('rr-in', '{"@type":"Article","datePublished":"14 November 2026"}');
  run();
  ok('rich results: a non-ISO date is flagged', /ISO 8601 date/.test(out()));
  type('rr-in', 'not json');
  run();
  ok('rich results: broken JSON is named, not rendered', /does not parse as JSON/.test(out()));
  dom.window.close();
}
await testRichResults();

console.log(`\nTOOL BEHAVIOUR: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

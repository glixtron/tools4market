// Tools4Market — runtime: the two crawler/ranking tools.
// Classic script (no modules). Both reuse window.T4M_INSPECT for fetch + parse,
// and read their user-facing strings from window.T4M_AUDIT / window.T4M_SCORE
// (injected at build time from src/data/inspect.js — no hardcoded copy here).
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};
  var INSP = window.T4M_INSPECT || {};
  function $(root, id) { return root.querySelector('#' + id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fill(tpl, o) {
    return String(tpl == null ? '' : tpl)
      .replace(/\{n\}/g, o.n != null ? o.n : '')
      .replace(/\{v\}/g, o.v != null ? o.v : '')
      .replace(/\{m\}/g, o.m != null ? o.m : '')
      .replace(/\{s\}/g, o.s != null ? o.s : '')
      .replace(/\{status\}/g, o.status != null ? o.status : '')
      .replace(/\{ms\}/g, o.ms != null ? o.ms : '')
      .replace(/\{bytes\}/g, o.bytes != null ? o.bytes : '')
      .replace(/\{detail\}/g, o.detail != null ? o.detail : '');
  }
  function origin(u) { try { return new URL(u).origin; } catch (e) { return ''; } }

  // ---------------------------------------------------------- Web Crawler Audit
  T['web-crawler-audit'] = function (root) {
    var A = window.T4M_AUDIT || {};
    var checks = A.checks || [];
    var verdicts = A.verdicts || {};
    var runBtn = $(root, 'ca-run');
    var status = $(root, 'ca-status');
    var scoreWrap = $(root, 'ca-score');
    var ringNum = $(root, 'ca-ring-num');
    var gradeEl = $(root, 'ca-grade');
    var noteEl = $(root, 'ca-note');
    var out = $(root, 'ca-out');
    var fixes = $(root, 'ca-fixes');

    out.textContent = A.empty || 'Analyze a page to see how crawlers see it.';
    fixes.textContent = '';

    // Evaluate a single check against the snapshot (+ optional robots.txt text).
    function evalCheck(c, snap, robotsTxt) {
      var tl = snap.title.length, dl = snap.desc.length;
      switch (c.id) {
        case 'fetch':
          return { level: 'pass', v: fill(c.pass, { status: snap.status || 'fetched', ms: snap.ms || '<100', bytes: fmtBytes(snap.bytes) }) };
        case 'https':
          return /^https:/i.test(snap.url || '') ? { level: 'pass', v: c.pass } : { level: 'fail', v: c.fail };
        case 'robots':
          return /noindex/i.test(snap.robots) ? { level: 'fail', v: fill(c.fail, { v: snap.robots }) } : { level: 'pass', v: c.pass };
        case 'canonical':
          if (!snap.canonical) return { level: 'fail', v: c.fail };
          if (origin(snap.url) && origin(snap.canonical) && origin(snap.canonical) !== origin(snap.url)) return { level: 'warn', v: fill(c.warn, { v: snap.canonical }) };
          return { level: 'pass', v: fill(c.pass, { v: snap.canonical }) };
        case 'title':
          if (!tl) return { level: 'fail', v: c.fail };
          return { level: tl >= 30 && tl <= 60 ? 'pass' : 'warn', v: fill(tl >= 30 && tl <= 60 ? c.pass : c.warn, { n: tl, v: snap.title }) };
        case 'desc':
          if (!dl) return { level: 'fail', v: c.fail };
          return { level: dl >= 120 && dl <= 158 ? 'pass' : 'warn', v: fill(dl >= 120 && dl <= 158 ? c.pass : c.warn, { n: dl }) };
        case 'h1':
          if (snap.h1s.length === 0) return { level: 'fail', v: c.fail };
          if (snap.h1s.length === 1) return { level: 'pass', v: fill(c.pass, { v: snap.h1s[0] }) };
          return { level: 'warn', v: fill(c.warn, { n: snap.h1s.length }) };
        case 'sitemap': {
          var m = robotsTxt ? /Sitemap:\s*(\S+)/i.exec(robotsTxt) : null;
          return m ? { level: 'pass', v: fill(c.pass, { v: m[1] }) } : { level: 'fail', v: c.fail };
        }
        case 'hreflang':
          return snap.hreflangs.length ? { level: 'pass', v: fill(c.pass, { n: snap.hreflangs.length }) } : { level: 'none', v: c.none };
        case 'schema':
          return snap.schemaTypes.length ? { level: 'pass', v: fill(c.pass, { v: snap.schemaTypes.join(', ') }) } : { level: 'fail', v: c.fail };
        case 'og':
          return (snap.og.title || snap.og.desc) ? { level: 'pass', v: c.pass } : { level: 'fail', v: c.fail };
        case 'imgalt':
          if (snap.images.total === 0) return { level: 'none', v: 'No images on this page.' };
          return snap.images.missingAlt === 0 ? { level: 'pass', v: fill(c.pass, { n: snap.images.total }) }
            : { level: 'warn', v: fill(c.warn, { n: snap.images.total, m: snap.images.missingAlt }) };
        default:
          return { level: 'none', v: '' };
      }
    }

    function audit() {
      var u = (($(root, 'ca-url') || {}).value || '').trim();
      if (!/^https?:\/\//i.test(u)) { status.textContent = 'Enter a full URL, e.g. https://your-site.com/page'; return; }
      status.textContent = 'Fetching page\u2026';
      runBtn.disabled = true;
      // also fetch robots.txt (the crawler's entry point) to check the sitemap line
      INSP.fetchPage(u).then(function (r) {
        if (!r.ok) {
          runBtn.disabled = false;
          status.textContent = 'Could not fetch that page. If it is private or blocked, use the paste-HTML option below.';
          return;
        }
        var snap;
        try { snap = INSP.parse(r.html, r.url || u); } catch (e) { status.textContent = 'Could not parse that page.'; runBtn.disabled = false; return; }
        snap.status = r.status; snap.ms = r.ms; snap.bytes = r.bytes;
        status.textContent = 'Fetched HTTP ' + r.status + ' \u00b7 ' + fmtBytes(r.bytes) + ' \u00b7 ' + (r.ms || '<100') + 'ms';
        // robots.txt (best-effort; failure just means no sitemap line detected)
        return INSP.fetchPage(origin(u) + '/robots.txt').then(function (rb) {
          render(snap, rb && rb.ok ? rb.html : '');
          runBtn.disabled = false;
        });
      });
    }

    // paste-HTML path — best-effort robots.txt lookup, never blocks on it
    function auditPasted() {
      var html = (($(root, 'ca-paste') || {}).value || '');
      if (!html.trim()) { status.textContent = 'Paste the page HTML first.'; return; }
      var u = (($(root, 'ca-url') || {}).value || '').trim();
      var snap;
      try { snap = INSP.parse(html, /^https?:\/\//i.test(u) ? u : ''); } catch (e) { status.textContent = 'Could not parse that HTML.'; return; }
      status.textContent = 'Audited pasted HTML \u00b7 ' + fmtBytes(html.length);
      var rb = /^https?:\/\//i.test(u) ? INSP.fetchPage(origin(u) + '/robots.txt') : Promise.resolve(null);
      rb.then(function (res) { render(snap, res && res.ok ? res.html : ''); });
    }

    function render(snap, robotsTxt) {
      // per-check report
      out.textContent = '';
      var list = el('ul', 'inspect-signals');
      var fixesArr = [];
      var earned = 0, total = 0;
      checks.forEach(function (c) {
        var r = evalCheck(c, snap, robotsTxt);
        var lvl = r.level;
        var li = el('li', 'sig-' + lvl);
        li.appendChild(el('span', 'sig-dot', ''));
        var body = el('span', 'sig-body');
        body.appendChild(el('strong', null, (verdicts[lvl] || lvl.toUpperCase()) + ' \u00b7 ' + c.label + ': '));
        body.appendChild(document.createTextNode(r.v || ''));
        li.appendChild(body);
        list.appendChild(li);
        if (c.weight) {
          total += c.weight;
          earned += lvl === 'pass' ? c.weight : lvl === 'warn' ? Math.round(c.weight * 0.5) : 0;
          if (lvl === 'fail' || lvl === 'warn') fixesArr.push({ w: c.weight, label: c.label, text: r.v, level: lvl });
        }
      });
      out.appendChild(list);

      // score ring (weighted crawl-health)
      var pct = total ? Math.round(earned / total * 100) : 0;
      scoreWrap.hidden = false;
      ringNum.textContent = pct;
      var ring = $(root, 'ca-ring');
      ring.style.setProperty('--p', pct);
      var s = A.summary || {};
      var note = pct >= 85 ? (s.great || '') : pct >= 60 ? (s.good || '') : (s.poor || '');
      gradeEl.textContent = fill(s.scoreLine || 'Crawl-health: {s}/100', { s: pct });
      noteEl.textContent = note;

      // prioritized fixes (highest weight first)
      fixesArr.sort(function (a, b) { return b.w - a.w; });
      fixes.textContent = '';
      if (!fixesArr.length) {
        fixes.textContent = 'Nothing to fix — every scored check passed.';
      } else {
        var fl = el('ul', 'fix-list');
        fixesArr.forEach(function (f) {
          var li = el('li', 'sig-' + f.level);
          var b = el('span', 'sig-body');
          b.appendChild(el('strong', null, f.label + ' (weight ' + f.w + '): '));
          b.appendChild(document.createTextNode(f.text));
          li.appendChild(b);
          fl.appendChild(li);
        });
        fixes.appendChild(fl);
      }
    }

    runBtn.addEventListener('click', audit);
    $(root, 'ca-url').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); audit(); } });
    var caPasteBtn = $(root, 'ca-paste-run');
    if (caPasteBtn) caPasteBtn.addEventListener('click', auditPasted);
  };

  // ---------------------------------------------------------- SEO Ranking Score
  T['seo-score-checker'] = function (root) {
    var S = window.T4M_SCORE || {};
    var factors = S.factors || [];
    var grades = S.grades || [];
    var runBtn = $(root, 'sc2-run');
    var status = $(root, 'sc2-status');
    var scoreWrap = $(root, 'sc2-score');
    var ringNum = $(root, 'sc2-ring-num');
    var gradeEl = $(root, 'sc2-grade');
    var noteEl = $(root, 'sc2-note');
    var out = $(root, 'sc2-out');
    var fixes = $(root, 'sc2-fixes');

    out.textContent = (S.summary && S.summary.empty) || 'Analyze a page to score it.';
    fixes.textContent = '';

    function evalFactor(f, snap) {
      var tl = snap.title.length, dl = snap.desc.length;
      switch (f.id) {
        case 'title':
          if (!tl) return { level: 'fail', v: fill(f.fail, { n: 0 }) };
          return { level: tl >= 30 && tl <= 60 ? 'pass' : 'warn', v: fill(tl >= 30 && tl <= 60 ? f.pass : f.warn, { n: tl }) };
        case 'desc':
          if (!dl) return { level: 'fail', v: f.fail };
          return { level: dl >= 120 && dl <= 158 ? 'pass' : 'warn', v: fill(dl >= 120 && dl <= 158 ? f.pass : f.warn, { n: dl }) };
        case 'h1':
          if (snap.h1s.length === 0) return { level: 'fail', v: f.fail };
          return { level: snap.h1s.length === 1 ? 'pass' : 'warn', v: fill(snap.h1s.length === 1 ? f.pass : f.warn, { n: snap.h1s.length }) };
        case 'headings': {
          var sub = snap.h2s.length + snap.h3s.length;
          return { level: sub >= 3 ? 'pass' : sub >= 1 ? 'warn' : 'fail', v: fill(sub >= 3 ? f.pass : sub >= 1 ? f.warn : f.fail, { n: sub }) };
        }
        case 'words':
          return { level: snap.words >= 300 ? 'pass' : snap.words >= 100 ? 'warn' : 'fail', v: fill(snap.words >= 300 ? f.pass : f.warn, { n: snap.words }) };
        case 'links':
          return { level: snap.links.internal >= 3 ? 'pass' : snap.links.internal >= 1 ? 'warn' : 'fail', v: fill(snap.links.internal >= 3 ? f.pass : snap.links.internal >= 1 ? f.warn : f.fail, { n: snap.links.internal }) };
        case 'imgalt':
          if (snap.images.total === 0) return { level: 'fail', v: f.fail };
          return { level: snap.images.missingAlt === 0 ? 'pass' : 'warn', v: fill(snap.images.missingAlt === 0 ? f.pass : f.warn, { n: snap.images.total, m: snap.images.missingAlt }) };
        case 'schema':
          return snap.schemaTypes.length ? { level: 'pass', v: fill(f.pass, { v: snap.schemaTypes.join(', ') }) } : { level: 'fail', v: f.fail };
        case 'og':
          return (snap.og.title || snap.og.desc) ? { level: 'pass', v: f.pass } : { level: 'fail', v: f.fail };
        case 'viewport':
          return snap.viewport ? { level: 'pass', v: f.pass } : { level: 'fail', v: f.fail };
        case 'https':
          return /^https:/i.test(snap.url || '') ? { level: 'pass', v: f.pass } : { level: 'fail', v: f.fail };
        default:
          return { level: 'none', v: '' };
      }
    }

    function score() {
      var u = (($(root, 'sc2-url') || {}).value || '').trim();
      if (!/^https?:\/\//i.test(u)) { status.textContent = 'Enter a full URL, e.g. https://your-site.com/page'; return; }
      status.textContent = 'Fetching page\u2026';
      runBtn.disabled = true;
      INSP.fetchPage(u).then(function (r) {
        runBtn.disabled = false;
        if (!r.ok) { status.textContent = 'Could not fetch that page. Use the paste-HTML option below for private pages.'; return; }
        var snap;
        try { snap = INSP.parse(r.html, r.url || u); } catch (e) { status.textContent = 'Could not parse that page.'; return; }
        snap.status = r.status; snap.ms = r.ms; snap.bytes = r.bytes;
        status.textContent = 'Fetched HTTP ' + r.status + ' \u00b7 ' + fmtBytes(r.bytes);
        render(snap);
      });
    }

    function scorePasted() {
      var html = (($(root, 'sc2-paste') || {}).value || '');
      if (!html.trim()) { status.textContent = 'Paste the page HTML first.'; return; }
      var u = (($(root, 'sc2-url') || {}).value || '').trim();
      var snap;
      try { snap = INSP.parse(html, /^https?:\/\//i.test(u) ? u : ''); } catch (e) { status.textContent = 'Could not parse that HTML.'; return; }
      status.textContent = 'Scored pasted HTML \u00b7 ' + fmtBytes(html.length);
      render(snap);
    }

    function render(snap) {
      out.textContent = '';
      var list = el('ul', 'inspect-signals');
      var earned = 0, total = 0;
      var fixesArr = [];
      factors.forEach(function (f) {
        var r = evalFactor(f, snap);
        total += f.weight;
        earned += r.level === 'pass' ? f.weight : r.level === 'warn' ? Math.round(f.weight * 0.5) : 0;
        var li = el('li', 'sig-' + r.level);
        li.appendChild(el('span', 'sig-dot', ''));
        var body = el('span', 'sig-body');
        body.appendChild(el('strong', null, f.label + ' (' + f.weight + '): '));
        body.appendChild(document.createTextNode(r.v || ''));
        li.appendChild(body);
        list.appendChild(li);
        if (r.level !== 'pass') fixesArr.push({ w: f.weight, label: f.label, text: r.v, level: r.level });
      });
      out.appendChild(list);

      var pct = total ? Math.round(earned / total * 100) : 0;
      var grade = grades.find(function (g) { return pct >= g.min; }) || grades[grades.length - 1] || {};
      scoreWrap.hidden = false;
      ringNum.textContent = pct;
      $(root, 'sc2-ring').style.setProperty('--p', pct);
      gradeEl.textContent = 'Grade ' + (grade.letter || '');
      noteEl.textContent = grade.note || '';

      fixesArr.sort(function (a, b) { return b.w - a.w; });
      fixes.textContent = '';
      if (!fixesArr.length) {
        fixes.textContent = 'Perfect — every on-page factor passed.';
      } else {
        var fl = el('ul', 'fix-list');
        fixesArr.forEach(function (f) {
          var li = el('li', 'sig-' + f.level);
          var b = el('span', 'sig-body');
          b.appendChild(el('strong', null, f.label + ' (' + f.w + ' pts): '));
          b.appendChild(document.createTextNode(f.text));
          li.appendChild(b);
          fl.appendChild(li);
        });
        fixes.appendChild(fl);
      }
    }

    runBtn.addEventListener('click', score);
    $(root, 'sc2-url').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); score(); } });
    var sc2PasteBtn = $(root, 'sc2-paste-run');
    if (sc2PasteBtn) sc2PasteBtn.addEventListener('click', scorePasted);
  };

  function fmtBytes(b) {
    if (!b) return '';
    return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';
  }
})();

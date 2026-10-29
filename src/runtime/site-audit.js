// Tools4Market — runtime: the Website Audit tool (crawl the visitor's own site).
// Classic script (no modules). Every fetch, parse and rule run happens
// server-side in POST /api/audit-batch; this file only orchestrates the
// batches, renders results as they land, and checkpoints to sessionStorage so
// a crawl can be stopped and resumed. Strings live in window.T4M_WA (rules.md §3).
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};
  var S = window.T4M_WA || {};
  var SCORES = window.T4M_SCORE || {};

  function $(root, id) { return root.querySelector('#' + id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function fill(tpl, o) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) {
      return o[k] != null ? o[k] : '';
    });
  }

  // Batch sizes fit the Cloudflare Free per-request budget: one pages call is
  // 4 URLs of fetches, well under the 50-subrequest limit. The 100-URL crawl
  // cap is enforced by the server's discover response.
  var PAGE_BATCH = 4;
  var LINK_BATCH = 10;
  var MAX_LINKS = 100;             // link targets checked after the page crawl
  var STORE_KEY = 't4m_wa_v1';
  var SEV_ORDER = ['blocker', 'major', 'minor', 'info'];
  // Mirrors audit/rules/catalog.json severityWeights — keep in step with it.
  var WEIGHTS = { blocker: 10, major: 4, minor: 1, info: 0 };
  var SEV_CLASS = { blocker: 'sig-fail', major: 'sig-warn', minor: 'sig-minor', info: 'sig-none' };
  // Findings whose copy can be AI-drafted, by suggest-kind.
  var AI_KIND = {
    'title-length': 'title',
    'duplicate-title': 'title',
    'desc-length': 'description',
    'duplicate-description': 'description',
  };

  /** Same normalisation the server's cross phase uses (audit/cross.mjs). */
  function norm(u) {
    try {
      var x = new URL(u);
      x.hash = '';
      x.search = '';
      if (!/\.[a-z0-9]{2,5}$/i.test(x.pathname) && x.pathname.length > 1 && x.pathname.charAt(x.pathname.length - 1) !== '/') x.pathname += '/';
      return x.toString();
    } catch (e) { return null; }
  }

  T['website-audit'] = function (root) {
    var urlIn = $(root, 'wa-url');
    var runBtn = $(root, 'wa-run');
    var stopBtn = $(root, 'wa-stop');
    var resumeBtn = $(root, 'wa-resume');
    var copyBtn = $(root, 'wa-copy-report');
    var status = $(root, 'wa-status');
    var scoreWrap = $(root, 'wa-score');
    var ring = $(root, 'wa-ring');
    var ringNum = $(root, 'wa-ring-num');
    var gradeEl = $(root, 'wa-grade');
    var noteEl = $(root, 'wa-note');
    var pagesOut = $(root, 'wa-pages');
    var out = $(root, 'wa-out');
    if (!runBtn || !out) return;

    out.textContent = S.idle || '';
    if (copyBtn) copyBtn.setAttribute('data-copy-text', S.noReport || '');

    var st = null;       // live crawl state — also the sessionStorage checkpoint
    var running = false;
    var stopped = false;

    // ---- checkpoint (browser-side job state, no server storage) ----------
    function save() {
      if (!st) return;
      try { window.sessionStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (e) { /* private mode: no resume */ }
    }
    function load() {
      try {
        var raw = window.sessionStorage.getItem(STORE_KEY);
        var v = raw ? JSON.parse(raw) : null;
        if (v && v.origin && Array.isArray(v.urls)) return v;
      } catch (e) { /* corrupt checkpoint: start fresh */ }
      return null;
    }
    function clearStore() { try { window.sessionStorage.removeItem(STORE_KEY); } catch (e) {} }

    function setStatus(t) { if (status) status.textContent = t || ''; }
    function resetControls() {
      running = false;
      runBtn.disabled = false;
      runBtn.textContent = S.runLabel || 'Audit Website';
      if (stopBtn) { stopBtn.hidden = true; stopBtn.disabled = false; }
    }
    function showResume() {
      if (!resumeBtn || !st) return;
      resumeBtn.textContent = fill(S.resumeLabel || 'Resume audit of {url}', { url: st.origin });
      resumeBtn.hidden = false;
    }

    // ---- score: mirrors audit/score.mjs exactly --------------------------
    function computeScore() {
      var byPath = {};
      st.summaries.forEach(function (s) { byPath[s.path] = 100; });
      var totals = { blocker: 0, major: 0, minor: 0, info: 0 };
      st.findings.forEach(function (f) {
        totals[f.severity] = (totals[f.severity] || 0) + 1;
        // Site-level findings ('(site)', '/robots.txt') don't map to a page —
        // same as score.mjs: they cap the score but deduct nothing per page.
        if (byPath[f.page] != null) byPath[f.page] -= WEIGHTS[f.severity] || 0;
      });
      var paths = Object.keys(byPath);
      var penalty = 0;
      paths.forEach(function (p) { penalty += 100 - Math.max(0, byPath[p]); });
      var raw = paths.length ? Math.max(0, 100 - penalty / paths.length) : 100;
      var anyWeighted = st.findings.some(function (f) { return (WEIGHTS[f.severity] || 0) > 0; });
      var site = anyWeighted ? Math.min(99.9, Math.round(raw * 10) / 10) : 100;
      return { site: site, pages: paths.length, totals: totals };
    }

    function renderScore() {
      if (!scoreWrap) return;
      var sc = computeScore();
      scoreWrap.hidden = false;
      ringNum.textContent = sc.site;
      ring.style.setProperty('--p', sc.site);
      gradeEl.textContent = fill(S.scoreLine || 'Site audit score: {s}/100', { s: sc.site });
      noteEl.textContent = fill(S.scoreNote || '', { b: WEIGHTS.blocker, g: WEIGHTS.major, m: WEIGHTS.minor });
    }

    // ---- rendering --------------------------------------------------------
    function evText(ev) {
      try {
        var t = JSON.stringify(ev);
        return t.length > 300 ? t.slice(0, 300) + '…' : t;
      } catch (e) { return ''; }
    }

    function summaryFor(pagePath) {
      for (var i = 0; i < st.summaries.length; i++) if (st.summaries[i].path === pagePath) return st.summaries[i];
      return null;
    }

    // Handoff to the site's own tool (or guide), carrying the audited page's
    // snapshot — site.js prefillFromParams reads ?url=&title=&desc= on arrival.
    // Link-target findings (broken internal, dead external) carry the *target*
    // URL in evidence: that is what the next tool must inspect, not the page
    // that contains the link.
    function handoffLink(f) {
      var spec = S.toolFor && S.toolFor[f.id];
      if (!spec || !spec.path) return null;
      var params = [];
      if (spec.path.indexOf('/tools/') === 0) {
        var ev = f.evidence || {};
        var s = ev.target ? null : summaryFor(f.page);
        var u = ev.target || (s && s.url) || '';
        if (u) params.push('url=' + encodeURIComponent(u));
        if (s) {
          if (s.title) params.push('title=' + encodeURIComponent(s.title));
          if (s.description) params.push('desc=' + encodeURIComponent(s.description));
        }
      }
      var a = el('a', 'btn btn-ghost wa-tool', spec.label || spec.path);
      a.href = spec.path + (params.length ? '?' + params.join('&') : '');
      return a;
    }

    function consentOk() {
      return !!(window.T4M_CONSENT && typeof window.T4M_CONSENT.granted === 'function' && window.T4M_CONSENT.granted());
    }

    // Consent-gated AI draft for title/description findings — same contract as
    // the inspect panel: no page data leaves the browser before consent.
    function aiRow(f) {
      var kind = AI_KIND[f.id];
      if (!kind) return null;
      var A = S.ai || {};
      var row = el('div', 'gap-ai-row');
      if (!consentOk()) {
        row.appendChild(el('span', 'gap-ai-note', A.locked || ''));
        var manage = el('button', 'btn btn-ghost gap-ai-manage', A.manage || 'Open consent settings');
        manage.type = 'button';
        manage.addEventListener('click', function () {
          var link = document.querySelector('[data-ck-settings]');
          if (link) link.click();
        });
        row.appendChild(manage);
        return row;
      }
      var btn = el('button', 'btn btn-ghost', A.btn || 'Draft a fix with AI');
      btn.type = 'button';
      btn.addEventListener('click', function () {
        btn.disabled = true;
        btn.textContent = A.pending || 'Drafting…';
        var s = summaryFor(f.page) || {};
        fetch('/api/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'website-audit',
            kind: kind,
            page: { url: s.url || '', title: s.title || '', h1: s.h1 || '', description: s.description || '' },
            issue: f.message || '',
          }),
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (j && j.ok && j.suggestion) {
            btn.remove();
            row.appendChild(el('span', 'gap-ai-result', j.suggestion));
            var cp = el('button', 'btn btn-ghost', A.copy || 'Copy');
            cp.type = 'button';
            cp.setAttribute('data-copy', '');
            cp.setAttribute('data-copy-text', j.suggestion);
            row.appendChild(cp);
            row.appendChild(el('span', 'gap-ai-note', A.applied || ''));
            if (window.T4M_TRACK) window.T4M_TRACK('ai_suggest', { tool_slug: 'website-audit', fix_kind: kind });
          } else {
            btn.disabled = false;
            btn.textContent = A.btn || 'Draft a fix with AI';
            row.appendChild(el('span', 'gap-ai-note', A.fail || ''));
          }
        }).catch(function () {
          btn.disabled = false;
          btn.textContent = A.btn || 'Draft a fix with AI';
          row.appendChild(el('span', 'gap-ai-note', A.fail || ''));
        });
      });
      row.appendChild(btn);
      return row;
    }

    function findingRow(f) {
      var li = el('li', SEV_CLASS[f.severity] || 'sig-none');
      li.appendChild(el('span', 'sig-dot', ''));
      var body = el('span', 'sig-body');
      var sev = (S.sev && S.sev[f.severity]) || f.severity;
      var grp = (S.grp && S.grp[f.group]) || f.group || '';
      body.appendChild(el('strong', null,
        sev + (grp ? ' · ' + grp : '') + ' · ' + f.page + ': ' + (f.message || '')));
      if (f.fix) body.appendChild(el('span', 'wa-fix', f.fix));
      if (f.evidence) {
        var ev = evText(f.evidence);
        if (ev) body.appendChild(el('code', 'wa-ev', ev));
      }
      var link = handoffLink(f);
      if (link) body.appendChild(link);
      var ai = aiRow(f);
      if (ai) body.appendChild(ai);
      li.appendChild(body);
      return li;
    }

    function renderFindings() {
      if (!out) return;
      out.textContent = '';
      if (!st.findings.length) {
        out.textContent = S.emptyReport || '';
        return;
      }
      var sorted = st.findings.slice().sort(function (a, b) {
        var d = SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity);
        return d || String(a.page).localeCompare(String(b.page));
      });
      out.appendChild(el('p', 'preview-label', fill(S.findingsHeader || 'Findings ({n})', { n: sorted.length })));
      var list = el('ul', 'inspect-signals');
      sorted.forEach(function (f) { list.appendChild(findingRow(f)); });
      out.appendChild(list);
    }

    function renderPages() {
      if (!pagesOut) return;
      pagesOut.textContent = '';
      if (!st.summaries.length) return;
      pagesOut.appendChild(el('p', 'preview-label', fill(S.pagesHeader || 'Pages audited ({n})', { n: st.summaries.length })));
      var list = el('ul', 'inspect-signals');
      st.summaries.forEach(function (s) {
        var li = el('li', 'sig-none');
        li.appendChild(el('span', 'sig-dot', ''));
        li.appendChild(el('span', 'sig-body', fill(S.pageRow || '{path} — HTTP {status}, {w} words, {l} internal link(s)', {
          path: s.path, status: s.status != null ? s.status : '—', w: s.words || 0, l: (s.internal || []).length,
        })));
        list.appendChild(li);
      });
      pagesOut.appendChild(list);
    }

    function buildReport() {
      if (!st) return;
      var sc = computeScore();
      var lines = [
        '# Website audit — ' + st.origin,
        'Score: ' + sc.site + '/100 · ' + sc.pages + ' pages crawled · ' +
          sc.totals.blocker + ' blockers, ' + sc.totals.major + ' majors, ' +
          sc.totals.minor + ' minors, ' + sc.totals.info + ' info',
        '',
      ];
      SEV_ORDER.forEach(function (sev) {
        var list = st.findings.filter(function (f) { return f.severity === sev; });
        if (!list.length) return;
        lines.push('## ' + ((S.sev && S.sev[sev]) || sev) + ' (' + list.length + ')');
        list.forEach(function (f) {
          lines.push('- `' + f.page + '` — ' + (f.message || ''));
          if (f.fix) lines.push('  Fix: ' + f.fix);
        });
        lines.push('');
      });
      if (copyBtn) copyBtn.setAttribute('data-copy-text', lines.join('\n').trim() + '\n');
    }

    function renderAll() {
      renderPages();
      renderFindings();
      renderScore();
      buildReport();
    }

    // ---- transport --------------------------------------------------------
    function post(body) {
      return fetch('/api/audit-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(function (r) {
        return r.json().then(function (j) {
          return { ok: !!(r.ok && j && j.ok !== false), data: j || {} };
        });
      });
    }

    // ---- link targets -----------------------------------------------------
    function buildTargets() {
      var seen = {};
      var internal = [], external = [];
      // Crawled pages already have their status — seeded below, never re-fetched.
      st.summaries.forEach(function (s) {
        var k = norm(s.url);
        if (k) seen[k] = true;
      });
      st.summaries.forEach(function (s) {
        (s.internal || []).forEach(function (u) {
          var k = norm(u);
          if (k && !seen[k]) { seen[k] = true; internal.push(k); }
        });
        (s.external || []).forEach(function (u) {
          var k = norm(u);
          if (k && !seen[k]) { seen[k] = true; external.push(k); }
        });
      });
      // Internal first: a broken link inside the site is the blocker finding.
      st.targets = internal.concat(external).slice(0, MAX_LINKS);
      st.linkResults = st.summaries
        .filter(function (s) { return s.status != null; })
        .map(function (s) { return { url: norm(s.url), status: s.status }; });
    }

    // ---- phases -----------------------------------------------------------
    function pause() {
      save();
      var total = st.urls.length;
      var done = st.phase === 'pages' ? st.summaries.length : total;
      setStatus(fill(S.stopped || 'Audit stopped at {m} of {n} pages.', { m: done, n: total }));
      showResume();
      resetControls();
    }

    async function runPages() {
      while (st.next < st.urls.length) {
        if (stopped) { pause(); return; }
        var batch = st.urls.slice(st.next, st.next + PAGE_BATCH);
        var r = await post({ mode: 'pages', urls: batch, robotsRules: st.robotsRules });
        if (!r.ok) throw new Error('pages batch failed');
        r.data.pages.forEach(function (p) {
          var s = p.summary;
          if (s) {
            s.status = p.status;
            st.summaries.push(s);
          }
          (p.findings || []).forEach(function (f) { st.findings.push(f); });
        });
        st.next += batch.length;
        setStatus(fill(S.crawling || 'Audited {m} of {n} pages…', { m: st.next, n: st.urls.length }));
        renderAll();
        save();
      }
      st.phase = 'links';
      st.next = 0;
      save();
    }

    async function runLinks() {
      if (!st.targets) buildTargets();
      while (st.next < st.targets.length) {
        if (stopped) { pause(); return; }
        var batch = st.targets.slice(st.next, st.next + LINK_BATCH);
        var r = await post({ mode: 'links', urls: batch });
        if (!r.ok) throw new Error('links batch failed');
        st.linkResults = st.linkResults.concat(r.data.results || []);
        st.next += batch.length;
        setStatus(fill(S.links || 'Checking link targets ({m} of {n})…', {
          m: Math.min(st.next, st.targets.length), n: st.targets.length,
        }));
        save();
      }
      st.phase = 'cross';
      st.next = 0;
      save();
    }

    async function runCross() {
      setStatus(S.cross || 'Cross-checking pages…');
      var r = await post({ mode: 'cross', summaries: st.summaries, linkResults: st.linkResults || [] });
      if (!r.ok) throw new Error('cross failed');
      (r.data.findings || []).forEach(function (f) { st.findings.push(f); });
      st.phase = 'done';
      st.next = 0;
      renderAll();
      save();
    }

    function finish() {
      clearStore();
      if (resumeBtn) resumeBtn.hidden = true;
      setStatus(fill(S.done || 'Audit complete: {n} page(s), {f} finding(s).', {
        n: st.summaries.length, f: st.findings.length,
      }));
      resetControls();
    }

    async function run(origin) {
      running = true;
      stopped = false;
      runBtn.disabled = true;
      runBtn.textContent = S.runningLabel || 'Audit running…';
      if (stopBtn) { stopBtn.hidden = false; stopBtn.disabled = false; }
      if (resumeBtn) resumeBtn.hidden = true;
      try {
        if (!st) {
          setStatus(S.starting || 'Reading robots.txt and sitemap.xml…');
          var d = await post({ mode: 'discover', origin: origin });
          if (!d.ok) throw new Error('discover failed');
          st = {
            origin: origin,
            urls: d.data.urls || [],
            robotsRules: (d.data.robots && d.data.robots.rules) || null,
            phase: 'pages',
            next: 0,
            summaries: [],
            findings: d.data.findings || [],
            targets: null,
            linkResults: [],
          };
          if (!st.urls.length) {
            renderAll();
            setStatus(S.noPages || 'No page URLs found in the sitemap.');
            clearStore();
            resetControls();
            return;
          }
          setStatus(fill(S.discovered || 'Found {n} page(s) in the sitemap.', { n: st.urls.length }));
          save();
        }
        // Resume dispatches from the checkpointed phase.
        if (st.phase === 'pages') { await runPages(); if (stopped) return; }
        if (st.phase === 'links') { await runLinks(); if (stopped) return; }
        // cross is the final single request — its completion ends the run, so
        // a stop pressed during it still finishes (nothing left to skip).
        if (st.phase !== 'done') await runCross();
        finish();
      } catch (e) {
        var msg = S.failed || 'The audit request failed. Check the site is publicly reachable, then try again.';
        setStatus(msg);
        // Keep the failure in the report area as well whenever nothing has been
        // rendered yet — status text alone reads as a silent tool.
        if (out && (!st || (!st.findings.length && !st.summaries.length))) out.textContent = msg;
        if (st) { save(); showResume(); }
        resetControls();
      }
    }

    function originOf(v) {
      try {
        var u = new URL(String(v || '').trim());
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        return u.origin;
      } catch (e) { return null; }
    }

    function startFresh() {
      var origin = originOf(urlIn && urlIn.value);
      if (!origin) { setStatus(S.badUrl || 'Enter a full URL.'); return; }
      if (running) return;
      st = null;
      clearStore();
      out.textContent = '';
      pagesOut.textContent = '';
      scoreWrap.hidden = true;
      run(origin);
    }

    runBtn.addEventListener('click', startFresh);
    if (urlIn) urlIn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); startFresh(); }
    });
    if (stopBtn) stopBtn.addEventListener('click', function () {
      if (!running) return;
      stopped = true;
      stopBtn.disabled = true;   // takes effect at the next batch boundary
    });
    if (resumeBtn) resumeBtn.addEventListener('click', function () {
      if (running) return;
      var saved = load();
      if (!saved) { resumeBtn.hidden = true; return; }
      st = saved;
      out.textContent = '';
      pagesOut.textContent = '';
      renderAll();
      setStatus(fill(S.resumed || 'Resuming the audit of {url}…', { url: st.origin }));
      run(st.origin);
    });

    // A checkpoint from an earlier visit offers Resume on load.
    var pending = load();
    if (pending && pending.phase !== 'done') {
      st = pending;
      showResume();
      renderAll();
    }
  };
})();

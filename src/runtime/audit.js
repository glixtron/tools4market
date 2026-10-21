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
      .replace(/\{type\}/g, o.type != null ? o.type : '')
      .replace(/\{url\}/g, o.url != null ? o.url : '')
      .replace(/\{detail\}/g, o.detail != null ? o.detail : '');
  }
  function fetchedStatus(r, requestedUrl) {
    var copy = ((window.T4M_ISTR || {}).pageStatus || {});
    var finalUrl = r.finalUrl || requestedUrl;
    var result = fill(copy.fetched || 'Fetched {url} · HTTP {status} · {bytes} · {ms} · {type}.', {
      url: finalUrl, status: r.status || 'unknown', bytes: fmtBytes(r.bytes) || 'size unavailable',
      ms: r.ms ? r.ms + ' ms' : 'timing unavailable', type: r.contentType || 'content type unavailable'
    });
    if (finalUrl !== requestedUrl) result += ' ' + fill(copy.redirected || 'Final response redirected to {url}.', { url: finalUrl });
    if (r.truncated) result += ' ' + (copy.truncated || 'This is a partial snapshot.');
    return result;
  }
  function origin(u) { try { return new URL(u).origin; } catch (e) { return ''; } }
  function normalizeUrl(u) {
    try { var x = new URL(u); x.hash = ''; if (x.pathname.length > 1) x.pathname = x.pathname.replace(/\/+$/, ''); return x.toString(); }
    catch (e) { return String(u || '').trim(); }
  }
  function sitemapLocs(xml, base) {
    var doc;
    try { doc = new DOMParser().parseFromString(xml, 'application/xml'); } catch (e) { return { ok: false, index: false, locs: [] }; }
    if (doc.querySelector('parsererror')) return { ok: false, index: false, locs: [] };
    var rootName = (doc.documentElement && doc.documentElement.localName || '').toLowerCase();
    var locs = Array.prototype.slice.call(doc.querySelectorAll('loc')).map(function (e) {
      try { return new URL((e.textContent || '').trim(), base).toString(); } catch (x) { return ''; }
    }).filter(Boolean);
    return { ok: rootName === 'urlset' || rootName === 'sitemapindex', index: rootName === 'sitemapindex', locs: locs };
  }
  function crawlContext(url, includeSitemaps) {
    var robotsUrl = origin(url) + '/robots.txt';
    return INSP.fetchPage(robotsUrl, { allowText: true }).then(function (rb) {
      var ctx = { robots: rb, rules: null, sitemapUrls: [], sitemapDeclared: false,
        sitemapSource: '', sitemapStatus: 'unverified', sitemapFound: false,
        sitemapSampled: 0, sitemapFetchedFiles: 0, sitemapValidFiles: 0,
        sitemapFailures: 0 };
      if (rb.ok) ctx.rules = INSP.parseRobotsTxt(rb.html, url, 'googlebot');
      // A 404 robots.txt means no published rules; other failures mean unknown.
      else if (rb.status === 404) ctx.rules = { allowed: true, matched: null, sitemapUrls: [] };
      var declared = ctx.rules && ctx.rules.sitemapUrls || [];
      ctx.sitemapDeclared = declared.length > 0;
      ctx.sitemapUrls = declared.length ? declared.slice(0, 3) : [origin(url) + '/sitemap.xml'];
      ctx.sitemapSource = declared.length ? 'robots.txt declaration' : 'common /sitemap.xml path (not declared in robots.txt)';
      if (!includeSitemaps) { ctx.sitemapStatus = 'not-checked'; return ctx; }

      function inspectMap(m, childMaps) {
        if (!m.response.ok) { ctx.sitemapFailures++; return; }
        ctx.sitemapFetchedFiles++;
        var parsed = sitemapLocs(m.response.html, m.response.finalUrl || m.url);
        if (!parsed.ok) { ctx.sitemapFailures++; return; }
        ctx.sitemapValidFiles++;
        if (parsed.index) childMaps.push.apply(childMaps, parsed.locs);
        else {
          ctx.sitemapSampled++;
          if (parsed.locs.some(function (loc) { return normalizeUrl(loc) === normalizeUrl(url); })) ctx.sitemapFound = true;
        }
      }
      return Promise.all(ctx.sitemapUrls.map(function (s) {
        return INSP.fetchPage(s, { allowText: true }).then(function (r) { return { url: s, response: r }; });
      })).then(function (maps) {
        var childMaps = [];
        maps.forEach(function (m) { inspectMap(m, childMaps); });
        return Promise.all(childMaps.slice(0, 3).map(function (s) {
          return INSP.fetchPage(s, { allowText: true }).then(function (r) { return { url: s, response: r }; });
        })).then(function (children) {
          children.forEach(function (m) { inspectMap(m, []); });
          ctx.sitemapStatus = !ctx.sitemapFetchedFiles ? 'failed'
            : (!ctx.sitemapValidFiles ? 'invalid'
              : (ctx.sitemapFailures ? 'partial' : 'checked'));
          return ctx;
        });
      });
    }).catch(function () { return { robots: null, rules: null, sitemapUrls: [], sitemapDeclared: false,
      sitemapSource: '', sitemapStatus: 'unverified', sitemapFound: false, sitemapSampled: 0,
      sitemapFetchedFiles: 0, sitemapValidFiles: 0, sitemapFailures: 0 }; });
  }

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

    // Each finding is tied to the response fetched for this exact URL.
    function evalCheck(c, snap, ctx) {
      ctx = ctx || {};
      var tl = snap.title.length, dl = snap.desc.length;
      switch (c.id) {
        case 'http':
          return { level: snap.status >= 200 && snap.status < 300 ? 'pass' : 'warn', v: fill(snap.status >= 200 && snap.status < 300 ? c.pass : c.fail, { status: snap.status || 'unknown', bytes: fmtBytes(snap.bytes) }) };
        case 'https':
          return /^https:/i.test(snap.finalUrl || snap.url || '') ? { level: 'pass', v: c.pass } : { level: 'warn', v: c.fail };
        case 'robots':
          return /noindex/i.test(snap.robots) ? { level: 'fail', v: fill(c.fail, { v: snap.robots }) } : { level: 'pass', v: c.pass };
        case 'robotsTxt':
          if (!ctx.robots || !ctx.robots.ok) {
            if (ctx.robots && ctx.robots.status === 404) return { level: 'pass', v: 'No robots.txt file was found; there is no published rule blocking this URL.' };
            return { level: 'none', v: fill(c.none, { v: ctx.robots && ctx.robots.status ? 'HTTP ' + ctx.robots.status : 'request failed' }) };
          }
          if (ctx.rules && ctx.rules.allowed) return { level: 'pass', v: c.pass };
          var rule = ctx.rules && ctx.rules.matched;
          return { level: 'warn', v: fill(c.warn, { v: rule ? (rule.allow ? 'Allow: ' : 'Disallow: ') + rule.path : 'matching rule' }) };
        case 'canonical':
          if (!snap.canonical) return { level: 'none', v: c.none };
          if (snap.canonicalCount > 1) return { level: 'fail', v: c.fail };
          if (normalizeUrl(snap.canonical) !== normalizeUrl(snap.finalUrl || snap.url)) return { level: 'warn', v: fill(c.warn, { v: snap.canonical }) };
          return { level: 'pass', v: fill(c.pass, { v: snap.canonical }) };
        case 'title':
          if (!tl) return { level: 'warn', v: c.warn };
          return { level: 'pass', v: fill(c.pass, { n: tl, v: snap.title }) };
        case 'h1':
          return snap.h1s.length ? { level: 'pass', v: fill(c.pass, { v: snap.h1s[0] }) } : { level: 'warn', v: c.warn };
        case 'description':
          return dl ? { level: 'pass', v: fill(c.pass, { n: dl }) } : { level: 'none', v: c.none };
        case 'sitemap':
          if (!ctx.sitemapUrls || !ctx.sitemapUrls.length) return { level: 'none', v: c.none };
          if (ctx.sitemapFound) return { level: 'pass', v: fill(c.pass, { v: ctx.sitemapSource }) };
          if (ctx.sitemapStatus === 'failed' || ctx.sitemapStatus === 'invalid' || ctx.sitemapStatus === 'partial') {
            var detail = ctx.sitemapUrls.join(', ') + ' (' + ctx.sitemapStatus + ')';
            return ctx.sitemapDeclared
              ? { level: 'warn', v: fill(c.warn, { v: detail }) }
              : { level: 'none', v: fill(c.none, { v: 'No sitemap URL is declared in robots.txt; the common /sitemap.xml path could not be verified. Sitemap submissions made only in Search Console are not visible to this check.' }) };
          }
          return { level: 'none', v: fill(c.none, { v: 'Fetched ' + ctx.sitemapSampled + ' sitemap file(s) via ' + ctx.sitemapSource + ', but this URL was not found.' }) };
        case 'structured':
          return snap.schemaTypes.length ? { level: 'none', v: fill(c.pass, { v: snap.schemaTypes.join(', ') }) } : { level: 'none', v: c.none };
        case 'images':
          if (snap.images.total === 0) return { level: 'none', v: c.none };
          return snap.images.missingAlt === 0 ? { level: 'none', v: fill(c.pass, { n: snap.images.total }) }
            : { level: 'none', v: fill(c.warn, { n: snap.images.total, m: snap.images.missingAlt }) };
        default:
          return { level: 'none', v: '' };
      }
    }

    function audit() {
      var u = (($(root, 'ca-url') || {}).value || '').trim();
      if (!/^https?:\/\//i.test(u)) { status.textContent = 'Enter a full URL, e.g. https://your-site.com/page'; return; }
      status.textContent = ((window.T4M_ISTR || {}).pageStatus || {}).fetching || 'Fetching the page response…';
      runBtn.disabled = true;
      // also fetch robots.txt (the crawler's entry point) to check the sitemap line
      INSP.fetchPage(u).then(function (r) {
        if (!r.ok) {
          runBtn.disabled = false;
          status.textContent = 'Could not fetch that page. If it is private or blocked, use the paste-HTML option below.';
          return;
        }
        var snap;
        try { snap = INSP.parse(r.html, r.finalUrl || u); } catch (e) { status.textContent = 'Could not parse that page.'; runBtn.disabled = false; return; }
        snap.status = r.status; snap.ms = r.ms; snap.bytes = r.bytes; snap.finalUrl = r.finalUrl || u; snap.requestedUrl = u;
        snap.contentType = r.contentType || ''; snap.truncated = !!r.truncated;
        if (r.xRobotsTag) snap.robots = [snap.robots, r.xRobotsTag].filter(Boolean).join('; ');
        status.textContent = fetchedStatus(r, u);
        return crawlContext(snap.finalUrl).then(function (ctx) {
          render(snap, ctx);
          runBtn.disabled = false;
        });
      }).catch(function () { runBtn.disabled = false; status.textContent = 'The page request failed before a report could be built. Check the URL or use the paste option.'; });
    }

    // paste-HTML path — best-effort robots.txt lookup, never blocks on it
    function auditPasted() {
      var html = (($(root, 'ca-paste') || {}).value || '');
      if (!html.trim()) { status.textContent = 'Paste the page HTML first.'; return; }
      var u = (($(root, 'ca-url') || {}).value || '').trim();
      var snap;
      try { snap = INSP.parse(html, /^https?:\/\//i.test(u) ? u : ''); } catch (e) { status.textContent = 'Could not parse that HTML.'; return; }
      status.textContent = 'Audited pasted HTML \u00b7 ' + fmtBytes(html.length);
      if (u) { snap.finalUrl = u; snap.requestedUrl = u; }
      if (u) {
        crawlContext(u).then(function (ctx) { render(snap, ctx); }).catch(function () { render(snap, null); });
      } else render(snap, null);
    }

    function render(snap, ctx) {
      // per-check report
      out.textContent = '';
      var list = el('ul', 'inspect-signals');
      var fixesArr = [];
      var earned = 0, total = 0;
      checks.forEach(function (c) {
        var r = evalCheck(c, snap, ctx);
        var lvl = r.level;
        var li = el('li', 'sig-' + lvl);
        li.appendChild(el('span', 'sig-dot', ''));
        var body = el('span', 'sig-body');
        body.appendChild(el('strong', null, (verdicts[lvl] || lvl.toUpperCase()) + ' \u00b7 ' + c.label + ': '));
        body.appendChild(document.createTextNode(r.v || ''));
        li.appendChild(body);
        list.appendChild(li);
        if (c.weight && lvl !== 'none') {
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
      noteEl.textContent = note + ' ' + (s.disclaimer || 'This checklist is not a ranking prediction.');

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

    function evalFactor(f, snap, query, ctx) {
      var tl = snap.title.length, dl = snap.desc.length;
      switch (f.id) {
        case 'query': {
          if (!query) return { level: 'none', v: f.none || S.summary.noQuery };
          var areas = [snap.title, snap.h1s[0] || '', snap.desc, snap.mainText];
          var found = areas.filter(function (v) { return INSP.phraseCount(v, query) > 0; }).length;
          return { level: 'none', v: fill(f.info, { n: found }) };
        }
        case 'title':
          if (!tl) return { level: 'fail', v: f.fail };
          return { level: 'pass', v: fill(f.pass, { n: tl }) };
        case 'desc':
          return dl ? { level: 'pass', v: fill(f.pass, { n: dl }) } : { level: 'warn', v: f.warn };
        case 'h1':
          return snap.h1s.length ? { level: 'pass', v: fill(f.pass, { v: snap.h1s[0] }) } : { level: 'warn', v: f.warn };
        case 'content':
          return snap.words > 0 ? { level: 'pass', v: fill(f.pass, { n: snap.words }) } : { level: 'warn', v: f.warn };
        case 'canonical':
          if (!snap.canonical) return { level: 'none', v: f.none };
          if (snap.canonicalCount > 1) return { level: 'fail', v: f.fail };
          return normalizeUrl(snap.canonical) === normalizeUrl(snap.finalUrl || snap.url)
            ? { level: 'pass', v: fill(f.pass, { v: snap.canonical }) }
            : { level: 'warn', v: fill(f.warn, { v: snap.canonical }) };
        case 'words':
          return { level: 'none', v: fill(f.info, { n: snap.words }) };
        case 'links':
          return snap.links.internal > 0 ? { level: 'pass', v: fill(f.pass, { n: snap.links.internal }) } : { level: 'warn', v: f.warn };
        case 'viewport':
          return snap.viewport ? { level: 'pass', v: f.pass } : { level: 'warn', v: f.warn };
        case 'https':
          return /^https:/i.test(snap.finalUrl || snap.url || '') ? { level: 'pass', v: f.pass } : { level: 'warn', v: f.warn };
        case 'robots':
          return /noindex/i.test(snap.robots) ? { level: 'fail', v: fill(f.fail, { v: snap.robots }) } : { level: 'pass', v: f.pass };
        case 'robotsTxt':
          if (!ctx || !ctx.robots) return { level: 'none', v: 'Not checked for pasted HTML.' };
          if (!ctx.robots.ok) {
            if (ctx.robots.status === 404) return { level: 'pass', v: 'No robots.txt file was found; there is no published rule blocking this URL.' };
            return { level: 'none', v: 'Could not fetch robots.txt; page-level checks still ran.' };
          }
          return ctx.rules && ctx.rules.allowed ? { level: 'pass', v: f.pass }
            : { level: 'warn', v: fill(f.warn, { v: ctx.rules && ctx.rules.matched ? ctx.rules.matched.path : 'matching rule' }) };
        case 'headings':
          return { level: 'none', v: fill(f.info, { n: snap.h2s.length + snap.h3s.length }) };
        case 'schema':
          return { level: 'none', v: snap.schemaTypes.length ? fill(f.info, { v: snap.schemaTypes.join(', ') }) : f.none };
        case 'og':
          return { level: 'none', v: (snap.og.title || snap.og.desc) ? f.info : f.none };
        default:
          return { level: 'none', v: '' };
      }
    }

    function score() {
      var u = (($(root, 'sc2-url') || {}).value || '').trim();
      if (!/^https?:\/\//i.test(u)) { status.textContent = 'Enter a full URL, e.g. https://your-site.com/page'; return; }
      status.textContent = ((window.T4M_ISTR || {}).pageStatus || {}).fetching || 'Fetching the page response…';
      runBtn.disabled = true;
      INSP.fetchPage(u).then(function (r) {
        runBtn.disabled = false;
        if (!r.ok) { status.textContent = 'Could not fetch that page. Use the paste-HTML option below for private pages.'; return; }
        var snap;
        try { snap = INSP.parse(r.html, r.finalUrl || u); } catch (e) { status.textContent = 'Could not parse that page.'; return; }
        snap.status = r.status; snap.ms = r.ms; snap.bytes = r.bytes; snap.finalUrl = r.finalUrl || u; snap.requestedUrl = u;
        snap.contentType = r.contentType || '';
        snap.truncated = !!r.truncated;
        if (r.xRobotsTag) snap.robots = [snap.robots, r.xRobotsTag].filter(Boolean).join('; ');
        status.textContent = fetchedStatus(r, u);
        return crawlContext(snap.finalUrl, false).then(function (ctx) {
          render(snap, ctx);
        });
      }).catch(function () { runBtn.disabled = false; status.textContent = 'Page fetch failed before a score could be calculated.'; });
    }

    function scorePasted() {
      var html = (($(root, 'sc2-paste') || {}).value || '');
      if (!html.trim()) { status.textContent = 'Paste the page HTML first.'; return; }
      var u = (($(root, 'sc2-url') || {}).value || '').trim();
      var snap;
      try { snap = INSP.parse(html, /^https?:\/\//i.test(u) ? u : ''); } catch (e) { status.textContent = 'Could not parse that HTML.'; return; }
      status.textContent = 'Scored pasted HTML · ' + fmtBytes(html.length) + ' · response headers and robots.txt were not fetched.';
      snap.finalUrl = u || '';
      snap.requestedUrl = u || '';
      render(snap, null);
    }

    function render(snap, ctx) {
      var query = (($(root, 'sc2-query') || {}).value || '').trim();
      out.textContent = '';
      var list = el('ul', 'inspect-signals');
      var earned = 0, total = 0;
      var fixesArr = [];
      factors.forEach(function (f) {
        var r = evalFactor(f, snap, query, ctx);
        if (r.level !== 'none') {
          total += f.weight;
          earned += r.level === 'pass' ? f.weight : r.level === 'warn' ? Math.round(f.weight * 0.5) : 0;
        }
        var li = el('li', 'sig-' + r.level);
        li.appendChild(el('span', 'sig-dot', ''));
        var body = el('span', 'sig-body');
        body.appendChild(el('strong', null, f.label + (r.level === 'none' ? ': ' : ' (' + f.weight + '): ')));
        body.appendChild(document.createTextNode(r.v || ''));
        li.appendChild(body);
        list.appendChild(li);
        if ((r.level === 'fail' || r.level === 'warn') && (f.weight || f.id === 'robots')) fixesArr.push({ w: f.weight, label: f.label, text: r.v, level: r.level });
      });
      out.appendChild(list);

      var evidence = el('div', 'inspect-tip');
      evidence.appendChild(el('strong', null, 'Evidence from this page'));
      evidence.appendChild(document.createElement('br'));
      evidence.appendChild(document.createTextNode('Title: ' + (snap.title || '(missing)') + ' · H1: ' + (snap.h1s[0] || '(missing)')));
      evidence.appendChild(document.createElement('br'));
      evidence.appendChild(document.createTextNode('Description: ' + (snap.desc || '(missing)')));
      if (query) {
        var hits = [snap.title, snap.h1s[0] || '', snap.desc, snap.mainText].map(function (txt) { return INSP.phraseCount(txt, query) > 0; });
        evidence.appendChild(document.createElement('br'));
      var foundAreas = ['title', 'H1', 'description', 'main text'].filter(function (_, i) { return hits[i]; });
      evidence.appendChild(document.createTextNode('Target phrase “' + query + '” is present in ' + (foundAreas.length ? foundAreas.join(', ') : 'none of the four checked areas') + '.'));
      } else evidence.appendChild(document.createTextNode(' ' + (S.summary.noQuery || 'Add a target phrase for topical placement feedback.')));
      if (snap.words) {
        evidence.appendChild(document.createElement('br'));
        evidence.appendChild(document.createTextNode('Main text: about ' + snap.words + ' words. Count is contextual, not a minimum or ranking threshold.'));
      }
      out.appendChild(evidence);

      var pct = total ? Math.round(earned / total * 100) : 0;
      var grade = grades.find(function (g) { return pct >= g.min; }) || grades[grades.length - 1] || {};
      scoreWrap.hidden = false;
      ringNum.textContent = pct;
      $(root, 'sc2-ring').style.setProperty('--p', pct);
      gradeEl.textContent = 'Grade ' + (grade.letter || '');
      noteEl.textContent = (grade.note || '') + ' ' + (S.summary.gradeNote || 'This checklist is not a ranking prediction.');

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

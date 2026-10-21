// Tools4Market — runtime: "analyze your own page" engine.
// Classic script (no modules). Defines window.T4M_INSPECT. Loaded after site.js;
// site.js calls T4M_INSPECT.mount(root, slug) right after a tool initialises so the
// URL panel is injected uniformly across every tool page.
//
// Data (all user-facing strings) comes from window.T4M_ISTR, injected at build time
// from src/data/inspect.js — nothing here is hardcoded copy (rules.md §3).
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};
  var TXT = window.T4M_ISTR || {};
  var P = TXT.panel || {};
  var V = TXT.verdicts || {};
  var ERR = TXT.errors || {};
  function $(root, id) { return root.querySelector('#' + id); }

  // ---------------------------------------------------------------- fetch
  // Layer 1: our Cloudflare Pages Function /api/fetch (CORS-free, first-party).
  // Layer 2: direct browser fetch (works only for CORS-open origins).
  // Returns a checked response record. Text/XML is accepted only for supporting
  // resources such as robots.txt and sitemaps.
  function fetchPage(url, options) {
    options = options || {};
    if (typeof fetch !== 'function') return Promise.resolve({ ok: false, reason: 'cors' });
    // Same-origin pages are already fetchable by the browser. Avoid sending a
    // request through our own Worker proxy, which can recurse at the edge.
    try {
      if (new URL(url, window.location.href).origin === window.location.origin) return tryDirect(url, options);
    } catch (e) {}
    var proxy = '/api/fetch?url=' + encodeURIComponent(url);
    return fetch(proxy)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var type = String(j && j.contentType || '').toLowerCase();
        var acceptableType = !type || /html|xhtml/i.test(type) || (options.allowText && /text|xml/i.test(type));
        if (j && j.ok && j.status >= 200 && j.status < 300 && acceptableType && typeof j.body === 'string' && j.body.trim()) {
          return { ok: true, html: j.body, url: url, finalUrl: j.finalUrl || url,
                   status: j.status, ms: j.ms, bytes: j.bytes, contentType: j.contentType || '',
                   truncated: !!j.truncated, xRobotsTag: j.xRobotsTag || '' };
        }
        if (j && j.status >= 400) return { ok: false, reason: 'http', status: j.status, finalUrl: j.finalUrl || url };
        if (j && j.ok && !acceptableType) return { ok: false, reason: 'content-type', contentType: j.contentType || '' };
        return tryDirect(url, options);
      })
      .catch(function () { return tryDirect(url, options); });
  }

  function tryDirect(url, options) {
    return fetch(url, { mode: 'cors', credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) return { ok: false, reason: 'http', status: r.status };
        return r.text().then(function (t) {
          if (!t.trim()) return { ok: false, reason: 'empty', status: r.status };
          var contentType = r.headers.get('content-type') || '';
          if (contentType && !/html|xhtml/i.test(contentType) && !(options && options.allowText && /text|xml/i.test(contentType))) {
            return { ok: false, reason: 'content-type', status: r.status, contentType: contentType };
          }
          return { ok: true, html: t, url: url, finalUrl: r.url || url,
                   status: r.status, ms: 0, bytes: t.length, contentType: contentType,
                   xRobotsTag: r.headers.get('x-robots-tag') || '' };
        });
      })
      .catch(function () { return { ok: false, reason: 'cors' }; });
  }

  // ---------------------------------------------------------------- parse
  // Structured snapshot of a page from its HTML. Uses DOMParser — never innerHTML.
  function parse(html, base) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    function meta(sel) { var e = doc.querySelector(sel); return e ? (e.getAttribute('content') || '').trim() : ''; }
    function prop(p) { return meta('meta[property="' + p + '"]'); }
    function name(n) { return meta('meta[name="' + n + '"]'); }

    var titleEls = Array.prototype.slice.call(doc.querySelectorAll('title'));
    var title = (titleEls[0] ? titleEls[0].textContent : '').trim();
    var desc = name('description');
    var canonicalEls = Array.prototype.slice.call(doc.querySelectorAll('link[rel="canonical"]'));
    var canonEl = canonicalEls[0];
    var canonical = canonEl ? (canonEl.getAttribute('href') || '').trim() : '';
    // resolve relative canonical against the base URL
    if (canonical && base) { try { canonical = new URL(canonical, base).toString(); } catch (e) {} }

    var robotEls = Array.prototype.slice.call(doc.querySelectorAll('meta[name="robots"],meta[name="googlebot"],meta[name="bingbot"]'));
    var robots = robotEls.map(function (e) { return e.getAttribute('content') || ''; }).filter(Boolean).join('; ');
    var langEl = doc.documentElement.getAttribute('lang');

    var h1s = texts(doc, 'h1');
    var h2s = texts(doc, 'h2');
    var h3s = texts(doc, 'h3');

    var imgs = Array.prototype.slice.call(doc.querySelectorAll('img'));
    var missingAlt = imgs.filter(function (im) {
      var a = im.getAttribute('alt');
      return a === null && !/presentation|none/i.test(im.getAttribute('role') || '');
    }).length;

    var links = Array.prototype.slice.call(doc.querySelectorAll('a[href]'));
    var internal = 0, external = 0, nofollow = 0;
    var baseHost = '';
    if (base) { try { baseHost = new URL(base).hostname.replace(/^www\./i, ''); } catch (e) {} }
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return;
      var isInternal = true;
      if (/^https?:\/\//i.test(href)) {
        try { isInternal = new URL(href).hostname.replace(/^www\./i, '') === baseHost; } catch (e) { isInternal = false; }
      }
      if (isInternal) internal++; else external++;
      if (/\bnofollow\b/i.test(a.getAttribute('rel') || '')) nofollow++;
    });

    var schemaTypes = [];
    Array.prototype.slice.call(doc.querySelectorAll('script[type="application/ld+json"]')).forEach(function (s) {
      try {
        var j = JSON.parse(s.textContent);
        collectTypes(j, schemaTypes);
      } catch (e) {}
    });

    var hreflangs = Array.prototype.slice.call(doc.querySelectorAll('link[rel="alternate"][hreflang]'))
      .map(function (l) { return { lang: l.getAttribute('hreflang'), href: l.getAttribute('href') }; });

    // visible body text (scripts/styles removed) — powers the keyword-density prefill
    function visibleText(node) {
      if (!node) return '';
      var c = node.cloneNode(true);
      Array.prototype.slice.call(c.querySelectorAll('script,style,noscript,svg,nav,header,footer,aside,form,button,input,select,textarea,[hidden],[aria-hidden="true"]'))
        .forEach(function (x) { if (x.parentNode) x.parentNode.removeChild(x); });
      return (c.textContent || '').replace(/\s+/g, ' ').trim();
    }
    var bodyText = visibleText(doc.body || doc.createElement('div'));
    // Use the strongest available content container, never add nested containers
    // together (which double-counts article text). Fall back to cleaned body text.
    var contentNodes = Array.prototype.slice.call(doc.querySelectorAll(
      '.tool-content, .tool-faq, .home-content, .cat-about, .policy, .entry-content, .post-content, article, main, [role="main"]'));
    var mainText = '';
    contentNodes.forEach(function (n) {
      var text = visibleText(n);
      if (text.length > mainText.length) mainText = text;
    });
    if (!mainText) mainText = bodyText;
    var countText = mainText;
    var words = countText ? countText.split(' ').filter(Boolean).length : 0;

    var viewportEl = doc.querySelector('meta[name="viewport"]');

    return {
      url: base, finalUrl: base, status: 0, ms: 0, bytes: html.length,
      title: title, desc: desc, canonical: canonical, robots: robots,
      titleCount: titleEls.length, canonicalCount: canonicalEls.length, robotsTags: robotEls.length,
      lang: langEl || '', viewport: viewportEl ? (viewportEl.getAttribute('content') || '') : '',
      charset: doc.querySelector('meta[charset]') ? 'yes' : '',
      og: { title: prop('og:title'), desc: prop('og:description'), image: prop('og:image'),
            url: prop('og:url'), type: prop('og:type'), siteName: prop('og:site_name') },
      twitter: { card: name('twitter:card'), title: name('twitter:title'),
                 desc: name('twitter:description'), image: name('twitter:image') },
      h1s: h1s, h2s: h2s, h3s: h3s,
      images: { total: imgs.length, missingAlt: missingAlt },
      links: { internal: internal, external: external, nofollow: nofollow },
      schemaTypes: schemaTypes, hreflangs: hreflangs,
      words: words, bodyText: mainText, mainText: mainText, fullText: bodyText
    };
  }

  function texts(doc, sel) {
    return Array.prototype.slice.call(doc.querySelectorAll(sel))
      .map(function (e) { return (e.textContent || '').trim(); })
      .filter(Boolean);
  }

  function collectTypes(node, out) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(function (n) { collectTypes(n, out); }); return; }
    if (node['@type']) {
      var t = node['@type'];
      (Array.isArray(t) ? t : [t]).forEach(function (x) { if (out.indexOf(x) === -1) out.push(x); });
    }
    if (node['@graph']) collectTypes(node['@graph'], out);
  }

  function parseRobotsTxt(text, pageUrl, botName) {
    var groups = [], group = { agents: [], rules: [] }, hasRules = false;
    String(text || '').split(/\r?\n/).forEach(function (line) {
      line = line.replace(/#.*$/, '').trim();
      if (!line) return;
      var ix = line.indexOf(':');
      if (ix < 0) return;
      var key = line.slice(0, ix).trim().toLowerCase();
      var value = line.slice(ix + 1).trim();
      if (key === 'user-agent') {
        if (hasRules) { groups.push(group); group = { agents: [], rules: [] }; hasRules = false; }
        group.agents.push(value.toLowerCase());
      } else if ((key === 'allow' || key === 'disallow') && group.agents.length) {
        if (key === 'disallow' && !value) return;
        group.rules.push({ allow: key === 'allow', path: value });
        hasRules = true;
      }
    });
    if (group.agents.length) groups.push(group);
    var bot = String(botName || 'googlebot').toLowerCase();
    var matches = groups.filter(function (g) { return g.agents.some(function (a) { return a === bot || a === '*'; }); });
    var specificity = matches.reduce(function (best, g) {
      var s = g.agents.some(function (a) { return a === bot; }) ? 2 : 1;
      return Math.max(best, s);
    }, 0);
    matches = matches.filter(function (g) { return (g.agents.indexOf(bot) !== -1 ? 2 : (g.agents.indexOf('*') !== -1 ? 1 : 0)) === specificity; });
    var rules = [];
    matches.forEach(function (g) { rules = rules.concat(g.rules); });
    var pagePath = '/';
    try { var u = new URL(pageUrl); pagePath = u.pathname + u.search; } catch (e) {}
    var winning = null;
    rules.forEach(function (r) {
      if (!r.path) return;
      var anchored = /\$$/.test(r.path);
      var rawPattern = anchored ? r.path.slice(0, -1) : r.path;
      var pattern = rawPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + (anchored ? '$' : '.*');
      var ok = false;
      try { ok = new RegExp('^' + pattern).test(pagePath); } catch (e) {}
      if (ok && (!winning || r.path.replace(/[\*$]/g, '').length > winning.path.replace(/[\*$]/g, '').length ||
        (r.path.replace(/[\*$]/g, '').length === winning.path.replace(/[\*$]/g, '').length && r.allow))) winning = r;
    });
    return { allowed: !winning || winning.allow, matched: winning, sitemapUrls: String(text || '').split(/\r?\n/)
      .map(function (line) { var m = /^\s*sitemap\s*:\s*(\S+)/i.exec(line.replace(/#.*$/, '')); return m ? m[1] : ''; }).filter(Boolean) };
  }

  // ---------------------------------------------------------------- summary
  // A compact "what we found" readout shared by every tool's panel.
  function summarize(snap) {
    var rows = [];
    function add(label, level, text) { rows.push({ label: label, level: level, text: text }); }
    function fill(tpl, o) {
      return String(tpl || '').replace(/\{n\}/g, o.n).replace(/\{v\}/g, o.v || '').replace(/\{m\}/g, o.m)
        .replace(/\{status\}/g, o.status).replace(/\{ms\}/g, o.ms).replace(/\{bytes\}/g, o.bytes)
        .replace(/\{detail\}/g, o.detail || '');
    }

    var tl = snap.title.length;
    add('Title', tl === 0 ? 'fail' : 'pass',
      tl === 0 ? 'No <title> tag found.' : fill(V.title.pass, { n: tl }));

    var dl = snap.desc.length;
    add('Meta description', dl === 0 ? 'warn' : 'pass',
      dl === 0 ? V.desc.missing : fill(V.desc.pass, { n: dl }));

    add('Main heading', snap.h1s.length === 0 ? 'warn' : (snap.h1s.length === 1 ? 'pass' : 'warn'),
      snap.h1s.length === 0 ? V.h1.missing : fill(snap.h1s.length === 1 ? V.h1.pass : V.h1.multiple, { n: snap.h1s.length }));

    add('Canonical', !snap.canonical ? 'warn' : (snap.canonicalCount > 1 ? 'warn' : 'pass'),
      !snap.canonical ? V.canonical.missing : fill(snap.canonicalCount > 1 ? V.canonical.multiple : V.canonical.pass, { v: snap.canonical, n: snap.canonicalCount }));
    add('Open Graph', (snap.og.title || snap.og.desc) ? 'pass' : 'none', (snap.og.title || snap.og.desc) ? V.og.pass : V.og.none);
    add('Robots meta/header', /noindex/i.test(snap.robots) ? 'fail' : 'pass', /noindex/i.test(snap.robots) ? fill(V.robots.fail, { v: snap.robots }) : V.robots.pass);
    add('Images', snap.images.total === 0 ? 'none' : (snap.images.missingAlt === 0 ? 'pass' : 'warn'),
      snap.images.total === 0 ? 'No content images; alt text is not applicable.' : (snap.images.missingAlt === 0 ? fill(V.images.pass, { n: snap.images.total }) : fill(V.images.warn, { n: snap.images.total, m: snap.images.missingAlt })));
    add('Language', snap.lang ? 'pass' : 'warn', snap.lang ? fill(V.lang.pass, { v: snap.lang }) : V.lang.fail);
    add('Mobile viewport', snap.viewport ? 'pass' : 'warn', snap.viewport ? V.viewport.pass : V.viewport.fail);
    add('Content length', 'none', fill(V.words.info, { n: snap.words }));
    if (snap.schemaTypes.length) add('Structured data', 'pass', 'Schema found: ' + snap.schemaTypes.join(', '));
    if (snap.hreflangs.length) add('Hreflang', 'pass', snap.hreflangs.length + ' hreflang annotations.');

    return rows;
  }

  // ---------------------------------------------------------------- per-tool apply
  // How each tool turns a snapshot into pre-filled, personalized inputs.
  function setVal(root, id, val) {
    var el = root.querySelector('#' + id);
    if (!el) return false;
    el.value = val == null ? '' : val;
    // notify the tool so it recomputes its output for THIS user's page
    var ev = document.createEvent('Event');
    ev.initEvent('input', true, true);
    el.dispatchEvent(ev);
    return true;
  }
  function origin(u) { try { return new URL(u).origin; } catch (e) { return ''; } }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }

  var APPLY = {
    'meta-tag-generator': function (snap, root) {
      setVal(root, 'mt-title', snap.title);
      setVal(root, 'mt-desc', snap.desc);
      if (snap.canonical) setVal(root, 'mt-canonical', snap.canonical);
    },
    'open-graph-generator': function (snap, root) {
      setVal(root, 'og-url', snap.og.url || snap.url);
      setVal(root, 'og-title', snap.og.title || snap.title);
      setVal(root, 'og-desc', snap.og.desc || snap.desc);
      if (snap.og.image) setVal(root, 'og-image', snap.og.image);
    },
    'twitter-card-generator': function (snap, root) {
      setVal(root, 'tw-url', snap.url);
      setVal(root, 'tw-title', snap.twitter.title || snap.og.title || snap.title);
      setVal(root, 'tw-desc', snap.twitter.desc || snap.og.desc || snap.desc);
      var img = snap.twitter.image || snap.og.image;
      if (img) setVal(root, 'tw-image', img);
    },
    'canonical-tag-generator': function (snap, root) {
      setVal(root, 'cn-url', snap.canonical || snap.url);
    },
    'serp-preview-tool': function (snap, root) {
      setVal(root, 'sp-url', snap.url);
      setVal(root, 'sp-title', snap.title);
      setVal(root, 'sp-desc', snap.desc);
    },
    'meta-description-checker': function (snap, root) {
      setVal(root, 'md-text', snap.desc);
    },
    'llms-txt-generator': function (snap, root) {
      setVal(root, 'll-name', snap.og.siteName || snap.title);
      setVal(root, 'll-desc', snap.desc);
      setVal(root, 'll-url', origin(snap.url));
    },
    'url-slug-generator': function (snap, root) {
      setVal(root, 'sl-text', snap.title);
    },
    'utm-link-builder': function (snap, root) {
      setVal(root, 'ut-url', snap.url);
    },
    'keyword-density-checker': function (snap, root) {
      setVal(root, 'kd-text', snap.bodyText.slice(0, 6000));
    },
    'hashtag-generator': function (snap, root) {
      // derive a short topic from the page title (strip brand suffix after a dash/pipe)
      var t = (snap.og.title || snap.title).split(/\s+[|—–-]\s+/)[0].trim();
      setVal(root, 'hg-keyword', t.toLowerCase());
    },
    'htaccess-redirect-generator': function (snap, root) {
      setVal(root, 'ht-domain', host(snap.url));
    }
    // Tools with dynamic rows (hreflang, schema, sitemap, robots, ai-blocker, password)
    // get the analysis summary but no field pre-fill — a snapshot can't safely map onto
    // their add/remove row flows.
  };

  // ---------------------------------------------------------------- panel UI
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Tools that already own a URL input + fetch/paste flow natively (the two
  // crawler/ranking tools) — skip the generic panel so there aren't two URL boxes.
  var SKIP_PANEL = { 'web-crawler-audit': 1, 'seo-score-checker': 1 };

  function mount(root, slug) {
    if (!root || root.querySelector('.inspect')) return; // already mounted
    if (SKIP_PANEL[slug]) return;
    var panel = el('div', 'inspect');
    panel.setAttribute('data-inspect', '1');

    // head
    var head = el('div', 'inspect-head');
    head.appendChild(el('span', 'inspect-badge', '\u2726'));
    head.appendChild(el('strong', 'inspect-title', P.title || 'Analyze your own page first'));
    panel.appendChild(head);
    panel.appendChild(el('p', 'inspect-sub', P.subtitle || ''));

    // url row
    var row = el('div', 'inspect-row');
    var inp = el('input', 'inspect-url');
    inp.type = 'url';
    inp.placeholder = P.urlPlaceholder || 'https://your-site.com/your-page';
    inp.setAttribute('aria-label', P.urlLabel || 'Your page URL');
    var btn = el('button', 'btn inspect-run', P.analyzeBtn || 'Analyze my page');
    btn.type = 'button';
    row.appendChild(inp);
    row.appendChild(btn);
    panel.appendChild(row);

    // paste disclosure
    var det = el('details', 'inspect-paste');
    det.appendChild(el('summary', null, P.orPaste || 'Paste the HTML instead'));
    var ta = el('textarea', 'inspect-ta');
    ta.rows = 4;
    ta.placeholder = P.pastePlaceholder || '';
    ta.setAttribute('aria-label', P.pasteLabel || 'Paste page HTML');
    det.appendChild(ta);
    var pbtn = el('button', 'btn btn-ghost inspect-paste-run', P.pasteBtn || 'Analyze pasted HTML');
    pbtn.type = 'button';
    det.appendChild(pbtn);
    panel.appendChild(det);

    // status + result
    var status = el('div', 'inspect-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    panel.appendChild(status);
    var result = el('div', 'inspect-result');
    result.hidden = true;
    panel.appendChild(result);

    // insert panel at the very top of the tool shell
    root.insertBefore(panel, root.firstChild);

    function analyze(html, meta) {
      var snap;
      try { snap = parse(html, meta.finalUrl || meta.url); }
      catch (e) { status.textContent = 'Could not parse that HTML.'; return; }
      if (meta.xRobotsTag) snap.robots = [snap.robots, meta.xRobotsTag].filter(Boolean).join('; ');
      if (meta.status) { snap.status = meta.status; snap.ms = meta.ms; snap.bytes = meta.bytes; }
      snap.requestedUrl = meta.url || '';
      snap.finalUrl = meta.finalUrl || meta.url || '';
      snap.contentType = meta.contentType || '';
      snap.truncated = !!meta.truncated;
      root.__t4mInspectSnap = snap;
      root.__t4mPageMeta = snap;
      var rows = summarize(snap);
      status.textContent = String(P.signals || 'Read {n} on-page signals from').replace('{n}', rows.length) + ' ' + (meta.url || 'pasted HTML') +
        (snap.status ? ' \u00b7 HTTP ' + snap.status : '') + (snap.bytes ? ' \u00b7 ' + fmtBytes(snap.bytes) : '') + '.';
      if (snap.requestedUrl && snap.finalUrl && snap.requestedUrl !== snap.finalUrl) {
        status.textContent += ' ' + String(P.redirected || 'Redirected to {url}.').replace('{url}', snap.finalUrl);
      }
      if (snap.truncated) status.textContent += ' ' + (P.truncated || 'Only part of the response was analyzed.');
      render(result, snap, slug, root, rows);
      result.hidden = false;
      var apply = APPLY[slug];
      if (apply) { try { apply(snap, root); } catch (e) {} }
      bindPersonalizedTarget(root, slug);
      refreshPersonalized(root, slug);
    }

    btn.addEventListener('click', function () {
      var u = (inp.value || '').trim();
      if (!/^https?:\/\//i.test(u)) { status.textContent = ERR.badUrl || 'Enter a full URL.'; return; }
      status.textContent = P.analyzing || 'Analyzing…';
      btn.disabled = true;
      fetchPage(u).then(function (r) {
        btn.disabled = false;
        if (r.ok) analyze(r.html, r);
        else { status.textContent = ERR.fetchFailed || 'Could not fetch that page.'; det.open = true; }
      });
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });

    pbtn.addEventListener('click', function () {
      var html = ta.value || '';
      if (!html.trim()) { status.textContent = ERR.emptyPaste || 'Paste HTML first.'; return; }
      analyze(html, { url: inp.value.trim() || '' });
    });
  }

  function render(box, snap, slug, root, rows) {
    box.textContent = '';
    rows = rows || summarize(snap);
    var list = el('ul', 'inspect-signals');
    rows.forEach(function (r) {
      var li = el('li', 'sig-' + r.level);
      li.appendChild(el('span', 'sig-dot', ''));
      var body = el('span', 'sig-body');
      body.appendChild(el('strong', null, r.label + ': '));
      body.appendChild(document.createTextNode(r.text));
      li.appendChild(body);
      list.appendChild(li);
    });
    box.appendChild(list);

    // tool-specific personalized tip
    var tip = tipFor(slug, snap);
    if (tip) {
      var t = el('div', 'inspect-tip');
      t.appendChild(el('strong', null, 'Personalized for this page: '));
      t.appendChild(document.createTextNode(tip));
      box.appendChild(t);
    }
    appendPersonalized(box, slug, snap, root);
  }

  function normalizedWords(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  }
  function phraseCount(text, phrase) {
    var hay = normalizedWords(text), needle = normalizedWords(phrase), count = 0;
    if (!hay.length || !needle.length || needle.length > hay.length) return 0;
    for (var i = 0; i <= hay.length - needle.length; i++) {
      var matches = true;
      for (var j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) { matches = false; break; }
      if (matches) count++;
    }
    return count;
  }
  function topicOverlap(a, b) {
    var stop = { a: 1, an: 1, the: 1, and: 1, or: 1, for: 1, of: 1, to: 1, in: 1, on: 1, with: 1, from: 1 };
    var aa = normalizedWords(a).filter(function (w) { return w.length > 2 && !stop[w]; });
    var bb = normalizedWords(b).filter(function (w) { return w.length > 2 && !stop[w]; });
    if (!aa.length || !bb.length) return 0;
    var aset = {}; aa.forEach(function (w) { aset[w] = 1; });
    return bb.filter(function (w) { return aset[w]; }).length / Math.max(1, Math.min(aa.length, bb.length));
  }
  function makeDescriptionDraft(snap) {
    var lead = (snap.h1s[0] || snap.title || '').replace(/\s+/g, ' ').trim();
    var text = (snap.mainText || '').replace(/\s+/g, ' ').trim();
    if (!lead || text.split(/\s+/).length < 12) return '';
    var sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    var first = '';
    for (var i = 0; i < sentences.length; i++) {
      var s = sentences[i].trim();
      if (s.split(/\s+/).length >= 7 && s.toLowerCase() !== lead.toLowerCase()) { first = s; break; }
    }
    var candidate = (lead + (first ? '. ' + first : '.')).replace(/\s+/g, ' ').trim();
    if (candidate.length > 155) {
      candidate = candidate.slice(0, 155);
      var end = candidate.lastIndexOf(' ');
      if (end > 90) candidate = candidate.slice(0, end).replace(/[,:;—-]+$/, '') + '…';
    }
    return candidate;
  }
  function appendPersonalized(box, slug, snap, root) {
    if (['serp-preview-tool', 'meta-description-checker', 'keyword-density-checker'].indexOf(slug) === -1) return;
    var I = TXT.personalized || {};
    var old = box.querySelector('.inspect-personalized');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var card = el('div', 'inspect-tip inspect-personalized');
    var head = slug === 'serp-preview-tool' ? I.serpTitle : slug === 'meta-description-checker' ? I.metaTitle : I.keywordTitle;
    card.appendChild(el('strong', null, head || 'Page-specific findings'));
    card.appendChild(document.createElement('br'));
    if (slug === 'serp-preview-tool') {
      var title = (($(root, 'sp-title') || {}).value || snap.title || '').trim();
      var h1 = snap.h1s[0] || '';
      var desc = (($(root, 'sp-desc') || {}).value || snap.desc || '').trim();
      card.appendChild(document.createTextNode((I.titleLabel || 'Fetched title') + ': ' + (title || I.noTitle || 'Missing') + ' (' + title.length + ' chars). '));
      card.appendChild(document.createTextNode((I.h1Label || 'Main heading') + ': ' + (h1 || I.noH1 || 'Missing') + '. '));
      card.appendChild(document.createTextNode(h1 && title
        ? (topicOverlap(title, h1) >= 0.5 ? (I.serpAligned || '') : (I.serpMismatch || ''))
        : (I.serpNeedHeading || '')));
      card.appendChild(document.createElement('br'));
      card.appendChild(document.createTextNode((I.descLabel || 'Meta description') + ': ' + (desc ? desc.length + ' chars. The preview is a width estimate, not a prediction of Google’s chosen snippet.' : (I.noDesc || 'No description found.'))));
      var serpQuery = (($(root, 'sp-query') || {}).value || '').trim();
      if (serpQuery) {
        var serpLocations = [title, h1, desc, snap.mainText].filter(function (x) { return phraseCount(x, serpQuery) > 0; }).length;
        card.appendChild(document.createElement('br'));
        card.appendChild(document.createTextNode(String(I.queryFound || 'Phrase appears in {n} locations.').replace('{n}', serpLocations)));
      }
    } else if (slug === 'meta-description-checker') {
      var currentDesc = (($(root, 'md-text') || {}).value || '').trim();
      card.appendChild(document.createTextNode((I.titleLabel || 'Title') + ': ' + (snap.title || I.noTitle || 'Missing') + '. '));
      card.appendChild(document.createTextNode((I.h1Label || 'H1') + ': ' + (snap.h1s[0] || I.noH1 || 'Missing') + '. '));
      card.appendChild(document.createElement('br'));
      card.appendChild(document.createTextNode((I.descLabel || 'Description') + ': ' + (currentDesc || I.noDesc || 'Missing.')));
      var metaQuery = (($(root, 'md-query') || {}).value || '').trim();
      card.appendChild(document.createElement('br'));
      if (metaQuery) {
        var metaLocations = [snap.title, snap.h1s[0] || '', currentDesc, snap.mainText].filter(function (x) { return phraseCount(x, metaQuery) > 0; }).length;
        card.appendChild(document.createTextNode(String(I.queryFound || 'Phrase appears in {n} of 4 locations.').replace('{n}', metaLocations)));
      } else card.appendChild(document.createTextNode(I.noQuery || 'Add an optional target phrase to compare against the fetched page.'));
      var draft = makeDescriptionDraft(snap);
      if (draft) {
        var b = el('button', 'btn btn-ghost', I.draftButton || 'Draft from page');
        b.type = 'button';
        b.addEventListener('click', function () {
          var input = $(root, 'md-text'); if (!input) return;
          input.value = draft;
          var ev = document.createEvent('Event'); ev.initEvent('input', true, true); input.dispatchEvent(ev);
        });
        card.appendChild(document.createElement('br'));
        card.appendChild(b);
        card.appendChild(document.createElement('br'));
        card.appendChild(document.createTextNode(I.descriptionDraftNote || 'Review this source-based draft before publishing.'));
      } else {
        card.appendChild(document.createElement('br'));
        card.appendChild(document.createTextNode(I.noDraftSource || 'Not enough visible page text to create a grounded draft.'));
      }
    } else {
      var keyword = (($(root, 'kd-query') || {}).value || '').trim();
      var found = keyword ? phraseCount(snap.mainText, keyword) : 0;
      card.appendChild(document.createTextNode(keyword
        ? String(I.phraseCount || 'Phrase appears {n} times in {words} words.').replace('{n}', found).replace('{words}', snap.words)
        : (snap.words ? (I.noQuery || 'Add an optional target phrase to compare against this page.') : (I.noMainText || 'No visible page text was available.'))));
    }
    box.appendChild(card);
  }

  function bindPersonalizedTarget(root, slug) {
    var id = slug === 'serp-preview-tool' ? 'sp-query' : slug === 'meta-description-checker' ? 'md-query' : slug === 'keyword-density-checker' ? 'kd-query' : '';
    var input = id ? $(root, id) : null;
    if (!input || input.__t4mInspectBound) return;
    input.__t4mInspectBound = true;
    input.addEventListener('input', function () { refreshPersonalized(root, slug); });
  }
  function refreshPersonalized(root, slug) {
    var panel = root.querySelector('.inspect-result');
    var snap = root.__t4mInspectSnap;
    if (panel && snap) appendPersonalized(panel, slug, snap, root);
  }

  function tipFor(slug, snap) {
    switch (slug) {
      case 'meta-tag-generator':
        return 'We pre-filled the fields with your live title (' + snap.title.length + ' chars), description (' +
          snap.desc.length + ' chars) and canonical. Fix anything the signals above flagged, then copy the corrected tags.';
      case 'open-graph-generator':
        return (snap.og.title ? 'Your page already has og:title \u2014 we loaded it so you can improve it.' :
          'Your page has NO og:title. We drafted one from your title; add the missing Open Graph tags below.') +
          (snap.og.image ? '' : ' You are also missing og:image \u2014 the most visible social tag.');
      case 'twitter-card-generator':
        return snap.twitter.card ? 'You already have a twitter:card (' + snap.twitter.card + '). Verify and refine it below.' :
          'Your page has no Twitter card. We drafted one from your Open Graph / title tags \u2014 copy it into your <head>.';
      case 'canonical-tag-generator':
        return snap.canonical ? 'Your current canonical is ' + snap.canonical + '. Generate a corrected one if it is wrong.' :
          'Your page has NO canonical. We used your URL as the base \u2014 copy the generated tag into your <head>.';
      case 'serp-preview-tool':
        return 'The fields below were prefilled from the fetched HTML. The preview is an estimate; Google may rewrite the title or choose a different snippet for each query.';
      case 'meta-description-checker':
        return snap.desc ? 'The fetched description is loaded above. Compare it with the page heading and opening copy; Google may choose a different passage.' :
          'No description was present in the fetched HTML. Google can still generate a snippet from visible page text.';
      case 'keyword-density-checker':
        return 'Extracted about ' + snap.words + ' words from the main content area of this fetched page. Frequency counts describe the text; they are not a recommended keyword-density target.';
      case 'url-slug-generator':
        return 'We loaded your page title \u2014 generate a clean slug, or paste other titles (one per line) for bulk.';
      case 'llms-txt-generator':
        return 'We pre-filled your site name, description and domain from the page. Add your key pages below.';
      case 'utm-link-builder':
        return 'Destination pre-filled with your page URL \u2014 just add source, medium and campaign.';
      case 'htaccess-redirect-generator':
        return 'Detected domain: ' + host(snap.url) + '. Pick a mode and generate the Apache rules.';
      case 'hashtag-generator':
        return 'Derived a topic from your title. Tweak it, pick a platform, and get a tuned hashtag set.';
      case 'schema-markup-generator':
        return (snap.schemaTypes.length ? 'Your page already uses: ' + snap.schemaTypes.join(', ') + '. ' :
          'Your page has no JSON-LD schema. ') + 'Build the right type below to win rich results.';
      case 'hreflang-tag-generator':
        return snap.hreflangs.length ? 'Your page has ' + snap.hreflangs.length + ' hreflang annotations \u2014 rebuild or extend the cluster below.' :
          'Your page has no hreflang. If you serve multiple languages, build the cluster below.';
      default:
        return '';
    }
  }

  function fmtBytes(b) {
    if (!b) return '';
    return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';
  }

  window.T4M_INSPECT = {
    mount: mount,
    parse: parse,
    fetchPage: fetchPage,
    summarize: summarize,
    phraseCount: phraseCount,
    topicOverlap: topicOverlap,
    makeDescriptionDraft: makeDescriptionDraft,
    parseRobotsTxt: parseRobotsTxt
  };
})();

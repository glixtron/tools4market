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

  // ---------------------------------------------------------------- fetch
  // Layer 1: our Cloudflare Pages Function /api/fetch (CORS-free, first-party).
  // Layer 2: direct browser fetch (works only for CORS-open origins).
  // Returns { ok, html, url, finalUrl, status, ms, bytes } or { ok:false, reason }.
  function fetchPage(url) {
    if (typeof fetch !== 'function') return Promise.resolve({ ok: false, reason: 'cors' });
    var proxy = '/api/fetch?url=' + encodeURIComponent(url);
    return fetch(proxy)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.ok) {
          return { ok: true, html: j.body, url: url, finalUrl: j.finalUrl || url,
                   status: j.status, ms: j.ms, bytes: j.bytes };
        }
        return tryDirect(url);
      })
      .catch(function () { return tryDirect(url); });
  }

  function tryDirect(url) {
    return fetch(url, { mode: 'cors', credentials: 'omit' })
      .then(function (r) {
        return r.text().then(function (t) {
          return { ok: true, html: t, url: url, finalUrl: r.url || url,
                   status: r.status, ms: 0, bytes: t.length };
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

    var title = (doc.querySelector('title') ? doc.querySelector('title').textContent : '').trim();
    var desc = name('description');
    var canonEl = doc.querySelector('link[rel="canonical"]');
    var canonical = canonEl ? (canonEl.getAttribute('href') || '').trim() : '';
    // resolve relative canonical against the base URL
    if (canonical && base) { try { canonical = new URL(canonical, base).toString(); } catch (e) {} }

    var robots = name('robots') || name('googlebot');
    var langEl = doc.documentElement.getAttribute('lang');

    var h1s = texts(doc, 'h1');
    var h2s = texts(doc, 'h2');
    var h3s = texts(doc, 'h3');

    var imgs = Array.prototype.slice.call(doc.querySelectorAll('img'));
    var missingAlt = imgs.filter(function (im) {
      var a = im.getAttribute('alt');
      return a === null || a.trim() === '';
    }).length;

    var links = Array.prototype.slice.call(doc.querySelectorAll('a[href]'));
    var internal = 0, external = 0, nofollow = 0;
    var baseHost = '';
    if (base) { try { baseHost = new URL(base).host; } catch (e) {} }
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return;
      var isInternal = true;
      if (/^https?:\/\//i.test(href)) {
        try { isInternal = new URL(href).host === baseHost; } catch (e) { isInternal = false; }
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
    var clone = doc.body ? doc.body.cloneNode(true) : doc.createElement('div');
    Array.prototype.slice.call(clone.querySelectorAll('script,style,noscript')).forEach(function (n) { n.parentNode.removeChild(n); });
    var bodyText = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    var words = bodyText ? bodyText.split(' ').filter(Boolean).length : 0;

    var viewportEl = doc.querySelector('meta[name="viewport"]');

    return {
      url: base, finalUrl: base, status: 0, ms: 0, bytes: html.length,
      title: title, desc: desc, canonical: canonical, robots: robots,
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
      words: words, bodyText: bodyText
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
    add('Title', tl === 0 ? 'fail' : (tl >= 30 && tl <= 60 ? 'pass' : 'warn'),
      tl === 0 ? 'No <title> tag found.' : fill(V.title && (tl >= 30 && tl <= 60 ? V.title.pass : (tl >= 15 && tl <= 70 ? V.title.warn : V.title.fail)), { n: tl, detail: tl < 30 ? 'too short to be descriptive' : 'too long, it will be cut in results' }));

    var dl = snap.desc.length;
    add('Meta description', dl === 0 ? 'fail' : (dl >= 120 && dl <= 158 ? 'pass' : 'warn'),
      dl === 0 ? 'No meta description.' : fill(dl >= 120 && dl <= 158 ? V.desc.pass : (dl >= 70 && dl <= 200 ? V.desc.warn : V.desc.fail), { n: dl, detail: dl < 120 ? 'too short' : 'far too long, it will be cut' }));

    add('H1', snap.h1s.length === 1 ? 'pass' : (snap.h1s.length === 0 ? 'fail' : 'warn'),
      snap.h1s.length === 0 ? V.h1.fail : fill(snap.h1s.length === 1 ? V.h1.pass : V.h1.warn, { n: snap.h1s.length }));

    add('Canonical', snap.canonical ? 'pass' : 'fail', snap.canonical ? fill(V.canonical.pass, { v: snap.canonical }) : V.canonical.fail);
    add('Open Graph', (snap.og.title || snap.og.desc) ? 'pass' : 'fail', (snap.og.title || snap.og.desc) ? V.og.pass : V.og.fail);
    add('Indexable', /noindex/i.test(snap.robots) ? 'fail' : 'pass', /noindex/i.test(snap.robots) ? fill(V.robots.fail, { v: snap.robots }) : V.robots.pass);
    add('Images', snap.images.total === 0 ? 'pass' : (snap.images.missingAlt === 0 ? 'pass' : 'warn'),
      snap.images.total === 0 ? 'No images on this page.' : (snap.images.missingAlt === 0 ? fill(V.images.pass, { n: snap.images.total }) : fill(V.images.warn, { n: snap.images.total, m: snap.images.missingAlt })));
    add('Language', snap.lang ? 'pass' : 'fail', snap.lang ? fill(V.lang.pass, { v: snap.lang }) : V.lang.fail);
    add('Mobile viewport', snap.viewport ? 'pass' : 'fail', snap.viewport ? V.viewport.pass : V.viewport.fail);
    add('Content length', snap.words >= 300 ? 'pass' : (snap.words >= 100 ? 'warn' : 'fail'), fill(snap.words >= 300 ? V.words.pass : V.words.warn, { n: snap.words }));
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
      try { snap = parse(html, meta.url); }
      catch (e) { status.textContent = 'Could not parse that HTML.'; return; }
      if (meta.status) { snap.status = meta.status; snap.ms = meta.ms; snap.bytes = meta.bytes; }
      var rows = summarize(snap);
      status.textContent = String(P.signals || 'Read {n} on-page signals from').replace('{n}', rows.length) + ' ' + (meta.url || 'pasted HTML') +
        (snap.status ? ' \u00b7 HTTP ' + snap.status : '') + (snap.bytes ? ' \u00b7 ' + fmtBytes(snap.bytes) : '') + '.';
      render(result, snap, slug, root, rows);
      result.hidden = false;
      var apply = APPLY[slug];
      if (apply) { try { apply(snap, root); } catch (e) {} }
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
        return 'Below is your ACTUAL title and description as Google would show them, with live length warnings.';
      case 'meta-description-checker':
        return snap.desc ? 'We pasted your live meta description above \u2014 fix it using the verdict.' :
          'Your page has no meta description, so there is nothing to check yet. Write one below.';
      case 'keyword-density-checker':
        return 'We pulled ~' + snap.words + ' words of your visible page text. The frequency tables below are for YOUR content.';
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

  window.T4M_INSPECT = { mount: mount, parse: parse, fetchPage: fetchPage, summarize: summarize };
})();

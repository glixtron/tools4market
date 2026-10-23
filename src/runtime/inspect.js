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
  var G = TXT.gaps || {};
  var GI = G.items || {};
  var GA = G.ai || {};
  // The page last analyzed on this screen — used to re-render when the
  // visitor's consent choice changes (AI controls follow that choice).
  var ACTIVE = null;
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
    var schemaNodes = [];
    Array.prototype.slice.call(doc.querySelectorAll('script[type="application/ld+json"]')).forEach(function (s) {
      try {
        var j = JSON.parse(s.textContent);
        collectTypes(j, schemaTypes);
        collectSchemaNodes(j, schemaNodes);
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
    var mainNode = null;
    contentNodes.forEach(function (n) {
      var text = visibleText(n);
      if (text.length > mainText.length) { mainText = text; mainNode = n; }
    });
    if (!mainText) mainText = bodyText;
    var linkRoot = mainNode || doc.querySelector('main,article,[role="main"]') || doc.body;
    var mainLinks = [];
    var seenMainLinks = {};
    Array.prototype.slice.call((linkRoot || doc.createElement('div')).querySelectorAll('a[href]')).forEach(function (a) {
      if (/\bnofollow\b/i.test(a.getAttribute('rel') || '')) return;
      var href = '';
      try {
        var target = new URL(a.getAttribute('href'), base || window.location.href);
        var current = new URL(base || window.location.href);
        if ((target.protocol !== 'http:' && target.protocol !== 'https:') || target.origin !== current.origin || target.username || target.password) return;
        target.hash = '';
        // Query URLs are often tracking/filter variants and should not be seeded into a sitemap.
        if (target.search) return;
        href = target.href;
      } catch (e) { return; }
      if (!href || href === base || seenMainLinks[href]) return;
      seenMainLinks[href] = 1;
      mainLinks.push({ url: href, text: (a.textContent || '').replace(/\s+/g, ' ').trim() });
    });
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
      schemaTypes: schemaTypes, schemaNodes: schemaNodes.slice(0, 30), hreflangs: hreflangs,
      mainLinks: mainLinks.slice(0, 250),
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

  function collectSchemaNodes(node, out) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(function (n) { collectSchemaNodes(n, out); }); return; }
    if (node['@type'] && out.length < 30) out.push(node);
    if (node['@graph']) collectSchemaNodes(node['@graph'], out);
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

  function sameOriginUrl(url, base) {
    try {
      var target = new URL(url, base);
      return target.origin === new URL(base).origin && !target.username && !target.password;
    } catch (e) { return false; }
  }

  function xmlLocs(node) {
    var out = [];
    Array.prototype.slice.call(node ? node.children : []).forEach(function (child) {
      if (String(child.localName || '').toLowerCase() !== 'loc') return;
      out.push((child.textContent || '').trim());
    });
    return out.filter(Boolean);
  }

  function parseSitemap(xml, base) {
    var doc;
    try { doc = new DOMParser().parseFromString(xml, 'application/xml'); } catch (e) { return { kind: 'invalid', urls: [], children: [] }; }
    if (!doc.documentElement || doc.getElementsByTagName('parsererror').length) return { kind: 'invalid', urls: [], children: [] };
    var root = doc.documentElement;
    var kind = String(root.localName || '').toLowerCase();
    var urls = [], children = [];
    function resolveList(nodes, target) {
      Array.prototype.slice.call(nodes || []).forEach(function (node) {
        xmlLocs(node).forEach(function (raw) {
          try {
            var u = new URL(raw, base);
            if ((u.protocol !== 'http:' && u.protocol !== 'https:') || !sameOriginUrl(u.href, base)) return;
            u.hash = '';
            if (target.indexOf(u.href) === -1) target.push(u.href);
          } catch (e) {}
        });
      });
    }
    if (kind === 'sitemapindex') resolveList(root.getElementsByTagName('*'), children);
    else if (kind === 'urlset') resolveList(root.getElementsByTagName('*'), urls);
    else return { kind: 'invalid', urls: [], children: [] };
    return { kind: kind, urls: urls, children: children };
  }

  // Only sitemap-related generators fetch supporting same-origin files. The
  // visitor explicitly starts this analysis; every resource stays on that host.
  function loadRelatedContext(page, slug) {
    var robotsTools = ['robots-txt-generator', 'ai-crawler-blocker', 'sitemap-generator'];
    if (robotsTools.indexOf(slug) === -1) return Promise.resolve({});
    var pageUrl = page.finalUrl || page.url;
    var base;
    try { base = new URL(pageUrl).origin; } catch (e) { return Promise.resolve({}); }
    var robotsUrl = base + '/robots.txt';
    return fetchPage(robotsUrl, { allowText: true }).then(function (robots) {
      var validRobots = robots.ok && (!robots.contentType || /text|xml/i.test(robots.contentType)) &&
        sameOriginUrl(robots.finalUrl || robots.url, base);
      var robotsText = validRobots ? robots.html : '';
      var declared = validRobots ? parseRobotsTxt(robotsText, pageUrl).sitemapUrls.filter(function (u) { return sameOriginUrl(u, base); }) : [];
      var ruleLines = robotsText.split(/\r?\n/).filter(function (line) { return /^\s*(user-agent|allow|disallow)\s*:/i.test(line); });
      var context = {
        siteRobots: { ok: !!validRobots, url: robotsUrl, status: validRobots ? robots.status : (robots.status || 0),
          sitemapUrls: declared, ruleCount: ruleLines.length },
      };
      if (slug !== 'sitemap-generator') return context;

      var candidates = declared.length ? declared.slice(0, 2) : [base + '/sitemap.xml'];
      var inventory = { urls: [], filesFetched: 0, source: declared.length ? 'robots.txt declaration' : 'common /sitemap.xml path', found: false };
      function readMap(url, depth) {
        if (inventory.filesFetched >= 4 || !sameOriginUrl(url, base)) return Promise.resolve();
        return fetchPage(url, { allowText: true }).then(function (map) {
          if (!map.ok || !sameOriginUrl(map.finalUrl || map.url, base) || (map.contentType && !/xml|text/i.test(map.contentType))) return;
          inventory.filesFetched++;
          var parsed = parseSitemap(map.html, base);
          if (parsed.kind === 'urlset') {
            inventory.found = true;
            parsed.urls.forEach(function (u) { if (inventory.urls.length < 250 && inventory.urls.indexOf(u) === -1) inventory.urls.push(u); });
            return;
          }
          if (parsed.kind === 'sitemapindex' && depth < 1) {
            var children = parsed.children.slice(0, 3);
            return children.reduce(function (chain, childUrl) {
              return chain.then(function () { return readMap(childUrl, depth + 1); });
            }, Promise.resolve());
          }
        }).catch(function () {});
      }
      function nextCandidate(index) {
        if (index >= candidates.length || inventory.urls.length >= 250 || inventory.filesFetched >= 4) return Promise.resolve();
        return readMap(candidates[index], 0).then(function () { return nextCandidate(index + 1); });
      }
      return nextCandidate(0).then(function () {
        context.siteSitemap = inventory;
        return context;
      });
    }).catch(function () { return {}; });
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
    if (snap.mainLinks && snap.mainLinks.length) add(V.context.linksLabel, 'none', fill(V.context.links, { n: snap.mainLinks.length }));
    if (snap.siteRobots) add(V.context.robotsLabel, 'none', snap.siteRobots.ok
      ? fill(V.context.robots, { n: snap.siteRobots.ruleCount, m: snap.siteRobots.sitemapUrls.length })
      : V.context.robotsUnavailable);
    if (snap.siteSitemap) add(V.context.sitemapLabel, 'none', snap.siteSitemap.found
      ? fill(V.context.sitemap, { n: snap.siteSitemap.urls.length, m: snap.siteSitemap.filesFetched })
      : V.context.sitemapUnavailable);
    if (snap.schemaTypes.length) add('Structured data', 'pass', 'Schema found: ' + snap.schemaTypes.join(', '));
    if (snap.hreflangs.length) add('Hreflang', 'pass', snap.hreflangs.length + ' hreflang annotations.');

    return rows;
  }

  // ---------------------------------------------------------------- per-tool apply
  // How each tool turns a snapshot into pre-filled, personalized inputs.
  function setNodeValue(node, value, eventName) {
    if (!node) return false;
    node.value = value == null ? '' : String(value);
    var ev = document.createEvent('Event');
    ev.initEvent(eventName || 'input', true, true);
    node.dispatchEvent(ev);
    return true;
  }
  function setVal(root, id, val) {
    var el = root.querySelector('#' + id);
    if (!el) return false;
    return setNodeValue(el, val, 'input');
  }
  function origin(u) { try { return new URL(u).origin; } catch (e) { return ''; } }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }

  function schemaType(node) {
    if (!node || !node['@type']) return [];
    return Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
  }
  function schemaMatch(snap, names) {
    return (snap.schemaNodes || []).filter(function (node) {
      var types = schemaType(node);
      return types.some(function (type) { return names.indexOf(type) !== -1; });
    })[0] || null;
  }
  function schemaText(value) {
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (value && typeof value === 'object' && typeof value.name === 'string') return value.name;
    return '';
  }
  function schemaUrl(value) {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.length ? schemaUrl(value[0]) : '';
    if (value && typeof value === 'object') return schemaUrl(value.url || value.contentUrl || value['@id'] || '');
    return '';
  }
  function fillSchema(snap, root) {
    var candidates = [
      { key: 'article', names: ['Article', 'NewsArticle', 'BlogPosting', 'TechArticle'] },
      { key: 'product', names: ['Product'] },
      { key: 'localbusiness', names: ['LocalBusiness', 'Store', 'Restaurant', 'ProfessionalService'] },
      { key: 'organization', names: ['Organization', 'Corporation', 'EducationalOrganization', 'NGO'] },
      { key: 'breadcrumb', names: ['BreadcrumbList'] },
      { key: 'faq', names: ['FAQPage'] },
    ];
    var match = null, selected = null;
    for (var i = 0; i < candidates.length && !match; i++) {
      match = schemaMatch(snap, candidates[i].names);
      if (match) selected = candidates[i];
    }
    if (!match || !selected) return '';
    var typeSelect = root.querySelector('#sc-type');
    if (!typeSelect) return '';
    setNodeValue(typeSelect, selected.key, 'change');
    var fields = root.querySelector('#sc-fields');
    if (!fields) return '';

    if (selected.key === 'article') {
      setVal(root, 'sa-headline', schemaText(match.headline || match.name) || snap.h1s[0] || snap.title);
      var author = Array.isArray(match.author) ? match.author[0] : match.author;
      setVal(root, 'sa-author', schemaText(author));
      setVal(root, 'sa-date', String(match.datePublished || '').slice(0, 10));
      setVal(root, 'sa-image', schemaUrl(match.image));
      setVal(root, 'sa-publisher', schemaText(match.publisher));
    } else if (selected.key === 'product') {
      var offer = Array.isArray(match.offers) ? match.offers[0] : match.offers;
      setVal(root, 'sp-name', schemaText(match.name));
      setVal(root, 'sp-image', schemaUrl(match.image));
      setVal(root, 'sp-desc', schemaText(match.description));
      setVal(root, 'sp-brand', schemaText(match.brand));
      if (offer && typeof offer === 'object') {
        setVal(root, 'sp-price', schemaText(offer.price));
        var currency = fields.querySelector('#sp-currency');
        if (currency && ['USD', 'EUR', 'GBP', 'INR'].indexOf(String(offer.priceCurrency || '').toUpperCase()) !== -1) setNodeValue(currency, String(offer.priceCurrency).toUpperCase(), 'change');
        var avail = fields.querySelector('#sp-avail');
        if (avail && offer.availability) {
          var value = String(offer.availability).replace(/^https?:\/\/schema\.org\//i, 'https://schema.org/');
          if (Array.prototype.some.call(avail.options, function (opt) { return opt.value === value; })) setNodeValue(avail, value, 'change');
        }
      }
    } else if (selected.key === 'localbusiness') {
      var address = match.address || {};
      setVal(root, 'sl-name', schemaText(match.name));
      setVal(root, 'sl-url', schemaUrl(match.url));
      setVal(root, 'sl-phone', schemaText(match.telephone));
      setVal(root, 'sl-street', schemaText(address.streetAddress));
      setVal(root, 'sl-city', schemaText(address.addressLocality));
      setVal(root, 'sl-region', schemaText(address.addressRegion));
      setVal(root, 'sl-postal', schemaText(address.postalCode));
      setVal(root, 'sl-country', schemaText(address.addressCountry));
    } else if (selected.key === 'organization') {
      var sameAs = Array.isArray(match.sameAs) ? match.sameAs : (match.sameAs ? [match.sameAs] : []);
      setVal(root, 'so-name', schemaText(match.name));
      setVal(root, 'so-url', schemaUrl(match.url) || snap.url);
      setVal(root, 'so-logo', schemaUrl(match.logo));
      setVal(root, 'so-sameas', sameAs.map(schemaText).filter(Boolean).join(', '));
    } else if (selected.key === 'breadcrumb') {
      var items = Array.isArray(match.itemListElement) ? match.itemListElement : [];
      var rows = fields.querySelectorAll('#sc-bc-rows .dyn-row');
      while (rows.length < items.length) {
        var add = fields.querySelector('[data-add="bc"]');
        if (!add) break;
        add.click();
        rows = fields.querySelectorAll('#sc-bc-rows .dyn-row');
      }
      Array.prototype.forEach.call(rows, function (row, index) {
        var item = items[index];
        if (!item) return;
        setNodeValue(row.querySelector('.bc-name'), schemaText(item.name), 'input');
        setNodeValue(row.querySelector('.bc-url'), schemaUrl(item.item), 'input');
      });
    } else if (selected.key === 'faq') {
      var questions = Array.isArray(match.mainEntity) ? match.mainEntity : [];
      var faqRows = fields.querySelectorAll('#sc-faq-rows .dyn-row');
      while (faqRows.length < questions.length) {
        var addFaq = fields.querySelector('[data-add="faq"]');
        if (!addFaq) break;
        addFaq.click();
        faqRows = fields.querySelectorAll('#sc-faq-rows .dyn-row');
      }
      Array.prototype.forEach.call(faqRows, function (row, index) {
        var item = questions[index];
        if (!item) return;
        var answer = item.acceptedAnswer && (item.acceptedAnswer.text || item.acceptedAnswer);
        setNodeValue(row.querySelector('.sc-q'), schemaText(item.name), 'input');
        setNodeValue(row.querySelector('.sc-a'), schemaText(answer), 'input');
      });
    }
    return schemaType(match)[0] || selected.key;
  }

  function fillHreflang(snap, root) {
    if (!snap.hreflangs || !snap.hreflangs.length) return;
    var rows = root.querySelectorAll('#hf-rows .hf-row');
    var add = root.querySelector('[data-add="hf"]');
    var normal = snap.hreflangs.filter(function (item) { return String(item.lang || '').toLowerCase() !== 'x-default'; });
    var xdefault = snap.hreflangs.filter(function (item) { return String(item.lang || '').toLowerCase() === 'x-default'; })[0];
    while (rows.length < normal.length && add) { add.click(); rows = root.querySelectorAll('#hf-rows .hf-row'); }
    Array.prototype.forEach.call(rows, function (row, index) {
      var item = normal[index];
      if (!item) return;
      var parts = String(item.lang || '').split('-');
      setNodeValue(row.querySelector('.hf-lang'), parts.length === 2 ? parts[0] : String(item.lang || ''), 'input');
      setNodeValue(row.querySelector('.hf-region'), parts.length === 2 ? parts[1] : '', 'input');
      setNodeValue(row.querySelector('.hf-url'), item.href, 'input');
    });
    if (xdefault) setVal(root, 'hf-xdefault', xdefault.href);
  }

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
    'hreflang-tag-generator': function (snap, root) {
      fillHreflang(snap, root);
    },
    'schema-markup-generator': function (snap, root) {
      fillSchema(snap, root);
    },
    'robots-txt-generator': function (snap, root) {
      var declared = snap.siteRobots && snap.siteRobots.sitemapUrls || [];
      if (declared.length) setVal(root, 'rb-sitemap', declared[0]);
    },
    'ai-crawler-blocker': function (snap, root) {
      var declared = snap.siteRobots && snap.siteRobots.sitemapUrls || [];
      if (declared.length) setVal(root, 'ab-sitemap', declared[0]);
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
      setVal(root, 'll-pages', (snap.mainLinks || []).slice(0, 20).map(function (link) {
        return link.url + (link.text ? ' | ' + link.text : '');
      }).join('\n'));
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
    'sitemap-validator': function (snap, root) {
      if (snap.raw && (/\bxml\b/i.test(snap.contentType || '') || /\.xml$/i.test(String(snap.finalUrl || snap.url || '').split(/[?#]/)[0]))) {
        setVal(root, 'sv-xml', snap.raw);
      }
    },
    'robots-txt-tester': function (snap, root) {
      if (snap.raw && (/text\/plain/i.test(snap.contentType || '') || /\.txt$/i.test(String(snap.finalUrl || snap.url || '').split(/[?#]/)[0]))) {
        setVal(root, 'rt-robots', snap.raw);
      }
    },
    'og-image-tester': function (snap, root) {
      var img = (snap.og && snap.og.image) || (snap.twitter && snap.twitter.image) || '';
      if (img) setVal(root, 'ogit-url', img);
    },
    'hreflang-checker': function (snap, root) {
      if (snap.canonical || snap.url) setVal(root, 'hlc-self', snap.canonical || snap.url);
      var tags = (snap.hreflangs || []).map(function (h) {
        return '<link rel="alternate" hreflang="' + h.lang + '" href="' + h.href + '">';
      });
      if (tags.length) setVal(root, 'hlc-src', tags.join('\n'));
    },
    'case-converter': function (snap, root) {
      setVal(root, 'cc-text', snap.h1s[0] || snap.title);
    },
    'duplicate-line-remover': function (snap, root) {
      setVal(root, 'dl-lines', snap.h1s.concat(snap.h2s, snap.h3s).join('\n'));
    },
    'reading-time-calculator': function (snap, root) {
      setVal(root, 'rt-text', snap.mainText.slice(0, 20000));
    },
    'hashtag-generator': function (snap, root) {
      // derive a short topic from the page title (strip brand suffix after a dash/pipe)
      var t = (snap.og.title || snap.title).split(/\s+[|—–-]\s+/)[0].trim();
      setVal(root, 'hg-keyword', t.toLowerCase());
    },
    'htaccess-redirect-generator': function (snap, root) {
      setVal(root, 'ht-domain', host(snap.url));
    },
    'sitemap-generator': function (snap, root) {
      var urls = snap.siteSitemap && snap.siteSitemap.found ? snap.siteSitemap.urls : [];
      if (!urls.length) {
        urls = [snap.canonical || snap.finalUrl || snap.url].filter(Boolean).concat((snap.mainLinks || []).map(function (link) { return link.url; }));
      }
      setVal(root, 'sm-urls', urls.filter(function (url, index, all) { return all.indexOf(url) === index; }).slice(0, 250).join('\n'));
    },
    'url-encoder-decoder': function (snap, root) {
      setVal(root, 'ue-text', snap.finalUrl || snap.url);
    },
    'user-agent-parser': function (snap, root) {
      setVal(root, 'ua-text', navigator.userAgent);
    },
    // The audit tools analyze the URL in the shared panel, then render their
    // own report from the same snapshot (root.__t4mAuditFromSnapshot) — the
    // native URL row is only shown in manual mode.
    'web-crawler-audit': function (snap, root) {
      setVal(root, 'ca-url', snap.finalUrl || snap.url);
    },
    'seo-score-checker': function (snap, root) {
      setVal(root, 'sc2-url', snap.finalUrl || snap.url);
    }
  };

  // ---------------------------------------------------------------- panel UI
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Page analysis belongs on tools that can use page evidence. The two audit
  // tools used to skip the panel — they now share it (their native URL row and
  // paste block are shown only in "Enter manually" mode). Keep it off
  // independent utilities so it does not distract from unrelated local input.
  var SKIP_PANEL = {
    'password-generator': 1,
    'base64-encoder-decoder': 1,
    'uuid-generator': 1,
    'jwt-decoder': 1,
    'ics-calendar-generator': 1,
    'lorem-ipsum-generator': 1,
    'user-agent-parser': 1,
    'image-compressor': 1,
    'json-validator': 1,
    'roi-calculator': 1,
    'roas-calculator': 1,
    'cac-calculator': 1,
    'ad-metrics-calculator': 1,
    'timestamp-converter': 1,
    'ip-converter': 1,
    'email-roi-calculator': 1,
    'marketing-budget-calculator': 1,
  };

  function mount(root, slug) {
    if (!root || root.querySelector('.inspect')) return; // already mounted
    if (SKIP_PANEL[slug]) return;
    var panel = el('div', 'inspect');
    panel.setAttribute('data-inspect', '1');

    // Input-mode toggle: analyze (fetch + auto-fill, default) vs manual entry.
    // Both paths always exist one click apart; nothing is ever taken away.
    var modes = el('div', 'inspect-modes');
    modes.setAttribute('role', 'group');
    modes.setAttribute('aria-label', P.modeLabel || 'Choose how to start');
    var bA = el('button', 'mode-btn is-on', P.modeAnalyze || P.analyzeBtn || 'Analyze my page');
    bA.type = 'button';
    bA.setAttribute('aria-pressed', 'true');
    var bB = el('button', 'mode-btn', P.modeManual || 'Enter manually');
    bB.type = 'button';
    bB.setAttribute('aria-pressed', 'false');
    modes.appendChild(bA);
    modes.appendChild(bB);
    panel.appendChild(modes);

    // Everything below the toggle lives in one body we can hide for manual mode.
    var bodyWrap = el('div', 'inspect-body');
    panel.appendChild(bodyWrap);

    // head
    var head = el('div', 'inspect-head');
    head.appendChild(el('span', 'inspect-badge', '\u2726'));
    head.appendChild(el('strong', 'inspect-title', P.title || 'Analyze your own page first'));
    bodyWrap.appendChild(head);
    bodyWrap.appendChild(el('p', 'inspect-sub', P.subtitle || ''));

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
    bodyWrap.appendChild(row);

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
    bodyWrap.appendChild(det);

    // status + result
    var status = el('div', 'inspect-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    bodyWrap.appendChild(status);
    var result = el('div', 'inspect-result');
    result.hidden = true;
    bodyWrap.appendChild(result);

    // insert panel at the very top of the tool shell
    root.insertBefore(panel, root.firstChild);

    // Manual mode on the audit tools must surface their own URL row + paste
    // block (they duplicate the panel, so analyze mode hides them there).
    var manualNodes = [];
    if (slug === 'web-crawler-audit' || slug === 'seo-score-checker') {
      var nativeUrl = root.querySelector(slug === 'web-crawler-audit' ? '#ca-url' : '#sc2-url');
      if (nativeUrl && nativeUrl.parentNode && !panel.contains(nativeUrl.parentNode)) manualNodes.push(nativeUrl.parentNode);
      Array.prototype.forEach.call(root.querySelectorAll('details.inspect-paste'), function (d) {
        if (!panel.contains(d)) manualNodes.push(d);
      });
    }
    function setMode(mode) {
      var manual = mode === 'manual';
      bodyWrap.hidden = manual;
      bA.classList.toggle('is-on', !manual);
      bB.classList.toggle('is-on', manual);
      bA.setAttribute('aria-pressed', manual ? 'false' : 'true');
      bB.setAttribute('aria-pressed', manual ? 'true' : 'false');
      manualNodes.forEach(function (n) { n.hidden = manual ? false : true; });
      panel.classList.toggle('is-manual', manual);
    }
    bA.addEventListener('click', function () { setMode('analyze'); });
    bB.addEventListener('click', function () { setMode('manual'); });
    setMode('analyze');

    function analyze(html, meta) {
      var snap;
      try { snap = parse(html, meta.finalUrl || meta.url); }
      catch (e) { status.textContent = 'Could not parse that HTML.'; return; }
      if (meta.xRobotsTag) snap.robots = [snap.robots, meta.xRobotsTag].filter(Boolean).join('; ');
      if (meta.status) { snap.status = meta.status; snap.ms = meta.ms; snap.bytes = meta.bytes; }
      if (meta.siteRobots) snap.siteRobots = meta.siteRobots;
      if (meta.siteSitemap) snap.siteSitemap = meta.siteSitemap;
      // Keep the raw text of robots.txt / sitemap.xml responses (capped) so the
      // robots tester and sitemap validator can prefill from the same fetch.
      // Never used for HTML pages and never sent anywhere — see runSuggest's
      // explicit payload allow-list.
      var rawUrl = String(meta.finalUrl || meta.url || '').split(/[?#]/)[0];
      if (/\.(xml|txt)$/i.test(rawUrl) || (meta.contentType && /\bxml\b|text\/plain/i.test(meta.contentType) && !/html/i.test(meta.contentType))) {
        snap.raw = String(html).slice(0, 400000);
      }
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
      // The audit tools render their full report from THIS snapshot (one
      // fetch total — no second round trip for the same URL).
      if (typeof root.__t4mAuditFromSnapshot === 'function') {
        try { root.__t4mAuditFromSnapshot(snap); } catch (e) {}
      }
      ACTIVE = { root: root, slug: slug };
      bindPersonalizedTarget(root, slug);
      refreshPersonalized(root, slug);
    }

    btn.addEventListener('click', function () {
      var u = (inp.value || '').trim();
      if (!/^https?:\/\//i.test(u)) { status.textContent = ERR.badUrl || 'Enter a full URL.'; return; }
      status.textContent = P.analyzing || 'Analyzing…';
      btn.disabled = true;
      // robots.txt and sitemap.xml are plain text / XML resources: accept them
      // so the tester and validator tools can be prefilled from the same fetch.
      var textResource = /\.(xml|txt)(\?|#|$)/i.test(u.split(/[?#]/)[0]);
      fetchPage(u, { allowText: textResource }).then(function (r) {
        if (!r.ok) {
          btn.disabled = false;
          status.textContent = ERR.fetchFailed || 'Could not fetch that page.';
          det.open = true;
          return;
        }
        return loadRelatedContext(r, slug).then(function (related) {
          btn.disabled = false;
          analyze(r.html, Object.assign({}, r, related));
        }).catch(function () {
          btn.disabled = false;
          analyze(r.html, r);
        });
      }).catch(function () {
        btn.disabled = false;
        status.textContent = ERR.fetchFailed || 'Could not fetch that page.';
        det.open = true;
      });
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });

    pbtn.addEventListener('click', function () {
      var html = ta.value || '';
      if (!html.trim()) { status.textContent = ERR.emptyPaste || 'Paste HTML first.'; return; }
      analyze(html, { url: inp.value.trim() || '' });
    });
  }

  // ---------------------------------------------------------------- gaps
  // Deterministic "What to add to this page" — the honest, always-on layer
  // that works with no AI and no network. Each tool gets the items that match
  // its concern; fixable items can additionally be drafted with AI
  // (POST /api/suggest, consent-gated) via the button rendered underneath.
  var GAP_TOOLS = {
    'meta-description-checker': 1, 'meta-tag-generator': 1, 'serp-preview-tool': 1,
    'open-graph-generator': 1, 'twitter-card-generator': 1, 'canonical-tag-generator': 1,
    'hreflang-tag-generator': 1, 'schema-markup-generator': 1, 'robots-txt-generator': 1,
    'ai-crawler-blocker': 1, 'llms-txt-generator': 1, 'sitemap-generator': 1,
    'keyword-density-checker': 1
  };
  // Whole-page copy tools also get the shared page-level items
  // (noindex / viewport / lang) — they are what those tools exist to fix.
  var PAGE_LEVEL_GAPS = {
    'meta-description-checker': 1, 'meta-tag-generator': 1, 'serp-preview-tool': 1,
    'keyword-density-checker': 1
  };
  var SCHEMA_SUPPORTED = ['Article', 'NewsArticle', 'BlogPosting', 'TechArticle', 'Product',
    'LocalBusiness', 'Store', 'Restaurant', 'ProfessionalService', 'Organization',
    'Corporation', 'EducationalOrganization', 'NGO', 'BreadcrumbList', 'FAQPage'];

  function gapFill(tpl, o) {
    return String(tpl || '')
      .replace(/\{n\}/g, o.n == null ? '' : o.n)
      .replace(/\{m\}/g, o.m == null ? '' : o.m)
      .replace(/\{v\}/g, o.v == null ? '' : o.v)
      .replace(/\{types\}/g, o.types || '');
  }
  function gapPush(items, level, text, fix) {
    if (text) items.push({ level: level, text: text, fix: fix || null });
  }

  function recommend(snap, slug) {
    if (!GAP_TOOLS[slug]) return null;
    var out = [];
    var tl = snap.title.length, dl = snap.desc.length;
    switch (slug) {
      case 'meta-description-checker':
        if (!dl) gapPush(out, 'fail', GI.descMissing, { kind: 'description', field: 'md-text' });
        else if (dl < 70) gapPush(out, 'warn', gapFill(GI.descShort, { n: dl }), { kind: 'description', field: 'md-text' });
        else if (dl > 160) gapPush(out, 'warn', gapFill(GI.descLong, { n: dl }), { kind: 'description', field: 'md-text' });
        if (!snap.h1s.length) gapPush(out, 'warn', GI.h1Missing);
        break;
      case 'meta-tag-generator':
        if (!tl) gapPush(out, 'fail', GI.titleMissing, { kind: 'title', field: 'mt-title' });
        else if (tl > 70) gapPush(out, 'warn', gapFill(GI.titleLong, { n: tl }), { kind: 'title', field: 'mt-title' });
        else if (tl < 20) gapPush(out, 'warn', gapFill(GI.titleShort, { n: tl }), { kind: 'title', field: 'mt-title' });
        if (!dl) gapPush(out, 'warn', GI.descMissing, { kind: 'description', field: 'mt-desc' });
        else if (dl > 160) gapPush(out, 'warn', gapFill(GI.descLong, { n: dl }), { kind: 'description', field: 'mt-desc' });
        if (!snap.canonical) gapPush(out, 'info', GI.canonicalMissing);
        break;
      case 'serp-preview-tool':
        if (!tl) gapPush(out, 'fail', GI.titleMissing, { kind: 'title', field: 'sp-title' });
        else if (tl > 70) gapPush(out, 'warn', gapFill(GI.titleLong, { n: tl }), { kind: 'title', field: 'sp-title' });
        if (!dl) gapPush(out, 'warn', GI.descMissing, { kind: 'description', field: 'sp-desc' });
        else if (dl > 160) gapPush(out, 'warn', gapFill(GI.descLong, { n: dl }), { kind: 'description', field: 'sp-desc' });
        if (!snap.h1s.length) gapPush(out, 'warn', GI.h1Missing);
        break;
      case 'open-graph-generator':
        if (!snap.og.title) gapPush(out, 'warn', GI.ogTitleMissing, { kind: 'title', field: 'og-title' });
        if (!snap.og.desc) gapPush(out, 'warn', GI.ogDescMissing, { kind: 'description', field: 'og-desc' });
        if (!snap.og.image) gapPush(out, 'info', GI.ogImageMissing);
        if (!snap.og.url) gapPush(out, 'info', GI.ogUrlMissing);
        break;
      case 'twitter-card-generator':
        if (!snap.twitter.card) gapPush(out, 'warn', GI.twCardMissing);
        if (!(snap.twitter.title || snap.og.title)) gapPush(out, 'warn', GI.twTitleMissing, { kind: 'title', field: 'tw-title' });
        if (!(snap.twitter.desc || snap.og.desc)) gapPush(out, 'warn', GI.twDescMissing, { kind: 'description', field: 'tw-desc' });
        if (!(snap.twitter.image || snap.og.image)) gapPush(out, 'info', GI.twImageMissing);
        break;
      case 'canonical-tag-generator':
        if (!snap.canonical) gapPush(out, 'info', GI.canonicalMissing);
        else if (snap.canonicalCount > 1) gapPush(out, 'fail', gapFill(GI.canonicalMultiple, { n: snap.canonicalCount }));
        else if (/^https?:\/\//i.test(snap.canonical) &&
          snap.canonical.replace(/\/+$/, '') !== String(snap.finalUrl || snap.url || '').replace(/\/+$/, '')) {
          gapPush(out, 'warn', gapFill(GI.canonicalMismatch, { v: snap.canonical }));
        }
        break;
      case 'hreflang-tag-generator':
        if (!snap.hreflangs.length) {
          gapPush(out, 'info', GI.hreflangMissing);
        } else {
          var badLang = snap.hreflangs.filter(function (h) {
            var l = String(h.lang || '');
            return l.toLowerCase() !== 'x-default' && !/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i.test(l);
          })[0];
          if (badLang) gapPush(out, 'warn', gapFill(GI.hreflangInvalid, { v: badLang.lang }));
        }
        break;
      case 'schema-markup-generator':
        if (!snap.schemaTypes.length) {
          gapPush(out, 'info', GI.schemaMissing);
        } else {
          var supportedType = snap.schemaTypes.filter(function (t) { return SCHEMA_SUPPORTED.indexOf(t) !== -1; })[0];
          if (!supportedType) gapPush(out, 'info', gapFill(GI.schemaUnsupported, { types: snap.schemaTypes.slice(0, 4).join(', ') }));
        }
        break;
      case 'robots-txt-generator':
      case 'ai-crawler-blocker':
        if (/noindex/i.test(snap.robots)) gapPush(out, 'fail', GI.noindex);
        if (snap.siteRobots && snap.siteRobots.ok) {
          if (!snap.siteRobots.sitemapUrls.length) gapPush(out, 'warn', GI.robotsNoSitemap);
        } else gapPush(out, 'info', GI.robotsTxtMissing);
        break;
      case 'llms-txt-generator':
        if (!(snap.mainLinks || []).length) gapPush(out, 'warn', GI.llmsNoPages);
        if (!dl) gapPush(out, 'info', GI.descMissing);
        break;
      case 'sitemap-generator':
        if (!(snap.siteSitemap && snap.siteSitemap.found)) gapPush(out, 'warn', GI.sitemapMissing);
        if (snap.siteRobots && snap.siteRobots.ok && !snap.siteRobots.sitemapUrls.length) gapPush(out, 'warn', GI.robotsNoSitemap);
        if (!snap.canonical) gapPush(out, 'info', GI.canonicalMissing);
        break;
      case 'keyword-density-checker':
        if (snap.words && snap.words < 250) gapPush(out, 'warn', gapFill(GI.thinContent, { n: snap.words }));
        if (!snap.h2s.length && !snap.h3s.length) gapPush(out, 'warn', GI.noSubheads);
        if (snap.images.missingAlt) gapPush(out, 'info', gapFill(GI.imagesAlt, { n: snap.images.total, m: snap.images.missingAlt }));
        break;
    }
    if (PAGE_LEVEL_GAPS[slug]) {
      if (/noindex/i.test(snap.robots)) gapPush(out, 'fail', GI.noindex);
      if (!snap.viewport) gapPush(out, 'warn', GI.viewportMissing);
      if (!snap.lang) gapPush(out, 'warn', GI.langMissing);
    }
    // Prioritized: fail > warn > info; a stable index tiebreak keeps the
    // tool-specific items ahead of shared page-level ones inside each level.
    var order = { fail: 0, warn: 1, info: 2 };
    out = out.map(function (it, i) { return { it: it, i: i }; })
      .sort(function (a, b) { return (order[a.it.level] - order[b.it.level]) || (a.i - b.i); })
      .map(function (x) { return x.it; });
    return out.slice(0, 6);
  }

  function consentGranted() {
    return !!(window.T4M_CONSENT && typeof window.T4M_CONSENT.granted === 'function' && window.T4M_CONSENT.granted());
  }

  function appendAiControl(body, item, root, slug, snap) {
    var line = el('div', 'gap-ai-row');
    if (!consentGranted()) {
      // Consent-gated: no page data leaves the browser before the visitor
      // allows processing. Offer the settings path instead of the call.
      line.appendChild(el('span', 'gap-ai-note', GA.locked || ''));
      var manage = el('button', 'btn btn-ghost gap-ai-manage', GA.manage || 'Open consent settings');
      manage.type = 'button';
      manage.addEventListener('click', function () {
        var link = document.querySelector('[data-ck-settings]');
        if (link) link.click();
      });
      line.appendChild(manage);
    } else {
      var btn = el('button', 'btn btn-ghost gap-ai', GA.label || 'Suggest a fix with AI');
      btn.type = 'button';
      btn.addEventListener('click', function () { runSuggest(btn, item, root, slug, snap); });
      line.appendChild(btn);
    }
    body.appendChild(line);
  }

  function runSuggest(btn, item, root, slug, snap) {
    if (btn.disabled) return;
    var line = btn.parentNode;
    var note = line.querySelector('.gap-ai-result');
    if (!note) { note = el('span', 'gap-ai-result'); line.appendChild(note); }
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = GA.pending || 'Drafting a suggestion…';
    var payload = {
      tool: slug,
      kind: item.fix.kind,
      issue: item.text,
      page: {
        url: snap.finalUrl || snap.url || '',
        title: snap.title || '',
        h1: (snap.h1s && snap.h1s[0]) || '',
        description: snap.desc || '',
        text: String(snap.mainText || snap.bodyText || '').slice(0, 700)
      }
    };
    function done(ok, suggestion) {
      btn.disabled = false;
      btn.textContent = label;
      if (ok && suggestion) {
        setVal(root, item.fix.field, suggestion);
        note.textContent = (GA.done || '') + ' ' + (GA.disclaimer || '');
        if (window.T4M_TRACK) window.T4M_TRACK('ai_suggest', { tool_slug: slug, fix_kind: item.fix.kind });
      } else {
        note.textContent = GA.failed || '';
      }
    }
    fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); })
      .then(function (j) { done(!!(j && j.ok && j.suggestion), j && j.suggestion); })
      .catch(function () { done(false); });
  }

  function appendGaps(box, slug, snap, root) {
    var items = recommend(snap, slug);
    if (!items) return;
    var wrap = el('div', 'gap-block');
    wrap.appendChild(el('p', 'gap-head', G.title || 'What to add to this page'));
    if (!items.length) {
      wrap.appendChild(el('p', 'gap-empty', G.empty || ''));
    } else {
      var list = el('ul', 'gap-list');
      items.forEach(function (item) {
        var li = el('li', 'gap-item sig-' + item.level);
        li.appendChild(el('span', 'sig-dot', ''));
        var body = el('span', 'sig-body');
        body.appendChild(document.createTextNode(item.text));
        if (item.fix) appendAiControl(body, item, root, slug, snap);
        li.appendChild(body);
        list.appendChild(li);
      });
      wrap.appendChild(list);
    }
    box.appendChild(wrap);
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

    // the actionable "what to add" layer, straight after the signal readout
    appendGaps(box, slug, snap, root);

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
    var tips = ((TXT.personalized || {}).tips) || {};
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
      case 'robots-txt-generator':
      case 'ai-crawler-blocker':
        return snap.siteRobots && snap.siteRobots.ok
          ? tips.robots.replace('{url}', snap.siteRobots.url)
          : tips.robotsUnavailable;
      case 'url-slug-generator':
        return 'We loaded your page title \u2014 generate a clean slug, or paste other titles (one per line) for bulk.';
      case 'llms-txt-generator':
        return tips.llms;
      case 'sitemap-generator':
        return snap.siteSitemap && snap.siteSitemap.found
          ? tips.sitemapImported
          : tips.sitemapSeeded;
      case 'sitemap-validator':
        return tips.sitemapCheck;
      case 'robots-txt-tester':
        return tips.robotsCheck;
      case 'og-image-tester':
        return tips.ogImage;
      case 'hreflang-checker':
        return tips.hreflangCheck;
      case 'utm-link-builder':
        return 'Destination pre-filled with your page URL \u2014 just add source, medium and campaign.';
      case 'htaccess-redirect-generator':
        return 'Detected domain: ' + host(snap.url) + '. Pick a mode and generate the Apache rules.';
      case 'hashtag-generator':
        return 'Derived a topic from your title. Tweak it, pick a platform, and get a tuned hashtag set.';
      case 'schema-markup-generator':
        var supported = schemaMatch(snap, ['Article', 'NewsArticle', 'BlogPosting', 'TechArticle', 'Product', 'LocalBusiness', 'Store', 'Restaurant', 'ProfessionalService', 'Organization', 'Corporation', 'EducationalOrganization', 'NGO', 'BreadcrumbList', 'FAQPage']);
        if (supported) return tips.schemaExisting.replace('{type}', schemaType(supported)[0]);
        if (snap.schemaTypes.length) return tips.schemaUnsupported.replace('{types}', snap.schemaTypes.join(', '));
        return tips.schemaEmpty;
      case 'hreflang-tag-generator':
        return snap.hreflangs.length
          ? tips.hreflangLoaded
          : tips.hreflangMissing;
      case 'case-converter':
        return tips.case;
      case 'duplicate-line-remover':
        return tips.duplicates;
      case 'reading-time-calculator':
        return tips.reading;
      case 'url-encoder-decoder':
        return tips.urlEncode;
      case 'user-agent-parser':
        return tips.userAgent;
      default:
        return '';
    }
  }

  function fmtBytes(b) {
    if (!b) return '';
    return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';
  }

  // The visitor can flip consent at any time (banner or the footer's "Cookie
  // settings"). Re-render the current analysis so AI controls appear/disappear
  // with that choice without needing a fresh fetch.
  document.addEventListener('t4m:consent', function () {
    if (!ACTIVE) return;
    var snap = ACTIVE.root.__t4mInspectSnap;
    var box = ACTIVE.root.querySelector('.inspect-result');
    if (snap && box) render(box, snap, ACTIVE.slug, ACTIVE.root);
  });

  window.T4M_INSPECT = {
    mount: mount,
    parse: parse,
    fetchPage: fetchPage,
    summarize: summarize,
    phraseCount: phraseCount,
    topicOverlap: topicOverlap,
    makeDescriptionDraft: makeDescriptionDraft,
    parseRobotsTxt: parseRobotsTxt,
    recommend: recommend
  };
})();

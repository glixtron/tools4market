// Tools4Market — runtime logic: SEO & Meta tools (classic script, no modules)
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};
  var TXT = window.T4M_ISTR || {};
  var TOOLTXT = TXT.tools || {};

  function $(root, id) { return root.querySelector('#' + id); }

  function displayUrl(u) {
    try {
      var x = new URL(u);
      return x.hostname.replace(/^www\./, '') + (x.pathname === '/' ? '' : x.pathname);
    } catch (e) { return 'example.com'; }
  }

  // escape values interpolated into generated HTML attribute/text contexts
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var measureCanvas = document.createElement('canvas');
  var measureCtx = null;
  try { measureCtx = measureCanvas.getContext ? measureCanvas.getContext('2d') : null; } catch (e) { measureCtx = null; }
  function pxWidth(text, font) {
    try {
      if (measureCtx) { measureCtx.font = font; return Math.round(measureCtx.measureText(text || '').width); }
    } catch (e) { /* fall through to estimate */ }
    return Math.round((text || '').length * 8); // width estimate when canvas is unavailable
  }

  // Append build-time constant HTML via DOMParser (rules.md §3: never innerHTML-family APIs).
  function appendHtml(target, html) {
    var doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
    var frag = document.createDocumentFragment();
    while (doc.body.firstChild) frag.appendChild(doc.body.firstChild);
    target.appendChild(frag);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function chip(kind, text) { return el('span', 'chip ' + kind, text); }
  function stat(root, id) { var n = $(root, id); n.textContent = ''; return n; }

  // ---------------------------------------------------------- meta tag generator
  T['meta-tag-generator'] = function (root) {
    var out = $(root, 'mt-out');
    function update() {
      var g = function (id) { return $(root, id); };
      var title = g('mt-title').value.trim();
      var desc = g('mt-desc').value.trim();
      var can = g('mt-canonical').value.trim();
      var author = g('mt-author').value.trim();
      var robots = g('mt-robots').value;
      var lines = [];
      if (g('mt-charset').checked) lines.push('<meta charset="UTF-8">');
      if (g('mt-viewport').checked) lines.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
      if (title) lines.push('<title>' + esc(title) + '</title>');
      if (desc) lines.push('<meta name="description" content="' + esc(desc) + '">');
      if (robots) lines.push('<meta name="robots" content="' + robots + '">');
      if (author) lines.push('<meta name="author" content="' + esc(author) + '">');
      if (can) lines.push('<link rel="canonical" href="' + esc(can) + '">');
      if (g('mt-og').checked && (title || desc || can)) {
        if (can) lines.push('<meta property="og:url" content="' + esc(can) + '">');
        if (title) lines.push('<meta property="og:title" content="' + esc(title) + '">');
        if (desc) lines.push('<meta property="og:description" content="' + esc(desc) + '">');
        lines.push('<meta property="og:type" content="website">');
      }
      out.textContent = lines.join('\n') || 'Fill in the fields above to generate your meta tags.';
      g('mt-prev-title').textContent = title || 'Your page title appears here';
      g('mt-prev-desc').textContent = desc || 'Your meta description appears here…';
      g('mt-prev-url').textContent = can ? displayUrl(can) : 'example.com';
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- open graph generator
  T['open-graph-generator'] = function (root) {
    var out = $(root, 'og-out');
    function update() {
      var g = function (id) { return $(root, id); };
      var url = g('og-url').value.trim();
      var title = g('og-title').value.trim();
      var desc = g('og-desc').value.trim();
      var image = g('og-image').value.trim();
      var type = g('og-type').value;
      var site = g('og-site').value.trim();
      var lines = [];
      if (url) lines.push('<meta property="og:url" content="' + esc(url) + '">');
      if (type) lines.push('<meta property="og:type" content="' + type + '">');
      if (site) lines.push('<meta property="og:site_name" content="' + esc(site) + '">');
      if (title) lines.push('<meta property="og:title" content="' + esc(title) + '">');
      if (desc) lines.push('<meta property="og:description" content="' + esc(desc) + '">');
      if (image) lines.push('<meta property="og:image" content="' + esc(image) + '">');
      lines.push('<meta property="og:locale" content="en_US">');
      out.textContent = lines.length ? lines.join('\n') : 'Fill in the fields above to generate your Open Graph tags.';
      var prevTitle = g('og-prev-title'), prevDesc = g('og-prev-desc'), prevImg = g('og-prev-img'), prevDomain = g('og-prev-domain');
      prevTitle.textContent = title || 'Your title appears here';
      prevDesc.textContent = desc || 'Your description appears here…';
      prevDomain.textContent = url ? displayUrl(url) : 'example.com';
      if (image) {
        prevImg.style.backgroundImage = 'url("' + image.replace(/"/g, '%22') + '")';
        prevImg.textContent = '';
      } else {
        prevImg.style.backgroundImage = 'none';
        prevImg.textContent = 'Image preview appears here';
      }
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- twitter card generator
  T['twitter-card-generator'] = function (root) {
    var out = $(root, 'tw-out');
    function update() {
      var g = function (id) { return $(root, id); };
      var card = g('tw-card').value;
      var site = g('tw-site').value.trim();
      var creator = g('tw-creator').value.trim();
      var title = g('tw-title').value.trim();
      var desc = g('tw-desc').value.trim();
      var image = g('tw-image').value.trim();
      var lines = ['<meta name="twitter:card" content="' + card + '">'];
      if (site) lines.push('<meta name="twitter:site" content="' + esc(site) + '">');
      if (creator) lines.push('<meta name="twitter:creator" content="' + esc(creator) + '">');
      if (title) lines.push('<meta name="twitter:title" content="' + esc(title) + '">');
      if (desc) lines.push('<meta name="twitter:description" content="' + esc(desc) + '">');
      if (image) lines.push('<meta name="twitter:image" content="' + esc(image) + '">');
      out.textContent = lines.join('\n');
      g('tw-prev-title').textContent = title || 'Your title appears here';
      g('tw-prev-desc').textContent = desc || 'Your description appears here…';
      var img = g('tw-prev-img');
      if (image) {
        img.style.backgroundImage = 'url("' + image.replace(/"/g, '%22') + '")';
        img.textContent = '';
      } else {
        img.style.backgroundImage = 'none';
        img.textContent = 'Image preview appears here';
      }
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- canonical tag generator
  T['canonical-tag-generator'] = function (root) {
    var out = $(root, 'cn-out');
    function update() {
      var url = $(root, 'cn-url').value.trim();
      out.textContent = url
        ? '<link rel="canonical" href="' + esc(url) + '">'
        : 'Paste the canonical URL above to generate the tag.';
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- hreflang generator
  T['hreflang-tag-generator'] = function (root) {
    var rows = $(root, 'hf-rows');
    var out = $(root, 'hf-out');

    function makeRow(lang, region, url) {
      var div = el('div', 'dyn-row hf-row');
      var i1 = el('input'); i1.type = 'text'; i1.className = 'hf-lang'; i1.placeholder = 'en'; i1.setAttribute('aria-label', 'Language code (ISO 639-1)');
      i1.value = lang || '';
      var i2 = el('input'); i2.type = 'text'; i2.className = 'hf-region dyn-region'; i2.placeholder = 'gb (optional)'; i2.setAttribute('aria-label', 'Region code (ISO 3166-1, optional)');
      i2.value = region || '';
      var i3 = el('input'); i3.type = 'url'; i3.className = 'hf-url'; i3.placeholder = 'https://example.com/en/'; i3.setAttribute('aria-label', 'URL for this language version');
      i3.value = url || '';
      var del = el('button', 'btn-icon row-del', '×'); del.type = 'button'; del.title = 'Remove row'; del.setAttribute('aria-label', 'Remove row');
      div.appendChild(i1); div.appendChild(i2); div.appendChild(i3); div.appendChild(del);
      return div;
    }

    // Start blank so users never copy fictional language URLs by accident.
    rows.appendChild(makeRow('', '', ''));

    function update() {
      var lines = [];
      Array.prototype.forEach.call(rows.querySelectorAll('.hf-row'), function (row) {
        var lang = row.querySelector('.hf-lang').value.trim().toLowerCase();
        var region = row.querySelector('.hf-region').value.trim().toLowerCase();
        var url = row.querySelector('.hf-url').value.trim();
        if (!url) return;
        var code = lang ? (lang + (region ? '-' + region : '')) : '';
        if (code) lines.push('<link rel="alternate" hreflang="' + esc(code) + '" href="' + esc(url) + '">');
      });
      var xd = $(root, 'hf-xdefault').value.trim();
      if (xd) lines.push('<link rel="alternate" hreflang="x-default" href="' + esc(xd) + '">');
      out.textContent = lines.length ? lines.join('\n') : 'Add language rows with their URLs to generate hreflang tags.';
    }

    root.addEventListener('input', update);
    root.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add="hf"]');
      if (add) { rows.appendChild(makeRow('', '', '')); rows.querySelector('.hf-row:last-child .hf-url').focus(); return; }
      var del = e.target.closest('.row-del');
      if (del) {
        var row = del.closest('.dyn-row');
        if (rows.children.length > 1) row.parentNode.removeChild(row);
        else { Array.prototype.forEach.call(row.querySelectorAll('input'), function (i) { i.value = ''; }); }
        update();
      }
    });
    update();
  };

  // ---------------------------------------------------------- schema markup generator
  T['schema-markup-generator'] = function (root) {
    var typeSel = $(root, 'sc-type');
    var fields = $(root, 'sc-fields');
    var out = $(root, 'sc-out');

    var g = function (id) { var n = fields.querySelector('#' + id); return n ? n.value.trim() : ''; };
    var gv = function (id) { var n = fields.querySelector('#' + id); return n ? n.value : ''; };

    function textField(id, label, ph) {
      return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="text" placeholder="' + ph + '"></div>';
    }
    function urlField(id, label) {
      return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="url" placeholder="https://example.com/…"></div>';
    }
    function addRowBtn(key) { return '<button type="button" class="btn btn-secondary" data-add="' + key + '">+ Add another</button>'; }
    function row(key, cells, cls) {
      var div = el('div', 'dyn-row ' + (cls || 'bc-row'));
      div.setAttribute('data-dyn', key);
      cells.forEach(function (c) { div.appendChild(c); });
      var del = el('button', 'btn-icon row-del', '×'); del.type = 'button'; del.title = 'Remove row';
      div.appendChild(del);
      return div;
    }
    function inp(placeholder, cls, label) {
      var i = el('input'); i.type = 'text'; i.className = cls; i.placeholder = placeholder; i.setAttribute('aria-label', label);
      return i;
    }

    function render(type) {
      fields.textContent = '';
      if (type === 'faq') {
        var box = el('div');
        box.className = 'field';
        var lbl = el('label'); lbl.textContent = 'Questions & answers';
        box.appendChild(lbl);
        var rowsWrap = el('div'); rowsWrap.id = 'sc-faq-rows';
        rowsWrap.appendChild(row('faq', [inp('Question', 'sc-q', 'Question'), inp('Answer', 'sc-a dyn-second', 'Answer')], 'faq-row'));
        box.appendChild(rowsWrap);
        appendHtml(box, addRowBtn('faq'));
        fields.appendChild(box);
        var hint = el('p', 'field-hint', 'Only include questions that are actually visible on the page.');
        fields.appendChild(hint);
      } else if (type === 'article') {
        appendHtml(fields,
          textField('sa-headline', 'Headline', 'How we cut LCP from 4.2s to 1.1s') +
          '<div class="field-row">' +
          '<div class="field"><label for="sa-author">Author name</label><input id="sa-author" type="text" placeholder="Jane Doe"></div>' +
          '<div class="field"><label for="sa-date">Date published</label><input id="sa-date" type="date"></div></div>' +
          urlField('sa-image', 'Featured image URL (optional)') +
          textField('sa-publisher', 'Publisher / site name', 'Example Blog'));
      } else if (type === 'product') {
        appendHtml(fields,
          textField('sp-name', 'Product name', 'Noise-cancelling headphones') +
          urlField('sp-image', 'Product image URL (optional)') +
          '<div class="field"><label for="sp-desc">Description</label><textarea id="sp-desc" rows="3" placeholder="Short product description"></textarea></div>' +
          '<div class="field-row">' +
          '<div class="field"><label for="sp-brand">Brand</label><input id="sp-brand" type="text" placeholder="Acme"></div>' +
          '<div class="field"><label for="sp-price">Price</label><input id="sp-price" type="number" min="0" step="0.01" placeholder="99.99"></div></div>' +
          '<div class="field-row">' +
          '<div class="field"><label for="sp-currency">Currency</label><select id="sp-currency"><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option></select></div>' +
          '<div class="field"><label for="sp-avail">Availability</label><select id="sp-avail"><option value="https://schema.org/InStock">In stock</option><option value="https://schema.org/OutOfStock">Out of stock</option><option value="https://schema.org/PreOrder">Pre-order</option></select></div></div>');
      } else if (type === 'localbusiness') {
        appendHtml(fields,
          textField('sl-name', 'Business name', 'Acme Coffee Co.') +
          '<div class="field-row">' + textField('sl-phone', 'Phone', '+1 555 010 0100') + urlField('sl-url', 'Website (optional)') + '</div>' +
          textField('sl-street', 'Street address', '221B Baker Street') +
          '<div class="field-row">' + textField('sl-city', 'City', 'London') + textField('sl-region', 'State / region', 'Greater London') + '</div>' +
          '<div class="field-row">' + textField('sl-postal', 'Postal code', 'NW1 6XE') + textField('sl-country', 'Country', 'UK') + '</div>');
      } else if (type === 'organization') {
        appendHtml(fields,
          textField('so-name', 'Organization name', 'Acme Inc.') +
          urlField('so-url', 'Website URL') +
          urlField('so-logo', 'Logo URL (optional)') +
          textField('so-sameas', 'Social profiles (comma-separated URLs, optional)', 'https://x.com/acme, https://www.linkedin.com/company/acme'));
      } else { // breadcrumb
        var box2 = el('div');
        box2.className = 'field';
        var lbl2 = el('label'); lbl2.textContent = 'Breadcrumb trail (home first)';
        box2.appendChild(lbl2);
        var rows2 = el('div'); rows2.id = 'sc-bc-rows';
        rows2.appendChild(row('bc', [inp('Home', 'bc-name', 'Name'), inp('https://example.com/', 'bc-url dyn-second', 'URL')]));
        box2.appendChild(rows2);
        appendHtml(box2, addRowBtn('bc'));
        fields.appendChild(box2);
      }
      update();
    }

    function clean(o) {
      var r = {};
      Object.keys(o).forEach(function (k) {
        var v = o[k];
        if (v === '' || v === null || v === undefined) return;
        if (Array.isArray(v)) { if (v.length) r[k] = v; return; }
        r[k] = v;
      });
      return r;
    }

    function update() {
      var type = typeSel.value;
      var obj = null;
      if (type === 'faq') {
        var qs = [];
        fields.querySelectorAll('#sc-faq-rows .dyn-row').forEach(function (r) {
          var q = r.querySelector('.sc-q').value.trim();
          var a = r.querySelector('.sc-a').value.trim();
          if (q && a) qs.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
        });
        if (qs.length) obj = clean({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qs });
      } else if (type === 'article') {
        obj = clean({
          '@context': 'https://schema.org', '@type': 'Article',
          headline: g('sa-headline'), author: g('sa-author') ? { '@type': 'Person', name: g('sa-author') } : '',
          datePublished: g('sa-date'), image: g('sa-image'),
          publisher: g('sa-publisher') ? { '@type': 'Organization', name: g('sa-publisher') } : '',
        });
      } else if (type === 'product') {
        var price = g('sp-price');
        if (price && !/^\d+(\.\d+)?$/.test(price)) price = ''; // negative/garbage prices are dropped
        obj = clean({
          '@context': 'https://schema.org', '@type': 'Product',
          name: g('sp-name'), image: g('sp-image'), description: g('sp-desc'), brand: g('sp-brand') ? { '@type': 'Brand', name: g('sp-brand') } : '',
          offers: price ? {
            '@type': 'Offer', price: price, priceCurrency: gv('sp-currency'), availability: gv('sp-avail'),
          } : '',
        });
      } else if (type === 'localbusiness') {
        obj = clean({
          '@context': 'https://schema.org', '@type': 'LocalBusiness',
          name: g('sl-name'), image: '', url: g('sl-url'), telephone: g('sl-phone'),
          address: (g('sl-street') || g('sl-city')) ? {
            '@type': 'PostalAddress', streetAddress: g('sl-street'), addressLocality: g('sl-city'),
            addressRegion: g('sl-region'), postalCode: g('sl-postal'), addressCountry: g('sl-country'),
          } : '',
        });
      } else if (type === 'organization') {
        var sameAs = g('so-sameas') ? g('so-sameas').split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
        obj = clean({
          '@context': 'https://schema.org', '@type': 'Organization',
          name: g('so-name'), url: g('so-url'), logo: g('so-logo'), sameAs: sameAs,
        });
      } else {
        var items = [];
        fields.querySelectorAll('#sc-bc-rows .dyn-row').forEach(function (r) {
          var name = r.querySelector('.bc-name').value.trim();
          var url = r.querySelector('.bc-url').value.trim();
          if (!name) return;
          var item = { '@type': 'ListItem', position: items.length + 1, name: name };
          if (url) item.item = url;
          items.push(item);
        });
        if (items.length) obj = clean({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items });
      }
      out.textContent = obj ? JSON.stringify(obj, null, 2) : 'Fill in the fields above to generate JSON-LD.';
    }

    typeSel.addEventListener('change', function () { render(typeSel.value); });
    fields.addEventListener('input', update);
    fields.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        var key = add.getAttribute('data-add');
        var wrap = key === 'faq' ? fields.querySelector('#sc-faq-rows') : fields.querySelector('#sc-bc-rows');
        if (key === 'faq') wrap.appendChild(row('faq', [inp('Question', 'sc-q', 'Question'), inp('Answer', 'sc-a dyn-second', 'Answer')], 'faq-row'));
        else wrap.appendChild(row('bc', [inp('Name', 'bc-name', 'Name'), inp('https://example.com/', 'bc-url dyn-second', 'URL')]));
        return;
      }
      var del = e.target.closest('.row-del');
      if (del) {
        var rowEl = del.closest('.dyn-row');
        var list = rowEl.parentNode;
        if (list.children.length > 1) list.removeChild(rowEl);
        else Array.prototype.forEach.call(rowEl.querySelectorAll('input,textarea'), function (n) { n.value = ''; });
        update();
      }
    });
    render('faq');
  };

  // ---------------------------------------------------------- serp preview tool
  T['serp-preview-tool'] = function (root) {
    var TITLE_FONT = '400 20px Arial, sans-serif';
    var DESC_FONT = '400 14px Arial, sans-serif';
    function update() {
      var g = function (id) { return $(root, id); };
      var url = g('sp-url').value.trim();
      var title = g('sp-title').value;
      var desc = g('sp-desc').value;
      g('sp-prev-url').textContent = url ? displayUrl(url) : 'example.com';
      g('sp-prev-title').textContent = title || 'Your title appears here';
      g('sp-prev-desc').textContent = desc || 'Your description appears here…';
      var tw = pxWidth(title, TITLE_FONT);
      var dw = pxWidth(desc, DESC_FONT);
      var stats = stat(root, 'sp-stats');
      stats.appendChild(el('span', null, 'Title: '));
      stats.appendChild(el('strong', null, title.trim().length + ' chars · ' + tw + 'px'));
      stats.appendChild(tw > 600 ? chip('warn', (TOOLTXT.serp || {}).titleMayClip || 'May clip in this estimate') : chip('good', (TOOLTXT.serp || {}).titleContext || 'Width estimate only'));
      stats.appendChild(el('span', null, 'Description: '));
      stats.appendChild(el('strong', null, desc.trim().length + ' chars · ' + dw + 'px'));
      var dl = desc.trim().length;
      stats.appendChild(dw > 920 ? chip('warn', (TOOLTXT.serp || {}).descMayClip || 'May clip in this estimate') : chip('good', (TOOLTXT.serp || {}).estimated || 'Estimated width only'));
      var fit = stat(root, 'sp-fit');
      var page = root.__t4mPageMeta;
      var query = g('sp-query').value.trim();
      if (!page) fit.textContent = (TOOLTXT.serp || {}).noPage || '';
      else if (!query) fit.textContent = 'Fetched from ' + (page.finalUrl || page.url || '') + '. ' + ((TOOLTXT.serp || {}).estimated || 'Preview estimate only.');
      else {
        var areas = [title, page.h1s[0] || '', desc, page.mainText];
        var count = areas.filter(function (x) { return window.T4M_INSPECT.phraseCount(x, query) > 0; }).length;
        fit.textContent = String((TOOLTXT.serp || {}).phraseAreas || 'Phrase found in {n} areas.').replace('{n}', count) + ' ' + ((TOOLTXT.serp || {}).estimated || '');
      }
      $(root, 'sp-out').textContent = title.trim() || desc.trim()
        ? String((TOOLTXT.serp || {}).titleContext || '') + '\nTitle: ' + title.trim().length + ' characters / ' + tw + 'px (browser estimate).' +
          '\nDescription: ' + dl + ' characters / ' + dw + 'px (browser estimate). ' + ((TOOLTXT.serp || {}).estimated || '')
        : ((TOOLTXT.serp || {}).empty || 'Enter a title and description.');
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- meta description checker
  T['meta-description-checker'] = function (root) {
    function update() {
      var text = $(root, 'md-text').value;
      var trimmed = text.trim();
      var w = pxWidth(text, '400 14px Arial, sans-serif');
      var len = trimmed.length;
      var stats = stat(root, 'md-stats');
      stats.appendChild(el('span', null, 'Length: '));
      stats.appendChild(el('strong', null, len + ' chars · ' + w + 'px'));
      var page = root.__t4mPageMeta;
      var copy = TOOLTXT.meta || {};
      stats.appendChild(chip(!len ? 'warn' : w > 920 ? 'warn' : 'good', !len ? (copy.noDescription || '') : w > 920 ? (copy.mayClip || '') : (copy.widthNote || '')));
      $(root, 'md-prev').textContent = trimmed || 'Your meta description appears here…';
      var pageTitle = $(root, 'md-prev-title'), pageUrl = $(root, 'md-prev-url');
      if (pageTitle) pageTitle.textContent = page && page.title ? page.title : 'Your page title appears here';
      if (pageUrl) pageUrl.textContent = page && (page.finalUrl || page.url) ? displayUrl(page.finalUrl || page.url) : 'example.com';
      var fit = stat(root, 'md-fit');
      var query = $(root, 'md-query').value.trim();
      if (!page) fit.textContent = copy.noPage || '';
      else if (!query) fit.textContent = 'Fetched title: ' + (page.title || '(missing)') + ' · main heading: ' + (page.h1s[0] || '(missing)') + '. Add a target phrase for a placement check.';
      else {
        var areas = [page.title, page.h1s[0] || '', trimmed, page.mainText];
        var count = areas.filter(function (x) { return window.T4M_INSPECT.phraseCount(x, query) > 0; }).length;
        fit.textContent = String(copy.inPage || 'Phrase appears in {n} areas.').replace('{n}', count);
      }
      var verdict = $(root, 'md-out');
      verdict.textContent = trimmed
        ? 'Description measured: ' + len + ' characters / ' + w + 'px in this browser estimate. ' + (w > 920 ? (copy.mayClip || '') : (copy.widthNote || ''))
        : (copy.noDescription || 'Enter a description to inspect it.');
    }
    root.addEventListener('input', update);
    update();
  };

  function tpl(str, map) {
    var s = String(str);
    Object.keys(map).forEach(function (k) { s = s.split('{' + k + '}').join(map[k]); });
    return s;
  }

  // ---------------------------------------------------------- OG image tester
  T['og-image-tester'] = function (root) {
    var COPY = TOOLTXT.ogit || {};
    var urlIn = root.querySelector('#ogit-url');
    var stats = root.querySelector('#ogit-stats');
    var detail = root.querySelector('#ogit-detail');
    var preview = root.querySelector('#ogit-preview');

    function update() {
      var u = (urlIn.value || '').trim();
      if (!/^https?:\/\//i.test(u)) {
        preview.removeAttribute('src');
        preview.setAttribute('hidden', '');
        stats.textContent = COPY.empty || '';
        detail.textContent = '';
        return;
      }
      stats.textContent = tpl(COPY.loading || 'Loading the image from {v}…', { v: u });
      detail.textContent = '';
      preview.onload = function () {
        var w = preview.naturalWidth, h = preview.naturalHeight;
        preview.removeAttribute('hidden');
        var ratio = h ? (w / h) : 0;
        var ratioLine = ratio >= 1.7 && ratio <= 2.1 ? (COPY.ratioWide || '')
          : (ratio >= 0.95 && ratio <= 1.05 ? (COPY.ratioSquare || '') : (COPY.ratioOther || ''));
        var sizeLine = (w >= 1200 && h >= 630) ? (COPY.sizeGood || '')
          : (w >= 600 ? (COPY.sizeMid || '') : (w >= 200 ? (COPY.sizeSmall || '') : (COPY.sizeTiny || '')));
        stats.textContent = tpl(COPY.dims || 'Loaded: {w}×{h} pixels ({v}).', { w: w, h: h, v: u }) + ' ' +
          tpl(COPY.ratio || 'Aspect ratio {r} — {v}', { r: ratio.toFixed(2) + ':1', v: ratioLine }) + ' ' + sizeLine;
        detail.textContent = COPY.notePlatforms || '';
      };
      preview.onerror = function () {
        preview.setAttribute('hidden', '');
        stats.textContent = tpl(COPY.loadFail || 'The image could not be loaded from {v}.', { v: u });
      };
      preview.src = u;
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- hreflang checker
  T['hreflang-checker'] = function (root) {
    var COPY = TOOLTXT.hlc || {};
    var src = root.querySelector('#hlc-src');
    var selfIn = root.querySelector('#hlc-self');
    var stats = root.querySelector('#hlc-stats');
    var list = root.querySelector('#hlc-list');
    var CODE = /^(x-default|[a-z]{2,3}(-[A-Z]{2})?)$/;

    function update() {
      list.textContent = '';
      var text = src.value || '';
      if (!text.trim()) { stats.textContent = COPY.empty || ''; return; }
      var doc = null;
      try { doc = new DOMParser().parseFromString(text, 'text/html'); } catch (e) {}
      var links = doc ? Array.prototype.slice.call(doc.querySelectorAll('link[rel="alternate"][hreflang]')) : [];
      if (!links.length) { stats.textContent = COPY.none || ''; return; }

      var issues = [];
      var seen = {};
      var langs = [];
      var refs = [];
      var ul = document.createElement('ul');
      ul.className = 'hlc-entries';
      links.forEach(function (l, i) {
        var lang = (l.getAttribute('hreflang') || '').trim();
        var href = (l.getAttribute('href') || '').trim();
        langs.push(lang);
        refs.push(href.replace(/[?#].*$/, '').replace(/\/$/, ''));
        if (!CODE.test(lang)) issues.push(tpl(COPY.invalidCode || '"{v}" is not a valid hreflang code.', { v: lang || '(empty)' }));
        seen[lang] = (seen[lang] || 0) + 1;
        var li = document.createElement('li');
        li.textContent = tpl(COPY.entry || '{lang} → {url}', { lang: lang || '(empty)', url: href || '(missing href)' });
        ul.appendChild(li);
      });
      Object.keys(seen).forEach(function (k) {
        if (seen[k] > 1) issues.push(tpl(COPY.dupCode || '"{v}" is declared {n} times.', { v: k, n: seen[k] }));
      });

      var self = (selfIn.value || '').trim().replace(/[?#].*$/, '').replace(/\/$/, '');
      var selfLine = !self ? (COPY.selfSkipped || '')
        : (refs.indexOf(self) !== -1 ? (COPY.selfOk || '') : tpl(COPY.selfBad || 'No self-reference: none of the hreflang URLs matches {v}.', { v: self }));
      stats.textContent = tpl(COPY.found || '{n} hreflang annotation(s) found.', { n: links.length }) + ' ' + selfLine;

      list.appendChild(ul);
      issues.forEach(function (msg) {
        var li = document.createElement('li');
        li.className = 'hlc-issue';
        li.textContent = msg;
        ul.appendChild(li);
      });
      var noteP = document.createElement('p');
      noteP.textContent = COPY.recipNote || '';
      list.appendChild(noteP);
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };
})();

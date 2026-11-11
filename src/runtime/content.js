// Tools4Market — runtime logic: Content & Social tools
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};
  function $(root, id) { return root.querySelector('#' + id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function chip(kind, text) { return el('span', 'chip ' + kind, text); }

  // ---- shared visual helpers (mirrors marketing.js) ----
  function kpiTile(label, value, delta, deltaDir, barPct) {
    var tile = document.createElement('div');
    tile.className = 'stat-tile';
    tile.innerHTML =
      '<span class="stat-tile-label">' + label + '</span>' +
      '<span class="stat-tile-value">' + value + '</span>' +
      (delta != null
        ? '<span class="stat-tile-delta ' + deltaDir + '">' +
            (deltaDir === 'flat' ? '' : (deltaDir === 'up' ? '▲ ' : '▼ ')) + delta + '</span>'
        : '') +
      (barPct != null
        ? '<div class="stat-tile-bar"><i style="width:' + Math.max(2, Math.min(100, barPct)) + '%"></i></div>'
        : '');
    return tile;
  }
  function barChart(title, sub, rows, opts) {
    opts = opts || {};
    var card = document.createElement('div');
    card.className = 'chart-card';
    var head = document.createElement('div');
    head.innerHTML = '<p class="chart-title">' + title + '</p>' +
      (sub ? '<p class="chart-sub">' + sub + '</p>' : '');
    card.appendChild(head);
    var chart = document.createElement('div');
    chart.className = 'bar-chart';
    var colors = opts.colors || [opts.color1 || 'var(--c-chart-1)', opts.color2 || 'var(--c-chart-3)'];
    rows.forEach(function (r, i) {
      var row = document.createElement('div');
      row.className = 'bar-row';
      var lbl = document.createElement('div');
      lbl.className = 'bar-label';
      lbl.textContent = r.label;
      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.width = '0%';
      fill.style.background = (Array.isArray(colors[i]) ? colors[i].join(',') : colors[i]);
      track.appendChild(fill);
      var val = document.createElement('div');
      val.className = 'bar-val';
      val.innerHTML = r.val + (r.unit ? ' <small>' + r.unit + '</small>' : '');
      row.appendChild(lbl); row.appendChild(track); row.appendChild(val);
      chart.appendChild(row);
      requestAnimationFrame(function () { fill.style.width = Math.max(2, Math.min(100, r.pct)) + '%'; });
    });
    card.appendChild(chart);
    return card;
  }

  // ---------------------------------------------------------- url slug generator
  T['url-slug-generator'] = function (root) {
    var out = $(root, 'sl-out');
    var STOP = { a: 1, an: 1, the: 1, and: 1, or: 1, but: 1, for: 1, nor: 1, of: 1, to: 1, in: 1, on: 1, at: 1, by: 1, from: 1, with: 1, is: 1, are: 1, was: 1, were: 1, be: 1 };
    function slugify(line, sep, stop, maxLen) {
      var words = line.toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      if (stop) words = words.filter(function (w) { return !STOP[w]; });
      var slug = words.join(sep);
      if (maxLen && slug.length > maxLen) {
        slug = slug.slice(0, maxLen);
        var last = slug.lastIndexOf(sep);
        if (last > Math.floor(maxLen / 2)) slug = slug.slice(0, last);
      }
      return slug;
    }
    function update() {
      var sep = $(root, 'sl-sep').value;
      var stop = $(root, 'sl-stop').checked;
      var maxLen = parseInt($(root, 'sl-max').value, 10);
      if (!(maxLen > 0)) maxLen = 0; // empty/invalid/negative → no truncation
      var results = $(root, 'sl-text').value.split('\n')
        .map(function (l) { return l.trim(); })
        .filter(Boolean)
        .map(function (l) { return slugify(l, sep, stop, maxLen); })
        .filter(Boolean);
      out.textContent = results.length ? results.join('\n') : 'Type a title (or one title per line) to generate slugs.';
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- utm link builder
  T['utm-link-builder'] = function (root) {
    var out = $(root, 'ut-out');
    function update() {
      var g = function (id) { return $(root, id); };
      var url = g('ut-url').value.trim();
      var source = g('ut-source').value.trim();
      var medium = g('ut-medium').value.trim() || g('ut-medium-hint').value.trim();
      var campaign = g('ut-campaign').value.trim();
      var term = g('ut-term').value.trim();
      var content = g('ut-content').value.trim();
      if (!url) { out.textContent = 'Paste a destination URL to begin.'; return; }
      var u;
      try { u = new URL(url); } catch (e) {
        out.textContent = 'That does not look like a valid URL — include https:// at the start.';
        return;
      }
      if (u.protocol !== 'http:' && u.protocol !== 'https:') {
        out.textContent = 'That does not look like a valid URL — include https:// at the start.';
        return;
      }
      var pairs = [['utm_source', source], ['utm_medium', medium], ['utm_campaign', campaign], ['utm_term', term], ['utm_content', content]];
      var missing = [];
      if (!source) missing.push('source');
      if (!medium) missing.push('medium');
      pairs.forEach(function (p) { if (p[1]) u.searchParams.set(p[0], p[1].toLowerCase()); });
      out.textContent = missing.length
        ? '⚠ Add the required ' + missing.join(' and ') + ' — tagged URL so far:\n\n' + u.toString()
        : u.toString();
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- keyword density checker
  T['keyword-density-checker'] = function (root) {
    var out = $(root, 'kd-out');
    var targetReport = $(root, 'kd-target-report');
    var targetInput = $(root, 'kd-query');
    var copy = ((window.T4M_ISTR || {}).tools || {}).keyword || {};
    var STOP = ('a,an,the,and,or,but,if,then,else,when,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,down,in,out,on,off,over,under,again,further,once,here,there,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,can,will,just,is,are,was,were,be,been,being,have,has,had,do,does,did,of,it,its,this,that,these,those,i,you,he,she,we,they,them,his,her,their,our,your,my,me,us,what,which,who,whom,as,until,while,because,s,t,don,now').split(',');

    function table(n, totals) {
      var frag = document.createDocumentFragment();
      frag.appendChild(el('h3', null, n + '-word phrases'));
      var tableEl = el('table');
      var thead = el('thead');
      var hr = el('tr');
      ['Phrase', 'Count', 'Share of phrase rows'].forEach(function (h) { var th = el('th', null, h); hr.appendChild(th); });
      thead.appendChild(hr);
      tableEl.appendChild(thead);
      var tbody = el('tbody');
      var keys = Array.from(totals.keys());
      keys.sort(function (a, b) { return totals.get(b) - totals.get(a) || a.localeCompare(b); });
      keys.slice(0, 12).forEach(function (k) {
        var tr = el('tr');
        tr.appendChild(el('td', null, k));
        tr.appendChild(el('td', null, String(totals.get(k))));
        tr.appendChild(el('td', null, (totals.get(k) / counts[n] * 100).toFixed(2) + '%'));
        tbody.appendChild(tr);
      });
      tableEl.appendChild(tbody);
      frag.appendChild(tableEl);
      return frag;
    }

    var counts = { 1: 0, 2: 0, 3: 0 };
    function update() {
      var stop = $(root, 'kd-stop').checked;
      var text = $(root, 'kd-text').value.toLowerCase();
      var raw = text.match(/[a-z0-9']+/g) || [];
      var words = raw.filter(function (w) { return w.replace(/'/g, '').length > 0; });
      var singleWords = stop ? words.filter(function (w) { return STOP.indexOf(w) === -1; }) : words;

      counts = { 1: 0, 2: 0, 3: 0 };
      var grams = { 1: new Map(), 2: new Map(), 3: new Map() };
      for (var n = 1; n <= 3; n++) {
        var sequence = n === 1 ? singleWords : words;
        for (var i = 0; i + n <= sequence.length; i++) {
          var phraseWords = sequence.slice(i, i + n);
          var gram = phraseWords.join(' ');
          // Keep original word order; filtering hides phrases that contain a
          // stop word instead of joining words across the removed gap.
          if (n > 1 && stop && phraseWords.some(function (w) { return STOP.indexOf(w) !== -1; })) continue;
          grams[n].set(gram, (grams[n].get(gram) || 0) + 1);
          counts[n]++;
        }
      }

      var uniq = new Set(words);
      var statsTiles = $(root, 'kd-stats-tiles');
      if (statsTiles) {
        statsTiles.innerHTML = '';
        statsTiles.appendChild(kpiTile('Words', String(words.length), uniq.size > 0 ? 'tracked' : '', words.length > 0 ? 'up' : 'flat'));
        statsTiles.appendChild(kpiTile('Unique terms', String(uniq.size), uniq.size > 0 ? 'of ' + words.length : '', uniq.size > 0 ? 'up' : 'flat'));
        statsTiles.appendChild(kpiTile('Reading time', Math.max(1, Math.ceil(words.length / 200)) + ' min', words.length > 200 ? 'long form' : words.length > 0 ? 'short' : '', words.length > 200 ? 'flat' : (words.length > 0 ? 'flat' : 'flat')));
      }
      var stats = $(root, 'kd-stats');
      if (stats) {
        stats.textContent = '';
        stats.appendChild(!words.length ? chip('warn', 'paste text to analyse')
          : (grams[1].size ? chip('good', 'term frequency calculated') : chip('warn', 'only stop words found')));
      }

      if (targetReport) {
        targetReport.textContent = '';
        var query = (targetInput.value || '').trim();
        if (!query) targetReport.textContent = copy.noQuery || 'Enter an optional target phrase.';
        else if (!words.length) targetReport.textContent = 'Paste or fetch page text before checking this phrase.';
        else {
          var qcount = window.T4M_INSPECT && window.T4M_INSPECT.phraseCount
            ? window.T4M_INSPECT.phraseCount(text, query) : 0;
          var percent = words.length ? (qcount / words.length * 100).toFixed(2) : '0.00';
          targetReport.appendChild(el('strong', null, String(copy.count || 'Occurrences: {n} ({pct}%).').replace('{n}', qcount).replace('{pct}', percent)));
          targetReport.appendChild(document.createElement('br'));
          targetReport.appendChild(document.createTextNode(copy.densityNote || 'Frequency is descriptive, not a ranking target.'));
          var page = root.__t4mPageMeta;
          if (page) {
            var values = [page.title, page.h1s[0] || '', page.desc, page.mainText];
            var flags = values.map(function (value) { return window.T4M_INSPECT.phraseCount(value, query) > 0; });
            targetReport.appendChild(document.createElement('br'));
            targetReport.appendChild(document.createTextNode(String(copy.pageAreas || 'Fetched page placement: {title}; {h1}; {desc}; {body}.')
              .replace('{title}', flags[0] ? 'found' : 'not found').replace('{h1}', flags[1] ? 'found' : 'not found')
              .replace('{desc}', flags[2] ? 'found' : 'not found').replace('{body}', flags[3] ? 'found' : 'not found')));
          }
        }
      }

      var vis = $(root, 'kd-vis');
      out.textContent = '';
      if (!words.length) {
        out.appendChild(el('p', null, copy.pastedText || 'Paste text here; analysis runs in your browser.'));
        if (vis) vis.innerHTML = '';
        return;
      }
      if (!singleWords.length && stop) {
        out.appendChild(el('p', null, 'Only stop words were found — turn off the stop-word filter above, or add more content words.'));
        if (vis) vis.innerHTML = '';
        return;
      }
      [1, 2, 3].forEach(function (n) {
        if (counts[n] > 0) out.appendChild(table(n, grams[n]));
      });
      // Visual summary: top 10 single-word terms as a bar chart
      if (vis && grams[1] && grams[1].size) {
        vis.innerHTML = '';
        var top = Array.from(grams[1].entries())
          .sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); })
          .slice(0, 10);
        var maxC = top.length ? top[0][1] : 1;
        vis.appendChild(barChart('Most frequent terms', 'Top ' + top.length + ' single words — share of all term rows', top.map(function (p) {
          return { label: p[0], val: String(p[1]), pct: Math.max(2, (p[1] / maxC) * 100) };
        })));
      } else if (vis) {
        vis.innerHTML = '';
      }
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- hashtag generator
  T['hashtag-generator'] = function (root) {
    var out = $(root, 'hg-out');
    var PLATFORM_TAGS = {
      instagram: ['instagram', 'instagrammarketing', 'digitalmarketing', 'socialmediamarketing', 'marketingtips', 'contentcreator', 'contentmarketing', 'smallbusiness', 'branding', 'onlinebusiness', 'marketingstrategy', 'instagramtips'],
      x: ['marketing', 'digitalmarketing', 'contentmarketing', 'seo', 'growth', 'startups', 'buildinpublic', 'marketingtips', 'socialmedia', 'branding', 'entrepreneur', 'saas'],
      linkedin: ['marketing', 'digitalmarketing', 'contentstrategy', 'personalbranding', 'businessgrowth', 'b2bmarketing', 'brandstrategy', 'marketingtips', 'leadership', 'innovation'],
      youtube: ['youtubetips', 'youtubegrowth', 'contentcreator', 'digitalmarketing', 'youtubeseo', 'creatoreconomy', 'marketingstrategy', 'videomarketing', 'youtubeshorts', 'youtuber'],
      tiktok: ['tiktokmarketing', 'fyp', 'smallbusiness', 'contentcreator', 'digitalmarketing', 'tiktokgrowth', 'marketingtips', 'businesstok', 'learnontiktok', 'viral'],
    };
    function update() {
      var kw = $(root, 'hg-keyword').value.trim();
      var platform = $(root, 'hg-platform').value;
      var words = kw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      var set = [];
      function add(t) { if (t && set.indexOf(t) === -1) set.push(t); }
      if (words.length) {
        add('#' + words.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(''));
        add('#' + words.join(''));
        if (words.length === 1 && !/s$/.test(words[0])) add('#' + words[0] + 's');
        PLATFORM_TAGS[platform].forEach(function (t) { add('#' + t); });
      }
      out.textContent = words.length
        ? set.join(' ') + '\n\n(' + set.length + ' hashtags for ' + platform + ' — delete any that do not match your post)'
        : 'Type a topic above to generate a hashtag set.';
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- case converter
  T['case-converter'] = function (root) {
    var out = $(root, 'cc-out');
    var SMALL = { a: 1, an: 1, the: 1, and: 1, but: 1, or: 1, nor: 1, for: 1, of: 1, in: 1, on: 1, at: 1, to: 1, from: 1, by: 1, with: 1, as: 1 };
    function words(t) { return t.split(/[^A-Za-z0-9]+/).filter(Boolean); }
    function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }
    function titleCase(text) {
      var parts = text.split(/([A-Za-z0-9]+)/);
      var n = parts.filter(function (p, i) { return i % 2 === 1; }).length;
      var seen = 0;
      return parts.map(function (p, i) {
        if (i % 2 === 0) return p;
        seen++;
        var w = p.toLowerCase();
        if (seen === 1 || seen === n || !SMALL[w]) return cap(p);
        return w;
      }).join('');
    }
    function sentenceCase(text) {
      return text.toLowerCase().replace(/(^|[.!?]\s+)([a-z\u00c0-\u024f])/g, function (m, pre, ch) { return pre + ch.toUpperCase(); });
    }
    function update() {
      var text = $(root, 'cc-text').value;
      var mode = $(root, 'cc-mode').value;
      if (!text.trim()) { out.textContent = 'Type or paste text above to convert it.'; return; }
      if ($(root, 'cc-ws').checked) text = text.replace(/\s+/g, ' ').trim();
      var result;
      if (mode === 'upper') result = text.toUpperCase();
      else if (mode === 'lower') result = text.toLowerCase();
      else if (mode === 'title') result = titleCase(text);
      else if (mode === 'sentence') result = sentenceCase(text);
      else {
        var ws = words(text);
        if (!ws.length) { out.textContent = 'Type or paste text above to convert it.'; return; }
        var lc = ws.map(function (w) { return w.toLowerCase(); });
        if (mode === 'camel') result = lc.map(function (w, i) { return i ? cap(w) : w; }).join('');
        else if (mode === 'pascal') result = ws.map(cap).join('');
        else if (mode === 'constant') result = lc.join('_').toUpperCase();
        else if (mode === 'kebab') result = lc.join('-');
        else result = lc.join('_');
      }
      out.textContent = result;
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- duplicate line remover
  T['duplicate-line-remover'] = function (root) {
    var out = $(root, 'dl-out');
    var stats = $(root, 'dl-stats');
    function update() {
      var raw = $(root, 'dl-lines').value;
      var ignoreCase = $(root, 'dl-case').checked;
      var trim = $(root, 'dl-trim').checked;
      var dropEmpty = $(root, 'dl-empty').checked;
      var sort = $(root, 'dl-sort').checked;
      var totalLines = raw.length ? raw.split('\n').length : 0;
      if (!raw.trim()) {
        stats.textContent = '';
        out.textContent = 'Paste a list of lines above to remove duplicates.';
        return;
      }
      var seen = {};
      var kept = [];
      raw.split('\n').forEach(function (line) {
        var v = trim ? line.trim() : line;
        if (dropEmpty && !v.trim()) return;
        var key = ignoreCase ? v.toLowerCase() : v;
        if (seen[key]) return;
        seen[key] = 1;
        kept.push(v);
      });
      if (sort) kept.sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
      var unique = kept.length;
      var removed = totalLines - unique;
      stats.textContent = '';
      stats.appendChild(el('span', null, totalLines + ' lines → '));
      stats.appendChild(el('strong', null, String(unique)));
      stats.appendChild(el('span', null, ' unique ('));
      stats.appendChild(el('strong', null, String(removed)));
      stats.appendChild(el('span', null, removed === 1 ? ' duplicate removed)' : ' duplicates removed)'));
      out.textContent = kept.length ? kept.join('\n') : 'Every line was removed — turn off “Drop empty lines” or paste some content.';
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- lorem ipsum generator
  T['lorem-ipsum-generator'] = function (root) {
    var out = $(root, 'lo-out');
    var CORPUS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum vero eos accusamus iusto odio dignissimos ducimus blanditiis praesentium voluptatum deleniti atque corrupti quos dolores quas molestias excepturi sint occaecati cupiditate provident similique sunt culpa officia deserunt mollit anima laborum perspiciatis unde omnis iste natus error voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit fugit consequuntur magni dolores eos ratione sequi nesciunt neque porro quisquam est dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt labore dolore magnam aliquam quaerat voluptatem enim minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam commodi consequatur autem vel eum iure reprehenderit voluptate velit esse quam nihil molestiae consequatur vel illum quo eos alias nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus omnis voluptas assumenda est dolor repellendus temporibus autem quibusdam officiis debitis necessitatibus saepe eveniet voluptates repudiandae recusandae itaque earum rerum hic tenetur sapiente delectus reiciendis voluptatibus maiores alias perferendis doloribus asperiores repellat').split(/\s+/);
    var OPENER = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    function nextWord(openPos) {
      if (openPos.i < OPENER.length) { var w = OPENER[openPos.i]; openPos.i++; return w; }
      return CORPUS[Math.floor(Math.random() * CORPUS.length)];
    }
    function sentence(openPos) {
      var n = 8 + Math.floor(Math.random() * 9);
      var ws = [];
      for (var i = 0; i < n; i++) ws.push(nextWord(openPos));
      var s = ws.join(' ');
      return s.charAt(0).toUpperCase() + s.slice(1) + '.';
    }
    function update() {
      var count = parseInt($(root, 'lo-count').value, 10);
      var unit = $(root, 'lo-unit').value;
      var opener = $(root, 'lo-start').checked;
      if (!(count >= 1)) { out.textContent = 'Enter how many units to generate (1–50).'; return; }
      if (count > 50) count = 50;
      var pos = { i: opener ? 0 : OPENER.length };
      var text;
      if (unit === 'paragraphs') {
        var paras = [];
        for (var p = 0; p < count; p++) {
          var sents = [];
          var sn = 4 + Math.floor(Math.random() * 4);
          for (var s = 0; s < sn; s++) sents.push(sentence(pos));
          paras.push(sents.join(' '));
        }
        text = paras.join('\n\n');
      } else if (unit === 'sentences') {
        var list = [];
        for (var k = 0; k < count; k++) list.push(sentence(pos));
        text = list.join(' ');
      } else {
        var ws = [];
        for (var w = 0; w < count; w++) ws.push(nextWord(pos));
        text = ws.join(' ');
        if (!opener) text = text.charAt(0).toUpperCase() + text.slice(1);
        text += '.';
      }
      out.textContent = text;
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- reading time calculator
  T['reading-time-calculator'] = function (root) {
    var out = $(root, 'rt-out');
    function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function update() {
      var text = $(root, 'rt-text').value;
      if (!text.trim()) { out.textContent = 'Paste your text above to measure it — nothing is uploaded.'; return; }
      var words = text.trim().split(/\s+/).filter(Boolean);
      var charsWith = text.length;
      var charsNoSpace = text.replace(/\s/g, '').length;
      var sentences = (text.match(/[.!?]+(?=\s|$)/g) || []).length || 1;
      var paragraphs = text.split(/\n\s*\n/).filter(function (b) { return b.trim(); }).length || 1;
      var readMin = Math.max(1, Math.round(words.length / 200));
      var speakMin = Math.max(1, Math.round(words.length / 130));
      out.textContent = [
        'Words: ' + fmt(words.length),
        'Characters: ' + fmt(charsWith) + ' (with spaces) · ' + fmt(charsNoSpace) + ' (without spaces)',
        'Sentences: ' + fmt(sentences),
        'Paragraphs: ' + fmt(paragraphs),
        'Reading time: about ' + readMin + ' min read (at 200 wpm)',
        'Speaking time: about ' + speakMin + ' min (at 130 wpm)',
      ].join('\n');
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- word counter
  T['word-counter'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).wordCount) || {};
    var L = COPY.labels || {};
    var input = $(root, 'wc-text');
    var out = $(root, 'wc-out');
    var STOP = ('a an and are as at be but by for from had has have he her his i if in into is it its ' +
      'me my no not of on or our she so than that the their them then there these they this to ' +
      'up us was we were what when which who will with you your').split(' ');

    function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function tile(label, value) {
      var t = el('div', 'stat-tile');
      t.appendChild(el('span', 'stat-tile-label', label));
      t.appendChild(el('span', 'stat-tile-value', value));
      return t;
    }

    function update() {
      var text = input.value;
      if (!text.trim()) { out.textContent = COPY.empty || ''; return; }

      var words = text.trim().split(/\s+/).filter(Boolean);
      var tokens = text.toLowerCase().match(/[a-z0-9\u00c0-\u024f]+(?:['\u2019-][a-z0-9\u00c0-\u024f]+)*/g) || [];
      var unique = new Set(tokens);
      var sentences = (text.match(/[.!?]+(?=\s|$)/g) || []).length || 1;
      var paragraphs = text.split(/\n\s*\n/).filter(function (b) { return b.trim(); }).length || 1;
      var letters = tokens.reduce(function (n, w) { return n + w.length; }, 0);
      var avgWord = tokens.length ? Math.round((letters / tokens.length) * 10) / 10 : 0;
      var avgSent = Math.round((words.length / sentences) * 10) / 10;
      var minutes = Math.max(1, Math.round(words.length / 200));

      var freq = Object.create(null);
      tokens.forEach(function (w) {
        if (w.length < 2 || STOP.indexOf(w) !== -1) return;
        freq[w] = (freq[w] || 0) + 1;
      });
      var top = Object.keys(freq).map(function (w) { return { word: w, n: freq[w] }; })
        .filter(function (r) { return r.n > 1; })
        .sort(function (a, b) { return b.n - a.n || (a.word < b.word ? -1 : 1); })
        .slice(0, 6);

      out.textContent = '';
      var strip = el('div', 'kpi-strip');
      strip.appendChild(tile(L.w || 'Words', fmt(words.length)));
      strip.appendChild(tile(L.u || 'Unique', fmt(unique.size)));
      strip.appendChild(tile(L.c || 'Characters', fmt(text.length)));
      strip.appendChild(tile(L.s || 'Sentences', fmt(sentences)));
      strip.appendChild(tile(L.p || 'Paragraphs', fmt(paragraphs)));
      strip.appendChild(tile(L.m || 'Reading time', tpl(COPY.minUnit || '{n} min', { n: minutes })));
      out.appendChild(strip);

      var lines = el('p', 'tool-note');
      lines.textContent = tpl(COPY.stats || '', {
        w: fmt(words.length), u: fmt(unique.size), c: fmt(text.length),
        s: fmt(sentences), p: fmt(paragraphs),
      }) + ' ' + tpl(COPY.reading || '', { m: minutes }) + ' ' +
        tpl(COPY.averages || '', { a: avgWord, b: avgSent });
      out.appendChild(lines);

      if (top.length) {
        out.appendChild(barChart(COPY.topHead || 'Most frequent words', '', top.map(function (r) {
          return { label: r.word, val: fmt(r.n), pct: (r.n / top[0].n) * 100 };
        })));
      } else {
        var none = el('p', 'tool-note');
        none.textContent = COPY.topNone || '';
        out.appendChild(none);
      }
      var foot = el('p', 'tool-note');
      foot.textContent = COPY.note || '';
      out.appendChild(foot);
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- character counter
  T['character-counter'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).charCount) || {};
    var input = $(root, 'chc-text');
    var out = $(root, 'chc-out');

    function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function bytesOf(s) {
      if (window.TextEncoder) return new TextEncoder().encode(s).length;
      return unescape(encodeURIComponent(s)).length;
    }
    function tile(label, value) {
      var t = el('div', 'stat-tile');
      t.appendChild(el('span', 'stat-tile-label', label));
      t.appendChild(el('span', 'stat-tile-value', value));
      return t;
    }

    function update() {
      var text = input.value;
      if (!text) { out.textContent = COPY.empty || ''; return; }
      var chars = text.length;
      var noSpaces = text.replace(/\s/g, '').length;
      var bytes = bytesOf(text);
      var words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      var lines = text.split('\n').length;

      out.textContent = '';
      var strip = el('div', 'kpi-strip');
      strip.appendChild(tile(COPY.charsLabel || 'Characters', fmt(chars)));
      strip.appendChild(tile(COPY.noSpaceLabel || 'Without spaces', fmt(noSpaces)));
      strip.appendChild(tile(COPY.bytesLabel || 'UTF-8 bytes', fmt(bytes)));
      strip.appendChild(tile(COPY.wordsLabel || 'Words', fmt(words)));
      strip.appendChild(tile(COPY.linesLabel || 'Lines', fmt(lines)));
      out.appendChild(strip);

      var limits = [
        { label: COPY.limitTitle || 'Meta title · 60', limit: 60 },
        { label: COPY.limitDesc || 'Meta description · 158', limit: 158 },
        { label: COPY.limitTweet || 'X post · 280', limit: 280 },
        { label: COPY.limitSms || 'SMS · 160', limit: 160 },
      ];
      var rows = limits.map(function (l) {
        var over = chars > l.limit;
        var value = over ? tpl(COPY.over || '{n} over', { n: fmt(chars - l.limit) })
          : tpl(COPY.remaining || '{n} left', { n: fmt(l.limit - chars) });
        return { label: l.label, val: value, pct: Math.min(100, (chars / l.limit) * 100), over: over };
      });
      out.appendChild(barChart(COPY.limitsHead || 'Common limits', '', rows, {
        colors: rows.map(function (r) { return r.over ? 'var(--c-danger)' : 'var(--c-success)'; }),
      }));
      var foot = el('p', 'tool-note');
      foot.textContent = COPY.note || '';
      out.appendChild(foot);
    }
    root.addEventListener('input', update);
    update();
  };
  // ---------------------------------------------------------- text diff
  // Line-level diff exported for the behaviour test: a fixed pair of texts must
  // produce a fixed edit script, which is the only way to assert "correct"
  // rather than "rendered something".
  var DIFF = window.T4M_DIFF = (function () {
    var CAP = 1200;

    function diff(aText, bText, opts) {
      opts = opts || {};
      var a = String(aText == null ? '' : aText).split('\n');
      var b = String(bText == null ? '' : bText).split('\n');
      function norm(s) {
        var t = s;
        if (opts.ignoreCase) t = t.toLowerCase();
        if (opts.ignoreSpace) t = t.replace(/\s+/g, ' ').trim();
        return t;
      }
      if (opts.ignoreBlank) {
        a = a.filter(function (s) { return s.trim() !== ''; });
        b = b.filter(function (s) { return s.trim() !== ''; });
      }
      var start = 0;
      while (start < a.length && start < b.length && norm(a[start]) === norm(b[start])) start++;
      var endA = a.length - 1, endB = b.length - 1;
      while (endA >= start && endB >= start && norm(a[endA]) === norm(b[endB])) { endA--; endB--; }
      var midA = a.slice(start, endA + 1);
      var midB = b.slice(start, endB + 1);
      if (midA.length > CAP || midB.length > CAP) return { tooBig: true, cap: CAP };

      var n = midA.length, m = midB.length;
      // LCS table on normalised lines. Typed array: 1200² × 4 bytes ≈ 5.7 MB,
      // which is the reason for the cap rather than an arbitrary number.
      var w = m + 1;
      var dp = new Uint32Array((n + 1) * w);
      for (var i = n - 1; i >= 0; i--) {
        for (var j = m - 1; j >= 0; j--) {
          dp[i * w + j] = norm(midA[i]) === norm(midB[j])
            ? dp[(i + 1) * w + j + 1] + 1
            : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
        }
      }
      var out = [];
      for (var p = 0; p < start; p++) out.push({ t: 'same', s: a[p] });
      var x = 0, y = 0;
      while (x < n && y < m) {
        if (norm(midA[x]) === norm(midB[y])) { out.push({ t: 'same', s: midA[x] }); x++; y++; }
        else if (dp[(x + 1) * w + y] >= dp[x * w + y + 1]) { out.push({ t: 'del', s: midA[x] }); x++; }
        else { out.push({ t: 'add', s: midB[y] }); y++; }
      }
      while (x < n) { out.push({ t: 'del', s: midA[x] }); x++; }
      while (y < m) { out.push({ t: 'add', s: midB[y] }); y++; }
      for (var q = endA + 1; q < a.length; q++) out.push({ t: 'same', s: a[q] });
      return { lines: out, prefix: start };
    }

    function unified(script, aTotal, bTotal) {
      var head = '--- original\n+++ changed\n';
      if (!script.length) return head;
      var del = 0, add = 0;
      script.forEach(function (l) { if (l.t === 'del') del++; if (l.t === 'add') add++; });
      var body = script.map(function (l) {
        return (l.t === 'add' ? '+' : l.t === 'del' ? '-' : ' ') + l.s;
      }).join('\n');
      return head + '@@ -1,' + aTotal + ' +1,' + bTotal + ' @@\n' + body + '\n';
    }

    return { diff: diff, unified: unified };
  })();

  T['text-diff'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).textDiff) || {};
    var aEl = $(root, 'df-a');
    var bEl = $(root, 'df-b');
    var caseEl = $(root, 'df-case');
    var spaceEl = $(root, 'df-space');
    var blankEl = $(root, 'df-blank');
    var out = $(root, 'df-out');
    var codeOut = $(root, 'df-unified');

    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function update() {
      var aText = aEl.value, bText = bEl.value;
      out.textContent = '';
      codeOut.textContent = '';
      if (!aText && !bText) { out.textContent = COPY.empty || ''; return; }
      var script = DIFF.diff(aText, bText, {
        ignoreCase: caseEl.checked, ignoreSpace: spaceEl.checked, ignoreBlank: blankEl.checked,
      });
      if (script.tooBig) {
        out.textContent = tpl(COPY.tooBig || '', { n: script.cap });
        return;
      }
      var added = 0, removed = 0, same = 0;
      script.lines.forEach(function (l) {
        if (l.t === 'add') added++;
        else if (l.t === 'del') removed++;
        else same++;
      });
      if (!added && !removed) { out.textContent = COPY.identical || ''; return; }

      var summary = el('p', 'tool-note');
      summary.textContent = tpl(COPY.summary || '', { a: added, d: removed, s: same });
      out.appendChild(summary);

      var aLine = 0, bLine = 0;
      var block = el('div', 'diff-block');
      script.lines.forEach(function (l) {
        var row = el('div', 'diff-row ' + l.t);
        if (l.t === 'same') { aLine++; bLine++; }
        else if (l.t === 'del') { aLine++; }
        else { bLine++; }
        row.appendChild(el('span', 'diff-n', l.t === 'add' ? '' : String(aLine)));
        row.appendChild(el('span', 'diff-n', l.t === 'del' ? '' : String(bLine)));
        row.appendChild(el('span', 'diff-mark', l.t === 'add' ? '+' : l.t === 'del' ? '−' : ' '));
        row.appendChild(el('span', 'diff-line', l.s === '' ? ' ' : l.s));
        block.appendChild(row);
      });
      out.appendChild(block);

      codeOut.textContent = DIFF.unified(script.lines, aText.split('\n').length, bText.split('\n').length);
      var unifiedHead = root.querySelector('#df-unified-head');
      if (unifiedHead) unifiedHead.textContent = COPY.unifiedHead || '';
    }
    [aEl, bEl, caseEl, spaceEl, blankEl].forEach(function (node) {
      node.addEventListener('input', update);
      node.addEventListener('change', update);
    });
    update();
  };

  // ---------------------------------------------------------- markdown to HTML
  // Exported for tests: a fixed document must produce a fixed string, including
  // the escaped hostile cases. The parser is a single left-to-right inline scan
  // plus a line-based block pass — no stacked regex replaces, no raw HTML.
  var MD = window.T4M_MD = (function () {
    var CAP = 50000;
    var SAFE = { 'http:': 1, 'https:': 1, 'mailto:': 1, 'tel:': 1 };

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // A destination is allowed only when it names http, https, mailto or tel.
    // Relative paths are refused as well: the output is meant to be pasted into
    // an unknown page, so a path that only works on the source site is a bug.
    function destination(raw) {
      var s = String(raw == null ? '' : raw).trim();
      if (!s) return { bad: true };
      var scheme = /^([a-z][a-z0-9+.-]*):/i.exec(s);
      if (!scheme) return { blocked: 'relative' };
      if (!SAFE[scheme[1].toLowerCase() + ':']) return { blocked: scheme[1].toLowerCase() };
      try { new URL(s); } catch (e) { return { bad: true }; }
      return { href: s };
    }

    // True when the delimiter at `at` sits inside a run longer than one, so it
    // belongs to a strong delimiter rather than to emphasis. Without this,
    // "*a **b** c*" closes the italic on the first star of "**b**".
    function inRun(src, at, ch) {
      return src[at - 1] === ch || src[at + 1] === ch;
    }

    function findEmClose(src, from, ch) {
      var at = from;
      while ((at = src.indexOf(ch, at)) !== -1) {
        var slashes = 0;
        for (var k = at - 1; k >= 0 && src[k] === '\\'; k--) slashes++;
        if (slashes % 2 === 0 && !inRun(src, at, ch)) {
          var before = src[at - 1] || '';
          if (before !== ' ' && before !== '\n') return at;
        }
        at++;
      }
      return -1;
    }

    // A strong closer is exactly two delimiters; three or more is a mixed
    // strong+emphasis run, which this subset leaves literal rather than guessing.
    function findStrongClose(src, from, ch) {
      var at = from;
      while ((at = src.indexOf(ch + ch, at)) !== -1) {
        var slashes = 0;
        for (var k = at - 1; k >= 0 && src[k] === '\\'; k--) slashes++;
        if (slashes % 2 === 0 && src[at - 1] !== ' ' && src[at + 2] !== ch) return at;
        at++;
      }
      return -1;
    }

    // [text](dest "title") or ![alt](src) — returns null when the brackets do
    // not close, so a stray "[" stays literal instead of swallowing the rest.
    function linkAt(src, at) {
      if (src[at] !== '[') return null;
      var depth = 0, i = at;
      for (; i < src.length; i++) {
        if (src[i] === '\\') { i++; continue; }
        if (src[i] === '[') depth++;
        else if (src[i] === ']') { depth--; if (!depth) break; }
      }
      if (depth !== 0 || src[i + 1] !== '(') return null;
      // Balanced parentheses: "[x](https://en.wikipedia.org/wiki/Foo_(bar))"
      // closes on the second ")", not the one inside the path.
      var close = -1, pdepth = 1;
      for (var p = i + 2; p < src.length; p++) {
        if (src[p] === '\\') { p++; continue; }
        if (src[p] === '(') pdepth++;
        else if (src[p] === ')') { pdepth--; if (!pdepth) { close = p; break; } }
      }
      if (close === -1) return null;
      var inner = src.slice(i + 2, close).trim();
      var parts = inner.split(/\s+/);
      var dest = parts[0] || '';
      var title = parts.length > 1 ? parts.slice(1).join(' ').replace(/^["'(]|["')]$/g, '') : '';
      if (dest[0] === '<' && dest[dest.length - 1] === '>') dest = dest.slice(1, -1);
      return { text: src.slice(at + 1, i), dest: dest, title: title, end: close + 1 };
    }

    function inline(src, state, depth) {
      depth = depth || 0;
      if (depth > 6) return esc(src);
      var out = '', buf = '';
      function flush() { if (buf) { out += esc(buf); buf = ''; } }
      var i = 0;
      while (i < src.length) {
        var ch = src[i];

        if (ch === '\\' && src[i + 1] === '\n') { flush(); out += '<br>\n'; i += 2; continue; }
        if (ch === '\\' && i + 1 < src.length && /[\\`*_{}\[\]()#+\-.!>~|]/.test(src[i + 1])) {
          buf += src[i + 1]; i += 2; continue;
        }
        if (ch === ' ' && src[i + 1] === ' ' ) {
          var j = i;
          while (src[j] === ' ') j++;
          if (src[j] === '\n') { flush(); out += '<br>\n'; i = j + 1; continue; }
        }
        if (ch === '`') {
          var run = 1;
          while (src[i + run] === '`') run++;
          var close = src.indexOf(new Array(run + 1).join('`'), i + run);
          if (close !== -1) {
            flush();
            var code = src.slice(i + run, close);
            if (code.length > 1 && code[0] === ' ' && code[code.length - 1] === ' ') code = code.slice(1, -1);
            out += '<code>' + esc(code) + '</code>';
            i = close + run; continue;
          }
        }
        if (ch === '!' && src[i + 1] === '[') {
          var img = linkAt(src, i + 1);
          if (img) {
            flush();
            var srcUrl = destination(img.dest);
            if (srcUrl.href) {
              out += '<img src="' + esc(srcUrl.href) + '" alt="' + esc(img.text) + '"' +
                (img.title ? ' title="' + esc(img.title) + '"' : '') + '>';
            } else if (srcUrl.blocked) {
              out += esc(String(state.copy.blocked || '').replace('{proto}', srcUrl.blocked));
            } else {
              out += esc(state.copy.badUrl || '');
            }
            i = img.end; continue;
          }
        }
        if (ch === '[') {
          var link = linkAt(src, i);
          if (link) {
            flush();
            var url = destination(link.dest);
            if (url.href) {
              out += '<a href="' + esc(url.href) + '"' + (link.title ? ' title="' + esc(link.title) + '"' : '') +
                '>' + inline(link.text, state, depth + 1) + '</a>';
            } else if (url.blocked) {
              out += esc(String(state.copy.blocked || '').replace('{proto}', url.blocked));
            } else {
              out += esc(state.copy.badUrl || '');
            }
            i = link.end; continue;
          }
        }
        if (ch === '*' || ch === '_') {
          var runLength = 1;
          while (src[i + runLength] === ch) runLength++;
          var prevCh = i === 0 ? '' : src[i - 1];
          var afterRun = src[i + runLength] || '';
          var openerOk = prevCh !== ch && afterRun !== '' && afterRun !== ' ' && afterRun !== '\n';

          if (runLength >= 2 && openerOk) {
            var endStrong = findStrongClose(src, i + 2, ch);
            if (endStrong > i + 2) {
              flush();
              out += '<strong>' + inline(src.slice(i + 2, endStrong), state, depth + 1) + '</strong>';
              i = endStrong + 2; continue;
            }
          }
          // "_" inside a word is part of the word (snake_case), not emphasis.
          if (runLength === 1 && openerOk && !(ch === '_' && /[A-Za-z0-9]/.test(prevCh))) {
            var endEm = findEmClose(src, i + 1, ch);
            if (endEm > i + 1 && (ch !== '_' || !/[A-Za-z0-9]/.test(src[endEm + 1] || ''))) {
              flush();
              out += '<em>' + inline(src.slice(i + 1, endEm), state, depth + 1) + '</em>';
              i = endEm + 1; continue;
            }
          }
        }
        buf += ch; i++;
      }
      flush();
      return out;
    }

    function isBlockStart(line) {
      return /^\s{0,3}```/.test(line) ||
        /^\s{0,3}#{1,6}\s+/.test(line) ||
        /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line) ||
        /^\s{0,3}>/.test(line) ||
        /^(\s*)([-*+]|\d{1,9}[.)])\s+/.test(line);
    }

    function blocks(lines, state) {
      var out = [];
      var i = 0;
      while (i < lines.length) {
        var line = lines[i];
        if (/^\s*$/.test(line)) { i++; continue; }

        var fence = /^\s{0,3}(```+)\s*([A-Za-z0-9+#._-]*)\s*$/.exec(line);
        if (fence) {
          var ticks = fence[1], lang = fence[2], body = [];
          i++;
          var closed = false;
          while (i < lines.length) {
            if (new RegExp('^\\s{0,3}' + ticks + '\\s*$').test(lines[i])) { closed = true; i++; break; }
            body.push(lines[i]); i++;
          }
          if (!closed) state.warnings.push('unclosed');
          out.push("<pre><code" + (lang ? ' class="language-' + esc(lang.toLowerCase()) + '"' : '') + '>' +
            esc(body.join('\n')) + '</code></pre>');
          continue;
        }

        var head = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
        if (head) {
          var lv = head[1].length;
          out.push('<h' + lv + '>' + inline(head[2], state) + '</h' + lv + '>');
          i++; continue;
        }

        if (/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

        if (/^\s{0,3}>/.test(line)) {
          var quote = [];
          while (i < lines.length && /^\s{0,3}>/.test(lines[i])) {
            quote.push(lines[i].replace(/^\s{0,3}> ?/, ''));
            i++;
          }
          out.push('<blockquote>\n' + blocks(quote, state) + '\n</blockquote>');
          continue;
        }

        var first = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/.exec(line);
        if (first) {
          var ordered = /\d/.test(first[2]);
          var items = [];
          while (i < lines.length) {
            var item = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/.exec(lines[i]);
            if (!item) break;
            var indent = item[1].length;
            var itemOrdered = /\d/.test(item[2]);
            if (indent >= 2 && items.length) {
              if (indent >= 4) state.deep++;
              items[items.length - 1].children.push({ text: item[3], ordered: itemOrdered });
              i++; continue;
            }
            if (itemOrdered !== ordered && items.length) break;
            items.push({ text: item[3], children: [] });
            i++;
          }
          var tag = ordered ? 'ol' : 'ul';
          var html = '<' + tag + '>';
          items.forEach(function (it) {
            html += '<li>' + inline(it.text, state);
            if (it.children.length) {
              var ctag = it.children[0].ordered ? 'ol' : 'ul';
              html += '<' + ctag + '>' + it.children.map(function (c) {
                return '<li>' + inline(c.text, state) + '</li>';
              }).join('') + '</' + ctag + '>';
            }
            html += '</li>';
          });
          out.push(html + '</' + tag + '>');
          continue;
        }

        var para = [];
        while (i < lines.length && !/^\s*$/.test(lines[i]) && !(para.length && isBlockStart(lines[i]))) {
          para.push(lines[i]); i++;
        }
        if (!para.length) { para.push(lines[i]); i++; }
        out.push('<p>' + inline(para.join('\n'), state) + '</p>');
      }
      return out.join('\n');
    }

    function render(source, copy) {
      var text = String(source == null ? '' : source).replace(/\r\n?/g, '\n');
      var truncated = false;
      if (text.length > CAP) { text = text.slice(0, CAP); truncated = true; }
      var state = { warnings: [], deep: 0, copy: copy || {} };
      // A final newline terminates the last line; it is not an extra empty
      // line. Splitting it out would append a blank line to an unclosed fence.
      var lines = (text.charAt(text.length - 1) === '\n' ? text.slice(0, -1) : text).split('\n');
      var html = blocks(lines, state);
      return {
        html: html,
        warnings: state.warnings,
        deep: state.deep,
        truncated: truncated,
        stats: {
          words: (text.trim() ? text.trim().split(/\s+/).length : 0),
          lines: text ? lines.length : 0,
          chars: text.length,
        },
      };
    }

    return { render: render, escape: esc, destination: destination };
  })();

  T['markdown-to-html'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).mdHtml) || {};
    var input = $(root, 'md-in');
    var wrapEl = $(root, 'md-wrap');
    var statsEl = $(root, 'md-stats');
    var outEl = $(root, 'md-out');
    var frame = $(root, 'md-preview');

    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }

    function update() {
      var src = input ? input.value : '';
      var result = MD.render(src, COPY);
      var notes = [];
      if (statsEl) {
        statsEl.textContent = tpl(COPY.stats || '', {
          w: result.stats.words, l: result.stats.lines, c: result.stats.chars,
        });
      }
      if (result.truncated) notes.push(tpl(COPY.truncated || '', { n: src.length, cap: 50000 }));
      if (result.warnings.indexOf('unclosed') !== -1) notes.push(COPY.unclosed || '');
      if (result.deep) notes.push(tpl(COPY.deepList || '', { n: result.deep }));
      var html = result.html;
      if (!html.trim()) {
        if (outEl) outEl.textContent = '';
        if (frame) frame.srcdoc = '';
        if (statsEl) statsEl.textContent = COPY.empty || '';
        return;
      }
      if (wrapEl && wrapEl.checked) html = '<article>\n' + html + '\n</article>';
      if (notes.length) html += '\n<!-- ' + notes.join(' ') + ' -->';
      if (outEl) outEl.textContent = html;
      if (frame) frame.srcdoc = html;
    }

    if (input) {
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    }
    if (wrapEl) {
      wrapEl.addEventListener('input', update);
      wrapEl.addEventListener('change', update);
    }
    update();
  };

  // ---------------------------------------------------------- email validator
  // Exported so tests can assert the exact rule that fails, not just a red box.
  var EMAIL = window.T4M_EMAIL = (function () {
    var MAX_TOTAL = 254, MAX_LOCAL = 64, MAX_DOMAIN = 253, MAX_BATCH = 1000, MAX_LABEL = 63;
    var LOCAL_CHARS = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;

    function toAscii(domain) {
      if (!/[^\x00-\x7F]/.test(domain)) return null;
      try {
        var host = new URL('http://' + domain + '/').hostname;
        return host && host !== domain ? host : null;
      } catch (e) { return null; }
    }

    function check(raw) {
      var email = String(raw == null ? '' : raw).trim();
      if (!email) return { valid: false, code: 'empty' };
      if (/[\x00-\x1F\x7F]/.test(email)) return { valid: false, code: 'control' };
      if (/\s/.test(email)) return { valid: false, code: 'space' };
      if (email.length > MAX_TOTAL) return { valid: false, code: 'long' };

      var at = email.indexOf('@');
      if (at === -1) return { valid: false, code: 'noAt' };
      if (at !== email.lastIndexOf('@')) return { valid: false, code: 'multiAt' };

      var local = email.slice(0, at);
      var domain = email.slice(at + 1);
      var punycode = null;

      if (!local) return { valid: false, code: 'noLocal' };
      if (!domain) return { valid: false, code: 'noDomain' };
      if (local.charAt(0) === '"') return { valid: false, code: 'quoted' };
      if (local.length > MAX_LOCAL) return { valid: false, code: 'localLong' };
      if (/[^\x00-\x7F]/.test(local)) return { valid: false, code: 'nonAsciiLocal' };
      if (!LOCAL_CHARS.test(local)) return { valid: false, code: 'localChars' };
      if (local.charAt(0) === '.' || local.charAt(local.length - 1) === '.') return { valid: false, code: 'localDot' };
      if (local.indexOf('..') !== -1) return { valid: false, code: 'localDots' };

      if (/[^\x00-\x7F]/.test(domain)) {
        punycode = toAscii(domain);
        if (!punycode) return { valid: false, code: 'labelChars' };
        domain = punycode;
      }
      if (domain.length > MAX_DOMAIN) return { valid: false, code: 'domainLong' };
      if (domain.charAt(0) === '.' || domain.charAt(domain.length - 1) === '.') return { valid: false, code: 'domainDot' };
      if (domain.indexOf('..') !== -1) return { valid: false, code: 'domainDots' };
      if (domain.indexOf('.') === -1) return { valid: false, code: 'noDot' };

      var labels = domain.split('.');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        if (!label) return { valid: false, code: 'domainDots' };
        if (label.length > MAX_LABEL) return { valid: false, code: 'labelLong' };
        if (!/^[A-Za-z0-9-]+$/.test(label)) return { valid: false, code: 'labelChars' };
        if (label.charAt(0) === '-' || label.charAt(label.length - 1) === '-') return { valid: false, code: 'labelHyphen' };
        if (label.indexOf('--') !== -1 && !/^xn--/i.test(label)) return { valid: false, code: 'labelDoubleHyphen' };
      }

      var tld = labels[labels.length - 1];
      if (tld.length < 2) return { valid: false, code: 'tldShort' };
      if (!/^[A-Za-z]+$/.test(tld) && !/^xn--[A-Za-z0-9-]+$/i.test(tld)) return { valid: false, code: 'tldChars' };

      return {
        valid: true, local: local, domain: domain, tld: tld, punycode: punycode,
      };
    }

    function parseBatch(text) {
      var raw = String(text == null ? '' : text).trim();
      if (!raw) return { entries: [], skipped: 0, over: 0 };
      var parts = raw.split(/[\n,;]+/).map(function (p) { return p.trim(); });
      var entries = [];
      var skipped = 0;
      parts.forEach(function (p) {
        if (!p) { skipped++; return; }
        entries.push(p);
      });
      return {
        entries: entries.slice(0, MAX_BATCH),
        skipped: skipped,
        over: Math.max(0, entries.length - MAX_BATCH),
      };
    }

    return { check: check, parseBatch: parseBatch, toAscii: toAscii };
  })();

  T['email-validator'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).emailValid) || {};
    var single = $(root, 'em-mode-single');
    var batch = $(root, 'em-mode-batch');
    var input = $(root, 'em-in');
    var mxBtn = $(root, 'em-mx-go');
    var statsEl = $(root, 'em-stats');
    var outEl = $(root, 'em-out');

    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function reason(code) { return ((COPY.reasons || {})[code]) || COPY.reasons.total || ''; }
    function isBatch() { return !!(batch && batch.checked); }

    function verdictText(result) {
      if (result.valid) return COPY.valid || '';
      return COPY.invalid + ' — ' + reason(result.code) + '.';
    }

    function partsGrid(result) {
      var grid = el('div', 'kpi-strip');
      [['local', COPY.partsLocal, result.local], ['domain', COPY.partsDomain, result.domain], ['tld', COPY.partsTld, result.tld]]
        .forEach(function (row) {
          var tile = el('div', 'stat-tile');
          tile.appendChild(el('span', 'stat-tile-label', row[1]));
          tile.appendChild(el('span', 'stat-tile-value', row[2] || '—'));
          grid.appendChild(tile);
        });
      return grid;
    }

    function renderSingle() {
      var value = input ? input.value : '';
      if (!String(value).trim()) {
        if (outEl) outEl.textContent = COPY.emptySingle || '';
        if (statsEl) statsEl.textContent = '';
        return;
      }
      var result = EMAIL.check(value);
      if (!outEl) return;
      outEl.textContent = '';
      var head = el('p', 'email-verdict ' + (result.valid ? 'good' : 'bad'));
      head.textContent = verdictText(result);
      outEl.appendChild(head);
      if (result.valid) {
        outEl.appendChild(partsGrid(result));
        if (result.punycode) {
          var note = el('p', 'tool-note');
          note.textContent = tpl(COPY.punycode || '', { ascii: result.punycode });
          outEl.appendChild(note);
        }
      }
      if (statsEl) statsEl.textContent = '';
    }

    function renderBatch() {
      var parsed = EMAIL.parseBatch(input ? input.value : '');
      if (!outEl) return;
      outEl.textContent = '';
      if (!parsed.entries.length) {
        outEl.textContent = COPY.emptyBatch || '';
        if (statsEl) statsEl.textContent = '';
        return;
      }
      var valid = 0, invalid = 0;
      var table = el('div', 'table-wrap');
      var t = el('table', 'article-table email-table');
      var thead = el('thead');
      var hr = el('tr');
      [COPY.tableAddress, COPY.tableVerdict, COPY.tableReason].forEach(function (h) {
        var th = el('th', null, h || '');
        th.setAttribute('scope', 'col');
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      t.appendChild(thead);
      var tbody = el('tbody');
      parsed.entries.forEach(function (address) {
        var result = EMAIL.check(address);
        if (result.valid) valid++; else invalid++;
        var row = el('tr');
        row.appendChild(el('td', 'email-address', address));
        var cell = el('td');
        var chip = el('span', 'chip ' + (result.valid ? 'good' : 'bad'), result.valid ? COPY.valid : COPY.invalid);
        cell.appendChild(chip);
        row.appendChild(cell);
        row.appendChild(el('td', null, result.valid ? '' : reason(result.code)));
        tbody.appendChild(row);
      });
      t.appendChild(tbody);
      table.appendChild(t);
      outEl.appendChild(table);
      if (statsEl) {
        statsEl.textContent = tpl(COPY.summary || '', { valid: valid, invalid: invalid, skipped: parsed.skipped });
        if (parsed.over) statsEl.textContent += ' ' + tpl(COPY.batchCap || '', { n: 1000 });
      }
    }

    function update() {
      if (isBatch()) renderBatch(); else renderSingle();
      if (mxBtn) mxBtn.hidden = isBatch();
    }

    function lookupMx() {
      var result = EMAIL.check(input ? input.value : '');
      if (!result.valid || !outEl) return;
      var line = el('p', 'tool-note');
      line.textContent = tpl(COPY.mxPending || '', { domain: result.domain });
      outEl.appendChild(line);
      if (typeof fetch !== 'function') {
        line.textContent = tpl(COPY.mxFail || '', { msg: COPY.fetchUnavailable || '' });
        return;
      }
      fetch('https://dns.google/resolve?name=' + encodeURIComponent(result.domain) + '&type=MX')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var answers = (data && data.Answer ? data.Answer : []).filter(function (a) { return a.type === 15; });
          line.textContent = answers.length
            ? tpl(COPY.mxFound || '', { n: answers.length, domain: result.domain })
            : tpl(COPY.mxNone || '', { domain: result.domain });
        })
        .catch(function (err) {
          line.textContent = tpl(COPY.mxFail || '', { msg: (err && err.message) || COPY.networkError || '' });
        });
    }

    [single, batch].forEach(function (r) {
      if (r) r.addEventListener('change', update);
    });
    if (input) {
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    }
    if (mxBtn) mxBtn.addEventListener('click', lookupMx);
    update();
  };

})();

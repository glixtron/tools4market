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

      var stats = $(root, 'kd-stats');
      stats.textContent = '';
      stats.appendChild(el('span', null, 'Words: '));
      stats.appendChild(el('strong', null, String(words.length)));
      var uniq = new Set(words);
      stats.appendChild(el('span', null, 'Unique: '));
      stats.appendChild(el('strong', null, String(uniq.size)));
      stats.appendChild(el('span', null, 'Reading time: '));
      stats.appendChild(el('strong', null, Math.max(1, Math.ceil(words.length / 200)) + ' min'));
      stats.appendChild(!words.length ? chip('warn', 'paste text to analyse')
        : (grams[1].size ? chip('good', 'term frequency calculated') : chip('warn', 'only stop words found')));

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

      out.textContent = '';
      if (!words.length) {
        out.appendChild(el('p', null, copy.pastedText || 'Paste text here; analysis runs in your browser.'));
        return;
      }
      if (!singleWords.length && stop) {
        out.appendChild(el('p', null, 'Only stop words were found — turn off the stop-word filter above, or add more content words.'));
        return;
      }
      [1, 2, 3].forEach(function (n) {
        if (counts[n] > 0) out.appendChild(table(n, grams[n]));
      });
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

  // ---------------------------------------------------------- URL encoder/decoder
  T['url-encoder-decoder'] = function (root) {
    var out = $(root, 'ued-out');
    var input = $(root, 'ued-text');
    function encode(t) { return encodeURIComponent(t).replace(/%20/g, '+'); }
    function decode(t) { return decodeURIComponent(t.replace(/\+/g, ' ')); }
    function update(mode) {
      var val = input.value;
      if (mode === 'encode') out.textContent = encode(val);
      else if (mode === 'decode') out.textContent = decode(val);
      else {
        try { out.textContent = decode(val); }
        catch (e) { out.textContent = encode(val); }
      }
    }
    for (var i = 0; i < 2; i++) (function (b) {
      b.addEventListener('click', function () { update(b.dataset.ued); });
    })(root.querySelector('[data-ued="' + (i ? 'decode' : 'encode') + '"]'));
    root.addEventListener('input', function () { update(); });
    update();
  };
})();

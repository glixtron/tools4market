// Tools4Market — runtime logic: AI Search & Crawler tools
(function () {
  'use strict';
  var T = window.T4M_TOOLS = window.T4M_TOOLS || {};
  function $(root, id) { return root.querySelector('#' + id); }

  var TRAINING = ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'CCBot', 'Bytespider', 'Applebot-Extended', 'Meta-ExternalAgent', 'ImagesiftBot', 'Diffbot'];
  var SEARCH = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-User', 'Claude-SearchBot', 'YouBot', 'Applebot'];

  function buildRobots(blocked, sitemap) {
    var lines = ['User-agent: *', 'Allow: /', ''];
    blocked.forEach(function (bot) {
      lines.push('User-agent: ' + bot);
      lines.push('Disallow: /');
      lines.push('');
    });
    if (sitemap) lines.push('Sitemap: ' + sitemap);
    return lines.join('\n');
  }

  function wireBotTool(root, cfg) {
    var out = $(root, cfg.out);
    var sitemap = $(root, cfg.sitemap);

    function blocked() {
      return Array.prototype.slice.call(root.querySelectorAll('input[data-bot]:checked'))
        .map(function (c) { return c.getAttribute('data-bot'); });
    }
    function update() {
      var b = blocked();
      out.textContent = buildRobots(b, sitemap.value.trim());
      if (cfg.count) {
        $(root, cfg.count).textContent = 'Blocking ' + b.length + ' of ' + (TRAINING.length + SEARCH.length) + ' known AI crawlers.';
      }
    }
    function setChecked(list, on) {
      root.querySelectorAll('input[data-bot]').forEach(function (c) {
        if (list.indexOf(c.getAttribute('data-bot')) !== -1) c.checked = on;
      });
    }

    root.addEventListener('input', update);
    root.addEventListener('change', update);

    if (cfg.presets) {
      var presets = cfg.presets;
      root.addEventListener('click', function (e) {
        if (e.target.closest('#' + presets.all)) { setChecked(TRAINING.concat(SEARCH), true); update(); }
        else if (e.target.closest('#' + presets.train)) { setChecked(TRAINING, true); setChecked(SEARCH, false); update(); }
        else if (e.target.closest('#' + presets.none)) { setChecked(TRAINING.concat(SEARCH), false); update(); }
      });
    }
    update();
  }

  // ---------------------------------------------------------- robots.txt generator
  T['robots-txt-generator'] = function (root) {
    wireBotTool(root, { out: 'rb-out', sitemap: 'rb-sitemap' });
  };

  // ---------------------------------------------------------- ai crawler blocker
  T['ai-crawler-blocker'] = function (root) {
    wireBotTool(root, {
      out: 'ab-out', sitemap: 'ab-sitemap', count: 'ab-count',
      presets: { all: 'ab-blockall', train: 'ab-blocktrain', none: 'ab-allowall' },
    });
  };

  // ---------------------------------------------------------- llms.txt generator
  T['llms-txt-generator'] = function (root) {
    var out = $(root, 'll-out');
    function titleFromUrl(url) {
      try {
        var u = new URL(url);
        var seg = u.pathname.split('/').filter(Boolean).pop() || u.hostname;
        return seg.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      } catch (e) { return url; }
    }
    function update() {
      var name = $(root, 'll-name').value.trim();
      var desc = $(root, 'll-desc').value.trim();
      var base = $(root, 'll-url').value.trim();
      var lines = [];
      if (name) lines.push('# ' + name);
      else if (base) { try { lines.push('# ' + (new URL(base).hostname.replace(/^www\./, ''))); } catch (e) { } }
      if (desc) { if (lines.length) lines.push(''); lines.push('> ' + desc); }
      var entries = [];
      $(root, 'll-pages').value.split('\n').forEach(function (raw) {
        var line = raw.trim();
        if (!line) return;
        var parts = line.split('|').map(function (p) { return p.trim(); });
        var url = parts[0];
        if (!url || !/^https?:\/\//i.test(url)) return;
        try { new URL(url); } catch (e2) { return; } // reject malformed https://… values
        var title = parts[1] || titleFromUrl(url);
        var noteTxt = parts[2] || '';
        entries.push('- [' + title + '](' + url + ')' + (noteTxt ? ': ' + noteTxt : ''));
      });
      if (entries.length) {
        lines.push('', '## Pages', '');
        lines = lines.concat(entries);
      }
      out.textContent = lines.join('\n') || 'Fill in the fields above to generate llms.txt.';
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- robots.txt tester
  T['robots-txt-tester'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).robotst) || {};
    var ta = $(root, 'rt-robots');
    var pathIn = $(root, 'rt-path');
    var botSel = $(root, 'rt-bot');
    var custom = $(root, 'rt-custom');
    var verdict = $(root, 'rt-verdict');
    var details = $(root, 'rt-details');
    var stats = $(root, 'rt-stats');

    function node(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    }
    function tpl(str, map) {
      var s = String(str);
      Object.keys(map).forEach(function (k) { s = s.split('{' + k + '}').join(map[k]); });
      return s;
    }
    function botName() {
      var v = botSel.value;
      if (v === (COPY.uaOther || 'other')) return (custom.value || '').trim().toLowerCase();
      return v;
    }
    function testUrl() {
      var raw = (pathIn.value || '').trim() || '/';
      if (!/^https?:\/\//i.test(raw)) raw = 'https://robots-test.local' + (raw.charAt(0) === '/' ? raw : '/' + raw);
      return raw;
    }

    function update() {
      var text = ta.value;
      verdict.textContent = '';
      details.textContent = '';
      if (!text.trim()) { stats.textContent = COPY.empty || ''; return; }
      var bot = botName() || 'googlebot';
      var url = testUrl();
      var res = window.T4M_INSPECT.parseRobotsTxt(text, url, bot);
      var path = url.replace(/^https?:\/\/[^/]+/, '') || '/';
      verdict.appendChild(node('span', 'chip ' + (res.allowed ? 'good' : 'bad'),
        res.allowed ? tpl(COPY.verdictAllow || 'ALLOWED for {bot}', { bot: bot }) : tpl(COPY.verdictBlock || 'BLOCKED for {bot}', { bot: bot })));
      verdict.appendChild(node('p', null, tpl(COPY.pathNote || 'Tested path: {v}', { v: path })));
      verdict.appendChild(node('p', null, res.matched
        ? tpl(COPY.matchedRule || 'Matched rule: {v}', { v: (res.matched.allow ? 'Allow: ' : 'Disallow: ') + res.matched.path })
        : (COPY.noMatch || 'No rule matches this path — with no matching Disallow, crawlers may fetch it.')));

      details.appendChild(node('p', 'rt-head', tpl(COPY.sitemapHead || 'Sitemap declarations ({n})', { n: res.sitemapUrls.length })));
      if (res.sitemapUrls.length) {
        var ul = node('ul', 'rt-list');
        res.sitemapUrls.forEach(function (u) { ul.appendChild(node('li', null, u)); });
        details.appendChild(ul);
      } else {
        details.appendChild(node('p', null, COPY.noSitemaps || 'No Sitemap lines are declared in this file.'));
      }

      // AI crawler coverage — which known training/search bots have their own group?
      var agents = [];
      text.split(/\r?\n/).forEach(function (line) {
        var m = /^\s*user-agent\s*:\s*(\S+)/i.exec(line.replace(/#.*$/, ''));
        if (m) agents.push(m[1].toLowerCase());
      });
      var present = [], absent = [];
      TRAINING.concat(SEARCH).forEach(function (b) {
        (agents.indexOf(b.toLowerCase()) !== -1 ? present : absent).push(b);
      });
      details.appendChild(node('p', 'rt-head', COPY.aiHead || 'AI crawler coverage in this file'));
      var aiUl = node('ul', 'rt-list');
      present.forEach(function (b) { aiUl.appendChild(node('li', null, tpl(COPY.aiGroup || '{v}: dedicated User-agent group found.', { v: b }))); });
      if (absent.length) aiUl.appendChild(node('li', null, tpl(COPY.aiNoGroup || '{v}: no dedicated group — only the * rules apply.', { v: absent.join(', ') })));
      details.appendChild(aiUl);

      var lines = text.split(/\r?\n/);
      var syn = [];
      var seenAgent = false;
      var hasGroup = false;
      lines.forEach(function (rawLine, ix) {
        var line = rawLine.replace(/#.*$/, '').trim();
        if (!line) return;
        var m = /^([a-zA-Z-]+)\s*:/.exec(line);
        if (!m) return;
        var key = m[1].toLowerCase();
        if (key === 'user-agent') { seenAgent = true; hasGroup = true; return; }
        if (key === 'allow' || key === 'disallow') {
          if (!seenAgent) syn.push(tpl(COPY.synRuleNoAgent || 'Line {i}: a rule appears before any User-agent line.', { i: ix + 1 }));
          return;
        }
        if (key === 'sitemap' || key === 'crawl-delay' || key === 'host') return;
        syn.push(tpl(COPY.synUnknown || 'Line {i}: unknown directive "{v}".', { i: ix + 1, v: m[1] }));
      });
      if (!hasGroup) syn.push(COPY.synNoGroups || 'No User-agent groups found — as written, this file allows every crawler everywhere.');
      details.appendChild(node('p', 'rt-head', COPY.synHead || 'Syntax notes'));
      var synUl = node('ul', 'rt-list');
      (syn.length ? syn : [COPY.synOk || 'No structural problems found in this file.']).forEach(function (s) { synUl.appendChild(node('li', null, s)); });
      details.appendChild(synUl);
      stats.textContent = '';
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    var run = $(root, 'rt-run');
    if (run) run.addEventListener('click', update);
    update();
  };
})();

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
})();

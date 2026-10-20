// Tools4Market — runtime logic: Web & Utility tools
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

  // ---------------------------------------------------------- .htaccess redirect generator
  T['htaccess-redirect-generator'] = function (root) {
    var mode = $(root, 'ht-mode');
    var domain = $(root, 'ht-domain');
    var redirectWrap = $(root, 'ht-redirects');
    var rows = $(root, 'ht-rows');
    var out = $(root, 'ht-out');

    function makeRow(oldV, newV, status) {
      var div = el('div', 'dyn-row ht-row');
      var i1 = el('input'); i1.type = 'text'; i1.className = 'ht-old'; i1.placeholder = '/old-path'; i1.value = oldV || ''; i1.setAttribute('aria-label', 'Old path (starts with /)');
      var i2 = el('input'); i2.type = 'url'; i2.className = 'ht-new dyn-second'; i2.placeholder = 'https://example.com/new-path'; i2.value = newV || ''; i2.setAttribute('aria-label', 'New URL');
      var sel = el('select'); sel.className = 'ht-status'; sel.setAttribute('aria-label', 'Redirect status');
      [['301', '301 — permanent'], ['302', '302 — temporary']].forEach(function (o) {
        var opt = el('option', null, o[1]); opt.value = o[0];
        if (o[0] === (status || '301')) opt.selected = true;
        sel.appendChild(opt);
      });
      var del = el('button', 'btn-icon row-del', '×'); del.type = 'button'; del.title = 'Remove row';
      div.appendChild(i1); div.appendChild(i2); div.appendChild(sel); div.appendChild(del);
      return div;
    }

    rows.appendChild(makeRow('/old-page', 'https://example.com/new-page', '301'));
    rows.appendChild(makeRow('/2023-report', 'https://example.com/reports/2023', '301'));

    function update() {
      var m = mode.value;
      var d = domain.value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      redirectWrap.style.display = (m === 'redirects') ? '' : 'none';
      var rules = [];
      if (m === 'https') {
        if (!d) { out.textContent = 'Enter your domain (e.g. example.com) to generate the force-HTTPS rules.'; return; }
        rules.push('RewriteEngine On', 'RewriteCond %{HTTPS} off', 'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      } else if (m === 'www') {
        if (!d) { out.textContent = 'Enter your domain (e.g. example.com) to generate the www rules.'; return; }
        rules.push('RewriteEngine On', 'RewriteCond %{HTTP_HOST} ^' + d.replace(/\./g, '\\.') + ' [NC]', 'RewriteRule ^(.*)$ https://www.' + d + '/$1 [L,R=301]');
      } else if (m === 'nonwww') {
        if (!d) { out.textContent = 'Enter your domain (e.g. example.com) to generate the non-www rules.'; return; }
        rules.push('RewriteEngine On', 'RewriteCond %{HTTP_HOST} ^www\\.' + d.replace(/\./g, '\\.') + ' [NC]', 'RewriteRule ^(.*)$ https://' + d + '/$1 [L,R=301]');
      } else {
        var count = 0;
        Array.prototype.forEach.call(rows.querySelectorAll('.ht-row'), function (r) {
          var oldP = r.querySelector('.ht-old').value.trim();
          var newU = r.querySelector('.ht-new').value.trim();
          var st = r.querySelector('.ht-status').value;
          if (oldP && newU) {
            rules.push('Redirect ' + st + ' ' + (oldP.charAt(0) === '/' ? '' : '/') + oldP + ' ' + newU);
            count++;
          }
        });
        if (!count) { out.textContent = 'Add at least one redirect (old path → new URL).'; return; }
        rules.unshift('# ' + count + ' redirect(s)');
      }
      out.textContent = rules.join('\n');
    }

    root.addEventListener('input', update);
    root.addEventListener('change', update);
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-add="ht"]')) {
        rows.appendChild(makeRow('', '', '301'));
        rows.querySelector('.ht-row:last-child .ht-old').focus();
        return;
      }
      var del = e.target.closest('.row-del');
      if (del) {
        var row = del.closest('.dyn-row');
        if (rows.children.length > 1) row.parentNode.removeChild(row);
        else Array.prototype.forEach.call(row.querySelectorAll('input'), function (i) { i.value = ''; });
        update();
      }
    });
    update();
  };

  // ---------------------------------------------------------- xml sitemap generator
  T['sitemap-generator'] = function (root) {
    var out = $(root, 'sm-out');
    var noteEl = $(root, 'sm-note');
    var xesc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); };

    function update() {
      var urls = [];
      var seen = {};
      $(root, 'sm-urls').value.split('\n').forEach(function (line) {
        var u = line.trim();
        if (!u || seen[u]) return;
        seen[u] = 1;
        urls.push(u);
      });
      var lastmod = $(root, 'sm-lastmod').value;
      var freq = $(root, 'sm-changefreq').value;
      var prio = $(root, 'sm-priority').value;

      var valid = urls.filter(function (u) { return /^https?:\/\/.+\..+/i.test(u); });
      var invalid = urls.length - valid.length;
      noteEl.textContent = valid.length
        ? (invalid ? valid.length + ' valid URL(s); ' + invalid + ' skipped (must start with http(s)://).' : valid.length + ' valid URL(s).')
        : 'Paste URLs (one per line) to generate the sitemap.';

      if (!valid.length) { out.textContent = ''; return; }
      var lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
      valid.forEach(function (u) {
        var entry = '  <url><loc>' + xesc(u) + '</loc>';
        if (lastmod) entry += '<lastmod>' + lastmod + '</lastmod>';
        if (freq) entry += '<changefreq>' + freq + '</changefreq>';
        if (prio) entry += '<priority>' + prio + '</priority>';
        entry += '</url>';
        lines.push(entry);
      });
      lines.push('</urlset>');
      out.textContent = lines.join('\n');
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- password generator
  T['password-generator'] = function (root) {
    var out = $(root, 'pw-out');
    var strength = $(root, 'pw-strength');
    var SETS = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      digits: '0123456789',
      symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~',
    };
    var AMBIGUOUS = /[l1IO0]/g;

    function pools() {
      var active = [];
      ['upper', 'lower', 'digits', 'symbols'].forEach(function (k) {
        if ($(root, 'pw-' + k).checked) {
          var s = SETS[k];
          if ($(root, 'pw-ambiguous').checked) s = s.replace(AMBIGUOUS, '');
          if (s) active.push(s);
        }
      });
      return active;
    }

    function randInt(max) {
      var a = new Uint32Array(1);
      var limit = Math.floor(0xFFFFFFFF / max) * max;
      do { crypto.getRandomValues(a); } while (a[0] >= limit);
      return a[0] % max;
    }

    function generate() {
      var len = parseInt($(root, 'pw-len').value, 10);
      if (!(len >= 8)) len = 16; // slider min is 8; treat empty/invalid as the default
      else if (len > 64) len = 64;
      $(root, 'pw-len-val').textContent = String(len);
      var active = pools();
      if (!active.length) {
        out.value = 'Select at least one character set.';
        strength.textContent = '';
        return;
      }
      var all = active.join('');
      var chars = active.map(function (s) { return s.charAt(randInt(s.length)); });
      for (var i = chars.length; i < len; i++) chars.push(all.charAt(randInt(all.length)));
      for (var j = chars.length - 1; j > 0; j--) {
        var k = randInt(j + 1);
        var tmp = chars[j]; chars[j] = chars[k]; chars[k] = tmp;
      }
      out.value = chars.slice(0, len).join('');
      var bits = Math.round(len * Math.log2(all.length));
      strength.textContent = '';
      strength.appendChild(el('span', null, 'Strength: '));
      strength.appendChild(el('strong', null, '~' + bits + ' bits'));
      var kind = bits < 40 ? 'bad' : bits < 60 ? 'warn' : bits < 80 ? 'good' : 'good';
      var label = bits < 40 ? 'Weak — increase length' : bits < 60 ? 'Fair' : bits < 80 ? 'Strong' : 'Excellent';
      strength.appendChild(chip(kind, label));
    }

    root.addEventListener('input', generate);
    root.addEventListener('change', generate);
    $(root, 'pw-regen').addEventListener('click', generate);
    generate();
  };

  // ---------------------------------------------------------- base64 encoder decoder
  T['base64-encoder-decoder'] = function (root) {
    var out = $(root, 'b6-out');
    var ERR_B64 = 'That does not look like valid Base64 — check for stray characters or an incomplete paste.';
    var ERR_UTF8 = 'Decoded, but the bytes are not valid UTF-8 text — this looks like binary data rather than text.';

    function utf8ToBinary(str) {
      if (typeof TextEncoder !== 'undefined') {
        var bytes = new TextEncoder().encode(str);
        var parts = [];
        var chunk = 0x8000;
        for (var i = 0; i < bytes.length; i += chunk) {
          parts.push(String.fromCharCode.apply(null, Array.prototype.slice.call(bytes, i, i + chunk)));
        }
        return parts.join('');
      }
      return unescape(encodeURIComponent(str));
    }
    function binaryToUtf8(bin) {
      if (typeof TextDecoder !== 'undefined') {
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      }
      return decodeURIComponent(escape(bin));
    }
    function encode(str, urlSafe) {
      var b64 = btoa(utf8ToBinary(str));
      if (urlSafe) b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return b64;
    }
    function decode(str, urlSafe) {
      var t = str.replace(/\s+/g, '');
      if (urlSafe) t = t.replace(/-/g, '+').replace(/_/g, '/');
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(t) || /=/.test(t.slice(0, -2))) throw new Error('b64');
      var rem = t.length % 4;
      if (rem === 1) throw new Error('b64');
      if (rem) t += '===='.slice(rem);
      var bin;
      try { bin = atob(t); } catch (e) { throw new Error('b64'); }
      return binaryToUtf8(bin);
    }
    function update() {
      var text = $(root, 'b6-text').value;
      var mode = $(root, 'b6-mode').value;
      var urlSafe = $(root, 'b6-url').checked;
      if (!text.trim()) { out.textContent = 'Type text to encode, or paste Base64 to decode.'; return; }
      try {
        out.textContent = mode === 'encode' ? encode(text, urlSafe) : decode(text, urlSafe);
      } catch (e) {
        out.textContent = mode === 'encode'
          ? 'That text cannot be encoded — it likely contains half an emoji (an unpaired surrogate). Paste the complete character.'
          : (e && e.message === 'b64' ? ERR_B64 : ERR_UTF8);
      }
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- url encoder decoder
  T['url-encoder-decoder'] = function (root) {
    var out = $(root, 'ue-out');
    function update() {
      var text = $(root, 'ue-text').value;
      var fn = $(root, 'ue-mode').value;
      if (!text.trim()) { out.textContent = 'Paste a URL, query string or text to encode or decode.'; return; }
      var isDecode = fn.indexOf('decode') === 0;
      if (isDecode && /%(?![0-9a-fA-F]{2})/.test(text)) {
        out.textContent = 'That is not valid percent-encoded input — look for a broken % sequence or a truncated paste.';
        return;
      }
      try {
        out.textContent = window[fn](text);
      } catch (e) {
        out.textContent = isDecode
          ? 'That is not valid percent-encoded input — look for a broken % sequence or a truncated paste.'
          : 'That text cannot be encoded — it likely contains an unpaired emoji or half a surrogate pair. Paste the complete character.';
      }
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- uuid generator
  T['uuid-generator'] = function (root) {
    var out = $(root, 'uu-out');
    function uuid() {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
      var b = new Uint8Array(16);
      crypto.getRandomValues(b);
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      var h = [];
      for (var i = 0; i < 16; i++) h.push((b[i] < 16 ? '0' : '') + b[i].toString(16));
      return h.slice(0, 4).join('') + '-' + h.slice(4, 6).join('') + '-' + h.slice(6, 8).join('') + '-' +
        h.slice(8, 10).join('') + '-' + h.slice(10, 16).join('');
    }
    function generate() {
      var n = parseInt($(root, 'uu-count').value, 10);
      if (!(n >= 1)) n = 1;
      else if (n > 100) n = 100;
      var upper = $(root, 'uu-upper').checked;
      var list = [];
      for (var i = 0; i < n; i++) {
        var v = uuid();
        list.push(upper ? v.toUpperCase() : v);
      }
      out.textContent = list.join('\n');
    }
    root.addEventListener('input', generate);
    root.addEventListener('change', generate);
    $(root, 'uu-gen').addEventListener('click', generate);
    generate();
  };

  // ---------------------------------------------------------- jwt decoder
  T['jwt-decoder'] = function (root) {
    var out = $(root, 'jwt-out');
    var meta = $(root, 'jwt-meta');
    var ERR_SHAPE = 'That does not look like a valid JWT — a token has three dot-separated parts: header, payload, signature.';
    var ERR_DECODE = 'The header or payload could not be decoded — check that you pasted the complete token.';
    function b64urlDecode(s) {
      var t = s.replace(/-/g, '+').replace(/_/g, '/');
      var rem = t.length % 4;
      if (rem === 1) throw new Error('bad length');
      if (rem) t += '===='.slice(rem);
      var bin = atob(t);
      if (typeof TextDecoder !== 'undefined') {
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      }
      return decodeURIComponent(escape(bin));
    }
    function fmtDate(sec) {
      if (typeof sec !== 'number' || isNaN(sec)) return null;
      var d = new Date(sec * 1000);
      if (isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
    }
    function addPair(label, value) {
      meta.appendChild(el('span', null, label + ': '));
      meta.appendChild(el('strong', null, value));
    }
    function update() {
      var raw = $(root, 'jwt-in').value.trim().replace(/^Bearer\s+/i, '');
      meta.textContent = '';
      if (!raw) { out.textContent = 'Paste a JWT above to decode its header and payload.'; return; }
      var parts = raw.split('.');
      if (parts.length !== 3 || !parts[0] || !parts[1]) { out.textContent = ERR_SHAPE; return; }
      var header, payload;
      try {
        header = JSON.parse(b64urlDecode(parts[0]));
        payload = JSON.parse(b64urlDecode(parts[1]));
      } catch (e) { out.textContent = ERR_DECODE; return; }
      if (!header || typeof header !== 'object' || !payload || typeof payload !== 'object') { out.textContent = ERR_DECODE; return; }
      out.textContent = JSON.stringify(payload, null, 2);
      addPair('alg', typeof header.alg === 'string' ? header.alg : '—');
      if (typeof header.typ === 'string') addPair('typ', header.typ);
      var iat = fmtDate(payload.iat);
      var exp = fmtDate(payload.exp);
      if (iat) addPair('iat', iat);
      if (exp) addPair('exp', exp);
      meta.appendChild(el('span', null, 'signature not verified — decode only'));
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- user agent parser
  T['user-agent-parser'] = function (root) {
    var out = $(root, 'ua-out');
    var BOTS = [
      [/(googlebot|google-inspectiontool|storebot-google)\//i, 'Googlebot'],
      [/(bingbot|bingpreview)\//i, 'Bingbot'],
      [/duckduckbot\//i, 'DuckDuckBot'],
      [/baiduspider\//i, 'Baiduspider'],
      [/yandex(bot|images|mobilebot)\//i, 'YandexBot'],
      [/slurp/i, 'Yahoo Slurp'],
      [/(facebookexternalhit|facebot)/i, 'Facebook crawler'],
      [/twitterbot\//i, 'Twitterbot'],
      [/linkedinbot\//i, 'LinkedInBot'],
      [/whatsapp\//i, 'WhatsApp'],
      [/discordbot\//i, 'Discordbot'],
      [/telegrambot\//i, 'TelegramBot'],
      [/applebot\//i, 'Applebot'],
      [/\b(curl|wget|libwww|python-requests|python-urllib|go-http-client|okhttp|java|axios|postmanruntime)\b/i, 'Script or API client'],
      [/\b(bot|crawler|spider)\b/i, 'Crawler'],
    ];
    var BROWSERS = [
      [/(EdgA|EdgiOS|Edg)\/([0-9.]+)/, 'Edge'],
      [/(OPR|Opera)\/([0-9.]+)/, 'Opera'],
      [/(SamsungBrowser)\/([0-9.]+)/, 'Samsung Internet'],
      [/(UCBrowser|UC Browser)\/([0-9.]+)/, 'UC Browser'],
      [/(YaBrowser)\/([0-9.]+)/, 'Yandex Browser'],
      [/(Vivaldi)\/([0-9.]+)/, 'Vivaldi'],
      [/(FxiOS|Firefox)\/([0-9.]+)/, 'Firefox'],
      [/(Chrome|CriOS|Chromium)\/([0-9.]+)/, 'Chrome'],
      [/(Version)\/([0-9.]+).*Safari/, 'Safari'],
      [/(MSIE |Trident\/).*?(rv:)?([0-9.]+)/, 'Internet Explorer'],
    ];
    function browserOf(ua) {
      for (var i = 0; i < BROWSERS.length; i++) {
        var m = BROWSERS[i][0].exec(ua);
        if (m) return BROWSERS[i][1] + (m[2] || m[3] ? ' ' + (m[2] || m[3]).replace(/\.$/, '') : '');
      }
      return null;
    }
    function engineOf(ua) {
      if (/FxiOS\/|Firefox\//.test(ua)) return 'Gecko';
      if (/AppleWebKit\//.test(ua)) {
        return /Chrome\/|Chromium\/|CriOS\/|Edg\/|EdgA\/|EdgiOS\/|OPR\/|SamsungBrowser\//.test(ua) ? 'Blink' : 'WebKit';
      }
      if (/Gecko\//.test(ua)) return 'Gecko';
      if (/Trident\/|MSIE /.test(ua)) return 'Trident';
      return null;
    }
    var OS_RULES = [
      [/Windows NT 10.0/, 'Windows 10 or 11'],
      [/Windows NT 6.3/, 'Windows 8.1'],
      [/Windows NT 6.2/, 'Windows 8'],
      [/Windows NT 6.1/, 'Windows 7'],
      [/Windows NT/, 'Windows'],
      [/iPhone|iPad|iPod/, 'iOS'],
      [/Mac OS X/, 'macOS'],
      [/Android/, 'Android'],
      [/CrOS/, 'ChromeOS'],
      [/Ubuntu/, 'Ubuntu'],
      [/Linux/, 'Linux'],
    ];
    function osOf(ua) {
      for (var i = 0; i < OS_RULES.length; i++) {
        if (!OS_RULES[i][0].test(ua)) continue;
        var name = OS_RULES[i][1];
        var ver = null;
        if (name === 'iOS') { var m = /OS (\d+[._]\d+(?:[._]\d+)?)/.exec(ua); if (m) ver = m[1].replace(/_/g, '.'); }
        else if (name === 'macOS') { var m2 = /Mac OS X (\d+[._]\d+(?:[._]\d+)?)/.exec(ua); if (m2) ver = m2[1].replace(/_/g, '.'); }
        else if (name === 'Android') { var m3 = /Android (\d+(?:\.\d+)?)/.exec(ua); if (m3) ver = m3[1]; }
        return name + (ver ? ' ' + ver : '');
      }
      return null;
    }
    function deviceOf(ua, isBot) {
      if (isBot) return 'Bot / crawler';
      if (/iPad|Tablet|PlayBook|Silk(?! Mobile)/.test(ua) || /Android(?![\s\S]*Mobile)/.test(ua)) return 'Tablet';
      if (/Mobi|iPhone|iPod|Windows Phone|Android.*Mobile/.test(ua)) return 'Mobile';
      return 'Desktop';
    }
    function parse(ua) {
      var bot = null;
      for (var i = 0; i < BOTS.length; i++) { if (BOTS[i][0].test(ua)) { bot = BOTS[i][1]; break; } }
      return {
        browser: bot || browserOf(ua) || 'Unknown client',
        engine: engineOf(ua) || 'Unknown',
        os: osOf(ua) || 'Unknown',
        device: deviceOf(ua, !!bot),
      };
    }
    function update() {
      var ua = $(root, 'ua-text').value.trim();
      if (!ua) { out.textContent = 'Paste a user-agent string — or click “Use my browser’s UA” to parse yours.'; return; }
      var r = parse(ua);
      out.textContent = [
        'Browser: ' + r.browser,
        'Engine: ' + r.engine,
        'OS: ' + r.os,
        'Device: ' + r.device,
        'Raw: ' + ua,
      ].join('\n');
    }
    root.addEventListener('input', update);
    $(root, 'ua-mine').addEventListener('click', function () {
      $(root, 'ua-text').value = navigator.userAgent;
      update();
    });
    update();
  };

  // ---------------------------------------------------------- ics calendar generator
  T['ics-calendar-generator'] = function (root) {
    var out = $(root, 'ics-out');
    var noteEl = $(root, 'ics-note');
    function esc(s) {
      return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r\n|\r|\n/g, '\\n');
    }
    function uid() {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
      var b = new Uint8Array(16);
      crypto.getRandomValues(b);
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      var h = [];
      for (var i = 0; i < 16; i++) h.push((b[i] < 16 ? '0' : '') + b[i].toString(16));
      return h.slice(0, 4).join('') + '-' + h.slice(4, 6).join('') + '-' + h.slice(6, 8).join('') + '-' +
        h.slice(8, 10).join('') + '-' + h.slice(10, 16).join('');
    }
    function compact(dateStr) { return dateStr.replace(/-/g, ''); }
    function nextDay(dateStr) {
      var y = +dateStr.slice(0, 4), m = +dateStr.slice(5, 7), d = +dateStr.slice(8, 10);
      var dt = new Date(Date.UTC(y, m - 1, d + 1));
      var mm = dt.getUTCMonth() + 1, dd = dt.getUTCDate();
      return String(dt.getUTCFullYear()) + (mm < 10 ? '0' : '') + mm + (dd < 10 ? '0' : '') + dd;
    }
    function stamp() {
      var d = new Date();
      function p(n) { return (n < 10 ? '0' : '') + n; }
      return String(d.getUTCFullYear()) + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + 'T' +
        p(d.getUTCHours()) + p(d.getUTCMinutes()) + p(d.getUTCSeconds()) + 'Z';
    }
    function update() {
      var title = $(root, 'ics-title').value.trim();
      var loc = $(root, 'ics-loc').value.trim();
      var desc = $(root, 'ics-desc').value.trim();
      var allDay = $(root, 'ics-allday').checked;
      var sDate = $(root, 'ics-sdate').value;
      var eDate = $(root, 'ics-edate').value;
      var sTime = $(root, 'ics-stime').value.trim();
      var eTime = $(root, 'ics-etime').value.trim();
      function done(msg) { noteEl.textContent = msg; out.textContent = ''; }
      if (!title) { done('Add an event title to generate the .ics file.'); return; }
      if (!sDate) { done('Pick a start date to generate the .ics file.'); return; }
      if (!eDate) { done('Pick an end date — or use the start date again for a single-day event.'); return; }
      if (eDate < sDate) { done('The end must be on or after the start — check the dates above.'); return; }
      var TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!allDay && (!TIME_RE.test(sTime) || !TIME_RE.test(eTime))) {
        done('Add valid 24-hour start and end times (e.g. 14:00) — or tick “All-day event”.');
        return;
      }
      if (!allDay && eTime < sTime) { done('The end time must be on or after the start time — check the times above.'); return; }
      var lines = ['BEGIN:VCALENDAR', 'VERSION:1.0', 'PRODID:-//Tools4Market//EN', 'BEGIN:VEVENT'];
      lines.push('UID:' + uid());
      lines.push('DTSTAMP:' + stamp());
      if (allDay) {
        lines.push('DTSTART;VALUE=DATE:' + compact(sDate));
        lines.push('DTEND;VALUE=DATE:' + nextDay(eDate));
      } else {
        lines.push('DTSTART:' + compact(sDate) + 'T' + sTime.replace(':', '') + '00');
        lines.push('DTEND:' + compact(eDate) + 'T' + eTime.replace(':', '') + '00');
      }
      lines.push('SUMMARY:' + esc(title));
      if (desc) lines.push('DESCRIPTION:' + esc(desc));
      if (loc) lines.push('LOCATION:' + esc(loc));
      lines.push('END:VEVENT', 'END:VCALENDAR');
      noteEl.textContent = 'Event ready — download event.ics or copy it from the output below.';
      out.textContent = lines.join('\r\n');
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };
})();

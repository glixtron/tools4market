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
    var COPY = (((window.T4M_ISTR || {}).tools || {}).password) || {};
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
      var domain = 0x100000000;
      var limit = domain - (domain % max);
      do { crypto.getRandomValues(a); } while (a[0] >= limit);
      return a[0] % max;
    }

    function hasEverySet(value, active) {
      return active.every(function (set) {
        for (var i = 0; i < value.length; i++) if (set.indexOf(value.charAt(i)) !== -1) return true;
        return false;
      });
    }

    function entropyBits(active, length) {
      var pool = active.join('');
      var total = pool.length;
      var probability = 0;
      for (var mask = 0; mask < (1 << active.length); mask++) {
        var excluded = 0, bits = 0;
        for (var i = 0; i < active.length; i++) if (mask & (1 << i)) { excluded += active[i].length; bits++; }
        var p = Math.pow(Math.max(0, total - excluded) / total, length);
        probability += bits % 2 ? -p : p;
      }
      return Math.max(0, length * Math.log2(total) + Math.log2(Math.max(Number.MIN_VALUE, probability)));
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
      if (!window.crypto || typeof crypto.getRandomValues !== 'function') {
        out.value = COPY.unavailable || '';
        strength.textContent = '';
        return;
      }
      var value = '';
      try {
        // Rejection sampling keeps every accepted string equally likely while
        // still honoring the user's request to include each selected set.
        for (var attempt = 0; attempt < 1000; attempt++) {
          var candidate = '';
          for (var i = 0; i < len; i++) candidate += all.charAt(randInt(all.length));
          if (hasEverySet(candidate, active)) { value = candidate; break; }
        }
      } catch (e) {}
      if (!value) {
        out.value = COPY.unavailable || '';
        strength.textContent = '';
        return;
      }
      out.value = value;
      var bits = Math.round(entropyBits(active, len));
      strength.textContent = '';
      strength.appendChild(el('span', null, 'Strength: '));
      strength.appendChild(el('strong', null, '~' + bits + ' bits'));
      strength.appendChild(document.createTextNode(' — ' + String(COPY.entropy || '').replace('{n}', String(bits))));
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
    var COPY = (((window.T4M_ISTR || {}).tools || {}).jwt) || {};
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
      if (header.alg === 'none') meta.appendChild(el('p', 'tool-note', COPY.algNone));
      if (typeof payload.iss === 'string') addPair('iss', payload.iss);
      if (typeof payload.sub === 'string') addPair('sub', payload.sub);
      if (payload.aud !== undefined) {
        var audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
        addPair('aud', audience.slice(0, 8).map(function (v) { return String(v); }).join(', ') + (audience.length > 8 ? '…' : ''));
      }
      var iat = fmtDate(payload.iat);
      if (iat) addPair('iat', COPY.issuedAt.replace('{v}', iat));
      else if (Object.prototype.hasOwnProperty.call(payload, 'iat')) addPair('iat', COPY.malformedDate);
      var exp = fmtDate(payload.exp);
      if (exp) addPair('exp', (payload.exp <= Date.now() / 1000 ? COPY.expired : COPY.active).replace('{v}', exp));
      else if (Object.prototype.hasOwnProperty.call(payload, 'exp')) addPair('exp', COPY.malformedDate);
      else addPair('exp', COPY.noExpiry);
      var nbf = fmtDate(payload.nbf);
      if (nbf) addPair('nbf', (payload.nbf > Date.now() / 1000 ? COPY.notYetValid : COPY.activeNow).replace('{v}', nbf));
      else if (Object.prototype.hasOwnProperty.call(payload, 'nbf')) addPair('nbf', COPY.malformedDate);
      meta.appendChild(el('span', null, 'signature not verified — decode only'));
    }
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- user agent parser
  T['user-agent-parser'] = function (root) {
    var out = $(root, 'ua-out');
    var uaInput = $(root, 'ua-text');
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
      var ua = uaInput.value.trim();
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
      uaInput.value = navigator.userAgent;
      update();
    });
    if (!uaInput.value.trim()) uaInput.value = navigator.userAgent || '';
    update();
  };

  // ---------------------------------------------------------- ics calendar generator
  T['ics-calendar-generator'] = function (root) {
    var out = $(root, 'ics-out');
    var noteEl = $(root, 'ics-note');
    var COPY = (((window.T4M_ISTR || {}).tools || {}).ics) || {};
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
      var timeMode = $(root, 'ics-tz').value;
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
      if (!allDay && eDate === sDate && eTime <= sTime) { done(COPY.sameDayInvalid); return; }
      var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tools4Market//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT'];
      lines.push('UID:' + uid());
      lines.push('DTSTAMP:' + stamp());
      if (allDay) {
        lines.push('DTSTART;VALUE=DATE:' + compact(sDate));
        lines.push('DTEND;VALUE=DATE:' + nextDay(eDate));
      } else {
        var suffix = timeMode === 'utc' ? 'Z' : '';
        lines.push('DTSTART:' + compact(sDate) + 'T' + sTime.replace(':', '') + '00' + suffix);
        lines.push('DTEND:' + compact(eDate) + 'T' + eTime.replace(':', '') + '00' + suffix);
      }
      lines.push('SUMMARY:' + esc(title));
      if (desc) lines.push('DESCRIPTION:' + esc(desc));
      if (loc) lines.push('LOCATION:' + esc(loc));
      lines.push('END:VEVENT', 'END:VCALENDAR');
      noteEl.textContent = timeMode === 'utc' ? COPY.readyUtc : COPY.readyFloating;
      out.textContent = lines.join('\r\n');
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- local image compressor
  T['image-compressor'] = function (root) {
    var fileInput = $(root, 'ic-files');
    var dropButton = $(root, 'ic-drop');
    var selection = $(root, 'ic-selection');
    var format = $(root, 'ic-format');
    var quality = $(root, 'ic-quality');
    var qualityValue = $(root, 'ic-quality-value');
    var qualityHint = $(root, 'ic-quality-hint');
    var widthInput = $(root, 'ic-width');
    var optimizeButton = $(root, 'ic-optimize');
    var clearButton = $(root, 'ic-clear');
    var status = $(root, 'ic-note');
    var summary = $(root, 'ic-summary');
    var resultsEl = $(root, 'ic-results');
    var MAX_FILES = 10;
    var MAX_FILE_BYTES = 20 * 1024 * 1024;
    var MAX_BATCH_BYTES = 50 * 1024 * 1024;
    var MAX_INPUT_PIXELS = 50000000;
    var MAX_DIMENSION = 8000;
    var selectedFiles = [];
    var results = [];
    var busy = false;

    function revokeResults() {
      results.forEach(function (item) { if (item.url) URL.revokeObjectURL(item.url); });
      results = [];
      resultsEl.textContent = '';
      summary.textContent = '';
    }
    function setStatus(message, kind) {
      status.textContent = '';
      status.appendChild(kind ? chip(kind, message) : document.createTextNode(message));
    }
    function bytes(value) {
      if (value < 1024) return value + ' B';
      if (value < 1024 * 1024) return (value / 1024).toFixed(1) + ' KB';
      return (value / (1024 * 1024)).toFixed(2) + ' MB';
    }
    function safeName(name) {
      return String(name || 'image').replace(/\.[^.]*$/, '').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').slice(0, 100) || 'image';
    }
    function extensionFor(mime) {
      return mime === 'image/jpeg' ? '.jpg' : (mime === 'image/png' ? '.png' : '.webp');
    }
    function allowedFile(file) {
      var type = String(file.type || '').toLowerCase();
      var name = String(file.name || '').toLowerCase();
      return /^image\/(jpeg|png|webp|avif)$/.test(type) || /\.(jpe?g|png|webp|avif)$/.test(name);
    }
    function drawSelected() {
      optimizeButton.disabled = busy || selectedFiles.length === 0;
      clearButton.disabled = busy || (selectedFiles.length === 0 && results.length === 0);
      if (!selectedFiles.length) {
        selection.textContent = 'Your files stay in this browser. Select images to begin.';
        return;
      }
      var total = selectedFiles.reduce(function (sum, file) { return sum + file.size; }, 0);
      selection.textContent = selectedFiles.length + (selectedFiles.length === 1 ? ' image selected' : ' images selected') +
        ' · ' + bytes(total) + ' total · original files are unchanged.';
    }
    function setFiles(fileList) {
      var incoming = Array.prototype.slice.call(fileList || []);
      revokeResults();
      if (incoming.length > MAX_FILES) {
        selectedFiles = [];
        fileInput.value = '';
        drawSelected();
        setStatus('Choose up to ' + MAX_FILES + ' images at a time.', 'warn');
        return;
      }
      var incomingBytes = incoming.reduce(function (sum, file) { return sum + file.size; }, 0);
      if (incomingBytes > MAX_BATCH_BYTES) {
        selectedFiles = [];
        fileInput.value = '';
        drawSelected();
        setStatus('The selected batch is larger than 50 MB. Choose fewer or smaller images.', 'warn');
        return;
      }
      selectedFiles = incoming;
      drawSelected();
      if (incoming.length) setStatus('Ready to optimize. Choose a format and review the resize and quality settings.', 'good');
      else setStatus('Select images to start.');
    }
    function loadImage(file) {
      return new Promise(function (resolve, reject) {
        var sourceUrl = URL.createObjectURL(file);
        var image = new Image();
        image.onload = function () { URL.revokeObjectURL(sourceUrl); resolve(image); };
        image.onerror = function () { URL.revokeObjectURL(sourceUrl); reject(new Error('This browser could not decode the image. Try a supported JPEG, PNG, WebP or AVIF file.')); };
        image.src = sourceUrl;
      });
    }
    function encode(canvas, mime, q) {
      return new Promise(function (resolve, reject) {
        if (!canvas.toBlob) { reject(new Error('This browser does not support canvas image export. Try a recent browser.')); return; }
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error('The browser could not create an image. Try a smaller file or another format.')); return; }
          if (blob.type !== mime) { reject(new Error('This browser cannot export ' + mime.replace('image/', '').toUpperCase() + '. Choose another output format.')); return; }
          resolve(blob);
        }, mime, q);
      });
    }
    async function optimizeFile(file, mime, q, requestedWidth) {
      if (!allowedFile(file)) throw new Error('Unsupported file type. Choose JPEG, PNG, WebP or AVIF.');
      if (file.size > MAX_FILE_BYTES) throw new Error('This file is larger than 20 MB. Choose a smaller image.');
      if (!file.size) throw new Error('This image file is empty.');
      var image = await loadImage(file);
      var sourceWidth = image.naturalWidth || image.width;
      var sourceHeight = image.naturalHeight || image.height;
      if (!sourceWidth || !sourceHeight) throw new Error('The browser could not read this image’s dimensions.');
      if (sourceWidth * sourceHeight > MAX_INPUT_PIXELS) throw new Error('This image is larger than 50 megapixels. Resize it before using this browser tool.');
      var scale = Math.min(1, requestedWidth ? requestedWidth / sourceWidth : 1, MAX_DIMENSION / Math.max(sourceWidth, sourceHeight));
      var outputWidth = Math.max(1, Math.round(sourceWidth * scale));
      var outputHeight = Math.max(1, Math.round(sourceHeight * scale));
      var canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      var context = canvas.getContext('2d', { alpha: mime !== 'image/jpeg' });
      if (!context) throw new Error('The browser could not create an image canvas.');
      if (mime === 'image/jpeg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, outputWidth, outputHeight);
      }
      context.drawImage(image, 0, 0, outputWidth, outputHeight);
      var blob;
      try { blob = await encode(canvas, mime, mime === 'image/png' ? undefined : q); }
      finally { canvas.width = 0; canvas.height = 0; }
      var outputName = safeName(file.name) + '-optimized' + extensionFor(mime);
      return {
        fileName: file.name,
        outputName: outputName,
        sourceBytes: file.size,
        outputBytes: blob.size,
        sourceWidth: sourceWidth,
        sourceHeight: sourceHeight,
        outputWidth: outputWidth,
        outputHeight: outputHeight,
        blob: blob,
        url: URL.createObjectURL(blob),
      };
    }
    function renderResults() {
      resultsEl.textContent = '';
      var good = results.filter(function (item) { return !item.error; });
      var originalTotal = good.reduce(function (sum, item) { return sum + item.sourceBytes; }, 0);
      var outputTotal = good.reduce(function (sum, item) { return sum + item.outputBytes; }, 0);
      if (good.length) {
        var saved = originalTotal - outputTotal;
        var summaryText = good.length + (good.length === 1 ? ' image processed' : ' images processed') +
          ' · ' + bytes(originalTotal) + ' → ' + bytes(outputTotal);
        if (saved > 0) summaryText += ' · ' + (saved / originalTotal * 100).toFixed(1) + '% smaller overall';
        else if (saved < 0) summaryText += ' · output is ' + (-saved / originalTotal * 100).toFixed(1) + '% larger overall';
        else summaryText += ' · same total size';
        summary.textContent = summaryText;
      }
      results.forEach(function (item) {
        var card = el('article', 'img-result');
        var info = el('div', 'img-result-info');
        var title = el('h3', null, item.fileName);
        info.appendChild(title);
        if (item.error) {
          info.appendChild(el('p', 'img-result-error', item.error));
        } else {
          var preview = el('img', 'img-result-preview');
          preview.src = item.url;
          preview.alt = 'Optimized preview of ' + item.outputName;
          preview.loading = 'lazy';
          var dimensions = item.sourceWidth + ' × ' + item.sourceHeight + ' → ' + item.outputWidth + ' × ' + item.outputHeight;
          var delta = item.sourceBytes - item.outputBytes;
          var sizeText = bytes(item.sourceBytes) + ' → ' + bytes(item.outputBytes);
          if (delta > 0) sizeText += ' · ' + (delta / item.sourceBytes * 100).toFixed(1) + '% smaller';
          else if (delta < 0) sizeText += ' · ' + (-delta / item.sourceBytes * 100).toFixed(1) + '% larger';
          else sizeText += ' · same size';
          info.appendChild(el('p', 'img-result-dimensions', dimensions + ' px'));
          info.appendChild(el('p', 'img-result-size', sizeText));
          var download = el('a', 'btn btn-secondary', 'Download ' + item.outputName);
          download.href = item.url;
          download.download = item.outputName;
          info.appendChild(download);
          card.appendChild(preview);
        }
        card.appendChild(info);
        resultsEl.appendChild(card);
      });
    }
    function updateQuality() {
      qualityValue.textContent = quality.value + '%';
      var isPng = format.value === 'image/png';
      quality.disabled = isPng || busy;
      qualityHint.textContent = isPng ? 'PNG uses lossless encoding; the quality slider does not apply.' : 'Lower quality can reduce file size; compare the visual result.';
    }
    function setBusy(value) {
      busy = value;
      fileInput.disabled = value;
      dropButton.disabled = value;
      format.disabled = value;
      widthInput.disabled = value;
      optimizeButton.disabled = value || selectedFiles.length === 0;
      clearButton.disabled = value || (selectedFiles.length === 0 && results.length === 0);
      updateQuality();
    }
    async function run() {
      if (busy || !selectedFiles.length) return;
      var requestedWidth = null;
      if (widthInput.value.trim()) {
        requestedWidth = Number(widthInput.value);
        if (!Number.isInteger(requestedWidth) || requestedWidth < 1 || requestedWidth > MAX_DIMENSION) {
          setStatus('Maximum width must be a whole number from 1 to ' + MAX_DIMENSION + ', or leave it blank.', 'warn');
          widthInput.focus();
          return;
        }
      }
      revokeResults();
      setBusy(true);
      var mime = format.value;
      var q = Number(quality.value) / 100;
      var completed = 0;
      for (var i = 0; i < selectedFiles.length; i++) {
        var file = selectedFiles[i];
        setStatus('Optimizing image ' + (i + 1) + ' of ' + selectedFiles.length + '…');
        try { results.push(await optimizeFile(file, mime, q, requestedWidth)); }
        catch (error) { results.push({ fileName: file.name, error: error && error.message ? error.message : 'This image could not be processed.' }); }
        completed++;
        renderResults();
      }
      setBusy(false);
      var failures = results.filter(function (item) { return !!item.error; }).length;
      setStatus(completed + (completed === 1 ? ' file finished' : ' files finished') + (failures ? ' · ' + failures + (failures === 1 ? ' could not be processed' : ' could not be processed') : ''), failures ? 'warn' : 'good');
      drawSelected();
    }
    function clear() {
      if (busy) return;
      selectedFiles = [];
      fileInput.value = '';
      revokeResults();
      drawSelected();
      setStatus('Selection cleared. Your original files were not changed.');
    }

    fileInput.addEventListener('change', function () { setFiles(fileInput.files); });
    dropButton.addEventListener('click', function () { fileInput.click(); });
    dropButton.addEventListener('dragover', function (event) { event.preventDefault(); dropButton.classList.add('is-dragover'); });
    dropButton.addEventListener('dragleave', function () { dropButton.classList.remove('is-dragover'); });
    dropButton.addEventListener('drop', function (event) {
      event.preventDefault();
      dropButton.classList.remove('is-dragover');
      setFiles(event.dataTransfer && event.dataTransfer.files);
    });
    format.addEventListener('change', updateQuality);
    quality.addEventListener('input', updateQuality);
    optimizeButton.addEventListener('click', run);
    clearButton.addEventListener('click', clear);
    updateQuality();
    drawSelected();
  };

  // ---------------------------------------------------------- JSON validator & formatter
  T['json-validator'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).jsonv) || {};
    var input = $(root, 'jv-in');
    var out = $(root, 'jv-out');
    var stats = $(root, 'jv-stats');
    var noteEl = $(root, 'jv-note');
    var mode = 'pretty';

    function posOf(text, err) {
      var m = /position\s+(\d+)/i.exec(String((err && err.message) || err));
      if (!m) return '';
      var pos = Math.min(parseInt(m[1], 10), text.length);
      var upto = text.slice(0, pos);
      var line = upto.split('\n').length;
      var col = pos - upto.lastIndexOf('\n');
      return String(COPY.errLine || 'line {l}, column {c}').replace('{l}', line).replace('{c}', col);
    }

    function count(v) {
      var c = { depth: 0, objects: 0, arrays: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 };
      (function walk(node, depth) {
        if (depth > c.depth) c.depth = depth;
        if (node === null) { c.nulls++; return; }
        var t = typeof node;
        if (t === 'object') {
          if (Array.isArray(node)) { c.arrays++; node.forEach(function (x) { walk(x, depth + 1); }); }
          else { c.objects++; Object.keys(node).forEach(function (k) { walk(node[k], depth + 1); }); }
        } else if (t === 'string') c.strings++;
        else if (t === 'number') c.numbers++;
        else if (t === 'boolean') c.booleans++;
      })(v, 0);
      return c;
    }

    function update() {
      var text = input.value;
      if (!text.trim()) { out.textContent = ''; stats.textContent = COPY.empty || ''; return; }
      var parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        out.textContent = '';
        var at = posOf(text, e);
        var msg = String((e && e.message) || e);
        stats.textContent = at
          ? String(COPY.invalid || 'Invalid JSON: {v} ({at})').replace('{v}', msg).replace('{at}', at)
          : String(COPY.invalidNoAt || 'Invalid JSON: {v}').replace('{v}', msg);
        return;
      }
      var c = count(parsed);
      out.textContent = mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      stats.textContent =
        String(COPY.valid || 'Valid JSON — {v} characters, {d} levels deep.').replace('{v}', text.length).replace('{d}', c.depth) + ' ' +
        String(COPY.stats || '{o} objects · {a} arrays · {s} strings · {n} numbers · {b} booleans · {z} null values')
          .replace('{o}', c.objects).replace('{a}', c.arrays).replace('{s}', c.strings)
          .replace('{n}', c.numbers).replace('{b}', c.booleans).replace('{z}', c.nulls);
      if (noteEl && !noteEl.textContent) noteEl.textContent = COPY.clickFirst || '';
    }

    root.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-jv]') : null;
      if (!b) return;
      mode = b.getAttribute('data-jv');
      update();
      if (noteEl) noteEl.textContent = mode === 'minify' ? (COPY.minify || '') : (COPY.pretty || '');
    });
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- sitemap validator
  T['sitemap-validator'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).sitemapv) || {};
    var input = $(root, 'sv-xml');
    var out = $(root, 'sv-out');
    var stats = $(root, 'sv-stats');
    var KNOWN_URL_CHILD = { loc: 1, lastmod: 1, changefreq: 1, priority: 1 };
    var KNOWN_MAP_CHILD = { loc: 1, lastmod: 1 };
    var CHANGEFREQ = { always: 1, hourly: 1, daily: 1, weekly: 1, monthly: 1, yearly: 1, never: 1 };
    var ISO = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;

    function tpl(str, map) {
      var s = String(str);
      Object.keys(map).forEach(function (k) { s = s.split('{' + k + '}').join(map[k]); });
      return s;
    }

    function update() {
      var text = input.value;
      out.textContent = '';
      if (!text.trim()) { stats.textContent = COPY.empty || ''; return; }
      var doc;
      try {
        doc = new DOMParser().parseFromString(text, 'application/xml');
      } catch (e) {
        stats.textContent = tpl(COPY.badXml || 'Not well-formed XML: {v}.', { v: String((e && e.message) || e) });
        return;
      }
      var perr = doc.getElementsByTagName('parsererror');
      if (perr.length) {
        stats.textContent = tpl(COPY.badXml || 'Not well-formed XML: {v}.', { v: (perr[0].textContent || '').split('\n')[0].slice(0, 160) });
        return;
      }
      var rootEl = doc.documentElement;
      var kind = String((rootEl && rootEl.localName) || '').toLowerCase();
      if (kind !== 'urlset' && kind !== 'sitemapindex') {
        stats.textContent = tpl(COPY.badRoot || 'The root element is <{v}> — expected <urlset> or <sitemapindex>.', { v: String((rootEl && rootEl.localName) || 'unknown') });
        return;
      }
      var issues = [];
      var warnings = [];
      if ((rootEl.getAttribute('xmlns') || '') !== 'http://www.sitemaps.org/schemas/sitemap/0.9') warnings.push(COPY.noNs || '');
      var entryTag = kind === 'urlset' ? 'url' : 'sitemap';
      var known = kind === 'urlset' ? KNOWN_URL_CHILD : KNOWN_MAP_CHILD;
      var entries = doc.getElementsByTagName(entryTag);
      var seen = {};
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var idx = i + 1;
        var loc = '';
        for (var j = 0; j < entry.children.length; j++) {
          var child = entry.children[j];
          var name = String(child.localName || '').toLowerCase();
          var val = (child.textContent || '').trim();
          if (name === 'loc') {
            loc = val;
            if (!val) issues.push(tpl(COPY.locMissing || 'Entry {i}: no <loc>.', { i: idx }));
            else if (!/^https?:\/\//i.test(val)) issues.push(tpl(COPY.locBad || 'Entry {i}: <loc> is not an absolute URL ({v}).', { i: idx, v: val.slice(0, 80) }));
            else if (seen[val]) seen[val].push(idx);
            else seen[val] = [idx];
          } else if (name === 'lastmod') {
            if (!ISO.test(val)) issues.push(tpl(COPY.lastmodBad || 'Entry {i}: lastmod "{v}" is not ISO 8601.', { i: idx, v: val.slice(0, 40) }));
          } else if (name === 'changefreq') {
            if (!CHANGEFREQ[val.toLowerCase()]) issues.push(tpl(COPY.changefreqBad || 'Entry {i}: changefreq "{v}" invalid.', { i: idx, v: val.slice(0, 40) }));
          } else if (name === 'priority') {
            var pnum = Number(val);
            if (!/^\d+(\.\d+)?$/.test(val) || pnum < 0 || pnum > 1) issues.push(tpl(COPY.priorityBad || 'Entry {i}: priority "{v}" must be 0.0-1.0.', { i: idx, v: val.slice(0, 20) }));
          } else if (!known[name]) {
            issues.push(tpl(COPY.unknownChild || 'Entry {i}: unexpected element <{v}>.', { i: idx, v: name }));
          }
        }
        if (!loc) issues.push(tpl(COPY.locMissing || 'Entry {i}: no <loc>.', { i: idx }));
      }
      Object.keys(seen).forEach(function (u) {
        if (seen[u].length > 1) issues.push(tpl(COPY.dupLoc || '<loc> appears {n} times: {v}', { n: seen[u].length, v: u.slice(0, 120) }));
      });
      if (entries.length > 50000) warnings.push(tpl(COPY.warn50k || 'More than 50,000 entries ({n}) — split into a sitemap index.', { n: entries.length }));
      if (text.length > 52428800) warnings.push(tpl(COPY.warn50mb || 'The file is about {v} uncompressed — split into a sitemap index.', { v: Math.round(text.length / 1048576) + ' MB' }));

      var head = kind === 'urlset'
        ? tpl(COPY.okUrlset || 'Valid urlset — {n} URL entries checked.', { n: entries.length })
        : tpl(COPY.okIndex || 'Valid sitemap index — {n} child-sitemap entries checked.', { n: entries.length });
      stats.textContent = head + ' ' +
        tpl(COPY.summary || '{n} entries · {i} issues · {w} warnings', { n: entries.length, i: issues.length, w: warnings.length }) +
        (issues.length + warnings.length === 0 ? ' ' + tpl(COPY.validClean || '{n} entries checked — no issues found.', { n: entries.length }) : '');

      if (issues.length || warnings.length) {
        var ul = el('ul', 'sv-list');
        issues.concat(warnings).slice(0, 30).forEach(function (msg) { ul.appendChild(el('li', null, msg)); });
        out.appendChild(ul);
        var rest = issues.length + warnings.length - Math.min(issues.length + warnings.length, 30);
        if (rest > 0) out.appendChild(el('p', null, tpl(COPY.moreIssues || '…and {n} more issue(s).', { n: rest })));
      }
    }
    root.addEventListener('input', update);
    root.addEventListener('change', update);
    var run = $(root, 'sv-run');
    if (run) run.addEventListener('click', update);
    update();
  };

// ---------------------------------------------------------- timestamp converter
  T['timestamp-converter'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).tsConv) || {};
    var tsInput = $(root, 'ts-timestamp');
    var dateInput = $(root, 'ts-date');
    var out = $(root, 'ts-out');
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function utcStr(d) {
      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
        ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + ' UTC';
    }
    function localStr(d) {
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + ' local time';
    }
    function isoStr(d) { return d.toISOString().replace('.000Z', 'Z'); }
    function relStr(d) {
      var diff = Date.now() - d.getTime();
      var past = diff > 0;
      if (past) diff = -diff;
      var units = [['year', 31536000000], ['month', 2592000000], ['day', 86400000], ['hour', 3600000], ['minute', 60000], ['second', 1000]];
      for (var i = 0; i < units.length; i++) {
        var v = Math.floor(Math.abs(diff) / units[i][1]);
        if (v >= 1 || i === units.length - 1) {
          return v + ' ' + units[i][0] + (v === 1 ? '' : 's') + (past ? ' ago' : ' from now');
        }
      }
    }
    function lines(d) {
      return [
        COPY.lblUtc + ' ' + utcStr(d),
        COPY.lblLocal + ' ' + localStr(d),
        COPY.lblIso + ' ' + isoStr(d),
        COPY.lblRel + ' ' + relStr(d),
      ];
    }
    function update() {
      var tsVal = tsInput.value.trim();
      var dateVal = dateInput.value.trim();
      if (tsVal && dateVal) { out.textContent = COPY.clearOne || ''; return; }
      if (tsVal) {
        if (!/^-?\d+$/.test(tsVal)) { out.textContent = COPY.invalidTs; return; }
        var digits = tsVal.charAt(0) === '-' ? tsVal.slice(1) : tsVal;
        var isMs = digits.length > 10;
        var ts = parseInt(tsVal, 10);
        var d = new Date(isMs ? ts : ts * 1000);
        if (isNaN(d.getTime())) { out.textContent = COPY.invalidDate; return; }
        out.textContent = [
          COPY.lblSec + ' ' + (isMs ? Math.floor(ts / 1000) : ts) + ' ' + (COPY.secUnit || ''),
          COPY.lblMs + ' ' + (isMs ? ts : ts * 1000),
        ].concat(lines(d)).join('\n');
      } else if (dateVal) {
        // datetime-local values are the visitor's local time — parse as local,
        // never with a forced 'Z' (that shifted the instant by the UTC offset).
        var d2 = new Date(dateVal.replace(' ', 'T'));
        if (isNaN(d2.getTime())) { out.textContent = COPY.invalidDate; return; }
        out.textContent = [
          COPY.lblSec + ' ' + Math.floor(d2.getTime() / 1000) + ' ' + (COPY.secUnit || ''),
          COPY.lblMs + ' ' + d2.getTime(),
        ].concat(lines(d2)).join('\n');
      } else { out.textContent = COPY.empty || ''; }
    }
    $(root, 'ts-conv').addEventListener('click', update);
    $(root, 'ts-clear').addEventListener('click', function () { tsInput.value = ''; dateInput.value = ''; update(); });
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- IP converter
  T['ip-converter'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).ipConv) || {};
    var input = $(root, 'ip-input');
    var out = $(root, 'ip-out');
    function toLong(ip) { return ip.split('.').reduce(function (acc, octet) { return (acc << 8) + parseInt(octet, 10); }, 0) >>> 0; }
    function fromLong(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
    function fromHex(h) { h = h.replace(/^0x/i, '').replace(/[^0-9a-f]/gi, ''); if (h.length > 8) h = h.slice(-8); while (h.length < 8) h = '0' + h; return fromLong(parseInt(h, 16)); }
    function fromBinary(b) { b = b.replace(/[^01]/g, ''); if (b.length > 32) b = b.slice(-32); while (b.length < 32) b = '0' + b; var parts = []; for (var i = 0; i < 32; i += 8) parts.push(parseInt(b.slice(i, i + 8), 2)); return parts.join('.'); }
    function toHex(ip) { var n = toLong(ip); var h = n.toString(16).toUpperCase(); while (h.length < 8) h = '0' + h; return '0x' + h; }
    function toBinary(ip) { var n = toLong(ip); var b = ''; for (var i = 24; i >= 0; i -= 8) b += ((n >>> i) & 255).toString(2).padStart(8, '0') + (i > 0 ? '.' : ''); return b; }
    function update() {
      var val = input.value.replace(/\s+/g, '');
      if (!val) { out.textContent = COPY.empty || ''; return; }
      var ip;
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(val)) {
        var parts = val.split('.').map(Number);
        if (parts.some(function (p) { return p < 0 || p > 255; })) { out.textContent = COPY.invalidOctets || ''; return; }
        ip = val;
      } else if (/^0x[0-9a-fA-F]+$/.test(val) || /^[0-9a-fA-F]{8}$/.test(val)) { try { ip = fromHex(val); } catch (e) { ip = null; } }
      else if (/^\d+$/.test(val)) { try { ip = fromLong(parseInt(val, 10)); } catch (e) { ip = null; } }
      else if (/^[01]{8}(\.[01]{8}){3}$/.test(val)) { try { ip = fromBinary(val); } catch (e) { ip = null; } }
      else { out.textContent = COPY.unrecognized || ''; return; }
      if (!ip) { out.textContent = COPY.invalid || ''; return; }
      out.textContent = [
        COPY.lblDotted + ' ' + ip,
        COPY.lblHex + ' ' + toHex(ip),
        COPY.lblDec + ' ' + toLong(ip),
        COPY.lblBinary + ' ' + toBinary(ip),
      ].join('\n');
    }
    $(root, 'ip-conv').addEventListener('click', update);
    root.addEventListener('input', update);
    update();
  };

  // ---------------------------------------------------------- regex tester
  T['regex-tester'] = function (root) {
    var pat = $(root, 'rt-pattern');
    var txt = $(root, 'rt-text');
    var out = $(root, 'rt-out');
    var stats = $(root, 'rt-stats');
    var KEYS = ['g', 'i', 'm', 's', 'u'];

    function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }
    function flags() {
      var f = '';
      for (var i = 0; i < KEYS.length; i++) {
        var c = $(root, 'rt-f-' + KEYS[i]);
        if (c && c.checked) f += KEYS[i];
      }
      return f;
    }

    function update() {
      if (!out || !stats) return;
      clear(out);
      var source = pat ? pat.value : '';
      var text = txt ? txt.value : '';
      if (!source) { stats.textContent = 'Enter a pattern to test.'; return; }

      var f = flags();
      var re;
      try {
        re = new RegExp(source, f);
      } catch (e) {
        stats.textContent = 'Invalid pattern: ' + String((e && e.message) || e);
        return;
      }
      if (!text) { stats.textContent = 'Paste some text to search.'; return; }

      var matches = [], m, guard = 0, looping = f.indexOf('g') !== -1 || f.indexOf('y') !== -1;
      try {
        if (!looping) {
          m = re.exec(text);
          if (m) matches.push(m);
        } else {
          while ((m = re.exec(text)) !== null && guard++ < 5000) {
            matches.push(m);
            if (m[0] === '') re.lastIndex++; // zero-length match: never loop
          }
        }
      } catch (e) {
        stats.textContent = 'Could not run the pattern: ' + String((e && e.message) || e);
        return;
      }

      if (!matches.length) { stats.textContent = 'No matches in this text.'; return; }
      stats.textContent = matches.length + (matches.length === 1 ? ' match' : ' matches') +
        ' \u00b7 ' + text.length + ' characters tested \u00b7 flags: ' + (f || 'none');

      var list = el('ul');
      for (var i = 0; i < matches.length && i < 200; i++) {
        var g = matches[i];
        var li = el('li');
        li.appendChild(el('span', '', '# ' + (i + 1) + '  \u201c' + g[0] + '\u201d  at ' + g.index + '\u2013' + (g.index + g[0].length)));
        if (g.length > 1 || (g.groups && Object.keys(g.groups).length)) {
          var inner = el('ul');
          for (var k = 1; k < g.length; k++) {
            inner.appendChild(el('li', '', 'group ' + k + ': ' + (g[k] === undefined ? '(not set)' : '\u201c' + g[k] + '\u201d')));
          }
          if (g.groups) {
            for (var name in g.groups) {
              if (Object.prototype.hasOwnProperty.call(g.groups, name)) {
                inner.appendChild(el('li', '', 'group ' + name + ': ' + (g.groups[name] === undefined ? '(not set)' : '\u201c' + g.groups[name] + '\u201d')));
              }
            }
          }
          li.appendChild(inner);
        }
        list.appendChild(li);
      }
      out.appendChild(list);
      if (matches.length > 200) out.appendChild(el('div', '', 'Showing the first 200 matches.'));
    }

    root.addEventListener('input', update);
    root.addEventListener('change', update);
    update();
  };

  // ---------------------------------------------------------- QR code generator
  T['qr-code-generator'] = function (root) {
    var textIn = $(root, 'qr-text');
    var sizeSel = $(root, 'qr-size');
    var ecSel = $(root, 'qr-ec');
    var out = $(root, 'qr-out');
    var stats = $(root, 'qr-stats');
    var runBtn = $(root, 'qr-run');
    var pngBtn = $(root, 'qr-png');
    var svgBtn = $(root, 'qr-svg');
    var current = null; // { q, size, text, ec }
    var NS = 'http://www.w3.org/2000/svg';
    var QUIET = 4;

    function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

    // The encoder takes an explicit type number, so grow it until the payload
    // fits instead of guessing: a short URL lands small, a long one lands larger.
    function encode(text, ec) {
      if (typeof window.qrcode !== 'function') return null;
      for (var n = 1; n <= 40; n++) {
        try {
          var q = window.qrcode(n, ec);
          q.addData(text);
          q.make();
          return q;
        } catch (e) { /* capacity exceeded at this size — try the next */ }
      }
      return null;
    }

    function pathFor(q) {
      var count = q.getModuleCount(), d = '';
      for (var r = 0; r < count; r++) {
        for (var c = 0; c < count; c++) {
          if (q.isDark(r, c)) d += 'M' + (c + QUIET) + ' ' + (r + QUIET) + 'h1v1h-1z';
        }
      }
      return d;
    }

    function previewSvg(q, size) {
      var count = q.getModuleCount(), total = count + QUIET * 2;
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'qr-preview');
      svg.setAttribute('viewBox', '0 0 ' + total + ' ' + total);
      svg.setAttribute('width', String(size));
      svg.setAttribute('height', String(size));
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'QR code preview');
      var bg = document.createElementNS(NS, 'rect');
      bg.setAttribute('width', String(total));
      bg.setAttribute('height', String(total));
      bg.setAttribute('fill', '#ffffff');
      svg.appendChild(bg);
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', pathFor(q));
      path.setAttribute('fill', '#000000');
      svg.appendChild(path);
      return svg;
    }

    function svgMarkup() {
      if (!current) return null;
      var count = current.q.getModuleCount(), total = count + QUIET * 2;
      return '<svg xmlns="http://www.w3.org/2000/svg" width="' + current.size + '" height="' + current.size +
        '" viewBox="0 0 ' + total + ' ' + total + '"><rect width="' + total + '" height="' + total +
        '" fill="#ffffff"/><path d="' + pathFor(current.q) + '" fill="#000000"/></svg>';
    }

    // Canvas is only reached on download, and only where the browser supports
    // it — the preview above is plain SVG, so the tool still works without one.
    function pngUrl() {
      if (!current) return null;
      var count = current.q.getModuleCount(), total = count + QUIET * 2;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext && canvas.getContext('2d');
      if (!ctx || typeof canvas.toDataURL !== 'function') return null;
      var scale = Math.max(1, Math.round(current.size / total));
      var dim = total * scale;
      canvas.width = dim;
      canvas.height = dim;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, dim, dim);
      ctx.fillStyle = '#000000';
      for (var r = 0; r < count; r++) {
        for (var c = 0; c < count; c++) {
          if (current.q.isDark(r, c)) ctx.fillRect((c + QUIET) * scale, (r + QUIET) * scale, scale, scale);
        }
      }
      try { return canvas.toDataURL('image/png'); } catch (e) { return null; }
    }

    function save(href, filename, mime) {
      var a = document.createElement('a');
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (mime === 'image/png') setTimeout(function () { URL.revokeObjectURL(href); }, 500);
      if (window.T4M_TRACK) {
        try { window.T4M_TRACK('download_output', { tool_slug: 'qr-code-generator', file_name: filename }); } catch (e) { /* analytics never blocks a download */ }
      }
    }

    function generate() {
      if (!out || !stats) return;
      clear(out);
      var text = textIn ? textIn.value : '';
      if (!text) { stats.textContent = 'Enter a link or some text to encode.'; current = null; return; }
      var ec = ecSel && ecSel.value ? ecSel.value : 'M';
      var size = parseInt(sizeSel && sizeSel.value, 10) || 512;
      var q = encode(text, ec);
      if (!q) {
        stats.textContent = 'That text is too long for one QR code \u2014 shorten it, or link to a page instead.';
        current = null;
        return;
      }
      current = { q: q, size: size, text: text, ec: ec };
      out.appendChild(previewSvg(q, size));
      var n = q.getModuleCount();
      stats.textContent = 'QR code generated \u00b7 ' + n + '\u00d7' + n + ' modules \u00b7 error correction ' +
        ec + ' \u00b7 ' + size + ' px.';
    }

    root.addEventListener('input', generate);
    root.addEventListener('change', generate);
    if (runBtn) runBtn.addEventListener('click', generate);
    if (pngBtn) pngBtn.addEventListener('click', function () {
      if (!current) generate();
      if (!current) return;
      var url = pngUrl();
      if (!url) { stats.textContent = 'PNG export is not available in this browser \u2014 the SVG download still works.'; return; }
      save(url, 'qr-code.png', 'image/png');
    });
    if (svgBtn) svgBtn.addEventListener('click', function () {
      if (!current) generate();
      var markup = svgMarkup();
      if (!markup) return;
      var url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
      save(url, 'qr-code.svg');
    });
    generate();
  };

  // ---------------------------------------------------------- colour picker
  T['color-picker'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).colorPick) || {};
    var pick = $(root, 'cp-pick');
    var hexIn = $(root, 'cp-hex');
    var out = $(root, 'cp-out');

    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function parseHex(v) {
      var s = String(v || '').trim().replace(/^#/, '');
      if (/^[0-9a-f]{3}$/i.test(s)) s = s.replace(/(.)/g, '$1$1');
      if (!/^[0-9a-f]{6}$/i.test(s)) return null;
      return {
        hex: '#' + s.toLowerCase(),
        r: parseInt(s.slice(0, 2), 16),
        g: parseInt(s.slice(2, 4), 16),
        b: parseInt(s.slice(4, 6), 16),
      };
    }
    function toHex(r, g, b) {
      var h = function (n) { var x = Math.round(Math.max(0, Math.min(255, n))).toString(16); return x.length < 2 ? '0' + x : x; };
      return '#' + h(r) + h(g) + h(b);
    }
    function mix(c, target, t) {
      return {
        r: c.r + (target.r - c.r) * t,
        g: c.g + (target.g - c.g) * t,
        b: c.b + (target.b - c.b) * t,
      };
    }
    function toHsl(c) {
      var r = c.r / 255, g = c.g / 255, b = c.b / 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h = 0, s = 0, l = (max + min) / 2;
      var d = max - min;
      if (d) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = ((b - r) / d + 2);
        else h = ((r - g) / d + 4);
        h *= 60;
      }
      return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    function lum(c) {
      var f = function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    }
    function ratio(a, b) {
      var hi = Math.max(a, b), lo = Math.min(a, b);
      return (hi + 0.05) / (lo + 0.05);
    }
    function tile(label, value, sub, cls) {
      var t = el('div', 'stat-tile');
      t.appendChild(el('span', 'stat-tile-label', label));
      t.appendChild(el('span', 'stat-tile-value', value));
      if (sub) t.appendChild(el('span', 'stat-tile-delta ' + (cls || 'flat'), sub));
      return t;
    }
    function swatchRow(c) {
      var row = el('div', 'swatch-row');
      var white = { r: 255, g: 255, b: 255 };
      var black = { r: 0, g: 0, b: 0 };
      var steps = [];
      for (var i = 4; i >= 1; i--) steps.push({ c: mix(c, white, i * 0.16), label: null });
      steps.push({ c: c, label: c.hex });
      for (var j = 1; j <= 4; j++) steps.push({ c: mix(c, black, j * 0.16), label: null });
      steps.forEach(function (s) {
        var hex = toHex(s.c.r, s.c.g, s.c.b);
        var box = el('div', 'swatch');
        var bar = el('i');
        bar.style.background = hex;
        box.appendChild(bar);
        box.appendChild(el('code', null, hex));
        row.appendChild(box);
      });
      return row;
    }
    function verdict(r) {
      if (r >= 7) return { txt: (COPY.pass || 'passes') + ' ' + (COPY.aa || 'AA') + ' · ' + (COPY.aaa || 'AAA'), cls: 'up' };
      if (r >= 4.5) return { txt: (COPY.pass || 'passes') + ' ' + (COPY.aa || 'AA'), cls: 'up' };
      return { txt: COPY.fail || 'fails', cls: 'down' };
    }
    function render(c) {
      out.textContent = '';
      var hero = el('div', 'color-hero');
      hero.style.background = c.hex;
      out.appendChild(hero);

      var hsl = toHsl(c);
      var strip = el('div', 'kpi-strip');
      strip.appendChild(tile(COPY.hex || 'HEX', c.hex));
      strip.appendChild(tile(COPY.rgb || 'RGB', 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')'));
      strip.appendChild(tile(COPY.hsl || 'HSL', 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)'));
      out.appendChild(strip);

      var rampHead = el('p', 'tool-note');
      rampHead.textContent = COPY.rampHead || 'Tints and shades';
      out.appendChild(rampHead);
      out.appendChild(swatchRow(c));

      var L = lum(c);
      // Black text has luminance 0, white text has luminance 1. Naming the
      // variables after the text colour (not the background) is the difference
      // between a checker that is right and one whose two labels are swapped.
      var blackText = ratio(L, 0);
      var whiteText = ratio(L, 1);
      var head = el('p', 'tool-note');
      head.textContent = COPY.contrastHead || 'Contrast with text';
      out.appendChild(head);
      var cstrip = el('div', 'kpi-strip');
      var vBlack = verdict(blackText);
      var vWhite = verdict(whiteText);
      cstrip.appendChild(tile(COPY.onLight || 'Black text on this colour', tpl(COPY.ratio || '{n}:1', { n: blackText.toFixed(2) }), vBlack.txt, vBlack.cls));
      cstrip.appendChild(tile(COPY.onDark || 'White text on this colour', tpl(COPY.ratio || '{n}:1', { n: whiteText.toFixed(2) }), vWhite.txt, vWhite.cls));
      out.appendChild(cstrip);

      var foot = el('p', 'tool-note');
      foot.textContent = COPY.note || '';
      out.appendChild(foot);
    }
    function fromHexInput() {
      var c = parseHex(hexIn.value);
      if (!c) { out.textContent = COPY.invalid || ''; return; }
      if (pick.value.toLowerCase() !== c.hex) pick.value = c.hex;
      render(c);
    }
    function fromPick() {
      var c = parseHex(pick.value);
      if (!c) return;
      hexIn.value = c.hex;
      render(c);
    }

    pick.addEventListener('input', fromPick);
    pick.addEventListener('change', fromPick);
    hexIn.addEventListener('input', fromHexInput);
    if (!parseHex(hexIn.value)) hexIn.value = '#243b63';
    fromHexInput();
  };

  // ---------------------------------------------------------- CSS minifier
  T['css-minifier'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).cssMin) || {};
    var input = $(root, 'cm-in');
    var out = $(root, 'cm-out');
    var stats = $(root, 'cm-stats');

    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function bytes(s) {
      if (window.TextEncoder) return new TextEncoder().encode(s).length;
      return unescape(encodeURIComponent(s)).length;
    }
    // Walk the source once, copying strings and url() bodies verbatim, dropping
    // comments, and collapsing runs of whitespace to a single space only where
    // two identifier characters would otherwise touch.
    function sweep(src) {
      var out = '', i = 0, n = src.length, quote = null, braces = 0;
      while (i < n) {
        var ch = src[i], next = src[i + 1];
        if (quote) {
          out += ch;
          if (ch === '\\') { out += next || ''; i += 2; continue; }
          if (ch === quote) quote = null;
          i++; continue;
        }
        if (ch === '/' && next === '*') {
          var end = src.indexOf('*/', i + 2);
          i = end === -1 ? n : end + 2;
          continue;
        }
        if (ch === '"' || ch === "'") { quote = ch; out += ch; i++; continue; }
        if (ch === '{') braces++;
        if (ch === '}') braces--;
        if (/\s/.test(ch)) {
          var j = i;
          while (j < n && /\s/.test(src[j])) j++;
          var prev = out.charAt(out.length - 1);
          var after = src[j] || '';
          if (prev && after && /[a-zA-Z0-9_%)\-]/.test(prev) && /[a-zA-Z0-9_(\-]/.test(after)) out += ' ';
          i = j; continue;
        }
        out += ch; i++;
      }
      return { css: out, braces: braces, quote: quote };
    }
    function minify(src) {
      var pass = sweep(src);
      if (pass.quote) return { error: 'invalidBraces', open: 0, close: 0 };
      if (!/\{/.test(src)) return { error: 'notCss' };
      if (pass.braces !== 0) return { error: 'invalidBraces', open: Math.max(0, pass.braces), close: Math.max(0, -pass.braces) };
      var css = pass.css
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        .replace(/;}/g, '}')
        .replace(/\s+/g, ' ')
        .trim();
      return { css: css };
    }
    function update() {
      var src = input.value;
      if (!src.trim()) { out.textContent = ''; stats.textContent = COPY.empty || ''; return; }
      var r = minify(src);
      if (r.error) {
        out.textContent = src;
        stats.textContent = r.error === 'invalidBraces'
          ? tpl(COPY.invalidBraces || '', { o: r.open, c: r.close })
          : (COPY.notCss || '');
        return;
      }
      out.textContent = r.css;
      var before = bytes(src), after = bytes(r.css);
      if (after >= before) {
        stats.textContent = COPY.unchanged || '';
      } else {
        stats.textContent = tpl(COPY.stats || '', {
          a: before, b: after, p: Math.round((1 - after / before) * 100),
        });
      }
    }
    root.addEventListener('input', update);
    update();
  };
  // ---------------------------------------------------------- cron expression generator
  // The engine is exported so tests can drive it with a fixed clock instead of
  // asserting whatever the wall clock happens to say. Standard five-field cron:
  // minute hour day-of-month month day-of-week. No seconds, no @reboot.
  var CRON = window.T4M_CRON = (function () {
    var MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
    var DAYS = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    var FIELDS = [
      { key: 'minute', min: 0, max: 59 },
      { key: 'hour', min: 0, max: 23 },
      { key: 'dom', min: 1, max: 31 },
      { key: 'month', min: 1, max: 12, names: MONTHS },
      { key: 'dow', min: 0, max: 7, names: DAYS },
    ];

    function substitute(text, names) {
      if (!names) return text;
      return String(text).replace(/[a-z]{3}/gi, function (m) {
        var n = names[m.toLowerCase()];
        return n == null ? m : String(n);
      });
    }

    // One field → a boolean table over its legal range, or an error naming the
    // field and the value that failed. Everything the parser accepts is also
    // what the scheduler understands; there is no second, laxer code path.
    function parseField(text, spec) {
      var raw = String(text == null ? '' : text).trim();
      if (!raw) return { error: { reason: 'empty', field: spec.key } };
      raw = substitute(raw, spec.names);
      var values = {};
      var pieces = raw.split(',');
      for (var p = 0; p < pieces.length; p++) {
        var piece = pieces[p].trim();
        if (!piece) return { error: { reason: 'field', field: spec.key, value: pieces[p] } };
        var step = 1;
        var slash = piece.split('/');
        if (slash.length > 2) return { error: { reason: 'field', field: spec.key, value: piece } };
        if (slash.length === 2) {
          if (!/^\d+$/.test(slash[1])) return { error: { reason: 'field', field: spec.key, value: piece } };
          step = parseInt(slash[1], 10);
          if (step < 1) return { error: { reason: 'field', field: spec.key, value: piece } };
        }
        var base = slash[0];
        var lo, hi;
        if (base === '*') { lo = spec.min; hi = spec.max; }
        else if (base.indexOf('-') > 0) {
          var ab = base.split('-');
          if (!/^\d+$/.test(ab[0]) || !/^\d+$/.test(ab[1])) return { error: { reason: 'field', field: spec.key, value: piece } };
          lo = parseInt(ab[0], 10); hi = parseInt(ab[1], 10);
        } else {
          if (!/^\d+$/.test(base)) return { error: { reason: 'field', field: spec.key, value: piece } };
          lo = parseInt(base, 10);
          hi = slash.length === 2 ? spec.max : lo;
        }
        if (lo < spec.min || hi > spec.max || lo > hi) {
          return { error: { reason: 'field', field: spec.key, value: piece } };
        }
        for (var v = lo; v <= hi; v += step) values[v] = true;
      }
      if (spec.key === 'dow' && values[7]) { values[0] = true; delete values[7]; }
      return { values: values, spec: raw, restricted: raw !== '*' };
    }

    function parse(expr) {
      var parts = String(expr || '').trim().split(/\s+/).filter(Boolean);
      if (parts.length !== 5) return { error: { reason: 'fields', n: parts.length } };
      var out = {};
      for (var i = 0; i < 5; i++) {
        var r = parseField(parts[i], FIELDS[i]);
        if (r.error) return { error: r.error };
        out[FIELDS[i].key] = r;
      }
      return { fields: out };
    }

    function dayMatches(f, d) {
      if (!f.month.values[d.getMonth() + 1]) return false;
      var domOk = !!f.dom.values[d.getDate()];
      var dowOk = !!f.dow.values[d.getDay()];
      // Vixie cron ORs the two day fields when both are restricted; when either
      // is '*', the other one alone decides. Getting this backwards is the most
      // common reason a job fires on a day the author did not expect.
      if (f.dom.restricted && f.dow.restricted) return domOk || dowOk;
      return domOk && dowOk;
    }

    function nextRuns(expr, from, count) {
      var parsed = parse(expr);
      if (parsed.error) return { error: parsed.error };
      var f = parsed.fields;
      var base = from ? new Date(from.getTime()) : new Date();
      base.setSeconds(0, 0);
      base.setMinutes(base.getMinutes() + 1);
      var out = [];
      var firstMinute = base.getHours() * 60 + base.getMinutes();
      var DAYS_AHEAD = 1827; // five years, leap year included
      for (var i = 0; i < DAYS_AHEAD && out.length < count; i++) {
        var d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
        if (!dayMatches(f, d)) continue;
        var fromMin = i === 0 ? firstMinute : 0;
        for (var m = fromMin; m < 1440 && out.length < count; m++) {
          var hh = Math.floor(m / 60), mm = m % 60;
          if (f.hour.values[hh] && f.minute.values[mm]) {
            out.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm));
          }
        }
      }
      return { runs: out, exhausted: out.length < count };
    }

    return { parse: parse, nextRuns: nextRuns, parseField: parseField };
  })();

  T['cron-expression-generator'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).cronGen) || {};
    var expr = $(root, 'cr-expr');
    var fields = {
      minute: $(root, 'cr-min'), hour: $(root, 'cr-hour'), dom: $(root, 'cr-dom'),
      month: $(root, 'cr-month'), dow: $(root, 'cr-dow'),
    };
    var code = $(root, 'cr-out');
    var report = $(root, 'cr-report');
    var syncing = false;

    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function fieldWord(key) {
      return { minute: COPY.labelMinute, hour: COPY.labelHour, dom: COPY.labelDom,
        month: COPY.labelMonth, dow: COPY.labelDow }[key] || key;
    }
    function reason(err) {
      if (!err) return '';
      if (err.reason === 'fields') return tpl(COPY.reasonFields || '', { n: err.n });
      if (err.reason === 'empty') return tpl(COPY.reasonEmpty || '', { field: String(fieldWord(err.field)).toLowerCase() });
      var spec = { minute: [0, 59], hour: [0, 23], dom: [1, 31], month: [1, 12], dow: [0, 7] }[err.field] || [0, 59];
      return tpl(COPY.reasonField || '', {
        field: String(fieldWord(err.field)).toLowerCase(),
        value: err.value, min: spec[0], max: spec[1],
      });
    }
    function humanise(spec, key) {
      var s = String(spec || '').trim();
      if (s === '*') return COPY.any || '';
      var slash = s.split('/');
      var step = slash.length === 2 ? slash[1] : null;
      var base = slash[0];
      if (base === '*' && step) return tpl(COPY.step || '', { n: step });
      if (base.indexOf('-') > 0) {
        var ab = base.split('-');
        return step ? tpl(COPY.stepRange || '', { n: step, a: ab[0], b: ab[1] })
          : tpl(COPY.range || '', { a: ab[0], b: ab[1] });
      }
      if (s.indexOf(',') !== -1) return tpl(COPY.listVal || '', { n: s.split(',').length });
      return s;
    }
    function describe(parsed) {
      var f = parsed.fields;
      var minSpec = f.minute.spec, hourSpec = f.hour.spec;
      var mins = Object.keys(f.minute.values).map(Number).sort(function (a, b) { return a - b; });
      var hours = Object.keys(f.hour.values).map(Number).sort(function (a, b) { return a - b; });
      if (minSpec === '*' && hourSpec === '*') return COPY.everyMinute || '';
      if (/^\*\/(\d+)$/.test(minSpec) && hourSpec === '*') {
        return tpl(COPY.everyNMinutes || '', { n: minSpec.split('/')[1] });
      }
      if (hourSpec === '*' && mins.length === 1) return tpl(COPY.hourlyAt || '', { m: pad(mins[0]) });
      if (hours.length === 1 && mins.length === 1) {
        var t = pad(hours[0]) + ':' + pad(mins[0]);
        var domStar = f.dom.spec === '*', dowStar = f.dow.spec === '*', monStar = f.month.spec === '*';
        if (domStar && dowStar && monStar) return tpl(COPY.dailyAt || '', { t: t });
        if (domStar && monStar && !dowStar) {
          var names = (COPY.days || []);
          var dows = Object.keys(f.dow.values).map(Number).sort(function (a, b) { return a - b; })
            .map(function (d) { return names[d] || String(d); });
          return tpl(COPY.weeklyAt || '', { t: t, days: dows.join(', ') });
        }
        if (dowStar && monStar && Object.keys(f.dom.values).length === 1) {
          return tpl(COPY.monthlyAt || '', { t: t, d: Object.keys(f.dom.values)[0] });
        }
        if (dowStar && !monStar && Object.keys(f.dom.values).length === 1 && Object.keys(f.month.values).length === 1) {
          var mo = Number(Object.keys(f.month.values)[0]);
          return tpl(COPY.monthlyDate || '', { t: t, d: Object.keys(f.dom.values)[0], month: (COPY.months || [])[mo - 1] || mo });
        }
      }
      return tpl(COPY.generic || '', {
        m: minSpec, h: hourSpec, d: f.dom.spec, mo: f.month.spec, w: f.dow.spec,
      });
    }
    function render() {
      var text = expr.value.trim().replace(/\s+/g, ' ');
      var parsed = CRON.parse(text);
      code.textContent = text;
      report.textContent = '';
      if (parsed.error) {
        report.textContent = tpl(COPY.invalid || '', { reason: reason(parsed.error) });
        return;
      }
      var p = el('p', 'tool-note');
      p.textContent = describe(parsed);
      report.appendChild(p);

      var next = CRON.nextRuns(text, new Date(), 5);
      var head = el('p', 'tool-note');
      head.textContent = COPY.nextHead || '';
      report.appendChild(head);
      if (!next.runs.length) {
        var none = el('p', 'tool-note');
        none.textContent = COPY.never || '';
        report.appendChild(none);
      } else {
        var list = el('ul', 'run-list');
        next.runs.forEach(function (d) {
          var li = el('li');
          li.textContent = d.toLocaleString(undefined, {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });
          list.appendChild(li);
        });
        report.appendChild(list);
      }

      var brk = el('p', 'tool-note');
      brk.textContent = COPY.breakHead || '';
      report.appendChild(brk);
      var grid = el('div', 'kpi-strip');
      ['minute', 'hour', 'dom', 'month', 'dow'].forEach(function (key) {
        var tile = el('div', 'stat-tile');
        tile.appendChild(el('span', 'stat-tile-label', fieldWord(key)));
        tile.appendChild(el('span', 'stat-tile-value', humanise(parsed.fields[key].spec, key)));
        grid.appendChild(tile);
      });
      report.appendChild(grid);

      var foot = el('p', 'tool-note');
      foot.textContent = COPY.note || '';
      report.appendChild(foot);
    }
    function fromFields() {
      if (syncing) return;
      syncing = true;
      expr.value = Object.keys(fields).map(function (k) { return fields[k].value.trim() || '*'; }).join(' ');
      syncing = false;
      render();
    }
    function fromExpr() {
      if (syncing) return;
      var parsed = CRON.parse(expr.value);
      if (!parsed.error) {
        syncing = true;
        Object.keys(fields).forEach(function (k) { fields[k].value = parsed.fields[k].spec; });
        syncing = false;
      }
      render();
    }
    Object.keys(fields).forEach(function (k) { fields[k].addEventListener('input', fromFields); });
    expr.addEventListener('input', fromExpr);
    Array.prototype.forEach.call(root.querySelectorAll('[data-cron]'), function (b) {
      b.addEventListener('click', function () {
        expr.value = b.getAttribute('data-cron');
        fromExpr();
      });
    });
    fromExpr();
  };

  // ---------------------------------------------------------- JSON to CSV
  T['json-to-csv'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).jsonCsv) || {};
    var input = $(root, 'jc-in');
    var delim = $(root, 'jc-delim');
    var flattenEl = $(root, 'jc-flatten');
    var guardEl = $(root, 'jc-guard');
    var bomEl = $(root, 'jc-bom');
    var out = $(root, 'jc-out');
    var stats = $(root, 'jc-stats');

    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    function bytes(s) {
      if (window.TextEncoder) return new TextEncoder().encode(s).length;
      return unescape(encodeURIComponent(s)).length;
    }
    function isPlain(v) { return v && typeof v === 'object' && !Array.isArray(v); }

    function flattenInto(row, prefix, outObj) {
      Object.keys(row).forEach(function (k) {
        var key = prefix ? prefix + '.' + k : k;
        var v = row[k];
        if (flattenEl.checked && isPlain(v)) flattenInto(v, key, outObj);
        else outObj[key] = v;
      });
    }
    function cellsOf(row) {
      if (Array.isArray(row)) {
        var o = {};
        row.forEach(function (v, i) { o['column_' + (i + 1)] = v; });
        return o;
      }
      if (isPlain(row)) {
        var flat = {};
        flattenInto(row, '', flat);
        return flat;
      }
      return { value: row };
    }
    function toText(v) {
      if (v === null || v === undefined) return '';
      if (typeof v === 'string') return v;
      if (typeof v === 'number' || typeof v === 'boolean') return String(v);
      return JSON.stringify(v);
    }
    function quoteCell(text, sep) {
      var s = String(text);
      if (guardEl.checked) {
        // Only values a spreadsheet would execute, never plain negative numbers.
        var looksNumeric = /^-?\d+(\.\d+)?$/.test(s);
        if (/^[=+@]/.test(s) || (s.charAt(0) === '-' && !looksNumeric) || /^[\t\r]/.test(s)) s = "'" + s;
      }
      if (s.indexOf(sep) !== -1 || /["\n\r]/.test(s)) return '"' + s.split('"').join('""') + '"';
      return s;
    }
    function update() {
      var src = input.value.trim();
      if (!src) { out.textContent = ''; stats.textContent = COPY.empty || ''; return; }
      var data;
      try { data = JSON.parse(src); }
      catch (e) {
        out.textContent = '';
        stats.textContent = tpl(COPY.invalid || '', { msg: (e && e.message) || '' });
        return;
      }
      if (!Array.isArray(data) && !isPlain(data)) {
        out.textContent = '';
        stats.textContent = tpl(COPY.notRows || '', { kind: Array.isArray(data) ? 'array' : typeof data });
        return;
      }
      var rows = Array.isArray(data) ? data : [data];
      var sep = delim.value === 'semicolon' ? ';' : delim.value === 'tab' ? '\t' : ',';
      var records = rows.map(cellsOf);
      var cols = [];
      records.forEach(function (r) {
        Object.keys(r).forEach(function (k) { if (cols.indexOf(k) === -1) cols.push(k); });
      });
      if (!rows.length) { out.textContent = ''; stats.textContent = COPY.noRows || ''; return; }
      var lines = [cols.map(function (c) { return quoteCell(c, sep); }).join(sep)];
      records.forEach(function (r) {
        lines.push(cols.map(function (c) { return quoteCell(toText(r[c]), sep); }).join(sep));
      });
      var csv = lines.join('\n');
      out.textContent = csv;
      stats.textContent = tpl(COPY.stats || '', {
        r: records.length, c: cols.length, b: bytes(csv) + (bomEl.checked ? 3 : 0),
      });
    }
    [input, delim, flattenEl, guardEl, bomEl].forEach(function (node) {
      node.addEventListener('input', update);
      node.addEventListener('change', update);
    });
    update();
  };

  // ---------------------------------------------------------- hash generator
  T['hash-generator'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).hashGen) || {};
    var input = $(root, 'hg-in');
    var upper = $(root, 'hg-upper');
    var out = $(root, 'hg-out');
    var ALGOS = [
      { key: 'md5', label: 'MD5', bits: 128 },
      { key: 'sha1', label: 'SHA-1', bits: 160 },
      { key: 'sha256', label: 'SHA-256', bits: 256 },
      { key: 'sha512', label: 'SHA-512', bits: 512 },
    ];

    function hex(bytes, up) {
      var s = '';
      for (var i = 0; i < bytes.length; i++) {
        var h = bytes[i].toString(16);
        if (h.length < 2) h = '0' + h;
        s += h;
      }
      return up ? s.toUpperCase() : s;
    }
    function utf8(text) {
      if (window.TextEncoder) return new TextEncoder().encode(text);
      // Older engines (and some test harnesses) have no TextEncoder. Encode
      // UTF-8 by hand rather than throwing before the digest can be computed.
      var out = [];
      for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c < 0x80) out.push(c);
        else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
        else if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length) {
          var cp = 0x10000 + ((c - 0xd800) << 10) + (text.charCodeAt(i + 1) - 0xdc00);
          out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
          i++;
        } else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      }
      return new Uint8Array(out);
    }
    // MD5 is not in WebCrypto (it is broken by design), so it ships here as a
    // small implementation. Same padding and length rules as RFC 1321.
    function md5(bytes) {
      var shift = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
      var K = new Int32Array(64);
      for (var k = 0; k < 64; k++) K[k] = Math.floor(Math.abs(Math.sin(k + 1)) * 4294967296) | 0;
      var len = bytes.length;
      var padded = new Uint8Array((((len + 8) >> 6) + 1) << 6);
      padded.set(bytes);
      padded[len] = 0x80;
      var view = new DataView(padded.buffer);
      view.setUint32(padded.length - 8, (len << 3) >>> 0, true);
      view.setUint32(padded.length - 4, Math.floor(len / 536870912), true);
      var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
      for (var off = 0; off < padded.length; off += 64) {
        var M = new Int32Array(16);
        for (var j = 0; j < 16; j++) M[j] = view.getInt32(off + j * 4, true);
        var A = a0, B = b0, C = c0, D = d0;
        for (var i = 0; i < 64; i++) {
          var F, g;
          if (i < 16) { F = (B & C) | (~B & D); g = i; }
          else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
          else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
          else { F = C ^ (B | ~D); g = (7 * i) % 16; }
          F = (F + A + K[i] + M[g]) | 0;
          A = D; D = C; C = B;
          B = (B + ((F << shift[i]) | (F >>> (32 - shift[i])))) | 0;
        }
        a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
      }
      var digest = new Uint8Array(16);
      [a0, b0, c0, d0].forEach(function (word, idx) {
        digest[idx * 4] = word & 0xff;
        digest[idx * 4 + 1] = (word >>> 8) & 0xff;
        digest[idx * 4 + 2] = (word >>> 16) & 0xff;
        digest[idx * 4 + 3] = (word >>> 24) & 0xff;
      });
      return digest;
    }

    window.T4M_HASH = { md5: md5, hex: hex, utf8: utf8 };

    function render() {
      var text = input.value;
      var up = upper.checked;
      out.textContent = '';
      if (!text) { out.textContent = COPY.empty || ''; return; }
      var bytes = utf8(text);
      var rows = [];
      rows.push({ label: 'MD5', value: hex(md5(bytes), up) });
      var subtle = window.crypto && window.crypto.subtle;
      if (!subtle) {
        out.textContent = COPY.unsupported || '';
        return;
      }
      var pending = ALGOS.slice(1).map(function (a) {
        return subtle.digest(a.key === 'sha1' ? 'SHA-1' : a.key === 'sha256' ? 'SHA-256' : 'SHA-512', bytes)
          .then(function (buf) { return { label: a.label, value: hex(new Uint8Array(buf), up) }; });
      });
      Promise.all(pending).then(function (rest) {
        var all = rows.concat(rest);
        out.textContent = '';
        var grid = el('div', 'hash-grid');
        all.forEach(function (r) {
          var box = el('div', 'hash-row');
          box.appendChild(el('span', 'hash-label', r.label));
          var codeEl = el('code', 'hash-value', r.value);
          codeEl.id = 'hg-' + r.label.toLowerCase().replace(/[^a-z0-9]/g, '');
          box.appendChild(codeEl);
          var btn = el('button', 'btn-copy', 'Copy');
          btn.type = 'button';
          btn.setAttribute('data-copy', '#' + codeEl.id);
          box.appendChild(btn);
          grid.appendChild(box);
        });
        out.appendChild(grid);
        var foot = el('p', 'tool-note');
        foot.textContent = COPY.note || '';
        out.appendChild(foot);
      });
    }
    input.addEventListener('input', render);
    upper.addEventListener('change', render);
    render();
  };

  // ---------------------------------------------------------- favicon generator
  // The encoders are exported so the behaviour test can check real bytes in a
  // real unzip, without needing a canvas. Rendering is the browser's job.
  var FAV = window.T4M_FAVICON = (function () {
    var CRC = null;
    function crcTable() {
      if (CRC) return CRC;
      CRC = new Int32Array(256);
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        CRC[n] = c;
      }
      return CRC;
    }
    function crc32(bytes) {
      var table = crcTable();
      var c = 0xffffffff;
      for (var i = 0; i < bytes.length; i++) c = table[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
      return (c ^ 0xffffffff) >>> 0;
    }
    function utf8(str) {
      var s = String(str), out = [];
      for (var i = 0; i < s.length; i++) {
        var n = s.charCodeAt(i);
        if (n < 0x80) out.push(n);
        else if (n < 0x800) out.push(0xc0 | (n >> 6), 0x80 | (n & 63));
        else if (n >= 0xd800 && n <= 0xdbff && i + 1 < s.length) {
          var cp = 0x10000 + ((n - 0xd800) << 10) + (s.charCodeAt(i + 1) - 0xdc00);
          out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
          i++;
        } else out.push(0xe0 | (n >> 12), 0x80 | ((n >> 6) & 63), 0x80 | (n & 63));
      }
      return new Uint8Array(out);
    }
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    function bytesOf(v) { return typeof v === 'string' ? utf8(v) : v; }

    // Store-only ZIP (method 0). No compression: the payload is a handful of
    // PNGs and a manifest, and a deflate implementation would cost more code
    // than it saves bytes. Every structure here is from the PKZIP spec, and a
    // real unzip reads it — which is exactly what the test does.
    function buildZip(files) {
      var DOSDATE = ((2026 - 1980) << 9) | (11 << 5) | 11;
      var local = [], central = [], offset = 0;
      files.forEach(function (f) {
        var name = utf8(f.name);
        var data = bytesOf(f.data);
        var crc = crc32(data);
        var head = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(DOSDATE),
          u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0));
        var rec = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(DOSDATE),
          u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0),
          u32(0), u32(offset));
        local.push(new Uint8Array(head), name, data);
        central.push(new Uint8Array(rec), name);
        offset += head.length + name.length + data.length;
      });
      var centralSize = central.reduce(function (n, a) { return n + a.length; }, 0);
      var eocd = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
        u32(centralSize), u32(offset), u16(0)));
      var total = offset + centralSize + eocd.length;
      var out = new Uint8Array(total);
      var at = 0;
      local.concat(central).forEach(function (part) { out.set(part, at); at += part.length; });
      out.set(eocd, at);
      return out;
    }

    // PNG-in-ICO. Entry fields are from the ICONDIR/ICONDIRENTRY structures;
    // 256 is encoded as 0, which is the one field you cannot read literally.
    function buildIco(entries) {
      var head = 6 + 16 * entries.length;
      var total = head + entries.reduce(function (n, e) { return n + e.data.length; }, 0);
      var out = new Uint8Array(total);
      var view = new DataView(out.buffer);
      view.setUint16(0, 0, true);
      view.setUint16(2, 1, true);
      view.setUint16(4, entries.length, true);
      var offset = head;
      entries.forEach(function (e, i) {
        var p = 6 + i * 16;
        out[p] = e.size >= 256 ? 0 : e.size;
        out[p + 1] = e.size >= 256 ? 0 : e.size;
        out[p + 2] = 0;
        out[p + 3] = 0;
        view.setUint16(p + 4, 1, true);
        view.setUint16(p + 6, 32, true);
        view.setUint32(p + 8, e.data.length, true);
        view.setUint32(p + 12, offset, true);
        out.set(e.data, offset);
        offset += e.data.length;
      });
      return out;
    }

    function manifest(name, theme) {
      return JSON.stringify({
        name: name || 'Your site',
        short_name: name || 'Site',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: theme || '#2563eb',
        background_color: theme || '#2563eb',
        display: 'standalone',
      }, null, 2);
    }

    function headSnippet(hasSvg) {
      var lines = ['<link rel="icon" href="/favicon.ico" sizes="48x48">'];
      if (hasSvg) lines.push('<link rel="icon" type="image/svg+xml" href="/favicon.svg">');
      lines.push(
        '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
        '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
        '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
        '<link rel="manifest" href="/site.webmanifest">'
      );
      return lines.join('\n');
    }

    // Code points, not UTF-16 units: an emoji is one character to a person and
    // two to String.length, and a monogram should never be half a glyph.
    function clampText(text) {
      var chars = Array.from ? Array.from(String(text || '')) : String(text || '').split('');
      return chars.slice(0, 2).join('');
    }

    function byteLength(str) { return utf8(str).length; }

    return {
      crc32: crc32, utf8: utf8, buildZip: buildZip, buildIco: buildIco,
      manifest: manifest, headSnippet: headSnippet, clampText: clampText, byteLength: byteLength,
    };
  })();

  T['favicon-generator'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).faviconGen) || {};
    var modeText = $(root, 'fv-mode-text');
    var modeImage = $(root, 'fv-mode-image');
    var textPanel = $(root, 'fv-text-panel');
    var imagePanel = $(root, 'fv-image-panel');
    var textEl = $(root, 'fv-text');
    var bgEl = $(root, 'fv-bg');
    var fgEl = $(root, 'fv-fg');
    var fontEl = $(root, 'fv-font');
    var nameEl = $(root, 'fv-name');
    var fitEl = $(root, 'fv-fit');
    var fileEl = $(root, 'fv-file');
    var goBtn = $(root, 'fv-go');
    var statsEl = $(root, 'fv-stats');
    var previewEl = $(root, 'fv-preview');
    var filesEl = $(root, 'fv-files');
    var snippetEl = $(root, 'fv-snippet');
    var downloadBtn = $(root, 'fv-download');

    var SIZES = [16, 32, 48, 180, 192, 512];
    var NAMES = {
      16: 'favicon-16x16.png', 32: 'favicon-32x32.png', 48: 'favicon-48x48.png',
      180: 'apple-touch-icon.png', 192: 'android-chrome-192x192.png', 512: 'android-chrome-512x512.png',
    };
    var LIMIT = 2 * 1024 * 1024;
    var state = { zip: null, file: null, image: null, svgText: null };

    function setText(node, value) { if (node) node.textContent = value; }
    function status(msg) { setText(statsEl, msg || ''); }

    function listFiles(hasSvg) {
      var lines = ['favicon.ico               16 + 32 + 48 px'];
      SIZES.forEach(function (size) {
        lines.push((NAMES[size] + '                    ').slice(0, 26) + size + '×' + size);
      });
      lines.push('site.webmanifest          icons, theme colour, display');
      if (hasSvg) lines.push('favicon.svg               your uploaded vector, unchanged');
      setText(filesEl, lines.join('\n'));
    }

    function syncPanels() {
      var image = !!(modeImage && modeImage.checked);
      if (textPanel) textPanel.hidden = image;
      if (imagePanel) imagePanel.hidden = !image;
    }

    function colour(el, fallback) {
      var v = el && el.value ? String(el.value) : '';
      return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
    }

    function fontStack(kind) {
      if (kind === 'serif') return 'Georgia, "Times New Roman", serif';
      if (kind === 'mono') return 'ui-monospace, SFMono-Regular, Menlo, monospace';
      return 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    }

    function drawMonogram(ctx, size, text, bg, fg, font) {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var ratio = text.length > 1 ? 0.4 : 0.54;
      ctx.font = '700 ' + Math.max(6, Math.round(size * ratio)) + 'px ' + fontStack(font);
      ctx.fillText(text, size / 2, size / 2 + size * 0.02);
    }

    function drawFitted(ctx, img, size, fit) {
      var iw = img.naturalWidth || img.width || size;
      var ih = img.naturalHeight || img.height || size;
      ctx.clearRect(0, 0, size, size);
      if (fit === 'crop') {
        var scale = Math.max(size / iw, size / ih);
        var sw = size / scale, sh = size / scale;
        ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, size, size);
      } else {
        var f = Math.min(size / iw, size / ih);
        var dw = iw * f, dh = ih * f;
        ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
      }
    }

    function toPng(canvas) {
      return new Promise(function (resolve, reject) {
        if (typeof canvas.toBlob !== 'function') { reject(new Error('no-canvas')); return; }
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error('no-canvas')); return; }
          if (typeof blob.arrayBuffer === 'function') {
            blob.arrayBuffer().then(function (buf) { resolve(new Uint8Array(buf)); }, reject);
          } else if (window.FileReader) {
            var fr = new FileReader();
            fr.onload = function () { resolve(new Uint8Array(fr.result)); };
            fr.onerror = reject;
            fr.readAsArrayBuffer(blob);
          } else reject(new Error('no-canvas'));
        }, 'image/png');
      });
    }

    function loadImage(file) {
      return new Promise(function (resolve, reject) {
        if (!window.URL || typeof URL.createObjectURL !== 'function' || typeof Image !== 'function') {
          reject(new Error('no-canvas')); return;
        }
        var url = URL.createObjectURL(file);
        var img = new Image();
        img.onload = function () { resolve({ img: img, url: url }); };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('bad-image')); };
        img.src = url;
      });
    }

    function readText(file) {
      return new Promise(function (resolve) {
        if (!window.FileReader) { resolve(''); return; }
        var fr = new FileReader();
        fr.onload = function () { resolve(String(fr.result || '')); };
        fr.onerror = function () { resolve(''); };
        fr.readAsText(file);
      });
    }

    function paintPreview(canvases) {
      if (!previewEl) return;
      previewEl.textContent = '';
      [16, 32, 48, 180, 512].forEach(function (size) {
        var tile = el('div', 'favicon-tile');
        var c = canvases[size];
        if (c) {
          c.className = 'favicon-canvas';
          tile.appendChild(c);
        }
        tile.appendChild(el('span', 'favicon-size', size + ' px'));
        previewEl.appendChild(tile);
      });
    }

    // A capability probe, not a try/catch around the first draw: jsdom (and a
    // few embedded webviews) expose canvas methods that log "not implemented"
    // instead of throwing, so the only reliable test is reading one pixel.
    function canvasWorks() {
      try {
        var c = document.createElement('canvas');
        c.width = 1;
        c.height = 1;
        var ctx = c.getContext && c.getContext('2d');
        if (!ctx || typeof ctx.getImageData !== 'function') return false;
        if (typeof c.toBlob !== 'function') return false;
        ctx.getImageData(0, 0, 1, 1);
        return true;
      } catch (e) { return false; }
    }

    function generate() {
      var isImage = !!(modeImage && modeImage.checked);
      var hasSvg = !!(state.file && /svg/i.test(state.file.type || '') && state.svgText);
      listFiles(hasSvg);
      setText(snippetEl, FAV.headSnippet(hasSvg));

      if (isImage && !state.file) { status(''); return; }
      if (!isImage && !FAV.clampText(textEl && textEl.value)) {
        status(COPY.noText || '');
        return;
      }
      if (!canvasWorks()) { status(COPY.noCanvas || ''); return; }

      status(COPY.generating || '');
      var setup = isImage ? loadImage(state.file) : Promise.resolve(null);
      setup.then(function (loaded) {
        if (loaded) state.image = loaded.img;
        var canvases = {};
        var pngs = {};
        return Promise.all(SIZES.map(function (size) {
          var canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          var ctx = canvas.getContext && canvas.getContext('2d');
          if (!ctx) throw new Error('no-canvas');
          if (isImage) drawFitted(ctx, state.image, size, fitEl ? fitEl.value : 'letterbox');
          else {
            drawMonogram(ctx, size, FAV.clampText(textEl && textEl.value),
              colour(bgEl, '#2563eb'), colour(fgEl, '#ffffff'), fontEl ? fontEl.value : 'sans');
          }
          canvases[size] = canvas;
          return toPng(canvas).then(function (bytes) { pngs[size] = bytes; });
        })).then(function () {
          var ico = FAV.buildIco([16, 32, 48].map(function (s) { return { size: s, data: pngs[s] }; }));
          var siteName = (nameEl && nameEl.value ? nameEl.value : '').trim();
          var files = [
            { name: 'favicon.ico', data: ico },
            { name: 'favicon-16x16.png', data: pngs[16] },
            { name: 'favicon-32x32.png', data: pngs[32] },
            { name: 'favicon-48x48.png', data: pngs[48] },
            { name: 'apple-touch-icon.png', data: pngs[180] },
            { name: 'android-chrome-192x192.png', data: pngs[192] },
            { name: 'android-chrome-512x512.png', data: pngs[512] },
            { name: 'site.webmanifest', data: FAV.manifest(siteName, colour(bgEl, '#2563eb')) },
          ];
          if (hasSvg) files.push({ name: 'favicon.svg', data: state.svgText });
          state.zip = FAV.buildZip(files);
          paintPreview(canvases);
          var kb = Math.round(state.zip.length / 1024);
          status(String(COPY.ready || '').replace('{n}', files.length).replace('{size}', kb + ' KB'));
          if (hasSvg && COPY.svgIncluded) {
            status(statsEl.textContent + ' ' + COPY.svgIncluded);
          }
          if (downloadBtn) downloadBtn.textContent = COPY.download || 'Download favicons.zip';
        });
      }).catch(function (err) {
        var code = err && err.message;
        if (code === 'no-canvas') status(COPY.noCanvas || '');
        else if (code === 'bad-image') status(COPY.badImage || '');
        else status(COPY.badImage || '');
      });
    }

    if (fileEl) {
      fileEl.addEventListener('change', function () {
        var file = fileEl.files && fileEl.files[0];
        state.file = null;
        state.svgText = null;
        if (!file) { status(''); return; }
        if (file.size > LIMIT) {
          status(String(COPY.tooBig || '').replace('{mb}', (file.size / 1048576).toFixed(1)));
          fileEl.value = '';
          return;
        }
        if (!/^image\//.test(file.type || '')) { status(COPY.badType || ''); return; }
        state.file = file;
        if (/svg/i.test(file.type)) {
          readText(file).then(function (text) {
            state.svgText = text;
            generate();
          });
          return;
        }
        generate();
      });
    }

    [modeText, modeImage].forEach(function (r) {
      if (r) r.addEventListener('change', function () { syncPanels(); generate(); });
    });
    [textEl, bgEl, fgEl, fontEl, nameEl].forEach(function (input) {
      if (input) input.addEventListener('input', generate);
      if (input) input.addEventListener('change', generate);
    });
    if (goBtn) goBtn.addEventListener('click', generate);
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        if (!state.zip) { status(COPY.downloadWait || ''); return; }
        try {
          if (!window.URL || typeof URL.createObjectURL !== 'function') return;
          var blob = new Blob([state.zip], { type: 'application/zip' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'favicons.zip';
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        } catch (e) { status(COPY.badImage || ''); }
      });
    }

    syncPanels();
    listFiles(false);
    setText(snippetEl, FAV.headSnippet(false));
    status(COPY.note || '');
  };

  // ---------------------------------------------------------- SVG optimizer
  // Exported so tests can assert what the DOM walk did to a known file rather
  // than trusting a screenshot. Every rule here deletes; none rewrites geometry.
  var SVGOPT = window.T4M_SVG = (function () {
    var EDITOR_HOSTS = ['inkscape.org', 'sodipodi.sourceforge.net', 'ns.adobe.com', 'bohemiancoding.com', 'figma.com'];
    var PRESERVE = {
      text: 1, tspan: 1, textPath: 1, tref: 1, title: 1, desc: 1, style: 1, script: 1, foreignObject: 1,
    };
    var COLOUR_ATTRS = { fill: 1, stroke: 1, 'stop-color': 1, 'flood-color': 1, 'lighting-color': 1, color: 1 };

    function isEditorNs(ns) {
      if (!ns) return false;
      for (var i = 0; i < EDITOR_HOSTS.length; i++) if (ns.indexOf(EDITOR_HOSTS[i]) !== -1) return true;
      return false;
    }
    function isEditorPrefix(prefix) {
      return /^(inkscape|sodipodi|sketch|illustrator|figma|serif)$/i.test(prefix || '');
    }
    function byteLength(str) {
      if (window.TextEncoder) return new TextEncoder().encode(str).length;
      return FAV.utf8(str).length;
    }

    function collectRefs(doc) {
      var refs = {};
      function note(value) {
        var m;
        var url = /url\(\s*['"]?#([^'")\s]+)/g;
        while ((m = url.exec(value))) refs[m[1]] = true;
        var hash = /#([A-Za-z_][\w:.-]*)/g;
        while ((m = hash.exec(value))) refs[m[1]] = true;
        var smil = /\b([A-Za-z_][\w-]*)\.(?:click|end|begin|repeat)\b/g;
        while ((m = smil.exec(value))) refs[m[1]] = true;
      }
      var all = doc.getElementsByTagName('*');
      for (var i = 0; i < all.length; i++) {
        var attrs = all[i].attributes;
        for (var j = 0; j < attrs.length; j++) note(attrs[j].value);
      }
      var styles = doc.getElementsByTagName('style');
      for (var k = 0; k < styles.length; k++) {
        var text = styles[k].textContent || '';
        var m;
        var id = /#([A-Za-z_][\w-]*)/g;
        while ((m = id.exec(text))) refs[m[1]] = true;
      }
      return refs;
    }

    function hasInheritedOverride(node, prop) {
      for (var p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
        if (p.hasAttribute && p.hasAttribute(prop)) return true;
        var style = p.getAttribute && p.getAttribute('style');
        if (style && style.indexOf(prop) !== -1) return true;
      }
      return false;
    }

    function optimize(source, opts) {
      opts = opts || {};
      var text = String(source == null ? '' : source);
      var doc;
      try {
        doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      } catch (e) {
        return { error: 'parse', msg: (e && e.message) || '' };
      }
      var err = doc.getElementsByTagName('parsererror')[0] || doc.querySelector('parsererror');
      if (err) {
        var msg = String(err.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160);
        return { error: 'parse', msg: msg };
      }
      var root = doc.documentElement;
      if (!root || root.localName !== 'svg') return { error: 'not-svg', name: root ? root.localName : '' };

      var warnings = [];
      var refs = collectRefs(doc);

      // ---- nodes: comments, editor elements, editor metadata
      var kill = [];
      var walker = doc.createTreeWalker(root, 0xFFFFFFFF, null, false);
      while (walker.nextNode()) {
        var n = walker.currentNode;
        if (n.nodeType === 8 || n.nodeType === 7) { kill.push(n); continue; }
        if (n.nodeType !== 1) continue;
        if (opts.meta && isEditorNs(n.namespaceURI)) { kill.push(n); continue; }
        if (opts.meta && /^namedview$/i.test(n.localName) && isEditorNs(n.namespaceURI)) { kill.push(n); continue; }
        if (opts.meta && n.localName === 'metadata') {
          var kids = n.getElementsByTagName('*');
          var editor = false;
          for (var i = 0; i < kids.length; i++) if (isEditorNs(kids[i].namespaceURI)) editor = true;
          if (editor || !kids.length) kill.push(n);
        }
      }
      kill.forEach(function (node) { if (node.parentNode) node.parentNode.removeChild(node); });

      // ---- attributes
      var elements = root.getElementsByTagName('*');
      var list = [root];
      for (var e = 0; e < elements.length; e++) list.push(elements[e]);
      list.forEach(function (node) {
        var attrs = [];
        for (var a = 0; a < node.attributes.length; a++) attrs.push(node.attributes[a]);
        attrs.forEach(function (attr) {
          var name = attr.localName || attr.name;
          if (opts.meta && (isEditorNs(attr.namespaceURI) || isEditorPrefix(attr.prefix))) {
            node.removeAttributeNode(attr);
            return;
          }
          if (/^xmlns:/.test(attr.name) && isEditorPrefix(attr.name.split(':')[1])) {
            node.removeAttribute(attr.name);
            return;
          }
          var value = attr.value;
          if (opts.hex && COLOUR_ATTRS[name] && /^#[0-9a-f]{6}$/i.test(value)) {
            var hex = value.toLowerCase();
            if (hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]) {
              node.setAttribute(attr.name, '#' + hex[1] + hex[3] + hex[5]);
              value = node.getAttribute(attr.name);
            }
          }
          if (opts.rgb && COLOUR_ATTRS[name]) {
            var m = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(value);
            if (m) {
              var parts = [m[1], m[2], m[3]].map(function (x) { return Math.min(255, parseInt(x, 10)); });
              var toHex = parts.map(function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
              node.setAttribute(attr.name, '#' + toHex);
            }
          }
          if (opts.ids && name === 'id' && !refs[value]) node.removeAttribute('id');
        });
        if (opts.defaults) {
          var style = node.getAttribute('style') || '';
          [['fill', 'black'], ['stroke', 'none'], ['stroke-width', '1']].forEach(function (pair) {
            var prop = pair[0], def = pair[1];
            if (node.getAttribute(prop) !== def) return;
            if (style.indexOf(prop) !== -1) return;
            if (hasInheritedOverride(node, prop)) return;
            node.removeAttribute(prop);
          });
          if (node.localName === 'path' && node.getAttribute('d') === '') node.removeAttribute('d');
        }
      });

      // ---- whitespace-only text nodes, except where the text is the content
      if (opts.space) {
        var texts = [];
        var tw = doc.createTreeWalker(root, 4, null, false);
        while (tw.nextNode()) {
          var t = tw.currentNode;
          if (/^\s+$/.test(t.nodeValue) && !PRESERVE[t.parentNode.localName]) texts.push(t);
        }
        texts.forEach(function (t) { if (t.parentNode) t.parentNode.removeChild(t); });
      }

      if (opts.title) {
        var titled = [].slice.call(root.getElementsByTagName('title')).concat([].slice.call(root.getElementsByTagName('desc')));
        titled.forEach(function (t) { if (t.parentNode) t.parentNode.removeChild(t); });
      }
      if (doc.getElementsByTagName('script').length) warnings.push('script');
      if (doc.getElementsByTagName('style').length) warnings.push('style');

      var out;
      try { out = new XMLSerializer().serializeToString(doc); }
      catch (e2) { return { error: 'serialize', msg: (e2 && e2.message) || '' }; }
      return { svg: out, warnings: warnings, before: byteLength(text), after: byteLength(out) };
    }

    return { optimize: optimize, byteLength: byteLength };
  })();

  T['svg-optimizer'] = function (root) {
    var COPY = (((window.T4M_ISTR || {}).tools || {}).svgOpt) || {};
    var input = $(root, 'sv-in');
    var fileEl = $(root, 'sv-file');
    var statsEl = $(root, 'sv-stats');
    var warnEl = $(root, 'sv-warn');
    var outEl = $(root, 'sv-out');
    var downloadBtn = $(root, 'sv-download');
    var OPTS = ['xml', 'comments', 'meta', 'ids', 'space', 'hex', 'defaults', 'rgb', 'title'];
    var current = '';

    function option(kind) {
      var el = $(root, 'sv-' + kind);
      return !!(el && el.checked);
    }
    function opts() {
      var o = {};
      OPTS.forEach(function (k) { o[k] = option(k); });
      return o;
    }
    function tpl(s, vars) {
      return String(s || '').replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }

    function update() {
      var src = input ? input.value : '';
      current = '';
      if (outEl) outEl.textContent = '';
      if (warnEl) warnEl.textContent = '';
      if (!src.trim()) { if (statsEl) statsEl.textContent = COPY.empty || ''; return; }
      var result = SVGOPT.optimize(src, opts());
      if (result.error) {
        var msg = result.error === 'not-svg'
          ? tpl(COPY.notSvg || '', { name: result.name || '' })
          : (COPY.parseError ? tpl(COPY.parseError, { msg: result.msg || '' }) : (COPY.parseErrorPlain || ''));
        if (statsEl) statsEl.textContent = msg;
        return;
      }
      current = result.svg;
      if (outEl) outEl.textContent = result.svg;
      if (statsEl) {
        var saved = result.before - result.after;
        var pct = result.before ? Math.round((saved / result.before) * 100) : 0;
        statsEl.textContent = saved > 0
          ? tpl(COPY.stats || '', { before: result.before, after: result.after, pct: pct, bytes: saved })
          : tpl(COPY.unchanged || '', { bytes: result.after });
      }
      if (warnEl) {
        result.warnings.forEach(function (w) {
          var p = el('p', 'tool-warn');
          p.textContent = w === 'script' ? (COPY.scriptWarn || '') : (COPY.styleWarn || '');
          warnEl.appendChild(p);
        });
      }
    }

    if (input) {
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    }
    OPTS.forEach(function (k) {
      var node = $(root, 'sv-' + k);
      if (node) {
        node.addEventListener('input', update);
        node.addEventListener('change', update);
      }
    });
    if (fileEl) {
      fileEl.addEventListener('change', function () {
        var file = fileEl.files && fileEl.files[0];
        if (!file) return;
        if (!/svg/i.test(file.type || '') && !/\.svg$/i.test(file.name || '')) {
          if (statsEl) statsEl.textContent = COPY.tooBigType || '';
          return;
        }
        if (file.size > 500 * 1024) {
          if (statsEl) statsEl.textContent = tpl(COPY.tooBig || '', { kb: Math.round(file.size / 1024) });
          return;
        }
        if (!window.FileReader) return;
        var fr = new FileReader();
        fr.onload = function () {
          if (input) input.value = String(fr.result || '');
          update();
        };
        fr.readAsText(file);
      });
    }
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        if (!current) return;
        try {
          if (!window.URL || typeof URL.createObjectURL !== 'function') return;
          var blob = new Blob([current], { type: 'image/svg+xml' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'optimized.svg';
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        } catch (e) {}
      });
    }
    update();
  };

})();

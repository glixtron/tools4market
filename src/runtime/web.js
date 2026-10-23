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
})();

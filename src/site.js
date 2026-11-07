// Tools4Market — shared client runtime (shell behaviours + tool bootstrap)
window.T4M_TOOLS = window.T4M_TOOLS || {};
(function () {
  'use strict';

  // GA4 events (consent-gated by construction: the page sets Consent Mode v2
  // defaults to "denied" before gtag loads, so nothing is stored or sent for a
  // visitor who has not accepted analytics). Events: tool_open, tool_run,
  // copy_output, download_output, blog_cta_click, contact_click, ai_suggest.
  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    try { window.gtag('event', name, params || {}); } catch (e) { /* never break the UI for analytics */ }
  }
  // Shared with the inspect runtime (AI suggestion events).
  window.T4M_TRACK = track;
  function toolSlugOf(el) {
    var root = el && el.closest ? el.closest('#tool-root') : null;
    return root ? root.getAttribute('data-tool') : 'shell';
  }

  function copyText(text, btn) {
    if (!text) return;
    const done = () => {
      const old = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('copied'); }, 1400);
    };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* no-op */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else fallback();
  }

  function initCopy() {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-copy]');
      if (!b) return;
      const sel = b.getAttribute('data-copy');
      let text = b.getAttribute('data-copy-text') || '';
      if (sel && sel.charAt(0) === '#') {
        const el = document.querySelector(sel);
        if (el) text = (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') ? el.value : el.textContent;
      }
      if (text) track('copy_output', { tool_slug: toolSlugOf(b) });
      copyText(text, b);
    });
  }

  function initDownload() {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-download]');
      if (!b) return;
      const spec = (b.getAttribute('data-download') || '').split('|');
      const el = spec[0] && document.querySelector(spec[0]);
      const text = el ? (el.textContent || '') : '';
      if (!text) return;
      track('download_output', { tool_slug: toolSlugOf(b), file_name: spec[1] || 'download.txt' });
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = spec[1] || 'download.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 500);
    });
  }

  function initSearch() {
    const inp = document.getElementById('tool-search');
    if (!inp) return;
    const cards = Array.prototype.slice.call(document.querySelectorAll('.tool-card[data-search]'));
    const empty = document.getElementById('search-empty');
    // GA4 `search` event (built-in name, `search_term` param): fired once the
    // query has been idle long enough to be a real intent, not every keystroke.
    let searchTimer = null;
    let lastTracked = '';
    inp.addEventListener('input', () => {
      const q = inp.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((c) => {
        const hay = c.getAttribute('data-search') || '';
        const show = !q || hay.indexOf(q) !== -1;
        c.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      document.querySelectorAll('.cat-section').forEach((s) => {
        const any = Array.prototype.some.call(s.querySelectorAll('.tool-card[data-search]'), (c) => c.style.display !== 'none');
        s.style.display = any ? '' : 'none';
      });
      if (empty) empty.style.display = (q && visible === 0) ? '' : 'none';
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        if (q.length < 2 || q === lastTracked) return;
        lastTracked = q;
        track('search', { search_term: q.slice(0, 60), results_count: visible });
      }, 800);
    });
    // Example chips ("meta", "robots", "UTM", "schema", "audit") fill the
    // field and run the filter — a one-tap path for task-first visitors.
    document.querySelectorAll('.sx-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        inp.value = chip.getAttribute('data-q') || '';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.focus();
      });
    });
  }

  // Recently-used marker — tool pages record their slug here; the homepage
  // highlights those cards with a brass "recently used" rule. Local-only.
  function rememberTool(slug) {
    try {
      var rec = JSON.parse(window.localStorage.getItem('t4m_recent') || '[]');
      rec = rec.filter(function (s) { return s !== slug; });
      rec.unshift(slug);
      window.localStorage.setItem('t4m_recent', JSON.stringify(rec.slice(0, 6)));
    } catch (e) { /* private mode: skip */ }
  }
  function markRecentCards() {
    var cards = document.querySelectorAll('.tool-card[data-slug]');
    if (!cards.length) return;
    var recent;
    try { recent = JSON.parse(window.localStorage.getItem('t4m_recent') || '[]'); } catch (e) { return; }
    if (!recent || !recent.length) return;
    var set = {};
    recent.forEach(function (s) { set[s] = 1; });
    Array.prototype.forEach.call(cards, function (c) {
      if (set[c.getAttribute('data-slug')]) {
        c.classList.add('tool-card--recent');
        var b = document.createElement('span');
        b.className = 'tool-recent-tag';
        b.textContent = 'recently used';
        c.appendChild(b);
      }
    });
  }

  // Deep-link handoff: another tool's report links here with ?url=&title=&desc=
  // (the audited page's snapshot), and the fields are filled on arrival so the
  // tool opens already loaded with that page. Phase 'tool' runs before the
  // analyze panel mounts and fills the tool's own fields, firing input so live
  // tools render with the data; phase 'panel' lands the URL in the analyze
  // panel when the tool itself has no URL field. Both run before the markRun
  // listeners attach — a prefilled arrival is not a visitor "run".
  function prefillFromParams(root, phase) {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { return; }
    var url = params.get('url') || '';
    var title = params.get('title') || '';
    var desc = params.get('desc') || '';
    if (!url && !title && !desc) return;
    // Target-specific overrides for fields that break the -url/-title/-desc
    // conventions (canonical-as-page-url, textarea fields, path tests).
    var W = window.T4M_WA || {};
    var map = (W.handoff && W.handoff[root.getAttribute('data-tool')]) || {};

    function byId(id) {
      if (!id) return null;
      var f = document.getElementById(id);
      return f && root.contains(f) ? f : null;
    }
    function set(field, value) {
      if (!field || !value) return false;
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    if (phase === 'panel') {
      if (!url) return;
      // Only when no tool field already took the URL — otherwise the panel
      // would queue a second fetch of the same page.
      var taken = root.querySelector('input[id$="-url"]');
      if (taken && taken.value === url) return;
      var mapped = byId(map.url);
      if (mapped && mapped.value === url) return;
      var panel = root.querySelector('.inspect-url');
      if (panel) panel.value = url;
      return;
    }
    if (url) set(byId(map.url), url) || set(root.querySelector('input[id$="-url"]'), url);
    if (title) set(byId(map.title), title) || set(root.querySelector('input[id$="-title"], textarea[id$="-title"]'), title);
    if (desc) set(byId(map.desc), desc) || set(root.querySelector('input[id$="-desc"], textarea[id$="-desc"]'), desc);
  }

  function initTool() {
    const root = document.getElementById('tool-root');
    if (!root) return;
    const slug = root.getAttribute('data-tool');
    const fn = window.T4M_TOOLS[slug];
    if (typeof fn === 'function') {
      try { fn(root); } catch (err) { if (window.console) console.error('Tool init failed:', err); }
    }
    track('tool_open', { tool_slug: slug });
    rememberTool(slug);
    // Handoff prefill: the tool's own listeners are live, markRun isn't attached yet.
    prefillFromParams(root, 'tool');
    // "Analyze your own page first" panel — injected after the tool so its fields exist.
    if (window.T4M_INSPECT && window.T4M_INSPECT.mount) {
      try { window.T4M_INSPECT.mount(root, slug); } catch (err) { /* non-fatal */ }
    }
    prefillFromParams(root, 'panel');
    // Tools compute live as you type, so the first interaction inside the shell
    // is the "run". Fires once per page view.
    let ran = false;
    const markRun = () => { if (ran) return; ran = true; track('tool_run', { tool_slug: slug }); };
    root.addEventListener('input', markRun);
    root.addEventListener('change', markRun);
  }

  // Guide→tool CTA clicks and contact/feedback clicks (the growth loop's
  // guide-to-tool click-through rate is measured from these).
  function initEvents() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      let url = null;
      try { url = new URL(href, window.location.href); } catch (err) { return; }
      if (url.pathname.indexOf('/contact/') === 0) {
        track('contact_click', { link_text: (a.textContent || '').trim().slice(0, 60) });
        return;
      }
      const m = url.pathname.match(/^\/tools\/([a-z0-9-]+)\/$/);
      if (m && a.closest('.article')) track('blog_cta_click', { tool_slug: m[1] });
      // Off-site link (guide sources, references): counts editorial outbound intent.
      // Analytics/infra hosts are excluded — they fire on their own schedule.
      if (url.origin !== window.location.origin) {
        const host = url.hostname;
        if (!/^(www\.)?(google-analytics\.com|googletagmanager\.com|cloudflareinsights\.com|schema\.org)$/.test(host)) {
          track('external_link_click', { link_host: host, link_path: url.pathname.slice(0, 80) });
        }
      }
    });
  }

  function initYear() {
    document.querySelectorAll('.js-year').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  }

  // ---------------------------------------------------------------- consent
  // Cookie consent for analytics (Google Tag Manager) and ads.
  // The page ships with Consent Mode v2 defaults set to "denied" (inline, before
  // GTM loads), so nothing is stored until the visitor accepts. This module shows
  // the banner, records the choice in localStorage and pushes the consent update
  // to dataLayer so the container can react.
  function initConsent() {
    var KEY = 't4m_consent';
    var banner = document.getElementById('ck-banner');
    var panel = document.getElementById('ck-panel');
    if (!banner) return;

    var analyticsBox = document.getElementById('ck-analytics');
    var adsBox = document.getElementById('ck-ads');
    var lastFocus = null;

    function read() {
      try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
    }
    function write(state) {
      try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
    }
    function push(analytics, ads) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'consent_update',
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: ads ? 'granted' : 'denied',
        ad_user_data: ads ? 'granted' : 'denied',
        ad_personalization: ads ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
      });
      // keep GA4 (gtag.js) in sync with the choice
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: analytics ? 'granted' : 'denied',
          ad_storage: ads ? 'granted' : 'denied',
          ad_user_data: ads ? 'granted' : 'denied',
          ad_personalization: ads ? 'granted' : 'denied',
        });
      }
    }
    function apply(state) {
      write(state);
      push(state.analytics, state.ads);
      banner.hidden = true;
      document.body.classList.remove('ck-open');
      // Let interested UI (the analysis panel's AI controls) follow the choice.
      try { document.dispatchEvent(new CustomEvent('t4m:consent')); } catch (e) { /* non-fatal */ }
    }
    function showBanner() { banner.hidden = false; document.body.classList.add('ck-open'); }
    function openPanel() {
      var stored = read() || { analytics: false, ads: false };
      if (analyticsBox) analyticsBox.checked = !!stored.analytics;
      if (adsBox) adsBox.checked = !!stored.ads;
      panel.hidden = false;
      lastFocus = document.activeElement;
      var first = panel.querySelector('input, button');
      if (first && first.focus) first.focus();
    }
    function closePanel() {
      panel.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    var accept = document.getElementById('ck-accept');
    var reject = document.getElementById('ck-reject');
    var manage = document.getElementById('ck-manage');
    var save = document.getElementById('ck-save');
    var close = document.getElementById('ck-close');

    if (accept) accept.addEventListener('click', function () { apply({ analytics: true, ads: true }); });
    if (reject) reject.addEventListener('click', function () { apply({ analytics: false, ads: false }); });
    if (manage) manage.addEventListener('click', openPanel);
    if (save) save.addEventListener('click', function () {
      apply({ analytics: !!(analyticsBox && analyticsBox.checked), ads: !!(adsBox && adsBox.checked) });
      closePanel();
    });
    if (close) close.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) closePanel();
    });
    // footer "Cookie settings" link → reopen preferences at any time
    document.querySelectorAll('[data-ck-settings]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openPanel(); });
    });

    var stored = read();
    if (stored) {
      // already decided: keep the banner hidden, but re-push the stored state so
      // a container loaded after a page navigation stays in sync
      push(!!stored.analytics, !!stored.ads);
    } else {
      showBanner();
    }
    // public API so any custom UI can drive consent (and Google can verify it)
    window.T4M_CONSENT = {
      get: function () { return read(); },
      update: function (analytics, ads) { apply({ analytics: !!analytics, ads: !!ads }); },
      granted: function () { var s = read(); return !!(s && s.analytics); },
    };
  }

  function initShellMotion() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
  }

  // Guide reading progress + contents highlighting. One rAF per scroll burst,
  // no layout reads outside the frame, and nothing runs on pages without a bar.
  function initReading() {
    var bar = document.querySelector('.reading-progress i');
    var article = document.querySelector('article.article');
    if (!bar || !article) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
    var heads = links.map(function (a) {
      var id = a.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    }).filter(Boolean);
    var queued = false;
    function update() {
      queued = false;
      var r = article.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
      bar.style.width = (p * 100).toFixed(2) + '%';
      var current = -1;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top < 120) current = i;
      }
      for (var j = 0; j < links.length; j++) {
        links[j].classList.toggle('is-active', j === current);
      }
    }
    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  function boot() {
    initShellMotion();
    initReading();
    initCopy();
    initDownload();
    initSearch();
    markRecentCards();
    initTool();
    initEvents();
    initYear();
    initConsent();
  }

  // In a deferred script readyState is already "interactive" and DOMContentLoaded is imminent:
  // boot via the event. Only boot immediately when the document is fully done (late injection).
  if (document.readyState === 'complete') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();

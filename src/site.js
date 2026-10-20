// Tools4Market — shared client runtime (shell behaviours + tool bootstrap)
window.T4M_TOOLS = window.T4M_TOOLS || {};
(function () {
  'use strict';

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
    const cards = Array.prototype.slice.call(document.querySelectorAll('.tool-card'));
    const empty = document.getElementById('search-empty');
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
        const any = Array.prototype.some.call(s.querySelectorAll('.tool-card'), (c) => c.style.display !== 'none');
        s.style.display = any ? '' : 'none';
      });
      if (empty) empty.style.display = (q && visible === 0) ? '' : 'none';
    });
  }

  function initTool() {
    const root = document.getElementById('tool-root');
    if (!root) return;
    const fn = window.T4M_TOOLS[root.getAttribute('data-tool')];
    if (typeof fn === 'function') {
      try { fn(root); } catch (err) { if (window.console) console.error('Tool init failed:', err); }
    }
    // "Analyze your own page first" panel — injected after the tool so its fields exist.
    if (window.T4M_INSPECT && window.T4M_INSPECT.mount) {
      try { window.T4M_INSPECT.mount(root, root.getAttribute('data-tool')); } catch (err) { /* non-fatal */ }
    }
  }

  function initYear() {
    document.querySelectorAll('.js-year').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  }

  function boot() { initCopy(); initDownload(); initSearch(); initTool(); initYear(); }

  // In a deferred script readyState is already "interactive" and DOMContentLoaded is imminent:
  // boot via the event. Only boot immediately when the document is fully done (late injection).
  if (document.readyState === 'complete') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();

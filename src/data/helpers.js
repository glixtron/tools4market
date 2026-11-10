// Tools4Market — build-time markup helpers (used by src/data/*)
export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const f = {
  text: (id, label, ph = '', val = '', type = 'text') =>
    `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${esc(ph)}"${val ? ` value="${esc(val)}"` : ''}></div>`,
  url: (id, label, ph = '', val = '') => f.text(id, label, ph, val, 'url'),
  textarea: (id, label, ph = '', rows = 5, val = '') =>
    `<div class="field"><label for="${id}">${label}</label><textarea id="${id}" rows="${rows}" placeholder="${esc(ph)}">${esc(val)}</textarea></div>`,
  select: (id, label, opts, val = '') =>
    `<div class="field"><label for="${id}">${label}</label><select id="${id}">${opts.map((o) =>
      `<option value="${esc(o.v)}"${o.v === val ? ' selected' : ''}>${esc(o.l)}</option>`).join('')}</select></div>`,
  number: (id, label, val = '', min = '', max = '') =>
    `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="number"${min !== '' ? ` min="${min}"` : ''}${max !== '' ? ` max="${max}"` : ''}${val !== '' ? ` value="${val}"` : ''}></div>`,
  date: (id, label) =>
    `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="date"></div>`,
  check: (id, label, checked = false) =>
    `<div class="field field-check"><input type="checkbox" id="${id}"${checked ? ' checked' : ''}><label for="${id}">${label}</label></div>`,
};

export const outputBlock = (id, label = 'Output', copyText = '') =>
  `<div class="output">
  <div class="output-head"><span>${label}</span><button type="button" class="btn-copy" data-copy="#${id}"${copyText ? ` data-copy-text="${esc(copyText)}"` : ''}>Copy</button></div>
  <pre id="${id}" class="code" aria-live="polite"></pre>
</div>`;

export const outputArea = (id, label = 'Output') =>
  `<div class="output">
  <div class="output-head"><span>${label}</span><button type="button" class="btn-copy" data-copy="#${id}">Copy</button></div>
  <div id="${id}" class="output-area" aria-live="polite"></div>
</div>`;

export const note = (html) => `<p class="tool-note">${html}</p>`;

export const dynRow = (cls, inner, remove = true) =>
  `<div class="dyn-row ${cls}">${inner}${remove ? '<button type="button" class="btn-icon row-del" title="Remove row" aria-label="Remove row">×</button>' : ''}</div>`;

export const groupBox = (legend, inner) =>
  `<fieldset class="group-box"><legend>${legend}</legend>${inner}</fieldset>`;

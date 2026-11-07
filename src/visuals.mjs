// Hand-authored SVG figures. Everything here carries information we can
// point at: real counts from the catalog, threshold values from the primary
// docs, or the structure of a procedure. No invented metrics, no decorative
// charts.

import { toolIconBody } from './icons.mjs';

const F = "'Fraunces', Georgia, serif";
const M = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const S = "'Inter', system-ui, sans-serif";

const INK = '#182338';
const NAVY = '#243b63';
const BRASS = '#96682c';
const BRASS_L = '#e7b45e';
const TEAL = '#0f766e';
const MUTED = '#5d6878';
const RULE = '#ded7c8';
const PAPER = '#fffdf7';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const frame = (w, h, body, label) =>
  `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="${PAPER}"/>
  <g stroke="${RULE}" stroke-width="1"><path d="M0 1h${w}"/><path d="M0 ${h - 1}h${w}"/></g>
  ${body}
</svg>`;

// ---------- Homepage charts ----------

export function catalogChart(cats, counts, total) {
  const rows = cats.map((c, i) => {
    const y = 62 + i * 42;
    const w = Math.round((counts[c.id] / 16) * 470);
    return `
    <g>
      <text x="0" y="${y + 4}" font-family="${S}" font-size="15" fill="${INK}">${esc(c.nav)}</text>
      <rect x="190" y="${y - 12}" width="480" height="18" rx="4" fill="#f1ebdd"/>
      <rect x="190" y="${y - 12}" width="${w}" height="18" rx="4" fill="${i === 0 ? NAVY : i === 1 ? TEAL : BRASS}" opacity="${0.92 - i * 0.06}"/>
      <text x="688" y="${y + 4}" font-family="${M}" font-size="14" fill="${MUTED}">${counts[c.id]}</text>
    </g>`;
  }).join('');
  const body = `
    <text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">TOOLS PER CATEGORY · ${total} TOTAL</text>
    ${rows}
    <g stroke="${RULE}"><path d="M190 46v${rows ? 214 : 0}"/></g>`;
  return frame(760, 290, body, `Tool count by category, ${total} tools in total`);
}

export function processingChart(localCount, liveCount, auditCount, total) {
  const pct = (n) => (n / total) * 720;
  const x1 = 0;
  const x2 = pct(localCount);
  const x3 = x2 + pct(liveCount);
  const body = `
    <text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">WHERE THE WORK HAPPENS · ${total} TOOLS</text>
    <g transform="translate(0,56)">
      <rect x="0" y="0" width="${pct(localCount)}" height="34" rx="6" fill="${TEAL}"/>
      <rect x="${x2 + 4}" y="0" width="${pct(liveCount) - 4}" height="34" rx="6" fill="${NAVY}"/>
      <rect x="${x3 + 4}" y="0" width="${pct(auditCount) - 4}" height="34" rx="6" fill="${BRASS}"/>
      <text x="12" y="22" font-family="${M}" font-size="13" fill="#ffffff">${localCount} run in the browser</text>
      <text x="${x2 + 16}" y="22" font-family="${M}" font-size="13" fill="#ffffff">${liveCount} read a URL</text>
    </g>
    <g font-family="${S}" font-size="13" fill="${MUTED}">
      <g transform="translate(0,118)">
        <rect width="11" height="11" rx="2" fill="${TEAL}"/><text x="20" y="10">Text and files are processed locally. Nothing is uploaded.</text>
      </g>
      <g transform="translate(0,144)">
        <rect width="11" height="11" rx="2" fill="${NAVY}"/><text x="20" y="10">You paste a public URL; our proxy fetches that page, then analysis runs locally.</text>
      </g>
      <g transform="translate(0,170)">
        <rect width="11" height="11" rx="2" fill="${BRASS}"/><text x="20" y="10">The full-site audit crawls on our server. One tool.</text>
      </g>
    </g>`;
  return frame(760, 210, body, `How the ${total} tools process input`);
}

// ---------- Guide diagrams ----------

const GV = { w: 960, h: 300 };

function cwv() {
  const bar = (y, label, good, poor, max, unit) => {
    const x0 = 230, w = 560;
    const g = (good / max) * w, p = (poor / max) * w;
    return `
    <text x="0" y="${y + 5}" font-family="${S}" font-size="16" fill="${INK}">${label}</text>
    <rect x="${x0}" y="${y - 12}" width="${w}" height="24" rx="3" fill="#f1ebdd"/>
    <rect x="${x0}" y="${y - 12}" width="${g}" height="24" fill="${TEAL}"/>
    <rect x="${x0 + g}" y="${y - 12}" width="${p - g}" height="24" fill="${BRASS_L}"/>
    <rect x="${x0 + p}" y="${y - 12}" width="${w - p}" height="24" fill="#b4553f"/>
    <text x="${x0 + 8}" y="${y + 5}" font-family="${M}" font-size="12" fill="#ffffff">good</text>
    <text x="${x0 + g + 8}" y="${y + 5}" font-family="${M}" font-size="12" fill="${INK}">needs work</text>
    <text x="${x0 + p + 8}" y="${y + 5}" font-family="${M}" font-size="12" fill="#ffffff">poor</text>
    <text x="${x0 + w + 16}" y="${y + 5}" font-family="${M}" font-size="12" fill="${MUTED}">${unit}</text>`;
  };
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">THRESHOLDS · 75TH PERCENTILE OF PAGE LOADS</text>
  ${bar(88, 'LCP', 2.5, 4.0, 5, '2.5s / 4.0s')}
  ${bar(158, 'CLS', 0.1, 0.25, 0.3, '0.1 / 0.25')}
  ${bar(228, 'INP', 200, 500, 600, '200ms / 500ms')}`;
}

function redirectChain() {
  const pill = (x, y, w, label, sub, fill) => `
    <rect x="${x}" y="${y}" width="${w}" height="66" rx="8" fill="${fill}"/>
    <text x="${x + 14}" y="${y + 27}" font-family="${M}" font-size="13" fill="${fill === '#ffffff' ? INK : '#ffffff'}">${label}</text>
    <text x="${x + 14}" y="${y + 48}" font-family="${S}" font-size="13" fill="${fill === '#ffffff' ? MUTED : 'rgba(255,255,255,.75)'}">${sub}</text>`;
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">A 301 TELLS GOOGLE THE MOVE IS PERMANENT</text>
  ${pill(0, 82, 250, '/old-page', 'requested URL', '#ffffff')}
  ${pill(330, 82, 250, '301', 'permanent redirect', NAVY)}
  ${pill(660, 82, 280, '/new-page', '200, canonical', '#ffffff')}
  <g stroke="${BRASS}" stroke-width="1.5" fill="none"><path d="M258 115h62"/><path d="m312 109 8 6-8 6"/></g>
  <g stroke="${BRASS}" stroke-width="1.5" fill="none"><path d="M588 115h62"/><path d="m642 109 8 6-8 6"/></g>
  <text x="0" y="212" font-family="${S}" font-size="15" fill="${MUTED}">Chain the redirect to the final URL, not to another redirect. Each hop is a request.</text>
  <text x="0" y="240" font-family="${M}" font-size="12" fill="${MUTED}">SOURCE · RFC 9110 §15.4.2 · Google Search Central, site moves</text>`;
}

function statusGrid() {
  const rows = [
    ['2xx', 'OK', 'Indexable', TEAL],
    ['3xx', 'Redirect', 'Target is indexed', NAVY],
    ['4xx', 'Client error', 'Not indexed', BRASS],
    ['5xx', 'Server error', 'Not indexed', '#b4553f'],
  ];
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">WHAT GOOGLE DOES WITH EACH CLASS</text>
  ${rows.map((r, i) => {
    const y = 66 + i * 52;
    return `<g>
      <rect x="0" y="${y}" width="912" height="42" rx="6" fill="${i % 2 ? '#ffffff' : '#f7f2e6'}"/>
      <text x="18" y="${y + 27}" font-family="${M}" font-size="16" fill="${r[3]}">${r[0]}</text>
      <text x="110" y="${y + 27}" font-family="${S}" font-size="15" fill="${INK}">${r[1]}</text>
      <text x="330" y="${y + 27}" font-family="${S}" font-size="15" fill="${MUTED}">${r[2]}</text>
      <text x="620" y="${y + 27}" font-family="${S}" font-size="15" fill="${MUTED}">${i === 0 ? 'page can rank' : i === 1 ? 'check the Location header' : i === 2 ? 'fix the link or restore the page' : 'fix the server, then request a crawl'}</text>
    </g>`;
  }).join('')}
  <text x="0" y="290" font-family="${M}" font-size="12" fill="${MUTED}">SOURCE · RFC 9110 §15 · Google Search Essentials</text>`;
}

function indexedFlow() {
  const steps = ['URL returns 200', 'Not noindex', 'Allowed by robots.txt', 'In the sitemap', 'Linked internally', 'Content is unique'];
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">CHECK IN THIS ORDER · STOP AT THE FIRST FAILURE</text>
  ${steps.map((s, i) => {
    const x = 0 + i * 152;
    return `<g>
      <circle cx="${x + 24}" cy="96" r="18" fill="${i < 3 ? TEAL : NAVY}"/>
      <text x="${x + 24}" y="102" text-anchor="middle" font-family="${M}" font-size="13" fill="#ffffff">${i + 1}</text>
      <text x="${x + 24}" y="142" text-anchor="middle" font-family="${S}" font-size="13" fill="${INK}">${s.split(' ').slice(0, 3).join(' ')}</text>
      <text x="${x + 24}" y="160" text-anchor="middle" font-family="${S}" font-size="13" fill="${INK}">${s.split(' ').slice(3).join(' ')}</text>
      ${i < steps.length - 1 ? `<path d="M${x + 48} 96h72" stroke="${RULE}" stroke-width="2"/>` : ''}
    </g>`;
  }).join('')}
  <text x="0" y="222" font-family="${S}" font-size="15" fill="${MUTED}">A page that passes every step can still lose to a stronger page for that query.</text>
  <text x="0" y="250" font-family="${M}" font-size="12" fill="${MUTED}">SOURCE · Google Search Central, page indexing report</text>`;
}

function hreflangCluster() {
  const node = (x, y, label, sub, fill) => `
    <rect x="${x}" y="${y}" width="200" height="58" rx="8" fill="${fill}"/>
    <text x="${x + 16}" y="${y + 24}" font-family="${M}" font-size="13" fill="${fill === '#ffffff' ? INK : '#ffffff'}">${label}</text>
    <text x="${x + 16}" y="${y + 44}" font-family="${S}" font-size="12" fill="${fill === '#ffffff' ? MUTED : 'rgba(255,255,255,.75)'}">${sub}</text>`;
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">EVERY PAGE MUST LINK TO EVERY VERSION, INCLUDING ITSELF</text>
  ${node(0, 70, 'hreflang="en-us"', 'example.com/us/', NAVY)}
  ${node(380, 70, 'hreflang="x-default"', 'example.com/', '#ffffff')}
  ${node(760, 70, 'hreflang="en-gb"', 'example.com/uk/', BRASS)}
  <g stroke="${BRASS}" stroke-width="1.4" fill="none">
    <path d="M204 99h168"/><path d="m364 93 8 6-8 6"/>
    <path d="M756 99H588"/><path d="m596 93-8 6 8 6"/>
    <path d="M204 118c140 60 560 60 700 0" stroke-dasharray="4 5"/>
  </g>
  <text x="0" y="206" font-family="${S}" font-size="15" fill="${MUTED}">A one-way link is ignored. The cluster has to be reciprocal, or Google drops it.</text>
  <text x="0" y="234" font-family="${M}" font-size="12" fill="${MUTED}">SOURCE · Google Search Central, localised versions</text>`;
}

function linkingGraph() {
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">LINKS FLOW DOWN; AUTHORITY FLOWS BACK UP</text>
  <g>
    <rect x="360" y="56" width="240" height="44" rx="6" fill="${NAVY}"/>
    <text x="480" y="83" text-anchor="middle" font-family="${M}" font-size="13" fill="#ffffff">/ (home)</text>
    <rect x="80" y="140" width="200" height="44" rx="6" fill="#ffffff" stroke="${RULE}"/>
    <text x="180" y="167" text-anchor="middle" font-family="${M}" font-size="13" fill="${INK}">/seo/</text>
    <rect x="380" y="140" width="200" height="44" rx="6" fill="#ffffff" stroke="${RULE}"/>
    <text x="480" y="167" text-anchor="middle" font-family="${M}" font-size="13" fill="${INK}">/web/</text>
    <rect x="680" y="140" width="200" height="44" rx="6" fill="#ffffff" stroke="${RULE}"/>
    <text x="780" y="167" text-anchor="middle" font-family="${M}" font-size="13" fill="${INK}">/content/</text>
    <rect x="150" y="224" width="210" height="44" rx="6" fill="${PAPER}" stroke="${BRASS}"/>
    <text x="255" y="251" text-anchor="middle" font-family="${M}" font-size="12" fill="${BRASS}">/tools/meta-tag/</text>
    <rect x="600" y="224" width="210" height="44" rx="6" fill="${PAPER}" stroke="${BRASS}"/>
    <text x="705" y="251" text-anchor="middle" font-family="${M}" font-size="12" fill="${BRASS}">/blog/cwv/</text>
  </g>
  <g stroke="${BRASS}" stroke-width="1.3" fill="none">
    <path d="M420 100 260 140"/><path d="M480 100v40"/><path d="M540 100 700 140"/>
    <path d="M200 184v40"/><path d="M700 184v40"/>
    <path d="M620 246h-210" stroke-dasharray="4 4"/>
  </g>`;
}

function validationLayers() {
  const layer = (y, n, title, sub, fill, fg) => `
    <rect x="0" y="${y}" width="600" height="54" rx="6" fill="${fill}"/>
    <text x="20" y="${y + 24}" font-family="${M}" font-size="12" fill="${fg}" opacity=".8">${n}</text>
    <text x="56" y="${y + 24}" font-family="${S}" font-size="15" font-weight="600" fill="${fg}">${title}</text>
    <text x="56" y="${y + 43}" font-family="${S}" font-size="12" fill="${fg}" opacity=".8">${sub}</text>`;
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">THREE CHECKS, IN THIS ORDER</text>
  ${layer(60, '01', 'Syntax', 'Is the JSON-LD valid and parseable?', NAVY, '#ffffff')}
  ${layer(126, '02', 'Eligibility', 'Does the type match the page and its required fields?', '#ffffff', INK)}
  ${layer(192, '03', 'Policy', 'No spammy markup, no hidden content, no manual action.', '#f7f2e6', INK)}
  <g transform="translate(640,60)">
    <text x="0" y="0" font-family="${M}" font-size="11" fill="${MUTED}">WHAT TO TRUST</text>
    <text x="0" y="26" font-family="${S}" font-size="14" fill="${INK}">Passing a validator</text>
    <text x="0" y="46" font-family="${S}" font-size="14" fill="${INK}">does not mean you</text>
    <text x="0" y="66" font-family="${S}" font-size="14" fill="${INK}">get a rich result.</text>
  </g>`;
}

function schemaLayers() {
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">SCHEMA DESCRIBES THE PAGE. IT DOES NOT BUY A CITATION.</text>
  <g>
    <rect x="0" y="62" width="420" height="150" rx="8" fill="#ffffff" stroke="${RULE}"/>
    <text x="22" y="92" font-family="${M}" font-size="12" fill="${MUTED}">VISIBLE CONTENT</text>
    <text x="22" y="122" font-family="${S}" font-size="15" fill="${INK}">One clear question,</text>
    <text x="22" y="144" font-family="${S}" font-size="15" fill="${INK}">one direct answer,</text>
    <text x="22" y="166" font-family="${S}" font-size="15" fill="${INK}">visible author and date.</text>
    <rect x="480" y="62" width="420" height="150" rx="8" fill="#f7f2e6"/>
    <text x="502" y="92" font-family="${M}" font-size="12" fill="${MUTED}">STRUCTURED DATA</text>
    <text x="502" y="122" font-family="${M}" font-size="15" fill="${INK}">"@type": "FAQPage"</text>
    <text x="502" y="144" font-family="${M}" font-size="15" fill="${INK}">"name": "What is CLS?"</text>
    <text x="502" y="166" font-family="${M}" font-size="15" fill="${INK}">"acceptedAnswer": { … }</text>
    <path d="M430 137h38" stroke="${BRASS}" stroke-width="1.5"/><path d="m462 131 8 6-8 6" stroke="${BRASS}" stroke-width="1.5" fill="none"/>
  </g>
  <text x="0" y="252" font-family="${S}" font-size="14" fill="${MUTED}">Match the markup to what a reader can already see. Anything else is a policy risk.</text>`;
}

function canonicalMaster() {
  const line = (y, label, bad) => `
    <g>
      <rect x="0" y="${y}" width="420" height="40" rx="6" fill="${bad ? '#f7f2e6' : '#ffffff'}" stroke="${bad ? RULE : TEAL}"/>
      <text x="16" y="${y + 25}" font-family="${M}" font-size="13" fill="${bad ? MUTED : TEAL}">${label}</text>
      ${bad ? `<text x="436" y="${y + 25}" font-family="${S}" font-size="12" fill="${MUTED}">duplicate</text>` : `<text x="436" y="${y + 25}" font-family="${S}" font-size="12" fill="${TEAL}">canonical</text>`}
    </g>`;
  return `<text x="0" y="30" font-family="${M}" font-size="11" letter-spacing="2" fill="${MUTED}">SIGNALS CONSOLIDATE ON ONE URL</text>
  ${line(64, 'example.com/shop', true)}
  ${line(114, 'example.com/shop?utm_source=mail', true)}
  ${line(164, 'example.com/shop/', false)}
  <g transform="translate(560,64)">
    <rect width="380" height="150" rx="8" fill="#ffffff" stroke="${RULE}"/>
    <text x="20" y="28" font-family="${M}" font-size="11" fill="${MUTED}">ON THE MASTER PAGE</text>
    <text x="20" y="56" font-family="${M}" font-size="12" fill="${INK}">&lt;link rel="canonical"</text>
    <text x="20" y="76" font-family="${M}" font-size="12" fill="${INK}">&nbsp;&nbsp;href="https://example.com/shop/"&gt;</text>
    <text x="20" y="112" font-family="${S}" font-size="12" fill="${MUTED}">No conflicting copy elsewhere.</text>
  </g>
  <text x="0" y="252" font-family="${M}" font-size="12" fill="${MUTED}">SOURCE · RFC 6596 · Google Search Central, consolidate duplicate URLs</text>`;
}

export const GUIDE_FIGURES = {
  'core-web-vitals': cwv,
  'htaccess-301-redirect': redirectChain,
  'http-status-codes-seo': statusGrid,
  'why-is-my-site-not-indexed': indexedFlow,
  'hreflang-basics': hreflangCluster,
  'internal-linking': linkingGraph,
  'test-structured-data': validationLayers,
  'schema-markup-for-ai-search': schemaLayers,
  'rel-canonical-tag': canonicalMaster,
};

export function guideFigure(slug) {
  const fn = GUIDE_FIGURES[slug];
  if (!fn) return '';
  return `<figure class="guide-figure">${frame(GV.w, GV.h, fn(), guideFigureLabel(slug))}<figcaption>${esc(guideFigureLabel(slug))}</figcaption></figure>`;
}

function guideFigureLabel(slug) {
  const labels = {
    'core-web-vitals': 'Core Web Vitals thresholds for LCP, CLS and INP',
    'htaccess-301-redirect': 'Diagram of a permanent 301 redirect chain',
    'http-status-codes-seo': 'Table of HTTP status classes and how Google treats them',
    'why-is-my-site-not-indexed': 'Six-step check for a page that is not indexed',
    'hreflang-basics': 'Reciprocal hreflang cluster with x-default',
    'internal-linking': 'Internal linking hierarchy from home to detail pages',
    'test-structured-data': 'Three validation checks for structured data',
    'schema-markup-for-ai-search': 'Visible content and structured data side by side',
    'rel-canonical-tag': 'Three duplicate URLs consolidating to one canonical URL',
  };
  return labels[slug] || 'Guide diagram';
}

export const GUIDE_FIGURE_SLUGS = Object.keys(GUIDE_FIGURES);

// Compact thumbnails for guide cards: fewer elements, larger shapes, one
// label. Same palette so a card grid still looks like one set. Guides with no
// bespoke diagram borrow the icon of the tool they hand you, so no two cards
// fall back to the same mark.
export function guideThumb(slug, toolSlug) {
  const palette = { teal: TEAL, navy: NAVY, brass: BRASS };
  const shapes = {
    'core-web-vitals': `<rect x="18" y="22" width="96" height="10" rx="3" fill="${palette.teal}"/><rect x="18" y="42" width="62" height="10" rx="3" fill="${BRASS_L}"/><rect x="18" y="62" width="34" height="10" rx="3" fill="#b4553f"/>`,
    'htaccess-301-redirect': `<rect x="16" y="38" width="56" height="26" rx="4" fill="${NAVY}"/><path d="M78 51h28" stroke="${BRASS}" stroke-width="2"/><path d="m100 45 8 6-8 6" stroke="${BRASS}" stroke-width="2" fill="none"/><rect x="114" y="38" width="56" height="26" rx="4" fill="#ffffff" stroke="${RULE}"/>`,
    'http-status-codes-seo': `<g font-family="${M}" font-size="13" fill="${INK}"><text x="20" y="40">2xx</text><text x="20" y="64">3xx</text><text x="74" y="40">4xx</text><text x="74" y="64">5xx</text></g><g><circle cx="112" cy="35" r="4" fill="${TEAL}"/><circle cx="112" cy="59" r="4" fill="${NAVY}"/><circle cx="138" cy="35" r="4" fill="${BRASS}"/><circle cx="138" cy="59" r="4" fill="${MUTED}"/></g>`,
    'why-is-my-site-not-indexed': `<circle cx="26" cy="50" r="9" fill="${palette.teal}"/><circle cx="58" cy="50" r="9" fill="${palette.navy}"/><circle cx="90" cy="50" r="9" fill="#ffffff" stroke="${BRASS}"/><circle cx="122" cy="50" r="9" fill="#ffffff" stroke="${RULE}"/><path d="M36 50h12M68 50h12M100 50h12" stroke="${RULE}" stroke-width="2"/>`,
    'hreflang-basics': `<circle cx="80" cy="50" r="26" fill="none" stroke="${palette.navy}" stroke-width="1.5"/><path d="M54 50h52M80 24c10 10 10 42 0 52M80 24c-10 10-10 42 0 52" fill="none" stroke="${palette.navy}" stroke-width="1.2"/><circle cx="80" cy="50" r="3" fill="${BRASS}"/>`,
    'internal-linking': `<rect x="62" y="20" width="36" height="16" rx="3" fill="${palette.navy}"/><rect x="22" y="58" width="36" height="16" rx="3" fill="#ffffff" stroke="${RULE}"/><rect x="102" y="58" width="36" height="16" rx="3" fill="#ffffff" stroke="${RULE}"/><path d="M80 36v22M80 44 40 58M80 44l40 14" stroke="${BRASS}" stroke-width="1.3" fill="none"/>`,
    'test-structured-data': `<g font-family="${M}" font-size="12" fill="${INK}"><text x="18" y="38">{</text><text x="18" y="62">}</text></g><rect x="34" y="26" width="58" height="9" rx="2" fill="#f1ebdd"/><rect x="34" y="42" width="38" height="9" rx="2" fill="#f1ebdd"/><circle cx="118" cy="46" r="17" fill="none" stroke="${palette.teal}" stroke-width="1.5"/><path d="m109 46 6 6 12-13" fill="none" stroke="${palette.teal}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    'schema-markup-for-ai-search': `<rect x="18" y="30" width="54" height="40" rx="4" fill="#ffffff" stroke="${RULE}"/><path d="M78 50h20" stroke="${BRASS}" stroke-width="2"/><path d="m94 44 8 6-8 6" stroke="${BRASS}" stroke-width="2" fill="none"/><rect x="108" y="30" width="54" height="40" rx="4" fill="#f7f2e6"/><text x="120" y="54" font-family="${M}" font-size="11" fill="${INK}">{ }</text>`,
    'rel-canonical-tag': `<rect x="10" y="20" width="56" height="12" rx="2" fill="#f1ebdd"/><rect x="10" y="44" width="56" height="12" rx="2" fill="#f1ebdd"/><rect x="10" y="68" width="56" height="12" rx="2" fill="#f1ebdd"/><path d="M70 26h12l14 24M70 50h26M70 74h12l14-24" fill="none" stroke="${BRASS}" stroke-width="1.4"/><rect x="104" y="39" width="46" height="22" rx="3" fill="${palette.teal}"/><path d="m116 50 5 4 8-9" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  const body = shapes[slug] ||
    `<g transform="translate(52,20) scale(2.5)" fill="none" stroke="${NAVY}" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round">${toolIconBody(toolSlug)}</g>`;
  return `<svg viewBox="0 0 160 100" class="guide-thumb" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect width="160" height="100" fill="${PAPER}"/><g stroke="${RULE}"><path d="M0 99.5h160"/></g>${body}</svg>`;
}

// ---------- Tool previews ----------

const PREVIEWS = {
  'canonical-tag-generator': {
    inLabel: 'PAGE URL', inValue: 'https://example.com/shop?utm_source=email',
    outLabel: 'CANONICAL TAG', outValue: '<link rel="canonical" href="https://example.com/shop/">',
    note: 'Query strings stay in analytics; they should not multiply the canonical.',
  },
  'serp-preview-tool': {
    inLabel: 'TITLE · DESCRIPTION', inValue: 'Meta Tag Generator — Free, No Signup\nBuild title, description and OG tags in one pass.',
    outLabel: 'GOOGLE SNIPPET', outValue: 'Meta Tag Generator — Free, No Signup\nBuild title, description and OG tags in one pass.',
    note: 'Truncation is by pixel width, so the preview shows where the cut would land.',
  },
  'roas-calculator': {
    inLabel: 'INPUT', inValue: 'Ad spend $2,000\nRevenue $8,000',
    outLabel: 'ROAS', outValue: '4.00x  ·  break-even at 1.00x',
    note: 'ROAS compares revenue to spend. It does not include product cost or overhead.',
  },
  'json-validator': {
    inLabel: 'PASTED JSON', inValue: '{\n  "name": "tools4market",\n  "tools": 47,\n}',
    outLabel: 'ERROR', outValue: 'Unexpected token } at line 4, column 1',
    note: 'The trailing comma is the most common failure. The position points at the brace.',
  },
  'robots-txt-generator': {
    inLabel: 'PRESET', inValue: 'Block AI crawlers, keep search',
    outLabel: 'ROBOTS.TXT', outValue: 'User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /',
    note: 'A crawler that ignores robots.txt is not stopped by it. The block is a request, not a wall.',
  },
  'htaccess-redirect-generator': {
    inLabel: 'FROM → TO', inValue: '/old-page  →  /new-page',
    outLabel: '.HTACCESS', outValue: 'RewriteEngine On\nRewriteRule ^old-page/?$ /new-page [R=301,L]',
    note: 'Use 301 for permanent moves. Test the rule on staging before it reaches the live host.',
  },
};

export function toolPreview(slug) {
  const p = PREVIEWS[slug];
  if (!p) return '';
  return `<aside class="tool-preview" aria-label="What this tool produces">
  <div class="tp-col">
    <p class="tp-label">${esc(p.inLabel)}</p>
    <pre class="tp-value">${esc(p.inValue)}</pre>
  </div>
  <span class="tp-arrow" aria-hidden="true">
    <svg viewBox="0 0 40 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 8h30"/><path d="m26 3 6 5-6 5"/></svg>
  </span>
  <div class="tp-col">
    <p class="tp-label">${esc(p.outLabel)}</p>
    <pre class="tp-value tp-out">${esc(p.outValue)}</pre>
  </div>
  <p class="tp-note">${esc(p.note)}</p>
</aside>`;
}

export const PREVIEW_SLUGS = Object.keys(PREVIEWS);

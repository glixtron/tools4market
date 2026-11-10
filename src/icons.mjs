// One 24px line-icon family: 1.5px stroke, round caps, no fills, no emoji.
// The same symbol may serve sibling tools; the set stays small on purpose so
// every icon looks drawn by the same hand.

const wrap = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const P = {
  tag: '<path d="M3 11.6V4.8A1.8 1.8 0 0 1 4.8 3h6.8a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.8l-6.6 6.6a2 2 0 0 1-2.8 0L3.6 13a2 2 0 0 1-.6-1.4Z"/><circle cx="8" cy="8" r="1.4"/>',
  share: '<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.4 10.8 15.6 6.4M8.4 13.2l7.2 4.4"/>',
  social: '<path d="M20 12.4c0 3.5-3.6 6.4-8 6.4a9.6 9.6 0 0 1-2.7-.4L5 20l1-3.6a5.9 5.9 0 0 1-2-4c0-3.5 3.6-6.4 8-6.4s8 2.9 8 6.4Z"/>',
  linkMaster: '<path d="M10 13a4 4 0 0 0 5.7.4l3-3a4 4 0 0 0-5.7-5.7L11.2 6"/><path d="M14 11a4 4 0 0 0-5.7-.4l-3 3a4 4 0 0 0 5.7 5.7l1.8-1.6"/><path d="M18 15v5M15.5 17.5h5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z"/>',
  globeCheck: '<circle cx="11" cy="11" r="8"/><path d="M3 11h16M11 3c2.3 2.2 3.6 5 3.6 8s-1.3 5.8-3.6 8c-2.3-2.2-3.6-5-3.6-8s1.3-5.8 3.6-8Z"/><path d="m16.5 18.5 1.8 1.8 3.2-3.6"/>',
  braces: '<path d="M9 4c-2 0-2.6.9-2.6 2.6v2.2c0 1.2-.8 2-2.4 2v2.4c1.6 0 2.4.8 2.4 2v2.2C6.4 19.1 7 20 9 20"/><path d="M15 4c2 0 2.6.9 2.6 2.6v2.2c0 1.2.8 2 2.4 2v2.4c-1.6 0-2.4.8-2.4 2v2.2c0 1.7-.6 2.6-2.6 2.6"/>',
  bracesCheck: '<path d="M8 4C6 4 5.4 4.9 5.4 6.6v2.2c0 1.2-.8 2-2.4 2v2.4c1.6 0 2.4.8 2.4 2v2.2C5.4 19.1 6 20 8 20"/><path d="M14 4c2 0 2.6.9 2.6 2.6v2.2c0 1.2.8 2 2.4 2v2.4c-1.6 0-2.4.8-2.4 2v2.2c0 1.7-.6 2.6-2.6 2.6"/><path d="m14.6 12.4 1.6 1.6 2.8-3.2"/>',
  searchWindow: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><circle cx="10.5" cy="14" r="2.6"/><path d="m12.4 15.9 2.1 2.1"/>',
  textCheck: '<path d="M5 6h14M5 11h9M5 16h6"/><path d="m14.5 16.5 1.8 1.8 3.2-3.6"/>',
  crawl: '<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="18" r="2.4"/><circle cx="19" cy="18" r="2.4"/><path d="M12 7.4v4.2M10.2 13 6.6 16M13.8 13l3.6 3"/>',
  gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 13 3.4-3.4"/><circle cx="12" cy="17" r="1.3"/>',
  imageCheck: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.4"/><path d="m3 17 4.4-4.4 3.6 3.6 2.6-2.6 3 3"/><path d="m15.4 18.6 1.6 1.6 2.8-3.2"/>',
  clipboard: '<path d="M9 4H7.5A1.5 1.5 0 0 0 6 5.5v14A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-14A1.5 1.5 0 0 0 16.5 4H15"/><rect x="9" y="3" width="6" height="3.4" rx="1"/><path d="m8.6 12 1.5 1.5 2.3-2.6M14.5 12h2.4M8.6 16.4l1.5 1.5 2.3-2.6M14.5 16.4h2.4"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="2.4"/><path d="M12 4.6V8M9.2 19v2M14.8 19v2"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9.5 16h5"/>',
  botCheck: '<rect x="3" y="8" width="12" height="10" rx="2.2"/><path d="M9 5v3"/><circle cx="6.6" cy="13" r=".9"/><path d="M14.5 20.4l1.6 1.6 3.2-3.6"/>',
  shieldSlash: '<path d="M12 3 4.6 6v5.6c0 4.2 3 7.4 7.4 9.4 1.4-.7 2.7-1.5 3.8-2.5"/><path d="M4 4 20 20"/><path d="M8 6.1 12 5l7.4 1v5.6c0 1.4-.3 2.7-.9 3.9"/>',
  docText: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M8.5 12h7M8.5 15.5h7M8.5 8.5H11"/>',
  hash: '<path d="M9.4 4 8 20M16 4l-1.4 16M4.5 9h15M3.8 15h15"/>',
  type: '<path d="M4 7V5h11v2M9.5 5v14M6.8 19h5.4"/><path d="M15.4 12h4.8M17.8 12v7M16.4 19h2.8"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  paragraph: '<path d="M5 6h14M5 10h14M5 14h10M5 18h7"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 1.8"/>',
  redirect: '<path d="M4 7h7.4a5 5 0 0 1 0 10H8"/><path d="m10.4 4.6-3 2.4 3 2.4"/><path d="m14 14-2.2 3 2.2 3"/>',
  tree: '<rect x="9" y="3" width="6" height="4.6" rx="1"/><rect x="3" y="16.4" width="6" height="4.6" rx="1"/><rect x="15" y="16.4" width="6" height="4.6" rx="1"/><path d="M12 7.6V12M6 16.4V12h12v4.4"/>',
  treeCheck: '<rect x="9" y="3" width="6" height="4.6" rx="1"/><rect x="3" y="16.4" width="6" height="4.6" rx="1"/><path d="M12 7.6V12M6 16.4V12h6"/><path d="m14.4 17.6 1.6 1.6 3.2-3.6"/>',
  key: '<circle cx="8" cy="8" r="3.4"/><path d="m10.4 10.4 8.8 8.8M16 16l2-2M18.6 18.6l2-2"/>',
  code: '<path d="m8.4 8-4 4 4 4M15.6 8l4 4-4 4M13.4 5l-2.8 14"/>',
  fingerprint: '<path d="M12 4a8 8 0 0 1 8 8v1.6M4 12a8 8 0 0 1 8-8M7 12a5 5 0 0 1 10 0v3.4M9.6 12a2.4 2.4 0 0 1 4.8 0v5.6M4 14.6C4 17 5 19 6.6 20.4M19.4 17c-.4 1.6-1.2 2.8-2.4 3.8"/>',
  keyRound: '<circle cx="8.4" cy="15.6" r="3.4"/><path d="m11 13 8-8M16.2 7.8l2 2M18.4 5.6l2 2"/>',
  monitor: '<rect x="3" y="4" width="18" height="12.6" rx="2"/><path d="M8 20h8M12 16.6V20"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M12 14h2M16 14h.5M8 17.4h2M12 17.4h2"/>',
  imageDown: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.6" cy="9.2" r="1.4"/><path d="m3 17 4.6-4.6 3.6 3.6 2.8-2.8 3.4 3.4"/><path d="M12 10.6v4M10.6 13.2 12 14.6l1.4-1.4"/>',
  network: '<circle cx="12" cy="12" r="2.2"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="6" r="1.8"/><circle cx="5" cy="18" r="1.8"/><circle cx="19" cy="18" r="1.8"/><path d="m6.4 7.2 4 3.4M17.6 7.2l-4 3.4M6.4 16.8l4-3.4M17.6 16.8l-4-3.4"/>',
  regex: '<path d="M4 8h6M7 5v6M14 6.5l4 4M18 6.5l-4 4M12.4 15.4h6.4M16.6 13.6v2.4"/><circle cx="6.4" cy="17.4" r="1.2"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2.6v2.6H14zM18 18h2v2h-2zM14 18h1M18 14h2"/>',
  palette: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17h1.3a1.9 1.9 0 0 0 0-3.8h-.9a1.7 1.7 0 0 1 0-3.4h3.3A4.3 4.3 0 0 0 20 9.6a7.6 7.6 0 0 0-8-6.1Z"/><circle cx="8.2" cy="9" r="1.1"/><circle cx="12" cy="7.2" r="1.1"/><circle cx="15.6" cy="9.4" r="1.1"/>',
  coins: '<ellipse cx="12" cy="6.4" rx="7" ry="2.8"/><path d="M5 6.4v4.4c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6.4"/><path d="M5 10.8v4.4c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-4.4"/>',
  target: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>',
  userPlus: '<circle cx="10" cy="8" r="3.4"/><path d="M4 20c0-3.3 2.7-5.6 6-5.6 1.1 0 2.1.2 3 .7"/><path d="M17.6 14.4v5M15.1 16.9h5"/>',
  sliders: '<path d="M4 7h7M15 7h5M4 17h4M12 17h8"/><circle cx="13" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.6 6.4 8.4 6 8.4-6"/>',
  wallet: '<path d="M4 7.4A2.4 2.4 0 0 1 6.4 5H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.4A2.4 2.4 0 0 1 4 18.6Z"/><path d="M4 8h16M15.4 14.4h3"/>',
  bars: '<path d="M5 20V12M10 20V6M15 20v-5M20 20V9"/>',
  arrowTurn: '<path d="M4 18V9a3 3 0 0 1 3-3h11"/><path d="m15 3 3 3-3 3"/>',
};

const MAP = {
  'meta-tag-generator': 'tag', 'open-graph-generator': 'share', 'twitter-card-generator': 'social',
  'canonical-tag-generator': 'linkMaster', 'hreflang-tag-generator': 'globe', 'schema-markup-generator': 'braces',
  'serp-preview-tool': 'searchWindow', 'meta-description-checker': 'textCheck', 'web-crawler-audit': 'crawl',
  'seo-score-checker': 'gauge', 'og-image-tester': 'imageCheck', 'hreflang-checker': 'globeCheck',
  'website-audit': 'clipboard',
  'robots-txt-generator': 'bot', 'robots-txt-tester': 'botCheck', 'ai-crawler-blocker': 'shieldSlash',
  'llms-txt-generator': 'docText',
  'url-slug-generator': 'linkMaster', 'utm-link-builder': 'tag', 'keyword-density-checker': 'bars',
  'hashtag-generator': 'hash', 'case-converter': 'type', 'duplicate-line-remover': 'copy',
  'lorem-ipsum-generator': 'paragraph', 'reading-time-calculator': 'clock',
  'htaccess-redirect-generator': 'redirect', 'sitemap-generator': 'tree', 'sitemap-validator': 'treeCheck',
  'password-generator': 'key', 'base64-encoder-decoder': 'code', 'url-encoder-decoder': 'code',
  'uuid-generator': 'fingerprint', 'jwt-decoder': 'keyRound', 'user-agent-parser': 'monitor',
  'ics-calendar-generator': 'calendar', 'image-compressor': 'imageDown', 'json-validator': 'bracesCheck',
  'timestamp-converter': 'clock', 'ip-converter': 'network', 'regex-tester': 'regex',
  'qr-code-generator': 'qr',
  'word-counter': 'type', 'character-counter': 'hash',
  'color-picker': 'palette', 'css-minifier': 'code',
  'roi-calculator': 'coins', 'roas-calculator': 'target', 'cac-calculator': 'userPlus',
  'ad-metrics-calculator': 'sliders', 'email-roi-calculator': 'mail', 'marketing-budget-calculator': 'wallet',
};

const CAT = { seo: 'searchWindow', ai: 'bot', content: 'paragraph', web: 'code', marketing: 'target' };

export const iconSvg = (name) => (P[name] ? wrap(P[name]) : wrap(P.tag));
export const toolIcon = (slug) => iconSvg(MAP[slug] || 'tag');
export const toolIconBody = (slug) => P[MAP[slug] || 'tag'];
export const catIcon = (id) => iconSvg(CAT[id] || 'tag');

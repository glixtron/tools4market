// Tools4Market — the crawler list, defined once.
//
// Two surfaces read this file: the robots.txt generator renders one checkbox
// per bot, and the "robots.txt for search engines and AI crawlers" guide renders
// its decision table from the same array. Keeping them on one list is the point
// — a guide that drifts from the emitter is worse than no guide, because the
// reader copies a table into a file that no longer matches it.
//
// `advice` is deliberately coarse. "Your call" means the file changes nothing
// about ranking either way; it is a content-licensing decision, and pretending
// otherwise would invent a ranking mechanism that does not exist.

export const AI_BOTS = [
  // AI training crawlers
  { id: 'gptbot', ua: 'GPTBot', owner: 'OpenAI', purpose: 'Model training', group: 'training', hint: 'OpenAI — model training', advice: 'Your call' },
  { id: 'claudebot', ua: 'ClaudeBot', owner: 'Anthropic', purpose: 'Model training', group: 'training', hint: 'Anthropic — model training', advice: 'Your call' },
  { id: 'anthropic', ua: 'anthropic-ai', owner: 'Anthropic', purpose: 'Legacy agent', group: 'training', hint: 'Anthropic — legacy agent', advice: 'Block with ClaudeBot' },
  { id: 'googleext', ua: 'Google-Extended', owner: 'Google', purpose: 'Gemini training (not Search)', group: 'training', hint: 'Gemini training; not Search', advice: 'Your call' },
  { id: 'ccbot', ua: 'CCBot', owner: 'Common Crawl', purpose: 'Open dataset used by many models', group: 'training', hint: 'Common Crawl — feeds many models', advice: 'Your call' },
  { id: 'bytespider', ua: 'Bytespider', owner: 'ByteDance', purpose: 'Model training (TikTok)', group: 'training', hint: 'ByteDance / TikTok', advice: 'Your call' },
  { id: 'applebot', ua: 'Applebot-Extended', owner: 'Apple', purpose: 'Apple Intelligence training', group: 'training', hint: 'Apple Intelligence training', advice: 'Your call' },
  { id: 'meta', ua: 'Meta-ExternalAgent', owner: 'Meta', purpose: 'Meta AI training', group: 'training', hint: 'Meta AI training', advice: 'Your call' },
  { id: 'imagesift', ua: 'ImagesiftBot', owner: 'Hive', purpose: 'Image datasets', group: 'training', hint: 'Hive — image datasets', advice: 'Your call' },
  { id: 'diffbot', ua: 'Diffbot', owner: 'Diffbot', purpose: 'Knowledge-graph scraping', group: 'training', hint: 'knowledge-graph scraping', advice: 'Your call' },

  // AI search assistants
  { id: 'oaisearch', ua: 'OAI-SearchBot', owner: 'OpenAI', purpose: 'ChatGPT search listings', group: 'assistant', hint: 'ChatGPT search listings', advice: 'Allow' },
  { id: 'chatgptuser', ua: 'ChatGPT-User', owner: 'OpenAI', purpose: 'Live user browsing', group: 'assistant', hint: 'live user browsing', advice: 'Allow' },
  { id: 'perplexity', ua: 'PerplexityBot', owner: 'Perplexity', purpose: 'Answer-engine index', group: 'assistant', hint: 'Perplexity answer engine', advice: 'Allow' },
  { id: 'perplexityuser', ua: 'Perplexity-User', owner: 'Perplexity', purpose: 'User-initiated fetches', group: 'assistant', hint: 'user-initiated fetches', advice: 'Allow' },
  { id: 'claudeuser', ua: 'Claude-User', owner: 'Anthropic', purpose: 'User-initiated fetches', group: 'assistant', hint: 'user-initiated fetches', advice: 'Allow' },
  { id: 'claudesearch', ua: 'Claude-SearchBot', owner: 'Anthropic', purpose: 'Claude search listings', group: 'assistant', hint: 'Claude search listings', advice: 'Allow' },
  { id: 'youbot', ua: 'YouBot', owner: 'You.com', purpose: 'Answer-engine index', group: 'assistant', hint: 'You.com', advice: 'Allow' },
  { id: 'applebot-search', ua: 'Applebot', owner: 'Apple', purpose: 'Siri and Spotlight, not training', group: 'assistant', hint: 'Siri / Spotlight, not training', advice: 'Allow' },
];

export const BOT_GROUPS = [
  { key: 'training', label: 'AI training crawlers' },
  { key: 'assistant', label: 'AI search assistants' },
];

// The generator's checkbox markup, in the same order as the table below.
export const botCheckboxes = (prefix) => BOT_GROUPS.map((g) => {
  const rows = AI_BOTS.filter((b) => b.group === g.key).map((b) =>
    `<div class="field-check"><input type="checkbox" id="${prefix}-${b.id}" data-bot="${b.ua}"><label for="${prefix}-${b.id}">${b.ua} <span class="field-hint">(${b.hint})</span></label></div>`).join('\n');
  return `<fieldset class="group-box"><legend>${g.label}</legend>\n${rows}\n</fieldset>`;
}).join('\n');

// The guide's table, built from the same array the checkboxes come from.
export const botTable = () => ({
  head: ['User-agent', 'Owner', 'What it does', 'Starting point'],
  rows: AI_BOTS.map((b) => [b.ua, b.owner, b.purpose, b.advice]),
});

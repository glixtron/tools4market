// Tools4Market — AI Search & Crawler tool definitions (build-time data)
import { f, outputBlock, outputArea, note, groupBox } from './helpers.js';

const AI_GROUPS = (prefix) => `
${groupBox('AI training crawlers', `
<div class="field-check"><input type="checkbox" id="${prefix}-gptbot" data-bot="GPTBot"><label for="${prefix}-gptbot">GPTBot <span class="field-hint">(OpenAI — model training)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-claudebot" data-bot="ClaudeBot"><label for="${prefix}-claudebot">ClaudeBot <span class="field-hint">(Anthropic — model training)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-anthropic" data-bot="anthropic-ai"><label for="${prefix}-anthropic">anthropic-ai <span class="field-hint">(Anthropic — legacy agent)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-googleext" data-bot="Google-Extended"><label for="${prefix}-googleext">Google-Extended <span class="field-hint">(Gemini training; not Search)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-ccbot" data-bot="CCBot"><label for="${prefix}-ccbot">CCBot <span class="field-hint">(Common Crawl — feeds many models)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-bytespider" data-bot="Bytespider"><label for="${prefix}-bytespider">Bytespider <span class="field-hint">(ByteDance / TikTok)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-applebot" data-bot="Applebot-Extended"><label for="${prefix}-applebot">Applebot-Extended <span class="field-hint">(Apple Intelligence training)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-meta" data-bot="Meta-ExternalAgent"><label for="${prefix}-meta">Meta-ExternalAgent <span class="field-hint">(Meta AI training)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-imagesift" data-bot="ImagesiftBot"><label for="${prefix}-imagesift">ImagesiftBot <span class="field-hint">(Hive — image datasets)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-diffbot" data-bot="Diffbot"><label for="${prefix}-diffbot">Diffbot <span class="field-hint">(knowledge-graph scraping)</span></label></div>
`)}
${groupBox('AI search assistants', `
<div class="field-check"><input type="checkbox" id="${prefix}-oaisearch" data-bot="OAI-SearchBot"><label for="${prefix}-oaisearch">OAI-SearchBot <span class="field-hint">(ChatGPT search listings)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-chatgptuser" data-bot="ChatGPT-User"><label for="${prefix}-chatgptuser">ChatGPT-User <span class="field-hint">(live user browsing)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-perplexity" data-bot="PerplexityBot"><label for="${prefix}-perplexity">PerplexityBot <span class="field-hint">(Perplexity answer engine)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-perplexityuser" data-bot="Perplexity-User"><label for="${prefix}-perplexityuser">Perplexity-User <span class="field-hint">(user-initiated fetches)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-claudeuser" data-bot="Claude-User"><label for="${prefix}-claudeuser">Claude-User <span class="field-hint">(user-initiated fetches)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-claudesearch" data-bot="Claude-SearchBot"><label for="${prefix}-claudesearch">Claude-SearchBot <span class="field-hint">(Claude search listings)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-youbot" data-bot="YouBot"><label for="${prefix}-youbot">YouBot <span class="field-hint">(You.com)</span></label></div>
<div class="field-check"><input type="checkbox" id="${prefix}-applebot-search" data-bot="Applebot"><label for="${prefix}-applebot-search">Applebot <span class="field-hint">(Siri / Spotlight, not training)</span></label></div>
`)}`;

export const TOOLS_AI = [
  // ---------------------------------------------------------- 1
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    cat: 'ai',
    icon: '🤖',
    card: 'Generate robots.txt with AI-crawler presets (GPTBot, ClaudeBot…).',
    keywords: 'robots txt generator ai crawler gptbot claudebot block',
    h1: 'Free Robots.txt Generator — No Signup, No Limits',
    metaTitle: 'Free Robots.txt Generator — With AI Crawler Presets',
    metaDesc: 'Generate a valid robots.txt with per-bot control: allow or block Google, Bing, GPTBot, ClaudeBot, PerplexityBot and 20+ crawlers. Free, no signup.',
    intro: 'Build a correct robots.txt with fine-grained control over every major crawler — including the AI bots (GPTBot, ClaudeBot, PerplexityBot…) that most generators still ignore.',
    sections: [
      { h: 'Control who crawls your site — including AI', p: ['robots.txt sits at the root of your domain and tells well-behaved crawlers what they may fetch. Since 2023 a second class of crawler arrived: AI agents that train models on your content or answer questions with it. They identify themselves with their own user-agents — GPTBot (OpenAI), ClaudeBot (Anthropic), Google-Extended (Gemini), PerplexityBot, CCBot and others — and each can be allowed or blocked independently. The file itself is only a series of blocks: one User-agent line, followed by the rules that apply to it.', 'A sensible default for most sites: allow the search engines your traffic depends on, decide deliberately on AI training bots, and think twice before blocking AI search assistants if you want to stay visible in answer engines. This is a policy decision rather than a technical toggle, and it is worth writing down so the next person to touch the file makes the same one. Keep the search bots allowed, and revisit the rest whenever a new crawler appears.'] },
      { h: 'How to use it', p: ['Tick the bots you want to block — nothing is blocked by default — and add your sitemap URL if you have one; the generator appends it as a Sitemap line at the end of the file. Copy the output into a file named robots.txt and upload it to your domain root, where it must answer at https://yourdomain.com/robots.txt without a redirect. Leaving a bot unticked writes no rule for it, and no rule means the crawler is allowed.', 'Verify after deploying by opening that URL in a private window and checking the robots.txt report in Search Console for crawl errors. Remember that rules apply per subdomain: www and the bare domain are separate hosts, and each one needs its own file. If you later move platforms, confirm the new host still serves the file you expect.'] },
      { h: 'Common mistakes', p: ['The classic failure is blocking your own site — a stray Disallow under the wrong user-agent stops Googlebot from crawling pages you meant to index. Test every rule against the crawler it targets, and never paste a robots.txt copied from another site without reading each line. The second trap is treating robots.txt as a privacy tool: it governs crawling, not indexing, so a blocked page with inbound links can still appear in results.', 'Be careful with wildcards — Disallow with a folder path blocks everything beneath it, while a pattern ending in $ matches only exact URLs. Google resolves conflicts by specificity, so an exception wins only when its path is more specific than the rule it overrides. Keep the file small and readable, and change one rule at a time so you can trace what broke if organic traffic shifts.'] },
    ],
    faqs: [
      { q: 'Does blocking GPTBot remove my content from ChatGPT?', a: 'It prevents future training crawls by that bot. Already-collected data is not retroactively removed, and blocking is voluntary — GPTBot respects robots.txt, but rogue scrapers may not.' },
      { q: 'What is the difference between GPTBot and OAI-SearchBot?', a: 'GPTBot trains OpenAI’s models. OAI-SearchBot powers ChatGPT’s search listings — blocking it removes you from ChatGPT search results. Many sites block training but allow search.' },
      { q: 'Where exactly do I put robots.txt?', a: 'Exactly one place: the domain root, e.g. https://example.com/robots.txt. It must be reachable without redirects at that path.' },
      { q: 'Does robots.txt hide pages from Google?', a: 'No — it prevents crawling, not indexing. A blocked page can still appear in results if other pages link to it. To truly exclude a page from results use a noindex meta tag or X-Robots-Tag header.' },
      { q: 'What is Crawl-delay?', a: 'A courtesy request for how many seconds a bot should wait between requests. Google ignores it; Bing and Yandex honour it. We do not include it by default since aggressive delays can throttle legitimate crawling.' },
    ],
    html: `
${AI_GROUPS('rb')}
${f.url('rb-sitemap', 'Sitemap URL (optional, recommended)', 'https://example.com/sitemap.xml')}
${outputBlock('rb-out', 'robots.txt')}
${note('Copy the output into a file named <strong>robots.txt</strong> and upload it to your domain root.')}`,
  },

  // ---------------------------------------------------------- 2
  {
    slug: 'ai-crawler-blocker',
    name: 'AI Crawler Blocker',
    cat: 'ai',
    icon: '🛡️',
    card: 'One click to block every major AI bot in robots.txt.',
    keywords: 'block ai crawlers gptbot blocker robots txt ai bots',
    h1: 'Free AI Crawler Blocker — No Signup, No Limits',
    metaTitle: 'Block AI Crawlers — Free AI Bot robots.txt Generator',
    metaDesc: 'Block all major AI crawlers with one click: GPTBot, ClaudeBot, PerplexityBot, CCBot, Bytespider and 18 more. Generates a ready-to-use robots.txt.',
    intro: 'One click builds a robots.txt that blocks every major AI crawler — training bots and AI search assistants, individually or as a group, with 18 bots covered.',
    sections: [
      { h: 'Why sites block AI crawlers', p: ['Publishers block AI bots for three common reasons: to protect content that funds their business (training bots feed models that may answer questions without a visit), to control server load from aggressive crawlers like Bytespider, and to keep licensing options open — several AI companies pay for licensed data, which is only negotiable when your content is not freely scraped. Some teams simply do not want their writing reused to generate answers at all, which is a legitimate preference to encode.', 'The counter-argument: AI search assistants (ChatGPT search, Perplexity, Claude) are a growing discovery channel, and blocking every AI bot hides you from that audience too. That is why this tool separates training crawlers from search assistants — many sites choose to block training and allow search. It is the middle path, and the preset above applies it in one click, though you can still override any individual bot afterwards.'] },
      { h: 'How to use it', p: ['Pick a preset: block everything AI, block training only (the recommended starting point), or hand-pick bots in the two lists — training crawlers and search assistants are grouped so you can see the trade-off as you tick. The counter shows how many of the 18 known crawlers you are blocking. Copy the generated robots.txt to your domain root, and re-check it whenever a new bot appears, because this list will not update itself.', 'Remember that robots.txt is a convention rather than a wall: the major companies honour it, anonymous scrapers do not. For content you truly must protect, put it behind a login or a paywall instead of relying on a crawl directive. Also confirm the file is reachable — a robots.txt should answer at the domain root with a plain 200 response, with no auth prompt and no redirect chain.'] },
      { h: 'How to check your work', p: ['Deploy the file, then confirm it is live: open https://yourdomain.com/robots.txt in a private window and look for the rules you just added. After that, watch your server logs or your CDN bot analytics for the blocked user-agents over the following days. Cloudflare and most web firewalls classify AI crawler traffic separately, so a visible drop in those requests is your evidence that the block is honoured rather than merely written.', 'Check the other direction too: anything you meant to keep open should still be crawling. Googlebot and Bingbot must continue indexing you, and if you left search assistants alone you should still see OAI-SearchBot or PerplexityBot in your logs. Treat the file as living policy and review it twice a year — new user-agents appear often, and a rule set written two years ago rarely matches what the business wants today.'] },
    ],
    faqs: [
      { q: 'Which AI crawlers does this tool block?', a: 'GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, Google-Extended, Applebot, Applebot-Extended, PerplexityBot, Perplexity-User, CCBot, Bytespider, Meta-ExternalAgent, ImagesiftBot, Diffbot and YouBot — the majors as of 2026.' },
      { q: 'Will blocking AI bots hurt my Google rankings?', a: 'No. Googlebot and Google-Extended are separate: blocking Google-Extended stops Gemini training but does not affect Search indexing or rankings.' },
      { q: 'Can AI companies ignore my robots.txt?', a: 'The major companies honour it. Cloudflare-independent scrapers and some smaller players may not. robots.txt is a request, not a technical barrier.' },
      { q: 'How do I verify the block works?', a: 'Check your server logs for the bot user-agents after deploying, or use Cloudflare/AWS WAF bot analytics, which classify AI crawler traffic separately.' },
    ],
    html: `
<div class="btn-row">
  <button type="button" class="btn" id="ab-blockall">Block all AI crawlers</button>
  <button type="button" class="btn btn-secondary" id="ab-blocktrain">Block training only, allow AI search</button>
  <button type="button" class="btn btn-secondary" id="ab-allowall">Allow all (clear)</button>
</div>
${AI_GROUPS('ab')}
<p class="tool-note" id="ab-count">Blocking 0 of 18 known AI crawlers.</p>
${f.url('ab-sitemap', 'Sitemap URL (optional)', 'https://example.com/sitemap.xml')}
${outputBlock('ab-out', 'robots.txt')}`,
  },

  // ---------------------------------------------------------- 3
  {
    slug: 'llms-txt-generator',
    name: 'llms.txt Generator',
    cat: 'ai',
    icon: '📄',
    card: 'Create an llms.txt file so AI models find your best pages.',
    keywords: 'llms txt generator ai search geo answer engine optimization',
    h1: 'Free llms.txt Generator — No Signup, No Limits',
    metaTitle: 'Free llms.txt Generator — For AI Search (GEO)',
    metaDesc: 'Generate an llms.txt file in the llmstxt.org format: guide AI models to your best pages. Free llms.txt generator with markdown output, no signup.',
    intro: 'Generate an llms.txt file per the llmstxt.org specification — a markdown roadmap that tells AI models which pages on your site matter most.',
    sections: [
      { h: 'What llms.txt is (and is not)', p: ['llms.txt is a proposal for a file at /llms.txt that gives language models a curated, markdown-formatted list of your most important pages — the AI-era equivalent of a sitemap, but opinionated: you point models at what is genuinely worth reading rather than at every URL you publish. Because the format is plain markdown, you can write it by hand and edit it like any other page copy. It sits beside robots.txt at your domain root, in the one place every crawler expects to find site-level files.', 'It is not a blocking mechanism — that is the job of robots.txt — and it is not an official ranking signal either, so nobody can promise you placements for writing one. What it does offer is a low-cost, spec-compliant description of your site that any reader, crawler or colleague can skim in seconds. Adoption is spreading across documentation sites and AI-focused brands, and the cost of having one is nearly zero.'] },
      { h: 'How to use it', p: ['Enter your site name, a one-line description and your homepage URL, then list your key pages one per line as URL, title and note — the last two are optional, so a bare link is fine. The generator produces a valid file following the spec: an H1 with the site name, a blockquote summary, then H2 sections listing markdown links with their notes. Nothing is uploaded; the output is assembled in your browser.', 'Upload the file to your domain root and link it from your homepage so it is easy to discover. Keep it short — ten to fifty links of real substance beat an exhaustive dump, because context windows reward curation over coverage. Think of it as an editor’s shortlist: your deepest guides, your pricing, your signup page, and anything else you would hand a new reader on their first visit.'] },
      { h: 'When it matters', p: ['llms.txt earns its place when your site is deep. Documentation libraries, large blogs, product catalogs and knowledge bases all bury their best material under thousands of thin or duplicate pages, and a curated list shortcuts that search for any model that reads it. On a five-page marketing site it adds little, because there is nothing to curate; the value grows with the size of your archive and how hard your navigation is to crawl.', 'It also matters when you are investing in being cited. Answer engines and assistants summarise sources they can verify quickly, and a file that names your canonical guides makes those pages easier to find and easier to quote. Write it once when you launch or restructure the site, then treat it as a maintenance item alongside your sitemap: when a page stops being your best answer, replace the link rather than letting the list drift.'] },
    ],
    faqs: [
      { q: 'Does llms.txt improve my visibility in ChatGPT or Perplexity?', a: 'There is no confirmed ranking effect yet — early studies found limited impact. It is a low-cost, spec-compliant way to be ready if models start consuming it, and it doubles as clean documentation of your site for any reader.' },
      { q: 'What is the correct format?', a: 'Per llmstxt.org: an optional H1 site name, a blockquote description, then markdown sections. The most common pattern is “## Pages” with a bullet list of [title](url): note lines.' },
      { q: 'Where do I upload llms.txt?', a: 'At your domain root — https://yourdomain.com/llms.txt — the same place as robots.txt.' },
      { q: 'llms.txt or robots.txt — which do I need?', a: 'They do opposite jobs. robots.txt restricts crawlers; llms.txt recommends content. Many sites ship both.' },
    ],
    html: `
${f.text('ll-name', 'Site name', 'Tools4Market')}
${f.text('ll-desc', 'One-line description', 'Free marketing, SEO and AI-search tools that run in the browser.')}
${f.url('ll-url', 'Homepage URL', 'https://www.tools4market.online')}
${f.textarea('ll-pages', 'Key pages — one per line as: URL | Title | Note (title/note optional)', 'https://example.com/guide | Complete SEO guide | The deepest resource we have\nhttps://example.com/tools | All free tools\nhttps://example.com/blog/llms-explained | llms.txt explained', 8)}
${outputBlock('ll-out', 'llms.txt')}
${note('Upload as <strong>llms.txt</strong> at your domain root and link it from your homepage.')}`,
  },
];

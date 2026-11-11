// Tools4Market — data index (single import point for build.mjs)
import { TOOLS_SEO } from './seo.js';
import { TOOLS_AI } from './ai-search.js';
import { TOOLS_CONTENT } from './content.js';
import { TOOLS_WEB } from './web.js';
import { TOOLS_MARKETING } from './marketing.js';
import { POLICY } from './policy.js';

export const CATEGORIES = {
  seo: {
    id: 'seo',
    slug: 'seo-tools',
    nav: 'SEO Tools',
    name: 'SEO & Meta Tools',
    icon: '🚀',
    homeDesc: 'Meta tags, Open Graph, canonical, hreflang, schema and snippet previews — the on-page essentials, generated correctly every time.',
    metaTitle: 'SEO & Meta Tools — 13 free checkers and generators',
    pageDesc: 'Generate meta tags, Open Graph and Twitter cards, canonical and hreflang links, and JSON-LD schema. Compare title and description wording in an estimated preview; optional page checks fetch public URLs.',
    metaDesc: 'Free SEO tools for meta tags, Open Graph, canonical links, hreflang, JSON-LD schema and estimated snippet previews. No signup.',
    pageExtra: [
      'Each tool focuses on a page signal: title and meta description candidates for search snippets, Open Graph and Twitter tags for social shares, canonical links for duplicate or alternate URLs, hreflang annotations for multilingual pages, and JSON-LD for supported rich-result features. Generate the markup, review an estimated title and description preview, then add the output to your template.',
      'Checker companions cover the same signals on a live or pasted page: the OG Image Tester measures the actual social-card image a URL serves, and the Hreflang Checker validates language codes, duplicates and the required self-reference straight from the HTML.',
      'Together, these tools form a pre-publish checklist: write a page-specific description, compare title and snippet wording, and review canonical and language signals. The generators run in your browser, so you can use them with client sites, unpublished drafts and staging content.',
    ],
  },
  ai: {
    id: 'ai',
    slug: 'ai-search-tools',
    nav: 'AI Search',
    name: 'AI Search & Crawler Tools',
    icon: '🤖',
    homeDesc: 'Robots.txt with AI-bot presets, one-click AI crawler blocking and llms.txt generation — get your site ready for the AI-search era.',
    metaTitle: 'AI Search & Crawler Tools — robots.txt and llms.txt',
    pageDesc: 'The AI-search era toolkit: decide which AI crawlers may train on or answer from your content, generate llms.txt for answer engines, and ship a robots.txt that covers 18+ bots — including GPTBot, ClaudeBot and PerplexityBot.',
    metaDesc: 'Free AI search tools: robots.txt generator with AI crawler presets, one-click AI bot blocker (GPTBot, ClaudeBot, PerplexityBot) and llms.txt generator.',
    pageExtra: [
      'Robots.txt has become a policy document: the same file now decides which AI crawlers may train on your content, which may answer from it in real time, and what classic search bots see. This category gives you the generator with presets for 18+ bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and friends), a one-click blocker when you want to opt out of AI training entirely, and an llms.txt file that maps your best content for answer engines.',
      'After generating, test any rule with the Robots.txt Tester — paste the live file, pick a bot and a path, and read which rule wins — then audit any live URL with the Web Crawler Audit to see exactly which crawlers are welcome and which rules they hit. A robots.txt change is one of the few SEO edits with an immediate, verifiable effect — fetch the file, confirm the rules, and watch crawl behaviour in your server logs.',
    ],
  },
  content: {
    id: 'content',
    slug: 'content-social-tools',
    nav: 'Content',
    name: 'Content & Social Tools',
    icon: '✍️',
    homeDesc: 'Slug generator, UTM builder, keyword density analyser and hashtag sets — the small utilities content teams use daily.',
    metaTitle: 'Content & Social Tools — 11 free writing utilities',
    pageDesc: 'Daily-driver utilities for content and social teams: clean URL slugs, GA4-ready UTM links, phrase-frequency analysis and platform-tuned hashtag sets.',
    metaDesc: 'Free content tools: URL slug generator, UTM link builder, keyword density checker and hashtag generator for every platform. No signup.',
    pageExtra: [
      'Small utilities with outsized impact on publishing hygiene: URL slugs that stay clean after the twentieth edit, UTM tags your GA4 reports can actually group, phrase-frequency analysis for an honest read on what a draft is really about, and hashtag sets tuned to each platform’s norms. This is the category teams keep open in a second tab while writing.',
      'The mechanics of writing itself are covered too: a case converter for every headline and identifier style from Title Case to snake_case, a duplicate line remover that keeps long lists honest, a classic Lorem Ipsum generator for mockups, and a reading-time calculator that pairs word and character counts with reading and speaking estimates.',
      'Most tools process pasted content in your browser as you type. The keyword checker also offers an optional public-page fetch, which sends the entered URL through our first-party proxy and returns the page text for analysis. Keep confidential drafts in local text mode; the output is built to paste into your CMS, spreadsheets or scheduling tool.',
    ],
  },
  web: {
    id: 'web',
    slug: 'web-utility-tools',
    nav: 'Web Tools',
    name: 'Web & Utility Tools',
    icon: '🛠️',
    homeDesc: 'Sitemaps, .htaccess redirects, image optimization and cryptographically random passwords — useful tools for web work.',
    metaTitle: 'Web & Utility Tools — 21 free browser tools',
    pageDesc: 'Webmaster utilities for XML sitemaps, .htaccess redirects, image compression for faster pages, and secure passwords generated on your device.',
    metaDesc: 'Free browser-based web tools: optimize images for websites, generate XML sitemaps and .htaccess redirects, and create secure passwords.',
    pageExtra: [
      'The webmaster’s utility belt: a standards-valid XML sitemap generated from a URL list, .htaccess rules for the redirects, canonicalisation and HTTPS moves you eventually have to make, and a password generator that uses your browser’s cryptographically secure randomness instead of a predictable seed.',
      'Preparing images for a website is part of the same workflow. The image compressor can resize and re-encode common raster images as WebP, JPEG or PNG, then report the actual before-and-after file sizes. It runs on the selected files in your browser, with no file upload to our service.',
      'The belt has grown to carry the daily decoders and generators as well: Base64 and URL percent-encoding in both directions, a bulk v4 UUID generator, a JWT decoder that shows claims and expiry dates without pretending to verify signatures, a user-agent parser for puzzling log lines, an ICS generator that turns a simple form into a valid, downloadable calendar file, a JSON validator that checks, formats and minifies API payloads, and a sitemap validator that catches malformed entries before a Search Console submission.',
      'These are the tools you reach for during a migration, an audit or a 2 a.m. incident, so they are deliberately zero-friction: no account, no queue and no file upload for browser-based tools. Generate, copy, verify the output yourself, and move on.',
    ],
  },
  marketing: {
    id: 'marketing',
    slug: 'marketing-tools',
    nav: 'Marketing',
    name: 'Marketing Calculators',
    icon: '📊',
    homeDesc: 'ROI, ROAS, CAC and ad-metric calculators — the numbers marketers and founders actually run, in your browser with no signup.',
    metaTitle: 'Marketing Calculators — ROI, ROAS, CAC and ad costs',
    pageDesc: 'Free marketing calculators: ROI, ROAS, customer acquisition cost, CPC, CPM, CPA and CTR. Every calculation runs locally in your browser — nothing is uploaded.',
    metaDesc: 'Free marketing calculators for ROI, ROAS, CAC, CPC, CPM and CPA. Fast, private, no signup — every calculation runs in your browser.',
    pageExtra: [
      'The four numbers every marketing conversation eventually lands on, in one place: ROI for the whole ledger, ROAS for the ad account, CAC for the price of one customer, and the CPC/CPM/CPA rates that sit underneath all of them. Each calculator takes the inputs you already have from any ad platform or spreadsheet, shows its working, and states what the number does not cover — because a marketing figure without its caveats is how bad budget decisions get made.',
      'The set is designed to be read together. Start with the campaign rates to see what traffic cost, check ROAS against your break-even margin to see whether the ads earned, then step up to CAC and ROI for the unit-economics and profit views. Every calculation runs in your browser as you type: no account, no data leaves the page, and the currency selector keeps the output in the numbers your team actually reports.',
    ],
  },
};

export const TOOLS = [...TOOLS_SEO, ...TOOLS_AI, ...TOOLS_CONTENT, ...TOOLS_WEB, ...TOOLS_MARKETING];
export { POLICY };

// ---------------------------------------------------------------------------
// Homepage "start with your job" paths (22 Oct 2026 audit: lead with a job,
// not with the full inventory). One high-intent entry point per category.
// ---------------------------------------------------------------------------
export const JOBS = [
  // Main tool: Full end-to-end website audit with AI-powered enhancement
  {
    title: 'Audit any live site with 40+ rules and AI fixes',
    blurb: 'One crawl covers titles, canonicals, schema, links, images and status codes, then hands back a ranked fix list. Free, no signup, works on any page.',
    path: '/tools/website-audit/',
    cta: 'Start Website Audit',
    icon: 'browser-check',
  },
  {
    title: 'Make a page ready for search',
    blurb: 'Write the meta tags, preview the snippet and check the signals search engines read first.',
    path: '/tools/meta-tag-generator/',
    cta: 'Start with the Meta Tag Generator',
    icon: 'page-search',
  },
  {
    title: 'Decide what AI crawlers may do',
    blurb: 'Allow, block or filter AI bots deliberately — then publish an llms.txt map for answer engines.',
    path: '/tools/robots-txt-generator/',
    cta: 'Start with the Robots.txt Generator',
    icon: 'antenna',
  },
  {
    title: 'Tag a campaign so GA4 can read it',
    blurb: 'Build UTM links with consistent naming that groups cleanly in your reports.',
    path: '/tools/utm-link-builder/',
    cta: 'Start with the UTM Link Builder',
    icon: 'link-tag',
  },
  {
    title: 'Read one page before you trust it',
    blurb: 'Fetch any URL and read its status, canonical, robots rules and discovery signals — no crawl needed.',
    path: '/tools/web-crawler-audit/',
    cta: 'Start with the Web Crawler Audit',
    icon: 'page-scan',
  },
  {
    title: 'Understand what a campaign really earned',
    blurb: 'ROI, ROAS and CAC from the numbers you already have — private, instant, no signup.',
    path: '/tools/roi-calculator/',
    cta: 'Start with the ROI Calculator',
    icon: 'chart-up',
  },
];

// Example searches shown as one-click chips under the hero search field.
// They double as an empty-state suggestion when nothing matches.
export const SEARCH_EXAMPLES = ['meta', 'robots', 'UTM', 'schema', 'audit', 'enhance'];

// Editor's pick — rotates weekly (the week number picks the entry, so the card
// changes on its own every Monday). Swap or reorder this list to re-curate.
// Each entry carries a `note` ("why this week" editorial line) and points at a
// tool that carries `pickWhy` (the use case) and `pickSample` (a real-looking
// output preview) in its own data file.
// ---------------------------------------------------------------------------
export const EDITOR_PICKS = [
  {
    slug: 'web-crawler-audit',
    note: 'Launch week is when crawl mistakes get expensive — this reads the live signals before your visitors do.',
  },
  {
    slug: 'meta-tag-generator',
    note: 'The fastest path from a blank page head to a previewed, complete set of meta tags.',
  },
  {
    slug: 'robots-txt-generator',
    note: 'AI crawler rules shift month to month — the presets here track the current bot list.',
  },
  {
    slug: 'utm-link-builder',
    note: 'Every campaign report is only as clean as the links that feed it.',
  },
  {
    slug: 'website-audit',
    note: 'One run crawls up to 100 pages, checks 40+ rules on each and hands back a prioritized fix list — the closest thing here to a full-site to-do list.',
  },
];

// ISO-ish week index of the current date (1-based; used for the weekly rotation)
export const weekIndex = (d = new Date()) => {
  const start = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - start) / 86400000);
  return Math.ceil((days + start.getDay() + 1) / 7);
};

// Homepage FAQ — rendered as visible <details> blocks and as FAQPage JSON-LD.
export const HOME_FAQS = [
  {
    q: 'Are these tools really free?',
    a: 'Yes — every tool on the site is free, with no account, no usage cap and no upsell. There is no "free tier" that ends after five queries: if a tool is here, it works as many times as you need. The site is funded by advertising and clearly disclosed affiliate links, never by locking the tools behind a signup.',
  },
  {
    q: 'Do the tools upload the text I paste?',
    a: 'Text and selected image files are processed in your browser and are not uploaded by those tools. The optional page-analysis tools are different: if you ask a tool to check a public page, that URL is sent to our first-party fetch service, which retrieves the page and, for sitemap or crawler tools, may also retrieve that host’s robots.txt and sitemap files. Responses are handed back to your browser for analysis. We do not store a report. Never enter private URLs or links containing access tokens.',
  },
  {
    q: 'Can I use these tools for client work?',
    a: 'Yes. Every tool runs in the browser with no account, so there is nothing to license and no per-seat cost. The output is plain text or copy-paste-ready markup, which makes it easy to hand a result to a client. If you find a tool that saves you real time, the footer of each page links to the tools we rate highly.',
  },
  {
    q: 'Do the tools need an internet connection?',
    a: 'Text and generator tools work offline once the page has loaded, because the work happens locally. The page-analysis tools — Web Crawler Audit, SEO Score Checker and the "analyze your page" panel — do need a connection, because they retrieve a live page to inspect it. If a fetch fails, the tools fall back to a paste-HTML path so you can still work.',
  },
  {
    q: 'Are the search previews exact?',
    a: 'No, and no tool can be. A snippet preview shows the title and description you entered in a layout similar to a search result. Google decides the final title and snippet for each query: it may rewrite the title, pull a passage from the page instead of your description, or show a different snippet for a different search. Treat the previews as a layout check, not a promise.',
  },
  {
    q: 'How do you make money from a free tool site?',
    a: 'Advertising (Google AdSense) and a small number of clearly disclosed affiliate links. Ads are placed in reserved spaces around the tools and never inside the tool itself, so the layout never shifts and the interaction area stays clean. If you decline advertising consent, Google serves limited, non-personalised ads instead of personalised ones.',
  },
];

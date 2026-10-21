// Tools4Market — data index (single import point for build.mjs)
import { TOOLS_SEO } from './seo.js';
import { TOOLS_AI } from './ai-search.js';
import { TOOLS_CONTENT } from './content.js';
import { TOOLS_WEB } from './web.js';
import { POLICY } from './policy.js';

export const CATEGORIES = {
  seo: {
    id: 'seo',
    slug: 'seo-tools',
    nav: 'SEO Tools',
    name: 'SEO & Meta Tools',
    icon: '🚀',
    homeDesc: 'Meta tags, Open Graph, canonical, hreflang, schema and snippet previews — the on-page essentials, generated correctly every time.',
    pageDesc: 'Generate meta tags, Open Graph and Twitter cards, canonical and hreflang links, and JSON-LD schema. Compare title and description wording in an estimated preview; optional page checks fetch public URLs.',
    metaDesc: 'Free SEO tools for meta tags, Open Graph, canonical links, hreflang, JSON-LD schema and estimated snippet previews. No signup.',
    pageExtra: [
      'Each tool focuses on a page signal: title and meta description candidates for search snippets, Open Graph and Twitter tags for social shares, canonical links for duplicate or alternate URLs, hreflang annotations for multilingual pages, and JSON-LD for supported rich-result features. Generate the markup, review an estimated title and description preview, then add the output to your template.',
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
    pageDesc: 'The AI-search era toolkit: decide which AI crawlers may train on or answer from your content, generate llms.txt for answer engines, and ship a robots.txt that covers 18+ bots — including GPTBot, ClaudeBot and PerplexityBot.',
    metaDesc: 'Free AI search tools: robots.txt generator with AI crawler presets, one-click AI bot blocker (GPTBot, ClaudeBot, PerplexityBot) and llms.txt generator.',
    pageExtra: [
      'Robots.txt has become a policy document: the same file now decides which AI crawlers may train on your content, which may answer from it in real time, and what classic search bots see. This category gives you the generator with presets for 18+ bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and friends), a one-click blocker when you want to opt out of AI training entirely, and an llms.txt file that maps your best content for answer engines.',
      'After generating, audit any live URL with the Web Crawler Audit to see exactly which crawlers are welcome and which rules they hit. A robots.txt change is one of the few SEO edits with an immediate, verifiable effect — fetch the file, confirm the rules, and watch crawl behaviour in your server logs.',
    ],
  },
  content: {
    id: 'content',
    slug: 'content-social-tools',
    nav: 'Content',
    name: 'Content & Social Tools',
    icon: '✍️',
    homeDesc: 'Slug generator, UTM builder, keyword density analyser and hashtag sets — the small utilities content teams use daily.',
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
    homeDesc: 'Sitemaps, .htaccess redirects and cryptographically random passwords — the utilities every webmaster needs eventually.',
    pageDesc: 'The webmaster’s utility belt: valid XML sitemaps, correct .htaccess redirect and HTTPS rules, and genuinely random passwords generated on your device.',
    metaDesc: 'Free browser-based web tools: XML sitemap and .htaccess redirect generators, secure password generator and practical utilities.',
    pageExtra: [
      'The webmaster’s utility belt: a standards-valid XML sitemap generated from a URL list, .htaccess rules for the redirects, canonicalisation and HTTPS moves you eventually have to make, and a password generator that uses your browser’s cryptographically secure randomness instead of a predictable seed.',
      'The belt has grown to carry the daily decoders and generators as well: Base64 and URL percent-encoding in both directions, a bulk v4 UUID generator, a JWT decoder that shows claims and expiry dates without pretending to verify signatures, a user-agent parser for puzzling log lines, and an ICS generator that turns a simple form into a valid, downloadable calendar file.',
      'These are the tools you reach for during a migration, an audit or a 2 a.m. incident, so they are deliberately zero-friction: no account, no queue, no file uploaded to a third party. Generate, copy, verify the output yourself, and move on.',
    ],
  },
};

export const TOOLS = [...TOOLS_SEO, ...TOOLS_AI, ...TOOLS_CONTENT, ...TOOLS_WEB];
export { POLICY };

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
    pageDesc: 'The on-page SEO essentials: generate valid meta tags, Open Graph and Twitter cards, canonical and hreflang links, JSON-LD schema — and preview your Google snippet before you publish. Everything runs in your browser.',
    metaDesc: 'Free online SEO tools: meta tag, Open Graph, canonical, hreflang and JSON-LD schema generators plus a pixel-accurate SERP preview. No signup, no limits.',
    pageExtra: [
      'Every tool here targets one on-page signal that search engines read directly from your HTML: the title and meta description that shape your snippet, Open Graph and Twitter tags for social shares, a canonical link that consolidates duplicates, hreflang pairs for multilingual sites, and JSON-LD schema that can unlock rich results. Generate the markup, preview it as it will appear in search, and paste the finished output into your template.',
      'Used together, they form a quick pre-publish checklist: draft a meta description that actually fits the snippet, confirm the SERP preview reads well, validate your canonical, and only then ship. Everything runs on your device, so it is safe to use on client sites, unpublished drafts and staging environments alike.',
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
      'They are all instant and local: paste a headline list, a campaign URL or a draft, and the result updates as you type. Because nothing is uploaded, the tools are equally comfortable with confidential launch copy as with a public blog post — and the output is built to paste straight into your CMS, spreadsheets or scheduling tool.',
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
    metaDesc: 'Free web tools: XML sitemap generator, .htaccess redirect generator (301, HTTPS, www) and a secure password generator. 100% in-browser.',
    pageExtra: [
      'The webmaster’s utility belt: a standards-valid XML sitemap generated from a URL list, .htaccess rules for the redirects, canonicalisation and HTTPS moves you eventually have to make, and a password generator that uses your browser’s cryptographically secure randomness instead of a predictable seed.',
      'The belt has grown to carry the daily decoders and generators as well: Base64 and URL percent-encoding in both directions, a bulk v4 UUID generator, a JWT decoder that shows claims and expiry dates without pretending to verify signatures, a user-agent parser for puzzling log lines, and an ICS generator that turns a simple form into a valid, downloadable calendar file.',
      'These are the tools you reach for during a migration, an audit or a 2 a.m. incident, so they are deliberately zero-friction: no account, no queue, no file uploaded to a third party. Generate, copy, verify the output yourself, and move on.',
    ],
  },
};

export const TOOLS = [...TOOLS_SEO, ...TOOLS_AI, ...TOOLS_CONTENT, ...TOOLS_WEB];
export { POLICY };

// Tools4Market — blog articles (guides). Build-time data; every string is user-facing.
// Each article targets one phrase (focus), links into the matching tool, and carries
// FAQPage + Article/BlogPosting + BreadcrumbList structured data (added in build.mjs).

import { botTable } from './bots.js';

export const ARTICLES = [
  {
    slug: 'robots-txt-for-search-and-ai-crawlers',
    title: 'robots.txt for search engines and AI crawlers: what the file controls',
    focus: 'robots.txt for ai crawlers',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'robots.txt for AI Crawlers: A Practical Guide (2026)',
    metaDesc: 'What robots.txt controls, which AI crawlers to allow or block, how to block GPTBot and ClaudeBot, and what robots.txt can never do. Templates included.',
    intro: 'A robots.txt file decides whether named crawlers may read your site. It is the first thing a crawler fetches, it takes minutes to change, and it is widely misunderstood — this guide covers what it controls, which AI crawlers to allow or block, and the mistakes that undo the whole thing.',
    sections: [
      {
        h: 'What robots.txt controls — and what AI crawlers need',
        p: [
          'robots.txt controls **crawling**, not indexing. A rule like `Disallow: /` asks a crawler not to fetch URLs; it does not remove pages that are already indexed, and it does not de-rank anything on its own. If you want a page out of search results, you need a `noindex` directive in the page itself (or an `X-Robots-Tag` header) — and critically, the page must be **crawlable** for a crawler to see that noindex. Blocking a page in robots.txt while expecting noindex to work is the most common self-inflicted SEO mistake there is.',
          'A robots.txt file lives at the root of your domain — `https://example.com/robots.txt` — and its rules are read top to bottom. The most specific rule for a user-agent wins, and the most specific path rule wins within a group. You can group rules per crawler, but a crawler that matches no group is treated as fully allowed.',
        ],
      },
      {
        h: 'The AI crawlers you now have to decide about',
        p: [
          'The crawler list grew a category in 2024. Alongside Googlebot and Bingbot there are training crawlers (GPTBot, ClaudeBot, Bytespider, Amazonbot, CCBot, MistralAI-Training), AI search indexers and user-triggered fetchers (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User), and AI agents (Applebot-Extended, meta-externalagent, cohere-ai, Diffbot). They are not interchangeable: one may be used to train a model, another to index pages for an assistant, and a third to fetch a page live when a user asks about it. `Google-Extended` belongs in none of those lists, because it is not a crawler at all — it is a control token that Google\'s own crawls consult to decide whether content may be used for Gemini training and for Gemini grounding.',
          'That distinction decides your policy. Many publishers now want training crawlers blocked while allowing the answer-engine fetchers that send real readers to the site, because those fetchers are the traffic. Our **AI Crawler Blocker** tool generates a robots.txt with per-bot presets for exactly this split — block training, allow search and answer engines — and our **robots.txt generator** covers the classic search-bot side.',
        ],
      },
      {
        anchor: 'bot-decision-table',
        h: 'The bot decision table',
        p: [
          'Every crawler below is listed because the robots.txt generator emits a block for it, and the table is built from that same array — so the guide and the tool cannot drift apart. The last column is a starting point, not a rule: **Your call** means the choice changes nothing about ranking, it only decides whether that company may use your content, while **Allow** means blocking costs you a place in that engine’s answers.',
          'The split that matters is training versus answering. A training crawler takes content away and returns nothing measurable; an answer-engine fetcher brings a reader who asked a question. Most publishers land on blocking the first group and allowing the second, but the decision is editorial and licensing, not technical — write it down next to the file so the next person keeps it.',
        ],
        table: botTable(),
        p2: [
          'Three things the table cannot tell you. First, robots.txt is voluntary: the crawlers here honour it, and scrapers that do not are a CDN or WAF problem, not a file problem. Second, `Google-Extended` is a control token rather than a crawler — blocking it switches Gemini training and Gemini grounding off together, while Googlebot and Search are untouched. Third, blocking an assistant bot removes you from that engine’s answers, which is lost referral traffic rather than a ranking penalty.',
        ],
      },
      {
        h: 'Templates: allow everything, block the training bots, block everything',
        p: [
          '**Allow everything** is the default and is right for most sites: a single `User-agent: * / Allow: /` group plus a sitemap line. If you have nothing to hide and you want AI citations and traffic, blocking training crawlers costs you nothing you can measure.',
          '**Block the training bots, keep the readers** is the pattern most content sites now use. Group the training crawlers together and disallow them, then allow the general group. One token does not fit that split: `Google-Extended` is not a crawler but a control token that switches Gemini training and Gemini grounding off together, so blocking it also gives up being cited in Gemini Apps. Googlebot is unaffected either way, so it is a deliberate trade rather than a search penalty.',
          '**Block everything** is for staging environments, internal tools and anything with a paywall. It stops crawlers entirely — and therefore stops search engines from seeing the noindex tag if that is what you were relying on.',
        ],
      },
      {
        h: 'Five mistakes that quietly break a robots.txt',
        p: [
          '**Blocking your own sitemap while allowing everything else** is the classic. If `Disallow: /` covers the sitemap URL, search engines may never discover your pages. Keep the sitemap crawlable.',
          '**Disallowing a path that is actually a prefix.** `Disallow: /blog` also blocks `/blogger-notes` — path rules are prefix matches, not exact paths. Use `$` for an exact match: `Disallow: /admin$`.',
          '**Using `noindex` inside robots.txt.** Google has never supported that directive; it is ignored silently. Use a real `noindex` meta tag or `X-Robots-Tag` header instead.',
          '**Blocking CSS and JavaScript.** Search engines need to render the page; blocking your assets can leave them with an empty shell. Keep `/css/` and `/js/` crawlable.',
          '**Serving the file with the wrong status or content type.** A 404 or an HTML error page for `/robots.txt` is treated as "no restrictions" — and a robots.txt served as `text/html` may be ignored entirely.',
        ],
      },
      {
        h: 'How to verify yours is doing what you think',
        p: [
          'Test the file as a crawler would: fetch it directly and confirm the plain-text content type, then check the Search Console **Page Indexing → robots.txt** report, which shows the syntax errors Google actually found. In Search Console\'s URL Inspection tool, the live test tells you whether a URL is blocked by robots.txt before it even tries to fetch it.',
          'Make one change at a time and watch the crawl stats in Search Console rather than rankings — robots.txt effects show up in crawling within days, in rankings within weeks. If you are unsure which crawlers to allow, the fastest safe starting point is the allow-everything file, plus a sitemap line pointing at your own XML sitemap.',
        ],
      },
    ],
    faqs: [
      { q: 'Does robots.txt stop a page from appearing in Google?', a: 'No. robots.txt controls crawling, not indexing. A page that is blocked from crawling can still be indexed from external links. To remove a page from results, use a noindex directive and make sure the page stays crawlable so the crawler can read it.' },
      { q: 'Should I block GPTBot and other AI training crawlers?', a: 'Block training crawlers if you do not want your pages used to train models. Keep the answer-engine fetchers, such as PerplexityBot and ChatGPT-User, if citations and referral traffic matter to you. Those are two separate rules, and most sites end up with one of each.' },
      { q: 'Does blocking Google-Extended hurt my Google rankings?', a: 'No. Google-Extended is Google\'s separate opt-out for Gemini training and Vertex AI grounding. It is not Googlebot, and blocking it does not affect your search rankings or indexing in Google.' },
      { q: 'Where should the robots.txt file live?', a: 'At the root of the domain, with the exact path https://yourdomain.com/robots.txt. Sub-domain or sub-folder locations are not read by crawlers.' },
      { q: 'How long does it take for a robots.txt change to take effect?', a: 'Crawlers re-read the file on their next visit, often within days, but there is no guaranteed deadline. Google caches it for roughly 24 hours, and other crawlers may take longer. Search Console\'s robots.txt report shows when Google last read your file.' },
    ],
    relatedTools: ['robots-txt-generator', 'ai-crawler-blocker', 'llms-txt-generator', 'sitemap-generator'],
    links: [
      { label: 'Google: robots.txt intro', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
      { label: 'Google: robots meta tag specifications', url: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag' },
      { label: 'Google: remove a page from the index', url: 'https://developers.google.com/search/docs/crawling-indexing/block-indexing' },
    ],
  },
  {
    slug: 'website-launch-seo-checklist',
    title: 'The website launch SEO checklist, in the order it matters',
    focus: 'website launch seo checklist',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'Website Launch SEO Checklist — 24 Steps Before You Publish',
    metaDesc: 'A website launch SEO checklist: indexability, titles, descriptions, sitemaps, robots.txt, canonicals, schema and mobile checks, in order.',
    intro: 'Launching a site is easy; launching one that search engines can find, understand and rank is a checklist. This website launch SEO checklist is the order we work through: make it crawlable, give every page a distinct title and description, then check it works on a phone.',
    sections: [
      {
        h: 'The website launch SEO checklist, step by step',
        p: [
          'Work through it in this order. The steps below are the ones that quietly decide whether a launch succeeds: indexability first, then what each page says about itself, then how search engines are told to explore the site, then the small technical details, and finally a real check on a phone. Skipping to step two on a site that is still blocked in robots.txt is the classic mistake — the rest cannot work until the crawler can reach the pages.'],
      },
      {
        h: '1. Make the site indexable (day one, before anything else)',
        p: [
          'Start with a `robots.txt` that allows crawling and points at your sitemap. If a staging rule is still in place, the launch will be invisible. Confirm the file is served as plain text at `https://yourdomain.com/robots.txt` and that the sitemap line inside it matches your real sitemap URL.',
          'Next, decide the canonical host. Serve the site at one hostname — `example.com` or `www.example.com` — and redirect the other to it with a 301. Search engines treat the two versions as different sites otherwise, and the split splits your links and your ranking signals.',
          'Finally, put the site in Google Search Console and Bing Webmaster Tools, verify the domain property with a DNS TXT record, and submit the XML sitemap. Verification is a DNS record, which is why it survives a hosting move.',
        ],
      },
      {
        h: '2. Every page needs its own title, description and H1',
        p: [
          'One title per page, written for the query that page answers — not the site name, and not the same template with the product name swapped. Google rewrites roughly a third of title tags anyway, which is usually because the page answers several questions at once. Keep the primary phrase near the front and let the brand sit at the end.',
          'Write a description per page: a plain sentence about what the visitor gets. There is no character count that Google enforces, so aim for clarity rather than a target length, and expect the snippet to be rewritten for some queries.',
          'Your H1 should say what the page is, in the words a person would use. The **Meta Tag Generator** produces a valid title, description, robots directive and canonical for any page in one block, and the **SERP preview tool** shows you how the pair will sit in a result.',
        ],
      },
      {
        h: '3. Give search engines a map (sitemap and internal links)',
        p: [
          'Generate an XML sitemap listing every page you want indexed, with real URLs and no tracking parameters, and submit it in Search Console. Keep it in sync — a sitemap full of 404s is worse than none, because it spends crawl budget on errors.',
          'Internal links matter as much as the sitemap. Every tool page links to related tools, its category and the policy pages, and every guide links into the tool it discusses. A page with no internal links is a page you are asking search engines to find on their own.',
        ],
      },
      {
        h: '4. Structured data, social cards and the small things',
        p: [
          'Add JSON-LD schema for the things your page actually shows: breadcrumbs, FAQ blocks, an organisation block, and product or article markup where it applies. Schema is a claim, not a ranking factor — but it is how you earn rich results.',
          'Set Open Graph and Twitter card tags so shared links render as a card instead of a bare URL. The **Open Graph generator** and **Twitter card generator** produce both.',
          'Then the basics: a `favicon`, a 404 page that returns a real 404 status, an XML sitemap referenced from `robots.txt`, a `lang` attribute, and a site that works with JavaScript disabled for the content itself.',
        ],
      },
      {
        h: '5. Check it on a phone, then check it again after launch',
        p: [
          'Search is mobile-first: the version Google indexes is the one it renders on a phone. Check the menu, the forms, the buttons and the code blocks at 390 pixels wide, and make sure nothing needs horizontal scrolling.',
          'After launch, watch Search Console for a week: coverage errors, mobile usability, and which queries bring impressions. The first fortnight is when you catch the redirect that broke a page, the duplicate title nobody noticed, and the orphaned tool that nothing links to.',
        ],
      },
    ],
    faqs: [
      { q: 'How long does it take for a new site to rank?', a: 'There is no fixed timeline. Technical fixes are picked up in days to weeks, while meaningful traffic takes months of content and links. Small, focused sites can rank within weeks for long-tail queries; competitive head terms take far longer. Treat the website launch SEO checklist as day-one work.' },
      { q: 'Do I need a sitemap if my site is small?', a: 'A sitemap helps crawlers find every page, especially on a new site with few internal links. It is cheap to generate and it lets you submit URLs directly, so yes — keep one. It is item four of this website launch SEO checklist for a reason.' },
      { q: 'Should my staging site be indexed?', a: 'No. Password-protect it or use a robots.txt disallow on the staging hostname, and make sure the disallow is not carried over to the live domain — that mistake can de-index a launch.' },
      { q: 'What is the most common launch mistake?', a: 'Copying the staging robots.txt or canonical settings to the live domain, which leaves the site blocked or pointing canonicals at the wrong host. Check both files again on launch day.' },
      { q: 'Do I need Schema markup to rank?', a: 'Schema is not a direct ranking factor, but it makes your pages eligible for rich results and it tells search engines what the page is about. Add it where it is accurate — incorrect markup can hurt.' },
    ],
    relatedTools: ['meta-tag-generator', 'robots-txt-generator', 'sitemap-generator', 'serp-preview-tool', 'schema-markup-generator'],
    relatedGuides: ['core-web-vitals', 'image-seo', 'title-tag-length-2026', 'open-graph-image-size-2026', 'htaccess-301-redirect', 'hreflang-basics', 'xml-sitemap-best-practices', 'test-structured-data'],
    links: [
      { label: 'Google: Search Console starter guide', url: 'https://developers.google.com/search/docs/monitor-debug/search-console-start' },
      { label: 'Google: sitemap build guide', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap' },
      { label: 'Google: JavaScript SEO basics', url: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics' },
    ],
  },
  {
    slug: 'how-to-block-gptbot',
    title: 'How to block GPTBot (and what it actually costs you)',
    focus: 'how to block gptbot',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'GPTBot robots.txt: How to Block or Allow GPTBot (2026)',
    metaDesc: 'Block GPTBot in robots.txt with 4 lines. Learn which OpenAI crawlers still get through, what blocking costs your ChatGPT visibility, and the 3-bot decision.',
    intro: 'Blocking GPTBot takes four lines in a robots.txt file. The decision around it takes a little longer, because OpenAI runs three crawlers and blocking the training one does not do what most people assume. Here is the exact block, the bots around it, and the honest trade-off.',
    sections: [
      {
        h: 'What GPTBot is (and what it is not)',
        p: [
          'GPTBot is OpenAI\'s **training crawler**. It fetches public web pages in bulk so the fetched text can be used to train future models. It identifies itself with the user-agent token `GPTBot`, has respected robots.txt since it launched in August 2023, and publishes its ranges so you can verify traffic in your server logs.',
          'It is not the bot that powers ChatGPT answers. When ChatGPT searches the web it uses **OAI-SearchBot** (to build the search index behind ChatGPT search) and **ChatGPT-User** (to fetch a specific page at the moment a user asks for it). Those are separate user-agents with separate purposes — which is exactly why a blanket "block all OpenAI bots" rule usually hurts more than it helps.',
          'You can confirm the picture at the network level too: OpenAI publishes its crawler ranges, so a filter on your access log — user-agent contains GPTBot — shows how often it visits today. Note the pattern before changing anything. If GPTBot never appears in your logs, either your CDN is already challenging it or your site is small enough that it has not been swept yet, and a robots.txt block on a site that was never being crawled changes nothing you can observe.',
        ],
      },
      {
        h: 'GPTBot robots.txt: how to block it',
        p: [
          'Add one group to the robots.txt file at the root of your domain:',
        ],
        pre: 'User-agent: GPTBot\nDisallow: /',
        p2: [
          'That is the whole block. To allow GPTBot but keep parts of the site out of training data, disallow only those paths, for example `Disallow: /internal/`. Rules are prefix matches: `Disallow: /blog` also blocks `/blogroll`, so be as specific as your structure allows.',
          'The file must be served at `https://yourdomain.com/robots.txt` as plain text with a 200 status. A 403 or an HTML error page is read by most crawlers as "no restrictions", which is the opposite of what you wanted.',
        ],
      },
      {
        h: 'What blocking GPTBot does — and does not — do',
        p: [
          'Blocking GPTBot stops OpenAI\'s training fetches of your site. It does **not** remove your pages from ChatGPT. Answers in ChatGPT search are assembled from a search index and live page fetches, so a page that is allowed to OAI-SearchBot and ChatGPT-User can still be found, quoted and cited even with GPTBot fully blocked.',
          'It also has no effect on Google. Googlebot does not care about your GPTBot rules, and Google\'s rankings are unaffected by which AI company\'s bots you allow or block.',
          'There is also a middle path most sites never consider: block nothing, but keep the content that trains models deliberately chosen. Public documentation, pricing pages and marketing copy are what teach a model what your product is; unpublished drafts and internal material should never be public in the first place. The sites that regret AI crawling are almost always sites that published something they should not have — and the fix for that is deletion, not a robots.txt rule.',
          'Two details catch people out when they write the rule by hand. A group applies only to the bot it names, so GPTBot stays blocked while OAI-SearchBot and ChatGPT-User keep working — that separation is the point of the split. And a User-agent: * group further down the file does not override a named group, so a leftover wildcard Disallow cannot undo the allow rules you set for the search bots.',
        ],
      },
      {
        h: 'The two bots around it: OAI-SearchBot and ChatGPT-User',
        p: [
          'If your goal is "no training, keep the readers", block GPTBot and explicitly allow the two search-side bots. If your goal is total invisibility to OpenAI, block all three — knowing that this also removes you from ChatGPT search and its citations.',
          'Our **AI Crawler Blocker** generates exactly this split: per-bot presets that block training crawlers while leaving search and answer-engine bots allowed, plus the matching allow rules so nothing is blocked by accident.',
          'The full list — every crawler the generator knows, its owner, what it does and a starting point for each — is in the [bot decision table](/blog/robots-txt-for-search-and-ai-crawlers/#bot-decision-table) inside our robots.txt guide. It is generated from the same list the generator uses, so a bot that appears in one appears in the other.',
        ],
      },
      {
        h: 'How to verify the block actually works',
        p: [
          'First, fetch your own `https://yourdomain.com/robots.txt` in a browser and confirm the `User-agent: GPTBot` group is there, as plain text. Second, if you have server-log access, search recent requests for `GPTBot` in the user-agent column — visits should stop within days, as OpenAI re-reads robots.txt on a regular cache cycle (commonly around 24 hours).',
          'Search Console\'s robots.txt report covers Googlebot rules only, so for GPTBot the log check is the source of truth. Our **Web Crawler Audit** reports the robots.txt lines a crawler sees and flags accidental blocks on your sitemap or assets — worth running after any robots.txt change.',
        ],
      },
    ],
    faqs: [
      { q: 'Does blocking GPTBot affect my Google rankings?', a: 'No. GPTBot is an OpenAI crawler with its own robots.txt rules. Googlebot reads only the rules that apply to it, so a GPTBot block has no effect on Google indexing or rankings.' },
      { q: 'Will blocking GPTBot remove my site from ChatGPT?', a: 'Not by itself. ChatGPT search uses OAI-SearchBot and ChatGPT-User, not GPTBot. To be fully invisible to OpenAI you would block all three — and that also removes you from ChatGPT search citations.' },
      { q: 'Can I block training but still appear in AI answers?', a: 'Yes. Block GPTBot (and other training bots such as ClaudeBot or Google-Extended) while allowing OAI-SearchBot, ChatGPT-User and PerplexityBot. Each bot is controlled by its own robots.txt group, so the split is a two-minute edit.' },
      { q: 'How fast does a GPTBot block take effect?', a: 'OpenAI re-crawls robots.txt on its own schedule and caches it for roughly 24 hours, so fetches typically taper off within a few days. There is no instant kill switch, which is why the file should be correct before launch, not after.' },
      { q: 'Do big sites block GPTBot?', a: 'A substantial share of major publishers block it, and surveys through 2025–2026 put GPTBot blocking well into double digits among top sites. Whether that is right for you depends on whether you sell content, rely on AI-answer traffic, or both.' },
    ],
    relatedTools: ['ai-crawler-blocker', 'robots-txt-generator', 'web-crawler-audit'],
    links: [
      { label: 'OpenAI: official crawler documentation (GPTBot, OAI-SearchBot, ChatGPT-User)', url: 'https://developers.openai.com/api/docs/bots' },
      { label: 'Google: how robots.txt works', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
    ],
  },
  {
    slug: 'llms-txt-guide',
    title: 'llms.txt: what it is, who reads it, and whether you need one',
    focus: 'llms.txt',
    date: '2026-10-21',
    updated: '2026-10-24',
    author: 'Glixtron',
    metaTitle: 'llms.txt Explained: Who Reads It, Who Ignores It',
    metaDesc: 'What llms.txt is, which AI tools fetch it, why Google ignores it, and an honest test for deciding whether your site needs one at all.',
    intro: 'llms.txt is a proposed markdown file at the root of your domain that curates what an AI model should read first. It is also one of the most over-sold files in SEO right now, so this guide separates what the file is, who actually fetches it, and when one is worth publishing.',
    sections: [
      {
        h: 'What llms.txt is',
        p: [
          'The llms.txt proposal (published August 2024 by Jeremy Howard) defines a simple markdown file at `/llms.txt`. It starts with an H1 and a short blockquote summary of the site, then lists links to the documentation that matters — each with a one-line note. Think of it as a table of contents written for a machine that will only read a few pages.',
          'It is deliberately not a new protocol. There is no crawler that is required to read it, no ranking attached to it, and no verification step. It is a voluntary convention, closer to an ABOUT page for agents than to robots.txt.',
          'The proposal caught on because the problem it names is real: a model pointed at a 200-page documentation site drowns and picks the wrong pages, while a curated map fixes the retrieval problem — for the tools that cooperate with it. That caveat is the whole story of llms.txt: a good idea whose adoption, so far, has not followed the idea.',
        ],
      },
      {
        h: 'Who actually fetches llms.txt (and who does not)',
        p: [
          'The honest answer: very few systems, and no major search engine. Google has said plainly that it does not use llms.txt — first confirmed by Google representatives in 2025 and restated in Google\'s AI guidance since. Google\'s AI Overviews and AI Mode run on normal indexing; they do not read the file.',
          'Crawl studies through 2026 keep finding the same thing: even among sites that publish an llms.txt, AI search crawlers almost never request it. Adoption across the web sits around ten percent of sites, and the file being present does not correlate with better visibility in AI answers. Some agent frameworks and developer tools do read it by choice — that is the real, narrow use case.',
          'One confusion worth killing early: an llms.txt check appearing in an automated audit tool does **not** mean the file has SEO value. It is a linting signal, nothing more.',
        ],
      },
      {
        h: 'What changed in llms.txt v2 (August 2026)',
        p: [
          'A v2 revision of the spec shipped in August 2026, tightening the format: clearer section rules, optional machine-readable metadata, and guidance for splitting a long file into linked sub-pages. The core idea is unchanged — a curated, markdown-formatted map of your best documentation.',
          'If you publish one, follow v2: keep the H1 + blockquote header, group links under clear H2 sections, and prefer many small accurate files over one giant stale one.',
        ],
      },
      {
        h: 'Should you publish an llms.txt?',
        p: [
          'Use this test: **does your site have documentation-like content that an agent would need to answer questions about you?** Product docs, API references, pricing facts, policy pages. If yes, a maintained llms.txt helps the tools that choose to read it and costs you one small file. If your site is a blog or a tool collection, the file adds little — your ordinary, well-structured pages are already the source.',
          'What an llms.txt will not do: improve Google rankings, guarantee ChatGPT citations, or substitute for crawlable content and schema. Anyone selling that outcome is selling the file, not the result.',
          'One more angle: maintenance. Every file you publish is a promise that someone keeps it. An llms.txt that still lists a product you discontinued tells the few tools that read it exactly the wrong thing — and unlike a sitemap, nothing automatically validates it. If nobody on your team will own the file quarterly, treat that as your answer.',
          'A quick three-question flow narrows it further. Is your site content-rich — more than about ten substantive pages worth curating? Do you actively want agent traffic, rather than having blocked AI crawlers entirely? And can you keep the file current when pages move? Two yes answers and a maintained file is a cheap, harmless bet; any no and the file is either pointless or a liability. Publishing llms.txt has positive expected value only in the narrow sense that the cost is two minutes — the upside, for most sites, is genuinely small.',
        ],
      },
      {
        h: 'How to write one that is actually useful',
        p: [
          'Keep it under a page. Link only real, public, current URLs. Write one-line notes that say what each linked page answers, because that note is what a model reads when deciding whether to fetch the link. Update it when pages move — a stale llms.txt is worse than none, because it actively misleads the few readers it has.',
          'The whole format fits in a few lines: an H1 with the site name, an optional blockquote summary, then H2 sections of link lists. That is the entire spec — no YAML, no JSON, no schema:',
        ],
        pre: '# Your Site Name\n\n> One sentence on what the site is and who it is for.\n\n## Core pages\n\n- [Page title](https://example.com/page): One line on what the page answers.\n- [Page title](https://example.com/page): One line on what the page answers.\n\n## Optional\n\n- [About](https://example.com/about)\n- [Contact](https://example.com/contact)',
        p2: [
          'Three mistakes account for most bad files. Stuffing: a five hundred-link llms.txt is just a badly formatted sitemap, and curation is the entire point — ten to thirty pages that represent the best of the site is the right size. Broken links: every URL should be checked after every change, because a model that follows a dead link discounts the file. And the wrong location: it must sit at the domain root as `llms.txt`, not in a sub-folder and not renamed.',
          'Our **llms.txt generator** builds the structure from your page list and validates every URL format before you download the file. It also refuses to promise more than the file can deliver — same rule we follow in this guide.',
        ],
      },
    ],
    faqs: [
      { q: 'Does Google use llms.txt?', a: 'No. Google has confirmed repeatedly that no Google Search system uses llms.txt, and its AI features guidance says there is nothing special to do for AI beyond standard best practices. The file has no effect on Google rankings, positive or negative.' },
      { q: 'Will an llms.txt get me cited in ChatGPT or Perplexity?', a: 'There is no evidence it helps. Those systems find pages through their own crawlers and search indexes, not through llms.txt. Clear page structure, crawlability and genuine authority move that needle; the file does not.' },
      { q: 'Where does the llms.txt file go?', a: 'At the root of your domain, exactly at https://yourdomain.com/llms.txt, served as plain text (markdown) with a 200 status. Sub-folders and sub-domains are not read for this purpose.' },
      { q: 'What is the difference between robots.txt and llms.txt?', a: 'robots.txt tells crawlers what they may fetch, and mainstream crawlers respect it. llms.txt is a voluntary content guide that some AI tools may choose to read. One controls access, the other curates context — they solve different problems and neither replaces the other.' },
      { q: 'Can an llms.txt hurt my site?', a: 'Not in search rankings. The only real risks are wasted effort and a stale file that points agents at moved or deleted pages, which misrepresents your site to the tools that do read it.' },
      { q: 'What does a good llms.txt example look like?', a: 'An H1 site name, a one-sentence blockquote summary, then one or two H2 sections listing ten to thirty real pages with a one-line note each — the skeleton is in the writing section above. The generator builds exactly this shape from your page list.' },
    ],
    relatedTools: ['llms-txt-generator', 'robots-txt-generator', 'ai-crawler-blocker'],
    links: [
      { label: 'llms.txt proposal and specification', url: 'https://llmstxt.org/' },
      { label: 'Google: AI features and your website', url: 'https://developers.google.com/search/docs/appearance/ai-features' },
    ],
  },
  {
    slug: 'appear-in-chatgpt-search',
    title: 'How to appear in ChatGPT search results',
    focus: 'how to appear in chatgpt search results',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'How to Appear in ChatGPT Search Results (2026)',
    metaDesc: 'How to appear in ChatGPT search results: allow the right OpenAI bots, write quotable pages, and check your visibility today.',
    intro: 'ChatGPT search is now a referral channel that shows up in analytics as chatgpt.com, and like every search surface it rewards sites it can crawl, understand and quote. Here is how to appear in ChatGPT search results: let the right bots in, write pages worth citing, and stay findable.',
    sections: [
      {
        h: 'How to appear in ChatGPT search results: three gates',
        p: [
          'Gate one is **access**: the bots that build ChatGPT\'s search index must be able to fetch your pages. Gate two is **quotability**: the page has to contain an answer in a form a language model can lift out cleanly. Gate three is **corroboration**: ChatGPT leans on the wider web — search indexes, reviews, directories, discussions — to decide what is worth recommending.',
          'Miss any one gate and the other two cannot compensate. A perfectly written page behind a blocked robots.txt is invisible; a crawlable page with no quotable content never gets picked; an authoritative site with no presence outside its own domain rarely gets recommended.',
        ],
      },
      {
        h: 'Gate 1: let the right bots in',
        p: [
          'ChatGPT search is powered by two OpenAI user-agents: **OAI-SearchBot**, which crawls to build the search index, and **ChatGPT-User**, which fetches a specific page live when a user\'s request needs it. Your robots.txt must not block either. Perplexity equivalents are PerplexityBot and Perplexity-User.',
          'Blocking **GPTBot** — the separate training crawler — does not remove you from ChatGPT search. If your worry is training data, block GPTBot and keep the search bots allowed; that is the split our **AI Crawler Blocker** generates. Then run our **Web Crawler Audit** on your site to confirm the robots.txt rules and sitemap evidence a crawler actually sees.',
        ],
      },
      {
        h: 'Gate 2: write pages an answer engine can quote',
        p: [
          'Answer engines assemble responses by extracting passages. Pages that get quoted share habits: a direct answer in the first paragraph, question-shaped headings, exact numbers and dates, short definitional sentences, and clean structure without walls of meandering intro. A page that answers "what is X" in one crisp sentence near the top gets lifted far more often than one that buries the definition in paragraph five.',
          'Also make the content reachable without interaction: content that only appears after a click, a login, or heavy JavaScript may never be read. The same fundamentals Google describes for AI features — crawlable pages, helpful people-first content — are what these engines use too.',
          'Dates matter more than most writers expect. Answer engines are asked constantly about "current" or "best" options, and a page that states when its facts were last checked gives the model a reason to trust and cite it over an undated competitor. Put the year in the title only when the content genuinely changes with the year — and keep the on-page date honest when you update.',
        ],
      },
      {
        h: 'Gate 3: be findable where ChatGPT learns',
        p: [
          'ChatGPT\'s search layer draws on established search indexes and the open web, so classic visibility work pays twice: rank in Google, get listed in relevant directories, have your product discussed in the communities your audience reads. Brand mentions across independent sites are the corroboration that makes a recommendation safe for a model to make.',
          'This is slow work and nobody enjoys hearing it, but it is the part that compounds. A site that is cited around the web keeps earning AI mentions; a site that only optimizes its own pages plateaus fast.',
          'Measure it the same way you measure any channel: referrers first (chatgpt.com, perplexity.ai), then branded-search lift, then citations in a fixed weekly prompt set. Volume is still small for most sites — the point of starting now is that the compounders (crawl access, structure, mentions) all take months, and the sites that built them before the channel matured are the ones that inherit it.',
        ],
      },
      {
        h: 'Check your ChatGPT visibility today',
        p: [
          'Do a simple weekly audit: ask ChatGPT and Perplexity five questions your content should answer and note whether you are cited. Then check two technical facts — that your robots.txt allows the search bots above, and that your pages return real content to a plain fetch (our **Web Crawler Audit** shows both). Finally, look for `chatgpt.com` and `perplexity.ai` referrers in your analytics to see which pages already convert.',
          'Treat AI answers like a results page you cannot reorder directly: you improve the inputs — access, quotability, corroboration — and the citations follow over weeks, not days.',
        ],
      },
    ],
    faqs: [
      { q: 'Does blocking GPTBot remove me from ChatGPT search?', a: 'No. ChatGPT search uses OAI-SearchBot and ChatGPT-User. GPTBot is the training crawler. Many sites block GPTBot and remain fully citable in ChatGPT search.' },
      { q: 'How long does it take to appear in ChatGPT search results?', a: 'There is no fixed timeline. Crawl access is fixed in days; citations follow the same signals as search authority — content quality, corroboration and links — so weeks to months is the realistic window for a new site.' },
      { q: 'Is there a way to submit my site to ChatGPT directly?', a: 'Not like a sitemap submission. The levers are being crawlable to OAI-SearchBot, being indexed in the search layers ChatGPT draws on, and being discussed on the open web. No submission tool exists for OpenAI\'s index.' },
      { q: 'Do I need llms.txt to appear in ChatGPT?', a: 'No. Major AI search systems do not rely on llms.txt. Crawl access, quotable content and standard SEO fundamentals are what matter; llms.txt is optional and unproven for visibility.' },
      { q: 'How do I know if ChatGPT already sends me traffic?', a: 'Filter your analytics referrer report for chatgpt.com and perplexity.ai. Those referrers appear when a user clicks a citation, giving you a direct measure of which pages AI answers already favor.' },
    ],
    relatedTools: ['ai-crawler-blocker', 'web-crawler-audit', 'seo-score-checker'],
    links: [
      { label: 'OpenAI: crawler documentation (OAI-SearchBot, ChatGPT-User, GPTBot)', url: 'https://developers.openai.com/api/docs/bots' },
      { label: 'Google: optimizing for AI features', url: 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide' },
    ],
  },
  {
    slug: 'check-ai-crawler-access',
    title: 'How to check if AI crawlers can access your site',
    focus: 'check if ai crawlers can access your site',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'How to Check if AI Crawlers Can Access Your Site',
    metaDesc: 'A step-by-step way to check if AI crawlers can access your site: read robots.txt like a bot, test per user-agent, and fix silent blocks.',
    intro: 'Most sites that are invisible to AI search never chose to be — a template robots.txt, a CDN bot-protection toggle, or an aggressive firewall rule did it for them. This is the step-by-step way to check if AI crawlers can access your site, bot by bot, in about ten minutes.',
    sections: [
      {
        h: 'How to check if AI crawlers can access your site',
        p: [
          'The check has three layers, and you need all three: **robots.txt** (the crawler\'s own rulebook), **network-level blocks** (CDN and firewall rules that answer before robots.txt is ever read), and **page response** (whether a plain fetch of the page returns real content). A page can pass robots.txt and still be blocked by a challenge page at the edge.',
          'Work through the layers in that order — it is the same order a crawler experiences them, so the first layer that fails is the one to fix.',
        ],
      },
      {
        h: 'Layer 1: read your robots.txt the way a bot does',
        p: [
          'Open `https://yourdomain.com/robots.txt` in a private browser window. Confirm three things: it returns **200**, it renders as **plain text** (not an HTML error page), and you can locate the group that would apply to each AI bot you care about — `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Bytespider`.',
          'Apply the matching rules the way a parser does: a bot uses the **most specific matching user-agent group**, or — if none names it — the `User-agent: *` group. If neither exists, the bot is allowed everything. Within a group, `Disallow: /` blocks the whole site, and an empty `Disallow:` means nothing is blocked.',
          'Save yourself the parsing mistakes: copy the file into a plain-text editor and read it top to bottom once. The rules that catch people out are almost always ordering and inheritance — a wildcard group at the bottom still applies to bots with no named group of their own, and a `Disallow: /` under a named bot is not undone by a later Allow in the wildcard group. Ten lines is a five-minute read; a hundred-line generated file deserves the same five minutes before you trust it.',
        ],
      },
      {
        h: 'Layer 2: CDN and WAF rules robots.txt cannot fix',
        p: [
          'Modern edge networks ship bot controls that block or challenge "suspected bots" at the network level — bot-fight modes, AI-bot blocking toggles, rate limits and managed challenges. These fire **regardless of your robots.txt**, and they are the single most common cause of "robots.txt looks fine but no AI crawler ever visits".',
          'Check your CDN or WAF event log for requests from the AI user-agents above: if they receive 403s, 429s or challenge pages, that is your block. Either disable the blanket bot rule for those specific user-agents or add explicit allow rules for the crawlers you want.',
        ],
      },
      {
        h: 'Layer 3: confirm the page answers with real content',
        p: [
          'Fetch one of your key pages with a plain HTTP client — no browser, no JavaScript. If the HTML that comes back contains your title, headings and body text, crawlers can read you. If the meaningful content is missing, it is injected by client-side JavaScript or trapped behind an interaction, and many fetchers will see an empty shell.',
          'Watch one silent failure here: soft blocks that return 200 with a challenge page inside. Some configurations serve an HTTP 200 whose body is a JavaScript puzzle or a login screen — robots.txt looks fine, the CDN log looks clean, and the crawler still gets nothing. The plain-fetch test catches this because you read the body, not the status code alone.',
          'Our **Web Crawler Audit** automates the important part of this: it fetches the page like a crawler, checks the robots.txt rules that apply to Googlebot, verifies sitemap evidence, and reports indexability signals — a fast way to catch layer-1 and layer-3 failures without touching a terminal.',
        ],
      },
      {
        h: 'Keep a per-bot decision table',
        p: [
          'Write your policy down as five columns — bot, owner, purpose, allowed?, where enforced (robots.txt / CDN / both). New AI crawlers ship every quarter; when one appears, you decide once, in the table, instead of guessing in a panic on a Friday.',
          'Our **AI Crawler Blocker** maintains this matrix for the crawlers that matter and generates the matching robots.txt from your choices, so the file and the policy can never drift apart.',
          'The table itself does not need to be built by hand: the [bot decision table](/blog/robots-txt-for-search-and-ai-crawlers/#bot-decision-table) lists the crawlers our generator emits, with the owner, the purpose and a starting decision for each. Copy it, change what you disagree with, and keep your version next to the robots.txt file.',
        ],
      },
    ],
    faqs: [
      { q: 'How do I check if AI crawlers can access your site?', a: 'Fetch /robots.txt as plain text, find each bot\'s user-agent group (GPTBot, ClaudeBot, PerplexityBot and so on) and apply its rules. Then fetch a real page without a browser and check your CDN logs, because network-level blocks refuse access even when robots.txt allows the bot.' },
      { q: 'Why does robots.txt look correct but AI crawlers still never visit?', a: 'Almost always an edge block: a CDN bot-protection toggle, an AI-bot blocking feature, a managed challenge or a rate limit returning 403/429 before your page is ever served. These ignore robots.txt entirely and must be fixed in the CDN or firewall settings.' },
      { q: 'Is blocking AI crawlers bad for SEO?', a: 'No. Your site\'s Google rankings depend on Googlebot access, not on GPTBot or ClaudeBot. Blocking AI crawlers only affects AI-side training and, if you block the search-side bots too, your visibility inside those AI answers.' },
      { q: 'Do AI crawlers respect robots.txt?', a: 'The major ones — GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended — document that they do. Respecting robots.txt is voluntary by design, so keep anything truly private behind authentication rather than relying on a Disallow line.' },
      { q: 'How often should I re-check crawler access?', a: 'After every robots.txt or CDN change, and quarterly otherwise. New AI crawlers appear regularly, and a routine CDN setting change can silently start challenging bots you meant to allow.' },
    ],
    relatedTools: ['web-crawler-audit', 'ai-crawler-blocker', 'robots-txt-generator'],
    links: [
      { label: 'Google: how robots.txt works', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
      { label: 'OpenAI: crawler documentation', url: 'https://developers.openai.com/api/docs/bots' },
    ],
  },
  {
    slug: 'noindex-vs-robots-txt',
    title: 'noindex vs robots.txt: which one to use, when',
    focus: 'noindex vs robots.txt',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'noindex vs robots.txt: Which to Use and When',
    metaDesc: 'noindex vs robots.txt explained: why a blocked page cannot be de-indexed, and which method fits each job on your site.',
    intro: 'noindex and robots.txt disallow are the two ways to keep pages out of Google — and using the wrong one is the most common indexing mistake we see. One says "don\'t show this in results", the other says "don\'t even fetch it". The difference is one sentence, and it decides everything.',
    sections: [
      {
        h: 'noindex vs robots.txt: the one-sentence difference',
        p: [
          '**robots.txt controls fetching.** `Disallow: /private/` asks crawlers not to request those URLs at all. **noindex controls showing.** A `noindex` meta tag (or `X-Robots-Tag` header) lets the crawler fetch the page and asks it not to include the URL in search results.',
          'Same goal, opposite mechanics — and the mechanics are why the two cannot be combined on the same URL.',
          'The asymmetry trips people because both files live in the same project and both talk about search. A useful mental model: robots.txt is a door sign on the building ("staff only beyond this point"); noindex is a note inside the room ("do not list this room in the directory"). A visitor who never opens the door never reads the note inside — and a directory that already listed the room keeps the listing until someone inside tells it otherwise.',
        ],
      },
      {
        h: 'Why you cannot use both on the same URL',
        p: [
          'A crawler that is blocked by robots.txt never downloads the page — so it never sees the noindex tag inside it. If the URL is already indexed, or if other sites link to it, Google can keep showing it, listed in Search Console as **"Indexed, though blocked by robots.txt"**. You blocked the messenger and kept the message.',
          'Worse, the block stops Google from seeing any future fix on that page. This is the trap behind half of all "why is my page still in Google" questions.',
        ],
      },
      {
        h: 'When robots.txt disallow is the right tool',
        p: [
          'Use disallow for URLs you want **never crawled**, not URLs you want hidden from results: internal search results, faceted filter combinations, calendar pages with infinite parameters, staging hosts, and crawl-budget heavy sections that add no indexable value.',
          'These pages are fine to appear nowhere because nobody searches for them — you are just saving crawl budget. That is exactly what disallow is for.',
          'One more legitimate use: hosting-level cost control. If a bot is hammering an expensive endpoint, disallow it in robots.txt first — respectful crawlers back off immediately, which buys time to add real rate limiting. Just record why the rule exists; mystery disallows inherited from a previous team are how sitemaps and checkouts end up blocked for years without anyone noticing.',
        ],
      },
      {
        h: 'When noindex is the right tool',
        p: [
          'Use noindex for pages that **are crawled and linked but should not rank**: thin tag archives, thank-you and confirmation pages, expired but still-linked content, internal-only pages behind no login. Keep them crawlable so Google can see the directive and drop the URL on its own.',
          'For non-HTML files — PDFs, spreadsheets, videos — use the `X-Robots-Tag: noindex` HTTP header instead of a meta tag. The header form supports the same directives as the meta tag (nofollow, none, unavailable_after), so it is not a reduced version — and it can be scoped per file type in most servers. Verify with `curl -I`: the header must appear on the actual response, not merely in the config. Our **Meta Tag Generator** emits a correct robots meta block for HTML pages.',
          'Audit noindexed pages occasionally, because thank-you pages and expired archives have a way of accumulating years past their usefulness. A page kept out of the index still burns a crawl every time Google rechecks it, so delete what you can rather than hiding what you forgot.',
        ],
      },
      {
        h: 'Removing a page that is already indexed',
        p: [
          'If the page is indexed and you want it out: remove the content or make it noindex, keep it crawlable, and let Google recrawl. Requesting indexing in Search Console speeds the recheck up. The Removals tool hides a URL fast, but only temporarily — it is a bandage while the directive does the real work.',
          'Only after the URL is gone from the index should you disallow it in robots.txt, if you still want to. Block first and you freeze the problem in place.',
        ],
      },
    ],
    faqs: [
      { q: 'Is noindex or robots.txt better for removing a page from Google?', a: 'noindex, with the page kept crawlable. robots.txt disallow prevents Google from seeing the noindex directive, so an already-indexed URL can stay listed. Use disallow only after the URL has been de-indexed, or for URLs that should never be crawled at all.' },
      { q: 'What does "Indexed, though blocked by robots.txt" mean?', a: 'It means Google is barred by your robots.txt from fetching the URL but still knows about it from links, and may show it in results. It is the signature of using disallow where noindex was intended.' },
      { q: 'Does robots.txt disallow hurt the rest of my site?', a: 'Only if the rules are broader than you meant — path rules are prefixes, so Disallow: /blog also blocks /blogroll. It can also accidentally block CSS, JavaScript or your sitemap, which harms rendering and discovery of the whole site.' },
      { q: 'Can I noindex a PDF or an image?', a: 'Yes, with an X-Robots-Tag: noindex HTTP response header. Meta tags only exist in HTML, so non-HTML resources must use the header form.' },
      { q: 'Do noindex pages waste crawl budget?', a: 'They use some, because Google must fetch the page to see the directive. That is the accepted cost: for pages that are linked and could be indexed, a crawl is required to keep them out of results.' },
    ],
    relatedTools: ['robots-txt-generator', 'web-crawler-audit', 'meta-tag-generator'],
    relatedGuides: ['htaccess-301-redirect', 'why-is-my-site-not-indexed', 'http-status-codes-seo'],
    links: [
      { label: 'Google: robots.txt introduction', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
      { label: 'Google: robots meta tag, data-nosnippet and X-Robots-Tag', url: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag' },
    ],
  },
  {
    slug: 'why-is-my-site-not-indexed',
    title: 'Why is my site not indexed? The real causes and fixes',
    focus: 'why is my site not indexed',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'Why Is My Site Not Indexed? Causes and Fixes',
    metaDesc: 'Why is my site not indexed? The crawl blocks, noindex tags, thin pages and canonical mistakes that keep URLs out of Google.',
    intro: '"Why is my site not indexed?" is the most common question in every SEO forum, and it almost always has a boring answer: one specific, findable signal told Google not to index, or nothing convinced it to bother. Here are the real causes in the order you should check them, and the fix for each.',
    sections: [
      {
        h: 'Why is my site not indexed? First, define the symptom',
        p: [
          '"Not indexed" covers three different states, and Search Console\'s **Page indexing report** separates them for you: *Discovered — not indexed* (Google knows the URL, has not fetched it), *Crawled — not indexed* (Google fetched it, chose not to include it), and *Blocked* (a robots.txt rule stopped the crawl). Each has a different fix, so read the report before touching anything.',
          'For a brand-new site, add a fourth state: Google simply has not got to you yet. Discovery of a fresh domain routinely takes days to weeks even when everything is right.',
        ],
      },
      {
        h: 'Causes that stop Google from crawling at all',
        p: [
          'Check these first because they nullify everything else: a `Disallow` in robots.txt that is broader than you meant; a leftover `noindex` meta tag from staging; pages with no internal links pointing to them and no sitemap listing; server errors or chronic slowness; a site whose core content only appears with JavaScript on.',
          'Fetch your own `robots.txt` in a browser, fetch your homepage with JavaScript off, and make sure your key URLs appear both in your sitemap and in at least one internal link. Our **Web Crawler Audit** runs most of these checks on any URL in one pass.',
          'New sites have one extra catch: zero backlinks means zero discovery paths outside your own sitemap. That is survivable — sitemaps work — but it makes the internal-linking structure carry all the weight. A homepage linking to a hub, a hub linking to every page, and each page linking back is the minimum graph that lets a crawler treat the site as one body of work rather than isolated files.',
        ],
      },
      {
        h: 'Causes that stop indexing after a crawl',
        p: [
          'If Google crawls but does not index, the page told it something: a `noindex` tag or `X-Robots-Tag` header; a canonical pointing at another URL; the page redirecting elsewhere; a near-duplicate of a stronger page; or content thin enough that Google declines to store it. A real 200 page that behaves like an empty or error page can even be filed as a soft 404.',
          'Duplicates are the sneaky one: if the same content lives at several URLs, Google indexes one of them — and it may not be the one you wanted. Canonical tags and consistent internal linking settle the question.',
        ],
      },
      {
        h: 'The fixes, in order of impact',
        p: [
          'One: remove blocks — robots.txt disallows and noindex tags on pages you actually want indexed. Two: give every important page at least one crawlable internal link from an indexed page. Three: publish an accurate XML sitemap (our **Sitemap Generator** builds one) and submit it once in Search Console. Four: strengthen thin pages with genuinely useful content instead of submitting them again. Five: use URL Inspection → Request indexing for a handful of key URLs after fixes — it nudges a recrawl, it does not force indexing.',
          'Then wait. Re-crawls of a small site typically happen within days, but index selection is Google\'s decision and re-submitting an unchanged sitemap changes nothing.',
          'Set the expectation with the report, not the calendar: check the Page indexing report weekly, note which state each important URL is in, and act on state changes rather than dates. "Discovered" means fix discovery (links, sitemap); "Crawled" means fix the page\'s value; "Blocked" means fix the rule. Chasing individual URLs by hand before the state is diagnosed is how a week turns into a month of nothing.',
        ],
      },
      {
        h: 'When not being indexed is correct',
        p: [
          'Some pages *should* be out of the index: search results pages, tag archives with no curation, cart and account pages, API responses, staging hosts. If the report shows those as excluded, your site is healthy — the exclusions are the system working.',
          'The goal is not "every URL indexed". It is "every URL that deserves traffic is indexed, and everything else is deliberately, cleanly excluded".',
        ],
      },
    ],
    faqs: [
      { q: 'How long does Google take to index a new site?', a: 'Anywhere from a few days to several weeks. A correct sitemap, a couple of internal links and a healthy robots.txt speed it up; requesting indexing on key URLs after those checks can nudge the first crawl. There is no guaranteed timeline for when a new site gets indexed.' },
      { q: 'Does submitting a sitemap guarantee indexing?', a: 'No. A sitemap is a discovery hint. Google still decides whether to crawl and index each URL, and repeatedly resubmitting an unchanged sitemap has no effect.' },
      { q: 'Why does Search Console say "Crawled — currently not indexed"?', a: 'Google fetched the page and chose not to include it — usually thin or duplicate value, a noindex directive, a canonical elsewhere, or a soft-404-like experience. Improve the page\'s distinct value and its internal links; the status updates after the next crawl.' },
      { q: 'What does "Discovered — currently not indexed" mean?', a: 'Google knows the URL exists but has not fetched it yet. Nothing is broken; the queue is waiting on crawl budget or on a reason to spend it. Internal links from pages that already rank, plus a sitemap entry, move it along faster than resubmitting the URL repeatedly.' },
      { q: 'Can robots.txt stop my site from being indexed?', a: 'Yes — a broad Disallow blocks crawling, and for a new site that means no content is ever seen. For pages already indexed, blocking robots.txt can leave them listed anyway, which is why noindex (kept crawlable) is the right tool for de-indexing.' },
      { q: 'Will more content or more backlinks get my pages indexed?', a: 'Links and genuine authority help discovery and selection, and unique content gives Google a reason to index. But fix technical blocks first — links to an uncrawlable page accomplish nothing.' },
    ],
    relatedTools: ['web-crawler-audit', 'sitemap-generator', 'robots-txt-generator', 'seo-score-checker'],
    relatedGuides: ['internal-linking', 'htaccess-301-redirect', 'rel-canonical-tag', 'xml-sitemap-best-practices', 'http-status-codes-seo'],
    links: [
      { label: 'Google: ask Google to recrawl your URLs', url: 'https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl' },
      { label: 'Google: build and submit a sitemap', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap' },
      { label: 'Google: SEO starter guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
    ],
  },
  {
    slug: 'utm-naming-conventions',
    title: 'UTM naming conventions that keep GA4 reports clean',
    focus: 'utm naming conventions',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'UTM Naming Conventions for Clean GA4 Reports',
    metaDesc: 'utm naming conventions that keep GA4 clean: lowercase rules, a source/medium vocabulary and the mistakes that create "(direct)" traffic.',
    intro: 'Broken UTM naming conventions do not fail loudly — they fail quietly, by splitting one campaign into five rows in GA4 and sending real traffic to "(direct)". A small set of rules, applied every time, prevents almost all of it. Here are the conventions, the vocabulary, and the template.',
    sections: [
      {
        h: 'Why utm naming conventions matter more than the tags themselves',
        p: [
          'GA4 treats UTM values as case-sensitive exact strings. `Newsletter`, `newsletter` and `News-Letter` are three different campaigns, and every report that touches them fragments accordingly. The tag is trivial; the convention is the work.',
          'The failure mode is always the same: someone adds a link in a hurry, the value lands slightly differently, and six months of channel reporting has a crack in it that can no longer be repaired retroactively — GA4 does not re-write history.',
        ],
      },
      {
        h: 'The five fields and a working vocabulary',
        p: [
          '`utm_source` **where** the link lives: `newsletter`, `linkedin`, `youtube`, `partner-name`. One word, the platform, not the campaign. `utm_medium` **what kind** of channel: `email`, `social`, `cpc`, `referral`, `affiliate`. `utm_campaign` the **name** you and your team call it: `spring-launch-2026`. `utm_content` the **variant** — banner, footer, story-3 — for A/B comparisons. `utm_term` the **keyword**, used almost only for paid search.',
          'Keep source and medium boring and standardized — they drive GA4\'s channel grouping. Put the creativity in campaign and content, where it fragments nothing.',
          'A worked example holds it together better than a definition table. A link in the October newsletter, button variant B, promoting the spring launch: `utm_source=newsletter`, `utm_medium=email`, `utm_campaign=spring-launch-2026`, `utm_content=button-b`. The same link on LinkedIn becomes `utm_source=linkedin`, `utm_medium=social` — only source and medium change, and campaign and content stay identical, so both placements roll up under one campaign row.',
        ],
      },
      {
        h: 'Seven utm naming conventions that prevent 90% of the mess',
        p: [
          'One: **lowercase everything**, always. Two: **no spaces** — use hyphens, never `%20`. Three: no ampersands, apostrophes or commas; they break URLs or render badly in exports. Four: keep values under about 40 characters so tables stay readable. Five: one shared naming sheet that everyone copies from — no memory-typed values. Six: never tag internal links between your own pages; that overwrites the real referrer and poisons session source. Seven: decide the paid-brand convention once (`google` / `cpc` / `brand-spring-2026`) and never deviate.',
          'Write the seven rules into the same document as your campaign calendar, and link it every time someone asks "how do I tag this?"',
          'The naming sheet deserves one more property: it ships with copy-paste examples. The most common convention failure is not disagreement, it is improvisation under time pressure — and a sheet with a filled example for each of email, social, paid search and partner links removes the improvisation. Keep the sheet next to the campaign calendar, link it from every launch checklist, and version it like any other document.',
        ],
      },
      {
        h: 'How GA4 turns source and medium into channels',
        p: [
          'GA4 assigns channel groups from source/medium pairs: `google / cpc` is Paid Search, `facebook / social` (with correct setup) Paid Social, `newsletter / email` Email, and anything GA4 cannot classify falls into **Direct** or **Unassigned**. Every typo in source or medium moves real traffic into the wrong bucket — which is why "(direct) / (none)" spikes are almost always a tagging problem, not a browser problem.',
          'If a channel report looks wrong, export the source/medium table and look for near-duplicates: same word, different case or punctuation. That list is your cleanup backlog for future links.',
        ],
      },
      {
        h: 'Build links with a tool, not by hand',
        p: [
          'Hand-built query strings are where conventions die — a typo\'s chance on every keystroke. Our **UTM Link Builder** enforces lowercase on GA4\'s case-sensitive fields, validates the destination URL, warns on missing parameters and gives you the finished link ready to share, so the convention is applied by the tool instead of by memory.',
          'One habit closes the loop: test every finished link in a private browser window before it ships, and watch the landing page\'s real-time analytics light up with the expected source and medium. Thirty seconds per link catches the redirect that strips parameters — the single most common way a correctly tagged link still reports as direct traffic.',
          'Pair the habit with a quarterly audit: list every source and medium in GA4, diff it against your naming sheet, and delete or merge stray values going forward.',
        ],
      },
    ],
    faqs: [
      { q: 'Are UTM parameters case-sensitive in GA4?', a: 'Yes. GA4 treats values as exact, case-sensitive strings, so Newsletter and newsletter become separate campaign values. Of all the utm naming conventions, lowercasing every value is the single highest-value habit.' },
      { q: 'What is the difference between utm_source and utm_medium?', a: 'utm_source is the platform the link lives on (newsletter, linkedin, youtube); utm_medium is the marketing channel type (email, social, cpc, referral). Source answers "where", medium answers "what kind".' },
      { q: 'Why is my tagged traffic showing as "(direct)" in GA4?', a: 'The most common causes are a broken or missing utm_source, parameters stripped by a redirect between the click and the final page, or links pasted into apps that drop query strings. Tag the final destination URL and test one link end-to-end.' },
      { q: 'Should I add UTM tags to internal site links?', a: 'No. Tagging internal links overwrites the session\'s original source and makes attribution worse. Good utm naming conventions cover external links only — the site\'s own navigation needs no tagging.' },
      { q: 'How long should UTM values be?', a: 'Keep each value short and readable — under about 40 characters. Long values do not break tracking, but they wreck report readability and invite inconsistent abbreviations.' },
    ],
    relatedTools: ['utm-link-builder', 'url-encoder-decoder', 'case-converter'],
    links: [
      { label: 'Google: collected traffic sources and channels (GA4)', url: 'https://support.google.com/analytics/answer/9756891' },
      { label: 'Google: URL building for campaigns', url: 'https://support.google.com/analytics/answer/10917952' },
    ],
  },
  {
    slug: 'schema-markup-for-ai-search',
    title: 'Schema markup for AI search: what actually helps',
    focus: 'schema markup for ai search',
    date: '2026-10-21',
    author: 'Glixtron',
    metaTitle: 'Schema Markup for AI Search: What Helps (and What Doesn\'t)',
    metaDesc: 'Schema markup for AI search: does it help you appear in ChatGPT and Google AI Overviews? Which schema types matter, which don\'t, and how to validate.',
    intro: 'Every week someone sells "AI search schema" as a magic visibility switch. The truth: schema markup for AI search genuinely helps machines understand your pages, Google says AI features need no special markup, and a short honest list of schema types earns almost all the real value.',
    sections: [
      {
        h: 'What schema markup for AI search can actually do',
        p: [
          'Structured data is a vocabulary — schema.org in JSON-LD — for stating what a page **is**: an article, a product with a price, an FAQ with answers, a step in a breadcrumb trail. It removes guesswork for any system that reads the page: search engines, and the retrieval pipelines behind answer engines.',
          'What it does not do is act as a ranking switch. Google\'s own guidance for AI features says there is nothing special to implement — no new markup, no new protocol — beyond letting pages be crawled and serving people-first content. Structured data supports understanding; it does not substitute for a page that genuinely answers the question.',
          'The distinction shows up concretely in retrieval. When a system assembles an answer, it must first choose candidate pages, then extract a passage from one. Structured data strengthens the first step — a Product with price and availability or an Article with dates is easier to shortlist correctly — while the extraction step runs on your prose. Optimizing only the markup optimizes half the pipeline.',
        ],
      },
      {
        h: 'What Google has said about AI features and markup',
        p: [
          'Two facts worth memorizing. First: Google states that AI Overviews and AI Mode draw on regular Search indexing — a page eligible to rank is a page eligible to be cited, with no extra schema required. Second: FAQ **rich results** (the visual accordion in search) have been limited since 2023 to authoritative government and health sites — but `FAQPage` markup remains a completely valid way to describe genuine on-page questions and answers.',
          'So when a tool promises "AI Overview schema" or "ChatGPT markup", translate: they are selling ordinary structured data with a new sticker. JSON-LD done correctly is the whole story.',
        ],
      },
      {
        h: 'The schema types worth adding, in order',
        p: [
          '**Organization** (site-wide): name, logo, same-as links to your profiles — this is how entities get disambiguated across the web. **BreadcrumbList** (every non-home page): describes your structure and earns breadcrumb display. **Article** and **BlogPosting** (content pages): headline, dates, author — timeliness signals that answers about "current" information depend on. **Product** with offers and reviews, where you genuinely sell something. **FAQPage** where the questions are really on the page — not keyword stuffing wearing a schema costume.',
          'Skip HowTo markup for rich-result purposes (Google deprecated its display) and skip marking up anything invisible to users — that risks a manual action, the opposite of visibility.',
        ],
      },
      {
        h: 'The GEO angle: quotable pages beat decorated pages',
        p: [
          'Generative engines quote passages, not schema nodes. The content practices that correlate with citations are unglamorous: a direct answer early, exact figures and dates, question-shaped headings, short self-contained paragraphs, tables for comparisons. Schema complements that by labeling the parts; it cannot rescue prose that has nothing extractable.',
          'Think of it as two layers: **layer one** is the answer written clearly for humans (which is what actually gets quoted); **layer two** is the JSON-LD that states what the page is (which helps systems file it correctly). Do layer one first, always.',
        ],
      },
      {
        h: 'Validate, and keep it truthful',
        p: [
          'Every page type above can be generated and validated in minutes: Google\'s Rich Results Test confirms eligibility per feature, and the schema.org validator checks syntax. Validate once when the markup ships and again after any template change — broken JSON-LD fails silently.',
          'Treat schema like code, not content: template-level changes propagate to every page at once, which is its power and its risk. One wrong property in a template ships to a thousand pages in the next deploy, and a validator run on a single sample page will not catch a template that broke for a subset of products. Spot-check one page per template after every structural change.',
          'Our **Schema Markup Generator** outputs clean JSON-LD for FAQ, Article, Product, Breadcrumb and more, escaped and copy-ready, and refuses markup that describes content that is not on the page — the same honesty rule this guide follows.',
        ],
      },
    ],
    faqs: [
      { q: 'Is there special schema markup for AI Overviews?', a: 'No. Google says AI Overviews use normal Search indexing and require no special implementation for AI features. Standard structured data helps systems understand the page, but there is no AI-Overviews-specific markup to add.' },
      { q: 'Does FAQPage schema still matter after the 2023 rich-result change?', a: 'Yes, with the right expectation. Google limited the FAQ rich-result display to government and health sites, but FAQPage markup remains a valid way to describe real on-page Q&A, and it helps machines parse your answers. It no longer earns the accordion for most sites.' },
      { q: 'Can schema markup get my site cited by ChatGPT?', a: 'Not directly. ChatGPT and similar engines quote readable passages from crawlable pages. Clean schema helps comprehension, but the cited content itself must directly answer the question in plain language.' },
      { q: 'What schema should a small business site add first?', a: 'Organization site-wide, BreadcrumbList on non-home pages, and Article or Product depending on what the pages are. Those three cover entity identity, structure and content type — the highest value per minute of work.' },
      { q: 'Is invalid schema harmful?', a: 'Invalid JSON-LD is simply ignored, so the direct risk is low — but markup that misrepresents the page (fake reviews, invisible FAQs) risks manual penalties and lost trust. Mark up only what is genuinely visible on the page.' },
    ],
    relatedTools: ['schema-markup-generator', 'seo-score-checker', 'web-crawler-audit'],
    relatedGuides: ['test-structured-data', 'website-launch-seo-checklist', 'internal-linking'],
    links: [
      { label: 'Google: structured data introduction', url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' },
      { label: 'Google: AI features and your website', url: 'https://developers.google.com/search/docs/appearance/ai-features' },
    ],
  },

  // ---------------------------------------------------------- Screaming Frog alternative (Day-2 content integration, 24 Oct)
  {
    slug: 'screaming-frog-alternative',
    title: 'Screaming Frog alternative: when a free browser audit is enough',
    focus: 'screaming frog alternative',
    date: '2026-10-24',
    updated: '2026-10-24',
    author: 'Glixtron',
    metaTitle: 'Screaming Frog Alternative Free — Browser-Based Audits',
    metaDesc: 'Free Screaming Frog alternative for single-URL audits — check any page in seconds in the browser. No install, no licence, honest limits included.',
    intro: 'Most SEO audits are not 10,000-URL enterprise crawls — they are a pre-launch check on one page. This guide compares Screaming Frog with a free Screaming Frog alternative that runs in the browser, and is honest about the jobs where the desktop crawler still wins.',
    sections: [
      {
        h: 'What Screaming Frog does well (and what it costs)',
        p: [
          'Screaming Frog SEO Spider is the desktop crawling standard, and it earns that position with four strengths. Bulk crawling: tens of thousands of URLs in one run, mapping internal links, redirect chains, canonical mismatches, broken links and metadata across an entire site. Custom extraction: pull any element out of every page with regex, XPath or CSS selectors — nothing browser-based matches that. Configuration depth: bot user-agent, crawl speed, depth limits, include and exclude patterns, all tunable. And scheduled batch crawls in the paid tier, for the recurring client dashboard world.',
          'The licence is roughly $209 a year per user after the first year, with a free tier capped at 500 URLs per crawl. For an agency of five SEOs that is over $1,000 a year plus the install and update overhead on every machine. That money is well spent if you crawl five-figure URL counts weekly. It is not well spent if most of your audits are one page, one launch, one client question at a time.',
        ],
      },
      {
        h: 'Where a free Screaming Frog alternative wins',
        p: [
          'For the single-URL and small-check jobs that make up most day-to-day audit work, a browser-based tool beats the desktop crawler on five counts. Speed: open a URL, paste the target, get the report in seconds — versus download, install, launch, configure, crawl. No install and no licence server: it runs on any machine with a browser, including the phone in your pocket when a client asks from across a meeting room. Shareability: the result travels with the URL instead of as an emailed CSV. Availability: nothing to update, nothing that expires. And cost: free, with no signup, which matters for the one-off checks that make up most of a small team\'s week.',
          'The claim is deliberately narrow: for 80% of audit jobs, the browser path is faster and cheap enough to be the default. The other 20% are real, and the next section names them.',
        ],
      },
      {
        h: 'The honest limits of browser-based audits',
        p: [
          'Browser-based tools do not replace a desktop crawler, and any alternative that claims otherwise is selling something. The limits are structural. No bulk crawls: this is a one-URL-at-a-time tool by design, so a 10,000-URL site audit still belongs in Screaming Frog or Sitebulb. No custom extraction: you get the standard SEO signals — title, headings, meta description, canonical, robots, hreflang, schema, Open Graph, status and redirect chain — not arbitrary regex across every element. No scheduled crawls: nothing runs on a cron, and there is no recurring client export.',
          'There is also an honesty constraint on the fetch itself: the audit reads the page as an anonymous visitor sees it. Content that appears only after login, behind a paywall or after heavy client-side rendering may not be visible to the fetcher, and a truthful report will say so rather than guess.',
        ],
      },
      {
        h: 'When to use which: a plain decision rule',
        p: [
          'Use the desktop crawler when the job is a whole-site technical audit, a scheduled re-crawl, custom extraction, or anything where the output feeds a recurring client report. Use a browser-based audit when the job is a single URL: a pre-publish check, a canonical or robots question, a quick competitor page teardown, a "why is this not indexed" first look. If the question starts with "this page" rather than "this site", start in the browser — and if the answer says the problem is site-wide, escalate to the crawler with that hypothesis in hand.',
          'A useful habit: run the browser audit first anyway, even on big jobs. Five seconds of status, canonical, robots and schema checks on a representative page often tells you whether the full crawl is worth scheduling at all.',
        ],
        pre: 'Pre-publish audit — 10 points, one URL:\n\n 1. Returns HTTP 200 (no accidental redirect chain)\n 2. Indexable — no noindex, no disallow in robots.txt\n 3. Canonical self-references (or points where intended)\n 4. Title tag present, unique, within length\n 5. Meta description present, within length\n 6. One clear H1, heading order intact\n 7. Open Graph + Twitter Card tags present\n 8. Structured data parses (Article / Breadcrumb / FAQ)\n 9. Internal links resolve (no 404s on the page)\n10. Loads acceptably on a phone',
      },
      {
        h: 'How the Web Crawler Audit works under the hood',
        p: [
          'This site\'s own audit — the Web Crawler Audit tool — fetches the URL you enter through a first-party proxy that strips cookies and blocks private-network targets, then reads what an anonymous visitor would see: the status code and any redirect chain, the canonical and robots directives, hreflang annotations, Open Graph and Twitter Card tags, the JSON-LD blocks, sitemap and llms.txt references, and the page\'s basic health signals. It returns a prioritised fix list and a crawl-health score rather than a data dump.',
          'It is one URL per run, and it says so. The point is not to out-crawl a desktop crawler; it is to answer the page-level question in seconds, from any device, for free — and to pair honestly with the SEO Score Checker, which grades the on-page content side of the same page.',
        ],
      },
      {
        h: 'What a free audit should cover before you publish',
        p: [
          'Whatever tool you use, the pre-publish check is the same list: indexability, canonical, title, description, headings, social tags, structured data, link integrity, mobile behaviour. The checklist above is the one this site runs on itself before every deploy — the same ten checks, executed against the built pages, and the reason a mistake here gets caught by a test rather than by a reader.',
          'Treat the audit as the first five minutes of publishing, not the last word on SEO. It catches the mechanical errors — the wrong robots directive, the missing canonical, the broken JSON-LD — that are invisible in a preview and expensive in production. The strategic half of the work (what the page says, and whether it deserves to rank) is a separate job, and no crawler does it for you.',
        ],
      },
    ],
    faqs: [
      { q: 'Is there a free alternative to Screaming Frog?', a: 'Yes — for single-URL work. The Web Crawler Audit tool audits any page in seconds in the browser, free and with no signup. For full-site crawls of thousands of URLs, the paid desktop crawlers remain the right tool.' },
      { q: 'What can browser-based SEO audits not do?', a: 'They do not bulk-crawl entire sites, run scheduled crawls, or support custom regex/XPath extraction. They answer page-level questions — status, canonical, robots, metadata, schema — one URL at a time.' },
      { q: 'How accurate is a browser-based audit compared to Screaming Frog?', a: 'For the signals both read — status, redirects, canonical, robots, metadata, structured data — accuracy is equivalent, because both fetch the public page. The difference is coverage: the crawler reads the whole site, the browser tool reads the page you asked about.' },
      { q: 'Can I crawl a whole site with the Web Crawler Audit?', a: 'No, and any tool claiming whole-site crawls from a browser tab should be treated carefully. Run it per URL; for site-wide work use a desktop crawler and treat this audit as the fast first look that tells you what to crawl.' },
      { q: 'Do I need to install anything to use a Screaming Frog alternative?', a: 'No. Browser-based audits run on any device with a browser — no download, no licence, no updates. That is the main practical advantage over desktop crawlers for small, frequent checks.' },
    ],
    relatedTools: ['web-crawler-audit', 'seo-score-checker', 'meta-tag-generator'],
    relatedGuides: ['internal-linking', 'core-web-vitals', 'hreflang-basics', 'test-structured-data'],
    links: [
      { label: 'Screaming Frog SEO Spider — official site', url: 'https://www.screamingfrog.co.uk/seo-spider/' },
      { label: 'Google: SEO starter guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
    ],
  },
  {
    slug: 'meta-description-length-2026',
    title: 'How long should a meta description be? What Google changes',
    focus: 'meta description length',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'Meta Description Length in 2026 — What Actually Fits',
    metaDesc: 'Meta description length in 2026: aim for 120–155 characters. Why the old 160 limit still circulates, what Google truncates on, and how to write one it keeps.',
    intro: 'Meta description length is usually quoted as 160 characters. Google does not count characters — it measures pixels, and the budget is smaller on a phone. Here is the range that survives both, why descriptions get rewritten anyway, and how to write one that is more likely to be kept.',
    sections: [
      {
        h: 'The short answer on meta description length',
        p: [
          'Write to 120–155 characters. That fits a Google desktop result in full and still fits most mobile results, where the snippet is narrower and truncates earlier. Below roughly 70 characters you have usually said too little for Google to keep, and it starts pulling a sentence out of the page instead.',
          'Treat the number as a budget, not a rule. Google truncates on rendered width, so a description full of wide letters (W, M, capitals) is cut earlier than the same character count of narrow ones. Checking a draft in a character counter tells you whether you are in range; checking it in a snippet preview tells you whether it actually fits.',
        ],
      },
      {
        h: 'Why the 160-character limit still circulates',
        p: [
          'It was accurate once. Google widened desktop snippets in 2017 to around 160 characters, the number stuck in every checklist since, and nothing has formally replaced it — Google never publishes a character limit. What changed is mobile, where the same snippet renders in a narrower column and the visible text ends sooner.',
          'The practical result is a two-tier budget: 155 characters is safe everywhere, 160 is safe on desktop and risky on mobile, and anything past 180 is truncated on both. The old limit is not wrong so much as it is desktop-only advice presented as universal.',
        ],
      },
      {
        h: 'A ladder you can check a draft against',
        p: ['Rough guide for a Google result, English text, average letter widths:'],
        pre: 'under 70 chars   too thin — Google usually substitutes page text\n70–119           fits everywhere; often feels unfinished\n120–155          the target: full display on desktop and most mobile\n156–180          desktop only; mobile truncates\n180+             truncated on both',
        p2: [
          'The upper bound is softer than the lower one. A 158-character description that ends on a complete clause is better than a 150-character one that stops mid-thought — but only if the truncation point happens to fall after the useful part, which you cannot control per device. Ending with a short, self-contained clause is the cheapest insurance.',
        ],
      },
      {
        h: 'What Google does with the description you wrote',
        p: [
          'A description is a hint, not a directive. Google shows the one you wrote for a good share of queries and rewrites the rest — often pulling a passage from the page that matches the searcher’s exact wording, sometimes appending a date or a rating, sometimes building a snippet around where the query appears in the text. No tag or length prevents this, and most of the time the rewrite is not a problem: it is matched to the query that produced it.',
          'What you can influence is whether your version is good enough to keep. A description that reads like a sentence a person would write, promises exactly what the page delivers, and contains the words people actually search for has a better chance of being used. A description that repeats the title, stuffs keywords or describes a different page gives Google a reason to replace it.',
        ],
      },
      {
        h: 'Writing one that survives',
        p: [
          'Say what the page is and what it gives the reader, in that order. Keep the target phrase in the sentence once, phrased the way people search rather than the way a keyword tool exports it. Use the active voice and a specific noun — “check your meta description length against mobile and desktop” beats “this tool helps with meta descriptions”.',
          'Leave the brand name out unless the page is a brand page; it spends characters on a word the searcher already sees in the URL. End on a complete thought, not a cliffhanger. And write a different one for every page: a site-wide description is the fastest way to have all of them rewritten at once.',
          'Then check it. The Meta Description Checker counts characters and marks the desktop and mobile cut-off points; the SERP Preview Tool renders the snippet the way a result page would, which is the only way to see whether the truncation lands somewhere sensible; the Meta Tag Generator writes the full head block once the wording is settled.',
        ],
      },
      {
        h: 'Common mistakes',
        p: [
          'Auto-generating from the first paragraph. It is the default in most CMSs and it produces descriptions that start mid-sentence, repeat the heading and waste the first 40 characters. Write it by hand; it is thirty seconds per page.',
          'Repeating the title. If the title already says “Meta description length 2026”, the description should not start with those four words — that is a third of the budget spent saying nothing new.',
          'Keyword lists. Comma-separated phrases read as spam to a person and give the snippet no reason to be clicked. One phrase, in a sentence.',
          'One description for every page. Duplicates are a strong signal that the pages are near-duplicates too, and Google will happily rewrite all of them.',
          'No description at all. Google then builds one from page text, which is usually worse than anything you would have written.',
        ],
      },
    ],
    faqs: [
      { q: 'Does meta description length affect rankings?', a: 'No. Google has said the description is not a ranking factor. It affects the snippet, and the snippet affects whether people click — so it moves traffic, not position.' },
      { q: 'Should the keyword go in the meta description?', a: 'Yes, once, in the sentence where it reads naturally. Google bolds matched words in the snippet, which helps the result stand out, but a description written around a keyword list reads as spam and gets rewritten.' },
      { q: 'Can two pages share a meta description?', a: 'They can, but they should not. Duplicates blur which page answers a query and give Google a reason to rewrite both. Every indexable page deserves its own sentence.' },
      { q: 'Is the limit different on mobile?', a: 'Yes. Google truncates on rendered width, and a mobile result is narrower, so the same description shows fewer words. Writing to about 120–155 characters keeps the useful part visible on both.' },
      { q: 'Do I need a meta description on every page?', a: 'Write one for every page you want clicked. Google may ignore it and build a snippet from the page, but a good description is used often enough that leaving it empty is a wasted opportunity, not a neutral choice.' },
    ],
    relatedTools: ['meta-description-checker', 'meta-tag-generator', 'serp-preview-tool'],
    relatedGuides: ['title-tag-length-2026', 'open-graph-image-size-2026'],
    links: [
      { label: 'Google: control your snippets in search results', url: 'https://developers.google.com/search/docs/appearance/snippet' },
      { label: 'Google: meta tags and attributes that Google supports', url: 'https://developers.google.com/search/docs/crawling-indexing/special-tags' },
    ],
  },
  {
    slug: 'internal-linking',
    title: 'Internal linking: the SEO lever you already own',
    focus: 'internal linking',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'Internal Linking in 2026: Build a Link Graph That Works',
    metaDesc: 'Internal linking is the cheapest SEO work you control. How link signals, discovery and anchor text actually work — plus an audit you can finish today.',
    intro: 'Internal linking is the only ranking input you can add in thirty seconds and never pay for. Here is what it actually does, where sites leak the benefit, and the audit that finds the leaks.',
    sections: [
      {
        h: 'What internal linking actually does',
        p: [
          'A crawler learns about your site from three places: links it finds elsewhere, your sitemap, and the links your own pages point at each other. Only the third tells it which pages matter. A sitemap is a list of URLs you would like crawled; an internal link is a recommendation, with a description attached, from a page the crawler already trusts.',
          'That is why a new page with no inbound internal links sits in the queue. Google knows it exists, has no signal about its importance, and spends crawl budget on pages that are linked. The same links carry the anchor text Google reads as a summary of the destination. Nothing else in SEO is this cheap to add after the fact.',
        ],
      },
      {
        h: 'The four layers of a link graph',
        p: [
          'Global navigation is the baseline: the same handful of links in the header and footer of every page, telling crawlers which sections are the spine of the site. Breadcrumbs come next — visible links plus `BreadcrumbList` markup — and they do double duty, because they also earn the breadcrumb trail in a search result. Related blocks link the page you are on to three or five contextual neighbours. Inline links inside the prose are the last layer and the most valuable one, since the sentence around the link describes the destination.',
          'Most sites have the first two and stop. That is enough to make a site crawlable and not enough to make it rank: the pages that win are usually the pages with the most contextual links pointing at them, not the pages closest to the homepage.',
        ],
      },
      {
        h: 'Auditing what you already have',
        p: [
          'Pick your ten most important pages and count four things for each. Inbound internal links: how many other pages link here — zero means orphaned, three or more is healthy for a normal page, five or more for one you are trying to rank. Contextual links out, in the body: three per thousand words is a working target, not a quota. A related block whose links actually relate. Breadcrumbs with markup.',
          'The Web Crawler Audit reports status, canonical, directives and outbound links for one URL, which is enough to spot a page whose only inbound links are the header and footer. Work from the pages that matter most; a site-wide sweep is a bigger job than it looks, and the wins are concentrated in about a dozen URLs.',
        ],
      },
      {
        h: 'Anchor text is where the meaning lives',
        p: [
          'Anchor text is a hint about the destination, so “click here” wastes the one free description you get. “Build the file with the Robots.txt Generator” tells the crawler what the destination is; “read more” tells it nothing. Vary the wording naturally rather than repeating an exact-match phrase fifty times — the same anchor everywhere starts to look engineered, and it reads badly for anyone skimming link lists with a screen reader.',
          'Keep the sentence working if the link is removed. A good internal link is a useful sentence that happens to point somewhere, not a link with words bolted around it.',
        ],
      },
      {
        h: 'Five ways internal linking quietly fails',
        p: [
          '“Click here” anchors are the first. Footer dumping is the second: putting every page in the footer spreads link value across hundreds of links and gives none of them context. Auto-generated related widgets are the third — if the same five posts appear under every article, the block is decoration. Slug changes are the fourth: every edit breaks the links pointing at the old URL, so redirect or do not change it.',
          'The fifth is the one most often taught wrong. Paginated archives do not need `rel="next"` and `rel="prev"`: Google stopped using those hints in 2019. What paginated pages need is ordinary crawlable links to the next page, and a sensible canonical strategy. Adding the tags does nothing; omitting the links orphans every page after the first.',
        ],
      },
      {
        h: 'A routine that keeps the graph honest',
        p: [
          'At publish, do three things: link out to two or three relevant pages from the new article, add one link to the new page from an established page, and check that the related block is populated with something that actually relates. Once a month, run the ten-page audit again and look for pages that lost their inbound links when something was rewritten or deleted.',
          'When you delete a page, redirect it to the closest replacement instead of leaving a 404. When you add a tool, give it a guide that links to it, and link to the guide from related coverage. The graph stays healthy through small, boring maintenance — the same way a sitemap stays honest.',
        ],
      },
    ],
    faqs: [
      { q: 'What is internal linking?', a: 'Internal linking is linking from one page on your site to another page on the same site. It does three jobs: helps crawlers discover pages, tells them which pages matter through the link graph, and gives them anchor text that describes each destination.' },
      { q: 'How many internal links should a page have?', a: 'There is no fixed cap. A working target is three or more contextual links out per thousand words, and three to five inbound links for a page you want to rank. Hundreds of template links in a footer add noise rather than signal.' },
      { q: 'Does anchor text matter for internal links?', a: 'Yes. Google reads anchor text as a description of the destination, so “build the file with the Robots.txt Generator” is a better link than “click here”. Vary the wording naturally instead of repeating one exact phrase across the site.' },
      { q: 'Do breadcrumbs count as internal linking?', a: 'They do. Breadcrumbs are ordinary links plus `BreadcrumbList` markup, and they earn a breadcrumb trail in search results as well as passing link signals from section pages down to individual pages.' },
      { q: 'Can internal links hurt SEO?', a: 'Rarely, and only through volume or irrelevance: hundreds of identical footer links, or a block of unrelated links on every page, dilute the signal. A handful of contextual links that help a reader never hurts.' },
      { q: 'How is internal linking different from backlinks?', a: 'Backlinks come from other sites and take months to earn. Internal links you control, cost nothing, and can be added in a minute. Both move link signals; internal links are the part you can fix today.' },
    ],
    relatedTools: ['web-crawler-audit', 'seo-score-checker', 'url-slug-generator', 'sitemap-generator'],
    relatedGuides: ['image-seo', 'core-web-vitals', 'url-slug-best-practices', 'xml-sitemap-best-practices'],
    links: [
      { label: 'Google: links crawlable — make links discoverable', url: 'https://developers.google.com/search/docs/crawling-indexing/links-crawlable' },
      { label: 'Google: SEO starter guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
    ],
  },
  {
    slug: 'image-seo',
    title: 'Image SEO: alt text, formats and the weight you ship',
    focus: 'image seo',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'Image SEO in 2026: Alt Text, Formats and File Weight',
    metaDesc: 'Image SEO is two jobs: being findable in Google Images and not slowing the page down. Alt text, filenames, formats and a checklist that covers both.',
    intro: 'Image SEO is usually taught as alt-text trivia. It is really two jobs — being findable in image search, and not making the page slower than it needs to be. Both are fixable in an afternoon.',
    sections: [
      {
        h: 'What Google reads on an image',
        p: [
          'Image ranking is a separate system from web ranking, and it reads a handful of things: the alt attribute, the file name, the text around the image, the page it sits on, and structured data or an image sitemap if you publish one. None of them is magic, and none compensates for an image that is irrelevant to the page it appears on.',
          'The same signals do double duty. Alt text is the accessible name a screen reader announces, and the file name is what a person sees when the image fails to load. Writing them well is an accessibility fix that happens to be an SEO fix.',
        ],
      },
      {
        h: 'Alt text, written for a person who cannot see the image',
        p: [
          'Describe what the image shows, in five to fifteen words, as a sentence rather than a keyword list. “Screenshot of the Robots.txt Generator showing AI crawler presets” is useful; “image1.jpg” and “SEO tools SEO free 2026” are not. Do not start with “image of” — a screen reader already announces that it is an image.',
          'Include the phrase once if it fits the sentence, and leave it out if it does not. Decorative images — rules, background patterns, spacer icons — get `alt=""`, which tells assistive technology to skip them. Marking a decorative image with a description is as wrong as leaving a meaningful one empty.',
        ],
      },
      {
        h: 'File names, formats and what a megabyte costs',
        p: [
          'Name the file before uploading: lowercase, hyphens, three to five words — `robots-txt-generator-interface.webp`, not `IMG_4521.png`. Use WebP for most content images. AVIF compresses further and current versions of every major browser support it, with JPEG as the fallback. Keep PNG for transparency, and stop exporting screenshots as PNG when WebP will do.',
          'Size is where the money is. This site’s own social card weighed 776 KB straight off the canvas and 54 KB after quantising to five bits per channel — visually identical at 1200×630, fourteen times smaller. A 4 MB hero on a phone is not a design choice; it is a Core Web Vitals problem.',
        ],
      },
      {
        h: 'Dimensions, srcset and the layout-shift trap',
        p: [
          'Every image should carry `width` and `height` attributes matching its intrinsic size, so the browser reserves space before the bytes arrive. Without them the page reflows as images land, which is exactly what Cumulative Layout Shift measures. Ship the image at the largest size it is displayed at, and use `srcset` with `sizes` when the same picture appears at several widths.',
          'Do not lazy-load the hero. `loading="lazy"` on the largest above-the-fold image delays the exact element LCP is timing. Use it below the fold, and preload the hero when it is critical to the first paint.',
        ],
      },
      {
        h: 'Image search is its own surface',
        p: [
          'Google Images sends real traffic, but the intent is different: people are looking for a picture, not for a tool. Expect image sessions to convert worse than organic sessions, and treat the surface as reach rather than a funnel. A correctly described image on a relevant page is what makes it eligible; an image sitemap helps discovery once you have hundreds.',
          'If you license images, put the credit and licence in the IPTC metadata and in structured data — Google surfaces licensing information in image results. If you do not, do not invent it; wrong licence metadata is worse than none.',
        ],
      },
      {
        h: 'A pre-publish image check',
        p: [
          'Name the file descriptively, resize it to the largest display size, compress it with the Image Compressor & Optimizer, write alt text for a person who cannot see it, and set width and height. Five steps, about a minute per image, and the page gets lighter every time you do it.',
          'Then measure. PageSpeed Insights reports the LCP element on a real render; if the hero image is still the largest element and the score is poor, the problem is its weight or dimensions, not the alt text.',
        ],
      },
    ],
    faqs: [
      { q: 'What is image SEO?', a: 'Image SEO is the work of making images findable in Google Images and keeping them from slowing the page down: descriptive alt text and file names, modern formats, sensible dimensions, and compression to the smallest size that still looks right.' },
      { q: 'How long should alt text be?', a: 'Five to fifteen words is the working range. Shorter than that is usually too vague to describe anything; longer starts reading like keyword stuffing. Write a sentence a person would say out loud, not a comma-separated list.' },
      { q: 'Does image file size affect rankings?', a: 'Not directly — bytes are not a ranking factor. It affects Largest Contentful Paint, which is part of Core Web Vitals, and that is a ranking signal. A heavy hero image is one of the most common causes of a poor LCP on mobile.' },
      { q: 'Which image format should I use?', a: 'WebP for most content images, AVIF when you want the smallest file and can accept slower encoding, JPEG as the universal fallback, PNG only where transparency is required. Export at the size you display, not the size the camera produced.' },
      { q: 'Do I need an image sitemap?', a: 'Only once image discovery is a real problem — typically hundreds of images, or images loaded by JavaScript that a crawler may not execute. For a normal page, alt text and a crawlable image tag do more than a sitemap entry.' },
      { q: 'Can I use AI-generated images?', a: 'Yes. Google indexes them the same way as any other image; what matters is that the alt text and file name describe what is actually shown. If a jurisdiction requires disclosure of synthetic images, disclose it.' },
    ],
    relatedTools: ['image-compressor', 'web-crawler-audit', 'seo-score-checker', 'url-slug-generator'],
    relatedGuides: ['core-web-vitals', 'internal-linking'],
    links: [
      { label: 'Google: image SEO best practices', url: 'https://developers.google.com/search/docs/appearance/google-images' },
      { label: 'Google: image sitemaps', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps' },
    ],
  },
  {
    slug: 'core-web-vitals',
    title: 'Core Web Vitals: what LCP, CLS and INP actually measure',
    focus: 'core web vitals',
    date: '2026-10-25',
    updated: '2026-10-30',
    author: 'Glixtron',
    metaTitle: 'What is CLS in Core Web Vitals? LCP, CLS & INP (2026 Guide)',
    metaDesc: 'CLS, LCP and INP explained: what each Core Web Vitals metric measures, the thresholds (LCP 2.5s, CLS 0.1, INP 200ms), and how to test and fix yours for free.',
    intro: 'Core Web Vitals are three numbers Google collects from real browsers. They are not the same as your Lighthouse score, and understanding that difference is most of the work.',
    sections: [
      {
        h: 'Types of Core Web Vitals',
        p: [
          'Largest Contentful Paint times how long the largest element in the viewport takes to render: good under 2.5 seconds, poor past 4.0. Cumulative Layout Shift scores unexpected movement: good under 0.1, poor past 0.25. Interaction to Next Paint times the delay between a tap and the next frame that shows a response: good under 200 milliseconds, poor past 500.',
          'Google evaluates the 75th percentile of real users over a 28-day window, per page group. That detail matters. A fast desktop visit does not cancel out a slow phone, and one good day does not clear a bad month.',
        ],
        table: {
          head: ['Metric', 'What it measures', 'Good', 'Needs work', 'Poor'],
          rows: [
            ['LCP', 'Time until the largest visible element renders', '2.5 s or less', '2.5–4.0 s', 'Over 4.0 s'],
            ['CLS', 'Unexpected layout movement, unitless', '0.1 or less', '0.1–0.25', 'Over 0.25'],
            ['INP', 'Delay from interaction to the next painted frame', '200 ms or less', '200–500 ms', 'Over 500 ms'],
          ],
        },
      },
      {
        h: 'What is LCP in Core Web Vitals?',
        p: [
          'Find the element before changing anything. In Chrome DevTools the Performance panel marks the LCP element on a recorded load, and PageSpeed Insights names it too. Usually it is a hero image, a large heading, or a block of text waiting on a web font. The fix depends entirely on which one it is.',
          'When it is an image, resize and compress it, preload it, and stop lazy-loading it. When it is text, the font is usually the culprit: preload the file, use `font-display: swap`, and cut the weights you actually load. Render-blocking CSS and JavaScript delay all three cases, so defer whatever the first paint does not need.',
        ],
      },
      {
        h: 'What is CLS in Core Web Vitals?',
        p: [
          'Layout shift is what happens when content moves after the user has seen it. Images without `width` and `height` are the classic cause; web fonts that load late and change text metrics are the second; banners, cookie bars and embeds injected above existing content are the third. Each one is fixable by reserving space in advance.',
          'Shifts the user causes — opening a menu, expanding a section — do not count. The score is about surprises, which is why a page that jumps around on load can score worse than a page that looks busier but stays still.',
        ],
      },
      {
        h: 'What is INP in Core Web Vitals?',
        p: [
          'Interaction to Next Paint replaced First Input Delay in March 2024. FID measured only the input delay before a handler started; INP measures the whole interaction, including the work the handler does and the frame that finally paints. It is stricter, and it fails pages that looked fine under FID.',
          'The cause is almost always a long task on the main thread. Break work into chunks, move non-urgent work to an idle callback, and audit third-party scripts before optimising your own. On this site, removing Google Tag Manager took roughly 560 KB of script off every page view — more than any handler rewrite would have saved.',
        ],
      },
      {
        h: 'Field data, lab data and the 100-score trap',
        p: [
          'Lighthouse and the PageSpeed lab test run in a controlled environment. They are reproducible, they catch regressions immediately, and they are not what Google grades. Field data comes from real Chrome users through the Chrome UX Report, lags by the 28-day window, and feeds the ranking signal.',
          'So a 100/100 Lighthouse score with poor field data is still a failing page, and a 70 with good field data is not. Core Web Vitals are also a tiebreaker rather than a penalty: they separate pages whose content is otherwise comparable. Content still does most of the work.',
        ],
      },
      {
        h: 'A diagnosis order that finds the real cause',
        p: [
          'Start in Search Console’s Core Web Vitals report to see which URL groups fail and on which metric. Open PageSpeed Insights for one failing URL and read both the field and lab sections. Identify the specific element or task, fix that one thing, then leave it alone for a month — field data cannot show you today’s change.',
          'Re-measure at the URL-group level, not the homepage, and compare like with like: mobile field data against mobile field data. Chasing the score instead of the element is how sites end up fast in a lab and slow for the people who matter.',
        ],
      },
    ],
    faqs: [
      { q: 'What are Core Web Vitals?', a: 'Core Web Vitals are three field metrics Google uses to describe page experience: Largest Contentful Paint for loading, Cumulative Layout Shift for visual stability, and Interaction to Next Paint for responsiveness. Each is measured at the 75th percentile of real users.' },
      { q: 'What is a good LCP score?', a: 'Under 2.5 seconds at the 75th percentile. Between 2.5 and 4.0 seconds needs improvement, and past 4.0 is poor. LCP times the largest element in the viewport, so the fix starts by identifying whether that element is an image, a heading, or text waiting on a font.' },
      { q: 'What is a good CLS score?', a: 'Under 0.1 is good, 0.1 to 0.25 needs improvement, past 0.25 is poor. Set width and height on images and embeds, preload the fonts you actually use with `font-display: swap`, and reserve space for ads and banners before they load.' },
      { q: 'What is INP and why did it replace FID?', a: 'Interaction to Next Paint measures the full delay from a tap to the next painted frame, including the handler work. It replaced First Input Delay in March 2024 because FID only measured the wait before the handler started, which missed the slow part.' },
      { q: 'Do Core Web Vitals affect Google rankings?', a: 'Yes, as a tiebreaker. Page experience — Core Web Vitals, HTTPS, mobile usability and intrusive interstitials — has been a ranking input since 2021. It does not override content quality; it separates pages that are otherwise close.' },
      { q: 'How do I check my Core Web Vitals?', a: 'The Search Console Core Web Vitals report shows field data by URL group. PageSpeed Insights shows field and lab data for one URL, Lighthouse gives lab data only, and the web-vitals library collects real-user measurements on your own pages.' },
    ],
    relatedTools: ['image-compressor', 'web-crawler-audit', 'seo-score-checker'],
    relatedGuides: ['image-seo', 'internal-linking'],
    links: [
      { label: 'web.dev: Core Web Vitals', url: 'https://web.dev/articles/vitals' },
      { label: 'Google Search Central: page experience', url: 'https://developers.google.com/search/docs/appearance/page-experience' },
    ],
  },
  {
    slug: 'open-graph-image-size-2026',
    title: 'Open Graph image size: what 1200x630 actually buys you',
    focus: 'open graph image size',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'Open Graph Image Size: 1200x630 and the Exceptions',
    metaDesc: 'Open graph image size is 1200x630 almost everywhere, yet the OGP spec sets no dimensions at all. What each platform crops, and the tags that matter more.',
    intro: 'The open graph image size everyone quotes is 1200x630. That number is a platform convention rather than a rule in the spec, and knowing which part is convention is what keeps a share card from being cropped in the wrong place.',
    sections: [
      {
        h: 'The open graph image size that works almost everywhere',
        p: [
          '1200x630 pixels at a 1.91:1 aspect ratio is the size to design for. Facebook popularised that shape and the platforms that unfurl links have converged on it, so one file covers most previews without letterboxing or a hard crop.',
          'The Open Graph protocol itself does not define an image size. It defines `og:image` as a URL and offers optional `og:image:width` and `og:image:height` so a consumer can reserve space before downloading. Everything about 1200x630 comes from what platforms choose to display, which is why a different number appears whenever one of them changes a card layout.',
        ],
        p2: [
          'Width matters more than height in practice. 1200 pixels is enough for a retina display at the roughly 600-pixel-wide preview a desktop feed uses, and it stays legible in the 350-pixel-wide preview a phone shows. Height beyond 630 mostly gets cropped.',
        ],
      },
      {
        h: 'What each platform does with the same file',
        p: [
          'Facebook and LinkedIn render a wide card at 1.91:1 and crop an image that is not already that shape. LinkedIn has historically authored at 1200x627, a three-pixel difference nobody can see and no designer should chase.',
          'X has two shapes. A `summary_large_image` card is 1.91:1, commonly authored at 1200x628; a `summary` card is square, where 512x512 works. If `twitter:image` is missing, X falls back to `og:image` - but which card type you get is decided by `twitter:card`, so a wide design can still be presented as a square crop.',
        ],
        p2: [
          'Messaging clients - WhatsApp, Slack, Discord, Telegram - reuse `og:image` and crop it into their own container. None of them documents a size it will honour, so the useful rule is the boring one: keep the subject and any text inside the middle 80% of the frame, and never put meaning in the bottom edge, where some clients overlay a domain or a play button.',
        ],
      },
      {
        h: 'The tags that matter more than the picture',
        p: [
          '`og:image` must be an absolute URL. Relative paths are common in hand-written tags and are the most reliable way to produce a card with no image, because the consumer has no page context to resolve them against. Add `og:image:width` and `og:image:height` at the real pixel dimensions so clients reserve the right box before the bytes arrive.',
          '`og:url` should be the canonical URL. Without it a link shared with tracking parameters can be treated as its own object and the share counts split. `og:title` and `og:description` decide the text line, and `og:title` is also one of the sources Google may use for a title link, so it should not promise something the page does not deliver.',
        ],
        p2: [
          'For X, add `twitter:card` - `summary_large_image` for a wide design - and `twitter:image` if the card should differ from the Open Graph one. Omitting `twitter:image` is fine; the fallback is well defined.',
        ],
      },
      {
        h: 'Testing a share card without guessing',
        p: [
          'Facebook\'s Sharing Debugger and LinkedIn\'s Post Inspector fetch a URL and show the card the platform will build, including the image it picked. Both cache aggressively: re-scraping refreshes what new shares see, but a preview already cached in someone\'s feed does not change retroactively.',
          'X shows the card as you compose a post, which is the closest thing it offers to a preview. If a platform has moved its debugger, its own developer documentation is the only source worth trusting - third-party card checkers re-implement a subset and go stale.',
        ],
        p2: [
          'Test the exact URL you intend to share, then one deep URL from the same template. A site-wide image can look fine on the homepage and be wrong on every article, and the template is where that bug lives.',
        ],
      },
      {
        h: 'Mistakes that cost clicks',
        p: [
          'A missing or relative URL is the first. A 4 MB PNG exported at 4000 pixels wide is the second: most platforms cap uploads somewhere between 5 and 8 MB, but a file that size makes the preview slow long before it fails, and it is the same weight problem the image SEO guide describes.',
          'One site-wide logo for every page is the third. A page-specific card tells someone which article they are about to open; a logo tells them which site they are on, which the domain line already says. Body-copy-sized text is the fourth: at a 350-pixel-wide mobile preview, anything under roughly 40 pixels tall in the source is unreadable.',
        ],
        p2: [
          'Transparency is the last. A PNG with an alpha channel can land on a dark card in one client and a white one in another; flatten it onto a background you control.',
        ],
      },
      {
        h: 'A sixty-second routine',
        p: [
          'Design at 1200x630, keep text large and inside the middle of the frame, export as JPG or PNG under about 500 KB, and point `og:image` at the absolute URL with matching width and height. Add `og:url`, an `og:title` that matches the page, and `twitter:card` if you want the wide X treatment.',
          'Then paste the URL into two debuggers and look at the mobile preview rather than the desktop one. The Open Graph Generator writes the tag block, the Twitter Card Generator covers the X-specific pair, and the Image Compressor takes the export down to a sensible weight. The meta description length guide covers the text line underneath.',
        ],
        p2: [
          'That is the whole job: ten minutes once per template, and it removes a class of broken previews nobody notices until a link is already shared.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the standard open graph image size?', a: '1200x630 at a 1.91:1 aspect ratio. Facebook popularised that shape and most unfurlers reuse it, so one file covers Facebook, LinkedIn, X large cards, WhatsApp, Slack and Discord without a hard crop. X also accepts 1200x628 for its large card.' },
      { q: 'Does the Open Graph protocol define an image size?', a: 'No. The protocol defines og:image as a URL plus optional og:image:width and og:image:height. The 1200x630 figure comes from what platforms display, not from the specification, which is why the number changes when a platform changes its card layout.' },
      { q: 'What size should an X or Twitter card image be?', a: 'A summary_large_image card is 1.91:1 and is commonly authored at 1200x628. A summary card is square, where 512x512 works. Set twitter:card to summary_large_image if you want the wide treatment; otherwise the image may be cropped square.' },
      { q: 'Why is my og:image not showing?', a: 'Usually a relative URL, a 404, a cache, or a crawler blocked by robots.txt. Check the absolute URL loads, confirm the image is large enough not to be upscaled, then re-scrape with the platform debugger. Cached previews in existing posts stay as they were.' },
      { q: 'Should every page have its own open graph image?', a: 'Yes, where it is practical. A page-specific card tells the reader which article they are opening, while a single site-wide logo repeats information the domain line already gives them. Templates make this cheap: one layout, one generated image per page.' },
      { q: 'Which format and file size should I use?', a: 'JPG or PNG at under about 500 KB. WebP support across unfurlers is uneven, and a heavy file slows the preview even when the platform accepts it. Flatten transparency onto a background you control so the card looks the same in light and dark clients.' },
    ],
    relatedTools: ['open-graph-generator', 'twitter-card-generator', 'meta-tag-generator', 'image-compressor'],
    relatedGuides: ['meta-description-length-2026', 'image-seo', 'website-launch-seo-checklist'],
    links: [
      { label: 'The Open Graph protocol', url: 'https://ogp.me/' },
      { label: 'Facebook: webmasters sharing guide', url: 'https://developers.facebook.com/documentation/sharing/webmasters' },
    ],
  },
  {
    slug: 'htaccess-301-redirect',
    title: '.htaccess 301 redirects: four patterns, one order, no loops',
    focus: 'htaccess 301 redirect',
    date: '2026-10-25',
    updated: '2026-10-30',
    author: 'Glixtron',
    metaTitle: 'How to Write a 301 Redirect in .htaccess (4 Patterns)',
    metaDesc: 'Write 301 redirects in .htaccess with 4 copy-paste patterns: single URL, domain move, www→non-www, and HTTP→HTTPS. How to test before deploying.',
    intro: 'An htaccess 301 redirect is the Apache way of telling browsers and crawlers that a URL has moved for good. The rules are short, the ordering is where people get hurt, and the file only works on Apache.',
    sections: [
      {
        h: 'What an htaccess 301 redirect can and cannot do',
        p: [
          '`.htaccess` is per-directory configuration for Apache. Two mechanisms handle redirects: `Redirect` from mod_alias for simple path-to-path moves, and `RewriteRule` from mod_rewrite when a pattern or a condition is involved. Neither means anything on nginx, IIS or an edge platform - those have their own syntax, and copying an `.htaccess` file to them produces a 404, not a redirect.',
          'Two failure modes are worth knowing before editing anything. If the host disables overrides for the directory (`AllowOverride None`), Apache ignores the whole file and nothing happens. If the file contains a syntax error, Apache returns 500 for every URL in that directory - which is why a redirect change belongs in a staging copy, or at least behind a backup of the file.',
        ],
        p2: [
          'What it does well is the thing Google documents: a permanent redirect is a signal that the target should be canonical. `301` and `308` are permanent; `302`, `303` and `307` are temporary, and Google keeps showing the source URL for those.',
        ],
      },
      {
        h: 'How to write a 301 redirect in htaccess (four patterns)',
        p: [
          'Single URL, whole domain, www to apex, and http to https. That is the list for a normal migration; anything more specific is usually a discontinued section, and those are just more single-URL rules.',
          'Read the block in order. `Redirect` is mod_alias and needs a path beginning with a slash. The domain rule must exclude the new domain or it redirects in a circle. The www rule captures the apex in `%1` so paths survive. The HTTPS rule tests `%{HTTPS}` rather than the host, and every mod_rewrite rule ends with `[R=301,L]` so nothing after it runs.',
        ],
        pre: [
          '# 1. One old URL to one new URL (mod_alias)',
          'Redirect 301 /old-page /new-page',
          '',
          '# 2. Every path on an old domain to the same path on a new one',
          'RewriteEngine On',
          'RewriteCond %{HTTP_HOST} ^olddomain\\.com$ [NC]',
          'RewriteRule ^ https://newdomain.com%{REQUEST_URI} [R=301,L]',
          '',
          '# 3. www to apex',
          'RewriteEngine On',
          'RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]',
          'RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]',
          '',
          '# 4. http to https',
          'RewriteEngine On',
          'RewriteCond %{HTTPS} off',
          'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]',
        ].join('\n'),
        p2: [
          'One rule per concern, and the http-to-https rule is the one to add last: it will happily fire for internal rewrites otherwise, and the `[L]` flag turns a careless ordering into a loop rather than a longer page.',
        ],
      },
      {
        h: '301 vs 302: what Google actually does with each',
        p: [
          'The old shorthand - "a 301 passes link equity and a 302 does not" - is too strong, and it is repeated in a lot of otherwise good guides. Google follows both. The difference is which URL it treats as canonical: with a permanent redirect the target becomes canonical and results show it; with a temporary one the source stays canonical and the target may still be indexed from other signals.',
          'Use a temporary redirect only when you intend to put the URL back: a maintenance window, an A/B test, a seasonal page. For a rename or a migration, permanent is the correct signal, and `308` is the HTTP/1.1 equivalent of `301` when the request method has to be preserved.',
        ],
        p2: [
          'Expect one more thing after a move: Google keeps track of both URLs, and the old one can keep appearing occasionally as an alternate name for the new page. That is documented behaviour rather than a redirect bug, and it fades as people get used to the new address.',
        ],
      },
      {
        h: 'Order, flags and the failures they cause',
        p: [
          '`Redirect` directives are evaluated top to bottom and the first match wins, so a broad rule placed early shadows every specific rule after it. Put one-off paths first and the catch-all last. mod_rewrite is a different engine: rules run in file order, `[L]` ends the current round, and an internal rewrite can start a new one. On Apache 2.4, `[END]` stops processing entirely, which is usually what people mean by "last".',
          'Chains are the quiet failure. `/old` to `/middle` to `/new` works, but every hop is an extra request and an extra chance to break, and Google publishes no hop limit to design against. Redirect straight to the final URL. Loops are the loud one: `/a` to `/b` and `/b` to `/a` gives `ERR_TOO_MANY_REDIRECTS` in the browser and a redirect error in a crawl.',
        ],
        p2: [
          'Query strings have their own trap. `Redirect` keeps the query string by default; a `RewriteRule` without `?` or `[QSA]` can silently drop it. And avoid rules that send every missing path to the homepage: that is a soft 404, and it teaches Google that unrelated URLs resolve to the same content.',
        ],
      },
      {
        h: 'Testing a redirect before it hurts',
        p: [
          'From a terminal, `curl -sI https://example.com/old-page` shows the status line and the `Location` header. Add `-o /dev/null -w "%{http_code} %{redirect_url}"` when you want one line per URL to paste into a checklist, and use `-L` only when you want the final destination rather than the first hop.',
          'In Search Console, the report that used to be called Coverage is now Page indexing. "Page with redirect" is informational - it means Google followed the redirect - while a redirect error is the thing to fix. Follow each new rule to a 200, confirm the code is 301 rather than 302, and update internal links and the sitemap so the old URL stops being advertised.',
        ],
        p2: [
          'The Web Crawler Audit reports status, the redirect chain and the final URL for one address, which is the quickest way to catch a chain you did not intend. Do that before the rules go live, not after a ranking drop.',
        ],
      },
      {
        h: 'When a redirect is the wrong answer',
        p: [
          'If the content is gone for good and has no replacement, a `410` or a plain `404` is more honest than redirecting to something unrelated. Sending every retired page to the homepage is the classic soft 404, and it spends crawl budget on URLs that will never satisfy anyone.',
          'For duplicate URLs that both need to exist, a canonical is the right tool; for a page that moved, a redirect is. `noindex` is neither - it removes a page from results but keeps it crawlable, which is why pairing it with a robots.txt disallow defeats both.',
        ],
        p2: [
          'The launch checklist covers redirects in context, and the noindex vs robots.txt guide covers which directive belongs to which problem. If a redirect is live and the page still is not indexed, the diagnostic guide is the next stop.',
        ],
      },
    ],
    faqs: [
      { q: 'What is an htaccess 301 redirect?', a: 'An .htaccess 301 redirect is an Apache rule that sends a URL to a new location permanently. It is written with Redirect from mod_alias, or with RewriteRule and the [R=301] flag from mod_rewrite. It only applies on Apache; nginx, IIS and edge platforms need their own rules.' },
      { q: 'Does a 301 redirect pass PageRank?', a: 'Google uses a permanent redirect as a signal that the target should be canonical, so signals consolidate on the new URL. The old claim that a 301 passes PageRank exactly like a direct link is stronger than anything Google documents today: treat it as consolidation over time, not a guaranteed 1:1 transfer.' },
      { q: 'What is the difference between a 301 and a 302 redirect?', a: 'Both are followed by Googlebot. A 301 (or 308) is permanent: the target becomes canonical and search results show it. A 302 (or 307) is temporary: the source stays canonical and keeps appearing in results. Use a temporary redirect only when the URL is coming back.' },
      { q: 'How do I redirect www to non-www in .htaccess?', a: 'Enable the rewrite engine, match the www host with RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC], then rewrite to https://%1%{REQUEST_URI} with [R=301,L]. The %1 is the captured apex, so paths survive the redirect. Keep the rule above any catch-all.' },
      { q: 'Why is my .htaccess redirect not working?', a: 'Check four things: overrides are enabled for the directory, mod_rewrite is loaded, the .htaccess sits in the right directory, and no earlier rule matches first. A syntax error returns 500 for every URL. If the host is nginx or an edge platform, .htaccess is ignored entirely.' },
      { q: 'Do redirect chains hurt SEO?', a: 'They do not break anything, but each hop is an extra request and an extra point of failure, and signals have further to travel. Redirect straight to the final URL. Google publishes no hop limit, so treat any chain longer than one hop as work to clean up.' },
    ],
    relatedTools: ['htaccess-redirect-generator', 'web-crawler-audit', 'canonical-tag-generator', 'sitemap-generator'],
    relatedGuides: ['website-launch-seo-checklist', 'noindex-vs-robots-txt', 'why-is-my-site-not-indexed', 'url-slug-best-practices', 'rel-canonical-tag', 'http-status-codes-seo'],
    links: [
      { label: 'Google: redirects and Search', url: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
      { label: 'Apache: mod_alias redirect directives', url: 'https://httpd.apache.org/docs/current/mod/mod_alias.html' },
      { label: 'Apache: mod_rewrite reference', url: 'https://httpd.apache.org/docs/current/mod/mod_rewrite.html' },
    ],
  },
  {
    slug: 'title-tag-length-2026',
    title: 'Title tag length: what Google truncates, and what it ignores',
    focus: 'title tag length',
    date: '2026-10-25',
    updated: '2026-10-30',
    author: 'Glixtron',
    metaTitle: 'What is the Length of a Title Tag? Google\'s Limit (2026)',
    metaDesc: 'Title tag length has no official limit — Google truncates by pixel width. The practical range (50-60 chars) and when Google rewrites your title.',
    intro: 'Title tag length is usually taught as a 60-character rule. Google publishes no such limit: it truncates the title link to fit the device, so the real constraint only shows up when you preview it.',
    sections: [
      {
        h: 'What is the length of a title tag?',
        p: [
          'Google asks for a `<title>` on every page and says explicitly that there is no limit on how long the element can be. What it truncates is the title link in search results, "typically to fit the device width". So the widely quoted 60 characters is not a rule anyone enforces; it is a shorthand for the width of the space.',
          'The practical range follows from that. On a desktop result, 50 to 60 characters of ordinary text usually survives intact. On a phone, less does, because the result is narrower and the same string needs more lines than the layout allows.',
        ],
        p2: [
          'The consequence is a writing habit rather than a character limit: put the distinguishing words at the front, because the tail is what disappears first when the line is cut.',
        ],
      },
      {
        h: 'Where the 60-character rule comes from',
        p: [
          'It comes from measurement, not documentation. People measured the pixel width of the title line in desktop results, found something near 600 pixels, and divided by an average character width to get roughly 60. That estimate has been repeated for a decade because it is usually close enough.',
          'It is a proxy, and it fails in a predictable direction. Character width varies: a title of capital Ws and Ms fills the line much sooner than the same number of i and l characters. Ten wide characters can run out of room while twenty narrow ones still fit.',
        ],
        p2: [
          'That is why a preview beats a counter. The SERP Preview Tool renders the title the way a result would, so the question becomes "does this get cut" rather than "is this 61 characters".',
        ],
      },
      {
        h: 'When Google rewrites your title',
        p: [
          'Title links are generated automatically, and Google picks from several sources: the `<title>` element, the main visible heading, other large text, `og:title`, anchor text pointing at the page, and the site name in structured data. Usually it uses what you wrote. Sometimes it does not.',
          'The documented triggers are specific rather than mysterious: a half-empty title such as a lone site name, a title carrying a stale year the page has moved past, a title that does not describe the page, boilerplate repeated across many pages, no clear main heading, or a writing system that does not match the content.',
        ],
        p2: [
          'Google publishes no rewrite rate, and the third-party studies that quote one sample different query sets, so a percentage is not worth repeating. If you want a local number, compare the titles you wrote with the title links Search Console shows for your own queries.',
        ],
      },
      {
        h: 'Writing a title that survives',
        p: [
          'Be descriptive and specific about the page, not the site. One title per page, with the brand at the end behind a delimiter if it fits. Include the phrase once if it belongs in the sentence, and leave it out if forcing it would make the title read like a keyword list - stuffing is one of the documented reasons a title gets replaced.',
          'Match the query the page is for. A title that answers the searcher\'s question tends to be kept; a promotional line tends to be rewritten from the heading that actually describes the page.',
        ],
        p2: [
          'One honest note on click-through rate: it is not a documented ranking input, and Google\'s published ranking systems do not include click data. A better title earns more clicks because clicks are the point of being found, and that is a good enough reason without claiming it moves rankings.',
        ],
      },
      {
        h: 'Mistakes worth fixing today',
        p: [
          'Letting the CMS copy the H1 into the title is the most common. H1s are written for the page and are often longer, vaguer, or missing the phrase a searcher would use. Duplicate titles across pages are next: they make two pages compete for the same description and give Google a reason to generate its own.',
          'Putting the brand first pushes the page\'s subject out of the visible start. Omitting the title entirely leaves Google to build one from the URL or the first heading. And counting characters instead of previewing is the quiet one - it produces titles that pass the check and still get cut.',
        ],
        p2: [
          'Keep `<title>`, the H1 and `og:title` consistent. Any of them can be used for a title link or a social card, and three different promises on one page is how a result ends up describing something the page does not say.',
        ],
      },
      {
        h: 'A pre-publish title check',
        p: [
          'Five passes: is the phrase in there once, naturally; is the subject in the first few words; is it unique across the site; does the preview survive at desktop and mobile width; and would a person understand the page from the title alone.',
          'Changes take effect when Google recrawls, which the documentation puts at days to weeks, so a title edit is not an instant fix and repeated tweaking tells you nothing. Set it, request a recrawl, and check the result once.',
        ],
        p2: [
          'The Meta Tag Generator writes the full tag set, and the meta description length guide covers the line underneath, which has its own width problem and its own rules.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the title tag length limit?', a: 'There is no limit on the title tag itself; Google says so directly. The title link in results is truncated to fit the device width, so 50 to 60 characters is a practical desktop target rather than a rule. Mobile results cut sooner.' },
      { q: 'Does Google truncate title tag length by pixels or characters?', a: 'Pixel width. The title link is cut to fit the space, and characters are not equally wide, so a title of Ws and Ms runs out of room well before one made of i and l characters. Character counts are an approximation; a preview is the real check.' },
      { q: 'Will Google rewrite my title tag?', a: 'Sometimes. Google generates title links from the title element, the main heading, other prominent text, og:title, anchor text and the site name. It is more likely to rewrite a half-empty, stale, inaccurate or boilerplate title, or a page with no clear main heading.' },
      { q: 'Does the title tag affect rankings?', a: 'It is used to understand and describe a page, but it is not a switch you can optimise for a large ranking gain. The measurable effect is on clicks: a specific, accurate title gets chosen more often than a vague one. Click-through rate is not a documented ranking input.' },
      { q: 'How long should a title tag be for mobile?', a: 'Shorter than desktop, because the result is narrower. Aim for the essential words within roughly the first 45 to 50 characters, front-load the subject, and drop the brand suffix if it pushes the useful part out of view. Preview it rather than count it.' },
      { q: 'Should the brand name go at the start or end of the title?', a: 'At the end, behind a delimiter, unless the brand is what the searcher typed. Leading with the brand spends the visible part of the title on something the domain line already shows, and pushes the page subject into the part that gets truncated.' },
    ],
    relatedTools: ['meta-tag-generator', 'serp-preview-tool', 'meta-description-checker', 'open-graph-generator'],
    relatedGuides: ['meta-description-length-2026', 'internal-linking', 'website-launch-seo-checklist'],
    links: [
      { label: 'Google: influencing title links', url: 'https://developers.google.com/search/docs/appearance/title-link' },
      { label: 'Google: control your snippets', url: 'https://developers.google.com/search/docs/appearance/snippet' },
    ],
  },
  {
    slug: 'url-slug-best-practices',
    title: 'URL slug best practices: hyphens, case and the parts Google reads',
    focus: 'url slug',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'URL Slug Best Practices: Hyphens, Case and Length',
    metaDesc: 'A URL slug is read by people before it is read by Google. Hyphens not underscores, one case, fewer parameters, and how to change one without losing the page.',
    intro: 'A URL slug is the readable tail of a URL, and most of the advice about it is folklore. Google publishes a short list of requirements and one clear preference: hyphens, not underscores.',
    sections: [
      {
        h: 'What a URL slug is, and what Google actually documents',
        p: [
          'The slug is the part of the path that names the page: in `/blog/url-slug-best-practices/`, the slug is the last segment. It is a label for humans, and it is also a string a crawler compares against other strings, which is why small conventions matter more than clever keyword placement.',
          'Google\'s URL structure documentation is narrower than the advice built on top of it. It asks for URLs that follow IETF STD 66, avoids fragments that change content, and recommends a common encoding for parameters. Descriptive words, hyphens, case and parameters are filed under "make it easy to understand".',
        ],
        p2: [
          'Nothing in that document assigns a ranking weight to keywords in a URL. If you have read that keywords in the slug are a meaningful ranking factor, the claim is not in Google\'s guidance. The honest version is that a clear slug helps people and helps Google tell URLs apart. Write for the first reader.',
        ],
      },
      {
        h: 'Hyphens, not underscores, and pick one case',
        p: [
          'Google recommends hyphens to separate words and says explicitly that it does not recommend underscores, for a historical reason: underscores are used in programming to keep words together, as in `format_date`, while a hyphen reads as a word boundary. `green-dress` is two words; `green_dress` is one token.',
          'Case is the quieter trap. Google treats `/APPLE` and `/apple` as distinct URLs with their own content. If your server treats them the same, normalise every internal link to one case so a crawler is not offered two versions of one page. The same applies to a trailing slash: `/pricing` and `/pricing/` are separate URLs unless a redirect says otherwise.',
        ],
        p2: [
          'A slug generator is worth using for the mechanical part — lowercase, transliteration, collapsing punctuation — because doing that by hand across a hundred pages is where inconsistency creeps in. The URL Slug Generator also strips stop words and enforces a length cap, both of which are editorial choices rather than rules.',
        ],
      },
      {
        h: 'Short, descriptive, and in the reader\'s language',
        p: [
          'Descriptive beats numeric. Google\'s own example is stark: `example.com/wiki/Aviation` against `index.php?topic=42&area=3a5ebc944f41daa6f849f730f1`. The first can be read aloud; the second cannot. That is the whole argument, and it is about comprehension rather than ranking.',
          'Use the words your audience uses, and transliterate where the script would otherwise be percent-encoded into noise. Google asks for percent encoding in `href` attributes for non-ASCII characters, so a Japanese slug is fine but the link in your HTML should be encoded.',
        ],
        p2: [
          'There is no published length limit for a slug. The practical ceiling comes from elsewhere: long URLs get truncated in chat apps, analytics reports and shared links, and the useful words are at the cut. Keep the distinguishing words first and the slug survives wherever it is pasted.',
        ],
      },
      {
        h: 'The slug is rarely the problem — the duplicates are',
        p: [
          'Most URL problems are not about the words in the path but about how many paths reach one page. Session IDs, referral parameters, sort orders and filter combinations each mint a new URL for identical content. Google\'s documentation lists exactly these as causes of an unnecessarily high URL count, and warns that the cost is crawl bandwidth.',
          'Fragments are the other silent multiplier. Google generally does not support URLs that change content after the hash: `/#/pricing` is not a page as far as Search is concerned, and the documented alternative is the History API so each state gets a real path.',
        ],
        p2: [
          'The fix is not a prettier slug. It is a canonical tag for the variants you must keep, a robots.txt rule for the ones you never want crawled, and permanent redirects for the ones that used to be real pages. The canonical and redirect guides cover each of those in turn.',
        ],
      },
      {
        h: 'Changing a slug without losing the page',
        p: [
          'If a slug has to change, the old URL should return a 301 to the new one, permanently. A redirect is the strongest canonicalisation signal Google documents — stronger than a `rel="canonical"` tag — because it says the old address is gone rather than offering a preference.',
          'Then update what points at it: internal links, the sitemap, the canonical tag on the page itself, and any campaign links you control. A redirect that still has fifty internal links pointing at the old URL is a redirect that keeps being needed.',
        ],
        p2: [
          'Do not reuse a retired slug for unrelated content. The redirect, the inbound links and whatever the old URL earned all travel to the new page, and if the topic changed, that is confusing for readers and for the crawler. Pick a new slug and let the old one redirect to its closest successor.',
        ],
      },
      {
        h: 'A ten-minute slug check',
        p: [
          'Generate the slug, then check five things: it is lowercase and hyphenated, it is short enough to read, it contains the words a person would search for, it does not encode in the path what belongs in a query string, and the page declares itself canonical at exactly that URL.',
          'Then check the redirect from the old slug, if there was one, and confirm the sitemap lists the new URL only. The URL Slug Generator handles the string, the Canonical Tag Generator writes the self-referencing tag, and the redirect generator plus the Web Crawler Audit cover the move. Ten minutes now is cheaper than explaining a 404 to a client next month.',
        ],
      },
    ],
    faqs: [
      { q: 'What is a URL slug?', a: 'The last readable segment of a URL path. In `example.com/blog/url-slug-best-practices/`, the slug is `url-slug-best-practices`. It names the page for humans and gives crawlers a stable string to reference.' },
      { q: 'Should a URL slug contain keywords?', a: 'It should contain the words a person would use to describe the page, which usually includes the topic. Google\'s URL documentation makes no ranking-weight claim for keywords in the path, so treat the slug as clarity rather than a ranking lever, and never stuff it.' },
      { q: 'Hyphens or underscores in a URL slug?', a: 'Hyphens. Google recommends hyphens to separate words and explicitly does not recommend underscores, because underscores conventionally join words in programming. `green-dress` reads as two words; `green_dress` reads as one.' },
      { q: 'Does changing a URL slug affect SEO?', a: 'It can, if the old URL is not redirected. A 301 carries the old address to the new one and is the strongest canonicalisation signal Google documents. Without it, inbound links and any accumulated signals stay attached to a URL that now returns 404.' },
      { q: 'Should I remove stop words from a slug?', a: 'It is cosmetic. There is no documented benefit to dropping "the" or "for" from a path, and removing a word can make the slug harder to read. Keep the words that make the URL understandable and drop the ones that do not.' },
      { q: 'How long should a URL slug be?', a: 'There is no published limit. The real constraint is where the URL gets truncated — chat apps, analytics, shared links — so front-load the distinguishing words and keep the path as short as it can be while staying descriptive.' },
    ],
    relatedTools: ['url-slug-generator', 'canonical-tag-generator', 'htaccess-redirect-generator', 'web-crawler-audit'],
    relatedGuides: ['htaccess-301-redirect', 'rel-canonical-tag', 'internal-linking'],
    links: [
      { label: 'Google: URL structure best practices', url: 'https://developers.google.com/search/docs/crawling-indexing/url-structure' },
      { label: 'IETF STD 66 (RFC 3986): URI syntax', url: 'https://www.rfc-editor.org/rfc/rfc3986.html' },
      { label: 'Google: redirects and Search', url: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
    ],
  },
  {
    slug: 'rel-canonical-tag',
    title: 'rel=canonical in practice: a hint, four rules, and what breaks it',
    focus: 'canonical tag',
    date: '2026-10-25',
    updated: '2026-10-30',
    author: 'Glixtron',
    metaTitle: 'What is rel=canonical? Rules & Free Tag Generator (2026)',
    metaDesc: 'rel=canonical tells Google which URL is the master version. Learn the 4 rules, what breaks it, and how to check which URL Google chose. Free generator.',
    intro: 'The canonical tag is the most misunderstood link element in SEO: a preference Google weighs rather than an instruction it obeys, and the ways it breaks are almost all silent.',
    sections: [
      {
        h: 'What is rel=canonical?',
        p: [
          'A `rel="canonical"` link element says: among these URLs with the same content, prefer this one. Google calls it a strong signal, ranked below a redirect and above sitemap inclusion — and it is a signal, not a directive. Google can and does choose a different URL when other evidence is stronger.',
          'That ranking decides which tool to reach for. A redirect is strongest because it removes the old URL from the conversation. A canonical keeps both URLs alive and states a preference. Listing a URL in a sitemap is a weaker nudge in the same direction.',
        ],
        p2: [
          'Google also applies signals you never wrote: HTTPS over HTTP, and membership in an hreflang cluster. A canonical that contradicts either is the one that loses.',
        ],
      },
      {
        h: 'The four rules that make the tag work',
        p: [
          'Absolute URL. Google supports relative paths and recommends against them, because the failure mode is a staging copy or a proxy resolving them somewhere unexpected.',
          'Head only. A canonical link in the body is ignored. If JavaScript adds it, Google asks that the element be injected properly and that the HTML source not contain a different canonical — one URL in the markup and another in script is the clearest way to have neither honoured.',
          'Self-reference. The canonical page should carry a canonical tag pointing at itself. It looks redundant and is not: it asserts that this URL is the intended one and stops a template-level tag from nominating something else.',
          'One method. Do not send a canonical HTTP header and a canonical link element with different URLs. Pick one; the header exists mainly for non-HTML files such as PDFs.',
        ],
        pre: '<link rel="canonical" href="https://example.com/dresses/green-dresses" />',
        p2: [
          'Two conditions come from the hreflang side: the canonical should be in the same language as the page, and internal links should point at the canonical URL rather than a duplicate. A canonical that the site\'s own navigation contradicts is a suggestion the site is arguing with.',
        ],
      },
      {
        h: 'What silently invalidates a canonical',
        p: [
          '`rel="canonical"` carrying `hreflang`, `lang`, `media` or `type` is not used for canonicalisation at all. Google says those attributes mark alternate versions, not canonical ones, and `rel="alternate"` is the element for that job.',
          'Canonical chains also dilute. If A points to B and B points to C, Google has to resolve the hop, and the chain is usually a symptom of a template edited in two places. Point every duplicate straight at the final URL.',
        ],
        p2: [
          'The rest of the list is about the target. A canonical pointing at a URL that redirects, returns 404, is blocked by robots.txt or carries noindex is pointing at something that cannot be canonical. Google may still index URLs disallowed in robots.txt, without their content, which is why robots.txt is explicitly not a canonicalisation tool.',
        ],
      },
      {
        h: 'When a canonical is the wrong tool',
        p: [
          'If the page moved, redirect. If the page should not appear at all, noindex. A canonical is for two live URLs with substantially the same content where one should represent the other: tracking-parameter variants, print views, sort orders, syndicated copies.',
          'Do not use a canonical to fix pagination. Page two of a list is not a duplicate of page one — it contains different items — and canonicalising it to page one removes those items from the index. Self-canonical each page and let the links do the work.',
        ],
        p2: [
          'And do not pair a canonical with noindex on the same URL. Google advises against using noindex to select a canonical within a site, because noindex removes the page from Search rather than nominating a replacement. Use rel=canonical for duplicates and noindex for pages you want gone.',
        ],
      },
      {
        h: 'Checking which URL Google chose',
        p: [
          'In Search Console, URL Inspection reports the "Google-selected canonical" for a URL. If it is not the one in your tag, the tag is losing to something: another signal, a redirect, or the absence of a self-reference.',
          'Then check the plumbing: view source for a second canonical, `curl -sI` for a `Link:` header that disagrees, and the sitemap for a third opinion. All three should name the same URL.',
        ],
        p2: [
          'The Web Crawler Audit reports the canonical a page declares alongside its status and redirect chain, which is enough to catch the common case: a template writing a canonical that no longer matches the page it is on.',
        ],
      },
      {
        h: 'A ten-minute canonical audit',
        p: [
          'Pick the URL that should win. Confirm it returns 200, is not noindex, and carries a self-referencing canonical. Confirm every duplicate points at it in one hop, in the head, as an absolute URL, with no hreflang attribute on the same element. Confirm the sitemap lists only the winner and that internal links agree.',
          'The Canonical Tag Generator writes the element, the XML Sitemap Generator keeps the sitemap honest, and the .htaccess redirect guide covers the URLs that should not exist at all. The rest is consistency, which is the only part Google actually rewards.',
        ],
      },
    ],
    faqs: [
      { q: 'Is rel=canonical a directive?', a: 'No. Google describes it as a strong signal and may select a different URL when other evidence outweighs it. A redirect is stronger because it removes the old URL; a canonical keeps both alive and states a preference.' },
      { q: 'Should a page have a canonical tag pointing to itself?', a: 'Yes. A self-referencing canonical states that this URL is the intended one and stops a template-level tag from nominating something else. Google recommends including it on the canonical page itself.' },
      { q: 'Can a canonical tag point to another domain?', a: 'It can, and Google treats it as a hint. Cross-domain canonicals are common for syndicated content, but they are easy to ignore when the two sites differ in navigation, links or content. A redirect is a stronger statement when you control both.' },
      { q: 'Can I use canonical and noindex together?', a: 'Google advises against using noindex to choose a canonical within a site, because noindex removes the page from Search entirely rather than nominating a replacement. Use rel=canonical for duplicates and noindex for pages you want gone.' },
      { q: 'Where does the canonical tag go?', a: 'In the <head>. A rel=canonical link in the body is ignored. Use an absolute URL, and if you inject it with JavaScript, do not also ship a different one in the HTML source.' },
      { q: 'How long does Google take to honour a canonical?', a: 'Google publishes no timeframe. It is applied when the URL is recrawled and the signals are re-evaluated, which is why a canonical change is confirmed in URL Inspection rather than assumed after a deploy.' },
    ],
    relatedTools: ['canonical-tag-generator', 'web-crawler-audit', 'sitemap-generator', 'htaccess-redirect-generator'],
    relatedGuides: ['htaccess-301-redirect', 'url-slug-best-practices', 'why-is-my-site-not-indexed', 'http-status-codes-seo'],
    links: [
      { label: 'Google: specify a canonical URL', url: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls' },
      { label: 'Google: what URL canonicalization is', url: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization' },
      { label: 'RFC 6596: the canonical link relation', url: 'https://www.rfc-editor.org/rfc/rfc6596.html' },
    ],
  },
  {
    slug: 'hreflang-basics',
    title: 'hreflang basics: codes, reciprocity and the x-default fallback',
    focus: 'hreflang',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'Hreflang Basics: Codes, Reciprocity and x-default',
    metaDesc: 'Hreflang tells Google which language and region a page is for, but only if every version links back. The codes, the fallback, and what voids a cluster.',
    intro: 'Hreflang is a set of links between language versions of one page, and it only works as a set. A single correct tag proves nothing; one missing return link voids the pair.',
    sections: [
      {
        h: 'What hreflang does — and the two things it does not',
        p: [
          'Hreflang declares that several URLs are localized versions of the same content and states the language, and optionally the region, each one serves. Google uses the annotations to return the version matching a searcher\'s language and location.',
          'It is not language detection. Google says plainly that it does not use hreflang, or the HTML lang attribute, to work out what language a page is written in; that comes from its own analysis. And it is not a ranking boost: the annotations choose among pages that already exist in the index.',
        ],
        p2: [
          'The alternative is a URL structure that makes targeting obvious — a country-code domain, or a subdirectory such as `/de/`. Those help readers, and hreflang still does the explicit mapping, because Google does not infer a target audience from a subdomain name.',
        ],
      },
      {
        h: 'The codes: language first, region second',
        p: [
          'The value is an ISO 639-1 language code and, optionally, an ISO 3166-1 Alpha-2 region, separated by a hyphen. `de` is German anywhere; `de-AT` is German for Austria; `pt-BR` is Portuguese for Brazil.',
          'A region on its own is invalid, because the first code is always the language. That is why `be` means Belarusian rather than Belgium: Belgian French is `fr-BE`, Belgian Dutch is `nl-BE`, Belgian German is `de-BE`. Google also ignores regions that are not assigned country codes, including `UK`, `EU` and `UN`.',
        ],
        p2: [
          'Two more edges: `es-419` for Latin American Spanish is not supported because it is not an ISO 3166-1 code, and script variants use ISO 15924, so `zh-Hant` and `zh-Hans` are valid with an optional region after them. Codes are case-insensitive; uppercase regions are the convention.',
        ],
      },
      {
        h: 'Reciprocity: the rule that voids the whole cluster',
        p: [
          'Every version must list itself and every other version. If page A points at page B and B does not point back, Google ignores the annotations — an anti-hijack rule, so another site cannot declare itself your alternate.',
          'The URLs must be fully qualified, scheme included: `https://example.com/de/`, not `//example.com/de/` or `/de/`. They do not have to be on the same domain, which is what makes hreflang usable across a `.de` site and a `.com` site.',
        ],
        pre: [
          '<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/" />',
          '<link rel="alternate" hreflang="en-US" href="https://example.com/en-us/" />',
          '<link rel="alternate" hreflang="en" href="https://example.com/en/" />',
          '<link rel="alternate" hreflang="x-default" href="https://example.com/" />',
        ].join('\n'),
        p2: [
          'In practice a broken cluster is usually a template that emits only the other languages, so no page lists itself, or a new locale added to one template and not the rest. Both look fine on the page you happen to be reading.',
        ],
      },
      {
        h: 'x-default, and the generic-language page',
        p: [
          '`x-default` marks the page for visitors whose language matches nothing in the cluster: usually a language selector or a global landing page. It is not a substitute for a real version and does not need a language code of its own.',
          'For a language with several regional variants, add a generic version too. If you have `en-GB`, `en-US` and `en-AU`, an `en` page gives everyone else an English target instead of falling through to `x-default`. Google recommends exactly this catch-all.',
        ],
        p2: [
          'The fallback is also where auto-redirecting home pages get dangerous: a visitor who lands on a redirect rather than a choice may never see the version they wanted, and a crawler may never see the others.',
        ],
      },
      {
        h: 'Three ways to publish it, and why one is enough',
        p: [
          'HTML `<link>` elements in the head, an HTTP `Link` header, or `<xhtml:link>` entries in the sitemap. Google treats the three as equivalent and says there is no Search benefit to running more than one — only more places to drift.',
          'The header is the option for non-HTML files such as PDFs. The sitemap option is convenient when the cluster is large and generated. The HTML option is easiest to inspect in view-source, which is why most sites use it.',
        ],
        p2: [
          'Do not combine hreflang with other attributes on the same link element. A `<link rel="alternate" hreflang="de" media="...">` is not a valid combination, and a `rel="canonical"` carrying an `hreflang` attribute is ignored for canonicalisation altogether.',
        ],
      },
      {
        h: 'Debugging a cluster without the old report',
        p: [
          'Search Console used to have an International Targeting report with a country setting and a language tab. Google deprecated it in 2022, so there is no site-wide hreflang error list to read; validation now means fetching the pages and comparing the sets.',
          'Check four things: every page lists every version including itself; every `href` is absolute; every code is a real language, optionally followed by a real region; and the canonical on each page points at that page rather than at a sibling language. That last one is the classic own-goal — a cluster where every member canonicalises to the English page.',
        ],
        p2: [
          'The Hreflang Tag Generator builds the block from a list of URLs and codes, and the Hreflang Checker reads a page and reports duplicates, malformed codes and missing self-reference. Neither can see the other pages, which is why reciprocity stays a manual check.',
        ],
      },
    ],
    faqs: [
      { q: 'What is hreflang?', a: 'An annotation telling Google that several URLs are localized versions of the same page, and which language and optionally which region each serves. It can be expressed as link elements, an HTTP header or sitemap entries, and it only works when the pages point at each other.' },
      { q: 'Does hreflang improve rankings?', a: 'No. It selects among pages that already exist in the index; it does not add ranking weight. What it improves is the match between a searcher\'s language or region and the version they land on.' },
      { q: 'What happens if hreflang tags are not reciprocal?', a: 'Google ignores the annotations. If page A names page B but B does not name A, the pair is unconfirmed — otherwise any site could declare itself an alternate of yours. Every version must list itself and all the others.' },
      { q: 'Is x-default required?', a: 'No, but it is recommended when you have a language selector or a global page, because it gives visitors whose language is not in the cluster somewhere deliberate to land. It is not a replacement for a real localized version.' },
      { q: 'Can hreflang link to a different domain?', a: 'Yes. The URLs must be fully qualified but do not need to share a domain, which is how a country-code domain and a .com can be declared alternates of each other.' },
      { q: 'Where should hreflang tags go?', a: 'In the <head> as link elements, in an HTTP Link header, or in the sitemap. Google treats the methods as equivalent and sees no benefit in using more than one. Do not attach other attributes such as media to an hreflang link.' },
    ],
    relatedTools: ['hreflang-tag-generator', 'hreflang-checker', 'canonical-tag-generator', 'sitemap-generator'],
    relatedGuides: ['rel-canonical-tag', 'website-launch-seo-checklist', 'screaming-frog-alternative'],
    links: [
      { label: 'Google: tell Google about localized versions', url: 'https://developers.google.com/search/docs/specialty/international/localized-versions' },
      { label: 'Google: managing multi-regional sites', url: 'https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites' },
      { label: 'Google: specify a canonical URL', url: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls' },
    ],
  },
  {
    slug: 'xml-sitemap-best-practices',
    title: 'XML sitemap best practices: limits, lastmod and what Google ignores',
    focus: 'xml sitemap',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'XML Sitemap Best Practices: Limits, lastmod and Submission',
    metaDesc: 'An XML sitemap is a discovery hint, not a ranking factor. The 50,000-URL limit, what Google ignores, how lastmod works, and how to submit one.',
    intro: 'An XML sitemap is a list of URLs you want crawled, wrapped in a format search engines agreed on in 2005. It is a discovery hint rather than a ranking factor, and most sitemap advice blurs that line.',
    sections: [
      {
        h: 'What an XML sitemap is, and what it is not',
        p: [
          'The protocol is small. An XML file declares a `<urlset>`, and each page is one `<url>` with a `<loc>` holding the absolute address. Three optional children follow: `<lastmod>`, `<changefreq>` and `<priority>`. Everything else in sitemap advice is commentary on those four elements.',
          'What a sitemap does is help discovery. Google’s documentation treats submission as a hint that a URL exists; it does not promise a crawl, and it does not promise indexing. A page that returns noindex, a redirect or a 404 in a sitemap is not a shortcut, it is a contradiction the crawler has to resolve.',
        ],
      },
      {
        h: 'The protocol limits, and the ones Google adds',
        p: [
          'The protocol caps a single file at 50,000 URLs or 50 MB uncompressed, whichever comes first. A sitemap index file has the same limits and can list up to 50,000 sitemaps. Splitting by section — tools, guides, categories — keeps each file small and makes the per-sitemap reporting in Search Console readable.',
          'Google adds requirements the protocol leaves open. The file must be UTF-8, every URL must be fully qualified, and a sitemap hosted in a subdirectory covers only descendants of that directory unless you submit it through Search Console. That last rule is why a sitemap belongs at the site root.',
        ],
      },
      {
        h: 'lastmod, changefreq and priority: what actually gets used',
        p: [
          'Google ignores `<changefreq>` and `<priority>` outright. The first is a guess about editing rhythm; the second is relative and defaults to 0.5. Neither changes crawling nor ranking, and filling them in is busywork that makes a file look more precise than it is.',
          '`<lastmod>` is the one Google uses, and only while it stays trustworthy. The value is read when Google can verify it against the page’s actual last significant change, and the field may stop being trusted site-wide if every URL claims to have changed today. A deploy that rewrites the timestamp without changing the page is the fastest way to make it worthless.',
        ],
      },
      {
        h: 'The mistakes that make a sitemap useless',
        p: [
          'The common failure is a sitemap full of URLs that should not be there: redirects, 404s, noindex pages, robots-blocked paths and parameter variants of a canonical page. Each one spends crawl attention and tells Google something the page itself denies. The sitemap should list the canonical, indexable, 200-status URL and nothing else.',
          'The quieter failures are structural. An unescaped ampersand breaks the XML parser. A relative `<loc>` is resolved differently than you expect. A sitemap generated once and never regenerated drifts out of date while still looking valid. And two sitemaps covering the same URLs with different `lastmod` values create a contradiction no validator will flag.',
        ],
      },
      {
        h: 'Submitting an XML sitemap, and the ping that no longer exists',
        p: [
          'Announce the file in `robots.txt` with an absolute `Sitemap:` line, then submit the same URL in Search Console and Bing Webmaster Tools. The robots.txt line is a hint for every crawler that reads the file; Search Console is where you see whether Google fetched it and how many URLs it discovered.',
          'The old ping endpoint is gone. Google deprecated `/ping?sitemap=` in June 2023 and stopped answering it at the end of that year, so a script that still calls it gets a 404 and a false sense of having submitted something. IndexNow is a separate protocol used by Bing, Yandex and a few others; Google does not participate, so it is not a replacement.',
        ],
      },
      {
        h: 'A ten-minute XML sitemap audit',
        p: [
          'Take twenty URLs from the sitemap and check four things: the status is 200, the canonical points at the same URL, the page is indexable, and `lastmod` matches a real change. Then compare the sitemap count with the number Search Console reports as discovered, and read the coverage reasons for the difference.',
          'The XML Sitemap Generator writes the file and the index, the Web Crawler Audit confirms a URL’s status and canonical, and the Robots.txt Generator keeps the `Sitemap:` line from being buried under a disallow. Ten minutes of sampling catches the errors a validator cannot see.',
        ],
      },
    ],
    faqs: [
      { q: 'Is an XML sitemap a ranking factor?', a: 'No. It is a discovery hint. Google’s documentation says submission does not guarantee crawling or indexing, and no ranking weight is assigned to the file itself.' },
      { q: 'Do I need a sitemap?', a: 'Not always. A small site with clean internal links can be discovered without one. It earns its place on large sites, new sites, orphan pages and any site where internal linking is weak.' },
      { q: 'What are the XML sitemap limits?', a: '50,000 URLs or 50 MB uncompressed per file, whichever comes first. A sitemap index has the same limits and can list up to 50,000 sitemaps, each of which may hold 50,000 URLs.' },
      { q: 'Does Google use changefreq and priority?', a: 'No. Google ignores both elements. It uses lastmod when the value is consistently and verifiably accurate, and an unreliable lastmod may be ignored site-wide.' },
      { q: 'Does submitting a sitemap guarantee indexing?', a: 'No. It helps discovery and can influence which canonical URL Google shows, but indexing still depends on the page being crawlable, indexable and worth including.' },
      { q: 'Is the sitemap ping endpoint still available?', a: 'No. Google deprecated it in June 2023 and it stopped working at the end of that year. Submit through Search Console or the robots.txt Sitemap directive instead.' },
    ],
    relatedTools: ['sitemap-generator', 'web-crawler-audit', 'robots-txt-generator', 'seo-score-checker'],
    relatedGuides: ['why-is-my-site-not-indexed', 'internal-linking', 'htaccess-301-redirect', 'robots-txt-for-search-and-ai-crawlers'],
    links: [
      { label: 'sitemaps.org: the XML sitemap protocol', url: 'https://www.sitemaps.org/protocol.html' },
      { label: 'Google: build and submit a sitemap', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap' },
      { label: 'Google: the sitemaps ping endpoint is going away', url: 'https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping' },
    ],
  },
  {
    slug: 'test-structured-data',
    title: 'How to test structured data: two validators, two different questions',
    focus: 'structured data',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'Test Structured Data: Rich Results Test & Schema Validator',
    metaDesc: 'Test structured data with Google\'s Rich Results Test and Schema Markup Validator. What each checks, what neither catches, and when to validate. Free tools.',
    intro: 'Testing structured data is not one check. One validator asks whether Google can use the markup for a rich result; the other asks whether the markup is valid schema.org at all.',
    sections: [
      {
        h: 'Two validators for structured data, two different questions',
        p: [
          'The Rich Results Test belongs to Google and answers a product question: is this page eligible for one of the search features Google supports? The Schema Markup Validator belongs to schema.org and answers a vocabulary question: is this a well-formed instance of the vocabulary, regardless of whether Google uses it?',
          'Both are useful and neither replaces the other. A block can be schema-valid and ineligible for any rich result, and a block can pass the Rich Results Test while containing properties schema.org does not define. Running one and calling the markup tested is how people end up surprised in Search Console.',
        ],
      },
      {
        h: 'What the Rich Results Test actually checks',
        p: [
          'The Rich Results Test accepts a URL or a code snippet, renders JavaScript, and lists the feature types it detected. It checks Google’s required and recommended properties for those features, and it reports errors separately from warnings. A warning is usually a missing recommendation, not a reason the markup is ignored.',
          'It only knows the features Google supports. “No items detected” on a valid Organization block is not an error, because Organization markup is not a rich result. The test also cannot judge whether the page deserves the feature, only whether the markup meets the published requirements.',
          'It also shows the parsed items it found, which is the fastest way to see whether a CMS emitted one clean block or three overlapping ones.',
        ],
      },
      {
        h: 'What the Schema Markup Validator adds',
        p: [
          'The Schema Markup Validator checks syntax and vocabulary: malformed JSON, a missing `@context`, an unknown type, a property used with the wrong value type, a date that is not a date. It is the tool that catches a typo the Rich Results Test may silently skip because the property is optional for Google.',
          'It does not apply Google’s eligibility rules or content policies. A FAQPage block for questions that are not visible on the page can be schema-valid and still violate Google’s structured data policies. Validity is necessary; it is not sufficient.',
        ],
      },
      {
        h: 'The structured data errors worth fixing first',
        p: [
          'Fix required properties first, because those decide whether a feature can appear at all: `headline`, `image` and `datePublished` on an article; `offers` and `price` on a product; `itemListElement` on a breadcrumb. Then fix types and nesting, where a string sits where an object belongs or an `@id` reference points at nothing.',
          'Then check the policy layer. Markup must describe content a user can see, must not be hidden, and must not claim reviews or ratings the page does not show. Those are not syntax errors, which is why a validator can pass a page Google will ignore.',
        ],
      },
      {
        h: 'Test the structured data that is deployed, not the draft',
        p: [
          'Test the live URL, not the template in your editor. The URL test fetches the page as Googlebot would, including JavaScript-generated JSON-LD; the code test only sees the text you paste. A staging site behind authentication cannot be fetched, so paste the source for a syntax check and test the production URL after deploy.',
          'Test the canonical URL rather than a tracking variant, and confirm the page is not noindex or blocked. After a fix, expect a delay: recrawling, reprocessing and the appearance of a rich result are separate steps, and the enhancement reports in Search Console are where to watch them.',
          'A redirect is another false negative: the tools follow it and report on the destination, which may be a different template from the one you meant to check.',
        ],
      },
      {
        h: 'A ten-minute structured data validation pass',
        p: [
          'Pick one URL per template — home, article, product, FAQ — and run both validators. Fix errors, read warnings, and confirm every claim in the markup is visible on the page. Then inspect the same URL in Search Console to see what Google actually parsed.',
          'The Schema Markup Generator builds the block, the Rich Results Tester checks the pasted JSON-LD against the required and recommended properties before you hand it to Google, the Web Crawler Audit confirms the deployed page returns 200 with that block in place, and the SEO Score Checker covers the surrounding metadata. The pass is short because the point is template coverage, not every URL.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the difference between the Rich Results Test and the Schema Markup Validator?', a: 'The Rich Results Test checks whether Google can use the markup for a supported rich result. The Schema Markup Validator checks whether the JSON-LD, microdata or RDFa is valid schema.org. One tests eligibility, the other tests the vocabulary.' },
      { q: 'Does valid structured data guarantee a rich result?', a: 'No. Valid markup makes a page eligible; Google still decides whether to show the enhancement. Missing required properties, invisible content or a feature Google does not support will prevent it even when the syntax is perfect.' },
      { q: 'Is structured data a ranking factor?', a: 'Not directly. Google describes it as a way to make pages eligible for richer appearances. It can improve how a result looks and how clearly the page is understood, but it is not a score added to the ranking.' },
      { q: 'Why does the Rich Results Test show no items detected?', a: 'Either the page has no markup for a feature Google supports, the markup is generated in a way the test cannot see, or the feature is not one Google shows as a rich result. Organization and other non-feature types routinely report nothing.' },
      { q: 'Can I test structured data by pasting JSON-LD?', a: 'Yes, both tools accept a code snippet. Use the snippet for syntax checks and the URL test for the final check, because the URL test renders the page and sees markup that only exists after JavaScript runs.' },
      { q: 'Do I need to validate every page?', a: 'No. Validate one URL per template and any page with unusual markup. Templates repeat, so a fix at the template level covers thousands of URLs; page-by-page validation spends time on the same code.' },
    ],
    relatedTools: ['schema-markup-generator', 'rich-results-tester', 'web-crawler-audit', 'seo-score-checker', 'serp-preview-tool'],
    relatedGuides: ['schema-markup-for-ai-search', 'website-launch-seo-checklist', 'screaming-frog-alternative'],
    links: [
      { label: 'Google: Rich Results Test', url: 'https://search.google.com/test/rich-results' },
      { label: 'schema.org: Schema Markup Validator', url: 'https://validator.schema.org/' },
      { label: 'Google: structured data general guidelines', url: 'https://developers.google.com/search/docs/appearance/structured-data/sd-policies' },
    ],
  },
  {
    slug: 'http-status-codes-seo',
    title: 'HTTP status codes that change what Google does with a URL',
    focus: 'http status code',
    date: '2026-10-25',
    updated: '2026-10-25',
    author: 'Glixtron',
    metaTitle: 'HTTP Status Codes and Google: 301, 404, 410, 429, 503',
    metaDesc: 'A status code does not rank a page, but it decides whether Google crawls, indexes, redirects or drops it. The codes that matter, and the soft 404 mistake.',
    intro: 'An HTTP status code is the server’s first sentence about a URL, and Google acts on it before it reads the page. The difference between 301 and 302, or 404 and 410, changes what happens next.',
    sections: [
      {
        h: 'The HTTP status code is read before the content',
        p: [
          'Every response begins with a three-digit code. Google’s crawlers use it to decide whether to follow, fetch, process or drop the URL; the content only matters after that decision. A 200 response moves a URL into the indexing pipeline, where indexing is still not guaranteed.',
          'None of this is a ranking factor in the sense of a score. A status code controls access and consolidation: whether a URL stays in the index, whether its signals move to another URL, and whether the crawler comes back. Confusing that with ranking is how people end up redirecting pages that should simply return 404.',
        ],
      },
      {
        h: '301 and 308 versus 302 and 307',
        p: [
          '301 and 308 are permanent; 302 and 307 are temporary. Google treats 301 and 308 the same, and 302 and 307 the same. The permanent pair is a strong signal that the target should be processed and that the old URL’s signals belong there; the temporary pair is a weak signal and keeps the old URL in play.',
          'Use a permanent redirect when the move is permanent, and redirect straight to the final URL. Google’s crawlers follow up to ten hops by default, but each hop is a request and a chance to fail, and a chain usually means a template was changed in two places. The method distinction between 307 and 302 matters for non-GET requests; for ordinary pages it rarely does.',
        ],
      },
      {
        h: '404 and 410: both removals, same treatment',
        p: [
          'Google treats all 4xx codes except 429 the same way: the content is ignored, and an indexed URL is removed. The 404 versus 410 distinction is semantic — “not found” against “gone” — not a faster-removal switch. Google’s documentation is explicit that newly encountered 404 pages are not processed at all.',
          'What does matter is returning a real 4xx. A “not found” page served with 200 is a soft 404: Google sees a successful response with no useful content, and Search Console reports it as an error anyway. Redirecting every missing URL to the homepage is the other common mistake; it turns a clear removal into a confusing duplicate.',
        ],
      },
      {
        h: '429 and 5xx: slow down, do not disappear',
        p: [
          '429 and 5xx are server-side signals, and Google treats them as temporary. Crawlers slow down, already indexed URLs are preserved for a while, and content from a 5xx response is ignored. When the server returns 2xx again, the crawl rate recovers gradually rather than instantly.',
          'Use 503 with `Retry-After` for planned maintenance instead of serving a 200 holding page. A brief outage is not a deindexing event, but a long one stops crawling and delays every other fix. Watch the Crawl Stats report for 5xx spikes before assuming a content problem.',
        ],
      },
      {
        h: 'Status codes at scale: soft 404s, chains and canonicals',
        p: [
          'At scale, status codes interact with the other signals. A redirect removes the old URL from the index; a canonical keeps it and states a preference; a noindex removes it without nominating a replacement. Picking two of those for the same URL creates the kind of contradiction that gets resolved by the crawler rather than by you.',
          'Soft 404s are the most common production bug in single-page apps: the router renders “not found” into a 200 response. Server-side rendering or a correct status from the edge fixes it. A redirect loop is the second: browsers and crawlers give up, and the URL is neither indexed nor clearly removed.',
        ],
      },
      {
        h: 'A ten-minute HTTP status code audit',
        p: [
          'Sample each template and a handful of retired URLs. The live page should return 200; an old URL should return one permanent redirect hop; a deleted page should return 404 or 410; nothing you submitted should return 5xx. Then check that the sitemap contains only the 200 URLs and that no canonical points at a redirect.',
          'The Web Crawler Audit reports the status and redirect chain for a single URL, the .htaccess Redirect Generator writes the permanent rule, and the XML Sitemap Generator keeps the submitted set honest. The SEO Score Checker is the final sweep for the pages that pass.',
        ],
      },
    ],
    faqs: [
      { q: 'Do HTTP status codes affect ranking?', a: 'Not directly. They control crawling, indexing and the consolidation of signals. A 200 page can rank or not; a 301 moves signals to the target; a 404 removes the URL from the index. None of those is a ranking score.' },
      { q: 'What is the difference between HTTP status codes 301 and 302?', a: 'A 301 is permanent and Google treats it as a strong signal that the target should be processed and inherit the old URL’s signals. A 302 is temporary, a weak signal, and keeps the old URL in play. Use 301 for moves you do not intend to reverse.' },
      { q: 'Is a 410 better than a 404 for SEO?', a: 'Not in Google’s handling. All 4xx codes except 429 are treated the same: content is ignored and indexed URLs are removed. A 410 says “gone” more precisely, which helps humans and logs, but it is not a faster removal switch.' },
      { q: 'What is a soft 404?', a: 'A response that returns 200 but shows an error or empty page. Google sees a success with no useful content and reports it as a soft 404, which is worse than a clear 404 because it looks like a valid page that should be indexed.' },
      { q: 'Does a 5xx error deindex my site?', a: 'Not immediately. Google treats 5xx as temporary: indexed URLs are preserved for a while, content is ignored and crawl rate drops. A prolonged outage can lead to removal, and crawling recovers gradually once 2xx responses return.' },
      { q: 'Should I redirect a 404 to the homepage?', a: 'Usually not. It turns a clear removal into a confusing duplicate and gives every missing URL the same target. Redirect only when a page has a genuine successor, and let the rest return 404 or 410.' },
    ],
    relatedTools: ['web-crawler-audit', 'htaccess-redirect-generator', 'sitemap-generator', 'seo-score-checker'],
    relatedGuides: ['htaccess-301-redirect', 'why-is-my-site-not-indexed', 'noindex-vs-robots-txt', 'rel-canonical-tag'],
    links: [
      { label: 'Google: how HTTP status codes affect crawling', url: 'https://developers.google.com/crawling/docs/troubleshooting/http-status-codes' },
      { label: 'RFC 9110: HTTP semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
      { label: 'Google: redirects and Search', url: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
    ],
  },
  {
    slug: 'seo-checklist-2027',
    title: 'The SEO checklist for 2027: what to fix before the year turns',
    focus: 'seo checklist 2027',
    date: '2026-11-14',
    updated: '2026-11-14',
    author: 'Glixtron',
    metaTitle: 'SEO Checklist 2027: 12 Checks Before the Year Turns',
    metaDesc: 'A 12-point SEO checklist for 2027: crawler access, titles, canonicals, schema, speed and the baseline to compare in March. Each check names the tool.',
    intro: 'December is the last cheap month to fix a site: traffic is high, campaigns pause, and anything shipped now has time to be crawled before January. This is the SEO checklist for 2027 we run, in the order that finds the expensive problems first.',
    sections: [
      {
        h: 'New year, same three questions',
        p: [
          'Search changed shape in 2026, but the underlying questions did not. Can a crawler reach the page? Does the page answer the query it was written for? Can a person or an assistant quote it without guessing? Everything on this list serves one of those three.',
          'What did change is who reads the page. Answer engines fetch and cite; training crawlers take text and return nothing measurable. That makes crawler policy a marketing decision rather than a robots.txt chore — and it is why the first checks below are about access, not keywords.',
          'The order matters. A title rewrite on a page that returns a 403 to crawlers is invisible work. Fix access, then metadata, then structure, then measurement.',
        ],
      },
      {
        h: 'Access first: can the crawler get in?',
        p: [
          'Start at the root. `robots.txt` should return 200 as plain text, name the search engines you want, and make a deliberate statement about AI crawlers rather than inheriting one from a template. Check the sitemap line points at a file that exists, and that the sitemap contains only URLs that answer 200.',
          'Then test the decision rather than trusting the file. The [robots.txt tester](/tools/robots-txt-tester/) resolves a path against the rules and shows which line wins for a named bot; the [AI crawler blocker](/tools/ai-crawler-blocker/) writes the training-block group with your domain already filled in. For a single page that should not appear in results, confirm it is crawlable enough to serve its `noindex` — a blocked page cannot communicate that.',
          'Finally, check the response itself. A page behind a login, a JavaScript shell that renders nothing, or a soft 404 all look like indexable URLs in a sitemap and behave like dead ends. The [website audit](/tools/website-audit/) runs the public-URL checks in one pass; the [crawler audit](/tools/web-crawler-audit/) shows the status, headers and canonical signals for one URL.',
        ],
      },
      {
        h: 'Titles and descriptions: rewrite the pages that already rank',
        p: [
          'Most sites do not need more pages in January; they need the pages they have to earn the click. Pull the queries where you rank in positions 5–15 with a click-through rate below the position average, and rewrite those titles first. The page is already eligible — the snippet is what is losing.',
          'Preview before you ship. Titles truncate by pixel width, not character count, and a rewritten title that cuts mid-phrase is worse than the generic one it replaced. The [SERP preview](/tools/serp-preview-tool/) shows the cut, and the [meta description checker](/tools/meta-description-checker/) flags duplicates and lengths across a batch.',
        ],
      },
      {
        h: 'Template debt: canonicals, hreflang and schema',
        p: [
          'One broken canonical on a template is a thousand broken canonicals. That is why this check belongs to the planning month: it is a single change with a large blast radius, and it needs a deploy window and a rollback plan, not a Friday afternoon.',
          'Check that every indexable page declares one canonical, that the canonical is absolute, and that it points at a 200 URL rather than a redirect. For multilingual sites, confirm hreflang reciprocity — if page A points at B, B must point back at A — and that every hreflang URL is itself canonical. Structured data is the third template: markup that no longer matches the visible page is a support ticket waiting in Search Console’s enhancement reports.',
          'The [canonical tag generator](/tools/canonical-tag-generator/), [hreflang checker](/tools/hreflang-checker/) and [schema markup generator](/tools/schema-markup-generator/) cover the three; the [guide to testing structured data](/blog/test-structured-data/) explains why the two validators disagree.',
        ],
      },
      {
        h: 'The SEO checklist for 2027, in the order to run it',
        p: [
          'This is the list we keep. Each row names the thing to look at and what a pass looks like, so it can be handed to someone else without a meeting.',
        ],
        table: {
          head: ['#', 'Check', 'Where', 'Pass looks like'],
          rows: [
            ['1', 'robots.txt reachable and intentional', '/robots.txt', '200, plain text, sitemap line, deliberate AI policy'],
            ['2', 'Sitemap contains only 200 URLs', 'Search Console → Sitemaps', 'No redirects, no 404s, no noindexed URLs'],
            ['3', 'Key pages render without JavaScript', 'View source', 'Headline and body text present in the HTML'],
            ['4', 'One canonical per template, absolute', 'Rendered head', '200 target, self-referencing on the canonical page'],
            ['5', 'hreflang reciprocity', 'Rendered head', 'Every pair points at each other, all 200'],
            ['6', 'Titles fit the pixel width', 'SERP preview', 'No truncation mid-phrase on mobile width'],
            ['7', 'Descriptions are unique', 'Meta description checker', 'No duplicates across the template'],
            ['8', 'Structured data matches the page', 'Rich results test', 'No errors, no markup for content that is not visible'],
            ['9', 'Open Graph card renders', 'OG image tester', '1200×630 image, title and description present'],
            ['10', 'Core Web Vitals in the green', 'Search Console → CWV', 'LCP under 2.5s, INP under 200ms, CLS under 0.1'],
            ['11', 'Analytics and consent still fire', 'Debug view', 'Page view and conversion events, no duplicate hits'],
            ['12', 'Baseline exported', 'Search Console', 'Clicks, impressions and CTR saved for a March comparison'],
          ],
        },
        p2: [
          'Twelve checks is roughly an afternoon for a small site and a week for a large one, which is the honest trade. The list is deliberately ordered by cost of not doing it: access problems waste every later fix, and measurement problems make the rest unfalsifiable.',
        ],
      },
      {
        h: 'Export a baseline before you change anything',
        p: [
          'The useful comparison in March is against a number you wrote down now. Export Search Console performance for the last three months and the last twelve, note index coverage, and record Core Web Vitals for each template. Without that, every later result is a story rather than a measurement.',
          'Then change one thing at a time where possible. Title rewrites are cheap and fast; canonical and hreflang changes are neither. If you do both in the same week and traffic moves, you will not know which one did it — and next December you will be running this checklist without knowing which of last year’s fixes worked.',
        ],
      },
    ],
    faqs: [
      { q: 'What should an SEO checklist for 2027 contain?', a: 'Access first (robots.txt, sitemaps, renderability), then metadata (titles, descriptions), then template structure (canonicals, hreflang, schema), then speed and analytics — and a saved baseline so the results can be compared later.' },
      { q: 'When should I run the 2027 SEO checklist?', a: 'Late November or early December, before January planning locks the quarter. The fixes have time to be crawled and the baseline is fresh, so a March comparison measures your work rather than the holiday season.' },
      { q: 'How long does a year-end SEO audit take?', a: 'An afternoon for a small site with a handful of templates, up to a week for a large one. Most of the time goes into deciding what to change, not finding it: template fixes need a deploy window and a rollback plan.' },
      { q: 'Should I block AI crawlers before 2027?', a: 'It depends on whether you want your content used for training. Blocking training crawlers (GPTBot, ClaudeBot, CCBot) does not affect Google rankings, but it can remove you from anything built on that data. Answer-engine fetchers are how assistants cite and link you, so blocking those costs citations.' },
      { q: 'Is it worth rewriting titles that already rank?', a: 'Usually yes, when the page ranks in positions 5–15 with a low click-through rate. The page is already eligible for the query; the snippet is what is losing the click. Rewrite those before writing new pages.' },
      { q: 'Do I need to fix everything before January?', a: 'No. Fix access problems and anything that blocks crawling, and put template changes on the January schedule where they can be tested properly. A rushed canonical change is worse than a known-correct one shipped in February.' },
    ],
    relatedTools: ['robots-txt-tester', 'website-audit', 'serp-preview-tool', 'meta-description-checker'],
    relatedGuides: ['website-launch-seo-checklist', 'title-tag-length-2026', 'core-web-vitals', 'rel-canonical-tag'],
    links: [
      { label: 'Google: Search Console performance report', url: 'https://support.google.com/webmasters/answer/7576553' },
      { label: 'Google: Core Web Vitals and page experience', url: 'https://developers.google.com/search/docs/appearance/core-web-vitals' },
      { label: 'Google: sitemap best practices', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap' },
    ],
  },
  {
    slug: 'year-end-website-audit',
    title: 'A year-end website audit you can finish in one afternoon',
    focus: 'year-end website audit',
    date: '2026-11-14',
    updated: '2026-11-14',
    author: 'Glixtron',
    metaTitle: 'Year-End Website Audit: One Afternoon, Six Checks',
    metaDesc: 'Run a year-end website audit in one afternoon: crawlability, status codes, metadata, schema, speed and analytics. The order, the evidence, and what to skip.',
    intro: 'A year-end audit is not a full technical review. It is a dated check of the things that silently break during a year of deploys, so January starts from a known state instead of a rumour. Six checks, one afternoon, a written record.',
    sections: [
      {
        h: 'What a year-end audit is for',
        p: [
          'Sites drift. A plugin update changes a template, a campaign appends tracking parameters to internal links, a redirect chain grows one hop per quarter, and nobody notices because the page still loads for a person with a warm cache. None of these show up as an outage; they show up as a slow decline nobody can attribute.',
          'The purpose of the audit is to catch drift while it is still cheap: fix a template once instead of a thousand pages later, and write down the state you fixed it from. It is also the one time of year when traffic patterns are unusual enough that a drop is easy to notice and hard to explain — so you want a baseline, not a guess.',
        ],
      },
      {
        h: 'Check 1 and 2: crawling and status codes',
        p: [
          'Fetch `/robots.txt` and read it as a crawler would. It should return 200 with a `text/plain` type, not an HTML error page — a Soft 404 for robots.txt is treated as no file at all. Confirm the `Sitemap:` line resolves, and that the file does not accidentally disallow a directory you launched this year.',
          'Then sample each template and every URL you retired during the year. A live page should return 200; an old URL should return one permanent redirect to the final target; a deleted page should return 404 or 410. Chains of two or more redirects are the most common finding here, and the fix is a single rule pointing at the final URL.',
          'The [crawler audit](/tools/web-crawler-audit/) reports the status and redirect chain for a single URL; the [sitemap validator](/tools/sitemap-validator/) checks that the submitted set answers 200; the [.htaccess redirect generator](/tools/htaccess-redirect-generator/) writes the replacement rule in the right order.',
        ],
      },
      {
        h: 'Check 3 and 4: metadata and structured data',
        p: [
          'Metadata rots quietly. The title tag that fit in January is too long after a rebrand added a suffix; the description on fifteen product pages is the same sentence; the Open Graph image still shows last year’s logo. These are cheap to fix and directly affect the click, which is why they belong in the year-end pass rather than a “someday” backlog.',
          'Structured data drifts for the same reason: the markup was written to match the page, and then the page changed. Run the templates through a rich-results validator and treat any warning as a description of drift. The [meta tag generator](/tools/meta-tag-generator/) and [Open Graph generator](/tools/open-graph-generator/) produce the tags in one pass; the [OG image tester](/tools/og-image-tester/) shows how the card renders before you ship it.',
        ],
      },
      {
        h: 'Check 5: speed, measured on the template that matters',
        p: [
          'Do not audit 500 pages. Pick the template that carries the most traffic — usually the homepage, a product or article template, and one category — and measure those. Core Web Vitals are field metrics, so the Search Console report is the one to read: LCP under 2.5 seconds, INP under 200 milliseconds, CLS under 0.1 at the 75th percentile.',
          'When a template fails, look at what changed rather than what is theoretically heavy. A hero image that grew during a redesign, a font added for one campaign, a chat widget loaded sitewide — these show up as a single regression with a date. The [image compressor](/tools/image-compressor/) handles the most common cause without a design review, and the [guide to Core Web Vitals](/blog/core-web-vitals/) explains what each metric is actually measuring.',
        ],
      },
      {
        h: 'Check 6: analytics, consent and the events you rely on',
        p: [
          'Every audit should end by checking that the measurement still works. A consent banner update, a tag-manager change or a domain migration can halve your data without touching the site’s appearance. Open a debug view and confirm that a page view fires once, that the conversion event still has its parameters, and that internal links do not carry campaign parameters that overwrite the real source.',
          'The [UTM link builder](/tools/utm-link-builder/) keeps the parameter set consistent; the [guide to UTM naming conventions](/blog/utm-naming-conventions/) is the reference to check a year of accumulated tags against.',
        ],
      },
      {
        h: 'Write it down, then wait',
        p: [
          'Close the audit with a dated page: what was checked, what was found, what was changed, and what was deliberately left alone. That page is the input to next year’s audit and the first place to look when a metric moves in February.',
          'Resist fixing everything in the same week. The value of a year-end audit is a clean starting state, and a clean state is easier to reason about when only one thing changed at a time. Park the template rewrites for the January planning cycle and keep the audit’s scope to what can be verified today.',
        ],
      },
    ],
    faqs: [
      { q: 'How long should a year-end website audit take?', a: 'An afternoon for six checks across a handful of templates. The point is not exhaustiveness: it is a dated, verifiable snapshot of the things that drift during a year.' },
      { q: 'What is the most common finding in a year-end audit?', a: 'Redirect chains and stale metadata. Both accumulate silently through a year of deploys and campaign tags, and both are cheap to fix once you look for them.' },
      { q: 'Do I need a crawler for a year-end audit?', a: 'Not for the six checks here, which cover one URL or one template at a time. A crawler earns its place when you need to confirm a template fix across thousands of pages after the change.' },
      { q: 'Should a year-end audit include content pruning?', a: 'It can start the conversation, but pruning deserves its own pass. Deleting or merging pages changes what the site says; that is an editorial decision, not a maintenance check.' },
      { q: 'What should be in the audit record?', a: 'The date, the URLs and templates checked, the status and metadata found, what changed, and what was deliberately left alone. A month later, the “left alone” list is the part that saves an argument.' },
    ],
    relatedTools: ['website-audit', 'web-crawler-audit', 'sitemap-validator', 'og-image-tester'],
    relatedGuides: ['core-web-vitals', 'image-seo', 'xml-sitemap-best-practices', 'open-graph-image-size-2026'],
    links: [
      { label: 'Google: Core Web Vitals thresholds', url: 'https://web.dev/articles/vitals' },
      { label: 'Google: robots.txt introduction', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
      { label: 'Google: redirects and Search', url: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
    ],
  },
  {
    slug: 'content-pruning-before-january',
    title: 'Content pruning before January: consolidate, do not delete',
    focus: 'content pruning',
    date: '2026-11-14',
    updated: '2026-11-14',
    author: 'Glixtron',
    metaTitle: 'Content Pruning: Merge or Redirect, Do Not Bulk Delete',
    metaDesc: 'Content pruning without the deleting: find consolidation candidates in Search Console, merge or redirect them, and measure before and after. No bulk deletes.',
    intro: 'Every December someone proposes deleting the blog. The instinct is right — a site with hundreds of overlapping pages is harder to maintain and harder to trust — but content pruning is a publishing decision made page by page, and deletion is the last step, not the first.',
    sections: [
      {
        h: 'What content pruning is, and what it is not',
        p: [
          'Google does not apply a site-wide penalty for having low-traffic pages. A page with no clicks is not evidence of a problem; most pages on most sites get no clicks, and that is normal. Removing content does not automatically lift rankings, and bulk-deleting a section can remove pages that were quietly earning links or answering long-tail queries.',
          'What actually helps is consolidation: fewer, better pages that each answer a question completely. That is an editorial change — merging two thin posts into one strong one — and it happens to reduce the page count as a side effect, not as the goal.',
        ],
      },
      {
        h: 'Find candidates with evidence, not with a page-count target',
        p: [
          'Start in Search Console performance, filtered to pages. Sort by impressions and look for three patterns. First, near-duplicates: several pages ranking for the same query and splitting the click. Second, pages with impressions but almost no clicks — often a good page with a bad title, which needs a rewrite, not removal. Third, pages with neither impressions nor links, and content that is genuinely superseded.',
          'Only the third group is a pruning candidate, and even then the answer is usually “merge into the page that already covers this”, not “delete”. Export the list with clicks, impressions and the queries attached; a decision without the query text is a guess about what the page was for.',
          'A fourth signal cuts across all three: internal links. A page that three other pages link to is load-bearing even with no search traffic, because it passes authority and gives readers somewhere to go. Before you touch it, check what links in — and if the answer is “nothing”, that is itself evidence the page was never part of the site.',
        ],
      },
      {
        h: 'Three actions, in order of preference',
        p: [
          '**Merge.** Take the useful paragraphs from the weaker page, add them to the stronger one, and redirect the weaker URL to it with a 301. This keeps the links, keeps the queries, and produces a page that is more complete. It is the default action for overlapping content.',
          '**Redirect.** When a page has no unique content but has inbound links or history, a permanent redirect to the closest surviving page preserves most of what it earned. Redirect to one final URL, not through a chain, and only when the target genuinely covers the topic — a redirect to the homepage is not a consolidation, it is a soft 404 with extra steps.',
          '**Remove.** Only when nothing is worth keeping: no unique information, no links, no impressions, and no successor page. Return 404 (or 410) and let the URL leave the index. This is the rarest of the three, and it should never be a batch operation on a folder.',
        ],
      },
      {
        h: 'Keep the sitemap and internal links honest',
        p: [
          'A consolidation is not finished until the site stops pointing at the old URL. Remove it from the sitemap, update internal links to the new target, and check that the redirect resolves in one hop. Leaving the old URL in the sitemap is the most common way a tidy-up turns into a crawl-error report in January.',
          'The [sitemap generator](/tools/sitemap-generator/) regenerates the submitted set from the live site; the [redirect generator](/tools/htaccess-redirect-generator/) writes the rules in the correct order; the [internal linking guide](/blog/internal-linking/) covers how to move the links without losing the anchor text that made the page rank.',
        ],
      },
      {
        h: 'Measure before and after, and give it a quarter',
        p: [
          'Record clicks, impressions and the top queries for every page you touch, before the change. Then wait. Consolidation usually shows up as impressions moving to the surviving URL within a few weeks and clicks following if the merged page is genuinely better. A drop in total impressions with a rise in clicks is a good outcome: you removed redundant results and kept the demand.',
          'If nothing moves in a quarter, the merge was neutral — which is still better than carrying two pages that compete with each other. Judge the project on the surviving pages, not on the number you deleted.',
        ],
      },
    ],
    faqs: [
      { q: 'What is content pruning?', a: 'Consolidating overlapping or superseded pages into fewer, stronger ones — usually by merging and redirecting — so each topic is answered by one page. Deleting pages is only the last option, and the rarest.' },
      { q: 'Does deleting low-traffic pages improve SEO?', a: 'Not by itself. Google does not penalise a site for having pages that get no clicks, and removing content does not automatically lift rankings. Merging overlapping pages into one stronger page is what usually helps.' },
      { q: 'Should I delete or redirect a pruned page?', a: 'Redirect when the page has links or history and a genuine successor. Delete only when there is no unique content, no links and nothing worth merging. Redirect to one final URL, not to the homepage.' },
      { q: 'When is the best month to do content pruning?', a: 'Late November to mid-December, before a planning cycle. Traffic is seasonal and the change has time to settle before January reporting, so the site you plan around is the site you have.' },
      { q: 'How do I know pruning worked?', a: 'Track clicks and impressions for the pages you touched and for the surviving targets. Impressions shifting to the surviving URL within a few weeks is the expected outcome; total clicks should hold or rise.' },
    ],
    relatedTools: ['sitemap-generator', 'htaccess-redirect-generator', 'web-crawler-audit', 'keyword-density-checker'],
    relatedGuides: ['internal-linking', 'htaccess-301-redirect', 'http-status-codes-seo', 'xml-sitemap-best-practices'],
    links: [
      { label: 'Google: managing your site’s content', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
      { label: 'Google: page removals from Search', url: 'https://support.google.com/webmasters/answer/1663419' },
      { label: 'Google: 301 redirects', url: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
    ],
  },
];

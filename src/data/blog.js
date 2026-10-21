// Tools4Market — blog articles (guides). Build-time data; every string is user-facing.
// Each article targets one phrase (focus), links into the matching tool, and carries
// FAQPage + Article/BlogPosting + BreadcrumbList structured data (added in build.mjs).

export const ARTICLES = [
  {
    slug: 'robots-txt-for-search-and-ai-crawlers',
    title: 'robots.txt for search engines and AI crawlers: a complete guide',
    focus: 'robots.txt for ai crawlers',
    date: '2026-10-21',
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
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
          'The crawler list grew a category in 2024: alongside Googlebot and Bingbot there are now training crawlers (GPTBot, Google-Extended, ClaudeBot, Bytespider, Amazonbot, CCBot, MistralAI-Training), answer-engine fetchers (PerplexityBot, ChatGPT-User, Claude-User, Amazonbot-User, Google-Extended), and AI agents (Applebot-Extended, meta-externalagent, cohere-ai, Diffbot). They are not interchangeable: one may be used to train a model, another to fetch pages live and cite them in an answer, and a third to index your pages for an assistant to read on demand.',
          'That distinction decides your policy. Many publishers now want training crawlers blocked while allowing the answer-engine fetchers that send real readers to the site, because those fetchers are the traffic. Our **AI Crawler Blocker** tool generates a robots.txt with per-bot presets for exactly this split — block training, allow search and answer engines — and our **robots.txt generator** covers the classic search-bot side.',
        ],
      },
      {
        h: 'Templates: allow everything, block the training bots, block everything',
        p: [
          '**Allow everything** is the default and is right for most sites: a single `User-agent: * / Allow: /` group plus a sitemap line. If you have nothing to hide and you want AI citations and traffic, blocking training crawlers costs you nothing you can measure.',
          '**Block the training bots, keep the readers** is the pattern most content sites now use. Group the training crawlers together and disallow them, then allow the general group. The `Google-Extended` token is Google\'s opt-out for Gemini training and Vertex AI grounding, and it is independent of `Googlebot`, so blocking it does not affect your search rankings.',
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
      { q: 'Should I block GPTBot and other AI training crawlers?', a: 'It depends on your business. Blocking training crawlers protects your content from being used to train models; allowing answer-engine fetchers such as PerplexityBot or ChatGPT-User keeps you visible in AI answers, where many readers now arrive first. Both are defensible — just decide deliberately rather than copying a template.' },
      { q: 'Does blocking Google-Extended hurt my Google rankings?', a: 'No. Google-Extended is Google\'s separate opt-out for Gemini training and Vertex AI grounding. It is not Googlebot, and blocking it does not affect your search rankings or indexing in Google.' },
      { q: 'Where should the robots.txt file live?', a: 'At the root of the domain, with the exact path https://yourdomain.com/robots.txt. Sub-domain or sub-folder locations are not read by crawlers.' },
      { q: 'How long does it take for a robots.txt change to take effect?', a: 'Crawlers re-read the file on their next visit, often within days, but there is no guaranteed deadline. Google caches it for roughly 24 hours, and other crawlers may take longer. Search Console\'s robots.txt report shows when Google last read your file.' },
    ],
    relatedTools: ['robots-txt-generator', 'ai-crawler-blocker', 'llms-txt-generator', 'sitemap-generator'],
    links: [
      { label: 'Google: robots.txt intro', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
      { label: 'Google: robots.txt meta tag', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/meta-tag' },
      { label: 'Google: remove a page from the index', url: 'https://developers.google.com/search/docs/crawling-indexing/block-indexing' },
    ],
  },
  {
    slug: 'website-launch-seo-checklist',
    title: 'The website launch SEO checklist (everything to do before you publish)',
    focus: 'website launch seo checklist',
    date: '2026-10-21',
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
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
      { q: 'How long does it take for a new site to rank?', a: 'There is no fixed timeline. Technical fixes are picked up in days to weeks, and meaningful traffic usually takes months of consistent content and links. Small, focused sites can rank within weeks for long-tail queries; competitive head terms take far longer. Treat the website launch SEO checklist as day-one work, not a week-one project.' },
      { q: 'Do I need a sitemap if my site is small?', a: 'A sitemap helps crawlers find every page, especially on a new site with few internal links. It is cheap to generate and it lets you submit URLs directly, so yes — keep one. It is item four of this website launch SEO checklist for a reason.' },
      { q: 'Should my staging site be indexed?', a: 'No. Password-protect it or use a robots.txt disallow on the staging hostname, and make sure the disallow is not carried over to the live domain — that mistake can de-index a launch.' },
      { q: 'What is the most common launch mistake?', a: 'Copying the staging robots.txt or canonical settings to the live domain, which leaves the site blocked or pointing canonicals at the wrong host. Check both files again on launch day.' },
      { q: 'Do I need Schema markup to rank?', a: 'Schema is not a direct ranking factor, but it makes your pages eligible for rich results and it tells search engines what the page is about. Add it where it is accurate — incorrect markup can hurt.' },
    ],
    relatedTools: ['meta-tag-generator', 'robots-txt-generator', 'sitemap-generator', 'serp-preview-tool', 'schema-markup-generator'],
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
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
    metaTitle: 'How to Block GPTBot — robots.txt Rules That Work',
    metaDesc: 'How to block GPTBot with four lines of robots.txt, which OpenAI bots still get through, and what blocking does to your visibility in ChatGPT.',
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
        h: 'How to block GPTBot: the exact robots.txt',
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
        ],
      },
      {
        h: 'The two bots around it: OAI-SearchBot and ChatGPT-User',
        p: [
          'If your goal is "no training, keep the readers", block GPTBot and explicitly allow the two search-side bots. If your goal is total invisibility to OpenAI, block all three — knowing that this also removes you from ChatGPT search and its citations.',
          'Our **AI Crawler Blocker** generates exactly this split: per-bot presets that block training crawlers while leaving search and answer-engine bots allowed, plus the matching allow rules so nothing is blocked by accident.',
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
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
    metaTitle: 'llms.txt Explained: Who Reads It, Who Ignores It',
    metaDesc: 'What llms.txt is, which AI tools fetch it, why Google ignores it, and an honest test for deciding whether your site needs one at all.',
    intro: 'llms.txt is a proposed markdown file at the root of your domain that curates what an AI model should read first. It is also one of the most over-sold files in SEO right now, so this guide separates what llms.txt is, who actually fetches it, and when one is worth publishing.',
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
        ],
      },
      {
        h: 'How to write one that is actually useful',
        p: [
          'Keep it under a page. Link only real, public, current URLs. Write one-line notes that say what each linked page answers, because that note is what a model reads when deciding whether to fetch the link. Update it when pages move — a stale llms.txt is worse than none, because it actively misleads the few readers it has.',
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
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
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
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
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
          'Our **Web Crawler Audit** automates exactly this: it fetches the page like a crawler, checks the robots.txt rules that apply to Googlebot, verifies sitemap evidence, and reports indexability signals — a fast way to catch layer-1 and layer-3 failures without touching a terminal.',
        ],
      },
      {
        h: 'Keep a per-bot decision table',
        p: [
          'Write your policy down as five columns — bot, owner, purpose, allowed?, where enforced (robots.txt / CDN / both). New AI crawlers ship every quarter; when one appears, you decide once, in the table, instead of guessing in a panic on a Friday.',
          'Our **AI Crawler Blocker** maintains this matrix for the crawlers that matter and generates the matching robots.txt from your choices, so the file and the policy can never drift apart.',
        ],
      },
    ],
    faqs: [
      { q: 'How do I check which AI crawlers are blocked?', a: 'Fetch your /robots.txt as plain text, find each bot\'s user-agent group (GPTBot, ClaudeBot, PerplexityBot and so on), and apply its Disallow rules; if a bot has no group, the User-agent: * rules apply. Then check your CDN or WAF logs, because network-level blocks apply even when robots.txt allows a bot.' },
      { q: 'Why does robots.txt look correct but AI crawlers still never visit?', a: 'Almost always an edge block: a CDN bot-protection toggle, an AI-bot blocking feature, a managed challenge or a rate limit returning 403/429 before your page is ever served. These ignore robots.txt entirely and must be fixed in the CDN or firewall settings.' },
      { q: 'Is blocking AI crawlers bad for SEO?', a: 'No. Google rankings depend on Googlebot access, not on GPTBot or ClaudeBot. Blocking training crawlers only affects AI-side training and, if you block the search-side bots too, your visibility inside those AI answers.' },
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
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
    metaTitle: 'noindex vs robots.txt: Which to Use and When',
    metaDesc: 'noindex vs robots.txt explained: why a blocked page cannot be de-indexed, and which method fits each job on your site.',
    intro: 'noindex and robots.txt disallow are the two ways to keep pages out of Google — and using the wrong one is the most common indexing mistake we see. One says "don\'t show this in results", the other says "don\'t even fetch it". The difference is one sentence, and it decides everything.',
    sections: [
      {
        h: 'noindex vs robots.txt: the one-sentence difference',
        p: [
          '**robots.txt controls fetching.** `Disallow: /private/` asks crawlers not to request those URLs at all. **noindex controls showing.** A `noindex` meta tag (or `X-Robots-Tag` header) lets the crawler fetch the page and asks it not to include the URL in search results.',
          'Same goal, opposite mechanics — and the mechanics are why the two cannot be combined on the same URL.',
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
        ],
      },
      {
        h: 'When noindex is the right tool',
        p: [
          'Use noindex for pages that **are crawled and linked but should not rank**: thin tag archives, thank-you and confirmation pages, expired but still-linked content, internal-only pages behind no login. Keep them crawlable so Google can see the directive and drop the URL on its own.',
          'For non-HTML files — PDFs, spreadsheets, videos — use the `X-Robots-Tag: noindex` HTTP header instead of a meta tag. Our **Meta Tag Generator** emits a correct robots meta block, and the **Web Crawler Audit** reports response-level noindex detection when you fetch a URL.',
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
    links: [
      { label: 'Google: robots.txt introduction', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro' },
      { label: 'Google: robots meta tag, data-nosnippet and X-Robots-Tag', url: 'https://developers.google.com/search/docs/crawling-indexing/robots/meta-tag' },
    ],
  },
  {
    slug: 'why-is-my-site-not-indexed',
    title: 'Why is my site not indexed? The real causes and fixes',
    focus: 'why is my site not indexed',
    date: '2026-10-21',
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
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
      { q: 'How long does Google take to index a new site?', a: 'Anywhere from a few days to several weeks. A correct sitemap, a couple of internal links and a healthy robots.txt speed it up; requesting indexing on key URLs after those checks can nudge the first crawl. There is no guaranteed timeline.' },
      { q: 'Does submitting a sitemap guarantee indexing?', a: 'No. A sitemap is a discovery hint. Google still decides whether to crawl and index each URL, and repeatedly resubmitting an unchanged sitemap has no effect.' },
      { q: 'Why does Search Console say "Crawled — currently not indexed"?', a: 'Google fetched the page and chose not to include it — usually thin or duplicate value, a noindex directive, a canonical elsewhere, or a soft-404-like experience. Improve the page\'s distinct value and its internal links; the status updates after the next crawl.' },
      { q: 'Can robots.txt stop my site from being indexed?', a: 'Yes — a broad Disallow blocks crawling, and for a new site that means no content is ever seen. For pages already indexed, blocking robots.txt can leave them listed anyway, which is why noindex (kept crawlable) is the right tool for de-indexing.' },
      { q: 'Will more content or more backlinks get my pages indexed?', a: 'Links and genuine authority help discovery and selection, and unique content gives Google a reason to index. But fix technical blocks first — links to an uncrawlable page accomplish nothing.' },
    ],
    relatedTools: ['web-crawler-audit', 'sitemap-generator', 'robots-txt-generator', 'seo-score-checker'],
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
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
    metaTitle: 'UTM Naming Conventions for Clean GA4 Reports',
    metaDesc: 'utm naming conventions that keep GA4 clean: lowercase rules, a source/medium vocabulary and the mistakes that create "(direct)" traffic.',
    intro: 'Broken UTM naming conventions do not fail loudly — they fail quietly, by splitting one campaign into five rows in GA4 and sending real traffic to "(direct)". A small set of utm naming conventions, applied every time, prevents almost all of it. Here are the rules, the vocabulary, and the template.',
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
        ],
      },
      {
        h: 'Seven utm naming conventions that prevent 90% of the mess',
        p: [
          'One: **lowercase everything**, always. Two: **no spaces** — use hyphens, never `%20`. Three: no ampersands, apostrophes or commas; they break URLs or render badly in exports. Four: keep values under about 40 characters so tables stay readable. Five: one shared naming sheet that everyone copies from — no memory-typed values. Six: never tag internal links between your own pages; that overwrites the real referrer and poisons session source. Seven: decide the paid-brand convention once (`google` / `cpc` / `brand-spring-2026`) and never deviate.',
          'Write the seven rules into the same document as your campaign calendar, and link it every time someone asks "how do I tag this?"',
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
          'Pair it with a quarterly audit: list every source/medium in GA4, diff it against your naming sheet, and delete or merge stray values going forward.',
        ],
      },
    ],
    faqs: [
      { q: 'Are UTM parameters case-sensitive in GA4?', a: 'Yes. GA4 treats values as exact, case-sensitive strings, so Newsletter and newsletter become separate campaign values. Lowercasing every UTM value is the single highest-value naming convention.' },
      { q: 'What is the difference between utm_source and utm_medium?', a: 'utm_source is the platform the link lives on (newsletter, linkedin, youtube); utm_medium is the marketing channel type (email, social, cpc, referral). Source answers "where", medium answers "what kind".' },
      { q: 'Why is my tagged traffic showing as "(direct)" in GA4?', a: 'The most common causes are a broken or missing utm_source, parameters stripped by a redirect between the click and the final page, or links pasted into apps that drop query strings. Tag the final destination URL and test one link end-to-end.' },
      { q: 'Should I add UTM tags to internal site links?', a: 'No. Tagging internal links overwrites the session\'s original source and makes attribution worse. Tag only links on external surfaces that point into your site.' },
      { q: 'How long should UTM values be?', a: 'Keep each value short and readable — under about 40 characters. Long values do not break tracking, but they wreck report readability and invite inconsistent abbreviations.' },
    ],
    relatedTools: ['utm-link-builder', 'url-encoder-decoder', 'case-converter'],
    links: [
      { label: 'Google: collected traffic sources and channels (GA4)', url: 'https://support.google.com/analytics/answer/9756891' },
      { label: 'Google: URL building for campaigns', url: 'https://support.google.com/analytics/answer/10917986' },
    ],
  },
  {
    slug: 'schema-markup-for-ai-search',
    title: 'Schema markup for AI search: what actually helps',
    focus: 'schema markup for ai search',
    date: '2026-10-21',
    author: 'Tools4Market Editorial',
    reviewer: 'Tools4Market',
    metaTitle: 'Schema Markup for AI Search: What Actually Helps',
    metaDesc: 'Schema markup for AI search: what structured data really does for AI Overviews and citations, and the types worth adding first.',
    intro: 'Every week someone sells "AI search schema" as a magic visibility switch. The truth is more useful: schema markup for AI search genuinely helps machines understand your pages, Google has said plainly that AI features need no special markup, and a short honest list of schema types earns almost all of the real value. Here is that list, in priority order.',
    sections: [
      {
        h: 'What schema markup for AI search can actually do',
        p: [
          'Structured data is a vocabulary — schema.org in JSON-LD — for stating what a page **is**: an article, a product with a price, an FAQ with answers, a step in a breadcrumb trail. It removes guesswork for any system that reads the page: search engines, and the retrieval pipelines behind answer engines.',
          'What it does not do is act as a ranking switch. Google\'s own guidance for AI features says there is nothing special to implement — no new markup, no new protocol — beyond letting pages be crawled and serving people-first content. Structured data supports understanding; it does not substitute for a page that genuinely answers the question.',
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
    links: [
      { label: 'Google: structured data introduction', url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' },
      { label: 'Google: AI features and your website', url: 'https://developers.google.com/search/docs/appearance/ai-features' },
    ],
  },
];

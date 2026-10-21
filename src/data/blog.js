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
];

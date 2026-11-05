// Tools4Market — SEO & Meta tool definitions (build-time data)
import { f, outputBlock, outputArea, note, dynRow, groupBox } from './helpers.js';

export const TOOLS_SEO = [
  // ---------------------------------------------------------- 1
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    cat: 'seo',
    icon: '🏷️',
    card: 'Build a complete, SEO-ready meta head block in seconds.',
    usedFor: 'for shipping complete meta tags on every new page',
    updated: '2026-10-22',
    pickWhy: 'Fill the fields once and get a complete, validated head block — title, description, canonical, robots and Open Graph — ready to paste into any template.',
    pickSample: `<title>Free Robots.txt Generator — With AI Crawler Presets</title>
<meta name="description" content="Free robots.txt generator with per-bot control…">
<link rel="canonical" href="https://example.com/tools/robots-txt-generator/">
<meta property="og:title" content="Free Robots.txt Generator">`,
    keywords: 'meta tag generator html head title description',
    focus: 'meta tag generator',
    h1: 'Free Meta Tag Generator — No Signup, No Limits',
    metaTitle: 'Free Meta Tag Generator — Create SEO Head Tags Online',
    metaDesc: 'Generate title, description, robots, canonical and Open Graph meta tags with a live Google preview. Free online meta tag generator, no signup.',
    intro: 'This meta tag generator fills in your page details and returns a clean, copy-paste-ready HTML head block with a simple text preview. Google may still choose different title and snippet text for each query.',
    sections: [
      { h: 'What this meta tag generator does', p: ['Every page needs a small set of tags in its <head> for search engines, social networks and browsers to understand it: a title, a meta description, robots instructions and a canonical URL. This generator assembles them for you with correct syntax and quoting.', 'The preview shows the title and description you entered; it is not a live Google result or a prediction of what Google will display. Google can build a title link from several page signals and may use a page passage instead of your description. There is no fixed title or description length that guarantees display.'] },
      { h: 'How to use it', p: ['Enter a distinct, accurate title and a useful page-specific description, then add the canonical URL for that page. Choose the robots directive — leave it on “index, follow” unless the page should stay out of search. Then copy the generated block into the <head> section of your HTML, just before the closing </head> tag.', 'If your site runs on WordPress, paste the tags into your SEO plugin’s advanced fields instead of editing theme files directly. After publishing, inspect the page source and use Search Console to review the search appearance and performance recorded for real queries.'] },
      { h: 'Choosing the right robots directive', p: ['Leave the directive on index, follow for every page you want in search results — homepages, product pages, blog posts, category listings. Switch to noindex only when a page genuinely should stay out of Google: an internal thank-you page, a filtered utility URL, a staging duplicate. Nofollow is rarely the answer you want, because it stops link equity flowing out rather than keeping the page itself out of the index.', 'Leave the charset and viewport boxes ticked: UTF-8 keeps accents, currency symbols and emoji intact, and the viewport tag is what stops your page rendering as a shrunken desktop site on phones. Add the author field when the page has a named writer, since it is cheap context for search engines. Tick the Open Graph option too if you are not generating social tags separately — the output nests them in the right order for Facebook and LinkedIn.'] },
      { h: 'Mistakes to avoid', p: ['The most common failure is one generic title copied across every page. “Home | Example Company” says little about the page. Write a distinct title around the page’s actual topic and make the important words clear near the start; do not rely on a character or pixel cutoff to predict what a search result will show.', 'A description written as a comma-separated list of keywords is hard to read and may not fit the query. Summarize what the visitor gets in natural language, then check that the page itself supports the claim. Finally, confirm the canonical URL is the intended preferred address; it is a hint to search engines, not a command that guarantees which URL they index.'] },
    ],
    faqs: [
      { q: 'What is a meta tag?', a: 'Meta tags are snippets of HTML that describe a page to search engines and browsers. They live in the <head> section and are not visible on the page itself. The most important ones for SEO are the title, meta description, robots and canonical tags.' },
      { q: 'What is the ideal meta description length?', a: 'Google does not specify a fixed description length. Write a concise, page-specific summary; Google may shorten it or generate the snippet from page content for a particular query. The meta tag generator here passes your text through as written.' },
      { q: 'Are meta keywords still used by Google?', a: 'No. Google has ignored the meta keywords tag since 2009. It is harmless but pointless — include it only if other engines or internal tooling require it.' },
      { q: 'Do I need to add these tags to every page?', a: 'Yes — every indexable page should have a unique title and description. The meta tag generator produces the same head block for any URL, so treat the output as a template and write new copy for each page. Duplicate titles confuse search engines and reduce click-through rate.' },
      { q: 'What is the difference between Open Graph and Twitter Card tags?', a: 'Open Graph tags are read by Facebook, LinkedIn and most social platforms; Twitter Card tags are read by X. X falls back to Open Graph when Twitter Cards are missing, so Open Graph is the priority — this generator emits both.' },
    ],
    html: `
${f.text('mt-title', 'Page title', 'Best Free Marketing Tools for 2026 — Tools4Market')}
${f.text('mt-desc', 'Meta description', 'Discover 50+ free browser-based marketing tools. No signup, no limits — run them right in your browser.')}
${f.url('mt-canonical', 'Canonical URL', 'https://example.com/free-marketing-tools')}
${f.text('mt-author', 'Author (optional)', 'Jane Doe')}
${f.select('mt-robots', 'Robots directive', [
      { v: 'index, follow', l: 'index, follow (default)' },
      { v: 'noindex, follow', l: 'noindex, follow' },
      { v: 'index, nofollow', l: 'index, nofollow' },
      { v: 'noindex, nofollow', l: 'noindex, nofollow' },
    ])}
<div class="field-row">
${f.check('mt-charset', 'Add charset (UTF-8)', true)}
${f.check('mt-viewport', 'Add responsive viewport tag', true)}
</div>
${f.check('mt-og', 'Include basic Open Graph tags', true)}
<div class="seo-preview-card seo-preview-card--google">
  <div class="seo-preview-head"><span class="seo-preview-thumb" aria-hidden="true"></span><span class="seo-preview-name">Google search result</span></div>
  <div class="seo-preview-url" id="mt-prev-url">example.com</div>
  <div class="seo-preview-title" id="mt-prev-title">Page title</div>
  <div class="seo-preview-desc" id="mt-prev-desc">Meta description…</div>
  <div class="seo-preview-meta"><span>About this result</span><span>Preview estimate only</span></div>
</div>
${outputBlock('mt-out', 'Head HTML')}`,
  },

  // ---------------------------------------------------------- 2
  {
    slug: 'open-graph-generator',
    name: 'Open Graph Generator',
    cat: 'seo',
    icon: '📱',
    card: 'Make links unfurl beautifully on Facebook, LinkedIn and WhatsApp.',
    usedFor: 'for social share cards that actually unfurl',
    updated: '2026-10-22',
    keywords: 'open graph generator og tags facebook preview linkedin',
    focus: 'open graph generator',
    h1: 'Free Open Graph Generator — No Signup, No Limits',
    metaTitle: 'Free Open Graph Generator — OG Tags + Live Preview',
    metaDesc: 'This open graph generator builds your og: tags with a live Facebook-style preview, so links look deliberate on Facebook, LinkedIn or WhatsApp. Free.',
    intro: 'This open graph generator creates the og: tags for your page and shows exactly how your link card will look when someone shares it on Facebook, LinkedIn, WhatsApp or Slack.',
    sections: [
      { h: 'Why Open Graph tags matter', p: ['When a URL is shared without Open Graph tags, social platforms guess: they pick a random image or none at all, and the title may be wrong. A link card with a sharp image, a clear title and one line of description gets measurably more clicks — the difference between a share that converts and one that scrolls past.', 'The og:title, og:description, og:image and og:url properties are read by Facebook, LinkedIn, WhatsApp, Discord, Slack, Telegram and most messaging apps. og:type tells platforms whether the page is a website, an article, a video or a product.'] },
      { h: 'How to use this open graph generator', p: ['Paste your page URL, add the title and description you want shown, and give an absolute image URL (at least 1200×630 pixels for best results). Choose the og:type, copy the generated tags into your <head>, then validate the result with the Facebook Sharing Debugger or LinkedIn Post Inspector after publishing.', 'Images must be publicly reachable over HTTPS — images on a private drive or behind a login will show an empty card.'] },
      { h: 'Choosing the right og:type', p: ['og:type sets the category the platform files your link under, and the wrong choice changes how the card is rendered. Use website for homepages and static landing pages, article for blog posts and news, product for individual items with a price, profile for a person or company page, and video when the page is mainly a player. If nothing else fits, website is the safe default — platforms rarely penalise it.', 'og:site_name and og:url matter more than they look. The site name sits on the card as the source line, so use the name people actually recognise rather than an internal company string. The URL should be the canonical address of the page — the same one you put in the canonical tag — so shares, comments and engagement accrue to one stable link instead of scattering across parameter variants.'] },
      { h: 'How to check your work', p: ['Fill the fields and watch the preview panel: it mirrors the card layout, so if the title wraps to three lines or the image crops oddly, fix it before you publish. The preview is the fast check; the real check happens once the page is live. Copy the URL and run it through the Facebook Sharing Debugger or LinkedIn Post Inspector, which scrape the published page and show you the values platforms actually read.', 'When a scraper shows an old image or a title you changed days ago, that is caching, not a broken tag. Ask the debugger to scrape again, or append a version string to the image URL so the crawler fetches a fresh copy. Then check the card on a phone: WhatsApp and LinkedIn render more conservatively than the desktop preview, and a card that is legible at thumbnail size works everywhere.'] },
    ],
    faqs: [
      { q: 'What image size should og:image be?', a: '1200×630 pixels is the Facebook-recommended size (ratio 1.91:1). Keep the file under 1 MB and always reference it with an absolute https:// URL.' },
      { q: 'Why is my old image still showing after I updated the tags?', a: 'Platforms cache share data aggressively. Use the Facebook Sharing Debugger’s “Scrape Again” button, or append a query string like ?v=2 to the image URL to bust the cache.' },
      { q: 'Do Open Graph tags affect Google rankings?', a: 'Not directly. Google uses its own title and description. OG tags affect click-through rate from social shares, which indirectly brings traffic and engagement. An open graph generator changes what the sharing platform displays, not how Google reads the page.' },
      { q: 'Do I still need Twitter Card tags?', a: 'X (Twitter) now falls back to Open Graph tags when twitter: tags are missing. Dedicated twitter: tags are only needed to override OG values or force a different card style. This open graph generator emits the og: tags, so reuse the same values in your Twitter Card tags.' },
    ],
    html: `
${f.url('og-url', 'Page URL (og:url)', 'https://example.com/post/launch-week')}
${f.text('og-title', 'Title (og:title)', 'We rebuilt our onboarding — here is what changed')}
${f.text('og-desc', 'Description (og:description)', 'A short, concrete summary that makes people want to click.', )}
${f.url('og-image', 'Image URL (og:image)', 'https://example.com/images/cover.jpg')}
${f.select('og-type', 'Type (og:type)', [
      { v: 'website', l: 'website' },
      { v: 'article', l: 'article' },
      { v: 'product', l: 'product' },
      { v: 'profile', l: 'profile' },
      { v: 'video.other', l: 'video' },
    ])}
${f.text('og-site', 'Site name (og:site_name)', 'Example Blog')}
<p class="preview-label">Share preview — Facebook / LinkedIn</p>
<div class="seo-preview-card seo-preview-card--social">
  <div class="fb-img" id="og-prev-img">Image preview appears here</div>
  <div class="fb-body">
    <div class="fb-domain" id="og-prev-domain">example.com</div>
    <div class="fb-title" id="og-prev-title">Title</div>
    <div class="fb-desc" id="og-prev-desc">Description</div>
  </div>
</div>
${outputBlock('og-out', 'Open Graph tags')}`,
  },

  // ---------------------------------------------------------- 3
  {
    slug: 'twitter-card-generator',
    name: 'Twitter Card Generator',
    cat: 'seo',
    icon: '🐦',
    card: 'Build twitter: tags with a live X card preview.',
    usedFor: 'for checking X/Twitter share previews',
    keywords: 'twitter card generator x card meta tags',
    focus: 'twitter card generator',
    h1: 'Free Twitter Card Generator — No Signup, No Limits',
    metaTitle: 'Free Twitter Card Generator — Live X Card Preview',
    metaDesc: 'This twitter card generator builds summary and summary_large_image tags with a live X preview, so you control how your links render. Free, no signup.',
    intro: 'This twitter card generator produces twitter: card tags for X (formerly Twitter) with a live preview of exactly how your link card will render in the timeline.',
    sections: [
      { h: 'Card types explained', p: ['X supports several card types, but two matter in practice: summary_large_image shows a big picture above the tweet text — best for articles and landing pages — and summary shows a small square thumbnail beside the text — best for documentation and minimal links.', 'The twitter:site tag should hold the X handle of the site (e.g. @yourbrand) and twitter:creator the handle of the author. Both are optional; the card still renders without them. If you omit twitter:title, twitter:description and twitter:image, X falls back to your Open Graph tags.'] },
      { h: 'How to use it', p: ['Choose the card type, fill in the title, description and absolute image URL, then paste the generated tags into your page <head>. After publishing, run the URL through the X Card Validator (or simply paste the link into a draft tweet) to confirm the card renders.', 'Keep card images at 2:1 ratio, minimum 300×157 pixels and under 5 MB.'] },
      { h: 'Writing card copy that earns the tap', p: ['A timeline card has about two lines of description to work with, so front-load the payoff. Title: what the reader gets, in plain words, with the concrete detail that makes it believable — a number, a timeframe, a named outcome. Description: one sentence of context and one reason to open it now. People scrolling a feed are deciding in a glance, not comparing results the way they would in search.', 'The image carries most of the attention, so choose one that reads at small size: a single clear subject, strong contrast, and text only if it survives being cropped. A dark screenshot with fine print turns into a grey rectangle on most timelines, no matter how good the article behind it is. Show the draft card to someone who has not seen the page — if they cannot tell what the link offers, the image is not doing its job.'] },
      { h: 'How this twitter card generator works', p: ['Every field maps to one tag in the output: the card type selector sets twitter:card, the handles fill twitter:site and twitter:creator, and the remaining fields emit the title, description and image. The preview re-renders as you type, laying the values out the way the timeline does — image on top for summary_large_image, thumbnail beside the text for summary — so you are looking at the card, not imagining it.', 'If a value is left empty, the tag is simply omitted, and X falls back to your Open Graph tags for that property — which is why the same page can look right on X while sharing poorly on LinkedIn. Generate a complete set here, then reuse those values in your Open Graph tags so the two blocks never disagree about what the page is. Handles are optional; fill in the site handle whenever the posting account is known, since it credits the source on the card.'] },
    ],
    faqs: [
      { q: 'Do Twitter Card tags still work now that it is called X?', a: 'Yes. The meta tag names are still twitter:*, and the cards still render on X. The brand changed, the protocol did not — a twitter card generator still emits the same tags.' },
      { q: 'summary or summary_large_image — which should I pick?', a: 'Use summary_large_image for content where the picture sells the click (articles, features, portfolios) and summary for text-first contexts like docs, changelogs and API pages.' },
      { q: 'My card shows the wrong image — why?', a: 'X caches cards for about seven days. Append a cache-busting query parameter (?v=2) to the image URL, or re-validate the URL in the card validator to force a refresh. Then re-run the twitter card generator to confirm the tags are still correct.' },
      { q: 'Can I use both OG tags and twitter: tags?', a: 'Yes, and it is common. twitter: tags override Open Graph values on X; every other platform ignores them and uses OG.' },
    ],
    html: `
${f.select('tw-card', 'Card type', [
      { v: 'summary_large_image', l: 'summary_large_image (big image)' },
      { v: 'summary', l: 'summary (small thumbnail)' },
    ])}
${f.text('tw-site', 'Site handle (twitter:site)', '@yourbrand')}
${f.text('tw-creator', 'Author handle (twitter:creator)', '@authorhandle')}
${f.text('tw-title', 'Title', 'How we cut LCP from 4.2s to 1.1s')}
${f.text('tw-desc', 'Description', 'The exact checklist we used, with before/after numbers.')}
${f.url('tw-image', 'Image URL', 'https://example.com/images/cover.jpg')}
<p class="preview-label">Share preview — X / Twitter</p>
<div class="seo-preview-card x-preview">
  <div class="x-img" id="tw-prev-img">Image preview appears here</div>
  <div class="x-body">
    <div class="x-title" id="tw-prev-title">Title</div>
    <div class="x-desc" id="tw-prev-desc">Description</div>
  </div>
</div>
${outputBlock('tw-out', 'Twitter Card tags')}`,
  },

  // ---------------------------------------------------------- 4
  {
    slug: 'canonical-tag-generator',
    name: 'Canonical Tag Generator',
    cat: 'seo',
    icon: '🔗',
    card: 'One-line rel=canonical tags to stop duplicate-content issues.',
    usedFor: 'for de-duplicating URLs before launch',
    keywords: 'canonical tag generator rel canonical duplicate content',
    focus: 'canonical tag generator',
    h1: 'Free Canonical Tag Generator — No Signup, No Limits',
    metaTitle: 'Canonical Tag Generator: Free rel=canonical Tag Maker (2026)',
    metaDesc: 'Generate correct rel=canonical tags for any URL. Free canonical tag generator — paste your URL, get the tag. Prevents duplicate content. No signup or install.',
    intro: 'This canonical tag generator writes a correct rel=“canonical” link tag for any URL — the one line of HTML that tells search engines which version of a page is the real one.',
    sections: [
      { h: 'When you need a canonical tag', p: ['The same content is often reachable at several URLs: with and without a trailing slash, with query parameters, on HTTP and HTTPS, or across print/sort variants of a category page. Without a canonical, search engines may pick a different version than you want, splitting ranking signals across duplicates.', 'A canonical tag consolidates those signals onto the URL you choose. It is a hint, not a directive — but Google follows it in the vast majority of cases when the duplicates are genuinely equivalent.'] },
      { h: 'How to use this canonical tag generator', p: ['Paste the absolute URL of the preferred version (including https:// and the final shape you want indexed). Copy the generated line into the <head> of every duplicate variant of that page — including the preferred page itself, which should carry a self-referencing canonical.', 'Keep the canonical consistent with your sitemap and internal links: those should point at the canonical URL too.'] },
      { h: 'When a canonical is the wrong fix', p: ['Reach for a redirect when the duplicate should not exist at all — visitors to the old address should land on the new one, not read identical content at two URLs. Reach for noindex when the page must stay reachable for users but should never appear in search, such as an internal filter view. A canonical is for the third case: the URL genuinely has to work, and only one version should count.', 'Two canonicals will be ignored: one pointing at a URL that is itself noindexed or blocked, and one pointing at a page with substantially different content. Google will not promote a page you have told it to distrust, and it will not fold a genuinely different page into another just because you asked. A canonical pointing at a redirect fails the same way — choose the final destination instead. If the target cannot rank on its own, fix the target first.'] },
      { h: 'Checking your canonicals after you publish', p: ['View the source of each variant — with and without www, with a trailing slash, with the tracking parameters you actually use — and confirm every copy carries the identical tag pointing at the same address. One variant left out quietly reintroduces the duplicate, and search engines will treat that version as its own page again. Search Console’s URL inspection shows which page Google selected and whether the canonical it sees matches the one you wrote.', 'Then make the rest of the site agree. Internal links should point at the canonical address rather than a variant, your sitemap should list only canonical URLs, and your internal search results and redirects should resolve to it as well. When those disagree, you send mixed signals about which address is real, and the canonical tag ends up arguing with the rest of your own site. A quick sweep of your highest-traffic templates usually catches a mismatch before it costs you anything.'] },
    ],
    faqs: [
      { q: 'Should every page have a canonical tag?', a: 'Yes — a self-referencing canonical on every indexable page is best practice. It protects you against parameterised or otherwise mutated URLs being treated as separate pages. This canonical tag generator writes the single line you paste into any template.' },
      { q: 'Canonical vs 301 redirect — which one?', a: 'A redirect is for pages that no longer exist at the old URL: users should land on the new one. A canonical is for pages that must remain reachable at several URLs, but only one should count in search.' },
      { q: 'Can a page canonicalise to a completely different page?', a: 'Only if the content is essentially the same (e.g. a syndicated article pointing at the original). Pointing a genuinely different page at another URL tells search engines to ignore yours — do not do this to force rankings.' },
      { q: 'Relative or absolute URL in canonical?', a: 'Always absolute, including the protocol. Google recommends full URLs like https://example.com/page/. The canonical tag generator expects the same shape — https:// and the exact path you want indexed.' },
    ],
    html: `
${f.url('cn-url', 'Canonical URL (the version Google should index)', 'https://example.com/blog/seo-checklist/')}
${note('Best practice: every indexable page should carry a self-referencing canonical — the tag pointing at its own preferred URL.')}
${outputBlock('cn-out', 'Canonical tag')}`,
  },

  // ---------------------------------------------------------- 5
  {
    slug: 'hreflang-tag-generator',
    name: 'Hreflang Tag Generator',
    cat: 'seo',
    icon: '🌐',
    card: 'Build hreflang clusters for multi-language and multi-region pages.',
    usedFor: 'for multilingual and multi-region sites',
    keywords: 'hreflang generator alternate language tags international seo',
    focus: 'hreflang generator',
    h1: 'Free Hreflang Tag Generator — No Signup, No Limits',
    metaTitle: 'Free Hreflang Generator — Multi-Language SEO Tags',
    metaDesc: 'Generate hreflang link tags for multilingual and multi-region sites, with x-default support. Copy-paste ready. Free online hreflang generator.',
    intro: 'This hreflang generator builds the full set of hreflang link tags for pages translated into multiple languages or targeted at multiple countries — including the x-default fallback.',
    sections: [
      { h: 'What hreflang does', p: ['Hreflang tags tell Google which language or regional version of a page to show to which users. A user searching in Germany should get the German page; a user in Australia should get the en-au version. Without hreflang, Google may show whichever version it thinks is closest, and users bounce off the wrong language.', 'Every language/region variant must reference all other variants — including itself — forming a complete, reciprocal cluster. If one member of the cluster is missing a link, the whole cluster can be ignored.'] },
      { h: 'How to use this hreflang generator', p: ['Add one row per version: an ISO 639-1 language code (en, de, fr, es), an optional ISO 3166-1 alpha-2 region (gb, us, de), and the absolute URL of that version. Add an x-default URL for users whose language matches none. Paste the generated block into the <head> of every variant — each variant carries the identical set of tags.', 'Format rules: language is lowercase (en), region is uppercase in display but hreflang accepts en-gb; the two are joined with a hyphen (en-gb).'] },
      { h: 'How this tool builds the cluster', p: ['Each row you add becomes one hreflang link element, and the tool writes the full reciprocal set for every row — including a reference back to each URL itself, which is the part hand-written blocks most often miss. Add the x-default URL and it is appended as the fallback entry. The block in the output is the exact set that goes into the head of every variant.', 'Copy the identical block to every member of the cluster — do not generate a shorter set for the German page. Reciprocity is binary: either every version announces every other version, or Google treats the annotations as unreliable and ignores the lot. The same block on each variant is far easier to maintain than five slightly different ones, and that is what the output gives you.'] },
      { h: 'Mistakes that break a cluster', p: ['The classic failure is editing one variant and forgetting the rest: the French page gains a new locale, the Spanish page never hears about it, and the cluster stops being reciprocal. The second is pointing hreflang at URLs that are not canonical — a redirect, a noindexed page, or a parameter URL — which makes the annotation contradictory. Always annotate the canonical address of each version, the one you would put in the sitemap.', 'A third trap is over-targeting: en-gb, en-au, en-us and en-ca pages that are identical apart from a price will split your authority across four near-duplicates. Only create a regional variant when the content genuinely differs for that audience. If every English speaker should see the same page, one en URL is stronger than four clones. Keep the cluster small enough to maintain — every variant you add is a page someone has to update forever, in every language, every time the content changes.'] },
    ],
    faqs: [
      { q: 'What is the difference between en-gb and en?', a: 'en targets all English speakers worldwide; en-gb targets English speakers in the United Kingdom specifically. Use plain en as the general version and en-gb only when you maintain a genuinely UK-specific page.' },
      { q: 'What is x-default?', a: 'x-default marks the version shown when the visitor’s language/region matches none of your cluster — typically the global homepage or a language-selection page.' },
      { q: 'Do hreflang tags replace a canonical tag?', a: 'No. Each language version still needs its own self-referencing canonical. Hreflang and canonical solve different problems and work together — the hreflang generator writes the alternate-language links, so add the canonical separately on every variant.' },
      { q: 'Can I use hreflang in the sitemap instead of the head?', a: 'Yes — sitemap xhtml:link annotations are an accepted alternative and are easier to manage at scale. The tags must still be reciprocal across the cluster. The hreflang generator writes head tags, so paste the same set into every variant.' },
    ],
    html: `
<div class="field">
  <label>Language / region variants</label>
  <div id="hf-rows">
  </div>
  <button type="button" class="btn btn-secondary" data-add="hf">+ Add another language</button>
  <p class="field-hint">Language = ISO 639-1 code (en, de, fr…). Region = optional ISO 3166-1 code (us, gb, de…).</p>
</div>
${f.url('hf-xdefault', 'x-default URL (optional fallback for unmatched users)', 'https://example.com/')}
${outputBlock('hf-out', 'Hreflang tags')}`,
  },

  // ---------------------------------------------------------- 6
  {
    slug: 'schema-markup-generator',
    name: 'Schema Markup Generator',
    cat: 'seo',
    icon: '🧩',
    card: 'Generate valid JSON-LD: FAQ, Article, Product, LocalBusiness & more.',
    usedFor: 'for structured data that matches supported rich results',
    updated: '2026-10-22',
    keywords: 'schema generator json ld structured data faq rich results',
    focus: 'schema markup generator',
    h1: 'Free Schema Markup Generator — No Signup, No Limits',
    metaTitle: 'Free Schema Markup Generator (JSON-LD) — 6 Types',
    metaDesc: 'This schema markup generator produces valid JSON-LD for FAQ, Article, Product, LocalBusiness, Organization and Breadcrumbs. Free, no signup.',
    intro: 'This schema markup generator writes valid JSON-LD structured data for the six schema types that earn rich results most often — FAQ, Article, Product, LocalBusiness, Organization and Breadcrumbs.',
    sections: [
      { h: 'What structured data gives you', p: ['Schema.org markup is machine-readable metadata that lets Google understand facts about your page: that a list is a set of questions and answers, that a number is a price, that a block is a business address. Pages with correct markup become eligible for rich results — FAQ dropdowns, product prices, review stars, breadcrumbs — which raise visibility and click-through rate.', 'JSON-LD is the format Google recommends: a single script block in the <head> or <body>, separate from the visible HTML. Only mark up content that actually exists on the page — marking up hidden or fabricated content risks a manual action.'] },
      { h: 'How to use this schema markup generator', p: ['Pick the schema type, fill in the fields (add or remove rows for FAQs and breadcrumbs), and copy the generated JSON-LD into your page — ideally just before </head>. Validate the result in Google’s Rich Results Test before deploying.', 'You can combine multiple types on one page: e.g. Article plus FAQPage plus BreadcrumbList, each in its own script block.'] },
      { h: 'Where structured data pays off first', p: ['Start with pages where markup changes what the searcher sees: FAQ blocks on support and comparison pages, Product markup on anything with a price and stock level, LocalBusiness markup on location pages, and BreadcrumbList on deep site sections where the URL tells searchers nothing. Article markup is worth adding to anything with a byline and a date. Organization markup belongs on the homepage, once, where it describes the site rather than a single page.', 'Skip markup that describes nothing a searcher could act on. A copyright line wrapped in schema, a star rating the page never displays, an author block for a name that appears nowhere visible — none of it helps, and all of it is the kind of mismatch that gets structured data withdrawn. The rule is simple: if a visitor cannot see the fact in the page, do not claim it in JSON-LD.'] },
      { h: 'Keeping your markup honest', p: ['Structured data is a promise about the page, so update it when the page changes. A price edited in the template but not in the JSON-LD, an FAQ left in the markup after the section was removed, an event date that passed months ago — each one is a discrepancy a reviewer, human or automated, can find in seconds. Tie the markup to the same template that renders the visible content wherever you can.', 'Validate before and after deploy. The generated block should pass Google’s Rich Results Test unchanged; if a validator reports a missing required field, fill it in the form here rather than editing the JSON by hand, because hand-edited JSON-LD breaks on quotes, commas and line breaks. Once it is live, re-check after every template change — markup that worked last quarter is not guaranteed to work now, and search requirements move over time.'] },
    ],
    faqs: [
      { q: 'Which schema type should I use for a blog post?', a: 'Article (with headline, author and datePublished), plus BreadcrumbList for navigation and FAQPage if the post contains a genuine question-and-answer section.' },
      { q: 'Is JSON-LD better than microdata?', a: 'For Google, yes — it is the officially recommended format. It is easier to maintain because it lives in one block instead of being threaded through your HTML attributes. The schema markup generator here emits JSON-LD only.' },
      { q: 'Does schema markup guarantee rich results?', a: 'No — it makes you eligible. Google decides per query whether showing a rich result improves the experience. Correct, complete markup improves the odds, but this schema markup generator cannot promise a rich result.' },
      { q: 'Where do I put the generated code?', a: 'Anywhere in the page HTML; the <head> just before </head> is conventional. On WordPress, use your SEO plugin’s schema/JSON-LD field or a code snippets plugin.' },
      { q: 'What schema types are worth adding?', a: 'In priority order: Organization site-wide, BreadcrumbList on every non-home page, Article or Product on content pages, and FAQPage where genuine Q&A exists. Skip HowTo — Google deprecated its rich-result display.' },
    ],
    html: `
${f.select('sc-type', 'Schema type', [
      { v: 'faq', l: 'FAQPage — questions & answers' },
      { v: 'article', l: 'Article — blog post / news' },
      { v: 'product', l: 'Product — with price offer' },
      { v: 'localbusiness', l: 'LocalBusiness — address & phone' },
      { v: 'organization', l: 'Organization — site-wide' },
      { v: 'breadcrumb', l: 'BreadcrumbList — navigation' },
    ])}
<div id="sc-fields"></div>
${outputBlock('sc-out', 'JSON-LD')}`,
  },

  // ---------------------------------------------------------- 7
  {
    slug: 'serp-preview-tool',
    name: 'SERP Preview Tool',
    cat: 'seo',
    icon: '🖥️',
    card: 'Preview a fetched page snippet and compare its title, H1, description and target phrase.',
    usedFor: 'for checking a snippet before you publish',
    keywords: 'serp preview tool google snippet title pixel width checker',
    focus: 'serp preview tool',
    h1: 'Free SERP Preview Tool — No Signup, No Limits',
    metaTitle: 'SERP Preview Tool: Free Google Snippet Preview (2026)',
    metaDesc: 'Preview how your title and meta description appear in Google. Free SERP preview tool — check length, pixel width and CTR before publishing.',
    intro: 'This serp preview tool shows your title and description, or fetches a public page to compare its live title, H1, description and visible topic. Width measurements are estimates; Google may rewrite or select different text for each query.',
    sections: [
      { h: 'What the preview can and cannot tell you', p: ['Search snippets vary with device, query and Google’s choice of title and page passage. This page renders your current title and description using browser font metrics so you can spot text that may be visually long; it does not reproduce a live Google result or guarantee where Google will cut or rewrite text.', 'Use the comparison to catch a title that differs from the visible heading or a description that misses the page topic. Keep the defining phrase and useful detail near the start, then read the whole line aloud. Clear, accurate wording matters more than hitting a fixed character target.'] },
      { h: 'How to use this serp preview tool', p: ['Enter a URL, or use Analyze my page to fetch the current public HTML. The tool pre-fills the title and description and can compare an optional target phrase with the actual title, H1, description and main text. Edit the fields to compare alternatives. The browser preview and pixel counts are estimates, not live search data.', 'After publishing, fetch the URL again to confirm the HTML changed. To know the impressions and queries Google actually recorded, use Search Console; this tool does not have access to your private GSC account.', 'Compare two versions instead of guessing which one is better: paste the current title into the title field, read the width, then paste your rewrite and read it again. The smaller change often wins — rewording the last five words can pull the useful part into view without rewriting the whole line. Only change what the comparison shows: a title that disagrees with the H1, a description that never mentions the page topic, or a phrase you are targeting that the page does not actually serve.'] },
      { h: 'How this tool measures the preview', p: ['The preview uses browser canvas font metrics to estimate text width. It does not reproduce a live Google result or know Google’s truncation decision. A search result can show a different title or a page excerpt, and display can vary with the query and device.', 'Use the width reading to spot unusually long text, then prioritize accuracy, a clear page topic and a useful opening phrase. Character counts are a drafting aid. There is no fixed pixel or character cutoff that guarantees display.'] },
      { h: 'Improving the result for a real query', p: ['Fetch the page, enter one target search phrase and see whether that exact phrase appears in the source title, visible H1, meta description and extracted main copy. If the title and H1 diverge, check whether they still describe the same page. If the phrase is absent, first confirm that it matches the page’s actual purpose; do not add it mechanically.', 'The preview cannot show impressions, clicks or the title Google selected for real searchers. Check those in Search Console, then use this page to edit the source text and compare a new version.'] },
    ],
    faqs: [
      { q: 'What is the pixel limit for title tags?', a: 'Google does not publish a fixed title pixel or character limit. This serp preview tool measures browser text width as an editing aid; actual search displays vary by device and query.' },
      { q: 'Does Google always use my title tag?', a: 'No. Google may generate a title link from the title element and other page signals. This serp preview tool cannot predict which text Google will choose for a query.' },
      { q: 'How long can a description in a search result be?', a: 'Google has no fixed description length limit. Write a useful, page-specific summary; the snippet may be shortened to fit or generated from page text.' },
      { q: 'Should I put my brand name in the title?', a: 'Yes, at the end, separated by a pipe or dash — as long as it fits. Brand names in titles can improve click-through and are rarely removed by Google.' },
    ],
    html: `
${f.url('sp-url', 'Page URL', 'https://example.com/free-seo-tools')}
${f.text('sp-query', 'Optional target search phrase (for page comparison)', '', 'Example: free SEO tools')}
${f.text('sp-title', 'Title tag', 'Free SEO Tools — 30 Browser-Based Utilities | Tools4Market', 'Free SEO Tools — 30 Browser-Based Utilities | Tools4Market')}
${f.text('sp-desc', 'Meta description', 'Run 30 free SEO and marketing tools, including meta tags, robots.txt, schema and keyword analysis. No signup or limits.', 'Run 30 free SEO and marketing tools, including meta tags, robots.txt, schema and keyword analysis. No signup or limits.')}
<p class="preview-label">Estimated desktop snippet preview</p>
<div class="google-preview">
  <div class="gp-url" id="sp-prev-url">example.com</div>
  <div class="gp-title" id="sp-prev-title">Title</div>
  <div class="gp-desc" id="sp-prev-desc">Description</div>
</div>
<div class="stat-line" id="sp-stats"></div>
<div class="stat-line" id="sp-fit"></div>
${outputArea('sp-out', 'Length check')}`,
  },

  // ---------------------------------------------------------- 8
  {
    slug: 'meta-description-checker',
    name: 'Meta Description Checker',
    cat: 'seo',
    icon: '📏',
    card: 'Check a draft against the actual title, H1 and page text, with an estimated snippet preview.',
    usedFor: 'for tightening descriptions that do not earn clicks',
    keywords: 'meta description checker length tester serp snippet',
    focus: 'meta description checker',
    h1: 'Free Meta Description Checker — No Signup, No Limits',
    metaTitle: 'Meta Description Checker: Free Length & Preview Tool',
    metaDesc: 'Meta description checker: check length and preview it in Google. Free tool — character count, pixel width, and snippet preview. Paste a URL or draft.',
    intro: 'This meta description checker takes a draft or fetches a public page to compare its description with its title, H1, opening text and optional target phrase. Character and pixel counts are editing estimates; Google chooses snippet text by query and device.',
    sections: [
      { h: 'What a useful description looks like', p: ['Google does not set a preferred description length. A useful description accurately summarizes this page, distinguishes it from nearby pages and gives a searcher a concrete reason to visit. Keep its main point early so it still reads well if a search result display shortens it.', 'Google may use the meta description when it is a good summary, or choose a passage from the page that better matches a query. You influence the candidate text, not the exact snippet users will see.'] },
      { h: 'How to use this meta description checker', p: ['Paste a draft, or use Analyze my page to fetch the public HTML and load its current description. Add an optional target phrase to see whether it appears in the fetched title, H1, description or main text. Browser pixel width is an estimate for editing; it is not a Google truncation promise.', 'The page-based draft button uses the fetched H1/title and opening text. It does not know your offer, current pricing, inventory or business claims beyond what the page says, so review every sentence before publishing.', 'If the fetched page already carries a description, treat it as a draft rather than a decision. Most weak descriptions repeat the title instead of adding something: the title names the page, the description should explain why this page answers the searcher’s question better than the ten next to it. Rewrite one of the two and keep the other, and the pair stops competing for the same words.'] },
      { h: 'Avoid mismatch and unsupported claims', p: ['A meta description should summarize the page faithfully. A slogan that promises a feature missing from the page can disappoint visitors; a generic paragraph may be less useful than an accurate sentence that distinguishes this specific URL. Where possible, write different descriptions for meaningfully different pages.', 'Use the target phrase naturally if it fits. The phrase check compares it with the fetched title, H1, description and visible main text; it does not measure demand or promise Google will use the description.'] },
      { h: 'How to read the preview', p: ['The browser shows a sample result with a character count and estimated pixel width. A long width is a cue to review the sentence and move the important point earlier, not a guaranteed truncation warning. Google may show a different passage for a particular search.', 'After editing, save the description in your site and fetch the page again. Compare the actual response with your draft. Search Console is the place to review search queries, impressions and clicks.', 'The count and the width read as a pair. Characters tell you how much text you wrote; width tells you how much of it the browser can show in the sample card. A description that is short but wide — several long words, capitals or punctuation — can look tighter than a longer one written in plain words. Read the rendered card aloud; if it sounds like a list of keywords, rewrite it in sentences.'] },
    ],
    faqs: [
      { q: 'Does the meta description affect rankings?', a: 'Google does not use the meta description as a direct ranking factor. It can be used as a search snippet when it describes the page well, but Google may choose page text instead.' },
      { q: 'Why does Google show different text than my description?', a: 'Google selects snippet text per query and may use a passage from the page when it believes it matches the search better. You influence, but never control, the snippet.' },
      { q: 'Is 160 characters a hard limit?', a: 'No. Google has no fixed description length limit. The meta description checker shows a browser-based estimate, while real snippets can vary by device and query.' },
      { q: 'Can I leave the description empty?', a: 'Yes. Google can generate a snippet from visible page text. A useful, unique description gives Google another candidate, but it may still select a passage that better matches a query. The meta description checker flags a missing description; it does not predict the snippet.' },
    ],
    html: `
${f.text('md-query', 'Optional target search phrase', '', 'Example: free SEO tools')}
${f.textarea('md-text', 'Your meta description', 'Paste or draft a page-specific description. A fetched page can prefill this field.', 4)}
<div class="stat-line" id="md-stats"></div>
<div class="stat-line" id="md-fit"></div>
<p class="preview-label">Estimated snippet preview — Google may use other page text</p>
<div class="google-preview">
  <div class="gp-url" id="md-prev-url">example.com</div>
  <div class="gp-title" id="md-prev-title">Your page title appears here</div>
  <div class="gp-desc" id="md-prev">Description…</div>
</div>
${outputArea('md-out', 'Verdict')}`,
  },

  // ---------------------------------------------------------- 9
  {
    slug: 'web-crawler-audit',
    name: 'Web Crawler Audit',
    cat: 'seo',
    icon: '🕷️',
    card: 'Fetch a URL and inspect its HTTP response, robots rules, canonical and discovery signals.',
    usedFor: 'for pre-launch checks and client site audits',
    updated: '2026-10-22',
    pickWhy: 'Paste any live URL and read the response code, canonical, robots rules and discovery signals in one pass — the fastest way to find what is holding a page back.',
    pickSample: `GET https://example.com/pricing/          200 (312 ms)
Title tag          ✓ present, 52 chars
Canonical          ✓ self-referencing
robots.txt         ✓ found — 3 rules, AI crawlers allowed
XML sitemap        ✓ linked (48 URLs)`,
    keywords: 'web crawler audit crawlability indexability googlebot robots noindex canonical check',
    focus: 'crawler audit',
    h1: 'Free Web Crawler Audit — No Signup, No Limits',
    metaTitle: 'Free Web Crawler Audit — Check Crawlability & Indexing',
    metaDesc: 'Web crawler audit: check a public URL for HTTP, noindex, Googlebot robots.txt, canonical and sitemap signals. Crawl evidence, not index status. Free.',
    intro: 'This crawler audit fetches a public URL and inspects the response, visible robots directives, Googlebot robots.txt rule, canonical and sitemap discovery. The report includes the evidence it fetched; it cannot see Google\u2019s private index status.',
    sections: [
      { h: 'What this page-level audit checks', p: ['For the URL you enter, the audit fetches the public HTML and records its final URL, HTTP response, content type, response size and request time. It reads meta robots and X-Robots-Tag, fetches robots.txt and applies the matching Googlebot rule to that path, then samples declared sitemap files to look for the tested URL.', 'It also reports the title, description, canonical and main heading from the fetched response. Sitemap presence and structured data are context, not prerequisites; a sitemap helps discovery, and valid structured data does not guarantee a rich result. The weighted score is a checklist summary, not a Google score, ranking prediction or indexation guarantee.'] },
      { h: 'How to use it', p: ['Paste a public page URL and run the audit. Each item includes the value or response that triggered it. The fix list is ordered by this tool’s checklist weights; those weights are not Google ranking factors. A robots.txt block prevents a crawler from fetching that path; it is not the same as a noindex directive, and it does not guarantee a URL is absent from search.', 'If a page is private or fetch is blocked, paste its HTML. That path can inspect tags and content, but cannot verify response headers, robots.txt or sitemap membership.'] },
      { h: 'When to run a crawler audit', p: ['Run it whenever a page’s indexing behaviour changes without you touching it: after a redesign or theme switch, after a plugin update that injects meta tags, after a platform migration, and before and after any launch that moves URLs. Template-level changes rewrite the head of every page at once, which is exactly when a stray noindex or a canonical pointing at the old domain appears.', 'It is also worth running on the pages that earn you money or attention — homepages, category pages, top posts — rather than everywhere. One healthy audit on your template pages tells you more than fifty audits on near-identical posts, because if the template is clean, every page built from it starts clean too.', 'A useful habit is to audit a known-good URL first whenever something looks wrong: if the healthy page suddenly fails too, the problem is site-wide rather than a one-page edit. That single comparison usually narrows a whole site problem down to a plugin, a header rule or a deploy in a couple of minutes.'] },
      { h: 'How to check your work', p: ['Fix the top issue on the list, then run the audit again on the same URL — the score should move and the red line should turn green. If it does not, the change did not reach the live page: a caching layer, an old template part, or a server-side header still sending the old instruction.', 'Then confirm what Google sees rather than only what the browser shows. Search Console’s URL inspection reports the robots meta it found, the canonical it selected and the last crawl date, and the elements panel in your browser will reveal a noindex injected after load. When the two views agree with the audit, your fix is genuinely in place.'] },
    ],
    faqs: [
      { q: 'What is a web crawler?', a: 'A crawler (or spider) is an automated bot — like Googlebot, Bingbot or an AI crawler such as GPTBot — that fetches pages for search or other services. Search engines may use fetched content for discovery, indexing and ranking, subject to their systems and policies.' },
      { q: 'Why is my page not being indexed?', a: 'A crawler audit can surface an HTTP failure, a noindex directive, a robots.txt block or a canonical pointing elsewhere. It cannot inspect Google\u2019s private index state or confirm whether Google selected the page.' },
      { q: 'Does this tool crawl my whole site?', a: 'No — a crawler audit covers one page at a time, which keeps it instant and free. Run it on your key pages (home, category, top posts). For a whole-site crawl, combine it with your sitemap and test each URL.' },
      { q: 'Will this work for a page that is not public?', a: 'Paste its HTML to inspect markup and visible text locally. Pasted analysis cannot check server response headers, robots.txt or sitemap membership. Fetching a public URL sends that URL to our first-party fetch proxy.' },
    ],
    html: `
${f.url('ca-url', 'Page URL to audit', 'https://your-site.com/your-page')}
<button type="button" class="btn ca-run" id="ca-run">Run crawler audit</button>
<div class="stat-line" id="ca-status" aria-live="polite"></div>
<div class="score-wrap" id="ca-score" hidden>
  <div class="score-ring" id="ca-ring"><span id="ca-ring-num">0</span></div>
  <div class="score-meta">
    <p class="score-label">Weighted technical checklist</p>
    <p class="score-grade" id="ca-grade"></p>
    <p class="score-note" id="ca-note"></p>
  </div>
</div>
<div id="ca-vis" class="kpi-strip"></div>
${outputArea('ca-out', 'Per-check report')}
<p class="preview-label">Prioritized fixes</p>
${outputArea('ca-fixes', 'Fix these first')}
<details class="inspect-paste">
  <summary>Fetch blocked, or the page is private? Paste the HTML instead.</summary>
  <textarea id="ca-paste" class="inspect-ta" rows="4" placeholder="View Source → copy → paste the page HTML here." aria-label="Paste page HTML"></textarea>
  <button type="button" class="btn btn-ghost" id="ca-paste-run">Audit pasted HTML</button>
</details>`,
  },

  // ---------------------------------------------------------- 10
  {
    slug: 'seo-score-checker',
    name: 'SEO Score Checker',
    cat: 'seo',
    icon: '🏆',
    card: 'Check a fetched page against its target phrase and get a prioritized, evidence-based fix list.',
    usedFor: 'for a prioritized fix list before publishing',
    updated: '2026-10-22',
    keywords: 'seo score checker rank page grade audit on-page optimization rating',
    focus: 'seo score checker',
    h1: 'Free SEO Score Checker \u2014 No Signup, No Limits',
    metaTitle: 'Free SEO Score Checker — On-Page Score & Fixes',
    metaDesc: 'This seo score checker compares a target phrase with the title, H1, description and copy, then grades the on-page checks. Free, no signup.',
    intro: 'This seo score checker fetches a public page and returns a weighted on-page checklist from its actual HTML. Add a target phrase to see whether it appears in the title, H1, description and main text. The score describes measured checks, not rankings.',
    sections: [
      { h: 'What the checklist measures', p: ['The score summarizes observable page signals: whether a title, description and main heading exist, whether a target phrase you supply appears in the checked areas, whether visible main text and internal links were found, and whether canonical, viewport and HTTPS signals are present. Content length, Open Graph and structured data are shown as context; they are not universal requirements.', 'This is not a Google metric, ranking position or forecast. It does not include Search Console impressions or queries, backlinks, competition, site authority, page speed or rendered DOM content. Use the per-factor evidence and next steps to decide what to edit.'] },
      { h: 'How to use this seo score checker', p: ['Paste a public URL, optionally enter the target phrase for that page, and run the check. Each row gives the fetched evidence behind a pass, warning or failure. The weighted checklist helps you order edits; a higher score means more of these selected checks passed, not that rankings will improve.', 'For private pages, paste HTML. The pasted path can inspect markup and text but cannot verify response headers or robots.txt, so those checks are excluded. Fetching a public URL sends it through the site’s first-party proxy; the app does not save a report.'] },
      { h: 'Separate template issues from page issues', p: ['Some signals come from a shared theme or CMS template, while others belong to one URL. A missing viewport declaration or a heading that is not exposed in the source HTML may be template-level; a title or description mismatch is usually page-specific. Confirm a finding against a few pages before changing a shared template.', 'Start with a representative page from each template — homepage, category, article or product — then inspect individual pages for topic and content gaps. Add internal links where they help visitors and crawlers navigate; there is no universal link-count target.', 'Work through the failures in the order they matter on that page, not the order they appear in the report. A missing or duplicated description on a page you care about counts for more than a tidy internal-link count on a page nobody links to. When a check fails on every page of one template, fix the template once; when it fails on a single page, fix that page. Re-run the score afterwards and read the new evidence, not only the number.'] },
      { h: 'How this tool works', p: ['The checker measures title, description, H1, visible main text, internal links, canonical, viewport and HTTPS. It also checks robots directives and fetches robots.txt for public URLs. When you supply a target phrase, it records whether the exact phrase appears in four source areas; it does not require a phrase or a certain word count. Each weighted factor is visible so you can interpret the checklist score.', 'The report is a single fetched snapshot. It does not render the page with a browser engine, read Google’s index, access Search Console, measure backlinks or estimate query demand. If a site builds content only after JavaScript runs, paste rendered HTML or verify the page in Search Console’s URL Inspection tool.'] },
    ],
    faqs: [
      { q: 'Is this SEO score the same as my Google ranking?', a: 'No. The seo score checker summarizes factors within the page itself. Google\u2019s actual ranking also weighs backlinks, site authority, user signals and competition, which no free tool can measure for your specific query.' },
      { q: 'What is a good SEO score?', a: 'There is no Google SEO score. Treat the seo score checker number as a checklist summary: inspect the failed or partial factors and decide whether each change improves the actual page for readers.' },
      { q: 'How can I improve this checklist?', a: 'Review the weighted failures first, then confirm each change is appropriate for the actual page. The weights only order this tool’s checks; they do not predict ranking gains. Do not add text to meet a word-count target.' },
      { q: 'Does this tool store my results?', a: 'The page analysis is not saved as a report. When you fetch a public URL, the URL is sent to our first-party proxy to retrieve its response; pasted HTML is analyzed in your browser.' },
    ],
    html: `
${f.url('sc2-url', 'Page URL to score', 'https://your-site.com/your-page')}
${f.text('sc2-query', 'Optional target search phrase', '', 'Example: local SEO audit')}
<button type="button" class="btn sc2-run" id="sc2-run">Score this page</button>
<div class="stat-line" id="sc2-status" aria-live="polite"></div>
<div class="score-wrap" id="sc2-score" hidden>
  <div class="score-ring sc2" id="sc2-ring"><span id="sc2-ring-num">0</span></div>
  <div class="score-meta">
    <p class="score-label">On-page checklist score</p>
    <p class="score-grade" id="sc2-grade"></p>
    <p class="score-note" id="sc2-note"></p>
  </div>
</div>
<div id="sc2-vis" class="kpi-strip"></div>
${outputArea('sc2-out', 'Factor breakdown')}
<p class="preview-label">Checks to review first (ordered by checklist weight)</p>
${outputArea('sc2-fixes', 'Fix these first')}
<details class="inspect-paste">
  <summary>Fetch blocked, or the page is private? Paste the HTML instead.</summary>
  <textarea id="sc2-paste" class="inspect-ta" rows="4" placeholder="View Source → copy → paste the page HTML here." aria-label="Paste page HTML"></textarea>
  <button type="button" class="btn btn-ghost" id="sc2-paste-run">Score pasted HTML</button>
</details>`,
  },

  // ---------------------------------------------------------- OG image tester
  {
    slug: 'og-image-tester',
    name: 'OG Image Tester',
    cat: 'seo',
    icon: '🖼️',
    card: 'Preview any og:image at real dimensions and see how social cards will crop it.',
    usedFor: 'for social share previews',
    updated: '2026-10-23',
    keywords: 'og image tester open graph social share image size preview dimensions card',
    focus: 'og image tester',
    h1: 'Free OG Image Tester — Check Social Share Images',
    metaTitle: 'Free OG Image Tester — Preview og:image Sizes',
    metaDesc: 'Test your og:image before sharing with this free OG Image Tester — real pixel dimensions, card crop ratios and the mistakes that break previews. No signup.',
    intro: 'Enter any og:image URL into this free OG Image Tester to preview it, read its real dimensions and see how Facebook, LinkedIn and X will crop it on large and small cards.',
    sections: [
      { h: 'What this OG image tester measures', p: ['The og:image tag is a promise a page makes to every platform that later renders a link — Facebook, LinkedIn, X, Slack, Discord and dozens of others read it when someone shares your URL, and each one fetches the image from its own servers, minutes or days after you published. That distance is what this tester prepares you for: it loads the image the way those crawlers do, measures the pixels that actually arrive, and reports the aspect ratio against the two crops every platform uses — roughly 1.91:1 for the large card and 1:1 for small avatars. An image at 1200×630 renders without surprise; a square or portrait one gets cut, and knowing where the crop lands matters before the designer signs off.', 'Dimensions are only half the story. A social image must be reachable without cookies, redirects or authentication, must keep a stable URL — signed URLs that expire are the classic production incident — and ideally declares its size in og:image:width and og:image:height tags so the platform reserves space instead of guessing. The tester measures what the URL returns today; the checklist side — absolute URL, stable host, declared dimensions — is the part you verify in the page itself.'] },
      { h: 'How to use this OG image tester', p: ['Analyze mode is the fastest path: enter the page URL in the panel and the og:image it declares loads into the tester automatically — the Twitter card image is used as a fallback when no Open Graph image exists, which is exactly how the platforms behave. Manual mode takes any image URL directly: the design team’s latest candidate, a competitor’s card, the image a support ticket is complaining about. The preview renders at the file’s true size, capped by your browser window, and the status line reports the measured pixels and crop assessment.', 'Re-test whenever the card design changes — a seasonal banner, a new template, a resized export. And test the URL, not the file: what matters is what an unauthenticated crawler gets when it asks for that exact address, including the query string. If the preview here loads but a share preview shows a broken image, the difference is almost always the platform’s cache — Facebook’s sharing debugger and similar tools let you force a refetch after you fix the file.'] },
      { h: 'Social image mistakes that kill previews', p: ['The failures repeat across sites. A relative URL in og:image — platforms ignore anything that is not absolute. An image behind auth or a firewall — the crawler has no session, so the share shows nothing. A signed or expiring URL from a CDN — the preview works the day you ship and 404s a week later, silently, because no visitor ever reports a broken share. And no og:image at all, where platforms fall back to the first image on the page, which might be a tiny avatar, a decorative divider or nothing predictable.', 'Then the sizing mistakes: images under a few hundred pixels, which most platforms upscale into blur; extreme crops that cut the subject out at 1.91:1; text baked so small it is unreadable on a phone card; and formats some crawlers handle inconsistently. The cheap insurance is a boring, reliable recipe — 1200×630, absolute stable URL, under a megabyte, subject centered with margin — saved once as a template and reused, with this tester confirming each new export before it ships.'] },
    ],
    faqs: [
      { q: 'What size should an og:image be?', a: '1200×630 pixels is the widely supported target — it renders at full size on large cards and crops cleanly to the 1:1 avatar shape. Keep it under about 300 KB and never below 200×200, which many platforms skip entirely.' },
      { q: 'Why does my og:image not appear when I share?', a: 'The usual causes: a relative URL, an image behind login or a firewall, an expired CDN link, or a platform cache holding the old head. Test the exact URL with this tester first, then force a refetch with the platform’s debugger tool.' },
      { q: 'Does this OG image tester check the tags on my page?', a: 'It measures the image a URL serves — dimensions, ratio and loadability, which is what every platform displays. Tag presence and placement on the page are covered by analyzing the page itself in the panel above.' },
      { q: 'What about twitter:image and LinkedIn?', a: 'X reads twitter:image and falls back to og:image; LinkedIn reads Open Graph only. When a page declares both with different files, analyze mode loads the Open Graph image — check the Twitter one separately if it differs.' },
    ],
    html: `
${f.url('ogit-url', 'Image URL (og:image or any image)', 'https://example.com/social-card.png')}
<div class="output">
  <div class="output-head"><span>Preview</span></div>
  <img id="ogit-preview" class="ogit-preview" alt="Social share image preview" hidden>
</div>
<p class="tool-note" id="ogit-stats"></p>
<p class="tool-note" id="ogit-detail"></p>
${note('The preview loads the image directly from its host — the same way social platforms fetch it. Nothing is uploaded.')}
<div class="preview-label" style="margin-top:18px">Crop comparison — drag the handle to compare the original with a centered 1.91:1 social-card crop</div>
<div class="compare" id="ogit-compare" hidden>
  <img class="frame frame--bottom" id="ogit-compare-after" alt="Cropped to 1.91:1" decoding="async">
  <div class="frame frame--top"><img id="ogit-compare-before" alt="Original" decoding="async"></div>
  <div class="handle" id="ogit-compare-handle" role="slider" aria-label="Crop comparison slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0"><span class="handle-label">Drag</span></div>
</div>
${note('The preview loads the image directly from its host — the same way social platforms fetch it. Nothing is uploaded.')}`,
  },

  // ---------------------------------------------------------- hreflang checker
  {
    slug: 'hreflang-checker',
    name: 'Hreflang Checker',
    cat: 'seo',
    icon: '🌐',
    card: 'Validate hreflang codes, duplicates and the required self-reference from any page HTML.',
    usedFor: 'for multilingual site audits',
    updated: '2026-10-23',
    keywords: 'hreflang checker validate language tags locale codes self reference multilingual',
    focus: 'hreflang checker',
    h1: 'Free Hreflang Checker — Validate Language Annotations',
    metaTitle: 'Hreflang Checker: Free hreflang Tag Validator Online',
    metaDesc: 'Hreflang checker: validate hreflang tags free online. Check format, duplicates, self-reference, and reciprocity. Paste a URL or HTML — get errors and fixes.',
    intro: 'Paste a page’s HTML into this free hreflang checker to list every language annotation it declares, flag invalid codes and duplicates, and confirm the self-reference Google requires.',
    sections: [
      { h: 'What this hreflang checker validates', p: ['Hreflang is a reciprocity contract: each language version of a page declares every other version, including itself, and search engines swap the right URL into the right country’s results. The contract has three mechanical rules this checker verifies directly from the markup. Codes must be lowercase ISO 639 language with an optional UPPERCASE ISO 3166 region — en, fr-FR, zh-HK — plus x-default as the catch-all. Each hreflang value should be declared once; duplicates are discarded with only the last entry kept. And the page must reference itself, because a version that opts out of its own cluster tells crawlers it does not belong to it.', 'What one page cannot prove is the other half of the contract. Every alternate URL must return a working page, stay out of conflicts with canonical tags, and link back with the same complete set — a one-way annotation is ignored entirely. That verification means running this checker on each version and comparing the sets, which is exactly how the report above frames its output: definitive on what this page declares, explicit about what needs checking on the others.'] },
      { h: 'How to use this hreflang checker', p: ['Analyze mode reads a live page: enter its URL in the panel, and every hreflang link it declares is loaded below as markup for validation, with the page’s canonical set as the self-reference to check against. Manual mode takes any HTML — the full page source or just the head section from a template, a staging environment or a client’s site — and the optional self-reference field accepts this page’s own URL so the required self-reference can be confirmed without a fetch.', 'Run it wherever hreflang is written: after a translation ships, during a template review, when a migration changes URL patterns, and before assuming a translated cluster is working. The most expensive hreflang bugs are invisible in any single page view — a cluster that quietly stopped matching after one side was renamed — so keep the sets small, documented and re-validated together rather than maintained by memory across a large site.'] },
      { h: 'Hreflang mistakes that void the annotations', p: ['Case errors first: en-us with a lowercase region is invalid, and the annotation is dropped. Then structural ones — a self-reference missing from the set, the same language declared for two different URLs, hreflang pointing at redirect chains or non-200 responses, and pages that carry hreflang for other languages but canonically resolve to a single URL anyway, where the canonical wins and the annotations are ignored. Publishing hreflang on the home page only, or on one page of a section, is the same category of half-implementation: the contract needs both sides.', 'The strategic mistakes matter more. Do not invent regions you do not serve — annotations for languages you cannot maintain waste crawl attention and set user expectations the site cannot keep. Do not use hreflang as a substitute for canonical when two URLs serve identical content in one language; that is what the canonical tag is for. And remember the directives are hints, not guarantees: they shape which version of a page appears where, but they never substitute for content that actually serves the visitor’s language and market.'] },
    ],
    faqs: [
      { q: 'What is the correct hreflang format?', a: 'Lowercase ISO 639 language, optional UPPERCASE ISO 3166 region: en, fr-FR, pt-BR, zh-HK. x-default marks the fallback version. Mixed case like En-us is invalid and the annotation is ignored.' },
      { q: 'Why must a page reference itself in hreflang?', a: 'The self-reference marks the page as a member of the cluster; without it, search engines drop the whole set for that page. This hreflang checker confirms it whenever you supply the page’s own URL.' },
      { q: 'Does this hreflang checker verify that alternates link back?', a: 'No — reciprocity can only be confirmed by reading each alternate page. The checker validates everything this page declares, then lists the URLs to compare, version by version.' },
      { q: 'Do I need an x-default hreflang?', a: 'It is optional but recommended: it names the page shown to visitors whose language and location match nothing in the set — typically the language-selector or global version. Without it, platforms pick a default for you.' },
    ],
    html: `
${f.textarea('hlc-src', 'Page HTML (full page or just the <head>)', '<link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/page/">', 9)}
${f.url('hlc-self', 'This page’s own URL (for the self-reference check)', 'https://example.com/page/')}
<p class="tool-note" id="hlc-stats"></p>
${outputArea('hlc-list', 'Annotations')}
${note('Codes, duplicates and self-reference are validated in your browser; reciprocity must be confirmed on each alternate page.')}`,
  },

  // ---------------------------------------------------------- 12
  {
    slug: 'website-audit',
    name: 'Website Audit',
    cat: 'seo',
    icon: '🔍',
    card: 'Crawl up to 100 pages with a live scan ledger and get every on-page, technical, visual and link issue, with fixes.',
    usedFor: 'for a full-site to-do list before a launch',
    updated: '2026-10-31',
    pickWhy: 'One run crawls up to 100 pages, checks 40+ rules on each and hands back a prioritized fix list — every finding carries a plain-language fix and the tool that does the job. Watch every crawler step live in the scan ledger. Free, no signup, no limits.',
    pickSample: `404  /contact-old/     Broken internal link — remove or redirect
desc /pricing/         Meta description 210 chars — trim to 155
dup  title × 3 pages   /blog/, /blog/page/2/ +1 — write unique titles
Score 74/100 · 100 pages · 12 fixes prioritized`,
    keywords: 'website audit seo audit site audit crawl audit url audit full site check',
    focus: 'website audit',
    h1: 'Free Website Audit — Crawl Your Site, Find What to Fix',
    metaTitle: 'Free Website Audit — Crawl Up to 100 Pages Online',
    metaDesc: 'Free website audit: crawl up to 100 pages of any public site and get 40+ on-page, technical and link checks with a prioritized fix list. No signup.',
    intro: 'This website audit reads your sitemap, crawls up to 100 pages and checks each one with the same 40+ on-page, technical, content and link rules our own audits run. Every finding shows its evidence, a plain-language fix, and the tool that does the job.',
    sections: [
      { h: 'What this website audit checks', p: ['The crawl covers six layers. Technical: HTTP status, redirect chains, canonical tags, robots directives, language declaration, viewport and content type. On-page: title and description lengths against the accepted ranges, heading order, H1 count. Structured data: whether JSON-LD parses and matches what the page visibly shows. Content and assets: word count, image alt text, intrinsic dimensions, HTML weight. Visual and layout: every image the page loads is fetched to catch dead files, soft-404 error pages served as images, payloads over the 300 KB budget and embeds that shift the layout when they load. And links: vague anchors, javascript: hrefs, internal-link density — plus site-wide cross-checks that need the whole crawl: duplicate titles, duplicate descriptions, duplicate H1s, orphan pages nothing links to, broken internal links and dead outbound links.', 'Every threshold is the same one our own site audits enforce — this tool runs the identical rule engine against your pages, not a simplified copy. Findings are ordered by severity: blockers are broken or unreachable things, majors are defects that cost you visibility, minors are hygiene, info is context.'] },
      { h: 'How the crawl works', p: ['The audit starts at your robots.txt and sitemap.xml (a sitemap index is followed up to three files deep), keeps the page URLs on your own domain, and caps the crawl at 100 pages. Each page is fetched by our server in small batches — your browser never contacts your host directly — then parsed and run through the rule engine. After the pages, the crawl checks the images each page loads and up to 100 of the link targets it found, so broken internal links, dead outbound links and dead or oversized images are detected by fetching the target, not by guessing.', 'The scan ledger records every step as it happens — robots, sitemap, each crawl batch, each link and image check — with what was found and how long it took, so you can see the work instead of trusting a spinner. Alongside it, the filmstrip shows each page exactly as the crawler received it. You can stop at any point and resume from where you left off within the same browser session. Nothing about your site is stored after the run — the report lives in your browser until you close or re-run it.'] },
      { h: 'How to work through the results', p: ['Fix blockers first: a 404 inside your own site or a page that will not load wastes both visitor trust and crawl budget, and nothing else matters until it resolves. Then the majors — duplicate titles and descriptions mean two pages compete for one query and search engines pick the wrong one; thin pages rarely rank; missing alt text is the most common accessibility failure on the web. Minors are worth a pass once the majors are done.', 'Check whether a finding repeats across many pages before editing anything. A defect on one page is a page edit; the same defect on every page is a template edit, and fixing the template once clears the whole group. When a title or description finding fires, the report offers an AI draft built from that page’s actual content — review it before using it, and keep the part that names what the page really does.'] },
      { h: 'What this audit cannot see', p: ['This is a crawl of what your server returns, not a browser session: pages that render their content only through JavaScript will look thin here even when visitors see a full page — paste the rendered HTML into the SEO Score Checker for those. The audit has no access to Google Search Console, so it cannot report impressions, queries, index coverage or which canonical Google actually selected. It does not measure backlinks, page speed on real devices, or keyword demand.', 'Treat the score as a checklist summary that makes two runs comparable — this deploy removed six points, this fix added four back — not as a prediction of rankings. The value is in the finding list: each item names the page, shows the evidence it fetched, and says what to change.'] },
    ],
    faqs: [
      { q: 'How many pages does this website audit crawl?', a: 'Up to 100 pages, discovered from your sitemap.xml (a sitemap index is followed up to three files deep). The crawl cap keeps a single run fast and free; run it again after publishing to re-check.' },
      { q: 'Does the website audit use Google’s data?', a: 'No. It fetches your public pages and checks them against documented on-page, technical and link thresholds. It has no access to Search Console, so index status, impressions and queries are outside its view.' },
      { q: 'Is my site or the report stored anywhere?', a: 'No. Pages are fetched on demand for the run, and the report stays in your browser. Closing the tab or starting a new audit discards it.' },
      { q: 'Does this audit test how my site looks?', a: 'It runs the visual checks that do not need a browser: every image the page loads is fetched to catch dead files, error pages served as images and oversized payloads, and embeds without reserved dimensions are flagged for layout shift. It does not render pixels, so colour contrast, spacing taste and font choices are outside its view — the filmstrip shows each page as the crawler received it, which is what search engines see.' },
      { q: 'Why does a page I can open fail the audit?', a: 'The audit reads the server’s HTML like a crawler does — no JavaScript rendering, no login, no region unblocking. A page that only renders through scripts will look thin here; use the SEO Score Checker with pasted rendered HTML for that case.' },
      { q: 'Can it audit a staging or private site?', a: 'Only pages publicly reachable from our server can be crawled. Private, password-protected or IP-restricted staging sites cannot be fetched; audit the production site or paste individual pages into the single-page tools.' },
    ],
    html: `
${f.url('wa-url', 'Website URL to audit', 'https://your-site.com')}
<div class="btn-row">
  <button type="button" class="btn" id="wa-run">Audit Website</button>
  <button type="button" class="btn btn-ghost" id="wa-stop" hidden>Stop audit</button>
  <button type="button" class="btn btn-ghost" id="wa-resume" hidden></button>
  <button type="button" class="btn btn-ghost" id="wa-copy-report" data-copy data-copy-text="">Copy report</button>
</div>
<div class="stat-line" id="wa-status" aria-live="polite"></div>
<div class="wa-ledger" id="wa-ledger" hidden></div>
<div class="score-wrap" id="wa-score" hidden>
  <div class="score-ring" id="wa-ring"><span id="wa-ring-num">0</span></div>
  <div class="score-meta">
    <p class="score-label">Site audit score</p>
    <p class="score-grade" id="wa-grade"></p>
    <p class="score-note" id="wa-note"></p>
  </div>
</div>
${outputArea('wa-pages', 'Pages audited')}
<div class="wa-filmstrip" id="wa-filmstrip" hidden></div>
<div class="wa-query" id="wa-query" hidden>
  <label class="wa-query-label" for="wa-q">Ask this audit</label>
  <input id="wa-q" type="search" autocomplete="off">
  <div class="wa-chips" id="wa-chips"></div>
  <p class="wa-query-count" id="wa-qcount" aria-live="polite"></p>
</div>
${outputArea('wa-out', 'Findings and fixes')}
${note('Pages are fetched and checked by our server; your browser never contacts the audited site. The score summarizes the checks listed below — it is not a Google score or a ranking prediction.')}`,
  },
];

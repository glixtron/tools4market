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
    keywords: 'meta tag generator html head title description',
    h1: 'Free Meta Tag Generator — No Signup, No Limits',
    metaTitle: 'Free Meta Tag Generator — Create SEO Head Tags Online',
    metaDesc: 'Generate title, description, robots, canonical and Open Graph meta tags with a live Google preview. Free online meta tag generator, no signup.',
    intro: 'Fill in your page details and get a clean, copy-paste-ready HTML head block — with a live Google search preview so you know exactly how your page will look in results.',
    sections: [
      { h: 'What this meta tag generator does', p: ['Every page needs a small set of tags in its <head> for Google, social networks and browsers to understand it: a title, a meta description, robots instructions and a canonical URL. This generator assembles them for you with correct syntax and quoting, so you never ship a malformed tag again.', 'The preview panel mimics a Google desktop search snippet. Titles beyond roughly 580 pixels (about 60 characters) and descriptions beyond roughly 920 pixels get truncated in real results — watch the preview and keep the important words in front.'] },
      { h: 'How to use it', p: ['Enter your page title (aim for 50–60 characters), a description of 120–158 characters, and the canonical URL of the page. Choose the robots directive — leave it on “index, follow” unless the page should stay out of Google. Then copy the generated block into the <head> section of your HTML, just before the closing </head> tag.', 'If your site runs on WordPress, paste the tags into your SEO plugin’s advanced fields instead of editing theme files directly.'] },
      { h: 'Choosing the right robots directive', p: ['Leave the directive on index, follow for every page you want in search results — homepages, product pages, blog posts, category listings. Switch to noindex only when a page genuinely should stay out of Google: an internal thank-you page, a filtered utility URL, a staging duplicate. Nofollow is rarely the answer you want, because it stops link equity flowing out rather than keeping the page itself out of the index.', 'Leave the charset and viewport boxes ticked: UTF-8 keeps accents, currency symbols and emoji intact, and the viewport tag is what stops your page rendering as a shrunken desktop site on phones. Add the author field when the page has a named writer, since it is cheap context for search engines. Tick the Open Graph option too if you are not generating social tags separately — the output nests them in the right order for Facebook and LinkedIn.'] },
      { h: 'Mistakes that shrink your snippet', p: ['The most common failure is one generic title copied across every page. Home | Example Company says nothing about the page and gives search engines no reason to prefer your result over a competitor’s. Write each title around that page’s actual topic, put the phrase people search for near the front, and leave the brand name to the end so it survives truncation. If the tail is already cut in the preview, the important words are in the wrong place.', 'The second mistake is a description written for machines: a comma-separated list of keywords reads as spam, and Google rewrites it anyway. Write one sentence about what the visitor gets and one about why it is worth the click, then read it aloud — if it sounds like a list of terms, it reads like one too. Finally, confirm the canonical URL matches the live address exactly — protocol, host and trailing slash — because a canonical that disagrees with the real URL wastes the tag.'] },
    ],
    faqs: [
      { q: 'What is a meta tag?', a: 'Meta tags are snippets of HTML that describe a page to search engines and browsers. They live in the <head> section and are not visible on the page itself. The most important ones for SEO are the title, meta description, robots and canonical tags.' },
      { q: 'What is the ideal meta description length?', a: 'Google typically shows 120–158 characters on desktop and slightly fewer on mobile. Longer descriptions are truncated with an ellipsis. Write the key message in the first 120 characters.' },
      { q: 'Are meta keywords still used by Google?', a: 'No. Google has ignored the meta keywords tag since 2009. It is harmless but pointless — include it only if other engines or internal tooling require it.' },
      { q: 'Do I need to add these tags to every page?', a: 'Yes — every indexable page should have a unique title and description. Duplicate titles across pages confuse search engines and reduce click-through rate.' },
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
<p class="preview-label">Google search preview</p>
<div class="google-preview">
  <div class="gp-url" id="mt-prev-url">example.com</div>
  <div class="gp-title" id="mt-prev-title">Page title</div>
  <div class="gp-desc" id="mt-prev-desc">Meta description…</div>
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
    keywords: 'open graph generator og tags facebook preview linkedin',
    h1: 'Free Open Graph Generator — No Signup, No Limits',
    metaTitle: 'Free Open Graph Generator — OG Tags + Live Preview',
    metaDesc: 'Generate Open Graph (og:) meta tags with a live Facebook-style preview. Control how your links look when shared on Facebook, LinkedIn and WhatsApp.',
    intro: 'Create perfect og: tags and see exactly how your link card will look when someone shares it on Facebook, LinkedIn, WhatsApp or Slack — before you publish.',
    sections: [
      { h: 'Why Open Graph tags matter', p: ['When a URL is shared without Open Graph tags, social platforms guess: they pick a random image or none at all, and the title may be wrong. A link card with a sharp image, a clear title and one line of description gets measurably more clicks — the difference between a share that converts and one that scrolls past.', 'The og:title, og:description, og:image and og:url properties are read by Facebook, LinkedIn, WhatsApp, Discord, Slack, Telegram and most messaging apps. og:type tells platforms whether the page is a website, an article, a video or a product.'] },
      { h: 'How to use it', p: ['Paste your page URL, add the title and description you want shown, and give an absolute image URL (at least 1200×630 pixels for best results). Choose the og:type, copy the generated tags into your <head>, then validate the result with the Facebook Sharing Debugger or LinkedIn Post Inspector after publishing.', 'Images must be publicly reachable over HTTPS — images on a private drive or behind a login will show an empty card.'] },
      { h: 'Choosing the right og:type', p: ['og:type sets the category the platform files your link under, and the wrong choice changes how the card is rendered. Use website for homepages and static landing pages, article for blog posts and news, product for individual items with a price, profile for a person or company page, and video when the page is mainly a player. If nothing else fits, website is the safe default — platforms rarely penalise it.', 'og:site_name and og:url matter more than they look. The site name sits on the card as the source line, so use the name people actually recognise rather than an internal company string. The URL should be the canonical address of the page — the same one you put in the canonical tag — so shares, comments and engagement accrue to one stable link instead of scattering across parameter variants.'] },
      { h: 'How to check your work', p: ['Fill the fields and watch the preview panel: it mirrors the card layout, so if the title wraps to three lines or the image crops oddly, fix it before you publish. The preview is the fast check; the real check happens once the page is live. Copy the URL and run it through the Facebook Sharing Debugger or LinkedIn Post Inspector, which scrape the published page and show you the values platforms actually read.', 'When a scraper shows an old image or a title you changed days ago, that is caching, not a broken tag. Ask the debugger to scrape again, or append a version string to the image URL so the crawler fetches a fresh copy. Then check the card on a phone: WhatsApp and LinkedIn render more conservatively than the desktop preview, and a card that is legible at thumbnail size works everywhere.'] },
    ],
    faqs: [
      { q: 'What image size should og:image be?', a: '1200×630 pixels is the Facebook-recommended size (ratio 1.91:1). Keep the file under 1 MB and always reference it with an absolute https:// URL.' },
      { q: 'Why is my old image still showing after I updated the tags?', a: 'Platforms cache share data aggressively. Use the Facebook Sharing Debugger’s “Scrape Again” button, or append a query string like ?v=2 to the image URL to bust the cache.' },
      { q: 'Do Open Graph tags affect Google rankings?', a: 'Not directly. Google uses its own title and description. OG tags affect click-through rate from social shares, which indirectly brings traffic and engagement.' },
      { q: 'Do I still need Twitter Card tags?', a: 'X (Twitter) now falls back to Open Graph tags when twitter: tags are missing. Dedicated twitter: tags are only needed to override OG values or force a different card style.' },
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
<p class="preview-label">Facebook / LinkedIn share preview</p>
<div class="fb-preview">
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
    keywords: 'twitter card generator x card meta tags',
    h1: 'Free Twitter Card Generator — No Signup, No Limits',
    metaTitle: 'Free Twitter (X) Card Generator — Live Card Preview',
    metaDesc: 'Generate Twitter Card meta tags (summary and summary_large_image) with a live X preview. Control how your links look on Twitter/X. Free, no signup.',
    intro: 'Generate twitter: card tags for X (formerly Twitter) with a live preview of exactly how your link card will render in the timeline.',
    sections: [
      { h: 'Card types explained', p: ['X supports several card types, but two matter in practice: summary_large_image shows a big picture above the tweet text — best for articles and landing pages — and summary shows a small square thumbnail beside the text — best for documentation and minimal links.', 'The twitter:site tag should hold the X handle of the site (e.g. @yourbrand) and twitter:creator the handle of the author. Both are optional; the card still renders without them. If you omit twitter:title, twitter:description and twitter:image, X falls back to your Open Graph tags.'] },
      { h: 'How to use it', p: ['Choose the card type, fill in the title, description and absolute image URL, then paste the generated tags into your page <head>. After publishing, run the URL through the X Card Validator (or simply paste the link into a draft tweet) to confirm the card renders.', 'Keep card images at 2:1 ratio, minimum 300×157 pixels and under 5 MB.'] },
      { h: 'Writing card copy that earns the tap', p: ['A timeline card has about two lines of description to work with, so front-load the payoff. Title: what the reader gets, in plain words, with the concrete detail that makes it believable — a number, a timeframe, a named outcome. Description: one sentence of context and one reason to open it now. People scrolling a feed are deciding in a glance, not comparing results the way they would in search.', 'The image carries most of the attention, so choose one that reads at small size: a single clear subject, strong contrast, and text only if it survives being cropped. A dark screenshot with fine print turns into a grey rectangle on most timelines, no matter how good the article behind it is. Show the draft card to someone who has not seen the page — if they cannot tell what the link offers, the image is not doing its job.'] },
      { h: 'How this tool works', p: ['Every field maps to one tag in the output: the card type selector sets twitter:card, the handles fill twitter:site and twitter:creator, and the remaining fields emit the title, description and image. The preview re-renders as you type, laying the values out the way the timeline does — image on top for summary_large_image, thumbnail beside the text for summary — so you are looking at the card, not imagining it.', 'If a value is left empty, the tag is simply omitted, and X falls back to your Open Graph tags for that property — which is why the same page can look right on X while sharing poorly on LinkedIn. Generate a complete set here, then reuse those values in your Open Graph tags so the two blocks never disagree about what the page is. Handles are optional; fill in the site handle whenever the posting account is known, since it credits the source on the card.'] },
    ],
    faqs: [
      { q: 'Do Twitter Card tags still work now that it is called X?', a: 'Yes. The meta tag names are still twitter:*, and the cards still render on X. The brand changed, the protocol did not.' },
      { q: 'summary or summary_large_image — which should I pick?', a: 'Use summary_large_image for content where the picture sells the click (articles, features, portfolios) and summary for text-first contexts like docs, changelogs and API pages.' },
      { q: 'My card shows the wrong image — why?', a: 'X caches cards for about seven days. Append a cache-busting query parameter (?v=2) to the image URL, or re-validate the URL in the card validator to force a refresh.' },
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
<p class="preview-label">X (Twitter) card preview</p>
<div class="x-preview">
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
    keywords: 'canonical tag generator rel canonical duplicate content',
    h1: 'Free Canonical Tag Generator — No Signup, No Limits',
    metaTitle: 'Free Canonical Tag Generator — rel=canonical Online',
    metaDesc: 'Generate rel=canonical link tags instantly. Tell Google which version of a URL to index and avoid duplicate-content issues. Free, no signup.',
    intro: 'Generate a correct rel="canonical" link tag for any URL — the one line of HTML that tells search engines which version of a page is the real one.',
    sections: [
      { h: 'When you need a canonical tag', p: ['The same content is often reachable at several URLs: with and without a trailing slash, with query parameters, on HTTP and HTTPS, or across print/sort variants of a category page. Without a canonical, search engines may pick a different version than you want, splitting ranking signals across duplicates.', 'A canonical tag consolidates those signals onto the URL you choose. It is a hint, not a directive — but Google follows it in the vast majority of cases when the duplicates are genuinely equivalent.'] },
      { h: 'How to use it', p: ['Paste the absolute URL of the preferred version (including https:// and the final shape you want indexed). Copy the generated line into the <head> of every duplicate variant of that page — including the preferred page itself, which should carry a self-referencing canonical.', 'Keep the canonical consistent with your sitemap and internal links: those should point at the canonical URL too.'] },
      { h: 'When a canonical is the wrong fix', p: ['Reach for a redirect when the duplicate should not exist at all — visitors to the old address should land on the new one, not read identical content at two URLs. Reach for noindex when the page must stay reachable for users but should never appear in search, such as an internal filter view. A canonical is for the third case: the URL genuinely has to work, and only one version should count.', 'Two canonicals will be ignored: one pointing at a URL that is itself noindexed or blocked, and one pointing at a page with substantially different content. Google will not promote a page you have told it to distrust, and it will not fold a genuinely different page into another just because you asked. A canonical pointing at a redirect fails the same way — choose the final destination instead. If the target cannot rank on its own, fix the target first.'] },
      { h: 'Checking your canonicals after you publish', p: ['View the source of each variant — with and without www, with a trailing slash, with the tracking parameters you actually use — and confirm every copy carries the identical tag pointing at the same address. One variant left out quietly reintroduces the duplicate, and search engines will treat that version as its own page again. Search Console’s URL inspection shows which page Google selected and whether the canonical it sees matches the one you wrote.', 'Then make the rest of the site agree. Internal links should point at the canonical address rather than a variant, your sitemap should list only canonical URLs, and your internal search results and redirects should resolve to it as well. When those disagree, you send mixed signals about which address is real, and the canonical tag ends up arguing with the rest of your own site. A quick sweep of your highest-traffic templates usually catches a mismatch before it costs you anything.'] },
    ],
    faqs: [
      { q: 'Should every page have a canonical tag?', a: 'Yes — a self-referencing canonical on every indexable page is best practice. It protects you against parameterised or otherwise mutated URLs being treated as separate pages.' },
      { q: 'Canonical vs 301 redirect — which one?', a: 'A redirect is for pages that no longer exist at the old URL: users should land on the new one. A canonical is for pages that must remain reachable at several URLs, but only one should count in search.' },
      { q: 'Can a page canonicalise to a completely different page?', a: 'Only if the content is essentially the same (e.g. a syndicated article pointing at the original). Pointing a genuinely different page at another URL tells search engines to ignore yours — do not do this to force rankings.' },
      { q: 'Relative or absolute URL in canonical?', a: 'Always absolute, including the protocol. Google recommends full URLs like https://example.com/page/.' },
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
    keywords: 'hreflang generator alternate language tags international seo',
    h1: 'Free Hreflang Tag Generator — No Signup, No Limits',
    metaTitle: 'Free Hreflang Tag Generator — Multi-Language SEO Tags',
    metaDesc: 'Generate hreflang link tags for multilingual and multi-region sites, with x-default support. Copy-paste ready. Free online hreflang generator.',
    intro: 'Generate the full set of hreflang link tags for pages translated into multiple languages or targeted at multiple countries — including the x-default fallback.',
    sections: [
      { h: 'What hreflang does', p: ['Hreflang tags tell Google which language or regional version of a page to show to which users. A user searching in Germany should get the German page; a user in Australia should get the en-au version. Without hreflang, Google may show whichever version it thinks is closest, and users bounce off the wrong language.', 'Every language/region variant must reference all other variants — including itself — forming a complete, reciprocal cluster. If one member of the cluster is missing a link, the whole cluster can be ignored.'] },
      { h: 'How to use it', p: ['Add one row per version: an ISO 639-1 language code (en, de, fr, es), an optional ISO 3166-1 alpha-2 region (gb, us, de), and the absolute URL of that version. Add an x-default URL for users whose language matches none. Paste the generated block into the <head> of every variant — each variant carries the identical set of tags.', 'Format rules: language is lowercase (en), region is uppercase in display but hreflang accepts en-gb; the two are joined with a hyphen (en-gb).'] },
      { h: 'How this tool builds the cluster', p: ['Each row you add becomes one hreflang link element, and the tool writes the full reciprocal set for every row — including a reference back to each URL itself, which is the part hand-written blocks most often miss. Add the x-default URL and it is appended as the fallback entry. The block in the output is the exact set that goes into the head of every variant.', 'Copy the identical block to every member of the cluster — do not generate a shorter set for the German page. Reciprocity is binary: either every version announces every other version, or Google treats the annotations as unreliable and ignores the lot. The same block on each variant is far easier to maintain than five slightly different ones, and that is what the output gives you.'] },
      { h: 'Mistakes that break a cluster', p: ['The classic failure is editing one variant and forgetting the rest: the French page gains a new locale, the Spanish page never hears about it, and the cluster stops being reciprocal. The second is pointing hreflang at URLs that are not canonical — a redirect, a noindexed page, or a parameter URL — which makes the annotation contradictory. Always annotate the canonical address of each version, the one you would put in the sitemap.', 'A third trap is over-targeting: en-gb, en-au, en-us and en-ca pages that are identical apart from a price will split your authority across four near-duplicates. Only create a regional variant when the content genuinely differs for that audience. If every English speaker should see the same page, one en URL is stronger than four clones. Keep the cluster small enough to maintain — every variant you add is a page someone has to update forever, in every language, every time the content changes.'] },
    ],
    faqs: [
      { q: 'What is the difference between en-gb and en?', a: 'en targets all English speakers worldwide; en-gb targets English speakers in the United Kingdom specifically. Use plain en as the general version and en-gb only when you maintain a genuinely UK-specific page.' },
      { q: 'What is x-default?', a: 'x-default marks the version shown when the visitor’s language/region matches none of your cluster — typically the global homepage or a language-selection page.' },
      { q: 'Do hreflang tags replace a canonical tag?', a: 'No. Each language version still needs its own self-referencing canonical. Hreflang and canonical solve different problems and work together.' },
      { q: 'Can I use hreflang in the sitemap instead of the head?', a: 'Yes — sitemap xhtml:link annotations are an accepted alternative and are easier to manage at scale. The tags must still be reciprocal across the cluster.' },
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
    keywords: 'schema generator json ld structured data faq rich results',
    h1: 'Free Schema Markup Generator — No Signup, No Limits',
    metaTitle: 'Free Schema Markup Generator (JSON-LD) — 6 Types',
    metaDesc: 'Generate valid JSON-LD structured data for FAQ, Article, Product, LocalBusiness, Organization and Breadcrumbs. Rich-result-ready output, free and no signup.',
    intro: 'Generate valid JSON-LD structured data for the six schema types that win rich results most often — FAQ, Article, Product, LocalBusiness, Organization and Breadcrumbs.',
    sections: [
      { h: 'What structured data gives you', p: ['Schema.org markup is machine-readable metadata that lets Google understand facts about your page: that a list is a set of questions and answers, that a number is a price, that a block is a business address. Pages with correct markup become eligible for rich results — FAQ dropdowns, product prices, review stars, breadcrumbs — which raise visibility and click-through rate.', 'JSON-LD is the format Google recommends: a single script block in the <head> or <body>, separate from the visible HTML. Only mark up content that actually exists on the page — marking up hidden or fabricated content risks a manual action.'] },
      { h: 'How to use it', p: ['Pick the schema type, fill in the fields (add or remove rows for FAQs and breadcrumbs), and copy the generated JSON-LD into your page — ideally just before </head>. Validate the result in Google’s Rich Results Test before deploying.', 'You can combine multiple types on one page: e.g. Article plus FAQPage plus BreadcrumbList, each in its own script block.'] },
      { h: 'Where structured data pays off first', p: ['Start with pages where markup changes what the searcher sees: FAQ blocks on support and comparison pages, Product markup on anything with a price and stock level, LocalBusiness markup on location pages, and BreadcrumbList on deep site sections where the URL tells searchers nothing. Article markup is worth adding to anything with a byline and a date. Organization markup belongs on the homepage, once, where it describes the site rather than a single page.', 'Skip markup that describes nothing a searcher could act on. A copyright line wrapped in schema, a star rating the page never displays, an author block for a name that appears nowhere visible — none of it helps, and all of it is the kind of mismatch that gets structured data withdrawn. The rule is simple: if a visitor cannot see the fact in the page, do not claim it in JSON-LD.'] },
      { h: 'Keeping your markup honest', p: ['Structured data is a promise about the page, so update it when the page changes. A price edited in the template but not in the JSON-LD, an FAQ left in the markup after the section was removed, an event date that passed months ago — each one is a discrepancy a reviewer, human or automated, can find in seconds. Tie the markup to the same template that renders the visible content wherever you can.', 'Validate before and after deploy. The generated block should pass Google’s Rich Results Test unchanged; if a validator reports a missing required field, fill it in the form here rather than editing the JSON by hand, because hand-edited JSON-LD breaks on quotes, commas and line breaks. Once it is live, re-check after every template change — markup that worked last quarter is not guaranteed to work now, and search requirements move over time.'] },
    ],
    faqs: [
      { q: 'Which schema type should I use for a blog post?', a: 'Article (with headline, author and datePublished), plus BreadcrumbList for navigation and FAQPage if the post contains a genuine question-and-answer section.' },
      { q: 'Is JSON-LD better than microdata?', a: 'For Google, yes — it is the officially recommended format. It is easier to maintain because it lives in one block instead of being threaded through your HTML attributes.' },
      { q: 'Does schema markup guarantee rich results?', a: 'No — it makes you eligible. Google decides per query whether showing a rich result improves the experience. Correct, complete markup measurably improves the odds.' },
      { q: 'Where do I put the generated code?', a: 'Anywhere in the page HTML; the <head> just before </head> is conventional. On WordPress, use your SEO plugin’s schema/JSON-LD field or a code snippets plugin.' },
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
    card: 'See your Google snippet with pixel-accurate truncation warnings.',
    keywords: 'serp preview tool google snippet title pixel width checker',
    h1: 'Free SERP Preview Tool — No Signup, No Limits',
    metaTitle: 'Free SERP Preview Tool — Pixel-Accurate Snippet Checker',
    metaDesc: 'Preview your Google search snippet with pixel-width measurement. Catch truncated titles and descriptions before you publish. Free SERP preview tool.',
    intro: 'Type your title and description and see your Google result the way searchers will — with pixel-accurate truncation warnings, not just character counts.',
    sections: [
      { h: 'Why pixels matter more than characters', p: ['Google truncates titles and descriptions by pixel width, not by character count. A title of 58 characters in wide letters (lots of W’s and M’s) can cut off while a 66-character title in narrow letters fits. Pixel measurement is the only reliable check — it is what this tool uses internally.', 'Truncation is not just cosmetic: the tail of your title often carries the differentiator (“free”, “2026”, your brand). If it is cut, searchers clicking you may not see why you are the right result — and titles that get cut mid-phrase lower click-through rate.'] },
      { h: 'How to use it', p: ['Enter your target URL, title and description. The preview updates live. Aim for a title under ~580 pixels (and put the primary keyword early), a description of 120–158 characters, and keep the URL short and readable. Adjust until no warning shows, then paste the final values into your page or CMS.', 'Mobile results allow slightly fewer pixels — treat any warning as a signal to shorten, even if the desktop preview still fits.'] },
      { h: 'How this tool measures the snippet', p: ['Google does not count characters; it measures width. The preview renders your title in the same 20px Arial metrics desktop results use and your description at snippet size, then reports how many pixels each occupies against the point where results cut them off. That is why a title full of wide capitals can fail at sixty characters while a lean one survives past sixty-five.', 'The length check under the preview gives you both readings — characters and pixels — plus a pass or warn status, so you can decide with numbers instead of guesses. Treat the pixel figure as the limit and the character count as a writing guide. When the two disagree, the pixels win: they are what the results page actually renders.'] },
      { h: 'Tightening your snippet until it fits', p: ['Work in this order: put the primary phrase at the front, add the brand at the end, then cut whatever sits between them that a searcher already knows. Qualifiers like best, free and online earn their place only when they change the promise. If the warning still shows, shorten the brand treatment — drop the tagline, keep the name — rather than losing the keyword.', 'Do the same for the description: put the differentiating sentence in the first hundred and twenty characters, and treat anything past the warning point as bonus. Then paste the final strings straight into your CMS and open the preview once more after publishing — CMS editors sometimes trim trailing punctuation or wrap text in markup that shifts what Google sees.', 'Keep the URL line short and readable — a clean path under the title makes the result look like a destination rather than a tracking link. Most CMS slug settings do this for you if you let them generate the path from the page name, and a shorter address also fits without an ellipsis.'] },
    ],
    faqs: [
      { q: 'What is the pixel limit for title tags?', a: 'Roughly 580–600 pixels on desktop, which is around 55–65 characters depending on letter widths. This tool measures with the same 20px Arial metrics Google-style snippets use.' },
      { q: 'Does Google always use my title tag?', a: 'No. Google rewrites titles in a minority of cases (too long, keyword-stuffed, or a better match found in the page). Clean, accurate, well-sized titles are rewritten far less often.' },
      { q: 'What is the ideal meta description length in 2026?', a: '120–158 characters (up to ~920 pixels). Google may pull a passage from the page instead, but a well-written description gives you the best shot at controlling the snippet.' },
      { q: 'Should I put my brand name in the title?', a: 'Yes, at the end, separated by a pipe or dash — as long as it fits. Brand names in titles can improve click-through and are rarely removed by Google.' },
    ],
    html: `
${f.url('sp-url', 'Page URL', 'https://example.com/free-seo-tools')}
${f.text('sp-title', 'Title tag', 'Free SEO Tools — 18 Browser-Based Utilities | Tools4Market', 'Free SEO Tools — 18 Browser-Based Utilities | Tools4Market')}
${f.text('sp-desc', 'Meta description', 'Run 18 free SEO and marketing tools right in your browser. No signup, no limits — meta tags, robots.txt, schema, keyword density and more.', 'Run 18 free SEO and marketing tools right in your browser. No signup, no limits — meta tags, robots.txt, schema, keyword density and more.')}
<p class="preview-label">Google desktop preview</p>
<div class="google-preview">
  <div class="gp-url" id="sp-prev-url">example.com</div>
  <div class="gp-title" id="sp-prev-title">Title</div>
  <div class="gp-desc" id="sp-prev-desc">Description</div>
</div>
<div class="stat-line" id="sp-stats"></div>
${outputArea('sp-out', 'Length check')}`,
  },

  // ---------------------------------------------------------- 8
  {
    slug: 'meta-description-checker',
    name: 'Meta Description Checker',
    cat: 'seo',
    icon: '📏',
    card: 'Test length, pixel width and snippet fit of any description.',
    keywords: 'meta description checker length tester serp snippet',
    h1: 'Free Meta Description Checker — No Signup, No Limits',
    metaTitle: 'Free Meta Description Checker — Length & Pixel Tester',
    metaDesc: 'Check meta description length in characters and pixels with a live Google snippet preview. Instant feedback: too short, good, or too long. Free tool.',
    intro: 'Paste any meta description and instantly see whether it is too short, in the sweet spot, or likely to be truncated in Google — measured in both characters and pixels.',
    sections: [
      { h: 'What a good description looks like', p: ['A strong meta description is 120–158 characters, contains the page’s primary keyword naturally, gives one concrete reason to click, and ends cleanly rather than mid-sentence. Descriptions below ~70 characters waste most of the snippet; above ~158 characters (about 920 pixels) the ending is cut with an ellipsis.', 'Google rewrites descriptions more often than titles — usually when the description does not match the query. You cannot force your snippet, but a relevant, well-sized description wins the majority of impressions.'] },
      { h: 'How to use it', p: ['Paste or draft your description in the box. The checker reports characters, pixel width at Google-style 14px metrics, and a colour-coded status. Watch the preview: if the last words disappear, shorten. Front-load the value proposition in the first 120 characters so nothing critical is ever truncated, then paste the final text into your CMS or meta tag generator.'] },
      { h: 'Mistakes that get your description rewritten', p: ['The most common one is writing for the keyword rather than the click: a sentence crammed with the target phrase reads as machine text, and Google replaces it with a passage from the page that answers the query better. Use the keyword once, naturally, then say something specific — what the page offers, for whom, and why it beats the alternatives.', 'The second is letting one description serve a whole template. If every product page shares the same sentence, Google has no reason to show yours and searchers see nothing to distinguish the pages. The third is writing past the end of the thought: a description cut mid-sentence looks unfinished. Finish your point inside 120 characters, then use the rest for supporting detail.'] },
      { h: 'How to read the verdict', p: ['The stat line reports characters and pixel width together, and the verdict below tells you whether the text is too short, comfortably inside the range, or likely to be cut. Too short means you are giving away free space in the most valuable ad you will ever run for that query — expand it. Too long means the ending is at risk — move it forward.', 'Watch the preview as you edit rather than the number alone. If the final words disappear from the snippet box, the description is over the line regardless of what the count says, and if a whole line sits empty, you have room to make a stronger claim. When the preview holds the full sentence and the status goes green, paste it into your page and move on.', 'Paste the description back in from the finished page once it is published, since some CMS fields add or drop characters — an emoji in the title or a smart quote in the description can push the pixels over the line after you have already saved. It takes a moment and catches the last class of overflow.'] },
    ],
    faqs: [
      { q: 'Does the meta description affect rankings?', a: 'Not directly — Google has confirmed it is not a ranking factor. It affects click-through rate, which brings more engaged visitors and can influence performance indirectly.' },
      { q: 'Why does Google show different text than my description?', a: 'Google selects snippet text per query and may use a passage from the page when it believes it matches the search better. You influence, but never control, the snippet.' },
      { q: 'Is 160 characters a hard limit?', a: 'No hard limit exists — Google truncates around 155–160 characters / ~920 pixels on desktop and slightly less on mobile. Longer text is not penalised, just cut.' },
      { q: 'Can I leave the description empty?', a: 'If omitted, Google auto-generates a snippet from page content — often worse than a hand-written one. Always write one for important pages.' },
    ],
    html: `
${f.textarea('md-text', 'Your meta description', 'Discover 50+ free browser-based marketing tools. Nothing uploaded, no signup, no limits — run them right in your browser.', 4)}
<div class="stat-line" id="md-stats"></div>
<p class="preview-label">Google snippet preview</p>
<div class="google-preview">
  <div class="gp-url">example.com</div>
  <div class="gp-title">Your page title appears here</div>
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
    card: 'See your page the way Googlebot and AI crawlers see it — then fix what\u2019s blocking it.',
    keywords: 'web crawler audit crawlability indexability googlebot robots noindex canonical check',
    h1: 'Free Web Crawler Audit — No Signup, No Limits',
    metaTitle: 'Free Web Crawler Audit — Check Crawlability & Indexing',
    metaDesc: 'Audit any page the way Googlebot and AI crawlers see it: HTTPS, noindex, canonical, title, sitemap and schema — with prioritized fixes. Free, no signup.',
    intro: 'Enter a URL and get a crawler\u2019s-eye view of the page: whether it can be reached and indexed, which on-page signals are present, and a prioritized list of what to fix first. No signup, nothing uploaded.',
    sections: [
      { h: 'What this crawler audit checks', p: ['A crawler has to successfully fetch a page, be allowed to index it, and understand it — in that order. This audit reports on all three: can Googlebot reach it (HTTPS, fetch status), will it index it (meta robots, canonical), and does it have the signals to rank it (title, description, H1, structured data, sitemap, Open Graph, image alt text).', 'Each check is scored by how much it typically moves the needle: a missing noindex fix or a broken canonical matters far more than a missing og:type. The verdict sorts issues by impact, so you fix what actually unlocks traffic first rather than chasing cosmetic tags.'] },
      { h: 'How to use it', p: ['Paste any public page URL and run the audit. Green PASS lines are healthy; amber WARN lines are minor; red ISSUE lines are what is genuinely holding the page back. Work down the prioritized fix list in order — each item tells you the exact tag or change needed.', 'If your page is behind a login, on a private network, or the browser blocks the fetch, use the “paste the HTML” option instead: open the page, View Source, copy, and paste. The same analysis runs entirely in your browser.'] },
      { h: 'When to run a crawler audit', p: ['Run it whenever a page’s indexing behaviour changes without you touching it: after a redesign or theme switch, after a plugin update that injects meta tags, after a platform migration, and before and after any launch that moves URLs. Template-level changes rewrite the head of every page at once, which is exactly when a stray noindex or a canonical pointing at the old domain appears.', 'It is also worth running on the pages that earn you money or attention — homepages, category pages, top posts — rather than everywhere. One healthy audit on your template pages tells you more than fifty audits on near-identical posts, because if the template is clean, every page built from it starts clean too.', 'A useful habit is to audit a known-good URL first whenever something looks wrong: if the healthy page suddenly fails too, the problem is site-wide rather than a one-page edit. That single comparison usually narrows a whole site problem down to a plugin, a header rule or a deploy in a couple of minutes.'] },
      { h: 'How to check your work', p: ['Fix the top issue on the list, then run the audit again on the same URL — the score should move and the red line should turn green. If it does not, the change did not reach the live page: a caching layer, an old template part, or a server-side header still sending the old instruction.', 'Then confirm what Google sees rather than only what the browser shows. Search Console’s URL inspection reports the robots meta it found, the canonical it selected and the last crawl date, and the elements panel in your browser will reveal a noindex injected after load. When the two views agree with the audit, your fix is genuinely in place.'] },
    ],
    faqs: [
      { q: 'What is a web crawler?', a: 'A crawler (or spider) is an automated bot — like Googlebot, Bingbot or an AI crawler such as GPTBot — that fetches your pages so they can be indexed or used to answer queries. If a crawler cannot reach or parse a page, it cannot rank in search.' },
      { q: 'Why is my page not being indexed?', a: 'The most common causes are a noindex meta tag or X-Robots-Tag header, a canonical pointing elsewhere, a robots.txt block, or the page simply being too thin or duplicated. This audit surfaces the first three directly on the URL you test.' },
      { q: 'Does this tool crawl my whole site?', a: 'No — it audits one page at a time, which keeps it instant and free. Run it on your key pages (home, category, top posts). For a whole-site crawl, combine it with your sitemap and test each URL.' },
      { q: 'Will this work for a page that is not public?', a: 'Yes, via the paste-HTML option. Fetching requires the page to be publicly reachable; if it is not, copy the page source and paste it — the analysis runs locally in your browser and nothing is uploaded.' },
    ],
    html: `
${f.url('ca-url', 'Page URL to audit', 'https://your-site.com/your-page')}
<button type="button" class="btn ca-run" id="ca-run">Run crawler audit</button>
<div class="stat-line" id="ca-status" aria-live="polite"></div>
<div class="score-wrap" id="ca-score" hidden>
  <div class="score-ring" id="ca-ring"><span id="ca-ring-num">0</span></div>
  <div class="score-meta">
    <p class="score-label">${'Crawl-health'}</p>
    <p class="score-grade" id="ca-grade"></p>
    <p class="score-note" id="ca-note"></p>
  </div>
</div>
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
    name: 'SEO Ranking Score',
    cat: 'seo',
    icon: '🏆',
    card: 'Score any page\u2019s on-page SEO 0\u2013100 with a letter grade and a fix list.',
    keywords: 'seo score checker rank page grade audit on-page optimization rating',
    h1: 'Free SEO Ranking Score \u2014 No Signup, No Limits',
    metaTitle: 'Free SEO Ranking Score \u2014 Rate Any Page 0\u2013100',
    metaDesc: 'Score any page\u2019s on-page SEO from 0 to 100 with a letter grade, weighted factors and a prioritized fix list. Free online SEO ranking checker, no signup.',
    intro: 'Enter a URL and get a single 0\u2013100 on-page SEO score with a letter grade \u2014 built from the weighted factors that actually move rankings, plus the specific fixes that would raise your score fastest.',
    sections: [
      { h: 'What the score measures', p: ['The score weights the on-page factors search engines reward: a keyword-led title (15), a well-sized meta description (12), a single clear H1 (12), real content depth (12), heading structure (8), internal links (10), image alt text (8), structured data (8), plus Open Graph, mobile viewport and HTTPS. Each factor is scored pass / partial / fail against Google\u2019s practical expectations.', 'This is an on-page score, not a Google rank position \u2014 nothing outside the page (backlinks, domain authority, competition) is included, and no tool can read Google\u2019s ranking systems. Think of it as a to-do meter: raise the score by fixing the listed factors and you have done everything on-page you can control.'] },
      { h: 'How to use it', p: ['Paste any public URL and run the check. Your score appears with a letter grade (A\u2026F) and every factor broken out as pass, partial or fail. The fix list is ordered by impact \u2014 highest-weight failures first \u2014 so you get the biggest score gain per change.', 'Re-run after each round of edits to watch the score climb. For pages that are private or blocked, switch to the paste-HTML option and analyze the source directly \u2014 it all runs in your browser.'] },
      { h: 'Fix it in the template, not the page', p: ['Most pages on a site share the same theme or plugin output, so the fastest way to lift a whole directory of scores is to fix the template once. A missing viewport tag, a heading structure that renders H2s instead of an H1, images generated without alt text — these are not page problems, they are theme problems, and correcting them once repairs every page built from that template.', 'Score a representative page from each template first — homepage, category, article, product — and only then work through individual URLs. Pages that still score low after their template is clean usually have genuinely page-level gaps: a title that never mentions the topic, an H1 missing entirely, three internal links where there should be twenty. Those you fix by hand, one page at a time.'] },
      { h: 'How this tool works', p: ['The page is fetched — or pasted — then parsed for each factor on the list: does the head contain a keyword-led title and a well-sized description, is there exactly one H1, how deep does the heading structure go, how many internal links and images with alt text are present, and are viewport, HTTPS and structured data in place. Each factor returns pass, partial or fail, and the weights turn those results into one number.', 'Everything runs locally in the browser, which is why private pages work through the paste option and why nothing is stored between runs. It also means the score is a snapshot: it reflects the HTML you handed it at that moment. Re-run after each round of edits rather than trusting an earlier result, since a plugin update or a cached page can change the output in between.'] },
    ],
    faqs: [
      { q: 'Is this SEO score the same as my Google ranking?', a: 'No. This is an on-page quality score based on factors within the page itself. Google\u2019s actual ranking also weighs backlinks, site authority, user signals and competition, which no free tool can measure for your specific query.' },
      { q: 'What is a good SEO score?', a: '90+ (grade A) means your on-page fundamentals are excellent. 75\u201389 (B) is solid with a few quick wins. Below 60 means several ranking signals are missing \u2014 work down the fix list and you will usually see the biggest jumps there.' },
      { q: 'How can I raise my score fastest?', a: 'Fix the highest-weight failures first: add a missing H1, write a proper title and description, expand thin content, and add internal links. These carry the most points and are the quickest wins.' },
      { q: 'Does this tool store my results?', a: 'No. Everything runs in your browser \u2014 the page is fetched (or pasted) and scored locally, and nothing is saved or uploaded anywhere.' },
    ],
    html: `
${f.url('sc2-url', 'Page URL to score', 'https://your-site.com/your-page')}
<button type="button" class="btn sc2-run" id="sc2-run">Score this page</button>
<div class="stat-line" id="sc2-status" aria-live="polite"></div>
<div class="score-wrap" id="sc2-score" hidden>
  <div class="score-ring sc2" id="sc2-ring"><span id="sc2-ring-num">0</span></div>
  <div class="score-meta">
    <p class="score-label">On-page SEO score</p>
    <p class="score-grade" id="sc2-grade"></p>
    <p class="score-note" id="sc2-note"></p>
  </div>
</div>
${outputArea('sc2-out', 'Factor breakdown')}
<p class="preview-label">Biggest improvements (highest impact first)</p>
${outputArea('sc2-fixes', 'Fix these first')}
<details class="inspect-paste">
  <summary>Fetch blocked, or the page is private? Paste the HTML instead.</summary>
  <textarea id="sc2-paste" class="inspect-ta" rows="4" placeholder="View Source → copy → paste the page HTML here." aria-label="Paste page HTML"></textarea>
  <button type="button" class="btn btn-ghost" id="sc2-paste-run">Score pasted HTML</button>
</details>`,
  },
];

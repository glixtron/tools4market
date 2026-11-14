// Tools4Market — Content & Social tool definitions (build-time data)
import { f, outputBlock, outputArea, note } from './helpers.js';

export const TOOLS_CONTENT = [
  // ---------------------------------------------------------- 1
  {
    slug: 'url-slug-generator',
    name: 'URL Slug Generator',
    cat: 'content',
    icon: '🧹',
    card: 'Turn any headline into a clean, SEO-friendly URL slug — in bulk too.',
    usedFor: 'for clean URLs in CMS migrations and drafts',
    keywords: 'url slug generator permalink seo friendly url',
    focus: 'url slug generator',
    h1: 'URL Slug Generator — readable slugs from any title',
    metaTitle: 'Free URL Slug Generator — SEO-Friendly Permalinks',
    metaDesc: 'Turn any title into a clean, lowercase URL slug in bulk — with stopword removal and a length limit. Try the free URL slug generator online.',
    intro: 'Paste one headline or a hundred — this URL slug generator returns clean, lowercase, hyphenated slugs with optional stopword removal and a length limit.',
    sections: [
      { h: 'What makes a good URL slug', p: ['A good slug is short, lowercase, hyphen-separated and descriptive: /compress-image-50kb beats /p=123?cat=8&ref=x on every axis — users read it in results, Google reads it for relevance, and it survives being copy-pasted into notes and tickets. Hyphens (not underscores) are the word separator Google understands. Write it as a few meaningful words rather than a sentence: the slug is a label for the page, and the shortest version that still says what the page is about reads best in results and in shared links.', 'Dropping filler words (a, the, of, and) shortens slugs without losing meaning: “the-complete-guide-to-seo” becomes “complete-guide-seo”. Keep the primary keyword at the front, and do not change a slug after it has earned rankings without a 301 redirect. Case matters less than consistency — most sites publish lowercase slugs — and parameters and dates only add noise. Once a URL is live, treat it as a commitment: it is the part of the link people remember and type.'] },
      { h: 'How to use the URL slug generator', p: ['Paste one title for a single slug, or one line per title for bulk conversion (ideal when migrating a content inventory). Choose the separator, whether to strip stopwords, and an optional character limit — the tool truncates at word boundaries so you never end with a half-word. Copy individual slugs or the whole list. The output follows every keystroke, so tweak the options until the list reads the way you want before copying. Bulk mode also shows instantly which titles produce bloated slugs.', 'Work from a list when you are planning a site: paste every draft title at once, skim the slugs, and rename the weak ones at the outline stage rather than after publication. Changing a slug later means a redirect, updated internal links and a fresh round of indexing, all of which are cheaper to avoid than to repair.'] },
      { h: 'How this tool works', p: ['Everything runs in your browser on the text you paste. The tool lowercases each line, strips apostrophes and punctuation, collapses what remains into words, then joins them with your chosen separator. With stopword removal switched on, common function words are dropped before that join, which is how a headline like “The Complete Guide to Technical SEO” comes out as complete-guide-technical-seo in one step.', 'If you set a maximum length, the tool trims the slug back to the last separator before the limit, which is what keeps results off a half-word ending. Underscores are available for systems that expect them, but hyphens remain the safe default for the open web. Nothing is uploaded — the conversion happens in your browser, so you can paste an entire content inventory with confidence.'] },
    ],
    faqs: [
      { q: 'Hyphens or underscores in URLs?', a: 'Hyphens. Google treats a hyphen as a word separator; an underscore glues words together, so complete_guide reads like “completeguide”. The URL slug generator defaults to hyphens and switches when a system expects underscores.' },
      { q: 'How long should a URL slug be?', a: 'There is no ranking penalty for length, but shorter is better for sharing and click-through: roughly 3–5 meaningful words reads best. The URL slug generator trims at word boundaries, so a slug never ends mid-word.' },
      { q: 'Should slugs include dates or categories?', a: 'Avoid dates — they make evergreen content look stale and break when you republish. Flat, keyword-only slugs are the most flexible long-term.' },
      { q: 'I changed a slug — how do I keep rankings?', a: 'Set up a 301 redirect from the old URL to the new one and update internal links. Our .htaccess Redirect Generator produces the exact rules.' },
    ],
    html: `
${f.textarea('sl-text', 'Title(s) — one per line for bulk mode', 'Technical SEO for a site migration', 6)}
<div class="field-row">
${f.select('sl-sep', 'Separator', [{ v: '-', l: 'Hyphen - (recommended)' }, { v: '_', l: 'Underscore _' }])}
${f.number('sl-max', 'Max length (characters, optional)', '60', '10', '120')}
</div>
${f.check('sl-stop', 'Remove common stop words (a, the, of, and…)', true)}
${outputBlock('sl-out', 'Slugs')}`,
  },

  // ---------------------------------------------------------- 2
  {
    slug: 'utm-link-builder',
    name: 'UTM Link Builder',
    cat: 'content',
    icon: '📊',
    card: 'Tag campaign links for clean attribution in GA4 — with presets.',
    usedFor: 'for campaign tagging you can trust in GA4',
    updated: '2026-10-22',
    pickWhy: 'Build campaign links with consistent naming and live presets, so campaign traffic groups cleanly in GA4 instead of scattering across a dozen spellings.',
    pickSample: `https://example.com/pricing/?utm_source=linkedin&utm_medium=social&utm_campaign=launch-oct`,
    keywords: 'utm builder campaign url builder ga4 tracking links',
    focus: 'utm builder',
    h1: 'UTM Link Builder — campaign URLs you can copy',
    metaTitle: 'Free UTM Builder — Tagged Campaign URLs for GA4',
    metaDesc: 'Build clean UTM-tagged links for GA4 with source and medium presets. This free UTM builder keeps campaign naming consistent — no signup.',
    intro: 'This UTM builder appends source, medium and campaign parameters to any URL, with preset mediums that keep your team’s naming consistent in GA4.',
    sections: [
      { h: 'Why UTM discipline matters', p: ['Every link you share without UTM parameters blends into “direct” traffic. Every inconsistently tagged link fragments your reports: “newsletter”, “Newsletter” and “news_letter” appear as three sources. GA4 is case-sensitive — one typo permanently splits your data. Once that happens you cannot merge the rows after the fact, so the clean fix is to pick a naming scheme and hold to it across every channel, every colleague and every future campaign, however small it looks.', 'The reliable convention: lowercase everything, use source for the platform (newsletter, linkedin, youtube), medium for the channel type (email, social, cpc, video), and campaign for the initiative (spring-sale-2026). This tool enforces lowercase and provides the standard mediums as suggestions. Keep values readable and free of spaces, use hyphens inside campaign names, and record the exact strings somewhere the whole team can copy them — a shared document beats anyone’s memory.'] },
      { h: 'How to use the UTM builder', p: ['Paste your destination URL, fill in source (required), medium (required) and campaign (recommended). Term and content are optional — content is useful for A/B tests (e.g. “cta-blue” vs “cta-red”). Copy the final URL and use it exactly as generated; parameters are appended in a fixed order so identical inputs always produce identical links. If either required field is empty the tool says so and still shows what it has built, so you can see exactly what is missing before you share anything.', 'Tag links inside your own emails and in-app messages too — without parameters, GA4 cannot tell an email click from a bookmark or a typed URL. The same applies to links in social bios, PDFs, QR codes and partner newsletters: if a human reaches your page by clicking something you control, that link is your only chance to label the visit at the source.'] },
      { h: 'How to check your work', p: ['Build the link, then open it in a fresh browser session with GA4’s DebugView or the real-time report open. You should see the campaign appear with the source and medium exactly as you typed them — lowercase, spelled the way you intended. If it lands as (direct) / (none) instead, the parameters were stripped somewhere along the way, most often by a redirect or by a link shortener that discards the query string.', 'During a campaign, check the Campaigns report in GA4 a day after launch: every tagged source and medium you used should have its own row, with no stray variants. When you spot “Newsletter” next to “newsletter”, write the canonical value in your tracking sheet and use it from then on — old rows cannot be renamed, but new links can stop adding to the mess. Consistency is the whole game: the report is only as clean as the labels you feed it.'] },
    ],
    faqs: [
      { q: 'What is the difference between utm_source and utm_medium?', a: 'Source is where the click came from (google, newsletter, instagram). Medium is the channel type (cpc, email, social, video). The UTM builder labels both so the pair stays consistent.' },
      { q: 'Do UTM parameters hurt SEO?', a: 'Tagged URLs can be treated as duplicate URLs of the canonical page. Ensure your pages have a self-referencing canonical tag so tagged variants consolidate — never put UTM links in your sitemap.' },
      { q: 'Are UTM parameters visible to users?', a: 'Yes — everything after the ? is visible in the address bar and to the destination site. Keep values generic: the UTM builder never needs personal data in a UTM parameter.' },
      { q: 'Does GA4 need UTMs, or is it automatic?', a: 'GA4 auto-detects some traffic (paid Google ads with auto-tagging, organic search). Everything else — email, social posts, affiliate links — needs explicit tagging, which is what the UTM builder adds.' },
      { q: 'Should UTM parameters be lowercase?', a: 'Yes — GA4 is case-sensitive, so utm_source=LinkedIn and utm_source=linkedin count as two different sources. Standardize on lowercase and use hyphens for multi-word values.' },
    ],
    html: `
${f.url('ut-url', 'Destination URL', 'https://example.com/spring-sale')}
<div class="field-row">
${f.text('ut-source', 'Source * (where the click comes from)', 'newsletter')}
${f.text('ut-medium', 'Medium * (channel type)', 'email')}
</div>
<div class="field"><label for="ut-medium-list">Common mediums (click to use)</label>
<datalist id="ut-medium-list"><option value="email"></option><option value="social"></option><option value="cpc"></option><option value="video"></option><option value="affiliate"></option><option value="referral"></option><option value="podcast"></option></datalist>
<input id="ut-medium-hint" list="ut-medium-list" placeholder="email / social / cpc / video / affiliate / referral / podcast" aria-label="Medium suggestions">
</div>
${f.text('ut-campaign', 'Campaign (initiative name)', 'spring-sale-2026')}
<div class="field-row">
${f.text('ut-term', 'Term (optional — paid keywords)', '')}
${f.text('ut-content', 'Content (optional — A/B variant)', 'cta-blue')}
</div>
${outputBlock('ut-out', 'Tagged URL')}`,
  },

  // ---------------------------------------------------------- 3
  {
    slug: 'keyword-density-checker',
    name: 'Keyword Density Checker',
    cat: 'content',
    icon: '🔍',
    card: 'Fetch a page or paste text, then compare a target phrase with its title, H1, description and main copy.',
    usedFor: 'for checking what a draft is really about',
    updated: '2026-10-22',
    keywords: 'keyword density checker word density counter word frequency ngram kw',
    focus: 'keyword density checker',
    h1: 'Keyword Density Checker — word and phrase density, no guesswork',
    metaTitle: 'Keyword Density Checker — Word Density in One Pass',
    metaDesc: 'Free keyword density checker: paste a draft or fetch a page, then check word density and the most common 1, 2 and 3-word phrases. Try it online.',
    intro: 'This keyword density checker reads pasted text or a fetched page, counts exact phrase occurrences and lists common terms — a frequency signal, not a ranking formula.',
    sections: [
      { h: 'What a keyword density checker actually measures', p: ['Frequency analysis shows which words and phrases occur in the text you supplied — some tools call the same numbers a word density checker; here you get both views from one pass. It can catch a missing product name, an accidental repeated phrase or a draft whose headings and body discuss different topics. When you fetch a page, the tool compares your optional target phrase with the fetched title, H1, description and extracted main text.', 'There is no ideal keyword density percentage. Search systems interpret language in context, and repeating a phrase to reach a numeric threshold can make copy less useful. Treat low or high frequency as a prompt to review the page, then make edits only when they improve clarity and accurately describe the subject.', 'Read the tables as a map of the page rather than a score. The top-term list shows which words carry the draft; the phrase list shows how often two and three-word combinations recur. A term that appears in the title and the opening paragraph but nowhere in the body usually means the page promises one thing and delivers another — an editing problem, not a keyword problem.'] },
      { h: 'How to use it', p: ['Paste text to analyze it locally, or fetch a public page with Analyze my page. Enter the exact phrase you want to check. The checker reports occurrences in the supplied main copy, and, for a fetched page, whether that phrase also appears in the source title, H1 and description. Use the word and phrase tables to find repetition or mismatched copy, not to hit a percentage.', 'Stop-word filtering hides phrase rows that contain common words; it preserves word order and does not join across removed words, so a hidden phrase is never silently rewritten. Switch the filter off to inspect those rows, and treat the word count and reading time as editorial context rather than search signals.', 'Two habits make the output more useful. Run the check before and after editing: a quick comparison shows whether a phrase you added actually landed in the body or stayed in the title. And work from one page at a time, because a site-wide view hides the details that matter — the heading that drifted away from the topic, the paragraph that repeats itself, the product name spelled two different ways.'] },
      { h: 'How this tool works', p: ['Text pasted into the checker is analyzed locally in your browser. A public URL is fetched so the tool can prefill the extracted main text; that fetch sends the URL to the site’s first-party proxy, and the fetched page itself is not saved. The phrase check counts contiguous word sequences in the source text, while the top-term tables summarize the frequencies after the optional stop-word filter.', 'Word count, unique words and estimated reading time describe the submitted text only. Percentages describe frequency within that text; they are not a measure of ranking potential. Fetching reads the server-returned HTML, so it may miss text that appears only after JavaScript has rendered the page.', 'When you fetch a page, remember what you are looking at: the server-returned HTML, not the rendered DOM. Content injected by JavaScript — pricing tables, review widgets, lazy-loaded sections — will not appear in the extracted text, so a phrase that exists on screen can read as missing here. If a number looks wrong, paste the visible text instead and run the check again.'] },
    ],
    faqs: [
      { q: 'What is the ideal keyword density for SEO?', a: 'There is no official or recommended percentage target. This keyword density checker reports counts, not a score — use them to notice repetition, then edit for clear, accurate content.' },
      { q: 'Is my text uploaded to a server?', a: 'Text pasted into the checker stays in the browser. If you use Analyze my page, the page URL is sent to our first-party fetch proxy to retrieve the public page; no analysis report is saved by the app.' },
      { q: 'Why filter stop words?', a: 'Stop words (the, a, and, of…) dominate raw frequency but carry no topical meaning. Filtering them shows the words that actually define your content.' },
      { q: 'Does keyword density affect Google rankings directly?', a: 'No — search systems use many signals far more sophisticated than term frequency. The keyword density checker is an editorial audit tool, not a formula.' },
      { q: 'Is a word density checker the same tool?', a: 'Effectively yes. Word density counts single words; keyword density counts the phrases you choose. This checker reports both from the same text, so the word and phrase views never disagree.' },
    ],
    html: `
${f.text('kd-query', 'Optional target phrase to check', '', 'Example: technical SEO audit')}
${f.textarea('kd-text', 'Paste text (analyzed locally)', 'Paste your article or draft here, or use Analyze my page above to fetch its main text…', 9)}
${f.check('kd-stop', 'Hide phrases that contain common stop words (phrase order is preserved)', true)}
<div class="kpi-strip" id="kd-stats-tiles"></div>
<div class="stat-line" id="kd-target-report"></div>
${outputArea('kd-out', 'Frequency analysis')}
<div id="kd-vis" class="kpi-strip"></div>`,
  },

  // ---------------------------------------------------------- 4
  {
    slug: 'hashtag-generator',
    name: 'Hashtag Generator',
    cat: 'content',
    icon: '#️⃣',
    card: 'Turn keywords into ready-to-paste hashtag sets per platform.',
    usedFor: 'for platform-tuned hashtag sets',
    keywords: 'hashtag generator instagram linkedin x twitter tiktok',
    focus: 'hashtag generator',
    h1: 'Hashtag Generator — from a topic to a usable set',
    metaTitle: 'Free Hashtag Generator — Instagram, X, LinkedIn, TikTok',
    metaDesc: 'Free hashtag generator: build ready-to-paste tag sets from your keywords, tuned for Instagram, X, LinkedIn, YouTube and TikTok. No signup needed.',
    intro: 'Type a topic, pick the platform, and this hashtag generator returns a paste-ready set that mixes your keyword variants with the platform’s standard reach tags.',
    sections: [
      { h: 'Platform norms in 2026', p: ['Hashtag culture has split by platform. Instagram tolerates (and still surfaces) larger sets — 5 to 15 relevant tags. X rewards one or two highly specific tags and treats tag-stuffing as spam. LinkedIn’s algorithm reads 3–5 tags at most; more looks automated. TikTok and YouTube lean on few, broad tags plus keyword-rich captions. Counts are not a strategy, though: the goal is to be classified correctly, then found by the small audience that actually follows the tag.', 'The set this tool generates has two layers: your keyword variants (exact, joined, plural) for relevance, and platform-standard tags for reach. Relevance still wins — a small account posting #marketing competes with millions; posting your niche term competes with hundreds. That is why the generated set stays deliberately short: a handful of honest, specific tags outperform a wall of broad ones, and a compact set is far easier for the platform to read.'] },
      { h: 'How to use the hashtag generator', p: ['Enter your main topic (e.g. “email marketing”), choose the platform, and copy the generated set. Delete any tag that does not honestly describe your post — irrelevant tags suppress reach on Instagram and TikTok. Regenerate as often as you like: the output updates live, so try two or three phrasings of the topic and keep the version that describes the post most precisely rather than the one with the biggest numbers.', 'The platform field matters more than it looks: it decides how many tags the set carries and which reach tags are mixed in, so an Instagram set and an X set for the same topic are never interchangeable. Generate separately for each network, paste the result where that network expects to find it, and note the count printed at the end of the output before you move to the composer.'] },
      { h: 'Common mistakes', p: ['The usual mistake is a tag that sits outside the post’s language or subject — reach tags are not decoration, and a mismatched tag tells the classifier the wrong thing about you. Chasing volume comes second: five tags from your niche consistently beat fifteen borrowed from a trending list, because trend tags are crowded with unrelated accounts. And one set copied across every platform ignores how differently each feed treats them.', 'Avoid banned or quarantined tags as well: a tag flagged for spam can suppress a post no matter how relevant the rest of your set is, and there is no notification to warn you. Skip tags you cannot justify, keep the count inside the platform’s comfort zone, and refresh your sets occasionally — the tags that worked last year are not automatically the ones working now. A short saved list per platform also helps: a new post then starts from tags that already performed rather than from a blank field.'] },
    ],
    faqs: [
      { q: 'How many hashtags should I use?', a: 'Instagram: 5–15 relevant ones. X: 1–2. LinkedIn: 3–5. TikTok: 3–5. YouTube: 2–3 in the description. The hashtag generator applies these counts so each set stays inside its platform range.' },
      { q: 'Do hashtags still help reach?', a: 'Yes, but they work as classification, not magic: they tell the platform what your post is about so it can find the right audience. The hashtag generator leads with your specific terms rather than borrowed broad tags.' },
      { q: 'CamelCase or all lowercase hashtags?', a: 'Neither affects reach, but CamelCase (#EmailMarketing) is far more readable — especially for screen readers, which announce each joined word.' },
      { q: 'Should I put hashtags in the caption or first comment?', a: 'On Instagram both are indexed identically; first-comment keeps captions clean. On X, LinkedIn and TikTok they belong in the post itself.' },
      { q: 'Should I use the same hashtags on every post?', a: 'No. An identical tag set on every post reads as automation to Instagram and TikTok and can cap reach. Keep 5–10 branded tags steady, then swap the rest to match what that post is actually about.' },
      { q: 'Can a hashtag be banned or restricted?', a: 'Yes. Some tags are quarantined for spam, and a post using one can drop out of tag and Explore results with no warning. Search the tag first — a thin or empty tag page is the signal to leave it out of your set.' },
    ],
    html: `
${f.text('hg-keyword', 'Your topic or keyword', 'email marketing')}
${f.select('hg-platform', 'Platform', [
      { v: 'instagram', l: 'Instagram' },
      { v: 'x', l: 'X (Twitter)' },
      { v: 'linkedin', l: 'LinkedIn' },
      { v: 'youtube', l: 'YouTube' },
      { v: 'tiktok', l: 'TikTok' },
    ])}
${outputBlock('hg-out', 'Hashtag set')}
${note('Delete any tag that does not honestly match your post — irrelevant tags suppress reach.')}`,
  },

  // ---------------------------------------------------------- 5
  {
    slug: 'case-converter',
    name: 'Case Converter',
    cat: 'content',
    icon: '🔤',
    card: 'Switch text between upper, lower, title, sentence and code-case styles.',
    usedFor: 'for headlines, filenames and code identifiers',
    keywords: 'case converter text case upper lower title case camelcase snake kebab',
    focus: 'case converter',
    h1: 'Case Converter — sentence, title, upper and snake case',
    metaTitle: 'Free Case Converter — Upper, Lower, Title, Camel & More',
    metaDesc: 'Free case converter for upper, lower, title, sentence, camelCase, PascalCase, CONSTANT_CASE, kebab and snake case. Paste text and convert it online.',
    intro: 'This case converter switches between nine capitalisation styles — from title-case headlines to camelCase identifiers — with optional whitespace cleanup as you type.',
    sections: [
      { h: 'Which mode for which job', p: ['Nine modes cover the naming conventions you actually meet. Upper case suits codes and acronyms; lower case is the tidy default for tags and file names. Title case puts capitals on the words that carry weight in a headline, while sentence case keeps only the first word capitalised, as body copy does in most house styles. The five identifier modes are for development work: camelCase for JavaScript variables, PascalCase for class and component names, CONSTANT_CASE for environment keys, kebab-case for URLs and CSS classes, snake_case for Python and YAML keys.', 'Every mode shares one engine: the text is split into words, the original separators are thrown away, and the case rule decides how the words are joined back together. That is why kebab-case and snake_case differ by a single character — the separator — and why punctuation disappears in identifier modes but survives in upper, lower, title and sentence case, which work on the text exactly as written.'] },
      { h: 'How to use the case converter', p: ['Paste your text, choose the target style from the Convert to list, and read the result — output follows the input live, so you can flip between modes until one reads right. Leave Trim and collapse all whitespace off to preserve line breaks and indentation; switch it on when you are pasting from a document where tabs, double spaces and stray blank lines would otherwise survive the conversion. The Copy button above the result takes exactly what is on screen.', 'For headline work, start in title case and read it back: it capitalises every word except short connectors, and the first and last word are always capitalised, so a result such as “The Complete Guide to SEO” needs no touch-up. For code, decide the separator first — none for camel and Pascal, hyphen for kebab, underscore for snake — then pick the matching mode. When the destination is strict, convert one snippet at a time: a JavaScript variable and a CSS class look alike but expect different separators.'] },
      { h: 'Common mistakes', p: ['The classic error is converting a finished title in place and losing the original. Keep the source text somewhere — a second tab, your CMS revision history — because the conversion is one-way, and punctuation inside identifiers is dropped deliberately: my-event becomes myevent in camelCase rather than anything in between.', 'The second mistake is mixing cases within one page. Google rewrites titles and descriptions freely, but your on-page copy should still follow a single convention; cases that change halfway down a paragraph read as sloppy rather than confident. The third is trusting case changes to fix meaning — they never fix a typo, and all-caps paragraphs lose the shape that helps readers scan.', 'Whitespace deserves respect too. Collapsing joins every line into one string, which is right for a meta tag and wrong for a snippet that relies on indentation. And remember that some systems are case-sensitive while others are not: file names on Linux distinguish Report.txt from report.txt, Windows does not, and a mismatched case inside a link is a classic cause of broken images after a migration.'] },
    ],
    faqs: [
      { q: 'Which case style should I use for URL slugs?', a: 'Lower case with hyphen separators: complete-guide-seo. This case converter produces it in one click, and our URL Slug Generator applies it in bulk.' },
      { q: 'Does title case capitalise every word?', a: 'Not here. Short connectors (a, an, the, and, in, of…) stay lowercase unless they open or close the title — the first and last word is always capitalised.' },
      { q: 'What is the difference between camelCase and PascalCase?', a: 'camelCase starts lowercase and capitalises each following word; PascalCase capitalises every word including the first. Pick the matching mode in the case converter — the convention is what a language expects.' },
      { q: 'Does converting case change my text?', a: 'Upper, lower, title and sentence case keep your punctuation and spacing intact. Identifier modes intentionally drop punctuation and separators so the result is a valid identifier.' },
    ],
    html: `
${f.textarea('cc-text', 'Text to convert', 'Hello World from Tools4Market', 6)}
${f.select('cc-mode', 'Convert to', [
      { v: 'upper', l: 'UPPER CASE' },
      { v: 'lower', l: 'lower case' },
      { v: 'title', l: 'Title Case' },
      { v: 'sentence', l: 'sentence case' },
      { v: 'camel', l: 'camelCase' },
      { v: 'pascal', l: 'PascalCase' },
      { v: 'constant', l: 'CONSTANT_CASE' },
      { v: 'kebab', l: 'kebab-case' },
      { v: 'snake', l: 'snake_case' },
    ])}
${f.check('cc-ws', 'Trim and collapse all whitespace (joins lines into one space)')}
${outputBlock('cc-out', 'Converted text')}`,
  },

  // ---------------------------------------------------------- 6
  {
    slug: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    cat: 'content',
    icon: '🧮',
    card: 'Strip duplicate lines from any list — with case and whitespace controls.',
    usedFor: 'for cleaning long keyword and URL lists',
    keywords: 'duplicate line remover remove duplicates dedupe list unique lines',
    focus: 'duplicate line remover',
    h1: 'Duplicate Line Remover — dedupe a list, keep the order',
    metaTitle: 'Free Duplicate Line Remover — Dedupe Any List Instantly',
    metaDesc: 'Paste a list and this duplicate line remover strips repeats instantly — ignore case, trim whitespace, drop blank lines, sort A→Z. Free, no signup.',
    intro: 'Paste a list — one item per line — and this duplicate line remover keeps the first occurrence of each entry, with switches for case, whitespace, blanks and sorting.',
    sections: [
      { h: 'Why duplicates creep in', p: ['Duplicate lines arrive from everywhere: two exports stitched together, a list typed twice during a late edit, keyword sets with SEO and seo collected from different sources, URLs with and without trailing spaces. Left alone they skew counts and waste effort — a keyword list with repeated terms looks more concentrated than it is, and a URL list with duplicates can fail a crawler upload outright. Deduplicating before you analyse is a five-second habit that removes an entire class of bad conclusions.', 'The subtlety is that two lines are only duplicates if you decide they are. “SEO” and “seo” are different strings but arguably the same keyword; “Alpha” and “Alpha ” with a trailing space are different strings until something trims them. Sets of codes, IDs and URLs are usually case-sensitive, so duplicates there must match exactly; lists typed by people are usually case-insensitive, so the filter should be too. The tool makes that decision explicit with two switches rather than guessing, because guessing wrong silently deletes rows you needed.'] },
      { h: 'How to use the duplicate line remover', p: ['Paste one item per line. Trim whitespace is on by default, which removes the invisible trailing spaces that make identical-looking rows unique. Turn on Ignore case when the list came from people rather than from a system, and leave Drop empty lines switched on to purge the blanks that copy-paste tends to leave behind. Sort output A→Z when order carries no meaning — a sorted list makes any surviving repeats obvious to the eye and far easier to scan for gaps.', 'The stats line reports the arithmetic: lines in, unique out, duplicates removed. If those numbers surprise you, adjust one option at a time — the gap between the case-sensitive and case-insensitive counts tells you how much of your duplication is genuinely the same text and how much is only capitalisation. Copy the result when the count reads right. Everything recalculates on each edit, so there is nothing to submit and no list ever leaves your browser.'] },
      { h: 'When dedupe goes wrong', p: ['Deduplicating a list where repetition carries meaning is the trap. Frequency lists, occurrence counts and raw server logs use duplicates as data — removing them destroys the signal. Deduplicate the input to a tool, not the output of one, and keep the original file: this is a transformation you will want to undo the moment someone asks how many times a term actually appeared.', 'Order matters too, so order-independent dedupe on ordered data is the next mistake. The tool keeps the first occurrence and drops later ones, which is right for a keyword list but wrong for a log where the second occurrence is the line carrying the context you care about. Sort only when sequence is irrelevant — sorting a ranked list rewrites its meaning.', 'And one pass rarely fixes the source. Duplicates usually mean two systems disagree; if the same rows turn up in every export, fix the export instead of cleaning it each time. And remember that trimming changes identity too: systems comparing strings exactly will still treat Alpha and Alpha-plus-a-space as different downstream, even though this list no longer does.'] },
    ],
    faqs: [
      { q: 'Does it remove exact duplicates only?', a: 'After trimming (on by default), yes — with Ignore case off, Alpha and alpha stay as two lines. The duplicate line remover can treat capitalisation variants as one entry instead.' },
      { q: 'Which line is kept, the first or the last?', a: 'The first occurrence, in original order. Later repeats are dropped, so position-sensitive lists remain stable from run to run.' },
      { q: 'Is my list uploaded anywhere?', a: 'No. The duplicate line remover runs entirely in your browser with JavaScript — the list never leaves your device.' },
      { q: 'Why does the count change when I toggle options?', a: 'Case and whitespace decide what counts as the same line, so the unique count moves with the setting. The stats line always reflects the current options.' },
    ],
    html: `
${f.textarea('dl-lines', 'Lines — one item per line', 'Alpha\nalpha\nBeta\nBeta\nGamma', 8)}
<div class="field-row">
${f.check('dl-case', 'Ignore case (Alpha = alpha)')}
${f.check('dl-trim', 'Trim whitespace from each line', true)}
</div>
<div class="field-row">
${f.check('dl-empty', 'Drop empty lines', true)}
${f.check('dl-sort', 'Sort output A→Z')}
</div>
<div class="stat-line" id="dl-stats"></div>
${outputBlock('dl-out', 'Unique lines')}`,
  },

  // ---------------------------------------------------------- 7
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    cat: 'content',
    icon: '📜',
    card: 'Placeholder paragraphs, sentences or words for mockups and drafts.',
    usedFor: 'for mockups and layout drafts',
    keywords: 'lorem ipsum generator placeholder text dummy text paragraphs sentences',
    focus: 'lorem ipsum generator',
    h1: 'Lorem Ipsum Generator — paragraphs, sentences or words',
    metaTitle: 'Free Lorem Ipsum Generator — Paragraphs, Sentences, Words',
    metaDesc: 'Free lorem ipsum generator: placeholder text by paragraphs, sentences or words (1–50 units), with the optional classic opener for mockups and drafts.',
    intro: 'Choose how many paragraphs, sentences or words you need — this lorem ipsum generator returns classic placeholder text ready to paste into a mockup or draft.',
    sections: [
      { h: 'What Lorem Ipsum is for', p: ['Lorem Ipsum is filler text in the tradition of a Latin treatise by Cicero, scrambled just enough that reviewers cannot read meaning into it. Its job is to hold the layout: line lengths, paragraph rhythm and typographic weight stay honest while the design is still moving, so nobody approves a page because the placeholder happened to be a perfect headline. Because the word distribution is uneven — short and long words mixed together — it approximates real prose far better than repeating a phrase like your text here does.', 'Use it at the layout stage: wireframes, theme previews, email templates, pitch decks, app empty states. Stop using it once the structure is agreed, because when real sentences arrive, spacing assumptions break — long words overflow buttons, translations grow and headings wrap to a second line nobody budgeted for. This lorem ipsum generator produces three units — paragraphs, sentences or words — so you can stress a single button with a handful of words or fill a whole page.'] },
      { h: 'How to use the lorem ipsum generator', p: ['Pick a count between 1 and 50, choose the unit, and read the output: paragraphs arrive separated by blank lines, sentences run together in one block, and words come back as a single run. Leave the opener box ticked for the classic Lorem ipsum dolor sit amet opening — the form reviewers expect to see — and untick it when you want text that does not begin with the same five words every time. Output updates as you change the controls, and the Copy button takes what is on screen.', 'Match the unit to the question you are asking. Sentences are right for testing a single field, a card or a button; paragraphs test a content column, an article template or an email body; words are for tight spaces where what matters is whether twenty characters fit. Generating fifty paragraphs on a phone is pointless when the section holds two — count the slots in your layout first, then generate to fit them.'] },
      { h: 'Common mistakes', p: ['Treating placeholder text as a content plan is the expensive mistake. Latin hides the hardest problems: real questions run long, real features need names that are not Product One, and real audiences skim differently than they skim Latin. Swap in real copy early — at the first clickable prototype — so wording constraints shape the design instead of arriving after it.', 'Shipping it is the bigger problem. Lorem Ipsum pages do go live, usually from a staging copy-paste, and they read as unfinished or worse, as an abandoned site. Search engines index whatever text ships, so a page of it starts ranking for Latin fragments instead of the query you intended. Search your domain for “Lorem ipsum” after every launch; it takes a second and catches the embarrassing case.', 'Regenerating instead of reusing is how pasted copies drift apart, so keep one canonical block per template and update it deliberately. And if the page will publish in another language, placeholder in that language — mixed Latin and English conceals line-break problems that a real translated string would expose on the first render.'] },
    ],
    faqs: [
      { q: 'Is Lorem Ipsum free to use?', a: 'Yes. It has been public-domain filler for centuries and carries no copyright, licence or attribution requirement, so anything this lorem ipsum generator produces is safe to paste.' },
      { q: 'Why is placeholder text in Latin?', a: 'It descends from Cicero’s writing from 45 BC, altered enough to be unreadable, so reviewers judge the layout instead of the words.' },
      { q: 'Should I use Lorem Ipsum on pages that will rank?', a: 'No. Search engines index whatever ships, and placeholder text can rank for the wrong terms. Replace the output of this lorem ipsum generator with real copy before launch.' },
      { q: 'How much placeholder text should I generate?', a: 'Match the layout: one sentence per field, a few per card, paragraphs for article or page bodies. Generate to the number of slots you actually have.' },
    ],
    html: `
<div class="field-row">
${f.number('lo-count', 'How many (1–50)', '3', '1', '50')}
${f.select('lo-unit', 'Unit', [
      { v: 'paragraphs', l: 'paragraphs' },
      { v: 'sentences', l: 'sentences' },
      { v: 'words', l: 'words' },
    ])}
</div>
${f.check('lo-start', 'Start with “Lorem ipsum dolor sit amet”', true)}
${outputBlock('lo-out', 'Lorem Ipsum text')}`,
  },

  // ---------------------------------------------------------- 8
  {
    slug: 'reading-time-calculator',
    name: 'Reading Time Calculator',
    cat: 'content',
    icon: '⏱️',
    card: 'Word, character and sentence counts plus reading and speaking time.',
    usedFor: 'for editor bylines and content briefs',
    keywords: 'reading time calculator word count speaking time wpm text statistics',
    focus: 'reading time calculator',
    h1: 'Reading Time Calculator — minutes from a word count',
    metaTitle: 'Free Reading Time Calculator — Words & Speaking Time',
    metaDesc: 'Free reading time calculator: paste text for word count, characters, sentences and paragraphs, plus reading time at 200 wpm and speaking time at 130 wpm.',
    intro: 'Paste any text and this reading time calculator returns word, character, sentence and paragraph counts, plus reading time at 200 wpm and speaking time at 130 wpm.',
    sections: [
      { h: 'Why length is an editorial signal', p: ['Reading time is the quickest reality check on a draft. At an assumed two hundred words per minute, a piece that measures eleven minutes is a commitment rather than a skim — worth knowing before you publish under the promise of “a three-minute read”, and worth knowing when a landing page has quietly grown past the point where anyone finishes it. Editors use the figure to keep intros tight, newsletter writers to keep sends honest, and content teams to compare drafts without reading each one twice.', 'Speaking time answers a different question. At a hundred and thirty words per minute — the pace of a natural presentation — the same text becomes a run time: the number you need for a keynote slot, a podcast segment, a webinar section or an ad read. A script that reads in three minutes will eat five on stage, so timing rehearsals against the reading figure guarantees you run over, while timing against the speaking figure keeps you inside the slot you were given.'] },
      { h: 'How to use the reading time calculator', p: ['Paste the text — article, script, product page, newsletter — and the output reports words, characters with and without spaces, sentences and paragraphs, then reading time at two hundred words per minute and speaking time at a hundred and thirty. Nothing is uploaded, so draft copy and client material are safe to check. The result recalculates with each edit, which makes the tool usable as a live budget: watch the minutes climb while you draft and trim when the number passes your target.', 'Use the smaller counts for more than reassurance. Characters without spaces is the figure that matters for meta descriptions, ad copy and SMS fields with hard limits, and it is the honest test of whether a headline still fits its slot. Sentence and paragraph counts reveal shape: thirty-word sentences and one-line paragraphs are two different failures, and a page with everything inside a single block is harder to scan than the word count alone suggests.'] },
      { h: 'How the estimates work', p: ['The numbers are arithmetic, not measurement: words divided by two hundred and rounded to the nearest minute, with a floor of one minute so short text never reports zero, and words divided by a hundred and thirty for speech. Sentences are counted at end punctuation, paragraphs at blank lines. Neither estimate knows your audience — technical writing is read more slowly, skimmable list posts faster — so treat them as a shared baseline for comparison rather than a promise to the reader.', 'The mistakes are predictable. Counting an outline as a draft because the words are already on the page; pasting navigation, footer and sidebar junk along with the article, which inflates every figure; and relying on reading time for languages or dense material where the assumed pace is simply wrong. A piece written entirely in fragments will read low on sentences for the same reason. Take these as one signal among several — the truest test of length is still whether the piece earns every paragraph.'] },
    ],
    faqs: [
      { q: 'What reading speed does the tool assume?', a: 'The reading time calculator assumes 200 words per minute for silent reading and 130 for speaking — common working baselines. Adjust mentally if your audience reads faster or slower.' },
      { q: 'Why is my word count different from another tool?', a: 'Tools count differently: some include headings, links and markup, some split on different whitespace. Paste only finished prose for the most comparable number.' },
      { q: 'Does reading time help with SEO?', a: 'Not as a number in itself, but honest length shapes behaviour — readers who finish and share a page send stronger signals than readers who bounce from a promise the piece cannot keep.' },
      { q: 'What is the difference between reading and speaking time?', a: 'Reading assumes a silent pace; speaking adds natural pauses and articulation, so it runs slower. This reading time calculator reports both so you can plan scripts, talks and ad reads.' },
    ],
    html: `
${f.textarea('rt-text', 'Paste your text (nothing is uploaded)', 'Paste an article, script or draft here to measure its length and timing…', 9)}
${outputBlock('rt-out', 'Text statistics')}`,
  },

  // ---------------------------------------------------------- word counter
  {
    slug: 'word-counter',
    name: 'Word Counter',
    cat: 'content',
    icon: '🔢',
    card: 'Count words, unique words, characters, sentences and reading time as you type.',
    usedFor: 'for article length and content briefs',
    updated: '2026-11-10',
    keywords: 'word counter word count character count reading time text statistics unique words',
    focus: 'word counter',
    h1: 'Word Counter — words, characters and reading time',
    metaTitle: 'Free Word Counter — Words, Characters & Reading Time',
    metaDesc: 'Free word counter counts words, unique words, characters, sentences and paragraphs as you type, with reading time and the terms you repeat most.',
    intro: 'Paste any text into this word counter to see words, unique words, characters, sentences and paragraphs, plus reading time and the terms you repeat most often.',
    sections: [
      { h: 'What a word counter counts', p: ['A word counter is a measuring rule, and like any rule it only helps if you know where it starts. This one splits text on whitespace, as a word processor does: “state-of-the-art” is one word, a standalone number is one word, and a line of dashes is a word too. That is deliberate — it matches the count your editor, CMS and client will see, rather than inventing a stricter definition that leaves everyone comparing different numbers.', 'The unique count is different: it lowercases each token and discards punctuation, so “The” and “the” count once. The ratio between total and unique words is a rough read on repetition — a long piece with few unique words is circling a topic, while a short brief with many unique words is usually dense or jargon-heavy. Neither number is a verdict; they are the first two questions to ask before reading the draft.'] },
      { h: 'How to use the word counter', p: ['Paste the text and the counts update with every keystroke. Nothing is uploaded: the counting runs in this browser tab, so drafts, client copy and unpublished briefs stay local. Clear the box to start again — there is no save, no account and no history to tidy up afterwards. If you are checking a page rather than a draft, paste only the body copy; navigation and footer links inflate every figure and make the reading time useless.', 'Read the strip in order. Words and characters answer the length question; sentences and paragraphs describe shape; reading time turns the count into a commitment. The frequency list is the part people skip and then need: it shows which terms the draft actually repeats, which is useful when a page is supposed to target one phrase and mentions three. Copy the numbers into a brief, or paste the text again after editing to see the difference.'] },
      { h: 'Word count, reading time and SEO', p: ['There is no word count Google rewards. Pages rank because they answer a query better than the alternatives, and the length that takes varies with the query — a definition needs two hundred words, a migration checklist needs two thousand. What the word counter gives you is a comparison: what the pages already ranking spend, and what yours spends. If you are far below, you may be missing subtopics; if you are far above with no extra substance, you are probably padding.', 'Two mistakes recur. The first is counting markup, code samples or a navigation dump and mistaking it for prose. The second is treating reading time as a ranking factor rather than an editorial one: it tells you whether a page keeps the promise its title makes, which affects whether readers finish and share it, but it is not a signal you can optimise directly. Use the counts to edit, not to hit a number.'] },
    ],
    faqs: [
      { q: 'How does this word counter split words?', a: 'It splits on whitespace, like a word processor: hyphenated words and standalone numbers each count once, and punctuation attached to a word does not create a second one.' },
      { q: 'Does the word counter upload my text?', a: 'No. Counting runs in your browser and nothing is sent to a server, so drafts, client copy and unpublished content are safe to paste here.' },
      { q: 'Why is the unique word count lower than the total?', a: 'The word counter lowercases each word and ignores punctuation, so repeats of the same term are counted once. The gap is a rough measure of repetition, not an error.' },
      { q: 'Is there an ideal word count for SEO?', a: 'No. Length should follow the query: enough to answer it completely, not a target number. Compare with the pages already ranking, then add only what is missing.' },
    ],
    html: `
${f.textarea('wc-text', 'Paste your text (nothing is uploaded)', 'Paste an article, draft or brief here to count its words…', 8)}
${outputArea('wc-out', 'Text statistics')}`,
  },

  // ---------------------------------------------------------- character counter
  {
    slug: 'character-counter',
    name: 'Character Counter',
    cat: 'content',
    icon: '🔡',
    card: 'Count characters, spaces, bytes and lines — and see how much of a platform limit is left.',
    usedFor: 'for titles, posts and message limits',
    updated: '2026-11-10',
    keywords: 'character counter character count byte counter twitter character limit meta description length',
    focus: 'character counter',
    h1: 'Character Counter — limits for titles, posts and messages',
    metaTitle: 'Free Character Counter — Characters, Bytes & Limits',
    metaDesc: 'Free character counter: characters with and without spaces, UTF-8 bytes, words and lines, and how much of a 60-character title or 280-character post is left.',
    intro: 'This character counter measures characters with and without spaces, UTF-8 bytes, words and lines, and shows how much of a common limit is left before you publish.',
    sections: [
      { h: 'Characters, bytes and why the two differ', p: ['A character counter answers a simpler question than it looks. “Café” is four characters and five bytes in UTF-8; an emoji is one character in JavaScript’s count and four bytes on the wire. Databases, SMS gateways and APIs often charge by bytes, while editors, social platforms and meta tags count characters — so a string that fits one limit can fail another. The tool reports both, with spaces and without, because those are the two figures the limits actually use.', 'Lines and words are included for context rather than precision. A line count tells you whether a form field has wrapped in a way a backend will reject; a word count tells you whether a “short” post is really short. Neither replaces reading the text, but both catch the copy-paste accidents that make a field look fine and fail on submit. A paragraph pasted from a PDF also carries invisible characters, which the byte count exposes.'] },
      { h: 'How to use the character counter', p: ['Paste the text and watch the figures move. The tiles report the raw counts; the bar chart underneath compares the same string against four limits people hit constantly: a sixty-character meta title, a hundred-and-fifty-eight-character description, a 280-character post and a 160-character SMS. Each bar says how much room is left, or how far over the line you are, so the answer is visible rather than calculated.', 'The counter is deliberately literal. It counts what is in the box, including line breaks and trailing spaces; trim the text first if you want the number a CMS will display. Nothing is uploaded, so a password, a client message or an unpublished title is safe to measure. When a limit depends on rendered length rather than raw characters — HTML entities, for instance — check the rendered page instead of trusting any counter.'] },
      { h: 'The limits that actually matter', p: ['Google truncates titles and descriptions by pixel width, not character count, so sixty and a hundred and fifty-eight are working targets rather than rules; they keep most pages inside the snippet. Social platforms are stricter and more literal: a 280-character post is rejected over the line, and an SMS is split into segments at 160 characters for plain text, fewer when accents force a different encoding.', 'The practical use is comparison. Write three titles and measure each; the difference between fifty-two and sixty-four characters is usually one adjective you can lose. Do the same with a description, where the honest test is whether the first hundred and twenty characters carry the promise, because anything after that may never be shown. A character counter cannot write the line, but it stops the line being cut.'] },
    ],
    faqs: [
      { q: 'What is the difference between characters and bytes?', a: 'Characters are what you see; bytes are how they are stored. In UTF-8 an accented letter takes two bytes and an emoji four, so byte limits are stricter than character limits.' },
      { q: 'Does the character counter include spaces?', a: 'It reports both figures. Characters with spaces is the count most editors show; without spaces is the one some forms and databases enforce.' },
      { q: 'Why do social platforms count characters differently?', a: 'Most count characters, some count bytes, and a few shorten every link to a fixed length. The character counter gives the raw figure; the platform applies its own rules on top.' },
      { q: 'Is the counter accurate for emoji?', a: 'Yes for characters and bytes, with one caveat: some emoji are built from several code points, so a single visible glyph can count as more than one character in JavaScript.' },
    ],
    html: `
${f.textarea('chc-text', 'Paste your text (nothing is uploaded)', 'Paste a title, post or message here…', 8)}
${outputArea('chc-out', 'Character counts')}`,
  },

  // ---------------------------------------------------------- text diff
  {
    slug: 'text-diff',
    name: 'Text Diff Checker',
    cat: 'content',
    icon: '🔀',
    card: 'Compare two texts line by line and see exactly what was added, removed or unchanged.',
    usedFor: 'for drafts, contracts and config files',
    updated: '2026-11-11',
    keywords: 'text diff checker compare two texts difference finder diff tool line comparison',
    focus: 'text diff',
    h1: 'Text Diff Checker — compare two texts line by line',
    metaTitle: 'Free Text Diff Checker — Compare Two Texts Line by Line',
    metaDesc: 'Free text diff checker marks added and removed lines between two versions, with a copyable unified diff and a count of exactly what changed.',
    intro: 'Paste two versions into this text diff checker to see added and removed lines side by side, with a unified diff you can copy into a review or a commit.',
    sections: [
      { h: 'What a line-level text diff can and cannot show', p: ['A text diff compares two versions line by line and marks each line as unchanged, removed or added. Line granularity is a deliberate limit: changing one word inside a paragraph marks the whole paragraph as removed and re-added, because the tool is not guessing at character-level intent. That is usually the right trade for prose and configuration files, where the line is the unit people actually edit.', 'The important honesty is about moves. If a paragraph is moved rather than edited, a line diff reports a removal at the old position and an addition at the new one, because order is part of the text. Only a tool that tracks blocks can say “moved”; this one cannot, so it does not claim to.', 'Whitespace is a real difference by default. Two files that differ only in indentation are different files, and a diff that hides that is lying to you. The ignore-whitespace option exists for the times indentation is noise, and it stays off until you ask for it.'] },
      { h: 'How to read the diff output', p: ['Paste the original on the left and the changed version on the right. Removed lines carry a minus and a red tint, added lines a plus and a green tint, and unchanged lines a space. The two narrow columns are line numbers for each version, so a line that exists in only one shows a number on that side and a blank on the other. The summary counts the changes before you read a single line.', 'The unified diff underneath is the format review tools and patches expect: --- and +++ headers, an @@ hunk with the starting line and length, then the same lines prefixed with a space, minus or plus. Copy it into a commit message, a code review or a bug report and the other person can read the change without opening either file.', 'Everything runs in the tab. Contracts, unpublished drafts and client copy do not leave the browser, which is the reason to paste here rather than into a service that stores what it receives.'] },
      { h: 'When a text diff is the wrong tool', p: ['A diff shows what changed, not whether the change was right. For a draft it is a proofreading aid — it surfaces a deleted clause that nobody meant to remove. For a config file it is a safety check before deploying. For a merge it is the wrong tool: two conflicting edits need a three-way merge, and a two-way comparison cannot tell which side to keep.', 'Very large texts are capped. Above twelve hundred changed lines on either side the comparison is refused with a message rather than frozen, because the table that makes the diff exact grows with the square of the input. Compare a chapter or a file at a time.', 'One more limit worth knowing: the diff ignores nothing you have not asked it to. Trailing spaces, Windows line endings and a stray tab all count as changes, and they are often exactly what you need to see before a file breaks a build. If the diff is noisier than the change, turn on the option that removes the noise — but do it knowingly.'] },
    ],
    faqs: [
      { q: 'How does this text diff checker work?', a: 'It splits both texts into lines and computes the longest common subsequence, then marks the gaps as added or removed. The comparison happens in your browser and nothing is uploaded.' },
      { q: 'Why does a moved paragraph show as a removal and an addition?', a: 'Because the diff compares positions line by line. A block that moves is, to a line-based algorithm, a deletion at the old place and an insertion at the new one.' },
      { q: 'Can the text diff checker compare code or HTML?', a: 'Yes. Any plain text works, including code, HTML and configuration files. Very large changes are capped at twelve hundred lines per side to keep the page responsive.' },
      { q: 'Does it ignore whitespace and case?', a: 'Only when you ask. Both options are off by default, because indentation and capitalisation are often the change you are looking for.' },
    ],
    html: `
<div class="field-row">
${f.textarea('df-a', 'Original', 'Paste the original text…', 10)}
${f.textarea('df-b', 'Changed', 'Paste the changed text…', 10)}
</div>
${f.check('df-case', 'Ignore case', false)}
${f.check('df-space', 'Ignore whitespace differences', false)}
${f.check('df-blank', 'Ignore blank lines', false)}
${outputArea('df-out', 'Differences')}
${outputBlock('df-unified', 'Unified diff')}
${note('Compared line by line in your browser — neither version is uploaded. Copy the unified diff straight into a review or a commit message.')}`,
  },
  
  // ---------------------------------------------------------- markdown to HTML
  {
    slug: 'markdown-to-html',
    name: 'Markdown to HTML Converter',
    cat: 'content',
    icon: '📝',
    card: 'Convert Markdown to escaped, XSS-safe HTML with a live preview.',
    usedFor: 'for drafts that need to become markup',
    updated: '2026-11-11',
    keywords: 'markdown to html converter markdown converter md to html commonmark markdown preview',
    focus: 'markdown to html',
    h1: 'Markdown to HTML Converter — a safe CommonMark subset',
    metaTitle: 'Free Markdown to HTML Converter — CommonMark Subset',
    metaDesc: 'Free markdown to HTML converter turns headings, lists, code, links and images into clean HTML, with a live preview and every input character escaped.',
    intro: 'Paste Markdown into this converter to get clean HTML, a live preview and a word count — every character you paste is escaped, so nothing in it can run.',
    sections: [
      { h: 'What the markdown to HTML converter supports', p: ['Headings from one to six hashes, paragraphs separated by blank lines, unordered and ordered lists to two levels, fenced code blocks with an optional language label, blockquotes, horizontal rules, and hard line breaks from two trailing spaces or a backslash. Inline it handles bold, italic, inline code, links and images.', 'The list is short and printed on the page, because a converter that silently mis-renders a table is worse than one that says it does not do tables. Anything outside that list — GFM tables, task lists, footnotes, definition lists, strikethrough, reference-style links, setext headings — comes out as plain text rather than as broken markup.', 'The block parser is line-based: each line is classified, consecutive lines group into a block, and fenced code is read raw until its closing fence. Inline formatting runs as a single left-to-right scan rather than a stack of regex replacements, which is the difference between bold inside italic working and the two corrupting each other.'] },
      { h: 'Why the output is safe to paste anywhere', p: ['Markdown converters are an XSS delivery route whenever raw HTML passes through. This one never passes raw HTML: every character of your input is escaped before any tag is generated, so a script tag in a paragraph becomes visible text rather than an element. The only tags in the output are the ones the converter writes itself.', 'Links get a second check. A destination is parsed and must use http, https, mailto or tel; javascript:, data: and vbscript: are refused. A refused link leaves a visible marker in the output — “[link blocked: javascript URL]” — rather than vanishing, so you can see that something was rejected instead of wondering where it went.', 'The preview renders inside a sandboxed iframe with no script permission, so even a mistake in the escaping could not execute in the page you are reading. The generated HTML is placed in a text area, not injected into this page.'] },
      { h: 'What it deliberately leaves out', p: ['Tables need column alignment, escaping inside cells and a decision about ragged rows. markdown-it and cmark-gfm already implement that, and a half-version here would produce tables that look right and break in a CMS. Footnotes and reference-style links need a second pass over the document, which a single-pass converter does not do, so both are omitted rather than approximated.', 'Raw HTML passthrough is the big omission, and it is intentional. If the output needs a div or a table, write HTML; this converter is for prose that should become predictable markup. That restriction is what makes the safety claim true rather than aspirational.', 'Two smaller limits are visible in the output rather than hidden: input is capped at 50,000 characters, and list nesting deeper than two levels is flattened with a count shown below the result, so you know what happened.'] },
    ],
    faqs: [
      { q: 'Does this markdown to HTML converter support tables?', a: 'No. Tables are a GitHub extension rather than base CommonMark, and a partial implementation would break in a CMS. Use markdown-it locally if you need them.' },
      { q: 'Is the converted HTML safe to embed?', a: 'Yes. Every input character is escaped and the converter writes all of the tags itself; there is no raw HTML passthrough, and link protocols are restricted.' },
      { q: 'Why did one of my links come out as blocked?', a: 'Its protocol was not http, https, mailto or tel. javascript:, data: and vbscript: links are refused and replaced with a visible marker so the rejection is obvious.' },
      { q: 'Can I paste HTML into the Markdown box?', a: 'You can, but it will appear as escaped text. Raw HTML is not passed through, because that is the main injection route in permissive Markdown parsers.' },
    ],
    html: `
${f.textarea('md-in', 'Markdown', 'Paste Markdown here…', 10, '# Hello\n\nSome **bold** text and a [link](https://example.com).\n\n- one\n- two\n  - nested\n\n\`\`\`js\nconst x = 1 < 2 && 3 > 2;\n\`\`\`\n')}
${f.check('md-wrap', 'Wrap the output in &lt;article&gt;', true)}
<p class="tool-note" id="md-stats"></p>
${outputBlock('md-out', 'HTML')}
<p class="tool-note" id="md-preview-label">Preview</p>
<iframe id="md-preview" class="md-preview-frame" sandbox="" title="Rendered preview of the converted Markdown"></iframe>
<div class="md-subset">
  <div>
    <h2>Supported</h2>
    <ul>
      <li><code>#</code> to <code>######</code> headings</li>
      <li>paragraphs, <strong>bold</strong>, <em>italic</em>, <code>inline code</code></li>
      <li>ordered and unordered lists, two levels</li>
      <li>fenced code blocks with a language label</li>
      <li>blockquotes, horizontal rules, hard line breaks</li>
      <li><code>[text](url)</code> links and <code>![alt](src)</code> images</li>
    </ul>
  </div>
  <div>
    <h2>Not supported</h2>
    <ul>
      <li>tables, task lists, footnotes</li>
      <li>definition lists and math blocks</li>
      <li>raw HTML passthrough</li>
      <li>reference-style links</li>
      <li>setext headings and strikethrough</li>
      <li>bare-URL autolinking</li>
    </ul>
  </div>
</div>
${note('All input text is HTML-escaped; the only tags in the output are the ones this converter generates. Links may only use http, https, mailto or tel — anything else is replaced with a visible blocked marker rather than dropped silently.')}`,
  },

  // ---------------------------------------------------------- email validator
  {
    slug: 'email-validator',
    name: 'Email Validator',
    cat: 'content',
    icon: '📧',
    card: 'Check email format step by step, with the exact reason an address fails.',
    usedFor: 'for lists and signup forms before a send',
    updated: '2026-11-11',
    keywords: 'email validator email format checker validate email address rfc 5322 email list checker mx lookup',
    focus: 'email validator',
    h1: 'Email Validator — step-by-step format checks with reasons',
    metaTitle: 'Free Email Validator — Format Check With Reasons',
    metaDesc: 'Free email validator checks one address or a pasted list against RFC 5322 format rules, names the exact problem, and offers an optional MX lookup.',
    intro: 'Check one address or a whole list in this email validator: it names the exact format rule that failed, shows the parts, and can look up a domain’s MX records.',
    sections: [
      { h: 'What an email validator can and cannot check', p: ['A format check answers one question: could this string be an address? It reads the local part, the domain and the TLD against the rules RFC 5322 describes in practice, then reports the first rule that fails. That is genuinely useful for catching typos before a send, and it is the whole of what can be verified without contacting a mail server.', 'It cannot tell you whether the mailbox exists, whether the domain accepts mail, or whether a person reads it. Those need an SMTP conversation or a delivery attempt. A disposable address passes every format rule, a typosquatted domain can have valid MX records, and an address can be shaped perfectly and belong to nobody.', 'The optional MX lookup closes one of those gaps. It asks a DNS resolver whether the domain publishes mail exchangers, which is a real signal that the domain is configured to receive mail. It runs only when you press the button, because it is a network request, it is slow over a long list, and it still says nothing about the individual mailbox.'] },
      { h: 'The checks, in the order they run', p: ['Order matters, because the first failure is the one reported. The address is trimmed; the total length is capped at 254 characters; there must be exactly one @; the local part is capped at 64 characters; it cannot start or end with a dot or contain two dots in a row; and every character must be legal in an unquoted address. Quoted local parts are refused outright rather than half-parsed.', 'The domain is checked separately: at most 253 characters, at least one dot, no leading or trailing dot, no empty label, every label 63 characters or fewer and made of letters, digits and internal hyphens, and a TLD of two or more letters. A non-ASCII domain is converted to Punycode, which is the form the DNS actually resolves, and the output shows that converted form.', 'Each failure names the rule, so a rejected address tells you what to fix instead of just turning red. That is the reason for a sequence of checks rather than one regular expression: a regex can reject an address, but it cannot say which rule it broke.'] },
      { h: 'What a valid result does not mean', p: ['Valid means the format is sound. It does not mean deliverable, and treating it as a deliverability check is the most common way list hygiene goes wrong: a list of format-valid addresses can still be thirty percent dead. Bounce rates, spam traps and role accounts are invisible to any format checker.', 'If deliverability matters, the next step is SMTP verification, which opens a conversation with the receiving server and asks whether it would accept mail for that address without sending anything. That is a service rather than a page: it needs a sending reputation, rate limits and someone to answer when it goes wrong.', 'For a contact form the format check is still worth doing — it catches the typo that would otherwise bounce silently and lose a customer. Pair it with a confirmation email and the two halves fit together: a cheap rejection of the obviously wrong, and a real test of everything else.'] },
    ],
    faqs: [
      { q: 'Why does my valid email show as invalid?', a: 'Usually an internationalized domain or a quoted local part. This validator converts non-ASCII domains to Punycode, so if it still fails, look for a dot at the edge of the local part.' },
      { q: 'Does a valid result from this email validator mean the inbox exists?', a: 'No. The check verifies format, plus optional MX records. A format-valid address can bounce, be a typo or be disposable; only an SMTP probe or a real send confirms delivery.' },
      { q: 'What does the MX lookup do?', a: 'It asks Google’s public resolver whether the domain publishes mail servers. No MX records means the domain cannot receive mail at that address. The lookup runs only when you press the button, and on single addresses only.' },
      { q: 'Is my email list uploaded?', a: 'No. Checking happens in your browser. The optional MX lookup is the only network call, and it sends just the domain to dns.google — not the address and not the list.' },
    ],
    html: `
<div class="field field-check"><input type="radio" name="em-mode" id="em-mode-single" checked><label for="em-mode-single">Single address</label></div>
<div class="field field-check"><input type="radio" name="em-mode" id="em-mode-batch"><label for="em-mode-batch">Batch list</label></div>
<div class="field"><label for="em-in">Email address</label><textarea id="em-in" rows="5" placeholder="user@example.com">ada@example.com</textarea></div>
<button type="button" class="btn btn-ghost" id="em-mx-go">Look up MX records (queries dns.google)</button>
<p class="tool-note" id="em-stats" aria-live="polite"></p>
${outputArea('em-out', 'Result')}
${note('Format checks only. A valid result means the address is shaped like an email address, not that a mailbox exists, accepts mail or belongs to anyone. Checking runs in your browser; the optional MX lookup is the only network call, and it goes to Google’s public resolver.')}`,
  },
  ];

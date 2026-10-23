// Tools4Market — Web & Utility tool definitions (build-time data)
import { f, outputBlock, outputArea, note } from './helpers.js';

export const TOOLS_WEB = [
  // ---------------------------------------------------------- 1
  {
    slug: 'htaccess-redirect-generator',
    name: '.htaccess Redirect Generator',
    cat: 'web',
    icon: '↪️',
    card: '301/302 rules, force-HTTPS and www canonicalisation — copy-paste ready.',
    usedFor: 'for site migrations and HTTPS moves',
    keywords: 'htaccess redirect generator 301 force https www apache',
    focus: 'htaccess redirect generator',
    h1: 'Free .htaccess Redirect Generator — No Signup, No Limits',
    metaTitle: 'Free .htaccess Redirect Generator — 301, HTTPS, WWW',
    metaDesc: 'Create correct .htaccess rules with this htaccess redirect generator — 301/302 redirects, forced HTTPS and www canonicalisation for Apache. Free, no signup.',
    intro: 'Use this htaccess redirect generator to write the rules your Apache site needs — 301 and 302 redirects, a forced HTTPS block and one canonical host.',
    sections: [
      { h: 'What this htaccess redirect generator produces', p: ['Three rule families: simple 301/302 redirects (old path → new URL), a force-HTTPS block that bounces all plain-HTTP traffic to the secure site, and www canonicalisation that picks either www or the bare domain as your one true host. Together they prevent the duplicate-URL problems that quietly split ranking signals. Generated as one block, they sit in the same file and can be enabled one family at a time, so you can fix protocol, host and individual paths in separate, testable steps.', 'A 301 tells browsers and search engines the move is permanent and passes most ranking signals; a 302 says temporary — use it for short-lived promos, and expect Google to keep the old URL indexed. When in doubt, use 301: an unnecessary permanent redirect is easy to undo later, while a 302 left in place for months quietly wastes the signals your old URL had earned. The status code is the one part of a redirect you cannot change afterwards without repeating the whole move.'] },
      { h: 'How to use it', p: ['Pick a mode. For redirects, add rows of old-path → new-URL (paths start with a slash and are relative to the domain root; destinations are absolute). For the HTTPS and www modes, enter your domain. Copy the generated block into the .htaccess file in your site’s root — or paste into the relevant server block if you run nginx (the syntax differs; this tool targets Apache).', 'Test after deploying by loading the old URL in a fresh browser session and confirming it lands on the new one with the status you intended. An invalid .htaccess typically returns a 500 error across the whole site, so keep a copy of the original file open in another tab before you overwrite it, and restore it first if anything breaks.'] },
      { h: 'Common mistakes', p: ['The usual breakages are structural rather than mysterious: two RewriteEngine On lines in one file, a rule pasted before the WordPress block that has to come first, or a missing flag that turns a redirect into a loop. Order matters too — put your redirects after the rewrites already in the file rather than above them, and never point a rule back at the URL it is already serving, or the browser will cycle until it gives up.', 'The other trap is redirecting in the wrong direction. A canonicalisation rule that forces www must agree with your canonical tags, your sitemap and your internal links — if those disagree, search engines receive mixed signals and you spend weeks wondering why the host keeps flip-flopping in the index. Pick one host once, apply it everywhere, and check a handful of old URLs with a redirect checker before you call the migration finished.'] },
    ],
    faqs: [
      { q: '301 or 302 — which redirect should I use?', a: '301 for permanent moves (URL cleanups, migrations) — it consolidates ranking signals. 302 only for temporary situations (a sale page, maintenance), where you want the old URL to stay indexed.' },
      { q: 'Where is the .htaccess file located?', a: 'In the root directory of your website on an Apache server (often public_html). It is a hidden dotfile — enable “show hidden files” in your FTP client. The htaccess redirect generator writes the rules; placing them in the file is a manual step. On nginx servers this file is not used.' },
      { q: 'Why force HTTPS and www canonicalisation?', a: 'So every visitor and crawler ends up on exactly one host and protocol. Otherwise http://example.com, https://example.com and https://www.example.com are three sites to search engines. The htaccess redirect generator gives you both blocks in one paste.' },
      { q: 'My site breaks after pasting rules — what now?', a: 'Restore your backup .htaccess. Common causes: duplicate RewriteEngine lines, rules placed before other required rules (like WordPress’s block), or syntax typos. Paste new rules after existing RewriteEngine On.' },
    ],
    html: `
${f.select('ht-mode', 'Rule type', [
      { v: 'redirects', l: 'Redirects (301/302 list)' },
      { v: 'https', l: 'Force HTTPS' },
      { v: 'www', l: 'Force www (non-www → www)' },
      { v: 'nonwww', l: 'Force non-www (www → non-www)' },
    ])}
${f.text('ht-domain', 'Domain (for HTTPS / www rules)', 'example.com')}
<div id="ht-redirects">
  <div class="field">
    <label>Redirects (old path → new URL)</label>
    <div id="ht-rows"></div>
    <button type="button" class="btn btn-secondary" data-add="ht">+ Add another redirect</button>
  </div>
</div>
${outputBlock('ht-out', '.htaccess rules')}
${note('Back up your existing .htaccess before overwriting it — a syntax error can take the whole site down.')}`,
  },

  // ---------------------------------------------------------- 2
  {
    slug: 'sitemap-generator',
    name: 'XML Sitemap Generator',
    cat: 'web',
    icon: '🗺️',
    card: 'Turn a list of URLs into a valid XML sitemap, ready to submit.',
    usedFor: 'for Search Console submissions',
    updated: '2026-10-22',
    keywords: 'xml sitemap generator create sitemap submit google',
    focus: 'xml sitemap generator',
    h1: 'Free XML Sitemap Generator — No Signup, No Limits',
    metaTitle: 'Free XML Sitemap Generator — Create & Download sitemap.xml',
    metaDesc: 'Paste a list of URLs and this XML sitemap generator gives you a valid sitemap.xml with lastmod, changefreq and priority — ready for Search Console. Free.',
    intro: 'Paste your URLs into this XML sitemap generator and download a standards-compliant sitemap.xml for Google Search Console and Bing Webmaster Tools.',
    sections: [
      { h: 'What this XML sitemap generator does', p: ['A sitemap is a machine-readable list of the URLs you want search engines to index. It does not guarantee indexing — quality still decides that — but it makes discovery complete and fast, which matters most for new sites, large sites, and pages with few internal links. It is the safety net you want before a redesign, when internal links are the first thing to break. It also gives you a place to declare freshness, so a crawler knows which sections change often without guessing from crawl history.', 'Optional attributes help crawlers prioritise: lastmod (real last-modification date — only set it if truthful, Google ignores fabricated dates), changefreq and priority (weak signals, but harmless when set honestly). If you leave the optional fields empty the file stays valid — a sitemap of bare URLs is perfectly legitimate, and honest omission beats a confident guess that search engines will simply discount.'] },
      { h: 'How to use it', p: ['Paste one URL per line (absolute, https://, no duplicates — the tool dedupes for you). Set an optional lastmod date, or leave changefreq and priority at their defaults. Download the generated sitemap.xml, upload it to your domain root, then submit it in Search Console under Sitemaps and reference it at the end of your robots.txt. Work from a clean export rather than memory: a list pulled from your analytics will include tagged and parameterised URLs you never wanted indexed.', 'The limits are 50,000 URLs or 50 MB per file; beyond that, split the list into a sitemap index that points at several files. Keep every URL canonical, indexable and returning a 200 response — redirects, noindex pages and error URLs do not belong here. Refresh the lastmod dates when you genuinely republish a page, and leave them alone when you have only tidied the wording.'] },
      { h: 'How to check your work', p: ['After upload, open https://yourdomain.com/sitemap.xml directly and confirm it returns the XML you generated rather than a 404 or a theme page — on some platforms a plugin quietly rewrites that path. Then submit the URL in Search Console and watch the Sitemaps report: a successful submission lists the URLs it discovered, and any parsing error is shown there rather than silently ignored. Bookmark the exact URL you submit, because that is the one you will re-check next time.', 'Cross-check the numbers: if the file lists ninety pages and Search Console reports two hundred discovered, yours is stale or the site has grown since you exported it. Regenerate whenever you add a meaningful section, and keep the file at the domain root so the reference in robots.txt stays valid. A sitemap that has drifted sends crawlers at URLs that no longer match your site, which is exactly the confusion it was meant to prevent.'] },
    ],
    faqs: [
      { q: 'Where do I upload sitemap.xml?', a: 'At your domain root, so it is reachable at https://yourdomain.com/sitemap.xml. Then submit that URL in Google Search Console → Sitemaps.' },
      { q: 'Does a sitemap improve rankings?', a: 'Not directly. A sitemap helps discovery and crawl coverage, and a URL appearing in one is not proof that it has been indexed. The XML sitemap generator gives you a valid file; what happens next depends on your content and the crawl signals Google sends.' },
      { q: 'Should I include noindex or redirected pages?', a: 'No. Only canonical, indexable, 200-status URLs belong in the sitemap. Everything else sends mixed signals.' },
      { q: 'Do I need changefreq and priority?', a: 'They are optional and carry little weight today. lastmod is the one attribute worth setting — truthfully. The XML sitemap generator lets you leave every optional field empty and still produce a valid file.' },
    ],
    html: `
${f.textarea('sm-urls', 'URLs — one per line', 'https://example.com/\nhttps://example.com/pricing\nhttps://example.com/blog/seo-guide', 9)}
<div class="field-row">
${f.date('sm-lastmod', 'Last modified (optional)')}
${f.select('sm-changefreq', 'Change frequency', [
      { v: '', l: '— none —' },
      { v: 'daily', l: 'daily' }, { v: 'weekly', l: 'weekly' }, { v: 'monthly', l: 'monthly' },
      { v: 'yearly', l: 'yearly' }, { v: 'always', l: 'always' }, { v: 'never', l: 'never' },
    ])}
</div>
${f.select('sm-priority', 'Priority', [
      { v: '', l: '— none —' },
      { v: '0.5', l: '0.5 (default)' }, { v: '0.3', l: '0.3' }, { v: '0.7', l: '0.7' },
      { v: '0.8', l: '0.8' }, { v: '0.9', l: '0.9' }, { v: '1.0', l: '1.0' },
    ])}
<p class="tool-note" id="sm-note">Paste URLs to generate the sitemap.</p>
${outputBlock('sm-out', 'sitemap.xml')}
<div class="btn-row"><button type="button" class="btn" data-download="#sm-out|sitemap.xml">Download sitemap.xml</button></div>`,
  },

  // ---------------------------------------------------------- sitemap validator
  {
    slug: 'sitemap-validator',
    name: 'Sitemap Validator',
    cat: 'web',
    icon: '✅',
    card: 'Check sitemap.xml structure, URLs and dates before Search Console ever sees it.',
    usedFor: 'for pre-submission checks',
    updated: '2026-10-23',
    keywords: 'sitemap validator check sitemap xml valid lastmod duplicate urls errors',
    focus: 'sitemap validator',
    h1: 'Free Sitemap Validator — Check sitemap.xml Before You Submit',
    metaTitle: 'Free Sitemap Validator — Check sitemap.xml Instantly',
    metaDesc: 'Check sitemap.xml before submission with this free sitemap validator — entries, lastmod dates, duplicates and format errors, parsed in your browser.',
    intro: 'Paste any sitemap.xml or sitemap index into this free sitemap validator to check its structure, spot duplicate or malformed URLs and verify lastmod, changefreq and priority before you submit it.',
    sections: [
      { h: 'What this sitemap validator checks', p: ['The validator parses the file the way a search engine crawler does: it confirms the XML is well-formed, the root element is urlset or sitemapindex, and every entry carries an absolute http(s) URL in its loc element. Duplicates are flagged with the entries they repeat, because a sitemap that lists the same URL twice wastes crawl attention and masks export mistakes. Optional attributes get the same scrutiny — lastmod must be an ISO 8601 date or datetime, changefreq must be one of the seven allowed words, and priority must be a number between 0.0 and 1.0. Entries carrying unexpected elements are called out too, since stray tags usually mean a template bug rather than an intentional signal.', 'The two hard protocol limits are checked as well: 50,000 entries and 50 megabytes per file. Past either, search engines may reject the file outright, and the fix is a sitemap index pointing at several smaller files rather than a longer single list. What this validator deliberately does not do is fetch the listed URLs — a file can be perfectly valid and still point at redirects, noindex pages or 404s. URL-level verification belongs in a crawler or the Search Console Sitemaps report, after the structure is known to be sound.'] },
      { h: 'How to use this sitemap validator', p: ['Open your live sitemap in the browser — https://yourdomain.com/sitemap.xml — copy the source, and paste it into the box above; validation runs as you paste, entirely in your browser, so the file never leaves your machine. Analyze mode does the same thing in one step: enter the sitemap URL in the panel and the fetched XML loads straight into the validator. A urlset of plain URLs is a perfectly valid sitemap, so an empty lastmod, changefreq or priority is not an error — the tool checks the attributes you did write, and stays quiet about the ones you left out.', 'Work through the issues list from the top: fix malformed dates, remove duplicates, correct absolute URLs, and regenerate the file from your CMS or export rather than hand-editing a thousand lines. Re-validate after every regeneration — the sitemap is generated by the same templates that break during redesigns, and a two-minute check here is cheaper than discovering a parse error weeks later in the Search Console report, where it silently holds back every page in the file.'] },
      { h: 'Sitemap mistakes that block submissions', p: ['The most common failure is not XML syntax but content: URLs that redirect instead of returning 200, pages tagged noindex, staging hosts that never resolve publicly, and query-string variants of canonical pages. A sitemap is a claim that every listed URL is a canonical, indexable destination — mixed entries send the opposite signal. The second classic is a truncated file: an export cut off mid-entry leaves an unclosed tag at the end, and the whole document stops parsing. Third are dates that look fine to humans but not to parsers — 23/10/2026, October 23, 2026 or a bare year all fail the ISO format the protocol requires.', 'Sitemap indexes have their own pitfalls: pointing at child files on another host, listing children that 404, or nesting indexes deeper than one level. And keep the file reachable — moving sitemap.xml during a migration without updating the robots.txt Sitemap line and the Search Console submission strands the one URL that matters. Validate, submit, then confirm in the Sitemaps report that the discovered URL count matches the entry count you see here.'] },
    ],
    faqs: [
      { q: 'Does a valid sitemap get my pages indexed?', a: 'No. Validation removes structural reasons for rejection; indexing still depends on quality and demand. This sitemap validator confirms the file parses cleanly — what happens next shows in the Search Console reports.' },
      { q: 'What is the difference between urlset and sitemapindex?', a: 'A urlset lists the page URLs of one sitemap file. A sitemapindex lists other sitemap files. Both are valid roots; the validator recognises each and checks the matching entry rules.' },
      { q: 'Which lastmod format does Google accept?', a: 'ISO 8601: 2026-10-23 for a date, or 2026-10-23T09:30:00Z for a full datetime with timezone. Only set lastmod to a date you genuinely republished the page — invented dates are discounted.' },
      { q: 'Does the sitemap validator fetch every URL in the file?', a: 'No — it checks structure and attributes only, in your browser. Fetching thousands of URLs belongs in a crawler or the Search Console Sitemaps report after submission.' },
    ],
    html: `
${f.textarea('sv-xml', 'sitemap.xml contents', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.com/</loc><lastmod>2026-10-23</lastmod></url>\n</urlset>', 9)}
<div class="btn-row"><button type="button" class="btn" id="sv-run">Validate sitemap</button></div>
<p class="tool-note" id="sv-stats"></p>
${outputArea('sv-out', 'Issues')}
${note('Structure and attribute checks only — this validator does not fetch the listed URLs. Everything runs in your browser.')}`,
  },

  // ---------------------------------------------------------- 3
  {
    slug: 'password-generator',
    name: 'Password Generator',
    cat: 'web',
    icon: '🔐',
    card: 'Cryptographically random passwords, generated on your device.',
    usedFor: 'for account and deploy credentials',
    keywords: 'password generator strong random secure password',
    focus: 'password generator',
    h1: 'Free Password Generator — No Signup, No Limits',
    metaTitle: 'Free Strong Password Generator — Secure & Offline',
    metaDesc: 'This password generator makes strong random passwords with cryptographic randomness, length control, character sets and a strength meter. Free.',
    intro: 'This password generator builds cryptographically random passwords in your browser — nothing is transmitted, logged or stored anywhere.',
    sections: [
      { h: 'What makes this password strong', p: ['Strength comes from entropy, not from adding “!” to a word. This tool uses the browser’s cryptographic random number generator (crypto.getRandomValues) with uniform character selection — the same class of randomness used by password managers. Length matters most: a 16-character random password across all character sets carries roughly 100 bits of entropy, out of reach of any realistic brute force. Entropy is what an attacker has to search, so it is the only figure that matters; symbols and exclamation marks add nothing unless they add possibilities.', 'Length presets: 12 characters is the practical minimum for accounts you care about, 16 is the recommended default, and 20+ for anything guarding money or admin panels. Every generated password is unique to this session — reload for a new one. Reuse is the larger risk, so generate a fresh one for every account rather than rotating a favourite; a password you have typed into one site should never protect another.'] },
      { h: 'How to use it', p: ['Set the length, choose character sets (all four selected by default), and exclude look-alike characters (l, 1, I, O, 0) if you will ever type the password by hand. Copy the result straight into your password manager — the only place it should ever live. The strength meter estimates entropy for the selected length and sets, accounting for the requirement that every selected set appears at least once. Switch a set off and the estimate updates immediately.', 'Store it in a password manager the moment you copy it, and never in a note, a spreadsheet or a chat thread. If you must type the password by hand — a router, a safe, a shared workstation — turn on the look-alike exclusion first so zero and O, one and l never blur together on the way in. A generated password you cannot read is useless, and a screenshot of one is worse. Before generating, check that the destination accepts every selected symbol; some older systems restrict punctuation. If a site rejects the result, follow its documented rules and create another unique password.'] },
      { h: 'How this password generator works', p: ['Generation runs entirely in your page with crypto.getRandomValues. It samples a string from the combined selected character pool and retries until every selected set appears. Rejection sampling removes modulo bias from character selection and makes every accepted string with the required sets equally likely.', 'The strength line estimates log2 of the number of valid strings by accounting for the selected-set requirement, rather than simply multiplying length by pool size. The result is still an estimate of the generated string’s search space; it does not account for a compromised device, reuse or where you store the password.'] },
    ],
    faqs: [
      { q: 'Are these passwords really random?', a: 'This password generator uses crypto.getRandomValues and rejection sampling, then accepts only strings containing every selected character set. Accepted strings with those settings are equally likely. Generation stays in your browser.' },
      { q: 'Is my password sent anywhere?', a: 'No. Generation happens entirely in your browser. This page has no backend and collects nothing — you can disconnect from the internet and it still works.' },
      { q: 'How long should my password be?', a: '16 characters for most accounts, 20+ for anything that guards money or site administration. Length beats complexity: a long password with fewer character types is stronger than a short one with all symbols. The password generator shows the entropy figure for the settings you pick.' },
      { q: 'Should I use a passphrase instead?', a: 'Passphrases (four or more random words) are a fine alternative when you must type a password manually. They are easier to remember and their entropy is high — as long as the words are truly random, not a quote or lyric.' },
    ],
    html: `
<div class="field">
  <label for="pw-len">Length: <strong id="pw-len-val">16</strong> characters</label>
  <input type="range" id="pw-len" min="8" max="64" value="16" step="1" style="width:100%">
</div>
<div class="field-row">
<div class="field field-check"><input type="checkbox" id="pw-upper" checked><label for="pw-upper">A–Z</label></div>
<div class="field field-check"><input type="checkbox" id="pw-lower" checked><label for="pw-lower">a–z</label></div>
<div class="field field-check"><input type="checkbox" id="pw-digits" checked><label for="pw-digits">0–9</label></div>
<div class="field field-check"><input type="checkbox" id="pw-symbols" checked><label for="pw-symbols">!@#$%…</label></div>
</div>
${f.check('pw-ambiguous', 'Exclude look-alike characters (l, 1, I, O, 0)')}
<div class="field">
  <label for="pw-out">Your password</label>
  <input type="text" id="pw-out" readonly aria-live="polite" style="font-family:var(--font-mono);letter-spacing:.04em">
</div>
<div class="stat-line" id="pw-strength"></div>
<div class="btn-row">
  <button type="button" class="btn" id="pw-regen">Generate new password</button>
  <button type="button" class="btn btn-secondary" data-copy="#pw-out">Copy</button>
</div>
${note('Passwords are generated on your device and never leave this page. Store them in a password manager.')}`,
  },

  // ---------------------------------------------------------- 4
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder Decoder',
    cat: 'web',
    icon: '📦',
    card: 'Encode text to Base64 or decode it back — UTF-8 safe, URL-safe too.',
    usedFor: 'for tokens, data URIs and API payloads',
    keywords: 'base64 encoder decoder encode decode utf8 url safe online',
    focus: 'base64 encoder',
    h1: 'Free Base64 Encoder Decoder — No Signup, No Limits',
    metaTitle: 'Free Base64 Encoder Decoder — UTF-8 Safe, URL-Safe',
    metaDesc: 'Base64 encoder for UTF-8 text, emoji and URL-safe tokens. Decode invalid input with clear errors, then copy or edit results online. Free, no signup.',
    intro: 'This Base64 encoder converts UTF-8 text, emoji and accents to Base64, or decodes values back to readable text with a URL-safe option for tokens.',
    sections: [
      { h: 'What the Base64 encoder does (and does not)', p: ['Base64 turns binary bytes into an alphabet of sixty-four printable characters plus padding, so data that must survive text-only channels — JSON bodies, email attachments, data URLs, configuration files — travels without being mangled on the way. It is an encoding, not a protection: anyone holding the string decodes it in a single step, and the result runs about a third larger than the original. Base64 exists to make bytes safe for transport, never to make them private.', 'There are dialects. Standard Base64 uses the plus and slash characters, which collide with query strings and filenames; URL-safe Base64 swaps them for hyphen and underscore and usually drops the equals-sign padding. JSON Web Tokens, S3 signing keys and many web APIs expect the URL-safe form. This tool handles both: the checkbox switches the alphabet when encoding and normalises it again when decoding, so a token pasted out of a URL decodes exactly like one copied from a log.'] },
      { h: 'How to use this Base64 encoder', p: ['Choose Encode or Decode and read the result, which updates as you type. Encoding accepts anything you can paste: accents, emoji and non-Latin scripts are converted to UTF-8 bytes first and then to Base64, so “café” and “日本” round-trip back to the same characters. Decoding validates the alphabet before it touches the data, so a truncated or corrupted paste produces a clear message rather than an exception or a screen of noise.', 'Turn on URL-safe when the destination is a filename, a URL segment, a signed link or a JWT; leave it off for data URLs, MIME parts and anything written by a standard that says standard Base64. If decode output reports invalid UTF-8, the underlying bytes were never text — you are looking at an image, an archive or another binary, which Base64 can carry perfectly well but which this box cannot display as characters.'] },
      { h: 'Common mistakes', p: ['The classic mistake is treating Base64 as encryption or as a checksum. It is neither: a shared key encoded in Base64 is a shared key in disguise, and integrity needs a hash or a signature over the payload. Never place credentials, personal data or tokens in Base64-encoded query parameters expecting them to stay hidden — the encoding is trivially reversible, and the string still lands in server logs, browser history and referrer headers.', 'The second is mixing dialects. Pasting standard Base64 into a system that expects URL-safe input — or the reverse — fails on the plus and slash characters, or on padding the receiver will not tolerate. If decoding fails on a string your own encoder produced, check the alphabet and the padding first rather than hunting for corruption.', 'The third is decoding on behalf of binary formats. Base64 will happily encode a PNG, an audio clip or a zip archive, but decoding those bytes as UTF-8 text tells you nothing useful about the file. Keep binary payloads as bytes in your code and reserve this tool for text and for inspecting what a token actually carries.'] },
    ],
    faqs: [
      { q: 'Does this Base64 encoder encrypt data?', a: 'No. It is an encoding that makes bytes text-safe and is fully reversible by anyone. Use real encryption if you need confidentiality.' },
      { q: 'Why is the encoded text about a third longer?', a: 'Every three bytes become four characters (plus occasional padding), so output is roughly four-thirds the size of the input.' },
      { q: 'Can this Base64 encoder handle URL-safe values?', a: 'Yes. It uses hyphen and underscore in place of plus and slash, with optional padding, for JWTs, filenames and signed URLs.' },
      { q: 'Why does my decoded text show strange characters?', a: 'Usually a dialect mismatch (punctuation from the wrong alphabet), missing padding, or bytes that are not UTF-8 text at all. Paste the complete string.' },
    ],
    html: `
${f.textarea('b6-text', 'Text to encode, or Base64 to decode', 'Type or paste text here…', 6)}
<div class="field-row">
${f.select('b6-mode', 'Mode', [
      { v: 'encode', l: 'Encode (text → Base64)' },
      { v: 'decode', l: 'Decode (Base64 → text)' },
    ])}
${f.check('b6-url', 'URL-safe (- and _ instead of + and /)')}
</div>
${outputBlock('b6-out', 'Result')}
${note('Encoding is not encryption — anyone with the Base64 string can read the original text.')}`,
  },

  // ---------------------------------------------------------- 5
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder Decoder',
    cat: 'web',
    icon: '🔗',
    card: 'Encode or decode URLs and query strings with the right function.',
    usedFor: 'for fixing broken query strings',
    keywords: 'url encoder decoder encodeuricomponent decode percent encoding online',
    focus: 'url encoder',
    h1: 'Free URL Encoder Decoder — No Signup, No Limits',
    metaTitle: 'Free URL Encoder & Decoder — Percent-Encoding Tool',
    metaDesc: 'URL encoder to percent-encode or decode a whole URL, query string or value with JavaScript URI functions. Live output, clear errors and copy. Free.',
    intro: 'This URL encoder applies JavaScript encode and decode functions to a whole URL or one value; the output updates live as you choose a mode.',
    sections: [
      { h: 'Which URL encoder function to choose', p: ['Four JavaScript functions, two jobs. encodeURIComponent encodes everything that is not unreserved, making it the right choice for a single query parameter or a path segment — the value may contain ampersands, equals signs and slashes without confusing the parser that reads the URL. encodeURI leaves the structural characters of a URL alone — scheme, slashes, question mark, hash — and encodes only what would break it, so it suits a whole URL you have already assembled.', 'On the way back, decodeURIComponent reverses an encoded component and decodeURI reverses a whole URL. The pairs matter. Decoding a parameter with decodeURI leaves its percent-encoded hash in place, so a value that contained a hash never comes back as one; decoding a full URL with decodeURIComponent can tear apart the structure it was never meant to touch. Match the decode function to whatever did the encoding, and when in doubt, use the component pair — it is the safe default for anything inside a URL.'] },
      { h: 'How to use this URL encoder', p: ['Paste the string, pick the function from the list, and read the result — output is live, so you can switch between functions to watch exactly what each one changes. Comparing the two encoders is the fastest way to learn which one your code needs: if the output still contains a slash or a colon after encodeURIComponent, something is wrong with the input; if encodeURI leaves your search terms untouched, you have encoded a whole URL where a component was required.', 'Decode mode validates as it goes. Malformed percent sequences — a lone percent sign, a percent followed by two non-hex digits, a truncated paste out of a log file or a support ticket — produce a clear message instead of an exception, which is precisely when you need to know whether the string is damaged or merely encoded twice. Empty the box and the tool says what it needs rather than leaving a stale result on screen.'] },
      { h: 'Common mistakes', p: ['The most common error is double encoding. Paste an already-encoded string into encode mode and a percent sign becomes “%25”: the value decodes back to text that is still encoded, and the second round-trip surprises everyone downstream. Encode at the boundary where the value is assembled — usually your server or API layer — and decode exactly once, at the receiving end.', 'The second is encoding too much or too little. Encoding an entire URL with encodeURIComponent destroys the separators that make it a URL; encoding a parameter with encodeURI leaves characters like the ampersand, equals sign and hash inside the value, which silently truncates or rewrites it in the query string. When an arriving parameter looks mangled, the encoder is nearly always the culprit.', 'The third is assuming the plus sign always means space. Form submissions written by browsers use plus for space in query strings; percent-20 is the unambiguous encoding of a space and works in paths and programmatic encoders alike. Decoders that treat the two interchangeably corrupt credentials or filenames containing literal plus characters — decide which convention your system uses and hold to it everywhere.'] },
    ],
    faqs: [
      { q: 'Which function should I choose in this URL encoder?', a: 'Use encodeURIComponent for values (query parameters, path segments, form fields); use encodeURI for a complete URL whose structure must survive the trip.' },
      { q: 'Why does my URL show percent-2520 instead of percent-20?', a: 'The value was encoded twice: the percent sign of the first pass was encoded again. Decode once, or stop encoding a value that is already encoded.' },
      { q: 'Does this URL encoder protect or encrypt data?', a: 'No. URL encoding is a reversible text transformation for transport and offers no secrecy or integrity whatsoever.' },
      { q: 'Why do plus signs turn into spaces?', a: 'Browser form submissions use plus for space in query strings. Percent-20 is the unambiguous space encoding and is safe everywhere.' },
    ],
    html: `
${f.textarea('ue-text', 'URL, query string or text', 'https://example.com/search?q=hello world&lang=en', 6)}
${f.select('ue-mode', 'Function', [
      { v: 'encodeURIComponent', l: 'encodeURIComponent — a component / query value' },
      { v: 'encodeURI', l: 'encodeURI — a full URL' },
      { v: 'decodeURIComponent', l: 'decodeURIComponent — decode a component' },
      { v: 'decodeURI', l: 'decodeURI — decode a full URL' },
    ])}
${outputBlock('ue-out', 'Result')}`,
  },

  // ---------------------------------------------------------- 6
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    cat: 'web',
    icon: '🆔',
    card: 'Bulk random v4 UUIDs from your browser’s cryptographic randomness.',
    usedFor: 'for ticket ids, seeds and test data',
    keywords: 'uuid generator v4 random guid generator online bulk unique id',
    focus: 'uuid generator',
    h1: 'Free UUID Generator — No Signup, No Limits',
    metaTitle: 'Free UUID Generator — Random v4 GUIDs, Bulk Up to 100',
    metaDesc: 'This UUID generator creates random v4 IDs in batches of 1–100 with cryptographic randomness and an uppercase option. Generate them free in your browser.',
    intro: 'This UUID generator creates v4 identifiers in your browser with cryptographic randomness, bulk counts and an uppercase option for databases and spreadsheets.',
    sections: [
      { h: 'What this UUID generator creates', p: ['A UUID — universally unique identifier — is a 128-bit label written as five groups of hexadecimal, for example 1f9c3a6e-4b2d-4f8a-9c31-7e5d2b0a8f44. The version generated here is v4: a handful of bits are fixed to mark the version and variant, and everything else comes from your browser’s cryptographically secure random source. The chance of two v4 UUIDs colliding is remote enough that you can treat identifiers as unique without coordinating issuance — no central counter, no sequence table, no idempotency check.', 'They are a default primary key for a reason: identifiers generated on the client cannot be guessed or enumerated the way sequential ids can, and two offline systems can merge without conflicts. You will meet them as database ids, record identifiers in APIs, upload filenames, session and request ids in logs, and the client-generated keys that sync engines rely on when a disconnected device rejoins.'] },
      { h: 'How to use this UUID generator', p: ['Set the count between 1 and 100, tick “UPPERCASE” if your destination stores uppercase ids — legacy systems and spreadsheet columns sometimes do — and the list appears immediately, ready for the Copy button. Change the count and the list resizes live; press Generate new batch for a fresh set without touching anything else, which is handy when you are testing idempotency or need a second set for fixture files.', 'Pick the count from the job: one per row you are about to insert, a handful for test fixtures, a few dozen for sample data. Keep the values you have used in a text file or seed script rather than re-rolling them later — a UUID that has appeared in production data must stay the one your test expected, and quietly regenerating fixtures invalidates every assertion that referenced a specific id.'] },
      { h: 'Common mistakes', p: ['The first mistake is treating a UUID as a secret. v4 values are random, not encrypted: anyone who sees one holds the whole value, so a UUID identifies a record but never authorises access to it. Access control belongs in your session and permission layers, not in the URL.', 'The second is assuming all UUIDs are interchangeable. v1 and v7 embed timestamps — v7 sorts in creation order, which is why newer databases prefer it for index locality — and systems that parse the version bits will reject v4 where v7 was expected. This tool generates v4, the safe default for random identifiers; check which version your schema requires before you commit.', 'The third is ignoring write patterns on very large tables. Fully random keys scatter inserts across index pages, which costs more than sequential keys at scale. For application-level identifiers, API records and client-generated ids that trade-off is irrelevant; for the clustered key of a billion-row table it may not be. The randomness that protects you in an API can punish you in an index.'] },
    ],
    faqs: [
      { q: 'Are the IDs from this UUID generator really random?', a: 'Yes — this UUID generator uses crypto.randomUUID where supported, otherwise crypto.getRandomValues with the v4 bits applied. Cryptographically secure, not a seeded pseudo-random generator.' },
      { q: 'Is a UUID secret or safe to expose in a URL?', a: 'It is unique, not secret. Anyone holding it can see the whole value, so never treat possession of a UUID as proof of permission.' },
      { q: 'What is the difference between v4 and v7 UUIDs?', a: 'v4 is fully random; v7 embeds a timestamp so new values sort in creation order. This tool generates v4 — the default for random ids.' },
      { q: 'Can two UUIDs from this generator collide?', a: 'The theoretical probability over 122 random bits is negligible. Keep a unique constraint in the database anyway as a safety net; this UUID generator does not coordinate across systems.' },
    ],
    html: `
<div class="field-row">
${f.number('uu-count', 'How many UUIDs (1–100)', '5', '1', '100')}
${f.check('uu-upper', 'UPPERCASE')}
</div>
<div class="btn-row"><button type="button" class="btn" id="uu-gen">Generate new batch</button></div>
${outputBlock('uu-out', 'UUIDs')}
${note('Generated on your device with cryptographic randomness — nothing is sent anywhere.')}`,
  },

  // ---------------------------------------------------------- 7
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    cat: 'web',
    icon: '🎫',
    card: 'Read any JWT’s header and payload, with human-readable dates.',
    usedFor: 'for debugging auth tokens',
    keywords: 'jwt decoder decode json web token header payload exp algorithm',
    focus: 'jwt decoder',
    h1: 'Free JWT Decoder — No Signup, No Limits',
    metaTitle: 'Free JWT Decoder — Read Header, Payload & Expiry',
    metaDesc: 'JWT decoder for JSON Web Token headers, claims, issued-at and expiry dates. Read decoded values instantly; signature verification is not performed. Free.',
    intro: 'This JWT decoder shows a token’s header and payload as formatted JSON, with the algorithm, issue time and expiry translated into human-readable dates.',
    sections: [
      { h: 'What a JWT decoder can show', p: ['A JSON Web Token is three base64url-encoded parts joined by dots: a header naming the algorithm, a payload of claims, and a signature over both. Decode the first two and you have the token’s full self-description — subject, issuer, audience, issued-at and expiry — written in plain JSON. That is the point of the structure: any party can read what a token claims before deciding whether to verify it.', 'Base64url is Base64 in its URL-safe alphabet: hyphens and underscores instead of plus and slash, with the padding often omitted. Those characters are reversible in one step, which is why the payload is readable at a glance — and why putting anything sensitive in a JWT is a mistake. Claims are visible to everyone who touches the string, including browser history, proxy logs and referrer headers, so the payload is for routing and context, never for secrets.'] },
      { h: 'How to use this JWT decoder', p: ['Paste the token — with or without a Bearer prefix — and the header’s algorithm and type appear on the stats line, alongside issued-at and expiry translated from Unix seconds into readable UTC dates. The payload prints as formatted JSON below, ready to copy. Those dates matter more than anything else when you are debugging a login that fails at random: most expired-session bugs are a missing “exp”, a value generated in seconds where milliseconds were expected, or a token created in the wrong environment.', 'If the paste is not three parts, or the header or payload is not valid base64url JSON, the tool says exactly that instead of showing an empty box. If a claim is missing, it is simply not in the token — the decoder prints what is there and nothing more. Decoding happens entirely in your browser, so you can safely inspect a token copied out of a production log.'] },
      { h: 'Decoding is not verifying', p: ['The single most important point: this tool decodes, it does not verify. The signature is never checked, so a pasted token may have been edited by anyone — rewrite the payload, keep the old signature, and it still decodes beautifully. That is safe for reading claims and debugging; it is catastrophic if a decoded value is trusted as authentic. Verification belongs on the server, against the exact algorithm and key the issuer uses.', 'Two practical failures follow from confusing the two. Accepting whatever algorithm the token declares is the root of the classic algorithm-confusion attacks, where a service believes a header claiming “none”, or swaps RSA verification for HMAC with the wrong key material. Fix the expected algorithm on the server; never take it from the token alone.', 'The third error is trusting timestamps without a clock plan. Expiry compared against a skewed server clock logs users out early or leaves sessions alive longer than intended — keep servers synchronised and allow a small, deliberate leeway. And keep access tokens short-lived, minutes rather than days, backed by a refresh flow: an expired string can do only as much damage as its lifetime allows.'] },
    ],
    faqs: [
      { q: 'Is it safe to paste a JWT into this decoder?', a: 'This JWT decoder runs entirely in your browser and the token is never transmitted. Tokens still grant access while valid, so revoke any that leak.' },
      { q: 'Does this JWT decoder verify the signature?', a: 'No. It decodes the header and payload only; the signature is never checked. Verify server-side before trusting any decoded claim.' },
      { q: 'Why is the payload readable by anyone?', a: 'The payload is base64url-encoded JSON, not encrypted. Anyone holding the token can read it — never put secrets in JWT claims.' },
      { q: 'My token will not decode — why?', a: 'Usually a truncated paste (a token has three dot-separated parts), a leftover Bearer prefix, or a payload that is not valid base64url. The tool reports which case applies.' },
    ],
    html: `
${f.textarea('jwt-in', 'Paste your JWT (header.payload.signature)', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…', 4)}
<div class="stat-line" id="jwt-meta"></div>
${outputBlock('jwt-out', 'Decoded payload (JSON)')}
${note('Signature not verified — decode only. Never trust decoded claims as authentic without verifying the token server-side.')}`,
  },

  // ---------------------------------------------------------- 8
  {
    slug: 'user-agent-parser',
    name: 'User Agent Parser',
    cat: 'web',
    icon: '🕵️',
    card: 'Detect the current browser or inspect a user-agent from server logs.',
    usedFor: 'for reading log lines and bot traffic',
    keywords: 'user agent parser browser detection ua string check device type online',
    focus: 'user agent parser',
    h1: 'Free User Agent Parser — No Signup, No Limits',
    metaTitle: 'Free User Agent Parser — Browser, OS & Device Type',
    metaDesc: 'User agent parser: identify browser, version, engine, OS and device class from your current client string or a pasted log entry. Check it free online.',
    intro: 'This user agent parser shows how your current browser identifies itself, or reads a user-agent string from a server log to inspect another client.',
    sections: [
      { h: 'What a user-agent string tells you', p: ['A user-agent string is the browser’s self-introduction on every request: a compact narrative naming the browser and version, the rendering engine, and the operating system, plus device hints. Parsing it gives you three practical answers — which rendering engine will execute your CSS and JavaScript (the real compatibility question), which operating-system quirks apply, and whether the client is a phone, a tablet, a desktop or a crawler.', 'Device type is the fourth answer and the least precise: it is inferred from tokens like “Mobile” or “Tablet” and from the shape of the platform clause rather than read from an explicit field. Bots announce themselves honestly — Googlebot, Bingbot and their peers carry verifiable product tokens — so the same ordered table that separates phones from desktops also separates humans from crawlers, which is exactly what log analysis, analytics filters and conditional rendering need.'] },
      { h: 'How to use this user-agent parser', p: ['Your current browser string is analyzed on page load. To inspect a different client, paste its user-agent from a server log. The output lists browser and version, engine, operating system with version where the string carries one, device type, and the raw string underneath for anything the summary missed. Combinations the table does not recognise report “Unknown client” rather than a confident guess.', 'Treat it as a first pass. Paste a string from your server logs when a page renders oddly on one device, check what an old phone claims before writing a workaround, or confirm that your own browser is read the way you expect. The raw line is there deliberately: heuristics misread rare forks and regional browsers, so when the summary looks wrong, the original string is the arbiter — and the version numbers inside it are usually the clue that resolves the case.'] },
      { h: 'Where detection goes wrong', p: ['The core mistake is trusting the string as truth. It is a claim supplied by the client and trivially spoofable: pretending to be Googlebot takes one header, so tools that allowlist by user-agent alone hand privileged access to anyone who copies a token. Real crawler verification means reverse DNS or the crawler’s published IP ranges — parse the header for description, never for authentication.', 'The second mistake is over-fitting to it. Detection logic driven by user-agent strings grows into thousands of exceptions, breaks silently with every browser release, and now fights the platform’s direction: browsers are deliberately reducing the detail in these strings, replacing version precision with client hints that require extra requests. Feature detection — asking whether an API exists rather than which browser claims to be present — remains the durable approach. Use this parser to understand a log line or an anomaly, not to decide whether to load a script.', 'The third is reading device type as intent. A tablet is not necessarily a touch-first user, a desktop may be a narrow window, and “bot” covers both a search indexer and an uptime monitor. Treat the classification as context for analytics and layout hints, never as a substitute for responsive design that adapts to the actual viewport.'] },
    ],
    faqs: [
      { q: 'How accurate is this user-agent parser?', a: 'This user-agent parser is useful for browser and engine families, weaker for exact OS versions and device types — the string is a claim rather than a verified report. Use the raw output when precision matters.' },
      { q: 'Why does the user-agent parser sometimes report Chrome as Safari?', a: 'Most browsers include a Safari token, so an ordered table matches Chrome, Edge, Opera and friends before the generic Safari rule. This user-agent parser checks in that order.' },
      { q: 'Is user-agent data personal data?', a: 'It can be, under privacy rules, when combined with an identifier. Device and browser categories are usually fine; raw strings stored with user ids deserve a mention in your privacy policy.' },
      { q: 'Should I detect features using the user-agent?', a: 'Prefer feature detection — does this API exist? User-agent detection rots with every release and browsers are actively reducing the information these strings carry.' },
    ],
    html: `
${f.textarea('ua-text', 'User-agent string', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 4)}
<div class="btn-row"><button type="button" class="btn btn-secondary" id="ua-mine">Use my browser’s UA</button></div>
${outputBlock('ua-out', 'Parsed user agent')}`,
  },

  // ---------------------------------------------------------- 9
  {
    slug: 'ics-calendar-generator',
    name: 'ICS Calendar Generator',
    cat: 'web',
    icon: '📅',
    card: 'Build a valid .ics event file — timed or all-day — with one download.',
    usedFor: 'for event invites and booking links',
    keywords: 'ics generator ics file create calendar event ical download google outlook',
    focus: 'ics file generator',
    h1: 'Free ICS File Generator — No Signup, No Limits',
    metaTitle: 'Free ICS File Generator — Create & Download .ics',
    metaDesc: 'ICS file generator: create an iCalendar 2.0 event with all-day or timed dates, UTC or floating times and escaped fields. Download a valid .ics file free.',
    intro: 'This ICS file generator creates a standards-compliant .ics event — correctly escaped, CRLF-terminated and ready to import into any calendar app.',
    sections: [
      { h: 'What this ICS file generator creates', p: ['An .ics file is the calendar world’s common tongue: a plain-text format, iCalendar, that Apple Calendar, Google Calendar, Outlook, Thunderbird and every mobile calendar import without conversion. Because it is text, it travels anywhere — attach it to an email, link it from a registration page, hand it to a webhook, or commit it to a repository as a release schedule. The file built here holds one event: a unique identifier, a timestamp of when the file was created, start and end values, then the human details — title, description and location.', 'The format is strict in small ways that break sloppy generators. Lines are separated by carriage-return line-feed pairs rather than bare newlines; values must escape commas, semicolons, backslashes and line breaks so a description does not get read as new fields; and dates follow fixed patterns — eight-digit dates for all-day values, compact date-times for timed ones. Get those details right and imports are boring, which is the highest compliment a calendar file can earn.'] },
      { h: 'How to use this ICS file generator', p: ['Fill in the title, then location and description if the event has them. Leave “All-day event” ticked for a day or multi-day event, or untick it and set 24-hour start and end times. For timed events, choose local-floating time to preserve the entered wall-clock time in each importer’s configured zone, or UTC when the entered values are already UTC. Pick both dates, then download or copy the generated .ics file.', 'All-day events treat the end date as the last day of the event: enter the same date twice for a single day, or the 15th to the 17th for a three-day event. Timed events can cross midnight when the end date is later than the start date. The generator validates that a same-day event has a positive duration.'] },
      { h: 'Details that catch people', p: ['Local-floating times have no offset or trailing “Z”; every calendar interprets them in the user’s configured timezone. UTC times end with “Z” and represent the same instant for every user, but you must enter UTC clock values yourself. The tool does not convert from a named timezone or apply daylight-saving rules. For a location-specific meeting, convert the local time to UTC before choosing UTC, or use local-floating mode.', 'The UID keeps an imported event identifiable when the same file is imported again, while DTSTAMP records when the file was built. Escaped descriptions preserve commas, semicolons, backslashes and line breaks as text instead of turning them into new properties. The ICS file generator emits VERSION:2.0 and CALSCALE:GREGORIAN with valid VCALENDAR and VEVENT boundaries. Each line ends with CRLF; import the file into your target app to confirm how that calendar handles optional properties.'] },
    ],
    faqs: [
      { q: 'Which calendars can import an .ics file?', a: 'Google Calendar, Apple Calendar, Outlook.com and desktop Outlook, Thunderbird, Samsung Calendar and anything else that reads iCalendar. This ICS file generator makes one event per file; use Import in the app or just open it.' },
      { q: 'Is the end date inclusive in this ICS file generator?', a: 'Yes here: you enter the last day of the event, and the ICS file generator writes the next-day value that the iCalendar specification uses to close the range.' },
      { q: 'How do I make the event show at the same instant worldwide?', a: 'Choose UTC and enter UTC clock values; the generated date-time ends in Z. The tool does not convert a named timezone or apply daylight-saving rules. Local-floating mode instead follows each calendar user’s configured timezone.' },
      { q: 'Can one file hold several events?', a: 'This tool builds one event per file. The format supports many VEVENT blocks inside one VCALENDAR — add another block for batch use.' },
    ],
    html: `
${f.text('ics-title', 'Event title *', 'Weekly team sync')}
<div class="field-row">
${f.text('ics-loc', 'Location (optional)', 'Conference Room B')}
${f.check('ics-allday', 'All-day event')}
</div>
<div class="field-row">
${f.date('ics-sdate', 'Start date *')}
${f.text('ics-stime', 'Start time (24h)', '14:00', '14:00', 'time')}
</div>
<div class="field-row">
${f.date('ics-edate', 'End date *')}
${f.text('ics-etime', 'End time (24h)', '15:00', '15:00', 'time')}
</div>
${f.select('ics-tz', 'Time interpretation (timed events)', [{ v: 'floating', l: 'Local floating time — each calendar uses its configured zone' }, { v: 'utc', l: 'UTC — enter UTC clock values' }])}
${f.textarea('ics-desc', 'Description (optional)', 'Agenda, dial-in link, notes…', 4)}
<p class="tool-note" id="ics-note">Fill in the details to generate the .ics file.</p>
${outputBlock('ics-out', 'event.ics')}
<div class="btn-row"><button type="button" class="btn" data-download="#ics-out|event.ics">Download event.ics</button></div>`,
  },

  // ---------------------------------------------------------- 10
  {
    slug: 'image-compressor',
    name: 'Image Compressor & Optimizer',
    cat: 'web',
    icon: '🖼️',
    card: 'Resize, compress and convert images for websites, with before-and-after file sizes.',
    keywords: 'image compressor optimize images online webp converter image resizer reduce image size',
    focus: 'image compressor',
    usedFor: 'for shrinking website images and converting them to WebP, JPEG or PNG',
    updated: '2026-10-22',
    h1: 'Free Image Compressor & Optimizer — No Signup',
    metaTitle: 'Free Image Compressor & Optimizer — WebP, JPG, PNG',
    metaDesc: 'Compress and resize images in your browser with this free image compressor — convert JPG, PNG and WebP, and compare file sizes before downloading.',
    intro: 'Use this image compressor to resize and re-encode common image files for web pages, compare the actual file sizes, then download each optimized copy.',
    sections: [
      { h: 'What this image compressor changes', p: ['This image compressor reads JPEG, PNG, WebP and AVIF files your browser can decode, then exports WebP, JPEG or PNG. WebP and JPEG use a quality setting that trades detail for size. PNG uses lossless encoding, so the quality slider does not apply. Results show the original and output sizes, pixel dimensions and size difference; some already-optimized files may grow instead of shrink.', 'Set a maximum width to resize large images without changing their proportions. The default is 2400 pixels; clear the field to skip width resizing. An 8000-pixel maximum-side safety cap still applies, and images are never enlarged. JPEG has no transparency, so transparent areas become white. WebP and PNG can retain transparency.'] },
      { h: 'How to use the image compressor', p: ['Choose or drop up to ten images (50 MB total), select an output format, adjust quality for JPEG or WebP, and set a maximum width if needed. Select Optimize images to process files one at a time. Each result shows the original and exported sizes and dimensions, whether it became smaller or larger, and a download link. The original files on your device are not changed.', 'Use WebP for compact web images when your site supports it, JPEG for photographs when compatibility matters, or PNG for lossless output and transparency. Lower quality may reduce file size but can introduce visible artifacts. Start near the default, inspect the preview at its intended display size, and raise quality if detail suffers.'] },
      { h: 'Privacy and image metadata', p: ['Image decoding, resizing and encoding happen in your browser using local file and canvas APIs. This tool does not send image bytes to our server, and it needs no account. Results use temporary browser download links. Batches are limited to ten files and 50 MB total, then processed sequentially to reduce memory use. Very large files may take longer on older phones or computers.', 'Re-encoding may remove EXIF details such as camera, location and timestamp data, or alter color profiles. That can help avoid sharing metadata, but may remove information your workflow needs. Keep the original when metadata matters. Browser support varies, so an accepted AVIF or other image may still fail if the browser cannot decode it.'] },
      { h: 'Image size is only one part of page speed', p: ['Smaller image downloads can reduce transfer size, particularly for large hero images and galleries. They do not guarantee a faster page or better rankings: displayed dimensions, caching, network, scripts and server response also matter. Optimize the actual assets, then check the live page on mobile and measure its performance.', 'Keep enough quality for the job. Text in screenshots and diagrams needs crisp edges; photos may need a higher setting; transparent graphics need PNG or WebP. Compare file size and appearance, and keep the original if the export is larger or visibly worse. Pair image work with the Web Crawler Audit or SEO Score Checker for a broader page review.'] },
    ],
    faqs: [
      { q: 'Are my files uploaded when I use this image compressor?', a: 'No. Image decoding and compression run in your browser. The tool does not send the selected image bytes to our server.' },
      { q: 'Which image formats can this image compressor export?', a: 'Choose WebP, JPEG or PNG. The browser must support decoding the source format; AVIF input support varies by browser.' },
      { q: 'Why did the image compressor make my file larger?', a: 'Some images are already optimized or do not suit the selected format. Try another output format or quality, compare the reported sizes, and keep the original if it is smaller.' },
      { q: 'Does the image compressor preserve transparency and EXIF data?', a: 'WebP and PNG can preserve transparency; JPEG fills transparent areas with white. Re-encoding may remove EXIF metadata, so keep the original if those details matter.' },
    ],
    html: `
<div class="img-compressor">
  <button type="button" class="img-drop" id="ic-drop" aria-controls="ic-files">
    <span class="img-drop-icon" aria-hidden="true">＋</span>
    <strong>Choose images or drop them here</strong>
    <span>JPEG, PNG, WebP or AVIF · up to 10 files · 20 MB each · 50 MB total</span>
  </button>
  <input id="ic-files" class="img-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple aria-label="Choose images to compress">
  <p class="tool-note" id="ic-selection" aria-live="polite">Your files stay in this browser. Select images to begin.</p>
  <div class="img-controls">
    <div class="field">
      <label for="ic-format">Output format</label>
      <select id="ic-format">
        <option value="image/webp" selected>WebP — smaller web images</option>
        <option value="image/jpeg">JPEG — broad photo compatibility</option>
        <option value="image/png">PNG — lossless, supports transparency</option>
      </select>
    </div>
    <div class="field">
      <label for="ic-quality">Quality: <strong id="ic-quality-value">82%</strong></label>
      <input id="ic-quality" type="range" min="30" max="95" value="82" step="1">
      <span class="field-hint" id="ic-quality-hint">Used for WebP and JPEG; PNG ignores this setting.</span>
    </div>
    <div class="field">
      <label for="ic-width">Maximum width (pixels)</label>
      <input id="ic-width" type="number" min="1" max="8000" value="2400" inputmode="numeric">
      <span class="field-hint">Optional: clear to skip width resizing. An 8,000px max-side safety cap still applies.</span>
    </div>
  </div>
  <div class="btn-row">
    <button type="button" class="btn" id="ic-optimize" disabled>Optimize images</button>
    <button type="button" class="btn btn-secondary" id="ic-clear" disabled>Clear selection</button>
  </div>
  <p class="stat-line" id="ic-note" role="status" aria-live="polite">Select images to start.</p>
  <div class="img-summary" id="ic-summary" aria-live="polite"></div>
  <div class="img-results" id="ic-results" aria-label="Optimized image results"></div>
  ${note('Re-encoding may remove EXIF metadata. Keep the originals and check each download before replacing a live asset.')}
</div>`,
  },

  // ---------------------------------------------------------- JSON validator
  {
    slug: 'json-validator',
    name: 'JSON Validator & Formatter',
    cat: 'web',
    icon: '{ }',
    card: 'Validate, beautify and minify JSON with line-accurate errors — nothing leaves your browser.',
    usedFor: 'for API responses and config files',
    updated: '2026-10-23',
    keywords: 'json validator formatter beautify minify format json online check',
    focus: 'json validator',
    h1: 'Free JSON Validator & Formatter — Beautify, Minify, Check',
    metaTitle: 'Free JSON Validator & Formatter — Beautify & Minify',
    metaDesc: 'Paste any JSON to validate, beautify and minify it with this free JSON validator — line-and-column errors, structure counts, no upload. Runs in your browser.',
    intro: 'Paste JSON into this free JSON validator to check syntax, see the exact error position, and switch between a formatted and minified copy — parsed entirely in your browser.',
    sections: [
      { h: 'What this JSON validator checks', p: ['A JSON document is a tree of six value types — objects, arrays, strings, numbers, booleans and null — written with strict syntax: double quotes around every key and string, no trailing commas, no comments. This validator parses the document with the same JSON.parse engine your browser and every modern runtime use, so what passes here loads in JavaScript, Python, Go, PHP and virtually every API client without a surprise. When the syntax breaks, the engine reports a character position; the tool converts that into a line and column so you can find the broken spot in a file of ten thousand lines.', 'Alongside the verdict, the validator counts objects, arrays and primitives and reports the nesting depth — useful context when a response is larger or deeper than you expected. A valid result means well-formed JSON; it does not mean the shape matches your schema. Field names, types and required keys are still your contract to check against the API documentation, and this tool stays honest about that boundary rather than pretending a syntax pass is a full validation.'] },
      { h: 'How to use this JSON validator', p: ['Paste the document — an API response, a config file, a webhook payload, a package manifest — into the box. The parse runs as you type, so there is nothing to press; the formatted version appears immediately when the syntax is valid. Use Format for the indented, human-readable copy and Minify for the compact one you send over the wire; the Copy button takes whichever is on screen. When the syntax is wrong, the status line shows the browser’s message and the exact line and column, and the output clears so a half-parsed document never gets copied by accident.', 'Because everything runs in this browser tab, confidential payloads — client data, development tokens, unpublished configs — stay on your machine. The tool also accepts top-level arrays and bare scalars, which some formatters reject: a plain true or a list of objects at the root is valid JSON and validates here. Empty input simply asks for JSON; the tool never invents content or silently repairs a broken document.'] },
      { h: 'Common JSON mistakes this tool catches', p: ['The classics, in the order they usually appear: a trailing comma after the last array element or object member — legal in JavaScript literals, fatal in JSON; single quotes or unquoted keys, borrowed from JavaScript or YAML habits; comments, which JSON does not support at all; and NaN or Infinity, values JavaScript can print but JSON cannot represent. Each one produces a parse error, and the first error you fix usually reveals the next, so work from the top of the file down.', 'Then the quieter problems. Very large integers lose precision when a JavaScript client reads them — write long ids as strings instead of numbers. Duplicate keys parse without complaint while keeping only the last value, silently dropping data your template meant to send. And a file pasted from a terminal can carry an invisible character at the very start: if a document that looks perfect reports an error at line one, column one, retype the first character. Formatting afterwards is the second check — a structure you can read is a structure you can review.'] },
    ],
    faqs: [
      { q: 'Is this JSON validator free to use?', a: 'Yes — this JSON validator is free with no signup and no limits. Parsing happens in your browser, so pasted data is never sent to a server.' },
      { q: 'Where is my JSON data sent when I paste it?', a: 'Nowhere. This validator uses your browser’s built-in JSON.parse; there is no upload, no server round trip and no storage of the document.' },
      { q: 'Why does JSON.parse report a position instead of a line?', a: 'Browsers report the character offset. This validator converts it into a line and column so you can jump straight to the problem in a large file.' },
      { q: 'What is the difference between formatted and minified JSON?', a: 'Both carry identical data. Formatting adds indentation and line breaks for people; minifying strips whitespace to shrink payloads for transfer.' },
    ],
    html: `
${f.textarea('jv-in', 'JSON document', '{ "name": "tools4market", "tools": [1, 2, 3], "free": true }', 9)}
<div class="btn-row">
  <button type="button" class="btn" data-jv="pretty">Format</button>
  <button type="button" class="btn btn-secondary" data-jv="minify">Minify</button>
</div>
<p class="tool-note" id="jv-note"></p>
<p class="tool-note" id="jv-stats"></p>
${outputBlock('jv-out', 'Formatted JSON')}
${note('Parsed in this browser with JSON.parse — your document is never uploaded.')}`,
  },

  // ---------------------------------------------------------- Timestamp Converter
    {
      slug: 'timestamp-converter',
      name: 'Timestamp Converter',
      cat: 'web',
      icon: '🕐',
      card: 'Convert Unix timestamps to human dates and vice versa, with timezone support.',
      usedFor: 'for debugging logs and API timestamps',
      updated: '2026-10-23',
      keywords: 'timestamp converter unix epoch date time conversion timezone',
      focus: 'timestamp converter',
      h1: 'Free Timestamp Converter — Unix to Human Date',
      metaTitle: 'Free Timestamp Converter — Unix Epoch & Human Date',
      metaDesc: 'Free timestamp converter converts Unix timestamps to human-readable dates and vice versa. Supports UTC, local time, timezone conversion and epoch formats.',
      intro: 'This timestamp converter converts Unix timestamps to human-readable dates and dates back to timestamps, with timezone support for UTC and local time.',
      sections: [
        { h: 'What Unix timestamps represent', p: ['A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970, 00:00:00 UTC. It is a simple integer that represents a specific moment in time, making it easy to store, compare and transmit across different systems and programming languages. Most programming languages can convert between timestamps and dates, but the formats and conventions vary. This timestamp converter provides a quick reference without needing to write code. Unix timestamps are the standard way computers track time, used extensively in APIs, databases, log files and system programming. The epoch timestamp is consistent across all timezones since it is always measured from UTC, not local time. Understanding timestamps is essential for debugging API issues, parsing log files and working with databases that store time as epoch values.'] },
        { h: 'How to use this timestamp converter', p: ['Enter either a Unix timestamp (seconds or milliseconds) or a human-readable date to convert. The tool automatically detects the input format and shows the converted value in multiple formats including UTC, local time, ISO 8601 and relative time. Timezone support includes UTC and your local browser timezone. Copy the converted value for use in APIs, databases, logs or documentation. The timestamp converter handles both seconds and milliseconds automatically, so you do not need to specify which format you are using. This makes debugging log timestamps much faster. The converter also shows the date in multiple formats simultaneously, so you can copy the exact representation you need for your specific use case whether it is for logging, database storage or API documentation.'] },
        { h: 'Common timestamp formats explained', p: ['Unix timestamps are typically in seconds (10 digits) or milliseconds (13 digits). Some systems use microseconds (16 digits). Most modern APIs and databases use millisecond timestamps because they offer better precision. JavaScript uses milliseconds, while Unix commands and many server-side languages use seconds. When converting, the timestamp converter normalizes the input and provides consistent output formats across all representations. If your timestamp does not convert to the expected date, check whether it is in seconds or milliseconds. The converter also handles negative timestamps for dates before 1970, which some systems use for historical dates. Understanding the difference between seconds and milliseconds is crucial when working with timestamps from different systems and programming languages.'] },
        { h: 'Timestamp conversion for development', p: ['Developers use this timestamp converter frequently when debugging API issues, reading log files, testing webhooks and troubleshooting database queries. Many programming frameworks return timestamps in different formats, and converting between them manually is error-prone. The timestamp converter eliminates this error by performing the conversion instantly and accurately. Timezone handling is built in, so you can see how the same moment appears in UTC versus your local time. This is essential when debugging issues that only appear in certain timezones or when coordinating with distributed teams across regions. Every line of the output is copy-ready, so a timestamp from a log file can be converted and pasted into a ticket, a query or a note without reformatting by hand.'] },
      ],
      faqs: [
        { q: 'What is the Unix epoch?', a: 'The Unix epoch is January 1, 1970, 00:00:00 UTC. Unix timestamps count seconds (or milliseconds) from this reference point.' },
        { q: 'Should I use seconds or milliseconds for timestamps?', a: 'Most modern APIs and JavaScript use milliseconds (13 digits). Unix commands and many server-side languages use seconds (10 digits). Check your system requirements.' },
        { q: 'Does this tool handle timezones?', a: 'Yes. The converter shows both UTC and your local timezone. Timestamps are inherently UTC; timezones affect how they display.' },
        { q: 'Can I convert dates in the past or future?', a: 'Yes. Enter any valid date and the converter will show the corresponding Unix timestamp, including dates before 1970 (negative timestamps).' },
      ],
      html: `
  ${f.number('ts-timestamp', 'Unix timestamp (seconds or milliseconds)', '1730000000')}
  ${f.text('ts-date', 'Human date (your local time, to the minute)', '', '', 'datetime-local')}
  <div class="btn-row">
    <button type="button" class="btn" id="ts-conv">Convert</button>
    <button type="button" class="btn btn-secondary" id="ts-clear">Clear</button>
  </div>
  ${outputBlock('ts-out', 'Converted values')}`,
    },
  
    // ---------------------------------------------------------- IP Converter
    {
      slug: 'ip-converter',
      name: 'IP Address Converter',
      cat: 'web',
      icon: '🌐',
      card: 'Convert IPv4 addresses between dotted-decimal, hexadecimal and integer formats.',
      usedFor: 'for network programming and database storage',
      updated: '2026-10-23',
      keywords: 'ip address converter ipv4 hex decimal integer format',
      focus: 'ip address converter',
      h1: 'Free IP Address Converter — IPv4 Format Converter',
      metaTitle: 'Free IP Address Converter — IPv4 Hex, Decimal & Binary',
      metaDesc: 'Free IP address converter converts IPv4 addresses between dotted-decimal, hexadecimal, integer and binary formats for network programming.',
      intro: 'This IP address converter translates IPv4 addresses between dotted-decimal notation, hexadecimal, decimal integer and binary formats commonly used in databases and network programming.',
      sections: [
        { h: 'Why use an IP address converter', p: ['IPv4 addresses are 32-bit numbers, but they are commonly displayed in dotted-decimal notation (192.168.1.1) for human readability. Different systems and databases store IPs in different formats: some use the raw integer, others use hexadecimal, and some use binary strings. Converting between these IP address formats is essential when importing data, writing network code or debugging database queries. Programmers often store IP addresses as integers for faster comparison and smaller storage. Network utilities may display addresses in hex. This IP address converter provides quick conversions without writing code. Understanding IP address formats is fundamental for network programming, database administration and troubleshooting connectivity issues across different systems and platforms.'] },
        { h: 'How to use this IP address converter', p: ['Enter an IPv4 address in any supported format (dotted-decimal, hex, decimal or binary) and the IP address converter will translate it to all other formats. Copy the format you need for your specific use case. The IP address converter validates input and shows errors for invalid addresses. It handles leading zeros, uppercase/lowercase hex and various spacing conventions. This makes the IP address converter useful for debugging logs, testing network code and converting database values. The converter supports all standard IPv4 formats including the dotted-decimal notation everyone recognizes, the hexadecimal format common in network debugging, the decimal integer format databases use for efficient indexing, and the binary format for low-level programming and bitwise operations.'] },
        { h: 'IP address format reference', p: ['Dotted-decimal: 192.168.1.1 — four octets separated by dots, the standard human-readable IP address format. Hexadecimal: 0xC0A80101 or C0A80101 — each octet as two hex digits, used in network debugging and low-level programming. Decimal: 3232235777 — the raw 32-bit unsigned integer, the compact IP address format databases use for efficient indexing. Binary: 11000000.10101000.00000001.00000001 — each octet as 8 bits, showing the raw bits of the IP address. These IP address formats are all equivalent representations of the same 32-bit number. The IP address conversion is reversible and lossless between all formats. Understanding these formats helps when reading logs, debugging network issues or working with legacy systems that store IPs differently.'] },
        { h: 'IP address conversion in practice', p: ['When programming network features, you frequently need to convert between IP address formats. APIs may return integer IPs while your database stores hex. Log files might show binary while documentation uses dotted-decimal. This IP address converter eliminates manual conversion errors. Network programming often requires understanding how an IP address appears in different formats, especially when debugging routing issues or working with firewall rules that use hexadecimal notation. The IP address converter handles all standard IPv4 formats reliably. Database administrators use integer storage for faster queries, while network engineers prefer hex for debugging. This IP address converter bridges all these use cases by providing conversions in real time without any coding required.'] },
      ],
      faqs: [
        { q: 'What is the decimal format for an IP address?', a: 'The decimal IP address format is the raw 32-bit unsigned integer value. For example, 192.168.1.1 = 3232235777. This IP address converter shows you the exact decimal representation for any IP address you enter.' },
        { q: 'Can this IP address converter handle IPv6?', a: 'No, this IP address converter supports only IPv4 addresses. IPv6 addresses use a different 128-bit format and require a specialized converter. This tool focuses on the common IPv4 formats used in network programming.' },
        { q: 'How accurate is IP address conversion?', a: 'The IP address conversion is exact and reversible. IPv4 addresses are 32-bit numbers, so conversion between dotted-decimal, hex, decimal and binary preserves all information without any loss.' },
        { q: 'Why use different IP address formats?', a: 'Decimal/integer IP address formats are compact for database storage. Hex is common in network debugging tools. Dotted-decimal is the human-readable IP address format everyone recognizes. Binary shows the raw bits for low-level programming. Use this IP address converter to get the format you need.' },
      ],
      html: `
  ${f.text('ip-input', 'Enter IP address (any format)', '192.168.1.1')}
  <p class="tool-note">Accepts dotted-decimal, hex (0x...), decimal, or binary.</p>
  <button type="button" class="btn" id="ip-conv">Convert</button>
  ${outputBlock('ip-out', 'Converted IP address')}`,
    },
  ];

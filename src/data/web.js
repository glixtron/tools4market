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
    h1: '.htaccess Redirect Generator — 301, 302 and www rules',
    metaTitle: '.htaccess Redirect Generator: Free 301 Redirect Maker (2026)',
    metaDesc: 'Htaccess redirect generator: create .htaccess rules online for free. 301 redirects, HTTP→HTTPS, www→non-www, and domain moves. Copy-paste ready Apache rules.',
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
    h1: 'Free XML Sitemap Generator — from a list of URLs',
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
      { q: 'Sitemap.xml or sitemap-news.xml?', a: 'sitemap.xml lists every URL you want indexed. sitemap-news.xml is a Google News format for articles published in the last 48 hours; it only does anything for sites already accepted into Google News. Most sites need the plain sitemap and nothing else.' },
      { q: 'How often should the sitemap be updated?', a: 'On every publish, and on every unpublish — a dead URL left in the sitemap is a quality signal against you. If your build generates it, this is automatic; on a static site, regenerate and redeploy the file whenever the URL set changes.' },
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
    h1: 'Sitemap Validator — check sitemap.xml before you submit',
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
    h1: 'Password Generator — strong passwords, made in this tab',
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
      { q: 'Should I use a password manager?', a: 'Yes — generate here, store there. A manager removes the reason people reuse passwords, and reuse is what turns one breach into twenty. Generate a unique password per account and let the manager remember it.' },
      { q: 'How often should I change a password?', a: 'Only when there is a reason: a breach, a shared account, or a device you no longer control. Routine rotation every 90 days is outdated advice — it produces weaker, memorised variations and no measurable security gain.' },
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
  <input type="text" id="pw-out" class="pw-out" readonly aria-live="polite">
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
    h1: 'Base64 Encoder and Decoder — text in, text out',
    metaTitle: 'Free Base64 Encoder Decoder — UTF-8 Safe, URL-Safe',
    metaDesc: 'Base64 encoder for UTF-8 text, emoji and URL-safe tokens. Decode invalid input with clear errors, then copy or edit results online. Free, no signup.',
    intro: 'This Base64 encoder converts UTF-8 text, emoji and accents to Base64, or decodes values back to readable text with a URL-safe option for tokens.',
    sections: [
      { h: 'What the Base64 encoder does (and does not)', p: ['Base64 turns binary bytes into an alphabet of sixty-four printable characters plus padding, so data that must survive text-only channels — JSON bodies, email attachments, data URLs, configuration files — travels without being mangled on the way. It is an encoding, not a protection: anyone holding the string decodes it in a single step, and the result runs about a third larger than the original. Base64 exists to make bytes safe for transport, never to make them private.', 'There are dialects. Standard Base64 uses the plus and slash characters, which collide with query strings and filenames; URL-safe Base64 swaps them for hyphen and underscore and usually drops the equals-sign padding. JSON Web Tokens, S3 signing keys and many web APIs expect the URL-safe form. This tool handles both: the checkbox switches the alphabet when encoding and normalises it again when decoding, so a token pasted out of a URL decodes exactly like one copied from a log.'] },
      { h: 'How to use this Base64 encoder', p: ['Choose Encode or Decode and read the result, which recalculates as you edit. Encoding accepts anything you can paste: accents, emoji and non-Latin scripts are converted to UTF-8 bytes first and then to Base64, so “café” and “日本” round-trip back to the same characters. Decoding validates the alphabet before it touches the data, so a truncated or corrupted paste produces a clear message rather than an exception or a screen of noise.', 'Turn on URL-safe when the destination is a filename, a URL segment, a signed link or a JWT; leave it off for data URLs, MIME parts and anything written by a standard that says standard Base64. If decode output reports invalid UTF-8, the underlying bytes were never text — you are looking at an image, an archive or another binary, which Base64 can carry perfectly well but which this box cannot display as characters.'] },
      { h: 'Common mistakes', p: ['The classic mistake is treating Base64 as encryption or as a checksum. It is neither: a shared key encoded in Base64 is a shared key in disguise, and integrity needs a hash or a signature over the payload. Never place credentials, personal data or tokens in Base64-encoded query parameters expecting them to stay hidden — the encoding is trivially reversible, and the string still lands in server logs, browser history and referrer headers.', 'The second is mixing dialects. Pasting standard Base64 into a system that expects URL-safe input — or the reverse — fails on the plus and slash characters, or on padding the receiver will not tolerate. If decoding fails on a string your own encoder produced, check the alphabet and the padding first rather than hunting for corruption.', 'The third is decoding on behalf of binary formats. Base64 will happily encode a PNG, an audio clip or a zip archive, but decoding those bytes as UTF-8 text tells you nothing useful about the file. Keep binary payloads as bytes in your code and reserve this tool for text and for inspecting what a token actually carries.'] },
    ],
    faqs: [
      { q: 'Does this Base64 encoder encrypt data?', a: 'No. It is an encoding that makes bytes text-safe and is fully reversible by anyone. Use real encryption if you need confidentiality.' },
      { q: 'Why is the encoded text about a third longer?', a: 'Every three bytes become four characters (plus occasional padding), so output is roughly four-thirds the size of the input.' },
      { q: 'Can this Base64 encoder handle URL-safe values?', a: 'Yes. It uses hyphen and underscore in place of plus and slash, with optional padding, for JWTs, filenames and signed URLs.' },
      { q: 'What is Base64 actually used for?', a: 'Transport, not security: data URLs that inline an image in CSS, email attachments, binary blobs inside JSON, HTTP Basic auth headers, and JWT segments. In every case the point is to survive a text-only channel intact.' },
      { q: 'Why does Base64 end with equals signs?', a: 'Padding. Base64 works in three-byte groups that become four characters; when the input does not divide evenly, one or two “=” fill the gap so the length stays a multiple of four. URL-safe variants often drop the padding and let the decoder infer it.' },
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
    h1: 'URL Encoder — percent-encode a link and decode it back',
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
      { q: 'What does URL encoding actually do?', a: 'It rewrites characters a URL cannot carry literally — spaces, non-ASCII letters, emoji and the reserved characters used as data — as a percent sign plus two hex digits, so the string survives transport intact.' },
      { q: 'Why does my URL break at an ampersand or equals sign?', a: 'Those are separators. A value containing a literal & or = must be encoded as %26 or %3D first — otherwise the parser reads it as the end of your parameter and the rest of the value becomes a new key.' },
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
    h1: 'UUID Generator — v4 strings, one or a whole batch',
    metaTitle: 'Free UUID Generator — Random v4 GUIDs, Bulk Up to 100',
    metaDesc: 'This UUID generator creates random v4 IDs in batches of 1–100 with cryptographic randomness and an uppercase option. Generate them free in your browser.',
    intro: 'This UUID generator creates v4 identifiers in your browser with cryptographic randomness, bulk counts and an uppercase option for databases and spreadsheets.',
    sections: [
      { h: 'What this UUID generator creates', p: ['A UUID — universally unique identifier — is a 128-bit label written as five groups of hexadecimal, for example 1f9c3a6e-4b2d-4f8a-9c31-7e5d2b0a8f44. The version generated here is v4: a handful of bits are fixed to mark the version and variant, and everything else comes from your browser’s cryptographically secure random source. The chance of two v4 UUIDs colliding is remote enough that you can treat identifiers as unique without coordinating issuance — no central counter, no sequence table, no idempotency check.', 'They are a default primary key for a reason: identifiers generated on the client cannot be guessed or enumerated the way sequential ids can, and two offline systems can merge without conflicts. You will meet them as database ids, record identifiers in APIs, upload filenames, session and request ids in logs, and the client-generated keys that sync engines rely on when a disconnected device rejoins.'] },
      { h: 'How to use this UUID generator', p: ['Set the count between 1 and 100, tick “UPPERCASE” if your destination stores uppercase ids — legacy systems and spreadsheet columns sometimes do — and the list appears immediately, ready for the Copy button. Change the count and the list resizes live; press Generate new batch for a fresh set without touching anything else, which is handy when you are testing idempotency or need a second set for fixture files.', 'Pick the count from the job: one per row you are about to insert, a handful for test fixtures, a few dozen for sample data. Keep the values you have used in a text file or seed script rather than re-rolling them later — a UUID that has appeared in production data must stay the one your test expected, and quietly regenerating fixtures invalidates every assertion that referenced a specific id.'] },
      { h: 'Common mistakes', p: ['A UUID is not a secret, though it is often stored like one. v4 values are random, not encrypted: anyone who sees one holds the whole value, so a UUID identifies a record but never authorises access to it. Access control belongs in your session and permission layers, not in the URL.', 'Versions are not interchangeable, either. v1 and v7 embed timestamps — v7 sorts in creation order, which is why newer databases prefer it for index locality — and systems that parse the version bits will reject v4 where v7 was expected. This tool generates v4, the safe default for random identifiers; check which version your schema requires before you commit.', 'Write patterns on very large tables are easy to ignore. Fully random keys scatter inserts across index pages, which costs more than sequential keys at scale. For application-level identifiers, API records and client-generated ids that trade-off is irrelevant; for the clustered key of a billion-row table it may not be. The randomness that protects you in an API can punish you in an index.'] },
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
    h1: 'JWT Decoder — header, payload and expiry, unredacted',
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
    h1: 'User Agent Parser — browser, OS and device from one string',
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
    h1: 'Free ICS File Generator — a calendar event you can download',
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
    h1: 'Image Compressor — shrink the file without the upload',
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
    h1: 'JSON Validator and Formatter — find the broken comma',
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
      h1: 'Timestamp Converter — Unix time to a date you can read',
      metaTitle: 'Free Timestamp Converter — Unix Epoch & Human Date',
      metaDesc: 'Free timestamp converter converts Unix timestamps to human-readable dates and vice versa. Supports UTC, local time, timezone conversion and epoch formats.',
      intro: 'This timestamp converter converts Unix timestamps to human-readable dates and dates back to timestamps, with timezone support for UTC and local time.',
      sections: [
        { h: 'What Unix timestamps represent', p: ['A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970, 00:00:00 UTC. It is a simple integer that represents a specific moment in time, making it easy to store, compare and transmit across different systems and programming languages. Most programming languages can convert between timestamps and dates, but the formats and conventions vary. It is the format behind API payloads, database columns and log lines, so the same integer has to be readable in a hurry. Because the epoch is measured from UTC, one number points at the same moment everywhere; only the rendering changes with a timezone.'] },
        { h: 'How to use this timestamp converter', p: ['Enter either a Unix timestamp (seconds or milliseconds) or a human-readable date to convert. The tool automatically detects the input format and shows the converted value in multiple formats including UTC, local time, ISO 8601 and relative time. Timezone support includes UTC and your local browser timezone. Copy the converted value for use in APIs, databases, logs or documentation. The timestamp converter handles both seconds and milliseconds automatically, so you do not need to specify which format you are using. The converter also shows the date in several formats at once, so you can copy the one your log, query or API expects.'] },
        { h: 'Common timestamp formats explained', p: ['Unix timestamps are typically in seconds (10 digits) or milliseconds (13 digits). Some systems use microseconds (16 digits). Most modern APIs and databases use millisecond timestamps because they offer better precision. JavaScript uses milliseconds, while Unix commands and many server-side languages use seconds. When converting, the timestamp converter normalizes the input and provides consistent output formats across all representations. If your timestamp does not convert to the expected date, check whether it is in seconds or milliseconds. The converter also handles negative timestamps for dates before 1970, which some systems use for historical dates. Seconds or milliseconds is the first thing to check when a timestamp lands in 1970 or in 2286.'] },
        { h: 'Timestamp conversion for development', p: ['Developers use this timestamp converter frequently when debugging API issues, reading log files, testing webhooks and troubleshooting database queries. Many programming frameworks return timestamps in different formats, and converting between them manually is error-prone. Doing that arithmetic by hand is where the mistakes come from; the converter removes the step. Timezone handling is built in, so you can see how the same moment appears in UTC versus your local time. This is essential when debugging issues that only appear in certain timezones or when coordinating with distributed teams across regions. Every line of the output is copy-ready, so a timestamp from a log file can be converted and pasted into a ticket, a query or a note without reformatting by hand.'] },
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
      h1: 'IP Address Converter — every IPv4 form, side by side',
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

  // ---------------------------------------------------------- regex tester
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    cat: 'web',
    icon: '🔍',
    card: 'Test a regular expression against real text and see every match, flag and capture group live.',
    usedFor: 'for checking a pattern before you ship it',
    keywords: 'regex tester regular expression test pattern match capture group javascript flags online',
    focus: 'regex tester',
    h1: 'Regex Tester — paste a pattern, watch what it matches',
    metaTitle: 'Free Regex Tester — Test Patterns & Matches Online',
    metaDesc: 'Test any regular expression with this free regex tester: see every match and capture group as you type, spot flag mistakes and syntax errors before you ship.',
    intro: 'This regex tester runs your pattern against the text you paste and lists every match with its position and capture groups, so you can see what a regular expression actually matches before it ships.',
    sections: [
      { h: 'What this regex tester does', p: [
        'A regular expression is a compact rule for finding text: one pattern, written once, that can match thousands of lines at a time. The gap between writing a pattern and trusting it is where most bugs live, because a pattern can quietly match far more or far less than you intended. This regex tester closes that gap by running your pattern against the text you paste and reporting the result immediately — every match, the position where it started, and what each capture group held. Nothing is uploaded: the text stays in the tab, so an unpublished config or a client log never leaves your machine.',
        'The report separates two things that are easy to confuse. The match list shows the exact substrings the pattern found, in the order they appear, each with its start and end offset so you can find the same text in a large file. Under every match the capture groups are numbered the way JavaScript numbers them: group zero is the whole match, group one is the first pair of parentheses, and named groups are listed under the name you gave them. When the pattern finds nothing, the tester says so plainly rather than leaving an empty box.',
      ] },
      { h: 'How to use this regex tester', p: [
        'Type the pattern into the Pattern box without the surrounding slashes — the tester builds the regular expression object for you, and the flag checkboxes decide how it behaves. Paste the text you want to search into the test area below and the result updates as you type, so there is no Apply button to forget. A broken pattern never breaks the page either: the status line quotes the message the JavaScript engine returned and points at the character or flag that caused it, and the output clears until the pattern parses again.',
        'The flags are the part people get wrong most often. Global keeps searching after the first hit, and without it you only ever see the first match even though the pattern is correct. Case-insensitive is the difference between finding every casing of a word and only the capitalised one. Multiline changes what the anchors mean, so a caret starts each line instead of the whole text, while dotAll lets a dot cross line breaks and unicode makes character classes respect code points rather than UTF-16 units. If a pattern works in your editor and fails in the browser, the engine is usually the reason, not your spelling.',
      ] },
      { h: 'JavaScript regular expressions: limits worth knowing', p: [
        'This tester uses the engine your browser uses, which is JavaScript rather than Perl, Python or PCRE. Most everyday syntax behaves the same, but the edges differ: JavaScript supports lookbehind and named groups, while possessive quantifiers and atomic groups are not available at all, and some escapes you know from shell tools mean something slightly different. Unicode-aware matching is opt-in through the unicode flag, which is why a pattern that handles accented letters correctly in one tool can look for the wrong bytes here. If a pattern works in your editor and fails in the browser, the engine is usually the reason, not your spelling.',
        'Two habits keep a pattern honest. Test against text that includes the awkward cases — empty lines, accents, emoji, very long runs and the near-miss that should not match — because a tidy sample proves very little and the failure will arrive in production otherwise. And prefer the smallest pattern that matches what you mean: a broad one may work today and become unreadable in six months, while a named group and a short comment in the surrounding code do more for maintainability than a clever trick.',
      ] },
    ],
    faqs: [
      { q: 'Is this regex tester free to use?', a: 'Yes — this regex tester is free, needs no signup and runs entirely in your browser, so any text you paste is processed locally and never uploaded or stored.' },
      { q: 'What flags can I test with this regex tester?', a: 'It exposes the flags JavaScript supports: global, case-insensitive, multiline, dotAll, unicode and sticky. Each checkbox changes how the same regex tester treats the text you paste.' },
      { q: 'Does it handle lookbehind and named groups?', a: 'Yes. Modern browsers support lookbehind assertions and named capture groups, and named groups are listed alongside the numbered ones. An unsupported feature returns the engine error unchanged.' },
      { q: 'Why does my pattern match an empty string?', a: 'Quantifiers such as an asterisk or a question mark are allowed to match nothing, so a pattern succeeds with zero characters at every position. The tester reports those zero-length matches instead of looping.' },
      { q: 'Can I test Python or PHP patterns in this regex tester?', a: 'You can, but this regex tester runs JavaScript syntax. Everyday patterns port unchanged, while engine-specific features such as atomic groups or possessive quantifiers report an error here and work elsewhere.' },
    ],
    html: `
${f.text('rt-pattern', 'Pattern', '\\b\\d{4}-\\d{2}-\\d{2}\\b')}
<div class="field-row">
${f.check('rt-f-g', 'g — global (every match)', true)}
${f.check('rt-f-i', 'i — ignore case')}
${f.check('rt-f-m', 'm — multiline anchors')}
${f.check('rt-f-s', 's — dot matches newline')}
${f.check('rt-f-u', 'u — unicode')}
</div>
${f.textarea('rt-text', 'Test string', 'Paste the text you want to search…', 6)}
<p class="tool-note" id="rt-stats"></p>
${outputArea('rt-out', 'Matches and capture groups')}
${note('Patterns run locally with JavaScript\u2019s RegExp engine — nothing you paste leaves the page.')}`,
  },

  // ---------------------------------------------------------- QR code generator
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    cat: 'web',
    icon: '🔳',
    card: 'Turn any text or link into a scannable QR code and download it as PNG or SVG, free.',
    usedFor: 'for links, WiFi details and print',
    keywords: 'qr code generator create qr code png svg download url wifi barcode free online',
    focus: 'qr code generator',
    h1: 'QR Code Generator — download as SVG or PNG',
    metaTitle: 'QR Code Generator: Free PNG & SVG QR Maker (2026)',
    metaDesc: 'QR code generator: create QR codes online for free. Enter text or URL, choose size and error correction, download PNG or SVG. No signup, no watermark.',
    intro: 'This QR code generator turns a link, message or WiFi detail into a scannable code you can preview instantly and download as PNG or SVG — generated in your browser with no signup.',
    sections: [
      { h: 'How this QR code generator works', p: [
        'A QR code is a two-dimensional barcode: a square of black and white modules that stores bytes in a pattern a camera can decode. Encoding happens here in the page, so the text you type is turned into a module grid by your own browser and never sent to a service that could log it. Enter a link, a short message, a contact record or a WiFi configuration, choose how large you want the image and how much damage it should tolerate, and the preview redraws with every change.',
        'The generator grows the code to fit the data: a short URL needs only a small grid, while a paragraph pushes it to a denser one, and the quiet border around the edge stays intact so scanners can find the edges. What you see in the preview is exactly what the downloaded file contains — the PNG is rendered from the same grid at the size you picked, and the SVG is the grid itself as vector shapes, which is the version to use when something will be printed and scaled.',
      ] },
      { h: 'Choosing a size and an error correction level', p: [
        'Size matters less than the physical space the code occupies when it is finally placed. For a screen, 256 pixels is comfortable; for anything printed, start at 512 and go to 1024 if the code will sit on a poster, a menu or a window where people scan from a step or two back. The practical rule is that a code should be about a tenth of the distance it is scanned from across, and that a quiet zone of clear space around the border is what lets a camera lock on in poor light.',
        'Error correction is about survival, not quality. The four levels reserve roughly 7, 15, 25 and 30 percent of the code for redundancy, so a damaged or partly covered code still decodes. Higher levels make the pattern denser rather than sharper, which is why the middle setting suits most jobs: enough redundancy to survive a coffee ring or a thumb, without the extra clutter that comes with the top level. Choose the highest level only when the code will be printed small, placed outdoors or likely to be written on.',
      ] },
      { h: 'What you can encode, and how to check it', p: [
        'Plain text and links are the obvious uses, but the same square handles a WiFi configuration in the standard WIFI format, a short contact record, a one-time code for an internal tool or a sentence of instruction for a printed card. Keep the payload short and the modules stay readable: a code that has to hold a long paragraph becomes a fine grid that cheap phone cameras struggle with at an angle, so link to a page rather than embedding the whole page.',
        'Check the result the way your visitor will — scan it with a phone before printing a run, from the angle and distance the poster will be read at, and confirm the decoded text is exactly what you intended. A trailing space or a missing protocol is the usual surprise: some scanners will not repair a link that begins without one, so include it when the payload is a web address. Once it scans cleanly at size, the downloaded file is ready for print, slides or the web.',
      ] },
    ],
    faqs: [
      { q: 'Is this QR code generator free to use?', a: 'Yes. This QR code generator is free with no signup and no watermark, and it runs in your browser, so the text you encode is never sent to a server or stored anywhere.' },
      { q: 'What is the difference between PNG and SVG from this QR code generator?', a: 'PNG is a fixed-pixel image suited to screens and most print. SVG is vector, so it scales to any size without blurring — the better choice for logos, signage and anything that will be enlarged.' },
      { q: 'Which error correction level should I pick?', a: 'Levels L, M, Q and H recover roughly 7, 15, 25 and 30 percent of the code. M suits most uses; pick H when the code will be small, damaged, written on or printed somewhere busy.' },
      { q: 'Can I make a WiFi QR code with this QR code generator?', a: 'Yes. Enter the standard WIFI string with the network name and password in the format WIFI:T:WPA;S:network;P:password;; and most phone cameras will offer to join the network when scanned.' },
      { q: 'Why will my QR code not scan?', a: 'Usual causes are a code printed too small, no clear border around it, or a link missing its protocol. Keep the quiet zone, size it for the distance it will be read from, and test with a phone before printing.' },
      { q: 'Does this QR code generator make a traditional barcode?', a: 'No. A QR code is a two-dimensional barcode that holds text or a URL, which is what this tool encodes. The striped one-dimensional formats used on retail packaging are a different symbology and are not generated here.' },
    ],
    html: `
${f.text('qr-text', 'Text or link to encode', 'https://tools4market.online')}
<div class="field-row">
${f.select('qr-size', 'Image size', [
      { v: '256', l: '256 px — screens' },
      { v: '512', l: '512 px — print' },
      { v: '1024', l: '1024 px — large print' },
    ], '512')}
${f.select('qr-ec', 'Error correction', [
      { v: 'L', l: 'L — 7% recovery' },
      { v: 'M', l: 'M — 15% recovery' },
      { v: 'Q', l: 'Q — 25% recovery' },
      { v: 'H', l: 'H — 30% recovery' },
    ], 'M')}
</div>
<div class="btn-row">
  <button type="button" class="btn" id="qr-run">Generate QR code</button>
  <button type="button" class="btn btn-secondary" id="qr-png" data-download="">Download PNG</button>
  <button type="button" class="btn btn-secondary" id="qr-svg" data-download="">Download SVG</button>
</div>
<p class="tool-note" id="qr-stats"></p>
<div class="output">
  <div class="output-head"><span>Preview</span></div>
  <div id="qr-out" class="output-area" aria-live="polite"></div>
</div>
${note('Encoded in your browser by a vendored MIT-licensed encoder — the text you enter is never uploaded.')}`,
  },

  // ---------------------------------------------------------- colour picker
  {
    slug: 'color-picker',
    name: 'Color Picker & Contrast Checker',
    cat: 'web',
    icon: '🎨',
    card: 'Convert HEX, RGB and HSL, build a tint ramp and check WCAG contrast as you pick.',
    usedFor: 'for palettes and accessible text colour',
    updated: '2026-11-10',
    keywords: 'color picker hex to rgb rgb to hsl contrast checker wcag colour converter tints shades',
    focus: 'color picker',
    h1: 'Color Picker — HEX, RGB, HSL and contrast ratios',
    metaTitle: 'Free Color Picker — HEX, RGB, HSL & Contrast',
    metaDesc: 'Free color picker converts between HEX, RGB and HSL, builds a tint and shade ramp, and checks WCAG contrast against black and white text as you choose.',
    intro: 'Use this color picker to convert between HEX, RGB and HSL, build a tint and shade ramp from one colour, and check contrast before it reaches a page.',
    sections: [
      { h: 'What the color picker returns', p: ['One colour has several spellings. A color picker converts between them so the same value can travel: HEX for CSS and design tools, RGB for canvases and older APIs, HSL for the times you want to reason about hue and lightness rather than channel values. The conversion is exact — every HEX triplet maps to one RGB triple and back — so the formats differ in notation, not in colour. Copy whichever form the destination expects; there is no lossy step in between.', 'The tint and shade ramp is generated by mixing the selected colour with white and black in even steps. Tints keep the hue and raise lightness, which is how hover states and disabled buttons are usually built; shades lower it, which is how pressed states and text on light backgrounds get their weight. Because the ramp is arithmetic, the steps are even and reproducible — useful when a design system needs five values rather than one.'] },
      { h: 'How to use this color picker', p: ['Pick a colour with the swatch or paste a HEX value into the field; the other stays in sync. The tool accepts three- and six-digit HEX, with or without the leading hash. The tiles report HEX, RGB and HSL, the ramp shows nine steps with their codes, and the contrast tiles say whether white or black text passes WCAG AA and AAA on the chosen background. Copy any value straight into a stylesheet or a design token.', 'It is a decision aid, not a palette generator with taste. Start from a brand colour, read the ramp, then test the two text options: one of them will be comfortable and the other will fail, and the ratio tells you which before a screenshot review does. Nothing is uploaded, so client palettes and unreleased themes are safe to check here.'] },
      { h: 'Contrast is the part that matters', p: ['WCAG contrast is a ratio between the relative luminance of two colours, from 1:1 (identical) to 21:1 (black on white). Normal text needs 4.5:1 for AA and 7:1 for AAA; large text — roughly 24px, or 19px bold — needs 3:1 and 4.5:1. The color picker computes the ratio against both black and white text on the selected background, because those are the two cases a page usually needs.', 'Two cautions. The ratio says nothing about colour-blindness, so a pair that passes can still be indistinguishable to some readers; and it ignores surrounding context, including borders and images behind the text. Treat a pass as a floor rather than a finished decision, and check the rendered page at the size and weight the text actually uses. A number cannot see the finished layout.'] },
    ],
    faqs: [
      { q: 'How do I convert HEX to RGB?', a: 'Paste the HEX value into the color picker and the RGB and HSL equivalents appear immediately. The conversion is exact and runs entirely in your browser.' },
      { q: 'What contrast ratio do I need?', a: 'WCAG AA asks for 4.5:1 for normal text and 3:1 for large text; AAA asks for 7:1 and 4.5:1. The color picker shows both verdicts against black and white text.' },
      { q: 'Does this color picker save my colours?', a: 'No. Nothing is stored or uploaded — the colour exists in the page until you close it, so copy the values you want to keep.' },
      { q: 'Why do tints and shades differ from opacity?', a: 'Mixing with white or black changes the colour itself; opacity lets the background show through. For buttons and states, mixed tints are usually more predictable.' },
    ],
    html: `
<div class="field"><label for="cp-pick">Pick a colour</label><input id="cp-pick" type="color" value="#243b63"></div>
${f.text('cp-hex', 'HEX value', '#243b63', '#243b63')}
${outputArea('cp-out', 'Colour values')}`,
  },

  // ---------------------------------------------------------- CSS minifier
  {
    slug: 'css-minifier',
    name: 'CSS Minifier',
    cat: 'web',
    icon: '🗜️',
    card: 'Strip comments and whitespace from CSS, with before-and-after byte counts.',
    usedFor: 'for stylesheets before they ship',
    updated: '2026-11-10',
    keywords: 'css minifier minify css compress stylesheet remove comments css optimizer',
    focus: 'css minifier',
    h1: 'CSS Minifier — strip comments and whitespace safely',
    metaTitle: 'Free CSS Minifier — Compress CSS Without Breaking It',
    metaDesc: 'Free CSS minifier removes comments, collapses whitespace and drops the last semicolon before a brace, then reports the bytes saved — all in your browser.',
    intro: 'Paste stylesheet text into this CSS minifier to remove comments and collapse whitespace, with an honest byte count before and after — nothing is uploaded.',
    sections: [
      { h: 'What a CSS minifier removes', p: ['Minification removes characters a browser does not need, without changing what the stylesheet means. Comments go first, then runs of whitespace, then the spaces around braces, colons, commas and combinators. A final semicolon before a closing brace is dropped because CSS does not require it. Everything that carries meaning — selectors, property names, values, units and quotation marks — is left alone.', 'It is not the same as compression. Gzip and Brotli find repeated sequences across the whole file and usually beat minification by a wide margin; minification helps because it shrinks the input those algorithms compress, and because a smaller file parses slightly faster. Most build tools do both, and doing both is correct — a css minifier is not a replacement for serving compressed responses.'] },
      { h: 'How to use this CSS minifier', p: ['Paste a stylesheet, or a fragment you are about to hand to a developer, and the minified copy appears as you type with the byte counts beside it. The output is plain CSS, not a source map and not a bundle: it assumes the input is valid and leaves the structure alone. Copy the result into a build step, an inline style block or a component, and keep the readable source in version control. The tool never rewrites selectors or merges rules, so the output stays reviewable.', 'The tool refuses to guess. If the braces do not balance, or the input contains no rule at all, it returns the text unchanged and says why, rather than producing something that looks minified and quietly breaks. It respects quoted strings and url() contents, so a semicolon inside a content value or a data URI is not treated as syntax. Nothing is uploaded, and the byte count is measured on the text you pasted.'] },
      { h: 'What minification will not fix', p: ['A CSS minifier does not remove unused rules, merge duplicates, or rewrite a selector that is too specific. Those are authoring problems, and fixing them needs a different tool and a decision about what to keep. It also will not repair invalid CSS: if the input does not parse, the browser will discard the same declarations after minification that it discarded before.', 'Watch the byte counts rather than the percentage. A stylesheet that shrinks from 48 KB to 31 KB has saved 17 KB, which is meaningful on a slow connection; one that shrinks from 2 KB to 1.4 KB saves 600 bytes, which gzip probably erased already. And keep the unminified file: the next person to edit the CSS will need it, and a diff against minified output is unreadable. Quote the saved bytes, not the percentage, when you argue for the build step.'] },
    ],
    faqs: [
      { q: 'Does minifying CSS break anything?', a: 'Not if the input is valid. The CSS minifier only removes comments and whitespace and respects strings and url() contents; it returns the text unchanged when it cannot be sure.' },
      { q: 'How much smaller will my CSS be?', a: 'Typically 15 to 30 percent before gzip, depending on comments and indentation. The CSS minifier reports the exact byte count for the text you paste.' },
      { q: 'Should I minify CSS or rely on gzip?', a: 'Serve both. Minification shrinks the file before compression, and the two compound; neither replaces the other.' },
      { q: 'Can I reverse minified CSS?', a: 'Not to the original. Formatting and comments are gone; a formatter can re-indent the rules but cannot restore what was removed.' },
    ],
    html: `
${f.textarea('cm-in', 'CSS to minify', 'Paste a stylesheet or a fragment…', 9, `.card {
  color: #243b63;
  padding: 16px 20px;
  border-radius: 8px;
}

/* hover state */
.card:hover {
  color: #0f766e;
}
`)}
<p class="tool-note" id="cm-stats"></p>
${outputBlock('cm-out', 'Minified CSS')}
${note('Minified in your browser — paste confidential stylesheets without uploading them.')}`,
  },
  
  // ---------------------------------------------------------- cron expression generator
  {
    slug: 'cron-expression-generator',
    name: 'Cron Expression Generator',
    cat: 'web',
    icon: '⏰',
    card: 'Build a five-field cron expression and see the next five times it will run.',
    usedFor: 'for scheduled jobs, backups and deploys',
    updated: '2026-11-11',
    keywords: 'cron expression generator crontab schedule next run cron job syntax five fields',
    focus: 'cron expression generator',
    h1: 'Cron Expression Generator — expression and next run times',
    metaTitle: 'Free Cron Expression Generator — Next Run Times',
    metaDesc: 'Free cron expression generator: build a five-field crontab line, read it in plain English and see the next five run times in your own timezone.',
    intro: 'Use this cron expression generator to build a five-field expression from presets or by typing each field, then read it in plain English and see the next five run times.',
    sections: [
      { h: 'What the five cron fields control', p: ['A cron expression is five fields separated by spaces, read left to right as minute, hour, day of month, month and day of week. Minute runs from 0 to 59, hour from 0 to 23, day of month from 1 to 31, month from 1 to 12, and day of week from 0 to 7 where both 0 and 7 mean Sunday. An asterisk means every legal value rather than zero, which is the first thing people misread.', 'Each field accepts a single number, a range such as 9-17, a step such as */15, or a comma-separated list such as 1,3,5. Steps can be combined with ranges: 0-30/10 means every ten minutes inside the first half hour. Month and weekday names are accepted too, so jan and mon work wherever numbers do. This cron expression generator normalises names to numbers, which is why the breakdown below always shows the numeric form.'] },
      { h: 'How this cron expression generator works', p: ['Start from a preset if one fits — every fifteen minutes, hourly, a daily nine o’clock, weekdays at nine, Monday midnight, or the first of the month — then adjust a field. The five boxes and the expression box stay in sync: typing in either place updates the other, and the next-run list recalculates on every keystroke.', 'The next five runs are the real output. They are computed in this browser’s timezone from the current minute, so an expression that looks plausible but never fires — 0 0 31 2 *, say — shows up immediately as an empty list rather than being discovered at three in the morning by a missing backup. Nothing is sent to a server.', 'Copy the expression into a crontab, or paste it into any scheduler that takes standard five-field syntax. Seconds and the @reboot shorthand are deliberately out of scope: they are extensions, and a generator that silently accepts them teaches syntax that fails elsewhere.'] },
      { h: 'Cron mistakes the next-run list exposes', p: ['The day-of-month and day-of-week fields combine with OR when both are restricted, not AND. 0 9 1 * 1 runs on the first of the month and on every Monday — a rule that surprises almost everyone the first time. With one of the two left as an asterisk the other alone decides, which is the behaviour most people expect. The next-run list makes the difference visible before it reaches production.', 'Two more traps: */15 starts at zero, so it fires at :00, :15, :30 and :45 rather than fifteen minutes after whenever you wrote it; and February has no thirty-first, so a monthly job pinned to 31 skips the short months entirely. Keep the server’s timezone in mind as well — a job set for 02:00 runs at 02:00 where the server is, which may not be where you are.', 'Cron has no syntax for the last day of the month and no jitter for avoiding a thundering herd. Both need a wrapper script or a scheduler with a richer format. If the expression needs a comment to be understood, that comment belongs next to it in the crontab.'] },
    ],
    faqs: [
      { q: 'What do the five fields in a cron expression mean?', a: 'In order: minute (0-59), hour (0-23), day of month (1-31), month (1-12) and day of week (0-7, where 0 and 7 are Sunday). An asterisk means every value.' },
      { q: 'Does this cron expression generator use my timezone?', a: 'Yes. The next-run list is calculated in your browser’s local timezone from the current minute, so it shows when the job fires on your machine, not on the server.' },
      { q: 'Why does my cron job run on a different day than expected?', a: 'Because day-of-month and day-of-week are OR-ed when both are set. 0 9 1 * 1 runs on the first of the month and every Monday; leave one field as * to make the other decide.' },
      { q: 'Can a cron expression generator handle the last day of the month?', a: 'Not in standard five-field cron. There is no L modifier, so a job pinned to 31 skips shorter months; the usual workaround is a wrapper script that checks the date.' },
    ],
    html: `
<p class="tool-note" id="cr-presets-label">Start from a preset, or type the fields yourself</p>
<div class="chip-row" role="group" aria-labelledby="cr-presets-label">
  <button type="button" class="chip" data-cron="*/15 * * * *">Every 15 min</button>
  <button type="button" class="chip" data-cron="0 * * * *">Hourly</button>
  <button type="button" class="chip" data-cron="0 9 * * *">Daily 09:00</button>
  <button type="button" class="chip" data-cron="0 9 * * 1-5">Weekdays 09:00</button>
  <button type="button" class="chip" data-cron="0 0 * * 1">Mondays 00:00</button>
  <button type="button" class="chip" data-cron="0 2 1 * *">1st of the month</button>
</div>
<div class="field-row">
${f.text('cr-min', 'Minute (0-59)', '*')}
${f.text('cr-hour', 'Hour (0-23)', '*')}
</div>
<div class="field-row">
${f.text('cr-dom', 'Day of month (1-31)', '*')}
${f.text('cr-month', 'Month (1-12 or JAN-DEC)', '*')}
</div>
${f.text('cr-dow', 'Day of week (0-7, 0 and 7 are Sunday)', '*')}
${f.text('cr-expr', 'Expression', '', '*/15 9-17 * * 1-5')}
${outputBlock('cr-out', 'Expression')}
${outputArea('cr-report', 'When it runs')}
${note('Standard five-field cron, evaluated in your browser. Nothing is sent to a server, and the expression is yours to copy into a crontab.')}`,
  },

  // ---------------------------------------------------------- JSON to CSV
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    cat: 'web',
    icon: '📊',
    card: 'Convert an array of JSON objects to CSV, with nested keys flattened and quoted properly.',
    usedFor: 'for spreadsheets, exports and data handoffs',
    updated: '2026-11-11',
    keywords: 'json to csv converter json csv export flatten nested json array to csv spreadsheet',
    focus: 'json to csv',
    h1: 'JSON to CSV Converter — flatten and export cleanly',
    metaTitle: 'Free JSON to CSV Converter — Nested Keys Flattened',
    metaDesc: 'Free JSON to CSV converter: turn an array of objects into a spreadsheet-ready file, flatten nested keys to dot notation, and quote every field that needs it.',
    intro: 'Paste JSON into this converter to get CSV with a header row, nested objects flattened to dot notation, and every comma, quote and newline escaped correctly.',
    sections: [
      { h: 'How the JSON to CSV converter maps structure to rows', p: ['The converter reads a JSON array and writes one CSV row per element. Object keys become the header row, in the order they first appear across the whole array, so a key that only exists in the tenth object still gets a column. Rows that lack that key are written as empty cells rather than shifted left — misaligned columns are the most common way a CSV export silently corrupts data.', 'Nested objects are flattened to dot notation when the option is on: address.city and address.postcode become their own columns instead of being crammed into one JSON blob. Arrays and mixed values are serialised as JSON text inside a single cell, because a cell can only hold one value. A top-level array of arrays is accepted too and becomes column_1, column_2, and so on.', 'A single top-level object is treated as one row. An array of plain strings or numbers becomes a single value column, which is rarely what you want but is better than refusing the input. If the top level is null or a scalar, the tool says so instead of inventing a table.'] },
      { h: 'Delimiters, quoting and the formula guard', p: ['Delimiter matters more than it looks. A comma is the default and the safe choice for a standards-compliant parser; a semicolon is what several European Excel locales expect; a tab produces TSV, which stays robust when the data is full of commas. Every field containing the delimiter, a quote or a newline is quoted, and inner quotes are doubled — the rule both RFC 4180 and every spreadsheet implements.', 'The formula guard exists because a CSV is executable. A cell beginning with =, +, @, or a hyphen followed by something that is not a number, is prefixed with an apostrophe so a spreadsheet treats it as text rather than a formula. Negative numbers are left alone deliberately. The BOM option prepends the three bytes Excel needs to read UTF-8 without mangling accents.', 'The stats line reports rows, columns and output size, which is the quickest check that flattening produced the shape you expected. A file reporting one column for forty objects usually means the input was an array of arrays rather than an array of objects.'] },
      { h: 'Where JSON to CSV conversions go wrong', p: ['Uneven objects are the usual source of empty cells: if only some records carry a phone field, the column exists and most rows are blank. That is correct, not a bug — but it is a reminder that JSON’s flexibility disappears the moment data becomes a rectangle. Decide which keys are required before exporting, not after someone opens the file.', 'Numbers arrive as text once they are in CSV, and long identifiers lose precision in Excel above fifteen significant digits. Dates stay exactly as the JSON wrote them; the converter does not guess a format, because guessing turns 03/04 into a different day in a different locale. Large inputs are fine, but the browser holds the whole string, so a hundred-megabyte export belongs in a script rather than a tab.', 'Check the first three lines before sending the file anywhere. A wrong delimiter and a missing header look identical in a preview and completely different to the person importing it.'] },
    ],
    faqs: [
      { q: 'How do I convert nested JSON to CSV?', a: 'Leave the flatten option on. The JSON to CSV converter walks nested objects and writes their keys as dot notation, so address.city becomes a column instead of one cell of raw JSON.' },
      { q: 'Why does my CSV open with the wrong encoding in Excel?', a: 'Excel does not assume UTF-8 by default. Turn on the BOM option, which adds the three bytes Excel needs to read accents and non-Latin characters correctly.' },
      { q: 'What happens to arrays inside the JSON?', a: 'An array inside a record is written as JSON text in a single cell, because a CSV cell can only hold one value. Split it into columns only if every record has the same length.' },
      { q: 'Does the converter protect against CSV injection?', a: 'Yes, by default. Cells starting with =, +, @ or a non-numeric hyphen are prefixed with an apostrophe so spreadsheets treat them as text rather than formulas.' },
    ],
    html: `
${f.textarea('jc-in', 'JSON to convert', 'Paste an array of objects…', 9, '[{"name":"Ada","role":"Engineer","address":{"city":"London","postcode":"N1"},"tags":["math","logic"]},{"name":"Grace","role":"Admiral","address":{"city":"New York","postcode":"10001"},"tags":["navy"]}]')}
<div class="field-row">
${f.select('jc-delim', 'Delimiter', [{ v: 'comma', l: 'Comma ( , )' }, { v: 'semicolon', l: 'Semicolon ( ; )' }, { v: 'tab', l: 'Tab' }], 'comma')}
${f.check('jc-flatten', 'Flatten nested objects to dot notation', true)}
</div>
${f.check('jc-guard', 'Guard formula cells (prefix = + - @ with an apostrophe)', true)}
${f.check('jc-bom', 'Add a UTF-8 BOM for Excel', false)}
<p class="tool-note" id="jc-stats"></p>
${outputBlock('jc-out', 'CSV')}
${note('Converted in your browser — the JSON you paste is never uploaded. Quoting follows RFC 4180, so the output opens in Excel, Sheets and any parser without a repair step.')}`,
  },

  // ---------------------------------------------------------- hash generator
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    cat: 'web',
    icon: '🔐',
    card: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text, entirely in your browser.',
    usedFor: 'for checksums, integrity checks and debugging',
    updated: '2026-11-11',
    keywords: 'hash generator md5 sha1 sha256 sha512 checksum hash text online hex digest',
    focus: 'hash generator',
    h1: 'Hash Generator — MD5, SHA-1, SHA-256 and SHA-512',
    metaTitle: 'Free Hash Generator — MD5, SHA-1, SHA-256, SHA-512',
    metaDesc: 'Free hash generator produces MD5, SHA-1, SHA-256 and SHA-512 digests from text in your browser, with a clear note on which algorithms are safe to use.',
    intro: 'Paste text into this hash generator to get MD5, SHA-1, SHA-256 and SHA-512 digests, computed locally, plus a plain warning about which of them are broken.',
    sections: [
      { h: 'What a hash generator produces', p: ['A hash function turns any input into a fixed-length string. MD5 produces 128 bits, written as 32 hexadecimal characters; SHA-1 produces 160 bits (40 characters); SHA-256 produces 256 bits (64 characters); SHA-512 produces 512 bits (128 characters). The length belongs to the algorithm, not the input, which is why a three-word password and a two-gigabyte file share a digest size.', 'A good hash is one-way and sensitive: changing a single character changes roughly half the output bits, so two near-identical inputs produce completely different digests. That property makes a hash useful for comparing files without moving them, and makes it useless for storing anything you need to read back.', 'Identical input always produces the identical digest. That determinism is the whole point: two people can hash the same download on different machines and compare the strings to know the file arrived intact.'] },
      { h: 'How to use this hash generator', p: ['Type or paste text and the four digests appear as you type. The input is encoded as UTF-8 before hashing, so an accented letter or an emoji contributes the same bytes a server would see — a detail that matters when a checksum computed here has to match one computed elsewhere. Uppercase output is available for systems that expect it; the value is the same either way.', 'Nothing is uploaded. MD5 runs in this page; SHA-1, SHA-256 and SHA-512 use the browser’s WebCrypto implementation, which is only available over https. If the page is opened from a local file or an insecure origin the SHA digests are unavailable, and the tool says so instead of returning something wrong. Each digest has its own copy button.', 'Hashing text is not the same as hashing a file. A text editor may normalise line endings or add a trailing newline, and either change produces a digest different from the one a publisher computed. For downloads, hash the bytes rather than a copy pasted into a box.'] },
      { h: 'Which hash to use, and which not to', p: ['MD5 and SHA-1 are broken for collision resistance: practical collisions exist, so an attacker can produce two different inputs with the same digest. They remain fine for accidental-corruption checks, where nobody is choosing both files, and they are still requested by legacy systems. They are not fine for signatures, certificates or anything where an adversary benefits from a match.', 'SHA-256 and SHA-512 have no known practical collisions and are the safe defaults for file integrity and content addressing. SHA-512 is not automatically more secure in a way that matters here; both are far beyond brute force for password-length input, and the choice is usually dictated by what the other system accepts.', 'None of these are password hashes. A general-purpose digest is fast by design, which is exactly what a password store must not be; passwords need a deliberately slow algorithm with a salt, such as bcrypt, scrypt or Argon2. Using SHA-256 on a password is barely better than storing it in plain text once a database is stolen.'] },
    ],
    faqs: [
      { q: 'Is MD5 still safe to use?', a: 'No for signatures or anything an attacker can influence — collisions are practical. It is still acceptable for accidental-corruption checks and for legacy systems that demand it.' },
      { q: 'Does this hash generator upload my text?', a: 'No. MD5 runs in the page and the SHA digests use your browser’s own WebCrypto implementation, so nothing you paste leaves the tab.' },
      { q: 'Can I use this hash generator for passwords?', a: 'Not for storage. General-purpose hashes are fast by design; passwords need a slow, salted algorithm such as bcrypt, scrypt or Argon2, and a server-side secret.' },
      { q: 'Why do I get a different hash than another tool?', a: 'Usually an encoding or line-ending difference. This tool hashes the UTF-8 bytes exactly as typed, including trailing newlines; a file hash covers different bytes.' },
    ],
    html: `
${f.textarea('hg-in', 'Text to hash', 'Type or paste the text you want to hash…', 6)}
${f.check('hg-upper', 'Uppercase hexadecimal', false)}
${outputArea('hg-out', 'Digests')}
${note('MD5 runs locally in this page; SHA digests use your browser’s WebCrypto. Nothing is uploaded, and nothing is stored after you close the tab.')}`,
  },
  
  // ---------------------------------------------------------- favicon generator
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    cat: 'web',
    icon: '🏷️',
    card: 'Turn an image or up to two letters into a full favicon set — ICO, PNG, Apple, Android and a manifest.',
    usedFor: 'for site icons that look right everywhere',
    updated: '2026-11-11',
    keywords: 'favicon generator favicon ico generator apple touch icon pwa icons webmanifest multi size favicon',
    focus: 'favicon generator',
    h1: 'Favicon Generator — a complete icon set in one ZIP',
    metaTitle: 'Free Favicon Generator — ICO, PNG and Apple Touch Icon',
    metaDesc: 'Free favicon generator builds a complete icon set in one ZIP: a multi-size favicon.ico, PNG icons, an Apple touch icon, Android icons and a webmanifest.',
    intro: 'Upload an image or type a monogram into this favicon generator to get a complete icon set — ICO, PNG, Apple touch, Android and a webmanifest — as one downloadable ZIP.',
    sections: [
      { h: 'What a complete favicon set contains', p: ['A favicon is not one file any more. The set that covers every place an icon appears is a small family: favicon.ico holding 16, 32 and 48 pixel images for legacy tabs and bookmark lists; separate 16 and 32 pixel PNGs for modern tabs; a 180 pixel Apple touch icon for the iOS home screen; 192 and 512 pixel icons for Android and a PWA manifest; and the manifest itself, which names those files and sets the theme colour.', 'The sizes are not decoration. A 16 pixel icon is drawn at 16 pixels with no room to adjust, while the same artwork at 512 is what an Android home screen and the install dialog show. A tool that exports a single 32 pixel PNG and calls it done leaves both of those with a blurry upscale. That is why the ZIP here contains eight files rather than one, and why the ICO carries three sizes instead of one.'] },
      { h: 'How this favicon generator builds each file', p: ['The icons are drawn in a canvas at each target size, then encoded as PNG. The ICO embeds those same PNG images rather than an older bitmap format — every browser released since 2015 reads PNG-in-ICO, and it keeps transparency without a separate palette step. The ZIP is written by hand with stored (uncompressed) entries, because the payload is tiny and a deflate implementation would cost more than it saves.', 'Two input modes. Upload a PNG, JPG, GIF, WebP or SVG and the tool fits it: letterbox by default, so the whole image survives and the padding stays transparent, or crop from the centre when the subject already fills the frame. Or type one or two characters and pick a background and letter colour — a monogram, which is often the better favicon for a site without a logo mark.', 'The head snippet is generated from the file names actually in the ZIP. Upload an SVG and it is included unchanged as favicon.svg, with the matching link added to the snippet.'] },
      { h: 'Favicon problems the generator cannot prevent', p: ['Browsers cache favicons harder than almost any other asset. A new icon can take days to appear, and the usual cause is the cache rather than the file. Hard-reload, open the site in a private window, or rename the file and update the link — renaming is the reliable fix for visitors who already hold the old icon.', 'Three variants are deliberately out of scope. Maskable icons for Android adaptive shapes need a safe zone the generator would have to guess at; monochrome Windows tiles need a separate silhouette; a vector favicon has to be drawn as vectors rather than upscaled. The manifest also ships with a placeholder name, which you must edit — a manifest that still says “Your site” is a defect of its own.', 'Keep the source image. A favicon gets regenerated more often than expected, after a rebrand or a colour change, and starting again from the 512 pixel export each time loses quality.'] },
    ],
    faqs: [
      { q: 'What sizes should a favicon generator produce?', a: 'A multi-size favicon.ico (16, 32, 48), 16 and 32 pixel PNGs, a 180 pixel Apple touch icon, and 192 and 512 pixel icons for Android and PWAs — all produced here in one ZIP.' },
      { q: 'Does this favicon generator keep transparency?', a: 'Yes. PNG-in-ICO preserves alpha, and the PNG sizes are exported with transparent padding unless you fill the canvas with a monogram background.' },
      { q: 'Can I use an SVG favicon?', a: 'Modern browsers accept one, so an uploaded SVG is included unchanged as favicon.svg. The raster sizes are still generated, because older browsers ignore vector icons.' },
      { q: 'Why has my new favicon not appeared?', a: 'Caching. Browsers keep favicons for a long time, so hard-reload, try a private window, or rename the file and update the link before assuming the export failed.' },
    ],
    html: `
<div class="field field-check"><input type="radio" name="fv-mode" id="fv-mode-text" checked><label for="fv-mode-text">Monogram — type one or two characters</label></div>
<div class="field field-check"><input type="radio" name="fv-mode" id="fv-mode-image"><label for="fv-mode-image">Upload an image</label></div>

<div id="fv-text-panel">
  <div class="field-row">
    ${f.text('fv-text', 'Monogram (1–2 characters)', 'T', 'T')}
    ${f.select('fv-font', 'Typeface', [{ v: 'sans', l: 'Sans' }, { v: 'serif', l: 'Serif' }, { v: 'mono', l: 'Mono' }], 'sans')}
  </div>
  <div class="field-row">
    <div class="field"><label for="fv-bg">Background colour</label><input id="fv-bg" type="color" value="#2563eb"></div>
    <div class="field"><label for="fv-fg">Letter colour</label><input id="fv-fg" type="color" value="#ffffff"></div>
  </div>
</div>

<div id="fv-image-panel" hidden>
  <div class="field"><label for="fv-file">Image file</label><input id="fv-file" type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"></div>
  <p class="field-hint">PNG, JPG, GIF, WebP or SVG — up to 2 MB</p>
  ${f.select('fv-fit', 'If the image is not square', [{ v: 'letterbox', l: 'Letterbox — keep the whole image' }, { v: 'crop', l: 'Crop from the centre' }], 'letterbox')}
</div>

${f.text('fv-name', 'Site name for the manifest (optional)', 'Your site')}
<button type="button" class="btn" id="fv-go">Generate favicon set</button>
<p class="tool-note" id="fv-stats" aria-live="polite"></p>
<div class="favicon-grid" id="fv-preview"></div>
${outputBlock('fv-files', 'Files in favicons.zip')}
${outputBlock('fv-snippet', 'Add to your <head>')}
<button type="button" class="btn btn-ghost" id="fv-download">Download favicons.zip</button>
${note('Rendered and zipped in your browser — the image never leaves the tab. The ICO embeds a PNG for each size, which every browser released since 2015 reads. Maskable Android icons, monochrome Windows tiles and a vector favicon are not produced here. The manifest ships with the placeholder name “Your site” — edit name and short_name in site.webmanifest before you publish.')}`,
  },

  // ---------------------------------------------------------- SVG optimizer
  {
    slug: 'svg-optimizer',
    name: 'SVG Optimizer',
    cat: 'web',
    icon: '🖼️',
    card: 'Strip comments, editor metadata, unused IDs and default attributes from an SVG, with exact bytes saved.',
    usedFor: 'for icons and illustrations before they ship',
    updated: '2026-11-11',
    keywords: 'svg optimizer svg minifier compress svg remove metadata inkscape svg clean up optimize svg online',
    focus: 'svg optimizer',
    h1: 'SVG Optimizer — conservative cleanup with exact byte counts',
    metaTitle: 'Free SVG Optimizer — Strip Comments and Editor Metadata',
    metaDesc: 'Free SVG optimizer strips comments, editor metadata, unused IDs and default attributes, reports the exact bytes saved, and leaves the artwork alone.',
    intro: 'Paste an SVG into this optimizer to remove comments, editor metadata, unused IDs and default attributes, and see the exact bytes saved — all in your browser.',
    sections: [
      { h: 'What this SVG optimizer removes', p: ['Four kinds of weight live in a typical exported SVG. Comments carry design notes. Editor metadata arrives from Inkscape or Illustrator as extra namespaces, a namedview element and label attributes only that editor reads. Unused IDs are leftovers from deleted layers. Default attributes restate what the format already assumes, such as stroke="none" or stroke-width="1".', 'Each one is removed only when the tool can show it is not live. An ID is kept if any url(#…), href="#…", marker-, clip-path, mask or filter attribute points at it, if a SMIL animation names it, or if a <style> block mentions it — CSS can reference an ID that no attribute touches, so style text is scanned rather than ignored.', 'Whitespace between elements goes too. Whitespace inside <text>, <tspan>, <title>, <desc>, <style> and <script> stays, because there it is content rather than formatting.'] },
      { h: 'Why the rules stay conservative', p: ['SVGO earns its large reductions by doing things a general tool should not do blind: merging paths, converting shapes, rounding coordinates, rewriting transforms. Each is fine on artwork you can inspect and wrong on artwork you cannot. A rounded coordinate can move a node, a merged path can change how a fill rule behaves, and a rewritten transform can collide with an animation.', 'This optimizer stops at deletions. It never rewrites geometry, never merges elements and never changes a path command, so the output is the same drawing with less noise around it. The visible consequence is that a hand-drawn illustration might come out 15 percent smaller instead of 60. The tool shows both byte counts, so the trade is visible rather than claimed.', 'Two toggles are off by default on purpose. Removing <title> and <desc> saves a few hundred bytes and deletes the accessible name of the graphic, which screen readers use. Converting rgb() to hex renders identically, but some pipelines match on the rgb form, so the default output is the one most pipelines already accept.'] },
      { h: 'When to reach for SVGO instead', p: ['Run SVGO locally when the file has to be as small as possible and you can look at the result: icon sets, illustrations in a design system, anything rendered large enough that a stray node shows. Its plugins are individually documented, and the risk grows with how many of them you switch on.', 'Use this page for a quick, safe reduction with a byte count and nothing to install, or when the SVG came from someone else and you would rather not run a toolchain over it. Both answers are legitimate; they differ in how much you trust the file and how much you can check afterwards.', 'One limit is worth knowing before you start: base64 images embedded in <image> elements usually dominate the file size and cannot be improved by deleting attributes. Extract them and link externally, or accept that the number will barely move.'] },
    ],
    faqs: [
      { q: 'Will this SVG optimizer break my artwork?', a: 'It only deletes what it can show is unused: comments, editor metadata, unreferenced IDs, redundant defaults and formatting whitespace. It never rewrites paths or transforms, so visible content is preserved.' },
      { q: 'Does it support animated SVG?', a: 'Yes. <animate>, <animateTransform> and SMIL begin="id.click" references are recognised, so IDs an animation depends on are kept even when no attribute points at them.' },
      { q: 'Why is my SVG still large after this SVG optimizer runs?', a: 'Usually a base64 image inside an <image> element, which this tool will not touch. Extract the bitmap and link it externally, or compress that image first.' },
      { q: 'Does it remove the title and description?', a: 'Only if you tick that option. Both stay by default because <title> provides the accessible name of the graphic, and removing it is a real accessibility regression.' },
    ],
    html: `
${f.textarea('sv-in', 'SVG source', 'Paste an SVG document…', 8)}
<div class="field"><label for="sv-file">Or choose a .svg file</label><input id="sv-file" type="file" accept=".svg,image/svg+xml"></div>
<div class="field-row">
  <fieldset class="group-box"><legend>Structure</legend>
    ${f.check('sv-comments', 'Remove comments', true)}
    ${f.check('sv-meta', 'Remove editor metadata (Inkscape, Illustrator)', true)}
    ${f.check('sv-space', 'Remove whitespace between elements', true)}
  </fieldset>
  <fieldset class="group-box"><legend>Attributes</legend>
    ${f.check('sv-ids', 'Remove unused IDs', true)}
    ${f.check('sv-hex', 'Shorten six-digit hex colours', true)}
    ${f.check('sv-defaults', 'Remove default attributes', true)}
    ${f.check('sv-rgb', 'Convert rgb() to hex (off by default)', false)}
  </fieldset>
</div>
${f.check('sv-title', 'Remove &lt;title&gt; and &lt;desc&gt; — hurts accessibility, off by default', false)}
<p class="tool-note" id="sv-stats" aria-live="polite"></p>
<div id="sv-warn"></div>
${outputBlock('sv-out', 'Optimized SVG')}
<button type="button" class="btn btn-ghost" id="sv-download">Download .svg</button>
${note('Conservative rules only, parsed with the browser’s built-in XML parser. No path merging, shape conversion or coordinate rounding — those can break artwork, and they are SVGO’s job. Nothing is uploaded.')}`,
  },
  ];

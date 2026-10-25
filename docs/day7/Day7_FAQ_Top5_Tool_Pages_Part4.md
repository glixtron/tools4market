# Day 7 — FAQ Content for Tool Pages 16-20 (Continuing AEO Work)
**Agent:** AEO Editor (Day 7 dispatch)
**Date:** 2026-10-24
**Goal:** Continue the FAQPage schema work — covers tools 16-20 of the 44-tool site

## Context

Day 2 produced FAQ for tools 1-5. Day 5 produced FAQ for tools 6-10. Day 6 produced FAQ for tools 11-15. Day 7 produces FAQ for tools 16-20.

**By end of Day 7, top 20 tool pages will have FAQ sections + FAQPage JSON-LD schema (45% of 44 tools).**

Day 8 will cover tools 21-25. By end of Week 3 = 30 tools. By end of Week 4 = all 44 tools.

---

## Tool 16: Hashtag Generator (/content/hashtag-generator)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about hashtag generation">
  <h2>Frequently asked questions</h2>

  <h3>What is a hashtag generator?</h3>
  <p>A hashtag generator is a tool that produces relevant hashtags for a social media post based on a keyword, topic, or image. It analyzes the input and suggests hashtags most likely to increase post reach on platforms like Instagram, X/Twitter, TikTok, and LinkedIn.</p>

  <h3>How many hashtags should I use on Instagram?</h3>
  <p>Instagram allows up to 30 hashtags per post, but the optimal number is 5-15 hashtags. Posts with 9-11 hashtags tend to get the highest engagement. Use a mix of broad (high-volume), niche (mid-volume), and branded hashtags — not all 30 generic ones.</p>

  <h3>How many hashtags should I use on X/Twitter?</h3>
  <p>X/Twitter recommends 1-2 hashtags per tweet. Tweets with more than 2 hashtags see a 17% drop in engagement. Use hashtags to join trending conversations, not to stuff keywords.</p>

  <h3>Should I use the same hashtags on every post?</h3>
  <p>No. Instagram's algorithm may flag accounts that use the exact same hashtag set on every post as spam. Rotate your hashtag sets — keep 5-10 consistent branded hashtags, then swap the rest based on the specific post topic.</p>

  <h3>How do I find trending hashtags?</h3>
  <p>Use the hashtag generator to find relevant hashtags, then check trending status on the platform: Instagram's Explore page, X's Trending tab, TikTok's Discover page. Combine 1-2 trending hashtags with 8-10 stable niche hashtags for best results.</p>
</section>
```

### JSON-LD Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a hashtag generator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A hashtag generator is a tool that produces relevant hashtags for a social media post based on a keyword, topic, or image. It analyzes the input and suggests hashtags most likely to increase post reach on platforms like Instagram, X/Twitter, TikTok, and LinkedIn."
      }
    },
    {
      "@type": "Question",
      "name": "How many hashtags should I use on Instagram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Instagram allows up to 30 hashtags per post, but the optimal number is 5-15 hashtags. Posts with 9-11 hashtags tend to get the highest engagement. Use a mix of broad (high-volume), niche (mid-volume), and branded hashtags — not all 30 generic ones."
      }
    },
    {
      "@type": "Question",
      "name": "How many hashtags should I use on X/Twitter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "X/Twitter recommends 1-2 hashtags per tweet. Tweets with more than 2 hashtags see a 17% drop in engagement. Use hashtags to join trending conversations, not to stuff keywords."
      }
    },
    {
      "@type": "Question",
      "name": "Should I use the same hashtags on every post?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Instagram's algorithm may flag accounts that use the exact same hashtag set on every post as spam. Rotate your hashtag sets — keep 5-10 consistent branded hashtags, then swap the rest based on the specific post topic."
      }
    }
  ]
}
</script>
```

---

## Tool 17: XML Sitemap Generator (/web-tools/xml-sitemap-generator)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about XML sitemap generation">
  <h2>Frequently asked questions</h2>

  <h3>What is an XML sitemap?</h3>
  <p>An XML sitemap is a file at https://yourdomain.com/sitemap.xml that lists all the URLs on your site you want search engines to index. It's a roadmap for Googlebot, Bingbot, and other crawlers — they read it to discover pages they might miss during normal crawling.</p>

  <h3>Do I need an XML sitemap?</h3>
  <p>For sites with 10+ pages: yes. For sites with internal linking that lets crawlers reach every page in 3 clicks or fewer: optional but recommended. For sites with isolated pages (no internal links pointing to them): required. Google treats sitemaps as a hint, not a directive, but it speeds up discovery of new content.</p>

  <h3>Where do I put my XML sitemap?</h3>
  <p>At https://yourdomain.com/sitemap.xml (root, lowercase, .xml extension). Reference it in your robots.txt with a Sitemap: directive. Submit it to Google Search Console (Sitemaps section) and Bing Webmaster Tools.</p>

  <h3>What is the difference between sitemap.xml and sitemap-news.xml?</h3>
  <p>sitemap.xml lists all URLs you want indexed. sitemap-news.xml is a Google News-specific format for news publishers — lists recently published articles (last 48 hours) with publication date and title. Most sites only need sitemap.xml; only news publishers need sitemap-news.xml.</p>

  <h3>How often should I update my XML sitemap?</h3>
  <p>Update it whenever you publish new content or remove old content. If your CMS auto-generates the sitemap on each publish (WordPress with Yoast, Ghost, Astro, etc.), you don't need to manually update. For static sites, run the XML Sitemap Generator after each publish and commit the updated file.</p>
</section>
```

### JSON-LD Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an XML sitemap?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An XML sitemap is a file at https://yourdomain.com/sitemap.xml that lists all the URLs on your site you want search engines to index. It's a roadmap for Googlebot, Bingbot, and other crawlers — they read it to discover pages they might miss during normal crawling."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need an XML sitemap?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For sites with 10+ pages: yes. For sites with internal linking that lets crawlers reach every page in 3 clicks or fewer: optional but recommended. For sites with isolated pages (no internal links pointing to them): required. Google treats sitemaps as a hint, not a directive, but it speeds up discovery of new content."
      }
    },
    {
      "@type": "Question",
      "name": "Where do I put my XML sitemap?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "At https://yourdomain.com/sitemap.xml (root, lowercase, .xml extension). Reference it in your robots.txt with a Sitemap: directive. Submit it to Google Search Console (Sitemaps section) and Bing Webmaster Tools."
      }
    },
    {
      "@type": "Question",
      "name": "How often should I update my XML sitemap?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Update it whenever you publish new content or remove old content. If your CMS auto-generates the sitemap on each publish (WordPress with Yoast, Ghost, Astro, etc.), you don't need to manually update. For static sites, run the XML Sitemap Generator after each publish and commit the updated file."
      }
    }
  ]
}
</script>
```

---

## Tool 18: Password Generator (/web-tools/password-generator)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about password generation">
  <h2>Frequently asked questions</h2>

  <h3>What makes a strong password?</h3>
  <p>A strong password is at least 16 characters long, includes uppercase + lowercase + numbers + special characters, is randomly generated (not human-chosen), and is unique (not reused across accounts). Random 16-character passwords from a cryptographically secure generator are uncrackable by current hardware.</p>

  <h3>How long should my password be?</h3>
  <p>Minimum 16 characters for personal accounts. 20+ characters for sensitive accounts (email, banking, password manager master password). Length matters more than complexity — a 20-character lowercase password is stronger than an 8-character complex one.</p>

  <h3>Is this password generator safe to use?</h3>
  <p>Yes. This tool generates passwords client-side in your browser using the Web Crypto API (cryptographically secure random number generator). The generated password never leaves your device. No server request is made, no log is kept, no cookie stores the password.</p>

  <h3>Should I use a password manager instead?</h3>
  <p>Yes, for storing passwords. 1Password, Bitwarden, KeePassXC are all good options. Use this tool to generate strong passwords, then store them in your password manager. Don't try to memorize 16-character random passwords — that's what password managers are for.</p>

  <h3>What is the difference between a password and a passphrase?</h3>
  <p>A password is typically 8-16 random characters (e.g., "k9$mP2#vL7@n"). A passphrase is 4-6 random words (e.g., "correct-horse-battery-staple-window"). Passphrases are easier to type and remember, and equally secure at 25+ character length. Use passphrases for accounts you type manually; use random passwords for everything else.</p>
</section>
```

### JSON-LD Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes a strong password?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A strong password is at least 16 characters long, includes uppercase + lowercase + numbers + special characters, is randomly generated (not human-chosen), and is unique (not reused across accounts). Random 16-character passwords from a cryptographically secure generator are uncrackable by current hardware."
      }
    },
    {
      "@type": "Question",
      "name": "How long should my password be?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Minimum 16 characters for personal accounts. 20+ characters for sensitive accounts (email, banking, password manager master password). Length matters more than complexity — a 20-character lowercase password is stronger than an 8-character complex one."
      }
    },
    {
      "@type": "Question",
      "name": "Is this password generator safe to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. This tool generates passwords client-side in your browser using the Web Crypto API (cryptographically secure random number generator). The generated password never leaves your device. No server request is made, no log is kept, no cookie stores the password."
      }
    },
    {
      "@type": "Question",
      "name": "Should I use a password manager instead?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, for storing passwords. 1Password, Bitwarden, KeePassXC are all good options. Use this tool to generate strong passwords, then store them in your password manager. Don't try to memorize 16-character random passwords — that's what password managers are for."
      }
    }
  ]
}
</script>
```

---

## Tool 19: Base64 Encoder/Decoder (/web-tools/base64-encoder-decoder)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about Base64 encoding and decoding">
  <h2>Frequently asked questions</h2>

  <h3>What is Base64 encoding?</h3>
  <p>Base64 is an encoding scheme that converts binary data (bytes) into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It's used to safely transmit binary data through text-only channels like email, JSON, URLs, and HTML. Base64 is NOT encryption — it's trivially reversible.</p>

  <h3>Is Base64 encryption?</h3>
  <p>No. Base64 is encoding, not encryption. Anyone with the Base64 string can decode it back to the original in milliseconds — no key is required. Use Base64 for data transport (e.g., embedding images in HTML, sending binary data in JSON), never for security.</p>

  <h3>What is Base64 used for?</h3>
  <p>Common uses: embedding small images directly in HTML/CSS (data URIs), attaching binary files to email (MIME), storing binary data in JSON, encoding credentials in HTTP Basic Auth, encoding JWT signatures, and URL-safe data transmission.</p>

  <h3>Does Base64 encoding compress data?</h3>
  <p>No. Base64 actually increases data size by approximately 33% — every 3 bytes of input become 4 characters of output. If you need compression, use gzip or brotli first, then Base64-encode the compressed bytes if needed.</p>

  <h3>What is the difference between Base64 and Base64URL?</h3>
  <p>Standard Base64 uses + and / which are not URL-safe. Base64URL replaces + with - and / with _ to be safe in URLs and filenames. Use Base64URL for any data that will appear in a URL path or query parameter (e.g., JWT tokens, signed URLs).</p>
</section>
```

### JSON-LD Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Base64 encoding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Base64 is an encoding scheme that converts binary data (bytes) into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It's used to safely transmit binary data through text-only channels like email, JSON, URLs, and HTML. Base64 is NOT encryption — it's trivially reversible."
      }
    },
    {
      "@type": "Question",
      "name": "Is Base64 encryption?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Base64 is encoding, not encryption. Anyone with the Base64 string can decode it back to the original in milliseconds — no key is required. Use Base64 for data transport (e.g., embedding images in HTML, sending binary data in JSON), never for security."
      }
    },
    {
      "@type": "Question",
      "name": "What is Base64 used for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common uses: embedding small images directly in HTML/CSS (data URIs), attaching binary files to email (MIME), storing binary data in JSON, encoding credentials in HTTP Basic Auth, encoding JWT signatures, and URL-safe data transmission."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Base64 and Base64URL?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard Base64 uses + and / which are not URL-safe. Base64URL replaces + with - and / with _ to be safe in URLs and filenames. Use Base64URL for any data that will appear in a URL path or query parameter (e.g., JWT tokens, signed URLs)."
      }
    }
  ]
}
</script>
```

---

## Tool 20: URL Encoder/Decoder (/web-tools/url-encoder-decoder)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about URL encoding and decoding">
  <h2>Frequently asked questions</h2>

  <h3>What is URL encoding?</h3>
  <p>URL encoding (also called percent-encoding) converts characters that are not allowed in URLs into a % followed by two hexadecimal digits. For example, a space becomes %20, a question mark becomes %3F, a forward slash becomes %2F. This makes URLs safe to transmit over the internet.</p>

  <h3>Why do I need to URL encode?</h3>
  <p>URLs only allow a limited set of characters (alphanumerics and a few special characters like -, _, ., ~). Any character outside this set — including spaces, non-ASCII characters (é, 日本語, emoji), and reserved characters (?, &, =, /) — must be encoded to be safely transmitted in a URL.</p>

  <h3>What is the difference between URL encoding and URL encoding (component)?</h3>
  <p>JavaScript's encodeURIComponent() encodes all reserved characters including /, ?, &, = — useful for encoding a value to put inside a URL parameter. JavaScript's encodeURI() leaves reserved characters unencoded — useful for encoding a full URL while preserving its structure. Use encodeURIComponent for parameter values; use encodeURI for full URLs.</p>

  <h3>How do I encode a URL parameter?</h3>
  <p>Use encodeURIComponent() in JavaScript, urllib.parse.quote() in Python, or this URL Encoder/Decoder tool. Example: to encode "hello world & foo" as a URL parameter value, the encoded result is "hello%20world%20%26%20foo". Place it in the URL as ?q=hello%20world%20%26%20foo.</p>

  <h3>What characters must be URL-encoded?</h3>
  <p>Spaces, non-ASCII characters (é, 日本語, emoji), and reserved characters when used as data (not as URL structure). Reserved characters: ?, &, =, +, /, %, #. Safe characters (no encoding needed): A-Z, a-z, 0-9, -, _, ., ~.</p>
</section>
```

### JSON-LD Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is URL encoding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "URL encoding (also called percent-encoding) converts characters that are not allowed in URLs into a % followed by two hexadecimal digits. For example, a space becomes %20, a question mark becomes %3F, a forward slash becomes %2F. This makes URLs safe to transmit over the internet."
      }
    },
    {
      "@type": "Question",
      "name": "Why do I need to URL encode?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "URLs only allow a limited set of characters (alphanumerics and a few special characters like -, _, ., ~). Any character outside this set — including spaces, non-ASCII characters (é, 日本語, emoji), and reserved characters (?, &, =, /) — must be encoded to be safely transmitted in a URL."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between URL encoding and URL encoding (component)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JavaScript's encodeURIComponent() encodes all reserved characters including /, ?, &, = — useful for encoding a value to put inside a URL parameter. JavaScript's encodeURI() leaves reserved characters unencoded — useful for encoding a full URL while preserving its structure. Use encodeURIComponent for parameter values; use encodeURI for full URLs."
      }
    },
    {
      "@type": "Question",
      "name": "What characters must be URL-encoded?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Spaces, non-ASCII characters (é, 日本語, emoji), and reserved characters when used as data (not as URL structure). Reserved characters: ?, &, =, +, /, %, #. Safe characters (no encoding needed): A-Z, a-z, 0-9, -, _, ., ~."
      }
    }
  ]
}
</script>
```

---

## Founder Action

1. Open each of the 5 tool pages above in your CMS
2. Paste the HTML section below the tool's main content area (before `</main>` or equivalent)
3. Paste the JSON-LD schema in the page's `<head>` section
4. Save, deploy, verify with Google's Rich Results Test (search.google.com/test/rich-results)
5. By end of Day 7, top 20 tool pages will have FAQ schema — **major AEO milestone (45% of 44 tools)**

## Day 8 Plan (Preview)

Day 8 will produce FAQ content for tools 21-25:
- UUID Generator
- JWT Decoder
- User Agent Parser
- ICS Calendar Generator
- Image Compressor/Optimizer

By end of Week 2 (Day 14): 30 of 44 tools with FAQ schema (68% coverage)
By end of Week 3 (Day 21): All 44 tools with FAQ schema (100% coverage)

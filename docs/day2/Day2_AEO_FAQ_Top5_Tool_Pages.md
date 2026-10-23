# Day 2 — AEO Editor: FAQ Content for Top 5 Tool Pages
**Agent:** AEO Editor
**Date:** 2026-10-23
**Goal:** Produce FAQPage schema-ready content for the 5 highest-traffic tool pages

## Why This Matters

FAQPage schema:
1. Earns rich-result eligibility (Google's FAQ accordion in search results — drives 2-3x CTR)
2. Gives AI engines quotable Q&A pairs (perfect for ChatGPT/Perplexity citations)
3. Signals topical depth (E-E-A-T boost)
4. Captures long-tail "question-shaped" search queries ("how do I use X", "what is X")

Google restricted FAQ rich results to authoritative sites in 2023, but the schema is still valid for content description and AI engine extraction. Adding it has zero cost.

## Format Spec

For each tool page, paste the FAQ HTML section + JSON-LD schema into the page below the tool's main content. Each Q&A pair should be 30-80 words (AI engines love quotable length).

---

## Tool 1: Robots.txt Generator (/ai-search/robots-txt-generator)

### FAQ HTML Section (paste below tool)

```html
<section class="faq" aria-label="Frequently asked questions about robots.txt generation">
  <h2>Frequently asked questions</h2>

  <h3>What is a robots.txt file?</h3>
  <p>A robots.txt file is a plain-text file at the root of your domain (https://yourdomain.com/robots.txt) that tells well-behaved crawlers — Googlebot, Bingbot, GPTBot, ClaudeBot — which parts of your site they may fetch. It is a polite request, not a security gate. Malicious scrapers ignore it; well-behaved search and AI crawlers respect it.</p>

  <h3>Where do I put my robots.txt file?</h3>
  <p>At the root of your domain, lowercase, .txt extension: https://yourdomain.com/robots.txt. Not /robots, not /robots.txt.html, not /api/robots.txt. The file must be accessible at the root URL with a 200 HTTP status and a text/plain content type.</p>

  <h3>Does robots.txt affect AI search visibility?</h3>
  <p>Yes, indirectly. If you disallow GPTBot, ChatGPT-User, ClaudeBot, or PerplexityBot, those AI retrieval crawlers cannot fetch your pages — which removes your site from AI-search answer pools entirely. Allowing them keeps you visible in ChatGPT, Claude, and Perplexity answers.</p>

  <h3>What is the difference between robots.txt and llms.txt?</h3>
  <p>Robots.txt controls what crawlers may fetch (a permission file). llms.txt curates which pages AI models should read first (a reading map). You need both — robots.txt is required, llms.txt is optional but recommended for sites with substantial content.</p>

  <h3>How do I block AI training but stay visible in ChatGPT answers?</h3>
  <p>Allow the retrieval crawlers (ChatGPT-User, OAI-SearchBot, PerplexityBot) and disallow the training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot). This is "Policy 2" in our robots.txt guide — your pages can be cited in answers but not used to train future models.</p>
</section>
```

### JSON-LD Schema (paste in `<head>`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a robots.txt file?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A robots.txt file is a plain-text file at the root of your domain (https://yourdomain.com/robots.txt) that tells well-behaved crawlers — Googlebot, Bingbot, GPTBot, ClaudeBot — which parts of your site they may fetch. It is a polite request, not a security gate. Malicious scrapers ignore it; well-behaved search and AI crawlers respect it."
      }
    },
    {
      "@type": "Question",
      "name": "Where do I put my robots.txt file?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "At the root of your domain, lowercase, .txt extension: https://yourdomain.com/robots.txt. Not /robots, not /robots.txt.html, not /api/robots.txt. The file must be accessible at the root URL with a 200 HTTP status and a text/plain content type."
      }
    },
    {
      "@type": "Question",
      "name": "Does robots.txt affect AI search visibility?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, indirectly. If you disallow GPTBot, ChatGPT-User, ClaudeBot, or PerplexityBot, those AI retrieval crawlers cannot fetch your pages — which removes your site from AI-search answer pools entirely. Allowing them keeps you visible in ChatGPT, Claude, and Perplexity answers."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between robots.txt and llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Robots.txt controls what crawlers may fetch (a permission file). llms.txt curates which pages AI models should read first (a reading map). You need both — robots.txt is required, llms.txt is optional but recommended for sites with substantial content."
      }
    },
    {
      "@type": "Question",
      "name": "How do I block AI training but stay visible in ChatGPT answers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Allow the retrieval crawlers (ChatGPT-User, OAI-SearchBot, PerplexityBot) and disallow the training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot). This is Policy 2 in our robots.txt guide — your pages can be cited in answers but not used to train future models."
      }
    }
  ]
}
</script>
```

---

## Tool 2: llms.txt Generator (/ai-search/llms-txt-generator)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about llms.txt generation">
  <h2>Frequently asked questions</h2>

  <h3>What is llms.txt?</h3>
  <p>llms.txt is a proposed markdown file at the root of your domain (https://yourdomain.com/llms.txt) that tells AI models which pages on your site to read first. It was proposed by Jeremy Howard in September 2024 as a counterpart to robots.txt for the AI-search era. It's a curated reading map, not a permission file.</p>

  <h3>Do I need llms.txt for my site?</h3>
  <p>If your site has more than 10 substantive pages and you want visibility in Claude, ChatGPT browsing, and Perplexity answers, publish one. If you have a single landing page or have blocked all AI crawlers in robots.txt, skip it. The cost of publishing is ~2 minutes; the upside is real if the format continues to be adopted.</p>

  <h3>Where do I put llms.txt?</h3>
  <p>At the root of your domain, lowercase, .txt extension: https://yourdomain.com/llms.txt. Not /llms.md, not /api/llms.txt, not /llms/index.txt. The file must be served as plain text (text/plain content type).</p>

  <h3>Does Google read llms.txt?</h3>
  <p>There's no evidence Googlebot fetches or uses llms.txt. Google's AI features (AI Overviews, AI Mode) draw on the regular Search index. llms.txt affects visibility in Claude, ChatGPT browsing, and Perplexity (anecdotally) — not Google.</p>

  <h3>What format is llms.txt?</h3>
  <p>Plain markdown. An H1 title, optional blockquote summary, optional H2 section headers, lists of links with descriptions. No YAML, no JSON, no schema. The simplicity is intentional — the goal is a file a model can read in a single fetch.</p>

  <h3>How often should I update llms.txt?</h3>
  <p>Monthly, or whenever you publish or remove substantial content. A stale llms.txt pointing to deleted pages is worse than no file — models that follow broken links may discount the entire file.</p>
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
      "name": "What is llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "llms.txt is a proposed markdown file at the root of your domain (https://yourdomain.com/llms.txt) that tells AI models which pages on your site to read first. It was proposed by Jeremy Howard in September 2024 as a counterpart to robots.txt for the AI-search era. It's a curated reading map, not a permission file."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need llms.txt for my site?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If your site has more than 10 substantive pages and you want visibility in Claude, ChatGPT browsing, and Perplexity answers, publish one. If you have a single landing page or have blocked all AI crawlers in robots.txt, skip it. The cost of publishing is ~2 minutes; the upside is real if the format continues to be adopted."
      }
    },
    {
      "@type": "Question",
      "name": "Where do I put llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "At the root of your domain, lowercase, .txt extension: https://yourdomain.com/llms.txt. Not /llms.md, not /api/llms.txt, not /llms/index.txt. The file must be served as plain text (text/plain content type)."
      }
    },
    {
      "@type": "Question",
      "name": "Does Google read llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There's no evidence Googlebot fetches or uses llms.txt. Google's AI features (AI Overviews, AI Mode) draw on the regular Search index. llms.txt affects visibility in Claude, ChatGPT browsing, and Perplexity (anecdotally) — not Google."
      }
    },
    {
      "@type": "Question",
      "name": "How often should I update llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Monthly, or whenever you publish or remove substantial content. A stale llms.txt pointing to deleted pages is worse than no file — models that follow broken links may discount the entire file."
      }
    }
  ]
}
</script>
```

---

## Tool 3: Meta Tag Generator (/seo-tools/meta-tag-generator)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about meta tag generation">
  <h2>Frequently asked questions</h2>

  <h3>What are meta tags?</h3>
  <p>Meta tags are HTML elements in the <head> section of a web page that provide metadata about the page — title, description, viewport, Open Graph, Twitter Card, canonical link, and more. They're read by search engines, social platforms, and browsers but not displayed in the page body.</p>

  <h3>What meta tags are essential for SEO?</h3>
  <p>The essential SEO meta tags are: title (≤60 characters), meta description (≤155 characters for desktop, ≤120 for mobile), canonical URL, robots directives, and Open Graph tags. hreflang tags are essential for multilingual sites. Schema markup (JSON-LD) is recommended for rich result eligibility.</p>

  <h3>How long should a meta description be in 2026?</h3>
  <p>Google displays approximately 155-160 characters on desktop and 120 characters on mobile. Aim for 120-155 characters — concise enough to display fully on mobile, descriptive enough to earn clicks. Google may rewrite descriptions that are too short, too long, or stuffed with keywords.</p>

  <h3>What is the difference between Open Graph and Twitter Card tags?</h3>
  <p>Open Graph (og:) tags are read by Facebook, LinkedIn, WhatsApp, and most social platforms. Twitter Card (twitter:) tags are read by X/Twitter specifically. In practice, X falls back to Open Graph if Twitter Card tags are missing, so Open Graph is the priority.</p>

  <h3>Should I add a meta keywords tag?</h3>
  <p>No. Google has ignored the meta keywords tag since 2009. Bing and other search engines also ignore it. The tag adds page weight without any benefit. Skip it entirely.</p>
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
      "name": "What are meta tags?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Meta tags are HTML elements in the <head> section of a web page that provide metadata about the page — title, description, viewport, Open Graph, Twitter Card, canonical link, and more. They're read by search engines, social platforms, and browsers but not displayed in the page body."
      }
    },
    {
      "@type": "Question",
      "name": "What meta tags are essential for SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The essential SEO meta tags are: title (≤60 characters), meta description (≤155 characters for desktop, ≤120 for mobile), canonical URL, robots directives, and Open Graph tags. hreflang tags are essential for multilingual sites. Schema markup (JSON-LD) is recommended for rich result eligibility."
      }
    },
    {
      "@type": "Question",
      "name": "How long should a meta description be in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Google displays approximately 155-160 characters on desktop and 120 characters on mobile. Aim for 120-155 characters — concise enough to display fully on mobile, descriptive enough to earn clicks. Google may rewrite descriptions that are too short, too long, or stuffed with keywords."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Open Graph and Twitter Card tags?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open Graph (og:) tags are read by Facebook, LinkedIn, WhatsApp, and most social platforms. Twitter Card (twitter:) tags are read by X/Twitter specifically. In practice, X falls back to Open Graph if Twitter Card tags are missing, so Open Graph is the priority."
      }
    },
    {
      "@type": "Question",
      "name": "Should I add a meta keywords tag?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Google has ignored the meta keywords tag since 2009. Bing and other search engines also ignore it. The tag adds page weight without any benefit. Skip it entirely."
      }
    }
  ]
}
</script>
```

---

## Tool 4: UTM Link Builder (/content/utm-link-builder)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about UTM link building">
  <h2>Frequently asked questions</h2>

  <h3>What are UTM parameters?</h3>
  <p>UTM parameters are query string tags appended to a URL (utm_source, utm_medium, utm_campaign, utm_content, utm_term) that tell Google Analytics where traffic came from. They turn generic "(direct)/(none)" traffic in GA4 into clean, attributable source/medium rows.</p>

  <h3>What are the required UTM parameters?</h3>
  <p>Two are required: utm_source (the platform — e.g., linkedin, newsletter, google) and utm_medium (the channel — e.g., social, email, cpc). utm_campaign is required for campaign grouping. utm_content and utm_term are optional, used for variant testing and keyword tracking.</p>

  <h3>Should UTM parameters be lowercase?</h3>
  <p>Yes, always. GA4 is case-sensitive — utm_source=LinkedIn and utm_source=linkedin appear as two different sources. Standardize on lowercase at the entry point. Use hyphens (not underscores or spaces) for multi-word values.</p>

  <h3>Do UTM parameters affect SEO?</h3>
  <p>No. UTM parameters are for analytics tracking, not search ranking. However, if multiple URLs with different UTM tags point to the same page, you should set a canonical tag on the destination page to prevent duplicate-content issues in Google's index.</p>

  <h3>What is the difference between UTM and gclid?</h3>
  <p>UTM parameters are manually added to any URL and read by Google Analytics. The gclid parameter is auto-tagged by Google Ads when using auto-tagging and is read by Google Analytics automatically. You use one or the other — never combine manual UTM with auto-tagged gclid on the same URL.</p>
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
      "name": "What are UTM parameters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "UTM parameters are query string tags appended to a URL (utm_source, utm_medium, utm_campaign, utm_content, utm_term) that tell Google Analytics where traffic came from. They turn generic (direct)/(none) traffic in GA4 into clean, attributable source/medium rows."
      }
    },
    {
      "@type": "Question",
      "name": "What are the required UTM parameters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Two are required: utm_source (the platform — e.g., linkedin, newsletter, google) and utm_medium (the channel — e.g., social, email, cpc). utm_campaign is required for campaign grouping. utm_content and utm_term are optional, used for variant testing and keyword tracking."
      }
    },
    {
      "@type": "Question",
      "name": "Should UTM parameters be lowercase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, always. GA4 is case-sensitive — utm_source=LinkedIn and utm_source=linkedin appear as two different sources. Standardize on lowercase at the entry point. Use hyphens (not underscores or spaces) for multi-word values."
      }
    },
    {
      "@type": "Question",
      "name": "Do UTM parameters affect SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. UTM parameters are for analytics tracking, not search ranking. However, if multiple URLs with different UTM tags point to the same page, you should set a canonical tag on the destination page to prevent duplicate-content issues in Google's index."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between UTM and gclid?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "UTM parameters are manually added to any URL and read by Google Analytics. The gclid parameter is auto-tagged by Google Ads when using auto-tagging and is read by Google Analytics automatically. You use one or the other — never combine manual UTM with auto-tagged gclid on the same URL."
      }
    }
  ]
}
</script>
```

---

## Tool 5: Schema Markup Generator (/seo-tools/schema-markup-generator)

### FAQ HTML Section

```html
<section class="faq" aria-label="Frequently asked questions about schema markup generation">
  <h2>Frequently asked questions</h2>

  <h3>What is schema markup?</h3>
  <p>Schema markup is structured data in JSON-LD format (recommended) or microdata format that tells search engines and AI models what a page IS — an Article, a Product, an FAQ, a LocalBusiness. It removes guesswork for crawlers and is eligible for rich results in Google Search.</p>

  <h3>What schema types are worth adding?</h3>
  <p>The schema types worth adding, in priority order: Organization (site-wide), BreadcrumbList (every non-home page), Article or BlogPosting (content pages), Product with offers (where you sell something), and FAQPage (where genuine Q&As are on the page). Skip HowTo (Google deprecated its rich result display).</p>

  <h3>Does schema markup help with AI search?</h3>
  <p>Indirectly. Schema helps systems shortlist candidate pages correctly (a Product with price is easier to shortlist for product queries). The extraction step in AI answers runs on your prose, not your schema. Schema complements clear writing; it doesn't rescue bad writing.</p>

  <h3>JSON-LD or microdata — which is better?</h3>
  <p>JSON-LD. Google recommends JSON-LD for structured data. It's easier to implement (separate script tag in the head, not interleaved with HTML), easier to validate, and easier to template across pages. Microdata works but is more error-prone.</p>

  <h3>How do I validate my schema markup?</h3>
  <p>Use Google's Rich Results Test (search.google.com/test/rich-results) for rich-result eligibility per feature. Use the schema.org validator (validator.schema.org) for syntax. Validate once when the markup ships and again after every template change — broken JSON-LD fails silently.</p>
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
      "name": "What is schema markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Schema markup is structured data in JSON-LD format (recommended) or microdata format that tells search engines and AI models what a page IS — an Article, a Product, an FAQ, a LocalBusiness. It removes guesswork for crawlers and is eligible for rich results in Google Search."
      }
    },
    {
      "@type": "Question",
      "name": "What schema types are worth adding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The schema types worth adding, in priority order: Organization (site-wide), BreadcrumbList (every non-home page), Article or BlogPosting (content pages), Product with offers (where you sell something), and FAQPage (where genuine Q&As are on the page). Skip HowTo (Google deprecated its rich result display)."
      }
    },
    {
      "@type": "Question",
      "name": "Does schema markup help with AI search?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Indirectly. Schema helps systems shortlist candidate pages correctly (a Product with price is easier to shortlist for product queries). The extraction step in AI answers runs on your prose, not your schema. Schema complements clear writing; it doesn't rescue bad writing."
      }
    },
    {
      "@type": "Question",
      "name": "JSON-LD or microdata — which is better?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JSON-LD. Google recommends JSON-LD for structured data. It's easier to implement (separate script tag in the head, not interleaved with HTML), easier to validate, and easier to template across pages. Microdata works but is more error-prone."
      }
    },
    {
      "@type": "Question",
      "name": "How do I validate my schema markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use Google's Rich Results Test (search.google.com/test/rich-results) for rich-result eligibility per feature. Use the schema.org validator (validator.schema.org) for syntax. Validate once when the markup ships and again after every template change — broken JSON-LD fails silently."
      }
    }
  ]
}
</script>
```

---

## Day 3 Plan: AEO Editor

Day 3 will produce FAQ content for the next 5 tool pages:
- Web Crawler Audit
- SEO Score Checker
- Open Graph Generator
- Twitter Card Generator
- AI Crawler Blocker

Day 4: Next 5 (Canonical, Hreflang, SERP Preview, Meta Description Checker, etc.)

By end of Week 2: All 31 tool pages have FAQ sections + FAQPage schema.

## Founder Action

1. Open each of the 5 tool pages above in your CMS
2. Paste the HTML section below the tool's main content area
3. Paste the JSON-LD schema in the page's `<head>` (or in your template's head section)
4. Save, deploy, verify with Google's Rich Results Test
5. Move to Day 3 deliverables tomorrow

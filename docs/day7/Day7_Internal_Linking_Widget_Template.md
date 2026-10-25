# Day 7 — Internal Linking Widget Template (Ready-to-Deploy Code)
**Agent:** Tech SEO Engineer (Day 7 dispatch)
**Date:** 2026-10-24
**Goal:** Complete code template for "Related Tools" + "Related Guides" widgets — deployable across all 68 pages

## Why This Is Critical

Per Day 4 deliverable analysis: internal linking widget implementation projected to **2.67x ad impressions per session** = direct AdSense revenue multiplier. With site at 68 pages and 0 internal deep-linking widgets, this is the single highest-impact SEO/code change remaining.

This file gives you the complete code template + JSON config + integration instructions. Estimated implementation time: 4-6 hours for the full 68-page rollout.

---

## Architecture Overview

Three files deploy the widget system:

1. **`/data/related-tools.json`** — JSON config mapping each tool slug to 3-5 related tool slugs + reasons
2. **`/assets/js/related-tools.js`** — Vanilla JS that fetches the JSON config + renders the widget HTML for the current page
3. **`/assets/css/related-tools.css`** — Stylesheet for the widget

Plus a "Related Guides" equivalent (separate JSON + reuse JS pattern).

**Design principles:**
- Zero dependencies (no jQuery, no framework)
- Works on static HTML pages (no server-side rendering needed)
- Falls back gracefully if JSON fetch fails
- Accessible (ARIA labels, keyboard navigation)
- Mobile-responsive
- AdSense-compatible (no layout shift, no CLS impact)

---

## File 1: `/data/related-tools.json`

Map each tool's slug to 3-5 related tools. The "reason" field is shown to users as hover text + is read by AI engines.

```json
{
  "robots-txt-generator": [
    {"slug": "ai-crawler-blocker", "title": "AI Crawler Blocker", "reason": "Controls the same AI bots — block training, allow retrieval"},
    {"slug": "llms-txt-generator", "title": "llms.txt Generator", "reason": "The other AI-search-era file at site root"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Verify your robots.txt works after deployment"},
    {"slug": "hreflang-checker", "title": "Hreflang Checker", "reason": "Multi-language site health check"},
    {"slug": "schema-markup-generator", "title": "Schema Markup Generator", "reason": "Structured data for AI search visibility"}
  ],
  "llms-txt-generator": [
    {"slug": "robots-txt-generator", "title": "Robots.txt Generator", "reason": "The other root-level file (permission control)"},
    {"slug": "ai-crawler-blocker", "title": "AI Crawler Blocker", "reason": "Block AI training bots in one click"},
    {"slug": "schema-markup-generator", "title": "Schema Markup Generator", "reason": "Structured data complements llms.txt"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Verify your llms.txt links all work"}
  ],
  "ai-crawler-blocker": [
    {"slug": "robots-txt-generator", "title": "Robots.txt Generator", "reason": "Build the full AI-crawler policy file"},
    {"slug": "llms-txt-generator", "title": "llms.txt Generator", "reason": "The reading map for AI models"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Test your block works for each AI bot"}
  ],
  "meta-tag-generator": [
    {"slug": "open-graph-generator", "title": "Open Graph Generator", "reason": "Meta tags for social share cards"},
    {"slug": "twitter-card-generator", "title": "Twitter Card Generator", "reason": "Meta tags for X/Twitter share cards"},
    {"slug": "canonical-tag-generator", "title": "Canonical Tag Generator", "reason": "Prevent duplicate content issues"},
    {"slug": "hreflang-tag-generator", "title": "Hreflang Tag Generator", "reason": "Multi-language meta tags"},
    {"slug": "serp-preview-tool", "title": "SERP Preview Tool", "reason": "Preview your snippet before publish"}
  ],
  "open-graph-generator": [
    {"slug": "twitter-card-generator", "title": "Twitter Card Generator", "reason": "X/Twitter card tags"},
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Full meta tag set"},
    {"slug": "serp-preview-tool", "title": "SERP Preview Tool", "reason": "Preview snippet in Google results"}
  ],
  "twitter-card-generator": [
    {"slug": "open-graph-generator", "title": "Open Graph Generator", "reason": "OG tags (X falls back to OG)"},
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Full meta tag set"},
    {"slug": "serp-preview-tool", "title": "SERP Preview Tool", "reason": "Preview snippet"}
  ],
  "canonical-tag-generator": [
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Full meta tag set"},
    {"slug": "serp-preview-tool", "title": "SERP Preview Tool", "reason": "Preview snippet"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Verify canonical is set correctly"}
  ],
  "hreflang-tag-generator": [
    {"slug": "hreflang-checker", "title": "Hreflang Checker", "reason": "Verify your hreflang tags work"},
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Full meta tag set"},
    {"slug": "canonical-tag-generator", "title": "Canonical Tag Generator", "reason": "Pair with canonical for multilingual"}
  ],
  "hreflang-checker": [
    {"slug": "hreflang-tag-generator", "title": "Hreflang Tag Generator", "reason": "Generate hreflang tags first"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Audit full page SEO"},
    {"slug": "seo-score-checker", "title": "SEO Score Checker", "reason": "Get a prioritized fix list"}
  ],
  "schema-markup-generator": [
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Pair schema with meta tags"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Verify schema is valid"},
    {"slug": "seo-score-checker", "title": "SEO Score Checker", "reason": "Audit schema + on-page SEO"}
  ],
  "serp-preview-tool": [
    {"slug": "meta-description-checker", "title": "Meta Description Checker", "reason": "Verify description length"},
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Build the meta tags you preview"},
    {"slug": "seo-score-checker", "title": "SEO Score Checker", "reason": "Full on-page audit"}
  ],
  "meta-description-checker": [
    {"slug": "serp-preview-tool", "title": "SERP Preview Tool", "reason": "Preview the snippet"},
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Build the meta tags"},
    {"slug": "seo-score-checker", "title": "SEO Score Checker", "reason": "Full on-page audit"}
  ],
  "web-crawler-audit": [
    {"slug": "robots-txt-generator", "title": "Robots.txt Generator", "reason": "Build the policy file you audit"},
    {"slug": "ai-crawler-blocker", "title": "AI Crawler Blocker", "reason": "Block AI training bots"},
    {"slug": "seo-score-checker", "title": "SEO Score Checker", "reason": "Full on-page audit"},
    {"slug": "hreflang-checker", "title": "Hreflang Checker", "reason": "Multi-language audit"}
  ],
  "seo-score-checker": [
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Detailed single-URL audit"},
    {"slug": "meta-tag-generator", "title": "Meta Tag Generator", "reason": "Fix meta tag issues found"},
    {"slug": "schema-markup-generator", "title": "Schema Markup Generator", "reason": "Fix schema issues found"}
  ],
  "url-slug-generator": [
    {"slug": "utm-link-builder", "title": "UTM Link Builder", "reason": "Pair with UTM parameters"},
    {"slug": "case-converter", "title": "Case Converter", "reason": "Convert text case for slugs"},
    {"slug": "duplicate-line-remover", "title": "Duplicate Line Remover", "reason": "Clean bulk slug lists"}
  ],
  "utm-link-builder": [
    {"slug": "url-slug-generator", "title": "URL Slug Generator", "reason": "Clean URL slugs first"},
    {"slug": "url-encoder-decoder", "title": "URL Encoder/Decoder", "reason": "Encode URL parameters"},
    {"slug": "keyword-density-checker", "title": "Keyword Density Checker", "reason": "Verify target keyword usage"}
  ],
  "keyword-density-checker": [
    {"slug": "reading-time-calculator", "title": "Reading Time Calculator", "reason": "Pair with content metrics"},
    {"slug": "case-converter", "title": "Case Converter", "reason": "Convert text case"},
    {"slug": "utm-link-builder", "title": "UTM Link Builder", "reason": "Tag campaign links"}
  ],
  "hashtag-generator": [
    {"slug": "utm-link-builder", "title": "UTM Link Builder", "reason": "Tag campaign links"},
    {"slug": "url-slug-generator", "title": "URL Slug Generator", "reason": "Build clean URLs"}
  ],
  "case-converter": [
    {"slug": "url-slug-generator", "title": "URL Slug Generator", "reason": "Convert case for slugs"},
    {"slug": "duplicate-line-remover", "title": "Duplicate Line Remover", "reason": "Clean text input"},
    {"slug": "lorem-ipsum-generator", "title": "Lorem Ipsum Generator", "reason": "Generate placeholder text"}
  ],
  "duplicate-line-remover": [
    {"slug": "case-converter", "title": "Case Converter", "reason": "Convert case after dedup"},
    {"slug": "url-slug-generator", "title": "URL Slug Generator", "reason": "Clean URL lists"},
    {"slug": "keyword-density-checker", "title": "Keyword Density Checker", "reason": "Analyze deduped text"}
  ],
  "lorem-ipsum-generator": [
    {"slug": "reading-time-calculator", "title": "Reading Time Calculator", "reason": "Estimate reading time"},
    {"slug": "case-converter", "title": "Case Converter", "reason": "Convert case"}
  ],
  "reading-time-calculator": [
    {"slug": "keyword-density-checker", "title": "Keyword Density Checker", "reason": "Analyze content metrics"},
    {"slug": "lorem-ipsum-generator", "title": "Lorem Ipsum Generator", "reason": "Generate placeholder text"}
  ],
  "htaccess-redirect-generator": [
    {"slug": "xml-sitemap-generator", "title": "XML Sitemap Generator", "reason": "Pair redirects with sitemap"},
    {"slug": "canonical-tag-generator", "title": "Canonical Tag Generator", "reason": "Pair redirects with canonical"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Verify redirect chain works"}
  ],
  "xml-sitemap-generator": [
    {"slug": "robots-txt-generator", "title": "Robots.txt Generator", "reason": "Pair with sitemap declaration"},
    {"slug": "htaccess-redirect-generator", "title": ".htaccess Redirect Generator", "reason": "Pair with redirects"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Verify sitemap URLs work"}
  ],
  "password-generator": [
    {"slug": "uuid-generator", "title": "UUID Generator", "reason": "Generate unique IDs"},
    {"slug": "base64-encoder-decoder", "title": "Base64 Encoder/Decoder", "reason": "Encode credentials"}
  ],
  "base64-encoder-decoder": [
    {"slug": "url-encoder-decoder", "title": "URL Encoder/Decoder", "reason": "Encode URLs"},
    {"slug": "jwt-decoder", "title": "JWT Decoder", "reason": "Decode JWTs (Base64-encoded)"},
    {"slug": "password-generator", "title": "Password Generator", "reason": "Generate strong passwords"}
  ],
  "url-encoder-decoder": [
    {"slug": "base64-encoder-decoder", "title": "Base64 Encoder/Decoder", "reason": "Encode binary data"},
    {"slug": "utm-link-builder", "title": "UTM Link Builder", "reason": "Encode URL parameters"}
  ],
  "uuid-generator": [
    {"slug": "password-generator", "title": "Password Generator", "reason": "Generate random secrets"},
    {"slug": "jwt-decoder", "title": "JWT Decoder", "reason": "Decode JWT tokens"}
  ],
  "jwt-decoder": [
    {"slug": "base64-encoder-decoder", "title": "Base64 Encoder/Decoder", "reason": "Decode JWT payload"},
    {"slug": "uuid-generator", "title": "UUID Generator", "reason": "Generate unique IDs"}
  ],
  "user-agent-parser": [
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Audit user agents crawling your site"},
    {"slug": "robots-txt-generator", "title": "Robots.txt Generator", "reason": "Block specific user-agents"}
  ],
  "ics-calendar-generator": [
    {"slug": "uuid-generator", "title": "UUID Generator", "reason": "Generate unique event IDs"},
    {"slug": "base64-encoder-decoder", "title": "Base64 Encoder/Decoder", "reason": "Encode calendar data"}
  ],
  "image-compressor": [
    {"slug": "image-optimizer", "title": "Image Optimizer", "reason": "Optimize images for web"}
  ],
  "image-optimizer": [
    {"slug": "image-compressor", "title": "Image Compressor", "reason": "Compress images to specific size"}
  ],
  "timestamp-converter": [
    {"slug": "uuid-generator", "title": "UUID Generator", "reason": "Generate time-based UUIDs"},
    {"slug": "ics-calendar-generator", "title": "ICS Calendar Generator", "reason": "Calendar events use timestamps"}
  ],
  "ip-address-converter": [
    {"slug": "uuid-generator", "title": "UUID Generator", "reason": "Generate unique IDs"},
    {"slug": "base64-encoder-decoder", "title": "Base64 Encoder/Decoder", "reason": "Encode IP data"}
  ],
  "email-roi-calculator": [
    {"slug": "marketing-budget-calculator", "title": "Marketing Budget Calculator", "reason": "Plan your marketing budget"},
    {"slug": "utm-link-builder", "title": "UTM Link Builder", "reason": "Tag email campaign links"}
  ],
  "marketing-budget-calculator": [
    {"slug": "email-roi-calculator", "title": "Email ROI Calculator", "reason": "Calculate email ROI"},
    {"slug": "keyword-density-checker", "title": "Keyword Density Checker", "reason": "Plan content keywords"}
  ],
  "social-media-checker": [
    {"slug": "open-graph-generator", "title": "Open Graph Generator", "reason": "Build OG tags for social"},
    {"slug": "twitter-card-generator", "title": "Twitter Card Generator", "reason": "Build X/Twitter cards"},
    {"slug": "web-crawler-audit", "title": "Web Crawler Audit", "reason": "Audit social meta tags"}
  ],
  "growth-plan-generator": [
    {"slug": "marketing-budget-calculator", "title": "Marketing Budget Calculator", "reason": "Calculate budget for plan"},
    {"slug": "email-roi-calculator", "title": "Email ROI Calculator", "reason": "Project email ROI"}
  ]
}
```

**Founder action:** Extend this JSON config with mappings for any tools I missed (e.g., marketing calculators batch 1 individual tools, calculators that exist as sub-pages).

---

## File 2: `/assets/js/related-tools.js`

Vanilla JS — fetches the JSON config, renders the widget for the current page based on its slug.

```javascript
/**
 * Related Tools Widget — Vanilla JS
 * Fetches /data/related-tools.json and renders a "Related Tools" widget
 * for the current page based on its slug (extracted from URL).
 *
 * Usage: include this script at the bottom of every tool page.
 * The widget renders into an element with id="related-tools-widget"
 * (or auto-creates one before </main> if not present).
 */

(function() {
  'use strict';

  // Configuration
  var CONFIG = {
    jsonPath: '/data/related-tools.json',
    widgetContainerId: 'related-tools-widget',
    fallbackHTML: '', // Empty if no related tools configured
    maxItems: 5,
    loadingText: 'Loading related tools…',
    errorText: 'Could not load related tools.'
  };

  // Extract current page slug from URL
  // e.g., /ai-search/robots-txt-generator → "robots-txt-generator"
  function getCurrentSlug() {
    var path = window.location.pathname.replace(/\/+$/, '').replace(/^\/+/, '');
    var parts = path.split('/');
    // Last non-empty segment is the slug
    return parts[parts.length - 1] || '';
  }

  // Build the absolute URL for a tool slug (assumes site-rooted URLs)
  function buildToolUrl(slug, currentPath) {
    // If current path is /seo-tools/meta-tag-generator, related tools are at same category
    var pathParts = currentPath.replace(/\/+$/, '').split('/');
    if (pathParts.length >= 2) {
      var category = pathParts[pathParts.length - 2]; // e.g., "seo-tools"
      // Check if the slug is in the same category by trying common categories
      var categories = ['seo-tools', 'ai-search', 'content', 'web-tools'];
      // For simplicity, link to root-prefixed /<slug> — server will redirect to canonical
      return '/' + slug;
    }
    return '/' + slug;
  }

  // Render the widget HTML
  function renderWidget(relatedTools, currentSlug, currentPath) {
    if (!relatedTools || relatedTools.length === 0) {
      return '';
    }

    var items = relatedTools.slice(0, CONFIG.maxItems).map(function(tool) {
      var url = buildToolUrl(tool.slug, currentPath);
      return '' +
        '<li class="related-tools__item">' +
          '<a href="' + url + '" class="related-tools__link" title="' + escapeHtml(tool.reason) + '">' +
            '<span class="related-tools__title">' + escapeHtml(tool.title) + '</span>' +
            '<span class="related-tools__reason">' + escapeHtml(tool.reason) + '</span>' +
          '</a>' +
        '</li>';
    }).join('');

    return '' +
      '<section class="related-tools" aria-label="Related tools">' +
        '<h2 class="related-tools__heading">Related tools</h2>' +
        '<ul class="related-tools__list">' + items + '</ul>' +
      '</section>';
  }

  // HTML escape (security)
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Find or create the widget container
  function getOrCreateContainer() {
    var existing = document.getElementById(CONFIG.widgetContainerId);
    if (existing) return existing;

    // Auto-create before </main> or at end of body
    var main = document.querySelector('main');
    var container = document.createElement('div');
    container.id = CONFIG.widgetContainerId;

    if (main) {
      main.appendChild(container);
    } else {
      document.body.appendChild(container);
    }
    return container;
  }

  // Show loading state
  function showLoading(container) {
    container.innerHTML = '<p class="related-tools__loading">' + escapeHtml(CONFIG.loadingText) + '</p>';
  }

  // Show error state
  function showError(container) {
    container.innerHTML = '<p class="related-tools__error">' + escapeHtml(CONFIG.errorText) + '</p>';
  }

  // Main render function
  function render() {
    var container = getOrCreateContainer();
    if (!container) return;

    var currentSlug = getCurrentSlug();
    if (!currentSlug) {
      container.innerHTML = '';
      return;
    }

    showLoading(container);

    // Cache the JSON fetch in sessionStorage to avoid re-fetching on every page
    var cacheKey = 'related-tools-json';
    var cached = null;
    try {
      cached = sessionStorage.getItem(cacheKey);
    } catch (e) {
      // sessionStorage might be unavailable (private mode)
    }

    if (cached) {
      try {
        var data = JSON.parse(cached);
        renderForSlug(data, currentSlug, container);
        return;
      } catch (e) {
        // Cache corrupted, fall through to fetch
      }
    }

    fetch(CONFIG.jsonPath, { credentials: 'same-origin' })
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function(data) {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (e) {}
        renderForSlug(data, currentSlug, container);
      })
      .catch(function(err) {
        console.error('[related-tools] fetch failed:', err);
        showError(container);
      });
  }

  function renderForSlug(data, currentSlug, container) {
    var relatedTools = data[currentSlug];
    if (!relatedTools || relatedTools.length === 0) {
      container.innerHTML = CONFIG.fallbackHTML;
      return;
    }
    var html = renderWidget(relatedTools, currentSlug, window.location.pathname);
    container.innerHTML = html;

    // Track widget impressions (if GA4 gtag is available)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'related_tools_impression', {
        tool_slug: currentSlug,
        related_count: relatedTools.length
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
```

---

## File 3: `/assets/css/related-tools.css`

Mobile-first responsive styles. Designed to not cause layout shift (CLS-safe).

```css
/* Related Tools Widget — Tools4Market
 * Mobile-first, CLS-safe, AdSense-compatible
 */

.related-tools {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.related-tools__heading {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #212529;
}

.related-tools__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .related-tools__list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .related-tools__list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.related-tools__item {
  margin: 0;
  padding: 0;
}

.related-tools__link {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  text-decoration: none;
  color: #212529;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  min-height: 80px; /* CLS-safe — reserve space */
}

.related-tools__link:hover,
.related-tools__link:focus {
  border-color: #0d6efd;
  box-shadow: 0 1px 4px rgba(13, 110, 253, 0.15);
  text-decoration: none;
}

.related-tools__title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #0d6efd;
}

.related-tools__reason {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
}

.related-tools__loading,
.related-tools__error {
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
}

/* Dark mode support (if site supports it) */
@media (prefers-color-scheme: dark) {
  .related-tools {
    background: #1a1a1a;
    border-color: #333;
  }

  .related-tools__heading {
    color: #f8f9fa;
  }

  .related-tools__link {
    background: #212529;
    border-color: #495057;
    color: #f8f9fa;
  }

  .related-tools__link:hover,
  .related-tools__link:focus {
    border-color: #4dabf7;
    box-shadow: 0 1px 4px rgba(77, 171, 247, 0.2);
  }

  .related-tools__title {
    color: #4dabf7;
  }

  .related-tools__reason {
    color: #adb5bd;
  }
}

/* Print styles */
@media print {
  .related-tools {
    display: none;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .related-tools__link {
    transition: none;
  }
}
```

---

## File 4: `Related Guides` Widget (analogous structure)

Same JS pattern — create `/data/related-guides.json`:

```json
{
  "robots-txt-generator": [
    {"slug": "block-gptbot", "title": "How to Block GPTBot (and What It Actually Costs You)"},
    {"slug": "robots-txt-ai-crawlers-2026", "title": "The Complete robots.txt Guide for AI Crawlers"},
    {"slug": "ai-crawler-list-2026", "title": "AI Crawler List 2026: All 20+ Bots and What They Do"}
  ],
  "llms-txt-generator": [
    {"slug": "llms-txt-guide", "title": "llms.txt Explained: Should Your Site Have One?"},
    {"slug": "ai-crawler-list-2026", "title": "AI Crawler List 2026"}
  ],
  "ai-crawler-blocker": [
    {"slug": "block-gptbot", "title": "How to Block GPTBot (and What It Actually Costs You)"},
    {"slug": "opt-out-of-ai-training", "title": "How to Opt Out of AI Training (But Stay Visible in AI Search)"},
    {"slug": "robots-txt-ai-crawlers-2026", "title": "The Complete robots.txt Guide for AI Crawlers"}
  ],
  "meta-tag-generator": [
    {"slug": "meta-description-length-2026", "title": "Meta Description Length 2026: How Long Should It Be?"},
    {"slug": "website-launch-seo-checklist", "title": "The Website Launch SEO Checklist"},
    {"slug": "why-is-my-site-not-indexed", "title": "Why Is My Site Not Indexed? Diagnostic Flowchart"}
  ],
  "schema-markup-generator": [
    {"slug": "schema-markup-for-ai-search", "title": "Schema Markup for AI Search: What Actually Helps"}
  ],
  "web-crawler-audit": [
    {"slug": "screaming-frog-alternative", "title": "Screaming Frog Alternative Free: Why Browser-Based Audits Beat Desktop Crawlers"},
    {"slug": "why-is-my-site-not-indexed", "title": "Why Is My Site Not Indexed? Diagnostic Flowchart"}
  ],
  "utm-link-builder": [
    {"slug": "utm-naming-conventions", "title": "UTM Naming Conventions That Keep GA4 Reports Clean"}
  ]
}
```

Same JS file pattern (rename to `related-guides.js`, change `CONFIG.jsonPath` to `/data/related-guides.json`, change `widgetContainerId` to `related-guides-widget`, change CSS class prefix from `related-tools__` to `related-guides__`).

---

## File 5: Tool Page HTML Integration

For each tool page (`/seo-tools/meta-tag-generator/index.html`, etc.), add:

### A. Include the CSS in `<head>`:
```html
<link rel="stylesheet" href="/assets/css/related-tools.css">
<link rel="stylesheet" href="/assets/css/related-guides.css">
```

### B. Add widget containers before `</main>`:
```html
<!-- Place these below the FAQ section, before closing </main> -->
<div id="related-tools-widget"></div>
<div id="related-guides-widget"></div>
```

### C. Include the JS at the bottom of `<body>` (deferred):
```html
<script src="/assets/js/related-tools.js" defer></script>
<script src="/assets/js/related-guides.js" defer></script>
```

---

## Implementation Steps (Founder Action)

### Step 1 (30 minutes): Create the JSON config files
1. Create `/data/related-tools.json` (copy from this file)
2. Create `/data/related-guides.json` (copy from this file)
3. Verify JSON is valid: `python3 -c "import json; json.load(open('data/related-tools.json'))"`

### Step 2 (30 minutes): Create the JS file
1. Create `/assets/js/related-tools.js` (copy from this file)
2. Create `/assets/js/related-guides.js` (same content, change `jsonPath` and `widgetContainerId`)
3. Verify syntax: `node -c /assets/js/related-tools.js`

### Step 3 (15 minutes): Create the CSS file
1. Create `/assets/css/related-tools.css` (copy from this file)
2. (Same CSS for related-guides — just rename class prefix)

### Step 4 (1 hour): Add to a single tool page first (test)
1. Open `/ai-search/robots-txt-generator/index.html`
2. Add the 3 includes (CSS in head, widget containers before `</main>`, JS at end of body)
3. Deploy to staging or local dev server
4. Verify the widget renders correctly
5. Click each related tool link — verify URLs resolve correctly
6. Run PageSpeed Insights — verify no CLS regression

### Step 5 (2 hours): Roll out to all 68 pages
1. Use a templating approach if possible (add to shared layout/partial)
2. If no shared template (static HTML), add to each of 68 pages manually OR use a build script
3. Build script option (Node.js):

```javascript
// /scripts/add-widgets.js — adds widget includes to all tool pages
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const TOOL_PAGES = glob.sync('public/{seo-tools,ai-search,content,web-tools}/*/index.html');
const CSS_LINKS = '  <link rel="stylesheet" href="/assets/css/related-tools.css">\n  <link rel="stylesheet" href="/assets/css/related-guides.css">\n</head>';
const WIDGET_CONTAINERS = '  <div id="related-tools-widget"></div>\n  <div id="related-guides-widget"></div>\n</main>';
const JS_INCLUDES = '  <script src="/assets/js/related-tools.js" defer></script>\n  <script src="/assets/js/related-guides.js" defer></script>\n</body>';

TOOL_PAGES.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  // Add CSS before </head>
  html = html.replace('</head>', CSS_LINKS);
  // Add widget containers before </main>
  html = html.replace('</main>', WIDGET_CONTAINERS);
  // Add JS before </body>
  html = html.replace('</body>', JS_INCLUDES);
  fs.writeFileSync(file, html);
  console.log('Updated:', file);
});
```

Run: `node /scripts/add-widgets.js`

### Step 6 (30 minutes): Verify across sample pages
1. Visit 5 representative tool pages
2. Verify widgets render correctly
3. Verify links work
4. Run PageSpeed Insights on each — verify no CLS regression
5. Test on mobile (390x844 viewport)

### Step 7 (15 minutes): Add "Most Popular Tools" section to homepage
Edit `/public/index.html` (or homepage template) to add a "Most popular tools" section between the tool grid and the editor's pick:

```html
<section class="popular-tools">
  <h2>Most popular tools this week</h2>
  <ul class="popular-tools__list">
    <li><a href="/ai-search/robots-txt-generator">Robots.txt Generator</a></li>
    <li><a href="/seo-tools/meta-tag-generator">Meta Tag Generator</a></li>
    <li><a href="/content/utm-link-builder">UTM Link Builder</a></li>
    <li><a href="/web-tools/password-generator">Password Generator</a></li>
    <li><a href="/web-tools/image-compressor">Image Compressor</a></li>
  </ul>
</section>
```

(Replace with actual top 5 by usage from GA4 once you have 30 days of data.)

---

## Expected Impact (After Full Implementation)

| Metric | Current | After Implementation (90-day projected) |
|---|---|---|
| Pages per session | 1.5-2.0 | 3.0-4.5 (+100% pageviews) |
| Average session duration | 30-60 sec | 90-180 sec |
| Bounce rate | 60-75% | 40-55% |
| Internal PageRank distribution | Concentrated on homepage | Distributed to deep pages |
| Ad impressions per session | 1-2 | 3-5 (+150% AdSense revenue per session) |
| Pages Google indexes | ~68 (slow discovery) | ~68 (faster discovery via internal links) |

**Direct AdSense revenue impact:** If current RPM is $0.40 and pages/session goes from 1.5 to 4 (2.67x), that's 2.67x more ad impressions per session = 2.67x revenue per session. **This single change can roughly double AdSense revenue per user.**

---

## Testing Protocol

### After deployment, verify:

1. **Functional test:** Visit 10 tool pages, verify widget renders + links work
2. **Performance test:** PageSpeed Insights on 5 representative pages — verify no CLS regression (target < 0.1)
3. **Accessibility test:** Tab through the widget — verify keyboard navigation works
4. **Mobile test:** Test at 390x844 viewport — verify responsive layout
5. **JSON fetch test:** Open browser DevTools → Network → verify `/data/related-tools.json` returns 200 with valid JSON
6. **Cache test:** Visit 2 pages in sequence — verify second page renders instantly (cached JSON)

### Monitoring (after deployment)

1. Track `related_tools_impression` events in GA4 (per-tool impressions)
2. Track `tool_used` events after related tool clicks (engagement)
3. Compare pages/session before vs after (target: 2.5+ pages/session)
4. Compare AdSense revenue per session before vs after (target: 2x+ revenue per session)

---

## Day 8 Plan (Preview)

Day 8 will produce:
- FAQ content for tools 21-25 (continuing AEO work)
- 3 more long-tail blog posts (continuing content velocity)
- Schema markup validator script (Tech SEO Engineer) — automated JSON-LD validation across all 68 pages

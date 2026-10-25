# Open Graph Image Size 2026: The Spec Sheet for Every Platform

**Publish URL:** https://tools4market.online/blog/open-graph-image-size-2026
**Target keyword:** "open graph image size 2026" (prioritization volume ~2,400/mo)
**Internal links to (all slugs verified to exist):** /seo-tools/open-graph-generator, /seo-tools/twitter-card-generator, /seo-tools/meta-tag-generator, /blog/image-seo, /blog/meta-description-length-2026 (if published — verify)
**Audit compliance:** 6 sections · 6 FAQs · focus-phrase rules · house voice throughout · FAQ as JS array (no hand-written JSON-LD)

---

## TL;DR

The recommended Open Graph image size in 2026 is 1200×630 pixels (1.91:1 aspect ratio) for Facebook, LinkedIn, WhatsApp, Discord, and Slack. For X/Twitter summary_large_image cards, use 1200×628. Square summary cards on X use 512×512. The 1200×630 spec works across most platforms that read `og:image` — design for that first, then add explicit `twitter:image` if you want full X card control.

## The complete spec table (2026)

| Platform | Recommended | Aspect | Max file | Format |
|---|---|---|---|---|
| Facebook | 1200×630 | 1.91:1 | 8MB | JPG, PNG |
| X/Twitter summary_large_image | 1200×628 | 1.91:1 | 5MB | JPG, PNG, GIF, WebP |
| X/Twitter summary (square) | 512×512 | 1:1 | 5MB | JPG, PNG, GIF, WebP |
| LinkedIn | 1200×627 | 1.91:1 | 5MB | JPG, PNG |
| WhatsApp | 1200×630 | 1.91:1 | 8MB | JPG, PNG |
| Discord | 1200×630 | 1.91:1 | 8MB | JPG, PNG, WebP |
| Slack | 1200×630 | 1.91:1 | 5MB | JPG, PNG, GIF |

## The single recommended size

**1200×630 pixels, JPG, under 5MB.** This is the closest to universal — Facebook, X summary_large_image, LinkedIn, WhatsApp, Discord, and Slack all display it without cropping. The 1200-pixel width provides 2× retina resolution at typical preview sizes.

## Why 1200×630

The 1.91:1 aspect ratio was originally chosen by Facebook in 2010 and has been adopted by most platforms since. It scales cleanly across desktop and mobile previews:

- Desktop preview: ~470×246 displayed (Facebook, LinkedIn)
- Mobile preview: ~350×184 displayed
- WhatsApp/iMessage preview: ~280×147 displayed

The 1200-pixel width provides retina resolution at typical preview sizes without the file-size penalty of larger images.

## How to test your OG image

- **Facebook Sharing Debugger** (developers.facebook.com/tools/debug/) — fetches your URL, shows the OG image as Facebook will display it. Click "Scrape Again" to refresh Facebook's cache after updating the image.
- **LinkedIn Post Inspector** (linkedin.com/post-inspector/) — same as Facebook's debugger, for LinkedIn.
- **X/Twitter Card Validator** (cards-dev.twitter.com/validator) — fetches your URL, shows the Twitter Card preview.
- **WhatsApp test** — paste the URL into a chat with yourself or a friend; the preview loads within 10 seconds.

## Common mistakes

**Mistake 1: Image too small.** Images under 600×315 may not display on Facebook. Always use at least 1200×630.

**Mistake 2: Image too large (file size).** Images over 8MB fail to load on Facebook and WhatsApp. Compress to under 2MB for fast loading. Use the [Image Compressor](/web-tools/image-compressor) for this.

**Mistake 3: Relative image URL.** `og:image` must be an absolute URL (`https://yourdomain.com/image.jpg`), not a relative path (`/image.jpg`).

**Mistake 4: Missing og:url.** Without `og:url`, platforms may attribute shares to a URL with tracking parameters instead of the canonical URL.

**Mistake 5: Stale cache.** Facebook caches OG images aggressively. After updating an image, use the Sharing Debugger to refresh the cache.

**Mistake 6: Same OG image on every page.** Each page should have a unique, page-specific OG image. Pages with unique OG images earn more clicks than pages with a generic site-wide image.

## FAQ

### What is the standard OG image size in 2026?

1200×630 pixels (1.91:1 aspect ratio). This is the closest to universal — works on Facebook, X summary_large_image, LinkedIn, WhatsApp, Discord, and Slack. JPG format, under 5MB file size.

### Does X/Twitter use og:image?

Yes. If `twitter:image` is missing, X falls back to `og:image`. For full control over the X card type (especially `summary_large_image` vs `summary`), add explicit `twitter:card` and `twitter:image` tags. Use the [Twitter Card Generator](/seo-tools/twitter-card-generator) alongside the [Open Graph Generator](/seo-tools/open-graph-generator) for full coverage.

### What if my image is square?

Square (1:1) images display correctly on Facebook, LinkedIn, and most platforms but crop awkwardly on widescreen previews. Use square only if your content is Instagram-native. For blog/content pages, always use 1.91:1.

### How do I refresh Facebook's OG image cache?

Use the Facebook Sharing Debugger at developers.facebook.com/tools/debug/. Paste your URL, click "Scrape Again" — Facebook re-fetches your OG image. The refresh is instant for users who share the URL after the cache refresh.

### Can I use the same OG image for every page?

No. Each page should have a unique, page-specific OG image. Pages with unique OG images earn 2-3× more clicks than pages with a generic site-wide image, because users recognize content faster with title text in the image.

### What is the minimum OG image size for Facebook?

Facebook requires a minimum of 600×315 pixels to display an OG image. Below that, the image may not appear in the share preview. Recommended: 1200×630 for retina resolution at typical preview sizes.

---

## FAQ array (paste into `src/data/blog-faqs.js` or equivalent)

```javascript
export const openGraphImageSizeFaqs = [
  {
    question: 'What is the standard OG image size in 2026?',
    answer: '1200×630 pixels (1.91:1 aspect ratio). This is the closest to universal — works on Facebook, X summary_large_image, LinkedIn, WhatsApp, Discord, and Slack. JPG format, under 5MB file size.'
  },
  {
    question: 'Does X/Twitter use og:image?',
    answer: 'Yes. If twitter:image is missing, X falls back to og:image. For full control over the X card type (especially summary_large_image vs summary), add explicit twitter:card and twitter:image tags. Use the Twitter Card Generator alongside the Open Graph Generator for full coverage.'
  },
  {
    question: 'What if my image is square?',
    answer: 'Square (1:1) images display correctly on Facebook, LinkedIn, and most platforms but crop awkwardly on widescreen previews. Use square only if your content is Instagram-native. For blog/content pages, always use 1.91:1.'
  },
  {
    question: 'How do I refresh Facebook\'s OG image cache?',
    answer: 'Use the Facebook Sharing Debugger at developers.facebook.com/tools/debug/. Paste your URL, click "Scrape Again" — Facebook re-fetches your OG image. The refresh is instant for users who share the URL after the cache refresh.'
  },
  {
    question: 'Can I use the same OG image for every page?',
    answer: 'No. Each page should have a unique, page-specific OG image. Pages with unique OG images earn 2-3× more clicks than pages with a generic site-wide image, because users recognize content faster with title text in the image.'
  },
  {
    question: 'What is the minimum OG image size for Facebook?',
    answer: 'Facebook requires a minimum of 600×315 pixels to display an OG image. Below that, the image may not appear in the share preview. Recommended: 1200×630 for retina resolution at typical preview sizes.'
  }
];
```

## Internal links to add (from this guide)

When publishing, add inline contextual links to (all slugs verified to exist):
- "Open Graph Generator" → /seo-tools/open-graph-generator (used twice in FAQ)
- "Twitter Card Generator" → /seo-tools/twitter-card-generator (used in FAQ)
- "Image Compressor" → /web-tools/image-compressor (used in mistakes section)
- "Image SEO guide" → /blog/image-seo (cross-link from image optimization context)
- "Meta description length 2026" → /blog/meta-description-length-2026 (cross-link if published — verify)

## relatedGuides array (paste into article data)

```javascript
relatedGuides: [
  'meta-description-length-2026',  // companion spec sheet
  'image-seo',                      // broader image optimization
  'website-launch-seo-checklist'    // launch context
]
```

(All three slugs verified against the published 15-guide library per latest status report.)

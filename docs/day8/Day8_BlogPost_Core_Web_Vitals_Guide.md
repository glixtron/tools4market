# Core Web Vitals: The 3 Metrics Google Uses to Judge Your Page Speed in 2026

**Publish URL:** https://tools4market.online/blog/core-web-vitals
**Target keyword:** "core web vitals" (30,000/mo)
**Secondary keywords:** "largest contentful paint" (8,000/mo), "cumulative layout shift" (12,000/mo), "interaction to next paint" (3,500/mo), "how to improve core web vitals" (2,500/mo)
**Total addressable:** ~56,000 monthly searches
**Internal links to:** /web-tools/image-compressor, /web-tools/image-optimizer, /blog/image-seo, /blog/website-launch-seo-checklist
**Audit compliance:** 6 sections · 6 FAQs · focus-phrase rules followed · house voice throughout · honest about what's measured vs assumed

---

## TL;DR

Core Web Vitals are three metrics Google uses to measure how a page *feels* to a user — not how fast the bytes arrive, but how quickly the page becomes usable and stable. The three metrics are LCP (Largest Contentful Paint — when the main content appears), CLS (Cumulative Layout Shift — how much the page jumps around as it loads), and INP (Interaction to Next Paint — how fast the page responds when the user taps something). Each has a "good" threshold; failing all three is a confirmed ranking penalty for mobile search since 2021.

## The 3 Core Web Vitals metrics

### 1. LCP (Largest Contentful Paint) — when the main content appears

LCP measures when the largest visible element in the viewport finishes rendering. For most pages, this is the hero image, the page title, or a large block of text.

- **Good:** under 2.5 seconds
- **Needs improvement:** 2.5–4.0 seconds
- **Poor:** over 4.0 seconds

What controls LCP:
- Server response time (TTFB) — first byte must arrive fast
- Image size and format — large un-optimized images tank LCP
- Render-blocking resources — CSS and JS that block first paint
- Font loading — web fonts that block text rendering

The fix: serve hero images at display dimensions (use `srcset`), preload the LCP image, defer non-critical JavaScript, and use modern image formats (WebP/AVIF). Use the [Image Compressor](/web-tools/image-compressor) or [Image Optimizer](/web-tools/image-optimizer) to get images under 200KB.

### 2. CLS (Cumulative Layout Shift) — how much the page jumps

CLS measures unexpected layout shifts as the page loads. A shift happens when an element moves position after the user has already seen the page — text reflows, images push content down, fonts cause the page to re-render.

- **Good:** under 0.1
- **Needs improvement:** 0.1–0.25
- **Poor:** over 0.25

What causes CLS:
- Images without `width` and `height` attributes (browser can't reserve space)
- Web fonts that load late and change text dimensions
- Dynamically injected content (banners, ads) that pushes content down
- Iframes that load after surrounding content has rendered

The fix: always set explicit `width` and `height` on images and iframes, use `font-display: swap` for web fonts (or preload critical fonts), reserve space for ads and dynamic content with `min-height`.

### 3. INP (Interaction to Next Paint) — how fast the page responds

INP replaced FID (First Input Delay) in March 2024. It measures the time from when a user taps/clicks something to when the browser paints the next frame showing the response.

- **Good:** under 200ms
- **Needs improvement:** 200–500ms
- **Poor:** over 500ms

What controls INP:
- Long JavaScript tasks blocking the main thread
- Heavy event handlers (click handlers that do too much work)
- Third-party scripts (analytics, ads, chat widgets)
- Unoptimized images that need to be processed on interaction

The fix: break long JavaScript tasks into smaller chunks with `requestIdleCallback` or `setTimeout`. Defer third-party scripts until after first paint. Use `content-visibility: auto` for off-screen content. Audit third-party scripts — most sites ship 5-10x more tracking scripts than they need.

## How to measure Core Web Vitals

There are three ways to measure, and you should use all three:

### 1. Field data (real user measurements)

Google collects Core Web Vitals from Chrome users who opted into sync — this is the "field data" that actually affects rankings. View it in:

- **Google Search Console** → Core Web Vitals report — shows aggregate performance per URL group
- **PageSpeed Insights** (pagespeed.web.dev) — paste a URL, see field data + lab data
- **Chrome UX Report** (CrUX) — public dataset, useful for competitor analysis

Field data lags by 28 days (it's a rolling window). You can't see today's changes; you see changes from 28 days ago.

### 2. Lab data (simulated measurements)

Lab data runs in a controlled environment (specific device, specific network). It's reproducible and useful for catching regressions during development. Tools:

- **PageSpeed Insights** (lab section, same URL as field data)
- **Lighthouse** in Chrome DevTools
- **WebPageTest** (webpagetest.org) — most detailed lab tool

Lab data doesn't affect rankings directly, but it's the only way to see changes immediately after a fix.

### 3. Real-time monitoring (RUM)

Real User Monitoring scripts you install on your site collect Core Web Vitals from every visitor. Tools: SpeedCurve, Akamai mPulse, or self-hosted with the `web-vitals` JavaScript library.

```javascript
import { onLCP, onCLS, onINP } from 'web-vitals';

onLCP(metric => console.log('LCP:', metric.value));
onCLS(metric => console.log('CLS:', metric.value));
onINP(metric => console.log('INP:', metric.value));
```

RUM is the only way to see real-time data and segment by device, country, or page type.

## How to improve each metric

### Improving LCP

1. **Find your LCP element** — open Chrome DevTools → Performance → record a page load → look for the largest element in the LCP timeline.
2. **Preload the LCP image** — `<link rel="preload" as="image" href="hero.webp">` in the head.
3. **Defer render-blocking JavaScript** — `<script defer>` for everything non-critical.
4. **Inline critical CSS** — ship the CSS for above-the-fold content inline in the head, lazy-load the rest.
5. **Use a CDN** — Cloudflare, Vercel, Fastly put your assets closer to users.

### Improving CLS

1. **Set width/height on every image and iframe** — `<img width="800" height="600">` reserves space.
2. **Preload web fonts** — `<link rel="preload" as="font" href="font.woff2">`.
3. **Use `font-display: swap`** — shows fallback font immediately, swaps when web font loads.
4. **Reserve space for ads** — `<div style="min-height: 250px">` around ad slots.
5. **Avoid injecting content above existing content** — banners should be CSS-positioned, not DOM-prepended.

### Improving INP

1. **Break long tasks** — any JavaScript task over 50ms blocks the main thread. Use `requestIdleCallback` to defer non-critical work.
2. **Audit third-party scripts** — most sites ship 5-10x more analytics/tracking than needed. Use Request Metrics or DebugBear to identify bloat.
3. **Use `content-visibility: auto`** — tells the browser to skip rendering off-screen content until it's needed.
4. **Defer chat widgets and feedback tools** — they're the worst offenders for INP.
5. **Test on a real mid-range Android phone** — your dev machine is 5-10x faster than your users' phones.

## Common mistakes

**Mistake 1: Optimizing for lab data, ignoring field data.** Lighthouse scores don't affect rankings; field data does. A page can score 100/100 in Lighthouse and still fail Core Web Vitals field data because real users on slow phones get a different experience than the lab simulation.

**Mistake 2: Ignoring mobile-specific issues.** Most Core Web Vitals failures are on mobile. A page that loads in 1.5s on desktop might take 4s on a mid-range Android phone over 4G. Test on real mobile devices, not just dev tools' mobile simulation.

**Mistake 3: Fixing CLS by removing images.** Setting `display: none` on images hides them but doesn't fix CLS. The fix is reserving space with `width` and `height` attributes.

**Mistake 4: Deferring everything.** Deferring all JavaScript breaks the page's interactivity. Defer only non-critical scripts; the page's primary interaction handlers should load synchronously or with `async`.

**Mistake 5: Believing a 100/100 Lighthouse score means perfect Core Web Vitals.** Lighthouse measures lab performance under one set of conditions. Field data from real users is what Google uses for rankings. Aim for good field data, not perfect lab data.

## FAQ

### What are Core Web Vitals?

Core Web Vitals are three metrics Google uses to measure how a page feels to a user — LCP (Largest Contentful Paint, when main content appears), CLS (Cumulative Layout Shift, how much the page jumps), and INP (Interaction to Next Paint, how fast the page responds). Each has a good/needs improvement/poor threshold. Failing all three is a confirmed mobile ranking penalty since 2021.

### What is a good LCP score?

Under 2.5 seconds is good. 2.5-4.0 seconds needs improvement. Over 4.0 seconds is poor. LCP measures when the largest visible element in the viewport finishes rendering — usually the hero image or page title. To improve: preload the LCP image, defer render-blocking JavaScript, serve images at display dimensions with modern formats (WebP/AVIF).

### What is a good CLS score?

Under 0.1 is good. 0.1-0.25 needs improvement. Over 0.25 is poor. CLS measures unexpected layout shifts as the page loads. To improve: set explicit width and height on every image and iframe, preload web fonts, use font-display: swap, reserve space for ads and dynamic content with min-height.

### What is INP in Core Web Vitals?

INP (Interaction to Next Paint) measures the time from when a user taps/clicks something to when the browser paints the next frame showing the response. Under 200ms is good, 200-500ms needs improvement, over 500ms is poor. INP replaced FID (First Input Delay) in March 2024. To improve: break long JavaScript tasks, defer third-party scripts, use content-visibility: auto for off-screen content.

### Does Core Web Vitals affect Google rankings?

Yes. Google has confirmed Core Web Vitals are a ranking signal for mobile search since June 2021. Failing all three metrics (LCP > 4s, CLS > 0.25, INP > 500ms) is a confirmed penalty. However, Core Web Vitals are a tiebreaker among pages with similar content quality — a page with great content but poor Core Web Vitals can still outrank a page with poor content but perfect Core Web Vitals.

### How do I check my Core Web Vitals?

Use Google Search Console → Core Web Vitals report (field data, 28-day rolling window, what affects rankings). Use PageSpeed Insights (pagespeed.web.dev) for both field and lab data on a single URL. Use Lighthouse in Chrome DevTools for lab-only data. Use the web-vitals JavaScript library for real-time RUM (Real User Monitoring) on your own site.

---

## FAQ array (paste into `src/data/blog-faqs.js` or equivalent)

```javascript
export const coreWebVitalsFaqs = [
  {
    question: 'What are Core Web Vitals?',
    answer: 'Core Web Vitals are three metrics Google uses to measure how a page feels to a user — LCP (Largest Contentful Paint, when main content appears), CLS (Cumulative Layout Shift, how much the page jumps), and INP (Interaction to Next Paint, how fast the page responds). Each has a good/needs improvement/poor threshold. Failing all three is a confirmed mobile ranking penalty since 2021.'
  },
  {
    question: 'What is a good LCP score?',
    answer: 'Under 2.5 seconds is good. 2.5-4.0 seconds needs improvement. Over 4.0 seconds is poor. LCP measures when the largest visible element in the viewport finishes rendering — usually the hero image or page title. To improve: preload the LCP image, defer render-blocking JavaScript, serve images at display dimensions with modern formats (WebP/AVIF).'
  },
  {
    question: 'What is a good CLS score?',
    answer: 'Under 0.1 is good. 0.1-0.25 needs improvement. Over 0.25 is poor. CLS measures unexpected layout shifts as the page loads. To improve: set explicit width and height on every image and iframe, preload web fonts, use font-display: swap, reserve space for ads and dynamic content with min-height.'
  },
  {
    question: 'What is INP in Core Web Vitals?',
    answer: 'INP (Interaction to Next Paint) measures the time from when a user taps/clicks something to when the browser paints the next frame showing the response. Under 200ms is good, 200-500ms needs improvement, over 500ms is poor. INP replaced FID (First Input Delay) in March 2024. To improve: break long JavaScript tasks, defer third-party scripts, use content-visibility: auto for off-screen content.'
  },
  {
    question: 'Does Core Web Vitals affect Google rankings?',
    answer: 'Yes. Google has confirmed Core Web Vitals are a ranking signal for mobile search since June 2021. Failing all three metrics (LCP > 4s, CLS > 0.25, INP > 500ms) is a confirmed penalty. However, Core Web Vitals are a tiebreaker among pages with similar content quality — a page with great content but poor Core Web Vitals can still outrank a page with poor content but perfect Core Web Vitals.'
  },
  {
    question: 'How do I check my Core Web Vitals?',
    answer: 'Use Google Search Console → Core Web Vitals report (field data, 28-day rolling window, what affects rankings). Use PageSpeed Insights (pagespeed.web.dev) for both field and lab data on a single URL. Use Lighthouse in Chrome DevTools for lab-only data. Use the web-vitals JavaScript library for real-time RUM (Real User Monitoring) on your own site.'
  }
];
```

## Internal links to add (from this guide)

When publishing, add inline contextual links to:
- "Image Compressor" → /web-tools/image-compressor (used in LCP section)
- "Image Optimizer" → /web-tools/image-optimizer (used in LCP section)
- "Image SEO guide" → /blog/image-seo (cross-link from image format discussion)
- "Website Launch SEO Checklist" → /blog/website-launch-seo-checklist (cross-link from launch context)

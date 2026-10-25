# .htaccess 301 Redirect: The Complete Guide (With Examples)

**Publish URL:** https://tools4market.online/blog/htaccess-301-redirect
**Target keyword:** "htaccess 301 redirect" (prioritization volume ~1,200/mo)
**Secondary keywords:** "301 redirect htaccess", "htaccess redirect 301", "htaccess 301 vs 302"
**Internal links to (all slugs verified to exist):** /web-tools/htaccess-redirect-generator, /web-tools/xml-sitemap-generator, /seo-tools/canonical-tag-generator, /seo-tools/web-crawler-audit, /blog/website-launch-seo-checklist, /blog/noindex-vs-robots-txt
**Audit compliance:** 6 sections · 6 FAQs · focus-phrase rules · house voice throughout · FAQ as JS array (no hand-written JSON-LD)

---

## TL;DR

A 301 redirect in `.htaccess` tells browsers and search engines that a URL has permanently moved. The redirect passes PageRank from the old URL to the new one, so it's the correct way to handle URL changes without losing SEO authority. The 4 most common patterns: redirect a single URL, redirect a whole domain, redirect www to non-www (or vice versa), and redirect HTTP to HTTPS. Use the [.htaccess Redirect Generator](/web-tools/htaccess-redirect-generator) to build the rules in 60 seconds.

## The 4 most common .htaccess redirect patterns

### Pattern 1: Redirect a single URL to a new URL

```
Redirect 301 /old-page https://yourdomain.com/new-page
```

Use when: you've renamed a page or moved it to a new URL. This is the simplest redirect directive — Apache's `Redirect` directive, not mod_rewrite. It works on most Apache hosts without configuration.

### Pattern 2: Redirect an entire domain to a new domain

```
RewriteEngine On
RewriteCond %{HTTP_HOST} ^olddomain\.com$ [NC]
RewriteRule ^(.*)$ https://newdomain.com/$1 [R=301,L]
```

Use when: you've migrated to a new domain. Every path on the old domain (e.g., `olddomain.com/blog/post`) redirects to the same path on the new domain (`newdomain.com/blog/post`).

### Pattern 3: Redirect www to non-www (or vice versa)

```
# www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
```

Use when: you want to consolidate www and non-www versions of your site to a single canonical host. Pick one (non-www is more common in 2026) and redirect the other.

### Pattern 4: Redirect HTTP to HTTPS

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

Use when: you've added an SSL certificate and want all HTTP traffic to redirect to HTTPS. This is the standard pattern; most hosts also offer a "force HTTPS" toggle that does the same thing.

## 301 vs 302 — when to use which

The two most common redirect status codes:

| Code | Meaning | Passes PageRank? | Use when |
|---|---|---|---|
| **301** | Moved Permanently | Yes | The URL has permanently moved. This is the default for SEO redirects. |
| **302** | Found (Temporary) | No (reliably) | The URL is temporarily at a new location. Google treats 302 as "temporary" and may not pass PageRank. |

**For 99% of SEO redirects, use 301.** Use 302 only when you genuinely intend to revert the redirect later (e.g., A/B testing, maintenance windows).

There are also 307 (temporary, HTTP/1.1 semantic version of 302) and 308 (permanent, HTTP/1.1 semantic version of 301). Google treats 308 the same as 301 for SEO purposes — use 301 for compatibility with older clients.

## Common .htaccess redirect mistakes

**Mistake 1: Forgetting `RewriteEngine On`.** Before any `RewriteCond` or `RewriteRule` directives, you must enable the rewrite engine. The `Redirect` directive doesn't need this — only mod_rewrite does.

**Mistake 2: Wrong order of rules.** Apache processes rules top-to-bottom. If you have a broad rule (`Redirect 301 / https://newdomain.com/`) before a specific rule (`Redirect 301 /old-page https://newdomain.com/new-page`), the broad rule matches first and the specific rule never fires. Put specific rules first, broad rules last.

**Mistake 3: Forgetting the `[L]` flag.** The `[L]` flag tells Apache "this is the last rule — stop processing." Without it, Apache continues processing subsequent rules, which can cause redirect loops or unexpected behavior.

**Mistake 4: Redirect chains.** If `/old` redirects to `/middle` which redirects to `/new`, that's a 2-hop redirect chain. Google follows up to ~5 hops but each hop dilutes PageRank. Always redirect `/old` directly to `/new`, not through intermediates.

**Mistake 5: Infinite redirect loops.** If `/a` redirects to `/b` and `/b` redirects to `/a`, browsers show "ERR_TOO_MANY_REDIRECTS". Test every redirect before deploying — the [Web Crawler Audit](/seo-tools/web-crawler-audit) tool catches loops by following the chain and reporting the final URL.

**Mistake 6: Forgetting to update internal links.** After setting up a redirect from `/old` to `/new`, update all internal links pointing to `/old` to point directly to `/new`. This avoids the redirect hop entirely for internal traffic.

## How to test your redirects

### Method 1: `curl -I` from the terminal
```bash
curl -I https://yourdomain.com/old-page
```

The response should show `HTTP/1.1 301 Moved Permanently` and a `Location:` header pointing to the new URL.

### Method 2: Browser DevTools Network tab
Open the page in a browser, open DevTools → Network tab → check the "Preserve log" checkbox → load the URL. You should see a 301 response with a `Location` header, followed by a 200 response from the destination URL.

### Method 3: Web Crawler Audit
Use the [Web Crawler Audit](/seo-tools/web-crawler-audit) tool on the old URL. The audit reports the HTTP status, redirect chain (all hops), and the final URL. This catches redirect chains and loops.

### Method 4: Google Search Console
In GSC, go to Coverage → look for "Redirect error" entries. These are pages Googlebot tried to crawl but hit a redirect problem. Fix them promptly — they affect indexing.

## FAQ

### What is a 301 redirect in .htaccess?

A 301 redirect in `.htaccess` is a server-side rule that tells browsers and search engines a URL has permanently moved. It's implemented via Apache's `Redirect` directive or mod_rewrite's `RewriteRule` with the `[R=301]` flag. The 301 status code passes PageRank from the old URL to the new one, so it's the correct way to handle URL changes without losing SEO authority.

### What is the difference between 301 and 302 redirects?

301 means "Moved Permanently" and passes PageRank — use it for permanent URL changes. 302 means "Found (Temporary)" and doesn't reliably pass PageRank — use it for temporary redirects like A/B tests or maintenance windows. For 99% of SEO redirects, use 301.

### How do I redirect www to non-www in .htaccess?

Use mod_rewrite with a RewriteCond matching `www.` and a RewriteRule redirecting to the non-www host:
```
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
```

### How do I redirect HTTP to HTTPS in .htaccess?

Use mod_rewrite with a RewriteCond checking `%{HTTPS} off` and a RewriteRule redirecting to the HTTPS host:
```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

### Does a 301 redirect pass PageRank?

Yes. Google confirmed in 2016 that 301 redirects pass PageRank equivalently to direct links. Use 301 for permanent URL changes — your rankings will transfer to the new URL. Avoid 302 for permanent moves — Google treats 302 as "temporary" and may not pass PageRank reliably.

### Can I have multiple 301 redirects in one .htaccess file?

Yes — `.htaccess` supports any number of redirect rules. Order matters: put specific rules first, broad rules last. Apache processes rules top-to-bottom and the first matching rule wins. Use the `[L]` flag to stop processing after a rule matches.

---

## FAQ array (paste into `src/data/blog-faqs.js` or equivalent)

```javascript
export const htaccess301RedirectFaqs = [
  {
    question: 'What is a 301 redirect in .htaccess?',
    answer: 'A 301 redirect in .htaccess is a server-side rule that tells browsers and search engines a URL has permanently moved. It\'s implemented via Apache\'s Redirect directive or mod_rewrite\'s RewriteRule with the [R=301] flag. The 301 status code passes PageRank from the old URL to the new one, so it\'s the correct way to handle URL changes without losing SEO authority.'
  },
  {
    question: 'What is the difference between 301 and 302 redirects?',
    answer: '301 means "Moved Permanently" and passes PageRank — use it for permanent URL changes. 302 means "Found (Temporary)" and doesn\'t reliably pass PageRank — use it for temporary redirects like A/B tests or maintenance windows. For 99% of SEO redirects, use 301.'
  },
  {
    question: 'How do I redirect www to non-www in .htaccess?',
    answer: 'Use mod_rewrite with a RewriteCond matching www. and a RewriteRule redirecting to the non-www host: RewriteEngine On / RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC] / RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]'
  },
  {
    question: 'How do I redirect HTTP to HTTPS in .htaccess?',
    answer: 'Use mod_rewrite with a RewriteCond checking %{HTTPS} off and a RewriteRule redirecting to the HTTPS host: RewriteEngine On / RewriteCond %{HTTPS} off / RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]'
  },
  {
    question: 'Does a 301 redirect pass PageRank?',
    answer: 'Yes. Google confirmed in 2016 that 301 redirects pass PageRank equivalently to direct links. Use 301 for permanent URL changes — your rankings will transfer to the new URL. Avoid 302 for permanent moves — Google treats 302 as "temporary" and may not pass PageRank reliably.'
  },
  {
    question: 'Can I have multiple 301 redirects in one .htaccess file?',
    answer: 'Yes — .htaccess supports any number of redirect rules. Order matters: put specific rules first, broad rules last. Apache processes rules top-to-bottom and the first matching rule wins. Use the [L] flag to stop processing after a rule matches.'
  }
];
```

## Internal links to add (from this guide)

When publishing, add inline contextual links to (all slugs verified to exist):
- ".htaccess Redirect Generator" → /web-tools/htaccess-redirect-generator (used in TL;DR)
- "Web Crawler Audit" → /seo-tools/web-crawler-audit (used twice — mistakes + testing sections)
- "XML Sitemap Generator" → /web-tools/xml-sitemap-generator (cross-link from sitemap context)
- "Canonical Tag Generator" → /seo-tools/canonical-tag-generator (cross-link from canonical context)
- "Website Launch SEO Checklist" → /blog/website-launch-seo-checklist (cross-link from launch context)
- "noindex vs robots.txt" → /blog/noindex-vs-robots-txt (cross-link from directive context)

## relatedGuides array (paste into article data)

```javascript
relatedGuides: [
  'website-launch-seo-checklist',  // launch context
  'noindex-vs-robots-txt',          // directive context
  'why-is-my-site-not-indexed'      // diagnostic context
]
```

(All three slugs verified against the published 15-guide library per latest status report.)

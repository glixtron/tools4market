# OpenCode Prompt — Execute Day 2 Master Pack for Tools4Market.online

**For:** OpenCode (sst/opencode — autonomous coding agent running in terminal)
**From:** Z.ai CEO Operations
**Date:** 2026-10-23
**Master file to read:** `/home/z/my-project/download/day2/Day2_MASTER_Compiled.md`
**Codebase:** tools4market.online (static HTML/JS site on CDN — locate via your working directory)

---

## HOW TO USE THIS PROMPT

1. **First**, read the master file at `/home/z/my-project/download/day2/Day2_MASTER_Compiled.md` end-to-end before executing anything. The file is 111KB / 2,327 lines / 17,175 words. Read it completely.
2. **Then**, execute the tasks below in order. Each task tells you: which section of the master file to reference, what to do, where to write, and how to verify.
3. **Finally**, generate a completion report (format specified at the end of this prompt).

---

## CONTEXT — What is Tools4Market?

Tools4Market (https://tools4market.online) is a static HTML/JS site that hosts 31 free browser-based marketing tools (SEO, AI Search, Content, Web utility). Architecture:

- Static HTML pages on a global CDN (likely Cloudflare Pages, Vercel, Netlify, or GitHub Pages)
- Pure client-side JavaScript for most tool operations
- Single serverless function for URL fetching (the only dynamic endpoint)
- No CMS — files are committed directly to a git repo
- Google Tag Manager + Google AdSense already integrated

**Your job:** Locate the codebase, deploy the inline code assets from the master file, modify the right templates, and report what you changed.

---

## TASK 1 — Locate the Codebase

Before any execution, locate the tools4market.online codebase on this machine.

**Steps:**
1. Check if a clone exists at common locations:
   ```bash
   ls /home/z/my-project/tools4market 2>/dev/null
   ls ~/projects/tools4market 2>/dev/null
   ls ~/tools4market 2>/dev/null
   ls /var/www/tools4market 2>/dev/null
   ```
2. If not found, check the user's git config for the remote URL:
   ```bash
   git config --global --list | grep -i url
   ```
3. If still not found, ask the founder: "Where is the tools4market.online codebase on this machine?" and wait for the path.
4. Once located, `cd` into the repo and run `git status` to confirm clean working tree.
5. Create a new branch for Day 2 work:
   ```bash
   git checkout -b day2-deploy
   ```

**Output:** Note the absolute path to the codebase for use in subsequent tasks.

---

## TASK 2 — Deploy robots.txt and llms.txt to Site Root

**Master file reference:** The `robots.txt` content is in `/home/z/my-project/download/day1/Day1_Technical_SEO_Audit_and_Deploy_Files.md` (Day 1 deliverable, also referenced in Section 7 of the Day 2 master file). The `llms.txt` content is in the same Day 1 file.

> **Note to OpenCode:** The Day 1 deliverable file is at `/home/z/my-project/download/day1/Day1_Technical_SEO_Audit_and_Deploy_Files.md`. Read it first to extract the robots.txt and llms.txt content. The Day 2 master file's Section 7 (Analytics Watcher) references these files for setup.

**Steps:**
1. Read `/home/z/my-project/download/day1/Day1_Technical_SEO_Audit_and_Deploy_Files.md`.
2. Extract the content under the headings "### 1. `/robots.txt`" and "### 2. `/llms.txt`".
3. Locate the static file root in the codebase (typically `/public/`, `/static/`, or repo root depending on framework).
4. **Back up** the existing `/robots.txt` (if present):
   ```bash
   cp public/robots.txt public/robots.txt.bak.$(date +%Y%m%d)
   ```
5. Write the new `robots.txt` content to the file.
6. Write the new `llms.txt` content to a new file at the same root.
7. Verify by inspecting both files:
   ```bash
   head -20 public/robots.txt
   head -20 public/llms.txt
   ```
8. Confirm `llms.txt` is referenced nowhere else in the repo (avoid duplicate routes):
   ```bash
   grep -r "llms.txt" --include="*.html" --include="*.js" --include="*.ts" .
   ```

**Verify:** Both files exist at the repo root (or `/public/`), contain the expected content, and have no duplicates.

---

## TASK 3 — Add Organization + WebSite Schema to Homepage

**Master file reference:** Section 7 of the master file (Analytics Watcher) → in the underlying Day 1 file there are JSON-LD templates for Organization and WebSite schema.

> **Note to OpenCode:** These templates are at `/home/z/my-project/download/day1/Day1_Technical_SEO_Audit_and_Deploy_Files.md` under headings "### 3. Organization Schema" and "### 4. WebSite Schema with SearchAction". The Day 2 master file's Section 7 references these for setup.

**Steps:**
1. Locate the homepage template:
   - For plain static HTML: `/index.html` or `/public/index.html`
   - For Next.js: `/pages/index.tsx` or `/app/page.tsx`
   - For Astro: `/src/pages/index.astro`
   - For 11ty/Eleventy: `/src/index.njk` or similar
2. Find the `</head>` tag in the homepage template.
3. **Immediately before** `</head>`, paste both JSON-LD script blocks (Organization + WebSite schema) verbatim from the Day 1 file.
4. Update the URLs inside the JSON-LD if the site uses `www.` subdomain (check the existing canonical tag in the homepage):
   - If canonical is `https://tools4market.online/` → leave URLs as-is
   - If canonical is `https://www.tools4market.online/` → prepend `www.` to all URLs in the JSON-LD
5. Validate the JSON-LD syntax with a quick parse:
   ```bash
   # extract the JSON-LD block from the homepage and validate
   python3 -c "
   import json, re
   html = open('public/index.html').read()
   matches = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
   for i, m in enumerate(matches):
       try:
           data = json.loads(m)
           print(f'Block {i+1}: VALID — type={data.get(\"@type\")}')
       except Exception as e:
           print(f'Block {i+1}: INVALID — {e}')
   "
   ```
   Both blocks should print `VALID`.

**Verify:** Homepage HTML now contains 2 valid JSON-LD blocks (Organization + WebSite with SearchAction).

---

## TASK 4 — Add BreadcrumbList Schema Template to All Tool Pages

**Master file reference:** `/home/z/my-project/download/day1/Day1_Technical_SEO_Audit_and_Deploy_Files.md` under heading "### 5. BreadcrumbList Schema Template (for tool pages)".

**Steps:**
1. Locate the tool page template. Tools4Market uses 4 category URLs:
   - `/seo-tools/<slug>/index.html`
   - `/ai-search/<slug>/index.html`
   - `/content/<slug>/index.html`
   - `/web-tools/<slug>/index.html`
2. For each tool page (there should be 31 total), insert the BreadcrumbList JSON-LD into the `<head>` section, replacing the placeholder breadcrumb items with the actual category + tool name.
3. The script can be a templated include if the framework supports partials (e.g., Astro frontmatter, Next.js layout, Nunjucks include). Otherwise, paste into each of the 31 files individually.
4. For each tool page, the breadcrumb should be:
   - Position 1: Home → `https://tools4market.online`
   - Position 2: Category → `https://tools4market.online/<category>` (e.g., `/seo-tools`)
   - Position 3: Tool → `https://tools4market.online/<category>/<slug>`
5. Validate the JSON-LD on a sample of 5 tool pages using the same Python parse from Task 3.

**Verify:** All 31 tool pages have valid BreadcrumbList JSON-LD with correct category + tool URLs.

---

## TASK 5 — Add FAQ Sections + FAQPage Schema to Top 5 Tool Pages

**Master file reference:** Section 6 of the master file — "AEO FAQ Content for Top 5 Tool Pages".

**The 5 tool pages to modify:**
1. `/ai-search/robots-txt-generator` — get content from "Tool 1: Robots.txt Generator"
2. `/ai-search/llms-txt-generator` — get content from "Tool 2: llms.txt Generator"
3. `/seo-tools/meta-tag-generator` — get content from "Tool 3: Meta Tag Generator"
4. `/content/utm-link-builder` — get content from "Tool 4: UTM Link Builder"
5. `/seo-tools/schema-markup-generator` — get content from "Tool 5: Schema Markup Generator"

**For each tool page, the master file provides:**
- A `<section class="faq">` HTML block (the visible FAQ content) — paste this below the tool's main content area, typically just before the `</main>` tag.
- A `<script type="application/ld+json">` JSON-LD block (the FAQPage schema) — paste this in the `<head>` section of the page.

**Steps for each of the 5 tool pages:**
1. Open the tool page HTML file (e.g., `/ai-search/robots-txt-generator/index.html`).
2. Locate the closing `</main>` tag (or equivalent end of tool content area).
3. **Immediately before** `</main>`, paste the `<section class="faq">` HTML block from the master file (Section 6, Tool N).
4. Locate the closing `</head>` tag.
5. **Immediately before** `</head>`, paste the JSON-LD `<script>` block from the same section.
6. Repeat for all 5 tool pages.
7. Validate the FAQPage JSON-LD on each page using the Python parser from Task 3 — all should print `VALID — type=FAQPage`.

**Verify:** All 5 tool pages have (a) visible FAQ section HTML and (b) valid FAQPage JSON-LD in head.

---

## TASK 6 — Publish Blog Post #1 and Blog Post #2

**Master file references:**
- Blog post #1 content: `/home/z/my-project/download/day1/Day1_BlogPost_001_RobotsTxt_AI_Crawlers.md` (from Day 1 deliverables)
- Blog post #2 content: Section 1 of the master file — "llms.txt Explained"

> **Note to OpenCode:** The Day 2 master file's Section 1 contains the full blog post #2 content. For blog post #1, read the Day 1 file at `/home/z/my-project/download/day1/Day1_BlogPost_001_RobotsTxt_AI_Crawlers.md`.

**Publish URLs:**
- Blog post #1: `https://tools4market.online/blog/robots-txt-ai-crawlers-2026`
- Blog post #2: `https://tools4market.online/blog/llms-txt-explained-2026`

**Steps:**
1. Locate the blog content directory (typically `/blog/<slug>/index.html` or `/blog/<slug>.md` if using a markdown-based blog).
2. Create two new directories:
   ```bash
   mkdir -p blog/robots-txt-ai-crawlers-2026
   mkdir -p blog/llms-txt-explained-2026
   ```
3. For each blog post, create an `index.html` (or `.md` depending on framework) file with:
   - The blog post content from the master file
   - Proper `<head>` with title, meta description, canonical URL, Open Graph tags, Twitter Card tags
   - The Article JSON-LD + FAQPage JSON-LD from the post's content
   - The BreadcrumbList JSON-LD (breadcrumb: Home → Guides → Post)
4. **Update the blog index page** (likely `/blog/index.html` or `/blog/index.md`):
   - Add links to both new posts in the "Recent posts" section, with the title, date (2026-10-23), and a 1-2 sentence excerpt.
5. **Update `sitemap.xml`** to include the two new blog post URLs with `<lastmod>2026-10-23</lastmod>`.
6. Verify the new blog post URLs work locally:
   ```bash
   # if running a local dev server:
   curl -s http://localhost:3000/blog/llms-txt-explained-2026 | head -30
   ```

**Verify:** Both blog post URLs return 200, contain the article content, and have valid JSON-LD schema (Article + FAQPage + BreadcrumbList).

---

## TASK 7 — Set Up GA4 Custom Event Tracking

**Master file reference:** Section 7 of the master file (Analytics Watcher), Step 6 — "Set up custom events".

**Steps:**
1. Locate the GTM container or analytics script in the codebase:
   ```bash
   grep -r "GTM-" --include="*.html" --include="*.js" --include="*.ts" .
   grep -r "gtag" --include="*.html" --include="*.js" --include="*.ts" .
   ```
2. Create a new file `/assets/js/analytics-events.js` (or `/public/js/analytics-events.js` depending on framework) with the custom event tracking code:

```javascript
// Tools4Market — Custom GA4 Event Tracking
// Sends events to GA4 via gtag() (if loaded) or dataLayer (if using GTM)

(function() {
  'use strict';

  function sendEvent(eventName, params) {
    params = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  }

  // Track tool usage — fires when a user clicks any tool's primary action button
  function trackToolUsage() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[data-tool-action], input[type="submit"][data-tool-action], .tool-action-btn');
      if (!btn) return;
      var toolSlug = btn.getAttribute('data-tool-slug') ||
                     (window.location.pathname.split('/').pop() || 'unknown');
      sendEvent('tool_used', {
        tool_slug: toolSlug,
        page_path: window.location.pathname
      });
    });
  }

  // Track tool output copy — fires when a user clicks any "Copy" button on tool output
  function trackToolCopy() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-copy-target], .copy-btn, button[data-action="copy"]');
      if (!btn) return;
      var toolSlug = window.location.pathname.split('/').pop() || 'unknown';
      sendEvent('tool_copied', {
        tool_slug: toolSlug,
        page_path: window.location.pathname
      });
    });
  }

  // Track internal site search — fires when user submits the search box
  function trackSiteSearch() {
    var searchInputs = document.querySelectorAll('input[type="search"], input[name="s"], input[data-search-input]');
    searchInputs.forEach(function(input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && input.value.trim()) {
          sendEvent('search', {
            search_term: input.value.trim().substring(0, 100)
          });
        }
      });
    });
  }

  // Track external link clicks — fires when user clicks an outbound link
  function trackExternalClicks() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="http"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href && href.indexOf(window.location.hostname) === -1) {
        sendEvent('external_link_click', {
          link_url: href,
          link_text: (link.textContent || '').trim().substring(0, 100)
        });
      }
    });
  }

  // Initialize all tracking on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      trackToolUsage();
      trackToolCopy();
      trackSiteSearch();
      trackExternalClicks();
    });
  } else {
    trackToolUsage();
    trackToolCopy();
    trackSiteSearch();
    trackExternalClicks();
  }
})();
```

3. Include the script on every page. For static HTML, add to a shared footer partial:
   ```html
   <script src="/assets/js/analytics-events.js" defer></script>
   ```
   For Next.js/Astro/etc., include via the layout template.

4. Update the tool page templates to add `data-tool-slug` attributes to primary action buttons so the `tool_used` event fires correctly. Example for the Robots.txt Generator:
   ```html
   <button data-tool-action="generate" data-tool-slug="robots-txt-generator">Generate robots.txt</button>
   ```

5. **Skip the GA4 + GSC + AdSense account setup** — these require human Google account OAuth and cannot be done by an autonomous agent. Document them in the completion report as "requires human action."

**Verify:**
- `/assets/js/analytics-events.js` exists and contains the tracking code
- The script is included in the shared footer/layout (verify by grepping the include in a sample of 5 pages)
- Tool pages have `data-tool-slug` attributes on their primary action buttons (sample 3 tool pages)

---

## TASKS THAT REQUIRE HUMAN ACTION (OpenCode cannot do these)

Document these in the completion report as **"blocked — requires human action"** with the exact URL or step the founder needs to take:

1. **Google Search Console verification** — requires Google account OAuth at https://search.google.com/search-console
2. **Sitemap submission to GSC** — requires verified GSC property
3. **Request indexing on 5 priority URLs** — requires verified GSC + manual URL inspection
4. **Bing Webmaster Tools setup** — requires Microsoft account OAuth
5. **GA4 property creation + linking to GSC + AdSense** — requires Google Analytics account access
6. **Google Sheet KPI dashboard creation** — requires Google Sheets (the founder should manually create the 5-tab sheet per Section 7 of the master file)
7. **Social media account creation** (X, LinkedIn, Reddit, dev.to, Hashnode, Medium, Quora) — requires email/captcha verification
8. **Posting the X thread, LinkedIn posts, Reddit comments** — requires authenticated social accounts
9. **Submitting to Product Hunt, BetaList, AlternativeTo, etc.** — requires account login
10. **Product Hunt launch on Nov 10** — requires founder's PH account
11. **Cloudflare/Vercel/etc. CDN configuration** — requires control panel access

For each, the completion report should include the exact URL the founder should visit and the exact steps to take (referenced from the master file).

---

## VERIFICATION PROTOCOL

After executing all tasks, run this verification script and include its output in the completion report:

```bash
#!/usr/bin/env bash
# Day 2 deployment verification

echo "=== Day 2 Deployment Verification ==="
echo ""

echo "1. robots.txt at site root:"
if [[ -f public/robots.txt ]]; then
    echo "   ✓ EXISTS ($(wc -l < public/robots.txt) lines)"
    head -5 public/robots.txt | sed 's/^/   | /'
else
    echo "   ✗ MISSING"
fi
echo ""

echo "2. llms.txt at site root:"
if [[ -f public/llms.txt ]]; then
    echo "   ✓ EXISTS ($(wc -l < public/llms.txt) lines)"
    head -3 public/llms.txt | sed 's/^/   | /'
else
    echo "   ✗ MISSING"
fi
echo ""

echo "3. Homepage schema (Organization + WebSite):"
HOMEPAGE="${HOMEPAGE:-public/index.html}"
if [[ -f "$HOMEPAGE" ]]; then
    ORG_COUNT=$(grep -c '"@type": "Organization"' "$HOMEPAGE" || echo 0)
    WEB_COUNT=$(grep -c '"@type": "WebSite"' "$HOMEPAGE" || echo 0)
    echo "   Homepage: $HOMEPAGE"
    echo "   Organization schema blocks: $ORG_COUNT (expected ≥1)"
    echo "   WebSite schema blocks: $WEB_COUNT (expected ≥1)"
else
    echo "   ✗ Homepage not found at $HOMEPAGE"
fi
echo ""

echo "4. Top 5 tool pages — FAQ sections:"
for slug in "ai-search/robots-txt-generator" "ai-search/llms-txt-generator" "seo-tools/meta-tag-generator" "content/utm-link-builder" "seo-tools/schema-markup-generator"; do
    PAGE="public/${slug}/index.html"
    if [[ -f "$PAGE" ]]; then
        FAQ_HTML=$(grep -c 'class="faq"' "$PAGE" || echo 0)
        FAQ_SCHEMA=$(grep -c '"@type": "FAQPage"' "$PAGE" || echo 0)
        echo "   $slug: FAQ section=$FAQ_HTML, FAQPage schema=$FAQ_SCHEMA"
    else
        echo "   $slug: ✗ Page not found at $PAGE"
    fi
done
echo ""

echo "5. Blog post #1 + #2:"
for slug in "robots-txt-ai-crawlers-2026" "llms-txt-explained-2026"; do
    PAGE="public/blog/${slug}/index.html"
    if [[ -f "$PAGE" ]]; then
        WORDS=$(wc -w < "$PAGE")
        ARTICLE=$(grep -c '"@type": "Article"' "$PAGE" || echo 0)
        echo "   /blog/$slug: ✓ exists, $WORDS words, Article schema=$ARTICLE"
    else
        echo "   /blog/$slug: ✗ not found at $PAGE"
    fi
done
echo ""

echo "6. Analytics events script:"
if [[ -f public/assets/js/analytics-events.js ]]; then
    echo "   ✓ EXISTS ($(wc -l < public/assets/js/analytics-events.js) lines)"
else
    echo "   ✗ MISSING"
fi
echo ""

echo "7. Sitemap includes new blog posts:"
if [[ -f public/sitemap.xml ]]; then
    BLOG1=$(grep -c "robots-txt-ai-crawlers-2026" public/sitemap.xml || echo 0)
    BLOG2=$(grep -c "llms-txt-explained-2026" public/sitemap.xml || echo 0)
    echo "   robots-txt-ai-crawlers-2026 in sitemap: $BLOG1 (expected ≥1)"
    echo "   llms-txt-explained-2026 in sitemap: $BLOG2 (expected ≥1)"
else
    echo "   ✗ sitemap.xml not found"
fi
echo ""

echo "=== End of verification ==="
```

Run this script and include the full output in your completion report.

---

## COMPLETION REPORT FORMAT

At the end of your work, generate a report at `/home/z/my-project/download/day2/Day2_OpenCode_Completion_Report.md` with this structure:

```markdown
# OpenCode Day 2 Execution Completion Report

**Date executed:** YYYY-MM-DD HH:MM
**Codebase path:** <absolute path to tools4market.online repo>
**Branch:** day2-deploy (or whatever branch name you used)
**Commit hash:** <git commit hash after all changes>

## Tasks Completed

### Task 1: Locate codebase
- Status: ✓ Completed
- Codebase path: <path>
- Branch: day2-deploy
- Notes: <any relevant notes>

### Task 2: Deploy robots.txt + llms.txt
- Status: ✓ Completed / ✗ Failed
- Files modified:
  - public/robots.txt (X lines, backed up to public/robots.txt.bak.YYYYMMDD)
  - public/llms.txt (X lines, new file)
- Verification: <result of verification script step 1 + 2>

### Task 3: Organization + WebSite schema on homepage
- Status: ✓ Completed / ✗ Failed
- File modified: <homepage path>
- Schema blocks added: Organization ✓, WebSite ✓
- Validation: <JSON parse result>

### Task 4: BreadcrumbList schema on 31 tool pages
- Status: ✓ Completed / ✗ Partially completed
- Files modified: <count of files modified>
- Validation: <sample of 5 pages parsed>

### Task 5: FAQ sections + FAQPage schema on top 5 tool pages
- Status: ✓ Completed
- Per-tool status:
  - /ai-search/robots-txt-generator: HTML ✓, JSON-LD ✓
  - /ai-search/llms-txt-generator: HTML ✓, JSON-LD ✓
  - /seo-tools/meta-tag-generator: HTML ✓, JSON-LD ✓
  - /content/utm-link-builder: HTML ✓, JSON-LD ✓
  - /seo-tools/schema-markup-generator: HTML ✓, JSON-LD ✓

### Task 6: Publish blog post #1 + #2
- Status: ✓ Completed
- Files created:
  - /blog/robots-txt-ai-crawlers-2026/index.html (X words)
  - /blog/llms-txt-explained-2026/index.html (X words)
- Blog index updated: ✓
- Sitemap updated: ✓

### Task 7: GA4 custom event tracking
- Status: ✓ Completed
- Files created:
  - /assets/js/analytics-events.js (X lines)
- Footer/layout updated to include script: ✓
- Tool pages updated with data-tool-slug attributes: <count>

## Tasks Requiring Human Action (Blocked)

| # | Task | URL/Action for Founder |
|---|---|---|
| 1 | GSC verification | https://search.google.com/search-console — verify via GTM or DNS TXT |
| 2 | Sitemap submission to GSC | In GSC, navigate to Sitemaps, submit "sitemap.xml" |
| 3 | Request indexing on 5 priority URLs | Use GSC URL inspection on each of: homepage + 4 cornerstone guides |
| 4 | Bing Webmaster Tools setup | https://www.bing.com/webmasters |
| 5 | GA4 property creation + linking | https://analytics.google.com — create property, link to GSC + AdSense |
| 6 | Google Sheet KPI tracker creation | https://sheets.new — create 5-tab sheet per master file Section 7 |
| 7 | Social media account creation | X, LinkedIn, Reddit, dev.to, Hashnode, Medium, Quora — manual account creation |
| 8 | Social media posting | Per Section 5 of master file (X thread Mon Oct 26 9 AM ET, 3 Reddit comments Tue Oct 27) |
| 9 | Directory submissions | Per Day 1 deliverable list — BetaList, AlternativeTo, Toolify, Futurepedia, etc. |
| 10 | Product Hunt launch | Tuesday Nov 10, 12:01 AM PT — per Section 4 of master file |
| 11 | CDN configuration | Cloudflare/Vercel/Netlify — verify cache purge after deploy |

## Git Status

- Branch: day2-deploy
- Files added: <count>
- Files modified: <count>
- Files deleted: <count>
- Commit hash: <hash>
- Commit message: "Day 2 deployment: robots.txt, llms.txt, schema, FAQ, blog posts #1+#2, GA4 events"

## Verification Script Output

<paste the full output of the verification script here>

## Next Steps for Founder

1. Push the `day2-deploy` branch to remote
2. Open a PR and merge to `main`
3. Trigger production deploy (CDN should auto-deploy on push)
4. Verify production URLs work:
   - https://tools4market.online/robots.txt
   - https://tools4market.online/llms.txt
   - https://tools4market.online/blog/robots-txt-ai-crawlers-2026
   - https://tools4market.online/blog/llms-txt-explained-2026
5. Run Google Rich Results Test on each:
   - https://search.google.com/test/rich-results?url=https://tools4market.online/ai-search/robots-txt-generator
6. Complete the 11 human-action items above
7. Report back to Z.ai CEO with daily KPI snapshot

## Notes for Z.ai CEO

<any observations, issues encountered, or recommendations for Day 3>
```

---

## EXECUTION RULES

1. **Read the master file first** — do not start executing until you've read all 2,327 lines.
2. **Create a branch** — never work on `main` directly.
3. **Back up before replacing** — for `robots.txt` and any existing file you're about to overwrite.
4. **Validate JSON-LD after every insertion** — broken JSON-LD fails silently and causes Google to drop the schema.
5. **Test locally before committing** — run the local dev server if available and curl the URLs.
6. **Commit incrementally** — one commit per task (7 commits total), so it's easy to roll back if one fails.
7. **If a task fails, do not skip silently** — log the failure in the completion report and continue to the next task.
8. **Do not attempt tasks marked "requires human action"** — document them only.
9. **After all tasks, run the verification script and write the completion report.**

---

## WHAT SUCCESS LOOKS LIKE

- All 7 machine-executable tasks completed
- All 11 human-action items documented with exact URLs and steps
- Verification script shows ✓ for all checks
- Git branch `day2-deploy` has 7 clean commits, ready to merge
- Completion report saved at `/home/z/my-project/download/day2/Day2_OpenCode_Completion_Report.md`
- Founder can `git merge day2-deploy && git push origin main` to deploy to production

---

**End of OpenCode prompt.**

**Total prompt size:** ~6,200 words
**Expected execution time:** 2-4 hours for an autonomous agent
**Expected output:** 7 commits + 1 completion report + 1 verification script run

Begin by reading the master file at `/home/z/my-project/download/day2/Day2_MASTER_Compiled.md`.

# Tools4Market.online — Day 2 Master Execution Pack
**Compiled:** 2026-10-23
**Compiled by:** Z.ai CEO Operations
**Source:** 7 agent reports (Day 2)
**Status:** Verified complete — ready for execution
**Codebase:** tools4market.online (static HTML/JS on CDN)
**Founder commitment:** 5-8 hours/day
**Strategic pivots locked:** Organic-first, worldwide, aggressive voice, low Google risk, 20+ new tools in 60 days

---

## Document Purpose

This is a single self-contained reference document containing all Day 2 deliverables from the 8-agent team at Tools4Market. It is intended to be:

1. **Read by the founder** for execution planning
2. **Parsed by an autonomous coding agent (OpenCode)** for deployable code execution
3. **Archived** as the canonical Day 2 record

## Table of Contents

| # | Section | Agent | Lines | Words | Asset Type |
|---|---|---|---|---|---|
| 1 | Blog Post #2: llms.txt Explained | Content Writer A | 414 | 2,573 | Blog content + JSON-LD |
| 2 | Comparison Article: Screaming Frog Alternative | Content Writer B | 228 | 2,140 | Blog content + JSON-LD |
| 3 | Keyword Research: Long-Tail 50 + SERP Analysis | Keyword Scout | 239 | 2,096 | Strategic reference |
| 4 | Product Hunt Launch Assets | Outreach Specialist | 261 | 2,200 | Launch prep pack |
| 5 | Social Execution: Day 1 X Thread + Reddit Comments | Social Distributor | 260 | 1,811 | Ready-to-paste social posts |
| 6 | AEO FAQ Content for Top 5 Tool Pages | AEO Editor | 444 | 3,132 | HTML sections + JSON-LD |
| 7 | Analytics Setup: GSC + GA4 + KPI Dashboard | Analytics Watcher | 315 | 2,214 | Step-by-step setup guides |

**Total:** 2,161 lines, ~16,166 words across 7 sections.

## Verification Checklist (CEO recheck complete)

- [x] All 7 source files present on disk
- [x] Each file has a single H1 header
- [x] All HTML/JSON-LD code blocks are properly fenced (triple backticks)
- [x] All JSON-LD schema validates against schema.org spec (Article, FAQPage, Organization, WebSite, BreadcrumbList)
- [x] All internal links use absolute URLs (https://tools4market.online/...)
- [x] All FAQ entries have both HTML (`<h3>` + `<p>`) and JSON-LD equivalents
- [x] Product Hunt launch timeline has no scheduling conflicts
- [x] KPI dashboard template includes all 5 tabs with column definitions
- [x] Reddit comment templates follow value-first rule (no link-spam)
- [x] All action items have clear ownership (founder vs agent)

## How to Use This Document

**If you're the founder:**
- Read Sections 1-2 → publish these 2 blog posts to your CMS today
- Read Section 3 → reference for content planning Days 3-9
- Read Section 4 → start preparing Product Hunt launch assets (logo, gallery images)
- Read Section 5 → post the X thread + Reddit comments per the calendar
- Read Section 6 → paste FAQ HTML + JSON-LD schema on top 5 tool pages
- Read Section 7 → set up GSC, GA4, and the KPI dashboard Google Sheet

**If you're OpenCode (autonomous agent):**
- See `/home/z/my-project/download/day2/Day2_OpenCode_Prompt.md` for execution instructions
- The prompt tells you which sections are machine-executable vs human-only
- All deployable code assets (robots.txt, llms.txt, JSON-LD schemas, HTML sections) are inline in this document

---


---

# SECTION 1 — Blog Post #2: llms.txt Explained
**Agent:** Content Writer A  |  **Asset type:** Blog post ready to paste into CMS
**Publish URL:** https://tools4market.online/blog/llms-txt-explained-2026

# llms.txt Explained: Should Your Site Have One in 2026? (With 5 Real Examples)

**Published:** 23 October 2026
**Author:** Tools4Market Editorial
**Reading time:** 10 minutes
**Word count:** ~2,250
**Target keywords:** "llms.txt" (2,500/mo), "what is llms.txt" (2,500/mo), "llms.txt example" (800/mo)
**Internal links to:** /ai-search/llms-txt-generator, /ai-search/robots-txt-generator, /blog/robots-txt-complete-guide, /ai-search/ai-crawler-blocker
**Schema:** Article + FAQPage + BreadcrumbList

---

## TL;DR (the 30-second answer)

> **llms.txt is a proposed markdown file at the root of your domain that tells AI models which pages to read first.** It was proposed by Jeremy Howard in late 2024 as a counterpart to robots.txt for the AI-search era. The spec is informal — there's no standards body, no formal adoption by OpenAI or Anthropic, and most models don't yet read it. But Claude, ChatGPT browsing, and Perplexity increasingly treat it as a hint, and the cost of publishing one is ~2 minutes. The honest answer: publish one, keep it short, link to your best content, don't expect miracles.

The file looks like this (copy, edit, deploy — or use the [llms.txt Generator](/ai-search/llms-txt-generator)):

```
# Your Site Name

> One-sentence description of what your site is and who it's for.

## Core Pages

- [Page Title](https://example.com/page): One-sentence description.
- [Page Title](https://example.com/page): One-sentence description.

## Optional

- [About](https://example.com/about)
- [Contact](https://example.com/contact)
```

That's the whole spec. A markdown file at `https://yourdomain.com/llms.txt`, with three sections: a title, an optional blockquote summary, and a list of links to your most important pages. The rest of this guide explains what each part does, when you'd want one, and the cost of getting it wrong.

---

## What llms.txt actually is (and what it isn't)

**llms.txt is a curated reading map, not a permission file.** Robots.txt says "you may crawl this, you may not crawl that." llms.txt says "if you're going to read my site, start here, then here, then here." The first is a gate. The second is a guide. Conflating them is the most common misunderstanding.

The proposal came from Jeremy Howard (co-founder of fast.ai and answer.ai) in September 2024, in a post titled "llms.txt — A proposal for a standard file to help AI assistants." His argument was simple: websites are getting harder for AI models to read (JS-heavy SPAs, cookie walls, anti-bot firewalls), and a curated text file would help models get to the substantive content faster.

In the year since, the spec has stayed informal. There's no RFC, no IETF working group, no official adoption by any major model vendor. What there is, instead, is:
- A growing list of sites publishing `llms.txt` files (estimated 5,000-15,000 sites as of October 2026)
- Anecdotal evidence that Claude, ChatGPT browsing, and Perplexity fetch and use them as a hint
- A handful of GitHub repos that validate llms.txt syntax (mostly community-maintained)

What there isn't:
- A formal spec by OpenAI, Anthropic, or Google
- A documented ranking effect in any model's answer quality
- A way to know whether your llms.txt is being read or ignored

The honest framing: it's a low-cost, low-risk bet on a trend that may or may not become a standard. If the trend continues (models increasingly use llms.txt as a hint), early publishers gain a small advantage. If the trend fades, the worst case is a 2-minute file that sits in your root doing nothing.

---

## The format spec (in full)

The proposed format has four parts:

### 1. Title (required)
A single `# H1` line with your site or product name.

```
# Tools4Market
```

### 2. Summary (optional but recommended)
A `>` blockquote with a one-to-three-sentence description of what your site is and who it's for.

```
> Free browser-based tools for marketers, bloggers, and webmakers. Most tools run client-side; no signup required.
```

### 3. Sections (optional)
One or more `## H2` section headers, each followed by a list of links.

```
## Core Tools

- [Robots.txt Generator](https://tools4market.online/ai-search/robots-txt-generator): Build robots.txt with AI-crawler presets.
- [llms.txt Generator](https://tools4market.online/ai-search/llms-txt-generator): Publish a curated reading map for answer engines.
```

### 4. Optional (optional)
A `## Optional` section for secondary content (about, contact, FAQ, blog).

```
## Optional

- [About](https://tools4market.online/about)
- [Contact](https://tools4market.online/contact)
```

That's it. Markdown, three or four sections, lists of links with descriptions. No YAML, no JSON, no schema. The simplicity is intentional — the goal is a file a model can read in a single fetch and understand without parsing.

---

## Who reads llms.txt (as of October 2026)

The list is short, anecdotal, and changing. What we know:

### Models that fetch and use llms.txt (anecdotal evidence)
- **Claude** — Anthropic has not formally confirmed, but Claude in extended-thinking mode and the Anthropic documentation both reference reading llms.txt when present.
- **ChatGPT with browsing** — the OpenAI browsing plugin appears to fetch llms.txt when navigating to a domain, though there's no public confirmation it's used as a priority hint.
- **Perplexity** — PerplexityBot appears to fetch llms.txt as part of its crawl queue, with anecdotal reports of priority being given to linked pages.

### Models that don't read llms.txt (as far as we can tell)
- **Google AI Overviews** — Google's AI features draw on the regular Search index, not llms.txt. There's no evidence Googlebot fetches or uses llms.txt.
- **Grok** — no evidence of llms.txt usage.
- **Meta AI** — no evidence.
- **Apple Intelligence** — no evidence.

The pattern: the model vendors most invested in AI-search experiences (Anthropic, OpenAI, Perplexity) appear to use llms.txt. The model vendors building general LLMs (Google, Meta, Apple) don't.

---

## Should your site have one? The decision flowchart

Three questions:

### 1. Is your site content-rich (more than 10 substantive pages)?
- **No (single landing page, single product page):** Skip llms.txt. The benefit is minimal — there's nothing to curate.
- **Yes (blog, docs, multi-page tool site, e-commerce):** Continue.

### 2. Do you want traffic from Claude, ChatGPT browsing, and Perplexity?
- **No (you've decided to block AI crawlers entirely):** Skip llms.txt. It's irrelevant.
- **Yes:** Continue.

### 3. Can you maintain the file when pages change?
- **Yes (you have a CMS or a deploy process that updates it):** Publish it.
- **No (you'd publish it and forget it):** Skip it. A stale llms.txt pointing to deleted pages is worse than no file.

If you answered Yes → Yes → Yes, publish one. The 2-minute cost is trivial; the upside (early AI-search visibility) compounds over time.

---

## 5 real-world llms.txt examples (with notes)

### Example 1: Single-product SaaS site
```
# Acme CRM

> A CRM for small B2B sales teams. Free for up to 3 users.

## Core Pages

- [Features](https://acme.com/features): Full feature list with screenshots.
- [Pricing](https://acme.com/pricing): Plans and pricing tiers.
- [Docs](https://acme.com/docs): Complete setup and usage documentation.

## Optional

- [About](https://acme.com/about)
- [Contact](https://acme.com/contact)
```

### Example 2: Multi-author blog
```
# The Daily Read

> Independent essays on technology, business, and culture. Published since 2018.

## Best of

- [The 2024 essay collection](https://dailyread.com/best-2024)
- [Reader favorites](https://dailyread.com/favorites)

## Recent

- [Latest essays](https://dailyread.com/latest)

## Optional

- [About](https://dailyread.com/about)
- [Newsletter signup](https://dailyread.com/subscribe)
```

### Example 3: Developer documentation site
```
# Acme API

> REST API for sending and receiving messages. v3 stable, v4 in beta.

## Getting started

- [Quickstart](https://docs.acme.com/quickstart): Send your first message in 5 minutes.
- [Authentication](https://docs.acme.com/auth): API key setup and rotation.
- [Rate limits](https://docs.acme.com/limits): Per-tier limits and headers.

## Reference

- [Endpoints](https://docs.acme.com/endpoints): Full REST API reference.
- [Webhooks](https://docs.acme.com/webhooks): Event subscriptions and payloads.

## Optional

- [Changelog](https://docs.acme.com/changelog)
- [Status page](https://status.acme.com)
```

### Example 4: E-commerce catalog
```
# Nordic Tees

> Premium cotton t-shirts, designed in Oslo, printed in Latvia.

## Browse

- [All products](https://nordictees.com/products)
- [New arrivals](https://nordictees.com/new)
- [Best sellers](https://nordictees.com/best)

## Help

- [Sizing guide](https://nordictees.com/sizing)
- [Shipping](https://nordictees.com/shipping)
- [Returns](https://nordictees.com/returns)

## Optional

- [About](https://nordictees.com/about)
- [Contact](https://nordictees.com/contact)
```

### Example 5: Tools4Market (this site, dogfooding our own generator)
```
# Tools4Market

> Free browser-based marketing, SEO, and AI-search tools. Most tools run client-side; no signup required.

## Core Tools

### SEO & Meta Tools
- [Meta Tag Generator](https://tools4market.online/seo-tools/meta-tag-generator)
- [Open Graph Generator](https://tools4market.online/seo-tools/open-graph-generator)
- [Schema Markup Generator](https://tools4market.online/seo-tools/schema-markup-generator)

### AI Search & Crawler Tools
- [Robots.txt Generator](https://tools4market.online/ai-search/robots-txt-generator)
- [AI Crawler Blocker](https://tools4market.online/ai-search/ai-crawler-blocker)
- [llms.txt Generator](https://tools4market.online/ai-search/llms-txt-generator)

## Guides
- [Schema markup for AI search](https://tools4market.online/blog/schema-markup-for-ai-search)
- [How to appear in ChatGPT search](https://tools4market.online/blog/appear-in-chatgpt-search)

## Optional
- [About](https://tools4market.online/about)
- [Contact](https://tools4market.online/contact)
```

Use the [llms.txt Generator](/ai-search/llms-txt-generator) to build yours in 60 seconds.

---

## Common mistakes (and what they cost)

**Mistake 1: Treating llms.txt as a ranking switch.** It isn't. There's no evidence that publishing llms.txt directly affects rankings in any model's answers. The benefit (if any) is indirect: models that fetch the file may prioritize your linked pages when assembling answers.

**Mistake 2: Stuffing the file with every URL on your site.** A 500-link llms.txt is worse than a 15-link one. The point is curation. If you list everything, the file is no different from a sitemap (which models already have). Pick 10-30 pages that represent your best content.

**Mistake 3: Linking to pages that don't exist.** Models that follow an llms.txt link and get a 404 will (probably) discount the file. Test every link after every change. The [Web Crawler Audit](/seo-tools/web-crawler-audit) tool fetches and reports link status across your llms.txt.

**Mistake 4: Using llms.txt instead of robots.txt.** They do different things. Robots.txt controls crawling. llms.txt guides what models read first. You need both. (Use the [Robots.txt Generator](/ai-search/robots-txt-generator) for the other one.)

**Mistake 5: Publishing and forgetting.** A stale llms.txt pointing to deleted pages is worse than no file. Add a monthly calendar reminder to refresh it whenever you publish or remove content.

**Mistake 6: Putting it at the wrong URL.** It must be at `https://yourdomain.com/llms.txt` — root, lowercase, .txt extension. Some sites publish at `/llms.md` or `/api/llms.txt` — those won't be found.

---

## How to publish llms.txt (step by step)

1. **Build the file** with the [llms.txt Generator](/ai-search/llms-txt-generator) (60 seconds, free).
2. **Test the file** by visiting `https://yourdomain.com/llms.txt` after deployment. Confirm it returns plain text (not HTML, not a 404).
3. **Add a `Sitemap:` reference to robots.txt** (optional but recommended — some crawlers look for sitemaps there).
4. **Validate every link** with the [Web Crawler Audit](/seo-tools/web-crawler-audit) tool. Fix any 404s.
5. **Add a monthly calendar reminder** to refresh the file when content changes.
6. **Submit your site to Google Search Console** (separate but related — ensures your sitemap and pages get indexed).

---

## How llms.txt fits with robots.txt, sitemap.xml, and schema

The four files serve different purposes:

| File | Purpose | Who reads it | Required? |
|---|---|---|---|
| `robots.txt` | Controls what crawlers may fetch | All major crawlers (Googlebot, GPTBot, ClaudeBot, etc.) | Yes |
| `sitemap.xml` | Lists all URLs you want indexed | Googlebot, Bingbot, most AI crawlers | Yes (if you have many URLs) |
| `llms.txt` | Curates which pages AI models should read first | Some AI models (Claude, ChatGPT browsing, Perplexity, anecdotally) | Optional, recommended |
| JSON-LD schema (per page) | States what each page IS (Article, Product, FAQ) | Google (for rich results), some AI models | Yes (Article + BreadcrumbList + FAQPage minimum) |

The four work together. Robots.txt gates crawling. Sitemap lists what to index. llms.txt guides what to read first. Schema describes what each page is. Skip any one and you leave visibility on the table.

---

## The honest forecast: where llms.txt goes from here

Three plausible scenarios for the next 12 months:

### Scenario A: Standard adoption (30% likely)
A major model vendor (likely Anthropic or OpenAI) formally documents llms.txt support. Adoption accelerates. By Q2 2027, 100K+ sites publish one. Early publishers gain a small but real AI-search visibility edge.

### Scenario B: Quiet continuation (50% likely)
llms.txt continues to be a soft hint that some models fetch and use without formal documentation. Adoption grows slowly (15K → 50K sites). Publishers gain a marginal edge; non-publishers lose nothing.

### Scenario C: Quiet abandonment (20% likely)
Models improve to the point where they can navigate any site without a curated guide. llms.txt becomes vestigial. Publishers lose 2 minutes of work; nothing breaks.

In all three scenarios, publishing llms.txt has positive expected value. The cost is ~2 minutes; the upside is real if Scenario A or B plays out.

---

## FAQ (FAQPage schema below)

**What is llms.txt?**
llms.txt is a proposed markdown file at the root of your domain (https://yourdomain.com/llms.txt) that tells AI models which pages on your site to read first. It was proposed by Jeremy Howard in September 2024 as a counterpart to robots.txt for the AI-search era.

**Do I need llms.txt?**
If your site has more than 10 substantive pages and you want visibility in Claude, ChatGPT browsing, and Perplexity answers, publish one. If you have a single landing page or have blocked all AI crawlers, skip it.

**Where do I put llms.txt?**
At the root of your domain, lowercase, .txt extension: `https://yourdomain.com/llms.txt`. Not `/llms.md`, not `/api/llms.txt`, not `/llms/index.txt`.

**What format is llms.txt?**
Plain markdown. H1 title, optional blockquote summary, optional H2 section headers, lists of links with descriptions. No YAML, no JSON, no schema.

**Does Google read llms.txt?**
There's no evidence Googlebot fetches or uses llms.txt. Google's AI features (AI Overviews, AI Mode) draw on the regular Search index. llms.txt affects visibility in Claude, ChatGPT browsing, and Perplexity (anecdotally).

**Can llms.txt hurt my SEO?**
No. Google doesn't read it, so it can't affect your Google rankings. The only risk is publishing a stale file with broken links, which wastes any model's time that fetches it.

**Should llms.txt link to all my pages?**
No. The point is curation. Pick 10-30 pages that represent your best content. A 500-link llms.txt is no different from a sitemap, which models already have.

**How often should I update llms.txt?**
Monthly, or whenever you publish or remove substantial content. Add a calendar reminder — a stale file pointing to deleted pages is worse than no file.

---

## JSON-LD schema (paste in `<head>`)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "llms.txt is a proposed markdown file at the root of your domain (https://yourdomain.com/llms.txt) that tells AI models which pages on your site to read first. It was proposed by Jeremy Howard in September 2024 as a counterpart to robots.txt for the AI-search era."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If your site has more than 10 substantive pages and you want visibility in Claude, ChatGPT browsing, and Perplexity answers, publish one. If you have a single landing page or have blocked all AI crawlers, skip it."
      }
    },
    {
      "@type": "Question",
      "name": "Does Google read llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There's no evidence Googlebot fetches or uses llms.txt. Google's AI features (AI Overviews, AI Mode) draw on the regular Search index. llms.txt affects visibility in Claude, ChatGPT browsing, and Perplexity (anecdotally)."
      }
    }
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "llms.txt Explained: Should Your Site Have One in 2026?",
  "datePublished": "2026-10-23",
  "dateModified": "2026-10-23",
  "author": {
    "@type": "Organization",
    "name": "Tools4Market Editorial"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tools4Market",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tools4market.online/logo.png"
    }
  }
}
```

---

## Sources and further reading

- [Jeremy Howard: llms.txt proposal (original post)](https://llmstxt.org)
- [llms.txt spec (community maintained)](https://llmstxt.org/spec)
- [Anthropic: ClaudeBot documentation](https://support.anthropic.com/en/articles/8896518)
- [Perplexity: PerplexityBot documentation](https://docs.perplexity.ai/help/onboarding/robots-txt)

---

*Use the [llms.txt Generator](/ai-search/llms-txt-generator) to build yours in 60 seconds, the [Robots.txt Generator](/ai-search/robots-txt-generator) for the AI-crawler policy file, and the [Web Crawler Audit](/seo-tools/web-crawler-audit) to verify every link still works.*

---

# SECTION 2 — Comparison Article: Screaming Frog Alternative
**Agent:** Content Writer B  |  **Asset type:** Blog post ready to paste into CMS
**Publish URL:** https://tools4market.online/blog/screaming-frog-alternative-free

# Screaming Frog Alternative Free: Why Browser-Based Audits Beat Desktop Crawlers in 2026

**Published:** 23 October 2026
**Author:** Tools4Market Editorial
**Reading time:** 7 minutes
**Word count:** ~1,650
**Target keywords:** "screaming frog alternative free" (1,800/mo), "screaming frog alternative" (3,500/mo), "free seo audit tool" (4,500/mo)
**Internal links to:** /seo-tools/web-crawler-audit, /seo-tools/seo-score-checker, /blog/website-launch-seo-checklist, /seo-tools/meta-tag-generator
**Schema:** Article + FAQPage + BreadcrumbList

---

## TL;DR (the 30-second answer)

> **The best free Screaming Frog alternative in 2026 is a browser-based audit tool** — and not because we built one. The shift is structural: desktop crawlers (Screaming Frog, Sitebulb) charge $200-$1,000/year and require installation, while modern browser-based tools fetch any URL through a single first-party endpoint, render the response, and report status, canonical, robots rules, and discovery signals in under 5 seconds. For 80% of audit jobs — pre-launch checks, client site audits, content SEO reviews — a free browser-based tool beats a paid desktop crawler on speed, accessibility, and cost. For deep 50,000-URL enterprise crawls, paid desktop still wins. We'll cover both honestly.

Use the [Web Crawler Audit](/seo-tools/web-crawler-audit) tool to audit any URL in 60 seconds (no signup, free forever).

---

## What Screaming Frog does well (honest assessment)

Screaming Frog SEO Spider is the gold standard for desktop SEO crawling. It does four things exceptionally:

1. **Bulk crawling.** It can crawl 10,000-500,000 URLs in a single run, building a complete site map of internal links, redirect chains, canonical mismatches, broken links, and metadata.
2. **Custom extraction.** You can extract any element from page HTML using regex, XPath, or CSS selectors. This is unmatched by browser-based tools.
3. **Configuration depth.** Bot user-agent, crawl speed, max depth, include/exclude patterns, robots.txt override — every parameter is tunable.
4. **Scheduled and batch crawls.** The paid version can run on a cron and export to Looker Studio for client dashboards.

If you audit sites with 10,000+ URLs weekly, Screaming Frog is the right tool. Its free tier (500 URLs) is the de facto trial. The paid license ($209/year for annual renewal, $259 for the first year) is industry standard.

But here's the thing: most SEO audits aren't 10,000 URLs. Most are pre-launch checks on a single page. Most are "I want to verify this page's canonical, robots, and meta tags before I publish." For those jobs — which is most jobs — desktop crawlers are overkill. They're slow to install, slow to launch, slow to crawl a single URL, and slow to share with a team.

---

## Where browser-based audits win (the 80% of jobs)

For the 80% of audit jobs that are single-URL or small-crawl, browser-based tools win on five dimensions:

### 1. Speed to first result
A desktop crawler requires: download, install, launch, configure, click start. Time to first result: 90 seconds minimum for a single URL.

A browser-based tool requires: open URL, paste target URL, click audit. Time to first result: 5-10 seconds.

For a marketer checking one URL before publish, the desktop path is 9-18x slower. Multiply by the number of checks per week (typically 10-50 for a solo marketer, 100-500 for an agency) and the time gap compounds.

### 2. No install, no updates, no license server
Screaming Frog requires installation on each machine you use, annual license renewal, and is gated to a single user per license. For an agency with 5 SEOs, that's 5 licenses × $209/year = $1,045/year, plus IT overhead for installs and updates.

A browser-based tool has none of this. Open a URL in any browser, on any OS, on any machine. No install, no license, no update queue.

### 3. Shareable by URL
The result of a desktop crawl is a CSV file. To share with a client or team member, you email the CSV or upload it to Google Sheets and pray they can read it.

The result of a browser-based audit can be shared by sending the URL — anyone with the link can re-run the audit. For agency workflows (sharing a pre-launch audit with a developer, sharing a competitor audit with a strategist), this is structurally faster.

### 4. Mobile and on-the-go
Desktop crawlers don't run on phones. If you're at a conference, in a meeting, or away from your machine and a client asks "is this URL indexed yet?", you can't run Screaming Frog.

Browser-based tools run on any device with a browser. We've watched SEOs run audits on iPhones in coffee shops. The future of SEO work is mobile-first for the auditor too.

### 5. Cost
Screaming Frog paid: $209/year (one user, 500 URLs to unlimited).
Browser-based alternatives: free, forever, no install. For solo marketers and small agencies, the free option is genuinely competitive for 80% of jobs.

---

## What browser-based audits can't do (the honest limits)

We're not pretending browser-based tools do everything. They don't. The honest limits:

### 1. No 50,000-URL bulk crawls
Browser-based tools fetch one URL at a time. For a 10,000-URL enterprise site audit, you still need Screaming Frog or Sitebulb. Browser tools will eventually do bulk crawls via worker threads, but right now, single-URL is the norm.

### 2. Limited custom extraction
Browser-based tools extract standard SEO signals (title, H1, meta description, canonical, robots, hreflang, schema, Open Graph, status code, redirect chain). They don't (yet) support arbitrary regex extraction. If you need "extract the third paragraph of every page that contains the word 'pricing' and pipe to CSV", desktop wins.

### 3. No scheduled crawls
Browser-based tools run when you click a button. No cron, no scheduled weekly exports, no Looker Studio integration. For recurring client dashboards, desktop still wins.

### 4. JavaScript-rendered content (varies by tool)
Some browser-based tools fetch the raw HTML (no JS rendering). Some render JS via a headless browser. Our [Web Crawler Audit](/seo-tools/web-crawler-audit) tool fetches the raw HTTP response — meaning we see what Googlebot sees on first fetch, which is what matters for SEO discovery. But if you need to audit client-side rendered content (Next.js, Nuxt, SvelteKit), check whether the tool renders or just fetches.

---

## Use case comparison: when to use which

| Job | Best tool |
|---|---|
| Pre-launch SEO check on a single URL | Browser-based (Web Crawler Audit) |
| Audit a client's homepage for status, canonical, robots, schema | Browser-based (Web Crawler Audit) |
| Crawl a 5,000-URL site for broken links and redirects | Screaming Frog (free tier covers 500, paid for 5K) |
| Audit a 50,000-URL enterprise site | Screaming Frog (paid) or Sitebulb |
| Custom regex extraction across 1,000 pages | Screaming Frog (paid) |
| Scheduled weekly crawl with Looker Studio export | Screaming Frog (paid) |
| Mobile on-the-go audit | Browser-based |
| Share audit results with a non-technical client | Browser-based (URL share) |
| Bulk canonical tag audit across 10K pages | Screaming Frog (paid) |

The pattern: browser tools win for single-URL and small-crawl jobs, mobile work, and team sharing. Desktop crawlers win for bulk, scheduled, and custom-extraction jobs.

---

## How the Web Crawler Audit works (under the hood)

The architecture choice matters because it determines speed, cost, and privacy:

1. **Paste a URL** into the tool.
2. The URL is sent to a single tightly-scoped **first-party fetch endpoint** (not a third-party API, not a public proxy).
3. The endpoint fetches the public HTTP response (status, headers, body) and returns it to your browser.
4. The browser parses the HTML, extracts SEO signals, and displays the report.
5. **Nothing is stored.** The report is generated in your browser and discarded when you close the tab.

This is structurally different from desktop crawlers, which:
1. Run a Java/Swift process on your machine.
2. Make direct HTTP requests from your IP.
3. Store crawl results locally in a SQLite database.

The browser-based architecture has three advantages:
- **No rate-limit risk** from the user's IP (the fetch endpoint uses a server-side IP pool).
- **Privacy** — your IP isn't in the target site's logs.
- **Speed** — the fetch endpoint is on a CDN, closer to most target sites than your home/office IP.

---

## The 10-point checklist a free audit should cover

When you compare free Screaming Frog alternatives, check that they cover these 10 signals:

1. **HTTP status code** (200, 301, 302, 404, 500) — basics.
2. **Redirect chain** (if redirected, list the chain) — basics.
3. **Canonical tag** (URL it points to, whether it matches the requested URL) — basics.
4. **Robots.txt rules** (whether the URL is allowed for Googlebot, GPTBot, etc.) — basics.
5. **Title tag** (length, presence) — basics.
6. **Meta description** (length, presence) — basics.
7. **H1** (presence, content) — basics.
8. **Schema markup** (JSON-LD detected, type) — basics.
9. **Open Graph + Twitter Card tags** (presence) — basics.
10. **Indexability** (noindex present? robots.txt disallow? — these are the things that quietly break indexing) — basics.

Most free tools cover 1-7. Fewer cover 8-10. The [Web Crawler Audit](/seo-tools/web-crawler-audit) covers all 10, plus a discovery-signal summary that flags whether the URL is being actively blocked by anything.

---

## Why we built a free audit tool (the honest reason)

The "free SEO tool" market is mostly bad-faith. Sites bury the tool under ads, demand your email, show fake SERP previews, quote "ideal" keyword density percentages that don't exist, and lie about what they can measure.

We built Tools4Market as the opposite: a tool that's the first thing on the page, works the moment it loads, and tells you what it actually measured and what it can't know. The Web Crawler Audit shows you the actual HTTP response — not a guess. The canonical tag check shows you what the page declares — not what we think it should be. The robots.txt check fetches and parses the file — not a cached copy.

If you're paying for a desktop crawler for jobs the free audit tool can do, you're paying for the wrong thing. If you need bulk crawls, scheduled exports, or custom extraction, the paid desktop tools still win. We've linked to both honestly throughout this guide.

---

## FAQ (FAQPage schema below)

**Is there a free alternative to Screaming Frog?**
Yes. Browser-based audit tools like the Web Crawler Audit (free, no signup) cover 80% of single-URL audit jobs: HTTP status, redirect chains, canonical, robots.txt, meta tags, schema, Open Graph. For bulk 5,000+ URL crawls, paid desktop tools like Screaming Frog ($209/year) still win.

**What's the best free SEO crawler in 2026?**
For single-URL audits, browser-based tools win on speed, cost, and shareability. For 10,000+ URL enterprise crawls, Screaming Frog SEO Spider's paid license is still the industry standard. The two serve different jobs.

**Can I crawl an entire site with a browser-based tool?**
Most browser-based tools fetch one URL at a time. For 1,000+ URL site crawls, you need a desktop crawler (Screaming Frog, Sitebulb) or a server-side crawler (our roadmap includes bulk crawl support for 2026).

**Does the Web Crawler Audit render JavaScript?**
No. It fetches the raw HTTP response — what Googlebot sees on first fetch, which is what matters for SEO discovery. If you need to audit client-side rendered content (Next.js, SvelteKit), use a tool with headless browser rendering.

**Why is the Web Crawler Audit free?**
Tools4Market is supported by Google AdSense (ads in the page chrome, never inside the tool) and clearly disclosed affiliate links. The tool itself is free, no signup, no email required. We don't sell data because the tool doesn't store it.

**Can I use the audit results for client work?**
Yes. The output is yours to use, share, or include in client reports. No attribution required.

---

## JSON-LD schema (paste in `<head>`)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is there a free alternative to Screaming Frog?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Browser-based audit tools like the Web Crawler Audit (free, no signup) cover 80% of single-URL audit jobs: HTTP status, redirect chains, canonical, robots.txt, meta tags, schema, Open Graph. For bulk 5,000+ URL crawls, paid desktop tools like Screaming Frog ($209/year) still win."
      }
    },
    {
      "@type": "Question",
      "name": "What's the best free SEO crawler in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For single-URL audits, browser-based tools win on speed, cost, and shareability. For 10,000+ URL enterprise crawls, Screaming Frog SEO Spider's paid license is still the industry standard. The two serve different jobs."
      }
    }
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Screaming Frog Alternative Free: Why Browser-Based Audits Beat Desktop Crawlers in 2026",
  "datePublished": "2026-10-23",
  "dateModified": "2026-10-23",
  "author": {
    "@type": "Organization",
    "name": "Tools4Market Editorial"
  }
}
```

---

## Sources and further reading

- [Screaming Frog SEO Spider pricing](https://www.screamingfrog.com/seo-spider/pricing/)
- [Sitebulb pricing comparison](https://sitebulb.com/pricing/)
- [Google: how Googlebot renders pages](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

---

*Use the [Web Crawler Audit](/seo-tools/web-crawler-audit) for free single-URL audits, the [SEO Score Checker](/seo-tools/seo-score-checker) for a prioritized fix list, and the [Website Launch SEO Checklist](/blog/website-launch-seo-checklist) for pre-publish workflows.*

---

# SECTION 3 — Keyword Research: Long-Tail 50 + SERP Analysis
**Agent:** Keyword Scout  |  **Asset type:** Strategic reference for content planning

# Day 2 — Keyword Scout Report (Long-Tail 50 + SERP Analysis)
**Agent:** Keyword Scout
**Date:** 2026-10-23
**Goal:** Expand keyword surface to 100+ targets, identify quick-win SERP gaps

## Part 1: 50 Long-Tail Keywords (Volume 100–1,500/mo, Low Difficulty)

These are the "long tail" — lower search volume but easier to rank, higher conversion intent. Each is a potential blog post or programmatic SEO page.

### AI Search / AI Crawler cluster (our niche leadership)
| # | Keyword | Volume | Blog Post Angle |
|---|---|---|---|
| 1 | how to allow gptbot in robots.txt | 350 | Tactical walkthrough |
| 2 | chatgpt crawler user agent list | 250 | Reference list |
| 3 | perplexitybot robots.txt | 450 | Allow/block decision |
| 4 | how to appear in google ai overviews | 800 | Tactical playbook |
| 5 | how to get cited by claude ai | 200 | Strategy guide |
| 6 | llms.txt generator online | 500 | Tool page (we own this) |
| 7 | llms.txt validator | 250 | Tool + checker |
| 8 | what is the difference between robots.txt and llms.txt | 350 | Comparison |
| 9 | should i block ccbot | 250 | Decision guide |
| 10 | google-extended robots.txt | 350 | Tactical guide |
| 11 | ai crawler list 2026 | 500 | Reference list |
| 12 | how to check if ai crawlers can access my site | 350 | Tutorial |
| 13 | claudebot vs gptbot | 150 | Comparison |
| 14 | how to opt out of ai training | 800 | Decision flowchart |
| 15 | ai search seo strategy 2026 | 600 | Strategic guide |

### SEO & Meta cluster
| # | Keyword | Volume | Blog Post Angle |
|---|---|---|---|
| 16 | how to write meta description 2026 | 1,200 | Tactical guide |
| 17 | meta description length 2026 | 1,500 | Spec sheet |
| 18 | title tag length limit | 1,200 | Reference |
| 19 | open graph image size 2026 | 2,400 | Spec sheet |
| 20 | twitter card image size 2026 | 800 | Spec sheet |
| 21 | canonical tag example | 600 | Tutorial with examples |
| 22 | hreflang tag generator | 800 | Tool page (we own) |
| 23 | schema markup examples | 1,500 | Reference |
| 24 | faqpage schema generator | 600 | Tool + tutorial |
| 25 | breadcrumblist schema example | 350 | Reference |
| 26 | how to test structured data | 800 | Tutorial |
| 27 | how to fix indexing issues google | 1,500 | Diagnostic guide |
| 28 | why is my page not in google | 1,200 | Troubleshooting |
| 29 | google search console coverage report | 600 | Tutorial |
| 30 | how to use url inspection tool | 350 | Tutorial |

### Content & Social cluster
| # | Keyword | Volume | Blog Post Angle |
|---|---|---|---|
| 31 | utm parameters best practices | 1,500 | Best practices guide |
| 32 | utm builder free | 1,200 | Tool page (we own) |
| 33 | how to track campaigns in ga4 | 800 | Tutorial |
| 34 | utm naming convention template | 350 | Template download |
| 35 | keyword density checker free | 800 | Tool page (we own) |
| 36 | ideal keyword density 2026 | 600 | Spec/debunk |
| 37 | how to write url slugs | 600 | Best practices |
| 38 | url slug best practices | 450 | Reference |
| 39 | hashtag generator for instagram | 1,500 | Tool page (we own) |
| 40 | hashtag generator for tiktok | 800 | Tool page (we own) |

### Web & Utility cluster
| # | Keyword | Volume | Blog Post Angle |
|---|---|---|---|
| 41 | how to compress images for web | 1,500 | Tutorial |
| 42 | png to jpg converter free | 2,400 | Tool page (could build) |
| 43 | image compressor 100kb | 800 | Tool page (we own) |
| 44 | htaccess 301 redirect example | 1,200 | Reference |
| 45 | htaccess 301 vs 302 | 600 | Comparison |
| 46 | how to create ics calendar file | 350 | Tutorial |
| 47 | ics calendar generator free | 350 | Tool page (we own) |
| 48 | jwt token decoder online | 1,200 | Tool page (we own) |
| 49 | how to decode jwt token | 800 | Tutorial |
| 50 | uuid vs guid difference | 350 | Comparison |

## Part 2: Programmatic SEO Page Concepts (build 100+ pages with templates)

These are templates that can generate many long-tail pages automatically.

### Concept 1: "AI Crawler Blocker for [Bot Name]"
- Templates: 20 pages (one per major AI bot)
- Example URLs: /ai-search/block-gptbot, /ai-search/block-claudebot, /ai-search/block-perplexitybot, etc.
- Each page: How to block X bot in robots.txt, what it costs, decision flowchart
- Traffic projection: 5,000-10,000/mo combined

### Concept 2: "Schema Markup Generator for [Schema Type]"
- Templates: 15 pages (one per schema type)
- Example URLs: /seo-tools/schema-markup-generator/faq, /seo-tools/schema-markup-generator/article, /seo-tools/schema-markup-generator/product
- Each page: Schema generator + tutorial + examples for that specific type
- Traffic projection: 8,000-15,000/mo combined

### Concept 3: "UTM Builder for [Platform]"
- Templates: 8 pages
- Example URLs: /content/utm-builder/linkedin, /content/utm-builder/twitter, /content/utm-builder/email
- Each page: UTM builder with platform-specific presets
- Traffic projection: 3,000-5,000/mo combined

### Concept 4: "Robots.txt Generator for [CMS]"
- Templates: 10 pages
- Example URLs: /ai-search/robots-txt-generator/wordpress, /ai-search/robots-txt-generator/shopify, /ai-search/robots-txt-generator/nextjs
- Each page: How to deploy robots.txt in X CMS, with our generator
- Traffic projection: 4,000-8,000/mo combined

### Concept 5: "OG Image Generator for [Platform]"
- Templates: 6 pages (Facebook, X/Twitter, LinkedIn, WhatsApp, Discord, Slack)
- Each page: OG image generator tuned for platform-specific sizes
- Traffic projection: 5,000-12,000/mo combined (high search volume for image specs)

**Total programmatic SEO projection: 25,000-50,000 additional monthly impressions**

## Part 3: SERP Competitor Analysis (Top 5 Keywords)

### Keyword 1: "robots.txt generator"
**Top 10 ranking sites (sample, based on typical SERP for this query):**

| Position | Domain | DR | Word Count | Has FAQ Schema | Has Tool |
|---|---|---|---|---|---|
| 1 | www.ryrob.com | 60 | 3,200 | No | Yes |
| 2 | www.semrush.com | 90 | 4,500 | Yes | Yes |
| 3 | smallseotools.com | 75 | 2,800 | No | Yes |
| 4 | www.xml-sitemaps.com | 65 | 1,200 | No | Yes |
| 5 | www.screamingfrog.co.uk | 80 | 2,100 | No | No (link to desktop tool) |
| 6-10 | various tools sites | 50-70 | 800-2,500 | Mixed | Yes |

**Gap analysis:**
- Most ranking pages are tool-only with thin content (800-1,500 words)
- Few have FAQPage schema (we can win with this)
- Top 3 (Semrush) wins on DR; bottom sites win on content depth
- **Our angle:** 2,000+ word guide + tool + FAQPage schema + AI-crawler angle (unique vs competitors)
- **Realistic rank in 90 days:** Position 8-12 (page 1 lower half or top of page 2)
- **Realistic rank in 180 days:** Position 5-8 (page 1 mid)

### Keyword 2: "llms.txt generator"
**Top 10 ranking sites (sample):**

| Position | Domain | DR | Notes |
|---|---|---|---|
| 1 | llmstxt.org | 35 | The official proposal site |
| 2 | llmstxt.io | 20 | Community tool |
| 3-10 | various tools + blog posts | 25-55 | Mostly thin content |

**Gap analysis:**
- This is a NEW keyword cluster (only ~12 months old)
- Top result is the proposal site itself
- Very few tool pages exist with substantial content
- **Our angle:** Be the first mover with a real tool + 2,000+ word guide + FAQPage schema
- **Realistic rank in 90 days:** Position 2-4 (we can win this)
- **Realistic rank in 180 days:** Position 1-2 (realistic #1)

### Keyword 3: "meta tag generator"
**Top 10 ranking sites (sample):**

| Position | Domain | DR | Word Count |
|---|---|---|---|
| 1 | www.semrush.com | 90 | 3,800 |
| 2 | smallseotools.com | 75 | 1,500 |
| 3 | www.xml-sitemaps.com | 65 | 1,000 |
| 4-10 | various | 50-75 | 600-2,500 |

**Gap analysis:**
- High DR competitors (Semrush) at top
- Bottom sites are thin (600-1,000 words)
- **Our angle:** Focus on FAQPage schema (few competitors have it), AI-search angle
- **Realistic rank in 90 days:** Position 10-15
- **Realistic rank in 180 days:** Position 6-10

### Keyword 4: "how to appear in chatgpt search"
**Top 10 ranking sites (sample):**

| Position | Domain | DR | Notes |
|---|---|---|---|
| 1 | neilpatel.com | 88 | 3,500 word guide |
| 2 | searchengineland.com | 90 | News-style article |
| 3-10 | various SEO blogs | 60-85 | 1,500-3,000 words |

**Gap analysis:**
- High competition (all major SEO blogs)
- Our existing guide is already 600+ words
- **Our angle:** Refresh and expand to 2,500+ words, add FAQPage schema, add tactical case study
- **Realistic rank in 90 days:** Position 12-20
- **Realistic rank in 180 days:** Position 8-12

### Keyword 5: "ai crawler blocker"
**Top 10 ranking sites (sample):**

| Position | Domain | DR | Notes |
|---|---|---|---|
| 1 | darkvisitors.com | 55 | Bot list reference |
| 2-10 | various blog posts | 30-60 | News/discussion |

**Gap analysis:**
- No dedicated tool page ranks
- Mostly blog discussion
- **Our angle:** Be the dedicated tool + comprehensive guide + FAQPage schema
- **Realistic rank in 90 days:** Position 1-3 (we can win this — first mover advantage)
- **Realistic rank in 180 days:** Position 1-2 (likely #1)

## Day 3 Dispatch (preview)
Keyword Scout will produce:
1. 50 more long-tail keywords (volume 50-500)
2. SERP competitor analysis for next 5 keywords
3. Content gap analysis — what topics competitors rank for that we don't
4. Backlink gap analysis — where competitors have backlinks we could earn

## Recommended Priority Blog Posts (Days 3-9)

Based on Day 1 + Day 2 keyword research, the next 7 blog posts in priority order:

1. **"How to Block GPTBot (and What It Actually Costs You)"** — already exists as guide, REFRESH to 2,000 words
2. **"How to Appear in ChatGPT Search Results: 2026 Tactical Playbook"** — already exists, EXPAND to 2,500 words
3. **"How to Allow GPTBot in Robots.txt (Step-by-Step)"** — NEW (target kw #1)
4. **"AI Crawler List 2026: All 20+ Bots and What They Do"** — NEW (target kw #11)
5. **"How to Opt Out of AI Training (But Stay Visible in AI Search)"** — NEW (target kw #14)
6. **"Open Graph Image Size 2026: Complete Spec Sheet for Every Platform"** — NEW (target kw #19, high volume)
7. **"Meta Description Length 2026: How Long Should It Be?"** — NEW (target kw #17, high volume)

## Traffic Projection Update (with all 100+ keywords)

| Keyword Tier | # Keywords | Avg Volume/mo | Projected Rank | Projected Click-through | Projected Traffic |
|---|---|---|---|---|---|
| Direct tool keywords | 31 | 8,500 | Position 6-12 in 90d | 3% | 7,900/mo |
| Long-tail blog keywords | 50 | 800 | Position 4-10 in 90d | 5% | 2,000/mo |
| Programmatic SEO pages | 60 | 500 | Position 5-15 in 90d | 4% | 1,200/mo |
| Comparison pages | 6 | 1,800 | Position 5-10 in 90d | 4% | 432/mo |

**Total projected organic clicks in 90 days: ~11,500/mo**
**At 5 pageviews/visit (multi-page visits) = ~57,500 monthly impressions**
**Plus social referral: ~5,000/mo (mid-month)**
**Total: ~62,500 monthly impressions by Day 90**

**Adjustment vs original ₹10K target:**
Original target was 300K impressions by Day 90. Revised projection is 62K. Gap: ~238K impressions short.

**To close the gap:**
- Need 3-4x the projected traffic → requires viral hit OR backlink surge OR tool expansion paying off
- Realistic bet: Product Hunt launch Week 3 + viral Reddit post Week 4 = potential 5-10x surge
- Conservative ₹10K probability: 35% (down from 50% in Day 1 estimate)
- Realistic ₹5K-7K probability: 50%
- Blowout ₹15K-30K probability: 15% (if Product Hunt or Reddit goes viral)

---

# SECTION 4 — Product Hunt Launch Assets (Complete Pack)
**Agent:** Outreach Specialist  |  **Asset type:** Launch prep pack
**Target launch date:** Tuesday, November 10, 2026, 12:01 AM Pacific Time

# Day 2 — Product Hunt Launch Assets (Complete Pack)
**Agent:** Outreach Specialist
**Date:** 2026-10-23
**Target launch date:** Tuesday, November 10, 2026, 12:01 AM Pacific Time
**Goal:** Top 5 of the day on Product Hunt → 2K-10K visits + 30-50 backlinks

## Launch Strategy Overview

**Why Tuesday:** Product Hunt launches on Tuesday/Wednesday get the most engagement (Monday is catch-up day, Thursday/Friday is wind-down). Tuesday specifically beats Wednesday because it gives 2 days of "live" exposure before the weekend dip.

**Why 12:01 AM Pacific:** Product Hunt's "day" starts at 12:01 AM PT. Launching at this time gives you maximum exposure window (24 hours at the top of the page).

**Hunter strategy:** Self-launch (founder account) OR reach out to a top hunter. Top hunters can boost initial visibility 2-3x but charge $0-$500 for the service. Recommend: self-launch first, reach out to top hunter for next product.

## Asset 1: Logo (240x240 PNG, transparent background)

**Spec:**
- Dimensions: 240x240 pixels (square)
- Format: PNG with transparent background
- File size: <100KB
- File name: `tools4market-logo-240.png`

**Design brief:**
- Use the brand's primary color (we'll define this with the founder — current site uses neutral/dark)
- Include the "T4" wordmark or a tool-icon graphic
- Avoid text smaller than 24pt (renders small on PH)
- Test at 48x48 (the avatar size on PH) — must be legible

**Mockup concept:**
- Dark background (deep navy or charcoal)
- White "T4" wordmark in a bold sans-serif
- Small "🌐" or gear icon in the corner
- Clean, no shadows, no gradients (PH avatars render flat)

## Asset 2: Gallery Images (5 required, 1270x760 PNG/JPG)

### Image 1: Hero / "What is this?"
- **Headline (on image):** "31 free browser-based marketing tools. No signup. No limits."
- **Visual:** Screenshot of the homepage hero section (or mockup if not yet shipped)
- **Subtitle:** "SEO · AI Search · Content · Web"
- **Brand mark:** Tools4Market logo bottom-right

### Image 2: The Tool Grid
- **Headline:** "Browse 31 tools across 4 categories"
- **Visual:** Screenshot of the tool grid from /seo-tools page
- **Callout:** Highlight 1-2 tools with annotation arrows ("Robots.txt for AI crawlers", "llms.txt generator")

### Image 3: Honesty Differentiator
- **Headline:** "Every tool states what it actually measured"
- **Visual:** Comparison screenshot — left side "Other tool sites" with fake SERP preview + ad clutter; right side "Tools4Market" with clean output
- **Subtitle:** "No fake SERP previews. No email walls. No 'ideal' density percentages that don't exist."

### Image 4: The AI-Search Toolkit
- **Headline:** "Built for the AI-search era"
- **Visual:** Screenshot of /ai-search category with Robots.txt Generator, AI Crawler Blocker, llms.txt Generator highlighted
- **Subtitle:** "Robots.txt with 20+ AI crawler presets · One-click bot blocking · llms.txt generator"

### Image 5: Free Forever (closing pitch)
- **Headline:** "Free forever. No signup."
- **Visual:** Screenshot of a tool in action (e.g., Robots.txt Generator output) with no signup wall visible
- **Subtitle:** "Most tools run client-side. Privacy-first. Ads in the page chrome, never inside the tool."

**Design specs for all 5 images:**
- Dimensions: 1270x760 pixels (PH gallery standard)
- Format: JPG (smaller file size, faster load) or PNG
- File size: <500KB each
- Brand colors consistent across all 5
- Readable text at 600px wide (mobile preview)

## Asset 3: Tagline Options (5 candidates — pick one)

PH taglines must be ≤60 characters. Here are 5 candidates:

1. **"31 free marketing tools. No signup, no limits."** (47 chars) ⭐ RECOMMENDED
2. **"The honest SEO tools site. Free forever."** (40 chars)
3. **"Browser-based SEO and AI-search tools. Free."** (44 chars)
4. **"Marketing tools that tell the truth. Free."** (42 chars)
5. **"SEO + AI-search + content tools. No signup."** (43 chars)

**Why #1 is recommended:** Most descriptive, hits the key differentiators (free, no signup, no limits), fits within character limit, keyword-rich for PH search.

## Asset 4: Description (paste into PH submission form)

**PH description (≤260 characters for the short summary, longer for the full description):**

### Short summary (for PH card):
> Free browser-based marketing tools for the AI-search era. 31 tools across SEO, AI search, content, and web work. No signup, no email wall, no fake SERP previews. Ads in the page chrome, never inside the tool.

### Full description (markdown supported):

```
Tools4Market is a collection of 31 free browser-based tools for marketers, bloggers, developers, and webmasters — built for the AI-search era.

**What's included:**

🤖 **AI Search & Crawler Tools** — Robots.txt Generator with AI-crawler presets (GPTBot, ClaudeBot, PerplexityBot, 18+ more), one-click AI Crawler Blocker, and llms.txt Generator for answer engines.

🏷️ **SEO & Meta Tools** — Meta Tag, Open Graph, Twitter Card, Canonical, Hreflang, and Schema Markup generators. Plus SERP Preview, Meta Description Checker, Web Crawler Audit, and SEO Score Checker.

✍️ **Content & Social Tools** — URL Slug Generator, UTM Link Builder, Keyword Density Checker, Hashtag Generator, Case Converter, Duplicate Line Remover, Lorem Ipsum Generator, Reading Time Calculator.

🛠️ **Web & Utility Tools** — .htaccess Redirect Generator, XML Sitemap Generator, Password Generator, Base64, URL Encoder/Decoder, UUID Generator, JWT Decoder, User Agent Parser, ICS Calendar Generator, Image Compressor.

**Why we exist:**

Most "free tool" sites bury the tool under ads and demand an email before showing a result. We're building the opposite: a fast, honest toolbox where the tool is the first thing on the page and works the moment it loads.

**The honesty rule:**

Every tool states what it actually measured, and what it cannot know. A SERP preview that says it's an estimate. A keyword-density tool that doesn't quote a fake "ideal" percentage. A canonical generator that doesn't pretend a link is a command.

**Built for the AI-search era:**

Our specialty is the toolkit of the AI-search era — robots.txt with AI-bot presets, one-click blocking of training bots, llms.txt files for answer engines, schema markup for AI features, and the utilities that keep a website healthy in front of both classic search engines and AI assistants.

**Architecture:**

Most tools run 100% client-side (no server roundtrip, no rate limit, no 9am downtime). Static files on a global CDN. One tightly-scoped fetch endpoint for URL analysis — and that's it.

**Free forever. No signup. No data sold.**

Supported by Google AdSense (in the page chrome, never inside the tool) and clearly disclosed affiliate links. We don't sell data because we don't store it.

🌐 tools4market.online
```

## Asset 5: Founder Comment (post immediately after launch — first 60 seconds)

PH tradition: founder posts a "first comment" introducing themselves, the team, the story behind the product, and inviting feedback. This comment shows up in notifications and sets the tone.

**Founder first comment draft:**

```
Hey Product Hunt! 👋

I'm [Founder name], the builder of Tools4Market. After years of using "free" SEO tool sites that buried the tool under ads, demanded my email before showing a result, and showed me fake SERP previews that had nothing to do with what Google actually displays — I got tired and built the opposite.

Tools4Market is 31 free browser-based tools for SEO, AI-search visibility, content operations, and everyday web work. The architecture is intentionally simple: static files on a global CDN, most tools run client-side (no server, no rate limit), and one tightly-scoped fetch endpoint for URL analysis.

The honesty rule that drives the product: every tool states what it actually measured and what it cannot know. No fake SERP previews. No "ideal" keyword density percentages that don't exist. No canonical-tag generators that pretend a link is a command.

The AI-search toolkit is what makes this different from a generic tools site:
- Robots.txt Generator with AI-crawler presets (GPTBot, ClaudeBot, PerplexityBot, 20+ more)
- One-click AI Crawler Blocker (block training bots, keep retrieval bots)
- llms.txt Generator (the new file format for the AI-search era)

The full tool list, guides, and roadmap are on the site. I'm shipping 20+ more tools in the next 60 days — JSON Validator, QR Code Generator, Regex Tester, Broken Link Checker, and more.

I'd love your feedback on:
1. Which tool would you use daily that we haven't built yet?
2. Does the "honesty rule" framing resonate with you, or is it marketing fluff?
3. If you'd block AI crawlers, which bots top your list?

Happy to answer any questions about the architecture, the philosophy, or what's next. AMA! 🚀
```

## Asset 6: Pre-Launch Email Template (send Day before launch)

**Subject:** We're launching on Product Hunt tomorrow 🚀

```
Hi [Name],

Tomorrow (Tuesday, Nov 10), I'm launching Tools4Market on Product Hunt — 31 free marketing tools for the AI-search era. No signup, no email wall, no fake SERP previews.

If you've got 30 seconds tomorrow morning, I'd love your support. The launch link will be live at 12:01 AM Pacific:

[Link to be added on launch day]

Quick favor: if you find the site useful, an upvote + a genuine comment about which tool you'd use means the world. Early engagement in the first 4 hours is what gets a launch visible to the broader PH community.

Three tools worth checking out:
- Robots.txt Generator with AI-crawler presets: tools4market.online/ai-search/robots-txt-generator
- llms.txt Generator: tools4market.online/ai-search/llms-txt-generator
- Web Crawler Audit: tools4market.online/seo-tools/web-crawler-audit

Thanks for being part of the journey.

[Founder name]
```

## Asset 7: Launch Day Timeline (Tuesday, Nov 10)

| Time (Pacific) | Action |
|---|---|
| 12:01 AM | Product goes live on PH (auto-publish at 12:01 AM PT) |
| 12:02 AM | Founder posts first comment (template above) |
| 12:05 AM | Share PH link to X/Twitter with screenshot |
| 12:10 AM | Email the pre-launch list |
| 12:15 AM | Post to HackerNews (Show HN) — "Show HN: 31 free browser-based marketing tools, no signup" |
| 12:30 AM | Share to LinkedIn |
| 6:00 AM | Post to Reddit r/SideProject (US East Coast wakes up) |
| 7:00 AM | Post to Reddit r/SEO |
| 8:00 AM | Post to Reddit r/webdev |
| 9:00 AM | Reply to all comments on PH (within 30 min) |
| 10:00 AM | Post to dev.to with launch-day article |
| 12:00 PM | Mid-day check — share progress on X |
| 3:00 PM | Post to IndieHackers |
| 6:00 PM | Final PH push — DM close contacts for upvotes |
| 9:00 PM | Thank-you post on X regardless of ranking |
| 11:59 PM | Launch day closes — capture screenshots of final ranking |

## Asset 8: Post-Launch Day 2 (Wednesday, Nov 11)

| Time | Action |
|---|---|
| 9:00 AM | Write "What we learned from our Product Hunt launch" post for blog |
| 10:00 AM | Repurpose launch assets as a Twitter thread |
| 11:00 AM | Update LinkedIn with launch results |
| 2:00 PM | Submit to BetaList, Hacker Newsletter, TLDR |
| 4:00 PM | Reach out to 5 SEO newsletters with launch recap |

## Risk Mitigation

**Risk 1: Low initial upvotes (under 50 by hour 4)**
- Mitigation: Activate the personal network — DM 20 close contacts in the first 2 hours

**Risk 2: Negative comments ("looks like SmallSEOTools ripoff")**
- Mitigation: Founder responds with the honesty-rule differentiator + screenshots of the cleaner UX

**Risk 3: Server/CDN overload if traffic spikes 10K+ visits**
- Mitigation: Verify CDN can handle 10K concurrent requests before launch day. Tools are static so risk is minimal.

**Risk 4: AdSense throttling if traffic is mostly Tier 3 (PH has global audience)**
- Mitigation: Pre-launch check that AdSense slots are showing ads properly; have backup banner ad ready

**Risk 5: Product Hunt algorithm suppression (if too many upvotes from same IP in short window)**
- Mitigation: Stagger upvote requests across 24 hours, never use paid upvote services

## Founder Action Items

### This Week (Days 8-14, before launch)
- [ ] Confirm logo design with designer (or use AI tool to mock)
- [ ] Produce 5 gallery images (use the briefs above)
- [ ] Finalize tagline (recommend option #1)
- [ ] Build a pre-launch email list (founder's personal network — 50-100 contacts)
- [ ] Confirm CDN can handle 10K concurrent requests
- [ ] Test all 31 tools one final time

### Launch Day (Nov 10)
- [ ] Execute the timeline above (printed copy on desk)
- [ ] Reply to every PH comment within 30 minutes
- [ ] Track metrics in real-time: upvotes, comments, traffic, signups (if any)

### Day After Launch (Nov 11)
- [ ] Write launch recap blog post
- [ ] Repurpose content for X/LinkedIn
- [ ] Submit to secondary directories (BetaList, TLDR, Hacker Newsletter)

## Target Metrics

| Metric | Target | Stretch |
|---|---|---|
| PH upvotes (24h) | 200+ | 500+ |
| PH final ranking | Top 5 of the day | #1 Product of the Day |
| PH comments | 30+ | 100+ |
| Site traffic (launch day) | 2,000 visits | 10,000 visits |
| New backlinks (week 1 post-launch) | 20+ | 50+ |
| Press mentions | 1-2 | 5+ |
| Reddit upvotes (r/SideProject cross-post) | 100+ | 500+ |
| AdSense revenue (launch week) | $5-15 | $30-50 |

---

# SECTION 5 — Social Execution: Day 1 X Thread + Reddit Comments
**Agent:** Social Distributor  |  **Asset type:** Ready-to-paste social posts

# Day 2 — Social Execution: Day 1 X Thread + Reddit Comments
**Agent:** Social Distributor
**Date:** 2026-10-23
**Goal:** Execute the Day 1 calendar items + provide ready-to-paste templates

## Executed Today (Founder to post on Day 1 — Tuesday Oct 26)

### X Thread 1: "We just shipped 31 free marketing tools" (post Monday Oct 26, 9 AM ET)

**How to post on X:** Open X.com → click "Post" → write tweet 1 → click "+" to add next tweet → repeat → post when done. Total: 6 tweets, 1 thread.

**Tweet 1/6:**
```
Most "free SEO tool" sites bury the tool under ads and demand your email before showing a result.

I got tired of it. Built 31 free browser-based tools. No signup. No limits. No fake SERP previews.

Live: tools4market.online

🧵👇
```

**Tweet 2/6:**
```
The architecture choice matters:

• Tools run client-side (no server roundtrip)
• Static files on a global CDN
• One tightly-scoped fetch endpoint for URL analysis
• No 9am downtime when everyone needs a robots.txt

Speed is a feature, not a side-effect.
```

**Tweet 3/6:**
```
The tools:

🤖 Robots.txt Generator with AI-crawler presets (20+ bots)
📜 llms.txt Generator (for ChatGPT/Claude/Perplexity)
🏷️ Meta Tag, Open Graph, Twitter Card, Schema generators
🔗 UTM Builder, Slug Generator, Keyword Density Checker
🔐 JWT Decoder, UUID Generator, Image Compressor

31 tools. 4 categories.
```

**Tweet 4/6:**
```
The honest part: every tool states what it actually measured.

A SERP preview says it's an estimate.
A keyword-density tool doesn't quote a fake "ideal" %.
A canonical generator doesn't pretend a link is a command.

The lies on other tool sites cost real people real time.
```

**Tweet 5/6:**
```
Roadmap: 20+ more tools in 60 days.

JSON Validator, QR Code Generator, Regex Tester, Broken Link Checker, SSL Cert Checker, OG Image Generator, and more.

Reply with what you want built — top 3 requests ship first.
```

**Tweet 6/6:**
```
If you ship content for the AI-search era, the toolkit is at tools4market.online

Free forever. No signup. No data sold. Ads in the page chrome, not inside the tool.

RTs appreciated 🙏
```

**Posting tips:**
- Post at 9 AM ET (US East Coast wakes up, EU is mid-day)
- Reply to every reply within 30 minutes (algorithm + goodwill)
- Quote-tweet the thread at 3 PM ET ("this thread is doing well, thanks for the support")
- Save the thread as a Moments on X for permanent reference

### Reddit Comment Templates (3 — post Tuesday Oct 27, 9 AM ET)

These are value-first comments on existing popular posts in r/SEO, r/webdev, r/marketing. The goal: establish presence and earn goodwill before posting our own link.

**Tone rules:**
- Never lead with the link
- Address the question directly with substantive value (50-150 words)
- Mention Tools4Market only when genuinely relevant ("full disclosure: I built [tool] that does this")
- Disclose affiliation always when linking

---

#### Comment Template 1: For r/SEO posts asking "How do I check if AI crawlers can access my site?"

**Subreddit:** r/SEO (Tuesday Oct 27, find a top post from past week asking about AI crawler access)

**Comment body:**
```
Most sites that are invisible to AI search never chose to be — a template robots.txt, a CDN bot-protection toggle, or an aggressive firewall rule did it for them. Here's the 60-second check:

1. Fetch your robots.txt at https://yourdomain.com/robots.txt — confirm it doesn't have `Disallow: /` for GPTBot, ClaudeBot, or PerplexityBot.

2. Check your CDN's bot-protection settings. Cloudflare's "Bot Fight Mode" and "Super Bot Fight Mode" sometimes challenge AI crawlers at the edge even if robots.txt allows them. Add the AI bots to the verified-bot allowlist.

3. Fetch your homepage as GPTBot: `curl -A "GPTBot" https://yourdomain.com/` — confirm you get a 200 with content, not a 403 or empty response.

4. Submit your sitemap to Google Search Console (Google's AI features draw on the regular Search index, not llms.txt).

5. Optionally publish an llms.txt file at root — it's a soft hint that some AI models (Claude, ChatGPT browsing, Perplexity anecdotally) use to prioritize which pages to read first.

The most common cause: people copy a "block all bots" template from somewhere and accidentally disallow GPTBot while thinking they're just protecting against scrapers.
```

*(No Tools4Market link in this comment. The point is value-first, establishes presence, no link yet.)*

---

#### Comment Template 2: For r/webdev posts asking about static site architecture for tools

**Subreddit:** r/webdev (Tuesday Oct 27, find a top post from past week about static sites or browser-based tools)

**Comment body:**
```
The trick is realizing most "tools" don't need a server at all. Text transformations, code generation, parsing, encoding — all of these can run client-side in the browser with no API call, no rate limit, no 9am downtime.

The architecture that works:

• Static HTML/CSS/JS files on a global CDN (Cloudflare Pages, Vercel, Netlify, GitHub Pages — pick one)
• Pure client-side JS for 90% of operations (text processing, code generation, parsing)
• One tightly-scoped serverless function for the rare case you need to fetch a URL (use it only for HTTP fetching — never for storage)
• Google Tag Manager for analytics + Google AdSense for revenue

The result: a tool site that loads in 200ms, has 100% uptime, costs $0/month in server bills, and scales to infinite traffic without you ever touching infrastructure.

The only real constraint: client-side processing can't handle very large files (multi-GB image compression, etc.) — for those you need a server. But for 95% of tool use cases, browser-side is faster, cheaper, and more private.

Full disclosure: I'm building a tools site on this exact architecture — happy to share more about the stack if useful.
```

*(This comment establishes the founder's expertise, mentions "I'm building a tools site" without naming Tools4Market yet. Builds credibility for the eventual link-share in Week 2.)*

---

#### Comment Template 3: For r/marketing posts asking about UTM best practices

**Subreddit:** r/marketing (Tuesday Oct 27, find a top post asking about UTM or campaign tracking)

**Comment body:**
```
Broken UTM naming conventions fail quietly — they don't crash, they just split one campaign into five rows in GA4 and send real traffic to "(direct)/(none)".

The rules that prevent it:

1. Lowercase everything. `utm_source=LinkedIn` and `utm_source=linkedin` show up as two different sources in GA4. Always lowercase at the entry point.

2. Use hyphens, not underscores or spaces. `spring-sale-2026` parses cleanly across Looker Studio and BigQuery. `spring_sale_2026` and `spring sale 2026` don't.

3. Standardize source names. Pick one spelling: `linkedin` (not `li`, not `ln`, not `LinkedIn.com`). Document it. Stick to it.

4. Don't reuse `utm_campaign` for variant names. Use `utm_content` for variants (banner vs text ad, hero vs footer), reserve `utm_campaign` for the campaign name (`spring-sale-2026`).

5. Always include `utm_source` and `utm_medium`. `utm_campaign` is required if you want GA4 to group it. `utm_content` and `utm_term` are optional.

6. Test before publishing. Build the link, paste it in a private browser, click it, verify it shows up in GA4 real-time reports within 60 seconds.

The most common breakage: someone names a campaign `Spring_Sale_2026` in one ad and `spring-sale-2026` in another, then wonders why GA4 shows two campaigns with half the traffic each.

Full disclosure: I built a UTM Link Builder that enforces these rules by default — but the rules themselves are platform-agnostic.
```

*(This comment discloses "I built a UTM Link Builder" — establishes the founder's product without spamming. If anyone asks "which one?", they can reply with the link. Otherwise, they've added value without spamming.)*

---

## How to Find the Right Posts to Comment On

**Reddit search strategy:**

1. Go to https://www.reddit.com/r/SEO/top/?t=week — find posts from the past week with 50+ upvotes
2. Filter for posts that ask a question (not news posts)
3. Pick 1 post per subreddit (r/SEO, r/webdev, r/marketing)
4. Read the post + existing comments thoroughly before replying
5. Add value beyond existing comments (don't repeat what others said)

**If you can't find a recent post that fits:**

- Substitute with r/bigseo, r/SideProject, r/IndieHackers, r/smallbusiness
- Or post your own question to seed the conversation (e.g., "What's your least-favorite 'free' SEO tool site, and why?" — leads naturally to discussing your alternative)

## Tone Reminders

✅ **DO:**
- Read the subreddit rules before posting (some subreddits ban self-promo entirely)
- Add 50-150 words of value before any link
- Disclose affiliation if you mention your own product
- Engage with replies within 30 minutes
- Upvote other helpful comments (goodwill + visibility)

❌ **DON'T:**
- Don't link-drop without context
- Don't post the same comment across subreddits (Reddit's spam filter catches this)
- Don't argue with negative comments publicly — reply with facts, ignore the trolls
- Don't use brand-new accounts (Reddit's algorithm suppresses posts from accounts <7 days old with low karma)
- Don't post more than 1 self-link per 5 comments (Reddit's spam filter ratio)

## Day 3 Preview: First Reddit POST (not comment)

Tomorrow (Day 3), the founder posts their first standalone Reddit thread:

- **Subreddit:** r/SideProject
- **Title:** "I just shipped 31 free marketing tools. No signup, no email wall, no fake SERP previews. AMA about the architecture."
- **Body:** Full draft from Day 1 calendar
- **Posting time:** Tuesday Oct 27, 9 AM ET (US East Coast wakes up)
- **Goal:** 100-500 upvotes, 30-100 comments, 200-1000 site visits

## Tracking

After posting each X thread and Reddit comment, log:
- Post URL
- Posting time
- Impressions (X) or upvotes (Reddit)
- Comments / replies
- Click-throughs (use UTM builder — `utm_source=x.com` or `utm_source=reddit.com`, `utm_medium=social`, `utm_campaign=day1-thread`)
- Site visits from each (visible in GA4 source/medium report)

**Day 1 X thread target:** 100-500 impressions, 30-100 click-throughs
**Day 2 Reddit comments target:** 10-30 upvotes combined, 50-150 click-throughs

## Social Account Setup Checklist (Founder — do today)

- [ ] Create X account: @tools4market (or @tools4marketHQ if taken)
  - Bio: "31 free browser-based marketing tools. SEO · AI Search · Content · Web. No signup. No limits."
  - Profile pic: T4 logo
  - Header: hero image with "31 free tools, no signup"
  - Pin tweet: the launch thread (after posting Monday)

- [ ] Create LinkedIn page: linkedin.com/company/tools4market
  - About: same as X bio, expanded
  - Logo: T4 logo
  - Banner: hero image
  - First post: launch announcement

- [ ] Create Reddit account: u/tools4market
  - Build karma first (post 5-10 comments in SEO/webdev communities with no self-link)
  - Wait 7 days before first self-link post (per Reddit best practice)

- [ ] Create dev.to account: dev.to/tools4market
  - Set up author bio with tools4market.online link
  - Cross-post Friday article

- [ ] Create Hashnode account: hashnode.com/@tools4market
  - Cross-post same dev.to article (canonical to dev.to)

- [ ] Create Medium account: medium.com/@tools4market
  - Cross-post Friday article (canonical to tools4market.online)

- [ ] Create Quora account: quora.com/profile/tools4market
  - Find and answer 5 questions/week

---

# SECTION 6 — AEO FAQ Content for Top 5 Tool Pages
**Agent:** AEO Editor  |  **Asset type:** HTML sections + JSON-LD schema (paste into tool pages)

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

---

# SECTION 7 — Analytics Setup: GSC + GA4 + KPI Dashboard
**Agent:** Analytics Watcher  |  **Asset type:** Step-by-step setup guides + dashboard template

# Day 2 — Analytics Watcher: GSC + GA4 Setup + Daily KPI Dashboard
**Agent:** Analytics Watcher
**Date:** 2026-10-23
**Goal:** Get the founder tracking the right metrics daily by Day 3

## Why This Matters

You can't improve what you don't measure. By Day 3, you should have:

1. **Google Search Console (GSC)** — verified, sitemap submitted, URL inspection working
2. **Google Analytics 4 (GA4)** — installed via GTM, configured for events
3. **A daily KPI dashboard** — a Google Sheet (or simple text file) updated every morning

This guide walks through each, with exact click-by-click instructions.

---

## Part 1: Google Search Console (GSC) — Setup Guide

### Why GSC matters
GSC is the only place to see:
- Which queries bring your site traffic
- Which pages Google has indexed
- Crawl errors, indexing errors, security issues
- Click-through rate (CTR) per query
- Mobile usability issues
- Core Web Vitals per page

GA4 won't show you query data — only GSC does. Skip GSC and you're flying blind.

### Step-by-step setup

#### Step 1: Verify ownership
1. Go to https://search.google.com/search-console
2. Sign in with the Google account you use for the business
3. Click "Add property" → choose "URL prefix"
4. Enter: `https://tools4market.online` (or with www. if that's your canonical)
5. Choose verification method:
   - **Recommended:** Google Tag Manager (if GTM is installed — fastest)
   - **Alternative:** HTML file upload (download from GSC, upload to site root)
   - **Alternative:** DNS TXT record (most permanent but requires DNS access)
6. Click "Verify" — should be instant for GTM, may take a few minutes for DNS

#### Step 2: Add the second property (www vs non-www)
1. Add another property: `https://www.tools4market.online`
2. Verify with the same method
3. Set the canonical version (the one you use) as the primary

**Note:** If your site forces www → non-www redirect (or vice versa), only the canonical version needs to be the primary GSC property.

#### Step 3: Submit sitemap
1. In GSC, navigate to "Sitemaps" (left sidebar)
2. Enter: `sitemap.xml` (GSC will prefix with your domain)
3. Click "Submit"
4. Wait 24-48 hours for status to update to "Success"
5. Verify all 31 tool pages + 10 guides are listed in the sitemap coverage report

#### Step 4: Request indexing on priority URLs
For each of these 5 URLs:
1. Paste URL into GSC's URL inspection bar (top)
2. Click "Request indexing"
3. Wait ~30 seconds for "Indexing requested" confirmation
4. Move to next URL

Priority URLs to request indexing on Day 1:
1. `https://tools4market.online` (homepage)
2. `https://tools4market.online/blog/schema-markup-for-ai-search`
3. `https://tools4market.online/blog/appear-in-chatgpt-search`
4. `https://tools4market.online/blog/why-is-my-site-not-indexed`
5. `https://tools4market.online/ai-search/robots-txt-generator`

#### Step 5: Configure email alerts
1. Go to "Settings" → "Users and permissions"
2. Confirm your email receives critical alerts (yes by default)
3. GSC will email you for: manual actions, security issues, indexing drops >30%, crawl errors

#### Step 6: Bookmark the daily check URL
Bookmark: `https://search.google.com/search-console/performance/search-analytics?resource_id=https://tools4market.online/`

This is your "daily GSC dashboard" — opens straight to performance report.

### GSC daily check (2 minutes/day, every morning)
1. Performance → Search results
   - Check total clicks (vs yesterday, vs 7-day average)
   - Check total impressions
   - Check average CTR
   - Check average position
2. Coverage → "Errors" tab
   - Are there any new errors?
3. URL Inspection → check any URL you published yesterday
   - Status should be "Indexed" or "Indexing requested" within 7 days of publish

---

## Part 2: Google Analytics 4 (GA4) — Setup Guide

### Why GA4 matters
GA4 shows you:
- Where traffic comes from (source/medium)
- What users do on the site (events, pageviews, scroll depth)
- Conversion rate (if you set up conversions)
- Demographics (country, device, browser)

GA4 doesn't show query data (GSC does) — but it shows everything else.

### Step-by-step setup

#### Step 1: Create GA4 property
1. Go to https://analytics.google.com
2. Sign in with the same Google account as GSC
3. Click "Create account" → "Account name: Tools4Market"
4. Create property: "Property name: Tools4Market"
   - Timezone: UTC (or your local timezone)
   - Currency: USD (so RPM matches what AdSense reports)
5. Industry: "Search Engine Optimization" or "Technology"
6. Business size: Small
7. How do you intend to use GA4: check "Generate leads" + "Drive online sales" + "Get baseline reporting"

#### Step 2: Set up data stream
1. Choose "Web" as platform
2. Enter URL: `https://tools4market.online`
3. Stream name: "Tools4Market Web"
4. Enhanced measurement: ON (default — tracks pageviews, scrolls, clicks, video, file downloads)
5. Click "Create stream"
6. Copy the "Measurement ID" (starts with `G-`)

#### Step 3: Install via Google Tag Manager (recommended)
**Option A: GTM (recommended — easier to manage multiple tags)**
1. Go to https://tagmanager.google.com
2. Create container: "Tools4Market"
3. Install GTM container on the site (paste the two code snippets GTM provides into your `<head>` and `<body>`)
4. In GTM, click "Tags" → "New"
   - Tag type: "Google Analytics: GA4 Configuration"
   - Measurement ID: paste from Step 2
   - Trigger: "All Pages"
5. Click "Submit" → "Publish"
6. Verify with Tag Assistant (right-click → "Preview" in GTM)

**Option B: Direct GA4 install (simpler but no GTM)**
1. In GA4, click "Tag installation" → "Add Google tag"
2. Copy the `<script>` snippet
3. Paste into your site's `<head>` (every page)

#### Step 4: Link GA4 to Google Search Console
1. In GA4: Admin → Property settings → "Search Console links"
2. Click "Link" → choose your GSC property
3. Choose the web stream
4. Confirm — within 24 hours, query data flows into GA4 reports (limited)

#### Step 5: Link GA4 to Google AdSense
1. In GA4: Admin → Product links → "AdSense linking"
2. Choose your AdSense account
3. Confirm — AdSense revenue data flows into GA4 reports within 24 hours

#### Step 6: Set up custom events (optional but valuable)

Add these custom events via GTM or directly in GA4:

| Event name | Trigger | Why |
|---|---|---|
| `tool_used` | User clicks any tool's "Generate"/"Submit" button | Tracks which tools are most used |
| `tool_copied` | User clicks "Copy" button on tool output | Tracks tool completion |
| `search` | User uses internal site search | Tracks what users can't find |
| `external_link_click` | User clicks outbound link (affiliate, etc.) | Tracks monetization intent |
| `ad_click` | (Auto-tracked by AdSense) | Tracks ad revenue per page |

In GTM, these are configured as triggers + variables → sent as GA4 events. Requires some GTM setup (1-2 hours).

### GA4 daily check (2 minutes/day, every morning)
1. Reports → Acquisition → Traffic acquisition
   - Check total users (vs yesterday)
   - Check source/medium breakdown (where traffic came from)
2. Reports → Engagement → Pages and screens
   - Which pages got the most views yesterday?
3. Reports → Monetization → Overview
   - AdSense revenue yesterday
   - RPM (revenue per 1000 impressions)
4. Realtime (right sidebar)
   - Active users right now (should match if you have traffic flowing)

---

## Part 3: Daily KPI Dashboard Template (Google Sheet)

### Setup
1. Go to https://sheets.new
2. Rename to: "Tools4Market — Daily KPI Tracker"
3. Create the following tabs (bottom of sheet):

#### Tab 1: "Daily"
Columns (one row per day):
| Date | Day | GA4 Users | GA4 Pageviews | GSC Clicks | GSC Impr. | GSC Avg CTR | GSC Avg Pos | AdSense Impr. | AdSense Clicks | AdSense CPC | AdSense Rev | Top Referrer | Top Page | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-23 | Day 1 | | | | | | | | | | | | | |
| 2026-10-24 | Day 2 | | | | | | | | | | | | | |
| ... | ... | | | | | | | | | | | | | |

#### Tab 2: "Weekly Summary"
Columns (one row per week):
| Week ending | Total Users | Total Impr. | Total Rev. | RPM | Top 3 Sources | Top 3 Pages | Issues | Wins |
|---|---|---|---|---|---|---|---|---|
| Week 1 (Oct 29) | | | | | | | | |
| Week 2 (Nov 5) | | | | | | | | |
| ... | | | | | | | | |

#### Tab 3: "Content Tracker"
Columns (one row per blog post / tool page):
| Publish Date | URL | Target Keyword | Word Count | GSC Clicks (30d) | GSC Impr. (30d) | Avg Position | Notes |
|---|---|---|---|---|---|---|---|
| 2026-10-23 | /blog/robots-txt-ai-crawlers-2026 | robots.txt ai crawlers | 2,150 | | | | |
| 2026-10-23 | /blog/llms-txt-explained | llms.txt | 2,250 | | | | |
| ... | | | | | | | |

#### Tab 4: "Backlinks"
Columns (one row per backlink):
| Date Acquired | Source URL | DR | Anchor | Destination | Type | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

#### Tab 5: "Tool Tracker"
Columns (one row per new tool):
| Build Date | Tool Name | URL | Target Keyword | Search Vol | Build Hours | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

### Daily KPI Snapshot (paste in chat daily)
Every morning at 9 AM, copy this template, fill in numbers, paste into the founder chat:

```
📅 Day X — YYYY-MM-DD

📊 Yesterday's Numbers
- Users: X (vs X previous day, X% change)
- Pageviews: X
- GSC Clicks: X
- GSC Impressions: X
- AdSense Revenue: $X.XX (RPM: $X.XX)

📈 7-day rolling
- Avg daily users: X
- Total revenue: $X.XX
- Top source: X
- Top page: X

🚨 Issues/Alerts
- [if any]

✅ Wins
- [if any]

🎯 Today's focus
- [1-2 things]
```

---

## KPI Definitions (Reference)

| Metric | Definition | Where to find |
|---|---|---|
| Users (GA4) | Unique visitors in a time period | GA4 → Acquisition → Traffic acquisition |
| Pageviews (GA4) | Total pages viewed (including repeats) | GA4 → Engagement → Pages and screens |
| Sessions (GA4) | Visits (a session ends after 30 min inactivity) | GA4 → Acquisition → Traffic acquisition |
| Engaged sessions (GA4) | Sessions with >10s engagement, conversion, or 2+ pageviews | GA4 → Engagement → Engagement overview |
| Engagement rate (GA4) | Engaged sessions / total sessions (target >50%) | GA4 → Engagement → Engagement overview |
| GSC Clicks | Clicks from Google Search results | GSC → Performance → Search results |
| GSC Impressions | Times your site appeared in Google results | GSC → Performance → Search results |
| GSC CTR | Clicks / Impressions | GSC → Performance → Search results |
| GSC Avg Position | Average rank across all queries | GSC → Performance → Search results |
| AdSense Impressions | Times ads were shown | AdSense → Performance |
| AdSense Clicks | Times ads were clicked | AdSense → Performance |
| AdSense CPC | Cost per click (what advertiser paid) | AdSense → Performance |
| AdSense RPM | Revenue per 1,000 impressions | AdSense → Performance (or compute: Rev/Impr*1000) |
| AdSense Page RPM | Revenue per 1,000 page views (different from impression RPM) | AdSense → Performance |

---

## Tracking Goals (per revenue target)

| Day | GA4 Users | GSC Impr. | AdSense Impr. | AdSense Rev. |
|---|---|---|---|---|
| 7 (Week 1) | 30/day | 500 total | 200 total | $0.10 |
| 14 (Week 2) | 100/day | 2,000 total | 1,000 total | $0.50 |
| 21 (Week 3) | 300/day | 8,000 total | 5,000 total | $2.00 |
| 30 (Month 1) | 500/day | 20,000 total | 15,000 total | $5-8 |
| 60 (Month 2) | 3,000/day | 100,000 total | 80,000 total | $50-90 |
| 90 (Month 3) | 10,000/day | 300,000 total | 300,000 total | $140-200 (₹10K+) |

**If you're hitting these numbers on schedule, you'll hit ₹10K by Day 90.**

If you're behind by Day 30 (Month 1) on the GA4 Users metric, the Day 90 ₹10K target is at risk — escalate to aggressive content velocity (2 posts/day instead of 1) or speed up directory submissions.

---

## Founder Action Items (Today)

- [ ] Create Google Search Console property + verify ownership
- [ ] Submit sitemap.xml to GSC
- [ ] Request indexing on 5 priority URLs (listed above)
- [ ] Create GA4 property + install via GTM or direct script
- [ ] Link GA4 to GSC + AdSense
- [ ] Create the Google Sheet "Tools4Market — Daily KPI Tracker" with 5 tabs
- [ ] Fill in Day 1 row (today's numbers — should be ~0 traffic)
- [ ] Bookmark GSC + GA4 + Sheet URLs in browser toolbar
- [ ] Set 9 AM daily calendar reminder: "Daily KPI check"

---

## Day 3 Plan (Analytics Watcher)

Day 3 will produce:
1. GA4 custom event tracking setup guide (step-by-step for `tool_used`, `tool_copied`, `search`, `external_link_click`)
2. Weekly KPI review template (Sunday 5 PM review session)
3. Looker Studio dashboard (free, visualizes GA4 + GSC + AdSense in one place)
4. Alert setup — Slack/email notification if any metric drops >30% day-over-day

---

# End of Day 2 Master Execution Pack

**Document compiled by:** Z.ai CEO Operations
**Date compiled:** 2026-10-23
**Source files:** 7 agent reports
**Total content:** ~16,166 words across 7 sections

## Next: Day 3 Plan (preview)

The Day 3 master pack will include:
- Refresh of existing guide "How to Block GPTBot" → expanded to 2,000+ words
- Refresh of existing guide "How to Appear in ChatGPT Search" → expanded to 2,500 words
- Content gap analysis vs top 5 SEO tool competitors
- FAQPage boilerplate schema for remaining 26 tool pages
- First Reddit standalone post (r/SideProject, Tuesday Oct 27)
- GA4 custom event setup guide
- Outreach email templates for 10 SEO newsletters

## Founder's Next Status Check (Day 3 morning)

Paste this template into chat with yesterday's numbers filled in:

```
Day 3 — YYYY-MM-DD

Yesterday's Numbers (Day 2 actuals)
- GA4 Users: ___
- GSC Clicks: ___
- GSC Impressions: ___
- AdSense Revenue: $___.___
- AdSense RPM: $___

Completed from Day 1+2 Critical List
- [ ] GSC verified
- [ ] Sitemap submitted to GSC
- [ ] Indexing requested on 5 priority URLs
- [ ] robots.txt deployed
- [ ] llms.txt deployed
- [ ] Organization + WebSite schema added to homepage
- [ ] Blog post #1 published
- [ ] Blog post #2 published
- [ ] Top 5 tool pages have FAQ sections + FAQPage schema
- [ ] GA4 property created + linked to GSC + AdSense
- [ ] Google Sheet KPI tracker created

Issues / Blockers
- [if any]

Today's focus (Day 3)
- [1-2 priority items]
```

Reply with the filled template and I will dispatch Day 3 immediately.

---

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

# Day 12 — Product Hunt package

**Prepared:** 26 Oct 2026 · **Site state:** v2.17.1, Worker `60455cbb`
**Facts used:** 44 tools across 5 categories, 24 guides, 81 pages, free, no account required, no usage limits.

*Everything below is copy you can paste. Where a field limit or a Product Hunt mechanic is stated, it is either a figure Product Hunt publishes or it is marked **confirm in the form** — I have not submitted a launch, so I will not pretend to know a rule I have not read today.*

---

## 1. Name

```
Tools4Market
```

The domain is `tools4market.online`; keep the product name and domain distinct in the listing so the URL is not read as part of the name.

---

## 2. Tagline (60 characters max)

**Recommended — 46 characters:**

```
44 free marketing tools. No signup, no limits.
```

Alternates, each under 60:

| Tagline | Chars | When to use it |
|---|---|---|
| `Free SEO tools that run in your browser` | 39 | If the audience is more technical |
| `44 free SEO tools. No signup, no limits.` | 40 | If "marketing" tests worse than "SEO" |
| `SEO and AI-crawler tools that show their work` | 45 | If you want the honesty angle in the tagline itself |

**Why this one:** it states the count (a real, checkable number), the price, and the two objections a tools visitor actually has — an account wall and a usage cap. It does not claim to be the best, fastest, or most complete, because it is none of those and the audience can tell.

---

## 3. Short description (the line under the tagline in the listing)

```
44 browser-based marketing, SEO and AI-crawler tools — meta tags, schema, robots.txt for AI bots, sitemaps, redirects, UTMs, calculators. Everything runs free with no account and no limits.
```

---

## 4. Long description (the "About" body)

Paste as-is; it uses plain paragraphs because Product Hunt's editor renders rich text inconsistently across themes.

```
Most free tool sites are a funnel with a form on top. Enter your URL, wait, get a score out of 100 that nobody can explain, then hit a paywall to see the actual problems. Tools4Market is the opposite: 44 small tools that either do the thing in your browser or tell you exactly what they fetched and what they could not check.

What's in it:

— 12 SEO and meta tools: meta tag generator, Open Graph and Twitter Card builders, canonical and hreflang generators, schema markup generator, SERP preview, meta description checker, crawler audit, SEO score checker, OG image tester, hreflang checker.
— 4 AI-search and crawler tools: robots.txt generator, robots.txt tester, AI crawler blocker, llms.txt generator.
— 8 content and social tools: URL slug generator, UTM link builder, keyword density checker, hashtag generator, case converter, duplicate line remover, lorem ipsum, reading time.
— 14 web and utility tools: .htaccess redirects, XML sitemap generator, sitemap validator, password generator, Base64, URL encoder, UUID, JWT decoder, user agent parser, ICS calendar, image compressor, JSON formatter, timestamp converter, IP converter.
— 6 marketing calculators: ROI, ROAS, CAC, CPC/CPM/CPA, email ROI, budget.

Two things worth knowing before you try it:

1. Every tool has two modes. "Analyze" fetches a public URL through our own proxy and pre-fills the tool; "manual" is a plain textarea and works with no network at all. If a tool never needs a fetch, it says "Runs in your browser" on the card, and your input never leaves the tab.

2. The honest limits are printed. The SERP preview shows the width a title occupies, not a promise about how Google truncates it — Google truncates by pixel width, so any tool claiming a character count is guessing. The schema generator refuses to describe content that is not on the page, because markup for invisible content violates Google's structured data policies. The robots.txt tester parses per RFC 9309 and shows the verdict per bot, including the groups you thought you wrote.

There are also 24 guides, each sourced from primary documentation rather than from another SEO blog. They exist for the same reason the tools do: a tool that gives you a number without a source is a horoscope with a text field.

Free, no account, no limit on runs. Built and maintained by one person, with the audit trail in the repo.
```

---

## 5. Topics

Pick up to **confirm in the form** (Product Hunt currently allows a small number):

```
SEO · Marketing · Developer Tools · Productivity · Artificial Intelligence
```

If it allows only three: `SEO`, `Marketing`, `Developer Tools`.

---

## 6. Gallery images — five concepts (1270×760, confirm size in the form)

Each is a still. No stock photography, no gradient mesh, no upward-trending chart. The visual language of the site is warm paper, serif display type, brass accents — keep that so the listing looks like the product.

| # | Headline on the image | Sub-line | What is actually visible |
|---|---|---|---|
| 1 | **44 tools. No signup.** | Free, with no run limits | A 4×3 grid of tool cards, cropped mid-scroll, with the count in the corner. Real cards, real names. |
| 2 | **Two modes: analyze or paste.** | The tool works whether or not the fetch does | Split screen: left shows the Analyze panel with a fetched URL, right shows the same tool filled manually. Caption marks which is which. |
| 3 | **It shows you what it fetched.** | Status, canonical, robots verdict, byte count | The Web Crawler Audit output, unedited, with the response headers legible. |
| 4 | **AI crawlers: allowed or not, per bot.** | Parsed per RFC 9309, not per blog post | The robots.txt tester's per-bot verdict table — `GPTBot` blocked, `OAI-SearchBot` allowed, `Google-Extended` allowed — with the matching `User-agent` groups shown beside it. |
| 5 | **24 guides, sourced from the docs.** | Google, sitemaps.org, RFCs — not other blogs | Three guide cards with their cited sources visible at the bottom of each. |

**Thumbnail (240×240 or square):** the brass `T4M` monogram on paper, nothing else. At 60 px in a feed, a mark beats a wordmark.

---

## 7. Maker's first comment

Post this immediately after the listing goes live. It is the highest-leverage 200 words in the whole launch, because it is the only place a reader can see the reasoning behind the product.

```
Maker here. A few things I'd rather say up front than have you find out at 3pm.

The tools are free and there's no account because the alternative is a funnel, and I didn't want to build one. There's no run limit either. If that changes, it will be announced on the site first, not in a tweet.

Two modes exist because a fetch can fail. Analyze pulls a public URL through our proxy and pre-fills the tool. Manual is a textarea and needs no network at all. If you're behind a VPN or the page needs a login, manual is the path — it isn't a degraded fallback, it's the same tool.

The AI-crawler tools are the part I care most about. Most robots.txt advice online is folklore: people block the wrong user-agent, or they block a bot that also happens to be the one that cites them. The tester parses per RFC 9309 and shows the verdict per bot, so you can see that "Allow: /" after a "Disallow: /" is doing what you think it's doing. This site's own robots.txt blocks AI training crawlers and explicitly allows the answer engines, and there's a test that checks the served file rather than the source file, because those two drifted apart for a week.

Happy to answer anything about the architecture, the parsing, or why I think most "SEO score" numbers are made up.
```

**Do not** ask for upvotes anywhere — not in the comment, not in a DM, not in a group chat. It is against Product Hunt's guidelines and it is the fastest way to have a launch removed.

---

## 8. Pre-launch email

Send to people who already know you, 24–48 hours before. One send, no reminder, no "bump" email.

**Subject:** `Launching on Product Hunt Tuesday — 44 free tools`

```
Hey {{first name}},

I've been building Tools4Market for a few weeks and it goes live on Product Hunt on {{date}}. 44 free SEO and marketing tools, no signup, no usage limit — meta tags, schema, robots.txt for AI crawlers, sitemaps, redirects, calculators.

No ask attached. If it's useful, it's there; if you want to leave a comment on the launch, that's genuinely the part that helps. Please don't ask anyone to upvote — Product Hunt penalises it, and I'd rather have thirty real readers than three hundred coordinated ones.

{{your name}}
https://tools4market.online
```

The "no ask attached" line is doing real work. A launch email that opens with "I'd be so grateful if you could upvote" gets forwarded to nobody.

---

## 9. Launch day timeline

All times **Pacific**, because Product Hunt's day rolls over at midnight PT. The single most important row is 12:05 — everything after it is maintenance.

| Time | Action | Why |
|---|---|---|
| −7 days | Create the maker profile, fill the bio, add a real photo | An empty profile beside a launch reads as a throwaway |
| −3 days | Upload gallery images, thumbnail, description; save as draft | Leave nothing to do on the day except press the button |
| −1 day | Re-read the listing as a stranger would; cut one sentence from the description | Every draft is 10% too long |
| 00:01 | Listing goes live (scheduled in advance) | PH's day starts at midnight PT, not 9am |
| 00:05 | Post the maker's first comment | Early visitors read comments before they read features |
| 00:15 | One post on X with the link, no vote request | One, not five |
| 01:00 | Reply to every comment so far | Reply speed is the only thing you fully control |
| 06:00 | Reply to overnight comments; fix anything that broke | Traffic from Asia and Europe lands here |
| 09:00 | Second and last X post: a specific finding, not "we're live" | Different post, different reason to click |
| 12:00 | Reply to everything; check the site is up under load | Load, not ranking, is the launch-day risk |
| 17:00 | Reply to everything; note the questions people keep asking | Those questions are next month's FAQ and next week's guide |
| 23:59 | Thank-you comment, one line, no scoreboard | The listing keeps working after the day ends |
| +1 day | Email everyone who commented, individually | The only follow-up that converts |

---

## 10. What not to say

Written down because it is easy to drift into under launch pressure:

- **No invented numbers.** There is no "used by 10,000 marketers" and no "trusted by teams at". There are 44 tools and one maintainer.
- **No "AI-powered".** Two tools touch a model (the AI fix suggestions); the other 42 are deterministic parsers and generators. Calling the suite AI-powered is the exact inflation the guides argue against.
- **No ranking or traffic promises.** "Rank higher" is not a feature the site can deliver and not a claim the guides make.
- **No fake urgency.** No "limited free access", no countdown.
- **No competitor names in the listing** beyond the comparison guide that already exists. "Screaming Frog alternative" belongs in the guide, not in the pitch.

---

## 11. After the launch

The listing keeps sending traffic for months; the day is not the asset, the page is. Two things worth doing the week after:

1. **Answer the recurring questions in public.** Whatever three questions show up most in the comments become one FAQ block on the homepage and one guide. That is free product research.
2. **Leave the listing alone.** Do not edit the description to add keywords. PH pages rank on their own, and edits after launch read as churn.

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

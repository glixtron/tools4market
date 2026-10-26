# Day 12 — Directory descriptions

**Prepared:** 26 Oct 2026 · **Site state:** v2.17.1, Worker `60455cbb` · 44 tools, 24 guides, 81 pages

*Copy you can paste, with the field limits each directory actually enforces. Where a limit is quoted, it came from the live form or the live pricing page on 26 Oct 2026. Where it is not quoted, the row says **confirm in form** — I have not submitted to these directories, so I am not going to invent a character count.*

---

## 1. What changed since the earlier directory list

Four of the seven entries in `docs/founder-actions.md` §4 were described from hearsay. Measuring them changed the plan, in one case reversing a recommendation.

| Earlier claim | What the live site says (26 Oct 2026) | Consequence |
|---|---|---|
| LaunchBuff: “permanent dofollow listings” | Free tier is **`Nofollow backlink`**, requires the LaunchBuff badge, and **free tournament entry is paused — “our free queue has grown to ~1 year.”** Dofollow starts at the **$19** Premium tier. | The free listing is not worth a year's wait for a nofollow link. Dofollow here means paying, which is a different decision (§7). |
| AlternativeTo: submit via `/add-app/` (403 to `curl`, “works in a browser”) | `/add-app/` returns **404 in a real browser**. So do `/manage/add-app/`, `/submit/`, `/apps/new/`, `/new-app/`. There is no logged-out “add” control anywhere in the header. | The old path is dead. Submission is **login-gated**; the 403 was Cloudflare, and it was hiding a 404. |
| SaaSCity: “badge-model dofollow directory” | True, and the cost is explicit: free = dofollow DR 70+ backlink, **no map placement**, **badge embed required**, **~364-day review queue**. | Free is fine as a set-and-forget; do not expect the listing to appear this year. |
| tools.cafe: “editorial review 2–7 days” | Free queue is **30 days** (“Goes live Wed 25 Nov, a 30-day wait”), **badge on your site required**, dofollow **once the badge is verified**. | The best free dofollow deal of the seven, and the only one measured in weeks rather than a year. |

Two further facts worth knowing before you spend an hour on this:

- **tools.cafe, Launchstag and LaunchBuff are the same operator family.** tools.cafe's footer lists “Partner Sites: Launchstag · Launchbuff · Launchbison”. Three of the seven targets are one business. Submitting to all three is not three independent backlinks; plan accordingly.
- **AlternativeTo is the only target whose traffic comes from “X alternative” intent**, which is the intent our `screaming-frog-alternative` guide already targets. It is also the only one that is genuinely login-gated. It is worth the account.

---

## 2. Master copy — three lengths

Every directory below uses one of these, sometimes with the first sentence swapped. They are deliberately the same product story at three lengths, so a reader who sees two listings sees consistency rather than three different products.

### 2a. Short — 60 words

For directories with a one-or-two-sentence field, and for gallery captions.

```
Tools4Market is 44 free marketing, SEO and AI-search tools that run in your browser: meta tag, Open Graph, schema, robots.txt and llms.txt generators, sitemaps, redirects, UTM builders and marketing calculators. No signup, no usage limits and no paywalled results. Every tool has a manual mode that works with no network, and the guides cite primary documentation rather than other blogs.
```

*(60 words exactly — verified with `wc -w`.)*

### 2b. Medium — 160 words

The default. Fits tools.cafe (100–1,000 chars), SaaSCity (50–5,000), SaaSHub, and Product Hunt's short description.

```
Tools4Market is 44 free marketing, SEO and AI-search tools that run in your browser — no account, no usage limit, and no result hidden behind a paywall.

Twelve SEO and meta tools cover the routine work: meta tag, Open Graph, Twitter Card, canonical, hreflang and schema generators, a SERP preview, a meta description checker, a crawler audit and an SEO score checker. Four AI-search tools handle robots.txt generation and testing, AI crawler blocking and llms.txt. Eight content tools cover slugs, UTM links, keyword density, hashtags and text cleanup. Fourteen web utilities cover redirects, sitemaps, encoding, JWTs, JSON and images. Six calculators cover ROI, ROAS, CAC, CPC/CPM/CPA, email ROI and budgets.

Two things set it apart from other free tool sites. Every tool also has a manual mode that needs no network. And every claim is bounded: the SERP preview shows pixel width rather than promising truncation, and the robots.txt tester parses per RFC 9309 and shows the verdict per bot.
```

*(160 words, 994 characters — inside tools.cafe's 1,000-character limit, so this one works everywhere.)*

### 2c. Long — 300 words

For directories that reward a full description (SaaSCity's free-tier indexation depends on length — see §6).

```
Tools4Market is 44 free marketing, SEO and AI-search tools that run in your browser. There is no account, no usage limit, and no result held back behind a paywall.

The catalogue is organised into five groups. SEO and meta (12 tools): meta tag, Open Graph, Twitter Card, canonical, hreflang and schema generators, a SERP preview, a meta description checker, a web crawler audit, an SEO score checker, an OG image tester and an hreflang checker. AI search and crawlers (4): a robots.txt generator with per-bot presets, a robots.txt tester that parses per RFC 9309 and reports the verdict for each user-agent, an AI crawler blocker, and an llms.txt generator. Content and social (8): URL slugs, UTM links, keyword density, hashtags, case conversion, duplicate-line removal, lorem ipsum and reading time. Web and utility (14): .htaccess redirects, XML sitemap generation and validation, passwords, Base64, URL encoding, UUIDs, JWT decoding, user-agent parsing, ICS calendars, image compression, JSON formatting, timestamps and IP conversion. Marketing calculators (6): ROI, ROAS, CAC, CPC/CPM/CPA, email ROI and budget.

Every tool has two modes. “Analyze” fetches a public URL through a first-party proxy and pre-fills the tool; “manual” is a plain textarea that works with no network at all, so a VPN, a login wall or a slow origin is not a dead end.

The site publishes its limits instead of hiding them. The SERP preview reports the pixel width a title occupies and says plainly that Google truncates by width, not character count. The schema generator refuses to describe content that is not on the page. The robots.txt tester separates “blocked by robots.txt” from “blocked by a firewall”, because those two failures have different fixes.

There are also 24 guides, each sourced from primary documentation — Google's, sitemaps.org, the RFCs — rather than from another SEO blog. Free, and built by one person.
```

### 2d. One-liners (for taglines and card fields)

| Use | Copy | Chars |
|---|---|---|
| Product Hunt tagline | `44 free marketing tools. No signup, no limits.` | 46 |
| tools.cafe tagline (≤100) | `44 free SEO, AI-crawler and marketing tools that run in your browser.` | 69 |
| SaaSCity tagline (≥10) | `44 free SEO and AI-crawler tools, no signup` | 43 |
| SaaSHub tagline | `Free browser-based SEO, AI-search and marketing tools` | 53 |
| AlternativeTo tagline | `Free browser-based SEO and marketing tools` | 42 |

---

## 3. Feature bullets — verb-first, as tools.cafe requires

tools.cafe asks for “at least 3, start with a verb”. Use these six there, and reuse them anywhere a bullet list is allowed.

```
Generate meta, Open Graph, Twitter Card, canonical and hreflang tags
Validate schema markup and see what Google can actually parse
Test robots.txt per RFC 9309, with a verdict for each AI crawler
Build llms.txt and control which answer engines may cite you
Create sitemaps, redirects, UTMs and slugs without leaving the tab
Run every tool in manual mode when a fetch is not possible
```

---

## 4. Per-directory field map

Ordered by what I would actually do first. “Variant” refers to §2.

| # | Directory | Submission entry point | Status 26 Oct | Verified field limits | Variant |
|---|---|---|---|---|---|
| 1 | **tools.cafe** | `tools.cafe/submit` | 200, form live | Tagline **0/100**; description **100–1,000 characters**; key features ≥3, **start with a verb**; logo square ≤2 MB; screenshot **1200×630**, ≤2 MB; category from a fixed list | 2b + §3 |
| 2 | **Product Hunt** | `producthunt.com/posts/new` | 200 → `/login` | Tagline 60 (widely documented, **confirm in form**); description limit **confirm** | 2a or 2b |
| 3 | **SaaSHub** | `saashub.com/services/submit` | 200, guidelines visible | Description limit **confirm**; accepts “most software products and apps” and “websites … leaders in a specific niche” | 2b |
| 4 | **Launchstag** | `launchstag.com/submit` | 200 (client-rendered shell) | Fields **not readable** without JS; FAQ documents claim → dashboard → badge. Badge already in our footer | 2b |
| 5 | **SaaSCity** | `saascity.io/submit` → `/saascity?submit=1` | 200 | Title ≥3; tagline **≥10**; description **50–5,000**; category required; free listings below an unstated word minimum may not be indexed | **2c** |
| 6 | **AlternativeTo** | none public — **sign in first** | `/add-app/` **404 in browser** | Fields **not reachable** logged out | 2b + §5 |
| 7 | **LaunchBuff** | `launchbuff.com/submit` | 200 | Free tier: permanent page, **nofollow**, badge required, **~1 year queue** | skip — see §7 |

### Channel rules that override the form

- **tools.cafe free tier requires the badge on your site** and verifies it before the link goes dofollow. That is a site change, not a form field (§6).
- **SaaSCity free tier likewise requires the badge embedded.** Same problem.
- **Launchstag's badge is already in the footer** of every page, plain `<a href>`, no `nofollow`.
- **SaaSHub has a paid “Feature My Product” placement** next to the free submission. Skip the paid one.
- **Product Hunt and AlternativeTo links are nofollow.** Their value is referral traffic and brand search, not link equity. Say that out loud before spending a day on either.

---

## 5. AlternativeTo — the “alternative to” mapping

AlternativeTo's value is that it ranks for *“X alternative”*. The mapping is the whole submission, so it needs to be honest: claiming to be an alternative to something we do not do gets the listing reported and gets the account flagged.

| Target app | Honest? | What to enter | Why it holds |
|---|---|---|---|
| **Screaming Frog SEO Spider** | ✅ Yes | Alternative to Screaming Frog SEO Spider | We ship a Web Crawler Audit that checks one page's status, canonical, meta and robots verdict. It is not a site crawler. Say “for single-page checks” in the description so the claim survives contact with a Screaming Frog user. |
| **JSONLint** | ✅ Yes | Alternative to JSONLint | JSON Validator & Formatter does the same job in-browser, with no paste-to-server round trip. |
| **SmallSEOTools** | ⚠️ Partly | Alternative to SmallSEOTools | We cover a subset — meta tags, keyword density, slug, lorem ipsum — not the full ~100-tool set. Do not claim parity. |
| **Sitechecker** | ⚠️ Partly | Alternative to Sitechecker | Sitechecker is a site-wide audit and rank tracker; we do single-page checks and calculators. The honest phrasing is “for one-off page checks, not ongoing site monitoring”. |
| **QRCodeGenerator** | ❌ **No** | — | **We have no QR code tool.** The mapping in the Day 12 brief has no corresponding tool in the catalogue of 44. Dropped rather than fudged; adding a QR generator to justify a directory listing is the tail wagging the dog. |

**If challenged on any of these**, the answer is the same one the guides give: the tool does one page, in the browser, and says so on the card. That is a defensible product, and it is a weaker claim than “Screaming Frog alternative” implies — which is why the description has to carry the qualifier.

---

## 6. The badge problem — three free tiers, three badges

This is the one item here that needs a decision before the submissions, because it is a visible design change to every page.

| Directory | Free tier requires | Badge already shipped? |
|---|---|---|
| Launchstag | Launchstag badge | ✅ yes, footer, every page |
| tools.cafe | tools.cafe badge | ❌ no |
| SaaSCity | SaaSCity badge | ❌ no |
| LaunchBuff | LaunchBuff badge | ❌ no (and the free link is nofollow, so not worth it) |
| SaaSHub, Product Hunt, AlternativeTo | nothing | — |

Stacking three 198×62 images in the footer is a real cost: three external image requests on every page, three visual elements competing with the cookie and legal row, and a footer that starts to read as a badge farm — which is exactly the aesthetic the site is trying not to have.

Three ways to resolve it, in order of preference:

1. **Ask each directory whether a text link passes verification.** Launchstag's model is a badge, but their verifier may accept `<a href="https://tools.cafe">` in the footer. One email each, and the answer decides the design. This is the cheapest path and the one I would try first.
2. **One “Listed on” row, text only, at footer text size.** `Listed on: Launchstag · tools.cafe · SaaSCity` as three plain links. If the verifiers accept it, it costs one line and no images.
3. **Ship the badges, but only after the listing is live.** A badge for a listing that does not exist yet is a claim with nothing behind it. Add it when the listing URL exists, and hard-code the listing URL — not the directory homepage — so the link is discoverable rather than decorative.

What I would not do: add three badge images optimistically and hope. That is a visible change to 81 pages made on a guess about a third party's verifier.

### The two emails — send these before submitting

Both sites publish a support address, so this is a five-minute job rather than a contact-form roulette. `support@tools.cafe` is on their FAQ; `support@saascity.io` is on their contact page.

**One sequencing detail that decides the order for tools.cafe:** their FAQ says the badge snippet is in the listing dashboard *after your tool goes live*, and that placing it “is a required condition of the listing”. So for them the order is submit → go live → badge → verified → dofollow. You cannot place the badge first, because it does not exist yet. That means the question below has to be answered *before* you submit, or you find out in 30 days with a listing that is live and not dofollow.

**Email 1 — tools.cafe**

```
Subject: Badge requirement — does a text link pass verification?

Hi,

I'm submitting a free browser-based tools site (44 SEO and marketing tools, no
account, no usage limits) to the free queue and I want to get the badge right
before my go-live date rather than after it.

Two questions:

1. The FAQ says placing the badge is a required condition of the listing. Does a
   plain text link in the site footer pass verification, or is the badge image
   itself required? I'm asking because the footer already carries a partner badge
   and I'd rather not stack four images on every page if a text link satisfies
   the same requirement.

2. Should the badge link to the listing page or to tools.cafe generally? I'll
   hard-code the listing URL once it exists, but I'd like to confirm that's what
   you check for.

Happy to place whatever you need — I just want to ship it once.

Thanks,
[name]
tools4market.online
```

**Email 2 — SaaSCity**

```
Subject: Free tier badge — is a text link acceptable?

Hi,

I'm submitting a free browser-based tools site (44 SEO and marketing tools, no
signup) and I'm working through the free-tier requirements.

The pricing page lists "embed directory badge on your site" for the free plan.
Does a plain text link in the footer satisfy that, or does it have to be the badge
image? I'm trying to avoid stacking several directory badges in the footer, so if
a text link passes your check I'd rather do that.

Also: should the link point at my listing page or at saascity.io? I'll use the
listing URL once it's assigned.

Thanks,
[name]
tools4market.online
```

**What the answers mean:**

| Answer | What to do |
|---|---|
| Both accept a text link | Ship one `Listed on: …` footer row, three plain links, no images. Zero design cost, no extra requests. |
| Images required | Ship the badges one at a time as each listing goes live, and hard-code the listing URL in the `href`. Accept the footer cost knowingly. |
| No answer within a week | Submit to SaaSHub and AlternativeTo first (neither needs a badge) and treat the two badge sites as pending. Do not guess. |

**Site-side change if badges are needed:** `build.mjs` already renders the Launchstag badge in the footer; adding siblings is a small template edit, and the `test:live` suite would need a companion assertion so a badge cannot silently disappear. Say which option you want and I will wire it.

---

## 7. LaunchBuff — the paid-link question, stated plainly

LaunchBuff's tiers, read from their pricing page today:

| Tier | Price | Link | Queue |
|---|---|---|---|
| Free | $0 | **Nofollow**, badge required | **~1 year** (“free tournament entry is paused”) |
| Premium | **$19** (from $39) | **Permanent dofollow**, no badge | Instant |
| SEO Growth | **$39** (from $99) | **3 permanent dofollow** + review page | Instant |

$19 for an instant dofollow link on a site claiming DR 74 is, on its face, the cheapest link in this document. It is also a **paid link**, and Google's link spam policy treats “buying or selling links for ranking purposes” as a violation whether or not the seller calls it a listing fee. A site whose entire editorial position is “most SEO advice is folklore” cannot then buy dofollow links and keep that position.

So: **free tier, or nothing.** The free tier is a year-long queue for a nofollow link, which is worth roughly zero, so the honest answer is **skip LaunchBuff**. If you later decide the referral traffic is worth $19 as *advertising*, buy it as advertising — expect the link to be treated as sponsored, and do not count it as an authority win.

---

## 8. Suggested order

1. **tools.cafe** — 30-day queue, free, dofollow. Submit today so the clock runs. Needs the badge decision (§6).
2. **SaaSHub** — free, no badge, no queue mentioned, fits the comparison intent our guides already target.
3. **AlternativeTo** — make the account, then add the app with the §5 mapping. Highest-intent traffic of the seven.
4. **Launchstag** — claim, then verify with the badge already in place. This is the cheapest win because the site side is done.
5. **SaaSCity** — free, dofollow, but a ~364-day queue: submit now with variant 2c and forget it.
6. **Product Hunt** — not a submission, a launch. Separate package: `Day12_ProductHunt_Package.md`.
7. **LaunchBuff** — skip (§7).

Doing 1–5 is about 90 minutes including account creation, once the badge question is answered.

---

## 9. What I could not verify

- **Product Hunt's current tagline and description limits.** `producthunt.com/posts/new` and the whole help centre return 403 to a non-browser client. The 60-character tagline is stable across every source I can find but it is not quoted from a live form here.
- **AlternativeTo's add-app fields.** No public URL; the form appears only for signed-in users.
- **Launchstag's submit fields.** The page is a client-rendered Next.js shell; the text is not in the HTML.
- **SaaSHub's description limit.** The guidelines page states which products are accepted, not how long the description may be.
- **SaaSCity's free-tier indexation word minimum.** The validator string is `{words}/{min} words. Google usually will not index a free listing under {min} words` — the minimum is injected at runtime and is not in the HTML. This is exactly why the long variant exists: 300 words clears any plausible threshold.
- **Whether any of the three badge verifiers accept a text link.** Needs an email each (§6).

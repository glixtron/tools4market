# Day 12 — founder-side deliverables

**Prepared:** 26 Oct 2026 · **Site state:** v2.17.1, Worker `60455cbb` · 44 tools · 24 guides · 81 pages

Day 12 was not a content day. The build is done and the guides are shipped, so the four things still blocking revenue and traffic are all owner-side. These four documents are the writing that does **not** need an account, plus the verification work that turned out to be the most valuable part of it.

| File | What it is | Use it when |
|---|---|---|
| [`Day12_ProductHunt_Package.md`](Day12_ProductHunt_Package.md) | Name, tagline, short and long description, 5 gallery concepts at 1270×760, maker's first comment, pre-launch email, launch-day timeline, what not to say | Preparing the Product Hunt launch |
| [`Day12_Directory_Descriptions.md`](Day12_Directory_Descriptions.md) | Three description lengths (60 / 160 / 305 words), verb-first feature bullets, per-directory field map with verified limits, AlternativeTo “alternative to” mapping, the badge decision | Submitting to any directory |
| [`Day12_Outreach_Pitches.md`](Day12_Outreach_Pitches.md) | Five channels ranked by expected value, SEJ's contributor rules quoted verbatim, SEOFOMO sponsorship enquiry, HN Show HN notes, Indie Hackers post outline, blocked-targets table | Pitching, or deciding not to |
| [`Day12_Social_Posts.md`](Day12_Social_Posts.md) | 3 X threads (18 tweets, all ≤280 chars, script-verified), 3 Reddit posts, 5 comment templates, corrected posting calendar | The two-week distribution kickoff |

Everything here is copy you can paste, except where it deliberately is not: the HN comment and the SEJ application are **notes**, because both platforms explicitly prohibit generated text and a pasted paragraph would be recognised and punished.

---

## What the verification pass changed

Six things in the Day 12 brief were wrong, and four of them would have cost money or an afternoon.

| # | The brief said | What is actually true | Consequence |
|---|---|---|---|
| 1 | Launch thread goes out “Sunday Oct 26” | **26 Oct 2026 is a Monday** | Calendar corrected; Tuesday–Thursday is the better slot, so the sequence moved |
| 2 | AlternativeTo: submit at `/add-app/` (“403 to curl, works in a browser”) | **404 in a real browser.** So are `/manage/add-app/`, `/submit/`, `/apps/new/`, `/new-app/`. No logged-out add control exists | Submission is login-gated; the 403 was Cloudflare hiding a dead URL |
| 3 | LaunchBuff offers “permanent dofollow listings” | Free tier is a **nofollow** link, requires their badge, and free entry is **paused with a ~1-year queue**. Dofollow starts at **$19** | Free listing is not worth the wait; paid dofollow is a link scheme (§7 of the directory file) |
| 4 | AlternativeTo mapping includes “alternative to QRCodeGenerator” | **There is no QR code tool among the 44** | Mapping dropped rather than fudged |
| 5 | Search Engine Land: “invite-only, no unsolicited pitches” | **Site is unreachable** — Cloudflare challenge to `curl` *and* to a real browser | Recorded as blocked and **unverified**; the earlier quote is not repeated as fact |
| 6 | SaaSCity and tools.cafe were “free directories” | True, but both require **their badge on your site** for the free tier | A visible site change across 81 pages, needing a decision before submitting |

Two of those are the same class of error the guides are about: **a 200 is not evidence**. `/write-for-sej/` returns 200 and serves “20 Web Directories You'll Still Want To Use”. CMI returns 200 with `<title>news` for every path. The only way to know what is on a page is to read the page.

---

## Source-verification table

Every URL cited in the four documents, with how it was checked, what it returned, and what that means. “Browser” means a real Chromium session; “curl” means a scripted GET with a desktop User-Agent.

| URL | HTTP | Title / content found | Verdict |
|---|---|---|---|
| `tools.cafe/submit` | 200 | “Place an order — submit your product · tools.cafe” — tagline 0/100, description 100–1,000 chars, features ≥3 verb-first | ✅ Form verified |
| `tools.cafe/pricing` | 200 | Free queue **30 days**, badge required, dofollow after verification; $15 / $29 tiers; DR 68 and 177,250 visits/30d are **their claims** | ✅ Verified |
| `tools.cafe/` (footer) | 200 | “Partner Sites: Launchstag · Launchbuff · Launchbison” | ✅ Network confirmed |
| `saashub.com/services/submit` | 200 | “Submit a Product” — accepted: “Most software products and apps”, “websites … leaders in a specific niche”; paid “Feature My Product” | ✅ Verified |
| `saashub.com/submit` | 200 | Their own **list of 110 submission sites**, not a product form | ⚠️ Wrong page for our purpose |
| `producthunt.com/posts/new` | 200 → `/login` | Login wall | 🔒 Login-gated; field limits unverified |
| `help.producthunt.com/en/` | 403 | Cloudflare | 🚫 Blocked |
| `launchstag.com/submit` | 200 | Client-rendered Next.js shell, 75 chars of text | ⚠️ Fields unreadable without JS |
| `launchstag.com/faq` | 200 | Claim → email link → dashboard → badge snippet → “verified” | ✅ Flow verified; no “Verify now” exists |
| `launchstag.com/robots.txt` | 200 | `User-Agent: * / Allow: /` plus `/claim/` disallowed | ✅ Site is crawlable |
| `saascity.io/submit` | 200 → `/saascity?submit=1` | Validation strings: title ≥3, tagline ≥10, description **50–5,000** | ✅ Limits extracted from the bundle |
| `saascity.io/pricing` | 200 | Free: dofollow, **no map placement**, badge required, **~364-day queue**; $19.99 / $39.99 | ✅ Verified |
| `alternativeto.net/add-app/` | **404 browser** (403 curl) | “404 - Page not found” | ❌ **Dead**; corrected |
| `alternativeto.net/` | 200 | No add-app control logged out | 🔒 Login-gated |
| `launchbuff.com/pricing` | 200 | Free = permanent page + **nofollow** + badge, queue **~1 year**; $19 Premium = dofollow | ✅ Verified; brief corrected |
| `searchenginejournal.com/write-for-search-engine-journal/` | 200 | “Write for SEJ” — full contributor terms | ✅ **Rules quoted verbatim** |
| `searchenginejournal.com/write-for-sej` | 200 | Serves “20 Web Directories You'll Still Want To Use” | ⚠️ Soft-200 trap |
| `searchenginejournal.com/write-for-us/` | 200 | Serves “Contact Search Engine Journal” | ⚠️ Soft-200 trap |
| `seofomo.co/` | 200 | “+45,000 subscribers, 45% open rate, 10% click rate”; sponsorship via Aleyda's contact page | ✅ Verified (figures are their claims) |
| `seofomo.co/submit` | 404 | “The page you were looking for doesn't exist” | ❌ No submit page |
| `news.ycombinator.com/showhn.html` | 200 | Show HN guidelines | ✅ **Quoted verbatim** |
| `news.ycombinator.com/newsguidelines.html` | 200 | “Please don't put generated text in HN posts” | ✅ **Quoted verbatim** |
| `indiehackers.com/products` | 200 browser (403 curl) | Products DB + Build Board + “SUBMIT AN UPDATE” | ✅ Verified; posting needs an account |
| `seroundtable.com/contact.html` | 200 | “Contact Us” | ✅ Reachable; not newsworthy yet |
| `searchengineland.com/…` (all paths) | Cloudflare challenge | “Just a moment… / Performing security verification” | 🚫 **Blocked in browser too** |
| `tldr.tech/seo` | 404 | No SEO vertical exists | ❌ Does not exist |
| `tldr.tech/marketing`, `/founders` | 200 | The two real verticals | ✅ Existence confirmed |
| `backlinko.com/` | 200 | Only `/contact` exposes a route; no contributor page | ❌ No route |
| `contentmarketinginstitute.com/contribute/` | 200 | `<title>news` — same title for every path tested | 🚫 Unverifiable |
| `moz.com/blog/write-for-moz` | 404 | — | ❌ No route |
| `practicalecommerce.com/contribute` | 404 | — | ❌ No route |
| `reddit.com/r/{SEO,webdev,SideProject}/about/rules` | 403 | Login required; rules panel does not render logged out | 🚫 Unverified — read the sidebar |

**Totals:** 32 entries checked (some cover several URLs) · **16 verified** with the expected content · **4 soft-200 traps** · **6 confirmed dead or absent** · **4 blocked** by bot protection · **2 login-gated**.

---

## The four decisions this pass cannot make

These are the same four from `docs/founder-actions.md`, and they are still the only things between the site and its first revenue. Nothing in this folder unblocks them.

1. **AdSense console state** — *Get started / Request review* (pre-approval, no ad units exist) or *Ads → By ad unit* (approved, ids available). Ten seconds to check. See `docs/founder-actions.md` §1.
2. **Cloudflare managed robots.txt** — keep the enforcement or keep one authoritative file. Now documented as a trade with the measured served file, not a cleanup.
3. **Launchstag “Verify now”** — a screenshot or the listing URL. Three plausible meanings are written up; none can be confirmed from outside.
4. **Distribution** — X + Reddit (recommended) or the seven accounts. If X + Reddit, `Day12_Social_Posts.md` is the first two weeks.

One new decision comes out of this folder: **the badges.** tools.cafe and SaaSCity both require their badge on the site for the free tier, and Launchstag's is already in the footer. Three 198×62 images in the footer is a visible change to 81 pages. `Day12_Directory_Descriptions.md` §6 sets out three options and recommends asking each verifier whether a text link passes before shipping anything.

---

## Reproducing the checks

```
npm run check:social     # 18 tweets, X-weighted length, fails over 280 chars
npm run check:sources    # 43 guide citations, fails on 4xx/5xx
```

`check:social` was added with this folder. It measures both raw length and X's weighted length (links count as 23 characters), because a tweet can pass one limit and fail the other.

The directory and outreach checks were one-off browser and `curl` inspections; they are not scripted, because six of the eleven sites block scripted requests outright. The table above records what each one returned on 26 Oct 2026, and that is the part that has to be re-checked before relying on it — queue lengths and pricing on these directories change without notice.

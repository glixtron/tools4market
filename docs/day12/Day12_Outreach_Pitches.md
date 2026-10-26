# Day 12 — Outreach pitches

**Prepared:** 26 Oct 2026 · **Site state:** v2.17.1, Worker `60455cbb`

*Five channels. Two of them have rules that make the obvious pitch impossible, and one has no route at all. This document says which is which, quotes the rules verbatim where they exist, and marks the parts I could not verify.*

---

## 1. Read this first: what each channel can actually give you

| # | Channel | What it is | Cost | Link value | Realistic odds | Verdict |
|---|---|---|---|---|---|---|
| 1 | **Search Engine Journal** | Contributed articles | A **recurring writing slot** (monthly / bimonthly / quarterly) | **None** — “no promotional links or calls to action” | Low, but real | Worth one application if you want to write |
| 2 | **SEOFOMO** | Newsletter sponsorship | **Money**, rate unknown | Sponsored/nofollow | High — it is a purchase | Ask for the rate card before wanting it |
| 3 | **Hacker News (Show HN)** | Launch post | Free | Nofollow | **Unpredictable** — most Show HNs get single-digit points | One shot, and the text must be yours |
| 4 | **Indie Hackers** | Founder post | Free | Nofollow | Moderate, if the post is useful rather than promotional | Best value-for-effort of the five |
| 5 | **Search Engine Roundtable** | News tips | Free | Nofollow | **Very low today** | Hold — see §7 |

Sorted by what I would actually do: **4 → 3 → 1 → 2 → 5.** The reason is not that IH is the biggest audience; it is that IH is the only one where a genuinely useful post is also the correct pitch. Everything else is either a purchase, a lottery, or an unpaid writing job.

### Rules that apply to all five

- **Disclose the affiliation.** “I built tools4market.online” in the first or second line, every time. Every one of these communities has been pitched by someone hiding that, and they check.
- **No invented metrics.** There is no user count, no traffic figure, no revenue, no “trusted by”. The only numbers available are the ones that are checkable: 44 tools, 24 guides, 81 pages, 43 sources checked, 225 lines of served robots.txt.
- **No upvote or comment solicitation, anywhere.** HN's guidelines say it explicitly (“Please don't ask friends to upvote or comment. That's not ok on HN.”), Product Hunt penalises it, and Reddit removes it. A launch that needs a favour is not a launch.
- **Do not paste generated text into HN or Reddit.** HN: “Please don't put generated text in HN posts. Write your text yourself.” SEJ: “Articles generated entirely by AI” are in the *don't publish* list. This document therefore gives **notes and structure** for those two, not paste-ready prose. Everything else is paste-ready.
- **One follow-up, then stop.** Seven to ten days, one line, no guilt. A second follow-up converts a maybe into a block.

---

## 2. Search Engine Journal — a contribution slot, not a backlink

### The rules, quoted from the live page

`https://www.searchenginejournal.com/write-for-search-engine-journal/` — HTTP 200, title “Write for SEJ”. Note that `/write-for-sej/` and `/write-for-us/` also return 200 but serve **different articles**, so a 200 there is not evidence of a contributor page.

**What they don't publish** (verbatim):

> PR pitches & guest posts submitted for a client.
> Commodity content without first-hand experience.
> Promotional content with self-serving links.
> Articles generated entirely by AI.

**What they ask of contributors** (verbatim):

> Articles exclusive to Search Engine Journal and 100% original.
> A regular slot: monthly, every other month or quarterly.
> Disclosure of any relationship with a company or person you mention.
> No promotional links or calls to action.

**What you get** (verbatim): “Exposure to an audience of 710k marketers”, social to 820k followers, SEJ Live, SEJ Pro membership.

### The consequence, stated plainly

Read those four lines together and the maths is unforgiving:

- **The article cannot promote the tools.** No link, no CTA, not even “try it here”.
- **The article cannot be republished on our blog.** Exclusive means exclusive — so the piece cannot double as a guide, and the work is spent.
- **It commits you to a cadence.** “A regular slot” is a standing obligation, not a one-off. Monthly or quarterly, indefinitely.
- **It cannot be generated.** Which means you, not me, write it.

So this is not a distribution tactic. It is **becoming a columnist** in exchange for authority and exposure. That can be a good trade for a solo founder building a reputation — but it is a completely different trade from “get a backlink”, and it should be decided on that basis.

If the goal is promotion, their own page says where to go: “For product promotion, sponsored or syndicated content, our sales team is happy to talk about solutions for visibility on SEJ.” That is the paid route, and it is not this pitch.

### How to apply

The page ends in a JS-rendered **“Apply to Contribute”** form. The form loads only in a browser; there is no URL to email. Open the page, click **Apply to Contribute**, and answer the form.

### Three article concepts drawn from work actually done here

SEJ rejects “commodity content without first-hand experience”. Generic “robots.txt best practices” is commodity. These are not: each one is a measurement from this project, with the numbers still attached.

---

**Concept A — “Your robots.txt is not the file crawlers read”**

*The pitch:* Our origin `robots.txt` states one policy. What Google actually fetched contained our 52 lines **prefixed by 173 lines** injected at the CDN edge — including a `Disallow: /` for `Google-Extended` that we had explicitly allowed. Both statements were live, on the same domain, in the same file, and the outcome depended on a tie-break rule most people have never read (RFC 9309 §2.2.2, equal-length rules resolve to allow). The article walks through how the merge happened, how to detect it with one `curl`, and why “check your robots.txt” is the wrong instruction — the right one is “check the served file”.

*What is measured and reproducible:* the 225-line served file, the line numbers where each block starts, the per-bot verdicts, and the single test that asserts the served file rather than the source file.

*Why it is not commodity:* every robots.txt article tells you what to write. This one shows a case where what you wrote and what was served diverged, which is the failure mode readers actually hit.

---

**Concept B — “I audited the citations in my own SEO guides. Four were dead.”**

*The pitch:* Twenty-four guides, each citing primary documentation rather than other blogs — the whole editorial premise. Then a link-rot audit of all 43 unique source URLs found four returns that no longer said what the guide claimed: a robots meta-tag reference, a GA4 URL-builder article, a Google meta-tags page, and an X Cards reference that had been replaced by a page that does not carry the claim. Two of them were cited by more than one guide. The article covers the audit method, the four failure types (hard 404, silent redirect to a different page, soft 200 serving unrelated content, and “moved but still correct”), and why the soft-200 case is the one that survives manual review.

*What is measured and reproducible:* 43 URLs, four failures, five genuine moves, the classification rules, and the `Accept-Language: en` detail that prevents false locale redirects.

*Why it is not commodity:* “link rot” pieces usually audit someone else's site and stop at 404s. This one is self-audit, includes the four links that *worked* and were still wrong, and concedes that the premise of the site made the failure worse.

---

**Concept C — “The ad slot that shipped, rendered, and earned nothing”**

*The pitch:* A malformed ad-unit id is not an error in most build pipelines — it becomes a string, the ad renders as an empty `ins` element, and the page looks finished. That shipped here, for a day. The article is about silent-failure design in static builds: why “valid but unrenderable” needs an explicit lint, why a fallback placeholder is worse than a build failure, and how the fix (name the offending variable, refuse the value) was three lines.

*Weaker fit than A or B* — it is more build-ops than search. Offer it only if they ask for a third idea.

### Application: the narrative to write in your own words

Do not paste this. The form asks about your experience and SEJ explicitly excludes generated articles, so an obviously templated application is dead on arrival. Use these four points, three sentences each, in your own voice:

1. **What you build and why** — 44 free browser tools, no account, built because the alternative is a funnel.
2. **What you measured** — pick **one** of concepts A or B, and lead with the number. “173 lines of robots.txt that weren't mine” is a better opening than a mission statement.
3. **Why you can write it rather than link it** — say out loud that the article will contain no link to your site, because you read the guidelines. This is the single most differentiating sentence in the application.
4. **The slot you can actually hold** — be conservative. Quarterly, not monthly. A missed monthly slot after two months costs more than never promising it.

**On the disclosure line:** when the article mentions tools4market, name the relationship and omit the link. SEJ's two rules — disclose any relationship, no promotional links — are both satisfied by “I maintain tools4market.online, which is not linked here”.

**Do not** open with “I'd love to contribute a guest post about…” — “guest posts” is in their *don't publish* list, and the phrase marks you as someone who did not read the page.

---

## 3. SEOFOMO — a purchase, so treat it like one

### What is verified

`https://www.seofomo.co/` — HTTP 200. Their own copy states **“+45,000 subscribers, 45% open rate and 10% click rate”** and directs sponsorship enquiries to Aleyda Solis's contact page (`aleydasolis.com/en/contact/`, which returns 403 to a non-browser client but is the link they publish). There is **no public rate card** and no self-serve checkout: sponsorship is a conversation.

Those three numbers are claims, not audited figures. At 45% open and 10% click, 45,000 subscribers implies roughly 2,000 clicks on a well-placed link — which is the only number that matters, and it is the one to sanity-check against the price.

### The enquiry email (paste-ready, then edit the two brackets)

```
Subject: Sponsorship enquiry — SEOFOMO placement and rates

Hi Aleyda,

I run tools4market.online, a free set of 44 browser-based SEO and AI-crawler
tools (no signup, no usage limits). I'm interested in sponsoring an edition
of SEOFOMO and would like to understand the options before committing.

Could you send:
- the rate card, or the range for a single edition
- which placements are available (primary vs secondary/classified)
- the earliest edition with availability
- whether you accept tool sites, or whether the audience fit is different
  from what I'm assuming

I read the 45k / 45% / 10% figures on the site. I'd rather see the last few
editions' sponsored placements than take the click rate on trust — would you
be able to point me at one or two?

No rush on this; I'm planning a few weeks out rather than this week.

Thanks,
[name]
tools4market.online
```

### Honest expectations

- **This is the only channel on the list that can be bought outright**, which is also why it is the only one where the money is the whole question. A solo founder with no ad revenue should not spend the primary-sponsor budget on a first test.
- **Ask for the cheapest placement first.** A single secondary placement in one edition tells you more about conversion than a rate card tells you about reach.
- **Expect `nofollow` or `sponsored`.** A paid placement that passes PageRank is a paid link, and reputable newsletters do not sell those. Treat this as traffic, not SEO.
- **Measure it or don't do it.** A UTM on the link and a look at sessions the following week. `utm-naming-conventions` in the guides exists for exactly this and the site's own UTM builder will produce the string.

---

## 4. Hacker News — Show HN, one shot, and the text must be yours

### The rules, quoted

`https://news.ycombinator.com/showhn.html` — HTTP 200.

> Show HN is for something you've made that other people can play with.
> Off topic: blog posts, sign-up pages, newsletters, lists, and other reading material.
> Please make it easy for users to try your thing out, ideally without barriers such as signups or emails.
> Please don't ask friends to upvote or comment. That's not ok on HN.
> New features and upgrades ("Foo 1.3.1 is out") generally aren't substantive enough to be Show HNs.

And from `newsguidelines.html`:

> Please don't put generated text in HN posts. Write your text yourself.
> Please don't do things to make titles stand out, like using uppercase or exclamation points, or saying how great an article is.
> If the title includes the name of the site, please take it out.
> If the title contains a gratuitous number or number + adjective, we'd appreciate it if you crop it.

### Why this is a genuine fit

Rare among the five: the site satisfies HN's hardest requirement without effort. “Something people can play with”, with “no barriers such as signups or emails” — 44 tools, no account, no limit, no email. Most Show HN candidates fail exactly there.

### Title options

Titles must begin with `Show HN`. No site name (HN appends the domain). No exclamation marks.

| Title | Chars | Note |
|---|---|---|
| `Show HN: Free SEO and AI-crawler tools that run in your browser` | 62 | Safe. Says what it is and where it runs. |
| `Show HN: 44 free SEO tools, no signup or usage limits` | 51 | The number is meaningful (it is the count), but HN dislikes gratuitous numbers — this one is defensible. |
| `Show HN: I built free SEO tools because the paid ones hide the results` | 71 | States a reason, not a feature. Risks reading as a complaint. |

My pick: the **first**. It is the least clever and the least likely to be read as marketing.

### The comment: notes, not a script

HN forbids generated text in posts. I am not going to hand you a paragraph to paste, because the community recognises the register within two sentences and the penalty is not a downvote, it is a dead thread plus a flagged account. Write 150–250 words yourself covering these six points, in this order:

1. **What it is, in one sentence.** 44 tools, browser-side, no account.
2. **Why you built it.** The specific annoyance — a tool that demands a URL, then hides the result behind a paywall, then gives a score out of 100 with no explanation. Keep it concrete and short.
3. **The one design decision worth discussing.** Two modes: “analyze” fetches through a proxy, “manual” is a textarea that works with no network. Engineers will ask about the proxy; have an answer about what it fetches, what it strips, and what it rate-limits.
4. **The most interesting technical detail you found.** This is the paragraph that earns the thread. The served-versus-source `robots.txt` drift is perfect: 173 injected lines, an `Allow`/`Disallow` conflict for one token, resolved by a tie-break. It is a real bug, it is non-obvious, and it invites replies from people who have hit the same thing.
5. **What you deliberately did not build.** No score out of 100. No “AI-powered” label on deterministic parsers. Naming what you refused is more credible than listing what you shipped.
6. **An honest limit.** Something that does not work yet. HN rewards the concession and punishes the polished pitch.

Then **be present for four hours**. Replies are the entire return on a Show HN; a thread with an absent author dies at three points.

### What will probably happen

Most Show HNs get single-digit points and no traffic. That is the base rate, not a failure. One front-page day is a lottery ticket that costs nothing but four hours — which is why the honest expected value here is “low, but the downside is only your afternoon”. Do not schedule anything around it, and do not post a second one to “try again” (HN's guidelines treat deletion-and-repost as bad behaviour).

**Timing:** a weekday morning US Eastern (08:00–10:00) gives the longest run at the front page. Not Friday afternoon, not a US holiday.

---

## 5. Indie Hackers — the best value for effort, if the post is useful

### What is verified

`indiehackers.com/products` loads in a browser (403 to `curl`): a **Products DB** with a Build Board, per-product pages, and a **“SUBMIT AN UPDATE”** control. Posting requires an account. The homepage's current front page includes a thread titled *“I submitted a small tools site to ~40 directories in 2 weeks. Here's what was actually free.”* — which is direct evidence of the genre that works there, and an uncomfortable reminder that our own directory research (§8) is the most saleable thing we did this week.

### The post I would write: the directory research, not the product

Pitching “here is my tool” on IH gets a handful of polite upvotes. Pitching “here is what I measured about the directories you are all being told to submit to” gets replies, because it is the same work everyone else is doing badly and nobody publishes the numbers.

**Title:** `I checked the free tier of 7 startup directories. Four weren't what the listicles said.`

**Structure (write it yourself, in your voice — this is the outline):**

1. **The premise in two sentences.** Every “submit to these 30 directories” list says free. Free usually means “free, after a year in a queue, with a nofollow link and our badge on your site”.
2. **The table that is the post.** Directory, what the free tier actually gives, the queue length, whether the link is dofollow, and whether a badge is required. The measured facts from `Day12_Directory_Descriptions.md` §1 and §4, including the ones that are inconvenient for the directories.
3. **The three findings worth a paragraph each:**
   - **LaunchBuff's free tier is a nofollow link after a ~1-year queue** (“free tournament entry is paused — our free queue has grown to ~1 year”). Dofollow starts at $19.
   - **SaaSCity's free tier is dofollow but the queue is ~364 days**, and their own validator says free listings under a word minimum may not be indexed at all.
   - **tools.cafe is the only one whose free queue is measured in weeks** (30 days), and it wants a badge before the link goes dofollow.
4. **The thing the listicles never mention:** three of the seven are the same operator. tools.cafe's footer lists Launchstag and Launchbuff as partner sites. Seven submissions, five businesses.
5. **What you concluded.** Free tiers only; no paid dofollow links, because buying them is a link scheme whether the seller calls it a listing fee or not.
6. **One line, at the very end, with the link.** “I build tools4market.online, which is what sent me down this path.” Not in the title, not in the first paragraph.

That post is useful even to someone who never visits the site, which is the only reliable reason anything gets shared on IH.

### The alternative, if you would rather write about building

A build post also works there, but it needs a specific angle rather than “I launched”. The honest angle available: **1,449 lines of worklog and 2,547 passing assertions for a site with no revenue**. That is a real story about how much process a solo build absorbs, and it will get a more interesting conversation than a launch announcement. It will also get less traffic. Your call.

---

## 6. Disclosure line — use this everywhere

One sentence, reused verbatim so it cannot drift:

```
Disclosure: I built tools4market.online, the site these tools live on. No
affiliate links, no sponsored placement, and nothing in this post is paid for.
```

On SEJ the same disclosure applies, minus the link, because promotional links are prohibited there.

---

## 7. Search Engine Roundtable — do not send this yet

`https://www.seroundtable.com/contact.html` — HTTP 200, title “Contact Us”. The channel exists and is reachable.

The problem is not the contact page. It is that **SERoundtable is a news site**, and the news it covers is what search engines changed, not what someone launched. “I built 44 free tools” is not a story there, and sending it spends a contact for nothing.

What *would* be a story:

- **A measured dataset.** Not “our robots.txt was merged”, but “we fetched the robots.txt of the top 1,000 sites and 61% of them now contradict themselves on AI crawlers”. That is a story, and it is the kind of story Barry Schwartz links. It is also several days of work that does not exist yet.
- **A conflict or a correction.** A vendor shipping something that breaks a documented rule, evidenced. We have nothing of that shape right now.

So: **hold this channel open, send nothing.** If we do the dataset in a later session, this is the first place it goes — and at that point the email writes itself.

---

## 8. Blocked and declined targets

Recorded so the next session does not re-derive them.

| Target | Claimed route | What is actually true (26 Oct 2026) | Status |
|---|---|---|---|
| **Search Engine Land** | “Contribute / write for us” | **Site unreachable.** Every path — `/`, `/write-for-us`, `/about-us` — returns a Cloudflare interstitial (“Just a moment…”, “Performing security verification”) to `curl` *and* to a real browser. Earlier notes record “invite-only, no unsolicited pitches”; **that could not be re-verified today and should not be quoted as their policy.** | 🚫 Blocked, unverified |
| **TLDR SEO** | Pitch a link to `tldr.tech/seo` | **404.** TLDR publishes Marketing and Founders verticals; there is no SEO newsletter. | 🚫 Does not exist |
| **Backlinko** | Guest post / contributor | Site is live (200) but exposes exactly one relevant link: `/contact`. No contributor page, no guidelines. Since the Semrush acquisition it publishes in-house. | 🚫 No route |
| **Content Marketing Institute** | “Submit an Article” | The nav contains “Submit an Article”, but **every path returns 200 with `<title>news`** — a soft-200 that makes URL verification impossible. Cannot confirm a submission page exists. | 🚫 Unverifiable |
| **Moz** | Write for Moz | `/blog/write-for-moz` **404**; `/community` is a forum, not a contributor route. | 🚫 No route |
| **Practical Ecommerce** | Contribute | `/contribute` **404**. | 🚫 No route |
| **AlternativeTo “alternative to QRCodeGenerator”** | Listed in the brief as a mapping | **We have no QR code tool.** Of the 44 tools, none generates QR codes. The mapping was dropped rather than fudged. | ❌ Factually wrong |

The pattern across all of these is the same one the guides are about: a URL that returns 200 is not evidence that the thing you want is on it, and a URL that returns 403 is not evidence that it exists either. All four soft-200 traps in these documents were pages that answered cheerfully and served something unrelated to the path requested — which is also why a title check is the minimum, not a nicety.

---

## 9. What I could not verify

- **SEOFOMO's price.** No public rate card. The subscription and engagement figures are their claims.
- **Whether SEJ is currently accepting applications at all** — the form loads, but acceptance rate and response time are unpublished.
- **Search Engine Land's contributor policy.** The site is behind a bot challenge that a real browser also fails, so the earlier “invite-only” note is unconfirmed and is marked as such rather than repeated.
- **Indie Hackers' posting rules.** Their help pages were not reachable; the post above is written to be safe under the strictest common reading (no link until the final line, value first, disclosure included).
- **Whether HN will accept a site with 44 tools as “non-trivial”.** It might read as a directory of small utilities rather than one substantial project. The served-robots bug is the paragraph most likely to change that verdict, which is why it is in the outline.

# Day 12 — Social posts

**Prepared:** 26 Oct 2026 · **Site state:** v2.17.1, Worker `60455cbb`

*Three X threads and three Reddit posts, in the honest-practitioner voice — not the growth-hacker one. Each post says what it is, admits an affiliation, and asks for nothing. Character counts below are verified by script, not estimated.*

---

## 0. A correction to the brief before anything else

The Day 12 brief schedules the launch thread for **“Sunday Oct 26, 9 AM ET.”** 26 October 2026 is a **Monday**. It has been a Monday all week.

That matters for two reasons, and neither is pedantic:

- **The date in the calendar is wrong**, so anything scheduled against “Sunday” lands a day late or not at all.
- **The weekday changes the recommendation.** A Monday launch thread competes with everyone's Monday. Tuesday–Thursday mornings are better for X reach, and Monday is the worst day to start a three-post sequence that runs on a fixed cadence.

Corrected dates are in §9. Everything else in the brief's social plan survives.

---

## 1. House rules for every post

1. **Disclose in the post, not in a reply.** “I built this” in the first two lines. Every one of these platforms has been pitched by someone hiding it.
2. **No upvote, like, boost or comment requests.** Not even “if this was useful”. It is against HN's guidelines, against Product Hunt's, and it is the fastest way to get a Reddit post removed.
3. **One link per post, maximum, and none in a reply unless asked.** On r/SEO, no link in the body at all — the post stands on the finding.
4. **No invented numbers.** Available and checkable: 44 tools, 24 guides, 81 pages, 173 injected robots.txt lines, 225 served lines, 43 sources checked, 0 revenue. Nothing else.
5. **No “we”.** One person built this. “I” is more credible and it is also true.
6. **Don't paste AI-written text into HN or Reddit.** HN's guidelines say it outright. The Reddit posts below are written to be adapted — change the details that only you know, or they will read as template.

### How the counts below were produced

Every tweet block in §2–§4 was measured with `scripts/check-social.mjs` (added with this document). X counts a URL as 23 characters regardless of length, so the script reports both raw length and X-weighted length. All tweets are under 280 on both measures. Re-run it after any edit:

```
npm run check:social
```

---

## 2. X thread 1 — the launch (Monday 26 Oct, 09:00 ET)

**Purpose:** say what the thing is, in the voice of someone who was annoyed by the alternative. Six tweets.

**Tweet 1/6**
```
Every "free SEO tool" I've tried: asks for your URL, runs the check, then
hides the findings behind a paywall and shows you a score out of 100.

So I built the opposite. 44 tools, no account, no limits. 🧵
```

**Tweet 2/6**
```
The rule I set: if a tool can do the job locally, it never touches a server.
Your input stays in the tab.

The ones that have to fetch a URL tell you exactly what came back, and what
couldn't be checked.
```

**Tweet 3/6**
```
Two modes on every fetch-capable tool.

Analyze: pulls a public URL through a proxy, pre-fills the tool.
Manual: a plain textarea, works with no network.

A VPN or a login wall isn't a dead end. It's just the other mode.
```

**Tweet 4/6**
```
Inside: meta, OG, Twitter Card, canonical, hreflang and schema generators.
SERP preview, crawler audit, robots.txt generator + tester, llms.txt,
sitemaps, redirects, UTMs, JSON, JWTs, image compression, 6 calculators.
```

**Tweet 5/6**
```
The part I care about most: the robots.txt tester parses per RFC 9309 and
shows the verdict per bot, AI ones included.

Most robots.txt advice online is folklore. People block the crawler that
would have cited them.
```

**Tweet 6/6**
```
Free. No signup. No limits. 24 guides, every one sourced from primary docs
instead of another SEO blog.

tools4market.online
```

---

## 3. X thread 2 — the philosophy (Wednesday 28 Oct, 09:00 ET)

**Purpose:** the argument, not the product. This is the thread most likely to be quoted back at you, so every claim in it is one the site can defend on a page.

**Tweet 1/6**
```
Most free tool sites are a funnel with a form on top. The tool collects the
email, the "score" creates the anxiety, the fix sits behind a paywall.

That's not malice. It's a business model. It's also why the advice on those
sites is so bad.
```

**Tweet 2/6**
```
Three things I stopped doing:

- No score out of 100. A number you can't explain isn't a measurement.
- No "ideal keyword density". There is no such number.
- No "AI-powered" label on a deterministic parser.
```

**Tweet 3/6**
```
The SERP preview is the clearest example. It shows the pixel width your title
takes up. It does not promise where Google truncates.

Google truncates by width, not characters. Any tool telling you "60 chars"
is guessing.
```

**Tweet 4/6**
```
The schema generator refuses to mark up content that isn't on the page.

Marking up invisible content breaks Google's structured data policy, and it's
the most common way a "helpful" generator earns someone a manual action.
```

**Tweet 5/6**
```
None of this is generosity. A tool that overstates what it measured gets found
out in a week, and then nobody trusts the next thing you ship.

Honest limits are good product.
```

**Tweet 6/6**
```
44 tools. 24 guides. No account, no limits.

tools4market.online
```

---

## 4. X thread 3 — the AI-search toolkit (Friday 30 Oct, 09:00 ET)

**Purpose:** the most useful thread of the three for a stranger who never clicks. If it gets saved and not liked, it did its job.

**Tweet 1/6**
```
If you want ChatGPT, Perplexity or Claude to cite your site, the file that
decides it is one you probably haven't opened since 2019.

robots.txt. Here's what changed, and the three files that matter now. 🧵
```

**Tweet 2/6**
```
The crawlers split in two:

Training: GPTBot, ClaudeBot, CCBot
Answer + citation: OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot

Blocking the first doesn't block the second.
```

**Tweet 3/6**
```
Google-Extended isn't a crawler at all — it's a control token. Turning it off
switches Gemini training and Gemini grounding together, so "block training"
also removes you from Gemini's answers.

That detail is missing from most robots.txt guides.
```

**Tweet 4/6**
```
The mistake I see most: "User-agent: GPTBot / Disallow: /" copied from a
listicle, with no idea that OAI-SearchBot is a different token.

You blocked the trainer. The citer still gets in. Or you blocked both and
wondered why citations stopped.
```

**Tweet 5/6**
```
Second file: llms.txt. Plain markdown at /llms.txt pointing at your key pages.

Honest caveat: no confirmed crawler requires it. Cheap and harmless, not a
ranking factor. Anyone selling it as one is selling you a checklist.
```

**Tweet 6/6**
```
Third: your sitemap. Still the most reliable way to tell an answer engine what
exists, because most fetch robots.txt and the sitemap before anything else.

Generators for all three, plus a per-bot tester: tools4market.online
```

---

## 5. Reddit post 1 — r/SideProject (Monday 26 Oct, 14:00 ET)

**Why this subreddit:** it is the one place on the list where a build story is on-topic by definition, and where “no revenue yet” is a normal thing to say rather than a red flag.

**Title**
```
I built 44 free browser tools because every "free" SEO tool hid the result
behind a paywall. What I'd do differently.
```

**Body**
```
I'm not going to pretend this is a growth story. It's a build story with no
traction yet, and the interesting part is the decisions, not the numbers.

**What it is:** 44 small tools — SEO and meta tags, robots.txt and llms.txt for
AI crawlers, sitemaps and redirects, UTMs, JSON, JWTs, image compression, six
marketing calculators. No account. No usage limit. No database, because there's
nothing to store.

**Why:** every free tool I tried did the same thing. Enter your URL, wait, get a
score out of 100, then discover the actual findings cost money. The score was
never a measurement — it was a lead magnet with a number on it.

**The three decisions I'd defend:**

1. No accounts. Not because accounts are bad, but because I'd have had to build
   auth, sessions, password resets and a privacy policy for uploads, and none of
   it would have made the tools better.

2. Two modes. "Analyze" fetches a public URL through a proxy. "Manual" is a
   textarea that works with no network. That second mode exists because fetches
   fail constantly — VPNs, login walls, slow origins — and a failed fetch
   shouldn't mean a dead tool.

3. Limits printed on the page. The SERP preview shows pixel width and says
   Google truncates by width, not character count. The schema generator refuses
   to mark up content that isn't visible. The robots.txt tester says "blocked by
   robots.txt" and "blocked by a firewall" as different answers, because they
   are.

**The bug that taught me the most:** my robots.txt said one thing; the file
Google actually fetched had 173 extra lines injected at the CDN edge, including
a Disallow for a token I had explicitly allowed. 225 lines served, 52 of them
mine. I'd been testing the file in my repo instead of the file on the wire.

**What I got wrong:** I wrote 24 guides before submitting to a single directory.
The guides are the best thing on the site and almost nobody has read them,
because I built the library before the door.

**Numbers, honestly:** 44 tools, 24 guides, 81 pages, one maintainer, £0 revenue,
traffic in the low hundreds. If you're earlier than me, the only advice I have
is: ship the smallest thing that is genuinely useful, then go and tell people
about it before you build the next thing.

Happy to answer anything about the build. And I'd genuinely like to know what
you'd cut — there are probably ten tools here that shouldn't exist.
```

**On the self-promo rule:** this subreddit generally allows a product link in a
build post but not a bare link drop. The post above stands without a link; put
`tools4market.online` in a **comment** if someone asks, not in the body. Read the
sidebar first — see §10.

---

## 6. Reddit post 2 — r/SEO (Wednesday 28 Oct, 10:00 ET)

**Why this one is not about the product:** r/SEO removes tool promotion on sight,
and rightly. What it does reward is a specific, checkable finding that contradicts
something everyone repeats. This post is that finding. The tool is mentioned once,
in passing, with no link.

**Title**
```
Your robots.txt isn't the file crawlers read — mine had 173 lines injected at
the CDN edge
```

**Body**
```
Short version: I spent a week confident my robots.txt was correct, testing a file
that no crawler ever saw.

**What happened.** My origin serves a robots.txt that blocks AI training crawlers
and allows the answer engines — OAI-SearchBot, ChatGPT-User, PerplexityBot,
Claude-SearchBot, Google-Extended. It's 52 lines. Then I curled the live URL
instead of reading the file in the repo: 225 lines. My 52 started at line 175.

Everything above them was injected by the CDN, because a bot-management setting
generates a managed block from the same policy toggles. It included:

    User-agent: Google-Extended
    Disallow: /

while my own block, 169 lines later, said:

    User-agent: Google-Extended
    Allow: /

Two opposite statements, same file, same domain, both live.

**Why it still resolved correctly, and why that's not comforting.** RFC 9309
§2.2.2 says that when a crawler matches multiple groups, the groups are combined,
and when two rules match with equal specificity (both are `Allow: /` and
`Disallow: /` at the root), the least restrictive wins. So `Allow` wins the tie.
Correct on paper. Correct in Google's implementation. But the outcome of a policy
decision was resting on a tie-break rule, and not every parser implements it.

**How to check yours.** One command, no tooling:

    curl -s https://yourdomain.com/robots.txt | head -40
    curl -s https://yourdomain.com/robots.txt | grep -c '^User-agent:'

If the first line isn't yours, something in front of your origin is writing your
policy. Then check whether the file contains the same user-agent twice — that's
the shape of the problem.

**What I changed.** Nothing on the site, and that's the uncomfortable part. The
merged file resolves the way I want it to, because I allow everything I care
about. But I only know that because I tested the served file per bot instead of
trusting the source file. If I'd been relying on a `Disallow` instead of an
`Allow`, the injected block above mine would have been harmless and the one below
would have been ignored — or vice versa, depending on the parser.

**The general lesson,** which is not about robots.txt at all: any config that gets
rewritten between your repo and the client is a config you are not testing. CDNs,
edge workers, WAFs, and "managed" anything. The only file that matters is the one
that comes back over the wire.
```

**Note on the code blocks:** Reddit renders indented lines as code. If you paste
this into the fancy editor, use the code-block button, or the commands will run
together into a paragraph.

---

## 7. Reddit post 3 — r/webdev (Friday 30 Oct, 10:00 ET)

**Why this one is technical:** r/webdev will not care about SEO tools, but it will
care about a proxy endpoint that has to be safe, cheap and fast while 44 tools
depend on it. This is the only post of the six that is about engineering.

**Title**
```
44 tools that "run in your browser" — and the one endpoint that doesn't
```

**Body**
```
The marketing line is "runs in your browser". The honest version is "runs in your
browser except when it can't, and then it calls one endpoint that has to be safe".

Some background: a static site with 44 small tools, generated by a build script,
served from a Worker that mostly just serves assets. Two dynamic routes: a
suggest endpoint and `/api/fetch`, which takes a URL and returns the page so a
tool can pre-fill itself.

`/api/fetch` is the entire attack surface, and it's a classic SSRF shape: user
supplies a URL, server fetches it, server returns the body.

**What it does now:**

- http/https only, by protocol check
- hostname blocklist: localhost, 127.0.0.1, 0.0.0.0, ::1, metadata.google.internal,
  169.254.169.254
- 12 second timeout via AbortSignal
- 1.5 MB cap on the response body, truncated, because otherwise it's a free
  bandwidth pipe for anyone who finds it
- a custom User-Agent so site owners can see who's hitting them
- redirects followed

**What's still wrong with it, and I know:**

A hostname blocklist does not stop DNS rebinding. `evil.example` can resolve to
127.0.0.1 and pass every string check I do. The correct fix is to resolve the
hostname first, check the resolved IP against private ranges, and pin the
connection to that IP — which is a lot more code than a static site with no
revenue deserves right now. I'm writing it down rather than pretending the
blocklist is sufficient, because someone will find this post while copy-pasting
it.

**The design decision that saved the most support pain:** every tool that can
fetch can also not fetch. Manual mode is a textarea, no JS dependency on the
network. When the proxy times out, gets rate-limited, or hits a site that blocks
bots, the tool still works. That's not a fallback UI — it's the same tool with
the fetch step removed.

It also means the "runs in your browser" claim stays true in the case users care
about: their input never leaves the tab unless they explicitly ask for a fetch.

**What I'd do differently:** I'd have written the manual mode first and the fetch
second. Building it the other way round meant every tool was designed around a
fetch, and retrofitting a no-network path into ten of them was more work than
starting from the textarea and adding the convenience layer on top.
```

---

## 8. Comment templates — for when someone asks

Short, specific, no link unless the person asked for one. Five situations, which
cover most of what happens.

**Someone asks "what did you use for X?"**
```
I built it — tools4market.online, free, no account. Disclosure out of the way
first.

The part that's actually relevant to your question: it [specific behaviour,
one sentence]. If it doesn't do what you need, say so and I'll tell you what
it doesn't handle rather than pretending it does.
```

**Someone says "this is just self-promotion"**
```
Fair. I built it, and I'm posting about it, so that's a reasonable read.

The reason I posted this particular thing is [the finding / the numbers], which
is checkable whether or not you ever open the site. If the post would be better
without the mention, tell me and I'll edit it out — I'd rather the finding stand
on its own.
```

**Someone reports a bug in a reply**
```
Reproduced. [One sentence on what's happening.] That's a real bug, not a
misunderstanding on your end.

I'll fix it [today / this week] and reply here when it's live. Thanks for
taking the time — that one wouldn't have shown up in my own testing because
[honest reason].
```

**Someone asks "how is this different from [competitor]?"**
```
Honest answer: for [their use case], it probably isn't, and you should use
[competitor]. They do site-wide crawls and I do one page at a time.

Where it's different is [one specific thing]. If that's not the thing you need,
the difference doesn't matter.
```

**Someone asks about AI crawlers / llms.txt**
```
Worth separating two claims that get bundled together.

robots.txt directives are honoured by the major crawlers — that part is real
and testable, and you can verify it per bot.

llms.txt is a proposal, not a standard. No major AI company has confirmed they
read it. Putting one up is cheap and harmless; treating it as a ranking factor
is not supported by anything public.
```

---

## 9. Calendar — corrected dates

26 Oct 2026 is a **Monday**. Times are US Eastern. One post per platform per day;
never the same content on two platforms on the same day.

| Date | Day | Time | What | Where |
|---|---|---|---|---|
| 26 Oct | **Mon** | 09:00 | Thread 1 — launch | X |
| 26 Oct | Mon | 14:00 | Post 1 — build story | r/SideProject |
| 27 Oct | Tue | — | Reply to everything from day 1 | both |
| 28 Oct | Wed | 09:00 | Thread 2 — philosophy | X |
| 28 Oct | Wed | 10:00 | Post 2 — the robots.txt finding | r/SEO |
| 30 Oct | Fri | 09:00 | Thread 3 — AI-search toolkit | X |
| 30 Oct | Fri | 10:00 | Post 3 — the proxy endpoint | r/webdev |
| 2 Nov | Mon | — | One reply-post per platform: the directory research (see `Day12_Outreach_Pitches.md` §5) | IH |

If a post gets removed: **do not repost it the same day.** Read the removal
reason, fix the actual cause, wait a week. A second removal in the same subreddit
usually means a ban, and the account is worth more than the post.

---

## 10. What I could not verify

- **Subreddit rules.** `reddit.com/r/*/about/rules` returns 403 to a script and
  the rules panel does not render for a logged-out browser session. So the three
  posts above are written to be safe under the strictest common reading — no link
  in the r/SEO body at all, one link maximum elsewhere, disclosure included, no
  vote requests — but **read the sidebar before posting.** r/SEO in particular
  changes its self-promotion rule periodically.
- **Whether X still counts every URL as 23 characters.** It has for years; the
  threads above are under 280 either way, so the rule does not change the outcome.
- **The reach effect of a link in the first tweet.** Widely repeated, never
  measured, and I am not going to assert it. The launch thread puts the link last
  because that is also the better reading order, not because of a theory about
  the algorithm.
- **Whether any of these posts will travel.** No engagement figures are predicted
  here, deliberately. The base rate for a first post from a new account is close
  to zero, and the plan should survive that.

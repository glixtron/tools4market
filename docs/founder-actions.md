# Founder actions

*The owner-side work that blocks revenue and traffic. Everything in this file needs a browser session with an account I do not have: AdSense, Cloudflare dashboard, Launchstag, and the social/directory accounts. The site-side prerequisites are done.*

*Last verified against production 26 Oct 2026 (Worker `60455cbb`, v2.17.1). Each item records what I could measure, what I could only read from vendor documentation, and what I could not verify at all — so nothing here reads more certain than it is.*

---

## Status

| # | Item | Blocked on | Time | Effect when done |
|---|---|---|---|---|
| 1 | AdSense slot ids | **Done** 26 Oct — three units serving | — | Revenue on 68 pages, 156 placements |
| 2 | Cloudflare managed robots.txt | Owner decision + toggle | 3 min | Cleaner policy file; **costs edge enforcement** |
| 3 | Launchstag Verify | Owner, in the listing dashboard | 2 min | Listing + dofollow badge link |
| 4 | Distribution | Owner accounts | 1–3 h, spread out | Referral traffic + backlinks |

---

## 1. AdSense — the revenue blocker

### First, find out which state the account is in

There are two, and the difference matters because one of them makes “paste the slot ids” impossible.

**State A — pre-approval.** The console opens on a *Get started* / *Sites* flow and asks you to place the AdSense code and **Request review**. There is no *Ads → By ad unit* menu, because ad units are not offered until the site is approved. Google's own guidance is explicit that you cannot show ads until the site is approved; the code goes in first, the review follows.

**State B — approved.** The console has *Ads → Overview → By ad unit*, and you can create units.

**Where we are, 26 Oct 2026:** State B, complete. All three units are configured and serving (Worker `e50f904f`):

| Env | Slot | Where it renders | Pages |
|---|---|---|---|
| `AD_SLOT_TOP` | `2947820780` | above the tool | 44 tools |
| `AD_SLOT_CONTENT` | `9083278862` | after section 2 of a guide; below the tool page body | 24 guides + 44 tools |
| `AD_SLOT_SIDEBAR` | `3751273162` | beside the tool, full width under 1024px | 44 tools |

**156 placements across 68 pages.** Guides carry one unit, tool pages three, the homepage none. Verified after deploy by sweeping all 68 URLs, not a sample: every tool page 3 units, every guide 1, home 0. `test:live` is **78/78**. The homepage still has no slot in the template; adding one is a layout decision, not a missing id.

If you are in State A, the next action is **not** pasting ids. It is: confirm the code is detected, click **Request review**, and wait. The site side is already correct for review:

- the loader `adsbygoogle.js?client=ca-pub-1509697031230558` is on every page (asserted by `npm run test:live`);
- `ads.txt` at the root carries `google.com, pub-1509697031230558, DIRECT, f08c47fec0942fa0`;
- the three reserved slots are outside the tool interaction area, so ads never break a tool;
- privacy policy, terms and disclaimer pages exist;
- consent mode is wired, so EEA/UK/CH visitors get non-personalised ads until they accept.

What I cannot tell you from here is the verdict. That is one screen in the console.

### State B — create the units and set the ids

1. AdSense → **Ads** → **By ad unit** → **Display ads** → **Create**.
2. Create three units, named so you can tell them apart later: `T4M top banner`, `T4M below content`, `T4M sidebar`.
3. For each, click the **`<>`** (Get code) icon. The snippet looks like this, and the number you need is `data-ad-slot`:

   ```
   <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-1509697031230558"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
   ```

4. Paste the three numbers into `.env` in this repo:

   ```
   AD_SLOT_TOP=1234567890
   AD_SLOT_CONTENT=2345678901
   AD_SLOT_SIDEBAR=3456789012
   ```

   Only the number. `ca-pub-…:1234567890` is also accepted; anything else is refused, deliberately.

5. `set -a && source .env && set +a && npm run deploy`

**These are build-time values, not Worker variables.** `build.mjs` reads them and bakes `data-ad-slot` into the HTML; `worker.js` never reads them. Adding them in the Cloudflare dashboard therefore does **nothing at all** — which is what this README told you to do until 26 Oct. If any `AD_SLOT_*` already exists as a Worker variable, delete it: it is not just redundant, it is misleading, because it looks like the job is done.

That mismatch also means the “5-minute action” framing was wrong: following the old instruction produced no change on the site, with no error to explain why. The build now names a rejected value instead of silently falling back to a placeholder.

### Verify it worked

```
npm run build                      # must NOT print "ℹ AdSense loader on, 0 ad units"
curl -s https://tools4market.online/ | grep -o 'data-ad-slot="[0-9]*"'
npm run test:live                  # 73 checks, including the loader + ads.txt
```

A build that prints `⚠ AdSense: N slot id(s) not numeric and ignored` means a value was rejected and a reserved placeholder shipped in its place — the page looks finished and earns nothing. That failure mode shipped once before (24 Oct), which is why the warning now exists.

### Honest expectations

Ad revenue on a free-tools site with no traffic is zero regardless of slot ids; the ids are a prerequisite, not a result. Do not treat “ads are live” as a milestone — treat *sessions* as the milestone, and the ids as something that must already be true when sessions arrive.

---

## 2. Cloudflare managed robots.txt — a trade, not a cleanup

### What the served file actually is (measured today)

| Measure | Value |
|---|---|
| Total lines served | 225 |
| Cloudflare's prepended block | lines 1–173 |
| Our file starts | line 175 |
| `Google-Extended: Disallow: /` | line 53 (Cloudflare) |
| `Google-Extended: Allow: /` | line 222 (ours) |
| Verdict per bot | training crawlers blocked, six answer agents allowed, Google-Extended allowed — `npm run test:live` asserts all of it against the **served** file |

So the merge currently resolves correctly. `Google-Extended` is the interesting case: Cloudflare says `Disallow: /`, we say `Allow: /`, and RFC 9309 §2.2.2 combines the groups for a matching user-agent and resolves equal-length rules in favour of allow. Correct on paper, and correct in Google's implementation — but it depends on a tie-break, and not every parser implements the longest-match rule.

### The toggle (per Cloudflare's docs, updated 22 Oct 2026)

1. Cloudflare dashboard → the `tools4market.online` zone → **Security Settings** (`/security/settings`).
2. Filter by **Bot traffic**.
3. **Configure AI bot policies**.
4. The managed block is generated from these policies. **Training** set to *Disallow* is what produces the `Disallow: /` groups; **Enable Bot Preference Sync** is what makes Cloudflare prepend them.

Turning **Enable Bot Preference Sync** off serves the origin file unchanged. Setting **Training** back from *Disallow* to allow also removes the prepend, and it removes the edge block too.

### The part the earlier recommendation missed

Cloudflare's docs state that with Bot Preference Sync on and Training set to *Disallow*, the setting also **enables edge blocking for AI training crawlers**. Turning it off therefore costs two things at once: the redundant prepend *and* the only technical enforcement of the training block we have. Our origin `robots.txt` is a request, not a wall.

That flips the recommendation:

- **Leave it on** if you want enforcement. The cost is a 173-line preamble, an `Allow`/`Disallow` tie-break for `Google-Extended`, and a policy file no single document fully owns.
- **Turn it off** if you want one authoritative file. The cost is that training crawlers are back to trusting your `robots.txt`.

My reading: for a site that wants to be **cited** by AI answer engines, the enforcement is worth little and the ambiguity is worth less. The bots we care about — `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot`, `Google-Extended` — are all *allowed* either way. Turning it off makes the file we publish the file crawlers read, and the live test already proves the policy holds without it. But this is a policy decision about training data, not a technical one, so it is yours.

**After toggling, verify:** `curl -s https://tools4market.online/robots.txt | head -3` should show `# Tools4Market robots.txt`. If the managed block persists, Cloudflare's community has reports of the setting not clearing promptly (Sept 2026); purging the cache for `/robots.txt` is the next step. `npm run test:live` will fail loudly if the served policy drifts, whichever way you decide.

---

## 3. Launchstag — “Verify now” is a claim-and-badge step

### What Launchstag documents

Their FAQ describes exactly one ownership flow, and it is not called “Verify”:

1. The product page shows **Claim this listing** (for listings added by someone else).
2. You enter your email and receive a secure claim link.
3. Claiming unlocks the **listing dashboard**, where the badge snippet lives.
4. A **verified badge** means the listing is claimed by the founder or an authorised representative — it signals the information is current, not that a crawler passed.

Their own directory guide describes the incentive plainly: directories like Launchstag use a **badge model** — you place their badge on your site and the listing carries a **dofollow** backlink. That is why the badge is in our footer.

### What our side already has (measured in the live HTML)

```html
<a class="launchstag-badge" href="https://launchstag.com" target="_blank" rel="noopener">
  <img src="https://launchstag.com/badge-dark.svg" alt="Featured on Launchstag" width="198" height="62">
</a>
```

Plain `<a href>`, no `nofollow`, image served from their domain, present in the footer of **every** page. Nothing else is needed on this side.

### So “Verify now” is one of three things

1. **Badge verification in the dashboard** — a button that re-crawls the site to confirm the badge is installed before granting the dofollow link. Most likely, and our markup should pass.
2. **Email-address verification during claim** — a link in the claim email. Expires; re-request if stale.
3. **A different service entirely** — several directories email “verify your listing” after submission, and the note may be from one of those, not Launchstag.

### If it fails, check in this order

- Is the listing claimed? The badge grants nothing on its own — the dofollow link comes with the claimed listing.
- Has the listing gone live? Submissions enter a queue with a go-live date; verification before that date has nothing to verify. Launchstag sells queue-skipping from $15; the free queue is free and slower.
- Does their verifier expect the badge to link to the **listing**, not the homepage? Ours links to `https://launchstag.com`. If their checker wants the listing URL, the fix is one line in `build.mjs` once the listing URL exists — send it to me and I will wire it.
- Does their crawler see the footer? It is static HTML, server-rendered, in every page, no JavaScript required. If it does not see it, the problem is on their side.

**What I need from you:** a screenshot of the screen showing “Verify now”, or the URL of the listing. Without one of those, this item stays a guess, and I would rather say so than invent a procedure for a third-party dashboard I cannot log into.

---

## 4. Distribution — seven directories that fit, five that do not

A free browser-tools site is not a SaaS with self-serve software, and several “top directory” lists assume exactly that. Filtering for fit, and checking that the submission path exists:

### Submit to these

*Measured against the live pages on 26 Oct 2026. Copy to paste, field limits and the badge decision are in [`docs/day12/Day12_Directory_Descriptions.md`](day12/Day12_Directory_Descriptions.md).*

| Directory | Why it fits | What the free tier actually gives | First action |
|---|---|---|---|
| **Product Hunt** | Highest-authority launch platform; the referral traffic is the real value, not the nofollow link | Nofollow, no badge, no queue | Package ready in [`day12/Day12_ProductHunt_Package.md`](day12/Day12_ProductHunt_Package.md); `/posts/new` needs a login |
| **AlternativeTo** | Built on “alternative to X” queries — our strongest angle is *Screaming Frog alternative* | No badge required; the listing is the point, not the link | **Sign in first.** `/add-app/` is now a 404 in a browser; the form only appears for logged-in users |
| **SaaSHub** | Comparison and discovery; our comparison guide already targets this intent | No badge mentioned; paid “Feature My Product” is optional and skippable | `saashub.com/services/submit` |
| **tools.cafe** | Curated builder-tool directory, badge model, dofollow | Dofollow **once the badge is verified**, **30-day queue**, badge required | `tools.cafe/submit` — decide the badge first (§6 of the Day 12 file) |
| **Launchstag** | Badge model, dofollow, permanent indexed listing (see §3) | Dofollow, badge required — and it is **already in our footer** | Claim the listing, then the dashboard |
| **LaunchBuff** | Fortnightly tournament, permanent listing pages | **Nofollow**, badge required, and free entry is **paused with a ~1-year queue**. Dofollow starts at $19 | Skip the free tier. A paid dofollow link is a link scheme, not a directory listing |
| **SaaSCity** | Badge-model dofollow directory | Dofollow, **no map placement**, badge required, **~364-day review queue** | `saascity.io/submit` — submit now, forget it for a year |

### After a listing goes live: checking the link attribute

The step that circulates — and that appeared in the Day 12 corrections file — is `curl -sI` on the listing URL. It cannot work. `-I` fetches headers only, and `rel` is an attribute on the `<a>` element in the body. Measured on our own footer, which definitely carries `rel="noopener"`:

```
$ curl -sI https://tools4market.online/ | grep -ci 'rel='
0
$ curl -s https://tools4market.online/ | grep -o '<a[^>]*launchstag[^>]*>'
<a class="launchstag-badge" href="https://launchstag.com" target="_blank" rel="noopener">
```

So the check has to read the body, and it has to read the anchor pointing at **us**, not any anchor on the page — a listing can link to the homepage in one place and to the listing in another:

```
curl -sL "LISTING_URL" | grep -o '<a[^>]*href="https://tools4market.online[^"]*"[^>]*>'
```

| Output | Means | Action |
|---|---|---|
| `<a>` with `rel="nofollow"`, `sponsored` or `ugc` | the link does not pass PageRank | the free tier is not what the pricing page said. Record it in `suggest.md`; do not buy the upgrade to “fix” it |
| `<a>` with no `rel`, or `rel="noopener"` only | dofollow | done, nothing more to place |
| nothing | the page renders the link client-side, or there is no link | open the listing in a browser and inspect the element. An empty `grep` is not evidence of no link |

The last row is the one that costs an afternoon, and the first version of this section got the example wrong. tools.cafe's homepage and category pages return no outbound product anchors — they link internally to `/p/<slug>` — but the **detail page is server-rendered**. Fetched 26 Oct 2026:

```
$ curl -sL https://tools.cafe/p/clerk | grep -o '<a[^>]*clerk\.com[^>]*>'
<a href="https://clerk.com/?ref=tools.cafe" target="_blank" rel="noopener noreferrer" class="btn btn-stamp">
```

Three things follow. The check works there, so an empty result usually means you fetched the index or a category page rather than the listing — confirm the URL before concluding anything. Their outbound link carries `?ref=tools.cafe`, so match on the domain, not on an exact URL. And the anchor has no `nofollow`, which is what a dofollow listing looks like in the raw HTML.

### Skipped, with reasons

- **G2, Capterra, GetApp** — require a base of verified customer reviews to surface in a category. A free, no-signup tools site has no review-collecting mechanism, so a listing would sit unfilled and unranked. Revisit only if we ever add accounts.
- **BetaList** — pre-launch only. We are live; submitting now is a mismatch the reviewer will catch.

### On “create 7 social accounts”

I would not. Seven dormant profiles are a liability: they rank for your brand name with no activity, and they split what little posting energy exists. For a free SEO-tools site the referral traffic comes from two places — **X** (where SEO practitioners argue) and **Reddit** (where they search), with **LinkedIn** a distant third for the B2B angle. Two accounts run properly beat seven run never. If you want the list anyway, say so and I will write the bios; the decision is yours, the reasoning is above.

### What I can prepare without your accounts

All four are written, as of 26 Oct 2026, in [`docs/day12/`](day12/):

- **Product Hunt package** — tagline, short and long description, five gallery concepts, maker's first comment, pre-launch email, launch-day timeline, and a “what not to say” list. → [`day12/Day12_ProductHunt_Package.md`](day12/Day12_ProductHunt_Package.md)
- **Per-directory descriptions** — 60 / 160 / 305-word variants, verb-first feature bullets, per-directory field limits, and the AlternativeTo mapping. → [`day12/Day12_Directory_Descriptions.md`](day12/Day12_Directory_Descriptions.md)
- **Five outreach pitches** — SEJ (with their rules quoted verbatim), SEOFOMO sponsorship, HN Show HN, Indie Hackers, and Search Engine Roundtable held back with a reason. Plus a blocked-target table. → [`day12/Day12_Outreach_Pitches.md`](day12/Day12_Outreach_Pitches.md)
- **Six social posts** — three X threads, three Reddit posts, five comment templates, and a corrected posting calendar. → [`day12/Day12_Social_Posts.md`](day12/Day12_Social_Posts.md)

None of it needed an account. The verification pass behind it found four errors in this file and in the brief it came from — the corrected table above is the result.

---

## What I need from you

1. **AdSense:** which state the console is in (A or B). If B, the three numeric slot ids.
2. **Cloudflare:** keep the managed block (enforcement) or drop it (one authoritative file). I recommend dropping it.
3. **Launchstag:** a screenshot of the “Verify now” screen, or the listing URL.
4. **Distribution:** start with X + Reddit, or the seven accounts as listed?

Everything above is reversible and none of it touches the site's code except the badge URL in §3.

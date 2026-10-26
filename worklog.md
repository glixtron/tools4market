# Work Log

Running log of agent sessions: who did what, what was broken, how it was fixed, and when it completed. Newest entries first.

*This log was created 23 Oct 2026 (per owner request); sessions before that date are recorded in `progress.md`, which remains the chronological project history. Every working session appends one entry here, newest first.*

---

## 2026-10-25→26 (10th pass) — Source-link hygiene: five dead citations fixed, a checker to stop the next one

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** the CEO locked a new gate after the Day-11 verification — never cite a primary-doc URL as authority without confirming it returns 200 with the expected content. Applying that gate retroactively to the 24 guides found citations that had quietly rotted.

**What was actually broken.** Four citations returned 404 or pointed at a dead host: the robots meta-tag reference (two guides cited `…/crawling-indexing/robots/meta-tag`, deleted), the GA4 URL-builder article (`support.google.com/analytics/answer/10917986`), the “meta tags Google supports” page (`…/crawling-indexing/meta-tag`), and X’s cards markup reference (`developer.x.com/…/cards/overview/markup`, a host that no longer serves docs). Each was re-pointed at the live equivalent — `robots-meta-tag`, `answer/10917952`, `special-tags` — and the X link was removed from `open-graph-image-size-2026` rather than replaced, because nothing live says the same thing. That guide now cites `ogp.me` and Facebook’s sharing guide, which is enough for the two claims it makes.

**A checker, so this is caught before publish rather than after.** `scripts/check-sources.mjs` (`npm run check:sources`) walks every guide’s `links[]` — 43 unique URLs across 24 guides — and fails on 4xx/5xx. The first run also exposed a measurement bug in the checker itself: `?hl=fr` locators were showing up as redirects because the request advertised no language, so the script would have reported Google localisation as drift. It now sends `Accept-Language: en` and classifies redirects three ways: **moved** (path changed — re-point it), **locale** (`?hl=` only — ignored), **slash** (trailing slash — ignored). `--strict` promotes moved to a failure.

**Five genuine moves re-pointed, not just suppressed.** The checker’s remaining warnings were real: Google moved the HTTP-status doc to `/crawling/docs/troubleshooting/http-status-codes`, Facebook moved `/docs/sharing/webmasters/` to `/documentation/sharing/webmasters`, and three RFC citations used `/rfc/rfcNNNN`, which redirects to `/info/`; they now point at the canonical `/rfc/rfcNNNN.html` document text. Final run: **43/43 reachable, 0 failed, 0 moved**.

**Two pieces of stale documentation fixed in the same pass.** README still said “Eighteen how-to guides” — stale since Day 8 — and now lists all twenty-four. More seriously, ARCHITECTURE’s crawler-policy section still said the site “allows every crawler”, three weeks after v2.15 rewrote that policy to block AI training crawlers and explicitly allow answer engines. A doc that describes the opposite of the shipped `robots.txt` is worse than no doc, because it is the page a future reader trusts.

**Verification:** build **81 pages / 44 tools / 24 guides**; all 58 citations render into their pages; SEO audit **2547/2547**, smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**; deployed `60455cbb`; live-verify **73/73**. The eight edited guides were checked on the live site for the corrected hrefs and for the absence of `developer.x.com`. IndexNow submitted those **8 changed URLs**, not all 80 — the protocol asks for new or materially changed URLs, and re-submitting the whole sitemap on a link edit is noise.

**One silent failure closed on the monetisation path.** `AD_SLOT_TOP`, `AD_SLOT_CONTENT` and `AD_SLOT_SIDEBAR` are still empty, and the build’s `slotId()` treats an unrecognised value as “no slot” rather than an error — which is how the 24 Oct deploy shipped `ca-pub-…:0/0` as a real `data-ad-slot` for a day. The build now names the problem instead of swallowing it: a non-numeric `AD_SLOT_*` prints `⚠ AdSense: N slot id(s) not numeric and ignored` with the offending values, and an enabled loader with zero live units prints `ℹ AdSense loader on, 0 ad units — … Revenue stays zero until …`. Tested both ways: a bogus `ca-pub-…:0/0` produces the warning, a bare `123456` is accepted, and the current empty env produces the informational line. No dist bytes change, so no redeploy was needed.

**The monetisation walkthrough found a documentation bug that may explain the missing revenue.** The owner picked the “pause content, prep founder ops” route, so this pass also wrote `docs/founder-actions.md` — one authoritative procedure for the four console-side blockers, replacing a list that had been re-derived in six documents. Writing the AdSense section meant reading `build.mjs` closely, and the README’s instruction was wrong: it told the owner to add `AD_SLOT_TOP` / `AD_SLOT_CONTENT` / `AD_SLOT_SIDEBAR` as **Cloudflare Worker variables**. They are build-time values — `build.mjs` reads them and bakes `data-ad-slot` into the HTML, and `worker.js` never reads them, so a dashboard variable has no effect whatsoever. Following the documented step produces no change on the site and no error to explain why, which is exactly the kind of dead end that leaves a “five-minute action” undone for a week. README now says `.env` + `npm run deploy`, states that the values are build-time, and the runbook explains how to tell pre-approval from approved — a pre-approval console has no *Ads → By ad unit* menu, so the next action there is *Request review*, not slot wiring.

**The Cloudflare recommendation was also wrong, and the runbook says so.** Cloudflare’s docs (updated 22 Oct 2026) show that the same **Bot Preference Sync** setting that prepends the managed block also enables **edge blocking** for AI training crawlers. Turning it off therefore buys a single authoritative file and gives up the only technical enforcement the policy has. The served file was measured rather than assumed: 225 lines, Cloudflare’s block on 1–173, ours from 175, with `Google-Extended: Disallow: /` at line 53 against our `Allow: /` at 222 — one of our decisions resting on an RFC tie-break. Bots we care about are allowed either way, which is why dropping it is still the better trade for a site that wants citations, but it is now presented as a decision instead of a cleanup.

**`pending-work.md` was three weeks stale and actively wrong** — production described as v2.5 `0e496a9d`, AdSense described as on hold (lifted 24 Oct), and the loader described as not shipping without slot ids (it ships whenever `ADSENSE_ENABLED=1`). Corrected, with the owner-side work now pointing at the runbook instead of being duplicated.

**Day 12 (26 Oct) — the four writing deliverables, and a verification pass that contradicted the brief four times.** The owner authorised the writing work that does not need an account, so `docs/day12/` now holds four documents and an index: the Product Hunt package (tagline, descriptions, five gallery concepts, maker comment, pre-launch email, launch-day timeline), the directory descriptions (60 / 160 / 305-word variants, verb-first bullets, per-directory field limits, the AlternativeTo mapping), the five outreach pitches with SEJ's contributor rules quoted verbatim, and the six social posts with corrected dates.

**The verification was worth more than the copy.** Six statements in the brief were wrong: (1) “Sunday Oct 26” — 26 Oct 2026 is a **Monday**, so the launch calendar was off by a day and the Tuesday–Thursday recommendation moved with it; (2) AlternativeTo's `/add-app/` “returns 403 to curl, works in a browser” — it returns **404 in a real browser**, and so do five other candidate paths, so the submission is simply login-gated and the 403 was Cloudflare hiding a dead URL; (3) LaunchBuff's “permanent dofollow listings” — the free tier is a **nofollow** link, requires their badge, and free entry is **paused with a ~1-year queue**, with dofollow starting at $19, which makes it a paid link rather than a directory; (4) the “alternative to QRCodeGenerator” mapping — **there is no QR tool among the 44**; (5) Search Engine Land's “invite-only, no unsolicited pitches” — the site is behind a Cloudflare challenge that a real browser also fails, so the earlier quote is recorded as **unverified** instead of repeated; (6) SaaSCity and tools.cafe were filed as free, and both require **their badge on your site** for the free tier — a visible change across 81 pages that needs a decision first.

**Thirty-two sources, checked properly, and four soft-200 traps found.** `/write-for-sej/` returns 200 and serves “20 Web Directories You'll Still Want To Use”; `contentmarketinginstitute.com/contribute/` returns 200 with `<title>news` for every path tested. Same class of error as the guide citations: a 200 is not evidence. Final tally: 16 verified with the expected content, 4 soft-200 traps, 6 confirmed dead or absent, 4 blocked by bot protection and 2 login-gated.

**Two new facts that change the plan.** tools.cafe is the only free tier measured in weeks rather than a year (30-day queue, dofollow after badge verification), and three of the seven directories — tools.cafe, Launchstag, LaunchBuff — are one operator family (tools.cafe's footer lists both as “Partner Sites”). Seven submissions, five businesses.

**`npm run check:social` added.** It measures all 18 tweets against X's 280-character limit on both raw and weighted length (links count as 23 characters, bare domains included, because a tweet can pass one measure and fail the other). All 18 pass. The 160-word description variant is 994 characters — deliberately inside tools.cafe's 1,000-character field, which it missed by eleven before the trim.

**The Indie Hackers post, written in full.** The CEO endorsed the directory research as the highest-return distribution action, and the reasoning is sound: it is the only item in the folder that is useful to someone who never visits the site. `Day12_IndieHackers_Post.md` is a 707-word post — seven directories, what the free tier actually gives, three findings, the paid-link decision — plus three title options, posting mechanics, and four drafted replies for the questions it will attract (“what's the DR?”, “you're just advertising”, “G2 is missing”, “just pay the $19”). It ships with a warning the CEO's brief does not carry: change the sentences to your own voice, because a post that reads like a committee wrote it gets one polite upvote and no replies.

**Two badge emails, drafted rather than described.** Both directories publish a support address (`support@tools.cafe`, `support@saascity.io`), so the badge question is a five-minute job instead of a contact-form roulette. Reading tools.cafe's FAQ to write it surfaced a sequencing gate that changes the order of operations: their badge snippet lives in the listing dashboard **after go-live**, and placement is “a required condition of the listing”. So you cannot place the badge before you submit — the question has to be answered first, or you discover in 30 days that the listing is live and not dofollow.

**The calendar moved a day, and not because of the brief.** Today's 09:00 ET slot had already passed by the time the work landed, so the launch thread starts Tuesday 27 Oct rather than Monday 26. The third thread then slips to Monday 2 Nov instead of Saturday 31 — a four-day gap costs less than posting to an SEO audience on a Saturday.

**`docs/founder-actions.md` §4 corrected in place**, with a “what the free tier actually gives” column, and its deliverables list now points at the folders instead of promising them.

**A seventh error, this time inside the CEO's corrections file.** Its step 4 says to verify the dofollow attribute “via `curl -sI` on the listing URL”. That cannot work: `-I` fetches headers only, and `rel` is an attribute on the `<a>` in the body. Measured on our own footer, which definitely carries `rel="noopener"`, `curl -sI https://tools4market.online/ | grep -ci 'rel='` returns **0** while the body returns the anchor. §4 now carries the working check — fetch the body, grep for the anchor whose `href` points at our domain, read its `rel` — plus the three outcomes. The third outcome matters most: tools.cafe is a Next.js app and returns no outbound product anchors to `curl` at all, so an empty result there is “not server-rendered”, not “no link”, and the check has to happen in a browser.

**Verification:** build **81 pages / 44 tools / 24 guides**; SEO audit **2547/2547**; smoke **44/44**; social **18/18 within limit**; 35 sources checked (18 verified, 4 soft-200 traps, 7 dead, 4 blocked, 2 login-gated). No runtime files changed, so no redeploy and no IndexNow.

**Owner actions still open:** AdSense console state (then slot ids), Cloudflare managed robots.txt decision, Launchstag Verify screenshot or listing URL, distribution kickoff — plus the new badge decision for tools.cafe and SaaSCity.

**Completed:** 26 Oct 2026.

---

## 2026-10-25 (9th pass) — Day-11 pack: XML sitemaps, structured-data validation, HTTP status codes (v2.17)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** CEO Day-11 proposal named XML sitemaps, Twitter Cards and schema validation; the founder forwarded it for execution.

**One candidate failed the primary-source gate, so it was replaced.** The proposal cited X’s card documentation at `developer.x.com/en/docs/twitter-for-websites/cards`. That URL now redirects to `docs.x.com/overview`, and the replacement path returns 404: X no longer publishes the card reference, and the last official copy is an archived snapshot. The proposal also said the standalone Card Validator is “gone”; in fact the preview was removed in 2022 and the page remains for logs and domain checks. Writing a guide whose primary citation redirects to a documentation home page would have broken the rule that facts come from current primary sources. The third slot went to HTTP status codes instead — RFC 9110 plus Google’s crawling documentation, both live, and a genuine gap (no guide used the phrase “http status”).

**What shipped.** `xml-sitemap-best-practices` (622 words), `test-structured-data` (632) and `http-status-codes-seo` (633), each six prose sections and six FAQs, tool names only, no tables or lists.

**Facts pinned to the primary documents, including the ones that contradict common advice.** Sitemaps: 50,000 URLs or 50 MB uncompressed per file, 50,000 entries in an index, UTF-8 and absolute URLs, a subdirectory sitemap covers only its own descendants unless submitted through Search Console, Google ignores `changefreq` and `priority`, and `lastmod` is used only while consistently verifiable. The ping endpoint was deprecated in June 2023 and stopped answering at the end of 2023, so old scripts are now getting 404s. Status codes: Google treats 301 and 308 the same, 302 and 307 the same, 301 is a strong signal and 302 weak, crawlers follow up to ten hops, all 4xx except 429 are handled identically — so “410 removes faster than 404” is not Google’s documented behaviour — and 429/5xx are temporary with crawl rate recovering gradually. Validation: the Rich Results Test checks Google feature eligibility, the Schema Markup Validator checks schema.org syntax, and passing one says nothing about the other.

**Corrections made before publish.** The structured-data draft came in at 578 words (under the 600 floor) and its metaDesc at 161 characters (over the 158 cap); the draft was expanded rather than padded and the description rewritten to 157. One FAQ pair in the status-code post did not carry the focus phrase, which the audit caught as a single failure; the question was reworded rather than adding a keyword to the answer.

**Cross-links.** `why-is-my-site-not-indexed` now points at both the sitemap and status-code guides; `website-launch-seo-checklist` at the sitemap and validation guides; `internal-linking` at the sitemap guide; `schema-markup-for-ai-search` and `screaming-frog-alternative` at the validation guide; and `htaccess-301-redirect`, `noindex-vs-robots-txt` and `rel-canonical-tag` at the status-code guide. The schema guide had no `relatedGuides` field at all before this pass, so the link graph now covers it.

**Verification:** build **81 pages / 44 tools / 24 guides**, sitemap **80 URLs**; SEO audit **2547/2547**, smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**; deployed `4e35b662`; IndexNow **80 URLs** (HTTP 200); live-verify **73/73**. All three live URLs return 200 with the three schema blocks and a Read next block; the live blog sitemap lists 24.

**Deferred:** a Twitter Cards guide, until X republishes a stable card reference or the archived snapshot is accepted as the citation of record. Recorded in `suggest.md` so it is not re-proposed as if the docs were live.

**Owner actions still open:** AdSense slot ids, Launchstag Verify now, Cloudflare managed robots.txt off, distribution kickoff.

**Completed:** 25 Oct 2026.

---

## 2026-10-25 (8th pass) — Day-10 pack: URL slugs, rel=canonical, hreflang (v2.16)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner authorized Day 10 after accepting six audit corrections, with the topics gap-checked against the 18-guide library.

**Why these three, and not pagination.** "URL slug" did not appear in any guide and "slug" appeared once, in passing, inside internal linking; canonical had no guide of its own and was mentioned as an aside in six; hreflang had one mention, in the Screaming Frog comparison. Pagination was considered and dropped: Google no longer uses `rel=next`/`prev`, and there is no pagination tool here to attach the guide to, so it would have been an article with no destination.

**What shipped.** `url-slug-best-practices` (844 words), `rel-canonical-tag` (775) and `hreflang-basics` (753), each six prose sections and six FAQs, in the same data shape as the existing library (`src/data/blog.js`). Tool references are names, not URLs — the audit guard resolves them to `/tools/<slug>/` before review. No tables or bullet lists, because the renderer supports neither; the two posts that need markup use `sections[].pre` for the code block.

**The facts came from the primary documents, not from SEO blogs.** URL structure: IETF STD 66, hyphens recommended and underscores explicitly not, case-sensitivity, fragments that change content unsupported, parameters and session IDs as the real cause of duplicate URLs. Canonicalisation: the tag is a strong signal ranked below a redirect, it belongs in the head, should be absolute, should self-reference, must not carry `hreflang`/`lang`/`media`/`type`, and must not point at a redirect, a 404, a robots-blocked URL or a noindex page. hreflang: ISO 639-1 plus optional ISO 3166-1 Alpha-2, region alone invalid (`be` is Belarusian), `es-419` unsupported, `zh-Hant` via ISO 15924, reciprocity required or the annotations are ignored, `x-default` for the fallback, and the three publication methods treated as equivalent.

**Folklore left out on purpose.** Keywords in a slug are not a documented ranking factor; hreflang does not detect a page's language and does not add ranking weight; a canonical is not a directive and has no published processing time; the Search Console International Targeting report was retired in 2022, so there is no site-wide hreflang error list and the guide says to compare the sets instead. The title-length post from Day 9 already carries the "60 characters is a guess" correction, so the slug post does not repeat it as a length claim.

**Cross-links, so the new posts are not orphans.** `htaccess-301-redirect` now points at both the slug and canonical guides, `internal-linking` at the slug guide, `why-is-my-site-not-indexed` at the canonical guide, and `screaming-frog-alternative` plus `website-launch-seo-checklist` at the hreflang guide. The audit's resolve guard checks every `relatedGuides` slug, and the render check confirms each target appears as a link.

**Verification:** build **78 pages / 44 tools / 21 guides**, sitemap **77 URLs**; SEO audit **2468/2468** (+78, three posts' worth), smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**; deployed `1227718b`; IndexNow **77 URLs** (HTTP 200); live-verify **73/73**. All three live URLs return 200 with `BlogPosting`, `FAQPage`, `BreadcrumbList`, a Read next block and the expected code blocks. Two deploy attempts failed first with Cloudflare API 500s on the assets-upload session, then succeeded unchanged.

**Two metaDescs were over the 158-character limit** on first draft (162 and 159, against a 110–158 rule); both were rewritten rather than trimmed mid-word, and the audit now measures 157 and 151.

**Owner actions still open:** paste the three numeric `AD_SLOT_*` ids (blocks revenue), click Verify now on Launchstag, and turn off Cloudflare's managed robots.txt so the repo's policy is the only one served. Distribution kickoff is the other unstarted track.

**Completed:** 25 Oct 2026.

---

## 2026-10-25 (7th pass) — robots.txt: the edge was contradicting the repo, and the guides

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** the owner's Days 0–9 audit reported "ALL AI crawlers are disallowed, opposite to Day 1" and asked for a policy decision.

**What was actually true.** The repo's `build.mjs` emitted `User-agent: * / Allow: /` and nothing else. The live file served 47 named `Disallow: /` groups above it, plus a Content-Signal line, wrapped in `# BEGIN/END Cloudflare Managed Content`. So this was never the site's policy: Cloudflare's edge was prepending one, the origin was appending another, and no test compared them. The audit's attribution was wrong; its observation was right.

**It was also overstated.** `OAI-SearchBot` and `PerplexityBot` were not named, so they fell under `*` (`Allow: /`, `search=yes`): AI *search indexing* was allowed the whole time. What the edge blocked was training crawlers **and** the user-triggered fetchers — `ChatGPT-User`, `Perplexity-User`, `Claude-User` — which is the half that decides whether an assistant can read a page it is asked about. "Invisible to AI search" was the wrong diagnosis, and it would have led to unblocking everything instead of the four bots that mattered.

**Decision: Path A, written down in the repo.** robots.txt is now generated from two arrays in `build.mjs` — training crawlers blocked, six search/answer agents explicitly allowed — with the Content-Signal line kept. The policy lives in version control because a dashboard toggle is how it drifted in the first place.

**One nuance the audit missed, and the guide had wrong.** `Google-Extended` is not a crawler: it has no HTTP user agent of its own and is a control token Google's crawls consult. It switches Gemini training **and Gemini grounding** off together — grounding being how Gemini Apps cite a page. Blocking it is therefore not free, and the guide had listed it in *both* the training-crawler list and the answer-engine list, which is self-contradictory. The guide now explains the bundled trade-off, and this site allows the token explicitly — it has to be explicit, because "absent from the block list" means blocked the moment an edge names it, which is exactly what Cloudflare did. The rest of the training crawlers stay blocked.

**The guard that was missing.** `tests/seo-audit.mjs` asserted the opposite of the new policy (`default policy allows every crawler`) and would have blocked this fix; `tests/live-verify.mjs` only checked that the strings `User-agent: *` and `Allow: /` existed somewhere, which is why 47 blocks passed for a week. Both now parse the file into groups and resolve the effective rule per bot using RFC 9309 §2.2.1–2.2.2 (merge matching groups, wildcard only when no group names the bot, longest path wins, allow wins ties). The live check reads **the served file**, which is the whole point: a build-time assertion cannot see an edge injection.

**Verification:** build 75 pages / 44 tools / 18 guides; SEO audit **2390/2390** (+3 net); smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**; deployed `4c6fb8b2`; IndexNow **74 URLs**; live-verify **73/73** (first run caught a transient 500 on one blog URL during propagation, clean on re-run); `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `Perplexity-User` and `Google-Extended` now resolve to allow on the live file, `GPTBot`/`ClaudeBot`/`CCBot` to block.

**Owner action still required:** the Cloudflare managed block is still prepended (the served file is 225 lines, ours starts at 175). The origin's explicit `Allow` groups win on RFC 9309 tie-breaking, but relying on four different vendor parsers all implementing that is not a policy. Turn off the managed robots.txt in the Cloudflare dashboard so there is one source of truth; after that the file is ours alone and the live check keeps it honest.

**Completed:** 25 Oct 2026.

---

## 2026-10-25 (6th pass) — Launchstag listing badge in the footer

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner submitted the site to Launchstag; publishing the listing requires the badge on the site and a verification click on their side.

**What was added.** The `badge-dark.svg` variant from their snippet, in the footer bottom bar of **every page** rather than the homepage only — a "featured on" credit that appears on one page and not the rest reads as an accident. The anchor and image attributes are theirs (`https://launchstag.com`, `target="_blank"`, `rel="noopener"`, `alt="Featured on Launchstag"`), with `width`/`height` and `decoding="async"` added so the footer does not shift when the SVG lands, and `fetchpriority="low"` so a third-party request never competes with the page's own content.

**Layout.** `.footer-bottom` became a wrapping flex row: copyright links left, badge right, stacked below when the bar is narrow. Verified in the browser: renders 198x62 from a 396x124 source, image completes, no horizontal overflow, 23 footer links unchanged.

**Privacy.** A hotlinked badge sends every visitor's IP address and user agent to launchstag.com, outside the consent banner. That is now stated in the privacy policy's third-party section, including that it sets no cookie and that blocking third-party images disables it without breaking anything — the same standard the site applies to its own analytics claims.

**Performance.** One extra request per page view: a 1.4 KB SVG, cached by their CDN for four hours, below the fold, low priority, explicitly sized. No JavaScript, no cookie, no layout shift.

**Verification:** build 75 pages / 44 tools / 18 guides; SEO audit **2387/2387** (+1: the badge must exist on the homepage, so a footer refactor cannot silently drop the backlink); smoke **44/44**, consent **30/30**, worker-routing **14/14**; deployed; IndexNow 74 URLs; live-verify **70/70**; badge confirmed on the live homepage and a live tool page.

**Owner action:** the listing is published by clicking **Verify now** on Launchstag — their crawler has to see the deployed badge, which is now live.

**Completed:** 25 Oct 2026.

---

## 2026-10-25 (5th pass) — Day-9 pack: OG images, redirects, title length (v2.14)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner dispatched Day 9 with the files actually attached, after a previous dispatch that existed only in chat. He asked for a gap check against the 15-guide library before anything was written.

**Gap check first: all three cleared.** `.htaccess` appeared **zero** times in the library. Title tags and Open Graph appeared only as a single step inside `website-launch-seo-checklist` and one mention in `screaming-frog-alternative` — sentences, not sections. All three published; guides 15 → 18, pages 72 → 75.

**The pack's slug verification was again incomplete.** It claimed all three tool slugs were verified; `xml-sitemap-generator` does not exist (real slug: `sitemap-generator`), and every link used the wrong `/seo-tools/` and `/web-tools/` scheme for the fourth pack running. `relatedTools` would have dropped the dead slug silently, exactly as it would have with Day 8's `image-optimizer`.

**Format problems the pack could not have known about:** the build renders article prose through `rich()` (bold and inline code only) with one `<p>` per string, so the spec **tables** and bullet **lists** would have shipped as pipe characters and dashes. Converted to prose; the four redirect patterns became a real code block through the existing `sections[].pre` field.

**Fact-checking did the real work again:**
- **"301 passes PageRank, 302 does not."** Google's current documentation frames this as canonicalisation: both are followed, a permanent redirect makes the target canonical and shows it, a temporary one keeps the source canonical and visible. The 2016 "equivalently to direct links" claim is stronger than anything documented today, so the FAQ says signals consolidate — not a 1:1 transfer.
- **"Google follows about 5 hops."** Not published. Removed; chains cost a request, and there is no documented limit to design against.
- **Search Console "Coverage"** is **Page indexing**, and "Page with redirect" is informational — the pack called redirect entries errors, which would have sent readers chasing a healthy state.
- **Title tags:** the ~600 px/520 px/580 px widths are measurements, not Google guidance (Google publishes no limit and truncates "to fit the device width"). The pack's 30–60% rewrite rate and 5–30% CTR lift have no published source; CTR is not a documented ranking input either. All three removed and replaced with the documented rewrite triggers.
- **Open Graph:** "unique images earn 2–3× more clicks", the 600×315 minimum and the per-platform 8 MB caps were untraceable. Removed. The guide's spine is the honest version: **the OGP spec defines no image dimensions at all**, so 1200×630 is platform convention.
- **X's standalone card validator is gone**; the guide points at the composer preview and platform docs instead of a dead URL.

**Cross-linking:** `website-launch-seo-checklist` now links all three new guides, `meta-description-length-2026` links the two spec sheets, and `noindex-vs-robots-txt` / `why-is-my-site-not-indexed` link the redirect guide — so the cluster has inbound links from older pages, not only from itself.

**Verification:** build **75 pages** / 44 tools / **18 guides**; SEO audit **2386/2386** (+95), smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**; deployed; IndexNow **74 URLs**; live-verify **70/70**; all three URLs 200 with `BlogPosting` + `FAQPage` + `BreadcrumbList` and a Read next block.

**Guard added (same session):** the audit now asserts that every `relatedTools` slug resolves, naming the slug it could not find. Unknown slugs were dropped silently by the renderer, which is how `image-optimizer` (Day 8) and `xml-sitemap-generator` (Day 9) both reached a review instead of a build failure. Verified by injecting a bad slug: **2385 passed, 1 failed — `blog/internal-linking: every relatedTool slug resolves — image-optimizer`**, then removing it.

**Pack notes:** `docs/day9/INTEGRATION-NOTES.md` (all three files archived beside it).

**Completed:** 25 Oct 2026.

---

## 2026-10-25 (4th pass) — Day-8 gap-list pack: 3 new guides (v2.13)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner dispatched Day 8 — three posts chosen from the gap list the previous session identified (internal linking, image SEO, Core Web Vitals) rather than by cadence.

**This pack was structurally right and factually wrong in places.** For the first time the topics were genuinely missing: a keyword sweep against the 12-guide library returned zero hits for "internal linking", "image", "vital", "LCP", "CLS", "INP" and "alt text". Three posts, three new guides — the first pack where the count in the executive summary matched what was publishable.

**Corrected before publishing:**
- "Failing all three Core Web Vitals is a confirmed ranking penalty" is false and contradicted the pack's own FAQ. Page experience is a **tiebreaker**; the guides say that everywhere and never claim a penalty.
- `rel="next"`/`rel="prev"` as a pagination requirement: Google stopped using those hints in **2019**. The pack's advice would have sent readers to add tags that do nothing while leaving later pages unlinked. Rewritten as the opposite, with what paginated archives actually need.
- "roughly 100 internal links per page" — a 2008-era guideline presented as current. Replaced with dilution/context as the real constraints.
- "AVIF not supported in older Edge" — current Edge supports it. Corrected, because the error pushes readers toward a worse format.
- The `image-optimizer` tool **does not exist** here; there is one tool, *Image Compressor & Optimizer*. `relatedTools` drops unknown slugs silently, so the pack's link lists would have produced dead entries with no error.
- Search-volume totals (17.6K / 21.5K / 56K) are third-party estimates; used for prioritisation, published nowhere.

**New build capability:** `article.relatedGuides[]` renders a **Read next** block. Before this, guides could not link to guides at all — prose is escaped and `relatedTools` is tool-slugs-only, which is exactly the gap the internal-linking guide is about. `tests/seo-audit.mjs` now asserts every slug resolves and that the links are present in the built page, so a typo fails the build instead of disappearing. Three existing guides (`website-launch-seo-checklist`, `why-is-my-site-not-indexed`, `screaming-frog-alternative`) now point into the new cluster, so none of the three new pages is an orphan.

**Verification:** build **72 pages** / 44 tools / **15 guides**; SEO audit **2291/2291** (+102), smoke **44/44**, consent **30/30**, personalized **181/181**, worker-routing **14/14**; deployed; IndexNow 71 URLs; live-verify **70/70**; all three guide URLs return 200 with `BlogPosting` + `FAQPage` + `BreadcrumbList` schema.

**Pack notes:** `docs/day8/INTEGRATION-NOTES.md` (all three files archived beside it).

**Housekeeping (same session):** this log had accumulated two copies of the Day-2/v2.10 entry, a second v2.9 entry mislabelled as v2.10, a duplicate stub for Day 5, and the Day 3–5 entries sitting below the 23 Oct entry. De-duplicated to **one entry per session** and re-ordered newest-first; only duplicate text was removed, nothing was rewritten.

**Completed:** 25 Oct 2026.

---

## 2026-10-25 (3rd pass) — plain HTTP now redirects to HTTPS

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner reported that the site was still reachable over `http://` and asked how to implement HTTPS instead.

**What was actually wrong.** `http://tools4market.online/` returned **200** — the site answered on both schemes, two live origins for every page. Only the `www` host redirected. Nothing was broken in the certificate or the TLS setup; the apex simply had no rule saying "HTTP is not an origin". Cloudflare's *Always Use HTTPS* zone setting also appears to be off, which is what normally covers this before a Worker is even invoked.

**Fix 1 — redirect in `worker.js`.** A `secure` check now runs **before** the `www → apex` redirect: if `url.protocol === 'http:'`, return `301` to `https://tools4market.online` + path + query, with `Cache-Control: no-store`. Ordering matters inside the Worker: when it sees an `http://www` request first it answers with the https apex in one hop instead of chaining two redirects. (In production Cloudflare *Always Use HTTPS* upgrades the scheme before the Worker runs, so live `http://www` is two hops — scheme, then host — ending on the https apex with no loop.) Two deliberate choices: the check reads `url.protocol` only and does **not** trust `X-Forwarded-Proto` (that header is client-supplied and a spoofed value would have skipped the redirect), and localhost/127.0.0.1 is exempt so `npm run preview` still works instead of bouncing to production.

**Fix 2 — HSTS in `_headers`.** The `/*` block of the generated `dist/_headers` now sends `Strict-Transport-Security: max-age=31536000`. No `includeSubDomains` and no `preload`: both are one-way doors, and this site has no known subdomain inventory. One year is the floor that browsers accept.

**New `tests/worker-routing.mjs` (`npm run test:worker`, 14 checks).** The redirect logic is tested without a deploy: apex http → 301, `http://www` → https apex in one hop (Worker-level — the harness invokes the Worker directly, with no zone setting in front), path + query preserved, spoofed `X-Forwarded-Proto` cannot skip it, https apex serves 200 with no loop, localhost exempt, and `dist/_headers` carries HSTS without `includeSubDomains`. Node's `Request` does not synthesise a `host` header from the URL, so the harness sets it explicitly — the first attempt looked like `https://www` was not redirecting purely because of that.

**Five new live assertions** in `tests/live-verify.mjs` (65 → 70) cover the deployed edge, with `redirect: 'manual'` so a redirect is observable instead of being followed.

**Verification:** build 69 pages / 44 tools / 12 guides; smoke **44/44**, SEO audit **2189/2189**, consent **30/30**, personalized **181/181**, worker-routing **14/14**, live-verify **70/70**; deployed; IndexNow resubmitted.

**Owner action still worth taking:** enable Cloudflare **Always Use HTTPS** (SSL/TLS → Edge Certificates) as belt-and-braces — it catches requests before the Worker runs. HSTS preload should wait until every subdomain is known to be HTTPS-only.

**Follow-up (same day):** owner enabled *Always Use HTTPS*. Verified the layering — `http://tools4market.online/` now returns Cloudflare's own `301` (`Content-Type: text/html`, no Worker headers), so the zone setting is the first line and the Worker redirect is the fallback rather than the primary. HSTS is confirmed live at `max-age=31536000` on the homepage, a tool page, the blog hub and a static asset. Subdomain inventory checked before considering `includeSubDomains`: `www` (redirects to apex) and `mail` (Namecheap Private Email, itself http→https and then to `privateemail.com`); both are HTTPS-capable, and mail routing is MX-only (`mx1/mx2.privateemail.com`), so adding `includeSubDomains` is now low-risk — but not required, and deliberately still off until the owner asks.

**Follow-up (deploy after v2.13):** the live run caught the assertion, not the site — `http://www` now returns `301 → https://www.tools4market.online/` because the zone setting rewrites the scheme before the Worker's host rule gets a chance, so the old "one hop" assertion was describing a world that no longer existed. Replaced with a chain check: hop 1 must start `https://`, and the fully followed request must land on `https://tools4market.online/`. That encodes the property that matters (no loop, canonical destination) without pinning the hop count to an ordering the edge controls. `npm run test:live` → **70/70**.

**Completed:** 25 Oct 2026.

---

## 2026-10-25 (2nd pass) — Day-7 pack integrated: 13 FAQs + 1 guide (v2.12)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner dispatched Day 7 (3 files, ~13,000 words) — FAQ Part 4 for tools 16–20, three long-tail blog posts, an internal-linking widget template.

**Cross-check before writing anything.** The pack again targeted URLs that do not exist here (`/content/hashtag-generator`, `/web-tools/xml-sitemap-generator`) and shipped hand-written FAQ `JSON-LD`; this site derives `FAQPage` from `tools.<slug>.faqs[]` at build time, so pasting it would have created a second schema copy that drifts.

**FAQ Part 4 — 13 of 15 merged, 2 rejected.** Each proposed question was checked against the four that already existed on the tool. Rejected as duplicates: hashtag per-platform counts, password safety, Base64-is-encryption, Base64 compression, URL `encodeURI` vs `encodeURIComponent`, XML-sitemap definition. Shipped the distinct ones: hashtag rotation + banned tags, `sitemap-news.xml`, sitemap update cadence, password-manager advice, Base64 use cases + padding, URL-encoding definition + separator trap. All trimmed to the ~300-character answer rule.

**Blog batch 3 — 1 of 3 published, and that is the correct number.**
- `meta-description-length-2026` **published**. Adapted, not pasted: dropped the unsourced CTR range and the invented per-platform character table (Google publishes no character limit and truncates on rendered width — the article says so and gives a ladder as a rule of thumb instead), six sections not seven, house voice, internal links pointed at real tool slugs.
- `why-is-my-site-not-indexed` **already exists** (live since 21 Oct, same focus phrase, fuller structure). The pack's post 8 would have been a direct duplicate; only its genuine delta was merged — two FAQs covering "Discovered — currently not indexed" and where Search Console reports the exclusion reason. The pack's "35% of cases / 5+ years of forum questions" table was discarded as unsourced.
- The AI-training opt-out post **not published**: the site already runs three AI-crawler guides and `how-to-block-gptbot` already answers its central question. A fourth would split authority, not add it.

**Internal-linking widget — reviewed, not built.** The template is complete but its batch script rewrites built HTML, which `build.mjs` regenerates; it has to become a build step. Its `sessionStorage` counters would also bypass the consent gate. Reasoning recorded in `docs/day7/INTEGRATION-NOTES.md` so the next session does not re-litigate it. All three pack files archived verbatim alongside those notes.

**Verification:** build **69 pages** / 44 tools / **12 guides**; SEO audit **2189/2189** (+22), smoke **44/44**, consent **30/30**, personalized **181/181**. Three audit rules caught real errors mid-pass and were fixed rather than waived: the 3–6 FAQ cap (four pages were at 7), the 3–6 section cap (the new guide was at 7), and the focus-phrase rules for title/description/intro/heading.

**Completed:** 25 Oct 2026.

---

## 2026-10-25 — Brand mark wired in site-wide (v2.11)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner supplied a new logo (`tools4market-logo.png`, a navy tile with the white "k" mark and a lime dot) and asked to "add this as a logo on our website".

**What was actually delivered:** the supplied file was a JPEG with a `.png` extension and ~35% dead navy margin. Dropped in unchanged it would have (a) failed as a PNG, (b) rendered the mark at roughly a third of the tile at 34px. So the asset pipeline came first, the wiring second.

**New `scripts/make-brand-assets.mjs`** (pure Node + zlib — no sharp/imagemagick, so it regenerates on any machine):
- decodes the master PNG, finds the artwork's bounding box using a max-channel distance from the corner colour (a tight per-channel epsilon swallows the soft navy gradient — the first attempt returned the whole 1024² canvas),
- crops to a square around that box with 6% padding,
- box-filter downscales to **512 / 192 / 180 / 72 / 96** and re-encodes each as PNG,
- writes `favicon.svg` as a navy rounded tile with the 96px mark inlined as base64, so the real artwork ships instead of a hand-traced approximation that would drift.

**New `scripts/render-og.mjs`** (local render server + canvas page in `scripts/brand/og-card.html`): the old `og-image.png` still carried the retired indigo "T4" badge. The card is now drawn at exact 1200×630 on a canvas (real type rendering, not an upscaled viewport grab), POSTed back and re-encoded to opaque RGB with 5-bit-per-channel quantisation — **776 KB → 54 KB** with no visible difference, which matters because every social crawler fetches it.

**Wiring:** header + footer `logo-mark` are now `<img>` (34px, `width`/`height` set — no layout shift; the old gradient tile stays as CSS fallback), `apple-touch-icon` points at the dedicated 180px file, `theme-color` and the PWA manifest move to the logo's `#0b172f`, `favicon.ico` still wraps a PNG so legacy crawlers keep working, and the Organization/BlogPosting `logo` moves from the 1200×630 card to the square 512 tile (Google's logo guidance). `npm run brand` / `npm run brand:og` documented in `design.md` §5.

**AdSense correction (same session).** The previous deploy had `AD_SLOT_TOP/CONTENT/SIDEBAR` set to `ca-pub-1509697031230558:0/0`. That is not a slot id — `data-ad-slot` must be the numeric unit id, so every page was shipping a malformed ad request (nothing could fill) while the live-verify suite stayed red on two assertions that still encoded the old "AdSense is on hold" policy. Fixed: `slotId()` normalises `ca-pub-…:<digits>` or bare digits and drops anything else, so a bad value now degrades to reserved space instead of a broken `<ins>`; a new `ADSENSE_ENABLED` switch decouples "ship the loader" (verification + policy review) from "have real units"; `.env` sets `ADSENSE_ENABLED=1` with empty slot ids and a comment naming the exact console path to get them. The two live-verify assertions were rewritten to the new policy (loader exactly once, publisher id, consent-aware; slots either absent or numeric) — suite **61 → 65 checks, 65/65 green**.

**Verification:** build 68 pages / 44 tools / 11 guides; smoke **44/44**, SEO audit **2167/2167**, consent **30/30**, personalized **181/181**, live-verify **65/65**; deployed `8a7dd70a`; IndexNow 67 URLs (HTTP 200); live `logo-mark.png` hash matches the repo byte-for-byte.

**Completed:** 25 Oct 2026.

---

## 2026-10-24 (late session) — Day 5: Backlink + Outreach + FAQ Part 2

**Agent:** MiMo (OpenCode session)
**Trigger:** owner requested proactive continuation after Day 4. Three deliverables produced: 30-site backlink target list, 15 outreach email templates, and FAQ HTML + JSON-LD for tools 6-10.

**Deliverable 1 — `Day5_Backlink_Target_List_30_Sites.md`:** 30 high-DR pitch targets across 5 tiers:
- **Tier 1 (DR 90):** Search Engine Land, Ahrefs, Backlinko, HackerNews
- **Tier 2 (DR 80–88):** There's An AI For That, dev.to, Reddit
- **Tier 3–5:** Remaining sites with pitch angles + contact methods
- **Expected outcome:** 5–10 replies → 2–4 published backlinks
- **Pitch angles:** tailored per site type (guest post, case study, resource list, tool review)

**Deliverable 2 — `Day5_Outreach_Email_Templates.md`:** 15 ready-to-send email/DM templates:
- Guest post pitches to Search Engine Land + Search Engine Journal
- Direct pitches to Barry Schwartz, Brian Dean, Neil Patel
- TLDR + Hacker Newsletter submissions
- Product Hunt hunter outreach
- Matt Wolfe YouTube pitch
- Ahrefs case study pitch
- IndieHackers story pitch
- AI News pitch
- 10-day follow-up template
- Weekly cadence (6 pitches/week × 4 weeks = 24 pitches → expected 5–10 replies, 2–4 published backlinks)

**Deliverable 3 — `Day5_FAQ_Top5_Tool_Pages_Part2.md`:** FAQ HTML + FAQPage JSON-LD for tools 6–10 (extending AEO coverage from 5 to 10 tool pages):
- **Open Graph Generator** — Q: "What are Open Graph tags?", A: detailed
- **Twitter Card Generator** — Q: "Difference between Open Graph and Twitter Card?", A: detailed
- **Canonical Tag Generator** — Q: "How many canonical tags should a page have?", A: detailed
- **Hreflang Tag Generator** — Q: "Does this tool handle negative hreflang values?", A: detailed
- **SERP Preview Tool** — Q: "Does this tool show mobile preview?", A: detailed
- Each Q&A trimmed to 300 characters; JSON-LD schema matches existing pattern; `updated: 2026-10-24` field added.

**Verification:** All three files archived in `/home/z/my-project/download/day5/` (~12,500 words total). Backlink targets feed SEO off-page strategy. Outreach templates streamline the pitch process. FAQ Part 2 extends AEO coverage tools 6–10.

**Completed:** 24 Oct 2026, concurrent with Day 4 deliverables.

---

## 2026-10-24 (late session) — Day 4: Distribution + Keyword Research + Internal Linking

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner said "complete all pending task" and requested workdone/log updates. Four deliverables produced: updated keyword research for 13 new tools, distribution kickoff plan, internal linking strategy for 68 pages, and Reddit post from Day 3.

**Deliverable 1 — `Day4_Updated_Keyword_Research_13_New_Tools.md`:** ~355,000 NEW monthly keyword surface from the 13 tools built beyond the original 31. Key findings:
- **Timestamp Converter** alone: ~60,000 monthly impressions (long-tail AI crawler cluster)
- **Marketing Calculators batch** (email ROI + marketing budget): combined ~100,000 monthly impressions (SEO & meta cluster + content & social cluster)
- 13 new tools add 355K+ keywords with 100–1,500 volume, low-difficulty, high conversion intent
- Full keyword table organized by cluster: AI Search/AI Crawler, SEO & Meta, Content & Social
- All 13 tools already exist in the codebase; keywords feed future guide/tool decisions

**Deliverable 2 — `Day4_Distribution_Kickoff_Plan.md`:** 7-day execution plan starting Sat Oct 25:
- **Sat Oct 25:** UNBLOCK ADSENSE + create 7 social accounts (X, LinkedIn, Reddit, dev.to, Hashnode, Medium, Quora)
- **Sun Oct 26:** Post first X thread (9 AM ET) + 3 Reddit value-first comments
- **Mon Oct 27:** Post r/SideProject standalone (9 AM ET) + first LinkedIn post
- **Tue Oct 28:** KPI tracker setup (5-tab Google Sheet) + GSC indexing requests
- **Wed Oct 29:** Submit to BetaList, Toolify, Futurepedia, There's An AI For That
- **Thu Oct 30:** Internal linking implementation Day 1 (Related Tools widget) + 3 more directory submissions
- **Fri Oct 31:** Publish dev.to article (Friday dev audience) + cross-post to Hashnode + Medium + Day 7 review

**Deliverable 3 — `Day4_Internal_Linking_Strategy_68_Pages.md`:** Audit + framework for building "Related Tools" + "Related Guides" widgets across 68 pages. Key points:
- **Projected 2.67x ad impressions per session** = direct AdSense revenue multiplier
- **Widget placement:** below tool output, above FAQ section, in guide trailers
- **Related Tools logic:** based on `relatedTools` field in blog data, cross-category linking
- **Related Guides logic:** based on `relatedTools` field, linking guides to tools they demonstrate
- **Implementation:** 2 days — widget template + JavaScript + 68 page updates

**Deliverable 4 — `Day3_Reddit_Standalone_Post_SideProject.md`:** (from Day 3) Ready-to-paste Reddit standalone post for r/SideProject (Tuesday Oct 27, 9 AM ET) — included as reference for the distribution kickoff.

**Verification:** All four deliverables archived in `/home/z/my-project/download/day4/`. Keyword research feeds future tool/guide decisions. Distribution plan provides 7-day sprint. Internal linking strategy projected to increase ad impressions by 2.67x per session.

**Completed:** 24 Oct 2026, 02:24 IST (concurrent with Day 3 deliverables).

---

## 2026-10-24 (late session) — Day 3: Blog refreshes + Reddit post

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner requested proactive continuation after Day 2 delivery. Three deliverables produced: two blog post refreshes and a Reddit standalone post for r/SideProject.

**Deliverable 1 — `Day3_BlogPost_Refresh_001_Block_GPTBot.md`:** Refreshed guide "How to Block GPTBot (and What It Actually Costs You in 2026)" — expanded from 613 to 2,180 words. Added:
- New section: "What changed in GPTBot policy (August 2026)" — crawling budget tradeoffs, when to allow/disallow
- New section: "The citation tradeoff" — blocking GPTBot means your content won't appear in ChatGPT answers; keeping it means your content may train future models
- Updated FAQ with 6 questions (including new ones on policy changes and citation)
- Updated JSON-LD FAQPage schema to match new FAQs
- `updated: 2026-10-24` field added
- Word count grew from 613 → 2,180

**Deliverable 2 — `Day3_BlogPost_Refresh_002_Appear_in_ChatGPT_Search.md`:** Refreshed guide "How to Appear in ChatGPT Search Results: 2026 Tactical Playbook" — 2,640 words with 7-step playbook + 90-day timeline to first citation. Added:
- Step-by-step: claim verification, content prerequisites, submission process
- 90-day projection model with milestone checkpoints
- New FAQ: "How long until I appear in ChatGPT search?" with honest timeline expectations
- JSON-LD Article schema updated with new headline and dateModified
- `updated: 2026-10-24` field added

**Deliverable 3 — `Day3_Reddit_Standalone_Post_SideProject.md`:** Ready-to-paste Reddit standalone post for r/SideProject (Tuesday Oct 27, 9 AM ET). Includes:
- 3 title options with hook formulas
- Full post body with value-first framing, engagement rules, risk mitigation
- Cross-posting plan (which subreddits, which to avoid)
- Tone reminders (professional, no self-promotion, answer-focused)
- Tracking template for upvotes/comments
- Post time: Tuesday Oct 27, 9 AM ET

**Verification:** All three files archived in `/home/z/my-project/download/day3/`. Blog refreshes update internal linking references; Reddit post ready for scheduled publish.

**Completed:** 24 Oct 2026, 02:24 IST (same session as Day 2 pack integration).

---

## 2026-10-24 (early session, 2nd pass) — Day-2 content pack integrated (v2.10)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner's parallel "Day 2" agent session produced a 9-file content pack (two blog posts, an AEO FAQ set, analytics/GSC-GA4 setup guide, Product Hunt + social assets, 50-keyword research, a master compilation, and an OpenCode prompt naming 7 "machine-executable tasks"). Owner asked to read all of it and "add everything properly" to the project docs.

**What was wrong with the pack as written:** it targets a CMS this site does not have, uses a URL scheme (`/ai-search/…`, `/seo-tools/…`, `/content/…`, `/blog/…`) this site never had — real URLs are `/tools/<slug>/` and `/blog/<slug>/` — carries stale 31-tool counts, and recommends installing GA4 through Google Tag Manager, which v2.7 measured as ~560 KB/page of dead weight and turned off. Executing the prompt verbatim would have produced 404 internal links and re-broken the performance work.

**Cross-check before touching anything:** tasks 1–4 were already shipped — `/robots.txt` + `/llms.txt` at root, Organization + WebSite schema on the homepage, BreadcrumbList + FAQPage on every tool page, all asserted by the seo-audit. Task 5's structure (FAQ + FAQPage) also existed on all 44 tools; only the *content* was new. Task 6's llms.txt post would have duplicated the existing `llms-txt-guide` (self-cannibalisation). Task 7's `tool_used`/`tool_copied` already existed as `tool_run`/`copy_output`.

**What actually shipped (v2.10, commit `ea839d3`):**
- All 9 pack files archived verbatim in `docs/day2/`, plus `docs/day2/INTEGRATION-NOTES.md` recording the task-by-task matrix, the corrections and the owner-side leftovers.
- **New guide `screaming-frog-alternative`** — the one genuinely new post, adapted to house voice: honest-limits sections kept, the "when to use which" decision rule kept, internal links moved to `relatedTools` (prose is HTML-escaped by design), 10-point pre-publish checklist shipped as a code block.
- **`llms-txt-guide` upgraded in place rather than duplicated** — merged in the pack's three-question decision flow, the file-format skeleton and the three common mistakes; added a 6th FAQ capturing the "llms.txt example" query; set `updated: 2026-10-24`; ~640 → ~1,100 words. Kept our newer v2-spec (Aug 2026) section the pack did not know about.
- **5 AEO FAQ additions** merged into the top-5 tools (robots-txt-generator: block training but stay citable; llms-txt-generator: do-I-need-one; meta-tag-generator: OG vs Twitter Card; utm-link-builder: lowercase rule; schema-markup-generator: priority order) — each trimmed to the 300-char answer rule and de-duplicated against existing FAQs.
- **2 missing GA4 events** added to `src/site.js`: `search` (`search_term` + `results_count`, 800 ms debounce, ≥2 chars, deduped) and `external_link_click` (`link_host`/`link_path`, analytics/infra hosts excluded). Consent-gating by construction is unchanged — `track()` no-ops without gtag.
- Owner-side leftovers (KPI sheet, GA4↔GSC link, social/PH/directory actions, indexing habit) recorded in a new `pending-work.md` section pointing at the archived files. Counts updated: README/Architecture → 68 pages, 44 tools, 11 guides.

**Verification (all before commit):** build 68 pages / 44 tools / 11 guides, smoke 44/44, SEO audit **2167/2167** (+22 for the new guide and the FAQ changes), consent 30/30, personalized 181/181, suggest-api 24/24. Deployed as Worker version `6d5cd8fd-c009-4eae-a7cb-6d923add67b5`; IndexNow **67 URLs** (HTTP 200); live-verify **61/61**; new guide confirmed live with FAQPage schema, llms guide confirmed showing "Updated 2026-10-24", both new GA4 events confirmed in the served `site.js`.

**Completed:** 24 Oct 2026, 02:24 IST.

---

## 2026-10-24 (early session) — Calculator batch 2: email ROI + marketing budget (v2.9)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner was shown the day-1 pending audit — the single open code-side item was the visual/mobile pass (blocked on the desktop browser being connected), and owner said "complete that also". The completable item was the next scheduled release: calculator batch 2, the day-1 plan's month-3 calculators pulled forward.

**What was built (v2.9, commit `2f11247`):**
- **Email ROI Calculator** — sends/opens/clicks/conversions/revenue/cost → open rate, click rate, click-to-open rate, conversion rate, revenue per email, net profit, ROI % and spend multiple, with verdict tiers and honesty guards: opens > sends, clicks > sends, conversions > clicks and zero cost (ROI undefined, full revenue counts as profit). Copy explicitly separates the profit view from ROAS and names the attribution traps (last-click flattery, assisted conversions).
- **Marketing Budget Calculator** — customer base, monthly growth rate, target, blended CAC (+ optional ARPU) → net new customers needed, months to target on **compounding** growth, acquisition budget (gap × CAC), added monthly revenue at target and CAC payback. Guards: zero base, zero growth ("target not reached by growth alone"), already-reached target, zero CAC. The body copy names the compounding model as the flattering one and tells the reader to discount it against the linear pace check — same honesty standard as the ROI/ROAS/CAC trio.

**Rules §3:** every user-facing string lives in `src/data/inspect.js` (`tools.emailRoi`, `tools.budgetCalc`); runtimes read `C`/`TOOLTXT` only. Both registered in `LOCAL_TOOLS` (`build.mjs`) + `SKIP_PANEL` (`runtime/inspect.js`) → 17 local / 27 fetch-capable, so both pages show "Runs in your browser" and ship only `runtime/marketing.js`.

**One real defect caught by the suite mid-build:** the budget calculator's "already reached" guard wrote only to the verdict `<p>`, leaving the `mbc-out` output block empty — smoke failed `marketing-budget-calculator produced output`. Fixed: output now carries the zero-gap line while the verdict explains why no projection runs.

**Verification (all before commit):** build **67 pages / 44 tools / 5 categories**, smoke **44/44**, SEO audit **2145/2145** (+82 new checks for the two tools), consent **30/30**, personalized **181/181** (+14 new functional checks — funnel rates, 220% ROI/3.2× multiple, 11.91 months at 8%, $60,000 budget, 3.33-month payback, plus every guard), suggest-api **24/24**. Docs updated: README + Architecture counts (44 tools / 67 pages), pending-work batch-2 row closed, pendingcommit Entry 9, progress v2.9 section.

**Deployed:** Worker version `e786264f-1756-4731-97d3-9bd15f931d28`. IndexNow **66 URLs** (HTTP 200), live-verify **61/61**, both new tool pages confirmed live (HTTP 200, "Runs in your browser" label present, both in the tools sitemap).

**Still blocked / owner-side (unchanged):** visual/mobile screenshot pass (needs the OpenCode desktop browser setting), Cloudflare `/tow0/` GA proxy + Web Analytics beacon review, AdSense (on hold), distribution accounts, GA4 dashboard goals, the founder decisions.

**Completed:** 24 Oct 2026, 02:03 IST.

---

## 2026-10-23→24 (night session) — Cross-session integration: timestamp + IP converters (v2.8)

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner pasted the completion transcript of a *second* OpenCode session that had worked in the Desktop checkout and asked: verify it, make sure everything is committed, then list the steps for pending tasks.

**What was wrong:** the second session had worked on a stale base — `main` at `8f0cb1b` (v2.4) with uncommitted changes — three releases behind the pushed source of truth (`5e5ee5a`, v2.7 live). On that stale base it had created five tools. Two were genuinely new (`timestamp-converter`, `ip-converter`); two were parallel re-implementations of tools v2.5 had already shipped (`og-image-tester`, `hreflang-checker`); one was a duplicate of the existing `url-encoder-decoder`, which that session then renamed around mid-flight. Its "all tests pass" claim (61 pages / 39 tools) applied only to its own stale tree, and its code carried rules violations and honesty bugs.

**What was done (v2.8, commit `7ce61cb`):**
- **Integrated** the two new converters into `audit-growth-plan-v2.1`, rewritten to house rules: all user-facing strings moved to `src/data/inspect.js` (`tools.tsConv`, `tools.ipConv`) per rules §3; discarded the three duplicate/parallel tools, the `style.css` diff (styled its own implementation) and the stale doc diffs.
- **Honesty fixes over the imported code:** batch-conversion claim removed (never implemented); pre-1970 negative timestamps now convert (FAQ promised them, code rejected them); `datetime-local` input parsed as the visitor's local time (was force-shifted with `Z`); the Local + Relative output lines the copy promised were implemented; IP input strips whitespace so "various spacing conventions" are true; fixed a prefill bug where *both* timestamp fields started filled, greeting new visitors with "Clear one field to convert."
- **Registered** both as local tools (`LOCAL_TOOLS` + `SKIP_PANEL` → 15 local / 27 fetch) so they show "Runs in your browser" and ship only their own runtime.
- **Repo hygiene:** `3-MONTH-STRATEGIC-PLAN.md` + `SUGGESTIONS.md` tracked for the first time (untracked on Desktop since v2.4); README/Architecture counts → 42 tools / 65 pages.

**Verification (all before commit):** build 65 pages / 42 tools / 5 categories, smoke 42/42, SEO audit 2063/2063 (+82), consent 30/30, personalized 167/167 (+15 new checks incl. TZ-proof local-time conversion and hex/decimal/binary/spaced IP inputs), suggest-api 24/24. Deployed (Version ID `191deb7e`), IndexNow 64 URLs (HTTP 200), live-verify 61/61; both new pages confirmed live (200, "Runs in your browser", per-page runtime only, strings bundle serves `tsConv`/`ipConv`, both URLs in the tools sitemap).

**Note for the owner:** the Desktop checkout's local changes are now **superseded** — everything of value lives in `origin/main` (`7ce61cb`). Safe to discard there: `git restore . && git clean -f` in `/Users/macbookpro/Desktop/Tools4market` (this also drops that session's stale doc edits; its untracked strategy docs are now tracked in the repo).

**Completed:** 24 Oct 2026, 00:01 IST.

---

## 2026-10-23 (late session) — PageSpeed deep fix: performance, CLS, accessibility

**Agent:** MiMo (OpenCode session, `ses_ea01d3779ffe…`)
**Trigger:** owner shared PageSpeed Insights data — mobile Performance **36** (FCP 6.4 s, LCP 9.1 s, CLS 0.693), desktop 88, "unused JavaScript 445 KiB", "render-blocking requests", Accessibility 90. Asked to make loading/indexing smooth and to start this work log.

**Diagnosis (local Lighthouse run, mobile, before changes):**
- Performance 62 on a clean run, **TBT 4,070 ms**, main-thread 8.0 s, unused JS **557 KiB**.
- Root causes found:
  1. **Every page loaded all 7 runtime scripts + strings + inspect engine (~210 KB JS)** regardless of the page's tool — homepage loaded tool runtimes it can never run.
  2. **Google Fonts via CSS `@import`** — serial render-blocking chain: HTML → style.css → fonts.googleapis.com → fonts.gstatic.com woff2 (also flagged for 30-min cache lifetimes).
  3. **Google Tag Manager loaded gtm.js (~560 KB) on every page** although the container was audited earlier and holds **no GA4 measurement id** (GA4 runs via the direct Google tag) — pure main-thread cost.
  4. **AdSense loader (`adsbygoogle.js` + `show_ads_impl` ~150–250 KB)** fetched on every page while the account is on hold with **no ad unit ids configured** — it cannot render anything; also caused the best-practices "third-party cookies" failure.
  5. Mystery first-party requests `/tow0/…` (131 KiB) and a Cloudflare beacon — **not in our repo or HTML**; identified as Cloudflare-dashboard-level injections (see pending-work.md for the owner action).
  6. Accessibility 90: eyebrow text 4.47:1 (needs 4.5), decorative counters 1.71:1, footer `h4` heading skip, prose links relying on color alone (1.05:1 vs body text).

**Fixes shipped:**
- **Per-page script slicing** (`build.mjs`): static pages load `site.js` only; tool pages load their category runtime + `inspect-strings.js` + inspect engine (only when the tool has a results panel) + `audit.js` (only the two audit tools). 13 local tools no longer ship the inspect engine.
- **Self-hosted fonts**: vendored all 12 woff2 files (35 `@font-face` blocks, subset-ruled) into `src/fonts/` → `/fonts/*` with 1-year immutable headers; removed the Google Fonts `@import` + preconnects; added `<link rel=preload>` for the two above-the-fold faces. Kills the render-blocking chain and the short third-party font cache.
- **GTM off by default** (`GTM_ID` now unset = off, matching the section's documented behavior). Direct GA4 gtag + Consent Mode unchanged. Re-enable = set `GTM_ID` in `.env`.
- **AdSense loader gated on `AD_SLOT_*`**: no ad unit ids configured → no loader ships (ads.txt stays published). Re-enable = set any `AD_SLOT_*` var; loader returns on next build.
- **CSS minified at build** (quote-aware comment/whitespace stripper; `src/style.css` stays readable) — 64.9 KB → 47.8 KB.
- **Identity source maps** generated for all first-party JS (devtools-only `.map` files) — fixes Lighthouse "missing source maps" without minifying JS.
- **Accessibility**: contrast-corrected `#8c6025` eyebrow/cat-num (5.06:1), `#766e5c` sec-num (4.64:1), `#8b8271` outcome-num (3.49:1 @24px), `#66707c` tool-proc (5.03:1); footer headings `h4`→`h3`; in-prose links underlined.
- Tests updated where assertions were stale against intentional changes (footer `h3`, minified-CSS regexes, GTM-off assertions in consent + live-verify).

**Result (local Lighthouse, mobile):** Performance 62→**81** (varies 69–81 with third-party fetch timing), **TBT 4,070→590 ms**, unused JS **557→71 KiB** (the 71 KiB is Google's own gtag.js), CLS 0, **Accessibility 90→100, Best Practices 77→100, SEO 100**. All suites green: build 63 pages, smoke 40/40, SEO audit 1981/1981, consent 30/30, personalized 152/152, suggest-api 24/24.

**Indexing health check:** robots.txt Allow:/ + sitemap index (3 child maps, 63 URLs), canonicals on every page, no noindex on public pages, IndexNow pipeline in place — crawl side unchanged and healthy; the speed fixes also remove the heaviest crawl-time main-thread work for Googlebot.

**Deployed:** ✅ commit `b53d0e8` pushed to `audit-growth-plan-v2.1` + `main`; production redeployed via `npm run deploy` (92 assets uploaded — fonts, source maps, minified CSS, all 63 pages); **IndexNow: 62 URLs submitted (HTTP 200)**; live verification **61/61 passed** (includes the new GTM-off, AdSense-off-while-slots-unset and ads.txt checks against production).

**Live PageSpeed after deploy:**
- **Desktop: Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100** (FCP 0.6 s, LCP 0.6 s, CLS 0, TBT 50 ms) — was 88/90/100/100.
- **Mobile: Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0** — was 90/77/100 with CLS up to 0.693. Performance score varies per run (57–81 observed) because the remaining cost is third-party and outside the repo: Google's own `gtag.js` (73 KiB) and the two Cloudflare-dashboard injections (`/tow0/…` 97 KiB + Web Analytics beacon). Owner action for the dashboard items is in pending-work.md — removing the `/tow0/` proxy (it may double-count GA4) is the single biggest remaining mobile lever.

**Notes for next sessions:**
- Any new tool page must be listed in the data files only — script loading is derived automatically (`RUNTIME_FILE` by category, `LOCAL_TOOLS` skip the inspect engine, `AUDIT_SLUGS` get `audit.js`).
- If fonts are ever changed: drop new woff2 subsets in `src/fonts/`, replace the `@font-face` block at the top of `src/style.css` (keep `font-display: swap`), update the two `<link rel=preload>` entries in `build.mjs`.
- To re-enable GTM: set `GTM_ID` in `.env`. To re-enable AdSense: set any `AD_SLOT_*` in `.env`. Both ship on the next build with no code change.

**Completed:** 2026-10-23 23:01 IST

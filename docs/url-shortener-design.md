# URL shortener — design note

*Requested 10 Nov 2026 after the four browser-local tools shipped. This is a design note, not a build order: nothing here is implemented, and the recommendation at the end is that most of it should not be. Every cost figure is an order-of-magnitude estimate from Cloudflare's published pricing, not a quote.*

**Status: dropped from the roadmap on 11 Nov 2026** after the owner read this note. It stays in the repository as the record of the decision, not as pending work. Reopening it means answering decisions 1–5 at the end, starting with the reputation-check key.

---

## The problem it is supposed to solve

"Free URL shortener" is the most requested tool on the roadmap list and the worst fit for this site. Three separate questions are bundled inside it, and they have different answers:

| Want | Real solution | Does a shortener help? |
|---|---|---|
| A URL that fits in a character limit | Any short link | Yes — but only if the short domain is short |
| Click counts per campaign link | Redirect with a counter | Yes, and this is the useful part |
| A tool page that ranks for "url shortener" | A page, not a service | Only if the service behind it works |

The third row is the trap. The keyword is large and the competition is a wall of funded services with short domains, apps and APIs. A new site can rank for "url shortener" only by offering a working shortener — which means hosting user-supplied redirects, which is the abuse surface described below.

## The domain problem, stated plainly

The site is `tools4market.online`. A short link from it looks like `tools4market.online/s/aB3x9`, which is not short. It is longer than most campaign URLs it would replace and buys nothing over the `utm-link-builder` that already exists.

So the honest value proposition is not brevity. It is **a managed redirect with click counting**. That is a different product, and it should be described as one or not built at all.

## What a public shortener actually has to defend against

A URL shortener is a redirect service that accepts arbitrary input from strangers. In the first hours after launch it will be used to hide:

- **Phishing and credential harvesting** — the short link hides the destination until the click.
- **Malware distribution** and drive-by download pages.
- **Spam** in forums, DMs and comment sections, which associates the redirecting domain with the spam.
- **Redirect chains** through other shorteners, laundering a bad destination through several hops.
- **Open-redirect abuse** — if the code parameter is trusted loosely, the service becomes a redirector others can point at their own targets.

The damage is to the domain, not just the tool: a domain that appears in phishing reports gets classified by Safe Browsing-style reputation systems, and a flagged domain can take the whole site with it — including the 51 tools and 24 guides that are the actual asset.

That is the reason this note is conservative. The cost of one bad week is higher than the lifetime value of the tool.

## Route and SEO behaviour

If it is built, these are not negotiable:

- **Path prefix `/s/<code>`**, never `/<code>`. The root namespace must stay free for tool and guide slugs; a code collision would 404 a real page.
- **`302`, not `301`.** A short link is a pointer, not an authority transfer. A permanent redirect tells search engines to consolidate the short URL into the target permanently, which is wrong when the code is reassigned or expires. (This is the inverse of the trailing-slash decision, where `301` was right because the canonical form never changes.)
- **`X-Robots-Tag: noindex`** on every `/s/` response, plus `Disallow: /s/` in robots.txt. Short links are plumbing; they should never enter an index or consume crawl budget.
- **No HTML at `/s/`.** A redirect response only. Anything that renders a page at `/s/` invites spam pages to be indexed under this domain.

## Storage: KV vs D1

| | Cloudflare KV | D1 |
|---|---|---|
| Read latency | Edge cache, best for the hot path | Regionally placed, slower than KV |
| Atomic counters | No — eventually consistent, lost increments under concurrency | Yes — SQL `UPDATE … SET hits = hits + 1` |
| Query by owner / expiry | No — key lookup only | Yes — indexes |
| Free tier | 100k reads/day, 1k writes/day | 5M rows read/day, 100k rows written/day |

**Recommended split, if built:** KV for `code → {target, createdAt, expiresAt, revokeToken, status}` because that is the redirect hot path; D1 (or Workers Analytics Engine) for click events, because counters need atomicity and `KV` cannot provide it. Using KV for both is the common mistake — the click count silently drops under load and nobody notices until the numbers are wrong.

One caveat on KV: a revoked code can stay readable in a cache for up to its TTL (60 seconds is the standard choice). For abuse takedown, that is acceptable *only* if the redirect handler checks a revocation list held in a Durable Object or D1, so takedown is immediate.

## Abuse controls — the parts that must exist before launch

None of these is optional, and several need credentials or accounts I do not have.

1. **URL reputation check on create.** Google Safe Browsing *Lookup API* is the usual choice; it needs an API key and has quota limits. Alternatives: Cloudflare Gateway URL categories (needs a Gateway plan), or a maintained blocklist. Without one of these, the service is a blind redirector.
2. **Deny rules, before any network call** — cheap and catches most junk:
   - scheme must be `http` or `https`;
   - reject IP-literal targets and `localhost`;
   - reject credentials in the URL (`https://user:pass@host`);
   - reject another shortener as the target (no chaining);
   - reject punycode/mixed-script hostnames (homograph attacks);
   - reject targets on a local deny list (known phishing hosts, `.zip`/`.mov` archive lures).
3. **Rate limiting per IP and per minute** — Cloudflare's Rate Limiting rules or a Durable Object token bucket. Without accounts, an IP is the only identity available, and it is a weak one: require a short minimum interval between creates rather than a burst allowance.
4. **Expiry and reclamation.** Anonymous links expire (30 days is a reasonable default) unless the creator holds a deletion token and extends them. Expiry is not just hygiene — it is the mechanism that stops the service accumulating a permanent library of forgotten redirects.
5. **Ownership.** Every code gets a random delete token returned once, stored by the creator. Without it, the first person to guess a code can delete someone else's link; with it, the service has no account system to build.
6. **A report route and a takedown commitment.** A `mailto:` or form that reaches a human, plus a stated response window. "Report abuse" is a legal expectation in most jurisdictions and a practical one everywhere: Cloudflare will forward complaints whether or not there is a process for them.
7. **Logging that is not a liability.** Store no raw IPs. If geography is wanted, store country only, derived at the edge. Hash the IP with a daily-rotating salt if deduplication is needed. Keep click events aggregated; do not keep a per-visitor trail that has to be defended later.

## Cost, roughly

At 10k redirects a day: KV reads are inside the free tier; D1 writes for click events are inside it too at that volume. The costs that are not free are the reputation API (Safe Browsing is free but quota-limited; commercial alternatives are not) and the human time for abuse reports. The service is cheap to run and expensive to supervise — which is the argument against launching it as a free, anonymous tool.

## What I would build instead

**Recommendation: do not ship a public shortener.** The three honest alternatives, in order of value per unit of risk:

1. **Owner-only redirect manager.** Twenty to fifty curated campaign links (`/go/<slug>`), created by the owner, with click counts. No user input, no abuse surface, no reputation API, no takedown process. This serves the actual need — campaign tracking with a stable URL — and can ship in a day. It still needs authentication, which this site does not have.
2. **Extend the existing UTM builder** with a click-counting option that points at the target directly. No redirector, no abuse surface, and it serves the same campaign-tracking job with a longer URL.
3. **Nothing.** Cloudflare Web Analytics already reports referrers and paths; if the question is "did this campaign work", the answer is often available without owning a redirector.

A public shortener is the option with the largest keyword volume and the smallest defensible position. If it is built anyway, it should be built after the abuse controls in this note exist — reputation API key, rate limiting, revocation path and a named human for reports — and released as a small beta, not announced as a free-for-all.

## Decisions needed from the owner

| # | Decision | Options |
|---|---|---|
| 1 | Product shape | public shortener / owner-only redirect manager / nothing |
| 2 | Reputation check | Safe Browsing key supplied by owner / accept blind redirects / no launch |
| 3 | Expiry policy | 30 days / 90 days / permanent with reclaim |
| 4 | Abuse contact | which address receives reports, and who answers it |
| 5 | Short domain | buy one (a `.link` or short ccTLD) or accept long URLs |

Until 1 and 2 are answered, no code should be written. The redirect handler is the easy part; the supervision is the product.

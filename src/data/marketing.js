// Tools4Market — Marketing calculator definitions (build-time data)
import { f, outputBlock, note } from './helpers.js';

// Currency selector — the value is the display symbol the runtime prefixes
// results with, so the labels (user-facing copy) live here, not in the runtime.
const CUR_OPTS = [
  { v: '$', l: 'USD ($)' },
  { v: '€', l: 'EUR (€)' },
  { v: '£', l: 'GBP (£)' },
  { v: '₹', l: 'INR (₹)' },
  { v: 'A$', l: 'AUD (A$)' },
  { v: 'C$', l: 'CAD (C$)' },
  { v: '¥', l: 'JPY (¥)' },
  { v: 'R$', l: 'BRL (R$)' },
];
const cur = (id, label = 'Currency') => f.select(id, label, CUR_OPTS, '$');

export const TOOLS_MARKETING = [
  // ---------------------------------------------------------- ROI calculator
  {
    slug: 'roi-calculator',
    name: 'ROI Calculator',
    cat: 'marketing',
    icon: '📈',
    card: 'Return on investment, net profit and spend multiple from two numbers — private and instant.',
    usedFor: 'for campaign and budget reviews',
    updated: '2026-10-23',
    keywords: 'roi calculator marketing return on investment campaign profit percentage',
    focus: 'roi calculator',
    h1: 'Free ROI Calculator — Measure Marketing Return Instantly',
    metaTitle: 'Free ROI Calculator — Return on Investment Instantly',
    metaDesc: 'Run any campaign through this free ROI calculator — enter revenue and investment to get return on investment, net profit and the spend multiple. No signup.',
    intro: 'Enter what a campaign earned and what it cost into this free ROI calculator to get return on investment, net profit and the spend multiple — with an honest read on what the percentage does and does not tell you.',
    sections: [
      { h: 'How this ROI calculator works', p: ['Return on investment is the oldest number in marketing and still the one budget meetings end on: net profit divided by what you spent, as a percentage. Give this calculator two figures — the revenue the campaign gained and the total investment behind it — and it returns the net profit, the ROI percentage and the spend multiple, which is the same relationship expressed as “how many times the money came back”. A 50% ROI and a 1.5× multiple describe the same campaign; use whichever your audience thinks in.', 'The definition of “investment” is where honest numbers start. Media spend is obvious; creative production, tooling, agency fees and the labour running the campaign belong there too if you track them — a campaign that looks profitable only because half its costs live in another line is not profitable. Pick a currency, enter both sides of the ledger, and the calculator does the arithmetic locally as you type. Both inputs stay editable — rerun the moment a refund, a fee or a late invoice changes one side.'] },
      { h: 'Reading the number honestly', p: ['A percentage without context flatters or scares equally. Marketing ROI benchmarks vary enormously by channel and horizon: brand campaigns rarely show short-window ROI at all, while retargeting can post numbers that look too good precisely because last-click attribution hands it conversions other channels created. Compare like against like — same attribution window, same revenue definition, same period length — before declaring one campaign better than another.', 'ROI also ignores time and risk. A 30% return earned in a week is not the same asset as 30% earned in a year, and a high ROI earned on a tiny budget usually cannot be scaled to the budget that actually matters. Read the percentage as a signal to investigate: which channel, which audience, which offer produced it, and does it survive the next budget tier?'] },
      { h: 'Where the ROI number earns its keep', p: ['The practical uses are concrete. Budget reallocation: when quarterly planning arrives, the ROI ranking of last quarter’s campaigns is the fairest first draft of next quarter’s allocation. Post-mortems: an underperforming campaign’s ROI, split by channel, shows whether the failure was the idea, the audience or the execution. Agency and founder reporting: one percentage with its inputs stated is harder to argue with than a deck of impressions.', 'Keep the neighbours in view. ROAS zooms into the ad-spend layer of the same question, and CAC reframes it per customer rather than per campaign — this site has calculators for both, and the trio together (ROAS for the ads, CAC for unit economics, ROI for the whole ledger) is the standard way to pressure-test a marketing number before it becomes a budget.'] },
    ],
    faqs: [
      { q: 'What is a good ROI for marketing?', a: 'It depends on channel and margin, but many teams treat 5:1 (400% return) as strong for paid marketing and anything below 1:1 as a loss. The honest benchmark is your own alternative use of the same money.' },
      { q: 'How is ROI different from ROAS?', a: 'ROI is profit-based and counts every cost; ROAS divides attributed revenue by ad spend alone. A campaign can show healthy ROAS and thin ROI once creative, tools and fulfilment are counted — this calculator uses the profit view.' },
      { q: 'Can this ROI calculator work from percentages instead of money?', a: 'No — it needs currency amounts on both sides so net profit is real. If you only have a percentage return, convert it back to currency values for the period before calculating.' },
      { q: 'What should I count as the investment?', a: 'Media spend plus every cost that exists because the campaign ran: creative, tools, agency fees and, ideally, labour. Count them consistently across campaigns — consistency matters more than perfection.' },
    ],
    html: `
${cur('roic-cur')}
${f.number('roic-rev', 'Revenue gained from the campaign', '', '0')}
${f.number('roic-inv', 'Total investment (media + creative + tools + labour)', '', '0')}
${outputBlock('roic-out', 'Result')}
<p class="tool-note" id="roic-verdict"></p>
${note('Everything is calculated in your browser; nothing you type leaves this page.')}`,
  },

  // ---------------------------------------------------------- ROAS calculator
  {
    slug: 'roas-calculator',
    name: 'ROAS Calculator',
    cat: 'marketing',
    icon: '💸',
    card: 'Return on ad spend, revenue per dollar and the break-even ROAS your margin requires.',
    usedFor: 'for paid campaign reviews',
    updated: '2026-10-23',
    keywords: 'roas calculator return on ad spend break even margin paid ads revenue',
    focus: 'roas calculator',
    h1: 'Free ROAS Calculator — Return on Ad Spend & Break-Even',
    metaTitle: 'Free ROAS Calculator — Return on Ad Spend, Fast',
    metaDesc: 'This free ROAS calculator turns ad spend and attributed revenue into return on ad spend, revenue per dollar and the break-even point your margin demands.',
    intro: 'Enter ad spend and the revenue your campaign attributed into this free ROAS calculator to read return on ad spend, revenue per dollar spent and the break-even ROAS your margin requires.',
    sections: [
      { h: 'What this ROAS calculator computes', p: ['Return on ad spend is deliberately simple: attributed revenue divided by what you spent on the ads, expressed as a multiple. Four times spend — written 4× — means every unit of currency bought back four in revenue. The calculator shows that ratio, the revenue-per-spend view of the same fact, and one number most ROAS tools skip: your break-even ROAS. Enter your gross margin percentage and the calculator works out the multiple at which the campaign exactly covers the cost of what it sold.', 'The break-even line is what turns a platform metric into a business decision. A 2× ROAS is a triumph for a business with 80% margins and a slow death for one at 20%, because cost of goods eats the revenue before it reaches profit. Same ads, same dashboard, opposite verdicts — the margin is the missing half of the sentence every ad account tells you. A 2× campaign on a 70%-margin product quietly beats a 3× campaign on a 25%-margin one; the multiple alone never settled this argument.'] },
      { h: 'How to use the numbers', p: ['Pull spend and revenue from one source and one window: either the platform’s own attribution or your store’s, but not a mix — platform-reported ROAS runs optimistically because every channel credits itself the same conversion. Match the attribution window too (7-day click, 1-day view, 28-day) before comparing campaigns or periods.', 'Once the ratio and the break-even line sit side by side, the questions answer themselves: which campaigns clear their line with room, which only clear it because of a temporary margin (a sale, a supplier deal), and which should be cut or restructured. Blended account-level ROAS tells you the health of the whole paid program; per-campaign numbers tell you where the next dollar should go.'] },
      { h: 'ROAS mistakes and its limits', p: ['The classic error is treating ROAS as profit. It is a revenue ratio: shipping, returns, discounts, payment fees and overhead are all invisible to it, which is why a 5× campaign can still lose money. Returns-heavy categories should calculate against net revenue, not gross. The second error is comparing across attribution models — a last-click number and a data-driven number are not the same measurement, and mixing them in one table manufactures fake winners.', 'The third is forgetting what ROAS cannot see: assisted conversions, new-customer quality, and the brand searches that bidding on your own name inflates. Use it as the fast daily instrument, then check the full ledger with the ROI Calculator and the per-customer view with the CAC Calculator before anything becomes a budget rule. One habit worth copying: recalculate last month whenever this month closes, so the trend — not one snapshot — drives the call.'] },
    ],
    faqs: [
      { q: 'What is a good ROAS for paid ads?', a: 'Commonly cited floors sit around 2× for e-commerce and higher for search, but margin decides everything: any number below your break-even multiple is a loss. Use this calculator’s break-even line rather than a generic benchmark.' },
      { q: 'How is break-even ROAS calculated?', a: 'One divided by your gross margin as a decimal — a 40% margin gives 2.5×: at that multiple, revenue just replaces the cost of goods plus the ad spend. Enter your margin and the calculator does it for you.' },
      { q: 'Does ROAS include profit?', a: 'No — it compares attributed revenue to ad spend only. Costs outside the ad account never appear, which is exactly why the profit view lives in the ROI Calculator next door.' },
      { q: 'Why is my platform ROAS different from my store’s number?', a: 'Attribution windows, view-through credit, deduplication and self-interested accounting differ between platforms and your own analytics. Pick one source of truth per report and note which one it is.' },
    ],
    html: `
${cur('roasc-cur')}
${f.number('roasc-spend', 'Ad spend for the period', '', '0')}
${f.number('roasc-rev', 'Revenue attributed to the ads', '', '0')}
${f.number('roasc-margin', 'Gross margin % (optional — enables break-even)', '', '0', '100')}
${outputBlock('roasc-out', 'Result')}
<p class="tool-note" id="roasc-verdict"></p>
${note('Everything is calculated in your browser; nothing you type leaves this page.')}`,
  },

  // ---------------------------------------------------------- CAC calculator
  {
    slug: 'cac-calculator',
    name: 'CAC Calculator',
    cat: 'marketing',
    icon: '🧲',
    card: 'Customer acquisition cost from spend and new customers, with the LTV:CAC ratio in context.',
    usedFor: 'for unit-economics reviews',
    updated: '2026-10-23',
    keywords: 'cac calculator customer acquisition cost ltv ratio unit economics sales marketing',
    focus: 'cac calculator',
    h1: 'Free CAC Calculator — Customer Acquisition Cost & LTV Ratio',
    metaTitle: 'Free CAC Calculator — Customer Acquisition Cost',
    metaDesc: 'Use this free CAC calculator to find customer acquisition cost from spend and new customers, then add lifetime value for the LTV:CAC ratio investors expect.',
    intro: 'Enter your sales and marketing spend and the customers it bought into this free CAC calculator to find customer acquisition cost — and add lifetime value to see the LTV:CAC ratio in context.',
    sections: [
      { h: 'What this CAC calculator measures', p: ['Customer acquisition cost is the whole commercial engine’s price per new customer: total sales and marketing spend divided by the customers that spend brought in over the same period. The whole-engine definition matters. Media-only CAC flatters the number by hiding the salaries, tools and agency retainers that made the media work — founders quoting a media CAC to investors eventually meet the real one.', 'Enter the spend, enter the new customers (new only — existing customers did not cost this period’s budget to keep), and the calculator returns CAC. Add lifetime value and it also returns the LTV:CAC ratio with its standard interpretation: under 1× you lose money on every customer, 1–3× is workable but tight, 3–5× is the widely cited healthy band, above 5× often signals under-investment rather than brilliance. If customers arrive in waves, use a rolling quarter rather than a single month before judging the direction.'] },
      { h: 'Using the ratio to make decisions', p: ['The ratio earns its keep in three conversations. Budget: when a channel’s CAC climbs, the ratio against LTV sets the ceiling for what that channel can be allowed to cost before the next dollar is better spent elsewhere. Pricing: a ratio stuck in the 1–2× band is often a pricing problem wearing a marketing costume — small price or margin lifts move the ratio without touching acquisition. Fundraising and planning: acquirers and boards ask for CAC and payback, and a calculator-run number with its inputs stated is the credible version.', 'Use gross-margin-adjusted LTV where you can: a customer worth 2,000 in lifetime revenue at a 30% margin contributes 600, and comparing 600 against CAC is the honest test. Simple LTV — average revenue per user × gross margin % × average customer lifetime months — is a fair first estimate; the calculator takes whatever LTV you trust and does the rest. One period is a data point; a quarter of movement is a decision.'] },
      { h: 'CAC mistakes that quietly inflate or flatter', p: ['Period mismatches lead the list: spend in March, customers from March’s campaigns arriving in April. Align the window or compare rolling periods — never one month of cost against one month of lagged signups. Counting trials, deposits or free accounts as customers is next; only count what your definition of a customer says, and state the definition.', 'Then the structural ones. Blended CAC hides channel truth — a stable blended number can mask one channel deteriorating while a cheap brand-search channel props it up, so read paid CAC separately. Launch spikes and seasonal dips distort short windows; cohort views correct them. And retention never appears here: CAC bought the customer, but churn decides whether the LTV side of the ratio was real.'] },
    ],
    faqs: [
      { q: 'What is a good customer acquisition cost?', a: 'There is no universal figure — CAC is only meaningful against the value of the customer it bought. The 3:1 LTV:CAC band is the common rule of thumb; below 1× you lose money per customer on paper. Add lifetime value in this calculator to see which side of the band you sit on.' },
      { q: 'How is CAC different from CPA?', a: 'CPA is campaign-level: the cost of one conversion (a signup, a sale) inside an ad account. CAC is company-level: total sales and marketing spend per new customer, including everything outside the ad platforms.' },
      { q: 'What lifetime value should I use for the ratio?', a: 'Gross-margin-adjusted LTV is the honest choice: average revenue per user × gross margin % × average lifetime. Revenue-only LTV inflates the ratio and hides fulfilment costs — this calculator takes whichever figure you trust and does the arithmetic.' },
      { q: 'Why does CAC rise as I spend more?', a: 'Every channel has cheap headroom first; scaling reaches progressively colder audiences, so marginal CAC climbs even when the blended average looks calm. Watch the direction per channel, not just the single number.' },
    ],
    html: `
${cur('cacc-cur')}
${f.number('cacc-spend', 'Total sales & marketing spend for the period', '', '0')}
${f.number('cacc-cust', 'New customers acquired in the period', '', '0')}
${f.number('cacc-ltv', 'Lifetime value per customer (optional — enables the ratio)', '', '0')}
${outputBlock('cacc-out', 'Result')}
<p class="tool-note" id="cacc-verdict"></p>
${note('Everything is calculated in your browser; nothing you type leaves this page.')}`,
  },

  // ---------------------------------------------------------- ad metrics calculator
  {
    slug: 'ad-metrics-calculator',
    name: 'CPC, CPM & CPA Calculator',
    cat: 'marketing',
    icon: '📊',
    card: 'Cost per click, cost per thousand, click-through rate and cost per conversion in one table.',
    usedFor: 'for channel and campaign comparisons',
    updated: '2026-10-23',
    keywords: 'cpc calculator cpm calculator cpa calculator ctr cost per click thousand impressions',
    focus: 'cpc cpm cpa calculator',
    h1: 'Free CPC, CPM & CPA Calculator — Ad Metrics',
    metaTitle: 'Free CPC, CPM & CPA Calculator — Ad Rates',
    metaDesc: 'Enter spend, impressions, clicks and conversions into this free CPC, CPM and CPA calculator for cost per click, per thousand impressions and per acquisition.',
    intro: 'Feed any campaign’s spend, impressions, clicks and conversions into this free CPC, CPM and CPA calculator to read cost per click, cost per thousand impressions, click-through rate and cost per acquisition in one table.',
    sections: [
      { h: 'The four rates this calculator reads', p: ['Every ad-platform report is built from the same small set of ratios, and this calculator computes the four that matter from the four numbers you already have. CPC — cost per click — is spend divided by clicks: the price of one visit. CPM — cost per mille — is spend divided by impressions, times a thousand: the price of being seen. CTR — click-through rate — is clicks divided by impressions, the percentage of views that became visits. CPA — cost per acquisition — is spend divided by conversions: the price of the action you actually wanted.', 'Fill in whatever the campaign has. Impressions and clicks give you CPC, CPM and CTR; add conversions and the CPA line appears too. Lines whose inputs are missing stay out of the table rather than guessing, so a display campaign with no conversion tracking still gives its three honest rates, and a search campaign with everything tracked gets the full set in one view.'] },
      { h: 'How to use the rates across platforms', p: ['The practical move is export-and-compare: pull spend, impressions, clicks and conversions from Google Ads, Meta, TikTok or LinkedIn for the same period, run each campaign through the calculator, and put the rates side by side in one currency and one window. Account-level totals blend everything, which is useful for trend lines but hides which campaign is carrying the account — per-campaign runs are where the decisions are.', 'Interpret the comparisons with their context attached. A 0.40 CPC is excellent in one industry and alarming in another; CPM varies with placement (feed, story, search, display) and season (Q4 auctions inflate everything); CTR benchmarks differ by format by an order of magnitude. The rates tell you what traffic cost — they never tell you what it was worth. That half of the answer comes from ROAS and ROI on the same window.'] },
      { h: 'What the rates do not say', p: ['Cheap traffic can be worthless traffic. A campaign with the account’s lowest CPC and near-zero conversions is not efficient — it bought clicks that never intended to buy, and its real CPA is infinite because it produced no acquisitions at all. That is why the calculator keeps CTR and CPA beside CPC instead of letting the cheapest-looking number win the meeting.', 'The blind spots are the standard ones: view-through conversions credited to impressions, attribution windows that differ between exports, bots and accidental clicks inflating volume, and seasonality bending any short comparison. Use these rates as the fast instruments on the dashboard — cheap, instant, local — then let conversion value, CAC and the full ledger decide where the next budget goes. Cheap is only ever half the sentence.'] },
    ],
    faqs: [
      { q: 'What is a good CPC or CPM?', a: 'No universal number exists — both depend on industry, placement and auction seasonality. Compare against your own history and the conversion value behind the clicks; a cheap rate on traffic that never converts is the most expensive kind.' },
      { q: 'How is CPM different from CPC?', a: 'CPM prices being seen: cost per thousand impressions. CPC prices acting: cost per click. Click-through rate is the bridge between them — the same traffic can be cheap per view and expensive per visit if few people click.' },
      { q: 'What if a campaign has no conversions yet?', a: 'This calculator keeps the CPA line out of the table rather than guessing. Early on, read CPC and CTR as directional signals; wait for meaningful conversion volume before trusting any cost-per-acquisition figure.' },
      { q: 'Is this CPA the same as customer acquisition cost?', a: 'No — this CPA is one campaign’s cost per conversion. Customer acquisition cost counts total sales and marketing spend per new customer across every channel; the CAC Calculator handles that company-level view.' },
    ],
    html: `
${cur('amc-cur')}
${f.number('amc-spend', 'Ad spend for the period', '', '0')}
${f.number('amc-imp', 'Impressions', '', '0')}
${f.number('amc-clicks', 'Clicks', '', '0')}
${f.number('amc-conv', 'Conversions (optional — enables CPA)', '', '0')}
${outputBlock('amc-out', 'Result')}
<p class="tool-note" id="amc-verdict"></p>
${note('Everything is calculated in your browser; nothing you type leaves this page.')}`,
  },
];

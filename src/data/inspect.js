// Tools4Market — data for the "analyze your own page" engine + the two
// crawler/ranking tools. All user-facing strings live here (rules.md §3).
// Everything is JSON-serializable ({n} templates, no functions) so build.mjs can
// emit it verbatim to dist/assets/inspect-strings.js as window.T4M_ISTR for the
// classic (non-module) runtime to read.

export const INSPECT_TEXT = {
  panel: {
    title: 'Analyze your own page first',
    subtitle: 'Optional — but it turns generic output into a fix for your actual page.',
    urlLabel: 'Your page URL',
    urlPlaceholder: 'https://your-site.com/your-page',
    analyzeBtn: 'Analyze my page',
    analyzing: 'Fetching and analyzing your page…',
    orPaste: 'Fetch blocked, or the page is private? Paste the HTML instead.',
    pasteLabel: 'Paste the page HTML (View Source → copy → paste)',
    pastePlaceholder: '<!DOCTYPE html>\n<html lang="en">\n<head>…</head>\n<body>…</body>\n</html>',
    pasteBtn: 'Analyze pasted HTML',
    clearBtn: 'Clear analysis',
    signals: 'Read {n} on-page signals from',
    cleared: 'Analysis cleared.',
  },
  errors: {
    badUrl: 'Enter a full URL, e.g. https://your-site.com/page',
    fetchFailed: 'Could not retrieve a successful HTML page. Check the URL and page access, or paste the HTML instead: View Source → copy → paste.',
    emptyPaste: 'Paste the page HTML first.',
  },
  // Per-signal verdicts. {n} = measured number, {v} = a value. Runtime picks
  // pass / warn / fail based on the measurement and does {n}/{v} replacement.
  verdicts: {
    title: {
      pass: 'Title is {n} characters — inside Google\u2019s ~60-character window.',
      warn: 'Title is {n} characters — Google may truncate it. Aim for 30\u201360.',
      fail: 'Title is {n} characters — {detail}. Aim for 30\u201360.',
    },
    desc: {
      pass: 'Meta description is {n} characters — within the ~158-character snippet.',
      warn: 'Meta description is {n} characters — it may be cut off. Aim for 120\u2013158.',
      fail: 'Meta description is {n} characters — {detail}. Aim for 120\u2013158.',
    },
    h1: {
      pass: 'Exactly one H1 on the page.',
      warn: '{n} H1s found — search engines prefer a single, clear H1.',
      fail: 'No H1 found — add one descriptive H1 for the page\u2019s main topic.',
    },
    canonical: {
      pass: 'Canonical tag present.',
      fail: 'No canonical tag — add one to prevent duplicate-URL confusion.',
    },
    og: {
      pass: 'Open Graph tags present (rich social previews).',
      fail: 'No og:title / og:description — add Open Graph tags so shares look good.',
    },
    robots: {
      fail: 'Page is marked noindex — search engines are told NOT to index it.',
      pass: 'Page is indexable (no noindex directive).',
    },
    images: {
      pass: 'All {n} images have alt text.',
      warn: '{m} of {n} images are missing alt text.',
    },
    lang: {
      pass: 'lang attribute set on <html> ({v}).',
      fail: 'No lang attribute on <html> — add it for accessibility and SEO.',
    },
    viewport: {
      pass: 'Mobile viewport meta present.',
      fail: 'No viewport meta — the page will render badly on phones.',
    },
    words: {
      info: 'About {n} words of main content. This is context only; Google has no minimum word count. Check that the page answers its purpose.',
    },
  },
};

// Web Crawler / SEO audit tool — the crawlability & indexability checks.
// id → weight is structural; label/advice are user-facing strings.
export const AUDIT = {
  toolTitle: 'Web Crawler Audit',
  introShort: 'See your page exactly as Googlebot and AI crawlers see it — then fix what\u2019s blocking you.',
  verdicts: {
    pass: 'PASS',
    warn: 'WARN',
    fail: 'ISSUE',
    none: 'INFO',
  },
  checks: [
    { id: 'fetch', label: 'Page reachable over HTTP(S)', weight: 0,
      pass: 'Crawlers can reach this page ({status} in {ms}ms, {bytes} bytes).',
      fail: 'Crawlers could not fetch this page: {detail}' },
    { id: 'https', label: 'Served over HTTPS', weight: 10,
      pass: 'Page is served over HTTPS.',
      fail: 'Page is not HTTPS — Google treats HTTPS as a ranking signal. Enable SSL.' },
    { id: 'robots', label: 'Indexable (meta robots)', weight: 20,
      pass: 'Page is indexable — no noindex directive.',
      fail: 'Page has <meta name="robots" content="{v}"> — search engines are told not to index it. Remove noindex if this page should rank.' },
    { id: 'canonical', label: 'Canonical tag', weight: 15,
      pass: 'Canonical tag present: {v}',
      warn: 'Canonical points off-page to {v}. That is fine only if intentional.',
      fail: 'No canonical tag — add <link rel="canonical"> to control duplicate URLs.' },
    { id: 'title', label: 'Title tag', weight: 15,
      pass: 'Title tag present ({n} chars): {v}',
      warn: 'Title present but {n} characters — may be truncated. Aim for 30\u201360.',
      fail: 'No <title> tag — every ranking page needs a unique 30\u201360 character title.' },
    { id: 'desc', label: 'Meta description', weight: 10,
      pass: 'Meta description present ({n} chars).',
      warn: 'Meta description is {n} characters — aim for 120\u2013158 for a full snippet.',
      fail: 'No meta description — you are leaving the Google snippet to chance.' },
    { id: 'h1', label: 'Single H1 heading', weight: 10,
      pass: 'Exactly one H1: {v}',
      warn: '{n} H1 tags — search engines prefer one clear H1.',
      fail: 'No H1 tag — add one descriptive H1.' },
    { id: 'sitemap', label: 'Sitemap declared in robots.txt', weight: 5,
      pass: 'robots.txt declares a sitemap ({v}).',
      fail: 'No Sitemap line in robots.txt — point crawlers to your sitemap.' },
    { id: 'hreflang', label: 'Hreflang (multi-language)', weight: 0,
      none: 'No hreflang tags (normal for single-language sites).',
      pass: '{n} hreflang annotations present.' },
    { id: 'schema', label: 'Structured data (JSON-LD)', weight: 10,
      pass: 'Structured data present: {v}',
      fail: 'No JSON-LD structured data — add it to win rich results.' },
    { id: 'og', label: 'Open Graph tags', weight: 5,
      pass: 'Open Graph tags present.',
      fail: 'No Open Graph tags — social shares will look bare.' },
    { id: 'imgalt', label: 'Image alt text', weight: 5,
      pass: 'All {n} images have alt text.',
      warn: '{m} of {n} images are missing alt text.' },
  ],
  summary: {
    title: 'Crawler verdict',
    scoreLine: 'Crawl-health: {s}/100',
    great: 'This page is crawler-friendly. Nothing blocking indexation.',
    good: 'Mostly crawler-friendly, but a few items need attention (below).',
    poor: 'Crawlers will struggle with this page. Fix the ISSUES below first.',
  },
  fixHeader: 'Prioritized fixes',
  empty: 'Analyze a page above to see how crawlers see it.',
};

// SEO Ranking / Score tool — weighted on-page factors producing a 0–100 score + grade.
export const SCORE = {
  verdicts: {
    pass: 'pass',
    warn: 'warn',
    fail: 'fail',
  },
  factors: [
    { id: 'title', label: 'Title tag', weight: 15,
      pass: 'Title present and {n} characters.',
      warn: 'Title is {n} characters — fine, but could be sharper (30\u201360).',
      fail: 'Title missing or {n} characters — add a 30\u201360 char keyword-led title.' },
    { id: 'desc', label: 'Meta description', weight: 12,
      pass: 'Description present, {n} characters.',
      warn: 'Description is {n} characters — aim for 120\u2013158.',
      fail: 'No meta description — write one to control your snippet.' },
    { id: 'h1', label: 'H1 heading', weight: 12,
      pass: 'Single H1 present.',
      warn: '{n} H1s — consolidate to one.',
      fail: 'No H1 — add a single keyword-led H1.' },
    { id: 'headings', label: 'Heading hierarchy (H2/H3)', weight: 8,
      pass: '{n} H2/H3 subheadings structure the content.',
      warn: 'Few subheadings ({n}) — break long content into H2/H3 sections.',
      fail: 'No H2/H3 subheadings — add structure for readers and crawlers.' },
    { id: 'words', label: 'Content depth', weight: 0,
      info: 'About {n} words of main content. Word count is context, not a ranking threshold; make sure the page answers its purpose.' },
    { id: 'links', label: 'Internal links', weight: 10,
      pass: '{n} internal links help crawlers discover your site.',
      warn: 'Only {n} internal links — link to related pages.',
      fail: 'No internal links found — add links to related pages.' },
    { id: 'imgalt', label: 'Image alt text', weight: 8,
      pass: 'All {n} images have alt text.',
      warn: '{m} of {n} images missing alt text.',
      none: 'No content images; alt text is not applicable.' },
    { id: 'schema', label: 'Structured data', weight: 8,
      pass: 'JSON-LD structured data present: {v}',
      fail: 'No structured data — add JSON-LD to qualify for rich results.' },
    { id: 'og', label: 'Open Graph / social', weight: 5,
      pass: 'Open Graph tags present.',
      fail: 'No Open Graph tags — add them for better social shares.' },
    { id: 'viewport', label: 'Mobile viewport', weight: 5,
      pass: 'Mobile viewport meta present.',
      fail: 'No viewport meta — page is not mobile-friendly.' },
    { id: 'https', label: 'HTTPS', weight: 5,
      pass: 'Served over HTTPS.',
      fail: 'Not HTTPS — enable SSL.' },
  ],
  grades: [
    { min: 90, letter: 'A', note: 'Excellent — this page is in great shape.' },
    { min: 75, letter: 'B', note: 'Good — a few quick wins left.' },
    { min: 60, letter: 'C', note: 'Average — several factors need work.' },
    { min: 40, letter: 'D', note: 'Weak — many on-page signals are missing.' },
    { min: 0, letter: 'F', note: 'Poor — fix the basics before expecting to rank.' },
  ],
  summary: {
    scoreLine: 'On-page SEO score',
    fixHeader: 'Biggest improvements (highest impact first)',
    empty: 'Analyze a page above to score its on-page SEO.',
  },
};

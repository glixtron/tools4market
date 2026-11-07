// audit/score.mjs — turn findings into a number that can be compared over time.
//
// The score exists for one reason: a diff between two runs. An absolute score on
// a 44-page site is arbitrary; "this deploy took 12 points off the guide
// template" is actionable.

export function score({ pages, findings, catalog }) {
  const weights = catalog.severityWeights;
  const byPage = new Map();

  for (const p of pages) byPage.set(p.path, { path: p.path, url: p.url, score: 100, counts: { blocker: 0, major: 0, minor: 0, info: 0 }, findings: [] });

  for (const f of findings) {
    const entry = byPage.get(f.page);
    if (!entry) continue;
    entry.counts[f.severity] = (entry.counts[f.severity] || 0) + 1;
    entry.findings.push(f);
    entry.score -= weights[f.severity] || 0;
  }

  const pageScores = [...byPage.values()].map((p) => ({ ...p, score: Math.max(0, p.score) }));

  const totals = findings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, { blocker: 0, major: 0, minor: 0, info: 0 });

  // One decimal, and 100 is reserved for a run with no findings at all. Rounding
  // 7 majors across 80 pages to "100/100" is the sort of number that makes an
  // audit untrustworthy: it reads as a clean bill of health next to a finding list.
  // Findings that belong to no crawled page (a missing sitemap, a missing
  // robots.txt) still carry a weight. Deducting nothing for them produced a
  // 99.9 next to a "Major" finding, which contradicts the note that spells the
  // weights out. They now cost what the checklist says they cost.
  let sitePenalty = 0;
  for (const f of findings) if (!byPage.has(f.page)) sitePenalty += weights[f.severity] || 0;

  const penalty = pageScores.reduce((sum, p) => sum + (100 - p.score), 0);
  const base = pages.length ? Math.max(0, 100 - penalty / pages.length) : 100;
  const raw = Math.max(0, base - sitePenalty);
  const anyFinding = findings.some((f) => (weights[f.severity] || 0) > 0);
  const siteScore = anyFinding ? Math.min(99.9, Math.round(raw * 10) / 10) : 100;

  const byGroup = {};
  for (const p of pageScores) {
    const g = p.path === '/' ? 'home' : p.path.startsWith('/tools/') ? 'tools' : p.path.startsWith('/blog/') && p.path !== '/blog/' ? 'blog' : 'pages';
    if (!byGroup[g]) byGroup[g] = { pages: 0, score: 0, blocker: 0, major: 0, minor: 0 };
    byGroup[g].pages++;
    byGroup[g].score += p.score;
    byGroup[g].blocker += p.counts.blocker;
    byGroup[g].major += p.counts.major;
    byGroup[g].minor += p.counts.minor;
  }
  for (const g of Object.keys(byGroup)) byGroup[g].score = Math.round(byGroup[g].score / byGroup[g].pages);

  return { site: { score: siteScore, pages: pages.length, totals }, pages: pageScores, byGroup };
}

// audit/cross.mjs — findings that need more than one page.
//
// These are the checks that catch the failures a per-page rule cannot see:
// a sitemap entry nothing links to, a tool in the catalogue that was never
// published, two pages fighting for the same title.

const ASSET_RE = /^\/(assets|fonts)\//;

/** Normalise a URL to the form the sitemap uses: apex host, trailing slash. */
export function normalise(u) {
  try {
    const url = new URL(u);
    let p = url.pathname;
    if (!/\.[a-z0-9]{2,5}$/i.test(p) && !p.endsWith('/')) p += '/';
    return url.origin + p;
  } catch {
    return null;
  }
}

const slugFrom = (u, prefix) => {
  const m = new RegExp(`^/${prefix}/([a-z0-9-]+)/?$`).exec(new URL(u).pathname);
  return m ? m[1] : null;
};

export function runCross({ pages, site, catalog }) {
  const findings = [];
  const add = (f) => findings.push({ page: f.page || '(site)', ...f });

  // ---- 0. is the thing being audited the thing that was built? -----------
  // A dist audit is a claim about source that has been built. If dist predates
  // the source, every finding below is about a build nobody is serving — and the
  // report will look authoritative while being a week out of date.
  if (site.dist && site.dist.stale) {
    const age = (ms) => {
      const h = (Date.now() - ms) / 36e5;
      return h < 1 ? `${Math.round(h * 60)} min` : h < 48 ? `${Math.round(h)} h` : `${Math.round(h / 24)} d`;
    };
    add({
      id: 'dist-stale',
      severity: 'blocker',
      group: 'cross',
      page: '(site)',
      message: site.dist.exists
        ? `dist/ was built ${age(site.dist.builtAt)} ago but source changed ${age(site.dist.newestSource)} ago`
        : 'dist/ has never been built',
      fix: site.dist.exists
        ? 'This report describes an old build, not the site. Run `npm run build` first — and if this checkout was just pulled, rebuild before reading any finding here.'
        : 'Run `npm run build` (it needs the environment for ads: `set -a && source .env && set +a`).',
      evidence: site.dist,
    });
  }

  const sitemapSet = new Set(site.urls.map(normalise).filter(Boolean));
  const byUrl = new Map(pages.map((p) => [normalise(p.url), p]));

  // ---- 1. broken internal links -------------------------------------------
  const broken = new Map();
  for (const p of pages) {
    for (const l of p.links) {
      if (!l.internal || !l.absolute) continue;
      const abs = normalise(l.absolute);
      if (!abs) continue;
      const path = new URL(abs).pathname;
      if (ASSET_RE.test(path)) continue;
      if (/^\/(api|sitemap|robots|feed|llms)/.test(path)) continue;
      if (sitemapSet.has(abs) || byUrl.has(abs)) continue;
      // A dist audit can answer from the filesystem: noindexed legal pages and
      // copied static files are real targets even though no sitemap lists them.
      if (site.distPaths && site.distPaths.has(path)) continue;
      if (!broken.has(abs)) broken.set(abs, new Map());
      const sources = broken.get(abs);
      if (!sources.has(p.url)) sources.set(p.url, l.text || '(no text)');
    }
  }
  for (const [target, sources] of broken) {
    add({
      id: 'broken-internal',
      severity: 'blocker',
      group: 'cross',
      page: [...sources.keys()][0],
      message: `Internal link to ${target} does not resolve (${sources.size} page(s) link it)`,
      fix: 'Either the target is missing from the build, or the link is stale. Check the slug against src/data; a renamed tool leaves links behind in guides and category pages.',
      evidence: { target, linkedFrom: [...sources.keys()].slice(0, 5) },
    });
  }

  // ---- 2. inbound links / orphans ----------------------------------------
  const inbound = new Map();
  for (const p of pages) {
    for (const l of p.links) {
      if (!l.internal || !l.absolute) continue;
      const abs = normalise(l.absolute);
      if (!abs) continue;
      if (abs === normalise(p.url)) continue;
      if (!inbound.has(abs)) inbound.set(abs, new Set());
      inbound.get(abs).add(normalise(p.url));
    }
  }
  for (const p of pages) {
    const key = normalise(p.url);
    const from = inbound.get(key) || new Set();
    if (from.size === 0) {
      add({
        id: 'orphan-page',
        severity: 'major',
        group: 'cross',
        page: p.path,
        message: 'No inbound internal links from any other page',
        fix: 'An orphan is only discoverable through the sitemap. Link it from its category page or from a guide it belongs to; sitemap-only discoverability is weaker than a link.',
      });
    }
  }

  // ---- 3. catalogue ↔ sitemap --------------------------------------------
  const sitemapTools = new Set(site.urls.map((u) => slugFrom(u, 'tools')).filter(Boolean));
  const sitemapGuides = new Set(site.urls.map((u) => slugFrom(u, 'blog')).filter(Boolean));

  for (const t of catalog.tools) {
    if (!sitemapTools.has(t.slug)) {
      add({
        id: 'tool-missing-from-sitemap',
        severity: 'blocker',
        group: 'catalogue',
        page: `/tools/${t.slug}/`,
        message: `Tool "${t.name}" exists in src/data but is not in sitemap-tools.xml`,
        fix: 'A published tool that is not in the sitemap is discoverable only by links. Check the sitemap generation in build.mjs and whether the slug is filtered there.',
      });
    }
  }
  for (const slug of sitemapTools) {
    if (!catalog.tools.some((t) => t.slug === slug)) {
      add({
        id: 'sitemap-lists-unknown-tool',
        severity: 'blocker',
        group: 'catalogue',
        page: `/tools/${slug}/`,
        message: `Sitemap lists tool "${slug}" which does not exist in src/data`,
        fix: 'Either the tool was removed and the sitemap was not, or the slug was renamed. A sitemap entry that 404s is the most expensive kind of error.',
      });
    }
  }
  for (const a of catalog.articles) {
    if (!sitemapGuides.has(a.slug)) {
      add({
        id: 'guide-missing-from-sitemap',
        severity: 'blocker',
        group: 'catalogue',
        page: `/blog/${a.slug}/`,
        message: `Guide "${a.slug}" exists in src/data but is not in sitemap-blog.xml`,
        fix: 'Check the ARTICLES filter in build.mjs — a malformed entry can be skipped silently by `filter()`.',
      });
    }
  }
  for (const slug of sitemapGuides) {
    if (!catalog.articles.some((a) => a.slug === slug)) {
      add({
        id: 'sitemap-lists-unknown-guide',
        severity: 'blocker',
        group: 'catalogue',
        page: `/blog/${slug}/`,
        message: `Sitemap lists guide "${slug}" which does not exist in ARTICLES`,
        fix: 'Remove the entry or restore the article. Sitemaps must not list URLs that 404.',
      });
    }
  }

  // ---- 4. related slugs resolve ------------------------------------------
  for (const a of catalog.articles) {
    for (const slug of a.relatedTools || []) {
      if (!catalog.tools.some((t) => t.slug === slug)) {
        add({
          id: 'related-slug-unresolved',
          severity: 'major',
          group: 'catalogue',
          page: `/blog/${a.slug}/`,
          message: `relatedTools references "${slug}", which is not in TOOLS`,
          fix: 'A missing related slug is dropped at render, so the guide quietly links fewer tools than the data says. Fix the slug in src/data/blog.js.',
        });
      }
    }
  }

  // ---- 5. duplicates across pages ---------------------------------------
  const dupes = (keyFn, id, label) => {
    const map = new Map();
    for (const p of pages) {
      const v = keyFn(p);
      if (!v) continue;
      if (!map.has(v)) map.set(v, []);
      map.get(v).push(p.path);
    }
    for (const [v, list] of map) {
      if (list.length < 2) continue;
      add({
        id,
        severity: 'major',
        group: 'cross',
        page: list[0],
        message: `${label} shared by ${list.length} pages: ${list.join(', ')}`,
        fix: 'Two pages competing for the same query split the signal and usually means Google picks the wrong one. Write one of them again for a different job.',
        evidence: { value: v.slice(0, 120) },
      });
    }
  };
  dupes((p) => p.title, 'duplicate-title', 'Title');
  dupes((p) => p.description, 'duplicate-description', 'Meta description');
  dupes((p) => p.h1.map((h) => h.text).join(' | '), 'duplicate-h1', 'H1');

  // ---- 6. sitemap hygiene ------------------------------------------------
  for (const s of site.sitemaps) {
    const lastmods = [...String(s.body || '').matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    if (!s.locs.length) {
      add({
        id: 'sitemap-empty',
        severity: 'blocker',
        group: 'cross',
        page: s.url,
        message: `Sitemap ${s.url} lists no URLs`,
        fix: 'An empty sitemap tells Google the section no longer exists. Check the filter that builds it.',
      });
    } else if (!lastmods.length) {
      add({
        id: 'sitemap-lastmod-missing',
        severity: 'minor',
        group: 'cross',
        page: s.url,
        message: `${s.url} has no <lastmod>`,
        fix: 'lastmod is the one sitemap hint Google says it uses. Emit the content date, not the build date, or omit it everywhere — a build-date lastmod trains Google to ignore the field.',
      });
    }
  }

  // ---- 7. sitemap index completeness ------------------------------------
  const indexLocs = new Set((site.index.locs || []).map(normalise).filter(Boolean));
  for (const s of site.sitemaps) {
    if (site.sitemaps.length > 1 && !indexLocs.has(normalise(s.url))) {
      add({
        id: 'sitemap-index-incomplete',
        severity: 'major',
        group: 'cross',
        page: site.index.url,
        message: `Sitemap ${s.url} is not listed in the index`,
        fix: 'A sitemap that nothing references is only found by guessing its name. Add it to the index in build.mjs.',
      });
    }
  }

  return findings;
}

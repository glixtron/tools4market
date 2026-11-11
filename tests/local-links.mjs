// Tools4Market — offline internal-link check.
//
//   node build.mjs
//   node tests/local-links.mjs
//
// The live audit catches a broken internal link only after it is deployed and
// only if it crawls the page that carries it. This walks the built HTML and
// resolves every internal href/src against dist/, so a link to a page that was
// never generated fails before the upload.
//
// It was written after the homepage advertised /blog/website-audit/ — a guide
// that does not exist. The Website Audit *tool* was misclassified as an article
// and linked under /blog/, and only the live audit noticed, a deploy later.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = path.join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

/** Resolve every internal href/src in dist/*.html to a file that exists. */
export function checkLocalLinks() {
  const pages = walk(DIST).filter((f) => f.endsWith('.html'));
  const broken = [];
  let links = 0;

  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    // href/src, but not the ones that cannot resolve to a file in dist.
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const raw = m[1];
      if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
      if (/^(https?:)?\/\//i.test(raw)) {
        // same-origin absolute URLs are internal; anything else is out of scope.
        if (!/^https?:\/\/tools4market\.online\//i.test(raw)) continue;
      }
      const u = new URL(raw, 'https://tools4market.online/' + path.relative(DIST, file).replace(/index\.html$/, ''));
      if (u.host !== 'tools4market.online') continue;
      if (u.pathname.startsWith('/api/')) continue; // routes, not files

      links++;
      // Resolve the way the asset layer does: a slashed path is a directory with
      // an index.html; a path with an extension is a file.
      const rel = decodeURIComponent(u.pathname);
      const candidates = [
        path.join(DIST, rel),
        path.join(DIST, rel, 'index.html'),
        path.join(DIST, rel.replace(/\/$/, '') + '.html'),
      ];
      const target = candidates.find((c) => existsSync(c) && statSync(c).isFile());
      if (!target) {
        broken.push(`${path.relative(DIST, file)} → ${rel}`);
        continue;
      }
      // A fragment is a promise about the destination page. Checking only the
      // file would let /blog/slug/#renamed-heading pass while landing the
      // reader at the top of the page with no explanation.
      if (u.hash && target.endsWith('.html')) {
        const id = decodeURIComponent(u.hash.slice(1));
        if (id && !new RegExp(`(?:id|name)="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(readFileSync(target, 'utf8'))) {
          broken.push(`${path.relative(DIST, file)} → ${rel}#${id} (no such id)`);
        }
      }
    }
  }
  return { broken, links, pages: pages.length };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const { broken, links, pages } = checkLocalLinks();
  if (broken.length) {
    console.log(`LOCAL LINKS: ${broken.length} broken of ${links} internal links`);
    for (const b of broken.slice(0, 30)) console.log('  ✗ ' + b);
    process.exit(1);
  }
  console.log(`LOCAL LINKS: ${links} internal links resolve across ${pages} pages`);
}

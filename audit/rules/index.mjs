// audit/rules/index.mjs — the rule set, in one list.
//
// A rule is a pure function of a parsed page plus the site context. It returns
// null or a finding body. Nothing here touches the network or the filesystem, so
// every rule can be exercised against a fixture page in milliseconds.

import { rules as technical } from './technical.mjs';
import { rules as onpage } from './onpage.mjs';
import { rules as schema } from './schema.mjs';
import { rules as content } from './content.mjs';
import { rules as assets } from './assets.mjs';
import { rules as links } from './links.mjs';
import { rules as brand } from './brand.mjs';

export const rules = [...technical, ...onpage, ...schema, ...content, ...assets, ...links, ...brand];

/** Which template a path belongs to. `/blog/` itself is an index page. */
export function groupOfPath(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/tools/')) return 'tools';
  if (pathname.startsWith('/blog/') && pathname !== '/blog/') return 'blog';
  return 'pages';
}

// RFC 9309 subset used by the AI-crawler study: case-insensitive user-agent
// matching, longest-path rule wins, Allow wins ties, * and $ wildcards.
// Kept separate from the collector so the parsing rules can be tested directly.

export const normalise = (s) => s.trim().toLowerCase();

export function parseRobots(text) {
  const groups = new Map(); // agent token -> rules[]
  let current = null;
  let lastWasAgent = false;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = normalise(line.slice(0, idx));
    const value = line.slice(idx + 1).trim();

    if (field === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = [];
        lastWasAgent = true;
      }
      const agent = normalise(value);
      if (!groups.has(agent)) groups.set(agent, current);
      else current = groups.get(agent);
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (field === 'allow' || field === 'disallow') {
      if (value === '') continue; // "Disallow:" with no path means allow all
      current.push({ allow: field === 'allow', path: value });
    }
  }
  return groups;
}

const ruleToRegex = (path) => {
  const escaped = path.replace(/[.+^${}()|[\]\\?]/g, '\\$&').replace(/\*/g, '.*');
  const anchored = escaped.endsWith('$') ? '^' + escaped.slice(0, -1) + '$' : '^' + escaped;
  return new RegExp(anchored);
};

function rulesFor(groups, botToken) {
  const token = normalise(String(botToken).replace(/\s*\/.*$/, ''));
  const specific = [];
  let matched = false;
  for (const [agent, rules] of groups) {
    if (agent === '*') continue;
    // A group names a product token; apply it when the crawler's token starts
    // with it (Googlebot-News etc. follow the longer, more specific group).
    if (token === agent || token.startsWith(agent)) {
      matched = true;
      specific.push(...rules);
    }
  }
  if (matched) return specific;
  for (const [agent, rules] of groups) if (agent === '*') specific.push(...rules);
  return specific;
}

export function verdictFor(groups, botToken, urlPath = '/') {
  let best = null;
  for (const r of rulesFor(groups, botToken)) {
    if (!ruleToRegex(r.path).test(urlPath)) continue;
    const len = r.path.length;
    if (!best || len > best.len || (len === best.len && r.allow)) best = { allow: r.allow, len };
  }
  // No rule matches the path: crawlers are allowed by default.
  return best && !best.allow ? 'blocked' : 'allowed';
}

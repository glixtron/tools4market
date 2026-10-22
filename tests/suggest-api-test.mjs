// Regression coverage for POST /api/suggest — the AI fix-suggestion backend.
// Runs the real handler with a mock Workers AI binding, so validation does not
// need a deploy: contract, guards, prompt shape, output cleaning, degradation.
//   node tests/suggest-api-test.mjs
import { handleSuggest } from '../functions/api/suggest.js';

const ORIGIN = 'https://tools4market.online';
let pass = 0, fail = 0;
const issues = [];
const ok = (name, cond, detail = '') => {
  if (cond) pass++;
  else { fail++; issues.push(name + (detail ? ' — ' + detail : '')); }
};

// Mock env.AI: records the last run, echoes a scripted response.
function mockEnv(responseText, opts = {}) {
  const calls = [];
  const env = {
    AI: {
      run(model, input) {
        calls.push({ model, input });
        if (opts.rejectWith) return Promise.reject(new Error(opts.rejectWith));
        return Promise.resolve(responseText === undefined ? {} : { response: responseText });
      },
    },
    calls,
  };
  if (opts.model) env.AI_MODEL = opts.model;
  return env;
}

const post = (body, headers = {}) => new Request(ORIGIN + '/api/suggest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});

const VALID = {
  tool: 'meta-description-checker',
  kind: 'description',
  issue: 'No meta description on this page.',
  page: { url: 'https://example.test/page/', title: 'Example', h1: 'Example H1', description: '', text: 'Opening copy of the page. '.repeat(10) },
};

async function main() {
  // 1. happy path: drafts, cleans, and reports the model used
  {
    const env = mockEnv('  "A drafted description for the page."  ');
    const res = await handleSuggest(post(VALID), env);
    const j = await res.json();
    ok('suggest: happy path returns 200 + ok', res.status === 200 && j.ok === true);
    ok('suggest: suggestion has wrapping quotes stripped', j.suggestion === 'A drafted description for the page.', JSON.stringify(j.suggestion));
    ok('suggest: reports the model id', typeof j.model === 'string' && j.model.includes('llama'));
    const call = env.calls[0];
    ok('suggest: model receives system+user messages', call.input.messages.length === 2 && call.input.messages[0].role === 'system' && call.input.messages[1].role === 'user');
    const user = call.input.messages[1].content;
    ok('prompt: includes the tool goal + style rule', user.includes('replacement meta description') && user.includes('120–158'));
    ok('prompt: includes the page facts (title, h1, opening text)', user.includes('Current title tag: Example') && user.includes('Main heading (H1): Example H1') && user.includes('Opening page text:'));
    ok('prompt: includes the detected issue', user.includes('No meta description on this page.'));
    ok('prompt: untrusted-data instruction present', call.input.messages[0].content.includes('untrusted data'));
  }

  // 2. title drafts get the title-specific goal + cap
  {
    const env = mockEnv('A very long replacement title that keeps going well past what any search result would ever show before truncating the tail of it entirely yes');
    const res = await handleSuggest(post({ ...VALID, tool: 'serp-preview-tool', kind: 'title' }), env);
    const j = await res.json();
    ok('suggest: title goal + 50–60 rule used', env.calls[0].input.messages[1].content.includes('50–60') && res.status === 200);
    ok('suggest: overlong title cut at a word boundary', j.suggestion.length <= 110 && !/\s$/.test(j.suggestion) && !/yes$/.test(j.suggestion), j.suggestion);
  }

  // 3. label prefixes the model sometimes adds are stripped
  {
    const env = mockEnv('Meta description: A clean description of the page.');
    const j = await (await handleSuggest(post(VALID), env)).json();
    ok('suggest: leading "Meta description:" label stripped', j.suggestion === 'A clean description of the page.', j.suggestion);
  }

  // 4. guards
  {
    const r1 = await handleSuggest(post({ ...VALID, tool: 'password-generator' }), mockEnv('x'));
    ok('suggest: unknown tool rejected (400)', r1.status === 400);
    const r2 = await handleSuggest(post({ ...VALID, kind: 'haiku' }), mockEnv('x'));
    ok('suggest: unknown fix kind rejected (400)', r2.status === 400);
    const r3 = await handleSuggest(post('{not json'), mockEnv('x'));
    ok('suggest: invalid JSON rejected (400)', r3.status === 400);
    const r4 = await handleSuggest(new Request(ORIGIN + '/api/suggest'), mockEnv('x'));
    ok('suggest: GET rejected (405)', r4.status === 405);
    const r5 = await handleSuggest(post(VALID, { Origin: 'https://evil.test' }), mockEnv('x'));
    ok('suggest: cross-origin POST rejected (403)', r5.status === 403);
    const r6 = await handleSuggest(post(VALID, { Origin: ORIGIN }), mockEnv('ok'));
    ok('suggest: same-origin POST allowed', r6.status === 200);
    const big = await handleSuggest(post({ ...VALID, page: { text: 'x'.repeat(16000) } }), mockEnv('x'));
    ok('suggest: oversized body rejected (413)', big.status === 413);
    const noAi = await handleSuggest(post(VALID), {});
    ok('suggest: missing AI binding degrades to 503 unavailable', noAi.status === 503 && (await noAi.json()).reason === 'unavailable');
    const opt = await handleSuggest(new Request(ORIGIN + '/api/suggest', { method: 'OPTIONS' }), mockEnv('x'));
    ok('suggest: OPTIONS answered with 204', opt.status === 204);
  }

  // 5. model failure + empty output degrade, never throw
  {
    const r1 = await handleSuggest(post(VALID), mockEnv(undefined, { rejectWith: 'model not found' }));
    const j1 = await r1.json();
    ok('suggest: model error → 502 with reason', r1.status === 502 && j1.reason === 'model');
    const r2 = await handleSuggest(post(VALID), mockEnv(undefined, {}));
    const j2 = await r2.json();
    ok('suggest: empty model output → 502 with reason', r2.status === 502 && j2.reason === 'empty');
    const r3 = await handleSuggest(post(VALID), mockEnv(undefined, { rejectWith: 'boom' }));
    const j3 = await r3.json();
    ok('suggest: generic runtime error → 502 with reason', r3.status === 502 && j3.reason === 'error');
  }

  // 6. custom model override via env
  {
    const env = mockEnv('A description.', { model: '@cf/custom/model' });
    await handleSuggest(post(VALID), env);
    ok('suggest: AI_MODEL env overrides the default model', env.calls[0].model === '@cf/custom/model');
  }

  console.log(`\nSUGGEST API: ${pass} passed, ${fail} failed`);
  if (issues.length) issues.forEach((i) => console.log(' ✗ ' + i));
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });

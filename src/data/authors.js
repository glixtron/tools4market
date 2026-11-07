// Tools4Market — named authors. Guides point at a name here; the byline links
// to the generated author page and the article schema emits a Person.
// One person runs this site. If that changes, add a record here rather than
// reviving an anonymous "Editorial Team" byline.

export const AUTHORS = [
  {
    slug: 'glixtron',
    name: 'Glixtron',
    role: 'Builds and tests every tool on this site',
    metaTitle: 'Glixtron — the author behind Tools4Market',
    metaDesc: 'Glixtron builds and tests the tools on Tools4Market, then writes the guides from what the test runs found. What was built and what is not claimed.',
    intro: 'I build the tools on this site, write the guides that go with them, and run the tests that try to break both.',
    bio: [
      'Glixtron is the handle I publish under. One person runs Tools4Market: I write the tool, drive it with hostile input, then write the guide from what the test run taught me. The GitHub account below is the public record of the code.',
      'The site is a static build with no framework and no npm dependencies. Each tool is a small script that runs in the browser, paired with a test that feeds it empty values, 100,000-character pastes, malformed URLs and non-numeric numbers. A run fails on any console error. Most guides start as a question the tool raised and the documentation did not answer plainly.',
      'I am not a certified consultant and I do not sell audits. I have not worked at Google, and nothing here is inside information about how ranking works. A guide says what a tool measured and what it could not see. When something is wrong, the correction goes on the contact page, not into a silently edited paragraph.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/glixtron' },
      { label: 'Email', url: 'mailto:support@tools4market.online' },
    ],
  },
];

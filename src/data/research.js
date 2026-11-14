// Tools4Market — research studies. Build-time data. Each entry is a published
// snapshot with its own method page; the index exists so the study has a parent
// page and a stable breadcrumb.
export const RESEARCH = [
  {
    slug: 'ai-crawlers-2026',
    title: 'Which top websites block AI crawlers? A robots.txt study of 1,000 sites',
    short: 'AI crawler blocking, 2026',
    metaTitle: 'AI Crawler Blocking: 1,000 Top Sites Measured (2026)',
    metaDesc: '1,000 top websites, 18 AI crawlers, one robots.txt each: 20.9% block GPTBot at the root and 8.7% block training while keeping answer engines.',
    date: '2026-11-14',
    // Copied next to the study at build time; also the Dataset contentUrl.
    dataset: 'ai-crawler-study.csv',
    summary: 'We fetched robots.txt from the 1,000 highest-ranked domains that serve a website. One in five disallows GPTBot at the root, and most of those block every training crawler at once.',
  },
];

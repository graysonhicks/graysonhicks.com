// Seed values for view counters based on ~75 views/month for base pages
// and ~5 views/month for blog/talk posts since their publish date.
// A simple hash of the slug provides deterministic "randomness" (±30%).

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function jitter(base: number, slug: string): number {
  const h = hashStr(slug)
  const factor = 0.7 + ((h % 600) / 1000) // 0.70 – 1.30
  return Math.round(base * factor)
}

function monthsSince(dateStr: string): number {
  const d = new Date(dateStr)
  const now = new Date('2026-04-01')
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
}

// Base pages: ~75 views/month since Jan 2017
const BASE_PAGES: Record<string, string> = {
  home: '2017-01-01',
  blog: '2017-01-01',
  talks: '2018-07-01',
}

// Blog posts: slug (without leading /) → publish date
const BLOG_POSTS: Record<string, string> = {
  'i-swore-i-would-never-start-a-blog': '2016-02-03',
  'feeling-the-burn': '2016-02-04',
  'the-vacation-is-over': '2016-02-04',
  'be-careful-what-you-wish-for': '2016-02-11',
  'a-calculator-with-bugs': '2016-02-17',
  'two-week-notice': '2016-03-02',
  'putting-some-backbone-into-it': '2016-03-11',
  'apps-on-apps': '2016-03-22',
  'shims-jigs-and-other-woodworking-concepts': '2016-03-29',
  'crawling-back-out-of-the-cave': '2016-04-29',
  'aliases-and-snippets-pt-1-aliases': '2017-08-10',
  'aliases-and-snippets-pt-2-snippets': '2017-08-31',
  'building-our-javascript-sdk': '2017-09-05',
  'sanctum-ipsum': '2017-09-15',
  'how-to-serve-gzipped-js-and-css-from-aws-s3': '2017-09-18',
  'opening-projects-faster-with-vs-code': '2018-03-15',
  'heard-of-gatsby-js-but-not-sure-what-to-make-of-it': '2018-07-31',
  'color-code-iterm2-ohmyzsh-directory-aware-terminals': '2025-06-02',
  'color-code-vscode-projects-for-easy-full-screen-swiping': '2025-06-02',
  'ai-agents-are-interns': '2026-03-28',
  'the-pin-factory-was-always-the-point': '2026-03-26',
}

// Talks: slug (without leading /) → publish date
const TALKS: Record<string, string> = {
  'native-code-splitting': '2021-10-08',
  'dive-in-to-styled-components': '2018-07-28',
  'common-fe-performance-mistakes': '2021-04-21',
  'gatsby-and-drupal': '2018-07-10',
  'five-questions-on-gatsby': '2018-07-31',
  'serverless-functions': '2021-06-22',
  'v5-tricks': '2022-11-02',
}

export function getSeed(slug: string): number {
  // Base pages
  if (slug in BASE_PAGES) {
    const months = monthsSince(BASE_PAGES[slug])
    return jitter(75 * months, slug)
  }

  // Blog posts: slug comes in as "blog/post-slug"
  if (slug.startsWith('blog/')) {
    const postSlug = slug.replace('blog/', '')
    const date = BLOG_POSTS[postSlug]
    if (date) {
      const months = monthsSince(date)
      return jitter(5 * months, slug)
    }
  }

  // Talks: slug comes in as "talks/talk-slug"
  if (slug.startsWith('talks/')) {
    const talkSlug = slug.replace('talks/', '')
    const date = TALKS[talkSlug]
    if (date) {
      const months = monthsSince(date)
      return jitter(5 * months, slug)
    }
  }

  return 0
}

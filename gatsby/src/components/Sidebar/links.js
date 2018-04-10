import { withPrefix } from 'gatsby-link'

export const links = [
  {
    name: 'home',
    href: '/',
  },
  {
    name: 'github',
    href: '/github',
  },
  {
    name: 'resume',
    href: withPrefix('GraysonHicksResumeSoftwareDeveloper2017.pdf'),
    id: 'resume-link',
    target: '_blank',
  },
  {
    name: 'blog',
    href: '/blog',
    id: 'blog-link',
  },
  {
    name: 'instagram',
    href: '/insta',
  },
  {
    name: 'twitter',
    href: '/twitter',
  },
]

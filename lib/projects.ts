export interface Project {
  title: string
  description: string
  href: string
  work?: boolean
}

export const projects: Project[] = [
  {
    title: 'mastra, inc. (Oct. 2025 - current)',
    description:
      'Customer engineer helping businesses build with the Mastra AI agent framework.',
    href: 'https://mastra.ai',
    work: true,
  },
  {
    title: 'mfd, inc. (Nov. 2023 - Oct. 2025)',
    description:
      'Lead front-end engineer improving physical product development and financing using our Next.js app and LLM-based agents.',
    href: 'https://www.manufactured.com',
    work: true,
  },
  {
    title: 'netlify (Mar. 2023 - Nov. 2023)',
    description:
      'Conducting React site performance audits for enterprise clients. Supporting large Netlify users to build and maintain first-class web experiences.',
    href: 'https://www.netlify.com',
    work: true,
  },
  {
    title: 'gatsby, inc. (2020 - 2023)',
    description:
      'Performing Gatsby site performance audits for enterprise clients. Supporting Cloud platform users to get the most out of Gatsby.',
    href: 'https://www.gatsbyjs.com',
    work: true,
  },
  {
    title: 'mediacurrent.com (2018 - 2020)',
    description:
      'Leading developer on a large distributed team. Building enterprise level websites using React, Gatsby, Node.js, and GraphQL around a strong team of Drupal developers.',
    href: 'https://www.mediacurrent.com',
    work: true,
  },
  {
    title: 'virtualjobshadow.com (2016 - 2018)',
    description:
      'On a small development team for a thriving ed-tech SaaS. Responsible for full feature builds, from the browser to the database and covered with tests.',
    href: 'https://www.virtualjobshadow.com',
    work: true,
  },
  {
    title: 'Mastra',
    description:
      'The TypeScript AI agent framework. Contributor to the open-source monorepo powering agents, workflows, RAG, and tool integrations.',
    href: 'https://github.com/mastra-ai/mastra',
  },
  {
    title: 'gatsby-plugin-remote-images',
    description:
      "A Gatsby.js plugin for downloading and linking remote images from another node's field for the benefits of gatsby-image.",
    href: 'https://github.com/graysonhicks/gatsby-plugin-remote-images',
  },
  {
    title: 'gatsby-plugin-loadable-components-ssr',
    description:
      'Gatsby plugin for using @loadable/component with server-side rendering. Enables code splitting with full SSR support.',
    href: 'https://github.com/graysonhicks/gatsby-plugin-loadable-components-ssr',
  },
  {
    title: 'vrWorkplace',
    description:
      'A ReactVR project allowing the user to choose a workplace, enter a 360 view of the workplace, and select "hotpoints" related to that career.',
    href: 'https://graysonhicks.github.io/vrWorkplace/',
  },
  {
    title: 'Swatchsmith',
    description:
      'Web based canvas tool to create color palettes and exported stylesheet files with semantically named color variables.',
    href: 'https://swatchsmith.com',
  },
  {
    title: 'sanctum ipsum',
    description:
      'A site based Catholic lorem ipsum generator made with React. Also offers a node.js based API and an npm package.',
    href: 'https://graysonhicks.github.io/sanctum-ipsum/',
  },
  {
    title: 'Parkary',
    description:
      'Find, explore, and review parks in your city. Search thousands of parks nationwide with filtering by amenities and community ratings.',
    href: 'https://parkary.app',
  },
]

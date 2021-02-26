require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
    siteUrl: 'http://www.graysonhicks.com/gatsby',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    `gatsby-transformer-json`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'graysonhicks.com',
        short_name: 'graysonhicks',
        start_url: '/',
        background_color: '#f0f0f0',
        theme_color: '#333333',
        display: 'minimal-ui',
        icon: 'favicon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-76963473-1',
        // Puts tracking script in the head instead of the body
        head: false,
        anonymize: true,
        respectDNT: true,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogs`,
        path: `${__dirname}/src/blogs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `talks`,
        path: `${__dirname}/src/talks`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: `gatsby-plugin-sass`,
      sassOptions: {
        precision: 8,
      },
    },
    {
      resolve: `gatsby-source-instagram`,
      options: {
        username: '362244638',
        access_token: process.env.INSTAGRAM_PERSONAL_ACCESS_TOKEN,
      },
    },
    {
      resolve: 'gatsby-source-github',
      options: {
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      },
    },
    {
      resolve: 'gatsby-source-twitter',
      options: {
        auth: {
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          bearer_token: process.env.TWITTER_BEARER_TOKEN,
        },
      },
    },
  ],
}

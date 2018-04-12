module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
    siteUrl: 'http://www.graysonhicks.com/gatsby',
  },
  pathPrefix: `/gatsby`,
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',
    'gatsby-plugin-styled-components',
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        precision: 8,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `montserrat:300`,
          `montserrat:400`,
          `montserrat:700`,
          `lato:700`,
        ],
      },
    },
    {
      resolve: `gatsby-source-medium`,
      options: {
        username: `@graysonhicks`,
      },
    },
  ],
}

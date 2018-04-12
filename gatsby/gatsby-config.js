module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
    siteUrl: 'http://www.graysonhicks.com/gatsby',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',
    'gatsby-plugin-styled-components',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'graysonhicks.com',
        short_name: 'graysonhicks.com',
        start_url: '/',
        background_color: '#f0f0f0',
        theme_color: '#333333',
        display: 'minimal-ui',
        icon: 'favicon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
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

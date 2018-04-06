module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-next',
    'gatsby-plugin-styled-components',
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
    {
      resolve: `gatsby-source-twitter`,
      options: {
        q: `from:graysonhicks`,
        credentials: {
          consumer_key: '2X7222bdC9yaVfbbzwCTwCrc3',
          consumer_secret: 'PtvgGHpdjs8WGjEMuMwNLdTIUo3SPpENtQ7080zCWpOx0su5ot',
          bearer_token:
            'AAAAAAAAAAAAAAAAAAAAAIej5QAAAAAAQmXNhYQ%2F0%2F61ZL7vrxLf%2FXg8474%3DKOGeX3byuHVzV2TCCIqY84nr6vqQyZIxhe8z31Y0GFtBT3Ij6S',
        },
      },
    },
  ],
}

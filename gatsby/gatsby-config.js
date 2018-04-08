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
        result_type: 'recent',
      },
    },
    {
      resolve: 'gatsby-source-thirdparty',
      options: {
        url: `https://api.instagram.com/v1/users/self/media/recent/?access_token=	362244638.1677ed0.d5acf14c938747bd83e7ba10eaa140e9`,
        // Name of the data to be downloaded.  Will show in graphQL or be saved to a file
        // using this name. i.e. posts.json
        name: `Insta`,
        // Optional payload key name if your api returns your payload in a different key
        // Default will use the full response from the http request of the url
        payloadKey: `data`,
        // Optionally save the JSON data to a file locally
        // Default is false
        localSave: true,
        //  Required folder path where the data should be saved if using localSave option
        //  This folder must already exist
        path: `${__dirname}/src/data/`,
        // Optionally skip creating nodes in graphQL.  Use this if you only want
        // The data to be saved locally
        // Default is false
        skipCreateNode: false, // skip import to graphQL, only use if localSave is all you want
      },
    },
  ],
}

import React from 'react'

import Twitter from '../components/Twitter'

const TwitterPage = ({ data }) => {
  return <Twitter posts={data.allLocalTwitterImage.edges} />
}
export default TwitterPage

export const TwitterQuery = graphql`
  query TwitterQuery {
    allLocalTwitterImage(sort: { fields: [id], order: DESC }) {
      edges {
        node {
          created_time
          text
          id
          id_str
          localImageFile {
            childImageSharp {
              sizes(maxWidth: 500) {
                ...GatsbyImageSharpSizes
              }
            }
          }
          user {
            name
            screen_name
            profile_image_url_https
          }
        }
      }
    }
  }
`

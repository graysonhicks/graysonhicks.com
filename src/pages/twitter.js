import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Twitter from '../components/Twitter'

const TwitterPage = ({ data }) => {
  return (
    <Layout>
      <Twitter posts={data.allLocalTwitterImage.edges} />
    </Layout>
  )
}
export default TwitterPage

export const TwitterQuery = graphql`
  query TwitterQuery {
    allLocalTwitterImage(sort: { fields: [created_time], order: DESC }) {
      edges {
        node {
          created_time
          text
          id
          id_str
          localImageFile {
            childImageSharp {
              fluid(maxWidth: 500) {
                ...GatsbyImageSharpFluid
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

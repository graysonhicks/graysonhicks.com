import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Insta from '../components/Insta'

const InstaPage = ({ data }) => (
  <Layout>
    <Insta posts={data.allLocalInstaImage.edges} />
  </Layout>
)

export default InstaPage

export const InstaQuery = graphql`
  query InstaQuery {
    allLocalInstaImage(sort: { fields: [created_time], order: DESC }) {
      edges {
        node {
          id
          caption
          username
          video
          likes
          localImageFile {
            childImageSharp {
              original {
                src
              }
              fluid(maxWidth: 500) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          link
        }
      }
    }
  }
`

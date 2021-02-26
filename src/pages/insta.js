import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Insta from '../components/Insta'

const InstaPage = ({ data }) => (
  <Layout>
    <Insta posts={data.allInstaNode.nodes} />
  </Layout>
)

export default InstaPage

export const InstaQuery = graphql`
  query InstaQuery {
    allInstaNode(sort: { fields: [timestamp], order: DESC }) {
      nodes {
        id
        caption
        username
        likes
        localFile {
          childImageSharp {
            original {
              src
            }
            fluid(maxWidth: 500) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`

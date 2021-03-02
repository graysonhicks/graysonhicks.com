import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Insta from '../components/Insta'

const InstaPage = ({ data }) => {
  return (
    <Layout>
      <Insta posts={data.allInstaNode.nodes} />
    </Layout>
  )
}

export default InstaPage

InstaPage.propTypes = {
  data: PropTypes.shape({
    allInstaNode: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
}

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
            gatsbyImageData(
              width: 500
              layout: CONSTRAINED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`

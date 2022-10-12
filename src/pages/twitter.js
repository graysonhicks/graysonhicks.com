import React from 'react'
import PropTypes from 'prop-types'
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

TwitterPage.propTypes = {
  data: PropTypes.shape({
    allLocalTwitterImage: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const TwitterQuery = graphql`query TwitterQuery {
  allLocalTwitterImage(sort: {created_time: DESC}) {
    edges {
      node {
        created_time
        text
        id
        id_str
        localImageFile {
          childImageSharp {
            gatsbyImageData(width: 500, layout: CONSTRAINED, formats: [AUTO, WEBP, AVIF])
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

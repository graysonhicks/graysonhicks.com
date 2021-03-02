import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Blog from '../components/Blog'

const TalksPage = ({ data }) => (
  <Layout>{<Blog posts={data.talks.nodes} prefix="/talks" />}</Layout>
)
export default TalksPage

TalksPage.propTypes = {
  data: PropTypes.shape({
    talks: PropTypes.shape({
      nodes: PropTypes.array,
    }),
  }),
}

export const StoriesQuery = graphql`
  query TalksQuery {
    talks: allFile(
      sort: { order: DESC, fields: [childMdx___frontmatter___date] }
      filter: { absolutePath: { regex: "/talks/" }, ext: { eq: ".mdx" } }
    ) {
      nodes {
        childMdx {
          frontmatter {
            slug
            title
            description
          }
        }
      }
    }
  }
`

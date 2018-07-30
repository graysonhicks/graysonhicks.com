import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Blog from '../components/Blog'

const BlogPage = ({ data }) => (
  <Layout>
    <Blog posts={data.allMediumPost.edges} />
  </Layout>
)
export default BlogPage

export const StoriesQuery = graphql`
  query StoriesQuery {
    allMediumPost(sort: { fields: [createdAt], order: DESC }) {
      edges {
        node {
          id
          title
          virtuals {
            subtitle
          }
          childLocalMediumImage {
            localImageFile {
              childImageSharp {
                fluid(maxWidth: 400) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          author {
            name
          }
        }
      }
    }
  }
`

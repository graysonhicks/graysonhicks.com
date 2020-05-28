import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Blog from '../components/Blog'

const BlogPage = ({ data }) => (
  <Layout>{<Blog posts={data.blogs.nodes} prefix="/blogs" />}</Layout>
)
export default BlogPage

export const StoriesQuery = graphql`
  query StoriesQuery {
    blogs: allFile(
      filter: { absolutePath: { regex: "/blogs/" }, ext: { eq: ".mdx" } }
      sort: { order: DESC, fields: [childMdx___frontmatter___date] }
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

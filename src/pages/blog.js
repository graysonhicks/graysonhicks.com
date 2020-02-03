import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Blog from '../components/Blog'

const BlogPage = ({ data }) => (
  <Layout>{<Blog posts={data.blogs.nodes} />}</Layout>
)
export default BlogPage

export const StoriesQuery = graphql`
  query StoriesQuery {
    blogs: allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        frontmatter {
          title
          description
          slug
        }
      }
    }
  }
`

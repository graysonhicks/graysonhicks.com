import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Blog from '../components/Blog'

const BlogPage = ({ data }) => (
  <Layout>{<Blog posts={data.blogs.nodes} prefix="/blog" />}</Layout>
)
export default BlogPage

BlogPage.propTypes = {
  data: PropTypes.shape({
    blogs: PropTypes.array,
  }),
}

export const StoriesQuery = graphql`query StoriesQuery {
  blogs: allFile(
    filter: {absolutePath: {regex: "/blogs/"}, ext: {eq: ".mdx"}}
    sort: {childMdx: {frontmatter: {date: DESC}}}
  ) {
    nodes {
      id
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

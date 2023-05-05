/* eslint-disable react/display-name */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import Layout from '../components/Layout'
import Heading from '../components/Heading'

const Blog = ({ data, children }) => {
  const { blog } = data

  return (
    <Layout>
      <Heading level={1}>{blog.frontmatter.title}</Heading>
      <Heading>{blog.frontmatter.date}</Heading>
      <div style={{ fontSize: '1.6rem' }}>
        <MDXProvider>{children}</MDXProvider>
      </div>
    </Layout>
  )
}

export default Blog

Blog.propTypes = {
  data: PropTypes.shape({
    blog: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
      body: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export const blogQuery = graphql`
  query ($slug: String!) {
    blog: mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
      }
    }
  }
`

/* eslint-disable react/display-name */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import Heading from '../components/Heading'

const components = {
  // eslint-disable-next-line react/prop-types
  h1: ({ children }) => <Heading level={1}>{children}</Heading>,
  // eslint-disable-next-line react/prop-types
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  // eslint-disable-next-line react/prop-types
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  // eslint-disable-next-line react/prop-types
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,
  // eslint-disable-next-line react/prop-types
  h5: ({ children }) => <Heading level={5}>{children}</Heading>,
  // eslint-disable-next-line react/prop-types
  h6: ({ children }) => <Heading level={6}>{children}</Heading>,
}

const Blog = ({ data }) => {
  const { blog } = data

  return (
    <Layout>
      <MDXProvider components={components}>
        <Heading level={1}>{blog.frontmatter.title}</Heading>
        <Heading>{blog.frontmatter.date}</Heading>
        <MDXRenderer>{blog.body}</MDXRenderer>
      </MDXProvider>
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
  query($slug: String!) {
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

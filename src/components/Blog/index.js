import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import BlogItem from './BlogItem'

const BlogContainer = styled.div`
  padding-left: 20px;

  a:first-of-type {
    padding-top: 0;
  }

  a:last-of-type {
    border-bottom: none;
  }
`
const Blog = ({ posts, prefix }) => {
  const items = posts.map((post) => (
    <BlogItem key={post.id} prefix={prefix} {...post} />
  ))
  return (
    <React.Fragment>
      <BlogContainer>{items}</BlogContainer>
    </React.Fragment>
  )
}

export default Blog

Blog.propTypes = {
  posts: PropTypes.array,
  prefix: PropTypes.string,
}

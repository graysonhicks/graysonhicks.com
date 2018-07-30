import React, { Component } from 'react'
import styled from 'styled-components'

import BlogItem from './BlogItem'
import BlogEndPost from './BlogEndPost'

const BlogContainer = styled.div`
  a:last-of-type {
    border-bottom: none;
  }
`
class Blog extends Component {
  render() {
    const items = this.props.posts.map(post => (
      <BlogItem key={post.node.id} {...post.node} />
    ))
    return (
      <React.Fragment>
        <BlogContainer>{items}</BlogContainer>
        <BlogEndPost />
      </React.Fragment>
    )
  }
}

export default Blog

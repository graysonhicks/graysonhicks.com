import React, { Component } from 'react'

import Loader from '../Loader'
import BlogItem from './BlogItem'
import BlogEndPost from './BlogEndPost'

const Blog = ({ posts }) => {
  const items = posts.map(post => (
    <BlogItem key={post.node.id} {...post.node} />
  ))
  return (
    <div id="blog-content">
      {items}
      <BlogEndPost />
    </div>
  )
}

export default Blog

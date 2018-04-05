import React, { Component } from 'react'

import Loader from '../Loader'
import BlogItem from './BlogItem'
import BlogError from './BlogError'
import BlogSeeMore from './BlogSeeMore'

import './index.sass'

const Blog = ({ posts }) => {
  const items = posts
    .slice(0, 5)
    .map(post => <BlogItem key={post.node.id} {...post.node} />)
  return (
    <div id="blog-content">
      {items}
      <BlogSeeMore />
    </div>
  )
}

export default Blog

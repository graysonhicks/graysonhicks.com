import React, { Component } from 'react'

import Loader from '../Loader'
import BlogItem from './BlogItem'
import BlogError from './BlogError'

import './index.sass'

class Blog extends Component {
  render() {
    return (
      <div id="blog-content">
        <Loader />
        <BlogError />
      </div>
    )
  }
}

export default Blog

import React from 'react'
import PropTypes from 'prop-types'

import BlogItem from './BlogItem'

import * as styles from './index.module.scss'

const Blog = ({ posts, prefix }) => {
  const items = posts.map((post) => (
    <BlogItem key={post.id} prefix={prefix} {...post} />
  ))
  return (
    <React.Fragment>
      <div className={styles.container}>{items}</div>
    </React.Fragment>
  )
}

export default Blog

Blog.propTypes = {
  posts: PropTypes.array,
  prefix: PropTypes.string,
}

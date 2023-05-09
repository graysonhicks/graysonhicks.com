import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import * as styles from './index.module.scss'

import Heading from '../../Heading'

const BlogItem = ({ childMdx, prefix }) => {
  return (
    <Link
      to={`${prefix}${childMdx.frontmatter.slug}`}
      className={styles.blogPost}
    >
      <div className="col-12">
        <BlogTitle>{childMdx.frontmatter.title}</BlogTitle>
        <div className={styles.blogDescription}>
          {childMdx.frontmatter.description}
        </div>
      </div>
    </Link>
  )
}

export default BlogItem

BlogItem.propTypes = {
  prefix: PropTypes.string.isRequired,
  childMdx: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      slug: PropTypes.string,
    }),
  }),
}

const BlogTitle = ({ children }) => (
  <Heading level={2} className={styles.blogTitle}>
    {children}
  </Heading>
)

export { BlogTitle }

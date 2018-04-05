import React from 'react'

const BlogError = props => (
  <div className="row error">
    <div className="col-xs-12">
      <div className="blog-titles heading text-center">
        Sorry! There was an error loading the blog posts from{' '}
        <a href="https://Medium.com">Medium.com</a>!<div className="blog-descriptions">
          Please visit{' '}
          <a href="https://medium.com/@graysonhicks">
            https://medium.com/@graysonhicks
          </a>{' '}
          to give them a read.
        </div>
      </div>
    </div>
  </div>
)

export default BlogError

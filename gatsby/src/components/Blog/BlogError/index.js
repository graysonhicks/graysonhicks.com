import React from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import { BlogTitle, BlogDescription } from '../BlogItem'

const ErrorLink = styled.div`
  color: ${colors.colorFruitSalad};
`
const BlogError = props => (
  <div className="row error">
    <div className="col-xs-12">
      <BlogTitle className="text-center">
        Sorry! There was an error loading the blog posts from{' '}
        <ErrorLink href="https://Medium.com">Medium.com</ErrorLink>!<BlogDescription
        >
          Please visit{' '}
          <ErrorLink href="https://medium.com/@graysonhicks">
            https://medium.com/@graysonhicks
          </ErrorLink>{' '}
          to give them a read.
        </BlogDescription>
      </BlogTitle>
    </div>
  </div>
)

export default BlogError

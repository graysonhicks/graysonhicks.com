import React from 'react'
import { StyledHeading } from '../../Heading'
import { BlogPost } from '../BlogItem'

import AppContext from '../../../context'

const SeeMore = BlogPost.extend`
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const BlogSeeMore = props => (
  <AppContext.Consumer>
    {context => (
      <SeeMore
        nightMode={context.nightMode}
        href="https://medium.com/@graysonhicks/"
      >
        <StyledHeading>See more...</StyledHeading>
      </SeeMore>
    )}
  </AppContext.Consumer>
)

export default BlogSeeMore

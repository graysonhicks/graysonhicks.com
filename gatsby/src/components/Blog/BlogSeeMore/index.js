import React from 'react'
import { StyledHeading } from '../../Heading'
import { BlogPost } from '../BlogItem'

const SeeMore = BlogPost.extend`
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const BlogSeeMore = props => (
  <SeeMore href="https://medium.com/@graysonhicks/">
    <StyledHeading>See more...</StyledHeading>
  </SeeMore>
)

export default BlogSeeMore

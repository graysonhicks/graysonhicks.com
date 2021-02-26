import React from 'react'
import styled from 'styled-components'
import { childrenPropType } from '../../../utils'

const StyledPost = styled.div`
  margin: 4px;
  position: relative;
  font-family: 'Futura';
  &:hover {
    text-decoration: none;
  }
`

const Post = ({ children }) => <StyledPost>{children}</StyledPost>

export default Post

Post.propTypes = {
  children: childrenPropType,
}

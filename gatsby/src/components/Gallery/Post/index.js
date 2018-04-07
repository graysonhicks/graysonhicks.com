import React, { Component } from 'react'
import styled from 'styled-components'

const StyledPost = styled.div`
  margin: 4px;
  position: relative;
  font-family: montserrat;
  &:hover {
    text-decoration: none;
  }
`

class Post extends Component {
  render() {
    return <StyledPost>{this.props.children}</StyledPost>
  }
}

export default Post

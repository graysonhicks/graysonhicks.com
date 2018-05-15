import React from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import FaMedium from 'react-icons/lib/fa/medium'

import AppContext from '../../../context'

const StyledBlogIcon = styled(FaMedium)`
  color: ${props => (props.nightmode ? colors.gallery : colors.mineShaft)};
  font-size: 3rem;
  position: absolute;
  top: 10px;
  right: 10px;
`

const StyledBlogEndPost = styled.a`
  width: 100%;
  display: inline-block;
  position: relative;
  text-align: center;
  padding: 15px;
  border: 2px solid
    ${props => (props.nightmode ? colors.gallery : colors.mineShaft)};
  border-radius: 5px;
  font-family: 'Futura';
  text-transform: uppercase;
  font-weight: bold;
  color: ${props => (props.nightmode ? colors.gallery : colors.mineShaft)};
  cursor: pointer;
  margin-bottom: 50px;
  margin-top: 25px;

  &:hover,
  &:focus {
    background-color: ${colors.mineShaft};
    color: ${colors.white};
    text-decoration: none;
    transition: all 0.25s;

    ${StyledBlogIcon} {
      color: ${colors.gallery};
    }
  }
`

const BlogEndPost = () => {
  return (
    <AppContext.Consumer>
      {context => (
        <StyledBlogEndPost
          href="https://medium.com/@graysonhicks"
          target="_blank"
          rel="noopener"
          nightmode={context.nightMode}
        >
          go to medium <StyledBlogIcon nightmode={context.nightMode ? 1 : 0} />
        </StyledBlogEndPost>
      )}
    </AppContext.Consumer>
  )
}

export default BlogEndPost

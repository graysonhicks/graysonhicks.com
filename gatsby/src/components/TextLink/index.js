import React from 'react'
import styled from 'styled-components'
import { colors } from '../../styles/colors'

const StyledLink = styled.a`
  color: ${colors.fruitSalad};
  cursor: pointer;

  &:hover {
    color: ${colors.seaGreen};
  }
`

const TextLink = ({ children, ...rest }) => (
  <StyledLink {...rest}>{children}</StyledLink>
)

export default TextLink

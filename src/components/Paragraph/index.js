import React from 'react'
import styled from 'styled-components'
import { childrenPropType } from '../../utils'

const StyledParagraph = styled.p`
  font-size: 1.6rem;
`

const Paragraph = ({ children, ...rest }) => (
  <StyledParagraph {...rest}>{children}</StyledParagraph>
)

export default Paragraph

Paragraph.propTypes = {
  children: childrenPropType,
}

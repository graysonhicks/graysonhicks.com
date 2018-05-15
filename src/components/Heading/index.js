import React from 'react'
import styled from 'styled-components'

export const StyledHeading = styled.h2`
  font-family: 'Futura';
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 2rem;
`

const Heading = ({ children }) => <StyledHeading>{children}</StyledHeading>

export default Heading

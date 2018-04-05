import React from 'react'
import styled from 'styled-components'

export const StyledHeading = styled.div`
  font-weight: bold;
  font-family: 'Futura', 'Montserrat';
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 2rem;
`

const Heading = ({ children }) => <StyledHeading>{children}</StyledHeading>

export default Heading

import React from 'react'
import styled from 'styled-components'
import { colors } from '../../styles/colors'

import Heading from '../Heading'

const SeeMoreContainer = styled.div`
  text-align: center;
  font-weight: bold;
  font-family: 'Futura', 'Montserrat';
  text-transform: uppercase;
  font-size: 2rem;
  margin-bottom: 50px;
`

const SeeMoreLink = styled.span`
  cursor: pointer;
  transition: color 0.25s;
  &:hover {
    color: ${colors.indigo};
  }
`

const SeeMore = props => (
  <SeeMoreContainer>
    <SeeMoreLink>See More</SeeMoreLink>
  </SeeMoreContainer>
)

export default SeeMore

import React from 'react'
import styled from 'styled-components'
import { colors } from '../../styles/colors'

const StyledSkipLink = styled.a`
  left: -999px;
  position: absolute;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: -999;

  &:focus,
  &:active {
    color: #fff;
    background-color: ${colors.mineShaft};
    left: 50%;
    top: auto;
    width: 10%;
    height: auto;
    overflow: auto;
    margin: 10px 35%;
    padding: 10px;
    border-radius: 15px;
    border: 4px solid yellow;
    text-align: center;
    font-size: 1.2em;
    z-index: 999;
  }
`

const SkipLink = () => (
  <StyledSkipLink href="#main">Skip to main content</StyledSkipLink>
)

export default SkipLink

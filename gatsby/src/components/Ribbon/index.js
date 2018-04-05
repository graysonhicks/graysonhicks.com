import React from 'react'
import styled from 'styled-components'

const colorBlueWhale = '#032B3B'

const StyledRibbon = styled.div`
  width: 175px;
  padding: 10px;
  padding-left: 40px;
  padding-right: 40px;
  position: absolute;
  text-align: center;
  transform: rotate(45deg);
  right: -50px;
  top: 15px;
  cursor: pointer;
  z-index: 100;
  background-color: ${props => (props.day ? '#f0f0f0' : colorBlueWhale)};
  color: ${props => (props.day ? colorBlueWhale : '#f0f0f0')};
  display: ${props => (props.day ? 'none' : 'block')};

  @media screen and (max-width: 736px) {
    right: -60px;
    top: 10px;
    text-align: center;
    font-size: 1rem;
  }
`

const Ribbon = () => (
  <React.Fragment>
    <StyledRibbon day>Day Mode</StyledRibbon>
    <StyledRibbon night>Night Mode</StyledRibbon>
  </React.Fragment>
)

export default Ribbon

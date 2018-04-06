import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { colors } from '../../styles/colors'

import AppContext from '../../context'

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
  background-color: ${props =>
    props.nightMode ? colors.gallery : colors.blueWhale};
  color: ${props => (props.nightMode ? colors.blueWhale : colors.gallery)};

  @media screen and (max-width: 736px) {
    right: -60px;
    top: 10px;
    text-align: center;
    font-size: 1rem;
  }
`

const DayRibbon = StyledRibbon.extend`
  background-color: ${colors.gallery};
  color: ${colors.blueWhale};
`

const NightRibbon = StyledRibbon.extend`
  background-color: ${colors.blueWhale};
  color: ${colors.gallery};
`

const Ribbon = props => (
  <AppContext.Consumer>
    {context => (
      <React.Fragment>
        {context.nightMode ? (
          <DayRibbon onClick={context.switch}>Day Mode</DayRibbon>
        ) : (
          <NightRibbon onClick={context.switch}>Night Mode</NightRibbon>
        )}
      </React.Fragment>
    )}
  </AppContext.Consumer>
)

export default Ribbon

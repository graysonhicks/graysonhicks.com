import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { colors } from '../../styles/colors'

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
  background-color: ${props => (props.day ? colors.white : colors.blueWhale)};
  color: ${props => (props.day ? colors.blueWhale : colors.white)};
  display: ${props => (props.day ? 'none' : 'block')};

  @media screen and (max-width: 736px) {
    right: -60px;
    top: 10px;
    text-align: center;
    font-size: 1rem;
  }
`
class Ribbon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nightMode: false,
    }

    this.switch = this.switch.bind(this)
  }
  switch() {
    this.setState(prevState => ({
      nightMode: !prevState.nightMode,
    }))
  }
  render() {
    return (
      <React.Fragment>
        <StyledRibbon day>Day Mode</StyledRibbon>
        <StyledRibbon night onClick={this.switch}>
          Night Mode
        </StyledRibbon>
        {this.state.nightMode ? (
          <Helmet>
            <link
              id="night-mode-stylesheet"
              rel="stylesheet"
              href="styles/nightmode.css"
            />
          </Helmet>
        ) : null}
      </React.Fragment>
    )
  }
}

export default Ribbon

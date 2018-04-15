import React from 'react'
import styled, { keyframes } from 'styled-components'
import { colors } from '../../styles/colors'

import AppContext from '../../context'

const fadeIn = keyframes`
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
`

const Wrapper = styled.div`
  padding: 15px;
  overflow-x: hidden;
  background-color: ${props => (props.nightMode ? colors.shark : colors.white)}
  color: ${props => (props.nightMode ? colors.alto : colors.mineShaft)}

  @media screen and (max-width: 991px) {
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
`

const NightWrapper = Wrapper.extend`
  background-color: #282c34;
  color: #dddddd;
`

const StyledApp = styled.div`
  @media screen and (max-width: 991px) {
    position: relative
    overflow-x: hidden
  }
`

const App = props => (
  <AppContext.Consumer>
    {context => (
      <Wrapper nightMode={context.nightMode}>
        <StyledApp className="container">{props.children}</StyledApp>
      </Wrapper>
    )}
  </AppContext.Consumer>
)

export default App

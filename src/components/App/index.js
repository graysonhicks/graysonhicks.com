import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';

import AppContext from '../../context';

const Wrapper = styled.div`
  padding: 15px;
  overflow-x: hidden;
  background-color: ${props => (props.nightMode ? colors.shark : colors.white)};
  color: ${props => (props.nightMode ? colors.alto : colors.mineShaft)};

  @media screen and (max-width: 991px) {
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
`;

const StyledApp = styled.div`
  @media screen and (max-width: 991px) {
    position: relative;
    overflow-x: hidden;
  }
`;

const App = props => (
  <AppContext.Consumer>
    {context => (
      <Wrapper nightMode={context.nightMode}>
        <StyledApp className="container">{props.children}</StyledApp>
      </Wrapper>
    )}
  </AppContext.Consumer>
);

export default App;

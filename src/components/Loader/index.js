import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../../styles/colors';

import AppContext from '../../context';

import { StyledHeading } from '../Heading';

const loadingFade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const LoadingContainer = styled(StyledHeading)`
  font-size: 30px;
  display: inline-block;
  width: 50%;
  margin-left: 25%;
  text-align: center;
  font-size: 2.5rem;
  color: ${props => (props.nightMode ? colors.gallery : colors.black)};
`;

const Letter = styled.div`
  animation-name: ${loadingFade};
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-direction: linear;
  display: inline-block;
  animation-delay: ${props => props.delay}s;
`;

const Loader = props => (
  <AppContext.Consumer>
    {context => (
      <LoadingContainer nightMode={context.nightMode} className="heading">
        <Letter delay={0.15}>L</Letter>
        <Letter delay={0.3}>o</Letter>
        <Letter delay={0.45}>a</Letter>
        <Letter delay={0.6}>d</Letter>
        <Letter delay={0.75}>i</Letter>
        <Letter delay={0.9}>n</Letter>
        <Letter delay={1.05}>g</Letter>
        <Letter delay={1.2}>.</Letter>
        <Letter delay={1.35}>.</Letter>
        <Letter delay={1.5}>.</Letter>
      </LoadingContainer>
    )}
  </AppContext.Consumer>
);

export default Loader;

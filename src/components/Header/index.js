import React from 'react';
import styled, { keyframes } from 'styled-components';

import Img from 'gatsby-image';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 50%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media screen and (max-width: 991px) {
    padding-top: 15px;
  }
`;

const HeadshotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NameContainer = styled(HeadshotContainer)`
  overflow: hidden;
`;

const Name = styled.h1`
  padding-left: 15px;
  margin-top: 0px;
  font-size: 2.5em;
  font-family: 'Futura', sans-serif;
  text-transform: uppercase;

  @media screen and (max-width: 736px) {
    font-size: 1.25em;
    padding-left: 0px;
  }
`;

const Headshot = styled(Img)`
  border-radius: 100%;
  max-height: 100px;
  max-width: 100px;
`;

const Header = props => (
  <StyledHeader className="row">
    <div className="col-sm-2 col-xs-5">
      <HeadshotContainer>
        <Headshot
          alt="Headshot of Grayson Hicks"
          fixed={props.headshot.childImageSharp.fixed}
        />
      </HeadshotContainer>
    </div>
    <div className="col-sm-10 col-xs-7">
      <NameContainer>
        <Name>grayson hicks</Name>
      </NameContainer>
    </div>
  </StyledHeader>
);

export default Header;

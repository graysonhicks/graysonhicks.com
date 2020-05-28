import React from 'react';
import styled, { keyframes } from 'styled-components';
import Img from 'gatsby-image';

const slideLeft = keyframes`
  from {
    left: 100%;
    opacity: 0;
  }

  to {
    left: 0;
    opacity: 1;
  }
`;

const slideRight = keyframes`
  from {
    left: 0;
    opacity: 1;
  }

  to {
    left: 100%;
    opacity: 0;
  }
`;

const StyledImage = styled.div`
  float: left;
  position: relative;
  width: 25%;
  padding-right: 0px;
  animation: ${props => props.slide} 0.5s forwards;
  opacity: ${props => (props.slide ? 1 : 0)};

  @media screen and (max-width: 991px) {
    opacity: 1;
    animation: none;
  }

  @media screen and (max-width: 667px) {
    max-height: 150px;
    overflow-y: hidden;
    position: relative;
    width: 100%;
    margin-bottom: 10px;
    margin-top: 10px;
    border-radius: 5px;
    padding-left: 0;
  }
`;

const Image = styled(Img)`
  border-radius: 5px;

  @media screen and (max-width: 667px) {
    position: absolute;
    top: -75px;
  }
`;

const ProjectItemImage = ({ hover, image, title }) => {
  let component;
  switch (hover) {
    case null:
      component = (
        <StyledImage>
          <Image
            sizes={image.childImageSharp.fluid}
            alt={`Logo for ${title}`}
          />
        </StyledImage>
      );
      break;
    case false:
      component = (
        <StyledImage slide={slideRight} visible={hover}>
          <Image
            sizes={image.childImageSharp.fluid}
            alt={`Logo for ${title}`}
          />
        </StyledImage>
      );
      break;
    case true:
      component = (
        <StyledImage slide={slideLeft} visible={hover}>
          <Image
            sizes={image.childImageSharp.fluid}
            alt={`Logo for ${title}`}
          />
        </StyledImage>
      );
      break;
    default:
      break;
  }

  return component;
};

export default ProjectItemImage;

import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'

const imagePath = './thumbs/'

const slideLeft = keyframes`
  from {
    left: 100%;
    opacity: 0;
  }

  to {
    left: 0;
    opacity: 1;
  }
`

const slideRight = keyframes`
  from {
    left: 0;
    opacity: 1;
  }

  to {
    left: 100%;
    opacity: 0;
  }
`

const StyledImage = styled.div`
  padding-right: 0px;
  animation: ${props => props.slide} 0.5s forwards;
  opacity: ${props => (props.slide ? 1 : 0)};

  @media screen and (max-width: 991px) {
    opacity: 1;
  }

  @media screen and (max-width: 736px) {
    max-height: 150px;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    border-radius: 5px;
    padding-left: 0;
  }
`

const Image = styled.img`
  border-radius: 5px;
`

const ProjectItemImage = ({ hover, image }) => {
  switch (hover) {
    case null:
      return (
        <StyledImage className="col-sm-3">
          <Image
            className="img-responsive"
            src={require(`${imagePath + image}`)}
            alt=""
          />
        </StyledImage>
      )
      break
    case false:
      return (
        <StyledImage slide={slideRight} visible={hover} className="col-sm-3">
          <Image
            className="img-responsive"
            src={require(`${imagePath + image}`)}
            alt=""
          />
        </StyledImage>
      )
    case true:
      return (
        <StyledImage slide={slideLeft} visible={hover} className="col-sm-3">
          <Image
            className="img-responsive"
            src={require(`${imagePath + image}`)}
            alt=""
          />
        </StyledImage>
      )
    default:
      break
  }
}

export default ProjectItemImage

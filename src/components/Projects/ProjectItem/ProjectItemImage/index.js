import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import Img from 'gatsby-image'

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
  float: left;
  position: relative;
  left: 100%;
  opacity: 0;
  width: 25%;
  padding-right: 0px;
  animation: ${(props) => props.slide} 0.5s forwards;
  opacity: ${(props) => (props.slide ? 1 : 0)};

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
`

const Image = styled(Img)`
  border-radius: 5px;

  @media screen and (max-width: 667px) {
    position: absolute;
    top: -75px;
  }
`

const ProjectItemImage = ({ hover, image, title }) => {
  return (
    <StyledImage
      slide={hover === null ? 'none' : hover ? slideLeft : slideRight}
      visible={hover}
    >
      <Image fluid={image.childImageSharp.fluid} alt={`Logo for ${title}`} />
    </StyledImage>
  )
}

export default ProjectItemImage

ProjectItemImage.propTypes = {
  hover: PropTypes.bool,
  image: PropTypes.shape({
    childImageSharp: PropTypes.shape({
      fluid: PropTypes.object,
    }),
  }),
  title: PropTypes.string,
}

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'

import ProjectItemImage from './ProjectItemImage'

const StyledProjectItem = styled.a`
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.5s;
  border-radius: 5px;
  color: ${(props) => (props.nightMode ? colors.gallery : colors.black)};
  font-size: 1.6rem;

  &:hover,
  &:focus {
    color: ${(props) => (props.nightMode ? colors.gallery : colors.black)};
    text-decoration: none;
  }

  &:hover {
    background-color: ${hexToRGB(colors.gothic, 0.2)};
  }

  &:visited {
    background-color: none;
  }

  @media screen and (max-width: 991px) {
    &:hover,
    &:visited {
      background-color: transparent;
    }
  }

  @media screen and (max-width: 667px) {
    flex-direction: column;
  }
`

const ProjectHeading = styled.div`
  font-family: 'Lato';
  font-weight: bold;
  font-size: 1.65rem;
`

const ProjectItem = ({ title, description, href, image }) => {
  const [isHovered, setIsHovered] = useState(null)

  const hoverItem = () => {
    setIsHovered(!isHovered)
  }
  return (
    <StyledProjectItem
      className="row"
      href={href}
      target="_blank"
      rel="noopener"
      onMouseEnter={hoverItem}
      onMouseLeave={hoverItem}
      onFocus={hoverItem}
      onBlur={hoverItem}
    >
      <ProjectItemImage hover={isHovered} image={image} title={title} />
      <div className="col">
        <ProjectHeading>{title}</ProjectHeading>
        <div>{description}</div>
      </div>
    </StyledProjectItem>
  )
}

export default ProjectItem

ProjectItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
}

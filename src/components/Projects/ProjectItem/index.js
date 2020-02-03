import React, { useState } from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'

import AppContext from '../../../context'

import ProjectItemImage from './ProjectItemImage'

const StyledProjectItem = styled.a`
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.5s;
  border-radius: 5px;
  color: ${props => (props.nightMode ? colors.gallery : colors.black)};
  font-size: 1.6rem;

  &:hover,
  &:focus {
    color: ${props => (props.nightMode ? colors.gallery : colors.black)};
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
  const [isHovered, setIsHovered] = useState(false)

  const hoverItem = () => {
    setIsHovered(!isHovered)
  }

  return (
    <AppContext.Consumer>
      {context => (
        <StyledProjectItem
          className="row"
          href={href}
          target="_blank"
          rel="noopener"
          onMouseEnter={hoverItem}
          onMouseLeave={hoverItem}
          onFocus={hoverItem}
          onBlur={hoverItem}
          nightMode={context.nightMode}
        >
          <ProjectItemImage hover={isHovered} image={image} title={title} />
          <div className="col-xs-12">
            <ProjectHeading>{title}</ProjectHeading>
            <div>{description}</div>
          </div>
        </StyledProjectItem>
      )}
    </AppContext.Consumer>
  )
}

export default ProjectItem

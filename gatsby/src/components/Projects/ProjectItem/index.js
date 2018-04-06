import React, { Component } from 'react'
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
  overflow: hidden;
  transition: all 0.5s;
  border-radius: 5px;
  color: ${colors.black};
  font-size: 1.6rem;

  &:hover,
  &:focus {
    color: ${colors.black};
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

  @media screen and (max-width: 736px) {
    flex-direction: column;
  }
`

const ProjectHeading = styled.div`
  font-family: 'Lato';
  font-weight: bold;
  font-size: 1.65rem;
`

class ProjectItem extends Component {
  constructor(props) {
    super(props)
    this.state = { hover: null }

    this.hoverItem = this.hoverItem.bind(this)
  }
  hoverItem() {
    this.setState(prevState => ({
      hover: !prevState.hover,
    }))
  }
  render() {
    const { title, description, href, image } = this.props
    return (
      <StyledProjectItem
        className="row"
        href={href}
        target="_blank"
        onMouseEnter={this.hoverItem}
        onMouseLeave={this.hoverItem}
      >
        <ProjectItemImage hover={this.state.hover} image={image} />
        <div className="col-sm-12">
          <ProjectHeading>{title}</ProjectHeading>
          <div>{description}</div>
        </div>
      </StyledProjectItem>
    )
  }
}

export default ProjectItem

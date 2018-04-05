import React, { Component } from 'react'

import './index.sass'

import ProjectItemImage from './ProjectItemImage'

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
      <a
        className="project-item row"
        href={href}
        target="_blank"
        onMouseEnter={this.hoverItem}
        onMouseLeave={this.hoverItem}
      >
        <ProjectItemImage hover={this.state.hover} image={image} />
        <div className="col-sm-12 project-description">
          <div className="project-heading">{title}</div>
          <div className="project-description">{description}</div>
        </div>
      </a>
    )
  }
}

export default ProjectItem

import React from 'react'

const ProjectItem = ({ title, description, href, image }) => (
  <a className="project-item row" href={href} target="_blank">
    <div className="col-sm-3 project-image">
      <img className="img-responsive" src={image} alt="" />
    </div>
    <div className="col-sm-12 project-description">
      <div className="project-heading">{title}</div>
      <div className="project-description">{description}</div>
    </div>
  </a>
)

export default ProjectItem

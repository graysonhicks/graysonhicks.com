import React from 'react'
import ProjectItem from './ProjectItem'
import Heading from '../Heading'

const Projects = props => {
  const workItems = props.projects
    .filter(({ node }) => node.work)
    .map(project => <ProjectItem key={project.node.title} {...project.node} />)

  const projectItems = props.projects
    .filter(({ work }) => work !== true)
    .map(project => <ProjectItem key={project.node.title} {...project.node} />)

  return (
    <React.Fragment>
      <Heading>Work</Heading>
      {workItems}
      <Heading>Projects</Heading>
      {projectItems}
    </React.Fragment>
  )
}

export default Projects

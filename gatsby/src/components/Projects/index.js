import React from 'react'

import { projects } from './projects'
import ProjectItem from '../ProjectItem'

const Projects = props => {
  const items = projects.map(project => <ProjectItem {...project} />)

  return <React.Fragment>{items}</React.Fragment>
}

export default Projects

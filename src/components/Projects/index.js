import React from 'react';
import ProjectItem from './ProjectItem';

const Projects = props => {
  const items = props.projects.map(project => (
    <ProjectItem key={project.node.title} {...project.node} />
  ));

  return <React.Fragment>{items}</React.Fragment>;
};

export default Projects;

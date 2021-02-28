import React from 'react'
import ProjectItem from './ProjectItem'
import Heading from '../Heading'
import { graphql, useStaticQuery } from 'gatsby'

const Projects = () => {
  const { allProjectsJson } = useStaticQuery(graphql`
    query IndexQuery {
      allProjectsJson {
        edges {
          node {
            title
            description
            href
            work
            image {
              childImageSharp {
                fluid(maxWidth: 400) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  `)

  const workItems = allProjectsJson.edges
    .filter(({ node }) => node.work)
    .map((project) => (
      <ProjectItem key={project.node.title} {...project.node} />
    ))

  const projectItems = allProjectsJson.edges
    .filter(({ node }) => !node.work)
    .map((project) => (
      <ProjectItem key={project.node.title} {...project.node} />
    ))

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

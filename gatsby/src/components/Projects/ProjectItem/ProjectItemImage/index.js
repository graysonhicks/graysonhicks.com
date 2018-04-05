import React, { Component } from 'react'

const imagePath = './thumbs/'

const StartingImage = ({ image }) => {
  return (
    <div className="col-sm-3 project-image">
      <img
        className="img-responsive"
        src={require(`${imagePath + image}`)}
        alt=""
      />
    </div>
  )
}

const UnHoveredImage = ({ image }) => (
  <div className="col-sm-3 project-image slide-right">
    <img
      className="img-responsive"
      src={require(`${imagePath + image}`)}
      alt=""
    />
  </div>
)

const HoveredImage = ({ image }) => (
  <div className="col-sm-3 project-image slide">
    <img
      className="img-responsive"
      src={require(`${imagePath + image}`)}
      alt=""
    />
  </div>
)

const ProjectItemImage = ({ hover, image }) => {
  switch (hover) {
    case null:
      return <StartingImage image={image} />
      break
    case false:
      return <UnHoveredImage image={image} />
    case true:
      return <HoveredImage image={image} />
    default:
      break
  }
}

export default ProjectItemImage

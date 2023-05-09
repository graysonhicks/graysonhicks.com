import React from 'react'
import PropTypes from 'prop-types'
import { GatsbyImage } from 'gatsby-plugin-image'
import * as styles from './index.module.scss'

const ProjectItemImage = ({ hover, image, title }) => {
  return (
    <div
      className={`${styles.styledImage} ${
        hover === null ? '' : hover ? styles.slideLeft : styles.slideRight
      }`}
      style={{ '--opacity': hover === null ? 0 : 1 }}
    >
      <GatsbyImage
        image={image.childImageSharp.gatsbyImageData}
        alt={`Logo for ${title}`}
        className={styles.image}
      />
    </div>
  )
}

export default ProjectItemImage

ProjectItemImage.propTypes = {
  hover: PropTypes.bool,
  image: PropTypes.shape({
    childImageSharp: PropTypes.shape({
      gatsbyImageData: PropTypes.object,
    }),
  }),
  title: PropTypes.string,
}

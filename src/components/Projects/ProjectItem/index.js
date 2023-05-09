'use client'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as styles from './index.module.scss'

import ProjectItemImage from './ProjectItemImage'

const ProjectItem = ({ title, description, href, image }) => {
  const [isHovered, setIsHovered] = useState(null)

  const hoverItem = () => {
    setIsHovered(!isHovered)
  }
  return (
    <a
      className={`${styles.projectItem} row`}
      href={href}
      target="_blank"
      rel="noopener"
      onMouseEnter={hoverItem}
      onMouseLeave={hoverItem}
      onFocus={hoverItem}
      onBlur={hoverItem}
    >
      <ProjectItemImage hover={isHovered} image={image} title={title} />
      <div className="col">
        <div className={styles.projectHeading}>{title}</div>
        <div>{description}</div>
      </div>
    </a>
  )
}

export default ProjectItem

ProjectItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
}

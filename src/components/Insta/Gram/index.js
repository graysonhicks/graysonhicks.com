import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { GatsbyImage } from 'gatsby-plugin-image'
import { TiHeartOutline } from 'react-icons/ti'
import { TiSocialInstagram } from 'react-icons/ti'

import * as styles from './index.module.scss'

const Gram = ({ id, localFile, caption, likes, top }) => {
  const [isHovered, setIsHovered] = useState(false)
  const hoverItem = () => {
    setIsHovered(true)
  }
  const unHoverItem = () => {
    setIsHovered(false)
  }
  return (
    <div
      className={styles.instaItem}
      onMouseOver={hoverItem}
      onMouseOut={unHoverItem}
      onFocus={hoverItem}
      onBlur={unHoverItem}
    >
      <a
        className={styles.styledImageLink}
        href={`https://www.instagram.com/p/${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GatsbyImage
          className={styles.image}
          image={localFile.childImageSharp.gatsbyImageData}
          loading={top ? 'eager' : 'lazy'}
          alt={caption}
        />
        <div
          className={styles.gradient}
          style={{ height: isHovered ? '0%' : '100%' }}
        >
          <div className={styles.gradientBackground}></div>
        </div>
        <div
          className={styles.instaText}
          style={{ opacity: isHovered ? 0 : 1 }}
        >
          {caption}
        </div>
        <div className={styles.likes} style={{ opacity: isHovered ? 0 : 1 }}>
          {likes}
          <TiHeartOutline className={styles.styledLikeIcon} />
        </div>
      </a>
      <TiSocialInstagram
        className={styles.styledInstagramIcon}
        style={{ opacity: isHovered ? 0 : 1 }}
      />
    </div>
  )
}

export default Gram

Gram.propTypes = {
  id: PropTypes.string,
  localFile: PropTypes.object,
  caption: PropTypes.string,
  likes: PropTypes.number,
  top: PropTypes.bool,
}

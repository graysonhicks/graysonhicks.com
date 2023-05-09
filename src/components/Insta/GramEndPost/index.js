import React from 'react'
import { TiSocialInstagram } from 'react-icons/ti'
import * as styles from './index.module.scss'

const GramEndPost = () => {
  return (
    <a
      className={styles.gramEndPost}
      href="http://instagram.com/jamesgraysonhicks/"
      target="_blank"
      rel="noopener"
    >
      go to instagram <TiSocialInstagram className={styles.instagramIcon} />
    </a>
  )
}

export default GramEndPost

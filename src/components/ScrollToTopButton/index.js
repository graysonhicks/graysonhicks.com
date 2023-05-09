'use client'
import React from 'react'
import ScrollTop from 'react-scrolltop-button'
import * as styles from './index.module.scss'

const ScrollTopButton = () => {
  return <ScrollTop className={styles.scrollTop} distance={100} speed={400} />
}

export default ScrollTopButton

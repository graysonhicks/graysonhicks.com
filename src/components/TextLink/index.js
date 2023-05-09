import React from 'react'
import * as styles from './index.module.scss'

const TextLink = ({ children, ...rest }) => (
  <a {...rest} className={styles.textLink}>
    {children}
  </a>
)

export default TextLink

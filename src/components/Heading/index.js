import React from 'react'
import * as styles from './index.module.scss'

const handleFontSize = (level) => {
  switch (level) {
    case 1:
      return '3rem'
    default:
      return '2rem'
  }
}

const Heading = ({ level, children }) => {
  const TagName = `h${level}`
  return (
    <TagName
      className={styles.heading}
      style={{ fontSize: handleFontSize(level) }}
    >
      {children}
    </TagName>
  )
}

Heading.defaultProps = {
  level: 2,
}

export default Heading

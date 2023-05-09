import React from 'react'
import { childrenPropType } from '../../utils'

import * as styles from './index.module.scss'

const Paragraph = ({ children, ...rest }) => (
  <p className={styles.paragraph} {...rest}>
    {children}
  </p>
)

export default Paragraph

Paragraph.propTypes = {
  children: childrenPropType,
}

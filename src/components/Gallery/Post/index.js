import React from 'react'
import { childrenPropType } from '../../../utils'

import * as styles from './index.module.scss'

const Post = ({ children }) => <div className={styles.post}>{children}</div>

export default Post

Post.propTypes = {
  children: childrenPropType,
}

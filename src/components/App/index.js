import React from 'react'

import { childrenPropType } from '../../utils'

import * as styles from './index.module.scss'

const App = ({ children }) => (
  <div className={styles.wrapper}>
    <div className={`container ${styles.styledApp}`}>{children}</div>
  </div>
)

export default App

App.propTypes = {
  children: childrenPropType,
}

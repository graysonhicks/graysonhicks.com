import React from 'react'

import * as styles from './index.module.scss'

const Interests = () => (
  <div className="row">
    <div className="col-6">
      <ul className={styles.interests}>
        <li>TypeScript</li>
        <li>JavaScript</li>
        <li>React</li>
      </ul>
    </div>
    <div className="col-6">
      <ul className={styles.interests}>
        <li>Three.js</li>
        <li>Arduino</li>
        <li>GraphQL</li>
      </ul>
    </div>
  </div>
)

export default Interests

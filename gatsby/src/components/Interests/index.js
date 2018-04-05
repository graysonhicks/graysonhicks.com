import React from 'react'

import './index.sass'

const Interests = props => (
  <div className="row">
    <div className="col-xs-6">
      <ul className="interests">
        <li>react suspense</li>
        <li>machine learning</li>
        <li>drupal</li>
        <li>ES2016</li>
      </ul>
    </div>
    <div className="col-xs-6">
      <ul className="interests">
        <li>ARKit</li>
        <li>ReactVR</li>
        <li>arduino</li>
        <li>websockets</li>
      </ul>
    </div>
  </div>
)

export default Interests

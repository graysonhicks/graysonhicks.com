import React from 'react'
import styled from 'styled-components'

const InterestList = styled.ul`
  font-size: 1.6rem;
`

const Interests = props => (
  <div className="row">
    <div className="col-xs-6">
      <InterestList>
        <li>react suspense</li>
        <li>machine learning</li>
        <li>drupal</li>
        <li>ES2016</li>
      </InterestList>
    </div>
    <div className="col-xs-6">
      <InterestList>
        <li>ARKit</li>
        <li>ReactVR</li>
        <li>arduino</li>
        <li>websockets</li>
      </InterestList>
    </div>
  </div>
)

export default Interests

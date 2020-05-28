import React from 'react'
import styled from 'styled-components'

const InterestList = styled.ul`
  font-size: 1.6rem;
`

const Interests = props => (
  <div className="row">
    <div className="col-xs-6">
      <InterestList>
        <li>React Suspense</li>
        <li>Machine Learning</li>
        <li>TypeScript</li>
        <li>JavaScript</li>
      </InterestList>
    </div>
    <div className="col-xs-6">
      <InterestList>
        <li>AR</li>
        <li>ReactVR</li>
        <li>Arduino</li>
        <li>GraphQL</li>
      </InterestList>
    </div>
  </div>
)

export default Interests

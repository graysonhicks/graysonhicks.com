import React from 'react'
import styled from 'styled-components'

const InterestList = styled.ul`
  font-size: 1.6rem;
`

const Interests = () => (
  <div className="row">
    <div className="col-xs-6">
      <InterestList>
        <li>TypeScript</li>
        <li>JavaScript</li>
        <li>React</li>
      </InterestList>
    </div>
    <div className="col-xs-6">
      <InterestList>
        <li>Three.js</li>
        <li>Arduino</li>
        <li>GraphQL</li>
      </InterestList>
    </div>
  </div>
)

export default Interests

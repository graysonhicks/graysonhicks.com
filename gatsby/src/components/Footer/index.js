import React from 'react'

import Heading from '../Heading'
import Paragraph from '../Paragraph'

const Footer = props => (
  <React.Fragment>
    <div className="row">
      <div className="col-xs-12">
        <Heading>contact</Heading>
        <Paragraph>
          Feel free to contact me for whatever! <br />
          <a className="link" href="mailto:graysonhicks@gmail.com">
            graysonhicks@gmail.com
          </a>{' '}
          <br />
          <a className="link" href="tel:8039171953">
            (803) 917-1953
          </a>
        </Paragraph>
      </div>
    </div>
    <div className="row">
      <div className="col-xs-12 text-center">
        <span>&#169; </span>
        <span className="year-container">{new Date().getFullYear()}</span>
      </div>
    </div>
  </React.Fragment>
)

export default Footer

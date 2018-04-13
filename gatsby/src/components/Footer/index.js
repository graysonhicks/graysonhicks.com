import React from 'react'

import Heading from '../Heading'
import Paragraph from '../Paragraph'
import TextLink from '../TextLink'

const Footer = props => (
  <footer className="col-md-10">
    <div className="row">
      <div className="col-md-10 col-md-offset-2">
        <Heading>contact</Heading>
        <Paragraph>
          Feel free to contact me for whatever! <br />
          <TextLink href="mailto:graysonhicks@gmail.com">
            graysonhicks@gmail.com
          </TextLink>{' '}
          <br />
          <TextLink href="tel:8039171953">(803) 917-1953</TextLink>
        </Paragraph>
      </div>
    </div>
    <div className="row">
      <div className="col-xs-12 text-center">
        <span>&#169; </span>
        <span className="year-container">{new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>
)

export default Footer

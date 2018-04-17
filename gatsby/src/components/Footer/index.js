import React from 'react'
import styled from 'styled-components'

import Heading from '../Heading'
import Paragraph from '../Paragraph'
import TextLink from '../TextLink'

const StyledFooter = styled.footer`
  @media screen and (max-width: 991px) {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }

  @media screen and (max-width: 667px) {
    padding-left: 15px !important;
    padding-right: 15px !important;
    margin-top: 25px;
  }
`

const Footer = props => (
  <StyledFooter className="col-md-12">
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
      <div className="col-md-10 col-md-offset-2 text-center">
        <span>&#169; </span>
        <span className="year-container">{new Date().getFullYear()}</span>
      </div>
    </div>
  </StyledFooter>
)

export default Footer

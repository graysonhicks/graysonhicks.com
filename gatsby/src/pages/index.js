import React from 'react'

import Heading from '../components/Heading'
import Paragraph from '../components/Paragraph'
import Loader from '../components/Loader'
import Projects from '../components/Projects'
import Interests from '../components/Interests'

const IndexPage = () => (
  <div id="main-content">
    <div className="row">
      <div className="col-xs-12">
        <Heading>about</Heading>
        <Paragraph>
          No matter the platform or language, I like to build software (dreams
          of hardware, too). I am interested in and passionate about solving
          problems with all things technical.
        </Paragraph>
        <Paragraph>
          I am currently a front-end developer for a{' '}
          <a className="link" href="https://www.mediacurrent.com">
            full-service enterprise web agency
          </a>, developing world-class web software. I live outside Brevard, NC
          with my wife, four sons, and one daughter. We love to garden, hike and
          catch salamanders.
        </Paragraph>
      </div>
    </div>
    <div className="row">
      <div className="col-xs-12">
        <Heading>current interests</Heading>
        <Paragraph>
          These are my favorite things I am presently learning or actively
          making an effort to include in projects/work:
        </Paragraph>
        <Interests />
      </div>
    </div>
    <div className="row">
      <div className="col-xs-12">
        <Heading>projects / work</Heading>
        <Projects />
      </div>
    </div>
  </div>
)

export default IndexPage
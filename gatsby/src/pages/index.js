import React from 'react'

import Header from '../components/Header'
import Ribbon from '../components/Ribbon'
import Sidebar from '../components/Sidebar'
import Heading from '../components/Heading'
import Paragraph from '../components/Paragraph'
import Loader from '../components/Loader'
import Projects from '../components/Projects'

const IndexPage = () => (
  <div id="app-container" className="container">
    <Ribbon />
    <Header />
    <div className="row">
      <div className="col-md-2">
        <Sidebar />
      </div>
      <div className="col-md-10">
        <div id="blog-content">
          <Loader />
        </div>
        <div id="main-content">
          <div className="row">
            <div className="col-xs-12">
              <Heading>about</Heading>
              <Paragraph>
                No matter the platform or language, I like to build software
                (dreams of hardware, too). I am interested in and passionate
                about solving problems with all things technical.
              </Paragraph>
              <Paragraph>
                I am currently a front-end developer for a{' '}
                <a className="link" href="https://www.mediacurrent.com">
                  full-service enterprise web agency
                </a>, developing world-class web software. I live outside
                Brevard, NC with my wife, four sons, and one daughter. We love
                to garden, hike and catch salamanders.
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
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <Heading>projects / work</Heading>
              <Projects />
            </div>
          </div>

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
              <span className="year-container" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default IndexPage

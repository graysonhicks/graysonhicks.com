import React from 'react'
import Link from 'gatsby-link'

import Header from '../components/Header'
import Ribbon from '../components/Ribbon'

const IndexPage = () => (
  <div id="app-container" className="container">
    <Ribbon />

    <Header />
    <div className="row">
      <div className="col-md-2">
        <ul className="social-list list-unstyled">
          <li className="social-list-items">
            <a id="home-link" href="#">
              home
            </a>
          </li>
          <li className="social-list-items">
            <a target="_blank" href="https://github.com/graysonhicks">
              github
            </a>
          </li>
          <li className="social-list-items">
            <a
              id="resume-link"
              target="_blank"
              href="GraysonHicksResumeSoftwareDeveloper2017.pdf"
            >
              resume
            </a>
          </li>
          <li className="social-list-items">
            <a id="blog-link" href="#">
              blog
            </a>
          </li>
          <li className="social-list-items">
            <a target="_blank" href="https://instagram.com/jamesgraysonhicks">
              insta<span className="hidden-xs">gram</span>
            </a>
          </li>
          <li className="social-list-items">
            <a target="_blank" href="https://twitter.com/graysonhicks">
              twitter
            </a>
          </li>
        </ul>
      </div>
      <div className="col-md-10">
        <div id="blog-content">
          <div id="loading-spinner" className="heading">
            <div className="letter-holder">
              <div className="l-1 letter">L</div>
              <div className="l-2 letter">o</div>
              <div className="l-3 letter">a</div>
              <div className="l-4 letter">d</div>
              <div className="l-5 letter">i</div>
              <div className="l-6 letter">n</div>
              <div className="l-7 letter">g</div>
              <div className="l-8 letter">.</div>
              <div className="l-9 letter">.</div>
              <div className="l-10 letter">.</div>
            </div>
          </div>
        </div>
        <div id="main-content">
          <div className="row">
            <div className="col-xs-12">
              <div className="heading">about</div>
              <p className="descriptions">
                No matter the platform or language, I like to build software
                (dreams of hardware, too). I am interested in and passionate
                about solving problems with all things technical.
              </p>
              <p className="descriptions">
                I am currently a front-end developer for an{' '}
                <a className="link" href="https://www.mediacurrent.com">
                  full-service enterprise web agency
                </a>, developing world-class web software. I live outside
                Brevard, NC with my wife, four sons, and one daughter. We love
                to garden, hike and catch salamanders.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="heading">current interests</div>
              <p className="descriptions">
                These are my favorite things I am presently learning or actively
                making an effort to include in projects/work:
              </p>
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
              <div className="heading">projects / work</div>
              <a
                className="project-item row"
                href="https://www.mediacurrent.com"
                target="_blank"
              >
                <div className="col-sm-3 project-image">
                  <img
                    className="img-responsive"
                    src="images/mcthumb.png"
                    alt=""
                  />
                </div>
                <div className="col-sm-12 project-description">
                  <div className="project-heading">
                    mediacurrent.com (2018 - present)
                  </div>
                  <div className="project-description">
                    Front-end developer on a large distributed team. Building
                    enterprise level websites using cutting edge front-end tools
                    built around a strong team of Drupal developmers.
                  </div>
                </div>
              </a>
              <a
                className="project-item row"
                href="https://www.virtualjobshadow.com"
                target="_blank"
              >
                <div className="col-sm-3 project-image">
                  <img
                    className="img-responsive"
                    src="images/vjsthumb.png"
                    alt=""
                  />
                </div>
                <div className="col-sm-12 project-description">
                  <div className="project-heading">
                    virtualjobshadow.com (2016 - 2018)
                  </div>
                  <div className="project-description">
                    On a small development team for a thriving ed-tech SaaS.
                    Responsible for full feature builds, from the browser to the
                    database and covered with tests. A handrolled JS front-end
                    framework, effective libraries when needed, PHP on the
                    backend, and SQL for the database.
                  </div>
                </div>
              </a>
              <a
                className="project-item row"
                href="http://www.parkary.com"
                target="_blank"
              >
                <div className="col-sm-3 project-image">
                  <img
                    className="img-responsive"
                    src="images/parkarythumb.png"
                    alt=""
                  />
                </div>
                <div className="col-sm-12 project-description">
                  <div className="project-heading">parkary.com</div>
                  <div className="project-description">
                    A platform for exploring and rating city parks across the
                    country. Built with React, Backbone, Parse and Heroku
                  </div>
                </div>
              </a>
              <a
                className="project-item row"
                href="https://graysonhicks.github.io/vrWorkplace/"
                target="_blank"
              >
                <div className="col-sm-3 project-image">
                  <img
                    className="img-responsive"
                    src="images/vrworkplacethumb.jpg"
                    alt=""
                  />
                </div>
                <div className="col-sm-12 project-description">
                  <div className="project-heading">vrWorkplace</div>
                  <div className="project-description">
                    A ReactVR project allowing the user to choose a workplace,
                    enter a 360 view of the workplace, and select an view
                    'hotpoints' related to that career.
                  </div>
                </div>
              </a>
              <a
                className="project-item row"
                href="https://graysonhicks.github.io/pallypal/"
                target="_blank"
              >
                <div className="col-sm-3 project-image">
                  <img
                    className="img-responsive"
                    src="images/pallypal.jpg"
                    alt=""
                  />
                </div>
                <div className="col-sm-12 project-description">
                  <div className="project-heading">pallypal</div>
                  <div className="project-description">
                    Web based canvas tool to create color palettes that export
                    stylesheet files with semantically named color variables.
                    Built using JS, with a node.js/express server on heroku.
                    Also offered as an npm package.
                  </div>
                </div>
              </a>
              <a
                className="project-item row"
                href="https://graysonhicks.github.io/sanctum-ipsum/"
                target="_blank"
              >
                <div className="col-sm-3 project-image">
                  <img
                    className="img-responsive"
                    src="images/sanctumthumb.png"
                    alt=""
                  />
                </div>
                <div className="col-sm-12 project-description">
                  <div className="project-heading">sanctum ipsum</div>
                  <div className="project-description">
                    A site based Catholic lorem ipsum generate made with React.
                    Also offers a node.js based API for use within projects, as
                    well as an npm package.
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <div className="heading">contact</div>
              <p className="descriptions">
                Feel free to contact me for whatever! <br />
                <a className="link" href="mailto:graysonhicks@gmail.com">
                  graysonhicks@gmail.com
                </a>{' '}
                <br />
                <a className="link" href="tel:8039171953">
                  (803) 917-1953
                </a>
              </p>
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

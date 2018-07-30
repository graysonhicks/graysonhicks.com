import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

import globalStyles from '../../styles/globalStyles'
// setting bootstrap css in helmet for now

import SiteMetaDataHelmet from '../SiteMetaDataHelmet'

import App from '../App'

import Header from '../Header'
import Footer from '../Footer'
import Ribbon from '../Ribbon'
import Sidebar from '../Sidebar'
import SkipLink from '../SkipLink'
import StyledScrollTop from '../ScrollToTopButton'

import '../../styles/bootstrap.scss'

import AppContext from '../../context'

class TemplateWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nightMode: false,
    }

    this.switch = this.switch.bind(this)
  }
  switch() {
    this.setState(prevState => ({
      nightMode: !prevState.nightMode,
    }))
  }
  render() {
    return (
      <React.Fragment>
        <AppContext.Provider
          value={{
            nightMode: this.state.nightMode,
            switch: this.switch,
          }}
        >
          <SiteMetaDataHelmet />
          <App>
            <SkipLink />
            <Ribbon />
            <StaticQuery
              query={graphql`
                query LayoutQuery {
                  file(relativePath: { eq: "headshot.jpg" }) {
                    childImageSharp {
                      fixed(width: 150, height: 150) {
                        ...GatsbyImageSharpFixed
                      }
                    }
                  }
                }
              `}
              render={data => <Header headshot={data.file} />}
            />

            <div className="row">
              <div className="col-md-2">
                <Sidebar />
              </div>
              <main id="main" tabIndex="-1" className="col-md-10">
                {this.props.children}
              </main>
              <Footer />
              <StyledScrollTop />
            </div>
          </App>
        </AppContext.Provider>
      </React.Fragment>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.object,
}

export default TemplateWrapper

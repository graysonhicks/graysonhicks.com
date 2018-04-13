import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import globalStyles from '../styles/globalStyles'
// setting bootstrap css in helmet for now
// import '../styles/bootstrap.sass'

import SiteMetaDataHelmet from '../components/SiteMetaDataHelmet'

import App from '../components/App'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Ribbon from '../components/Ribbon'
import Sidebar from '../components/Sidebar'
import SkipLink from '../components/SkipLink'

import '../styles/bootstrap.scss'

import AppContext from '../context'

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
    console.log(this.props.data)

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
            <Header headshot={this.props.data.file} />
            <div className="row">
              <div className="col-md-2">
                <Sidebar />
              </div>
              <main id="main" tabIndex="-1" className="col-md-10">
                {this.props.children()}
              </main>
              <Footer />
            </div>
          </App>
        </AppContext.Provider>
      </React.Fragment>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

export const LayoutQuery = graphql`
  query LayoutQuery {
    file(relativePath: { eq: "headshot.jpg" }) {
      childImageSharp {
        resolutions(width: 150, height: 150) {
          ...GatsbyImageSharpResolutions
        }
      }
    }
  }
`

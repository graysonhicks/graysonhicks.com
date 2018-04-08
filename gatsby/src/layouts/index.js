import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import globalStyles from '../styles/globalStyles'
// import '../styles/bootstrap.sass'

import SiteMetaDataHelmet from '../components/SiteMetaDataHelmet'

import App from '../components/App'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Ribbon from '../components/Ribbon'
import Sidebar from '../components/Sidebar'

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
            <Ribbon />
            <Header />
            <div className="row">
              <div className="col-md-2">
                <Sidebar />
              </div>
              <div className="col-md-10">
                {this.props.children()}
                <Footer />
              </div>
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

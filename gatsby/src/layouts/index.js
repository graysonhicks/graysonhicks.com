import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import globalStyles from '../styles/globalStyles'
import '../styles/bootstrap.sass'

import SiteMetaDataHelmet from '../components/SiteMetaDataHelmet'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Ribbon from '../components/Ribbon'
import Sidebar from '../components/Sidebar'

const App = styled.div`
  @media screen and (max-width: 991px) {
    position: relative
    overflow-x: hidden
  }
`

const TemplateWrapper = ({ children }) => (
  <React.Fragment>
    <SiteMetaDataHelmet />
    <App className="container">
      <Ribbon />
      <Header />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
          {children()}
          <Footer />
        </div>
      </div>
    </App>
  </React.Fragment>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import './index.sass'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Ribbon from '../components/Ribbon'
import Sidebar from '../components/Sidebar'

const TemplateWrapper = ({ children }) => (
  <React.Fragment>
    <Helmet
      title="Gatsby Default Starter"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <div id="app-container" className="container">
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
    </div>
  </React.Fragment>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

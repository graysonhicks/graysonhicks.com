import React from 'react'
import PropTypes from 'prop-types'
// setting bootstrap css in helmet for now

export { Head } from '../SiteMetaDataHelmet'

import App from '../App'

import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import SkipLink from '../SkipLink'
import StyledScrollTop from '../ScrollToTopButton'

import '../../styles/bootstrap.scss'

const TemplateWrapper = ({ children }) => {
  return (
    <>
      <App>
        <SkipLink />
        <Header />

        <div className="row">
          <div className="col-md-2">
            <Sidebar />
          </div>
          <main id="main" tabIndex="-1" className="col-md-10">
            {children}
          </main>
          <Footer />
          <StyledScrollTop />
        </div>
      </App>
    </>
  )
}

TemplateWrapper.propTypes = {
  children: PropTypes.object,
}

export default TemplateWrapper

import React from 'react'
import PropTypes from 'prop-types'
import GlobalStyle from '../../styles/globalStyles'
// setting bootstrap css in helmet for now

import SiteMetaDataHelmet from '../SiteMetaDataHelmet'

import App from '../App'
// import AppContext from '../../context'

import Header from '../Header'
import Footer from '../Footer'
// import Ribbon from '../Ribbon'
import Sidebar from '../Sidebar'
import SkipLink from '../SkipLink'
import StyledScrollTop from '../ScrollToTopButton'

import '../../styles/bootstrap.scss'

const TemplateWrapper = ({ children }) => {
  // const [nightMode, setNightMode] = useState(false)

  return (
    <>
      <SiteMetaDataHelmet />
      <GlobalStyle />
      <App>
        <SkipLink />
        {/* <Ribbon /> */}
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

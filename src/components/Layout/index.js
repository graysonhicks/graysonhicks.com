import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

import GlobalStyle from '../../styles/globalStyles'
// setting bootstrap css in helmet for now

import SiteMetaDataHelmet from '../SiteMetaDataHelmet'

import App from '../App'
import AppContext from '../../context'

import Header from '../Header'
import Footer from '../Footer'
import Ribbon from '../Ribbon'
import Sidebar from '../Sidebar'
import SkipLink from '../SkipLink'
import StyledScrollTop from '../ScrollToTopButton'

import '../../styles/bootstrap.scss'

const TemplateWrapper = ({ children }) => {
  const [nightMode, setNightMode] = useState(false)

  return (
    <AppContext.Provider
      value={{
        nightMode: nightMode,
        switch: () => setNightMode(!nightMode),
      }}
    >
      <SiteMetaDataHelmet />
       <GlobalStyle />
      <App>
        <SkipLink />
        {/* <Ribbon /> */}
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
            {children}
          </main>
          <Footer />
          <StyledScrollTop />
        </div>
      </App>
    </AppContext.Provider>
  )
}

TemplateWrapper.propTypes = {
  children: PropTypes.object,
}

export default TemplateWrapper

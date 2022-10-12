import React from 'react'
import { Helmet } from 'react-helmet'

import cardPic from './carolina.jpg'

import AppleTouch from './icons/apple-touch-icon.png'
import Favicon32 from './icons/favicon-32x32.png'
import Favicon16 from './icons/favicon-16x16.png'
// import MaskIcon from './icons/safari-pinned-tab.svg'

const SiteMetaDataHelmet = () => (
  <Helmet>
    <meta charset="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="msvalidate.01" content="3A0C9741DD9DFE5995F843F1A416CFC9" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="keywords"
      content="grayson hicks, web developer, react, front end, full stack, remote, asheville, javascript"
    />
    <meta
      name="description"
      content="Modern web development by Grayson Hicks. Exploring front-end, AR, VR, iOS, anything."
    />

    <meta property="og:site_name" content="graysonhicks.com" />
    <meta property="og:title" content="Grayson Hicks | Software Developer" />
    <meta property="og:type" content="website" />
    <meta
      property="og:description"
      content="Modern web development projects and blog by Grayson Hicks. Exploring anything software or hardware."
    />
    <meta property="og:image" content={cardPic} />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="3264" />
    <meta property="og:image:height" content="2446" />
    <meta property="og:url" content="http://www.graysonhicks.com" />

    <meta property="twitter:card" content="summary_large_image" />
    <meta
      property="twitter:title"
      content="Grayson Hicks | Software Developer"
    />
    <meta
      property="twitter:description"
      content="Modern web development projects and blog by Grayson Hicks. Exploring anything software or hardware."
    />
    <meta property="twitter:site" content="@graysonhicks" />
    <meta property="twitter:creator" content="@graysonhicks" />
    <meta property="twitter:url" content="http://www.graysonhicks.com" />
    <meta property="twitter:image:src" content={cardPic} />
    <link rel="apple-touch-icon" sizes="180x180" href={AppleTouch} />
    <link rel="icon" type="image/png" sizes="32x32" href={Favicon32} />
    <link rel="icon" type="image/png" sizes="16x16" href={Favicon16} />
    <link rel="manifest" href="/site.webmanifest" />
    {/* <link rel="mask-icon" href={MaskIcon} color="#5bbad5" /> */}
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />
    <html lang="en" />
    <title>Grayson Hicks | Software Developer</title>
  </Helmet>
)

export default SiteMetaDataHelmet

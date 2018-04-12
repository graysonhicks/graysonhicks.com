import React from 'react'
import { Helmet } from 'react-helmet'

import AppContext from '../../context'
import cardPic from './carolina.jpg'

import Apple57 from './icons/apple-icon-57x57.png'
import Apple60 from './icons/apple-icon-60x60.png'
import Apple72 from './icons/apple-icon-72x72.png'
import Apple76 from './icons/apple-icon-76x76.png'
import AppleTouch114 from './icons/apple-icon-114x114.png'
import AppleTouch120 from './icons/apple-icon-120x120.png'
import AppleTouch144 from './icons/apple-icon-144x144.png'
import AppleTouch152 from './icons/apple-icon-152x152.png'
import AppleTouch180 from './icons/apple-icon-180x180.png'
import Android192 from './icons/android-icon-192x192.png'
import FavIcon32 from './icons/favicon-32x32.png'
import FavIcon96 from './icons/favicon-96x96.png'
import FavIcon16 from './icons/favicon-16x16.png'
import MsIcon144 from './icons/ms-icon-144x144.png'
import manifest from './icons/manifest.json'

const SiteMetaDataHelmet = () => (
  <AppContext.Consumer>
    {context => (
      <Helmet>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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
        <meta
          property="og:title"
          content="Grayson Hicks | Software Developer"
        />
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
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
          crossorigin="anonymous"
        />
        <link rel="apple-touch-icon" sizes="57x57" href={Apple57} />
        <link rel="apple-touch-icon" sizes="60x60" href={Apple60} />
        <link rel="apple-touch-icon" sizes="72x72" href={Apple72} />
        <link rel="apple-touch-icon" sizes="76x76" href={Apple76} />
        <link rel="apple-touch-icon" sizes="114x114" href={AppleTouch114} />
        <link rel="apple-touch-icon" sizes="120x120" href={AppleTouch120} />
        <link rel="apple-touch-icon" sizes="144x144" href={AppleTouch144} />
        <link rel="apple-touch-icon" sizes="152x152" href={AppleTouch152} />
        <link rel="apple-touch-icon" sizes="180x180" href={AppleTouch180} />
        <link rel="icon" type="image/png" sizes="192x192" href={Android192} />
        <link rel="icon" type="image/png" sizes="32x32" href={FavIcon32} />
        <link rel="icon" type="image/png" sizes="96x96" href={FavIcon96} />
        <link rel="icon" type="image/png" sizes="16x16" href={FavIcon16} />
        <link rel="manifest" href="./manifest.json" />
        <meta name="msapplication-config" content="./icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content={MsIcon144} />
        <meta name="theme-color" content="#ffffff" />
        <title>Grayson Hicks | Software Developer</title>
      </Helmet>
    )}
  </AppContext.Consumer>
)

export default SiteMetaDataHelmet

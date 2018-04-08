import React from 'react'
import { Helmet } from 'react-helmet'

import AppContext from '../../context'

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
        <meta
          property="og:image"
          content="https://s3.amazonaws.com/graysonhicks.com/images/carolina.jpg"
        />
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

        <meta
          property="twitter:image:src"
          content="/https://s3.amazonaws.com/graysonhicks.com/images/carolina.jpg"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
          crossorigin="anonymous"
        />
        <title>Grayson Hicks | Software Developer</title>
      </Helmet>
    )}
  </AppContext.Consumer>
)

export default SiteMetaDataHelmet

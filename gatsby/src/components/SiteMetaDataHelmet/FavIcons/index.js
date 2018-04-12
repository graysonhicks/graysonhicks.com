import React from 'react'

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

const FavIcons = () => (
  <React.Fragment>
    <link rel="apple-touch-icon" sizes="57x57" href={Apple57} />
    <link rel="apple-touch-icon" sizes="60x60" href={Apple60} />
    <link rel="apple-touch-icon" sizes="72x72" href={Apple72} />
    <link rel="apple-touch-icon" sizes="76x76" href={Apple76} />
    <link rel="apple-touch-icon" sizes="114x114" href={AppleTouch114} />
    <link rel="apple-touch-icon" sizes="120x120" href={Apple120} />
    <link rel="apple-touch-icon" sizes="144x144" href={Apple144} />
    <link rel="apple-touch-icon" sizes="152x152" href={Apple152} />
    <link rel="apple-touch-icon" sizes="180x180" href={Apple180} />
    <link rel="icon" type="image/png" sizes="192x192" href={Android192} />
    <link rel="icon" type="image/png" sizes="32x32" href={FavIcon32} />
    <link rel="icon" type="image/png" sizes="96x96" href={FavIcon96} />
    <link rel="icon" type="image/png" sizes="16x16" href={FavIcon16} />
    <link rel="manifest" href={manifest} />
    <meta name="msapplication-config" content="./icons/browserconfig.xml" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="msapplication-TileImage" content={MsIcon144} />
    <meta name="theme-color" content="#ffffff" />
  </React.Fragment>
)

export default FavIcons

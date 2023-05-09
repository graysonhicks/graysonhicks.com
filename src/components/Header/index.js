import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

import * as styles from './index.module.scss'

const Header = () => (
  <header className={'row ' + styles.header}>
    <div className="col-sm-2 col-5">
      <div className={styles.headshotContainer}>
        <StaticImage
          alt="Headshot of Grayson Hicks"
          imgStyle={{
            maxHeight: '100px',
            maxWidth: '100px',
          }}
          style={{
            borderRadius: '100%',
          }}
          width={100}
          src="../../images/headshot.jpg"
          loading="eager"
          placeholder="blurred"
        />
      </div>
    </div>
    <div className="col-sm-10 col-7">
      <div className={styles.headshotContainer + ' ' + styles.nameContainer}>
        <h1 className={styles.name}>grayson hicks</h1>
      </div>
    </div>
  </header>
)

export default Header

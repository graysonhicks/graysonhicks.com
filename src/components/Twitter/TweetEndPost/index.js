import React from 'react'
import * as styles from './index.module.scss'

import { TiSocialTwitter } from 'react-icons/ti'

const TweetEndPost = () => {
  return (
    <a
      className={styles.tweetEndPost}
      href="http://twitter.com/graysonhicks/"
      target="_blank"
      rel="noopener"
    >
      go to twitter <TiSocialTwitter className={styles.twitterIcon} />
    </a>
  )
}

export default TweetEndPost

'use client'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { GatsbyImage } from 'gatsby-plugin-image'
import { colors } from '../../../styles/colors'
import { TiSocialTwitter } from 'react-icons/ti'
import * as styles from './index.module.scss'

const Tweet = ({ localImageFile, text, user, id_str }) => {
  const [hover, setHover] = useState(false)

  const hoverItem = () => {
    setHover(!hover)
  }
  return (
    <a
      className={styles.tweet}
      href={`https://twitter.com/graysonhicks/status/${id_str}`}
      onMouseEnter={hoverItem}
      onMouseLeave={hoverItem}
      onFocus={hoverItem}
      onBlur={hoverItem}
    >
      {localImageFile ? (
        <React.Fragment>
          <div>
            <GatsbyImage
              className={styles.image}
              image={localImageFile.childImageSharp.gatsbyImageData}
              style={{
                display: 'block',
              }}
              alt={text}
            />
            <div
              className={styles.gradient}
              style={{ opacity: hover ? 0 : 1 }}
            />
            <img
              className={styles.avatar}
              src={user.profile_image_url_https}
              alt={`Avatar for ${user.screen_name}`}
              style={{ opacity: hover ? 1 : 0 }}
            />
          </div>
          <div
            className={styles.tweetText}
            style={{
              opacity: hover ? 0 : 1,
              bottom: '5%',
              position: 'absolute',
            }}
          >
            {text}
          </div>
          <TiSocialTwitter
            className={styles.twitterIcon}
            style={{ opacity: hover ? 0 : 1 }}
          />
        </React.Fragment>
      ) : (
        <div
          className={styles.noImageTweet}
          style={{
            backgroundColor: hover ? colors.casal : randomBackgroundColor(),
          }}
        >
          <img
            className={styles.avatar}
            src={user.profile_image_url_https}
            alt={`Avatar for ${user.screen_name}`}
            style={{ opacity: hover ? 1 : 0 }}
          />
          <div
            className={styles.tweetText}
            style={{
              position: image ? 'absolute' : 'static',
              bottom: image ? '0' : '5%',
              opacity: hover ? 0 : 1,
            }}
          >
            {text}
          </div>
          <TiSocialTwitter
            className={styles.twitterIcon}
            style={{ opacity: hover ? 0 : 1 }}
          />
        </div>
      )}
    </a>
  )
}

export default Tweet

Tweet.propTypes = {
  user: PropTypes.shape({
    profile_image_url_https: PropTypes.string,
    screen_name: PropTypes.string,
  }),
  localImageFile: PropTypes.object,
  text: PropTypes.string,
  id_str: PropTypes.string,
}

const randomBackgroundColor = () => {
  const tweetBackgroundColors = [
    colors.bismark,
    colors.blueWhale,
    colors.gothic,
  ]
  return tweetBackgroundColors[
    Math.floor(Math.random() * tweetBackgroundColors.length)
  ]
}

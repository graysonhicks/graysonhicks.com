import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { GatsbyImage } from 'gatsby-plugin-image'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'

import TiSocialTwitter from 'react-icons/lib/ti/social-twitter'

const Tweet = ({ localImageFile, text, user, id_str }) => {
  const [hover, setHover] = useState(false)

  const hoverItem = () => {
    setHover(!hover)
  }
  return (
    <StyledTweet
      href={`https://twitter.com/graysonhicks/status/${id_str}`}
      onMouseEnter={hoverItem}
      onMouseLeave={hoverItem}
      onFocus={hoverItem}
      onBlur={hoverItem}
    >
      {localImageFile ? (
        <React.Fragment>
          <ImageTweet>
            <Image
              // eslint-disable-next-line react/prop-types
              image={localImageFile.childImageSharp.gatsbyImageData}
              style={{
                display: 'block',
              }}
              alt={text}
            />
            <Gradient hover={hover ? 1 : 0} />
            <Avatar
              src={user.profile_image_url_https}
              alt={`Avatar for ${user.screen_name}`}
              hover={hover ? 1 : 0}
            />
          </ImageTweet>
          <TweetText image={true} hover={hover ? 1 : 0}>
            {text}
          </TweetText>
          <StyledTwitterIcon hover={hover ? 1 : 0} />
        </React.Fragment>
      ) : (
        <NoImageTweet hover={hover ? 1 : 0} bgColor={randomBackgroundColor()}>
          <Avatar
            src={user.profile_image_url_https}
            alt={`Avatar for ${user.screen_name}`}
            hover={hover ? 1 : 0}
          />
          <TweetText image={false}>{text}</TweetText>
          <StyledTwitterIcon hover={hover ? 1 : 0} />
        </NoImageTweet>
      )}
    </StyledTweet>
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

const StyledTweet = styled.a`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`

const TweetText = styled.div`
  color: ${colors.gallery};
  position: ${(props) => (props.image ? 'absolute' : 'static')};
  padding: 15px;
  font-weight: 600;
  font-size: 1.5rem;
  transition: all 0.5s;
  opacity: ${(props) => (props.hover ? 0 : 1)};
  ${(props) => (props.image ? 'bottom: 5%;' : '')};
  overflow: hidden;
`

const ImageTweet = styled.div``

const Gradient = styled.div`
  background: linear-gradient(
    135deg,
    ${hexToRGB(colors.bismark, 0.7)} 0%,
    ${hexToRGB(colors.gothic, 0.6)} 51%,
    ${hexToRGB(colors.casal, 0.5)} 100%
  );
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  border-radius: 10px;
  transition: all 0.5s;
  opacity: ${(props) => (props.hover ? 0 : 1)};
`

const Avatar = styled.img`
  position: absolute;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  transition: all 0.5s;
  opacity: ${(props) => (props.hover ? 1 : 0)};
`

const StyledTwitterIcon = styled(TiSocialTwitter)`
  color: ${colors.gallery};
  font-size: 3rem;
  position: absolute;
  bottom: 10px;
  right: 10px;
  transition: opacity 0.5s;
  opacity: ${(props) => (props.hover ? 0 : 1)};
`

const TweetBackgroundColors = [colors.bismark, colors.blueWhale, colors.gothic]

const randomBackgroundColor = () => {
  return TweetBackgroundColors[
    Math.floor(Math.random() * TweetBackgroundColors.length)
  ]
}

const NoImageTweet = styled.div`
  transition: all 0.5s;
  background-color: ${(props) => (props.hover ? colors.casal : props.bgColor)};
  border-radius: 5px;
  padding: 10px;
  min-height: 150px;
`

const Image = styled(GatsbyImage)`
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
`

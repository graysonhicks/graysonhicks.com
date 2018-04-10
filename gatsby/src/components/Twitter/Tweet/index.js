import React, { Component } from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'

import TiSocialTwitter from 'react-icons/lib/ti/social-twitter'

const StyledTweet = styled.a`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`

const TweetText = styled.div`
  color: ${colors.gallery};
  position: ${props => (props.image ? 'absolute' : 'static')};
  padding: 15px;
  font-weight: 600;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
  ${props => (props.image ? 'bottom: 5%;' : '')};
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
  border-radius: 5px;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
`

const Avatar = styled.img`
  position: absolute;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 1 : 0)};
`

const StyledTwitterIcon = styled(TiSocialTwitter)`
  color: ${colors.gallery};
  font-size: 3rem;
  position: absolute;
  bottom: 10px;
  right: 10px;
  transition: opacity 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
`

const TweetBackgroundColors = [colors.bismark, colors.blueWhale, colors.gothic]

const randomBackgroundColor = () => {
  return TweetBackgroundColors[
    Math.floor(Math.random() * TweetBackgroundColors.length)
  ]
}

const NoImageTweet = styled.div`
  transition: all 0.5s;
  background-color: ${props => (props.hover ? colors.casal : props.bgColor)};
  border-radius: 5px;
  padding: 10px;
  min-height: 150px;
`

const Image = styled.img`
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
`

class Tweet extends Component {
  constructor(props) {
    super(props)
    this.state = { hover: false, bgColor: randomBackgroundColor() }

    this.hoverItem = this.hoverItem.bind(this)
  }
  hoverItem() {
    this.setState(prevState => ({
      hover: !prevState.hover,
    }))
  }
  render() {
    return (
      <StyledTweet
        href={`https://twitter.com/graysonhicks/status/${this.props.id_str}`}
        onMouseEnter={this.hoverItem}
        onMouseLeave={this.hoverItem}
      >
        {this.props.media ? (
          <React.Fragment>
            <ImageTweet>
              <Image src={this.props.media[0].media_url} alt="" />
              <Gradient hover={this.state.hover} />
              <Avatar
                src={this.props.user.profile_image_url}
                hover={this.state.hover}
              />
            </ImageTweet>
            <TweetText image={true} hover={this.state.hover}>
              {this.props.text}
            </TweetText>
            <StyledTwitterIcon hover={this.state.hover} />
          </React.Fragment>
        ) : (
          <NoImageTweet hover={this.state.hover} bgColor={this.state.bgColor}>
            <Avatar
              src={this.props.user.profile_image_url}
              hover={this.state.hover}
            />
            <TweetText image={false}>{this.props.text}</TweetText>
            <StyledTwitterIcon hover={this.state.hover} />
          </NoImageTweet>
        )}
      </StyledTweet>
    )
  }
}

export default Tweet

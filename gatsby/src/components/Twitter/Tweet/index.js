import React, { Component } from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'

const StyledTweet = styled.a`
  margin: 4px;
  position: relative;
  font-family: montserrat
  &:hover {
    text-decoration: none;
  }
`

const TweetText = styled.div`
  color: ${colors.gallery};
  position: ${props => (props.image ? 'absolute' : 'static')};
  padding: 15px;
  font-weight: 500;
  opacity: ${props => (props.hover ? 0 : 1)};
  ${props => (props.image ? 'bottom: 5%;' : '')};
`

const ImageTweet = styled.div``

const Gradient = styled.div`
  background: linear-gradient(
    to bottom,
    ${hexToRGB(colors.bismark, 0.85)},
    0%,
    ${hexToRGB(colors.casal, 0.64)} 100%
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

const NoImageTweet = styled.div`
  background-color: ${props => (props.hover ? colors.bismark : colors.casal)};
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
    this.state = { hover: false }

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
        {this.props.entities.media ? (
          <React.Fragment>
            <ImageTweet>
              <Image src={this.props.entities.media[0].media_url} alt="" />
              <Gradient hover={this.state.hover} />

              <Avatar
                src={this.props.user.profile_image_url}
                hover={this.state.hover}
              />
            </ImageTweet>
            <TweetText image={true} hover={this.state.hover}>
              {this.props.text}
            </TweetText>
          </React.Fragment>
        ) : (
          <NoImageTweet hover={this.state.hover}>
            <Avatar
              src={this.props.user.profile_image_url}
              hover={this.state.hover}
            />
            <TweetText image={false}>{this.props.text}</TweetText>
          </NoImageTweet>
        )}
      </StyledTweet>
    )
  }
}

export default Tweet
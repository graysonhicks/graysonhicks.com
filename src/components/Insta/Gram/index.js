import React, { Component } from 'react'
import styled from 'styled-components'
import Img from 'gatsby-image'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'
import TiMediaPlay from 'react-icons/lib/ti/media-play'
import TiHeartOutline from 'react-icons/lib/ti/heart-outline'
import TiEject from 'react-icons/lib/ti/eject'
import TiSocialInstagram from 'react-icons/lib/ti/social-instagram'

class Gram extends Component {
  constructor(props) {
    super(props)
    this.state = { hover: false, playing: false }

    this.hoverItem = this.hoverItem.bind(this)
    this.unHoverItem = this.unHoverItem.bind(this)
    this.hoverItem = this.hoverItem.bind(this)
    this.clickItem = this.clickItem.bind(this)
    this.pauseVideo = this.pauseVideo.bind(this)
    this.videoRef = React.createRef()
  }
  componentDidMount() {
    this.setState({
      video: this.videoRef.current,
    })
  }
  hoverItem() {
    this.setState({
      hover: true,
    })
  }
  unHoverItem() {
    this.setState({
      hover: false,
    })

    if (this.state.video) {
      this.pauseVideo()
    }
  }
  clickItem() {
    if (this.state.video) {
      this.clickVideo()
    }
  }
  pauseVideo() {
    this.setState(
      {
        playing: false,
      },
      () => {
        this.state.video.pause()
      }
    )
  }
  playVideo() {
    this.setState(
      {
        playing: true,
      },
      () => {
        this.state.video.play()
      }
    )
  }

  clickVideo() {
    this.state.video.paused ? this.playVideo() : this.pauseVideo()
  }
  render() {
    console.log(this.props)

    return (
      <React.Fragment>
        <InstaItem
          onMouseEnter={this.hoverItem}
          onMouseLeave={this.unHoverItem}
          onFocus={this.hoverItem}
          onBlur={this.unHoverItem}
          onClick={this.clickItem}
        >
          {this.props.video ? (
            <React.Fragment>
              <video
                style={{ width: '100%', borderRadius: '10px' }}
                ref={this.videoRef}
                src={this.props.video}
                alt={this.props.caption}
                poster={this.props.localImageFile.childImageSharp.original.src}
                playsInline
              />
              <Gradient hover={this.state.hover ? 1 : 0} />
              <InstaText hover={this.state.hover ? 1 : 0}>
                {this.props.caption}
              </InstaText>
              <Likes hover={this.state.hover ? 1 : 0}>
                {this.props.likes} <StyledLikeIcon />
              </Likes>
              <a href={this.props.link} target="_blank" rel="noopener">
                <StyledVideoLink hover={this.state.hover ? 1 : 0} />
              </a>
            </React.Fragment>
          ) : (
            <StyledImageLink
              href={this.props.link}
              target="_blank"
              rel="noopener"
            >
              <Image
                sizes={this.props.localImageFile.childImageSharp.sizes}
                alt={this.props.caption}
              />
              <Gradient hover={this.state.hover ? 1 : 0} />
              <InstaText hover={this.state.hover ? 1 : 0}>
                {this.props.caption}
              </InstaText>
              <Likes hover={this.state.hover ? 1 : 0}>
                {this.props.likes} <StyledLikeIcon />
              </Likes>
            </StyledImageLink>
          )}

          {this.props.video ? (
            <StyledPlayIcon playing={this.state.playing ? 1 : 0} />
          ) : (
            ''
          )}
          <StyledInstagramIcon hover={this.state.hover ? 1 : 0} />
        </InstaItem>
      </React.Fragment>
    )
  }
}

export default Gram

const StyledInstagramIcon = styled(TiSocialInstagram)`
  color: ${colors.white};
  opacity: ${props => (props.hover ? 0 : 1)};
  transition: all 0.5s;
  font-size: 3rem;
  position: absolute;
  bottom: 10px;
  right: 10px;
`

const InstaItem = styled.div``

const StyledImageLink = styled.a``

const Gradient = styled.div`
  transition: all 0.5s;
  background: linear-gradient(
    135deg,
    ${hexToRGB(colors.studio, 0.7)} 0%,
    ${hexToRGB(colors.royalBlue, 0.5)} 50%,
    ${hexToRGB(colors.casablanca, 0.4)} 100%
  );
  height: ${props => (props.hover ? '0%' : '100%')};
  width: 100%;
  position: absolute;
  top: 0;
  border-radius: 10px;
  opacity: ${props => (props.hover ? 0 : 1)};
`

const Image = styled(Img)`
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
`

const Video = styled.video`
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
`

const InstaText = styled.div`
  color: ${colors.gallery};
  position: absolute;
  padding: 15px;
  font-weight: 600;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
  bottom: 5%;
`

const Likes = styled.div`
  color: ${colors.gallery};
  font-weight: 600;
  position: absolute;
  top: 5%;
  right: 5%;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
`

const StyledLikeIcon = styled(TiHeartOutline)`
  color: ${colors.gallery};
  font-weight: 600;
`

const StyledPlayIcon = styled(TiMediaPlay)`
  box-sizing: border-box;
  color: ${colors.gallery}
  width: 100%;
  height: 100%;
  padding: 10px calc(50% - 50px);
  position: absolute;
  top: 0;
  left: 0;
  display: ${props => (props.playing ? 'none' : 'block')};
  cursor: pointer;
  transition: opacity 150ms;
`

const StyledVideoLink = styled(TiEject)`
  transform: translate(0, 400);
  transform: scale(-1, 1);
  color: ${colors.gallery};
  font-weight: 600;
  position: absolute;
  bottom: 5%;
  right: 5%;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 1 : 0)};
  font-size: 4rem;
`

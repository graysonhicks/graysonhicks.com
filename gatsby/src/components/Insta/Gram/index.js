import React, { Component } from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'
import TiMediaPlay from 'react-icons/lib/ti/media-play'
import TiHeartOutline from 'react-icons/lib/ti/heart-outline'
import TiEject from 'react-icons/lib/ti/eject'

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

const Image = styled.img`
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
    return (
      <React.Fragment>
        <InstaItem
          onMouseEnter={this.hoverItem}
          onMouseLeave={this.unHoverItem}
          onClick={this.clickItem}
        >
          {this.props.videos ? (
            <React.Fragment>
              <video
                style={{ width: '100%', borderRadius: '10px' }}
                ref={this.videoRef}
                src={this.props.videos.standard_resolution.url}
                poster={this.props.images.standard_resolution.url}
                playsInline
              />
              <Gradient hover={this.state.hover} />
              <InstaText hover={this.state.hover}>
                {this.props.caption.text}
              </InstaText>
              <Likes hover={this.state.hover}>
                {this.props.likes.count} <StyledLikeIcon />
              </Likes>
              <a href={this.props.link} target="_blank">
                {' '}
                <StyledVideoLink hover={this.state.hover} />{' '}
              </a>
            </React.Fragment>
          ) : (
            <StyledImageLink href={this.props.link} target="_blank">
              <Image src={this.props.images.standard_resolution.url} alt="" />
              <Gradient hover={this.state.hover} />
              <InstaText hover={this.state.hover}>
                {this.props.caption.text}
              </InstaText>
              <Likes hover={this.state.hover}>
                {this.props.likes.count} <StyledLikeIcon />
              </Likes>
            </StyledImageLink>
          )}

          {this.props.videos ? (
            <StyledPlayIcon playing={this.state.playing} />
          ) : (
            ''
          )}
        </InstaItem>
      </React.Fragment>
    )
  }
}

export default Gram

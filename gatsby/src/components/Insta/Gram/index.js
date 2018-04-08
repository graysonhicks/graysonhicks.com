import React, { Component } from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'

const StyledInsta = styled.a``

const InstaText = styled.div`
  color: ${colors.gallery};
  position: ${props => (props.image ? 'absolute' : 'static')};
  padding: 15px;
  font-weight: 600;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
  ${props => (props.image ? 'bottom: 5%;' : '')};
`

const InstaItem = styled.div``

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

class Gram extends Component {
  constructor(props) {
    super(props)
    this.state = { hover: false }

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
    this.state.video.pause()
  }
  clickVideo() {
    this.state.video.paused ? this.state.video.play() : this.state.video.pause()
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
            <video
              style={{ width: '100%', borderRadius: '10px' }}
              ref={this.videoRef}
              src={this.props.videos.standard_resolution.url}
              poster={this.props.images.standard_resolution.url}
              playsInline
            />
          ) : (
            <StyledInsta href={this.props.link}>
              <Image src={this.props.images.standard_resolution.url} alt="" />
            </StyledInsta>
          )}
          <Gradient hover={this.state.hover} />
          <InstaText image={true} hover={this.state.hover}>
            {this.props.caption.text}
          </InstaText>
        </InstaItem>
      </React.Fragment>
    )
  }
}

export default Gram

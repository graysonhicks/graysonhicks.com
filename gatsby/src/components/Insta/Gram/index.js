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

const ImageInsta = styled.div``

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
const Image = styled.img`
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
`

class Gram extends Component {
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
      <StyledInsta href={this.props.link}>
        <ImageInsta onMouseEnter={this.hoverItem} onMouseLeave={this.hoverItem}>
          <Image src={this.props.images.standard_resolution.url} alt="" />
          <Gradient hover={this.state.hover} />
        </ImageInsta>
        <InstaText image={true} hover={this.state.hover}>
          {this.props.text}
        </InstaText>
      </StyledInsta>
    )
  }
}

export default Gram

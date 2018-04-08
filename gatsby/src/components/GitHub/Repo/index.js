import React, { Component } from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'

const RepoItem = styled.div``

const StyledImageLink = styled.a``

const Gradient = styled.div`
  transition: all 0.5s;
  background: linear-gradient(
    135deg,
    ${hexToRGB(colors.indigo, 0.7)} 0%,
    ${hexToRGB(colors.butterflyBush, 0.5)} 50%,
    ${hexToRGB(colors.mantis, 0.4)} 100%
  );
  height: ${props => (props.hover ? '0%' : '100%')};
  width: 100%;
  position: absolute;
  top: 0;
  border-radius: 10px;
  opacity: ${props => (props.hover ? 0 : 1)};
`

class Repo extends Component {
  constructor(props) {
    super(props)
    this.state = { hover: false }

    this.hoverItem = this.hoverItem.bind(this)
    this.unHoverItem = this.unHoverItem.bind(this)
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
  }

  render() {
    return (
      <React.Fragment>
        <RepoItem onMouseEnter={this.hoverItem} onMouseLeave={this.unHoverItem}>
          <StyledImageLink href={this.props.link} target="_blank">
            <p>{this.props.name}</p>
            <p>{this.props.description}</p>
            <Gradient hover={this.state.hover} />
          </StyledImageLink>
        </RepoItem>
      </React.Fragment>
    )
  }
}

export default Repo

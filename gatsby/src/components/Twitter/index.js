import React, { Component } from 'react'
import styled from 'styled-components'

import Loader from '../Loader'
import Tweet from './Tweet'
import TweetError from './TweetError'
import TweetSeeMore from './TweetSeeMore'

const GalleryContainer = styled.div`
  width: 100%;
  margin: auto;
`

const TweetsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 25px;
`

const TweetColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: stretch;
  flex-grow: 1;
`

let breakPoints = [516]

const Twitter = ({ posts }) => {
  console.log(posts)

  const items = posts.map(post => (
    <Tweet key={post.node.id_str} {...post.node} />
  ))

  return (
    <GalleryContainer>
      <Gallery breakPoints={breakPoints}>{items}</Gallery>
    </GalleryContainer>
  )
}

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = { columns: 1 }

    this.galleryRef = React.createRef()
    this.onResize = this.onResize.bind(this)
  }
  componentDidMount() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  }

  getColumns(w) {
    return (
      this.props.breakPoints.reduceRight((p, c, i) => {
        return c < w ? p : i
      }, this.props.breakPoints.length) + 1
    )
  }

  onResize() {
    const columns = this.getColumns(this.galleryRef.current.offsetWidth)

    if (columns !== this.state.columns) {
      this.setState({ columns: columns })
    }
  }

  mapChildren() {
    let col = []
    const numC = this.state.columns
    for (let i = 0; i < numC; i++) {
      col.push([])
    }
    return this.props.children.reduce((p, c, i) => {
      p[i % numC].push(c)
      return p
    }, col)
  }

  render() {
    return (
      <div ref={this.galleryRef}>
        <TweetsContainer>
          {this.mapChildren().map((col, ci) => {
            return (
              <TweetColumn key={ci}>
                {col.map((child, i) => {
                  return <React.Fragment key={i}>{child}</React.Fragment>
                })}
              </TweetColumn>
            )
          })}
        </TweetsContainer>
      </div>
    )
  }
}

export default Twitter

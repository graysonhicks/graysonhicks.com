import React, { Component } from 'react'
import styled from 'styled-components'

import Post from './Post'
import SeeMore from '../SeeMore'

const GalleryContainer = styled.div`
  width: 100%;
  margin: auto;
`

const PostContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 25px;
`

const PostColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: stretch;
  flex-grow: 1;
`

const Gallery = ({ posts, breakPoints }) => {
  const items = posts.map(post => (
    <Post key={post.props.id} {...post}>
      {post}
    </Post>
  ))

  return (
    <GalleryContainer>
      <App breakPoints={breakPoints}>{items}</App>
    </GalleryContainer>
  )
}

if (typeof window !== `undefined`) {
  window.postsToShow = 12
}

class App extends Component {
  constructor(props) {
    super(props)

    let postsToShow = 12

    if (typeof window !== `undefined`) {
      postsToShow = window.postsToShow
    }
    this.state = {
      columns: 1,
      postsToShow: postsToShow,
    }

    this.galleryRef = React.createRef()
    this.onResize = this.onResize.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }
  componentDidMount() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
    window.addEventListener(`scroll`, this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener(`scroll`, this.handleScroll)
    window.postsToShow = this.state.postsToShow
  }
  update() {
    const distanceToBottom =
      document.documentElement.offsetHeight -
      (window.scrollY + window.innerHeight)
    if (distanceToBottom < 100) {
      this.setState({ postsToShow: this.state.postsToShow + 12 })
    }
    this.ticking = false
  }

  handleScroll = () => {
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(() => this.update())
    }
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

    let children = this.props.children.slice(0, this.state.postsToShow)

    const numC = this.state.columns
    for (let i = 0; i < numC; i++) {
      col.push([])
    }

    return children.reduce((p, c, i) => {
      p[i % numC].push(c)
      return p
    }, col)
  }

  render() {
    return (
      <div ref={this.galleryRef}>
        <PostContainer>
          {this.mapChildren().map((col, ci) => {
            return (
              <PostColumn key={ci}>
                {col.map((child, i) => {
                  return <React.Fragment key={i}>{child}</React.Fragment>
                })}
              </PostColumn>
            )
          })}
        </PostContainer>
      </div>
    )
  }
}

export default Gallery

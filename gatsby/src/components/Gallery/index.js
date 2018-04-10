import React, { Component } from 'react'
import styled from 'styled-components'
import TiArrowUp from 'react-icons/lib/ti/arrow-up'
import Post from './Post'
import SeeMore from '../SeeMore'
import { colors } from '../../styles/colors'

const GalleryContainer = styled.div`
  width: 100%;
  margin: auto;
`

const PostContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 25px;
`

const PostColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex-grow: 1;
  max-width: ${props => 100 / props.numOfCols}%;
`

const ScrollToTopButton = styled.button`
  position: fixed;
  right: 5%;
  bottom: 10%;
  background: ${colors.white};
  padding: 15px;
  border-radius: 5px;
  border: 2px solid ${colors.mineShaft};
  font-family: 'Futura', 'montserrat';
  font-weight: bold;
  transition: all 0.25s;

  &:hover {
    background-color: ${colors.gothic};
    color: ${colors.gallery};
    border-color: ${colors.blueWhale};
  }

  @media screen and (max-width: 991px) {
    display: none;
  }
`

const MobileScrollToTopButton = ScrollToTopButton.extend`
  display: none;
  border-radius: 50%;
  right: 7%;
  bottom: 4%;
  z-index: 10;

  @media screen and (max-width: 991px) {
    display: inline-block;
  }
`

const StyledArrowUp = styled(TiArrowUp)`
  font-size: 3rem;
`

const Gallery = ({ posts, breakPoints, endPost }) => {
  const items = posts.map(post => (
    <Post key={post.props.id} {...post}>
      {post}
    </Post>
  ))

  return (
    <GalleryContainer>
      <App breakPoints={breakPoints} posts={posts} endPost={endPost}>
        {items}
      </App>
    </GalleryContainer>
  )
}

if (typeof window !== `undefined`) {
  window.postsToShow = 10
}

class App extends Component {
  constructor(props) {
    super(props)

    let postsToShow = 10

    if (typeof window !== `undefined`) {
      postsToShow = window.postsToShow
    }
    this.state = {
      columns: 1,
      postsToShow: postsToShow,
      finishedScrolling: null,
      showScrollToTop: null,
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
  updatePostsToShow() {
    const distanceToBottom =
      document.documentElement.offsetHeight -
      (window.scrollY + window.innerHeight)
    if (distanceToBottom < 25) {
      this.setState({ postsToShow: this.state.postsToShow + 10 }, () => {})
    }
    this.ticking = false
  }

  checkForBottomOfPage() {
    if (this.state.postsToShow > this.props.posts.length) {
      this.setState({
        finishedScrolling: true,
      })
    } else {
      this.setState({
        finishedScrolling: false,
      })
    }
  }

  checkForScrollToTop() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      this.setState({
        showScrollToTop: true,
      })
    } else {
      this.setState({
        showScrollToTop: false,
      })
    }
  }

  handleScroll = () => {
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(() => this.updatePostsToShow())
      requestAnimationFrame(() => this.checkForScrollToTop())
      requestAnimationFrame(() => this.checkForBottomOfPage())
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

  scrollToTop() {
    window.scrollTo(0, 0)
    return false
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
              <PostColumn key={ci} numOfCols={this.mapChildren().length}>
                {col.map((child, i) => {
                  return <React.Fragment key={i}>{child}</React.Fragment>
                })}
              </PostColumn>
            )
          })}
        </PostContainer>
        {this.state.finishedScrolling && this.props.endPost}
        {this.state.showScrollToTop && (
          <React.Fragment>
            <ScrollToTopButton onClick={this.scrollToTop}>
              back to top
            </ScrollToTopButton>
            <MobileScrollToTopButton onClick={this.scrollToTop}>
              <StyledArrowUp />
            </MobileScrollToTopButton>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Gallery

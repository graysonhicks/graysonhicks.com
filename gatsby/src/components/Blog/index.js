import React, { Component } from 'react'
import styled from 'styled-components'

import BlogItem from './BlogItem'
import BlogEndPost from './BlogEndPost'
import {
  ScrollToTopButton,
  MobileScrollToTopButton,
} from '../ScrollToTopButton'

const BlogContainer = styled.div`
  a:last-of-type {
    border-bottom: none;
  }
`
class Blog extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showScrollToTop: null,
    }

    this.handleScroll = this.handleScroll.bind(this)
  }
  componentDidMount() {
    window.addEventListener(`scroll`, this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener(`scroll`, this.handleScroll)
  }
  handleScroll = () => {
    requestAnimationFrame(() => this.checkForScrollToTop())
  }

  scrollToTop() {
    window.scrollTo(0, 0)
    return false
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

  render() {
    const items = this.props.posts.map(post => (
      <BlogItem key={post.node.id} {...post.node} />
    ))
    return (
      <React.Fragment>
        <BlogContainer>{items}</BlogContainer>
        <BlogEndPost />
        {this.state.showScrollToTop && (
          <React.Fragment>
            <ScrollToTopButton />
            <MobileScrollToTopButton />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default Blog

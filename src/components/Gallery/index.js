import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import * as styles from './index.module.scss'
import { childrenPropType } from '../../utils'

import Post from './Post'

const sharedProps = {
  endPost: PropTypes.node,
  breakPoints: PropTypes.arrayOf(PropTypes.number),
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      props: PropTypes.shape({
        id: PropTypes.string,
      }),
    })
  ),
}

const Gallery = ({ posts, breakPoints, endPost }) => {
  const items = posts.map((post) => (
    <Post key={post.props.id} {...post}>
      {post}
    </Post>
  ))

  return (
    <div className={styles.galleryContainer}>
      <App breakPoints={breakPoints} posts={posts} endPost={endPost}>
        {items}
      </App>
    </div>
  )
}

Gallery.propTypes = sharedProps

if (typeof window !== `undefined`) {
  window.postsToShow = 10
}
const App = ({ children, breakPoints, endPost, posts }) => {
  const galleryRef = useRef()
  const [columns, setColumns] = useState(1)
  const [postsToShow, setPostsToShow] = useState(10)
  const [finishedScrolling, setFinishedScrolling] = useState(null)

  const mapChildren = useCallback(() => {
    let col = []
    let childrenToUse = children.slice(0, postsToShow)
    const numC = columns
    for (let i = 0; i < numC; i++) {
      col.push([])
    }
    return childrenToUse.reduce((p, c, i) => {
      p[i % numC].push(c)
      return p
    }, col)
  }, [children, columns, postsToShow])

  const checkForBottomOfPage = useCallback(() => {
    if (postsToShow > posts.length) {
      setFinishedScrolling(true)
    } else {
      setFinishedScrolling(false)
    }
  }, [posts, postsToShow])

  const updatePostsToShow = useCallback(() => {
    const distanceToBottom =
      document.documentElement.offsetHeight -
      (window.scrollY + window.innerHeight)
    if (distanceToBottom < 25) {
      setPostsToShow(postsToShow + 10)
    }
  }, [postsToShow])

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => updatePostsToShow())
    requestAnimationFrame(() => checkForBottomOfPage())
  }, [updatePostsToShow, checkForBottomOfPage])

  useEffect(() => {
    const handleResize = () => {
      const columns = getColumns(galleryRef.current.offsetWidth)
      if (columns !== setColumns) {
        setColumns(columns)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.postsToShow = postsToShow
    }
  }, [galleryRef, handleScroll, postsToShow])

  const getColumns = (w) => {
    return (
      breakPoints.reduceRight((p, c, i) => {
        return c < w ? p : i
      }, breakPoints.length) + 1
    )
  }

  return (
    <div ref={galleryRef}>
      <div className={styles.postContainer}>
        {mapChildren().map((col, ci) => {
          return (
            <div
              key={ci}
              className={styles.postColumn}
              style={{
                maxWidth: `${100 / mapChildren().length}%`,
                '--post-column-max-width': 1 / mapChildren().length,
              }}
            >
              {col.map((child, i) => {
                return <React.Fragment key={i}>{child}</React.Fragment>
              })}
            </div>
          )
        })}
      </div>
      {finishedScrolling && endPost}
    </div>
  )
}

export default Gallery

App.propTypes = {
  children: childrenPropType,
  ...sharedProps,
}

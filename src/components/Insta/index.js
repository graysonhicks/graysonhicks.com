import React from 'react'
import PropTypes from 'prop-types'
import Gallery from '../Gallery'
import Gram from './Gram'
import GramEndPost from './GramEndPost'

let breakPoints = [516]

const Insta = ({ posts }) => {
  const items = posts.map((post) => <Gram key={post.id} {...post} />)

  return (
    <Gallery
      breakPoints={breakPoints}
      posts={items}
      endPost={<GramEndPost />}
    />
  )
}

export default Insta

Insta.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
}

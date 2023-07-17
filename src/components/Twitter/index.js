import React from 'react'

import Gallery from '../Gallery'
import Tweet from './Tweet'

let breakPoints = [516]

const Twitter = ({ posts }) => {
  const items = posts.map((post) => <Tweet key={post.node.id} {...post.node} />)

  return <Gallery breakPoints={breakPoints} posts={items} type="twitter" />
}

export default Twitter

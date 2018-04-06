import React, { Component } from 'react'

import Loader from '../Loader'
import Tweet from './Tweet'
import TweetError from './TweetError'
import TweetSeeMore from './TweetSeeMore'

const Twitter = ({ posts }) => {
  const items = posts.map(post => <Tweet key={post.node.id} {...post.node} />)
  return (
    <div id="twitter-content">
      {items}
      <TweetSeeMore />
    </div>
  )
}

export default Twitter

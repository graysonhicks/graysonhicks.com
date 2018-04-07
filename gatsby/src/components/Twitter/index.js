import React, { Component } from 'react'
import styled from 'styled-components'

import Gallery from '../Gallery'
import Tweet from './Tweet'

let breakPoints = [516]

const Twitter = ({ posts }) => {
  const items = posts.map(post => <Tweet key={post.node.id} {...post.node} />)

  return <Gallery breakPoints={breakPoints} posts={items} />
}

export default Twitter

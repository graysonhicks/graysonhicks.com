import React, { Component } from 'react'
import styled from 'styled-components'
import Gallery from '../Gallery'
import InstaError from './InstaError'
import InstaSeeMore from './InstaSeeMore'
import Gram from './Gram'

let breakPoints = [516]

const Insta = ({ posts }) => {
  const items = posts.map(post => <Gram key={post.node.id} {...post.node} />)

  return <Gallery breakPoints={breakPoints} posts={items} />
}

export default Insta

import React from 'react'
import Gallery from '../Gallery'
import Repo from './Repo'

let breakPoints = [516]

const GitHub = ({ repos }) => {
  const items = repos.map(repo => <Repo key={repo.node.id} {...repo.node} />)

  return <Gallery breakPoints={breakPoints} posts={items} />
}

export default GitHub

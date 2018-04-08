import React from 'react'
import Gallery from '../Gallery'
import Repo from './Repo'
import User from './User'

let breakPoints = [516]

const GitHub = ({ repos, user }) => {
  const items = repos.map(repo => <Repo key={repo.node.id} {...repo.node} />)

  return (
    <React.Fragment>
      <User {...user} />
      <Gallery breakPoints={breakPoints} posts={items} />
    </React.Fragment>
  )
}

export default GitHub

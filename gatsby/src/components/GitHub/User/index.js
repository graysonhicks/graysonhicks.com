import React from 'react'

const User = props => {
  const { 0: user } = props

  return <div>{user.node.name}</div>
}

export default User

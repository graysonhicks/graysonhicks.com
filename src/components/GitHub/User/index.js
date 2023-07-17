'use client'
import React from 'react'
import * as styles from './index.module.scss'

import { FaGithub } from 'react-icons/fa'

const UserRow = ({ children }) => (
  <div className={styles.userRow}>{children}</div>
)

const UserInfoText = ({ children }) => (
  <div className={styles.userInfoText}>{children}</div>
)

const UserGitHubIcon = ({ url }) => (
  <a
    className={styles.userGitHubIcon}
    href={url}
    target="_blank"
    rel="noopener"
  >
    <FaGithub />
  </a>
)

const UserInfoLabel = ({ children }) => (
  <a className={styles.userInfoLabel}>{children}</a>
)

const User = (props) => {
  const { 0: user } = props

  return (
    <UserRow>
      <UserInfoText>
        <UserInfoLabel>repos: </UserInfoLabel>
        {user.node.public_repos}
      </UserInfoText>
      <UserInfoText>
        <UserInfoLabel>following: </UserInfoLabel>
        {user.node.following}
      </UserInfoText>
      <UserInfoText>
        <UserInfoLabel>followers: </UserInfoLabel>
        {user.node.followers}
      </UserInfoText>
      <UserGitHubIcon url={user.node.url} />
    </UserRow>
  )
}

export default User

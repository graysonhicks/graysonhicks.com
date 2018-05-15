import React from 'react'
import styled from 'styled-components'
import { hexToRGB } from '../../../utils'
import { colors } from '../../../styles/colors'
import FaGithub from 'react-icons/lib/fa/github'

const UserRow = styled.div`
  display: flex;
  border: 1px solid ${hexToRGB(colors.mineShaft, 0.15)};
  border-radius: 5px;
  box-shadow: 0 2px 2px 2px ${hexToRGB(colors.mineShaft, 0.15)};
  flex-direction: column;
  justify-content: center;
  align-content: stretch;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${colors.white};
  position: relative;
`

const UserInfoText = styled.div`
  display: flex;
  margin-left: 4px;
  justify-content: center;
  align-content: stretch;
  flex-grow: 1;
  color: ${colors.mineShaft};
`

const UserGitHubIcon = styled.a`
  position: absolute;
  right: 5px;
  bottom: 5px;
  font-size: 3rem;
  color: ${colors.mineShaft};
  transition: all 0.5s;
  &:hover {
    color: ${colors.royalBlue};
  }

  @media screen and (max-width: 991px) {
    margin-right: auto;
  }
`

const UserInfoLabel = styled.a`
  font-weight: bold;
  margin-right: 15px;
  color: ${colors.scienceBlue};
  cursor: pointer;
  font-size: 1.6rem;

  &:hover {
    text-decoration: none;
  }
`

const User = props => {
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
      <UserGitHubIcon />
      <UserGitHubIcon href={user.node.url} target="_blank" rel="noopener">
        <FaGithub />
      </UserGitHubIcon>
    </UserRow>
  )
}

export default User

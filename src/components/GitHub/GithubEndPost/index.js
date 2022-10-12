import React from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import { FaGithub } from 'react-icons/fa'

const StyledGithubIcon = styled(FaGithub)`
  color: ${colors.scienceBlue};
  font-size: 3rem;
  position: absolute;
  top: 10px;
  right: 10px;
`

const StyledGithubEndPost = styled.a`
  width: 100%;
  display: inline-block;
  position: relative;
  text-align: center;
  padding: 15px;
  border: 2px solid ${colors.scienceBlue};
  border-radius: 5px;
  font-family: 'Futura';
  text-transform: uppercase;
  font-weight: bold;
  color: ${colors.scienceBlue};
  cursor: pointer;
  margin-bottom: 50px;
  background-color: white;

  &:hover,
  &:focus {
    background-color: ${colors.scienceBlue};
    color: ${colors.white};
    text-decoration: none;
    transition: all 0.25s;

    ${StyledGithubIcon} {
      color: ${colors.gallery};
    }
  }
`

const GithubEndPost = () => {
  return (
    <StyledGithubEndPost
      href="http://github.com/graysonhicks/"
      target="_blank"
      rel="noopener"
    >
      go to github <StyledGithubIcon />
    </StyledGithubEndPost>
  )
}

export default GithubEndPost

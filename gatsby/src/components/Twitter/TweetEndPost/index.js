import React from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import TiSocialTwitter from 'react-icons/lib/ti/social-twitter'

const StyledTwitterIcon = styled(TiSocialTwitter)`
  color: ${colors.gothic};
  font-size: 3rem;
  position: absolute;
  top: 10px;
  right: 10px;
`

const StyledTweetEndPost = styled.a`
  width: 100%;
  display: inline-block;
  position: relative;
  text-align: center;
  padding: 15px;
  border: 2px solid ${colors.gothic};
  border-radius: 5px;
  font-family: 'Futura', 'montserrat';
  text-transform: uppercase;
  font-weight: bold;
  color: ${colors.gothic};
  cursor: pointer;
  margin-bottom: 50px;

  &:hover,
  &:focus {
    background-color: ${colors.gothic};
    color: ${colors.white};
    text-decoration: none;
    transition: all 0.25s;

    ${StyledTwitterIcon} {
      color: ${colors.gallery};
    }
  }
`

const TweetEndPost = () => {
  return (
    <StyledTweetEndPost href="http://twitter.com/graysonhicks/" target="_blank" rel="noopener">
      go to twitter <StyledTwitterIcon />
    </StyledTweetEndPost>
  )
}

export default TweetEndPost

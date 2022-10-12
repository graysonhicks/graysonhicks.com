import React from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import { TiSocialInstagram } from 'react-icons/ti'

const StyledInstagramIcon = styled(TiSocialInstagram)`
  color: ${colors.japonica};
  font-size: 3rem;
  position: absolute;
  top: 10px;
  right: 10px;
`

const StyledGramEndPost = styled.a`
  width: 100%;
  display: inline-block;
  position: relative;
  text-align: center;
  padding: 15px;
  border: 2px solid ${colors.japonica};
  border-radius: 5px;
  font-family: 'Futura';
  text-transform: uppercase;
  font-weight: bold;
  color: ${colors.japonica};
  cursor: pointer;
  margin-bottom: 50px;

  &:hover,
  &:focus {
    background-color: ${colors.japonica};
    color: ${colors.white};
    text-decoration: none;
    transition: all 0.25s;

    ${StyledInstagramIcon} {
      color: ${colors.gallery};
    }
  }
`

const GramEndPost = () => {
  return (
    <StyledGramEndPost
      href="http://instagram.com/jamesgraysonhicks/"
      target="_blank"
      rel="noopener"
    >
      go to instagram <StyledInstagramIcon />
    </StyledGramEndPost>
  )
}

export default GramEndPost

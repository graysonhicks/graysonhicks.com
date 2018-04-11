import React from 'react'
import styled from 'styled-components'
import TiArrowUp from 'react-icons/lib/ti/arrow-up'
import { colors } from '../../styles/colors'

const StyledButton = styled.button`
  position: fixed;
  right: 5%;
  bottom: 10%;
  background: ${colors.white};
  padding: 15px;
  border-radius: 5px;
  border: 2px solid ${colors.mineShaft};
  font-family: 'Futura', 'montserrat';
  font-weight: bold;
  transition: all 0.25s;

  &:hover {
    background-color: ${colors.gothic};
    color: ${colors.gallery};
    border-color: ${colors.blueWhale};
  }

  @media screen and (max-width: 991px) {
    display: none;
  }
`

const StyledArrowUp = styled(TiArrowUp)`
  font-size: 3rem;
`

const StyledMobile = StyledButton.extend`
  display: none;
  border-radius: 50%;
  right: 7%;
  bottom: 4%;
  z-index: 10;

  @media screen and (max-width: 991px) {
    display: inline-block;
  }
`

const scrollToTop = () => {
  window.scrollTo(0, 0)
  return false
}
export const ScrollToTopButton = () => (
  <StyledButton onClick={scrollToTop}>back to top</StyledButton>
)

export const MobileScrollToTopButton = () => (
  <StyledMobile onClick={scrollToTop}>
    <StyledArrowUp />
  </StyledMobile>
)

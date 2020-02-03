import React, { useState } from 'react'
import styled from 'styled-components'
import Img from 'gatsby-image'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'
import TiMediaPlay from 'react-icons/lib/ti/media-play'
import TiHeartOutline from 'react-icons/lib/ti/heart-outline'
import TiEject from 'react-icons/lib/ti/eject'
import TiSocialInstagram from 'react-icons/lib/ti/social-instagram'

const Gram = ({ id, localFile, caption, likes }) => {
  const [isHovered, setIsHovered] = useState(0)
  const hoverItem = () => {
    setIsHovered(1)
  }
  const unHoverItem = () => {
    setIsHovered(0)
  }
  return (
    <InstaItem
      onMouseEnter={hoverItem}
      onMouseLeave={unHoverItem}
      onFocus={hoverItem}
      onBlur={unHoverItem}
    >
      <StyledImageLink
        href={`https://www.instagram.com/p/${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image fluid={localFile.childImageSharp.fluid} alt={caption} />
        <Gradient hover={isHovered} />
        <InstaText hover={isHovered}>{caption}</InstaText>
        <Likes hover={isHovered}>
          {likes} <StyledLikeIcon />
        </Likes>
      </StyledImageLink>
      <StyledInstagramIcon hover={isHovered} />
    </InstaItem>
  )
}

export default Gram

const StyledInstagramIcon = styled(TiSocialInstagram)`
  color: ${colors.white};
  opacity: ${props => (props.hover ? 0 : 1)};
  transition: all 0.5s;
  font-size: 3rem;
  position: absolute;
  bottom: 10px;
  right: 10px;
`

const InstaItem = styled.div``

const StyledImageLink = styled.a``

const Gradient = styled.div`
  transition: all 0.5s;
  background: linear-gradient(
    135deg,
    ${hexToRGB(colors.studio, 0.7)} 0%,
    ${hexToRGB(colors.royalBlue, 0.5)} 50%,
    ${hexToRGB(colors.casablanca, 0.4)} 100%
  );
  height: ${props => (props.hover ? '0%' : '100%')};
  width: 100%;
  position: absolute;
  top: 0;
  border-radius: 10px;
  opacity: ${props => (props.hover ? 0 : 1)};
`

const Image = styled(Img)`
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
`

const InstaText = styled.div`
  color: ${colors.gallery};
  position: absolute;
  padding: 15px;
  font-weight: 600;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
  bottom: 5%;
`

const Likes = styled.div`
  color: ${colors.gallery};
  font-weight: 600;
  position: absolute;
  top: 5%;
  right: 5%;
  transition: all 0.5s;
  opacity: ${props => (props.hover ? 0 : 1)};
`

const StyledLikeIcon = styled(TiHeartOutline)`
  color: ${colors.gallery};
  font-weight: 600;
`

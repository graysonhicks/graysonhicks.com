import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GatsbyImage } from 'gatsby-plugin-image'
import { colors } from '../../../styles/colors'
import { hexToRGB } from '../../../utils'
// For when video works from instagram.
// import TiMediaPlay from 'react-icons/lib/ti/media-play'
// import TiEject from 'react-icons/lib/ti/eject'

import TiHeartOutline from 'react-icons/lib/ti/heart-outline'
import TiSocialInstagram from 'react-icons/lib/ti/social-instagram'

const Gram = ({ id, localFile, caption, likes, top }) => {
  const [isHovered, setIsHovered] = useState(0)
  const hoverItem = () => {
    setIsHovered(1)
  }
  const unHoverItem = () => {
    setIsHovered(0)
  }
  console.log(top)
  return (
    <InstaItem
      onMouseOver={hoverItem}
      onMouseOut={unHoverItem}
      onFocus={hoverItem}
      onBlur={unHoverItem}
    >
      <StyledImageLink
        href={`https://www.instagram.com/p/${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          image={localFile.childImageSharp.gatsbyImageData}
          loading={top ? 'eager' : 'lazy'}
          style={{
            display: 'block',
          }}
          alt={caption}
        />
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

Gram.propTypes = {
  id: PropTypes.string,
  localFile: PropTypes.object,
  caption: PropTypes.string,
  likes: PropTypes.number,
  top: PropTypes.bool,
}

const StyledInstagramIcon = styled(TiSocialInstagram)`
  color: ${colors.white};
  opacity: ${(props) => (props.hover ? 0 : 1)};
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
  height: ${(props) => (props.hover ? '0%' : '100%')};
  width: 100%;
  position: absolute;
  top: 0;
  border-radius: 10px;
  opacity: ${(props) => (props.hover ? 0 : 1)};
`

const Image = styled(GatsbyImage)`
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
`

const InstaText = styled.div`
  color: ${colors.gallery};
  position: absolute;
  padding: 15px;
  font-weight: 600;
  font-size: 1.5rem;
  transition: all 0.5s;
  opacity: ${(props) => (props.hover ? 0 : 1)};
  bottom: 5%;
`

const Likes = styled.div`
  color: ${colors.gallery};
  font-weight: 600;
  position: absolute;
  font-size: 1.5rem;
  top: 5%;
  right: 5%;
  transition: all 0.5s;
  opacity: ${(props) => (props.hover ? 0 : 1)};
  display: flex;
  align-items: center;
`

const StyledLikeIcon = styled(TiHeartOutline)`
  color: ${colors.gallery};
  font-weight: 600;
  margin-left: 5px;
`

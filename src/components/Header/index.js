import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import styled from 'styled-components'

// const slideUp = keyframes`
//   from {
//     opacity: 0;
//     transform: translate3d(0, 50%, 0);
//   }

//   to {
//     opacity: 1;
//     transform: translate3d(0, 0, 0);
//   }
// `

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media screen and (max-width: 991px) {
    padding-top: 15px;
  }
`

const HeadshotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const NameContainer = styled(HeadshotContainer)`
  overflow: hidden;
`

const Name = styled.h1`
  padding-left: 15px;
  margin-top: 0px;
  font-size: 3.5em;
  font-family: 'Futura', sans-serif;
  text-transform: uppercase;

  @media screen and (max-width: 736px) {
    font-size: 2.25em;
    padding-left: 0px;
  }
`

const Header = () => (
  <StyledHeader className="row">
    <div className="col-sm-2 col-5">
      <HeadshotContainer>
        <StaticImage
          alt="Headshot of Grayson Hicks"
          imgStyle={{
            maxHeight: '100px',
            maxWidth: '100px',
          }}
          style={{
            borderRadius: '100%',
          }}
          width={100}
          src="../../images/headshot.jpg"
          loading="eager"
          placeholder="blurred"
        />
      </HeadshotContainer>
    </div>
    <div className="col-sm-10 col-7">
      <NameContainer>
        <Name>grayson hicks</Name>
      </NameContainer>
    </div>
  </StyledHeader>
)

export default Header

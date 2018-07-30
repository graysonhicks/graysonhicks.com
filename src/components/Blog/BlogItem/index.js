import React from 'react'
import Img from 'gatsby-image'

import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import AppContext from '../../../context'

import { StyledHeading } from '../../Heading'

const BlogItem = ({
  id,
  title,
  description,
  virtuals,
  childLocalMediumImage,
}) => {
  return (
    <AppContext.Consumer>
      {context => (
        <BlogPost
          nightMode={context.nightMode}
          href={`https://medium.com/@graysonhicks/${id}`}
          target="_blank"
          rel="noopener"
        >
          <BlogThumbnailContainer className="col-md-3">
            <BlogThumbnail
              fluid={childLocalMediumImage.localImageFile.childImageSharp.fluid}
              alt={`Thumbnail for ${title}`}
            />
          </BlogThumbnailContainer>
          <div className="col-md-9">
            <BlogTitle>{title}</BlogTitle>
            <BlogSubtitle nightMode={context.nightMode}>
              {virtuals.subtitle}
            </BlogSubtitle>
            <BlogDescription>{description}</BlogDescription>
          </div>
        </BlogPost>
      )}
    </AppContext.Consumer>
  )
}

export default BlogItem

export const BlogPost = styled.a`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  color: ${props => (props.nightMode ? colors.gallery : colors.black)};

  &:hover,
  &:visited {
    text-decoration: none;
    color: ${props => (props.nightMode ? colors.gallery : colors.black)};
  }

  @media screen and (max-width: 991px) {
    display: inline-block;
    width: 50%;
    float: left;
    height: 350px;
    padding: 10px;
    border-bottom: none;
    padding: 0px;
  }

  @media screen and (max-width: 736px) {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 25px;
  }
`

export const BlogTitle = StyledHeading.extend`
  font-size: 2.5rem;
  margin-bottom: 0px;
  font-weight: 700;
  letter-spacing: -0.25px;

  @media screen and (max-width: 991px) {
    font-size: 2rem;
  }
`

export const BlogDescription = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.25;
`

const BlogSubtitle = styled.div`
  font-size: 16px;
  font-family: 'Futura', Arial, sans-serif;
  font-weight: 300;
  margin-top: 5px;
  margin-bottom: 5px;
  letter-spacing: -0.5px;
  transition: all 0.5s;
  color: ${props => (props.nightMode ? colors.gallery : colors.black)};
  opacity: 0.5;
`

const BlogThumbnailContainer = styled.div`
  @media screen and (max-width: 991px) {
    max-height: 150px;
    overflow: hidden;
    border-radius: 5px;
  }
`

const BlogThumbnail = styled(Img)`
  border-radius: 5px;
  max-width: 100%;
`

import React from 'react'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import AppContext from '../../../context'

import { StyledHeading } from '../../Heading'

export const BlogPost = styled.a`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
  display: flex;
  flex-direction: row;
  align-items: center;
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
    height: 400px;
    padding: 10px;
    border-bottom: none;
  }

  @media screen and (max-width: 736px) {
    display: block;
    width: 100%;
    height: auto;
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
  font-family: 'Futura', 'Montserrat', Arial, sans-serif;
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

const BlogThumbnail = styled.img`
  border-radius: 5px;
`

const BlogItem = ({ id, title, description, virtuals }) => {
  return (
    <AppContext.Consumer>
      {context => (
        <BlogPost
          nightMode={context.nightMode}
          href={`https://medium.com/@graysonhicks/${id}`}
          target="_blank"
          rel="noopener"
        >
          <div className="row">
            <BlogThumbnailContainer className="col-md-3">
              <BlogThumbnail
                src={`https://cdn-images-1.medium.com/max/500/${
                  virtuals.previewImage.imageId
                }`}
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
          </div>
        </BlogPost>
      )}
    </AppContext.Consumer>
  )
}

export default BlogItem

import React from 'react'
import styled from 'styled-components'

import { StyledHeading } from '../../Heading'

export const BlogPost = styled.a`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: black;

  &:hover,
  &:visited {
    text-decoration: none;
    color: black;
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
  color: rgba(0, 0, 0, 0.44);
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
    <BlogPost href={`https://medium.com/@graysonhicks/${id}`}>
      <div className="row">
        <BlogThumbnailContainer className="col-md-3">
          <BlogThumbnail
            src={`https://cdn-images-1.medium.com/max/1000/${
              virtuals.previewImage.imageId
            }`}
            className="img-responsive"
          />
        </BlogThumbnailContainer>
        <div className="col-md-9">
          <div className="blog-info-container">
            <BlogTitle className="blog-titles heading">{title}</BlogTitle>
            <BlogSubtitle>{virtuals.subtitle}</BlogSubtitle>
            <BlogDescription>{description}</BlogDescription>
          </div>
        </div>
      </div>
    </BlogPost>
  )
}

export default BlogItem

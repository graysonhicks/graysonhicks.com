import React from 'react'
import styled from 'styled-components'

import { StyledHeading } from '../../Heading'

const BlogTitle = StyledHeading.extend``

const BlogItem = ({ id, title, description, virtuals }) => {
  return (
    <a href={`https://medium.com/@graysonhicks/${id}`} className="blog-posts">
      <div className="row">
        <div className="col-md-3 blog-thumbnail-container">
          <img
            src={`https://cdn-images-1.medium.com/max/1000/${
              virtuals.previewImage.imageId
            }`}
            className="blog-thumbnail img-responsive"
          />
        </div>
        <div className="col-md-9">
          <div className="blog-info-container">
            <BlogTitle className="blog-titles heading">{title}</BlogTitle>
            <div className="blog-subtitles">{virtuals.subtitle}</div>
            <div className="blog-descriptions">{description}</div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default BlogItem

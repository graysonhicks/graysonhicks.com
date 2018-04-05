import React from 'react'

const BlogItem = ({
  title,
  subtitle,
  description,
  previewImage,
  uniqueSlug,
}) => {
  return (
    <a
      href={`https://medium.com/@graysonhicks/${uniqueSlug}`}
      className="blog-posts"
    >
      <div className="row">
        <div className="col-md-3 blog-thumbnail-container">
          <img
            src={previewImage.imageId}
            className="blog-thumbnail img-responsive"
          />
        </div>
        <div className="col-md-9">
          <div className="blog-info-container">
            <div className="blog-titles heading">{title}</div>
            <div className="blog-subtitles">{subtitle}</div>
            <div className="blog-descriptions">{description}</div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default BlogItem

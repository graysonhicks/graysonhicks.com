import React from 'react'

import Blog from '../components/Blog'

const BlogPage = ({ data }) => <Blog posts={data.allMediumPost.edges} />
export default BlogPage

export const StoriesQuery = graphql`
  query StoriesQuery {
    allMediumPost(sort: { fields: [createdAt], order: DESC }) {
      edges {
        node {
          id
          title
          virtuals {
            subtitle
            previewImage {
              imageId
            }
          }
          author {
            name
          }
        }
      }
    }
  }
`

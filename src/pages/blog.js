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
          }
          childLocalMediumImage {
            localImageFile {
              childImageSharp {
                sizes(maxWidth: 400) {
                  ...GatsbyImageSharpSizes
                }
              }
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

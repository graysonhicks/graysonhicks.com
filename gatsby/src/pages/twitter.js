import React from 'react'

import Twitter from '../components/Twitter'

const TwitterPage = ({ data }) => <Twitter posts={data.allTweet.edges} />
export default TwitterPage

export const TwitterQuery = graphql`
  query TwitterQuery {
    allTweet {
      edges {
        node {
          created_at
          text
          id_str

          entities {
            urls {
              url
            }
            media {
              id
              media_url
              indices
            }
          }

          user {
            name
            screen_name
            profile_image_url
          }
        }
      }
    }
  }
`

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
          user {
            name
          }
        }
      }
    }
  }
`

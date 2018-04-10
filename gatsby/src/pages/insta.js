import React from 'react'

import Insta from '../components/Insta'

const InstaPage = ({ data }) => <Insta posts={data.allInstaPost.edges} />
export default InstaPage

export const InstaQuery = graphql`
  query InstaQuery {
    allInstaPost {
      edges {
        node {
          id
          caption
          username
          video
          likes
          images {
            low_resolution {
              url
            }
            standard_resolution {
              url
            }
          }
          link
        }
      }
    }
  }
`

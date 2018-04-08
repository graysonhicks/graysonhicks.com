import React from 'react'

import Insta from '../components/Insta'

const InstaPage = ({ data }) => <Insta posts={data.allThirdPartyInsta.edges} />
export default InstaPage

export const InstaQuery = graphql`
  query InstaQuery {
    allThirdPartyInsta {
      totalCount
      edges {
        node {
          id
          caption {
            text
          }
          user {
            username
          }
          videos {
            standard_resolution {
              url
            }
          }
          likes {
            count
          }
          images {
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

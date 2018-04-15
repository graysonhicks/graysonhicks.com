import React from 'react'

import Insta from '../components/Insta'

const InstaPage = ({ data }) => <Insta posts={data.allLocalInstaImage.edges} />
export default InstaPage

export const InstaQuery = graphql`
  query InstaQuery {
    allLocalInstaImage(sort: { fields: [created_time], order: DESC }) {
      edges {
        node {
          id
          caption
          username
          video
          likes
          localImageFile {
            childImageSharp {
              original {
                src
              }
              sizes(maxWidth: 750) {
                ...GatsbyImageSharpSizes
              }
            }
          }
          link
        }
      }
    }
  }
`

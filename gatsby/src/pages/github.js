import React from 'react'

import GitHub from '../components/GitHub'

const GitHubPage = ({ data: { allGitHubRepo, allGitHubUser } }) => {
  return (
    <GitHub
      repos={allGitHubRepo.edges}
      user={allGitHubUser.edges}
      totalRepos={allGitHubRepo.totalCount}
    />
  )
}
export default GitHubPage

export const GitHubQuery = graphql`
  query GitHubQuery {
    allGitHubRepo(sort: { fields: [created], order: DESC }) {
      totalCount
      edges {
        node {
          id
          name
          description
          url
          updated
          created
          language
        }
      }
    }
    allGitHubUser {
      edges {
        node {
          id
          name
          avatar_url
          url
          followers
          followers_url
          following
          followers_url
          public_repos
          created_at
          updated_at
        }
      }
    }
  }
`

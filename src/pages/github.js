import React from 'react';

import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import GitHub from '../components/GitHub';

const GitHubPage = ({ data: { allGitHubRepo, allGitHubUser } }) => {
  return (
    <Layout>
      <GitHub
        repos={allGitHubRepo.edges}
        user={allGitHubUser.edges}
        totalRepos={allGitHubRepo.totalCount}
      />
    </Layout>
  );
};
export default GitHubPage;

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
`;

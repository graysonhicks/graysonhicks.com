/* eslint-disable camelcase */
const github = require('octonode')

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions
  const client = github.client(pluginOptions.auth)

  const buildRepoNodes = (repos) => {
    repos.forEach((repo) => {
      const repoNode = {
        id: createNodeId(repo.id.toString()),
        parent: null,
        children: [],
        internal: {
          type: 'GitHubRepo',
          contentDigest: createContentDigest(repo),
        },
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        updated: repo.updated_at,
        created: repo.created_at,
        language: repo.language,
      }
      createNode(repoNode)
    })
  }

  const buildUserNode = (user) => {
    const userNode = {
      id: createNodeId(user.id.toString()),
      parent: null,
      children: [],
      internal: {
        type: 'GitHubUser',
        contentDigest: createContentDigest(user),
      },
      name: user.name,
      avatar_url: user.avatar_url,
      url: user.html_url,
      followers: user.followers,
      followers_url: user.followers_url,
      following_url: user.following_url,
      following: user.following,
      public_repos: user.public_repos,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
    createNode(userNode)
  }
  return new Promise((resolve, reject) => {
    client.me().repos(function (err, body) {
      if (err) {
        console.log('\nError')
        console.log(err)
        reject()
      } else {
        buildRepoNodes(body)
        client.get('users/graysonhicks', (err, status, body) => {
          if (err) {
            console.log('\nError')
            console.log(err)
            reject()
          } else {
            buildUserNode(body)
            resolve()
          }
        })
      }
    })
  })
}

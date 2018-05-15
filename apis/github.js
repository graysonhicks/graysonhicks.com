// You can delete this file if you're not using it
const crypto = require('crypto')
const github = require('octonode')
const auth = require('../gatsby-auth')

const client = github.client(auth.github.PERSONAL_ACCESS_TOKEN)

const getGithub = createNode => {
  const buildRepoNodes = repos => {
    repos.forEach(repo => {
      const repoNode = {
        id: repo.id.toString(),
        parent: null,
        children: [],
        internal: {
          type: `GitHubRepo`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(repo))
            .digest(`hex`),
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

  const buildUserNode = user => {
    const userNode = {
      id: user.id.toString(),
      parent: null,
      children: [],
      internal: {
        type: `GitHubUser`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(user))
          .digest(`hex`),
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
    const ghme = client
      .me()
      .repos({ per_page: '100', type: 'owner' }, function(err, body, headers) {
        if (err) {
          console.log('\nError')
          console.log(err)
          reject()
        } else {
          buildRepoNodes(body)
          client.get('users/graysonhicks', (err, status, body, headers) => {
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

module.exports = getGithub

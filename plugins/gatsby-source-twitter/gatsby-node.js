var Twitter = require('twitter')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const {
  getTweets,
  buildTweetNodes,
  buildTwitterImageNodes,
} = require('./utils.js')

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions

  const client = new Twitter({
    ...pluginOptions.auth,
  })

  const tweets = await getTweets(client)

  buildTweetNodes({
    tweets,
    createNodeId,
    createContentDigest,
    createNode,
  })
}

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode, createParentChildLink } = actions

  const type = node.internal.type

  if (type !== 'Tweet') {
    return
  }

  if (node.images) {
    const localTweetNode = await buildTwitterImageNodes({
      parent: node.id,
      created_time: node.created_time,
      id_str: node.id_str,
      text: node.text,
      avatar: node.avatar,
      url: node.images ? node.images[0].media_url_https : '',
      user: node.user,
      store,
      cache,
      createNode,
      createNodeId,
      createRemoteFileNode,
      createContentDigest,
    })
    createParentChildLink({
      parent: node,
      child: localTweetNode,
    })
  }
}

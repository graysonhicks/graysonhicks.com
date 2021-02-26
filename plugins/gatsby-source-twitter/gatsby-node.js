var Twitter = require('twitter')
const buildTwitterImageNodes = require('./buildImages.js')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions
  const client = new Twitter({
    ...pluginOptions.auth,
  })
  const buildTweetNodes = (tweets) => {
    tweets.forEach((tweet) => {
      const tweetNode = {
        id: createNodeId(tweet.id_str),
        parent: null,
        children: [],
        internal: {
          type: `Tweet`,
          contentDigest: createContentDigest(tweet),
        },
        created_time: Date.parse(tweet.created_at),
        id_str: tweet.id_str,
        text: tweet.text,
        avatar: tweet.user.profile_image_url_https,
        images: tweet.entities.media ? tweet.entities.media : null,
        user: tweet.user,
      }
      createNode(tweetNode)
    })
  }

  return new Promise((resolve, reject) => {
    client.get(
      'statuses/user_timeline',
      {
        screen_name: 'graysonhicks',
        count: 200,
        include_rts: 1,
      },
      (err, tweets) => {
        if (err) {
          console.log('\nError')
          console.log(err)
          reject()
        } else {
          buildTweetNodes(tweets)
          resolve()
        }
      }
    )
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

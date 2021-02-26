exports.getTweets = (client) =>
  new Promise((resolve, reject) => {
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
          resolve(tweets)
        }
      }
    )
  })

exports.buildTweetNodes = ({
  tweets,
  createContentDigest,
  createNodeId,
  createNode,
}) => {
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

exports.buildTwitterImageNodes = async ({
  created_time,
  id_str,
  text,
  avatar,
  url,
  user,
  parent,
  store,
  cache,
  createNode,
  createNodeId,
  createRemoteFileNode,
  createContentDigest,
}) => {
  const fileNode = await createRemoteFileNode({
    url,
    created_time,
    id_str,
    text,
    avatar,
    user,
    store,
    cache,
    createNode,
    createNodeId,
  })

  const localImageNode = {
    id: `${parent} >>> LocalImage`,
    id_str,
    created_time,
    text,
    avatar,
    url,
    user,
    // expires: screenshotResponse.data.expires,
    parent,
    children: [],
    internal: {
      type: `LocalTwitterImage`,
    },
  }

  if (fileNode) {
    localImageNode.localImageFile___NODE = fileNode.id
  }

  localImageNode.internal.contentDigest = createContentDigest(localImageNode)

  createNode(localImageNode)

  return localImageNode
}

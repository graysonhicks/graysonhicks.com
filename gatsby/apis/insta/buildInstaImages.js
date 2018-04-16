const buildInstaImageNodes = async ({
  url,
  caption,
  username,
  video,
  likes,
  link,
  created_time,
  parent,
  store,
  cache,
  createNode,
  createRemoteFileNode,
  createContentDigest,
}) => {
  const fileNode = await createRemoteFileNode({
    url,
    caption,
    username,
    video,
    likes,
    link,
    created_time,
    store,
    cache,
    createNode,
  })

  const localImageNode = {
    id: `${parent} >>> LocalImage`,
    url,
    caption,
    username,
    video,
    likes,
    link,
    created_time,
    // expires: screenshotResponse.data.expires,
    parent,
    children: [],
    internal: {
      type: `LocalInstaImage`,
    },
    localImageFile___NODE: fileNode.id,
  }

  localImageNode.internal.contentDigest = createContentDigest(localImageNode)

  createNode(localImageNode)

  return localImageNode
}

module.exports = buildInstaImageNodes

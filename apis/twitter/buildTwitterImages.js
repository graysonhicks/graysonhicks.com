const buildTwitterImageNodes = async ({
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

module.exports = buildTwitterImageNodes

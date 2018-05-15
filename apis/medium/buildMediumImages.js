const buildMediumImageNodes = async ({
  url,
  parent,
  store,
  cache,
  createNode,
  createRemoteFileNode,
  createContentDigest,
}) => {
  const fileNode = await createRemoteFileNode({
    url,
    store,
    cache,
    createNode,
  })

  const localImageNode = {
    id: `${parent} >>> LocalImage`,
    url,
    parent,
    children: [],
    internal: {
      type: `LocalMediumImage`,
    },
    localImageFile___NODE: fileNode.id,
  }

  localImageNode.internal.contentDigest = createContentDigest(localImageNode)

  createNode(localImageNode)

  return localImageNode
}

module.exports = buildMediumImageNodes

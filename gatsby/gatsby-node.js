/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const crypto = require('crypto')

const getGithub = require('./apis/github.js')
const getInsta = require('./apis/insta.js')
const buildInstaImageNodes = require('./apis/buildInstaImages.js')
const getTweets = require('./apis/twitter.js')

const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const createContentDigest = obj =>
  crypto
    .createHash(`md5`)
    .update(JSON.stringify(obj))
    .digest(`hex`)

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators

  return Promise.all([
    getGithub(createNode),
    getInsta(createNode),
    getTweets(createNode),
  ])
}

exports.onCreateNode = async ({ node, boundActionCreators, store, cache }) => {
  const { createNode, createParentChildLink } = boundActionCreators

  if (node.internal.type !== `InstaPost`) {
    return
  }

  const localImageNode = await buildInstaImageNodes({
    url: node.images.standard_resolution.url,
    parent: node.id,
    caption: node.caption,
    username: node.username,
    video: node.video,
    likes: node.likes,
    link: node.link,
    created_time: node.created_time,
    store,
    cache,
    createNode,
    createRemoteFileNode,
    createContentDigest,
  })
  createParentChildLink({
    parent: node,
    child: localImageNode,
  })
}

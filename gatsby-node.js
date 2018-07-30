/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const crypto = require('crypto')

const getGithub = require('./apis/github.js')
const getInsta = require('./apis/insta/getInsta.js')
const buildInstaImageNodes = require('./apis/insta/buildInstaImages.js')
const getTweets = require('./apis/twitter/getTweets.js')
const buildTwitterImageNodes = require('./apis/twitter/buildTwitterImages.js')
const buildMediumImageNodes = require('./apis/medium/buildMediumImages.js')

const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const createContentDigest = obj =>
  crypto
    .createHash(`md5`)
    .update(JSON.stringify(obj))
    .digest(`hex`)

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions

  return Promise.all([
    getGithub(createNode),
    getInsta(createNode),
    getTweets(createNode),
  ])
}

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
}) => {
  const { createNode, createParentChildLink } = actions

  const type = node.internal.type

  if (type !== 'InstaPost' && type !== 'Tweet' && type !== 'MediumPost') {
    return
  }

  if (type == 'InstaPost') {
    const localInstaNode = await buildInstaImageNodes({
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
      createNodeId,
      createRemoteFileNode,
      createContentDigest,
    })
    createParentChildLink({
      parent: node,
      child: localInstaNode,
    })
  } else if (type == 'Tweet') {
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
  } else {
    const localMediumNode = await buildMediumImageNodes({
      parent: node.id,
      url: `https://cdn-images-1.medium.com/max/500/${
        node.virtuals.previewImage.imageId
      }`,
      store,
      cache,
      createNode,
      createNodeId,
      createRemoteFileNode,
      createContentDigest,
    })
    createParentChildLink({
      parent: node,
      child: localMediumNode,
    })
  }
}

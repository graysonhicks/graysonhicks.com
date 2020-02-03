/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`)
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const crypto = require('crypto')

const getGithub = require('./apis/github.js')
const getTweets = require('./apis/twitter/getTweets.js')
const buildTwitterImageNodes = require('./apis/twitter/buildTwitterImages.js')

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

  if (type !== 'Tweet') {
    return
  }

  if(node.images) {
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

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blog.js`)
  const result = await graphql(`
    {
      allMdx(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `/blog${node.frontmatter.slug}`,
      component: blogPostTemplate,
      context: {
        slug: node.frontmatter.slug
      },
    })
  })
}

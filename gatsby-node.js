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

  return Promise.all([getGithub(createNode), getTweets(createNode)])
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

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blog.js`)
  const result = await graphql(`
    {
      blogs: allFile(
        sort: { order: DESC, fields: [childMdx___frontmatter___date] }
        filter: { absolutePath: { regex: "/blogs/" } }
      ) {
        edges {
          node {
            childMdx {
              frontmatter {
                slug
              }
            }
          }
        }
      }

      talks: allFile(
        sort: { order: DESC, fields: [childMdx___frontmatter___date] }
        filter: { absolutePath: { regex: "/talks/" } }
      ) {
        edges {
          node {
            childMdx {
              frontmatter {
                slug
              }
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
  result.data.blogs.edges.forEach(({ node }) => {
    node.childMdx &&
      createPage({
        path: `/blog${node.childMdx.frontmatter.slug}`,
        component: blogPostTemplate,
        context: {
          slug: node.childMdx.frontmatter.slug,
        },
      })
  })

  result.data.talks.edges.forEach(({ node }) => {
    node.childMdx &&
      createPage({
        path: `/talks${node.childMdx.frontmatter.slug}`,
        component: blogPostTemplate,
        context: {
          slug: node.childMdx.frontmatter.slug,
        },
      })
  })
}

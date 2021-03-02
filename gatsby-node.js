/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`)
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  // Add schema for Instagram because API can get rate-limited.
  const typeDefs = `
    type InstaNode implements Node {
        id: String
        caption: String
        username: String
        likes: Int
        localFile: File @link(by: "id", from: "localFile___NODE")
        timestamp: String
      }
  `
  createTypes(typeDefs)
}

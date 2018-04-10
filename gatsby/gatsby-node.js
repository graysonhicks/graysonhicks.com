/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const getGithub = require('./apis/github.js')
const getInsta = require('./apis/insta.js')
const getTweets = require('./apis/twitter.js')

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators

  return Promise.all([
    getGithub(createNode),
    getInsta(createNode),
    getTweets(createNode),
  ])
}

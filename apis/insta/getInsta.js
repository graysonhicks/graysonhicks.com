const crypto = require('crypto')
const auth = require('../../gatsby-auth')
const fetch = require('node-fetch')

const url =
  'https://api.instagram.com/v1/users/self/media/recent/?access_token=' +
  auth.instagram.PERSONAL_ACCESS_TOKEN +
  '&min_id=0'

const getInsta = createNode => {
  const buildInstaNodes = posts => {
    posts.forEach(post => {
      const instaNode = {
        id: post.id.toString(),
        parent: null,
        children: [],
        internal: {
          type: `InstaPost`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(post))
            .digest(`hex`),
        },
        caption: post.caption.text,
        username: post.user.username,
        video: post.videos ? post.videos.low_resolution.url : null,
        likes: post.likes.count,
        images: post.images,
        link: post.link,
        created_time: post.created_time,
      }
      createNode(instaNode)
    })
  }

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(body => {
        body.json().then(json => {
          buildInstaNodes(json.data)
          resolve()
        })
      })
      .catch(error => {
        console.log(error)
        reject()
      })
  })
}

module.exports = getInsta

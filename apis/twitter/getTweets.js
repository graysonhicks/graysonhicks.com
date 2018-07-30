var Twitter = require('twitter')
const crypto = require('crypto')

const consumer_key = process.env.TWITTER_CONSUMER_KEY
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET
const bearer_token = process.env.TWITTER_BEARER_TOKEN

const url = 'https://api.twitter.com/1.1/statuses/user_timeline/'

const client = new Twitter({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  bearer_token: bearer_token,
})

const getTweets = createNode => {
  const buildTweetNodes = tweets => {
    tweets.forEach(tweet => {
      const tweetNode = {
        id: tweet.id_str,
        parent: null,
        children: [],
        internal: {
          type: `Tweet`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(tweet))
            .digest(`hex`),
        },
        created_time: tweet.created_at,
        id_str: tweet.id_str,
        text: tweet.text,
        avatar: tweet.user.profile_image_url_https,
        images: tweet.entities.media ? tweet.entities.media : null,
        user: tweet.user,
      }
      createNode(tweetNode)
    })
  }

  return new Promise((resolve, reject) => {
    var results = client.get(
      'statuses/user_timeline',
      {
        screen_name: 'graysonhicks',
        count: 200,
        include_rts: 1,
      },
      (err, tweets, results) => {
        if (err) {
          console.log('\nError')
          console.log(err)
          reject()
        } else {
          buildTweetNodes(tweets)
          resolve()
        }
      }
    )
  })
}

module.exports = getTweets

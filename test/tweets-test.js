var tweets = require('../lib/tweets')
  , assert = require('assert')
  , nock = require('nock')

describe('Tweets', function () {

  it('returns array stream of tweets', function (done) {

    var stream = tweets({twitter: {
      consumer_key: 'abc123',
      consumer_secret: 'abc123',
      access_token: 'abc123',
      access_token_secret: 'abcer123'
    }}, '449335421432913900', function (err) {
      done(err)
    })

    var results = []
    stream.on('data', function (tweet) {
      results.push(tweet)
    })

    stream.on('end', function () {
      assert.equal(results.length, 2)
      done()
    })
  })

  beforeEach(function () {
    nock('https://api.twitter.com')
                    .get('/1.1/search/tweets.json?q=%23iosreviewtime%20OR%20%23macreviewtime%20-from%3A%40appreviewtimes&since_id=449335421432913900&count=100&include_entities=false')
                    .replyWithFile(200, __dirname + '/twitter-response.json')
  })

})

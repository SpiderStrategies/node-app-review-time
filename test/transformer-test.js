var transformer = require('../lib/transformer')()
  , assert = require('assert')
  , es = require('event-stream')
  , fs = require('fs')

describe('Transformer', function () {

  it('transforms', function (done) {
    // fs.createReadStream('./test/raw-tweets.json').pipe(es.split()).pipe(process.stdout)
    var s = fs.createReadStream('./test/raw-tweets.json').pipe(es.split()).pipe(es.parse()).pipe(transformer)

    var tweets = []
    s.on('data', function (tweet) {
      tweets.push(tweet)
    })

    s.on('end', function () {
      assert.equal(tweets.length, 3)
      assert.deepEqual(tweets.map(function (t) { return t.days }), [7, 7, 2])
      assert.deepEqual(tweets.map(function (t) { return t.day }), ['2014-03-20', '2014-03-20', '2014-03-28'])
      assert.deepEqual(tweets.map(function (t) { return t.types }), [['#iosreviewtime'], ['#iosreviewtime', '#macreviewtime'], ['#macreviewtime']])

      tweets.forEach(function (tweet) {
        assert(tweet.user)
        assert(tweet._id)
        assert(tweet.text)
        assert(tweet.created_at)
        assert(tweet.types)
      })
      done()
    })
  })

})

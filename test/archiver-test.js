var archiver = require('../lib')
  , assert = require('assert')
  , nock = require('nock')

describe('Archiver', function () {

  it('fetches last stored tweet', function (done) {
    archiver.latestId({
      couch: {
        uri: 'http://foo.com',
        key: 'key',
        password: 'pass'
      }
    }, function (err, id) {
      assert(!err)
      assert.equal(id, 123)
      done()
    })
  })

  it('uploads the tweet to couch', function (done) {
    var s = archiver({
      couch: {
        uri: 'http://foo.com',
        key: 'key',
        password: 'pass'
      },
      twitter: {
        consumer_key: 'abc123',
        consumer_secret: 'abc123',
        access_token: 'abc123',
        access_token_secret: 'abcer123'
      }
    })

    var result = ''
      , calls = 0
    s.on('data', function (d) {
      result += d.toString()
      if (++calls === 2) {
        assert.equal(result, '{"ok":true}{"ok":true}')
        done()
      }
    })
  })

  beforeEach(function () {
    nock('http://foo.com')
      .get('/_all_docs?startkey=%22_%22&limit=1&descending=true')
      .reply(200, {
        rows: [{id: 123}]
      })

    nock('https://api.twitter.com')
                    .get('/1.1/search/tweets.json?q=%23iosreviewtime%20OR%20%23macreviewtime%20-from%3A%40appreviewtimes&since_id=123&count=100&include_entities=false')
                    .replyWithFile(200, __dirname + '/twitter-response.json')

    nock('http://foo.com')
      .post('/', {
        _id: '449342149075951600',
        text: 'Review for CrewKeeper 1.14.2, https://t.co/uxg4wxcrTb took 4 days #iosreviewtime.',
        day: '2014-03-28',
        created_at: 'Fri Mar 28 00:28:11 +0000 2014',
        user: 'DeanSDavids',
        types: ['#iosreviewtime'],
        days: 4
      })
      .reply(200, {
        ok: true
      })

    nock('http://foo.com')
      .post('/', {
        _id: '449335421432913900',
        text: 'Particles 2.2.2 for Mac was approved after 2 days. #macreviewtime',
        day: '2014-03-28',
        created_at: 'Fri Mar 28 00:01:27 +0000 2014',
        user: 'tunabelly',
        types: ['#macreviewtime'],
        days: 2
      })
      .reply(200, {
        ok: true
      })
  })
})

var Twit = require('twit')
  , PassThrough = require('stream').PassThrough
  , es = require('event-stream')

/*
 * Find all #iosreviewtime or #macreviewtime tweets since some
 * since tweet id.
 *
 * Returns a stream of the tweets, where each data event is a tweet.
 */
module.exports = function (config, since, next) {
  var T = new Twit(config.twitter)
    , stream = new PassThrough({objectMode: true})

  T.get('search/tweets', {
    q: '#iosreviewtime OR #macreviewtime -from:@appreviewtimes',
    since_id: since,
    count: 100,
    include_entities: false
  }, function (err, reply) {
    if (err) { return next && next(err) }

    es.readArray(reply.statuses).pipe(stream)
  })
  return stream
}

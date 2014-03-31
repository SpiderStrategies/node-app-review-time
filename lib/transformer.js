var moment = require('moment')
  , es = require('event-stream')

module.exports = function () {
  return es.map(function (data, next) {
    var tweet = data.retweeted_status || data
      , match = /([0-9]*\.[0-9]+|[0-9]+) days/ig.exec(tweet.text)
      , days = match && match[1]

    if (days) {
      next(null, {
        _id: data.id.toString(),
        text: data.text,
        day: moment.utc(data.created_at).format('YYYY-MM-DD'),
        created_at: data.created_at,
        user: data.user.screen_name,
        types: tweet.text.match(/#macreviewtime|#iosreviewtime/ig).map(function (type) {
          return type.toLowerCase()
        }),
        days: parseFloat(match[1])
      })
    } else {
      next()
    }
  })
}

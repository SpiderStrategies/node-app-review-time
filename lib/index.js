var request = require('request')
  , tweets = require('./tweets')
  , transformer = require('./transformer')()
  , PassThrough = require('stream').PassThrough
  , es = require('event-stream')

module.exports = function (config, next) {
  var rs = new PassThrough({objectMode: true})

  latest(config, function (err, id) {
    if (err) { return next(err) }

    var stream = tweets(config, id).pipe(transformer)

    stream.on('data', function (d) {
      upload(config, d).on('data', function (data) {
        rs.write(data)
      })
    })

  })
  return rs
}

var upload = function (config, data) {
  return request({
    uri: config.couch.uri,
    json: data,
    method: 'POST',
    auth: {
      user: config.couch.key,
      pass: config.couch.password
    }
  })
}

/*
 * Fetches the latest tweet id
 */
var latest = module.exports.latestId = function (config, next) {
  request.get({
    uri: config.couch.uri + '/_all_docs?startkey=%22_%22&limit=1&descending=true',
    json: true,
    auth: {
      user: config.couch.key,
      pass: config.couch.password
    }
  }, function (err, response, body) {
    if (err) {
      return next(err)
    }

    return next(null, body.rows[0].id)
  })
}

#!/usr/local/bin/node

var archiver = require('../lib')
  , config = require('../config.json')

archiver(config, function (err) {
  if (err) {
    throw err
  }
}).pipe(process.stdout)

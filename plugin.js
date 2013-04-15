"use strict"

var karma = require('karma');

var registration = function(config, register) {
  if (config.karma && config.isWatch) {
    register(['postBuild'], 'complete', _startKarma);
  }
};

var _startKarma = function(config) {
  karma.server.start(config.karma);
};

module.exports = {
  registration: registration
};
"use strict"

var karma = require('karma');

var registration = function(config, register) {
  if (config.karma && config.isWatch) {
    register(['postBuild'], 'complete', _startKarma);
  }
};

var _startKarma = function(config, options, next) {
  karma.server.start(config.karma, function(exitCode){
    if (exitCode) {
      config.log.error("Tests failed.", { exitIfBuild: true });
    }

    next();
  });
};

module.exports = {
  registration: registration
};
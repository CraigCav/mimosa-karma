"use strict"

var config = require('./config');
var plugin = require('./plugin');

module.exports = {
  registration:     plugin.registration,
  defaults:         config.defaults,
  placeholder:      config.placeholder,
  validate:         config.validate
};
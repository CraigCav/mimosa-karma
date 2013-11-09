"use strict"

var fs = require('fs');
var path = require('path');

exports.defaults = function() {
  return {
    karma: {
      externalConfig: false,
      configFile: 'karma.conf.js',
      basePath: '',
      autoWatch: true
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n"+
         "  # karma:                            # Configuration for executing tests via karma\n" +
         "    # configFile: 'karma.conf.js'     # Optional path to an external karma configuration file, see: \n" +
         "                                      # [http://karma-runner.github.io/0.8/config/configuration-file.html]\n" +
         "    # externalConfig: false           # If an external karma configuration file is used, no further settings are needed. \n\n" +

         "    # files: [                        # List of files/patterns/adapters for karma to load in the browser.\n" +
         "    # JASMINE: true                   # The first thing you usually need is an adapter for your test lib.\n" +
         "    # JASMINE_ADAPTER: true           # If you want to use any of these, add <FRAMEWORK> and <FRAMEWORK>_ADAPTER to your files list.\n" +
         "    # REQUIRE: true                   # The following adapters are bundled with Karma:\n" +
         "    # REQUIRE_ADAPTER: true           # Jasmine (JASMINE, JASMINE_ADAPTER)\n" +
         "                                      # Mocha (MOCHA, MOCHA_ADAPTER)\n" +
         "                                      # QUnit (QUNIT, QUNIT_ADAPTER)\n" +
         "                                      # RequireJS (REQUIRE, REQUIRE_ADAPTER)\n" +
         "                                      # Angular Scenario Runner (ANGULAR_SCENARIO, ANGULAR_SCENARIO_ADAPTER).\n" +
         "                                      # You will also want to include files and patterns to tell karma about your \n" +
         "                                      # source and test modules: \n" +
         "    # 'tests/test.main.js'            # All the relative patterns will get resolved to basePath first.\n" +
         "                                      # If the basePath is a relative path, it gets resolved to the directory where the configuration file is.\n" +
         "                                      # You can also use expressions to resolve paths.\n" +
         "    # {pattern: 'public/javascripts/**/*.js', included: false }\n" +
         "                                      # When incling modules to be loaded require, set included: false.\n" +
         "    # ]\n" +

         "    # autoWatch: true                 # Enable or disable executing the tests whenever one of these files changes. \n" +
         "    # basePath: ''                    # Base path that will be used to resolve all relative paths defined in \n" +
         "                                      # files and exclude. If basePath is a relative path, it will be resolved to the __dirname of the configuration file.\n" +
         "    # browsers: []                    # A list of browsers to launch and capture. Once Karma is shut down, it will shut down these \n" +
         "                                      # browsers as well. You can capture any browser manually just by opening a url, where Karma's web server is listening. \n" +
         "                                      # currently available: Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows). \n";
};

exports.validate = function(config, validators) {
  var errors = [];
  validators.ifExistsIsObject(errors, "karma config", config.karma);

  if(config.karma.externalConfig) {
    config.karma.configFile = validators.determinePath(config.karma.configFile, config.root);

    if(!fs.existsSync(config.karma.configFile))
      errors.push("config.karma.configFile [[ " + config.karma.configFile + " ]] cannot be found");
    else if (fs.statSync(config.karma.configFile).isDirectory())
      errors.push ("config.karma.configFile [[ " + config.karma.configFile + " ]] cannot be found, expecting a file and is a directory");
  }
  else {
    //remove default config settings in order to prevent karma looking for it
    config.karma.configFile = undefined;
  }

  if (typeof config.karma.basePath === "string") {
    config.karma.basePath = validators.determinePath(config.karma.basePath, config.root);
  }

  //include adapters [http://karma-runner.github.io/0.8/config/files.html]
  if(config.karma.files) {
    _resolveAdapters(config.karma.files);
  }

  return errors;
};

function _resolveAdapters(files) {
  var adapters = [];
  var adapterPaths = [];
  var karmaFile = require.resolve('karma');
  var karmaPath = path.dirname(karmaFile);

  var ADAPTER_DIR = karmaPath + '/../../';
  var configEnv = {
    JASMINE: ADAPTER_DIR + 'karma-jasmine/lib/jasmine.js',
    JASMINE_ADAPTER: ADAPTER_DIR + 'karma-jasmine/lib/adapter.js',
    MOCHA: ADAPTER_DIR + 'karma-mocha/lib/mocha.js',
    MOCHA_ADAPTER: ADAPTER_DIR + 'karma-mocha/lib/adapter.js',
    ANGULAR_SCENARIO: ADAPTER_DIR + 'karma-angular-scenario/lib/angular-scenario.js',
    ANGULAR_SCENARIO_ADAPTER: ADAPTER_DIR + 'karma-angular-scenario/lib/adapter.js',
    REQUIRE: ADAPTER_DIR + 'karma-requirejs/lib/require.js',
    REQUIRE_ADAPTER: ADAPTER_DIR + 'karma-requirejs/lib/adapter.js',
    QUNIT: ADAPTER_DIR + 'karma-qunit/lib/qunit.js',
    QUNIT_ADAPTER: ADAPTER_DIR + 'karma-qunit/lib/adapter.js',
  };

  files.forEach(function(file) {
    var adapterName = null;
    //make sure file configuration is not falsey
    if(!file) return;
    //make sure file configuration is not a url (i.e. not an adapter)
    if(typeof file === "string") return;
    //make sure file configuration is not a file pattern (i.e. not an adapter)
    if(file.pattern) return;

    adapters.push(file);

    //adapter conf is in the format { JASMINE: true, JASMINE_ADAPTER: true }
    Object.keys(file).forEach(function(adapterName) {
      //if the adapter is present, but is not == true, then do not include the adapter
      if(!file[adapterName]) return;

      var resolvedPath = configEnv[adapterName];

      if(resolvedPath) adapterPaths.push(resolvedPath);
    });
  });

  //remove unresolved adaters from file list
  adapters.forEach(function(file) {
    files.splice(files.indexOf(file), 1);
  });

  //then add the resolved adapters
  adapterPaths.reverse().forEach(function(path) {
    files.unshift(path);
  });
}

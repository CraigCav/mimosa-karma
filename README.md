mimosa-karma
===========

## Overview
This is a Mimosa module for starting up a Karma test suite alongside Mimosa in order to get instant feedback on your tests whenever your code changes. 

For more information regarding Mimosa, see http://mimosajs.com
For more information regarding Karma, see http://karma-runner.github.io/

## Usage

Add `'mimosa-karma'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

To configure Karma, run `karma init karma.conf.js`. This will ask you a few questions and generate a config file for Karma named karma.conf.js. If you prefer all your configuration to be in one place however, you can alternatively use your mimosa config file, adding the relevant configuration under a section named karma.

## Example Usage using karma init


>`karma init`

Which testing framework do you want to use?
>`jasmine`

Do you want to use Require.js?
>`yes`

Do you want to capture a browser automatically?
>`Chrome`

Which files do you want to include with `<script>` tag?
>`tests/test.main.js`

Which files do you want to test?
>`public/javascripts/**/*.js`

>`tests/*spec.js`

Any files you want to exclude?
> 

Do you want Karma to watch all the files and run the tests on change?
>`yes`

Config file generated at "C:\Code\mimosa-new\karma.conf.js"


In the above example we have a folder in the root of our Mimosa application called tests. Tests contains two files: a spec file `test/example-view.spec.js` which describes the functionality of the application view `app/example-view.js` and `test/main.js` which is a file that configures RequireJS for the tests. See http://karma-runner.github.io/0.8/plus/RequireJS.html for more details about configuring RequireJS with Karma.

## Functionality

The `mimosa-karma` module will spin up a karma server whenever running `mimosa watch --server`, it will then let karma watch your configured list of files/and folders for changes and will then run your test suite.

## Default Config

```
karma:
  configFile: 'karma.conf.js'
```

* `configFile`: Optional path to an external karma configuration file, see: [http://karma-runner.github.io/0.8/config/configuration-file.html]. If an external karma configuration file is used, no other settings are needed.

## Example Config

```
  karma: 
    files: [
      JASMINE: true,
      JASMINE_ADAPTER: true,
      REQUIRE: true,
      REQUIRE_ADAPTER: true,
      {pattern: 'public/javascripts/**/*.js', included: false },
      {pattern: 'tests/*spec.js', included: false},
      'tests/test.main.js'
    ]
    autoWatch: true
    browsers: ['Chrome']
```

* `files`: List of files/patterns/adapters for karma to load in the browser.
* `autoWatch`: Enable or disable executing the tests whenever one of these files changes.
* `browsers`: A list of browsers to launch and capture. Once Karma is shut down, it will shut down these browsers as well. You can capture any browser manually just by opening a url, where Karma's web server is listening.Currently available: Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows).
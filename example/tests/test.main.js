var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return /\.spec\.js$/.test(file);
});

require({
  // karma serves files from '/base'
  baseUrl: '/base/public/javascripts',
  paths: {
    jquery: 'vendor/jquery'
  },
  // ask requirejs to load these files (all our tests)
  deps: tests,
  // start test run, once requirejs is done
  callback: window.__karma__.start
});
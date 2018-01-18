// Karma configuration
// Generated on Tue May 02 2017 20:55:08 GMT-0600 (Mountain Daylight Time)

module.exports = function(config) {
    config.set({
  
      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '..',
  
      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ['jasmine', 'karma-typescript'],
  
  
      // list of files / patterns to load in the browser
      files: [
        { pattern: './modules/lib-common/**/*.ts' },
        
        //{ pattern: './_dist/test/**/*.json', served: true, included: true },
      ],
  
  
      // list of files to exclude
      exclude: [
      ],
  
  
      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        './**/*.ts': ['karma-typescript'],
        //'./_dist/test/**/*.json': ['json_fixtures']
      },
  
      karmaTypescriptConfig: {
        compilerOptions: {
          module: "commonjs"
        },        
        tsconfig: "./modules/lib-common/tsconfig.json",
    },
      
  
      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: [/*'progress',  'coverage',*/ 'mocha', 'karma-typescript'],
  
      // add plugin settings
      /*coverageReporter: {
          reporters: [
              { type: 'html', dir: './_dist/coverage/js', subdir: function ( browser ) { return ''; } },
              { type: 'json', dir: './_dist/coverage', subdir: function ( browser ) { return ''; } },
              { type: 'lcov', dir: './_dist/coverage/lcov', subdir: function ( browser ) { return ''; } },
              { type: 'text' }
          ]
      },*/
  
      // web server port
      port: 9876,
  
  
      // enable / disable colors in the output (reporters and logs)
      colors: true,
  
  
      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,
  
  
      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: false,
  
  
      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['Chrome'],
  
  
      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: true,
  
  
      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity
    })
  }
  
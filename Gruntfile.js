const webpackDevConfig = require('./webpack.dev');
const webpackProdConfig = require('./webpack.prod');

module.exports = function(grunt) {

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    run: {
      jest: {
        cmd: 'jest',
      }
    },

    eslint: {
      options: {
        fix: true
      },
      target: 'lib'
    },

    webpack: {
      dev: webpackDevConfig,
      prod: webpackProdConfig
    },

    karma: {
      with_coverage: {
        options: {
          preprocessors: {
            'dist/jose.js': ['coverage']
          },
          reporters: ['coverage', 'progress'],
          coverageReporter: {
            type: 'lcovonly',
            dir: 'coverage/'
          },
          frameworks: ['qunit'],
          files: [
            { pattern: 'dist/jose.js', watching: false, included: false },
            { pattern: 'test/qunit-promises.js', watching: false, included: false },
            'test/jose-jwe-test.html',
            'test/jose-jws-ecdsa-test.html',
            'test/jose-jws-rsa-test.html'
          ],
          autoWatch: true,
          browsers: ['Chrome', 'ChromeHeadless', 'ChromeHeadlessNoSandbox'],
          customLaunchers: {
            ChromeHeadlessNoSandbox: {
              base: 'ChromeHeadless',
              flags: ['--no-sandbox']
            }
          },
          singleRun: true,
          plugins: ['karma-coverage', 'karma-qunit', 'karma-chrome-launcher']
        }
      },
      without_coverage: {
        options: {
          frameworks: ['qunit'],
          files: [
            { pattern: 'dist/jose.js', watching: false, included: false },
            { pattern: 'test/qunit-promises.js', watching: false, included: false },
            'test/jose-jwe-test.html',
            'test/jose-jws-ecdsa-test.html',
            'test/jose-jws-rsa-test.html'
          ],
          autoWatch: true,
          browsers: ['Chrome', 'ChromeHeadless', 'ChromeHeadlessNoSandbox'],
          customLaunchers: {
            ChromeHeadlessNoSandbox: {
              base: 'ChromeHeadless',
              flags: ['--no-sandbox']
            }
          },
          singleRun: true
        }
      }
    },

    coveralls: {
      options: {
        debug: true,
        coverageDir: 'coverage',
        force: true,
        recursive: true
      }
    }
  };

  if (process.env.TRAVIS) {
    config.karma.with_coverage.browsers = ['ChromeHeadlessNoSandbox'];
    config.karma.without_coverage.browsers = ['ChromeHeadlessNoSandbox'];
  }

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['eslint', 'run:jest', 'webpack', 'karma:without_coverage']);
  grunt.registerTask('with_coverage', ['eslint', 'run:jest', 'webpack', 'karma:with_coverage']);
};

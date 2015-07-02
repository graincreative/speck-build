var gutil = require('gulp-util'),
  colors = gutil.colors,
  livereload = require('gulp-livereload'),
  _ = require('lodash'),
  git = require('git-rev-sync'),
  targets = require('./targets');

function SpeckBuild(gulp, setup) {

  this.gulp = gulp;
  this.config = this.setupConfig(setup);
  this.entries = this.config.entries || {
    css: ['main'],
    bundle: ['main']
  };

  this.assets = this.setupAssetsConfig(
    ['src', 'build'],
    ['images', 'js', 'css', 'fonts']
  );
  this.build = this.setupBuild();

  this.start();

  return this;
}

SpeckBuild.prototype.start = function() {

  this.add(require('./tasks/js-vendor'));
  this.add(require('./tasks/js-main'));
  this.add(require('./tasks/css-main'));
  this.add(require('./tasks/asset-optimise_images'));
  this.add(require('./tasks/asset-iconify'));
  this.add(require('./tasks/distribute'));
  this.add(require('./tasks/help'));

  this.gulp.task('assets', ['assets:iconify'])

  this.gulp.task('build', [
    'js:main',
    'js:vendor',
    'css:main',
  ]);
};

SpeckBuild.prototype.setupConfig = function(setup) {
  var config = {vendorJS: []};
  setup.call(config);
  config.currentRevision = git.short();
  return config;
};

SpeckBuild.prototype.setupAssetsConfig = function(outs, resources) {

  var assets = {
    directory: this.config.assetsDirectory
  };

  _.forEach(outs, function(out) {
    assets[out] = {};
    _.forEach(resources, function(resource) {
      assets[out][resource] = assets.directory + '/' + out + '/' + resource;
    });
  });
  return assets;
};

SpeckBuild.prototype.add = function(mdl) {
  mdl.call({}, this.gulp, {
    assets: this.assets,
    config: this.config,
    entries: this.entries,
    build: this.build
  });
};

SpeckBuild.prototype.setupBuild = function() {

  var build = {
      flags: {
        rebuild: false,
        livereload: false
      }
    },
    targetName = 'development',
    onOrOff = function(flag) {
      return colors[flag ? 'green' : 'cyan'](flag ? 'on' : 'off');
    };

  if (this.assets.directory === undefined) {
    throw 'Define assets directory.';
  }

  if (process.argv.indexOf('--production') > -1) {
    targetName = 'production';
  } else if (process.argv.indexOf('--staging') > -1) {
    targetName = 'staging';
  }

  if (targets.hasOwnProperty(targetName)) {
    build.env = targets[targetName];
  } else {
    throw (targetName + ' is not a defined build target!');
  }

  if (process.argv.indexOf('--live') > -1) {
    build.flags.livereload = true;
    build.flags.rebuild = true;
    this.watchAndBuild(build);
    this.liveReload();
  } else if (process.argv.indexOf('--watch') > -1) {
    build.flags.rebuild = true;
    this.watchAndBuild(build);
  }

  gutil.log(
    colors.bold.white('SPECK') + ' + ' + colors.white('Gulp') + ' + ' +
    colors.white(this.config.name) + ' = ' + colors.bold.red('<3')
  );

  gutil.log(
    colors.dim('(') + colors.underline('Build target') + ': ' +
    colors.cyan(build.env.name) + ', ',
    colors.underline('Rebuilds') + ': ' +
    onOrOff(build.flags.rebuild) + ', ',
    colors.underline('LiveReload') + ': ' +
    onOrOff(build.flags.livereload) + ', ',
    colors.underline('Version') + ': ' +
    colors.cyan(this.config.version + '/' + this.config.currentRevision) + colors.dim(')')
  );

  return build;
};

SpeckBuild.prototype.liveReload = function(build) {
  var _this = this;
  var server = livereload.listen({
    basePath: this.assets.directory + '/build/'
  });

  this.gulp.watch(_.map(this.entries.bundles, function(fileName) {
    return _this.assets.build.js + '/' + fileName + '.js';
  })).on('change', livereload.changed);

  this.gulp.watch(_.map(this.entries.css, function(fileName) {
    return _this.assets.build.css + '/' + fileName + '.css';
  })).on('change', livereload.changed);
};

SpeckBuild.prototype.watchAndBuild = function(build) {
  this.gulp.watch(
    [this.assets.src.css + '/**/*'],
    ['css:main']
  );
};

module.exports = SpeckBuild;

var gutil = require('gulp-util'),
  colors = gutil.colors,
  livereload = require('gulp-livereload'),
  _ = require('lodash'),
  git = require('git-rev-sync'),
  targets = require('./targets');

function SpeckBuild(gulp, setup) {

  this.gulp = gulp;
  this.config = this.setupConfig(setup);
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
  this.add(require('./tasks/js-lint'));
  this.add(require('./tasks/js-main'));
  this.add(require('./tasks/css-lint'));
  this.add(require('./tasks/css-main'));
  this.add(require('./tasks/asset-optimise_images'));
  this.add(require('./tasks/asset-iconify'));
  this.add(require('./tasks/distribute'));
  this.add(require('./tasks/help'));

  this.gulp.task('build', [
    'js:main',
    'js:vendor',
    'css:main',
    'assets:iconify'
  ].concat(this.build.flags.lint ? ['js:lint', 'css:lint'] : []));
};

SpeckBuild.prototype.setupConfig = function(setup) {
  var config = {};
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
    build: this.build
  });
};

SpeckBuild.prototype.setupBuild = function() {

  var build = {
      flags: {
        rebuild: false,
        livereload: false,
        lint: !(process.argv.indexOf('--no-lint') > -1)
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
    this.watchAndBuild();
    this.liveReload();
  } else if (process.argv.indexOf('--watch') > -1) {
    build.flags.rebuild = true;
    this.watchAndBuild();
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
    colors.cyan(this.config.version + ' - ' + this.config.currentRevision) + colors.dim(')')
  );

  return build;
};

SpeckBuild.prototype.liveReload = function() {
  var server = livereload.listen({
    basePath: this.assets.directory
  });

  this.gulp.watch([this.assets.build.js + '/main.js']).on('change', livereload.changed);
  this.gulp.watch([this.assets.build.css + '/style.css']).on('change', livereload.changed);
};

SpeckBuild.prototype.watchAndBuild = function() {
  this.gulp.watch([this.assets.src.js + '/**/*'], ['js:lint']);
  this.gulp.watch(
    [this.assets.src.css + '/**/*'],
    ['css:lint', 'css:main']
  );
};

module.exports = SpeckBuild;

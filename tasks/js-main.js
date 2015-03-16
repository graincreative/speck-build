module.exports = function(gulp, speck) {
  return gulp.task('js:main', function() {
    var browserify = require('browserify'),
    watchify = require('watchify'),
    envify = require('envify/custom'),
    babelify = require('babelify'),
    brfs = require('brfs'),
    collapse = require('bundle-collapser/plugin'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    size = require('gulp-size'),
    insert = require('gulp-insert'),
    merge = require('merge-stream'),
    _ = require('lodash'),
    gulpif = require('gulp-if');

    function generateBundle(entry) {
      var bundle,
      bundler;

      bundler = browserify({
        debug: true
      })
      .transform(babelify)
      .require(speck.assets.src.js + '/' + entry, {entry: true});

      if (speck.build.env.optimise) {
        bundler.plugin(collapse);
      }

      bundler.transform(brfs)
      .transform(envify({
        config: speck.config,
        build: speck.build
      }));

      bundle = function() {
        return bundler.bundle()
        .on('error', notify.onError('Bundle Error: <%= error.message %>'))
        .pipe(source(entry + '.js'))
        .pipe(gulpif(speck.build.env.sourcemaps, streamify(sourcemaps.init({
          loadMaps: true
        }))))
        .pipe(gulpif(speck.build.env.optimise, streamify(stripDebug())))
        .pipe(gulpif(speck.build.env.optimise, streamify(uglify())))
        .pipe(gulpif(speck.build.env.optimise, insert.prepend(
          '/*\n' +
          '* ' + speck.config.name + ', ' + speck.config.version + ' (' + speck.config.currentRevision + ')\n' +
          '* ' + entry + '.js built ' + new Date().toISOString().substring(0, 10) + '\n' +
          '* Don\'t edit this file directly.\n' +
          '*/\n'
        )))
        .pipe(streamify(size({gzip: true, title: entry + '.js'})))
        .pipe(gulpif(speck.build.env.sourcemaps, streamify(sourcemaps.write('./'))))
        .pipe(gulp.dest(speck.assets.build.js));
      };

      if (speck.build.flags.rebuild) {
        bundler = watchify(bundler);
        bundler.on('update', bundle);
      }

      return bundle();
    };

    return merge(_.map(speck.entries.bundles, generateBundle));
  });
};

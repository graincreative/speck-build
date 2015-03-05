
module.exports = function(gulp, speck) {
  return gulp.task('css:main', function() {
    var sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    minifyCSS = require('gulp-minify-css'),
    streamify = require('gulp-streamify'),
    gulpif = require('gulp-if'),
    size = require('gulp-size'),
    merge = require('merge-stream'),
    _ = require('lodash'),
    notify = require('gulp-notify');

    function sassPipeline(entry) {
      return sass(speck.assets.src.css + '/' + entry + '.scss', {
        sourcemap: speck.build.env.sourcemaps,
        style: 'expanded',
        precision: 10,
        container: 'gulp-ruby-sass-' + entry
      })
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe(postcss([autoprefixer({browsers: ['> 1%', 'last 6 versions', 'Safari 5', 'Firefox ESR', 'Opera 12.1']})]))
      .pipe(gulpif(speck.build.env.optimise, minifyCSS({})))
      .pipe(streamify(size({gzip: true, title: entry + '.css'})))
      .pipe(gulp.dest(speck.assets.build.css));
    }

    return merge(_.map(speck.entries.css, sassPipeline));
  });


};

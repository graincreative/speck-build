
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
      notify = require('gulp-notify');

    return sass(speck.assets.src.css + '/style.scss', {
      sourcemap: speck.build.env.sourcemaps,
      style: 'expanded',
      precision: 10

    })
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe(postcss([autoprefixer({browsers: ['> 1%', 'last 6 versions', 'Safari 5', 'Firefox ESR', 'Opera 12.1']})]))
      .pipe(gulpif(speck.build.env.optimise, minifyCSS({})))
      .pipe(streamify(size({gzip: true, title: 'main.css'})))
      .pipe(gulp.dest(speck.assets.build.css));
  });

};

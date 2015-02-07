module.exports = function(gulp, speck) {
  return gulp.task('js:lint', function() {
    var jshint = require('gulp-jshint'),
      jscs = require('gulp-jscs');

    return gulp.src([speck.assets.src.js + '/**/*'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jscs());
  });
};

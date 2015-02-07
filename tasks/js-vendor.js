module.exports = function(gulp, speck) {
  return gulp.task('js:vendor', function() {
    var uglify = require('gulp-uglify'),
      gulpif = require('gulp-if'),
      concat = require('gulp-concat');

    return gulp.src(speck.config.vendorJS)
      .pipe(gulpif(speck.build.env.optimise, uglify()))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(speck.assets.build.js));
  });
};

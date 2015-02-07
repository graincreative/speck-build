module.exports = function(gulp, speck) {
  return gulp.task('distribute', function() {
    var rev = require('gulp-rev');

    return gulp.src(speck.assetsDirectory + '/build/**/*')
      .pipe(rev())
      .pipe(gulp.dest(speck.assetsDirectory + '/dist'))
      .pipe(rev.manifest())
      .pipe(gulp.dest(speck.assetsDirectory + '/dist'));
  });
};

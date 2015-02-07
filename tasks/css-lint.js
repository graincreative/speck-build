
module.exports = function(gulp, speck) {
  return gulp.task('css:lint', function() {
    var scsslint = require('gulp-scss-lint'),
      gutil = require('gulp-util'),
      colors = gutil.colors,
      scssLintReporter = function(file) {
        /*jshint maxlen:200*/
        if (file.scsslint.success) {
          return;
        }
        file.scsslint.issues.forEach(function(issue) {
          gutil.log(
            colors.cyan(file.relative) + ':' + colors.magenta(issue.line),
            colors.yellow('[' + (issue.severity === 'warning' ? 'W' : 'E') + ']'),
            colors.green(issue.linter + ':'),
            issue.reason
          );
        });
      };

      return gulp.src([speck.assets.src.css + '/**/*.scss'])
      .pipe(scsslint({
        config: './.scss-lint.yml',
        customReport: scssLintReporter
      }));
  });
};

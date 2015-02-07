module.exports = function(gulp, speck) {
  var help = function() {
    var gutil = require('gulp-util'),
      colors = gutil.colors;

    gutil.log(colors.white.bold('SPECK') + ': guidelines for Grain sites.');
    gutil.log('See ' + colors.underline.blue('http://speck.strapped.co/') + ' for documentation.');
  };

  gulp.task('help', help);
  gulp.task('default', help);

};

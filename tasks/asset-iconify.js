module.exports = function(gulp, speck) {
  return gulp.task('assets:iconify', ['assets:optimise_images'], function() {
    var iconify = require('gulp-iconify');

    iconify({
      src: speck.assets.build.images + '/icons/**/*.svg',
      pngOutput: speck.assets.build.images + '/render',
      cssOutput: speck.assets.build.css + '/assets'
    });
  });
};

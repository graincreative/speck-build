module.exports = function(gulp, speck) {
  return gulp.task('assets:iconify', ['assets:optimise_images'], function() {
    var iconify = require('gulp-iconify');

    iconify({
      src: speck.assets.build.images + '/**/*.svg',
      pngOutput: speck.assets.build.images + '/render',
      cssOutput: speck.assets.build.css + '/assets',
      scssOutput: speck.assets.build.css + '/trash'
    });
  });
};

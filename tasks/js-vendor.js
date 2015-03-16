module.exports = function(gulp, speck) {
  return gulp.task('js:vendor', function() {
    var uglify = require('gulp-uglify'),
      gulpif = require('gulp-if'),
      insert = require('gulp-insert'),
      concat = require('gulp-concat');

    return gulp.src(speck.config.vendorJS)
      .pipe(gulpif(speck.build.env.optimise, uglify()))
      .pipe(concat('vendor.js'))
      .pipe(gulpif(speck.build.env.optimise, insert.prepend(
        '/*\n' +
        '* ' + speck.config.name + ', ' + speck.config.version + ' (' + speck.config.currentRevision + ')\n' +
        '* ' + 'vendor.js built ' + new Date().toISOString().substring(0, 10) + '\n' +
        '* Don\'t edit this file directly.\n' +
        '*/\n'
      )))
      .pipe(gulp.dest(speck.assets.build.js));
  });
};

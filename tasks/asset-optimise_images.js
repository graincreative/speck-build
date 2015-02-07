module.exports = function(gulp, speck) {
  return gulp.task('assets:optimise_images', function() {
    var imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      changed = require('gulp-changed'),
      _ = require('lodash'),
      svgoPlugins = _.map(speck.config.hasOwnProperty('svgoPlugins') ? speck.config.svgoPlugins : [], function(name) {
        var obj = {};
        obj[name] = true;
        return obj;
      });
    console.log(svgoPlugins);

    return gulp.src(speck.assets.src.images + '/**/*')
      .pipe(changed(speck.assets.build.images))
      .pipe(imagemin({
        progressive: true,
        use: [pngquant()],
        svgoPlugins: svgoPlugins
      }))
      .pipe(gulp.dest(speck.assets.build.images));
  });
};

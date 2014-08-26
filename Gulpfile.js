var gulp = require('gulp'),
    coffee = require('gulp-coffee');


gulp.task('watch', function() {
  gulp.watch('./lib/**/*.coffee', function(e) {
    console.log(e.path + ' changed.');
    gulp.src('./lib/**/*.coffee')
      .pipe(coffee())
      .pipe(gulp.dest('./src'));
  });
});
var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    mocha = require('gulp-spawn-mocha'),
    connect = require('gulp-connect');

gulp.task('watch', ['connect'], function() {
  gulp.watch('{lib,test}/**/*.{coffee,js}', [
    'compile', 'test', 'reload'
    ], function(e) {
      console.log(e.path + ' changed.');
  });
  gulp.watch(['test/index.html', 'src/**/*'], ['reload']);
});

gulp.task('compile', function() {
  return gulp.src('./lib/**/*.coffee')
      .pipe(coffee({bare: true}).on('error', function(err) {throw err}))
      .pipe(gulp.dest('./src'));
});

gulp.task('test', function() {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha({ui: 'tdd', bail: true}));
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('reload', function() {
  gulp.src('test/*.html')
    .pipe(connect.reload())
});

gulp.task('default', ['connect']);
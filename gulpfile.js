var gulp = require('gulp');

var webpack = require('gulp-webpack');
var shell = require('gulp-shell');


gulp.task('build', function() {
  return gulp.src('client/src/app.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('client/dist/'));
});

gulp.task('watch', function() {
  gulp.watch('client/src/*.js', ['build'])
});

gulp.task('start-server', shell.task([
  'node app.js'
]));

gulp.task('dev', ['build', 'watch', 'start-server']);
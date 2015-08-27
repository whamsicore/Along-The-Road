var gulp = require('gulp');

var webpack = require('gulp-webpack');


gulp.task('build', function() {
  return gulp.src('client/src/app.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('client/dist/'));
});
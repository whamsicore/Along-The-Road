var gulp = require('gulp');

var webpack = require('gulp-webpack');
var shell = require('gulp-shell');
var open = require('gulp-open');

// Bundles all files and runs the webpack loaders specified in webpack.config.js
gulp.task('build', function() {
  return gulp.src('client/src/app.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('client/dist/'));
});

// Watches for file changes and rebuilds
gulp.task('watch', function() {
  gulp.watch('client/src/*.js', ['build'])
});

// Starts the node server to serve static assets
gulp.task('start-server', shell.task([
  'node app.js'
]));

// opens the entry point of the app in default browser
gulp.task('open-browser', function(){
  setTimeout(function() {
    gulp.src(__filename)
      .pipe(open({uri: 'http://localhost:3000/'}));
  }, 2000);
});

gulp.task('dev', ['build', 'watch', 'start-server', 'open-browser']);
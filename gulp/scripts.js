'use strict';

var args = require('yargs').argv;
var gulp = require("gulp");
var browserify = require('browserify');
var watchify = require('watchify');
var source = require("vinyl-source-stream");

var connect = require('gulp-connect');
var uglify = require('gulp-uglify')
var streamify = require('gulp-streamify')
var gutil = require('gulp-util');

var config = require('./config.js');

gulp.task("browserify", ["static", "clean"], function() {
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: config.scripts.entry
  });

  if(args.watch) {

    b = watchify(b);

    b.on('update', function(ids) {

      var changed = b._recorded;

      gutil.log(gutil.colors.yellow(changed[0].file), 'was updated');

      var task = b.bundle()
        .pipe(source(config.scripts.output))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(config.scripts.dist));

      if(config.server.livereload || args.livereload) {
        task.pipe(connect.reload());
      }
    });

  }

  var task = b.bundle()
    .pipe(source(config.scripts.output))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(config.scripts.dist));

  return task;
});

gulp.task("scripts", ["browserify"]);

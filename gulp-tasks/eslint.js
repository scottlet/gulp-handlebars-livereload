'use strict';
/*eslint-disable no-console*/
const gulp = require('gulp');
const gulpESLint = require('gulp-eslint');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpWait = require('gulp-wait');
const CONSTS = require('./CONSTS');

gulp.task('eslint',  () => {
    return gulp.src([CONSTS.GULPFILE, CONSTS.GULP_TASKS + '/**/*.js', CONSTS.JS_SRC + '/**/*.js'])
    .pipe(gulpWait(3050))
    .pipe(gulpPlumber({errorHandler: gulpNotify.onError('ESLint Error: <%= error.message %>')}))
    .pipe(gulpESLint())
    .pipe(gulpESLint.format())
    .pipe(gulpESLint.failAfterError());
});

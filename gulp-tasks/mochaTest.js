'use strict';
const gulp = require('gulp');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpSpawnMocha = require('gulp-spawn-mocha');
const gulpWait = require('gulp-wait');

const TESTS_PATH = require('./CONSTS').TESTS_PATH;

function mochaTestLR () {
    return gulp.src(TESTS_PATH + '**/*.js', {read: false})
    .pipe(gulpWait(3050))
    .pipe(gulpPlumber({errorHandler: gulpNotify.onError('gulpMocha Error: <%= error.message %>')}))
        .pipe(gulpSpawnMocha({R: 'nyan'}));
}

function mochaTest () {
    return gulp.src(TESTS_PATH + '**/*.js', {read: false})
    .pipe(gulpPlumber({errorHandler: gulpNotify.onError('gulpMocha Error: <%= error.message %>')}))
        .pipe(gulpSpawnMocha({R: 'nyan'}));
}
gulp.task('mochaTest', ['eslint'], mochaTestLR);
gulp.task('test',  ['copy', 'eslint'], mochaTest);

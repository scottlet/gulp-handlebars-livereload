'use strict';

const gulp = require('gulp');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpSpawnMocha = require('gulp-spawn-mocha');
const gulpWait = require('gulp-wait');

const TEST_DELAY = 3050;
const TESTS_PATH = require('./CONSTS').TESTS_PATH;

function mochaTestLR() {
    return gulp.src(TESTS_PATH + '**/*.js', {read: false})
        .pipe(gulpWait(TEST_DELAY))
        .pipe(gulpPlumber({errorHandler: gulpNotify.onError('gulpMocha Error: <%= error.message %>')}))
        .pipe(gulpSpawnMocha({R: 'nyan'}));
}

function mochaTest() {
    return gulp.src(TESTS_PATH + '**/*.js', {read: false})
        .pipe(gulpPlumber({errorHandler: gulpNotify.onError('gulpMocha Error: <%= error.message %>')}))
        .pipe(gulpSpawnMocha({R: 'nyan'}));
}

gulp.task('mochaTest', ['eslint'], mochaTestLR);
gulp.task('test', ['copy', 'eslint'], mochaTest);

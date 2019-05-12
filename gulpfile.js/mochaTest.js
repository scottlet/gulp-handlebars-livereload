'use strict';

const eslint = require('./eslint');
const {src, parallel} = require('gulp');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpSpawnMocha = require('gulp-spawn-mocha');
const gulpWait = require('gulp-wait');

const TEST_DELAY = 3050;
const TESTS_PATH = require('./CONSTS').TESTS_PATH;

function mochaTestLR() {
    return src(TESTS_PATH + '**/*.js', {read: false})
        .pipe(gulpWait(TEST_DELAY))
        .pipe(gulpPlumber({errorHandler: gulpNotify.onError('gulpMocha Error: <%= error.message %>')}))
        .pipe(gulpSpawnMocha({R: 'nyan'}));
}

function mochaTest() {
    return src(TESTS_PATH + '**/*.js', {read: false})
        .pipe(gulpPlumber({errorHandler: gulpNotify.onError('gulpMocha Error: <%= error.message %>')}))
        .pipe(gulpSpawnMocha({R: 'nyan'}));
}

module.exports = {
    test: parallel(eslint, mochaTest),
    mochaTest: parallel(eslint, mochaTestLR)
};

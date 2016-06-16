'use strict';

const browserify = require('browserify');
const CONSTS = require('./CONSTS');
const gulp = require('gulp');
const gulpIf =require('gulp-if');
const gulpLivereload = require('gulp-livereload');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpUglify = require('gulp-uglify');
const gulpUtil = require('gulp-util');
const vinylBuffer = require('vinyl-buffer');
const vinylSourceStream = require('vinyl-source-stream');
const watchify = require('watchify');

const isDev = (CONSTS.NODE_ENV !== 'production');

let options = {
    entries:  [].concat(CONSTS.JS_ENTRY),
    cache: {},
    packageCache: {}
};
if (isDev) {
    options.plugin = [watchify];
}

let b = browserify(options);

function doLR () {
    if (process.env.OVERRIDE_LR === 'true') {
        return false;
    }
    return isDev;
}

function bundle() {
    return b.bundle()
    .pipe(gulpPlumber({errorHandler: gulpNotify.onError('Bundle Error: <%= error.message %>')}))
    .pipe(vinylSourceStream(CONSTS.JS_OUTPUT))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init({loadMaps: true}))
    .pipe(gulpUglify())
    .pipe(gulpIf(isDev, gulpSourcemaps.write()))
    .pipe(gulp.dest(CONSTS.JS_DEST))
    .pipe(gulpIf(doLR(), gulpLivereload({
        port: CONSTS.LIVERELOAD_PORT
    })));
}

b.on('update', bundle);
b.on('log', gulpUtil.log);
b.on('error', gulpUtil.log);

gulp.task('browserify', bundle);

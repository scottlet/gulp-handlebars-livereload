'use strict';

const browserify = require('browserify');
const CONSTS = require('./CONSTS');
const glob = require('glob');
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

let entries = glob.sync(CONSTS.JS_SRC + '*.js');

function addToBrowserify(entry) {
    let options = {
        entries:  [entry],
        cache: {},
        packageCache: {}
    };
    let name = entry.replace(/.*\/(\w+).js/, '$1');
    let uglifyOptions = {
        compress: {
            drop_console: true
        }
    };

    if (isDev) {
        options.plugin = [watchify];
        delete uglifyOptions.compress.drop_console;
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
            .pipe(vinylSourceStream(name + CONSTS.JS_OUTPUT))
            .pipe(vinylBuffer())
            .pipe(gulpSourcemaps.init({loadMaps: true}))
            .pipe(gulpUglify(uglifyOptions))
            .pipe(gulpIf(isDev, gulpSourcemaps.write()))
            .pipe(gulp.dest(CONSTS.JS_DEST))
            .pipe(gulpIf(doLR(), gulpLivereload({
                port: CONSTS.LIVERELOAD_PORT
            })));
    }

    b.on('update', bundle);
    b.on('log', gulpUtil.log);
    b.on('error', gulpUtil.log);
    bundle();
}

function bundle() {
    entries.forEach(addToBrowserify);
}


gulp.task('browserify', bundle);

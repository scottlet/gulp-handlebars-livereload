'use strict';

const browserify = require('browserify');
const CONSTS = require('./CONSTS');
const BREAKPOINTS = CONSTS.BREAKPOINTS || {};
const glob = require('glob');
const {dest, parallel, task} = require('gulp');
const gulpIf = require('gulp-if');
const gulpLivereload = require('gulp-livereload');
const {onError} = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpReplace = require('gulp-replace');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpUglify = require('gulp-uglify');
const fancyLog = require('fancy-log');
const vinylBuffer = require('vinyl-buffer');
const vinylSourceStream = require('vinyl-source-stream');
const watchify = require('watchify');

const isDev = CONSTS.NODE_ENV !== 'production';

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
            drop_console: true //eslint-disable-line
        }
    };

    if (isDev) {
        options.plugin = [watchify];
        delete uglifyOptions.compress.drop_console;
    }

    let b = browserify(options);

    function doLR() {
        if (process.env.OVERRIDE_LR === 'true') {
            return false;
        }

        return isDev;
    }

    function bundle() {
        return b.bundle()
            .pipe(gulpPlumber({errorHandler: onError('Bundle Error: <%= error.message %>')}))
            .pipe(vinylSourceStream(name + CONSTS.JS_OUTPUT))
            .pipe(vinylBuffer())
            .pipe(gulpReplace('$$oldMobile$$', BREAKPOINTS.OLD_MOBILE))
            .pipe(gulpReplace('$$mobile$$', BREAKPOINTS.MOBILE))
            .pipe(gulpReplace('$$smalltablet$$', BREAKPOINTS.SMALL_TABLET))
            .pipe(gulpReplace('$$tablet$$', BREAKPOINTS.TABLET))
            .pipe(gulpReplace('$$smalldesktop$$', BREAKPOINTS.SMALL_DESKTOP))
            .pipe(gulpSourcemaps.init({loadMaps: true}))
            .pipe(gulpUglify(uglifyOptions))
            .pipe(gulpIf(isDev, gulpSourcemaps.write()))
            .pipe(dest(CONSTS.JS_DEST))
            .pipe(gulpIf(doLR(), gulpLivereload({
                port: CONSTS.LIVERELOAD_PORT
            })));
    }

    b.on('update', bundle);
    b.on('log', fancyLog);
    b.on('error', fancyLog);
    bundle();
}

function createJSBundles(cb) {
    entries.forEach(addToBrowserify);
    cb();
}

task('browserify', parallel(createJSBundles));


module.exports = createJSBundles;

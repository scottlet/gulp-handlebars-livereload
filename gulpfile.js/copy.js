'use strict';

const CONSTS = require('./CONSTS');
const {src, dest, series, task} = require('gulp');
const gulpChanged = require('gulp-changed');
const gulpIf = require('gulp-if');
const gulpLivereload = require('gulp-livereload');

const STATIC_SRC = [CONSTS.IMG_SRC + '/**', CONSTS.FONT_SRC + '/**', CONSTS.VIDEO_SRC + '/**'];

function copyStaticFiles() {
    return copyFilesFn(STATIC_SRC, CONSTS.STATIC_PATH, CONSTS.SRC, true);
}

function copyFilesFn(source, destination, base, reload) {
    return src(source, {base: base || '.'})
        .pipe(gulpChanged(destination))
        .pipe(dest(destination))
        .pipe(gulpIf(reload, gulpLivereload({
            port: CONSTS.LIVERELOAD_PORT
        })));
}

task('copystatic', series(copyStaticFiles));
task('copy-lr', copyStaticFiles);

module.exports = series('copystatic');

'use strict';

const CONSTS = require('./CONSTS');
const gulp = require('gulp');
const gulpChanged = require('gulp-changed');
const gulpIf = require('gulp-if');
const gulpLivereload = require('gulp-livereload');

const STATIC_SRC = [CONSTS.IMG_SRC + '/**', CONSTS.FONT_SRC + '/**', CONSTS.VIDEO_SRC + '/**'];

function copyStaticFiles() {
    return copyFilesFn(STATIC_SRC, CONSTS.STATIC_PATH, CONSTS.SRC, true);
}

function copyFilesFn(src, dest, base, reload) {
    return gulp.src(src, {base: base || '.'})
        .pipe(gulpChanged(dest))
        .pipe(gulp.dest(dest))
        .pipe(gulpIf(reload, gulpLivereload({
            port: CONSTS.LIVERELOAD_PORT
        })));
}

gulp.task('copystatic', ['clean'], copyStaticFiles);
gulp.task('copy', ['copystatic']);
gulp.task('copy-lr', copyStaticFiles);

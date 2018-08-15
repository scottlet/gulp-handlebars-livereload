'use strict';
const gulp = require('gulp');
const gulpLivereload = require('gulp-livereload');
const gulpUtil = require('gulp-util');
const CONSTS = require('./CONSTS');
const PUBLIC = [CONSTS.IMG_SRC + '/**/!(*.svg)', CONSTS.FONT_SRC + '/**/*', CONSTS.VIDEO_SRC + '/**/*'];
const SASS = [CONSTS.CSS_SRC_PATH + '/**/*', CONSTS.IMG_SRC + '/**/*.svg'];
const DATA = [CONSTS.DATA_SRC + '/**/*', CONSTS.I18N + '/**/*.json'];

function debounce(fn, time) {
    let to;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(to);
        to = setTimeout(function () {
            fn.apply(context, args);
        }, time);
    };
}

function watch() {
    gulpLivereload.listen({
        port: CONSTS.LIVERELOAD_PORT
    });
    const watchCopiedTemplates = gulp.watch([CONSTS.TEMPLATES_DEST + '/**/*'], debounce(gulpLivereload.reload, 500));
    const watchPublic = gulp.watch(PUBLIC, ['copy-lr']);
    const watchSass = gulp.watch(SASS, ['sass-watch']);
    const watchTemplates = gulp.watch([CONSTS.TEMPLATES_SRC + '/**/*'], ['buildhtml-lr']);
    const watchData = gulp.watch(DATA, ['buildhtml-lr']);
    const watchTests = gulp.watch([CONSTS.TESTS_PATH + '/**/*.js', CONSTS.JS_SERVER_SRC + '/**/*'], ['mochaTest']);
    [
        watchCopiedTemplates,
        watchPublic,
        watchSass,
        watchData,
        watchTemplates,
        watchTests
    ].forEach((w) => {
        w.on('change', (e) => {
            gulpUtil.log(e.path, e.type);
        });
    });
}

gulp.task('watch', ['build'],  watch);

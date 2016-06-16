/*eslint-disable no-console*/
'use strict';
const gulp = require('gulp');
const gulpLivereload = require('gulp-livereload');
const gulpUtil = require('gulp-util');
const CONSTS = require('./CONSTS');

function watch() {
    gulpLivereload.listen({
        port: CONSTS.LIVERELOAD_PORT
    });
    const watchCopiedTemplates = gulp.watch([CONSTS.TEMPLATES_DEST + '/**/*'], gulpLivereload.reload);
    const watchPublic = gulp.watch([CONSTS.IMG_SRC + '/**/*', CONSTS.FONT_SRC + '/**/*'], ['copystaticfiles']);
    const watchSass = gulp.watch([CONSTS.CSS_SRC_PATH + '/**/*'], ['sass-watch']);
    const watchTemplates = gulp.watch([CONSTS.TEMPLATES_SRC + '/**/*'], ['buildhtml']);
    const watchTests = gulp.watch([CONSTS.TESTS_PATH + '/**/*.js', CONSTS.JS_SERVER_SRC + '/**/*'], ['mochaTest']);
    [
        watchCopiedTemplates,
        watchPublic,
        watchSass,
        watchTemplates,
        watchTests
    ].forEach((w) => {
        w.on('change', (e) => {
            gulpUtil.log(e.path, e.type);
        });
    });
}

gulp.task('watch', ['build'],  watch);

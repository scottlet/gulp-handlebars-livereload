'use strict';

const fancyLog = require('fancy-log');
const {watch, parallel} = require('gulp');
const gulpLivereload = require('gulp-livereload');
const {mochaTest} = require('./mochaTest');
const CONSTS = require('./CONSTS');
const DEBOUNCE_DELAY = 500;
const PUBLIC = [CONSTS.IMG_SRC + '/**/!(*.svg)', CONSTS.FONT_SRC + '/**/*', CONSTS.VIDEO_SRC + '/**/*'];
const SASS = [CONSTS.CSS_SRC_PATH + '/**/*', CONSTS.IMG_SRC + '/**/*.svg'];
const DATA = [CONSTS.DATA_SRC + '/**/*', CONSTS.I18N + '/**/*.json'];

function debounce(fn, time) {
    let to;

    return () => {
        let context = this;
        let args = arguments;

        clearTimeout(to);
        to = setTimeout(() => {
            fn.apply(context, args);
        }, time);
    };
}

function watchers(cb) {
    gulpLivereload.listen({
        port: CONSTS.LIVERELOAD_PORT
    });
    const watchCopiedTemplates = watch(
        [CONSTS.TEMPLATES_DEST + '/**/*'],
        debounce(gulpLivereload.reload, DEBOUNCE_DELAY)
    );
    const watchPublic = watch(PUBLIC, parallel('copy-lr'));
    const watchSass = watch(SASS, parallel('sass-watch'));
    const watchTemplates = watch([CONSTS.TEMPLATES_SRC + '/**/*'], parallel('buildhtml-lr'));
    const watchData = watch(DATA, parallel('buildhtml-lr'));
    const watchTests = watch([CONSTS.TESTS_PATH + '/**/*.js', CONSTS.JS_SERVER_SRC + '/**/*'], parallel(mochaTest));

    [
        watchCopiedTemplates,
        watchPublic,
        watchSass,
        watchData,
        watchTemplates,
        watchTests
    ].forEach((w) => {
        w.on('change', (path) => {
            fancyLog(`file ${path} was changed.`);
        });
    });
    cb();
}

module.exports = parallel(watchers);

const fancyLog = require('fancy-log');
const buildHtml = require('./buildhtml');
const doc = require('./doc');
const eslint = require('./eslint');
const sass = require('./sass');
const { copyStaticFiles } = require('./copy');
const { mochaTestLR } = require('./mochaTest');
const { parallel, series, watch } = require('gulp');
const gulpLivereload = require('gulp-livereload');
const CONSTS = require('./CONSTS');
const PUBLIC = [CONSTS.IMG_SRC + '/**/!(*.svg)', CONSTS.FONT_SRC + '/**/*', CONSTS.JSON_SRC + '/**/*'];
const SASS = [CONSTS.CSS_SRC_PATH + '/**/*', CONSTS.IMG_SRC + '/**/*.svg', CONSTS.COMPONENTS_SRC + '**/*.scss'];
const DATA = [CONSTS.DATA_SRC + '/**/*.json', CONSTS.I18N + '/**/*.json'];
const JS = ['src/**/*.js'];
const TEMPLATES = [CONSTS.TEMPLATES_SRC + '**/*.hbs', CONSTS.COMPONENTS_SRC + '**/*.hbs'];

function startWatch(cb) {
    gulpLivereload.listen({
        port: CONSTS.LIVERELOAD_PORT
    });
    const watchPublic = watch(PUBLIC, parallel(copyStaticFiles));
    const watchSass = watch(SASS, parallel(sass));
    const watchTemplates = watch(TEMPLATES, series(buildHtml));
    const watchData = watch(DATA, parallel(buildHtml));
    const watchTests = watch(CONSTS.JS_SRC + '**/*-test.js', parallel(mochaTestLR));
    const watchDocs = watch(JS, parallel(doc, eslint));
    const watchPackages = watch('./package.json', series(buildHtml));

    watchPublic.name = 'Public';
    watchSass.name = 'Sass';
    watchData.name = 'Data';
    watchDocs.name = 'jsDoc';
    watchTemplates.name = 'Templates';
    watchTests.name = 'Tests';
    watchPackages.name = 'package.json';

    [
        watchPublic,
        watchSass,
        watchData,
        watchDocs,
        watchTemplates,
        watchTests,
        watchPackages
    ].forEach(w => {
        w.on('change', function (path) {
            fancyLog(`file ${path} was changed. Triggered by ${this.name} watcher.`);
        });
    });
    cb();
}

module.exports = startWatch;

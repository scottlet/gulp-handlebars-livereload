const { src, dest } = require('gulp');
const gulpChanged = require('gulp-changed');
const gulpHB = require('gulp-hb');
const gulpHtmlmin = require('gulp-htmlmin');
const gulpLivereload = require('gulp-livereload');
const gulpPlumber = require('gulp-plumber');
const gulpRename = require('gulp-rename');
const helpers = require('./template-helpers');
const merge2 = require('merge2');
const through2 = require('through2');

const CONSTS = require('../CONSTS');

function buildFiles(file, enc, callback) {
    const locale = helpers.getStem(file.path);
    const finalPath = 'dist' + (locale === 'en' ? '' : '/' + locale);
    const jspath = 'dist/tmp' + (locale === 'en' ? '' : '/' + locale);
    const dynamicHelpers = helpers.getDynamicHelpers(locale);
    const staticHelpers = helpers.getStaticHelpers();
    const htmlMinOptions = {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
    };

    const hbStream = gulpHB() //({ debug: true })
        .partials('./src/templates/layouts/**/*.hbs')
        .partials('./src/templates/partials/**/*.hbs')
        .helpers(staticHelpers)
        .helpers(dynamicHelpers)
        .data('./src/data/**/*.json');

    const pages = src([
        'src/templates/**/*.hbs',
        '!src/templates/layouts/',
        '!src/templates/layouts/**/*',
        '!src/templates/partials/',
        '!src/templates/partials/**/*',
        '!src/templates/fragments/',
        '!src/templates/fragments/**/*'
    ])
        .pipe(gulpChanged(finalPath))
        .pipe(gulpPlumber({
            errorHandler: helpers.errorHandler
        }))
        .pipe(hbStream)
        .pipe(gulpRename(helpers.renameFile))
        .pipe(gulpHtmlmin(htmlMinOptions))
        .pipe(dest(finalPath))
        .pipe(gulpLivereload({ port: CONSTS.LIVERELOAD_PORT }));

    const components = src([
        'src/components/**/index.hbs',
        'src/templates/fragments/**/*.hbs'
    ])
        .pipe(gulpChanged(jspath))
        .pipe(gulpPlumber({
            errorHandler: helpers.errorHandler
        }))
        .pipe(gulpRename(helpers.renameFile))
        .pipe(gulpHtmlmin(htmlMinOptions))
        .pipe(dest(jspath))
        .pipe(gulpLivereload({ port: CONSTS.LIVERELOAD_PORT }));

    return merge2(pages, components).on('finish', callback);
}

function buildHTML() {
    helpers.setErrorShown(false);

    return src(['./src/i18n/*.json'])
        .pipe(gulpPlumber({
            errorHandler: helpers.errorHandler
        }))
        .pipe(through2.obj(buildFiles));
}

module.exports = buildHTML;

'use strict';

const CONSTS = require('./CONSTS');
const fs = require('fs');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gulpHB = require('gulp-hb');
const nodeNotify = require('node-notifier');
const gulpPlumber = require('gulp-plumber');
const gulpRename = require('gulp-rename');
const handlebarsLayouts = require('handlebars-layouts');
const i18n2 = require('i18n-2');
const through2 = require('through2');
const gulpHtmlmin = require('gulp-htmlmin');
const isProd = CONSTS.NODE_ENV === 'production';

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

const helpers = {
    capitalise: str => {
        return str.toUpperCase();
    },

    eq: (val, val2, options) => {
        if (val == val2) {
            return options.fn(this);
        }

        return options.inverse(this);
    },
    hostname: CONSTS.HOST,
    hostpath: CONSTS.PATH,
    version: packageJson.version
};

let errorShown;

function imagePathBuilder(locale) {
    let builder = pathBuilder(locale);

    return (assetPath, data) => {
        assetPath = 'images/' + assetPath;

        return builder(assetPath, data);
    };
}

function pathBuilder(locale) {
    let version = helpers.version;

    if (locale === 'en') {
        locale = '';
    } else {
        locale += '/';
    }

    return (assetPath, data) => {
        const join = '..';
        let urlparts = [];
        let newPath = assetPath.replace(/^\//, '');
        let staticasset = /^(pdfs|css|js|images|fonts|video|audio)/.test(newPath);
        let myPath = data.data.file.relative;

        if (staticasset) {
            myPath = locale + myPath;
        }

        //console.log('newpath', newPath);

        myPath.split('/').forEach((part, idx) => {
            if (idx) {
                //        console.log('EHAT', idx);
                urlparts.push(join);
            }
        });

        if (staticasset) {
            urlparts.push(version);
        }

        newPath = (urlparts.length ? urlparts.join('/') + '/' : '') + newPath;
        //console.log('filePath', data.data.file.relative);
        //console.log('orig assetpath', assetPath, 'new assetpath', newPath);

        return newPath;
    };
}

function getStem(path) {
    return path.split('/')[path.split('/').length - 1].split('.')[0];
}

function renameFile(path) {
    if (path.extname) {
        path.extname = '.html';
    }
}

function errorHandler(error) {
    if (!errorShown) {
        nodeNotify.notify({
            message: 'Error: ' + error.message,
            title: 'Gulp HTML Build',
            onLast: true
        });
        errorShown = true;
        console.error(error.name, error.message, error.fileName, error.plugin); //eslint-disable-line no-console
    }
}

function buildFiles(file, enc, callback) {
    let locale = getStem(file.path);
    let finalPath = 'dist' + (locale === 'en' ? '' : '/' + locale);
    let dynamicHelpers = {
        locale: locale,
        getLocale: () => {
            return locale;
        },
        path: pathBuilder(locale),
        imagepath: imagePathBuilder(locale)
    };

    let i18n = new i18n2({
        locales: ['en', 'de'],
        defaultLocale: 'en',
        extension: '.json',
        directory: './src/i18n',
        indent: '    ',
        dump: () => {
            throw 'error';
        }
    });

    i18n.setLocale(locale);

    dynamicHelpers.__ = text => { //eslint-disable-line
        let desktop = i18n.__(text); //eslint-disable-line
        let mobile = i18n.__(text + '_mobile'); //eslint-disable-line
        if (mobile.replace(/_mobile/gi, '') !== text) {
            return `
            <span class="ln-desktop">${desktop}</span>
            <span class="ln-mobile">${mobile}</span>
            `;
        }

        return desktop;
    };

    const hbStream = gulpHB()//{debug: true})
        .partials('./src/templates/partials/**/*')
        .partials('./src/templates/layouts/**/*')
        .helpers(handlebarsLayouts)
        .helpers(Object.assign({}, helpers, dynamicHelpers))
        .data('./src/data/**/*.json');

    gulp.src([
        'src/templates/**/*',
        '!src/templates/layouts/',
        '!src/templates/layouts/**/*',
        '!src/templates/partials/',
        '!src/templates/partials/**/*'])
        .pipe(gulpPlumber({
            errorHandler
        }))
        .pipe(hbStream)
        .pipe(gulpRename(renameFile))
        .pipe(gulpIf(isProd, gulpHtmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            removeRedundantAttributes: true
        })))
        .pipe(gulp.dest(finalPath))
        .on('error', callback)
        .on('end', callback);
}

function buildHTML() {
    errorShown = false;

    return gulp
        .src('./src/i18n/*.json')
        .pipe(through2.obj(buildFiles));

}

gulp.task('buildhtml', ['clean'], buildHTML);
gulp.task('buildhtml-lr', buildHTML);

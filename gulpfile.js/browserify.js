const browserify = require('browserify');
const CONSTS = require('./CONSTS');
const fancyLog = require('fancy-log');
const glob = require('glob');
const { dest } = require('gulp');
const gulpIf = require('gulp-if');
const gulpLivereload = require('gulp-livereload');
const { onError } = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpReplace = require('gulp-replace');
const merge2 = require('merge2');
const vinylBuffer = require('vinyl-buffer');
const vinylSourceStream = require('vinyl-source-stream');
const watchify = require('watchify');

const isDev = CONSTS.NODE_ENV !== 'production';

const entries = glob.sync(CONSTS.JS_SRC + '*.js');

function addToBrowserify(locale) {
    let localeStr = locale.replace('en', '');

    localeStr = localeStr !== '' ? localeStr += '/' : localeStr;

    return function (entry) {

        const options = {
            builtins: {},
            entries:  [entry],
            cache: {},
            debug: !!isDev,
            packageCache: {},
            paths: [
                `./${CONSTS.JS_SRC}modules`,
                `./${CONSTS.COMPONENTS_SRC}`,
                './.tmp/'
            ],
            transform: [
                ['browserify-replace', {
                    replace: [
                        { from: /\$lang\//g, to: localeStr }
                    ]
                }]
            ]
        };

        const name = entry.replace('-$lang', '-' + locale).replace('$name', CONSTS.NAME)
            .replace(/.*\/([\w$\-.]+).js/, '$1');

        const b = browserify(options);

        if (isDev) {
            b.transform('babelify', { presets: ['@babel/preset-env'], sourceMaps: true });
            b.plugin(watchify, { delay: 1000 });
        } else {
            b.transform('babelify', { presets: ['@babel/preset-env'] });
            b.plugin('tinyify', { flat: false });
        }

        function doLR() {
            if (process.env.OVERRIDE_LR === 'true') {
                return false;
            }

            process.env.OVERRIDE_LR = 'true';

            setTimeout(() => {
                process.env.OVERRIDE_LR = 'false';
            }, 500);

            return isDev;
        }

        function bundle() {
            fancyLog(`start bundle ${name}.js`);

            return b
                .bundle()
                .pipe(gulpPlumber({ errorHandler: onError('Bundle Error: <%= error.message %>') }))
                .pipe(vinylSourceStream(name + CONSTS.JS_OUTPUT))
                .pipe(vinylBuffer())
                .pipe(gulpReplace('$$version$$', CONSTS.VERSION))
                .pipe(gulpReplace('$$API$$', CONSTS.API))
                .pipe(gulpReplace('$$oldMobile$$', CONSTS.BREAKPOINTS.OLD_MOBILE))
                .pipe(gulpReplace('$$mobile$$', CONSTS.BREAKPOINTS.MOBILE))
                .pipe(gulpReplace('$$smalltablet$$', CONSTS.BREAKPOINTS.SMALL_TABLET))
                .pipe(gulpReplace('$$tablet$$', CONSTS.BREAKPOINTS.TABLET))
                .pipe(gulpReplace('$$smalldesktop$$', CONSTS.BREAKPOINTS.SMALL_DESKTOP))
                .pipe(dest(CONSTS.JS_DEST))
                .pipe(gulpIf(doLR(), gulpLivereload({
                    port: CONSTS.LIVERELOAD_PORT
                })));
        }

        b.on('update', bundle);
        b.on('log', fancyLog);
        b.on('error', fancyLog);

        return bundle();
    };
}

function createJSBundles() {
    let tasks = [];

    CONSTS.LANGS.forEach(locale => {
        tasks = tasks.concat(entries.map(addToBrowserify(locale)));
    });

    return merge2(tasks);
}


module.exports = createJSBundles;

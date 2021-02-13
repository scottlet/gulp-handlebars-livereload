import { dest } from 'gulp';
import { onError } from 'gulp-notify';
import browserify from 'browserify';
import commonShakeify from 'common-shakeify';
import fancyLog from 'fancy-log';
import { sync } from 'glob';
import gulpIf from 'gulp-if';
import gulpLivereload from 'gulp-livereload';
import gulpPlumber from 'gulp-plumber';
import gulpReplace from 'gulp-replace';
import merge2 from 'merge2';
import vinylBuffer from 'vinyl-buffer';
import vinylSourceStream from 'vinyl-source-stream';
import watchify from 'watchify';

import { CONSTS } from './CONSTS';

const {
    API,
    BREAKPOINTS,
    JS_DEST,
    LANGS,
    COMPONENTS_SRC,
    JS_OUTPUT,
    JS_SRC,
    LIVERELOAD_PORT,
    NAME,
    NODE_ENV,
    VERSION
} = CONSTS;

const isDev = NODE_ENV !== 'production';

const entries = sync(JS_SRC + '*.js');

function addToBrowserify(locale) {
    let localeStr = locale.replace('en', '');

    localeStr = localeStr !== '' ? (localeStr += '/') : localeStr;

    return function (entry) {
        const options = {
            builtins: {},
            entries: [entry],
            cache: {},
            debug: !!isDev,
            packageCache: {},
            paths: [`./${JS_SRC}modules`, `./${COMPONENTS_SRC}`, './.tmp/'],
            transform: [
                [
                    'browserify-replace',
                    {
                        replace: [{ from: /\$lang\//g, to: localeStr }]
                    }
                ]
            ]
        };

        const name = entry
            .replace('-$lang', '-' + locale)
            .replace('$name', NAME)
            .replace('$version', VERSION)
            .replace(/.*\/([\w$\-.]+).js/, '$1');

        const b = browserify(options).plugin(commonShakeify, {});

        if (isDev) {
            b.transform('babelify', {
                presets: ['@babel/preset-env'],
                sourceMaps: true
            });
            b.plugin(watchify, { delay: 100 });
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
                .pipe(
                    gulpPlumber({
                        errorHandler: onError(
                            'Bundle Error: <%= error.message %>'
                        )
                    })
                )
                .pipe(vinylSourceStream(name + JS_OUTPUT))
                .pipe(vinylBuffer())
                .pipe(gulpReplace('$$version$$', VERSION))
                .pipe(gulpReplace('$$API$$', API))
                .pipe(gulpReplace('$$oldMobile$$', BREAKPOINTS.OLD_MOBILE))
                .pipe(gulpReplace('$$mobile$$', BREAKPOINTS.MOBILE))
                .pipe(gulpReplace('$$smalltablet$$', BREAKPOINTS.SMALL_TABLET))
                .pipe(gulpReplace('$$tablet$$', BREAKPOINTS.TABLET))
                .pipe(
                    gulpReplace('$$smalldesktop$$', BREAKPOINTS.SMALL_DESKTOP)
                )
                .pipe(dest(JS_DEST))
                .pipe(
                    gulpIf(
                        doLR(),
                        gulpLivereload({
                            port: LIVERELOAD_PORT
                        })
                    )
                );
        }

        b.on('update', bundle);
        b.on('log', fancyLog);
        b.on('error', fancyLog);

        return bundle();
    };
}

function createJSBundles() {
    let tasks = [];

    LANGS.forEach(locale => {
        tasks = tasks.concat(entries.map(addToBrowserify(locale)));
    });

    return merge2(tasks);
}

export { createJSBundles as browserify };

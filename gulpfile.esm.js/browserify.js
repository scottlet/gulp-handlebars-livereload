import { dest } from 'gulp';
import { notify } from './notify';
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
  JS_OUTPUT,
  JS_SRC,
  LIVERELOAD_PORT,
  NAME,
  NODE_ENV,
  VERSION
} = CONSTS;

const isDev = NODE_ENV !== 'production';

const entries = sync(JS_SRC + '*.js');

const plugins = [
  [
    'module-resolver',
    {
      root: ['./src/js'],
      alias: {
        '~': './src/js/modules/'
      },
      extentions: ['.js', '.jsx']
    }
  ]
];

/**
 * Creates a function that adds a Browserify bundle for a specific locale.
 * @param {string} locale - The locale for which to create the bundle.
 * @returns {function(string)} A function that takes an entry point and returns a Browserify bundle.
 */
function addToBrowserify(locale) {
  let localeStr = locale.replace('en', '');

  localeStr = localeStr !== '' ? (localeStr += '/') : localeStr;

  /**
   * @param {string} entry entry
   * @returns {NodeJS.ReadWriteStream} stream
   */
  return function (entry) {
    const options = {
      builtins: {},
      entries: [entry],
      cache: {},
      debug: !!isDev,
      packageCache: {},
      paths: [`./${JS_SRC}`],
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
        plugins,
        sourceMaps: true
      });
      b.plugin(watchify, { delay: 100 });
    } else {
      b.transform('babelify', { presets: ['@babel/preset-env'], plugins });
      b.plugin('tinyify', { flat: false });
    }

    /**
     * Executes the logic for Live Reload.
     * @returns {boolean} Returns true if the Live Reload is enabled in development mode, otherwise false.
     */
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

    /**
     * Bundles the JavaScript code using Browserify.
     * @returns {NodeJS.ReadWriteStream} The bundled JavaScript code stream.
     */
    function bundle() {
      fancyLog(`start bundle ${name}.js`);

      return b
        .bundle()
        .pipe(
          gulpPlumber({
            errorHandler: notify('Bundle Error: <%= error.message %>')
          })
        )
        .pipe(vinylSourceStream(name + JS_OUTPUT))
        .pipe(vinylBuffer())
        .pipe(gulpReplace('$$version$$', VERSION))
        .pipe(gulpReplace('$$API$$', API))
        .pipe(gulpReplace('$$oldMobile$$', `${BREAKPOINTS.OLD_MOBILE}`))
        .pipe(gulpReplace('$$mobile$$', `${BREAKPOINTS.MOBILE}`))
        .pipe(gulpReplace('$$smalltablet$$', `${BREAKPOINTS.SMALL_TABLET}`))
        .pipe(gulpReplace('$$tablet$$', `${BREAKPOINTS.TABLET}`))
        .pipe(gulpReplace('$$smalldesktop$$', `${BREAKPOINTS.SMALL_DESKTOP}`))
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

/**
 * Creates JavaScript bundles for each language.
 * @returns {NodeJS.ReadWriteStream} A stream of merged tasks representing the JavaScript bundles.
 */
function createJSBundles() {
  let tasks = [];

  LANGS.forEach(locale => {
    tasks = tasks.concat(entries.map(addToBrowserify(locale)));
  });

  // @ts-ignore
  return merge2(tasks);
}

export { createJSBundles as browserify };

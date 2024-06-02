const fs = require('fs');
const DEFAULT_PORT = '9000';
const LIVERELOAD = 35679;
const RANDOM_PORT = (LIVERELOAD - 50 + Math.random() * 100).toFixed(0); // Randomize port for livereload.
const DIST = 'dist';

const { name, version } = require('../package.json');

let OPTIONS = {};

if (!process.env.LIVERELOAD_PORT) {
  process.env.LIVERELOAD_PORT = RANDOM_PORT;
}

try {
  const pth = fs.realpathSync('.');

  OPTIONS = require(pth + '/src/options.js');
} catch (ex) {} //eslint-disable-line

const STATIC_ASSETS = `${DIST}/${OPTIONS.VERSION || version}`;

const langs = fs.readdirSync('./src/i18n/').map(file => {
  return file.replace('.json', '');
});

const DEFAULTS = {
  API: '/',
  AUDIO_SRC: 'src/audio',
  BUILD_DIST: 'zip/',
  BUILD_DEST: 'dist/',
  BREAKPOINTS: {
    OLD_MOBILE: 320,
    MOBILE: 767,
    SMALL_TABLET: 600,
    TABLET: 979,
    SMALL_DESKTOP: 1440
  },
  BREAKPOINT_DEVELOPMENT: 'mobile-first',
  CSS_DEST: `${STATIC_ASSETS}/css`,
  CSS_NANO_PRESET: 'advanced',
  SASS_SRC: 'src/sass',
  DATA_SRC: 'src/data',
  DEPLOY_TARGET: 'deploy/',
  DEPLOY_DEST: `deploy/${name}-${OPTIONS.VERSION || version}`,
  DIST_DEST: `${DIST}/`,
  FONT_SRC: 'src/fonts',
  GULP_PORT: process.env.GULP_PORT || DEFAULT_PORT,
  GULP_TASKS: 'gulp-tasks',
  GULPFILE: 'gulpfile.esm.js',
  HOST: 'http://localhost:9000',
  I18N: 'src/i18n',
  IMG_SRC: 'src/images',
  JS_DEST: `${STATIC_ASSETS}/js`,
  JS_OUTPUT: '.min.js',
  JS_SRC: 'src/js/',
  JSON_SRC: 'src/json',
  LANGS: langs,
  LIVERELOAD_PORT: process.env.LIVERELOAD_PORT || RANDOM_PORT,
  NAME: OPTIONS.NAME || name,
  NODE_ENV: process.env.NODE_ENV,
  PATH: '/',
  SRC: 'src',
  STATIC_PATH: `${STATIC_ASSETS}/`,
  TEMPLATES_DEST: `${DIST}/`,
  TEMPLATES_SRC: 'src/templates/',
  TESTS_PATH: 'src/tests/',
  VERSION: OPTIONS.VERSION || version,
  VIDEO_SRC: 'src/video'
};

const CONSTS = {
  ...DEFAULTS,
  ...OPTIONS
};

export { CONSTS };

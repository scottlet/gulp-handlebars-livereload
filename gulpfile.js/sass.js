const { onError } = require('gulp-notify');
const { src, dest } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const csswring = require('csswring');
const gulpIf = require('gulp-if');
const gulpLivereload = require('gulp-livereload');
const gulpPlumber = require('gulp-plumber');
const gulpPostcss = require('gulp-postcss');
const gulpSass = require('gulp-sass');
const gulpSassVariables = require('gulp-sass-variables');
const postcssAssets = require('postcss-assets');
const postcssNormalize = require('postcss-normalize');
const postcssPresetEnv = require('postcss-preset-env');

const CONSTS = require('./CONSTS');

const isDev = CONSTS.NODE_ENV !== 'production';

const sassOptions = {
    errLogToConsole: true,
    includePaths: [
        CONSTS.COMPONENTS_SRC
    ]
};

const gulpOptions = isDev ? {
    sourcemaps: true
} : {};

gulpSass.compiler = require('node-sass');

function buildSassVariables(breakpoints) {
    let b;
    const c = {};

    for (b in breakpoints) {
        c['$' + b.toLowerCase().replace(/_/g, '')] = breakpoints[b] + 'px';
    }

    return c;
}

const sassVariables = buildSassVariables(CONSTS.BREAKPOINTS);

function styles() {
    const processors = [
        autoprefixer(),
        cssMqpacker,
        csswring,
        postcssAssets,
        postcssNormalize,
        postcssPresetEnv
    ];

    return src(CONSTS.CSS_SRC_PATH + '/**/*.scss', gulpOptions)
        .pipe(gulpPlumber({ errorHandler: onError('Styles Error: <%= error.message %>') }))
        .pipe(gulpSassVariables(sassVariables))
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpPostcss(processors))
        .pipe(dest(CONSTS.CSS_DEST_PATH, gulpOptions))
        .pipe(gulpIf(isDev, gulpLivereload({ port: CONSTS.LIVERELOAD_PORT })));
}

module.exports = styles;

'use strict';

const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const csswring = require('csswring');
const {src, dest, task, parallel} = require('gulp');
const gulpIf = require('gulp-if');
const gulpLivereload = require('gulp-livereload');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpPostcss = require('gulp-postcss');
const gulpSass = require('gulp-sass');
const gulpSassVariables = require('gulp-sass-variables');
const postcssAssets = require('postcss-assets');
const nodeBourbon = require('node-bourbon').includePaths;
const nodeNormalizeScss = require('node-normalize-scss').includePaths;

const CONSTS = require('./CONSTS');

const BREAKPOINTS = CONSTS.BREAKPOINTS || {};
const isDev = CONSTS.NODE_ENV !== 'production';
const sassOptions = {
    errLogToConsole: true,
    includePaths: [
        nodeBourbon,
        nodeNormalizeScss
    ]
};
const gulpOptions = isDev ? {
    sourcemaps: true
} : {};

function styles() {
    const processors = [
        autoprefixer({browsers: CONSTS.BROWSER_CONFIG}),
        cssMqpacker,
        csswring,
        postcssAssets
    ];

    return src(CONSTS.CSS_SRC_PATH + '/**/*.scss', gulpOptions)
        .pipe(gulpPlumber({errorHandler: gulpNotify.onError('Styles Error: <%= error.message %>')}))
        .pipe(gulpSassVariables({
            $oldmob: `${BREAKPOINTS.OLD_MOBILE}px`,
            $mob: `${BREAKPOINTS.MOBILE}px`,
            $smalltablet: `${BREAKPOINTS.SMALL_TABLET}px`,
            $tablet: `${BREAKPOINTS.TABLET}px`,
            $smalldesktop: `${BREAKPOINTS.SMALL_DESKTOP}px`
        }))
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpPostcss(processors))
        .pipe(dest(CONSTS.CSS_DEST_PATH), gulpOptions)
        .pipe(gulpIf(isDev, gulpLivereload({port: CONSTS.LIVERELOAD_PORT})));
}

task('sass-watch', parallel(styles));
task('sass', parallel(styles));

module.exports = styles;

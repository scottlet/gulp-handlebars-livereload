'use strict';
const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const csswring = require('csswring');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gulpLivereload = require('gulp-livereload');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpPostcss = require('gulp-postcss');
const gulpSass = require('gulp-sass');
const gulpSourcemaps = require('gulp-sourcemaps');
const postcssAssets  = require('postcss-assets');
const nodeBourbon = require('node-bourbon').includePaths;
const nodeNormalizeScss = require('node-normalize-scss').includePaths;
const CONSTS = require('./CONSTS');

const isDev = CONSTS.NODE_ENV !== 'production';

const sassOptions = {
    errLogToConsole: true,
    includePaths: [
        nodeBourbon,
        nodeNormalizeScss
    ]
};

function styles() {
    const processors = [
        autoprefixer({browsers: CONSTS.BROWSER_CONFIG}),
        cssMqpacker,
        csswring,
        postcssAssets
    ];
    return gulp.src(CONSTS.CSS_SRC_PATH + '/**/*.scss')
        .pipe(gulpIf(isDev, gulpSourcemaps.init()))
        .pipe(gulpPlumber({errorHandler: gulpNotify.onError('Styles Error: <%= error.message %>')}))
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpPostcss(processors))
        .pipe(gulpIf(isDev, gulpSourcemaps.write()))
        .pipe(gulp.dest(CONSTS.CSS_DEST_PATH))
        .pipe(gulpIf(isDev, gulpLivereload({port: CONSTS.LIVERELOAD_PORT})));
}

gulp.task('sass', ['clean'], styles);
gulp.task('sass-watch', styles);

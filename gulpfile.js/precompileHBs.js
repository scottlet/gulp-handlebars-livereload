const { src, dest } = require('gulp');
const rename = require('gulp-rename');
const defineModule = require('gulp-define-module');
const gulpChanged = require('gulp-changed');
const { onError } = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const precompileHandlebars = require('gulp-precompile-handlebars');
const DEST = '.tmp/compiledHandlebars/';

function precompile() {
    return src('dist/tmp/**/*.html')
        .pipe(gulpPlumber({ errorHandler: onError('Precompile HB Error: <%= error.message %>') }))
        .pipe(gulpChanged(DEST))
        .pipe(precompileHandlebars())
        .pipe(rename({ extname: '.js' }))
        .pipe(defineModule('commonjs'))
        .pipe(dest(DEST));
}

module.exports = precompile;

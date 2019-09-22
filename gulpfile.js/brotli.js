'use strict';

const CONSTS = require('./CONSTS');
const { src, dest } = require('gulp');
const gulpBrotli = require('gulp-brotli');

function brotli() {
    return src(CONSTS.DEPLOY_DEST + '/**/*.{css,svg,js,html}')
        .pipe(gulpBrotli.compress({
            skipLarger: true,
            mode: 0,
            quality: 11,
            lgblock: 0
        }))
        .pipe(dest(CONSTS.DEPLOY_DEST));
}

module.exports = brotli;

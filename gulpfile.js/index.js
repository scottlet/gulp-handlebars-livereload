'use strict';

const tasks = require('require-dir')();

const CONSTS = require('./CONSTS');

const {src, dest, parallel, series} = require('gulp');

function copyDeploy() {
    return src([CONSTS.DIST_DEST + '/**/*'], {base: 'dist'})
        .pipe(dest(CONSTS.DEPLOY_DEST));
}

const build = series(
    tasks.clean,
    parallel(
        tasks.eslint,
        tasks.copy,
        tasks.buildhtml,
        tasks.mochaTest.test,
        tasks.sass,
        tasks.browserify
    )
);

module.exports = {
    default: series(build, tasks.watch, tasks.server),
    deploy: series(build, copyDeploy)
};

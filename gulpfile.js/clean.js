'use strict';

const {sync} = require('del');
const {task} = require('gulp');

const CONSTS = require('./CONSTS');

function clean(cb) {
    sync([CONSTS.DIST_DEST, CONSTS.DEPLOY_DEST]);
    cb();
}

task('clean', clean);
module.exports = clean;

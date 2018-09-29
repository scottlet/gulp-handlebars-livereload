'use strict';

const gulp = require('gulp');
const CONSTS = require('./CONSTS');

function copyDeploy() {
    return gulp.src([CONSTS.DIST_DEST + '/**/*'], {base: 'dist'})
        .pipe(gulp.dest(CONSTS.DEPLOY_DEST));
}

gulp.task('copydeploy', ['build'], copyDeploy);
gulp.task('deploy', ['copydeploy']);

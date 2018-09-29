'use strict';

const gulp = require('gulp');

gulp.task('default', ['server']);
gulp.task('local', () => {
    gulp.start('clean', 'eslint');
});
gulp.task('build', ['eslint', 'clean', 'copy', 'buildhtml', /*'test',*/ 'sass', 'browserify']);

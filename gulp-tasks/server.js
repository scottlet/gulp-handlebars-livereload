'use strict';
/*eslint-disable no-console*/
const gulp = require('gulp');
const gulpConnect = require('gulp-connect');
const connectLivereload = require('connect-livereload');
const CONSTS = require('./CONSTS');


function makeServer() {
    const port = CONSTS.GULP_PORT;
    gulpConnect.server({
        port,
        root: './dist',
        middleware: (server) => {
            return [
                connectLivereload({
                    port: CONSTS.LIVERELOAD_PORT
                })
            ];
        }
    });
    console.log('server http://127.0.0.1:' + port);
}
gulp.task('makeserver', ['copy', 'browserify', 'sass', 'watch'], makeServer);
gulp.task('makeserver2', makeServer);
gulp.task('server', ['build', 'watch', 'makeserver']);

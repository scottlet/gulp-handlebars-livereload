'use strict';

/*eslint-disable no-console*/
const {series, parallel} = require('gulp');
const browserify = require('./browserify');
const connectLivereload = require('connect-livereload');
const CONSTS = require('./CONSTS');
const copy = require('./copy');
const gulpConnect = require('gulp-connect');
const sass = require('./sass');
const watch = require('./watch');


function makeServer(cb) {
    const port = CONSTS.GULP_PORT;

    gulpConnect.server({
        port,
        host: '0.0.0.0',
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
    cb();
}

const before = parallel(copy, browserify, sass, watch);

module.exports = series(before, makeServer);

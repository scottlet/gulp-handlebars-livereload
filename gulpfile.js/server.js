/*eslint-disable no-console*/
const connectLivereload = require('connect-livereload');
const { GULP_PORT, LIVERELOAD_PORT } = require('./CONSTS');
const { server } = require('gulp-connect');

function makeServer(cb) {
    const DOC_PORT = 9001;

    server({
        port: GULP_PORT,
        host: '0.0.0.0',
        root: './dist',
        middleware: server => {
            return [
                connectLivereload({
                    port: LIVERELOAD_PORT
                })
            ];
        }
    });
    console.log('server http://127.0.0.1:' + GULP_PORT);
    server({
        port: DOC_PORT,
        host: '0.0.0.0',
        root: './docs/gen',
        livereload: {
            port: LIVERELOAD_PORT
        }
    });
    console.log('Documentation server http://127.0.0.1:' + DOC_PORT);
    cb();
}

module.exports = makeServer;

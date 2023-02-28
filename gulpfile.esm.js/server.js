import fancyLog from 'fancy-log';
import { server } from 'gulp-connect';
import { CONSTS } from './CONSTS';
import header from 'connect-header';

const headerMiddleware = header({
    Expires: '0',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
});

const { GULP_PORT, LIVERELOAD_PORT } = CONSTS;

function makeServer(cb) {
    const DOC_PORT = 9001;

    server({
        port: GULP_PORT,
        host: '0.0.0.0',
        root: './dist',
        livereload: {
            port: LIVERELOAD_PORT
        },
        middleware: () => [headerMiddleware]
    });
    fancyLog('server http://127.0.0.1:' + GULP_PORT);
    server({
        port: DOC_PORT,
        host: '0.0.0.0',
        root: './docs/gen'
    });
    fancyLog('Documentation server http://127.0.0.1:' + DOC_PORT);
    cb();
}

export { makeServer as server };

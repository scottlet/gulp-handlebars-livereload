import fancyLog from 'fancy-log';
import connectLivereload from 'connect-livereload';
import { server } from 'gulp-connect';
import { CONSTS } from './CONSTS';

const { GULP_PORT, LIVERELOAD_PORT } = CONSTS;

function makeServer(cb) {
    const DOC_PORT = 9001;

    server({
        port: GULP_PORT,
        host: '0.0.0.0',
        root: './dist',
        middleware: () => {
            return [
                connectLivereload({
                    port: LIVERELOAD_PORT
                })
            ];
        }
    });
    fancyLog('server http://127.0.0.1:' + GULP_PORT);
    server({
        port: DOC_PORT,
        host: '0.0.0.0',
        root: './docs/gen',
        livereload: {
            port: LIVERELOAD_PORT
        }
    });
    fancyLog('Documentation server http://127.0.0.1:' + DOC_PORT);
    cb();
}

export { makeServer as server };

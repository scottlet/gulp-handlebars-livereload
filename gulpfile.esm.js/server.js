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

/**
 * Creates a server using gulp-connect and sets up middleware for live reloading,
 * proxying requests to the app server, and enabling CORS.
 * @param {Function} cb - The callback function to be called after the server is set up.
 * @returns {void} This function does not return anything.
 */
function makeServer(cb) {
  const DOC_PORT = 9001;

  server({
    silent: true,
    port: parseInt(GULP_PORT),
    host: '0.0.0.0',
    root: './dist',
    livereload: {
      port: parseInt(LIVERELOAD_PORT)
    },
    middleware: () => [headerMiddleware]
  });

  server({
    silent: true,
    port: DOC_PORT,
    host: '0.0.0.0',
    root: './docs/gen'
  });

  cb();
  console.log('\n');
  fancyLog(
    '\x1b[32m%s\x1b[0m',
    `>> Development Server http://127.0.0.1:${GULP_PORT}`,
    '\x1b[0m'
  );
  fancyLog(
    '\x1b[32m%s\x1b[0m',
    `>> Documentation server http://127.0.0.1:'${DOC_PORT}`,
    '\x1b[0m'
  );
}

export { makeServer as server };

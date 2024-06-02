import { CONSTS } from './CONSTS';
import { src, dest } from 'gulp';
import { compress } from 'gulp-brotli';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import zlib from 'zlib';

const { DEPLOY_DEST } = CONSTS;

/**
 * Compresses CSS, SVG, JS, and HTML files in the DEPLOY_DEST directory using Brotli compression.
 * @returns {NodeJS.ReadWriteStream} The stream of compressed files.
 */
function brotli() {
  return src(DEPLOY_DEST + '/**/*.{css,svg,js,html}')
    .pipe(
      gulpPlumber({
        errorHandler: notify('brotli Error: <%= error.message %>')
      })
    )
    .pipe(
      compress({
        skipLarger: true,
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          [zlib.constants.BROTLI_PARAM_MODE]: 0,
          [zlib.constants.BROTLI_PARAM_LGBLOCK]: 0
        }
      })
    )
    .pipe(dest(DEPLOY_DEST));
}

export { brotli };

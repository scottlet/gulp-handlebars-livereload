import { src, dest } from 'gulp';
import { notify } from './notify';
import gulpGZip from 'gulp-gzip';
import gulpPlumber from 'gulp-plumber';
import { CONSTS } from './CONSTS';

const { DEPLOY_DEST } = CONSTS;

/**
 * Compresses CSS, SVG, JS, and HTML files in the DEPLOY_DEST directory using gzip compression.
 * @returns {NodeJS.ReadWriteStream} The stream of compressed files.
 */
function gzip() {
  return src(DEPLOY_DEST + '/**/*.{css,svg,js,html}')
    .pipe(
      gulpPlumber({
        errorHandler: notify('gzip Error: <%= error.message %>')
      })
    )
    .pipe(gulpGZip({ gzipOptions: { level: 9 } }))
    .pipe(dest(DEPLOY_DEST));
}

export { gzip };

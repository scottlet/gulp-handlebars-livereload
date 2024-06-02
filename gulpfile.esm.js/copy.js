import { notify } from './notify';
import { src, dest } from 'gulp';
import gulpChanged from 'gulp-changed';
import gulpIf from 'gulp-if';
import gulpPlumber from 'gulp-plumber';
import gulpLivereload from 'gulp-livereload';

import { CONSTS } from './CONSTS';

const {
  JSON_SRC,
  AUDIO_SRC,
  FONT_SRC,
  IMG_SRC,
  LIVERELOAD_PORT,
  SRC,
  STATIC_PATH,
  VIDEO_SRC,
  DIST_DEST,
  DEPLOY_DEST
} = CONSTS;

const STATIC_SRC = [
  `${IMG_SRC}/**`,
  `${JSON_SRC}/**`,
  `${AUDIO_SRC}/**`,
  `${FONT_SRC}/**`,
  `${VIDEO_SRC}/**`
];

/**
 * Copies static files from the source directory to the destination directory.
 * @returns {NodeJS.ReadWriteStream} A promise that resolves when the copying is complete.
 */
function copyStaticFiles() {
  return copyFilesFn(STATIC_SRC, STATIC_PATH, SRC, true);
}

/**
 * Copies files from the source directory to the destination directory.
 * @param {string|Array<string>} srcdir - The source directory or directories to copy files from.
 * @param {string} destdir - The destination directory to copy files to.
 * @param {string} [base] - The base directory for resolving relative paths.
 * @param {boolean} [reload] - Whether to reload the files using gulp-livereload.
 * @returns {NodeJS.ReadWriteStream} A promise that resolves when the copying is complete.
 */
function copyFilesFn(srcdir, destdir, base = '.', reload) {
  return src(srcdir, { base })
    .pipe(
      gulpPlumber({
        errorHandler: notify('copy error: <%= error.message %>')
      })
    )
    .pipe(gulpChanged(destdir))
    .pipe(dest(destdir))
    .pipe(
      gulpIf(
        reload,
        gulpLivereload({
          port: LIVERELOAD_PORT
        })
      )
    );
}

/**
 * Copies the contents of the `DIST_DEST` directory to the `DEPLOY_DEST` directory.
 * @returns {NodeJS.ReadWriteStream} A stream that represents the copying operation.
 */
function copyDeploy() {
  return src([DIST_DEST + '/**/*'], { base: 'dist' }).pipe(dest(DEPLOY_DEST));
}

export { copyStaticFiles, copyDeploy };

import { notify } from './notify';
import { src } from 'gulp';
import gulpPlumber from 'gulp-plumber';
import jsdoc from 'gulp-jsdoc3';
import { CONSTS } from './CONSTS';
import { deleteSync } from 'del';

/**
 * Executes JSDoc generation and notifies on errors.
 * @param {Function} cb - The callback function to be executed after JSDoc generation is complete.
 * @returns {void} The Gulp stream with the JSDoc generation results.
 */
function doc(cb) {
  deleteSync('./docs/gen');

  src(['./README.md', `./${CONSTS.JS_SRC}**`], {
    read: false
  })
    .pipe(
      gulpPlumber({
        errorHandler: notify('jsdoc3 error: <%= error.message %>')
      })
    )
    .pipe(jsdoc(cb));
}

export { doc };

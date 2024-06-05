import { src } from 'gulp';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import gulpMocha from 'gulp-mocha';
import gulpWait from 'gulp-wait';
import { CONSTS } from './CONSTS';
import gulpChangedInPlace from 'gulp-changed-in-place';

const { SRC, GULPFILE } = CONSTS;

const TEST_DELAY = 1;

const mochaOptions = {
  require: ['esm'],
  R: 'base'
};

if (process.env.NODE_ENV === 'production') {
  mochaOptions.R = 'nyan';
}

const TESTS_SRC = [`${SRC}/**/*.test.js`, `${GULPFILE}/**/*.test.js`];

/**
 * Executes Mocha tests with a delay and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTestLR() {
  return src(TESTS_SRC, {
    read: false
  })
    .pipe(gulpWait(TEST_DELAY))
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpChangedInPlace())
    .pipe(gulpMocha(mochaOptions));
}

/**
 * Executes Mocha tests and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTest() {
  return src(TESTS_SRC, {
    read: false
  })
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpChangedInPlace())
    .pipe(gulpMocha(mochaOptions));
}

export { mochaTest, mochaTestLR };

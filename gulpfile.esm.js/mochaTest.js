import { src } from 'gulp';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import gulpMocha from 'gulp-mocha';
import { CONSTS } from './CONSTS';
import gulpChangedInPlace from 'gulp-changed-in-place';

const { SRC, GULPFILE } = CONSTS;

const mochaOptions = {
  require: ['esm'],
  reporter: 'spec'
};

if (process.env.NODE_ENV === 'production') {
  mochaOptions.reporter = 'nyan';
}

const ALL_TESTS_SRC = [`${SRC}/**/*.test.js`, `${GULPFILE}/**/*.test.js`];
const TESTS_SRC = [`${SRC}/**/*.test.js`];

/**
 * Executes Mocha tests with a delay and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTestSrc() {
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

/**
 * Executes Mocha tests and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTest() {
  return src(ALL_TESTS_SRC, {
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

export { mochaTest, mochaTestSrc };

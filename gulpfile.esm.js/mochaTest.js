import { src } from 'gulp';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import gulpSpawnMocha from 'gulp-spawn-mocha';
import gulpWait from 'gulp-wait';
import { CONSTS } from './CONSTS';
import gulpChangedInPlace from 'gulp-changed-in-place';

const { TESTS_PATH, GULPFILE } = CONSTS;

const TEST_DELAY = 3050;

const mochaOptions = {
  require: ['esm'],
  R: 'spec'
};

if (process.env.NODE_ENV === 'production') {
  mochaOptions.R = 'nyan';
}

const SRC = [`${TESTS_PATH}**/*.test.js`, `${GULPFILE}/**/*.test.js`];

/**
 * Executes Mocha tests with a delay and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTestLR() {
  return src(SRC, {
    read: false
  })
    .pipe(gulpWait(TEST_DELAY))
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpChangedInPlace())
    .pipe(gulpSpawnMocha(mochaOptions));
}

/**
 * Executes Mocha tests and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTest() {
  return src(SRC, {
    read: false
  })
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpChangedInPlace())
    .pipe(gulpSpawnMocha(mochaOptions));
}

export { mochaTest, mochaTestLR };

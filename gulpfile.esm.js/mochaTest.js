import { src } from 'gulp';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import gulpSpawnMocha from 'gulp-spawn-mocha';
import gulpWait from 'gulp-wait';
import { CONSTS } from './CONSTS';

const { TESTS_PATH } = CONSTS;

const TEST_DELAY = 3050;

/**
 * Executes Mocha tests with a delay and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTestLR() {
  return src(TESTS_PATH + '**/*.js', { read: false })
    .pipe(gulpWait(TEST_DELAY))
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpSpawnMocha({ R: 'nyan' }));
}

/**
 * Executes Mocha tests and notifies on errors.
 * @returns {NodeJS.ReadWriteStream} The Gulp stream with the Mocha test results.
 */
function mochaTest() {
  return src(TESTS_PATH + '**/*.js', { read: false })
    .pipe(
      gulpPlumber({
        errorHandler: notify('gulpMocha Error: <%= error.message %>')
      })
    )
    .pipe(gulpSpawnMocha({ R: 'nyan' }));
}

export { mochaTest, mochaTestLR };

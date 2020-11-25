import { src } from 'gulp';
import { onError } from 'gulp-notify';
import gulpPlumber from 'gulp-plumber';
import gulpSpawnMocha from 'gulp-spawn-mocha';
import gulpWait from 'gulp-wait';
import { CONSTS } from './CONSTS';

const { TESTS_PATH } = CONSTS;

const TEST_DELAY = 3050;

function mochaTestLR() {
    return src(TESTS_PATH + '**/*.js', { read: false })
        .pipe(gulpWait(TEST_DELAY))
        .pipe(
            gulpPlumber({
                errorHandler: onError('gulpMocha Error: <%= error.message %>')
            })
        )
        .pipe(gulpSpawnMocha({ R: 'nyan' }));
}

function mochaTest() {
    return src(TESTS_PATH + '**/*.js', { read: false })
        .pipe(
            gulpPlumber({
                errorHandler: onError('gulpMocha Error: <%= error.message %>')
            })
        )
        .pipe(gulpSpawnMocha({ R: 'nyan' }));
}

export { mochaTest, mochaTestLR };

import { src } from 'gulp';
import gulpESLint from 'gulp-eslint';
import { onError } from 'gulp-notify';
import gulpPlumber from 'gulp-plumber';
import { CONSTS } from './CONSTS';

const { GULPFILE, GULP_TASKS, JS_SRC } = CONSTS;

function lint() {
    return src([GULPFILE, `${GULP_TASKS}/**/*.js`, `${JS_SRC}/**/*.js`])
        .pipe(
            gulpPlumber({
                errorHandler: onError('ESLint Error: <%= error.message %>')
            })
        )
        .pipe(gulpESLint())
        .pipe(gulpESLint.format())
        .pipe(gulpESLint.failAfterError());
}

export { lint as eslint };

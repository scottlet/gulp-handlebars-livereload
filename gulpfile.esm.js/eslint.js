import { src } from 'gulp';
import gulpESLint from 'gulp-eslint';
import gulpChangedInPlace from 'gulp-changed-in-place';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';
import { CONSTS } from './CONSTS';

const { GULPFILE, GULP_TASKS, JS_SRC } = CONSTS;

function lint() {
    return src([GULPFILE, `${GULP_TASKS}/**/*.js`, `${JS_SRC}/**/*.js`])
        .pipe(
            gulpPlumber({
                errorHandler: notify('ESLint Error: <%= error.message %>')
            })
        )
        .pipe(gulpChangedInPlace())
        .pipe(gulpESLint())
        .pipe(gulpESLint.format());
}

export { lint as eslint };

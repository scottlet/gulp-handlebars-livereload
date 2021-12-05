import { notify } from './notify';
import { src } from 'gulp';
import gulpPlumber from 'gulp-plumber';
import jsdoc from 'gulp-jsdoc3';
import { CONSTS } from './CONSTS';

function doc(cb) {
    return src(
        [
            'README.md',
            `${CONSTS.SRC}/**/*.js`,
            `!${CONSTS.SRC}/node_modules/**/*`
        ],
        { read: false }
    )
        .pipe(
            gulpPlumber({
                errorHandler: notify('jsdoc3 error: <%= error.message %>')
            })
        )
        .pipe(jsdoc(cb));
}

export { doc };

import jsdoc from 'gulp-jsdoc3';
import { src } from 'gulp';
import { CONSTS } from './CONSTS';

function doc(cb) {
    return src(
        [
            'README.md',
            `${CONSTS.SRC}/**/*.js`,
            `!${CONSTS.SRC}/node_modules/**/*`
        ],
        { read: false }
    ).pipe(jsdoc(cb));
}

export { doc };

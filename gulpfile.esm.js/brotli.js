import { CONSTS } from './CONSTS';
import { src, dest } from 'gulp';
import { compress } from 'gulp-brotli';
import { notify } from './notify';
import gulpPlumber from 'gulp-plumber';

const { DEPLOY_DEST } = CONSTS;

function brotli() {
    return src(DEPLOY_DEST + '/**/*.{css,svg,js,html}')
        .pipe(
            gulpPlumber({
                errorHandler: notify('brotli Error: <%= error.message %>')
            })
        )
        .pipe(
            compress({
                skipLarger: true,
                mode: 0,
                quality: 11,
                lgblock: 0
            })
        )
        .pipe(dest(DEPLOY_DEST));
}

export { brotli };

import { CONSTS } from './CONSTS';
import { src, dest } from 'gulp';
import gulpBrotli from 'gulp-brotli';

const { DEPLOY_DEST } = CONSTS;

function brotli() {
    return src(DEPLOY_DEST + '/**/*.{css,svg,js,html}')
        .pipe(
            gulpBrotli.compress({
                skipLarger: true,
                mode: 0,
                quality: 11,
                lgblock: 0
            })
        )
        .pipe(dest(DEPLOY_DEST));
}

export { brotli };

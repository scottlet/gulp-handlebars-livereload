import { src, dest } from 'gulp';
import gulpGZip from 'gulp-gzip';
import { CONSTS } from './CONSTS';

const { DEPLOY_DEST } = CONSTS;

function gzip() {
    return src(DEPLOY_DEST + '/**/*.{css,svg,js,html}')
        .pipe(gulpGZip({ gzipOptions: { level: 9 } }))
        .pipe(dest(DEPLOY_DEST));
}

export { gzip };

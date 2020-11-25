import { src, dest } from 'gulp';
import { onError } from 'gulp-notify';
import gulpGZip from 'gulp-gzip';
import gulpPlumber from 'gulp-plumber';
import { CONSTS } from './CONSTS';

const { DEPLOY_DEST } = CONSTS;

function gzip() {
    return src(DEPLOY_DEST + '/**/*.{css,svg,js,html}')
        .pipe(
            gulpPlumber({
                errorHandler: onError('gzip Error: <%= error.message %>')
            })
        )
        .pipe(gulpGZip({ gzipOptions: { level: 9 } }))
        .pipe(dest(DEPLOY_DEST));
}

export { gzip };

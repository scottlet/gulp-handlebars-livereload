import { notify } from './notify';
import { src, dest } from 'gulp';
import gulpChanged from 'gulp-changed';
import gulpIf from 'gulp-if';
import gulpPlumber from 'gulp-plumber';
import gulpLivereload from 'gulp-livereload';

import { CONSTS } from './CONSTS';

const {
    JSON_SRC,
    AUDIO_SRC,
    FONT_SRC,
    IMG_SRC,
    LIVERELOAD_PORT,
    SRC,
    STATIC_PATH,
    VIDEO_SRC,
    DIST_DEST,
    DEPLOY_DEST
} = CONSTS;

const STATIC_SRC = [
    `${IMG_SRC}/**`,
    `${JSON_SRC}/**`,
    `${AUDIO_SRC}/**`,
    `${FONT_SRC}/**`,
    `${VIDEO_SRC}/**`
];

function copyStaticFiles() {
    return copyFilesFn(STATIC_SRC, STATIC_PATH, SRC, true);
}

function copyFilesFn(srcdir, destdir, base = '.', reload) {
    return src(srcdir, { base })
        .pipe(
            gulpPlumber({
                errorHandler: notify('copy error: <%= error.message %>')
            })
        )
        .pipe(gulpChanged(destdir))
        .pipe(dest(destdir))
        .pipe(
            gulpIf(
                reload,
                gulpLivereload({
                    port: LIVERELOAD_PORT
                })
            )
        );
}

function copyDeploy() {
    return src([DIST_DEST + '/**/*'], { base: 'dist' }).pipe(dest(DEPLOY_DEST));
}

export { copyStaticFiles, copyDeploy };

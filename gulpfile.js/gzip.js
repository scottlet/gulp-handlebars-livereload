const CONSTS = require('./CONSTS');
const { src, dest } = require('gulp');
const gulpGZip = require('gulp-gzip');

function gzip() {
    return src(CONSTS.DEPLOY_DEST + '/**/*.{css,svg,js,html}')
        .pipe(gulpGZip({ gzipOptions: { level: 9 } }))
        .pipe(dest(CONSTS.DEPLOY_DEST));
}

module.exports = gzip;

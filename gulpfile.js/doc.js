const jsdoc = require('gulp-jsdoc3');
const { src } = require('gulp');
const CONSTS = require('./CONSTS');

module.exports = function doc(cb) {
    return src([
        'README.md',
        `${CONSTS.SRC}/**/*.js`,
        `!${CONSTS.SRC}/node_modules/**/*`
    ], { read: false })
        .pipe(jsdoc(cb));
};

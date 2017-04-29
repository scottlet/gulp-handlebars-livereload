'use strict';

const RANDOM_PORT = 35729 - 50 + parseInt(Math.random() * 100, 10); // Randomize port for livereload.

const OPTIONS = {
    BROWSER_CONFIG: ['> 1%', 'IE 9'],
    CSS_DEST_PATH: 'dist/css/',
    CSS_SRC_PATH: 'src/sass',
    DATA_SRC: 'src/data',
    DEPLOY_DEST: 'deploy/',
    DIST_DEST: 'dist/',
    FONT_SRC: 'src/fonts',
    GULP_PORT: process.env.GULP_PORT || 9000,
    GULP_TASKS: 'gulp-tasks',
    GULPFILE: 'gulpfile.js',
    IMG_DEST: 'dist/images/',
    IMG_SRC: 'src/images',
    JS_DEST: 'dist/js/',
    JS_ENTRY: 'src/js/app.js',
    JS_OUTPUT: 'app.min.js',
    JS_SRC: 'src/js/',
    LIVERELOAD_PORT: process.env.LIVERELOAD_PORT || RANDOM_PORT,
    NODE_ENV: process.env.NODE_ENV,
    SRC: 'src',
    STATIC_PATH: 'dist/',
    TEMPLATES_DEST:'dist/',
    TEMPLATES_SRC:'src/templates/',
    TESTS_PATH: 'src/tests/'
};

module.exports = OPTIONS;

const {
    brotli,
    browserify,
    buildHTML: { buildHTML },
    clean,
    copy: { copyStaticFiles, copyDeploy },
    doc,
    eslint,
    gzip,
    mochaTest: { mochaTest },
    sass,
    server,
    watch
} = require('require-dir')('.', { recurse: true, extensions: ['.js'] });

const { parallel, series } = require('gulp');

const build = series(
    clean,
    parallel(
        eslint,
        doc,
        copyStaticFiles,
        series(buildHTML, browserify),
        mochaTest,
        sass
    )
);

const handlebars = series(
    buildHTML
);

module.exports = {
    browserify,
    buildHTML,
    default: series(build, parallel(watch, server)),
    deploy: series(build, copyDeploy, parallel(brotli, gzip)),
    handlebars,
    server
};

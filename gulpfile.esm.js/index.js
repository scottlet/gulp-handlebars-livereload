import { series, parallel } from 'gulp';

import { browserify } from './browserify';
import { clean } from './clean';
import { copyStaticFiles, copyDeploy } from './copy';
import { brotli } from './brotli';
import { gzip } from './gzip';
import { doc } from './doc';

import { eslint } from './eslint';
import { mochaTest } from './mochaTest';
import { sass } from './sass';
import { server } from './server';
import { watch } from './watch';
import { buildHTML } from './buildHTML';

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

const handlebars = series(buildHTML);

const defaultTask = series(build, parallel(watch, server));
const deployTask = series(build, copyDeploy, parallel(brotli, gzip));

export {
    browserify,
    buildHTML,
    defaultTask as default,
    deployTask as deploy,
    handlebars,
    server
};

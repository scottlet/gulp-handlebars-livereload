import fancyLog from 'fancy-log';
import { buildHTML } from './buildHTML';
import { doc } from './doc';
import { eslint } from './eslint';
import { sass } from './sass';
import { copyStaticFiles } from './copy';
import { mochaTestLR } from './mochaTest';
import { parallel, watch } from 'gulp';
import gulpLivereload from 'gulp-livereload';
import { CONSTS } from './CONSTS';

const {
  I18N,
  AUDIO_SRC,
  LIVERELOAD_PORT,
  DATA_SRC,
  FONT_SRC,
  IMG_SRC,
  SASS_SRC,
  JS_SRC,
  TEMPLATES_SRC,
  JSON_SRC,
  VIDEO_SRC
} = CONSTS;

const PUBLIC = [
  `${IMG_SRC}/**/*`,
  `${FONT_SRC}/**/*`,
  `${JSON_SRC}/**/*`,
  `${AUDIO_SRC}/**/*`,
  `${VIDEO_SRC}/**/*`
];
const SASS = [SASS_SRC + '/**/*', IMG_SRC + '/**/*.svg'];
const DATA = [DATA_SRC + '/**/*.json', I18N + '/**/*.json'];
const JS = ['src/**/*.js'];
const TEMPLATES = [TEMPLATES_SRC + '**/*.hbs'];

/**
 * Watches for changes in various directories and triggers corresponding tasks.
 * @param {Function} cb - The callback function to be called
 * @returns {void}
 */
function watchers(cb) {
  gulpLivereload.listen({
    port: LIVERELOAD_PORT
  });
  const watchPublic = watch(PUBLIC, copyStaticFiles);
  const watchSass = watch(SASS, sass);
  const watchTemplates = watch(TEMPLATES, buildHTML);
  const watchData = watch(DATA, buildHTML);
  const watchTests = watch(JS_SRC + '**/*-test.js', mochaTestLR);
  const watchDocs = watch(JS, parallel(doc, eslint));
  const watchPackages = watch('./package.json', buildHTML);

  [
    watchPublic,
    watchSass,
    watchData,
    watchDocs,
    watchTemplates,
    watchTests,
    watchPackages
  ].forEach(w => {
    w.on('change', function (path) {
      fancyLog(`file ${path} was changed. Triggered by ${this.name} watcher.`);
    });
  });
  cb();
}

export { watchers as watch };

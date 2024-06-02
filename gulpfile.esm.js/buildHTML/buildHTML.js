import { src, dest } from 'gulp';
import gulpChanged from 'gulp-changed';
import gulpHB from 'gulp-hb';
import gulpHtmlmin from 'gulp-htmlmin';
import gulpLivereload from 'gulp-livereload';
import gulpPlumber from 'gulp-plumber';
import gulpRename from 'gulp-rename';
import merge2 from 'merge2';
import through2 from 'through2';
import wait from 'gulp-wait';

import { CONSTS } from '../CONSTS';
import {
  getStaticHelpers,
  getDynamicHelpers,
  getStem,
  errorHandler,
  renameFile,
  setErrorShown
} from './template-helpers';

const { LIVERELOAD_PORT } = CONSTS;
const LIVERELOAD_DELAY = 250;

/**
 * Builds HTML files based on Handlebars templates and JSON data.
 * @param {object} options - The options object.
 * @param {string} options.path - The path of the file being processed.
 * @param {string} enc - The encoding of the file being processed.
 * @param {Function} callback - The callback function to be called when the build is finished.
 * @returns {NodeJS.ReadWriteStream} A stream of the merged pages and components.
 */
function buildFiles({ path }, enc, callback) {
  const locale = getStem(path);
  const finalPath = 'dist' + (locale === 'en' ? '' : '/' + locale);
  const jspath = 'dist/tmp' + (locale === 'en' ? '' : '/' + locale);
  const dynamicHelpers = getDynamicHelpers(locale);
  const staticHelpers = getStaticHelpers();
  const htmlMinOptions = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: false
  };

  const hbStream = gulpHB() //({ debug: true })
    .partials('./src/templates/layouts/**/*.hbs')
    .partials('./src/templates/partials/**/*.hbs')
    .helpers(staticHelpers)
    .helpers(dynamicHelpers)
    .data('./src/data/**/*.json');

  const pages = src([
    'src/templates/**/*.hbs',
    '!src/templates/layouts/',
    '!src/templates/layouts/**/*',
    '!src/templates/partials/',
    '!src/templates/partials/**/*',
    '!src/templates/fragments/',
    '!src/templates/fragments/**/*'
  ])
    .pipe(gulpChanged(finalPath))
    .pipe(
      gulpPlumber({
        errorHandler
      })
    )
    .pipe(hbStream)
    .pipe(gulpRename(renameFile))
    .pipe(gulpHtmlmin(htmlMinOptions))
    .pipe(dest(finalPath))
    .pipe(wait(LIVERELOAD_DELAY))
    .pipe(gulpLivereload({ port: LIVERELOAD_PORT }));

  const components = src([
    'src/components/**/index.hbs',
    'src/templates/fragments/**/*.hbs'
  ])
    .pipe(gulpChanged(jspath))
    .pipe(
      gulpPlumber({
        errorHandler
      })
    )
    .pipe(gulpRename(renameFile))
    .pipe(gulpHtmlmin(htmlMinOptions))
    .pipe(dest(jspath))
    .pipe(wait(LIVERELOAD_DELAY))
    .pipe(gulpLivereload({ port: LIVERELOAD_PORT }));

  // @ts-ignore
  return merge2(pages, components).on('finish', callback);
}

/**
 * Builds HTML files based on Handlebars templates and JSON data.
 * @returns {NodeJS.ReadWriteStream} A stream of the merged pages and components.
 */
function buildHTML() {
  setErrorShown(false);

  return src(['./src/i18n/*.json'])
    .pipe(
      gulpPlumber({
        errorHandler
      })
    )
    .pipe(through2.obj(buildFiles));
}

export { buildHTML };

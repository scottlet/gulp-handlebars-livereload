import { CONSTS } from '../../CONSTS';

const { VERSION } = CONSTS;

/**
 * Returns a function that builds an image path based on the given locale.
 * @param {string} locale - The locale used to build the image path.
 * @returns {Function} A function that takes an asset path and data, and returns the built image path.
 */
export function imagePathBuilder(locale) {
  const builder = pathBuilder(locale);

  return (assetPath, data) => {
    assetPath = `images/${assetPath}`;

    return builder(assetPath, data);
  };
}

/**
 * Returns a function that builds a path based on the given locale.
 * @param {string} locale - The locale used to build the path. If 'en', the locale is set to an empty string.
 * @returns {Function} A function that takes an asset path and data, and returns the built path.
 */
export function pathBuilder(locale) {
  let staticLocale = '';

  if (locale === 'en') {
    locale = '';
  } else {
    locale = `../${locale}/`;
    staticLocale = '../';
  }

  return (assetPath, data) => {
    const join = '..';
    const urlparts = [];
    let newPath = assetPath.replace(/^\//, '');

    const staticasset = /^(pdfs|css|js|images|fonts|video|audio)/.test(newPath);
    let myPath = data.data.file.relative;

    if (staticasset) {
      myPath = locale + myPath;
    }

    myPath.split('/').forEach((part, idx) => {
      if (idx && !staticasset) {
        urlparts.push(join);
      }
    });

    if (staticasset) {
      urlparts.push(VERSION);
    }

    if (staticasset) {
      newPath = `/${staticLocale}${VERSION}/${newPath}`;
    } else {
      newPath = (urlparts.length ? `${urlparts.join('/')}/` : '') + newPath;
    }

    newPath = newPath.replace(/ /g, '%20');

    return newPath || '/';
  };
}

/**
 * Returns the stem of a file path.
 * @param {string} path - The file path.
 * @returns {string} The stem of the file path, which is the name of the file without the extension.
 */
export function getStem(path) {
  return path.split('/')[path.split('/').length - 1].split('.')[0];
}

/**
 * Renames the file extension of a given path to ".html".
 * @param {object} path - The path object to be modified.
 * @returns {void} This function does not return a value.
 */
export function renameFile(path) {
  if (path.extname) {
    path.extname = '.html';
  }
}

import handlebars from 'handlebars';
import nodeNotify from 'node-notifier';
import i18n2 from 'i18n-2';
import { HttpError } from 'http-errors';

import { CONSTS } from '../CONSTS';

const { LANGS, HOST, PATH, NODE_ENV, NAME, VERSION } = CONSTS;

const staticHelpers = {
  uc: (/** @type {string} */ str) => {
    return str.toUpperCase();
  },
  capitalise: (/** @type {string} */ str) => {
    return str.toUpperCase();
  },
  lc: (/** @type {string} */ str) => {
    return str.toLowerCase();
  },
  str: (/** @type {number} */ num) => {
    return num + '';
  },
  inc: (/** @type {string} */ num) => {
    return parseInt(num) + 1;
  },
  concat: (/** @type {any[]} */ ...strings) => {
    strings = strings.reduce((acc, item) => {
      if (typeof item === 'string') {
        return acc + item;
      }

      return acc;
    });

    return strings;
  },
  /**
   * Executes the provided function and returns its result.
   * @param {object} options - The options object.
   * @param {Function} options.fn - The function to be executed.
   * @returns {*} The result of executing the provided function.
   */
  raw: ({ fn }) => {
    return fn();
  },

  q: (/** @type {any} */ txt) => {
    return new handlebars.SafeString(`'${txt}'`);
  },

  eq: (/** @type {any} */ val1, /** @type {any} */ val2, { fn, inverse }) => {
    if (val1 == val2) {
      return fn(this);
    }

    return inverse(this);
  },
  prev: (/** @type {number} */ num, /** @type {any} */ total) => {
    num--;

    if (num < 1) {
      return total;
    }

    return num;
  },
  next: (/** @type {number} */ num, /** @type {number} */ total) => {
    num++;

    if (num > total) {
      return 1;
    }

    return num;
  },
  times: (/** @type {number} */ n, { data, fn }) => {
    let accum = '';
    let i;

    for (i = 0; i < n; ++i) {
      data.first = i === 0;
      data.last = i === n - 1;
      data.index = i;
      accum += fn(i);
    }

    return accum;
  },
  hostname() {
    return HOST;
  },
  hostpath() {
    return PATH;
  },
  production() {
    return NODE_ENV === 'production';
  },
  name: NAME,
  version: () => VERSION,
  datestamp: () => Date.now()
};

let errorShown;

/**
 * Returns a function that builds an image path based on the given locale.
 * @param {string} locale - The locale used to build the image path.
 * @returns {Function} A function that takes an asset path and data, and returns the built image path.
 */
function imagePathBuilder(locale) {
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
function pathBuilder(locale) {
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
function getStem(path) {
  return path.split('/')[path.split('/').length - 1].split('.')[0];
}

/**
 * Renames the file extension of a given path to ".html".
 * @param {object} path - The path object to be modified.
 * @returns {void} This function does not return a value.
 */
function renameFile(path) {
  if (path.extname) {
    path.extname = '.html';
  }
}

/**
 * Handles errors that occur during the Gulp HTML build process.
 * @param {HttpError} error - The error object that occurred.
 * @returns {void} This function does not return a value.
 */
function errorHandler(error) {
  if (!errorShown) {
    nodeNotify.notify({
      message: `Error: ${error.message}`,
      title: 'Gulp HTML Build'
    });
    errorShown = true;
    console.error(error.name, error.message, error.fileName, error.plugin); //eslint-disable-line no-console
  }
}

/**
 * Sets the value of the `errorShown` variable to the provided boolean value.
 * @param {boolean} bool - The boolean value to set `errorShown` to.
 * @returns {void} This function does not return a value.
 */
function setErrorShown(bool) {
  errorShown = bool;
}

/**
 * Returns the static helpers object.
 * @returns {object} The static helpers object.
 */
function getStaticHelpers() {
  return staticHelpers;
}

/**
 * Returns an object containing dynamic helpers for the specified locale.
 * @param {string} locale - The locale for which to generate the helpers.
 * @returns {object} An object containing the following dynamic helpers:
 *   - locale: The specified locale.
 *   - getLocaleStr: A function that returns the specified locale as a string.
 *   - getLocale: A function that returns the corresponding URL path for the
 *     specified locale.
 *   - path: A function that returns the URL path for a specified file and
 *     locale.
 *   - imagepath: A function that returns the URL path for an image file and
 *     locale.
 *   - buildDate: A string representing the current date and time in the
 *     specified locale.
 *   - __: A function that translates a text string into the specified locale.
 *   - __n: A function that translates a pluralized text string into the
 *     specified locale.
 */
function getDynamicHelpers(locale) {
  const i18n = new i18n2({
    locales: LANGS,
    defaultLocale: 'en',
    extension: '.json',
    directory: './src/i18n',
    indent: '    ',
    dump: () => {
      throw 'error';
    }
  });

  const options = {
    day: 'numeric',
    year: 'numeric',
    month: 'short'
  };

  /**
   * Translates a given text into the specified locale.
   * @param {string} text - The text to be translated.
   * @returns {string} The translated text, with an optional mobile-specific translation.
   */
  function trans(text) {
    //eslint-disable-line
    let desktop = i18n.__(text); //eslint-disable-line
    let mobile = i18n.__(`${text}_mobile`); //eslint-disable-line

    if (mobile.replace(/_mobile/gi, '') !== text) {
      return `
            <span class="ln-desktop">${desktop}</span>
            <span class="ln-mobile">${mobile}</span>
            `;
    }

    return desktop;
  }

  /**
   * Translates a pluralized text string into the specified locale.
   * @param {string} one - The singular form of the text string.
   * @param {string} other - The plural form of the text string.
   * @param {number} count - The number used to determine which form of the text string to use.
   * @returns {string} The translated text string.
   */
  function ntrans(one, other, count) {
    //eslint-disable-line
    return i18n.__n(one, other, count); //eslint-disable-line
  }

  i18n.setLocale(locale);

  return {
    locale,
    getLocaleStr: () => {
      return locale;
    },
    getLocale: () => {
      return locale === 'en' ? '/' : '/de/';
    },
    path: pathBuilder(locale),
    imagepath: imagePathBuilder(locale),
    // @ts-ignore
    buildDate: new Date().toLocaleTimeString(locale, options),
    __: trans,
    __n: ntrans
  };
}

export {
  getStaticHelpers,
  errorHandler,
  renameFile,
  getStem,
  imagePathBuilder,
  pathBuilder,
  setErrorShown,
  getDynamicHelpers
};

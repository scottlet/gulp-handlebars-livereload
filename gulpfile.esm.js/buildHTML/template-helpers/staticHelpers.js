import handlebars from 'handlebars';
import { CONSTS } from '../../CONSTS';

const { HOST, PATH, NODE_ENV, NAME, VERSION } = CONSTS;

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
  /**
   * Returns a handlebars.SafeString that wraps the provided text in single quotes.
   * @param {any} txt - The text to be wrapped in single quotes.
   * @returns {handlebars.SafeString} A handlebars.SafeString that wraps the provided text in single quotes.
   */
  q: (/** @type {any} */ txt) => {
    return new handlebars.SafeString(`'${txt}'`);
  },

  eq: (/** @type {any} */ val1, /** @type {any} */ val2, { fn, inverse }) => {
    if (val1 == val2) {
      return fn(this);
    }

    return inverse(this);
  },
  prev: (/** @type {number} */ num, /** @type {number} */ total) => {
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
  /**
   * Generates a string by repeatedly calling a provided function and concatenating its results.
   * @param {number} n - The number of times to execute the provided function.
   * @param {object} options - An object containing the data and fn properties.
   * @param {object} options.data - An object containing additional data to be passed to the fn function.
   * @param {Function} options.fn - A function that is called n times with the current index as an argument.
   * @returns {string} The concatenated result of calling the fn function n times.
   */
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

/**
 * Returns the static helpers object.
 * @returns {object} The static helpers object.
 */
export function getStaticHelpers() {
  return staticHelpers;
}

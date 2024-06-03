import i18n2 from 'i18n-2';
import { CONSTS } from '../../CONSTS';
import { pathBuilder, imagePathBuilder } from './paths';

const { LANGS } = CONSTS;

/**
 * Returns an object containing dynamic helpers for the specified locale.
 * @param {string} newLocale - The locale for which to generate the helpers.
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
export function getDynamicHelpers(newLocale) {
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

  const locale = i18n.setLocale(newLocale);

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

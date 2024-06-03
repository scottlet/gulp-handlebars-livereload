import nodeNotifier from 'node-notifier';
import { HttpError } from 'http-errors';
let errorShown;

/**
 * Handles errors that occur during the Gulp HTML build process.
 * @param {HttpError} error - The error object that occurred.
 * @returns {void} This function does not return a value.
 */
export function errorHandler(error) {
  if (!errorShown) {
    nodeNotifier.notify({
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
export function setErrorShown(bool) {
  errorShown = bool;
}

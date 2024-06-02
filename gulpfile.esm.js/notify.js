import notifier from 'node-notifier';
import { join } from 'path';
import { HttpError } from 'http-errors';

/**
 * Returns the last element of an array if the input is an array, otherwise returns the input itself.
 * @param {string} a - The input to be processed.
 * @returns {string} - The last element of the input array if it is an array, otherwise the input itself.
 */
function short(a) {
  if ((a || '').includes('/')) {
    const arr = a.split('/');

    return arr.pop();
  }

  return a;
}

/**
 * Creates a notification sender function based on the given type.
 * @param {string} type - The type of the notification.
 * @returns {function(HttpError): boolean} A function that sends a notification with the given type and error details
 */
function sendNotificationFactory(type) {
  /**
   * @param {HttpError} error error object
   * @returns {boolean}
   */

  return function sendNotification(error) {
    if (error.stack) {
      console.error(error.stack);
    }

    notifier.notify({
      icon: join(__dirname, '/img/alert.png'),
      contentImage: join(__dirname, '/img/alert.png'),
      title: 'WP Theme Builder',
      subtitle: type,
      message: `${short(error.fileName)}: ${error.lineNumber}, ${
        error.message
      }`,
      sound: true,
      timeout: 15
    });

    return true;
  };
}

export { sendNotificationFactory as notify };

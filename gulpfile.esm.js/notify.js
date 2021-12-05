import notifier from 'node-notifier';
import { join } from 'path';

function short(a) {
    if (Array.isArray(a)) {
        const arr = a.split('/');

        return arr[arr.length - 1];
    }

    return a;
}

function sendNotificationFactory(type) {
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
    };
}

export { sendNotificationFactory as notify };

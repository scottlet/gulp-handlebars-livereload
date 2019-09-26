const CONSTS = require('../CONSTS');

const handlebars = require('handlebars');
const nodeNotify = require('node-notifier');
const i18n2 = require('i18n-2');

const staticHelpers = {
    uc: str => {
        return str.toUpperCase();
    },
    capitalise: str => {
        return str.toUpperCase();
    },
    lc: str => {
        return str.toLowerCase();
    },
    str: num => {
        return num + '';
    },
    inc: num => {
        return parseInt(num) + 1;
    },
    concat: (...strings) => {
        strings = strings.reduce((acc, item) => {
            if (typeof item === 'string') {
                return acc + item;
            }

            return acc;
        });

        return strings;
    },
    raw: options => {
        return options.fn();
    },

    q: txt => {
        return new handlebars.SafeString(`'${txt}'`);
    },

    eq: (val1, val2, options) => {
        if (val1 == val2) {
            return options.fn(this);
        }

        return options.inverse(this);
    },
    prev : (num, total) => {
        num--;

        if (num < 1) {
            return total;
        }

        return num;
    },
    next : (num, total) => {
        num++;

        if (num > total) {
            return 1;
        }

        return num;
    },
    times: (n, block) => {
        let accum = '';
        let i;

        for (i = 0; i < n; ++i) {
            block.data.first = i === 0;
            block.data.last = i === n - 1;
            block.data.index = i;
            accum += block.fn(i);
        }

        return accum;
    },
    hostname() {
        return CONSTS.HOST;
    },
    hostpath() {
        return CONSTS.PATH;
    },
    production() {
        return CONSTS.NODE_ENV === 'production';
    },
    version: CONSTS.VERSION
};

let errorShown;

function imagePathBuilder(locale) {
    const builder = pathBuilder(locale);

    return (assetPath, data) => {
        assetPath = 'images/' + assetPath;

        return builder(assetPath, data);
    };
}

function pathBuilder(locale) {
    if (locale === 'en') {
        locale = '/';
    } else {
        locale = '/' + locale + '/';
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
                //        console.log('EHAT', idx);
                urlparts.push(join);
            }
        });

        if (staticasset) {
            urlparts.push(CONSTS.VERSION);
        }

        if (staticasset) {
            newPath = '/' + CONSTS.VERSION + '/' + newPath;
        } else {
            newPath = (urlparts.length ? urlparts.join('/') + '/' : '') + newPath;
        }
        //console.log('filePath', data.data.file.relative);
        //console.log('orig assetpath', assetPath, 'new assetpath', newPath);

        return newPath || '/';
    };
}

function getStem(path) {
    return path.split('/')[path.split('/').length - 1].split('.')[0];
}

function renameFile(path) {
    if (path.extname) {
        path.extname = '.html';
    }
}

function errorHandler(error) {
    if (!errorShown) {
        nodeNotify.notify({
            message: 'Error: ' + error.message,
            title: 'Gulp HTML Build',
            onLast: true
        });
        errorShown = true;
        console.error(error.name, error.message, error.fileName, error.plugin); //eslint-disable-line no-console
    }
}

function setErrorShown(bool) {
    errorShown = bool;
}

function getStaticHelpers() {
    return staticHelpers;
}

function getDynamicHelpers(locale) {
    const i18n = new i18n2({
        locales: CONSTS.LANGS,
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

    function trans(text) { //eslint-disable-line
        let desktop = i18n.__(text); //eslint-disable-line
        let mobile = i18n.__(text + '_mobile'); //eslint-disable-line

        if (mobile.replace(/_mobile/gi, '') !== text) {
            return `
            <span class="ln-desktop">${desktop}</span>
            <span class="ln-mobile">${mobile}</span>
            `;
        }

        return desktop;
    }

    function ntrans(one, other, count) { //eslint-disable-line
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
        buildDate: new Date().toLocaleTimeString(locale, options),
        __: trans,
        __n: ntrans
    };
}

module.exports = {
    getStaticHelpers,
    errorHandler,
    renameFile,
    getStem,
    imagePathBuilder,
    pathBuilder,
    setErrorShown,
    getDynamicHelpers
};

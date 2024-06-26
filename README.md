## How to run this example

Requires global `gulp` and `gulp-cli` to be installed

Also requires node/npm > 18.x.

If you have homebrew installed on OSX this is as easy as `brew install node`.

If you don't have homebrew on OSX, visit http://brew.sh

To run the demo, additionally check out https://github.com/scottlet/gulp-handlebars-livereload-src-example then copy into the root of this folder as "src" (This is now included by default as a git submodule)

NPM pre 7: `npm install` - NPM 7 and above: `npm install --legacy-peer-deps`

Then `npm run develop` to run the livereload local server ( [http://localhost:9000](http://localhost:9000) ) - also there will be a documentation server on [http://localhost:9001](http://localhost:9001)

`npm run deploy` to deploy - this puts all of the required files into a `deploy` directory. You can now put this directory somewhere else and run it.

### What this gives you

- Everything neatly wrapped in a src folder.
- Fast build using gulp
- Linting using eslint and sass-lint
- Livereload - any change to any of the source files will be almost instantly reflected in a browser
- Serve to your local network - `ifconfig` (or `ipconfig` on PC) will tell you your IP address, `http://<ip address>:9000` will work on most networks.
- Static resources precompressed with both brotli and gzip to serve using nginx or apache - [How To Enable GZIP & Brotli Compression for Nginx on Linux](https://computingforgeeks.com/how-to-enable-gzip-brotli-compression-for-nginx-on-linux/) or [Precompress a static website with Brotli and Gzip](https://damien.pobel.fr/post/precompress-brotli-gzip-static-site/) for apache
- Breakpoints shared between CSS and JS
- Static resource path versioned and that version number shared between build and Javascript (so you can serve static resources from a CDN and not care about expiry date).
- Linting
- jsconfig.json for type checking/autocomplete in VSCode/VSCodium
- ES6 modules and imports/exports in Javascript, `~/` shortcut to local modules at `src/js/modules`
- auto generated documentation from JSDoc.

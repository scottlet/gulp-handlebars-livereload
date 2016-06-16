###How to run this example

Requires global gulp and gulp-cli to be installed

Also requires node/npm, obvs.

If you have homebrew installed on OSX this is as simple as `brew install node`.

If you don't have homebrew on OSX, visit http://brew.sh

To run the demo, additionally check out https://github.com/scottbert/gulp-express-livereload-src-example then copy into the root of this folder as "src"

Do ```npm install```

Then ```gulp server``` to run the livereload local server ( http://localhost:9000 )

```NODE_ENV=production gulp deploy``` to deploy - this puts all of the required files into a 'deploy' directory. You can now put this directory somewhere else and run it.

###What this gives you

* Everything neatly wrapped in a src folder.
* Fast build using gulp
* Linting using eslint and sass-lint
* Livereload - any change to any of the source files will be almost instantly reflected in a browser
* Serve to your local network - ```ifconfig``` (or ```ipconfig``` on PC) will tell you your IP address, ```http://<ip address>:9000``` will work on most networks.

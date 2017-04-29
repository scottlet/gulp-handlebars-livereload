'use strict';
var gulp = require('gulp');
var gulpHandlebars = require('gulp-compile-handlebars');
var gulpRename = require('gulp-rename');

function buildHTML () {
    var templateData = require('../src/data/templatedata');
    var options = {
        allowedExtensions: ['hbs'],
        batch : ['./src/templates/partials'],
        helpers: {
            capitalise: function (str) {
                return str.toUpperCase();
            }
        }
    };

    return gulp.src([
        'src/templates/**/*',
        '!src/templates/partials/',
        '!src/templates/partials/**/*'])
        .pipe(gulpHandlebars(templateData, options))
        .pipe(gulpRename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest('dist'));
}

gulp.task('buildhtml', ['clean'], buildHTML);
gulp.task('buildhtml-lr', buildHTML);

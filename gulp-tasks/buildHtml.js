'use strict';
var gulp = require('gulp');
var gulpHandlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

function buildHTML () {
    var templateData = {
        title: 'The Test Page',
        pageTitle: 'Welcome!'
    };
    var options = {
        allowedExtensions: ['hbs'],
        batch : ['./src/templates/partials'],
        helpers: {
            capitalise: function (str) {
                return str.toUpperCase();
            }
        }
    };

    return gulp.src('src/templates/index.hbs')
        .pipe(gulpHandlebars(templateData, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist'));
}

gulp.task('buildhtml', ['clean'], buildHTML);
gulp.task('buildhtml-lr', buildHTML);

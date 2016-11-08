'use strict';

var
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-chokidar')(gulp),
    bowerFiles = require('main-bower-files'),
    angularFilesort = require('gulp-angular-filesort'),
    inject = require('gulp-inject'),
    gulpNgConfig = require('gulp-ng-config');

gulp.task('dev', function(){
    gulp.src('config.json')
    .pipe(gulpNgConfig('DisignStudio',{
        environment: 'dev',
        createModule: false
    }))
    .pipe(gulp.dest('./client/js/'))
});

gulp.task('prod', function(){
    gulp.src('config.json')
        .pipe(gulpNgConfig('DisignStudio',{
            environment: 'prod',
            createModule: false
        }))
        .pipe(gulp.dest('./client/js/'))
});

gulp.task('serve', ['watch'], function () {
    nodemon({
        script: 'server.js',
        ext: 'js, html'
    })
        .on('restart', function () {
            console.log('DisignStudio restared');
        });
});

// Watch task for resources injection and css generation from stylus
gulp.task('watch', function () {
    watch('client/css/**/*.css', {
        root: 'client/css'
    }, 'injectIndex');

    watch('client/js/**/*.js', {
        root: 'client/js'
    }, 'injectIndex');

    watch('client/bower_components/**/*.*', {
        root: 'client/bower_components'
    }, 'injectIndex');
});

// Resources injection task
gulp.task('injectIndex', function () {
    var
        target = gulp.src('./client/views/index.jade'),
        cssSource = gulp.src('./client/css/*.css', {
            read: false
        }),
        jsSource = gulp.src('./client/js/**/*.js').pipe(angularFilesort()),
        bowerSources = gulp.src(bowerFiles(), {
            read: false
        });

    return target
        .pipe(inject(cssSource, {
            relative: true
        }))
        .pipe(inject(jsSource, {
            relative: true
        }))
        .pipe(inject(bowerSources, {
            relative: true,
            name: 'bower'
        }))
        .pipe(gulp.dest('./client/views/'));
});

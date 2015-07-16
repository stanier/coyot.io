var pkg = require('.package.json');

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    stylus = require('gulp-stylus'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    header = require('gulp-header'),
    runsequence = require('run-sequence'),
    nodemon = require('gulp-nodemon'),
    exec = require('child_process').exec;

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

function announceFileEvent(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.styl')
        .pipe(concat( pkg.name + '.styl' ))
        .pipe(stylus())
        .pipe(rename({ extname: '.css'}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(header(banner, { pkg: pkg}))
        .pipe(gulp.dest('static/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload())
        .pipe(gulp.dest('static/css'));
});

gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat( pkg.name + '.js'))
        .pipe(header(banner, { pkg: pkg}))
        .pipe(gulp.dest('static/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload())
        .pipe(gulp.dest('static/js'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload())
        .pipe(gulp.dest('static/img'));
});

gulp.task('views', function() {
    return gulp.src('views/**/*.jade')
        .pipe(livereload());
});

gulp.task('clean', function() {
    return gulp.src(['static/css', 'static/js', 'static/img'], { read: false })
        .pipe(clean());
});

gulp.task('default', function() {
    runsequence('clean', 'styles', 'scripts', 'images');
});

gulp.task('server', function() {
    nodemon({
        script: 'index.js',
        env: { 'NODE_ENV': 'development'},
        ignore: ['src/*', 'static/*', 'views/*', 'node_modules/*'],
        ext: 'js json'
    });
});

gulp.task('watch', function() {
    livereload.listen(9501, '0.0.0.0', function(err) {
        if (err) return console.log(err);
    });

    gulp.watch('src/styles/**/*.styl', ['styles'], function(event) {
        announceFileEvent(event);
    });

    gulp.watch('src/scripts/**/*.js', ['scripts'], function(event) {
        announceFileEvent(event);
    });

    gulp.watch('src/images/**/*', ['images'], function(event) {
        announceFileEvent(event);
    });
    gulp.watch('views/**/*', ['views'], function(event) {
        announceFileEvent(event);
    });
});

gulp.task('launch', ['server', 'watch']);

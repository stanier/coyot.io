// Core node modules
var
    exec = require('child_process').exec,
    fs   = require('fs'),
    os   = require('os')
;

// Gulp modules
var
    gulp       = require('gulp'),
    addsrc     = require('gulp-add-src'),
    prefixer   = require('gulp-autoprefixer'),
    cache      = require('gulp-cache'),
    clean      = require('gulp-clean'),
    concat     = require('gulp-concat'),
    header     = require('gulp-header'),
    imgmin     = require('gulp-imagemin'),
    jshint     = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    minify     = require('gulp-minify-css'),
    nodemon    = require('gulp-nodemon'),
    open       = require('gulp-open'),
    plumber    = require('gulp-plumber'),
    rename     = require('gulp-rename'),
    stylus     = require('gulp-stylus'),
    uglify     = require('gulp-uglify')
;

// All other modules
var
    sequence = require('run-sequence'),
    through  = require('through2')
;

var
    pkg = require('./package.json')
;

var sources = {
    scripts: [
        'node_modules/underscore/underscore.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-cookies/angular-cookies.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/angular-material-data-table/dist/md-data-table.js',
        'node_modules/socket.io-client/socket.io.js',
        'static/js/coyot.io.js'
    ],
    styles: [
        'node_modules/angular-material/angular-material.layouts.css',
        'node_modules/angular-material/angular-material.css',
        'node_modules/angular-material-data-table/dist/md-data-table.css',
        'node_modules/animate.css/animate.css',
        'static/css/coyot.io.css'
    ],
    fonts: [
        'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.eot',
        'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
        'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff',
        'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ttf',
        'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.svg'
    ]
};

var banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

var browser =
    os.platform() === 'linux' ? 'google-chrome' : (
        os.platform() === 'darwin' ? 'google chrome' : (
            os.platform() === 'win32' ? 'chrome' : 'firefox'
        )
    )
;

gulp.task('app.styles', ['coyotio.styles'], function(callback) {
    return gulp.src(sources.styles)
        .pipe(plumber())
        .pipe(concat('app.css'))
        .pipe(header(banner, { pkg: pkg}))
        .pipe(gulp.dest('static/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify())
        .pipe(livereload())
        .pipe(gulp.dest('static/css'))
        .pipe(through.obj(function() {
            callback();
        }))
    ;
});

gulp.task('app.scripts', ['coyotio.scripts'], function(callback) {
    return gulp.src(sources.scripts)
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('static/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload())
        .pipe(gulp.dest('static/js'))
        .pipe(through.obj(function() {
            callback();
        }))
    ;
});

gulp.task('app.fonts', function(callback) {
    return gulp.src(sources.fonts)
        .pipe(plumber())
        .pipe(gulp.dest('static/css/fonts'))
        .pipe(through.obj(function() {
            callback();
        }))
    ;
});

gulp.task('coyotio.styles', ['clean'], function(callback) {
    return gulp.src('src/styles/**/*.styl')
        .pipe(plumber())
        .pipe(concat( pkg.name + '.styl' ))
        .pipe(stylus())
        .pipe(rename({ extname: '.css'}))
        .pipe(prefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(header(banner, { pkg: pkg}))
        .pipe(gulp.dest('static/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify())
        .pipe(gulp.dest('static/css'))
        .pipe(through.obj(function() {
            callback();
        }))
    ;
});

gulp.task('coyotio.scripts', ['clean'], function(callback) {
    return gulp.src(['src/scripts/module.js', 'src/scripts/**/!(module).js'])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(concat( pkg.name + '.js'))
        .pipe(header(banner, { pkg: pkg}))
        .pipe(gulp.dest('static/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload())
        .pipe(gulp.dest('static/js'))
        .pipe(through.obj(function() {
            callback();
        }))
    ;
});

gulp.task('coyotio.images', ['clean'], function(callback) {
    return gulp.src('src/images/**/*')
        .pipe(plumber())
        .pipe(cache(imgmin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload())
        .pipe(gulp.dest('static/img'))
        .pipe(through.obj(function() {
            callback();
        }))
    ;
});

gulp.task('views', function() {
    return gulp.src('views/**/*.jade')
        .pipe(plumber())
        .pipe(livereload())
    ;
});

gulp.task('clean', ['clean.fonts', 'clean.css', 'clean.js', 'clean.img']);

gulp.task('clean.fonts', function(callback) {
    return gulp.src('static/css/fonts')
        .pipe(plumber())
        .pipe(clean())
        .pipe(through.obj(function() {
            callback();
        }))
    ;
});

gulp.task('clean.css', ['clean.fonts'], function() {
    return gulp.src('static/css')
        .pipe(plumber())
        .pipe(clean())
    ;
});

gulp.task('clean.js', function() {
    return gulp.src('static/js')
        .pipe(plumber())
        .pipe(clean())
    ;
});

gulp.task('clean.img', function() {
    return gulp.src('static/img')
        .pipe(plumber())
        .pipe(clean())
    ;
})

gulp.task('build', [
    'clean',
    'coyotio.styles',
    'app.styles',
    'coyotio.scripts',
    'app.scripts',
    'app.fonts',
    'coyotio.images'
]);

gulp.task('serve', ['build'], function() {
    try {
        return nodemon({
            script: 'index.js',
            env: { 'NODE_ENV': 'development'},
            ignore: ['src/*', 'static/*', 'views/*', 'node_modules/*'],
            ext: 'js json'
        });
    } catch (err) {
        console.error(err);
    }
});

gulp.task('watch', ['build', 'serve'], function() {
    livereload.listen(9501, '0.0.0.0', function(err) {
        if (err) return console.log(err);
    });

    gulp.watch('src/styles/**/*.styl', ['coyotio.styles', 'app.styles'], function(event) {
        announceFileEvent(event);
    });

    gulp.watch('src/scripts/**/*.js', ['coyotio.scripts', 'app.scripts'], function(event) {
        announceFileEvent(event);
    });

    gulp.watch('src/images/**/*', ['coyotio.images'], function(event) {
        announceFileEvent(event);
    });

    gulp.watch('views/**/*', ['views'], function(event) {
        announceFileEvent(event);
    });
});

gulp.task('browser', ['build', 'serve'], function() {
    return gulp.src('views/**/*')
        .pipe(plumber())
        .pipe(open({
            app: browser,
            uri: 'http://localhost:9000'
        }))
    ;
});

gulp.task('launch', ['build', 'serve']);

gulp.task('develop', ['build', 'serve', 'watch', 'browser']);

function announceFileEvent(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// Core node modules
var exec = require('child_process').exec,
    fs   = require('fs'),
    os   = require('os');

// Gulp modules
var gulp       = require('gulp'),
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
    uglify     = require('gulp-uglify');

// All other modules
var sequence = require('run-sequence'),
    through  = require('through2');

var pkg = require('./package.json');

var banner = ['/**',
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

gulp.task('styles', function() {
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
        .pipe(livereload())
        .pipe(gulp.dest('static/css'))
    ;
});

gulp.task('scripts', function() {
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
    ;
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(plumber())
        .pipe(cache(imgmin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload())
        .pipe(gulp.dest('static/img'))
    ;
});

gulp.task('views', function() {
    return gulp.src('views/**/*.jade')
        .pipe(plumber())
        .pipe(livereload())
    ;
});

gulp.task('clean', function() {
    return gulp.src(['static/css', 'static/js', 'static/img'], { read: false })
        .pipe(plumber())
        .pipe(clean())
    ;
});

gulp.task('default', function() {
    sequence('clean', 'styles', 'scripts', 'images');
});

gulp.task('server', function() {
    return checkCompiled(function() {
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

gulp.task('launchBrowser', function() {
    return gulp.src('views/**/*')
        .pipe(plumber())
        .pipe(open({
            app: browser,
            uri: 'http://localhost:9000'
        }))
    ;
});

gulp.task('launch', ['server']);

gulp.task('develop', function() {
    sequence(['server', 'watch'], 'launchBrowser');
});

function checkCompiled(callback) {
    if (fs.existsSync('static/js/coyot.io.js') &&
        fs.existsSync('static/js/coyot.io.min.js') &&
        fs.existsSync('static/css/coyot.io.css') &&
        fs.existsSync('static/css/coyot.io.min.css'))
    {
        console.log('Static files are compiled!');
        return callback();
    } else {
        console.log('Static files not compiled!  Compiling...');
        sequence('clean', 'styles', 'scripts', 'images', function() {
            return checkCompiled(callback);
        });
    }
}

function announceFileEvent(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

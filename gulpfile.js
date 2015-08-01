var pkg = require('./package.json');

var fs = require('fs'),
    os = require('os'),
    gulp = require('gulp'),
    open = require('gulp-open'),
    prefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    stylus = require('gulp-stylus'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imgmin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    header = require('gulp-header'),
    sequence = require('run-sequence'),
    nodemon = require('gulp-nodemon'),
    through = require('through2'),
    exec = require('child_process').exec;

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

var customReporter = through(function(file, callback) {
    if (!file.jshint.success) {
        console.log('JSHINT fail in '+file.path);
        file.jshint.results.forEach(function (err) {
            if (err) {
                console.log(' '+file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason);
                process.kill(1);
            }
        });
    }
    callback(null, file);
});

var browser =
    os.platform() === 'linux' ? 'google-chrome' : (
        os.platform() === 'darwin' ? 'google chrome' : (
            os.platform() === 'win32' ? 'chrome' : 'firefox'
        )
    )
;

gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.styl')
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
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(customReporter)
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
        .pipe(cache(imgmin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload())
        .pipe(gulp.dest('static/img'))
    ;
});

gulp.task('views', function() {
    return gulp.src('views/**/*.jade')
        .pipe(livereload())
    ;
});

gulp.task('clean', function() {
    return gulp.src(['static/css', 'static/js', 'static/img'], { read: false })
        .pipe(clean())
    ;
});

gulp.task('default', function() {
    sequence('clean', 'styles', 'scripts', 'images');
});

gulp.task('server', function() {
    return checkCompiled(function() {
        nodemon({
            script: 'index.js',
            env: { 'NODE_ENV': 'development'},
            ignore: ['src/*', 'static/*', 'views/*', 'node_modules/*'],
            ext: 'js json'
        })
            .once('start', function() {
                return true;
            })
        ;
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

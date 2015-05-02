var express = require('express');
var app = express();

var https = require('https');
var fs = require('fs');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var assetManager = require('./assetManager');

var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var configuration = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var router = require('./routes');

var port = 9000;
var host = 'localhost';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'nyancat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var clOptions = {
    '--dev': function(value) {process.env.NODE_ENV = 'development'},
    '--prod': function(value) {process.env.NODE_ENV = 'production'}
};

process.argv.forEach(function(value, index, array) {
    if (value in clOptions) clOptions[value](array[index + 1]);
});

if (process.env.NODE_ENV == 'development') {
    console.log('LiveReload server started');
}

app.use(require('connect-livereload')({port: 9501}));

app.use('/static', assetManager);

if (configuration.enableInstaller) app.use('/', require('./routes/installer'));
else app.use('/', router);

if (configuration.debug) app.use(morgan('dev'));

if (typeof configuration.port != 'undefined') {
    port = configuration.port;
    console.log('PORT defined in config, setting to ' + configuration.port);
}
if (typeof configuration.host != 'undefined') {
    host = configuration.host;
    console.log('HOST defined in config, setting to ' + configuration.host);
}

var server = app.listen(port, host, function() {
    console.log('Server started on address ' + host + ' at ' + port);
});
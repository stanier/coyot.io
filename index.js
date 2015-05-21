var express = require('express'),
    app = express();

var fs = require('fs'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    mongoStore = require('connect-mongo')(session),
    flash = require('connect-flash');

var server = require('./lib/server');

var conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

//  NETWORK DEFAULTS

app.locals.port = 9000;
app.locals.host = 'localhost';

//  VIEW ENGINE INITIALIZATION

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.basedir = app.get('views');

//  EXPRESS INITIALIZATION

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'nyancat',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        db: conf.sessions.name,
        host: conf.sessions.host,
        port: conf.sessions.port
    })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//  CLI FLAGS

var clOptions = {
    '--dev': function(value) { process.env.NODE_ENV = 'development'; },
    '--prod': function(value) { process.env.NODE_ENV = 'production'; }
};

//  CLI PARSER

process.argv.forEach(function(value, index, array) {
    if (value in clOptions) clOptions[value](array[index + 1]);
});

if (process.env.NODE_ENV == 'development') {
    app.use(require('connect-livereload')({port: 9501}));
}
function parseConfig(callback) {
    if (conf.debug) app.use(morgan('dev'));

    if (typeof conf.host != 'undefined') {
        app.locals.host = conf.host;
        console.log('HOST defined in config, setting to ' + conf.host);
    }
    if (typeof conf.port != 'undefined') {
        app.locals.port = conf.port;
        console.log('PORT defined in config, setting to ' + conf.port);
    }
    if (typeof conf.db.host != 'undefined') {
        process.env.MONGODB_HOST = conf.db.host;
        console.log('DB.HOST defined in config, setting to ' +
            conf.db.host);
    }
    if (typeof conf.db.port != 'undefined') {
        process.env.MONGODB_PORT = conf.db.port;
        console.log('DB.PORT defined in config, setting to ' +
            conf.db.port);
    }
    if (typeof conf.db.name != 'undefined') {
        process.env.MONGODB_NAME = conf.db.name;
        console.log('DB.NAME defined in config, setting to ' +
            conf.db.name);
    }
    if (conf.worker.enabled === true) {
        console.log('WORKER.ENABLED true in config, starting worker operations');
        app.locals.serverType = (app.locals.serverType == 'web' ? 'hybrid' : 'worker' );
    }
    if (conf.web.enabled === true) {
        console.log('WEB.ENABLED true in config, listening for portal requests');
        app.locals.serverType = (app.locals.serverType == 'worker' ? 'hybrid' : 'web' );
    }
    server(app);
    callback();
}

parseConfig(function() {
    var uristring = 'mongodb://' + process.env.MONGODB_HOST + ':' +
        process.env.MONGODB_PORT + '/' + process.env.MONGODB_NAME;

    var mongoOptions = { db: { safe: true }};
    mongoose.connect(uristring, mongoOptions, function (err, res) {
        if (err) console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    });
});

app.listen(app.locals.port, app.locals.host, function() {
    console.log('Server started on address ' + app.locals.host + ' at ' +
        app.locals.port);
});

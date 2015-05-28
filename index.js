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

var system = require('./lib/system');

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

var conf = require('./lib/config')(app, function(err) {
    system(app);

    var uristring = 'mongodb://' + app.locals.db.host + ':' +
        app.locals.db.port + '/' + app.locals.db.name;

    var mongoOptions = { db: { safe: true }};
    mongoose.connect(uristring, mongoOptions, function (err, res) {
        if (err) console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    });

    app.listen(app.locals.port, app.locals.host, function() {
        console.log('Server started on address ' + app.locals.host + ' at ' +
            app.locals.port);
    });

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
            db: app.locals.sessions.name,
            host: app.locals.sessions.host,
            port: app.locals.sessions.port
        })
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
});

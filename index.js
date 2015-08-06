var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app);

var fs            = require('fs'),
    favicon       = require('serve-favicon'),
    morgan        = require('morgan'),
    path          = require('path'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    session       = require('express-session'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    localStrategy = require('passport-local').Strategy,
    mongoStore    = require('connect-mongo')(session),
    flash         = require('connect-flash');

var userModel = require('./lib/dbschema').userModel,
    system;

//  CLI FLAGS

var clOptions = {
    '--dev' : function(value) { process.env.NODE_ENV = 'development'; },
    '--prod': function(value) { process.env.NODE_ENV = 'production'; }
};

//  CLI PARSER

process.argv.forEach(function(value, index, array) {
    if (value in clOptions) clOptions[value](array[index + 1]);
});

if (process.env.NODE_ENV == 'development') {
    app.use(require('connect-livereload')({port: 9501}));
}

GLOBAL.console.error = error;
GLOBAL.console.warn = warn;

var conf = require('./lib/config')(app, function(err) {
    var uristring = 'mongodb://' + app.locals.db.host + ':' +
        app.locals.db.port + '/' + app.locals.db.name;

    var mongoOptions = { db: { safe: true }};
    mongoose.connect(uristring, mongoOptions, function (err, res) {
        if (err) console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    });

    userModel.findOne({}, function(err, user) {
        if (err) console.error(err);
        if (!user) {
            console.warn('No users found in database, creating new user');

            var defaultUser = {
                username: 'admin',
                email   : 'admin@example.com',
                password: 'coyote',
                role    : 4
            };

            new userModel(defaultUser).save(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(
                        'User has been saved with the following credentials:' +
                        '\n    Username:  ' + defaultUser.username +
                        '\n    Password:  ' + defaultUser.password
                );
                }
            });
        }
    });

    //  VIEW ENGINE INITIALIZATION

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.locals.basedir = app.get('views');
    app.locals.server = server;
    app.locals.sessionStore = new mongoStore({
        db  : app.locals.sessions.name,
        host: app.locals.sessions.host,
        port: app.locals.sessions.port
    });

    //  EXPRESS INITIALIZATION

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({
        secret: app.locals.secret,
        resave: false,
        store : app.locals.sessionStore,
        saveUninitialized: false,
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    system = require('./lib/system')(app);

    server.listen(app.locals.port, app.locals.host, function() {
        console.log('Server started on address ' + app.locals.host + ' at ' +
            app.locals.port);
    });
});

function warn(message) {
    process.stdout.write('[WARNING]  ' + message + '\n');
}
function error(message) {
    process.stdout.write('[ERROR]  ' + message + '\n');
}

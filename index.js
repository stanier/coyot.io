var
    express = require('express'),
    app     = express(),
    server  = require('http').createServer(app)
;

var
    fs            = require('fs'),
    favicon       = require('serve-favicon'),
    morgan        = require('morgan'),
    path          = require('path'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    session       = require('express-session'),
    mongoose      = require('mongoose'),
    flash         = require('connect-flash')
;

var
    userModel   = require('./lib/dbschema/user'),
    pluginModel = require('./lib/dbschema/plugin'),
    system
;

var
    pluginManager = require('./lib/pluginManager'),
    permissions = require('./lib/permissions')
;

//  CLI FLAGS

var clOptions = {
    '--dev' : function(value) { process.env.NODE_ENV = 'development'; },
    '--prod': function(value) { process.env.NODE_ENV = 'production'; }
};

var i = 0;

//  CLI PARSER

process.argv.forEach(function(value, index, array) {
    if (value in clOptions) clOptions[value](array[index + 1]);
});

if (process.env.NODE_ENV == 'development') {
    app.use(require('connect-livereload')({ port: 9501 }));
}

GLOBAL.console.error = error;
GLOBAL.console.warn = warn;

var conf = require('./lib/config')(app, function(err) {
    i = i + 1;

    console.log(i);

    var uristring = 'mongodb://' + app.get('db.username') + ':' +
        app.get('db.password') + '@' + app.get('db.host') + ':' +
        app.get('db.port') + '/' + app.get('db.name');

    var mongoOptions = { db: { safe: true }};

    mongoose.connect(uristring, mongoOptions, function (err, res) {
        if (err) console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    });

    userModel.findOne({}, function(err, user) {
        if (err) console.error(err);
        if (!user) {
            console.warn('No users found in database, creating new user');

            var defaultUser = new userModel({
                username: 'admin',
                email   : 'admin@example.com',
                password: 'coyote',
                role    : 4
            });

            defaultUser.save(function(err) {
                if (err) console.log(err);
                else {
                    console.log(
                        'User has been saved with the following credentials:' +
                        '\n    Username:  ' + defaultUser.username +
                        '\n    Password:  ' + defaultUser.password
                );
                }
            });
        }
    });

    permissions.checkCore();

    //  VIEW ENGINE INITIALIZATION

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.locals.basedir = app.get('views');
    app.set('server', server);

    //  EXPRESS INITIALIZATION

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    system = require('./lib/system')(app);

    server.listen(app.get('port'), app.get('host'), function() {
        console.log('Server started on address ' + app.get('host') + ' at ' +
            app.get('port'));
    });
});

function warn(message) {
    process.stdout.write('[WARNING]  ' + message + '\n');
}
function error(message) {
    process.stdout.write('[ERROR]  ' + message + '\n');
}

var fs     = require('fs'),
    morgan = require('morgan');

module.exports = function(app, callback) {
    var confPath = './config.json';

    fs.lstat(confPath, function(err) {
        if (err) callback(err, null);

        app.locals.db       = {};
        app.locals.sessions = {};
        app.locals.socket   = {};

        var conf = JSON.parse(fs.readFileSync('./config.json', 'utf8')) || {};

        if (conf.debug) app.use(morgan('dev'));
        if (!conf.secret)
            console.warn('A secret has NOT been set in config.json.  Coyot.io ' +
            'will use the default password but it is suggested that you set ' +
            'one in the future');

        if (!conf.db)       conf.db       = {};
        if (!conf.sockets)  conf.sockets  = {};
        if (!conf.sessions) conf.sessions = {};

//      VALUE                    | CONFIG BINDING      | DEFAULT
//      -------------------------------------------------------------------
        app.locals.secret        = conf.secret        || 'nyancat';
        app.locals.host          = conf.host          || 'localhost';
        app.locals.port          = conf.port          || 9000;
        app.locals.db.host       = conf.db.host       || 'localhost';
        app.locals.db.port       = conf.db.port       || 27017;
        app.locals.db.name       = conf.db.name       || 'coyotioDB';
        app.locals.sessions.host = conf.sessions.host || 'localhost';
        app.locals.sessions.port = conf.sessions.port || 27017;
        app.locals.sessions.name = conf.sessions.name || 'coyotioSessions';
        app.locals.socket.leech  = conf.sockets.leech || true;
        app.locals.socket.port   = conf.sockets.port  || 8080;

        if (conf.worker.enabled) {
            app.locals.serverType = (app.locals.serverType == 'web' ? 'hybrid' : 'worker' );
        }

        if (conf.web.enabled) {
            app.locals.serverType = (app.locals.serverType == 'worker' ? 'hybrid' : 'web' );
        }

        if (app.locals.host && app.locals.port && app.locals.db.host &&
                app.locals.db.port && app.locals.db.name &&
                app.locals.sessions.host && app.locals.sessions.port &&
                app.locals.sessions.name) {
            callback(err);
        }
    });
};

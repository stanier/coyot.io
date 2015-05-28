var fs = require('fs'),
    morgan = require('morgan');

module.exports = function(app, callback) {
    var confPath = './config.json';

    fs.lstat(confPath, function(err) {
        if (err) callback(err, null);

        app.locals.db = {};
        app.locals.sessions = {};

        var conf = JSON.parse(fs.readFileSync('./config.json', 'utf8')) || {};

        if (conf.debug) app.use(morgan('dev'));

        app.locals.host = conf.host || 'localhost';
        app.locals.port = conf.port || 9000;
        app.locals.db.host = conf.db.host || 'localhost';
        app.locals.db.port = conf.db.port || 27017;
        app.locals.db.name = conf.db.name || 'synapsedb';
        app.locals.sessions.host = conf.sessions.host || 'localhost';
        app.locals.sessions.port = conf.sessions.port || 27017;
        app.locals.sessions.name = conf.sessions.name || 'synapseSessions';

        if (conf.worker.enabled === true) {
            console.log('WORKER.ENABLED true in config, starting worker operations');
            app.locals.serverType = (app.locals.serverType == 'web' ? 'hybrid' : 'worker' );
        }

        if (conf.web.enabled === true) {
            console.log('WEB.ENABLED true in config, listening for portal requests');
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

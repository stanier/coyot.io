var fs     = require('fs'),
    morgan = require('morgan');

module.exports = function(app, callback) {
    try {
        var conf = JSON.parse(fs.readFileSync('./config.json', 'utf8')) || {};
    } catch (err) {
        console.warn('No config file detected.  Using default');
        var conf = JSON.parse(fs.readFileSync('./config.default.json', 'utf8'));
    }

    if (conf.debug) app.use(morgan('dev'));
    if (!conf.secret)
        console.warn('A secret has NOT been set in config.json.  Coyot.io ' +
        'will use the default password but it is suggested that you set ' +
        'one in the future');

    if (!conf.db)       conf.db       = {};
    if (!conf.sockets)  conf.sockets  = {};

//           VALUE           | CONFIG BINDING      | DEFAULT
//  -------------------------------------------------------------------
    app.set('secret',          conf.secret        || 'nyancat'       );
    app.set('host',            conf.host          || 'localhost'     );
    app.set('port',            conf.port          || 9000            );
    app.set('db.host',         conf.db.host       || 'localhost'     );
    app.set('db.port',         conf.db.port       || 27017           );
    app.set('db.name',         conf.db.name       || 'coyotioDB'     );
    app.set('db.username',     conf.db.username   || 'coyotioUser'   );
    app.set('db.password',     conf.db.password   || 'unicorns'      );
    app.set('sockets.leech',   conf.sockets.leech || true            );
    app.set('sockets.port',    conf.sockets.port  || 8080            );

    if (conf.worker.enabled) {
        app.set('serverType', app.get('serverType') == 'web' ? 'hybrid' : 'worker');
    }

    if (conf.web.enabled) {
        app.set('serverType', app.get('serverType') == 'worker' ? 'hybrid' : 'web');
    }

    if (
        !!app.get('host') && !!app.get('port') && !!app.get('db.host') &&
        !!app.get('db.port') && !!app.get('db.name')
    ) return callback();
};

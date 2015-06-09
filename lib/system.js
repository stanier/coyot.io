var os          = require('os'),
    serverModel = require('./dbschema').serverModel,
    worker      = require('./worker'),
    web         = require('./web'),
    router      = require('express').Router(),
    url         = require('url'),
    through     = require('through2'),
    duplex      = require('duplexer'),
    auth        = require('./auth'),
    execSync    = require('child_process').execSync;

var locals = {};

var regexp = {
    ubuntu: /(\S*ubuntu)/i,
    redhat: /(red(\s?)hat)|(centos)|(fedora)/i,
    bsd   : /((\w?)+bsd)/i
};

exports = module.exports = init;
exports.distro = locals.distro = getDistro();
exports.getDistroRaw = locals.distroRaw = getDistroRaw();

function init(app) {
    serverModel.findOne({ hostname: os.hostname() }, function(err, server) {
        app.use('/system', auth.isAuthenticated, router);

        if (err) return next(err);

        if (!server) {
            console.log('Server info not found in database, saving new entry...');

            var newbie = new serverModel({
                host    : app.locals.host,
                port    : app.locals.port,
                type    : app.locals.serverType,
                hostname: os.hostname(),
                platform: os.platform(),
                arch    : os.arch(),
                release : os.release(),
                totalMem: os.totalmem(),
                cpu     : getCPUs(),
                distro  : locals.distro,
            });

            newbie.save(function(err) {
                if (err) console.log(err);
                else console.log('Server info saved to database');
            });
        }

        if (app.locals.serverType == 'worker' || app.locals.serverType == 'hybrid') worker(app);
        if (app.locals.serverType == 'web' || app.locals.serverType == 'hybrid')    web(app);

        // Update things that can change
        server = {
            host    : app.locals.host,
            port    : app.locals.port,
            type    : app.locals.serverType,
            platform: os.platform(),
            arch    : os.arch(),
            release : os.release(),
            totalMem: os.totalmem(),
            cpu     : getCPUs(),
            distro  : locals.distro,
        };

        serverModel.update(server._id, { $set: server }, function(err) {
            if (err) console.log(err);
        });

        locals = app.locals;
    });
}

router.use('/stats', function(req, res) {
    var query = url.parse(req.url,true).query;
    if (req.query.type == 'simple') res.send({
        online : true,
        uptime : os.uptime(),
        loadavg: os.loadavg(),
        freemem: os.freemem(),
        distro : locals.distro,
    });
    else res.send({
        online  : true,
        hostname: os.hostname(),
        host    : locals.host,
        port    : locals.port,
        type    : locals.serverType,
        platform: os.platform(),
        arch    : os.arch(),
        release : os.release(),
        uptime  : os.uptime(),
        cpu     : getCPUs(),
        loadavg : os.loadavg(),
        totalmem: os.totalmem(),
        freemem : os.freemem(),
        distro  : locals.distro,
    });
});

function getCPUs() {
    var cpus = os.cpus();

    var result = [];

    for (var i = 0; i < cpus.length; i++) {
        result[i] = {
            model: cpus[i].model,
            speed: cpus[i].speed
        };
    }
    return result;
}
function getDistro() {
    if (os.platform() != 'linux') return '';
    else {
        var stdout = execSync('cat /etc/issue').toString().replace(/\\./g, "");

        if (regexp.ubuntu.test(stdout)) return 'ubuntu';
        if (regexp.redhat.test(stdout)) return 'redhat';
        if (regexp.bsd.test(stdout))    return 'bsd';
        else return 'unsupported';
    }
}
function getDistroRaw() {
    if (os.platform() != 'linux') return '';
    else {
        return execSync('cat /etc/issue').toString().replace(/\\./g, "");
    }
}

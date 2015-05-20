var os = require('os'),
    serverModel = require('./dbschema').serverModel,
    worker = require('./worker'),
    web = require('./web'),
    router = require('express').Router(),
    url = require('url');

function main(serverType, app) {
    serverModel.findOne({ hostname: os.hostname() }, function(err, server) {
        app.use('/server', router);

        if (err) return next(err);

        if (!server) {
            console.log('Server info not found in database, saving new entry...');

            var newbie = new serverModel({
                host: app.locals.host,
                port: app.locals.port,
                hostname: os.hostname(),
                platform: os.platform(),
                arch: os.arch(),
                release: os.release(),
                totalMem: os.totalmem(),
                cpu: getCPUs()
            });

            newbie.save(function(err) {
                if (err) console.log(err);
                else console.log('Server info saved to database');
            });
        }
        var type;

        if (serverType.worker) {
            type = 'worker';
            worker(app);
        }
        if (serverType.web) {
            type = 'web';
            web(app);
        }
        if (serverType.web && serverType.worker) type = 'hybrid';

        // Update things that can change
        server = {
            host: app.locals.host,
            port: app.locals.port,
            type: type,
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            totalMem: os.totalmem(),
            cpu: getCPUs()
        };

        serverModel.update(server._id, { $set: server }, function(err) {
            if (err) console.log(err);
        });

        function getCPUs() {
            // Cloned locally to avoid excessive os.cpus() calls
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
    });
}

router.use('/stats', function(req, res) {
    var query = url.parse(req.url,true).query;
    if (req.query.simple) res.send({
        online: true,
        uptime: os.uptime(),
    });
    else res.send({
        online: true,
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        freemem: os.freemem(),
    });
});

module.exports = main;

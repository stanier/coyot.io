var router = require('express').Router(),
    queue = require('./queue'),
    serverModel = require('./dbschema').serverModel,
    os = require('os'),
    assetManager = require('./assetManager');

function init() {
    serverModel.findOne({ hostname: os.hostname() }, function(err, server) {
        if (err) return next(err);

        if (!server) {
            console.log('Server info not found in database, saving new entry...');

            var newbie = new serverModel({
                hostname: os.hostname(),
                type: 'web',
                platform: os.platform(),
                arch: os.arch(),
                release: os.release(),
                totalMem: os.totalmem(),
                cpu: getCPUs(),
                online: true
            });

            newbie.save(function(err) {
                if (err) console.log(err);
                else console.log('Server info saved to database');
            });
        }
        else if (server.type == 'worker') server.type = 'hybrid';

        // Update things that can change
        server = {
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            totalMem: os.totalmem(),
            cpu: getCPUs(),
            online: true,
        };

        serverModel.update(server._id, server);

        function getCPUs() {
            // Cloned locally to avoid excessive os.cpus() calls
            var cpus = os.cpus();

            var result = [];

            for (var i = 0; i++; i < cpus.length) {
                result[i] = {
                    model: cpus[i].model,
                    speed: cpus[i].speed
                };
            }

            return result;
        }
    });
}

router.use('/static', assetManager);

router.get('/login', function(req, res) {
    res.render('login', {
        user: req.user,
        message: req.session.messages
    });
});

router.use('/auth', require('./auth').router);

router.get('/', function(req, res) {
    res.render('index', {
        user: req.user
    });
});

exports.init = init;
exports.router = router;

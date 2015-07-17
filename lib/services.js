var router  = require('express').Router(),
    exec    = require('child_process').exec,
    spawn    = require('child_process').spawn,
    through = require('through2'),
    util    = require('./util');

function init(io) {
    io.on('connection', function(socket) {
        var webTerminal;

        var socketOut = through(function(output, encoding, next) {
            socket.emit('stdout', output.toString());
            return next();
        });
        var socketErr = through(function(output, encoding, next) {
            socket.emit('stderr', output.toString());
            return next();
        });

        socket.on('start service', function(data) {
            try {
                webTerminal = startService(data);
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(socketOut);
            webTerminal.stderr.pipe(socketErr);
        });
        socket.on('stop service', function(data) {
            try {
                webTerminal = stopService(data);
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(socketOut);
            webTerminal.stderr.pipe(socketErr);
        });
        socket.on('restart service', function(data) {
            try {
                webTerminal = restartService(data);
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(socketOut);
            webTerminal.stderr.pipe(socketErr);
        });
        socket.on('service status', function(data) {
            try {
                webTerminal = getStatus(data);
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(socketOut);
            webTerminal.stderr.pipe(socketErr);
        });
        socket.on('status all', function() {
            try {
                webTerminal = getRunningServices();
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(through(function(output, encoding, next) {
                var result = / +\[ (.) \]\s+(.+)/g.exec(output);

                socket.emit('service status', result[2], (result[1] == '+'));
                return next();
            }));
        });

        socket.on('disconnect', function() {
            // If webTerminal is active on socket, kill
            if (!!webTerminal) webTerminal.kill();
        });
    });

    router.get('/list', function(req, res) {
        return util.forDistro({
            'ubuntu': function() {
                return exec('ls /etc/init.d/', function(err, stdout, stderr) {
                    return res.send(stdout.replace(/(\n)/g, ',').replace(/(,)(?!\w)/g, '').split(','));
                });
            }
        });
    });
    router.get('/getInfo/:service', function(req, res) {
        return util.forDistro({
            'ubuntu': function() {
                return exec('service ' + req.params.service + ' status', function(err, stdout, stderr) {
                    if (stderr) return res.send(stderr);
                    if (err) return res.send(err);

                    return res.send(serializeServiceInfo(stdout));
                });
            }
        });
    });

    return router;
}

function serializeServiceInfo(service) {
    var serviceProperties = service.split('\n');
    var serviceInfo = {};

    var m;
    var re = /(?!.)\s+(\S+ ?\S+): (.+(?:\n\s+└─.+)?)|● (\w+.?\w+) - (.+)|(\w{3} \d{2} (?:\d|:){8}) (\w+) (\w+\[\d+\]): (.+)/g;

    while ((m = re.exec(service)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        if (!!m[1] && !!m[2]) serviceInfo[m[1].replace('-', '').toLowerCase()] = m[2];
        if (!!m[3] && !!m[4]) {
            serviceInfo.name = m[3];
            serviceInfo.description = m[4];
        }
        if (!!m[5] && !!m[6] && !!m[7] && !!m[8]) {
            if (!serviceInfo.log) serviceInfo.log = [];

            serviceInfo.log.push({
                timestamp: m[5],
                FQDN     : m[6],
                process  : m[7],
                content  : m[8]
            });
        }
    }

    return serviceInfo;
}

function startService(data) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.pkg, 'start'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function stopService(data) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.pkg, 'stop'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function restartService(data) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.pkg, 'restart'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function getStatus(data) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.pkg, 'status'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function getRunningServices() {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'service',
                ['--status-all'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

module.exports = init;

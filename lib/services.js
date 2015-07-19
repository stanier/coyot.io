var router  = require('express').Router(),
    exec    = require('child_process').exec,
    spawn    = require('child_process').spawn,
    through = require('through2'),
    util    = require('./util');

function init(io) {
    io.on('connection', function(socket) {
        var childProcess;

        var socketOut = through(function(output, encoding, next) {
            socket.emit('stdout', output.toString());
            return next();
        });
        var socketErr = through(function(output, encoding, next) {
            socket.emit('stderr', output.toString());
            return next();
        });

        socket.on('start service', function(service) {
            try {
                childProcess = startService(service);
            } catch (err) {
                socket.emit('error', err);
            }
            childProcess.on('exit', function(code, signal) {
                if (code === 0) socket.emit('start service result', service, 'success');
                if (code === 1) socket.emit('start service result', service, 'failure');
            });
            childProcess.stdout.pipe(through(function(output, encoding, next) {
                console.log(output);
                return next();
            }));
            childProcess.stderr.pipe(through(function(output, encoding, next) {
                checkForSudo(output, 'start service', socket);

                return next();
            }));
        });
        socket.on('stop service', function(service) {
            try {
                childProcess = stopService(service);
            } catch (err) {
                socket.emit('error', err);
            }
            childProcess.on('exit', function(code, signal) {
                if (code === 0) socket.emit('stop service result', service, 'success');
                if (code === 1) socket.emit('stop service result', service, 'failure');
            });
            childProcess.stdout.pipe(through(function(output, encoding, next) {
                console.log('STDOUT ' + output);
                return next();
            }));
            childProcess.stderr.pipe(through(function(output, encoding, next) {
                checkForSudo(output, 'stop service', socket);

                return next();
            }));

            socket.on('password supplied', function(password) {
                childProcess.stdin.write(password + '\n');
            });
        });
        socket.on('restart service', function(service) {
            try {
                childProcess = restartService(service);
            } catch (err) {
                socket.emit('error', err);
            }
            childProcess.on('exit', function(code, signal) {
                if (code === 0) socket.emit('restart service result', service, 'success');
                if (code === 1) socket.emit('restart service result', service, 'failure');
            });
            childProcess.stdout.pipe(through(function(output, encoding, next) {
                console.log(output);
                return next();
            }));
            childProcess.stderr.pipe(through(function(output, encoding, next) {
                checkForSudo(output, 'restart service', socket);

                return next();
            }));
        });
        socket.on('get status', function(service) {
            try {
                childProcess = getStatus(service);
            } catch (err) {
                socket.emit('error', err);
            }
            childProcess.stdout.pipe(socketOut);
            childProcess.stderr.pipe(socketErr);
        });
        socket.on('get status all', function() {
            try {
                childProcess = getRunningServices();
            } catch (err) {
                socket.emit('error', err);
            }
            childProcess.stdout.pipe(through(function(output, encoding, next) {
                var result = / +\[ (.) \]\s+(.+)/g.exec(output);

                socket.emit('service status', result[2], (result[1] == '+'));
                return next();
            }));
            childProcess.stderr.pipe(socketErr);
        });

        socket.on('disconnect', function() {
            // If childProcess is active on socket, kill
            if (!!childProcess) childProcess.kill();
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

    var match;
    var re = /(?!.)\s+(\S+ ?\S+): (.+(?:\n\s+└─.+)?)|● ([^\.]*).?\w+(?: \- (.+))?|(\w{3} \d{2} (?:\d|\:){8}) (\w+) (\w+\[\d+\]): (.+)/g;

    while ((match = re.exec(service)) !== null) {
        if (match.index === re.lastIndex) {
            re.lastIndex++;
        }
        if (!!match[1] && !!match[2]) {
            var key = serviceInfo[match[1].replace('-', '').toLowerCase()];

            if (!!key) {
                if (typeof key == 'object') serviceInfo[key].push(match[2]);
                else {
                    var firstValue = serviceInfo[key];

                    serviceInfo[key] = [
                        firstValue,
                        match[2]
                    ];
                }
            }
            serviceInfo[match[1].replace('-', '').toLowerCase()] = match[2];
        }
        if (!!match[3]) serviceInfo.name = match[3];
        if (!!match[4]) serviceInfo.description = match[4];
        if (!!match[5] && !!match[6] && !!match[7] && !!match[8]) {
            if (!serviceInfo.log) serviceInfo.log = [];

            serviceInfo.log.push({
                timestamp: match[5],
                FQDN     : match[6],
                process  : match[7],
                content  : match[8]
            });
        }
    }

    return serviceInfo;
}

function startService(service) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                [ '-S', 'service', service, 'start'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function stopService(service) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                [ '-S', 'service', service, 'stop'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function restartService(service) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                [ '-S', 'service', service, 'restart'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function getStatus(service) {
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'service',
                [ service, 'status'],
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

function checkForSudo(output, operation, socket) {
    var match;
    var sudo = /\[sudo\] password for (\w+):/g;

    while ((match = sudo.exec(output.toString())) !== null) {
        socket.emit('password required', operation, match[1]);
    }
}

module.exports = init;

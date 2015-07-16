var router  = require('express').Router(),
    exec    = require('child_process').exec,
    through = require('through2'),
    distro;

function init(io) {
    io.on('connection', function(socket) {
        var webTerminal;

        var socketOut = through(function(output, err, next) {
            if (err) socket.emit('err', output.toString());
            socket.emit('stdout', output.toString());
            next();
        });
        var socketErr = through(function(output, err, next) {
            if (err) socket.emit('err', output.toString());
            socket.emit('stderr', output.toString());
            next();
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

        socket.on('disconnect', function() {
            // If webTerminal is active on socket, kill
            if (!!webTerminal) webTerminal.kill();
        });
    });

    router.get('/list', function(req, res) {
        exec('ls /etc/init.d/', function(err, stdout, stderr) {
            res.send(stdout.replace(/(\n)/g, ',').replace(/(,)(?!\w)/g, '').split(','));
        });
    });

    return router;
}

function startService(data) {
    forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.package, 'start'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function stopService(data) {
    forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.package, 'stop'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function restartService(data) {
    forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.package, 'restart'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function getStatus(data) {
    forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['service', data.package, 'status'],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function forDistro(actions) {
    if (!distro) distro = require('./system').distro;

    if (!!actions[distro]) actions[distro]();
    else throw('Distro is unsupported!');
}

module.exports = init;

var router   = require('express').Router(),
    managers = require('express').Router(),
    exec     = require('child_process').exec,
    spawn    = require('child_process').spawn,
    through  = require('through2'),
    distro;

var installedManagers = [];

exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
    // Javascript RegExp does not support negated lookbehind, this does it
    // manually
    stdout = stdout.replace(/\S(yum|apt)(?!\S)/gi, '');

    installedManagers = stdout.match(/\b(yum|apt)(?!\S)/gi);
});


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

        socket.on('install package', function(data) {
            try {
                webTerminal = installPackage(socket, data);
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(socketOut);
            webTerminal.stderr.pipe(socketErr);
        });
        socket.on('update', function(data) {
            try {
                webTerminal = updatePackage(data);
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(socketOut);
            webTerminal.stdout.pipe(socketErr);
        });
        socket.on('disconnect', function() {
            // If webTerminal is active on socket, kill with Ctrl+C behaviors
            if (!!webTerminal) webTerminal.kill(2);
        });

        socket.on('input', function(data) {
            webTerminal.stdin.write(data.input +'\n');
        });
    });
    router.get('/list', function(req, res) {
        if (!distro) distro = require('./system').distro;

        if (distro == 'ubuntu') {
            exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
                res.send(stdout.replace(/(\s+install\s+)/g, ',').split(','));
            });
        }
        else if (distro == 'redhat') {
            // TODO:  Work on package list for redhat
            res.send('is redhat');
        }
        else if (distro == 'bsd') {
            // TODO:  Work on package list for BSD-based
            res.send('is bsd');
        }
        else res.send(distro);
    });

    router.get('/listManagers', function(req, res) {
        exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
            // Javascript RegExp does not support negated lookbehind, this does it
            // manually
            stdout = stdout.replace(/\S(yum|apt)(?!\S)/gi, '');

            res.send(installedManagers);
        });
    });

    return router;
}

function installPackage(data) {
    if (!distro) distro = require('./system').distro;

    if (distro == 'ubuntu') {
        return spawn(
            'sudo',
            ['-S', 'apt-get', 'install', data.package],
            { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
        );
    } else if (distro == 'redhat') {
        // TODO:  Work on package installation process for redhat
    } else if (distro == 'bsd') {
        // TODO:  WOrk on package installation process for bsd
    } else {
        throw('Distro is unsupported!');
    }
}

function updatePackage(data) {
    if (!distro) distro = require('./system').distro;

    if (distro == 'ubuntu') {
        return spawn(
            'sudo',
            ['-S', 'apt-get', 'install', data.package],
            { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
        );
    } else if (distro == 'redhat') {
        // TODO:  Work on package installation process for redhat
    } else if (distro == 'bsd') {
        // TODO:  WOrk on package installation process for bsd
    } else {
        throw('Distro is unsupported!');
    }
}

module.exports = init;

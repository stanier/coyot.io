var router   = require('express').Router(),
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
                webTerminal = installPkg(data);
            } catch (err) {
                socket.emit('error', err);
            }
            webTerminal.stdout.pipe(socketOut);
            webTerminal.stderr.pipe(socketErr);
        });
        socket.on('update package', function(data) {
            try {
                webTerminal = updatePkg(data);
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

        socket.on('input', function(data) {
            webTerminal.stdin.write(data.input +'\n');
        });
    });

    router.get('/list', function(req, res) {
        forDistro({
            'ubuntu': function() {
                exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
                    res.send(stdout.replace(/(\s+install\s+)/g, ',').split(','));
                });
            }
        });
    });
    router.get('/listManagers', function(req, res) {
        exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
            // Javascript RegExp does not support negated lookbehind, this does it
            // manually
            stdout = stdout.replace(/\S(yum|apt)(?!\S)/gi, '');

            res.send(installedManagers);
        });
    });
    router.get('/getInfo/:pkg', function(req, res) {
        forDistro({
            'ubuntu': function() {
                exec('apt-cache show ' + req.params.pkg, function(err, stdout, stderr) {
                    if (stderr) return res.send(stderr);
                    if (err) return res.send(err);

                    res.send(serializePkgInfo(stdout));
                });
            }
        });
    });

    return router;
}

function installPkg(data) {
    forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['-S', 'apt-get', 'install', data.pkg],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function updatePkg(data) {
    forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['-S', 'apt-get', 'install', '--only-upgrade', data.pkg],
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

function serializePkgInfo(pkg) {
    var pkgProperties = pkg.split('\n');
    var pkgInfo = {};

    for (var i in pkgProperties) {
        var keyValuePair = /(.+):(?:\s)(.+)/g.exec(pkgProperties[i]);
        pkgInfo[keyValuePair[1]] = keyValuePair[2];
    }

    return pkgInfo;
}

module.exports = init;

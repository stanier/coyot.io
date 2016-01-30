var router   = require('express').Router(),
    exec     = require('child_process').exec,
    spawn    = require('child_process').spawn,
    through  = require('through2'),
    util     = require('./util'),
    q        = require('q');

var installedManagers = [];

exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
    // Javascript RegExp does not support negated lookbehind, this does it
    // manually
    stdout = stdout.replace(/\S(yum|apt)(?!\S)/gi, '');

    installedManagers = stdout.match(/\b(yum|apt)(?!\S)/gi);
});

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

        socket.on('install package', function(data) {
            try {
                childProcess = installPkg(data);
            } catch (err) {
                socket.emit('error', err);
            }
            childProcess.stdout.pipe(socketOut);
            childProcess.stderr.pipe(socketErr);
        });
        socket.on('update package', function(data) {
            try {
                childProcess = updatePkg(data);
            } catch (err) {
                socket.emit('error', err);
            }
            childProcess.stdout.pipe(socketOut);
            childProcess.stderr.pipe(socketErr);
        });
        socket.on('disconnect', function() {
            // If childProcess is active on socket, kill
            if (!!childProcess) childProcess.kill();
        });

        socket.on('input', function(data) {
            childProcess.stdin.write(data.input +'\n');
        });
    });

    router.get('', function(req, res) {
        listPkgs()
        .then(function(list) {
            var response = {};

            if (!!req.query.max) {
                var offset = (!!req.query.offset) ? parseInt(req.query.offset) : 0;

                response.count = list.length;
                response.packages = list.slice(offset, offset + parseInt(req.query.max));
            } else {
                response.packages = list;
            }

            if (req.query.returnManagers === 'true') {
                response.managers = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].match(/(aptitude|yum)(?!\S)/gi) !== null) {
                        response.managers.push(list[i].match(/(aptitude|yum)(?!\S)/gi)[0]);
                    }
                }
            }

            return response;
        })
        .then(function(response) {
            res.send(response);
        });
    });

    router.get('/:pkg', function(req, res) {
        getPkg(req.params.pkg)
        .then(function(info) {
            var response = {};

            if (!!req.query.include) {
                var fields = req.query.include.split(',');

                response.requestedFields = [];

                response.packageInfo = {};

                for (var i = 0; i < fields.length; i++) {
                    response.requestedFields.push(fields[i]);

                    if (!!info[fields[i]]) {
                        response.packageInfo[fields[i]] = info[fields[i]];
                    }
                }
            } else {
                response.packageInfo = info;
            }

            return response;
        })
        .then(function(response) {
            res.send(response);
        });
    });

    return router;
}

function installPkg(data) {
    return util.forDistro({
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
    return util.forDistro({
        'ubuntu': function() {
            return new spawn(
                'sudo',
                ['-S', 'apt-get', 'install', '--only-upgrade', data.pkg],
                { detached: true, stdio: ['pipe', 'pipe', 'pipe'] }
            );
        }
    });
}

function serializePkgInfo(pkg) {
    var pkgProperties = pkg.split('\n');
    var pkgInfo = {};
    var keyValuePair;

    for (var i in pkgProperties) {
        if((keyValuePair = /(.+):(?:\s)(.+)/g.exec(pkgProperties[i]))) {
            pkgInfo[keyValuePair[1].replace('-', '').toLowerCase()] = keyValuePair[2];
        }
    }
    return pkgInfo;
}

function getPkg(package) {
    var deferred = q.defer();

    util.forDistro({
        'ubuntu': function() {
            return exec('apt-cache show ' + package, function(err, stdout, stderr){
                deferred.resolve(serializePkgInfo(stdout));
            });
        }
    });

    return deferred.promise;
}

function listPkgs() {
    var deferred = q.defer();

    util.forDistro({
        'ubuntu': function() {
            return exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
                deferred.resolve(stdout.replace(/(\s+install\s+)/g, ',').split(','));
            });
        }
    });

    return deferred.promise;
}

module.exports = init;

var router   = require('express').Router(),
    managers = require('express').Router(),
    exec     = require('child_process').exec,
    spawn    = require('child_process').spawn,
    distro;

var installedManagers = [];

exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
    // Javascript RegExp does not support negated lookbehind, this does it
    // manually
    stdout = stdout.replace(/\S(yum|apt)(?!\S)/gi, '');

    installedManagers = stdout.match(/\b(yum|apt)(?!\S)/gi);
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

router.post('/install', function(req, res) {
    if (distro == 'ubuntu') {
        //var install = spawn('apt-get', ['install', req.body.query, '--y']);

        for (var i = 0; i <= 20; i++) {
            res.write(new Buffer(i.toString(), 'utf8'));
            if (i == 20) res.end();
        }

        /*install.stdout.on('data', function(data) {
            res.write(data);
        });
        install.stderr.on('data', function(data) {
            res.write(data);
        });
        install.stdout.on('end', function(data) {
            res.end();
        });*/
    } else if (distro == 'redhat') {
        // TODO:  Work on package installation process for redhat
    } else if (distro == 'bsd') {
        // TODO:  WOrk on package installation process for bsd
    } else {
        res.send('Distro is unsupported, could not complete operation');
    }
});

module.exports = router;

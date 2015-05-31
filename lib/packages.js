var router = require('express').Router(),
    managers = require('express').Router(),
    exec = require('child_process').exec,
    os = require('os');

var regexp = {
    ubuntu: /(\S*ubuntu)/i,
    redhat: /(red(\s?)hat)|(centos)|(fedora)/i,
    bsd: /((\w?)+bsd)/i
};

var installedManagers;

var distro;

if (os.platform() != 'linux') distro = '';
else {
    exec('cat /etc/issue', function(err, stdout, stderr) {
        distro = stdout.toString().replace(/\\./g, "");
    });
}

router.get('/list', function(req, res) {
    if (regexp.ubuntu.test(distro)) {
        exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
            res.send(stdout.replace(/(\s+install\s+)/g, ',').split(','));
        });
    }
    else if (regexp.redhat.test(distro)) {
        // TODO:  Work on package list for redhat
        res.send('is redhat');
    }
    else if (regexp.bsd.test(distro)) {
        // TODO:  Work on package list for BSD-based
        res.send('is bsd');
    }
    else {
        res.send(regexp.ubuntu.test(distro));
    }
});

router.get('/listManagers', function(req, res) {
    exec('dpkg --get-selections | grep -v deinstall', function(err, stdout, stderr) {
        // Javascript RegExp does not support negated lookbehind, this does it
        // manually
        stdout = stdout.replace(/\S(yum|apt)(?!\S)/gi, '');

        res.send(stdout.match(/\b(yum|apt)(?!\S)/gi));
    });
});

router.post('/install', function(req, res) {
    console.log(req.body);
});

module.exports = router;

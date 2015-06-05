var router = require('express').Router(),
    fs     = require('fs');

var assets = {
    'jquery'      : 'node_modules/jquery/dist',
    'bootstrap'   : 'node_modules/bootstrap/dist',
    'font-awesome': 'node_modules/font-awesome',
    'angularjs'   : 'node_modules/angular',
    'socket.io.js': 'node_modules/socket.io-client/socket.io.js',
    'synapsejs'   : 'static'
};

for (var package in assets) {
    route(package, assets[package]);
}

function route(identifier, item) {
    var stats = fs.lstatSync(__dirname + '/../' + item);
    if (stats.isDirectory()) {
        router.get('/' + identifier + '/*', function(req, res) {
            var options = {
                root    : __dirname + '/../' + item,
                dotfiles: 'deny',
                headers : {
                    'x-timestamp': Date.now(),
                    'x-sent'     : true
                }
            };
            res.sendFile(req.params[0], options, function(err) {
                if (err) {
                    console.error(err);
                    res.status(err.status).end();
                }
            });
        });
    } else if (stats.isFile()) {
        router.get('/' + identifier, function(req, res) {
            var options = {
                root    : __dirname + '/../',
                dotfiles: 'deny',
                headers : {
                    'x-timestamp': Date.now(),
                    'x-sent'     : true
                }
            };
            res.sendFile(item, options, function(err) {
                if (err) {
                    console.error(err);
                    res.status(err.status).end();
                }
            });
        });
    } else {
        console.error('Asset ' + identifier + ' is not a file or directory');
    }
}

module.exports = router;

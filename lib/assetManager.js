var router = require('express').Router(),
    fs     = require('fs');

var assets = {
    'jquery'      : 'node_modules/jquery/dist',
    'bootstrap'   : 'node_modules/bootstrap/dist',
    'font-awesome': 'node_modules/font-awesome',
    'material'    : 'node_modules/bootstrap-material-design/dist',
    'angularjs'   : 'node_modules/angular',
    'socket.io.js': 'node_modules/socket.io-client/socket.io.js',
    'coyot.io'    : 'static'
};

for (var pkg in assets) {
    route(pkg, assets[pkg]);
}

function Options(item) {
    return  {
        root    : __dirname + '/../',
        dotfiles: 'deny',
        headers : {
            'x-timestamp': Date.now(),
            'x-sent'     : true
        }
    };
}

function route(identifier, item) {
    var stats = fs.lstatSync(__dirname + '/../' + item);
    if (stats.isDirectory()) {
        router.get('/' + identifier + '/*', function(req, res) {
            var options = new Options();
            options.root = __dirname + '/../' + item;

            res.sendFile(req.params[0], options, function(err) {
                if (err) {
                    console.error(err);
                    res.status(err.status).end();
                }
            });
        });
    } else if (stats.isFile()) {
        router.get('/' + identifier, function(req, res) {
            var options = new Options();

            res.sendFile(item, options, function(err) {
                if (err) {
                    console.error(err);
                    res.status(err.status).end();
                }
            });
        });
    } else console.error('Asset ' + identifier + ' is not a file or directory');
}

module.exports = router;

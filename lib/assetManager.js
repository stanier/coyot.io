var router = require('express').Router(),
    fs     = require('fs');
route('jquery'         , 'node_modules/jquery/dist');
route('bootstrap'      , 'node_modules/bootstrap/dist');
route('font-awesome'   , 'node_modules/font-awesome');
route('material'       , 'node_modules/bootstrap-material-design/dist');
route('toastr'         , 'node_modules/toastr/build');
route('sweetalert'     , 'node_modules/sweetalert/dist');
route('angular'        , 'node_modules/angular');
route('angular-route'  , 'node_modules/angular-route');
route('angular-animate', 'node_modules/angular-animate');
route('animate.css'    , 'node_modules/animate.css');
route('socket.io.js'   , 'node_modules/socket.io-client/socket.io.js');
route('coyot.io'       , 'static');

var assets = {
    'jquery'      : 'node_modules/jquery/dist',
    'bootstrap'   : 'node_modules/bootstrap/dist',
    'font-awesome': 'node_modules/font-awesome',
    'angularjs'   : 'node_modules/angular',
    'socket.io.js': 'node_modules/socket.io-client/socket.io.js',
    'coyot.io'    : 'static'
};

for (var package in assets) {
    route(package, assets[package]);
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

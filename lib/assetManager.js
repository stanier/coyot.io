var router = require('express').Router(),
    fs     = require('fs');

route('angular'          , 'node_modules/angular');
route('angular-animate'  , 'node_modules/angular-animate');
route('angular-route'    , 'node_modules/angular-route');
route('angular-ui-router', 'node_modules/angular-ui-router/build');
route('animate.css'      , 'node_modules/animate.css');
route('bootstrap'        , 'node_modules/bootstrap/dist');
route('coyot.io'         , 'static');
route('font-awesome'     , 'node_modules/font-awesome');
route('jquery'           , 'node_modules/jquery/dist');
route('material'         , 'node_modules/bootstrap-material-design/dist');
route('sweetalert'       , 'node_modules/sweetalert/dist');
route('socket.io.js'     , 'node_modules/socket.io-client/socket.io.js');
route('toastr'           , 'node_modules/toastr/build');

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

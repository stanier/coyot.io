var router = require('express').Router(),
    fs     = require('fs');

route('animate.css'     , 'node_modules/animate.css');
route('jquery'          , 'node_modules/jquery/dist');
route('layouts.min.css' , 'node_modules/angular-material/angular-material.layouts.min.css');
route('material.min.css', 'node_modules/angular-material/angular-material.min.css');
route('material.min.js' , 'node_modules/angular-material/angular-material.min.js');
route('md-data-table'   , 'node_modules/angular-material-data-table/dist');
route('md-icons'        , 'node_modules/material-design-icons/iconfont');
route('ng'              , 'node_modules/angular');
route('ng-animate'      , 'node_modules/angular-animate');
route('ng-aria.min.js'  , 'node_modules/angular-aria/angular-aria.min.js');
route('ng-cookies'      , 'node_modules/angular-cookies');
route('ng-md-icons.css' , 'node_modules/angular-material-icons/angular-material-icons.css');
route('ng-md-icons.js'  , 'node_modules/angular-material-icons/angular-material-icons.min.js');
route('ng-resource'     , 'node_modules/angular-resource');
route('ng-route'        , 'node_modules/angular-route');
route('ng-ui-router'    , 'node_modules/angular-ui-router/build');
route('socket.io.js'    , 'node_modules/socket.io-client/socket.io.js');
route('sweetalert'      , 'node_modules/sweetalert/dist');
route('underscore.js'   , 'node_modules/underscore/underscore-min.js');

route('coyot.io'        , 'static');

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

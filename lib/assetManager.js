var router = require('express').Router();

var assets = {
    'jquery'      : './node_modules/jquery/dist',
    'bootstrap'   : './node_modules/bootstrap/dist',
    'font-awesome': './node_modules/font-awesome',
    'angularjs'   : './node_modules/angular',
    'synapsejs'   : 'static'
};

for (var package in assets) {
    route(package, assets[package]);
}

function route(identifier, directory) {
    router.get('/' + identifier + '/*', function(req, res) {
        var options = {
            root    : __dirname + '/../' + directory,
            dotfiles: 'deny',
            headers : {
                'x-timestamp': Date.now(),
                'x-sent'     : true
            }
        };
        res.sendFile(req.params[0], options, function(err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
        });
    });
}

module.exports = router;

var router = require('express').Router();

var assets = {
    "jquery": "node_modules/jquery/dist",
    "bootstrap": "node_modules/bootstrap/dist",
    "synapsejs": "static"
}

for (var package in assets) {
    route(package, assets[package])
}

function route(identifier, route) {
    router.get('/' + identifier + '/*', function(req, res) {
        var options = {
            root: __dirname + '/' + route,
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }
        res.sendFile(req.params[0], options, function(err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
        });
    });
}

module.exports = router;
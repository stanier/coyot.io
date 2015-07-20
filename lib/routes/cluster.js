var express     = require('express'),
    router      = express.Router(),
    api         = express.Router(),
    r           = require('../util').routing;

router.get('/manage', function(req, res) {
    res.render('panel/cluster/manage');
});

api.get('/servers', function(req, res) {
    r.findServer(function(result) {
        res.send(result);
    });
});

module.exports = router;
module.exports.api = api;

var express     = require('express'),
    router      = express.Router(),
    api         = express.Router(),
    r           = require('../util').routing;

router.get('/dashboard', function(req, res) {
    res.render('panel/management/dashboard');
});

router.get('/users', function(req, res) {
    res.render('panel/management/users');
});

api.get('/users', function(req, res) {
    // TODO:  Write user management functionality
});

module.exports = router;
module.exports.api = api;

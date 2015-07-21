var express   = require('express'),
    router    = express.Router(),
    api       = express.Router(),
    userModel = require('../dbschema').userModel;

router.get('/dashboard', function(req, res) {
    res.render('panel/management/dashboard');
});

router.get('/users', function(req, res) {
    res.render('panel/management/users');
});

api.get('/users', function(req, res) {
    userModel
        .find()
        .select('username email role')
        .exec(function(err, result) {
            if (err) res.send(err);

            res.send(result);
        })
    ;
});

module.exports = router;
module.exports.api = api;

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

router.get('/users/add', function(req, res) {
    res.render('panel/management/users/add');
});

router.get('/users/view', function(req, res) {
    res.render('panel/management/users/view');
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
api.post('/users', function(req, res) {
    userModel.create(req.body, function(err) {
        if (err) return res.send(err);

        res.end();
    });
});

module.exports = router;
module.exports.api = api;

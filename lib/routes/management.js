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

router.get('/users/edit', function(req, res) {
    res.render('panel/management/users/edit');
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

api.get('/users/:username', function(req, res) {
    userModel
        .findOne({username: req.params.username})
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

        res.send('success');
    });
});

api.put('/users/:username', function(req, res) {
    userModel
        .findOne({username: req.params.username})
        .exec(function(err, result) {
            if (err) return res.send(err);

            console.log(req.body);

            for (var i in req.body) {
                result[i] = req.body[i];
            }

            result.save(function(err) {
                if (err) return res.send(err);

                res.send('success');
            });
        })
    ;
});

api.delete('/users/:username', function(req, res) {
    userModel
        .findOne({username: req.params.username})
        .remove()
        .exec(function(err, result) {
            if (err) return res.send(err);

            res.send('success');
        })
    ;
});

module.exports = router;
module.exports.api = api;

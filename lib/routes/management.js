var express    = require('express'),
    router     = express.Router(),
    api        = express.Router(),
    render     = require('../util').routing.render;
    userModel  = require('../dbschema').userModel;
    groupModel = require('../dbschema').groupModel;

router.get('/dashboard'  , render('panel/management/dashboard'));

router.get('/users'      , render('panel/management/users'));
router.get('/users/add'  , render('panel/management/users/add'));
router.get('/users/view' , render('panel/management/users/view'));
router.get('/users/edit' , render('panel/management/users/edit'));

router.get('/groups'     , render('panel/management/groups'));
router.get('/groups/add' , render('panel/management/groups/add'));
router.get('/groups/view', render('panel/management/groups/view'));
router.get('/groups/edit', render('panel/management/groups/edit'));

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
        .findOne({ username: req.params.username })
        .select('username email role groups')
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
        .findOne({ username: req.params.username })
        .update(req.body, function(err) {
            if (err) return res.send(err);

            res.send('success');
        })
    ;
});

api.delete('/users/:username', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .remove()
        .exec(function(err, result) {
            if (err) return res.send(err);

            res.send('success');
        })
    ;
});

api.get('/groups', function(req, res) {
    groupModel
        .find()
        .select('name description isDefault')
        .exec(function(err, result) {
            if (err) return res.send(err);

            res.send(result);
        })
    ;
});

api.get('/groups/:name', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .select('name description isDefault')
        .exec(function(err, result) {
            if (err) return res.send(err);

            res.send(result);
        })
    ;
});

api.post('/groups', function(req, res) {
    groupModel.create(req.body, function(err) {
        if (err) return res.send(err);

        res.send('success');
    });
});

api.put('/groups/:name', function(req, res) {
    groupModel
        .findOne({ username: req.params.username })
        .update(data, function(err) {
            if (err) return res.send(err);

            res.send('success');
        })
    ;
});

api.delete('/groups/:name', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .remove()
        .exec(function(err, result) {
            if (err) return res.send(err);

            res.send('success');
        })
    ;
});

module.exports = router;
module.exports.api = api;

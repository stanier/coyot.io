var express = require('express'),
    _       = require('underscore');

var router     = express.Router(),
    api        = express.Router(),
    render     = require('../util').routing.render;
    userModel  = require('../dbschema/user');
    groupModel = require('../dbschema/group');

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
        .populate({
            path: 'groups',
            select: 'name description isDefault'
        })
        .exec(function(err, result) {
            if (err) res.send(err);

            res.send(result);
        })
    ;
});

api.post('/users', function(req, res) {
    userModel.create(req.body, function(err) {
        if (err) return res.send(err);

        // TODO: JSON response
        res.send('success');
    });
});

api.put('/users/:username', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .exec(function(err, result) {
            if (err) return res.send(err);

            if (!_.isMatch(result, req.body)) {
                result
                    .update(req.body)
                ;
            }

            // TODO: JSON response
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

            // TODO: JSON response
            res.send('success');
        })
    ;
});

api.get('/groups', function(req, res) {
    groupModel
        .find()
        .select('name description isDefault members')
        .populate({
            path: 'members',
            select: 'username role'
        })
        .exec(function(err, result) {
            if (err) return res.send(err);

            res.send(result);
        })
    ;
});

api.get('/groups/:identifier', function(req, res) {
    var group;

    if (req.query.identifier == 'id') {
        group = groupModel
            .findOne({ _id: req.params.identifier })
        ;
    } else {
        group = groupModel
            .findOne({ name: req.params.identifier })
        ;
    }

    group
        .select('name description isDefault members')
        .populate({
            path: 'members',
            select: 'username role'
        })
        .exec(function(err, result) {
            if (err) return res.send(err);

            res.send(result);
        })
    ;
});

api.post('/groups', function(req, res) {
    groupModel.create(req.body, function(err) {
        if (err) return res.send(err);

        // TODO: JSON response
        res.send('success');
    });
});

api.put('/groups/:name', function(req, res) {
    groupModel
        .findOne({ username: req.params.username })
        .update(req.body, function(err) {
            if (err) return res.send(err);

            // TODO: JSON response
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

            // TODO: JSON response
            return res.send('success');
        })
    ;
});

// Returns all permisisons granted to the group
api.get('/groups/:name/permissions', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .getPermissions()
        .exec(function(err, result) {

        })
    ;
});

// Grants permission to group
api.put('/groups/:name/permissions/:permission', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .grantPermission(req.params.permission)
        .exec(function(err, result) {

        })
    ;
});

// Denies permission to group
api.delete('/groups/:name/permissions/:permission', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .denyPermission(req.params.permission)
        .exec(function(err, result) {

        })
    ;
});

// Returns all permissions granted to user
api.get('/users/:username/permissions', function(req, res) {
    userModel
        .findOne({ name: req.params.username })
        .getPermissions()
        .exec(function(err, result) {

        })
    ;
});

// Grants permission to user
api.put('/users/:username/permissions/:permission', function(req, res) {
    userModel
        .findOne({ name: req.params.username })
        .grantPermission(req.params.permission)
        .exec(function(err, result) {

        })
    ;
});

// Denies permission to user
api.delete('/users/:username/permissions/:permission', function(req, res) {
    userModel
        .findOne({ name: req.params.username })
        .grantPermission(req.params.permission)
        .exec(function(err, result) {

        })
    ;
});

module.exports = router;
module.exports.api = api;

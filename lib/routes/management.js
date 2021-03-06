var express = require('express'),
    _       = require('underscore');

var
    router          = express.Router(),
    api             = express.Router(),
    render          = require('../util').routing.render,
    userModel       = require('../dbschema/user'),
    groupModel      = require('../dbschema/group'),
    permissionModel = require('../dbschema/permission'),
    permCatModel    = require('../dbschema/permCat')
;

router.get('/dashboard', render('panel/management/dashboard'));

router.get('/users'            , render('panel/management/users'));
router.get('/users/add'        , render('panel/management/users/add'));
router.get('/users/view'       , render('panel/management/users/view'));
router.get('/users/edit'       , render('panel/management/users/edit'));
router.get('/users/permissions', render('panel/management/users/permissions'));

router.get('/groups'            , render('panel/management/groups'));
router.get('/groups/add'        , render('panel/management/groups/add'));
router.get('/groups/view'       , render('panel/management/groups/view'));
router.get('/groups/edit'       , render('panel/management/groups/edit'));
router.get('/groups/permissions', render('panel/management/groups/permissions'));

api.get('/users', function(req, res) {
    userModel
        .find()
        .select('username email role')
        .exec(JSONresponse(req, res, true))
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
        .exec(JSONresponse(req, res, true))
    ;
});

api.post('/users', function(req, res) {
    userModel
        .create(req.body, JSONresponse(req, res))
    ;
});

api.put('/users/:username', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .update(req.body, JSONresponse(req, res))
    ;
});

api.delete('/users/:username', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .remove()
        .exec(JSONresponse(req, res))
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
        .exec(JSONresponse(req, res, true))
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
        .exec(JSONresponse(req, res, true))
    ;
});

api.post('/groups', function(req, res) {
    groupModel
        .create(req.body, JSONresponse(req, res))
    ;
});

api.put('/groups/:name', function(req, res) {
    groupModel
        .findOne({ username: req.params.username })
        .update(req.body, JSONresponse(req, res))
    ;
});

api.delete('/groups/:name', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .remove()
        .exec(JSONresponse(req, res))
    ;
});

// Returns all permisisons granted to the group
api.get('/groups/:name/permissions', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .select('permissions')
        .populate({
            path: 'permissions',
            select: 'full_handle'
        })

        .exec(function(err, result) {
            JSONresponse(req, res, true)(err, _.pluck(result.permissions, 'full_handle'));
        })
    ;
});

// Grants permission to group
api.put('/groups/:name/permissions/:permission', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .exec(function(err, group) {
            if (err) JSONresponse(req, res)(err);

            permissionModel
                .findOne({ full_handle: req.params.permission })
                .select('_id')
                .exec(function(err, result) {
                    group.permissions.push(result._id);
                    group.save(JSONresponse(req, res));
                })
            ;
        })
    ;
});

// Returns existence of permission for group
api.get('/groups/:name/permissions/:permission', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .select('permissions')
        .populate({
            path: 'permissions',
            match: { full_handle: req.params.permission },
            select: 'handle full_handle name'
        })
        .exec(function(err, result) {
            JSONresponse(req, res, true)(err, result.permissions.length > 0);
        })
    ;
});

// Denies permission to group
api.delete('/groups/:name/permissions/:permission', function(req, res) {
    groupModel
        .findOne({ name: req.params.name })
        .exec(function(err, group) {
            if (err) JSONresponse(req, res)(err);

            permissionModel
                .findOne({ full_handle: req.params.permission })
                .select('_id')
                .exec(function(err, result) {
                    group.permissions.pull(result._id);
                    group.save(JSONresponse(req, res));
                })
            ;
        })
    ;
});

// Returns all permissions granted to user
api.get('/users/:username/permissions', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .select('permissions')
        .populate({
            path: 'permissions',
            select: 'full_handle'
        })
        .exec(function(err, result) {
            JSONresponse(req, res, true)(err, _.pluck(result.permissions, 'full_handle'));
        })
    ;
});

// Grants permission to user
api.put('/users/:username/permissions/:permission', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .exec(function(err, user) {
            if (err) JSONresponse(req, res)(err);

            permissionModel
                .findOne({ full_handle: req.params.permission })
                .select('_id')
                .exec(function(err, result) {
                    user.permissions.push(result._id);
                    user.save(JSONresponse(req, res));
                })
            ;
        })
    ;
});

// Returns existence of permission for user
api.get('/users/:username/permissions/:permission', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .select('permissions')
        .populate({
            path: 'permissions',
            match: { full_handle: req.params.permission },
            select: 'handle full_handle name'
        })
        .exec(function(err, result) {
            JSONresponse(req, res, true)(err, result.permissions.length > 0);
        })
    ;
});

// Denies permission to user
api.delete('/users/:username/permissions/:permission', function(req, res) {
    userModel
        .findOne({ username: req.params.username })
        .exec(function(err, user) {
            if (err) JSONresponse(req, res)(err);

            permissionModel
                .findOne({ full_handle: req.params.permission })
                .select('_id')
                .exec(function(err, result) {
                    user.permissions.pull(result._id);
                    user.save(JSONresponse(req, res));
                })
            ;
        })
    ;
});

// Return all available permissions
api.get('/permissions', function(req, res) {
    permissionModel
        .find({})
        .exec(JSONresponse(req, res, true))
    ;
});

function JSONresponse(req, res, appendResult) {
    return function(err, result) {
        var response = {};

        if (err) {
            response.error = err;
            response.success = false;
        } else {
            response.success = true;
        }

        if (appendResult) response.result = result;

        return res.json(response);
    };
}

module.exports = router;
module.exports.api = api;

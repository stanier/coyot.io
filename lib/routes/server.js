var router      = require('express').Router(),
    serverModel = require('../dbschema').serverModel;

router.get('/:hostname/overview', function(req, res) {
    serverModel.findOne({ hostname: req.params.hostname })
        .select('hostname host port type').exec(function(err, result) {
            if (err) return res.end(err);

            res.render('panel/server/view', {
                hostname: result.hostname,
                type    : result.type,
                host    : result.host,
                port    : result.port
            });
        });
});

router.get('/:hostname/packages/install', function(req, res) {
    serverModel.findOne({ hostname: req.params.hostname })
        .select('hostname host port type').exec(function(err, result) {
            if (err) return res.end(err);

            res.render('panel/server/packages/install', {
                hostname: req.params.hostname,
                type    : result.type,
                host    : result.host,
                port    : result.port
            });
        });
});

router.get('/:hostname/packages', function(req, res) {
    serverModel.findOne({ hostname: req.params.hostname })
        .select('hostname host port type').exec(function(err, result) {
            if (err) return err;

            res.render('panel/server/packages/list', {
                hostname: req.params.hostname,
                type    : result.type,
                host    : result.host,
                port    : result.port
            });
        });
});

router.get('/:hostname/package/:package/', function(req, res) {
    serverModel.findOne({ hostname: req.params.hostname })
        .select('hostname host port type').exec(function(err, result) {
            if (err) return res.end(err);

            res.render('panel/server/package/view', {
                hostname: req.params.hostname,
                type    : result.type,
                host    : result.host,
                port    : result.port
            });
        });
});

module.exports = router;

var router = require('express').Router(),
    serverModel = require('../dbschema').serverModel;

router.get('/manage', function(req, res) {
    res.render('panel/cluster/manage');
});
router.get('/list', function(req, res) {
    serverModel.find().select('hostname host port type').exec(function(err, servers) {
        if (err) return res.end(err);

        res.send(servers);
    });
});
router.get('/:hostname/overview', function(req, res) {

    serverModel.findOne({hostname:req.params.hostname})
        .select('hostname host port').exec(function(err, result) {
        if (err) return res.end(err);

        res.render('panel/cluster/view', {
            hostname: req.params.hostname,
            host: result.host,
            port: result.port
        });
    });
});

module.exports = router;

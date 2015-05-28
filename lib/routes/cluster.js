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

module.exports = router;

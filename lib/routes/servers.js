var router = require('express').Router(),
    serverModel = require('../dbschema').serverModel;

router.get('/manage', function(req, res) {
    res.render('panel/servers/manage', { user: req.user });
});
router.get('/list', function(req, res) {
    serverModel.find().select('hostname').exec(function(err, servers) {
        if (err) return res.end(err);

        res.send(servers);
    });
});

module.exports = router;

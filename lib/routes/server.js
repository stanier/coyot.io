var router = require('express').Router(),
    serverModel = require('../dbschema').serverModel;

router.get('/:hostname/overview', function(req, res) {
    serverModel.findOne({hostname:req.params.hostname})
        .select('hostname host port').exec(function(err, result) {
        if (err) return res.end(err);

        res.render('panel/server/view', {
            hostname: req.params.hostname,
            host: result.host,
            port: result.port
        });
    });
});

module.exports = router;

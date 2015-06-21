var router      = require('express').Router(),
    r           = require('../util').routing;

router.get('/manage', function(req, res) {
    res.render('panel/cluster/manage');
});
router.get('/list', function(req, res) {
    r.findServer(function(result) {
        res.send(result);
    });
});

module.exports = router;

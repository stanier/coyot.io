var router = require('express').Router(),
    exec = require('child_process').exec;

router.get('/list', function(req, res) {
    res.send('fuck');
});

module.exports = router;

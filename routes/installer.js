var router = require('express').Router();

router.get('/', function(req, res) {
    res.render('installer');
});

module.exports = router;
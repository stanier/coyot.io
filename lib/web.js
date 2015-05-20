var router = require('express').Router(),
    queue = require('./queue'),
    assetManager = require('./assetManager');

function init(app) {
    app.use('/', router);
    console.log('WEB STARTED');
}

router.use('/static', assetManager);

router.get('/login', function(req, res) {
    res.render('login', {
        user: req.user,
        message: req.session.messages
    });
});

router.use('/auth', require('./auth').router);
router.use('/servers', require('./routes/servers'));

router.get('/', function(req, res) {
    if (req.user) res.render('panel', {
        user: req.user
    });
    else res.render('index', {
        user: req.user
    });
});

module.exports = init;

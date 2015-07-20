var router       = require('express').Router(),
    auth         = require('./auth'),
    assetManager = require('./assetManager');

function init(app) {
    app.use(function(req, res, next) {
        res.locals.message = req.flash('message');
        res.locals.error   = req.flash('error');
        res.locals.path    = req.path;

        next();
    });
    app.use('/', router);
    console.log('WEB STARTED');
}

router.use('/static', assetManager);

router.get('/login', function(req, res) {
    res.render('login');
});

router.use('/auth',    auth.router);
router.use('/cluster', auth.isAuthenticated, require('./routes/cluster'));
router.use('/server',  auth.isAuthenticated, require('./routes/server'));

router.get('/', auth.isAuthenticated, function(req, res) {
    res.render('index');
});

module.exports = init;

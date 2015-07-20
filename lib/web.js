var router           = require('express').Router(),
    auth             = require('./auth'),
    assetManager     = require('./assetManager'),
    clusterRouter    = require('./routes/cluster'),
    serverRouter     = require('./routes/server'),
    managementRouter = require('./routes/management');

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

router.use('/auth',       auth.router);
router.use('/cluster',    auth.isAuthenticated, clusterRouter);
router.use('/server',     auth.isAuthenticated, serverRouter);
router.use('/management', auth.isAuthenticated, managementRouter);

router.use('/api/cluster',    auth.isAuthenticated, clusterRouter.api);
router.use('/api/server',     auth.isAuthenticated, serverRouter.api);
router.use('/api/management', auth.isAuthenticated, managementRouter.api);

router.get('/', auth.isAuthenticated, function(req, res) {
    res.redirect('management/dashboard');
});

module.exports = init;

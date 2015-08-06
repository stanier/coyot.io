var router           = require('express').Router(),
    auth             = require('./auth'),
    assetManager     = require('./assetManager'),
    clusterRouter    = require('./routes/cluster'),
    serverRouter     = require('./routes/server'),
    managementRouter = require('./routes/management'),
    render           = require('./util').routing.render;

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

router.use('/auth', auth.router);

router.use('/pages/cluster',    auth.isAuthenticated, clusterRouter);
router.use('/pages/server',     auth.isAuthenticated, serverRouter);
router.use('/pages/management', auth.isAuthenticated, managementRouter);

router.use('/api/cluster',    markAsAPI, auth.isAuthenticated, clusterRouter.api);
router.use('/api/server',     markAsAPI, auth.isAuthenticated, serverRouter.api);
router.use('/api/management', markAsAPI, auth.isAuthenticated, managementRouter.api);

router.use('/login', render('login'));

router.use('/*', auth.isAuthenticated, render('index'));

function markAsAPI(req, res, next) {
    req.isAPI = true;
    next();
}

module.exports = init;

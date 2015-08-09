var router           = require('express').Router(),
    auth             = require('./auth'),
    assetManager     = require('./assetManager'),
    clusterRouter    = require('./routes/cluster'),
    serverRouter     = require('./routes/server'),
    managementRouter = require('./routes/management'),
    render           = require('./util').routing.render;

function init(app) {
    app.use(function(req, res, next) {
        res.locals.path    = req.path;

        next();
    });
    app.use('/', router);
    console.log('WEB STARTED');
}

router.use('/static', assetManager);

router.use('/auth', auth.router);

router.use('/pages/cluster',    clusterRouter);
router.use('/pages/server',     serverRouter);
router.use('/pages/management', managementRouter);

router.use('/api/cluster',    markAsAPI, auth.isAuthenticated, clusterRouter.api);
router.use('/api/server',     markAsAPI, auth.isAuthenticated, serverRouter.api);
router.use('/api/management', markAsAPI, auth.isAuthenticated, managementRouter.api);

router.use('/pages/app',   render('app'));
router.use('/pages/login', render('login'));

router.use('/*', render('index'));

function markAsAPI(req, res, next) {
    req.isAPI = true;
    next();
}

module.exports = init;

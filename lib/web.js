var router = require('express').Router(),
    //queue = require('./queue'),
    assetManager = require('./assetManager');

function init(app) {
    app.use(function(req, res, next) {
        res.locals.user    = {
            role: req.user.role
        };
        res.locals.message = req.session.messages;
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

router.use('/auth',    require('./auth').router);
router.use('/cluster', require('./routes/cluster'));
router.use('/server',  require('./routes/server'));

router.get('/', function(req, res) {
    if (req.user) res.render('panel');
    else res.render('index');
});

module.exports = init;

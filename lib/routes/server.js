var express     = require('express'),
    router      = express.Router(),
    api         = express.Router(),
    r           = require('../util').routing;

router.get('/overview',          render('panel/server'));
router.get('/packages/install',  render('panel/server/packages/install'));
router.get('/packages/update',   render('panel/server/packages/update'));
router.get('/packages',          render('panel/server/packages/list'));
router.get('/package/view',      render('panel/server/packages'));
router.get('/services',          render('panel/server/services/list'));
router.get('/service/view',      render('panel/server/services'));
router.get('/processes',         reserved);
router.get('/process/view',      reserved);

api.get('/:hostname/', function(req, res) {
    r.findServer({ hostname: req.params.hostname }, function(result) {
        if (!!result) return res.send({
                hostname: req.params.hostname,
                type    : result.type,
                host    : result.host,
                port    : result.port
            });
        else return res.send('Result not found');
    });
});

function render(path) {
    return function(req, res) {
        res.render(path);
    };
}

function reserved(req, res) {
    res.send('This subdirectory is reserved for future use');
}

module.exports = router;
module.exports.api = api;

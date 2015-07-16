var router      = require('express').Router(),
    r           = require('../util').routing;

router.get('/:hostname/overview',          r.findServerAndRender('panel/server/view'));
router.get('/:hostname/packages/install',  r.findServerAndRender('panel/server/packages/install'));
router.get('/:hostname/packages/update',   r.findServerAndRender('panel/server/packages/update'));
router.get('/:hostname/packages',          r.findServerAndRender('panel/server/packages/list'));
router.get('/:hostname/package/:package/', renderWithPackage('panel/server/packages/view'));
router.get('/:hostname/services',          r.findServerAndRender('panel/server/services/list'));
router.get('/:hostname/service/:service/', reserved);
router.get('/:hostname/processes',         reserved);
router.get('/:hostname/process/:process/', reserved);

function renderWithPackage(path) {
    return function(req, res) {
        r.findServer({ hostname: req.params.hostname }, function(result) {
            res.render(path, {
                package : req.params.package,
                hostname: req.params.hostname,
                type    : result.type,
                host    : result.host,
                port    : result.port
            });
        });
    };
}

function reserved(req, res) {
    res.send('This subdirectory is reserved for future use');
}

module.exports = router;

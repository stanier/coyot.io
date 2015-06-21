var router      = require('express').Router(),
    r           = require('../util').routing;

router.get('/:hostname/overview',          r.findServerAndRender('panel/server/view'));
router.get('/:hostname/packages/install',  r.findServerAndRender('panel/server/packages/install'));
router.get('/:hostname/packages/update',   r.findServerAndRender('panel/server/packages/update'));
router.get('/:hostname/packages',          r.findServerAndRender('panel/server/packages/list'));
router.get('/:hostname/package/:package/', r.findServerAndRender('panel/server/package/view'));

module.exports = router;

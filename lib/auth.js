var jwt = require('jsonwebtoken');

var userModel  = require('./dbschema').userModel,
    router     = require('express').Router();

exports.isAuthenticated = isAuthenticated;
exports.isAdmin         = isAdmin;
exports.isReseller      = isReseller;
exports.isClient        = isClient;
exports.atleastReseller = atleastReseller;
exports.atleastClient   = atleastClient;
exports.router          = router;
exports.appendUserInfo  = appendUserInfo;

function isAuthenticated(req, res, next) {
    if (req.cookies['auth-token']) {
        jwt.verify(req.cookies['auth-token'], 'superSecret', function(err, decoded) {
            if (err) res.send({
                success: false,
                message: 'Token auth failed'
            });
            else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'Access token required'
        });
    }
}

function isAdmin(req, res, next) {
    if (!!res && !!next) {
        isAuthenticated(req, res, function() {
            if (req.user && req.user.role == 4) next();
            else res.sendStatus(403);
        });
    } else {
        if (req.isAuthenticated() && req.user && req.user.role == 4) return true;
        else return false;
    }
}

function atleastReseller(req, res, next) {
    if (!!res && !!next) {
        isAuthenticated(req, res, function() {
            if (req.user && req.user.role >= 2) next();
            else res.sendStatus(403);
        });
    } else {
        if (req.isAuthenticated() && req.user && req.user.role >= 2) return true;
        else return false;
    }
}

function isReseller(req, res, next) {
    if (!!res && !!next) {
        isAuthenticated(req, res, function() {
            if (req.user && req.user.role == 2) next();
            else res.sendStatus(403);
        });
    } else {
        if (req.isAuthenticated() && req.user && req.user.role == 2) return true;
        else return false;
    }
}

function atleastClient(req, res, next) {
    if (!!res && !!next) {
        isAuthenticated(req, res, function() {
            if (req.user && req.user.role >= 1) next();
            else res.sendStatus(403);
        });
    } else {
        if (req.isAuthenticated() && req.user && req.user.role >= 1) return true;
        else return false;
    }
}

function isClient(req, res, next) {
    if (!!res && !!next) {
        isAuthenticated(req, res, function() {
            if (req.user && req.user.role == 1) next();
            else res.sendStatus(403);
        });
    } else {
        if (req.isAuthenticated() && req.user && req.user.role == 1) return true;
    }
}

function appendUserInfo(req, res, next) {
    res.locals.user    = {
        role: req.user.role
    };

    if (!!next) next();
}

function serializeUser(user, next) {
    next(null, user.id);
}
function deserializeUser(id, next) {
    userModel.findById(id, function (err, user) {
        next(err, user);
    });
}

router.post('/login', function(req, res) {
    userModel.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'User not found' });
        } else if (user) {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) return res.send(err);

                if (isMatch) {
                    res.send({
                        success: true,
                        token: jwt.sign(
                            user,
                            'superSecret',
                            {
                                expiresInMinutes: 1440 // == 24 hours
                            }
                        )
                    });
                } else res.send({
                    success: false,
                    message: 'Wrong password'
                });
            });
        }
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

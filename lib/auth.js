var passport   = require('passport'),
    passportIo = require('passport.socketio'),
    localStrat = require('passport-local').Strategy,
    userModel  = require('./dbschema').userModel,
    router     = require('express').Router();

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

passport.use(new localStrat(function(username, password, next) {
    userModel.findOne({ username: username }, function(err, user) {
        if (err) return next(err);

        if (!user) return next(null, false, { message: 'Unknown user ' + username });

        user.comparePassword(password, function(err, isMatch) {
            if (err) return next(err);

            if (isMatch) return next(null, user);
            else return next(null, false, { message: 'Invalid password' });
        });
    });
}));

exports.passport        = passport;
exports.passportIo      = passportIo;
exports.isAuthenticated = isAuthenticated;
exports.isAdmin         = isAdmin;
exports.isReseller      = isReseller;
exports.isClient        = isClient;
exports.atleastReseller = atleastReseller;
exports.atleastClient   = atleastClient;
exports.router          = router;
exports.appendUserInfo  = appendUserInfo;

function isAuthenticated(req, res, next) {
    if (!!res && !!next) {
        if (req.isAuthenticated()) {
            appendUserInfo(req, res);
            next();
        }
        else if (req.isAPI) res.sendStatus(403);
        else res.redirect('/login');
    } else {
        if (req.isAuthenticated()) return true;
        else return false;
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
    if (!req.user) {
        passport.authenticate('local', function(err, user, info) {
            if (err) return next(err);

            if (!user) return res.send({ error: info.message });

            req.logIn(user, function(err) {
                if (err) return next(err);

                return res.send({
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role
                });
            });
        })(req, res);
    } else res.send({
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

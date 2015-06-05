var passport   = require('passport'),
    passportIo = require('passport.socketio'),
    localStrat = require('passport-local').Strategy,
    db         = require('./dbschema'),
    router     = require('express').Router();

passport.serializeUser(function(user, next) { next(null, user.id);});
passport.deserializeUser(function(id , next) { db.userModel.findById(id, function (err, user) { next(err, user); }); });

passport.use(new localStrat(function(username, password, next) {
    db.userModel.findOne({ username: username }, function(err, user) {
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

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect('/login');
}

function isAuthenticated(req) {
    if (req.isAuthenticated()) return true;
    else return false;
}

function isAdmin(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role == 4) next();
    else res.sendStatus(403);
}

function isAdmin(req) {
    if (req.isAuthenticated() && req.user && req.user.role == 4) return true;
    else return false;
}

function atleastReseller(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role >= 2) next();
    else res.sendStatus(403);
}

function atleastReseller(req) {
    if (req.isAuthenticated() && req.user && req.user.role >= 2) return true;
    else return false;
}

function isReseller(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role == 2) next();
    else res.sendStatus(403);
}

function isReseller(req) {
    if (req.isAuthenticated() && req.user && req.user.role == 2) return true;
    else return false;
}

function atleastClient(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role >= 1) next();
    else res.sendStatus(403);
}

function atleastClient(req) {
    if (req.isAuthenticated() && req.user && req.user.role >= 1) return true;
    else return false;
}

function isClient(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role == 1) next();
    else res.sendStatus(403);
}

function isClient(req) {
    if (req.isAuthenticated() && req.user && req.user.role == 1) return true;
}

router.post('/login', function(req, res) {
    if (!req.user) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error', [info.message]);
                return res.redirect('/login');
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res);
    } else res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

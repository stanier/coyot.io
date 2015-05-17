var passport = require('passport'),
    localStrat = require('passport-local').Strategy,
    db = require('./dbschema'),
    router = require('express').Router();

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

exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect('/login');
};

exports.isAuthenticated = function(req) {
    if (req.isAuthenticated()) return true;
    else return false;
};

exports.isAdmin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role == 4) next();
    else res.sendStatus(403);
};

exports.isAdmin = function(req) {
    if (req.isAuthenticated() && req.user && req.user.role == 4) return true;
    else return false;
};

exports.atleastReseller = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role >= 2) next();
    else res.sendStatus(403);
};

exports.atleastReseller = function(req) {
    if (req.isAuthenticated() && req.user && req.user.role >= 2) return true;
    else return false;
};

exports.isReseller = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role == 2) next();
    else res.sendStatus(403);
};

exports.isReseller = function(req) {
    if (req.isAuthenticated() && req.user && req.user.role == 2) return true;
    else return false;
};

exports.atleastClient = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role >= 1) next();
    else res.sendStatus(403);
};

exports.atleastClient = function(req) {
    if (req.isAuthenticated() && req.user && req.user.role >= 1) return true;
    else return false;
};

exports.isClient = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }

    if (req.user && req.user.role == 1) next();
    else res.sendStatus(403);
};

exports.isClient = function(req) {
    if (req.isAuthenticated() && req.user && req.user.role == 1) return true;
};

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

exports.router = router;

/*var user = new db.userModel({ username: 'admin', email: 'bob@example.com', password: 'secret', role: 4 });
user.save(function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('user: ' + user.username + " saved.");
    }
});*/

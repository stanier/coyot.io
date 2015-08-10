var router       = require('express').Router(),
    cookieParser = require('cookie-parser'),
    jwt          = require('jsonwebtoken'),
    io;

var authTokenRegExp = /auth-token=(.+)(?:;|$)/m;

function init(app) {
    app.use('/api/worker', router);

    io = require('socket.io')(
        (app.locals.socket.leech) ? app.locals.server : app.locals.socket.port,
        false
    );

    io.use(function(socket, next) {
        if (!socket.request.headers.cookie) return next('I demand cookies to authenticate.', false);

        var token = authTokenRegExp.exec(socket.request.headers.cookie)[1];

        jwt.verify(token, 'superSecret', function(err, decoded) {
            if (err) next('Token auth failed.');
            else next();
        });

        next();
    });

    router.use('/packages', require('./packages')(io));
    router.use('/services', require('./services')(io));

    console.log('WORKER STARTED');
}

var socket = {};

socket.onSuccess = function(data, accept) {
    accept();
};
socket.onFailure = function(data, message, error, accept) {
    if (error) console.error(message);

    if (error) accept(new Error(message));
};

module.exports = init;

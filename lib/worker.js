var router     = require('express').Router(),
    passportIo = require('passport.socketio'),
    io;

function init(app) {
    app.use('/api/worker', router);

    io = require('socket.io')(
        (app.locals.socket.leech) ? app.locals.server : app.locals.socket.port,
        false
    );

    io.use(passportIo.authorize({
        cookieParser: require('cookie-parser'),
        key         : 'connect.sid',
        secret      : app.locals.secret,
        store       : app.locals.sessionStore,
        success     : socket.onSuccess,
        fail        : socket.onFailure
    }));

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

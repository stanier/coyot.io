var router     = require('express').Router(),
    passportIo = require('passport.socketio'),
    io;

router.use('/packages', require('./packages'));

function init(app) {
    app.use('/worker', router);

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

    console.log('WORKER STARTED');
}

var socket = {};

socket.onSuccess = function() {
    console.log('socket successfully authed!');
};
socket.onFailure = function() {
    console.log('socket did not pass auth!');
};

module.exports = init;

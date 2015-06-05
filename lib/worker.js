var router     = require('express').Router(),
    io         = require('socket.io')(8080),
    passportIo = require('passport.socketio');

router.use('/packages', require('./packages'));

function init(app) {
    app.use('/worker', router);

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

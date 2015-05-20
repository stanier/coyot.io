var router = require('express').Router(),
    queue = require('./queue');

function init(app) {
    app.use('/worker', router);
    console.log('WORKER STARTED');
}

module.exports = init;

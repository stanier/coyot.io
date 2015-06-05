var kue  = require('kue'),
    fs   = require('fs'),
    conf = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    os   = require('os');

var queue = kue.createQueue({
    prefix: 'j',
    redis : {
        port: conf.queue.port,
        host: conf.queue.host,
        auth: conf.queue.auth,
        db  : conf.queue.db
    }
});

queue.process('log', function(job, done){
    console.log(job.data.title);
    return done();
});

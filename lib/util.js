var serverModel = require('./dbschema/server');

var util = {},
    routing = {},
    findServer,
    distro;

routing.findServer = findServer = function(data, callback) {
    if (typeof data == 'function') return serverModel
        .find()
        .select('hostname host port type')
        .exec(function(err, result) {
            if (err) return res.send(err);

            data(result);
        })
    ;
    else return serverModel
        .findOne({ hostname: data.hostname })
        .select('hostname host port type')
        .exec(function(err, result) {
            if (err) return res.send(err);

            callback(result);
        })
    ;
};

routing.render = function(path) {
    return function(req, res) {
        res.render(path);
    };
};

util.forDistro = function(actions) {
    if (!distro) distro = require('./system').distro;

    if (!!actions[distro]) return actions[distro]();
    else throw('Distro is unsupported!');
};

module.exports = util;
module.exports.routing = routing;

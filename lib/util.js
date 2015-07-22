var serverModel = require('./dbschema').serverModel;

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

util.forDistro = function(actions) {
    if (!distro) distro = require('./system').distro;

    if (!!actions[distro]) return actions[distro]();
    else throw('Distro is unsupported!');
};

module.exports = util;
module.exports.routing = routing;

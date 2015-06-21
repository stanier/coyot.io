var serverModel = require('./dbschema').serverModel;

var util = {},
    routing = {},
    findServer;

routing.findServer = findServer = function(data, callback) {
    if (typeof data == 'function') return serverModel
        .find()
        .select('hostname host port type')
        .exec(function(err, result) {
            if (err) return res.end(err);

            data(result);
        })
    ;
    else return serverModel
        .findOne({ hostname: data.hostname })
        .select('hostname host port type')
        .exec(function(err, result) {
            if (err) return res.end(err);

            callback(result);
        })
    ;
};
routing.findServerAndRender = function(path) {
    return function(req, res) {
        findServer({ hostname: req.params.hostname}, function(result) {
            res.render(path, {
                hostname: req.params.hostname,
                type    : result.type,
                host    : result.host,
                port    : result.port
            });
        });
    };
};

module.exports = util;
module.exports.routing = routing;

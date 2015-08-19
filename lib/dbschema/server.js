var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var serverSchema = new Schema({
    host        : { type: String, required: true , unique: false },
    port        : { type: String, required: true , unique: false },
    hostname    : { type: String, required: true , unique: true  },
    type        : { type: String, required: false, unique: false },
    platform    : { type: String, required: false, unique: false },
    arch        : { type: String, required: false, unique: false },
    release     : { type: String, required: false, unique: false },
    totalMem    : { type: Number, required: false, unique: false },
    cpu         : { type: Array , required: false, unique: false },
});

serverSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    return this.save(callback);
};

serverSchema.statics.create = function(options, callback) {
    var server = new serverModel(options);

    return server.save(callback);
};

module.exports = serverModel = mongoose.model('Server', serverSchema);

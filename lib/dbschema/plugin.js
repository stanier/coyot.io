var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var pluginSchema = new Schema({
    name        : { type: String, required: false, unique: false },
    repository  : { type: String, required: false, unique: false },
    version     : { type: String, required: false, unique: false },
    owner       : { type: Number, required: false, unique: false, ref: 'User' },
    website     : { type: String, required: false, unique: false },
    description : { type: String, required: false, unique: false }
});

pluginSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    this.increment();

    return this.save(callback);
};

pluginSchema.statics.create = function(options, callback) {
    var plugin = new pluginModel(options);

    return plugin.save(callback);
};

module.exports = pluginModel = mongoose.model('Plugin', pluginSchema);

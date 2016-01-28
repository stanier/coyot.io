var mongoose = require('mongoose');

var pkgSchema = new mongoose.Schema({
    host         : { type: String, required: true , unique: false, ref: 'Server'},
    name         : { type: String, required: true , unique: false },
    version      : { type: String, required: false, unique: false },
    description  : { type: String, required: false, unique: false },
    url          : { type: String, required: false, unique: false },
    maintainer   : { type: String, required: false, unique: false },
    creator      : { type: String, required: false, unique: false },
    section      : { type: String, required: false, unique: false },
    priority     : { type: String, required: false, unique: false },
    size         : { type: Number, required: false, unique: false },
    architecture : { type: String, required: false, unique: false },
    filename     : { type: String, required: false, unique: false },
    md5sum       : { type: String, required: false, unique: false },
    sha1         : { type: String, required: false, unique: false },
    sha256       : { type: String, required: false, unique: false }
});

pkgSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    this.increment();

    return this.save(callback);
};

pkgSchema.statics.create = function(options, callback) {
    var pkg = new pkgModel(options);

    return pkg.save(callback);
};

module.exports = pkgModel = mongoose.model('Package', pkgSchema);

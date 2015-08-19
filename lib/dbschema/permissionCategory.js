var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var permissionsCategorySchema = new Schema({
    package     : { type: String , required: false, unique: false },
    handle      : { type: String , required: true , unique: true  },
    name        : { type: String , required: false, unique: false },
    default     : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    permissions :[{ type: String , required: false, unique: false, ref: 'Permission' }]
});

permissionsCategorySchema.methods.update = function(data, callback) {
    if (err) return callback(err);

    for (var i in data) {
        this[i] = data[i];
    }

    this.increment();

    return this.save(callback);
};

permissionsCategorySchema.statics.create = function(options, callback) {
    var permissionsCategory = new permissionsCategoryModel(options);

    return permissionsCategory.save(callback);
};

module.exports = permissionsCategoryModel =
    mongoose.model('Permissions Category', permissionsCategorySchema);

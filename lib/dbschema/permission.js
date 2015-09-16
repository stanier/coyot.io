var mongoose = require('mongoose');

var permissionSchema = new mongoose.Schema({
    handle      : { type: String , required: true , unique: true  },
    name        : { type: String , required: false, unique: true  },
    default     : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    parent      : { type: String , required: false, unique: false, ref: 'PermCat' }
});

permissionSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    this.increment();

    return this.save(callback);
};

permissionSchema.statics.create = function(options, callback) {
    var permission = new permissionModel(options);

    return permission.save(callback);
};

module.exports = permissionModel = mongoose.model('Permission', permissionSchema);

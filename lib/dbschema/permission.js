var mongoose = require('mongoose');

var permCat = require('./permCat');

var permissionSchema = new mongoose.Schema({
    handle      : { type: String , required: true , unique: true  },
    name        : { type: String , required: false, unique: true  },
    default     : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    parent      : { type: String , required: false, unique: false, ref: 'PermCat' },
    full_handle : { type: String , required: false, unique: false }
});

permissionSchema.pre('save', function(next) {
    var id = this._id;
    var entry = this;

    if (!!this.parent) {
        permCat.findOne({ _id: this.parent }, function(err, doc) {
            if (err) console.error(err);

            if (doc.permissions.indexOf(id) < 0) {
                doc.permissions.push(id);

                doc.save(function(err) {
                    if (err) console.log(err);
                });
            }

            entry.full_handle = doc.handle + '.' + entry.handle;

            next();
        });
    }

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

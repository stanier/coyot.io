var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var Schema   = mongoose.Schema;

var userSchema = new Schema({
    username    : { type: String, required: true , unique: true  },
    email       : { type: String, required: true , unique: true  },
    password    : { type: String, required: true , unique: false },
    firstName   : { type: String, required: false, unique: false },
    middleName  : { type: String, required: false, unique: false },
    lastName    : { type: String, required: false, unique: false },
    role        : { type: Number, required: true , unique: false },
    groups      :[{ type: String, required: false, unique: false, ref: 'Group' }],
    permissions :[{ type: String, required: false, unique: false, ref: 'Permission' }]
});

var groupSchema = new Schema({
    name        : { type: String , required: true , unique: true  },
    owner       : { type: Number , required: false, unique: false, ref: 'User' },
    isDefault   : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    members     :[{ type: String , required: false, unique: false, ref: 'User' }],
    permissions :[{ type: String , required: false, unique: false, ref: 'Permission' }]
});

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

var pluginSchema = new Schema({
    name        : { type: String, required: false, unique: false },
    repository  : { type: String, required: false, unique: false },
    version     : { type: String, required: false, unique: false },
    owner       : { type: Number, required: false, unique: false, ref: 'User' },
    website     : { type: String, required: false, unique: false },
    description : { type: String, required: false, unique: false }
});

var permissionSchema = new Schema({
    handle      : { type: String , required: true , unique: true  },
    name        : { type: String , required: false, unique: true  },
    default     : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    parent      : { type: String , required: false, unique: false, ref: 'Permissions Category' }
});

var permissionsCategorySchema = new Schema({
    package     : { type: String , required: false, unique: false },
    handle      : { type: String , required: true , unique: true  },
    name        : { type: String , required: false, unique: false },
    default     : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    permissions :[{ type: String , required: false, unique: false, ref: 'Permission' }]
});

userSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	return bcrypt.compare(candidatePassword, this.password, callback);
};

userSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    return this.save(callback);
};

userSchema.methods.grantPermission = function(data, callback) {
    permissionModel
        .find({ _id: data })
        .exec(function(err, result) {
            if (err) return callback(err, result);
            else {
                this.permissions.push(data);
                return this.save();
            }
        })
    ;
};

userSchema.methods.denyPermission = function(data, callback) {
    permissionModel
        .find({ _id: data})
        .exec(function(err, result) {
            if (err) return callback(err, result);
            else {
                this.permissions.push(data);
                return this.save();
            }
        })
    ;
};

userSchema.statics.create = function(options, callback) {
    if (!options.role) options.role = 1;
    var user = new userModel(options);

    if (!!options.group) {
        for (var group in options.group) {
            groupModel
                .findById(group, function(err, document) {
                    document.members.push(user);
                    document.save(callback);
                })
            ;
        }
    }

    return user.save(callback);
};

groupSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    return this.save(callback);
};

groupSchema.statics.create = function(options, callback) {
    var group = new groupModel(options);

    return group.save(callback);
};

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

pluginSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    return this.save(callback);
};

pluginSchema.statics.create = function(options, callback) {
    var plugin = new pluginModel(options);

    return plugin.save(callback);
};

permissionSchema.methods.update = function(data, callback) {
    for (var i in data) {
        this[i] = data[i];
    }

    return this.save(callback);
};

permissionSchema.statics.create = function(options, callback) {
    var permissions = new permissionsModel(options);

    return permissions.save(callback);
};

permissionsCategorySchema.methods.update = function(data, callback) {
    if (err) return callback(err);

    for (var i in data) {
        this[i] = data[i];
    }

    return this.save(callback);
};

permissionsCategorySchema.statics.create = function(options, callback) {
    var permissionsCategory = new permissionsCategoryModel(options);

    return permissionsCategory.save(callback);
};

exports.userModel                = userModel                = mongoose.model('User'  , userSchema);
exports.groupModel               = groupModel               = mongoose.model('Group' , groupSchema);
exports.serverModel              = serverModel              = mongoose.model('Server', serverSchema);
exports.pluginModel              = pluginModel              = mongoose.model('Plugin', pluginSchema);
exports.permissionModel          = permissionModel          = mongoose.model('Permission', permissionSchema);
exports.permissionsCategoryModel = permissionsCategoryModel = mongoose.model('Permissions Category', permissionsCategorySchema);

exports.mongoose    = mongoose;

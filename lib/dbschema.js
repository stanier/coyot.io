var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var Schema   = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    username    : { type: String, required: true , unique: true  },
    email       : { type: String, required: true , unique: true  },
    password    : { type: String, required: true , unique: false },
    firstName   : { type: String, required: false, unique: false },
    middleName  : { type: String, required: false, unique: false },
    lastName    : { type: String, required: false, unique: false },
    role        : { type: Number, required: true , unique: false },
    groups      : { type: Array , required: false, unique: false }
});

var groupSchema = new Schema({
    name        : { type: String , required: true , unique: true  },
    owner       : { type: Number , required: false, unique: false },
    isDefault   : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    permissions : { type: Object , required: false, unique: false }
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
    owner       : { type: String, required: false, unique: false },
    website     : { type: String, required: false, unique: false },
    description : { type: String, required: false, unique: false }
});

var permissionsSchema = new Schema({
    scope       : { type: String , required: true , unique: true  },
    name        : { type: String , required: false, unique: true  },
    default     : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false }
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
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return callback(err);

		callback(null, isMatch);
	});
};

userSchema.methods.update = function(data, callback) {
    if (err) return callback(err);

    for (var i in data) {
        this[i] = data[i];
    }

    this.save(function(err) {
        if (err) return callback(err);

        callback();
    });
};

userSchema.statics.create = function(options, callback) {
    if (!options.role) options.role = 1;
    var user = new userModel(options);

    user.save(function(err) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
};

groupSchema.methods.update = function(data, callback) {
    if (err) return callback(err);

    for (var i in data) {
        this[i] = data[i];
    }

    this.save(function(err) {
        if (err) return callback(err);

        callback();
    });
};

groupSchema.statics.create = function(options, callback) {
    var group = new groupModel(options);

    group.save(function(err) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
};

exports.userModel        = userModel        = mongoose.model('User'  , userSchema            );
exports.groupModel       = groupModel       = mongoose.model('Group' , groupSchema           );
exports.serverModel      = serverModel      = mongoose.model('Server', serverSchema          );
exports.pluginModel      = pluginModel      = mongoose.model('Plugin', pluginSchema          );
exports.permissionsModel = permissionsModel = mongoose.model('Permissions', permissionsSchema);

exports.mongoose    = mongoose;

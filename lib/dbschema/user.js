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

module.exports = userModel = mongoose.model('User', userSchema);

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var Schema   = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    username    : { type : String   , required : true   , unique : true  },
    email       : { type : String   , required : true   , unique : true  },
    password    : { type : String   , required : true   , unique : false },
    firstName   : { type : String   , required : false  , unique : false },
    middleName  : { type : String   , required : false  , unique : false },
    lastName    : { type : String   , required : false  , unique : false },
    role        : { type : Number   , required : true   , unique : false },
});

var serverSchema = new Schema({
    host        : { type : String   , required: true    , unique : false },
    port        : { type : String   , required: true    , unique : false },
    hostname    : { type : String   , required: true    , unique : true  },
    type        : { type : String   , required: false   , unique : false },
    platform    : { type : String   , required: false   , unique : false },
    arch        : { type : String   , required: false   , unique : false },
    release     : { type : String   , required: false   , unique : false },
    totalMem    : { type : Number   , required: false   , unique : false },
    cpu         : { type : Array    , required: false   , unique : false },
    distro      : { type : String   , required: false   , unique : false },
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

exports.userModel   = userModel   = mongoose.model('User', userSchema);
exports.serverModel = serverModel = mongoose.model('Server', serverSchema);
exports.mongoose    = mongoose;

userModel.findOne({}, function(err, user) {
    if (err) console.error(err);
    if (!user) {
        console.warn('No users found in database, creating new user');

        var defaultUser = {
            username: 'admin',
            email   : 'admin@example.com',
            password: 'coyote',
            role    : 4
        };

        new userModel(defaultUser).save(function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log(
                    'User has been saved with the following credentials:' +
                    '\n    Username:  ' + defaultUser.username +
                    '\n    Password:  ' + defaultUser.password
            );
            }
        });
    }
});

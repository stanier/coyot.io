var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var groupSchema = new Schema({
    name        : { type: String , required: true , unique: true  },
    owner       : { type: Number , required: false, unique: false, ref: 'User' },
    isDefault   : { type: Boolean, required: false, unique: false },
    description : { type: String , required: false, unique: false },
    members     :[{ type: String , required: false, unique: false, ref: 'User' }],
    permissions :[{ type: String , required: false, unique: false, ref: 'Permission' }]
});

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

module.exports = groupModel = mongoose.model('Group', groupSchema);

var assert = require('chai').assert;

var mongoose = require('mongoose');

var db          = require('../lib/dbschema'),
    userModel   = db.userModel,
    serverModel = db.serverModel,
    groupModel  = db.groupModel;

describe('Database', function() {
    before('connect to test database', function(done) {
        if (mongoose.connection.db) return done();

        mongoose.connect('mongodb://localhost:27017/coyotio_mocha', done);
    });

    describe('UserModel', function() {
        describe('create', function() {
            it('should create a new user without error', function(done) {
                var user = {
                    username: 'bob',
                    email: 'bob@example.com',
                    password: 'notagoodpassword'
                };

                userModel.create(user, function(err) {
                    if (err) throw err;

                    done();
                });
            });
        });

        describe('findOne', function() {
            it('should return username, email, role of user', function(done) {
                userModel
                    .findOne({ username: 'bob' })
                    .select('username email role')
                    .exec(function(err, result) {
                        if (err) throw err;

                        done();
                    })
                ;
            });
        });

        describe('update', function() {
            it('should compare data and update user', function(done) {
                var data = { email: 'bobsnewaddress@example.com' };

                userModel
                    .findOne({ username: 'bob' })
                    .update(data, function(err) {
                        if (err) throw err;

                        done();
                    })
                ;
            });
        });

        describe('comparePassword', function() {
            it('should accept matching password', function(done) {
                userModel.findOne({ username: 'bob' }, function(err, user) {
                    if (err) throw err;

                    user.comparePassword('notagoodpassword', function(err, isMatch) {
                        if (err) throw err;

                        if (isMatch) done();
                        else throw 'is not a match';
                    });
                });
            });

            it('should reject mismatching password', function(done) {
                userModel.findOne({ username: 'bob' }, function(err, user) {
                    if (err) throw err;

                    user.comparePassword('aworsepassword', function(err, isMatch) {
                        if (err) throw err;

                        if (!isMatch) done();
                        else throw 'is a match';
                    });
                });
            });
        });

        after('remove all userModel documents', function(done) {
            userModel.remove({}, function(err) {
                if (err) throw err;

                done();
            });
        });
    });

    describe('GroupModel', function() {
        describe('create', function() {
            it('should create a new group without error', function(done) {
                var group = {
                    name: 'bobs crew',
                    description: 'the most awesome crew to ever not exist'
                };

                groupModel.create(group, function(err) {
                    if (err) throw err;

                    done();
                });
            });
        });

        describe('findOne', function() {
            it('should return name, description of user', function(done) {
                groupModel
                    .findOne({ name: 'bobs crew' })
                    .select('name description')
                    .exec(function(err, result) {
                        if (err) throw err;

                        done();
                    })
                ;
            });
        });

        describe('update', function() {
            it('should compare data and update group', function(done) {
                var data = { description: 'bobs lonely crew' };

                groupModel
                    .findOne({ name: 'bobs crew' })
                    .update(data, function(err) {
                        if (err) throw err;

                        done();
                    })
                ;
            });
        });

        after('remove all groupModel documents', function(done) {
            groupModel.remove({}, function(err) {
                if (err) throw err;

                done();
            });
        });
    });

    describe('ServerModel', function() {
        after('remove all serverModel documents', function(done) {
            serverModel.remove({}, function(err) {
                if (err) throw err;

                done();
            });
        });
    });
});

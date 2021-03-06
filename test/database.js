var should = require('chai').should();

var mongoose = require('mongoose');

var
    userModel       = require('../lib/dbschema/user'),
    serverModel     = require('../lib/dbschema/server'),
    groupModel      = require('../lib/dbschema/group'),
    pluginModel     = require('../lib/dbschema/plugin'),
    permissionModel = require('../lib/dbschema/permission'),
    permCatModel    = require('../lib/dbschema/permCat')
;

describe('Database', function() {
    before('connect to test database', function(done) {
        if (mongoose.connection.db) return done();

        mongoose.connect('mongodb://localhost:27017/coyotio_mocha', done);
    });

    describe('UserModel', function() {
        describe('create', function() {
            it('should create a new user without error', function(done) {
                userModel.create({
                    username: 'bob',
                    email: 'bob@example.com',
                    password: 'notagoodpassword'
                }, function(err) {
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

                        result.username.should.be.a('string');
                        result.username.should.equal('bob');
                        result.email.should.be.a('string');
                        result.email.should.equal('bob@example.com');
                        result.role.should.be.a('number');
                        result.role.should.equal(1);

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
                    .update(data)
                    .exec(function(err) {
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

        describe('permissions', function() {
            before('set up permissions for testing', function(done) {
                permissionModel.create({
                    handle: 'fabulous',
                    name: 'to be fabulous'
                }, function(err) {
                    if (err) throw err;

                    done();
                });

                done();
            });

            it('should grant permission to user', function(done) {
                userModel
                    .findOne({ username: 'bob' })
                    .exec(function(err, result) {
                        if (err) throw err;
                        else {
                            permissionModel
                                .findOne({})
                                .exec(function(err, permission) {
                                    result
                                        .grantPermission(permission._id, function(err, result) {
                                            if (err) throw err;
                                            else done();
                                        })
                                    ;
                                })
                            ;
                        }
                    })
                ;
            });
            it('should deny permission to user', function(done) {
                var permission = 1;

                userModel
                    .findOne({ username: 'bob' })
                    .exec(function(err, result) {
                        if (err) throw err;
                        else {
                            permissionModel
                                .findOne({})
                                .exec(function(err, permission) {
                                    result
                                        .denyPermission(permission._id, function(err, result) {
                                            if (err) throw err;
                                            else done();
                                        })
                                    ;
                                })
                            ;
                        }
                    })
                ;
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

                        result.name.should.be.a('string');
                        result.name.should.equal('bobs crew');
                        result.description.should.be.a('string');
                        result.description.should.equal('the most awesome crew to ever not exist');

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
                    .update(data)
                    .exec(function(err) {
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

    describe('PluginModel', function() {
        after('remove all pluginModel documents', function(done) {
            pluginModel.remove({}, function(err) {
                if (err) throw err;

                done();
            });
        });
    });

    describe('PermissionsModel', function() {
        after('remove all permissionsModel documents', function(done) {
            permissionsModel.find({}, function(err) {
                if (err) throw err;

                done();
            });
        });
    });

    describe('PermissionsCategoryModel', function() {
        after('remove all permissionsCategoryModel documents', function(done) {
            permissionsCategoryModel.find({}, function(err) {
                if (err) throw err;

                done();
            });
        });
    });
});

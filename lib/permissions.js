var
    permCatModel = require('./dbschema/permCat'),
    permissionModel = require('./dbschema/permission')
;

function checkGroups() {
    permCatModel.findOne({ handle: 'groups' }, function(err, groups) {
        if (err) console.error(err);

        if (!groups) {
            console.warn('Groups permission category not found.  Creating...');

            permCatModel.create({
                handle: 'groups',
                name: 'Group Management',
                description: 'Permissions for managing groups'
            }, function(err, permCat) {
                if (err) console.log(err);

                if (!!permCat) {
                    permissionModel.create({
                        handle: 'create',
                        name: 'Create Groups',
                        description: 'Allows creation of groups',
                        parent: permCat._id
                    });

                    permissionModel.create({
                        handle: 'modify',
                        name: 'Modify Groups',
                        description: 'Allows modification of groups',
                        parent: permCat._id
                    });

                    permissionModel.create({
                        handle: 'delete',
                        name: 'Delete Groups',
                        description: 'Allows deletion of groups',
                        parent: permCat._id
                    });

                    permissionModel.create({
                        handle: 'permissions',
                        name: 'Group permissions',
                        description: 'Allows modification of group permissions',
                        parent: permCat._id
                    });
                }
            });
        }
    });
}

module.exports.checkCore = function() {
    checkGroups();
};

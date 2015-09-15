exports.meta = {
    name: 'Coyot.io Core',
    repository: '',
    version: '',
    owner: 'coyot.io',
    website: '',
    description: 'The core to the apple.  No touchy touchy'
};

exports.permissions = {
    'users': {
        name: 'Users Control',
        description: 'User-related administrative privileges',
        isDefault: false,
        permissions: {
            'list': {
                name: 'List users',
                description: 'Allows listing of users'
            },
            'view': {
                name: 'View users',
                description: 'Allows viewing of other users\' information'
            },
            'add': {
                name: 'Add User',
                description: 'Allows creation of new users'
            },
            'modify': {
                name: 'Modify users',
                description: 'Allows modification of other users'
            },
            'remove': {
                name: 'Remove users',
                description: 'Allows deletion of other users'
            }
        }
    },
    'groups': {
        name: 'Group Control',
        description: 'Group-related administrative privileges',
        isDefault: false,
        permissions: {
            'list': {
                name: 'List groups',
                description: 'Allows listing of groups'
            },
            'view': {
                name: 'View groups',
                description: 'Allows viewing of group information'
            },
            'add': {
                name: 'Add groups',
                description: 'Allows creation of new groups'
            },
            'modify': {
                name: 'Modify groups',
                description: 'Allows modification of groups'
            },
            'remove': {
                name: 'Remove groups',
                description: 'Allows deletion of groups'
            }
        }
    },
    'roles': {
        name: 'Role Control',
        description: 'Role-related administrative privileges',
        isDefault: false,
        permissions: {
            
        }
    },
    'permissions' : {
        name: 'Permissions Control',
        description: 'Administrative privileges for assigning permissions',
        isDefault: false,
        permissions: {

        }
    }
};

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/management/dashboard');

        $stateProvider
            .state('login', {
                templateUrl: '/pages/login',
                controller: 'LoginCtlr as controller',
                data: {
                    loginRequired: false
                }
            })
            .state('app', {
                abstract: true,
                templateUrl: '/pages/app',
                data: {
                    loginRequired: true
                }
            })
            .state('app.cluster', {
                abstract: true,
                url: '/cluster',
                template: '<div class="animated" ui-view></div>'
            })
            .state('app.cluster.manage', {
                url: '/manage',
                templateUrl: '/pages/cluster/manage',
                controller: 'ClusterCtlr as controller'
            })
            .state('app.management', {
                abstract: true,
                url: '/management',
                template: '<div class="animated" ui-view></div>'
            })
            .state('app.management.dashboard', {
                url: '/dashboard',
                templateUrl: '/pages/management/dashboard',
                controller: 'DashboardCtlr as dashboard'
            })
            .state('app.management.groups', {
                abstract: true,
                url: '/groups',
                template: '<div class="animated" ui-view></div>'
            })
            .state('app.management.groups.add', {
                url: '/add',
                templateUrl: '/pages/management/groups/add',
                controller: 'GroupAddCtlr as controller'
            })
            .state('app.management.groups.edit', {
                url: '/:group/edit',
                templateUrl: '/pages/management/groups/edit',
                controller: 'GroupEditCtlr as contoller'
            })
            .state('app.management.groups.view', {
                url: '/:group/',
                templateUrl: '/pages/management/groups/view',
                controller: 'GroupViewCtlr as controller'
            })
            .state('app.management.groups.index', {
                url: '',
                templateUrl: '/pages/management/groups',
                controller: 'GroupListCtlr as controller'
            })
            .state('app.management.users', {
                abstract: true,
                url: '/users',
                template: '<div class="animated" ui-view></div>'
            })
            .state('app.management.users.add', {
                url: '/add',
                templateUrl: '/pages/management/users/add',
                controller: 'UserAddCtlr',
                controllerAs: 'local'
            })
            .state('app.management.users.edit', {
                url: '/:user/edit',
                templateUrl: '/pages/management/users/edit',
                controller: 'UserEditCtlr as controller'
            })
            .state('app.management.users.view', {
                url: '/:user/',
                templateUrl: '/pages/management/users/view',
                controller: 'UserViewCtlr as controller'
            })
            .state('app.management.users.index', {
                url: '',
                templateUrl: '/pages/management/users',
                controller: 'UserListCtlr as controller'
            })
            .state('app.server', {
                abstract: true,
                url: '/server/:hostname',
                template: '<div class="animated" ui-view></div>'
            })
            .state('app.server.view', {
                url: '/overview',
                templateUrl: '/pages/server/overview',
                controller: 'ServerCtlr as controller'
            })
            .state('app.server.packages', {
                abstract: true,
                url: '/packages',
                template: '<div class="animated" ui-view></div>'
            })
            .state('app.server.packages.install', {
                url: '/install',
                templateUrl: '/pages/server/packages/install',
                controller: 'PackageInstallCtlr as controller'
            })
            .state('app.server.packages.update', {
                url: '/update',
                templateUrl: '/pages/server/packages/update',
                controller: 'PackageUpdateCtlr as controller'
            })
            .state('app.server.packages.index', {
                url: '',
                templateUrl: '/pages/server/packages',
                controller: 'PackageListCtlr as controller'
            })
            .state('app.server.packages.view', {
                url: '/:pkg',
                templateUrl: '/pages/server/packages/view',
                controller: 'PackageCtlr as controller'
            })
            .state('app.server.services', {
                abstract: true,
                url: '/services',
                template: '<div class="animated" ui-view></div>'
            })
            .state('app.server.services.index', {
                url: '',
                templateUrl: '/pages/server/services',
                controller: 'ServiceListCtlr as controller'
            })
            .state('app.server.services.view', {
                url: '/:service/',
                templateUrl: '/pages/server/services/view',
                controller: 'ServiceCtlr as controller'
            })
        ;

        $locationProvider.html5Mode(true);
    }
]);

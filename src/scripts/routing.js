app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/cluster/manage', {
            templateUrl: 'pages/cluster/manage',
            controller: 'ClusterCtlr',
            controllerAs: 'local'
        })
        .when('/management/dashboard', {
            templateUrl: 'pages/management/dashboard',
            controller: 'DashboardCtlr',
            controllerAs: 'local'
        })
        .when('/management/users', {
            templateUrl: 'pages/management/users',
            controller: 'UserListCtlr',
            controllerAs: 'local'
        })
        .when('/server/:hostname/overview', {
            templateUrl: 'pages/server/overview',
            controller: 'ServerCtlr',
            controllerAs: 'local'
        })
        .when('/server/:hostname/packages/install', {
            templateUrl: 'pages/server/packages/install',
            controller: 'PackageInstallCtlr',
            controllerAs: 'local'
        })
        .when('/server/:hostname/packages/update', {
            templateUrl: 'pages/server/packages/update',
            controller: 'PackageUpdateCtlr',
            controllerAs: 'local'
        })
        .when('/server/:hostname/packages', {
            templateUrl: 'pages/server/packages',
            controller: 'PackageListCtlr',
            controllerAs: 'local'
        })
        .when('/server/:hostname/package/:pkg/', {
            templateUrl: 'pages/server/packages/view',
            controller: 'PackageCtlr',
            controllerAs: 'local'
        })
        .when('/server/:hostname/services', {
            templateUrl: 'pages/server/services',
            controller: 'ServiceListCtlr',
            controllerAs: 'local'
        })
        .when('/server/:hostname/service/:service/', {
            templateUrl: 'pages/server/services/view',
            controller: 'ServiceCtlr',
            controllerAs: 'local'
        })
        .otherwise({
            redirectTo: 'management/dashboard'
        })
    ;

    $locationProvider.html5Mode(true);
}]);

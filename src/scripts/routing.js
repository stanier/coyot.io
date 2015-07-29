app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/cluster/manage', {
            templateUrl: 'pages/cluster/manage',
            controller: 'ClusterCtlr'
        })
        .when('/management/dashboard', {
            templateUrl: 'pages/management/dashboard',
            controller: 'ManagementCtlr'
        })
        .when('/management/users', {
            templateUrl: 'pages/management/users',
            controller: 'ManagementCtlr'
        })
        .when('/server/:hostname/overview', {
            templateUrl: 'pages/server/overview',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/packages/install', {
            templateUrl: 'pages/server/packages/install',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/packages/update', {
            templateUrl: 'pages/server/packages/update',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/packages', {
            templateUrl: 'pages/server/packages',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/package/:pkg/', {
            templateUrl: 'pages/server/packages/view',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/services', {
            templateUrl: 'pages/server/services',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/service/:service/', {
            templateUrl: 'pages/server/services/view',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/processes', {
            templateUrl: 'pages/server/processes',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
        .when('/server/:hostname/process/:process', {
            templateUrl: 'pages/server/processes/view',
            controller: 'ServerCtlr',
            reloadOnSearch: false
        })
<<<<<<< HEAD
        .otherwise({
            redirectTo: 'management/dashboard'
        })
=======
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
    ;

    $locationProvider.html5Mode(true);
}]);

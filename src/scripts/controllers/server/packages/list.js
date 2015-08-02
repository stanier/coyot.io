app.controller('PackageListCtlr', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$http',
    'ServerFactory',
    function($scope, $rootScope, $routeParams, $http, ServerFactory) {
        $scope.$on('serverInfoReady', function() {
            $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/list')
                .success(function(data, status, headers, config) {
                    $scope.pkgs = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.pkgs = data;
                })
            ;
        });
    }
]);

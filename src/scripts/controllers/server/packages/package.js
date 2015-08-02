app.controller('PackageCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    '$routeParams',
    function($scope, $rootScope, $http, $routeParams) {
        $scope.$on('serverInfoReady', function() {
            $http.get('//' + $rootScope.server.host + ':' +
                $rootScope.server.port + '/api/worker/packages/getInfo/' +
                $routeParams.pkg
            )
                .success(function(data, status, headers, config) {
                    $scope.pkg = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.pkg = data;
                })
            ;
        });
    }
]);

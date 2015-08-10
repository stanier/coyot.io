app.controller('PackageCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    '$stateParams',
    function($scope, $rootScope, $http, $stateParams) {
        $scope.$on('serverInfoReady', function() {
            $http.get('//' + $rootScope.server.host + ':' +
                $rootScope.server.port + '/api/worker/packages/getInfo/' +
                $stateParams.pkg
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

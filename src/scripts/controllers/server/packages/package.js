app.controller('PackageCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    function($scope, $rootScope, $http) {
        $scope.getPkgInfo = function(pkg) {
            $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/getInfo/' + pkg)
                .success(function(data, status, headers, config) {
                    $scope.pkg = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.pkg = data;
                })
            ;
        };
    }
]);

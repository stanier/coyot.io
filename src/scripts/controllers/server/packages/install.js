app.controller('PackageInstallCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    function($scope, $rootScope, $http) {
        $scope.installPkg = function() {
            socket.emit('install package', {
                manager: $scope.pkgMngr,
                pkg: $scope.pkgInstallQuery
            });
        };

        $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/listManagers')
            .success(function(data, status, headers, config) {
                $scope.managers = data;
            })
            .error(function(data, status, headers, config) {
                $scope.managers = data;
            })
        ;
    }
]);

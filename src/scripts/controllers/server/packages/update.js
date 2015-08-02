app.controller('PackageUpdateCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    function($rootScope, $http) {
        $scope.updatePkg = function() {
            socket.emit('update package', {
                manager: $scope.pkgMngr,
                pkg: $scope.pkgUpdateQuery
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

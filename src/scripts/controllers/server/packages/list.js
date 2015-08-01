app.controller('PackageListCtlr', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$http',
    function($scope, $rootScope, $routeParams, $http) {
        function init(callback) {
            if (!$rootScope.server) {
                $http.get('/api/server/' + $routeParams.hostname + '/')
                    .success(function(data, status, headers, config) {
                        $rootScope.server = data;
                        callback();
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                    })
                ;
            } else {
                callback();
            }
        }

        $scope.getPkgs = function() {
            $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/list')
                .success(function(data, status, headers, config) {
                    $scope.pkgs = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.$apply(function() {
                        $scope.pkgs = data;
                    });
                })
            ;
        };
    }
]);

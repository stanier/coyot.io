app.controller('PackageListCtlr', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$http',
    'ServerFactory',
    function($scope, $rootScope, $routeParams, $http, ServerFactory) {
        $scope.pkgs = [];

        $scope.getPkgs = function() {
            $scope.$on('serverInfoReady', function() {
                $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/list')
                    .success(function(data, status, headers, config) {
                        $scope.$apply(function() {
                            for (var i in data) $scope.pkgs.push(data[i]);
                        });
                    })
                    .error(function(data, status, headers, config) {
                        $scope.$apply(function() {
                            $scope.pkgs = data;
                        });
                    })
                ;
            });
        };
    }
]);

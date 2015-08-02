app.controller('PackageListCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    function($scope, $rootScope, $http) {
        $scope.currentPage = 0;
        $scope.pageSize = 20;

        $scope.pkgs = [];

        $scope.getPkgs = function() {
            $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port + '/api/worker/packages/list')
                .success(function(data, status, headers, config) {
                    $scope.pkgs = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.pkgs = data;
                })
            ;
        };

        if (!!$rootScope.server) {
            $scope.getPkgs();
        } else {
            $scope.$on('serverInfoReady', function () {
                $scope.getPkgs();
            });
        }
    }
]);

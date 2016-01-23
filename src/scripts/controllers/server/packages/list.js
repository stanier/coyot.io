app.controller('PackageListCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    function($scope, $rootScope, $http) {
        $scope.query = {
            order: 'name',
            limit: 15,
            page: 0
        };

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

        $scope.onPaginate = function() {

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

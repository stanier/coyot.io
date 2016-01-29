app.controller('PackageListCtlr', [
    '$scope',
    '$rootScope',
    '$http',
    function($scope, $rootScope, $http) {
        $scope.query = {
            order: 'name',
            limit: 15,
            page: 1
        };

        $scope.pkgs = [];
        $scope.pkgCount = 1;

        $scope.getPkgs = function() {
            $http.get('//' + $rootScope.server.host + ':' + $rootScope.server.port +
                    '/api/worker/packages/list?offset=' + ($scope.query.limit * ($scope.query.page - 1)) +
                    '&max=' + $scope.query.limit)
                .success(function(data, status, headers, config) {
                    $scope.pkgs = data.list;
                    $scope.pkgCount = data.count;
                })
                .error(function(data, status, headers, config) {
                    $scope.pkgs = data.list;
                    $scope.pkgCount = data.count;
                })
            ;
        };

        $scope.flip = function() {
            console.log('fuck');
            //$scope.query.limit = limit;
            //$scope.query.page = page;

            console.log('bitch');

            $scope.getPkgs();
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

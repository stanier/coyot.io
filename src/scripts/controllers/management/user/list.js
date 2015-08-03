app.controller('UserListCtlr', [
    '$scope',
    '$http',
    function($scope, $http) {
        $scope.pageSize    = 20;
        $scope.currentPage = 0;

        $http.get('/api/management/users')
            .success(function(data, status, headers, config) {
                $scope.users = data;
            })
            .error(function(data, status, headers, config) {
                $scope.users = data;
            })
        ;
    }
]);

app.controller('UserViewCtlr', [
    '$scope',
    '$http',
    '$routeParams',
    function($scope, $http, $routeParams) {
        $http.get('/api/management/users/' + $routeParams.user)
            .success(function(data, status, headers, config) {
                $scope.username = data.username;
                $scope.email = data.email;
                $scope.role = data.role;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;
    }
]);

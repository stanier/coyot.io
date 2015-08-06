app.controller('UserEditCtlr', [
    '$scope',
    '$http',
    '$routeParams',
    function($scope, $http, $routeParams) {
        $http.get('/api/management/users/' + $routeParams.user)
            .success(function(data, status, headers, config) {
                $scope.carbon = data;

                $scope.username = data.username;
                $scope.email = data.email;
                $scope.role = data.role;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;

        $scope.update = function() {
            var changed = {};

            if ($scope.username !== $scope.carbon.username) changed.username = $scope.username;
            if ($scope.email !== $scope.carbon.email) changed.email = $scope.email;
            if ($scope.role !== $scope.carbon.role) changed.role = $scope.role;

            $http.put('/api/management/users/' + $routeParams.user, changed)
                .success(function(data, status, headers, config) {
                    toastr.success('User updated successfully');
                })
                .error(function(data, status, headers, config) {
                    toastr.error(data);
                })
            ;
        };
    }
]);

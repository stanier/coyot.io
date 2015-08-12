app.controller('UserViewCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
        $http.get('/api/management/users/' + $stateParams.user)
            .success(function(data, status, headers, config) {
                $scope.user = data;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;
    }
]);

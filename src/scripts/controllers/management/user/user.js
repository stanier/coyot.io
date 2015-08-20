app.controller('UserViewCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
        $http.get('/api/management/users/' + $stateParams.user)
            .success(function(data, status, headers, config) {
                if (data.success) $scope.user = data.result;
                else toastr.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;
    }
]);

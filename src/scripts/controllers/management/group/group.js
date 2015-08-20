app.controller('GroupViewCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
        $http.get('/api/management/groups/' + $stateParams.group)
            .success(function(data, status, headers, config) {
                if (data.success) $scope.group = data.result;
                else toastr.error(data.error);
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;
    }
]);

app.controller('GroupViewCtlr', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
        $http.get('/api/management/groups/' + $stateParams.group)
            .success(function(data, status, headers, config) {
                $scope.group = data;
            })
            .error(function(data, status, headers, config) {
                toastr.error(data);
            })
        ;
    }
]);
